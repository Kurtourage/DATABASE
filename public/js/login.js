const container = document.querySelector(".container"),
    signup = document.querySelector(".signup-link"),
    login = document.querySelector(".login-link")

    signup.addEventListener("click", ()=>{
        container.classList.add("active");
    })
    login.addEventListener("click", ()=>{
        container.classList.remove("active");
    })



