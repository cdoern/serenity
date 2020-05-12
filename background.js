 /*
  * background.js
  * Name: Charlie Doern
  * Last Updated: 5/11/2020
  * Purpose: background script for serenity google chrome extension
  */
 
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
          chrome.storage.sync.get(['hours'], function(h){
            console.log('hours:' + h.hours);
            var timeGone = 12 - h.hours; // how to determine if we are stillw/in a proper time frame (virtually)
          if(data.time != null  && data.time != undefined && timeGone < 12.6){ // if we are in an active session and not in a session where lone worker has run out of time already...
            if(!doit){ // just in case the user put the same site in the list twice
            alert('You are visiting one of your blacklisted sites! The worker now has less time to finish his presentation!');
            doit = true;
            }
          chrome.storage.sync.get(['userCausedHours'], function(data2) {
              console.log(data2.userCausedHours)
              chrome.storage.sync.set({'userCausedHours': data2.userCausedHours + 0.2}, function() {
                  console.log('hours = ' + data2.userCausedHours + 0.2) ;
                })
            });
          }
          })
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
            chrome.storage.sync.get(['hours'], function(h){
              console.log('hours:' + h.hours);
              var timeGone = 12 - h.hours; // how to determine if we are stillw/in a proper time frame (virtually)
            if(data.time != null && data.time != undefined && timeGone < 12.6){ // if we are in an active session and not in a session where lone worker has run out of time already...
              if(!doit){ // just in case the user put the same site in the list twice
              alert('You are visiting one of your blacklisted sites! The worker now has less time to finish his presentation!');
              doit = true;
              }
            chrome.storage.sync.get(['userCausedHours'], function(data2) {
                console.log(data2.userCausedHours)
                chrome.storage.sync.set({'userCausedHours': data2.userCausedHours + 0.2}, function() {
                    console.log('hours = ' + data2.userCausedHours + 0.2) ;
                  })
              });
            }
            })
          })
        }
      }
  });
  })
  }); 

  var alreadyPop = false;

  setInterval(getTimeData, 1000);

  function getTimeData(){
    console.log(alreadyPop);
    chrome.storage.sync.get('time', function(data){
      chrome.storage.sync.get('originalTime', function(orig){
        chrome.storage.sync.get('userCausedHours', function(uch){
        if(data.time != null && data.time != undefined){ // if active session
        console.log(data.time);
        var until = new Date(data.time)
        var d = new Date();
        var diff = until - d; // calculates ms left
        console.log(diff);
        console.log(diff / 60000);
        diff /= 60000; // converts to mins
        hoursleft =((diff * 12) / orig.originalTime); // minutes left as a propotion of 12 hours (so now it is hours left)
        hoursgone = ((12 - hoursleft) + uch.userCausedHours)
        if(diff > 0 && hoursgone < 12.6){
          alreadyPop = false; // reset this boolean or else once it is true the popups will never happen for future sessions
        }
        if(diff < 0 && !alreadyPop){ // if just ran out of time
          chrome.storage.sync.set({'time': null}, function(){
            console.log('timer reset either from previous session or from current...');
          })
          alert('Your timer has ended!');
          alreadyPop = true;
        }
        else if(diff > 0){ // if out of hours but not time then uch caused this
          if(hoursgone >= 12.6 && !alreadyPop){
            alert('The lone worker has run out of hours before your time was completed.... Your timer will contiue.');
            alreadyPop = true;
          }
        }
      }
      });
    });
  });


  }
