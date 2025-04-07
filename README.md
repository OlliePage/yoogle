# Yoogle - A Minimalist YouTube Interface

Yoogle is a Chrome extension that transforms YouTube's homepage into a clean, Google-like search interface. This helps you stay focused and intent-driven when using YouTube, rather than getting distracted by recommended videos.

## Features

- 🔍 Clean, distraction-free interface with just a search bar
- 🌙 Light/Dark mode toggle that remembers your preference
- 🔄 Works on YouTube's homepage while preserving normal functionality on video pages
- 🔄 Automatically applies when navigating back to the homepage

## Installation

### From Chrome Web Store (Coming soon)

### Manual Installation

1. Download this repository or clone it:
   ```
   git clone https://github.com/OlliePage/yoogle.git
   ```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable "Developer mode" (toggle in top right)

4. Click "Load unpacked" and select the yoogle folder

5. The extension should now be installed and active

## Usage

1. Visit YouTube's homepage (https://www.youtube.com/)
2. The minimalist interface will automatically be applied
3. Use the search bar to find videos
4. Toggle between light and dark mode using the button in the footer
5. Click "Restore Original YouTube" if you want to temporarily see the original interface

## How It Works

Yoogle uses content scripts to detect when you're on YouTube's homepage and replaces the interface with a minimalist version. It preserves YouTube's core functionality while removing the distracting elements.

## Development

To modify this extension:

1. Clone the repository
2. Make your changes to the files
3. Reload the extension in Chrome's extensions page

### Files:

- `manifest.json`: Extension configuration
- `content.js`: Main script that creates the minimalist interface
- `background.js`: Background script for detecting navigation
- `styles.css`: Styling for the minimalist interface

## License

MIT License