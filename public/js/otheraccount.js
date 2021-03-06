const emailElement = document.getElementById('email');
const nameElement = document.getElementById('name');
const ageElement = document.getElementById('age');
const fieldElement = document.getElementById('field');
const skillsElement = document.getElementById('skills');
const bioElement = document.getElementById('bio');
const posElement = document.getElementById('pos');



auth.onAuthStateChanged(user => {
    if (user) {
        console.log('user logged in: ', user)
        runOtherAccount(user);
    } else {
        runOtherAccount();
        console.log('user logged out')
    }
});

function runOtherAccount(user)
{
    if (user)
    {
        try{
            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            const other = urlParams.get('other');
            
            db.collection('users').where('email', '==', other).get().then(
                function (snapshot) {
                    snapshot.forEach(
                        function (doc) {
                            d = doc.data()
                            emailElement.innerHTML = d.email;
                            nameElement.innerHTML = d.name;
                            ageElement.innerHTML = d.age;
                            fieldElement.innerHTML = d.field;
                            skillsElement.innerHTML = d.skills;
                            bioElement.innerHTML = d.bio;
                            posElement.innerHTML = d.position;
                        }
                    )
                }
            )
        }
        catch(error){
            console.log(error);
        }
    }
    else
    {

    }
}