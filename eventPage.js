var menuItem = {
    "id": "latynsha",
    "title": "Latynshaga audaru",
    "contexts": ["selection"]
};

chrome.contextMenus.create(menuItem);

chrome.contextMenus.onClicked.addListener(function(clickData) {
    //alert( clickData.selectionText );

    chrome.storage.sync.set({ 'azat': clickData.selectionText }, function() {});

    chrome.storage.sync.get(['azat'], function(text) {

        window.open(chrome.extension.getURL("popup.html"), "gc-popout-window", "width=418,height=600");
    });
});