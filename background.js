// Background service worker
chrome.runtime.onInstalled.addListener(() => {
  console.log('ScrapyMark extension installed');
});

// Listen for messages from content scripts and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Forward messages between content script and popup
  if (message.action === 'updateConfig') {
    // Broadcast to all tabs
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, message).catch(() => {
          // Ignore errors for tabs that don't have the content script
        });
      });
    });
  }
  
  return true;
});
