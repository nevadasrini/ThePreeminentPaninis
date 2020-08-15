let thisUserInfo;

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
});

function runConnect(user){
    if(user){
        getUserInfo(user.email).then(info => {
            thisUserInfo = info;
            console.log(thisUserInfo);
            console.log(thisUserInfo.age);
        }
            );
        
    }
}

/*function getUserInfo(userToken){
    let docRef = db.collection("users").doc(userToken);
    docRef.get().then(
      function(doc) {
          if(doc.exists) { 
            console.log(doc.data());
            return doc.data();
          }
        }).catch((error) => console.log(error));
}   */

function toggleHidden(matched) {
    let selectedMatch = document.getElementsByClassName("matched");
    let selectedUnmatched = document.getElementsByClassName("unmatched");
    let selectedNoMatch = document.getElementsByClassName("no-matches");
    
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

    for (let i = 0 ; i < selectedNoMatch.length ; i++){
        let curr = selectedNoMatch.item(i);
        if(matched){
            curr.classList.add("hide");
        }
    }
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
    if(!thisUserInfo){
        setTimeout(function(){matchUser()}, 200);
        return false;
    }
    let currUser = thisUserInfo;

    let currField = currUser.field;
    let currSkills = currUser.skills;

    //match with pros in the same field
    let skillScore = [];
    console.log(currUser);
    db.collection("users").where("field","==",currField).get().then(
        function(snapshot){
            snapshot.docs.forEach(doc => {
                if(doc.exists && doc.data().email != currUser.email){
                    let same = 0;
                    doc.data().skills.forEach(skill =>{
                        for(let currSkill of currSkills){ 
                                if (skill.toLowerCase()==currSkill.toLowerCase()){
                                    same++;
                                    break;
                                }
                        }
                    })
                    skillScore.push([same, doc.data()]);      
                }
                else{
                    //No matches found
                    let selectedNoMatch = document.getElementsByClassName("no-matches");
                    for (let i = 0 ; i < selectedNoMatch.length ; i++){
                        let curr = selectedNoMatch.item(i);
                        curr.classList.remove("hide");
                    }
                }
                    }); 
                    
            //order matches by compatibility of skills
            for(let i=1; i<skillScore.length; i++){
                let currMax = skillScore[i];
                let k = i;
                for(k; k>0;k--){
                    if(currMax[0]>skillScore[k-1][0]){
                        skillScore[k]=skillScore[k-1];
                    }
                    else{
                        
                        break;
                    }
                }
                skillScore[k]=currMax;
            }
            console.log(skillScore);
            skillScore.forEach(pair =>{
                let d = "desc";
                if(pair[1].desc && pair[1].desc.trim() == ""){
                    d = "Hi! I'm " + pair[1].name + " and my skills include: " + pair[1].skills;
                }
                createCollectionItem(pair[1].name, d, null, `account.html?other=${pair[1].email}`, `chat.html?other=${pair[1].email}`)
            });
            toggleHidden(true);
            return true;

    }).catch((error)=>{
        console.log(error);
        return false;
    });
       
}

function checkIfEmpty() {
    let coll = document.getElementsByClassName("collection")[0];
    if (coll.childElementCount == 0)
    {
        coll.innerHTML = "<h5 class=\"header col s12 light center\" style=\"padding-bottom: 7px\">No matches found.</h5>"
    }
}




