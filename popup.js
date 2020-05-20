 /*
  * popup.js
  * Name: Charlie Doern
  * Last Updated: 5/18/2020
  * Purpose: script which handles the popup and its information for serenity google chrome extension
  */
 
var hoursgone = 0;
timeLeft();
function timeLeft(){
chrome.storage.sync.get('infiniteMode', function(inf){
  chrome.storage.sync.get('time', function(data){
    chrome.storage.sync.get('originalTime', function(orig){
    console.log(data.time);
    var until = new Date(data.time)
    var d = new Date();
    var diff = until - d; // calculates ms left
    console.log(diff);
    console.log(diff / 60000);
    diff /= 60000; // converts to mins
    console.log('infinite mode: ' + inf.infiniteMode);
    if((diff < 0 || data.time == null || data.time == undefined) && (inf.infiniteMode == 0 || inf.infiniteMode == null || inf.infiniteMode == undefined)){
      chrome.storage.sync.set({'hours': 12}, function(){ // if diff if negative (timer is done) then set hours to 12 so the page refreshes to have the right data
        console.log('hours set to 12');
      })
      chrome.storage.sync.set({'time': null}, function(){
        console.log('done, resetting time...')
      })
      chrome.storage.sync.set({'userCausedHours': 0}, function(){
        console.log('done, resetting user caused hours passed...')
      })
      var g = document.getElementById('city'); // need to declare graphics in here as nothing will get drawn if you don't
      var ctx = g.getContext("2d");
      ctx.beginPath()
      ctx.globalCompositeOperation = 'destination-under'
      ctx.fillStyle = "#141852";
      ctx.fillRect(0, 0, 400, 400);
      ctx.closePath();

      ctx.fillStyle = "#a66300";
      ctx.fillRect(0, 100, 150, 200); // left building draw
      ctx.fillStyle = "#c7be40";
      ctx.fillRect(150, 195, 120, 105); // middle building draw
      ctx.fillStyle = "#0f045c";
      ctx.fillRect(270, 100, 130, 200) // right building draw
      ctx.fillStyle = "#808080";
      ctx.fillRect(0,300, 400, 15)
      ctx.fillStyle = "#000000";
      ctx.strokeStyle = "#000000";
      ctx.fillRect(0, 315, 400, 85) // road rectangle
      ctx.beginPath();
      ctx.moveTo(0, 300);
      ctx.lineTo(400, 300); // sidewalk line 1
      ctx.moveTo(0, 315)
      ctx.lineTo(400, 315); // sidewalk line 2
      ctx.closePath();
      ctx.stroke();
      ctx.strokeStyle = "#f2eb24";
      for(var i = 10; i < 380; i+=30){ // to draw yellow street lines
        ctx.beginPath();
        ctx.moveTo(i, 360);
        ctx.lineTo(i + 20, 360);
        ctx.closePath();
        ctx.stroke();
      }
    
    // lines 56-115 are for the deafult screen so there is repeated code
      ctx.fillStyle = "#f5ed00";
      ctx.fillRect(218, 205, 35, 12); // fill guys window with light
    
      ctx.fillStyle = "#000000";
      ctx.strokeStyle = "#000000";
      ctx.beginPath()
      ctx.arc(233, 210, 3,0, 2*Math.PI); // guys head
      ctx.closePath();
      ctx.fill()
      ctx.moveTo(233, 210);
      ctx.lineTo(233, 218); // guys body
      ctx.stroke();
    
      ctx.fillRect(243, 207, 6, 6); // computer
      ctx.fillRect(240, 212, 10, 6 ); // computer
  
     ctx.fillStyle = "#B6D9EE"
     ctx.fillRect(243,207, 2,5); // blue light from computer


     ctx.fillStyle = "#000000"; 
     ctx.fillRect(153, 160, 5, 140); // lamp post
     ctx.fillRect(153, 160, 18, 2);
  
      ctx.fillStyle = "#FFEA61";
      ctx.beginPath();
      ctx.arc(164, 162, 6, 0, Math.PI) // lamp light
      ctx.closePath();
      ctx.stroke();
      ctx.fill();

      for(var i = 10; i < 150 ; i+=40){ // windows for left building
        for(var j = 110; j < 290; j+= 20 ){
            ctx.fillStyle = "#000000";
          ctx.fillRect(i, j, 10, 10)
        }
      }
      
     for( var i = 290; i < 400; i+=40){ // windows for right building
        for(var j = 110; j < 290; j+= 20){
            ctx.fillStyle = "#000000";
          ctx.fillRect(i, j, 10, 10);
        }
     }
    
     for(var i = 168; i < 260; i+= 50){ // windows for middle building
       for(var j = 205; j < 270; j+= 28){
        var rand = Math.random();
        if(i != 218 || j != 205){ // if  not top right window
          ctx.fillStyle = "#000000";
          ctx.fillRect(i, j, 35, 12);
         }
       }
     }
      ctx.fillStyle = "#ffffff";
      if (navigator.appVersion.indexOf("Linux") != -1){
        ctx.font = "16px Serif";
      }
      else{
      ctx.font = "20px Serif";
      }
      ctx.fillText("Please enter data in the options menu.", 55, 70);
      // end default screen setup
    }
    else{
    if(inf.infiniteMode != 1){  // if not in infinite mode then calculate normally 
    hoursleft =((diff * 12) / orig.originalTime); // minutes left as a propotion of 12 hours (so now it is hours left)
    }
    else if (inf.infiniteMode == 1){ // if in infnite mode use the abs
      hoursleft = ((Math.abs(diff) * 12) / orig.originalTime) % 24;  // when you % it resets to full sun up. for example if you go from 23%24 which evaluates to 23 to 25/24 which evaluates to 1. Math.abs(12-23) is the same as Math.abs(12-1)
    }
    console.log('hours left: ' + hoursleft);
    chrome.storage.sync.get(['userCausedHours'], function(data) {
      console.log(data.userCausedHours) // get user caused increments
      console.log(hoursleft);
      if(inf.infiniteMode == 1){ // if in infinite mode
         hoursgone = (Math.abs(12 - hoursleft) + data.userCausedHours) // the math.abs ensures that even when hourspast > 12 you get a proper result
      }
      else if(inf.infiniteMode != 1){ // if in regular mode just calc normally
      hoursgone = ((12 - hoursleft) + data.userCausedHours)
      }
      if(hoursgone > 12.7){ // if timer still going but user caused hours led us to 12/12 make sure hoursgone doesnt go to 13, 14 etc
        hoursgone = 12;
      }
      console.log(hoursgone);  
      var g = document.getElementById('city'); 
      var ctx = g.getContext("2d");
    
      if(hoursgone <= 12.6 || hoursgone == null || inf.infiniteMode == 1){ // do this when in a valid session
      skyColors = ["#070B34", "#070B34", "#141852", "#141852", "#2B2F77", "#2B2F77", "#483475", "#6B4984", "#6B4984", "#855988", "#324ab2", "#87CEEB", "#87CEEB"]; // possible colors for sky
      ctx.beginPath()
      ctx.globalCompositeOperation = 'destination-under'
      ctx.fillStyle = skyColors[Math.round(hoursgone)];
      ctx.fillRect(0, 0, 400, 400);
      ctx.closePath();
      if(hoursgone >= 0 && hoursgone <= 7){ // if dark hours
        for(var i = 0; i < 30; i++){ // 30 stars
          ctx.fillStyle = "#fafdec";
          ctx.font = "5px serif";
          ctx.fillText("*", Math.random() * 400, Math.random() * 100); // randomly draw a star in the bounded area
          ctx.fillText("*", (Math.random() * 260 - Math.random() * 145 + 145), (Math.random() * 195 - Math.random() * 100 + 100)) // randomly draw a star in the bounded area
        }
      }
    
      if(hoursgone >= 9){ // sun
        ctx.beginPath();
        ctx.arc(200, 190 - (7 * hoursgone), 20, 0, 2*Math.PI);
        ctx.fillStyle = "#f9d71c";
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
      }

      if(hoursgone <= 8){ // moon
        chrome.storage.sync.get('moonPhase', function(moon){
          console.log(moon.moonPhase);
          ctx.beginPath();
         if(moon.moonPhase == 1){
          ctx.arc(200, 50 + (12 * hoursgone), 20, .35 * Math.PI, 1.3 * Math.PI, false)//+ 20 * moon.moonPhase)
         }
         else{
          ctx.arc(200, 50 + (12 * hoursgone), 20, 0, 2*Math.PI);
         }
          ctx.fillStyle = "#f5f3ce";
          ctx.fill();
          ctx.stroke();
          ctx.closePath();
        })
      }
    
    
      ctx.fillStyle = "#a66300";
      ctx.fillRect(0, 100, 150, 200); // left building draw
      ctx.fillStyle = "#c7be40";
      ctx.fillRect(150, 195, 120, 105); // middle building draw
      ctx.fillStyle = "#0f045c";
      ctx.fillRect(270, 100, 130, 200) // right building draw
      ctx.fillStyle = "#808080";
      ctx.fillRect(0,300, 400, 15)
      ctx.fillStyle = "#000000";
      ctx.strokeStyle = "#000000";
      ctx.fillRect(0, 315, 400, 85) // road rectangle
      ctx.beginPath();
      ctx.moveTo(0, 300);
      ctx.lineTo(400, 300); // sidewalk line 1
      ctx.moveTo(0, 315)
      ctx.lineTo(400, 315); // sidewalk line 2
      ctx.closePath();
      ctx.stroke();
      ctx.strokeStyle = "#f2eb24";
      for(var i = 10; i < 380; i+=30){ // to draw yellow street lines
        ctx.beginPath();
        ctx.moveTo(i, 360);
        ctx.lineTo(i + 20, 360);
        ctx.closePath();
        ctx.stroke();
      }
    
    
      ctx.fillStyle = "#f5ed00";
      ctx.fillRect(218, 205, 35, 12); // fill guys window with light
    
      ctx.fillStyle = "#000000";
      ctx.strokeStyle = "#000000";
      ctx.beginPath()
      ctx.arc(233, 210, 3,0, 2*Math.PI); // guys head
      ctx.closePath();
      ctx.fill()
      ctx.moveTo(233, 210);
      ctx.lineTo(233, 218); // guys body
      ctx.stroke();
    
      ctx.fillRect(243, 207, 6, 6); // computer
      ctx.fillRect(240, 212, 10, 6 ); // computer
  
     ctx.fillStyle = "#B6D9EE"
     ctx.fillRect(243,207, 2,5); // blue light from computer


     ctx.fillStyle = "#000000"; 
     ctx.fillRect(153, 160, 5, 140); // lamp post
     ctx.fillRect(153, 160, 18, 2);
     if(hoursgone <= 8){
      ctx.fillStyle = "#FFEA61"
      ctx.beginPath();
      ctx.arc(164, 162, 6, 0, Math.PI) // lamp light
      ctx.closePath();
      ctx.stroke();
      ctx.fill();
     }
     else{
      ctx.fillStyle = "#9a9a9a";
      ctx.beginPath();
      ctx.arc(164, 162, 6, 0, Math.PI) // lamp light
      ctx.closePath();
      ctx.stroke();
      ctx.fill();
     }
  
      
    
      var litupone = (hoursgone * 45) / 12;
      var howmanyone = 0
      for(var i = 10; i < 150 ; i+=40){ // windows for left building
        for(var j = 110; j < 290; j+= 20 ){
          var rand = Math.random();
          //console.log(howmanyone + " " + litupone + " " + hoursgone)
          if(rand > 0.5 && howmanyone < litupone){
            ctx.fillStyle = "#f5ed00";
            howmanyone++;
          }
          else{
            ctx.fillStyle = "#000000";
            
          }
          ctx.fillRect(i, j, 10, 10)
        }
      }
      
      var lituptwo = (hoursgone * 6) / 12;
      var howmanytwo = 0
     for( var i = 290; i < 400; i+=40){ // windows for right building
        for(var j = 110; j < 290; j+= 20){
          var rand = Math.random();
          if(rand > 0.7 && howmanytwo < lituptwo){
            ctx.fillStyle = "#f5ed00";
            howmanytwo++;
          }
          else{
            ctx.fillStyle = "#000000";
          }
          ctx.fillRect(i, j, 10, 10);
        }
     }
    
     var litupthree = (hoursgone * 27) / 12;
      var howmanythree = 0
     for(var i = 168; i < 260; i+= 50){ // windows for middle building
       for(var j = 205; j < 270; j+= 28){
        var rand = Math.random();
        if(i != 218 || j != 205){ // if  not top right window
          
        if(rand > 0.5 && howmanythree < litupthree){
          ctx.fillStyle = "#f5ed00";
          howmanythree++;
        }
        else{
          ctx.fillStyle = "#000000";
        }
        ctx.fillRect(i, j, 35, 12);
      }
      }
       
     }
    }
    else{
      ctx.fillStyle = "#B6D9EE";
      ctx.fillRect(0,0,400,400);
      ctx.fillStyle = "#000000";
      if (navigator.appVersion.indexOf("Linux") != -1){
        ctx.font = "25px Serif";
      }
      else{
      ctx.font = "30px Serif";
      }
      ctx.fillText("Time's Up! It's rush hour!", 50, 200)
    
    }
    
    let hoursPassedDiv = document.getElementById("hoursPassed");
    let timeRemainingDiv = document.getElementById("minutesLeft");
    
    chrome.storage.sync.get('time', function(data){
      chrome.storage.sync.get('originalTime', function(orig){
      console.log(data.time);
      var until = new Date(data.time)
      var d = new Date();
      var diff = until - d; // calculates ms left
      console.log(diff);
      console.log(diff / 60000);
      diff /= 60000; // converts to mins
      var hours = "00";
      var mins = "00";

      if(inf.infiniteMode != 1){ // if in a normal session print things normally
      if(diff > 0){ // if time is not up calculate hours and mins and print x/12 hours past
      hoursPassedDiv.innerHTML = "<p> " + Math.floor(hoursgone) + "/12 hours"; // round down so it doesnt increment too quick
      var hours = Math.floor(diff / 60);
      var mins = Math.round(diff % 60);
      if(hours / 10 < 1){
        hours = "0" + hours;
      }
      if(mins / 10 < 1){
        mins = "0" + mins
      }
      if(mins == 60){
        mins = 59;
      }
    }
    else{
      hoursPassedDiv.innerHTML = "<p> " + (Math.floor(hoursgone)) + "/12 hours"; // print 12/12 hours manually as this code will never get there and round down
    }
    timeRemainingDiv.innerHTML = "<p> " + hours + ":" + mins + " left"
  }
  if(inf.infiniteMode == 1){ // if in a infinite session
    hoursPassedDiv.innerHTML = "<span>&infin;</span>" // print infinity symbol in a span so it can go side by side w the p
    hoursPassedDiv.innerHTML += "<p>/12 hours </p>"; // print 12
    timeRemainingDiv.innerHTML =  "<span>&infin;</span>" // print infinity symbol in a span so it can go side by side w the p
    timeRemainingDiv.innerHTML +=  "<p> left</p>"

  }

    
      })
    })
    chrome.storage.sync.set({'hours': (12 - hoursleft) + data.userCausedHours}, function() { // 12 - hoursleft because we are storing hours as hours passed!!!!!
      console.log(hoursgone)
      console.log('hours = ' + ((12 - hoursleft) + data.userCausedHours)) ; // add user caused increments to hourspast and store it in the hours var
       })
     })
    } // put all drawing inside of this else so it can read the updated hoursgone
    })
  })
})
  
}