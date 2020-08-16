const emailObject = document.getElementById('email');
const nameObject = document.getElementById('name');
const ageObject = document.getElementById('age');
const fieldObject = document.getElementById('field');
const skillsObject = document.getElementById('skills');
const bioObject = document.getElementById('bio');
const form = document.querySelector("#accountForm");

auth.onAuthStateChanged(user => {
    if (user) {
        console.log('user logged in: ', user)
        displayAccount(user);
    }
    else {
        displayAccount();
        console.log('user logged out')
    }
})

function displayAccount(user)
{
    if (user)
    {
        db.collection('users').get().then((snapshot) => {
            snapshot.docs.forEach(doc => {
                
                if (doc.data().email == user.email){
                    emailObject.innerText = doc.data().email;
                    nameObject.value = doc.data().name;
                    ageObject.value = doc.data().age;
                    fieldObject.value = doc.data().field;
                    skillsObject.value = doc.data().skills;
                    bioObject.value = doc.data().bio;
                }

            })
        })
    }
    else {

    }
}

form.addEventListener('submit', (e) =>{
    e.preventDefault();
    auth.onAuthStateChanged(user => {
        if (user) {
            console.log('user logged in: ', user)
            updateAccount(user);
            thisUser = user;
        }
        else {
            updateAccount();
            console.log('user logged out')
        }
    })
    
})

function updateAccount(user){
    if (user)
    {   
        db.collection('users').doc(user.email).set({
            name: form.name.value,
            age: form.age.value,
            field: form.field.value.toLowerCase(),
            skills: parseCSV(form.skills.value),
            bio: form.bio.value,
            email: user.email
        })
    }
    else {

    }    
}