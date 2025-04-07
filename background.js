// Helper to check if URL is YouTube homepage
const isYouTubeHomepage = (url) => {
  return url && url.match(/https:\/\/(www\.)?youtube\.com\/?$/);
};

// Toggle minimalist mode state
const toggleMinimalistMode = async (tabId) => {
  try {
    // Get current state from storage
    const storage = await chrome.storage.local.get('minimalistDisabled');
    const currentlyDisabled = storage.minimalistDisabled === true;
    
    // Toggle state
    await chrome.storage.local.set({ minimalistDisabled: !currentlyDisabled });
    console.log('YouTube Minimalist: Mode toggled to', currentlyDisabled ? 'enabled' : 'disabled');
    
    // Tell content script to apply or remove minimalist mode
    chrome.tabs.sendMessage(tabId, { 
      action: 'toggleMinimalist', 
      enabled: currentlyDisabled // enabling if it was disabled
    });
    
    // Update icon as a visual indicator
    await updateIcon(!currentlyDisabled);
    
    // Reload the YouTube tab if it's on the homepage
    const tab = await chrome.tabs.get(tabId);
    if (isYouTubeHomepage(tab.url)) {
      chrome.tabs.reload(tabId);
    }
  } catch (error) {
    console.error('YouTube Minimalist: Error toggling mode', error);
  }
};

// Update the extension icon based on state
const updateIcon = async (disabled) => {
  const iconPath = disabled ? 
    { 16: 'icon24-disabled.png', 24: 'icon24-disabled.png', 32: 'icon48-disabled.png' } :
    { 16: 'icon24.png', 24: 'icon24.png', 32: 'icon48.png' };
  
  // If disabled icons don't exist, just use the regular ones
  try {
    await chrome.action.setIcon({ path: iconPath });
    chrome.action.setTitle({ title: disabled ? 'Enable Yoogle Mode' : 'Disable Yoogle Mode' });
  } catch (error) {
    console.error('YouTube Minimalist: Failed to set icon', error);
  }
};

// Initialize icon based on stored state
chrome.storage.local.get('minimalistDisabled', (result) => {
  updateIcon(result.minimalistDisabled === true);
});

// Handle browser action (toolbar icon) click
chrome.action.onClicked.addListener(async (tab) => {
  if (tab.url && tab.url.includes('youtube.com')) {
    await toggleMinimalistMode(tab.id);
  }
});

// Handle YouTube navigation via History API (SPA navigation)
chrome.webNavigation.onHistoryStateUpdated.addListener(
  (details) => {
    if (isYouTubeHomepage(details.url)) {
      console.log('YouTube Minimalist: YouTube homepage detected via navigation');
      // Check if minimalist mode is enabled before applying
      chrome.storage.local.get('minimalistDisabled', (result) => {
        if (result.minimalistDisabled !== true) {
          chrome.tabs.sendMessage(details.tabId, { action: 'applyMinimalist' });
        }
      });
    }
  },
  { url: [{ hostSuffix: 'youtube.com' }] }
);

// Handle direct URL navigations and initial page loads
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (isYouTubeHomepage(tab.url)) {
    console.log('YouTube Minimalist: YouTube homepage detected via tab update', changeInfo.status);
    // Check if minimalist mode is enabled before applying
    chrome.storage.local.get('minimalistDisabled', (result) => {
      if (result.minimalistDisabled !== true) {
        chrome.tabs.sendMessage(tabId, { action: 'applyMinimalist' });
      }
    });
  }
});

// Listen for tab activation (switching to a YouTube tab)
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    if (isYouTubeHomepage(tab.url)) {
      console.log('YouTube Minimalist: YouTube homepage detected via tab activation');
      // Check if minimalist mode is enabled before applying
      chrome.storage.local.get('minimalistDisabled', (result) => {
        if (result.minimalistDisabled !== true) {
          chrome.tabs.sendMessage(activeInfo.tabId, { action: 'applyMinimalist' });
        }
      });
    }
  } catch (error) {
    console.error('YouTube Minimalist: Error in tab activation handler', error);
  }
});