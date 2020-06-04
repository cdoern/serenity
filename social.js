 /*
  * social.js
  * Name: Charlie Doern
  * Last Updated: 6/4/2020
  * Purpose: script which handles the social page for serenity
  */
 

let friendDiv = document.getElementById('addFriend'); // div for friend adding
let friendEnter = document.createElement('button'); // create button to add friend to your list
let friendText = document.getElementById('friendInput'); // text input for which friend you'd like to add
let friendPE = document.getElementById('friendButton'); // button to look at friend leaderboard
friendEnter.innerHTML = 'Enter';
friendEnter.style.width = '70px';
friendEnter.style.padding = '2px';
friendEnter.addEventListener('click', function(){ // event listener for adding new friend
    try{ // try getting user if set
        chrome.storage.sync.get('user', function(userData){ 
            $.post(                         //call the server
                "https://www.cdoern.com/addFriend.php",      //At this url
                {
                    friend: friendText.value,
                    user: userData.user
    
                }                               //And send this data to it
            ).done(                             //And when it's done
                function()
                {
                   console.log('friend added successfully'); 
                   location.reload(); // reload page so the text typed goes away
                }
            );
        })
    }
    catch(err){ // if user not set tell them they need to set it up
        alert('Your Serenity profile isn\'t set up yet! go to the options page to claim your username before adding friends.');
    }
})

var form = document.createElement('form'); // create form so we can pass username via post
form.method = 'post';
form.action = 'https://www.cdoern.com/friend.php';
var input = document.createElement('input');
var hiddenData = document.createElement('input');
hiddenData.type = 'hidden';
 hiddenData.name = 'user';
hiddenData.id = 'user';
input.type = 'submit';
input.name = 'submit';
input.id = 'submit';
input.value = 'Friend Leaderboard';
 try{ // again try getting user
     chrome.storage.sync.get('user', function(data){
           hiddenData.value = data.user; // this is the most important part, this is what we are passing to the php script
           console.log(input.value);
     })
 }
 catch(err){ // if user is not set up yet just pass some random name
    hiddenData.value = "INCORRECT";
 }
        
form.appendChild(input);
form.appendChild(hiddenData);
friendDiv.appendChild(friendEnter);
friendPE.appendChild(form);
