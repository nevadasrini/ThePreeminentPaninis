
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
    for (x in document.getElementsByClassName("matched")){
        if(matched){
            try {
                x.classList.remove('hide');
            }catch(e){}
        }
        else{
            try {
                x.classList.add('hide');
            } catch(e){}
        }
    }
    for (x in document.getElementsByClassName("unmatched")){
        if(matched){
            x.classList.add("hide");
        }
        else{
            try {
                x.classList.remove("hide")
            }catch(e){}
        }
    }
}

toggleHidden();
