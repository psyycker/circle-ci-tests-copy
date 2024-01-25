chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
  chrome.scripting.executeScript({
    target: { tabId: tabs[0].id },
    files: ['content.js']
  });
});

//function to make sure that all strings in an array are unique
function unique(arr) {
  return [...new Set(arr)];
}

function getButton() {
  return document.getElementById('parse-btn');
}

//Add event listener on document when the dom is loaded
document.addEventListener('DOMContentLoaded', function() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const regex = /https:\/\/app\.circleci\.com\/pipelines\/github\/[^/]+\/[^/]+\/[0-9]+\/workflows\/[a-zA-Z0-9-]+\/jobs\/[0-9]+\/tests/;
    const tab = tabs[0];
    const {url} = tab;
    if (!regex.test(url)) {
      const btn = getButton();
      btn.innerText = 'Not on Circle-ci tests';
      btn.disabled = true;
    }
  });
  document.getElementById('parse-btn').addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'parsePage' }, response => {
        const filtered = response.items.filter((item, index) => index % 2);
        const button = getButton();
        if (filtered == null || filtered.length === 0) {
          button.classList.add('btn-fail')
          button.innerText = 'No tests found';
          return;
        }
        navigator.clipboard.writeText(unique(filtered).join(' '))
        button.classList.add('btn-success');
        button.innerText = 'Copied!';
      });
    });
  });
})