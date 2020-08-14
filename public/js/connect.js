
createCollectionItem();


function createCollectionItem(){

    let item = document.createElement("li");
    let avatar = document.createElement("img");
    let title = document.createElement("span");
    let text = document.createElement("p");
    
    item.classList.add("collection-item");
    item.classList.add("avatar");
    avatar.classList.add("profile-pic");
    title.classList.add("title");
    
    let info = document.createElement("a");
    let message = document.createElement("a");
    
    info.classList.add("secondary-content");
    message.classList.add("secondary-content");
    info.href = "#!";
    message.href = "#!";
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
