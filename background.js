chrome.webNavigation.onHistoryStateUpdated.addListener(
  (details) => {
    if (details.url.match(/https:\/\/(www\.)?youtube\.com\/?$/)) {
      console.log('YouTube Minimalist: YouTube homepage detected via navigation');
      chrome.tabs.sendMessage(details.tabId, { action: 'applyMinimalist' });
    }
  },
  { url: [{ hostSuffix: 'youtube.com' }] }
);

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && tab.url.match(/https:\/\/(www\.)?youtube\.com\/?$/)) {
    console.log('YouTube Minimalist: YouTube homepage detected via tab update');
    chrome.tabs.sendMessage(tabId, { action: 'applyMinimalist' });
  }
});