let infiniteModeDiv = document.getElementById('infiniteMode');
let preFilledDiv = document.getElementById('preFilled');

function construct(){
    var x = document.createElement("INPUT");
    x.setAttribute("type", "checkbox"); // make this button a checkbox
    x.style.width = '30px'; // make button larger
    x.style.height = '30px'; // make button larger
    chrome.storage.sync.get('infiniteMode', function(data){ 
        if(data.infiniteMode == 1){ // if in an infinite session auto check the box so if they turn it off the proper thing happens
            x.checked = true;
        }
    })
    x.addEventListener('click', function(){ // infinite mode button clicked
        if(x.checked == true){ // if user is turning on infinite mode
        chrome.storage.sync.set({infiniteMode: 1}, function(){
            console.log('infinite mode initialized');
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
            var until = new Date() // new date to work until
            console.log(until.toString())
            var hours = until.getHours();
            until.setTime(until.getTime() + (1*60*60*1000)); // this makes the cycle oscilate in an hour long period
            var d = new Date();
            var diff = until - d; // difference between now and time inputted
            console.log(diff);
            diff = diff / 60000; // difference as minutes
           console.log(until.toString());
            chrome.storage.sync.set({'time': until.toString()}, function(){
              console.log('new time value stored.')
            })
            chrome.storage.sync.set({'originalTime': diff}, function(){ // store original time ot calculate propotion later
              console.log('new time value stored.')
            })
        })
        }
        else{ // else user turned off infinite mode
            chrome.storage.sync.set({infiniteMode: 0}, function(){
                console.log('infinite mode ended');
            })
        }
    })
    var dropDown = document.getElementById("dropDown"); // create drop down menu for auto filled list
    var title = document.createElement("option");
    title.text = "Choose an option below...";
    dropDown.options.add(title, 1);

    
    var socialMedia = document.createElement("option");
    socialMedia.text = "Social Media Starterpack: Reddit, Facebook, Twitter";
    dropDown.options.add(socialMedia, 2); // add option 1

    var videos = document.createElement("option");
    videos.text = "Creator/Video Starterpack: Youtube, Netflix, Hulu";
    dropDown.options.add(videos, 3); // add option 2

    var other = document.createElement("option");
    other.text = "Other Distracting Sites: Linkedin, Amazon, Pinterest";
    dropDown.options.add(other, 4); // add option 3

    dropDown.options[0].disabled = true; // make first item unclickable
    dropDown.options[0].defaultSelected = true; // make first item the title

    var go = document.createElement("button"); // button for selecting a pre filled
    go.innerHTML = 'Enter';


    go.addEventListener('click', function(){
        if(socialMedia.selected == true){ // if first item
            console.log('Social media pack selected...');
            var data = ['reddit.com', 'facebook.com', 'twitter.com'];
            chrome.storage.sync.set({list:data},function(){ // fill list w the first choice
                console.log('list set.')
              })
        }
        else if(videos.selected == true){ // if second item
            console.log('Video pack selected...');
            var data = ['youtube.com', 'netfix.com', 'hulu.com'];
            chrome.storage.sync.set({list:data},function(){ // fill list w the second choice
                console.log('list set.')
              })
        }
        else if(other.selected == true){ // if third item
            console.log('Other pack selected...');
            var data = ['linkedin.com', 'amazon.com', 'pinterest.com'];
            chrome.storage.sync.set({list:data},function(){ // fill list w the third choice
                console.log('list set.')
              })
        }
    })


    infiniteModeDiv.append(x) // append this button to the proper div
    preFilledDiv.append(go); // append selection button to the div
}

construct(); // call function
