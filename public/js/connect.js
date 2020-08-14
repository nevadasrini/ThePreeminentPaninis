
createCollectionItem("Bryan Adams", "I used to be good at singing, but now I'm a full-stack developer.", null, "#!","#!");



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
    message.classList.add("secondary-content");
    info.href = infoLink;
    message.href = messageLink;
    let infoIcon = document.createElement("i")
    let messageIcon = document.createElement("i")
    
    infoIcon.classList.add("material-icons");
    messageIcon.classList.add("material-icons");
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

let matched = false;

function toggleHidden() {
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

toggleHidden();
