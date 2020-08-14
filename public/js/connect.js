

 

function createCollectionItem(){
    let item = document.createElement("li").classList.add("collection-item").add("avatar");
    let avatar = document.createElement("img").classList.add("profile-pic");
    let title = document.createElement("span").classList.add("title");
    let text = document.createElement("p");

    let info = document.createElement("a").classList.add("secondary-content");
    let message = document.createElement("a").classList.add("secondary-content");
    info.href = "#!";
    message.href = "#!";
    let info = document.createElement("i").classList.add("material-icons");
    let message = document.createElement("i").classList.add("material-icons");
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
