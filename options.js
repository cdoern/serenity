 /*
  * options.js
  * Name: Charlie Doern
  * Last Updated: 6/4/2020
  * Purpose: script which handles the options page for serenity google chrome extension
  */
 
let blackList = document.getElementById('blacklistDiv');

let otherOpts = document.getElementById('otherOpts');

let clearButton = document.getElementById('clearDiv');

let userOpts = document.getElementById('userOpts');

let userInfo = document.getElementById('userInfo');

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
    if(hours / 10 < 1){ // extra zero if single digit
      hours = "0" + hours;
    }
    if(seconds / 10 < 1){
      seconds = "0" + seconds; // extra zero if single digit
    }
    var concat = year +"-"+month+"-"+day+"T"+hours+":"+mins+":"+seconds
    time.value = concat
    let timeEnter = document.createElement('button');
    let clear = document.createElement('button');
    let userEnter = document.createElement('button');
    let userText = document.getElementById('userInput');
    clear.innerHTML = 'Clear Blacklist';
    clear.style.padding = '3px';
    button.innerHTML = 'Enter';
    button.style.padding = '2px';
    timeEnter.innerHTML = 'Enter';
    timeEnter.style.width = '70px';
    timeEnter.style.padding = '2px';
    button.style.width = '70px'
    userEnter.innerHTML = 'Enter';
    userEnter.style.padding = '2px';
    userEnter.style.width = '70px';
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
          location.reload();
        })

      })
    });
    clear.addEventListener('click', function(){ // reset blacklist button clicked
      chrome.storage.sync.set({list:[]},function(){
        console.log('list reset.')
        location.reload();
      })
    })
    timeEnter.addEventListener('click', function(){
      var until = new Date(time.value) // new date with time inputted by user
      var d = new Date();
      var diff = until - d; // difference between now and time inputted
      console.log(diff);
      if(!Number.isNaN(diff)){ // this makes sure a blank date isnt entered
      var phase = Math.round(Math.random() * 1)
      chrome.storage.sync.set({'moonPhase': phase}, function(){
        console.log('moon phase chosen: ' + phase);
      })
      chrome.storage.sync.set({'userCausedHours':0}, function(){ // user caused hours set to zero if time changed
        console.log('user caused hour increments reset.')
      })
      chrome.storage.sync.set({'hours': 0}, function() { // hours set to zero if time changed
        console.log('hours = 0') ;
      })
      diff = diff / 60000; // difference as minutes
      chrome.storage.sync.set({'time': time.value}, function(){
        console.log('new time value stored.')
      })
      chrome.storage.sync.set({'originalTime': diff}, function(){ // store original time ot calculate propotion later
        console.log('new time value stored.')
      })
      chrome.storage.sync.set({'infiniteMode': 0}, function(){ // reset inf mode if it was going
        console.log('infinite mode ended');
      })
      location.reload(); // reload so current session is displayed
    }
    })
    userEnter.addEventListener('click', function(){ // if they want to set their user name
      $.post(                         //call the server
        "https://www.cdoern.com/addUser.php",      //At this url
        {
            user: userText.value
        }                               //And send this data to it
    ).done(                             //And when it's done
        function(data)
        {
            if(data == "new user"){ // if the username is available
              console.log('success');
              try{ // try getting user if already set
              chrome.storage.sync.get('user', function(data){
            if(data.user != userText.value && data.user != undefined && data.user != null){ // if this user already hasa name and this is a new one, we need to replace
              $.post(                             //call the server
                "https://www.cdoern.com/replaceUser.php",                     //At this url
                {
                    oldUser: data.user,
                    user: userText.value
                }                               //And send this data to it
            ).done(
              function(){
                console.log('user successfully replaced in table...')
                chrome.storage.sync.set({'user': userText.value}, function(){
                  console.log('user value updated in chrome storage'); // insert new name into chrome storage
                })
                setTimeout(function(){location.reload()}, 2000)  //reload so everything displays nicely
              } 
            );
            }
           if(data.user == undefined || data.user == null){ // if no error but indefined
              $.post(   
                "https://www.cdoern.com/insertUser.php",                     //At this url
                {
                    user: userText.value
                }                               //And send this data to it
            ).done(
              function(){
                console.log('user successfully inserted into table...')
                chrome.storage.sync.set({'user': userText.value}, function(){
                  console.log('intial val of user stored in chrome storage'); // store in chrome first
                })
                  setTimeout(function(){location.reload()}, 2000)  //reload so displays nicely
              } 
            );
            }
          }) // end chrome storage retrieval 
          }
          catch(err){ // if there is no user set up yet we need to insert not replace
            console.log('error: '+err); 
              $.post(   
              "https://www.cdoern.com/insertUser.php",                     //At this url
              {
                  user: userText.value
              }                               //And send this data to it
          ).done(
            function(){
              console.log('user successfully inserted into table...')
              chrome.storage.sync.set({'user': userText.value}, function(){
                console.log('intial val of user stored in chrome storage'); // store in chrome first
              })
                setTimeout(function(){location.reload()}, 2000)  //reload so displays nicely
            } 
          ); 
          }
        }  //Update here with the response
      } 
    );
  })
    blackList.appendChild(button); // append dom element created (blacklist button)
    otherOpts.appendChild(timeEnter); // append dom element created (time enter button)
    clearButton.appendChild(clear); // append dom element created (clear blacklist button)
    userOpts.appendChild(userEnter); // append dom element created (set user name)
    
    try{ // try getting current username to print
      chrome.storage.sync.get('user', function(data){
        if(data.user != undefined && data.user != null){
        userInfo.innerHTML += "<p> Current username: " + data.user + "</p>"; // add this to html so the users current name is displayed
        }
        else{
          userInfo.innerHTML += "<p> Current username: </p>"; // add this to html so the default blank is displayed instead of undefined
        }
      })
    }
    catch(err){
      userInfo.innerHTML += "<p> Current username: </p>"; // else just print a blank bc no user set up
    }

    currentList.innerHTML = "<br> Current Blacklist: <br>"; // add as header before printing current blacklist
    chrome.storage.sync.get({list:[]}, function(data){
      data.list.forEach(element => { // print each element in the list
      currentList.innerHTML += element + " <br>"
      });
    })
    currentSession.innerHTML = "<br> Current Session Information: <br> <br>";
    chrome.storage.sync.get('time', function(data){
      chrome.storage.sync.get('infiniteMode', function(inf){
      if((data.time != null || data.time != undefined) && inf.infiniteMode != 1){ // if in an active session
        var str = data.time.replace("T", " "); // make more reader friendly
        currentSession.innerHTML += "Working Until: " + str; // add time working until to the page
      }
      else if(inf.infiniteMode == 1){
        currentSession.innerHTML += "<span>&infin;</span>"
      }
    })
  })
}
constructOptions(); // call function to create page