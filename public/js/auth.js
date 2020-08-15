// Project: Song Converter
// Names: Nivedha Srinivasan, Oreoluwa Alao
// Date: 6/14/20
// Task Description: Handles user authentication (log in, sign up, log out) and tracks user auth status

// listen for auth status changes and logs them to the console

function parseCSV(csv) {
    let x = csv.split(",");
    for(let i=0; i< x.length; i++){
        x[i]=x[i].trim()
    }
}

auth.onAuthStateChanged(user => {
    if (user) {
        console.log('user logged in: ', user)
        setupUI(user);
    } else {
        setupUI();
        console.log('user logged out')
    }
})

// sign up
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
    // prevent refresh (losing info)
    e.preventDefault();

    // get user info
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;
    docID = signupForm.email.value;
    db.collection('users').doc(docID).set({
        name: signupForm.name.value,
        age: signupForm.age.value,
        field: signupForm.field.value,
        skills: [signupForm.skills.value], //parseCSV(signupForm.skills.value),
        email: signupForm.email.value,
        desc: signupForm.bio.value
    })

    // sign up the user
    auth.createUserWithEmailAndPassword(email, password).then(cred => {
        const modal = document.querySelector('#modal-signup');
        M.Modal.getInstance(modal).close();
        signupForm.reset();
    })

    auth.onAuthStateChanged(user => {
        db.collection('songs').doc(docID).update({
            userID: user.uid || "none"
        })
    })
})

// log out
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
    // prevent default actions (refresh)
    e.preventDefault()
    auth.signOut().then(() => {
        //
    })
})

//  login
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
    // prevent default actions (refresh)
    e.preventDefault()

    // get user info
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;

    // log in user
    auth.signInWithEmailAndPassword(email, password).then(cred => {
        // close login modal and reset form
        const modal = document.querySelector('#modal-login');
        M.Modal.getInstance(modal).close();
        loginForm.reset();
    })
})
