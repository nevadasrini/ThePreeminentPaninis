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
        
        db.collection('users').get().then((snapshot) => {
            snapshot.docs.forEach(doc => {
                
                if (doc.data().userID == user.uid){
                    thisUser = doc.data(); 

                }

            })
        })
        console.log(thisUser.name);
        thisUser.convos.forEach( function(convo){
            
            console.log(convo);

            db.collection('users').doc(convo.uid)
            .onSnapshot( function(doc){
                updateMyConvo(doc.data());
            });

            function updateMyConvo(data)
            {
                // Update the message list if a message was added.
                if (length(data.messages) > length(convo.messages)){
                    for (i = length(convo.messages) ; i < length(data.messages) ; i++){
                        // Add the message to convo.messages, but reverse the 0s and 1s of the first element.
                        convo.messages.push([1 - data.messages[i][0]].concat(data.messages[i].slice(1, 3)))
                    }
                }
                convo.pfp = data.pfp;
                convo.latestMessage = data.messages[length(data.messages) - 1][2];
                convo.date = data.date;
                renderConvoOnSideBar(c);
            }

            function renderConvoOnSideBar(c){
            
                let conversationList = document.getElementById("conversation-list");

                let pfp = document.createElement("img");
                pfp.src = c.pfp;                        // Maybe change later, idk
                
                let titleText = document.createElement("div");
                titleText.classList.add("title-text");
                titleText.innerHTML = c.name;

                let latestDate = document.createElement("div");
                latestDate.classList.add("latest-date");
                latestDate.innerHTML = c.date;

                let latestMessage = document.createElement("div");
                latestMessage.classList.add("conversation-message");
                latestMessage.innerHTML = c.latestMessage;

                let conversationElement = document.createElement("div");
                conversationElement.appendChild(pfp);
                conversationElement.appendChild(titleText);
                conversationElement.appendChild(latestDate);
                conversationElement.appendChild(latestMessage);

                conversationElement.addEventListener("click", function () {
                    displayConversation(c.number);
                })

                conversationList.appendChild(conversationElement);
            }
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
        
            document.getElementById("send-box")
            .addEventListener("keyup", function(event) {
            event.preventDefault();
            if (event.keyCode === 13) {
                sendMessage(convoNumber);
            }});

            function sendMessage(cN){
                let messageBox = document.getElementById("send-box");
                let message = messageBox.value.trim();
                messageBox.value = "";
                
                if (message != "") {
                    var today = new Date();
                    var dd = String(today.getDate()).padStart(2, '0');
                    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                
                    tC = thisUser.convos[cN];
                    tC.messages.push([0, mm + '/' + dd, message]);   // FIGURE THIS OUT
                    tC.date = (mm + '/' + dd);
                }
            }
        
        }

    }
    else {
        console.log('you\'re not logged in!')
    }
}