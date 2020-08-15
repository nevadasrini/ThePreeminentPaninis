class User{
/**
 * 
 * @param {int} age 
 * @param {string} field 
 * @param {string} name 
 * @param {int} phone 
 * @param {boolean} pro 
 * @param {array} skills 
 */

    constructor(age, field, name, phone, pro, skills){
      this.age = age;
      this.field = field;
      this.name = name;
      this.phone = phone;
      this.pro = pro;
      this.skills = skills;
    } 
};


  /**
   * @param {string} email - identifier of user info wanted
   */


  function getUserInfo(email){ /*in future want to use user ID*/
    return new Promise((resolve,reject)=>{

        db.collection("users").where("email","==",email).get().then(
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