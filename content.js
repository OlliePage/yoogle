(function() {
  console.log('YouTube Minimalist: Content script loaded');

  // Check if we're on the homepage
  const isYouTubeHomepage = () => {
    return window.location.pathname === '/' && 
           (window.location.hostname === 'www.youtube.com' || 
            window.location.hostname === 'youtube.com');
  };

  // Add a style to hide YouTube content immediately while our interface loads
  // but ONLY on the YouTube homepage
  if (isYouTubeHomepage()) {
    const hideYouTubeStyle = document.createElement('style');
    hideYouTubeStyle.id = 'youtube-minimalist-hide-style';
    hideYouTubeStyle.textContent = `
      html, body {
        visibility: hidden !important;
        opacity: 0 !important;
        transition: opacity 0.2s ease !important;
      }
      
      body.minimalist-ready, html.minimalist-ready {
        visibility: visible !important;
        opacity: 1 !important;
      }
    `;
    
    // Add the style as early as possible
    if (document.documentElement) {
      document.documentElement.appendChild(hideYouTubeStyle);
    } else {
      // If document not ready, add as soon as it is
      const observer = new MutationObserver(() => {
        if (document.documentElement) {
          document.documentElement.appendChild(hideYouTubeStyle);
          observer.disconnect();
        }
      });
      observer.observe(document, { childList: true, subtree: true });
    }
  }

  // Get dark mode preference from localStorage or YouTube's existing preference
  const isDarkMode = () => {
    const storedPreference = localStorage.getItem('youtube-minimalist-dark-mode');
    if (storedPreference !== null) {
      return storedPreference === 'true';
    }
    
    // Try to detect YouTube's native dark mode
    const ytDarkMode = document.documentElement.getAttribute('dark') === 'true' || 
                       document.documentElement.getAttribute('theme') === 'dark' ||
                       document.querySelector('html')?.classList.contains('dark');
    
    return ytDarkMode || window.matchMedia('(prefers-color-scheme: dark)').matches;
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    const darkModeEnabled = !isDarkMode();
    localStorage.setItem('youtube-minimalist-dark-mode', darkModeEnabled.toString());
    applyTheme(darkModeEnabled);
    return darkModeEnabled;
  };

  // Apply theme based on dark mode setting
  const applyTheme = (darkMode) => {
    const container = document.getElementById('minimalist-youtube-container');
    if (!container) return;
    
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  // Check if the interface is disabled
  const isMinimalistDisabled = async () => {
    return new Promise(resolve => {
      chrome.storage.local.get('minimalistDisabled', (result) => {
        // First check Chrome storage
        if (result.minimalistDisabled === true) {
          console.log('YouTube Minimalist: Disabled via extension storage');
          resolve(true);
          return;
        }
        
        // Then check localStorage (for backwards compatibility)
        if (localStorage.getItem('youtube-minimalist-disabled') === 'true') {
          console.log('YouTube Minimalist: Disabled by user preference in localStorage');
          // Also update Chrome storage to match
          chrome.storage.local.set({ minimalistDisabled: true });
          resolve(true);
          return;
        }
        
        resolve(false);
      });
    });
  };

  // Create our minimalist interface
  const createMinimalistInterface = async () => {
    // Only apply on the homepage
    if (!isYouTubeHomepage()) {
      console.log('YouTube Minimalist: Not on homepage, skipping');
      if (document.getElementById('youtube-minimalist-hide-style')) {
        document.getElementById('youtube-minimalist-hide-style').remove();
        document.documentElement.classList.add('minimalist-ready');
        document.body.classList.add('minimalist-ready');
      }
      return;
    }

    console.log('YouTube Minimalist: Creating interface');

    // Don't reapply if our interface is already active
    if (document.getElementById('minimalist-youtube-container')) {
      console.log('YouTube Minimalist: Interface already applied');
      return;
    }

    // Check if user has disabled the minimalist interface
    if (await isMinimalistDisabled()) {
      if (document.getElementById('youtube-minimalist-hide-style')) {
        document.getElementById('youtube-minimalist-hide-style').remove();
        document.documentElement.classList.add('minimalist-ready');
        document.body.classList.add('minimalist-ready');
      }
      return;
    }

    // Get dark mode setting
    const darkMode = isDarkMode();

    // Preload local YouTube logo SVG for faster display
    const preloadLogo = new Image();
    preloadLogo.src = chrome.runtime.getURL('youtube.svg');

    // Clear existing content
    document.body.innerHTML = '';
    document.body.style.backgroundColor = darkMode ? '#212121' : 'white';
    if (darkMode) {
      document.body.classList.add('dark-mode');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.style.colorScheme = 'light';
    }

    // Create container
    const container = document.createElement('div');
    container.id = 'minimalist-youtube-container';

    // Create logo
    const logoContainer = document.createElement('div');
    logoContainer.id = 'yt-logo-container';

    const logo = document.createElement('img');
    logo.src = chrome.runtime.getURL('youtube.svg');
    logo.id = 'yt-minimalist-logo';
    logo.alt = 'YouTube';
    logo.classList.add('svg-logo');

    logoContainer.appendChild(logo);

    // Create search form
    const searchForm = document.createElement('form');
    searchForm.id = 'minimalist-search-form';
    searchForm.action = '/results';
    searchForm.method = 'get';
    
    // Make sure the search form doesn't use our custom styling
    searchForm.addEventListener('submit', () => {
      // Remove our hiding style before form submission
      const style = document.getElementById('youtube-minimalist-hide-style');
      if (style) style.remove();
      
      // Make sure body and html are visible
      document.documentElement.classList.add('minimalist-ready');
      document.body.classList.add('minimalist-ready');
      
      // Let the form submit and YouTube handle the search
      return true;
    });

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.name = 'search_query';
    searchInput.id = 'minimalist-search-input';
    searchInput.placeholder = 'Search YouTube';
    searchInput.autocomplete = 'off';
    searchInput.autofocus = true;

    searchForm.appendChild(searchInput);

    // Add theme toggle button
    const themeToggle = document.createElement('button');
    themeToggle.id = 'theme-toggle';
    themeToggle.innerHTML = darkMode ? '☀️' : '🌙';
    themeToggle.title = darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode';
    themeToggle.onclick = (e) => {
      e.preventDefault();
      const isDark = toggleDarkMode();
      themeToggle.innerHTML = isDark ? '☀️' : '🌙';
      themeToggle.title = isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode';
      document.body.style.backgroundColor = isDark ? '#212121' : 'white';
      document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
      
      // Force a repaint to fix any rendering issues
      const container = document.getElementById('minimalist-youtube-container');
      if (container) {
        container.style.display = 'none';
        setTimeout(() => { container.style.display = 'flex'; }, 10);
      }
    };

    // Add footer with links
    const footer = document.createElement('div');
    footer.id = 'minimalist-footer';

    const restoreLink = document.createElement('a');
    restoreLink.href = '#';
    restoreLink.textContent = 'Restore Original YouTube';
    restoreLink.onclick = (e) => {
      e.preventDefault();
      // Update both storage mechanisms
      localStorage.setItem('youtube-minimalist-disabled', 'true');
      chrome.storage.local.set({ minimalistDisabled: true }, () => {
        window.location.reload();
      });
    };

    footer.appendChild(restoreLink);
    footer.appendChild(document.createTextNode(' | '));
    footer.appendChild(themeToggle);

    // Assemble the page
    container.appendChild(logoContainer);
    container.appendChild(searchForm);
    container.appendChild(footer);
    document.body.appendChild(container);

    // Remove the hiding style and show our interface
    if (document.getElementById('youtube-minimalist-hide-style')) {
      document.getElementById('youtube-minimalist-hide-style').remove();
    }
    
    document.documentElement.classList.add('minimalist-ready');
    document.body.classList.add('minimalist-ready');

    // Focus on the search input
    searchInput.focus();

    console.log('YouTube Minimalist: Interface applied successfully');
  };

  // Try to apply as early as possible, but only on the homepage
  if (isYouTubeHomepage()) {
    if (document.readyState === 'loading') {
      // Document still loading, add event listener
      document.addEventListener('DOMContentLoaded', () => {
        createMinimalistInterface();
      });
    } else {
      // Document already loaded
      createMinimalistInterface();
    }

    // Also apply on document ready as a fallback
    window.addEventListener('load', () => {
      createMinimalistInterface();
    });
  } else {
    // Not on homepage, ensure we're visible if the style was added
    const style = document.getElementById('youtube-minimalist-hide-style');
    if (style) {
      style.remove();
      document.documentElement.classList.add('minimalist-ready');
      document.body.classList.add('minimalist-ready');
    }
  }

  // Listen for messages from the background script
  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'applyMinimalist') {
      console.log('YouTube Minimalist: Received message to apply interface');
      
      if (isYouTubeHomepage()) {
        setTimeout(createMinimalistInterface, 50); // Reduced timeout
      } else {
        // Not on homepage, ensure we're visible if the style was added
        const style = document.getElementById('youtube-minimalist-hide-style');
        if (style) {
          style.remove();
          document.documentElement.classList.add('minimalist-ready');
          document.body.classList.add('minimalist-ready');
        }
      }
    } else if (message.action === 'toggleMinimalist') {
      console.log('YouTube Minimalist: Received toggle message, setting to', message.enabled ? 'enabled' : 'disabled');
      
      // Update both storage mechanisms
      localStorage.setItem('youtube-minimalist-disabled', message.enabled ? 'false' : 'true');
      chrome.storage.local.set({ minimalistDisabled: !message.enabled });
      
      // If we're enabling and on homepage, apply minimalist interface
      if (message.enabled && isYouTubeHomepage()) {
        setTimeout(createMinimalistInterface, 50);
      }
    }
  });
})();