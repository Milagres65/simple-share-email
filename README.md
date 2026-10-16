# Simple Share

Simple Share is a lightweight Chrome extension for sharing a web page by email using Gmail or Thunderbird. It is designed for a simple local workflow and does not use any backend, external libraries, or tracking services.

## Features

- Compact toolbar button and popup
- Share via Gmail
- Share via Thunderbird
- Copy URL to clipboard
- Context menu actions for:
  - the current page
  - a link
  - selected text
- Local icon assets only
- No external scripts or analytics

## Privacy and security

This project uses only the minimal Chrome permissions needed for the feature set:

- activeTab
- contextMenus

No browsing data is stored, no backend is used, and no data is sent to external services.

See [SECURITY.md](SECURITY.md) for details.

## Project structure

- manifest.json — Chrome extension manifest
- background.js — context menu logic
- popup.html — popup layout
- popup.css — compact styling
- popup.js — share logic and URL preparation
- icons/ — local SVG and PNG assets
- SECURITY.md — security and permission notes

## Installation

1. Open Chrome.
2. Go to chrome://extensions.
3. Enable Developer Mode.
4. Click Load unpacked.
5. Select this project folder.
6. Pin the extension to the toolbar if desired.

## Usage

- Click the Simple Share icon in the toolbar.
- Choose Gmail, Thunderbird, or Copy Link.
- Right-click on a page, link, or selected text to use context menu actions.
- Review the email draft and send it manually.

## Notes

- The extension opens Gmail or the default mail handler only when the user chooses an action.
- It never sends email automatically.
- The user must review and send each message manually.

## License

This project is intended for private local use and does not require a Chrome Web Store listing or paid services.
