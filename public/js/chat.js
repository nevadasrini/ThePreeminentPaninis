auth.onAuthStateChanged(user => {
    if (user) {
        console.log('user logged in: ', user)
        runChat(user);
    }
    else {
        runChat();
        console.log('user logged out')
    }
})

function runChat (user)
{
    let thisUser;
    if (user)
    {
        
        db.createCollectionItem('users').get().then((snapshot) => {
            snapshot.docs.forEach(doc => {
                
                if (doc.data().userID == user.uid){
                    thisUser = doc.data(); 

                }

            })
        })
        console.log(thisUser.name);
        thisUser.convos.forEach( function(convo){
            
            console.log(convo);
            let conversationList = document.getElementById("conversation-list");

            let pfp = document.createElement("img");
            pfp.src = convo.pfp;                        // Maybe change later, idk
            
            let titleText = document.createElement("div");
            titleText.classList.add("title-text");
            titleText.innerHTML = convo.name;

            let latestDate = document.createElement("div");
            latestDate.classList.add("latest-date");
            latestDate.innerHTML = convo.date;

            let latestMessage = document.createElement("div");
            latestMessage.classList.add("conversation-message");
            latestMessage.innerHTML = convo.latestMessage;

            let conversationElement = document.createElement("div");
            conversationElement.appendChild(pfp);
            conversationElement.appendChild(titleText);
            conversationElement.appendChild(latestDate);
            conversationElement.appendChild(latestMessage);

            conversationElement.addEventListener("click", function () {
                displayConversation(convo.number);
            })

            conversationList.appendChild(conversationElement);

        }
        )

        function displayConversation(convoNumber){
            let thisConvo = thisUser.convos[convoNumber];
            thisConvo.messages.forEach( function(message) {

                let chatMessageList = document.getElementById("chat-message-list");

                let messageRow = document.createElement("div");
                messageRow.classList.add("message-row")
                
                let messageContent = document.createElement("div");
                messageContent.classList.add("message-content");

                
                if(message[0] == 0){
                    // If you sent it
                    messageRow.classList.add("you-message");
                }
                else if(message[0] == 1){
                    // If the other person sent it
                    messageRow.classList.add("other-message");
                    let messageImage = document.createElement("img");
                    messageImage.src = thisConvo.pfp;
                    messageImage.height = "40px";
                    messageImage.width = "40px";
                    messageContent.appendChild(messageImage);
                }

                let messageText = document.createElement("div");
                messageText.classList.add("message-text");
                messageText.innerHTML = message[2];

                let messageTime = document.createElement("div");
                messageTime.classList.add("message-time");
                messageTime.innerHTML = message[1];

                messageContent.appendChild(messageText);
                messageContent.appendChild(messageTime);

                messageRow.appendChild(messageContent);

                chatMessageList.append(messageRow);
            }
            )
        }

    }
    else {
        console.log('you\'re not logged in!')
    }
}

document.getElementById("send-box")
    .addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        sendMessage();
    }
});

function sendMessage(){
    
}