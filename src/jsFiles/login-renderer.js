document.getElementById("username-icon").hidden = true;
document.getElementById("password-icon").hidden = true;
let uname = document.getElementById("username");
let password = document.getElementById("password");

document.getElementById("login").onclick = (e) => {
    let fields = {
        username: uname.value.trim(),
        password:  password.value.trim()
    }
    window.api.send("login-check", fields);
    //location.href = './index.html'
}

window.api.receive("login-status", (data) => {
    if(data)
    location.href = './index.html'
    else  {
        M.toast({html: 'Invalid username or password!'});
    }

})

uname.onclick = (e) => {
    checkUnameValidity(); 
}

password.onclick = (e) => {
    checkPasswordValidity();
}

uname.addEventListener("input",function(e){
  if(e.keyCode == 32){
    e.preventDefault();
  }
  checkUnameValidity(); 
  removeDisabled();
})

password.addEventListener("input",function(e){
    console.log(event)
    if(e.keyCode == 32){
      e.preventDefault();
    }    
    checkPasswordValidity();
    removeDisabled();
  })

function checkUnameValidity() {
    if(!uname.checkValidity()) {
        document.getElementById("username-icon").hidden = false;
      }
      else {
        document.getElementById("username-icon").hidden = true;
      }
}

function checkPasswordValidity() {
    if(!password.checkValidity()) {
        document.getElementById("password-icon").hidden = false;
      }
      else {
        document.getElementById("password-icon").hidden = true;
      }
}


function removeDisabled() {
    if(uname.checkValidity() && password.checkValidity())
        document.getElementById("login").classList.remove("disabled");
    else 
    document.getElementById("login").classList.add("disabled");
}

