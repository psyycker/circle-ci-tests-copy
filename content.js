chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'parsePage') {
    const items = document.querySelectorAll('[data-testid="copy-wrapper"]')

    const extractedItems = []

    items.forEach(item => extractedItems.push(item.innerText));

    // Send the like count back to the popup
    sendResponse({ items: extractedItems });
  }
});