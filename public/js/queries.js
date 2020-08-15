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

/*
  /**
   * @param {string} userToken - identifier of user info wanted
   *//*


function getUserInfo(userToken){
    alert(userToken);
    let docRef = db.collection("users").doc(userToken);
    docRef.get().then(
      function(doc) {
          if(doc.exists) { 
            console.log(doc.data());
            return doc.data();
          }
        }
    ).catch((error) => console.log(error));
  }
*/