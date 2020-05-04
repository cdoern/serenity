 
 chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){ // listener for when first loading the page
  var doit = false;
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
            if(!doit){ // just in case the user put the same site in the list twice
            alert('You are visiting one of your blacklisted sites! The worker now has one less hour to finish his presentation!');
            doit = true;
            }
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
    var doit = false;
    var sites = [];
        chrome.storage.sync.get({list:[]}, function(data){ // retrieve list of blackListed sites
              sites = data.list;
              console.log(sites);
  chrome.tabs.get(activeInfo.tabId, function(tab){
      console.log(tab.url);
      for(var i = 0; i < sites.length; i++){
        if(tab.url.includes(sites[i])){
          chrome.storage.sync.get(['time'], function(data){
            if(data.time != null){ // if we are in an active session
              if(!doit){ // just in case the user put the same site in the list twice
              alert('You are visiting one of your blacklisted sites! The worker now has one less hour to finish his presentation!');
              doit = true;
              }
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
