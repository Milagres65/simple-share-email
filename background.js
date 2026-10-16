const URL_PATTERNS = ["http://*/*", "https://*/*"];

function normalizeText(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function truncateText(value, maxLength = 160) {
  const text = normalizeText(value) || "Unbekannter Titel";
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength - 1).trimEnd()}…`;
}

function buildEmailData(data) {
  const pageTitle = truncateText(data.title || "Unbekannte Seite", 120);
  const pageUrl = normalizeText(data.url || "");
  const selectedText = normalizeText(data.selection || "");

  const bodyLines = [pageTitle, pageUrl];
  if (selectedText) {
    bodyLines.push("", "Markierter Text", selectedText);
  }

  return {
    subject: pageTitle,
    body: bodyLines.join("\n")
  };
}

function buildMailUrl(subject, body, target = "gmail") {
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);

  if (target === "gmail") {
    return `https://mail.google.com/mail/?view=cm&fs=1&to=&su=${encodedSubject}&body=${encodedBody}`;
  }

  return `mailto:?subject=${encodedSubject}&body=${encodedBody}`;
}

function openGmail(data) {
  const emailData = buildEmailData(data);
  chrome.tabs.create({ url: buildMailUrl(emailData.subject, emailData.body, "gmail"), active: true });
}

function openThunderbird(data) {
  const emailData = buildEmailData(data);
  chrome.tabs.create({ url: buildMailUrl(emailData.subject, emailData.body, "mailto"), active: true });
}

function buildDataFromContext(info, tab) {
  const pageUrl = info.pageUrl || tab?.url || "";
  const linkUrl = info.linkUrl || pageUrl;
  const selectionText = typeof info.selectionText === "string" ? info.selectionText.trim() : "";

  if (info.linkUrl) {
    return {
      title: tab?.title || "Link",
      url: linkUrl,
      selection: ""
    };
  }

  if (selectionText) {
    return {
      title: tab?.title || "Markierter Text",
      url: pageUrl,
      selection: selectionText
    };
  }

  return {
    title: tab?.title || "Unbekannte Seite",
    url: pageUrl,
    selection: ""
  };
}

function registerMenu(parentId, title, contexts, itemId, label) {
  chrome.contextMenus.create({
    id: itemId,
    parentId,
    title: label,
    contexts,
    documentUrlPatterns: URL_PATTERNS
  });
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "share-page",
    title: "Seite per E-Mail teilen",
    contexts: ["page"],
    documentUrlPatterns: URL_PATTERNS
  });
  registerMenu("share-page", "Seite per E-Mail teilen", ["page"], "share-page-gmail", "Mit Gmail teilen");
  registerMenu("share-page", "Seite per E-Mail teilen", ["page"], "share-page-thunderbird", "Mit Thunderbird teilen");

  chrome.contextMenus.create({
    id: "share-link",
    title: "Diesen Link per E-Mail teilen",
    contexts: ["link"],
    targetUrlPatterns: URL_PATTERNS
  });
  registerMenu("share-link", "Diesen Link per E-Mail teilen", ["link"], "share-link-gmail", "Mit Gmail teilen");
  registerMenu("share-link", "Diesen Link per E-Mail teilen", ["link"], "share-link-thunderbird", "Mit Thunderbird teilen");

  chrome.contextMenus.create({
    id: "share-selection",
    title: "Markierten Text per E-Mail teilen",
    contexts: ["selection"],
    documentUrlPatterns: URL_PATTERNS
  });
  registerMenu("share-selection", "Markierten Text per E-Mail teilen", ["selection"], "share-selection-gmail", "Mit Gmail teilen");
  registerMenu("share-selection", "Markierten Text per E-Mail teilen", ["selection"], "share-selection-thunderbird", "Mit Thunderbird teilen");
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (!tab) {
    return;
  }

  const menuItemId = String(info.menuItemId);
  const payload = buildDataFromContext(info, tab);

  if (menuItemId.endsWith("-gmail")) {
    openGmail(payload);
    return;
  }

  if (menuItemId.endsWith("-thunderbird")) {
    openThunderbird(payload);
  }
});
