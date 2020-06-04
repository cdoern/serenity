let friendDiv = document.getElementById('addFriend');
let friendEnter = document.createElement('button');
let friendText = document.getElementById('friendInput');
let friendPageEnter = document.getElementById('friendPageEnter');
let friendPE = document.getElementById('friendButton');
friendEnter.innerHTML = 'Enter';
friendEnter.style.width = '70px';
friendEnter.style.padding = '2px';
friendEnter.addEventListener('click', function(){
    try{
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
                   location.reload();
                }
            );
        })
    }
    catch(err){
        alert('Your Serenity profile isn\'t set up yet! go to the options page to claim your username before adding friends.');
    }
})

    var form = document.createElement('form');
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
        try{
            chrome.storage.sync.get('user', function(data){
                hiddenData.value = data.user;
                console.log(input.value);
            })
        }
        catch(err){
            hiddenData.value = "INCORRECT";
        }
        
        form.appendChild(input);
        form.appendChild(hiddenData);
friendDiv.appendChild(friendEnter);
//friendDiv.appendChild(form);
friendPE.appendChild(form);
