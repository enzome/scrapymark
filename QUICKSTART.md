# Quick Start Guide

## Installation

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top-right)
4. Click "Load unpacked" and select the scrapymark folder
5. The ScrapyMark icon should appear in your extensions toolbar

## Basic Workflow

### Step 1: Configure Spider Basics
1. Click the ScrapyMark icon
2. Enter spider name: `my_spider`
3. Enter item name: `MyItem`

### Step 2: Define Data Fields
Click "Add Field" and add fields you want to extract:
- `title`
- `price`
- `description`

### Step 3: Add Starting Point
Enter the URL where the spider should start:
- Example: `https://example.com/products`
- Click "Add URL"

### Step 4: Select Links to Follow
1. Navigate to a page you want to scrape
2. Click "Select Links to Follow"
3. Click on links the spider should follow (e.g., pagination, category links)
4. Right-click or press ESC when done

### Step 5: Select Data to Extract
1. Navigate to a product/item page
2. Click "Select Item Fields"
3. Click on elements containing data (title, price, etc.)
4. Enter the field name when prompted
5. Right-click or press ESC when done

### Step 6: Generate Code
1. Review your configuration
2. Click "Generate Spider Code"
3. Save the downloaded `.py` file

### Step 7: Use Your Spider
Place the file in your Scrapy project's `spiders/` folder:
```bash
scrapy crawl my_spider -o output.json
```

## Tips

- **Start simple**: Begin with 1-2 fields and expand
- **Be specific**: Click exactly on the element containing the data
- **Test selections**: You can remove and re-add selections
- **Preview code**: The generated code uses CSS selectors by default
- **Refine later**: Generated code can be manually edited for fine-tuning

## Common Issues

**Extension not appearing?**
- Make sure Developer mode is enabled
- Refresh the extensions page

**Selections not working?**
- The page must be fully loaded
- Some dynamic content may not work
- Try on a simpler static page first

**Generated selectors too complex?**
- Manually simplify them in the generated code
- Use browser DevTools to find better selectors

## Next Steps

After generating your spider:
1. Review the generated code
2. Test it on a small scale: `scrapy crawl my_spider -o test.json`
3. Refine selectors if needed
4. Add error handling and data cleaning
5. Scale up your scraping!
