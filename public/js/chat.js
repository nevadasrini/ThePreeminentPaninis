
//const { info } = require("console");
//const { errorMonitor } = require("stream");
let currUser;
let userInfo;

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const other = urlParams.get("other");

// Check if the user is signed in.

auth.onAuthStateChanged(user => {
    // If so, run main app.
    if (user) {
        console.log('user logged in: ', user);
        currUser = user;
        getUserInfo(user.email).then(info=>{
            userInfo = info;
            console.log(userInfo);

            try{
                const queryString = window.location.search;
                const urlParams = new URLSearchParams(queryString);
                const other = urlParams.get('other');

                checkPerson(other);
            }catch(error){
                console.error(error);
                console.log("Loading existing chats.");
                runChat(user);
            }
        })
    }
    else {
        runChat();
        console.log('user logged out')
    }
})

function checkPerson(other){
    let otherInfo;
    getUserInfo(other).then(info =>{
        otherInfo = info;
        console.log([userInfo.email,otherInfo.email]);
        return db.collection('conversations').where("participants","array-contains",userInfo.email).get()

    }).then(snapshot=>{
        if (snapshot.docs[0] && snapshot.docs[0].exists){
            //open convo
            let alreadyMade;
            snapshot.docs.forEach(doc =>{
                console.log(doc.data().participants);
                doc.data().participants.forEach(part =>{
                    if(part == otherInfo.email) alreadyMade=true;
                })
            })
            if (alreadyMade){
                console.log("Already made");
                runChat(currUser);
            }
            else{
                newChat(otherInfo);
            }
        }
        else{
            newChat(otherInfo);
        }
    }).catch(error => {console.error(error)
        runChat(currUser);
    });
}

function newChat(otherInfo){

    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!

    let convoRef = db.collection('conversations').doc()

    convoRef.set({
        //conversationID: ,
        date: mm + '/' + dd,
        latestMessage: "",
        names: [userInfo.name, otherInfo.name], 
        participants:  [userInfo.email, otherInfo.email], //change to id?? some sort of unique identifier
        //pfp: [userInfo.pfp, otherInfo.pfp]
    })

    let messRef = convoRef.collection("messages").doc()
    messRef.set({
        date: mm + '/' + dd,
        par: 0,
        text: "",
        index: 0
    });
    
    convoRef.collection("messages").doc(messRef.id).delete().then(thing=>{
        console.log("complete");
        runChat(currUser);
    }).catch(error=>console.error(error));

    
    
}


let currentConvo;
let listofIndexes =[];

function addtoList(doc){
    db.collection('conversations').doc(doc.id).collection('messages').get().then(snapshot =>{
        let index = snapshot.docs.length;
        listofIndexes.push([doc.id,index]);
    });

    
}

function updateList(doc){
    for (let i = 0; i < listofIndexes.length; i++){
        if (listofIndexes[i][0] == doc.id){
            db.collection('conversations').doc(doc.id).collection('messages').get().then(snapshot =>{
                let index = snapshot.docs.length;
                listofIndexes[i][1] == doc.data().index
            });
            ;
        }
    }
}

function runChat (user)
{   
    // If the user is signed in, run.
    let collectionRef;
    if (user)
    {
        // Retrieve all conversations where the logged-in user is a participant.
        collectionRef = db.collection('conversations').where("participants", "array-contains", userInfo.email/*String(user.uid)*/);

            // Attach a realtime event listener to the current conversation.
            collectionRef.onSnapshot( function(querySnapshot){
                // If the data changes, call updateMyConvo w/ their data as an argument.
                querySnapshot.docChanges().forEach(function(change) {
                    if(change.type === "modified"){
                        updateList(change.doc);
                        updateMyConvo(change.doc);
                    }
                    else if (change.type === "added"){
                        addtoList(change.doc);
                        createMyConvo(change.doc);
                    }
                    else if (change.type === "deleted"){
                        //uhoh
                    }
                });
            });
    }
    // The user is not logged in. This should not happen.
    else {
        console.log('you\'re not logged in!')
    }
}

// Update the conversation. 
function updateMyConvo(doc)
{   
    reloadSideBar(doc);
}

function createMyConvo(doc)
{
    renderConvoOnSideBar(doc);
}

// Render new sidebar, and attach new listener for rendering conversation messages.s
function renderConvoOnSideBar(doc){
    let convoData = doc.data();
    // Create the new sidebar element to be added.
    let conversationList = document.getElementById("conversation-list");

    //let pfp = document.createElement("img");
    //pfp.src = convoData.pfp[1 - convoData.participants.indexOf(user.uid)];                        // Maybe change later, idk
    
    let avatar = document.createElement("i");
    avatar.classList.add("material-icons");
    avatar.classList.add("circle");
    avatar.classList.add("blue");
    avatar.classList.add("small");
    avatar.textContent = "person";

    let titleText = document.createElement("div");
    titleText.classList.add("title-text");
    titleText.innerText = convoData.names[1 - convoData.participants.indexOf(userInfo.email)];

    console.log( convoData.names[1 - convoData.participants.indexOf(userInfo.email)]); //user.id

    let latestDate = document.createElement("div");
    latestDate.classList.add("latest-date");
    latestDate.innerText = convoData.date;

    let latestMessage = document.createElement("div");
    latestMessage.classList.add("conversation-message");
    latestMessage.innerText = convoData.latestMessage;

    // If the conversation element already exists in the sidebar
    let conversationElement;
    try {
        // Can identify if an element already exists for this conversation because the stored conversationId is equal to the element's ID.
        conversationElement = document.getElementById(doc.id);
        // Removes existing element if it is found.
        conversationList.removeChild(conversationElement);
    } catch (error) {
    }

    // Creates new element.
    conversationElement = document.createElement("div");
    conversationElement.classList.add("conversation");
    
    //conversationElement.appendChild(pfp);
    conversationElement.appendChild(avatar);
    conversationElement.appendChild(titleText);
    conversationElement.appendChild(latestDate);
    conversationElement.appendChild(latestMessage);

    // Attaches event listener so the conversation can be displayed if the element in the sidebar is clicked.
    conversationElement.addEventListener("click", function () {
        currentConvo = doc;
        displayConversation(doc);
    })
    
    // Sets stored conversation.conversationId equal to the element's ID.
    conversationElement.id = doc.id;

    console.log(conversationElement.id==doc.id);

    // Inserts the new sidebar element at the top.
    conversationList.insertBefore(conversationElement, conversationList.childNodes[0])
}

//reloads siderbar elements and updates them
function reloadSideBar(doc){
    let convoData = doc.data();
    // Create the new sidebar element to be added.
    let conversationList = document.getElementById("conversation-list");

    // If the conversation element already exists in the sidebar
    let conversationElement = document.getElementById(doc.id);
    conversationElement.classList.add("conversation");

    //let pfp = document.createElement("img");
    //pfp.src = convoData.pfp[1 - convoData.participants.indexOf(user.uid)];                        // Maybe change later, idk
    
    let children = conversationElement.childNodes;

    //let avatar = children[0]; not needed rnow

    let titleText = children[1];
    titleText.innerHTML = convoData.names[1 - convoData.participants.indexOf(userInfo.email)];

    let latestDate = children[2];
    latestDate.innerHTML = convoData.date;

    let latestMessage = children[3];
    latestMessage.innerHTML = convoData.latestMessage;

    // Inserts the new sidebar element at the top.
    conversationList.insertBefore(conversationElement, conversationList.childNodes[0]);

    if (currentConvo && currentConvo.id == doc.id){
        db.collection("conversations").doc(currentConvo.id).get().then( doc=>{
            currentConvo = doc;
            reloadConversation(currentConvo);
        });
        
    }    
}

// Displays the messages the convo is clicked.
function displayConversation(doc){
    //alert(4);
    let convo = doc.data();
    // First change the title.
    let chatTitle = document.getElementById("chat-title");
    chatTitle.innerHTML = `
    <span id="chat-title-span"></span>
    `;
    let chatTitleSpan = document.getElementById("chat-title-span");
    console.log(chatTitleSpan);
    chatTitleSpan.innerHTML = convo.names[1 - convo.participants.indexOf(userInfo.email)];//user.uid)];

    console.log(convo.names[1 - convo.participants.indexOf(userInfo.email)]);

    // Retrieve container of messages.
    let chatMessageList = document.getElementById("chat-message-list");
    // Clear container of current contents.
    chatMessageList.innerHTML = "";
    
    let convoRef = db.collection('conversations').doc(doc.id).collection("messages")

    convoRef.orderBy("index", "desc").get().then( snapshot=>{

        listofIndexes.forEach(pair=>{
            if(pair[0] == doc.id){
                pair[1] = snapshot.docs.length;
            }
        });

        loadMessage(convo, snapshot);

        // Attach an event listener to the send box.
        document.getElementById("send-box")
        .addEventListener("keyup", function(event) {
        event.preventDefault();
        // If the enter key is pressed and released, try to send the currently-typed message.
        if (event.keyCode === 13) {
            sendMessage(currentConvo);
        }});
        });
}

//adds on any new messages to the open conversation
function reloadConversation(doc){
    let convo = doc.data();
    // First change the title.
    let chatTitleSpan = document.getElementById("chat-title-span");
    chatTitleSpan.innerText = convo.names[1 - convo.participants.indexOf(userInfo.email)];//user.uid)];
    
    let convoRef = db.collection('conversations').doc(doc.id).collection("messages")

    let oldIndex = 0;
    let newMess = 0;

    db.collection('conversations').doc(doc.id).collection('messages').get().then(snapshot=>{
        listofIndexes.forEach(pair=>{
            if(pair[0] == doc.id){
                oldIndex = pair[1];
                pair[1] = snapshot.docs.length;
            }
        });

        newMess = snapshot.docs.length - oldIndex;
        console.log(newMess);
        return convoRef.orderBy("index", "desc").limit(newMess).get()
        
    }).then(snapshot=>{loadMessage(convo, snapshot)
    
    }
    ).catch(error=>console.error(error));    
}

//loads message
function loadMessage(convo,snapshot){
    //alert("Yes");
    console.log(snapshot.docs);
    let chatMessageList = document.getElementById("chat-message-list");
    let thisConvo = snapshot.docs;
     // Iterate through the messages of the given conversation.
    for(let i = thisConvo.length-1; i> -1; i--) {
        doc = thisConvo[i];
        let message = doc.data();
        // Create new message element.
        let messageRow = document.createElement("div");
        messageRow.classList.add("message-row")
        
        let messageContent = document.createElement("div");
        messageContent.classList.add("message-content");

        // If the message's first element (either 0 or 1) matches the index of the logged-in user's uid in the "participant" array, the message was sent by the logged-in user and should be displayed as "your message."
        if(convo.participants[message.par] == userInfo.email){//user.uid)
            // If you sent it
            
            messageRow.classList.add("you-message");
        }
        // Otherwise, display as the other person's message. Maybe change to an "else" statement.
        else{//user.uid){
            // If the other person sent it
            messageRow.classList.add("other-message");
            //let messageImage = document.createElement("img");
            //messageImage.src = convo.pfp[1 - convo.participants.indexOf(userInfo.email)];//user.uid)];
            //messageImage.height = "40px";
            //messageImage.width = "40px";
            //messageContent.appendChild(messageImage);
            // Load the avatar.
            let avatar = document.createElement("i");
            avatar.classList.add("material-icons");
            avatar.classList.add("circle");
            avatar.classList.add("blue");
            avatar.style.fontSize = "60px";
            avatar.style.width = "60px";
            avatar.style.height = "40px;"
            avatar.textContent = "person";
            messageContent.appendChild(avatar);
        }

        

        // The message text is the third element in the array.
        let messageText = document.createElement("div");
        messageText.classList.add("message-text");
        messageText.innerText = message.text;

        // The message time is the second element in the array.
        let messageTime = document.createElement("div");
        messageTime.classList.add("message-time");
        messageTime.innerText = message.date;

        messageContent.appendChild(messageText);
        messageContent.appendChild(messageTime);

        messageRow.appendChild(messageContent);

        // Append the message element to the chat element.
        chatMessageList.insertBefore(messageRow, chatMessageList.childNodes[0]);
    }
    
    }
    

// Try to send the currently-typed message.
function sendMessage(doc){
    let convo = doc.data();
    let messageBox = document.getElementById("send-box");
    // Trim whitespace from either end of the value.
    let message = messageBox.value.trim();
    messageBox.value = "";
    
    // Only send if something is typed.
    if (message != "") {
        // Retrieve the date and format it it into mm/dd format.
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!

        let conversationReference = db.collection("conversations").doc(doc.id);
        
        conversationReference.collection("messages").get().then( snapshot=>{

            return snapshot.docs.length;

        }).then( numOfMess =>{

            var batch = db.batch();
            // Update the current conversation by adding the new message. The message is in the format [who sent it? 0 or 1, date in mm/dd format, message string]. Also update the conversation by updating the date.
            batch.update(conversationReference,
                {
                    date: String(mm + "/" + dd),
                    latestMessage: message
                }
            );
                // Update the message fields.
            let messRef = db.collection("conversations").doc(doc.id).collection("messages").doc();
            batch.set(messRef,
                {
                    par: convo.participants.indexOf(userInfo.email),//user.uid),
                    date: mm + '/' + dd,
                    text: message,
                    index: numOfMess+1
                });
            batch.commit();
        
        })
    }
}