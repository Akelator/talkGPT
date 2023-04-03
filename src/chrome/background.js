chrome?.runtime?.onMessage.addListener(async (message) => {
  console.debug("MESSAGE");
  console.log(message);
  if (message.sender === "extension")
    sendMessageToContentScript("submit", message.text);
  if (message.sender === "icon") setIcon(message.text);
  if (message.sender === "ask-location")
    sendMessageToContentScript("ask-location", message.text);
});

function setIcon(icon) {
  chrome.action.setIcon({ path: { 128: `assets/icon${icon}.png` } });
}

function sendMessageToContentScript(type, text) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs?.length) {
      tab = tabs[0];
      const isChat = tab.url?.includes("chat.openai.com");
      if (type === "extension" && !isChat) return;
      chrome.tabs.sendMessage(tabs[0].id, { type, text });
    }
  });
}
