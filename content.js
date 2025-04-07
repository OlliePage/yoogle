(function() {
  console.log('YouTube Minimalist: Content script loaded');

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

  // Create our minimalist interface
  const createMinimalistInterface = () => {
    console.log('YouTube Minimalist: Creating interface');

    // Only apply on the homepage
    if (window.location.pathname !== '/') {
      console.log('YouTube Minimalist: Not on homepage, skipping');
      return;
    }

    // Don't reapply if our interface is already active
    if (document.getElementById('minimalist-youtube-container')) {
      console.log('YouTube Minimalist: Interface already applied');
      return;
    }

    // Check if user has disabled the minimalist interface
    if (localStorage.getItem('youtube-minimalist-disabled') === 'true') {
      console.log('YouTube Minimalist: Disabled by user preference');
      return;
    }

    // Get dark mode setting
    const darkMode = isDarkMode();

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
    logo.src = 'https://www.youtube.com/img/desktop/yt_1200.png';
    logo.id = 'yt-minimalist-logo';
    logo.alt = 'YouTube';

    logoContainer.appendChild(logo);

    // Create search form
    const searchForm = document.createElement('form');
    searchForm.id = 'minimalist-search-form';
    searchForm.action = '/results';
    searchForm.method = 'get';

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.name = 'search_query';
    searchInput.id = 'minimalist-search-input';
    searchInput.placeholder = 'Search YouTube';
    searchInput.autocomplete = 'off';
    searchInput.autofocus = true;

    const searchButton = document.createElement('button');
    searchButton.type = 'submit';
    searchButton.id = 'minimalist-search-button';
    searchButton.textContent = 'Search';

    searchForm.appendChild(searchInput);
    searchForm.appendChild(searchButton);

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
      localStorage.setItem('youtube-minimalist-disabled', 'true');
      window.location.reload();
    };

    footer.appendChild(restoreLink);
    footer.appendChild(document.createTextNode(' | '));
    footer.appendChild(themeToggle);

    // Assemble the page
    container.appendChild(logoContainer);
    container.appendChild(searchForm);
    container.appendChild(footer);
    document.body.appendChild(container);

    // Focus on the search input
    searchInput.focus();

    console.log('YouTube Minimalist: Interface applied successfully');
  };

  // Try to apply immediately if we're on the homepage
  if (window.location.pathname === '/') {
    // Wait for YouTube to finish loading
    const waitForYouTube = setInterval(() => {
      if (document.body) {
        clearInterval(waitForYouTube);
        setTimeout(createMinimalistInterface, 500);
      }
    }, 100);
  }

  // Listen for messages from the background script
  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'applyMinimalist') {
      console.log('YouTube Minimalist: Received message to apply interface');
      setTimeout(createMinimalistInterface, 300);
    }
  });
})();