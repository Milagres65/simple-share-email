const MAX_EMAIL_LENGTH = 1500;

function normalizeText(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function truncateText(value, maxLength = 180) {
  const text = normalizeText(value) || "Unbekannter Titel";
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength - 1).trimEnd()}…`;
}

function parseContextFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return {
    mode: params.get("mode") || "page",
    title: params.get("title") || "",
    url: params.get("url") || "",
    selection: params.get("selection") || ""
  };
}

function getPreparedEmailData(context, forceCompact = false) {
  const pageTitle = truncateText(context.title || "Unbekannte Seite", 160);
  const pageUrl = normalizeText(context.url || "");
  const selectedText = normalizeText(context.selection || "");

  const subject = pageTitle;
  const bodyLines = [pageTitle, pageUrl];

  if (selectedText) {
    bodyLines.push("", "Markierter Text", selectedText);
  }

  const body = bodyLines.join("\n");
  const combinedLength = subject.length + body.length;

  if (forceCompact || combinedLength > MAX_EMAIL_LENGTH) {
    const compactTitle = truncateText(pageTitle, 120);
    const compactBody = [compactTitle, pageUrl].join("\n");

    return {
      subject: compactTitle,
      body: compactBody,
      tooLong: true,
      message: "Der Inhalt war zu lang. Nur Titel und Link werden geteilt."
    };
  }

  return {
    subject,
    body,
    tooLong: false,
    message: ""
  };
}

function toMailUrl(subject, body, target = "gmail") {
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);

  if (target === "gmail") {
    return `https://mail.google.com/mail/?view=cm&fs=1&to=&su=${encodedSubject}&body=${encodedBody}`;
  }

  return `mailto:?subject=${encodedSubject}&body=${encodedBody}`;
}

function setStatus(message, isError = false) {
  const statusNode = document.getElementById("status");
  statusNode.textContent = message;
  statusNode.classList.toggle("error", isError);
}

function updateSummary(context) {
  const titleNode = document.getElementById("pageTitle");
  const urlNode = document.getElementById("pageUrl");
  const sourceLabel = document.getElementById("sourceLabel");

  titleNode.textContent = truncateText(context.title || "Unbekannter Titel", 180);
  urlNode.textContent = normalizeText(context.url) || "Keine URL verfügbar";

  if (context.mode === "link") {
    sourceLabel.textContent = "Ziel-Link";
  } else if (context.mode === "selection") {
    sourceLabel.textContent = "Markierter Text";
  } else {
    sourceLabel.textContent = "Aktuelle Seite";
  }

  const hasValidUrl = /^https?:\/\//i.test(normalizeText(context.url || ""));
  const buttons = [
    document.getElementById("gmailBtn"),
    document.getElementById("thunderbirdBtn"),
    document.getElementById("copyBtn")
  ];

  buttons.forEach((button) => {
    button.disabled = !hasValidUrl;
  });

  if (!hasValidUrl) {
    setStatus("Diese Seite kann nicht per E-Mail geteilt werden. Bitte nutzen Sie eine normale Webseite.", true);
  }
}

async function loadActiveTabContext() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return {
    mode: "page",
    title: tab?.title || "",
    url: tab?.url || "",
    selection: ""
  };
}

async function openGmail(context) {
  const content = getPreparedEmailData(context);
  if (content.tooLong) {
    setStatus(content.message);
  }

  const gmailUrl = toMailUrl(content.subject, content.body, "gmail");
  chrome.tabs.create({ url: gmailUrl, active: true });
}

async function openThunderbird(context) {
  const content = getPreparedEmailData(context);
  if (content.tooLong) {
    setStatus(content.message);
  }

  const mailtoUrl = toMailUrl(content.subject, content.body, "mailto");
  chrome.tabs.create({ url: mailtoUrl, active: true });
}

async function copyLink(context) {
  const urlToCopy = normalizeText(context.url || "");

  if (!urlToCopy) {
    setStatus("Es gibt keinen Link zum Kopieren.", true);
    return;
  }

  try {
    await navigator.clipboard.writeText(urlToCopy);
    setStatus("Link wurde kopiert.");
    return;
  } catch (error) {
    try {
      const helper = document.createElement("textarea");
      helper.value = urlToCopy;
      helper.setAttribute("readonly", "");
      helper.style.position = "fixed";
      helper.style.top = "-9999px";
      document.body.appendChild(helper);
      helper.select();
      document.execCommand("copy");
      document.body.removeChild(helper);
      setStatus("Link wurde kopiert.");
      return;
    } catch (copyError) {
      setStatus("Der Link konnte nicht kopiert werden. Bitte kopieren Sie ihn manuell.", true);
    }
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const urlContext = parseContextFromUrl();
  const context = urlContext.url || urlContext.title || urlContext.selection
    ? urlContext
    : await loadActiveTabContext();

  updateSummary(context);

  document.getElementById("gmailBtn").addEventListener("click", () => openGmail(context));
  document.getElementById("thunderbirdBtn").addEventListener("click", () => openThunderbird(context));
  document.getElementById("copyBtn").addEventListener("click", () => copyLink(context));
});
