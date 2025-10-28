# ScrapyMark

Browser extension that builds Scrapy spider configurations to extract structured data from websites.

## Features

- **Visual Spider Builder**: Build Scrapy spiders through an intuitive browser interface
- **Interactive DOM Selection**: Click on page elements to define extraction rules
- **Item Definition**: Define your Scrapy Items with custom fields
- **Link Extraction Rules**: Select which links the spider should follow
- **Parse Item Configuration**: Map DOM elements to item fields
- **Multiple Output Formats**: Choose between JSON, CSV, or POST to webhook
- **Code Generation**: Automatically generate production-ready Scrapy spider code

## Installation

### Chrome/Edge

1. Clone this repository or download the source code
2. Open Chrome/Edge and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the scrapymark directory
5. The ScrapyMark icon should appear in your browser toolbar

## Usage

### 1. Define Your Spider

1. Click the ScrapyMark icon in your browser toolbar
2. Enter a **Spider Name** (e.g., `my_spider`)
3. Enter an **Item Name** (e.g., `ProductItem`)

### 2. Add Item Fields

1. Click **Add Field** button
2. Enter field names for the data you want to extract (e.g., `title`, `price`, `description`)
3. Fields can be added manually or will be created when you select DOM elements

### 3. Add Start URLs

1. Navigate to the website you want to scrape (or enter URLs manually)
2. In the extension popup, enter the URL in the "Start URLs" field
3. Click **Add URL**
4. Add multiple URLs if needed

### 4. Select Links to Follow

1. Click **Select Links to Follow** button
2. The page will enter selection mode
3. Click on any links (`<a>` tags) that the spider should follow
4. Selected elements will be highlighted in blue
5. Right-click or press ESC when finished
6. The extension will generate LinkExtractor rules based on your selections

### 5. Select Item Fields to Extract

1. Click **Select Item Fields** button
2. The page will enter selection mode
3. Click on elements containing data you want to extract
4. For each element, enter a field name when prompted
5. Right-click or press ESC when finished
6. The extension will map these elements to your item fields

### 6. Choose Output Format

1. Select your desired output format:
   - **JSON**: Standard JSON output file
   - **CSV**: CSV format for spreadsheet compatibility
   - **POST to Webhook**: Automatically POST each scraped item to a webhook endpoint
2. If you select webhook, enter your webhook URL (e.g., `https://example.com/webhook`)

### 7. Generate Spider Code

1. Review your configuration in the popup
2. Click **Generate Spider Code**
3. A Python file will be downloaded with your complete Scrapy spider

### 8. Use Your Spider

Place the generated Python file in your Scrapy project's `spiders` directory and run:

**For JSON output:**
```bash
scrapy runspider my_spider.py -o output.json
```

**For CSV output:**
```bash
scrapy runspider my_spider.py -o output.csv
```

**For Webhook output:**
```bash
scrapy runspider my_spider.py
# Items are automatically POSTed to your webhook URL
```

## Generated Code Structure

The extension generates a complete Scrapy CrawlSpider with:

- **Item Class**: Scrapy Item definition with your specified fields
- **Spider Class**: CrawlSpider with configured start URLs
- **Link Extraction Rules**: Rules based on selected DOM elements
- **Parse Method**: Item parsing logic with CSS/XPath selectors
- **Output Configuration**: Based on your selected format:
  - **JSON/CSV**: Usage instructions in code comments
  - **Webhook**: Custom pipeline class to POST items to your endpoint

## Example

### Configuration:
- Spider Name: `books_spider`
- Item Name: `BookItem`
- Fields: `title`, `price`, `rating`
- Start URL: `https://example.com/books`
- Link Rules: Select pagination links
- Parse Fields: Map title to h1, price to .price, rating to .star-rating

### Generated Code:
```python
import scrapy
from scrapy.linkextractors import LinkExtractor
from scrapy.spiders import CrawlSpider, Rule


class BookItem(scrapy.Item):
    title = scrapy.Field()
    price = scrapy.Field()
    rating = scrapy.Field()


class BooksSpiderSpider(CrawlSpider):
    name = 'books_spider'
    allowed_domains = []
    start_urls = [
        'https://example.com/books',
    ]

    rules = (
        Rule(LinkExtractor(restrict_css='a.next'), callback='parse_item', follow=True),
    )

    def parse_item(self, response):
        item = BookItem()
        item['title'] = response.css('h1::text').get()
        item['price'] = response.css('.price::text').get()
        item['rating'] = response.css('.star-rating::attr(class)').get()
        return item
```

## Tips

- **Use specific selectors**: The more specific your element selections, the better the generated selectors will be
- **Test incrementally**: Start with a simple spider and add complexity gradually
- **Refine selectors**: You can edit the generated code to refine CSS/XPath selectors
- **Clear configuration**: Use the "Clear All" button to start fresh

## Technical Details

### File Structure
- `manifest.json` - Chrome extension manifest
- `popup.html` - Extension popup interface
- `popup.js` - Popup logic and spider code generation
- `content.js` - DOM element selection and interaction
- `content.css` - Styles for element highlighting
- `background.js` - Background service worker
- `icons/` - Extension icons

### Storage
Configuration is stored using Chrome's `storage.local` API and persists between browser sessions.

### Selector Generation
The extension attempts to generate optimal CSS selectors by:
1. Using element IDs when available
2. Using unique class combinations
3. Building element paths with nth-of-type selectors
4. Falling back to structural selectors

## Limitations

- Only generates CrawlSpider spiders (not generic Scrapy spiders)
- CSS selectors are preferred; XPath support is basic
- Generated code may need manual refinement for complex scenarios
- Does not handle JavaScript-rendered content (use Scrapy-Splash for that)

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

See LICENSE file for details.
