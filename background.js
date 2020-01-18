chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({pureProblemLinks: true}, function() {
      console.log('Default options set');
    });
  });