# Architecture & Technical Documentation

## Overview

ScrapyMark is a Chrome extension that enables visual creation of Scrapy spiders through direct interaction with web pages. The extension uses Manifest V3 and follows a modular architecture.

## Architecture

### Components

```
┌─────────────────────────────────────────┐
│           Browser UI Layer              │
├─────────────────────────────────────────┤
│  popup.html + popup.js (Configuration)  │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│       Background Service Worker         │
│         (background.js)                 │
│   - Message routing                     │
│   - State coordination                  │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│         Content Script Layer            │
│     (content.js + content.css)          │
│   - DOM manipulation                    │
│   - Element selection                   │
│   - Selector generation                 │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│          Chrome Storage API             │
│    (Persistent Configuration)           │
└─────────────────────────────────────────┘
```

### File Structure

```
scrapymark/
├── manifest.json           # Extension manifest (Manifest V3)
├── popup.html             # Extension popup UI
├── popup.js               # Popup logic and spider generator
├── content.js             # Content script for DOM interaction
├── content.css            # Styles for element highlighting
├── background.js          # Service worker for message routing
├── icons/                 # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── examples/              # Example files
│   ├── books_spider.py    # Generated spider example
│   └── test-page.html     # Test HTML page
└── README.md              # Documentation
```

## Data Flow

### Configuration Storage

```javascript
// Configuration object structure
{
  spiderName: string,      // e.g., "my_spider"
  itemName: string,        // e.g., "MyItem"
  fields: string[],        // ["title", "price", "rating"]
  startUrls: string[],     // ["https://example.com"]
  linkRules: [             // LinkExtractor rules
    {
      selector: string,    // CSS/XPath selector
      element: string      // HTML element type
    }
  ],
  parseFields: [           // Item field mappings
    {
      name: string,        // Field name
      selector: string,    // CSS/XPath selector
      element: string      // HTML element type
    }
  ]
}
```

### Message Passing

1. **Popup → Content Script**
   ```javascript
   {
     action: 'startSelection',
     mode: 'link' | 'item'
   }
   ```

2. **Content Script → Background → Popup**
   ```javascript
   {
     action: 'updateConfig'
   }
   ```

## Key Algorithms

### Selector Generation

The `getOptimalSelector()` function in `content.js` follows this hierarchy:

1. **ID Selector** (highest priority)
   - If element has unique ID: `#elementId`

2. **Class Selector**
   - If element has unique class combination: `tag.class1.class2`
   - Or simplified: `tag.class1`

3. **Structural Selector** (fallback)
   - Builds path from element to root
   - Uses `:nth-of-type()` for disambiguation
   - Example: `div > article:nth-of-type(2) > h1`

### Spider Code Generation

The `generateSpiderCode()` function in `popup.js`:

1. Generates Python class name from snake_case spider name
2. Creates Scrapy Item class with fields
3. Creates CrawlSpider with:
   - Name and start_urls
   - LinkExtractor rules from selected links
   - parse_item method with field extraction logic
4. Chooses between CSS and XPath based on selector format

## Chrome Extension APIs Used

### Storage API
```javascript
chrome.storage.local.set({ spiderConfig: config })
chrome.storage.local.get(['spiderConfig'], callback)
```

### Tabs API
```javascript
chrome.tabs.query({ active: true, currentWindow: true })
```

### Messaging API
```javascript
chrome.tabs.sendMessage(tabId, message)
chrome.runtime.sendMessage(message)
chrome.runtime.onMessage.addListener(callback)
```

### Scripting API
- Automatic content script injection via manifest

## UI/UX Design Decisions

### Visual Feedback
- **Green outline**: Element being hovered
- **Blue outline**: Element selected
- **Notification bar**: Fixed top position for status messages

### User Flow
1. Configure basics (name, fields)
2. Add URLs
3. Select links to follow
4. Select data to extract
5. Generate code

### State Management
- Configuration persists in Chrome storage
- Real-time updates between popup and content script
- No backend required - fully client-side

## Security Considerations

1. **Permissions**: Minimal required permissions
   - `activeTab`: Only active tab access
   - `storage`: Local storage only
   - `scripting`: For content script injection

2. **Content Security Policy**
   - Manifest V3 default CSP
   - No inline scripts in HTML
   - No eval() usage

3. **Data Privacy**
   - All data stored locally
   - No external API calls
   - No telemetry or tracking

## Performance Considerations

1. **Event Listeners**: Added/removed appropriately to prevent memory leaks
2. **DOM Queries**: Cached where possible
3. **Selector Complexity**: Limited path depth to 5 elements
4. **Storage**: Configuration is small (<1KB typically)

## Browser Compatibility

- **Chrome**: 88+ (Manifest V3)
- **Edge**: 88+ (Chromium-based)
- **Brave**: Latest (Chromium-based)
- **Opera**: Latest (Chromium-based)

Note: Firefox requires Manifest V2 compatibility layer (not currently supported)

## Limitations & Future Enhancements

### Current Limitations
1. Only CrawlSpider supported (not base Spider)
2. Limited XPath support
3. No support for JavaScript-rendered content
4. No support for authenticated pages
5. Simple selector generation (may need manual refinement)

### Potential Enhancements
1. **Advanced Selectors**
   - XPath builder
   - Regex patterns
   - Custom selector testing

2. **Spider Types**
   - Basic Spider support
   - SitemapSpider support
   - CSV/XML spider templates

3. **Export Formats**
   - Complete Scrapy project structure
   - Settings.py configuration
   - Pipeline definitions

4. **Advanced Features**
   - Item pipelines builder
   - Middleware configuration
   - Settings management
   - Selector testing before export

5. **UI Improvements**
   - Preview generated code in popup
   - Selector validation
   - Visual selector editor
   - Import existing spider

## Development

### Building Icons
```bash
pip install Pillow
python3 create_icons.py
```

### Testing
See `TESTING.md` for comprehensive testing guide

### Code Style
- ES6+ JavaScript
- 2-space indentation
- Clear variable names
- Comments for complex logic

## Troubleshooting

### Common Issues

**Content script not injecting:**
- Check manifest permissions
- Reload extension
- Refresh target page

**Selectors not working:**
- Element may have dynamic attributes
- Try manual selector refinement
- Use browser DevTools to test

**Configuration not saving:**
- Check Chrome storage quota
- Check for JavaScript errors
- Verify permissions granted

## Resources

- [Scrapy Documentation](https://docs.scrapy.org/)
- [Chrome Extension Docs](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Migration Guide](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [CSS Selectors Reference](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors)
