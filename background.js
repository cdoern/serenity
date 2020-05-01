

chrome.runtime.onInstalled.addListener(function() {
 chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){ // listener for when first loading the page
   var url = tab.url;
   console.log(url);
   if(url != undefined && changeInfo.status == "complete"){ // if the page is done loading, this is done bc .onUpdated has issues with multiple misfires
     console.log(url);
     var sites = [];
     chrome.storage.sync.get({list:[]}, function(data){ // retrieve list of blackListed sites
      sites = data.list;
      console.log(sites);
     for(var i = 0; i < sites.length; i++){
      if(tab.url.includes(sites[i])){
        chrome.storage.sync.get(['time'], function(data){
          if(data.time != null){ // if we are in an active session
          chrome.storage.sync.get(['userCausedHours'], function(data2) {
              console.log(data2.userCausedHours)
              chrome.storage.sync.set({'userCausedHours': data2.userCausedHours + 1}, function() {
                  console.log('hours = ' + data2.userCausedHours + 1) ;
                })
            });
          }
          })
        }
      }
   })
}
});
  chrome.tabs.onActivated.addListener(function(activeInfo) { // listener for when flipping back and forth between pages
    var sites = [];
        chrome.storage.sync.get({list:[]}, function(data){ // retrieve list of blackListed sites
              sites = data.list;
              console.log(sites);
  // how to fetch tab url using activeInfo.tabid
  chrome.tabs.get(activeInfo.tabId, function(tab){
      console.log(tab.url);
      for(var i = 0; i < sites.length; i++){
        if(tab.url.includes(sites[i])){
          chrome.storage.sync.get(['time'], function(data){
            if(data.time != null){ // if we are in an active session
            chrome.storage.sync.get(['userCausedHours'], function(data2) {
                console.log(data2.userCausedHours)
                chrome.storage.sync.set({'userCausedHours': data2.userCausedHours + 1}, function() {
                    console.log('hours = ' + data2.userCausedHours + 1) ;
                  })
              });
            }
            })
        }
      }
  });
  })
  }); 
  });
    