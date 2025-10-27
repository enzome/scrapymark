# Developer Installation Guide

## Prerequisites
- Google Chrome, Microsoft Edge, or other Chromium-based browser
- Basic understanding of Chrome extensions
- (Optional) Scrapy installed for testing generated spiders

## Quick Installation

### For Chrome/Edge/Brave

1. **Download the Extension**
   ```bash
   git clone https://github.com/enzome/scrapymark.git
   cd scrapymark
   ```

2. **Open Extensions Page**
   - Chrome: Navigate to `chrome://extensions/`
   - Edge: Navigate to `edge://extensions/`
   - Brave: Navigate to `brave://extensions/`

3. **Enable Developer Mode**
   - Look for the "Developer mode" toggle in the top-right corner
   - Turn it ON

4. **Load the Extension**
   - Click the "Load unpacked" button
   - Browse to and select the `scrapymark` directory
   - The extension should now appear in your extensions list

5. **Verify Installation**
   - You should see the ScrapyMark icon in your browser toolbar
   - Click it to open the popup
   - No errors should appear in the console

## Testing the Extension

### Using the Test Page

1. **Open Test Page**
   ```bash
   # From the scrapymark directory
   open examples/test-page.html
   # Or on Linux
   xdg-open examples/test-page.html
   ```

2. **Try Basic Workflow**
   - Click the ScrapyMark icon
   - Enter spider name: "test_spider"
   - Enter item name: "ProductItem"
   - Add fields: title, price, rating
   - Click "Select Links to Follow"
   - Click on some links on the test page
   - Right-click to finish
   - Click "Select Item Fields"
   - Click on product titles, prices, etc.
   - Enter field names when prompted
   - Right-click to finish
   - Click "Generate Spider Code"
   - Verify the downloaded .py file

### Testing on Real Websites

Try these beginner-friendly websites:
- https://books.toscrape.com/ (Practice scraping site)
- https://quotes.toscrape.com/ (Quotes site)
- https://scrapethissite.com/ (Learning resource)

## Troubleshooting

### Extension Not Loading
**Issue**: Extension doesn't appear after loading
**Solution**: 
- Check for errors in the extensions page
- Verify manifest.json is valid
- Reload the extension

### Content Script Not Working
**Issue**: Selection mode doesn't start
**Solution**:
- Refresh the target web page
- Check browser console for errors
- Verify page is fully loaded before selecting

### Icons Not Showing
**Issue**: Extension icon appears broken
**Solution**:
- Verify icon files exist in `icons/` directory
- Check PNG files (icon16.png, icon48.png, icon128.png)
- Reload extension

### Configuration Not Saving
**Issue**: Configuration lost when reopening popup
**Solution**:
- Check Chrome storage permissions in manifest
- Verify no console errors
- Try clearing extension storage and reloading

## Development Setup

### File Watching
For active development, you may want to auto-reload:

1. Install Extension Reloader extension (optional)
2. Make changes to code
3. Click reload button in extensions page
4. Refresh any open tabs to reload content scripts

### Console Debugging

**Popup Console:**
1. Right-click extension icon
2. Select "Inspect popup"
3. Console shows popup.js logs

**Content Script Console:**
1. Open target webpage
2. Open DevTools (F12)
3. Console shows content.js logs

**Background Script Console:**
1. Go to `chrome://extensions/`
2. Find ScrapyMark
3. Click "service worker" link
4. Console shows background.js logs

## Testing Generated Spiders

### Setup Scrapy Project

1. **Install Scrapy**
   ```bash
   pip install scrapy
   ```

2. **Create Test Project**
   ```bash
   scrapy startproject test_project
   cd test_project
   ```

3. **Add Generated Spider**
   - Generate spider using ScrapyMark
   - Move downloaded .py file to `test_project/test_project/spiders/`

4. **Run Spider**
   ```bash
   scrapy crawl your_spider_name -o output.json
   ```

5. **Check Output**
   ```bash
   cat output.json
   ```

## Modifying the Extension

### Code Structure

**popup.js** - Main logic
- Configuration management
- Spider code generation
- UI event handlers

**content.js** - Page interaction
- DOM element selection
- Selector generation
- Visual highlighting

**background.js** - Message routing
- Cross-component communication

**popup.html** - User interface
- Form controls
- Configuration display

**content.css** - Visual styles
- Highlight effects
- Notification styling

### Making Changes

1. Edit the relevant file
2. Save changes
3. Go to `chrome://extensions/`
4. Click reload icon for ScrapyMark
5. Refresh any web pages using the extension
6. Test your changes

### Common Modifications

**Change Highlight Colors:**
Edit `content.css`:
```css
.scrapymark-highlight {
  outline: 2px solid #YOUR_COLOR !important;
}
```

**Modify Generated Code Template:**
Edit `generateSpiderCode()` in `popup.js`

**Change Selector Algorithm:**
Edit `getOptimalSelector()` in `content.js`

## Distribution

### Creating a Package

For sharing with others:

1. **Remove Development Files**
   ```bash
   # Create clean directory
   mkdir scrapymark-dist
   cp -r scrapymark/* scrapymark-dist/
   cd scrapymark-dist
   rm -rf .git examples/
   ```

2. **Create ZIP**
   ```bash
   zip -r scrapymark-v1.0.0.zip .
   ```

3. **Share**
   - Upload to GitHub releases
   - Share ZIP file with users
   - (Optional) Publish to Chrome Web Store

### Publishing to Chrome Web Store

For official distribution:

1. Create developer account
2. Prepare store listing
3. Upload ZIP package
4. Submit for review
5. Wait for approval

See: https://developer.chrome.com/docs/webstore/publish/

## Best Practices

### Development
- Test changes on multiple websites
- Check console for errors
- Validate generated Python code
- Test across different browsers

### Code Quality
- Keep functions focused and small
- Add comments for complex logic
- Follow existing code style
- Validate user input

### Testing
- Test with various website structures
- Verify selector accuracy
- Check edge cases
- Test configuration persistence

## Getting Help

### Resources
- Chrome Extension Docs: https://developer.chrome.com/docs/extensions/
- Scrapy Docs: https://docs.scrapy.org/
- CSS Selectors: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors

### Community
- Report issues on GitHub
- Check existing documentation
- Review test cases in TESTING.md

## Security Notes

### What NOT to Do
- Don't add unnecessary permissions
- Don't make external API calls without disclosure
- Don't collect user data
- Don't inject malicious code

### What TO Do
- Keep permissions minimal
- Store data locally only
- Validate all inputs
- Follow Chrome's security guidelines

## Next Steps

After installation:
1. Read QUICKSTART.md for usage guide
2. Try the test page in examples/
3. Test on a real website
4. Review generated spider code
5. Customize for your needs

Happy scraping! 🕷️
