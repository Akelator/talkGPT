function generateVoice(text) {
  chrome.runtime.sendMessage({ type: "voice", text });
}

function awaitChatToStopTalking() {
  const interval = setInterval(() => {
    if (!chatIsTalking()) {
      clearInterval(interval);
      const responses = document.querySelectorAll("div.group .markdown");
      if (!responses) return;
      const last = responses[responses.length - 1];
      const text = last?.innerText;
      generateVoice(text);
    }
  }, 500);
}

function awaitChatToStartTalking() {
  const interval = setInterval(() => {
    if (chatIsTalking()) {
      clearInterval(interval);
      awaitChatToStopTalking();
    }
  }, 100);
}

function submitMessage(message) {
  const textarea = document.querySelector("textarea");
  textarea.value = message;
  const button = document.querySelector("button.absolute");
  button.removeAttribute("disabled");
  setTimeout(() => button.click());
  awaitChatToStopTalking();
}

function chatIsTalking() {
  return !!document.querySelector("div.result-streaming");
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "submit") {
    if (!chatIsTalking()) submitMessage(message.text);
  }
  if (message.type === "ask-location") {
    const isChat = location.hostname === "chat.openai.com";
    chrome.runtime.sendMessage({ type: "is-chat", text: isChat });
  }
});
