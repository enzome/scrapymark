// Popup script to manage the Spider configuration
let config = {
  spiderName: '',
  itemName: '',
  fields: [],
  startUrls: [],
  linkRules: [],
  parseFields: [],
  outputFormat: 'json',
  webhookUrl: ''
};

// Load saved configuration
chrome.storage.local.get(['spiderConfig'], (result) => {
  if (result.spiderConfig) {
    config = result.spiderConfig;
    updateUI();
  }
});

// Save configuration
function saveConfig() {
  chrome.storage.local.set({ spiderConfig: config });
}

// Update UI elements
function updateUI() {
  document.getElementById('spiderName').value = config.spiderName || '';
  document.getElementById('itemName').value = config.itemName || '';
  updateFieldsList();
  updateUrlsList();
  updateLinkRulesList();
  updateParseFieldsList();
  updateOutputFormatUI();
}

// Spider name input
document.getElementById('spiderName').addEventListener('input', (e) => {
  config.spiderName = e.target.value;
  saveConfig();
});

// Item name input
document.getElementById('itemName').addEventListener('input', (e) => {
  config.itemName = e.target.value;
  saveConfig();
});

// Add field button
document.getElementById('addFieldBtn').addEventListener('click', async () => {
  const fieldName = prompt('Enter field name:');
  if (fieldName && fieldName.trim()) {
    config.fields.push(fieldName.trim());
    saveConfig();
    updateFieldsList();
  }
});

// Update fields list
function updateFieldsList() {
  const container = document.getElementById('itemFields');
  if (config.fields.length === 0) {
    container.innerHTML = '<div class="empty-state">No fields added yet</div>';
    return;
  }
  
  container.innerHTML = config.fields.map((field, index) => `
    <div class="field-item">
      <span>${field}</span>
      <button class="remove-btn" data-index="${index}" data-type="field">Remove</button>
    </div>
  `).join('');
  
  // Add event listeners for remove buttons
  container.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = parseInt(e.target.dataset.index);
      config.fields.splice(index, 1);
      saveConfig();
      updateFieldsList();
    });
  });
}

// Add URL button
document.getElementById('addUrlBtn').addEventListener('click', () => {
  const url = document.getElementById('startUrl').value;
  if (url && url.trim()) {
    config.startUrls.push(url.trim());
    document.getElementById('startUrl').value = '';
    saveConfig();
    updateUrlsList();
  }
});

// Update URLs list
function updateUrlsList() {
  const container = document.getElementById('startUrls');
  if (config.startUrls.length === 0) {
    container.innerHTML = '<div class="empty-state">No URLs added yet</div>';
    return;
  }
  
  container.innerHTML = config.startUrls.map((url, index) => `
    <div class="url-item">
      <span>${url}</span>
      <button class="remove-btn" data-index="${index}" data-type="url">Remove</button>
    </div>
  `).join('');
  
  // Add event listeners for remove buttons
  container.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = parseInt(e.target.dataset.index);
      config.startUrls.splice(index, 1);
      saveConfig();
      updateUrlsList();
    });
  });
}

// Select links to follow button
document.getElementById('selectLinkBtn').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  chrome.tabs.sendMessage(tab.id, { 
    action: 'startSelection',
    mode: 'link'
  });
  
  showStatus('Click on links you want to follow. Right-click or press ESC to finish.');
  window.close();
});

// Select item fields button
document.getElementById('selectItemBtn').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  chrome.tabs.sendMessage(tab.id, { 
    action: 'startSelection',
    mode: 'item'
  });
  
  showStatus('Click on elements to extract. Right-click or press ESC to finish.');
  window.close();
});

// Update link rules list
function updateLinkRulesList() {
  const container = document.getElementById('linkRules');
  if (config.linkRules.length === 0) {
    container.innerHTML = '<div class="empty-state">No link rules added yet</div>';
    return;
  }
  
  container.innerHTML = config.linkRules.map((rule, index) => `
    <div class="rule-item">
      <span>${rule.selector}</span>
      <button class="remove-btn" data-index="${index}" data-type="link">Remove</button>
    </div>
  `).join('');
  
  // Add event listeners for remove buttons
  container.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = parseInt(e.target.dataset.index);
      config.linkRules.splice(index, 1);
      saveConfig();
      updateLinkRulesList();
    });
  });
}

// Update parse fields list
function updateParseFieldsList() {
  const container = document.getElementById('parseFields');
  if (config.parseFields.length === 0) {
    container.innerHTML = '<div class="empty-state">No parse fields added yet</div>';
    return;
  }
  
  container.innerHTML = config.parseFields.map((field, index) => `
    <div class="parse-item">
      <span><strong>${field.name}:</strong> ${field.selector}</span>
      <button class="remove-btn" data-index="${index}" data-type="parse">Remove</button>
    </div>
  `).join('');
  
  // Add event listeners for remove buttons
  container.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = parseInt(e.target.dataset.index);
      config.parseFields.splice(index, 1);
      saveConfig();
      updateParseFieldsList();
    });
  });
}

// Update output format UI
function updateOutputFormatUI() {
  const outputFormat = config.outputFormat || 'json';
  const webhookUrl = config.webhookUrl || '';
  
  // Set radio button
  const radioButtons = document.querySelectorAll('input[name="outputFormat"]');
  radioButtons.forEach(radio => {
    radio.checked = radio.value === outputFormat;
  });
  
  // Set webhook URL
  document.getElementById('webhookUrl').value = webhookUrl;
  
  // Show/hide webhook URL input
  const webhookContainer = document.getElementById('webhookUrlContainer');
  webhookContainer.style.display = outputFormat === 'webhook' ? 'block' : 'none';
}

// Output format radio buttons
document.querySelectorAll('input[name="outputFormat"]').forEach(radio => {
  radio.addEventListener('change', (e) => {
    config.outputFormat = e.target.value;
    saveConfig();
    updateOutputFormatUI();
  });
});

// Webhook URL input
document.getElementById('webhookUrl').addEventListener('input', (e) => {
  config.webhookUrl = e.target.value;
  saveConfig();
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'addLinkRule') {
    config.linkRules.push(message.rule);
    saveConfig();
    updateLinkRulesList();
  } else if (message.action === 'addParseField') {
    config.parseFields.push(message.field);
    saveConfig();
    updateParseFieldsList();
  } else if (message.action === 'updateConfig') {
    // Reload config from storage
    chrome.storage.local.get(['spiderConfig'], (result) => {
      if (result.spiderConfig) {
        config = result.spiderConfig;
        updateUI();
      }
    });
  }
});

// Generate spider code
document.getElementById('generateBtn').addEventListener('click', () => {
  // Validate webhook URL if webhook output is selected
  if (config.outputFormat === 'webhook') {
    const webhookUrl = config.webhookUrl || '';
    if (!webhookUrl.trim()) {
      showStatus('Please enter a webhook URL for webhook output.');
      return;
    }
    // Basic URL validation
    try {
      new URL(webhookUrl);
    } catch (e) {
      showStatus('Please enter a valid webhook URL (e.g., https://example.com/webhook).');
      return;
    }
  }
  
  const spiderCode = generateSpiderCode();
  
  // Create a downloadable file
  const blob = new Blob([spiderCode], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${config.spiderName || 'spider'}.py`;
  a.click();
  URL.revokeObjectURL(url);
  
  showStatus('Spider code generated and downloaded!');
});

// Clear all configuration
document.getElementById('clearBtn').addEventListener('click', () => {
  if (confirm('Are you sure you want to clear all configuration?')) {
    config = {
      spiderName: '',
      itemName: '',
      fields: [],
      startUrls: [],
      linkRules: [],
      parseFields: [],
      outputFormat: 'json',
      webhookUrl: ''
    };
    saveConfig();
    updateUI();
    showStatus('Configuration cleared.');
  }
});

// Show status message
function showStatus(message) {
  const statusEl = document.getElementById('status');
  statusEl.textContent = message;
  statusEl.style.display = 'block';
  setTimeout(() => {
    statusEl.style.display = 'none';
  }, 3000);
}

// Generate Scrapy spider code
function generateSpiderCode() {
  const spiderName = config.spiderName || 'my_spider';
  const itemName = config.itemName || 'MyItem';
  const className = spiderName.split('_').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
  const outputFormat = config.outputFormat || 'json';
  const webhookUrl = config.webhookUrl || '';
  
  let code = `import scrapy
from scrapy.linkextractors import LinkExtractor
from scrapy.spiders import CrawlSpider, Rule
`;

  // Add webhook imports if needed
  if (outputFormat === 'webhook') {
    code += `import json
import requests
from scrapy import signals
from scrapy.exceptions import NotConfigured
`;
  }

  code += `

class ${itemName}(scrapy.Item):
`;

  if (config.fields.length === 0) {
    code += `    # Define your item fields here
    pass
`;
  } else {
    config.fields.forEach(field => {
      code += `    ${field} = scrapy.Field()
`;
    });
  }

  // Add webhook pipeline if needed
  if (outputFormat === 'webhook') {
    code += `


class WebhookPipeline:
    """Pipeline to POST scraped items to a webhook endpoint"""
    
    def __init__(self, webhook_url):
        self.webhook_url = webhook_url
        self.items_sent = 0
    
    @classmethod
    def from_crawler(cls, crawler):
        webhook_url = crawler.settings.get('WEBHOOK_URL')
        if not webhook_url:
            raise NotConfigured('WEBHOOK_URL setting is required')
        
        pipeline = cls(webhook_url)
        crawler.signals.connect(pipeline.spider_closed, signal=signals.spider_closed)
        return pipeline
    
    def process_item(self, item, spider):
        try:
            # Convert item to dict for JSON serialization
            item_dict = dict(item)
            
            # POST to webhook
            response = requests.post(
                self.webhook_url,
                json=item_dict,
                headers={'Content-Type': 'application/json'},
                timeout=10
            )
            response.raise_for_status()
            
            self.items_sent += 1
            spider.logger.info(f'Successfully sent item to webhook: {self.webhook_url}')
            
        except Exception as e:
            spider.logger.error(f'Failed to send item to webhook: {e}')
        
        return item
    
    def spider_closed(self, spider):
        spider.logger.info(f'Total items sent to webhook: {self.items_sent}')
`;
  }

  code += `

class ${className}Spider(CrawlSpider):
    name = '${spiderName}'
    allowed_domains = []
    start_urls = [
`;

  if (config.startUrls.length === 0) {
    code += `        # Add your start URLs here
`;
  } else {
    config.startUrls.forEach(url => {
      code += `        '${url}',
`;
    });
  }

  code += `    ]
`;

  // Add custom settings for webhook
  if (outputFormat === 'webhook') {
    code += `
    custom_settings = {
        'ITEM_PIPELINES': {
            '__main__.WebhookPipeline': 300,
        },
        'WEBHOOK_URL': '${webhookUrl}',
    }
`;
  }

  code += `
    rules = (
`;

  if (config.linkRules.length === 0) {
    code += `        # Add your link extraction rules here
        # Rule(LinkExtractor(restrict_css='a.link'), callback='parse_item', follow=True),
`;
  } else {
    config.linkRules.forEach(rule => {
      if (rule.selector.startsWith('//') || rule.selector.startsWith('/')) {
        code += `        Rule(LinkExtractor(restrict_xpaths='${rule.selector}'), callback='parse_item', follow=True),
`;
      } else {
        code += `        Rule(LinkExtractor(restrict_css='${rule.selector}'), callback='parse_item', follow=True),
`;
      }
    });
  }

  code += `    )

    def parse_item(self, response):
        item = ${itemName}()
`;

  if (config.parseFields.length === 0) {
    code += `        # Extract item fields here
        # item['field_name'] = response.css('selector::text').get()
`;
  } else {
    config.parseFields.forEach(field => {
      if (field.selector.startsWith('//') || field.selector.startsWith('/')) {
        code += `        item['${field.name}'] = response.xpath('${field.selector}').get()
`;
      } else {
        code += `        item['${field.name}'] = response.css('${field.selector}').get()
`;
      }
    });
  }

  code += `        return item
`;

  // Add usage instructions as comments
  code += `

# Usage instructions:
`;
  
  if (outputFormat === 'json') {
    code += `# Run the spider and output to JSON:
# scrapy runspider ${spiderName}.py -o output.json
`;
  } else if (outputFormat === 'csv') {
    code += `# Run the spider and output to CSV:
# scrapy runspider ${spiderName}.py -o output.csv
`;
  } else if (outputFormat === 'webhook') {
    code += `# Run the spider with webhook output:
# scrapy runspider ${spiderName}.py
# 
# Note: Items will be automatically POSTed to: ${webhookUrl}
# Each item is sent as a JSON object via HTTP POST request.
# You can also save to file simultaneously:
# scrapy runspider ${spiderName}.py -o output.json
`;
  }

  return code;
}
