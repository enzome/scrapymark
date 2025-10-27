# Testing Guide for ScrapyMark Extension

## Manual Testing

### Prerequisites
- Chrome or Edge browser
- Extension loaded in developer mode
- Test page (`examples/test-page.html`) opened in browser

### Test Cases

#### Test 1: Extension Installation
**Steps:**
1. Navigate to `chrome://extensions/`
2. Enable Developer mode
3. Click "Load unpacked"
4. Select the scrapymark directory

**Expected Result:**
- Extension appears in the extensions list
- ScrapyMark icon visible in toolbar
- No errors in the console

---

#### Test 2: Basic Configuration
**Steps:**
1. Click ScrapyMark icon
2. Enter spider name: "test_spider"
3. Enter item name: "TestItem"
4. Click "Add Field" button
5. Add field names: "title", "price", "description"
6. Enter start URL: "https://example.com"
7. Click "Add URL"

**Expected Result:**
- All fields saved correctly
- Fields appear in the "Item Definition" section
- URL appears in the "Start URLs" section
- Configuration persists when popup is reopened

---

#### Test 3: Link Selection Mode
**Steps:**
1. Open `examples/test-page.html` in browser
2. Click ScrapyMark icon
3. Click "Select Links to Follow" button
4. Page should enter selection mode
5. Hover over link elements - should see green highlight
6. Click on "View Details" links
7. Click on pagination "Next" link
8. Right-click to finish selection

**Expected Result:**
- Notification appears showing selection mode
- Elements highlight on hover (green outline)
- Selected elements get blue outline
- Link rules appear in extension popup
- Selectors are generated (e.g., `.view-details`, `.pagination a`)

---

#### Test 4: Item Field Selection Mode
**Steps:**
1. Open `examples/test-page.html` in browser
2. Click ScrapyMark icon
3. Click "Select Item Fields" button
4. Click on product title element
5. When prompted, enter field name: "title"
6. Click on product price element
7. Enter field name: "price"
8. Click on product description
9. Enter field name: "description"
10. Right-click to finish

**Expected Result:**
- Each click prompts for field name
- Selected elements highlighted in blue
- Parse fields appear in extension popup with selector
- Fields automatically added to item definition if not present

---

#### Test 5: Code Generation
**Steps:**
1. Complete configuration with:
   - Spider name: "books_spider"
   - Item name: "BookItem"
   - Fields: title, price, rating, description
   - Start URL: "https://example.com/books"
   - At least one link rule
   - At least one parse field
2. Click "Generate Spider Code"

**Expected Result:**
- Python file downloads
- File named `books_spider.py`
- File contains:
  - Valid Python code
  - BookItem class with correct fields
  - BooksSpider CrawlSpider class
  - LinkExtractor rules
  - parse_item method with selectors
  - Proper imports

---

#### Test 6: Configuration Persistence
**Steps:**
1. Configure spider with multiple fields, URLs, and rules
2. Close popup
3. Navigate to another page
4. Reopen popup

**Expected Result:**
- All configuration preserved
- Spider name still set
- Item fields still present
- URLs still listed
- Link rules and parse fields intact

---

#### Test 7: Remove Items
**Steps:**
1. Add multiple fields, URLs, link rules, and parse fields
2. Click "Remove" button on various items

**Expected Result:**
- Selected item removed from list
- Other items remain
- Configuration updates persist

---

#### Test 8: Clear All
**Steps:**
1. Configure spider completely
2. Click "Clear All" button
3. Confirm the dialog

**Expected Result:**
- All fields cleared
- All URLs removed
- All rules removed
- All parse fields removed
- Spider name and item name cleared
- Empty state messages appear

---

#### Test 9: Selector Generation Accuracy
**Steps:**
1. Open `examples/test-page.html`
2. Select various elements:
   - Element with ID
   - Element with unique class
   - Nested element
   - Element requiring nth-child

**Expected Result:**
- Elements with IDs use `#id` selector
- Elements with classes use `.class` selector
- Nested elements get reasonable path selectors
- Selectors are as simple as possible while being accurate

---

#### Test 10: ESC Key to Cancel Selection
**Steps:**
1. Enter selection mode (link or item)
2. Press ESC key

**Expected Result:**
- Selection mode exits
- Notification disappears
- Selected elements are deselected
- Configuration saved

---

## Validation Testing

### Code Quality
- [ ] No JavaScript errors in browser console
- [ ] No warnings in extension manifest
- [ ] All CSS selectors valid
- [ ] Event listeners properly removed

### Generated Code Quality
- [ ] Valid Python syntax
- [ ] Proper Scrapy imports
- [ ] Correct class structure
- [ ] Valid CSS/XPath selectors
- [ ] Proper indentation

### User Experience
- [ ] Clear visual feedback for selections
- [ ] Intuitive button labels
- [ ] Helpful empty states
- [ ] Confirmation for destructive actions
- [ ] Status messages appear and disappear appropriately

### Edge Cases
- [ ] Empty configuration generates valid (empty) spider
- [ ] Very long selectors don't break UI
- [ ] Special characters in spider/item names handled
- [ ] Multiple selections of same element handled
- [ ] Selection on dynamically loaded content

## Browser Testing

Test the extension in:
- [ ] Chrome (latest)
- [ ] Edge (latest)
- [ ] Brave (Chromium-based)

## Known Limitations

1. **JavaScript-rendered content**: Extension works on DOM present at load time
2. **Shadow DOM**: Elements in shadow DOM may not be selectable
3. **iFrames**: Elements in iframes require special handling
4. **Dynamic IDs**: Selectors may break if IDs are dynamic
5. **Complex XPath**: Only basic XPath support currently

## Automated Testing (Future)

Consider adding:
- Unit tests for selector generation logic
- Integration tests for Chrome APIs
- End-to-end tests using Puppeteer
- Selector accuracy tests

## Bug Reporting

When reporting bugs, include:
1. Browser version
2. Extension version
3. Steps to reproduce
4. Expected vs actual behavior
5. Console errors (if any)
6. Screenshots (if applicable)
