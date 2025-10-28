// Content script for DOM element selection
let selectionMode = null; // 'link' or 'item'
let isSelecting = false;
let highlightedElement = null;
let selectedElements = [];

// Start selection mode
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'startSelection') {
    startSelection(message.mode);
  }
});

function startSelection(mode) {
  selectionMode = mode;
  isSelecting = true;
  selectedElements = [];
  
  // Add event listeners
  document.addEventListener('mouseover', handleMouseOver, true);
  document.addEventListener('mouseout', handleMouseOut, true);
  document.addEventListener('click', handleClick, true);
  document.addEventListener('contextmenu', finishSelection, true);
  document.addEventListener('keydown', handleKeyDown, true);
  
  // Show notification
  showNotification(`Selection mode: ${mode === 'link' ? 'Links to Follow' : 'Item Fields'}. Click elements to select. Right-click or ESC to finish.`);
}

function handleMouseOver(e) {
  if (!isSelecting) return;
  
  e.preventDefault();
  e.stopPropagation();
  
  // Remove previous highlight
  if (highlightedElement) {
    highlightedElement.classList.remove('scrapymark-highlight');
  }
  
  // Add highlight to current element
  highlightedElement = e.target;
  highlightedElement.classList.add('scrapymark-highlight');
}

function handleMouseOut(e) {
  if (!isSelecting) return;
  
  e.preventDefault();
  e.stopPropagation();
  
  if (e.target === highlightedElement) {
    e.target.classList.remove('scrapymark-highlight');
  }
}

function handleClick(e) {
  if (!isSelecting) return;
  
  e.preventDefault();
  e.stopPropagation();
  
  const element = e.target;
  
  // Toggle selection
  if (element.classList.contains('scrapymark-selected')) {
    element.classList.remove('scrapymark-selected');
    selectedElements = selectedElements.filter(el => el !== element);
  } else {
    element.classList.add('scrapymark-selected');
    selectedElements.push(element);
  }
  
  showNotification(`Selected ${selectedElements.length} element(s). Right-click or ESC to finish.`);
}

function handleKeyDown(e) {
  if (!isSelecting) return;
  
  if (e.key === 'Escape') {
    e.preventDefault();
    finishSelection(e);
  }
}

function finishSelection(e) {
  if (!isSelecting) return;
  
  e.preventDefault();
  e.stopPropagation();
  
  // Remove event listeners
  document.removeEventListener('mouseover', handleMouseOver, true);
  document.removeEventListener('mouseout', handleMouseOut, true);
  document.removeEventListener('click', handleClick, true);
  document.removeEventListener('contextmenu', finishSelection, true);
  document.removeEventListener('keydown', handleKeyDown, true);
  
  // Remove highlights
  if (highlightedElement) {
    highlightedElement.classList.remove('scrapymark-highlight');
  }
  
  // Process selected elements
  processSelectedElements();
  
  // Clean up
  selectedElements.forEach(el => {
    el.classList.remove('scrapymark-selected');
  });
  
  isSelecting = false;
  selectionMode = null;
  selectedElements = [];
  
  hideNotification();
}

function processSelectedElements() {
  if (selectedElements.length === 0) {
    showNotification('No elements selected.', 2000);
    return;
  }
  
  // Capture selectedElements and selectionMode before async operation
  const elementsToProcess = selectedElements.slice();
  const currentMode = selectionMode;
  
  chrome.storage.local.get(['spiderConfig'], (result) => {
    let config = result.spiderConfig || {
      spiderName: '',
      itemName: '',
      fields: [],
      startUrls: [],
      linkRules: [],
      parseFields: []
    };
    
    elementsToProcess.forEach(element => {
      const selector = getOptimalSelector(element);
      
      if (currentMode === 'link') {
        // Add link rule
        const rule = {
          selector: selector,
          element: element.tagName.toLowerCase()
        };
        
        // Avoid duplicates
        if (!config.linkRules.some(r => r.selector === rule.selector)) {
          config.linkRules.push(rule);
        }
      } else if (currentMode === 'item') {
        // Ask for field name
        const fieldName = prompt('Enter field name for this element:', getDefaultFieldName(element));
        
        if (fieldName && fieldName.trim()) {
          const field = {
            name: fieldName.trim(),
            selector: selector,
            element: element.tagName.toLowerCase()
          };
          
          // Avoid duplicates
          if (!config.parseFields.some(f => f.name === field.name)) {
            config.parseFields.push(field);
            
            // Also add to item fields if not already there
            if (!config.fields.includes(field.name)) {
              config.fields.push(field.name);
            }
          }
        }
      }
    });
    
    // Save updated config
    chrome.storage.local.set({ spiderConfig: config }, () => {
      showNotification(`Added ${elementsToProcess.length} ${currentMode === 'link' ? 'link rule(s)' : 'parse field(s)'}`, 2000);
      
      // Notify popup to update
      chrome.runtime.sendMessage({ action: 'updateConfig' });
    });
  });
}

function getOptimalSelector(element) {
  // Try to get a unique CSS selector
  
  // Check for ID
  if (element.id) {
    return `#${element.id}`;
  }
  
  // Check for unique class combination
  if (element.className && typeof element.className === 'string') {
    const classes = element.className.trim().split(/\s+/).filter(c => c && !c.startsWith('scrapymark-'));
    if (classes.length > 0) {
      const classSelector = element.tagName.toLowerCase() + '.' + classes.join('.');
      if (document.querySelectorAll(classSelector).length === 1) {
        return classSelector;
      }
      // Try with just the first class
      const simpleSelector = element.tagName.toLowerCase() + '.' + classes[0];
      return simpleSelector;
    }
  }
  
  // Try to build a path from parent
  const path = [];
  let current = element;
  
  while (current && current !== document.body && path.length < 5) {
    let selector = current.tagName.toLowerCase();
    
    // Add nth-child if needed
    if (current.parentElement) {
      const siblings = Array.from(current.parentElement.children).filter(
        child => child.tagName === current.tagName
      );
      
      if (siblings.length > 1) {
        const index = siblings.indexOf(current) + 1;
        selector += `:nth-of-type(${index})`;
      }
    }
    
    path.unshift(selector);
    current = current.parentElement;
  }
  
  return path.join(' > ');
}

function getDefaultFieldName(element) {
  // Try to infer a good field name from context
  const tag = element.tagName.toLowerCase();
  
  if (tag === 'h1' || tag === 'h2' || tag === 'h3') {
    return 'title';
  } else if (tag === 'img') {
    return 'image';
  } else if (tag === 'a') {
    return 'link';
  } else if (element.className && typeof element.className === 'string') {
    const classes = element.className.trim().split(/\s+/);
    if (classes.length > 0) {
      return classes[0].replace(/[^a-zA-Z0-9_]/g, '_');
    }
  }
  
  return 'field';
}

let notificationElement = null;

function showNotification(message, timeout = null) {
  if (!notificationElement) {
    notificationElement = document.createElement('div');
    notificationElement.className = 'scrapymark-notification';
    document.body.appendChild(notificationElement);
  }
  
  notificationElement.textContent = message;
  notificationElement.style.display = 'block';
  
  if (timeout) {
    setTimeout(() => {
      hideNotification();
    }, timeout);
  }
}

function hideNotification() {
  if (notificationElement) {
    notificationElement.style.display = 'none';
  }
}
