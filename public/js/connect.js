createCollectionItem("Bryan Adams", "I used to be good at singing, but now I'm a full-stack developer.", null, "#!","#!");

toggleHidden(false);
//document.getElementById("find-button").addEventListener("click", getMatches)

auth.onAuthStateChanged(user => {
    if (user) {
        console.log('user logged in: ', user)
        runConnect(user);
    } else {
        runConnect();
        console.log('user logged out')
    }
})

function runConnect(user){
    if(user){
        let thisUserInfo = getUserInfo(user.uid);
        console.log(thisUserInfo);
        //console.log(thisUserInfo.age);
    }
}

function getUserInfo(userToken){
    alert(userToken);
    let docRef = db.collection("users").doc(userToken);
    docRef.get().then(
      function(doc) {
          if(doc.exists) { 
            console.log(doc.data());
            return doc.data();
          }
        }).catch((error) => console.log(error));
}

function createCollectionItem(name, desc, profilePic, infoLink, messageLink){
    let avatar = null;

    let item = document.createElement("li");
    let title = document.createElement("span");
    let text = document.createElement("p");
    
    item.classList.add("collection-item");
    item.classList.add("avatar");
    title.classList.add("title");
    
    title.textContent = name;
    text.textContent = desc;

    if (profilePic != null){
        avatar = document.createElement("img");
        avatar.classList.add("profile-pic");
        avatar.href = profilePic
    }
    else{
        avatar = document.createElement("i");
        avatar.classList.add("material-icons");
        avatar.classList.add("circle");
        avatar.classList.add("blue");
        avatar.textContent = "person";
    }

    let info = document.createElement("a");
    let message = document.createElement("a");
    
    info.classList.add("secondary-content");
    info.style.paddingRight = "45px";
    message.classList.add("secondary-content");
    info.href = infoLink;
    message.href = messageLink;
    let infoIcon = document.createElement("i")
    let messageIcon = document.createElement("i")
    
    infoIcon.classList.add("material-icons", "small");
    messageIcon.classList.add("material-icons", "small");
    infoIcon.textContent = "info";
    messageIcon.textContent = "message";

    info.appendChild(infoIcon);
    message.appendChild(messageIcon);
    
    item.appendChild(avatar);
    item.appendChild(title);
    item.appendChild(avatar);
    item.appendChild(text);
    item.appendChild(info);
    item.appendChild(message);
    
    document.getElementsByClassName("collection")[0].appendChild(item);
}

function checkIfEmpty() {
    let coll = document.getElementsByClassName("collection")[0];
    if (coll.childElementCount == 0)
    {
        coll.innerHTML = "<h5 class=\"header col s12 light center\" style=\"padding-bottom: 7px\">No matches found.</h5>"
    }
}


function toggleHidden(matched) {
    selectedMatch = document.getElementsByClassName("matched");
    selectedUnmatched = document.getElementsByClassName("unmatched");
    
    for (let i = 0 ; i < selectedMatch.length ; i++){
        let curr = selectedMatch.item(i);
        if(matched){
            try {
                curr.classList.remove('hide');
            }catch(e){}
        }
        else{
            curr.classList.add("hide");
        }
    }
    
    for (let i = 0 ; i < selectedUnmatched.length ; i++){
        let curr = selectedUnmatched.item(i);
        if(matched){
            curr.classList.add("hide");
        }
        else{
            try {
                curr.classList.remove("hide")
            }catch(e){}
        }
    }
}

