

//createCollectionItem("Bryan Adams", "I used to be good at singing, but now I'm a full-stack developer.", null, "#!","#!");
db = firebase.firestore();

matchUser();


function getUserInfo(email){
    return new Promise((resolve,reject)=>{

    let docRef = db.collection("users").where("email","==",email).get().then(
      function(snapshot) {
          let doc = snapshot.docs[0];
          if(doc.exists) { 
            console.log(doc.data());
            resolve(doc.data());
          }
          else{
            reject("error");
          }
        }).catch((error) => reject(error));

    })
    
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

function matchUser(){

//get current user's skill set and field
    //identify via custom id token, grab email address
    //then search database

    let currUser = null
    getUserInfo("john@gmail.com").then((user)=> {
        currUser = user


        let currField = currUser.field;
        let currSkills = currUser.skills;

        //match with pros in the same field
        let skillScore = [];
        let docRef = db.collection("users").where("email","==","john@gmail.com").get().then(
            function(snapshot){
                snapshot.docs.forEach(doc => {
                   doc.skills.forEach(skill =>{
                       for(let currSkill of currSkills){
                            if (skill.toLowerCase()==currSkill.toLowerCase()){
                                same++;
                                break;
                            }
                       }
                   })
    
                   skillScore.push([same,doc]);
                   
               }); 
            
               //order matches by compatibility of skills
                for(let i=1; i<skillScore.length; i++){
                    let currMax = skillScore[i][0];
                    for(let k=i+1; k>0;k--){
                        if(currMax>skillScore[k-1][0]){
                            skillScore[k][0]=skillScore[k-1][0];
                        }
                        else{
                            skillScore[k][0]=currMax;
                            break;
                         }
                    }
                }

                skillScore.forEach(pair =>{
                    createCollectionItem(pair[1].name, "desc", null, "#!", "#!")
                });

        }).catch((error)=>console.log(error));
    }).catch(console.log(error));    
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

