auth.onAuthStateChanged(user => {
    if (user) {
        console.log('user logged in: ', user)
        runChat(user);
    }
    else {
        runChat();
        console.log('user logged out')
    }
})

function runChat (user)
{
    let thisUser;
    if (user)
    {
        
        db.createCollectionItem('users').get().then((snapshot) => {
            snapshot.docs.forEach(doc => {
                
                if (doc.data().userID == user.uid){
                    thisUser = doc.data(); 

                }

            })
        })
        
    }
    else {
        console.log('you\'re not logged in!')
    }
}