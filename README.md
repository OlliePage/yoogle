# Yoogle - A Minimalist YouTube Interface

Yoogle is a Chrome extension that transforms YouTube's homepage into a clean, Google-like search interface. This helps you stay focused and intent-driven when using YouTube, rather than getting distracted by recommended videos.

## Features

- 🔍 Clean, distraction-free interface with just a search bar
- 🌙 Light/Dark mode toggle that remembers your preference
- ⚡ Ultra-fast loading with no flash of original content
- 🔁 Toolbar icon to easily toggle between minimal and original interfaces
- 🔄 Works on YouTube's homepage while preserving normal functionality on video pages
- 🔄 Automatically applies when navigating back to the homepage
- 💾 Uses local SVG logo for better performance and appearance
- 🧠 Smart state persistence across browser sessions

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
3. Use the search bar to find videos (press Enter to search)
4. Toggle between light and dark mode using the moon/sun button in the footer
5. Use the extension toolbar icon to toggle between minimalist and original YouTube interfaces
6. You can also click "Restore Original YouTube" in the footer to temporarily view the original interface

## Performance Features

- Starts loading before YouTube's original interface becomes visible
- Uses efficient SVG for logo with proper scaling on all devices
- Optimized CSS transitions and animations for smooth appearance
- Smart detection of user's preferred color scheme

## How It Works

Yoogle uses content scripts that load at document start to detect when you're on YouTube's homepage. It efficiently replaces the interface with a minimalist version before the original content is displayed, eliminating any flash of unwanted content. 

The extension preserves YouTube's core functionality while removing the distracting elements and uses Chrome's storage API for persistent settings.

## Development

To modify this extension:

1. Clone the repository
2. Make your changes to the files
3. Reload the extension in Chrome's extensions page

### Files:

- `manifest.json`: Extension configuration and permissions
- `content.js`: Main script that creates the minimalist interface
- `background.js`: Background script for detecting navigation and handling toolbar icon
- `styles.css`: Styling for the minimalist interface
- `youtube.svg`: Local SVG logo for better performance
- `icon*.png`: Extension icons in various sizes

## License

MIT License