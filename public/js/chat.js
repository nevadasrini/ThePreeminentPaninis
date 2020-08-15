
// Check if the user is signed in.
auth.onAuthStateChanged(user => {
    // If so, run main app.
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
    // If the user is signed in, run.
    let allMyConvos;
    if (user)
    {
        // Retrieve all conversations where the logged-in user is a participant.
        db.collection('conversations').where("participants", "array-contains", String(user.uid)).get().then((snapshot) => {
            snapshot.docs.forEach(doc => {
                
                if (doc.data().userID == user.uid){
                    
                    allMyConvos = doc.data(); 

                }

            })
        })

        // Iterate through the user's existing conversations.
        console.log(allMyConvos);

        allMyConvos.forEach( function(convo){
            
            console.log(convo);

            // Attach a realtime event listener to the current conversation.
            convo
            .onSnapshot( function(doc){
                // If the data changes, call updateMyConvo w/ their data as an argument.
                updateMyConvo(doc.data());
            });

            // Update the conversation. 
            function updateMyConvo(data)
            {
                renderConvoOnSideBar(data);
            }

            // Render new sidebar, and attach new listener for rendering conversation messages.s
            function renderConvoOnSideBar(convoData){
            
                // Create the new sidebar element to be added.
                let conversationList = document.getElementById("conversation-list");

                let pfp = document.createElement("img");
                pfp.src = convoData.pfp[1 - convoData.participants.indexOf(user.uid)];                        // Maybe change later, idk
                
                let titleText = document.createElement("div");
                titleText.classList.add("title-text");
                titleText.innerHTML = convoData.names[1 - convoData.participants.indexOf(user.uid)];

                let latestDate = document.createElement("div");
                latestDate.classList.add("latest-date");
                latestDate.innerHTML = convoData.date;

                let latestMessage = document.createElement("div");
                latestMessage.classList.add("conversation-message");
                latestMessage.innerHTML = convoData.latestMessage;

                // If the conversation element already exists in the sidebar
                let conversationElement;
                try {
                    // Can identify if an element already exists for this conversation because the stored conversationId is equal to the element's ID.
                    conversationElement = document.getElementById(convoData.conversationId);
                    // Removes existing element if it is found.
                    conversationList.removeChild(conversationElement);
                } catch (error) {
                }

                // Creates new element.
                conversationElement = document.createElement("div");
                
                conversationElement.appendChild(pfp);
                conversationElement.appendChild(titleText);
                conversationElement.appendChild(latestDate);
                conversationElement.appendChild(latestMessage);

                // Attaches event listener so the conversation can be displayed if the element in the sidebar is clicked.
                conversationElement.addEventListener("click", function () {
                    displayConversation(convoData);
                })

                // Sets stored conversation.conversationId equal to the element's ID.
                conversationElement.id = convoData.conversationId;

                // Inserts the new sidebar element at the top.
                conversationList.insertBefore(conversationElement, conversationList.childNodes[0]);
            }
        }
        )

        // Displays the messages the convo is clicked.
        function displayConversation(convo){

            // First change the title.
            let chatTitle = document.getElementById("chat-title");
            chatTitle.innerHTML = "";
            let chatTitleSpan = document.getElementById("chat-title-span");
            chatTitleSpan.innerHTML = convo.names[1 - convo.participants.indexOf(user.uid)];


            // Retrieve container of messages.
            let chatMessageList = document.getElementById("chat-message-list");
            // Clear container of current contents.
            chatMessageList.innerHTML = "";

            let thisConvo = convo;
            // Iterate through the messages of the given conversation.
            thisConvo.messages.forEach( function(message) {

                // Create new message element.
                let messageRow = document.createElement("div");
                messageRow.classList.add("message-row")
                
                let messageContent = document.createElement("div");
                messageContent.classList.add("message-content");

                // If the message's first element (either 0 or 1) matches the index of the logged-in user's uid in the "participant" array, the message was sent by the logged-in user and should be displayed as "your message."
                if(thisConvo.participants[message[0]] == user.uid){
                    // If you sent it
                    messageRow.classList.add("you-message");
                }
                // Otherwise, display as the other person's message. Maybe change to an "else" statement.
                else if(thisConvo.participants[message[0]] != user.uid){
                    // If the other person sent it
                    messageRow.classList.add("other-message");
                    let messageImage = document.createElement("img");
                    messageImage.src = thisConvo.pfp[1 - thisConvo.participants.indexOf(user.uid)];
                    messageImage.height = "40px";
                    messageImage.width = "40px";
                    messageContent.appendChild(messageImage);
                }

                // The message text is the third element in the array.
                let messageText = document.createElement("div");
                messageText.classList.add("message-text");
                messageText.innerHTML = message[2];

                // The message time is the second element in the array.
                let messageTime = document.createElement("div");
                messageTime.classList.add("message-time");
                messageTime.innerHTML = message[1];

                messageContent.appendChild(messageText);
                messageContent.appendChild(messageTime);

                messageRow.appendChild(messageContent);

                // Append the message element to the chat element.
                chatMessageList.append(messageRow);
            }
            )
        
            // Attach an event listener to the send box.
            document.getElementById("send-box")
            .addEventListener("keyup", function(event) {
            event.preventDefault();
            // If the enter key is pressed and released, try to send the currently-typed message.
            if (event.keyCode === 13) {
                sendMessage(thisConvo);
            }});

            // Try to send the currently-typed message.
            function sendMessage(thisConvo){
                let messageBox = document.getElementById("send-box");
                // Trim whitespace from either end of the value.
                let message = messageBox.value.trim();
                messageBox.value = "";
                
                // Only send if something is typed.
                if (message != "") {
                    // Retrieve the date and format it it into mm/dd format.
                    var today = new Date();
                    var dd = String(today.getDate()).padStart(2, '0');
                    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                
                    // Update the current conversation by adding the new message. The message is in the format [who sent it? 0 or 1, date in mm/dd format, message string]. Also update the conversation by updating the date.
                    db.collection("conversations").where("conversationId", "==", convo.conversationId).update(
                        {
                            messages: thisConvo.messages.concat([thisConvo.participants.indexOf(user.uid), mm + '/' + dd, message]),
                            date: String(mm + "/" + dd)
                        }
                    )
                }
            }
        
        }

    }
    // The user is not logged in. This should not happen.
    else {
        console.log('you\'re not logged in!')
    }
}