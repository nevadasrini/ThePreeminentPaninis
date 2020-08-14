
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