let blackList = document.getElementById('blacklistDiv');

let otherOpts = document.getElementById('otherOpts');

let clearButton = document.getElementById('clearDiv');

function constructOptions() {
    let text = document.getElementById('blacklistInput');
    let button = document.createElement('button');
    let time = document.getElementById('workUntil');
    var date = new Date(); // date to autofill
    // following lines are to get and then concat each piece i need into a string
    var month = date.getMonth() + 1; 
    var day = date.getDate()
    var year = date.getFullYear();
    var hours = date.getHours();
    var mins = date.getMinutes();
    var seconds = date.getSeconds();
    if(month / 10 < 1){
      month = "0"+month; // extra zero if single digit
    }
    if(day / 10 < 1){
      day = "0" + day; // extra zero if single digit
    }
    if(mins / 10 < 1){
      mins = "0" + mins // extra zero if single digit
    }
    if(seconds / 10 < 1){
      seconds = "0" + seconds; // extra zero if single digit
    }
    var concat = year +"-"+month+"-"+day+"T"+hours+":"+mins+":"+seconds
    time.value = concat
    let timeEnter = document.createElement('button');
    let clear = document.createElement('button');
    clear.innerHTML = 'Clear Blacklist';
    button.innerHTML = 'Enter';
    timeEnter.innerHTML = 'Enter';
    timeEnter.style.width = '70px';
    button.style.width = '70px'
    button.addEventListener('click', function() { // button to add item to blacklist clicked
      chrome.storage.sync.get({
        list:[]
      },
      function(data){
        data.list.push(text.value)
        console.log(data.list);
        chrome.storage.sync.set({list:data.list}, function() { // when button clicked get the list and then append new data to it and store it
          console.log('item ' + text.value + ' appended') ;
          text.value = "";
        })

      })
    });
    clear.addEventListener('click', function(){ // reset blacklist button clicked
      chrome.storage.sync.set({list:[]},function(){
        console.log('list reset.')
      })
    })
    timeEnter.addEventListener('click', function(){
      chrome.storage.sync.set({'userCausedHours':0}, function(){ // user caused hours set to zero if time changed
        console.log('user caused hour increments reset.')
      })
      chrome.storage.sync.set({'hours': 0}, function() { // hours set to zero if time changed
        console.log('hours = 0') ;
      })
      var until = new Date(time.value) // new date with time inputted by user
      var d = new Date();
      var diff = until - d; // difference between now and time inputted
      console.log(diff);
      diff = diff / 60000; // difference as minutes
      chrome.storage.sync.set({'time': time.value}, function(){
        console.log('new time value stored.')
      })
      chrome.storage.sync.set({'originalTime': diff}, function(){ // store original time ot calculate propotion later
        console.log('new time value stored.')
      })

    })
    blackList.appendChild(button); // append dom element created (blacklist button)
    otherOpts.appendChild(timeEnter); // append dom element created (time enter button)
    clearButton.appendChild(clear); // append dom element created (clear blacklist button)
}
constructOptions(); // call function to create page