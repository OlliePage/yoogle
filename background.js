// Handle YouTube navigation via History API (SPA navigation)
chrome.webNavigation.onHistoryStateUpdated.addListener(
  (details) => {
    if (details.url.match(/https:\/\/(www\.)?youtube\.com\/?$/)) {
      console.log('YouTube Minimalist: YouTube homepage detected via navigation');
      chrome.tabs.sendMessage(details.tabId, { action: 'applyMinimalist' });
    }
  },
  { url: [{ hostSuffix: 'youtube.com' }] }
);

// Handle direct URL navigations and initial page loads
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url && tab.url.match(/https:\/\/(www\.)?youtube\.com\/?$/)) {
    // Send immediately on any update, not just when complete
    // This helps catch the page earlier in the loading process
    console.log('YouTube Minimalist: YouTube homepage detected via tab update', changeInfo.status);
    chrome.tabs.sendMessage(tabId, { action: 'applyMinimalist' });
  }
});

// Listen for tab activation (switching to a YouTube tab)
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    if (tab.url && tab.url.match(/https:\/\/(www\.)?youtube\.com\/?$/)) {
      console.log('YouTube Minimalist: YouTube homepage detected via tab activation');
      chrome.tabs.sendMessage(activeInfo.tabId, { action: 'applyMinimalist' });
    }
  } catch (error) {
    console.error('YouTube Minimalist: Error in tab activation handler', error);
  }
});