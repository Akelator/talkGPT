chrome?.runtime?.onMessage.addListener(async (message) => {
  if (message.type === "extension") sendMessage("submit", message.text);
  if (message.type === "icon") setIcon(message.text);
  if (message.type === "ask-location") sendMessage("ask-location", message.text);
});

function setIcon(icon) {
  chrome.action.setIcon({ path: { 128: `assets/icon${icon}.png` } });
}

function sendMessage(type, text) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs?.length) {
      tab = tabs[0];
      const isChat = tab.url?.includes("chat.openai.com");
      if (type === "extension" && !isChat) return;
      chrome.tabs.sendMessage(tabs[0].id, { type, text });
    }
  });
}
