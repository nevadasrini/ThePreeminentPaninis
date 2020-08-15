let thisUserInfo;

//createCollectionItem("Bryan Adams", "I used to be good at singing, but now I'm a full-stack developer.", null, "#!","#!");
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

    // ain't gonna work until create collection items is finished :(
    infoIcon.addEventListener('click', (e) =>{
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id')
        songtitle = name.textContent;
        console.log(songtitle);
        console.log(songtext);
        displayPage = window.open("otheraccount.html")
        displayPage.onload = function () {
            const name = this.document.getElementById('name');
            const email = this.document.getElementById('email');
            name.innerText = "HEy";
            email.innerText = "this is nivs";
        };
    })
}

let storedResults;

function matchUser(){

//get current user's skill set and field
    //identify via custom id token, grab email address
    //then search database
    if(!thisUserInfo){
        setTimeout(function(){matchUser()}, 200);
        return 0;
    }
    let currUser = thisUserInfo;

    let currField = currUser.field;
    let currSkills = currUser.skills;

    //match with pros in the same field
    let skillScore = [];
    let noMatch = false;
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
                else if (!doc.exists){
                    //No matches found
                    let selectedNoMatch = document.getElementsByClassName("no-matches");
                    for (let i = 0 ; i < selectedNoMatch.length ; i++){
                        let curr = selectedNoMatch.item(i);
                        curr.classList.remove("hide");
                    }
                    noMatch = true;
                    return 0;
                }
                    }); 
        if(!noMatch){
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
            storedResults = skillScore;
            let returner = displayMoreMatches(0);
            toggleHidden(true);
            return returner;
        }
    }).catch((error)=>{
        console.log(error);
        return 0;
    });
       
}

function displayMoreMatches(currResults)
{
    let count = 0;
    for (i = currResults ; i < storedResults.length && i < currResults + 10 ; i++)
    {
        count += 1;
        let thisResult = storedResults[i][1];
        let d = thisResult.desc;
        if(!d || d.trim() == ""){
            d = "Hi! I'm " + thisResult.name + " and my skills include: " + thisResult.skills;
        }
        createCollectionItem(thisResult.name, d, null, `info.html?other=${thisResult.email}`, `chat.html?other=${thisResult.email}`);
    }
}

function checkIfEmpty() {
    let coll = document.getElementsByClassName("collection")[0];
    if (coll.childElementCount == 0)
    {
        coll.innerHTML = "<h5 class=\"header col s12 light center\" style=\"padding-bottom: 7px\">No matches found.</h5>"
    }
}


let currentResultCount = 0;

let findBtn = document.getElementById('find-button');
let moreBtn = document.getElementById('load-more-button');

findBtn.addEventListener("click", function () {
    currentResultCount += matchUser();
})
moreBtn.addEventListener("click", function () {
    currentResultCount += displayMoreMatches(currentResultCount);
})