// Popup script to manage the Spider configuration
let config = {
  spiderName: '',
  itemName: '',
  fields: [],
  startUrls: [],
  linkRules: [],
  parseFields: []
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
      parseFields: []
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
  
  let code = `import scrapy
from scrapy.linkextractors import LinkExtractor
from scrapy.spiders import CrawlSpider, Rule


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

  return code;
}
