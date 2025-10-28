# ScrapyMark Features

## Core Features

### 1. Visual Spider Configuration
Build Scrapy spiders without writing code through an intuitive browser interface.

**Benefits:**
- No need to manually write Item classes
- No need to remember Scrapy syntax
- Visual feedback for all selections
- Instant code generation

---

### 2. Interactive DOM Element Selection

**Link Selection Mode:**
- Click on links you want the spider to follow
- Automatically generates LinkExtractor rules
- Supports pagination, category navigation, etc.

**Item Field Selection Mode:**
- Click on elements containing data
- Maps elements to Item fields
- Generates extraction logic

**Visual Feedback:**
- Green highlight on hover
- Blue highlight when selected
- Notification messages for guidance

---

### 3. Smart Selector Generation

The extension automatically generates optimal CSS selectors:

**Priority Order:**
1. ID selectors (`#unique-id`)
2. Class selectors (`.class-name`)
3. Structural selectors (`div > p:nth-of-type(2)`)

**Features:**
- Minimal selector complexity
- Unique element identification
- Fallback to path-based selectors

---

### 4. Complete Spider Code Generation

**Generated Code Includes:**
- Scrapy Item class definition
- CrawlSpider with configuration
- LinkExtractor rules
- parse_item method
- Proper imports and structure

**Code Quality:**
- Valid Python syntax
- PEP 8 compliant formatting
- Ready to use in Scrapy projects
- Includes comments for guidance

---

### 5. Configuration Management

**Persistence:**
- All configuration saved automatically
- Persists between browser sessions
- Per-extension storage (not per-page)

**Management:**
- Add/remove fields dynamically
- Edit URLs and rules
- Clear all configuration
- No backend required

---

### 6. Multi-URL Support

**Features:**
- Add multiple start URLs
- Support for different entry points
- Easy URL management
- Remove URLs individually

**Use Cases:**
- Multiple category pages
- Different product listings
- Multi-site scraping
- A/B testing

---

### 7. Field Definition Interface

**Capabilities:**
- Define custom field names
- Automatic field creation from selections
- Remove fields individually
- Preview field mappings

**Workflow:**
- Manual field addition
- Or automatic via element selection
- Clear field listing
- Easy management

---

### 8. Output Format Selection

**Format Options:**
- JSON output (default)
- CSV output for spreadsheets
- POST to webhook endpoint

**Webhook Features:**
- Custom webhook URL input
- Automatic item POSTing
- Built-in pipeline generation
- Error handling and logging
- Item count tracking

---

### 9. Export Functionality

**Download Options:**
- Python spider file (.py)
- Automatic file naming
- Browser download manager

**File Content:**
- Complete spider code
- Output format configuration
- Usage instructions
- Ready to use
- Copy to Scrapy project
- Run immediately

---

## User Interface Features

### Popup Interface
- Clean, modern design
- Organized by sections
- Clear action buttons
- Real-time updates

### Visual Indicators
- Empty state messages
- Status notifications
- Selection counters
- Color-coded highlights

### User Guidance
- Helpful button labels
- Context-sensitive messages
- Clear instructions
- Error prevention

---

## Technical Features

### Chrome Extension
- Manifest V3 compliant
- Modern extension architecture
- Minimal permissions
- Secure implementation

### Storage
- Chrome Storage API
- Local storage only
- No external dependencies
- Privacy-focused

### Performance
- Fast selector generation
- Efficient DOM queries
- No memory leaks
- Lightweight implementation

---

## Scrapy Feature Support

### Supported Scrapy Features
✅ CrawlSpider
✅ LinkExtractor with CSS selectors
✅ Items and Fields
✅ CSS selectors
✅ Basic XPath selectors
✅ start_urls configuration

### Planned Features
⏳ Basic Spider support
⏳ Advanced XPath
⏳ Item Pipelines
⏳ Settings configuration
⏳ Middleware setup

---

## Selector Features

### CSS Selectors
- Element tags (`div`, `p`, `a`)
- ID selectors (`#id`)
- Class selectors (`.class`)
- Attribute selectors
- Pseudo-selectors (`:nth-of-type`)
- Combinators (`>`, ` `)

### XPath Support
- Basic path detection
- Automatic selector type detection
- XPath for complex structures

---

## Quality of Life Features

### Keyboard Shortcuts
- **ESC**: Exit selection mode
- **Right-click**: Finish selection

### Confirmations
- Clear all confirmation
- Destructive action warnings

### Feedback
- Success messages
- Status updates
- Error notifications

### Organization
- Grouped by functionality
- Clear section headers
- Logical workflow

---

## Browser Compatibility

### Supported Browsers
- ✅ Google Chrome (88+)
- ✅ Microsoft Edge (88+)
- ✅ Brave Browser
- ✅ Other Chromium browsers

### Requirements
- Manifest V3 support
- Chrome Extension APIs
- Modern JavaScript support

---

## Use Cases

### E-commerce Scraping
- Product listings
- Price monitoring
- Inventory tracking
- Review collection

### Content Aggregation
- News articles
- Blog posts
- Social media content
- Forum discussions

### Research & Data Collection
- Academic research
- Market analysis
- Competitive intelligence
- Data mining

### SEO & Marketing
- Backlink analysis
- Keyword research
- Competitor monitoring
- Content discovery

---

## Security & Privacy

### Privacy Features
- No data collection
- No external API calls
- Local storage only
- No tracking

### Security
- Minimal permissions
- Content Security Policy
- No code injection
- Secure message passing

---

## Accessibility

### User-Friendly Design
- Clear labels
- Visual feedback
- Status messages
- Intuitive workflow

### Error Prevention
- Validation
- Confirmations
- Clear instructions
- Helpful empty states

---

## Documentation

### Available Documentation
- README.md - Overview and installation
- QUICKSTART.md - Getting started guide
- TESTING.md - Testing procedures
- ARCHITECTURE.md - Technical details
- FEATURES.md - This file

### Examples
- Example spider code
- Test HTML page
- Real-world use cases
