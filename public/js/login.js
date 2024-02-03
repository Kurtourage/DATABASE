


const container = document.querySelector(".container"),
    signup = document.querySelector(".signup-link"),
    login = document.querySelector(".login-link")

    signup.addEventListener("click", ()=>{
        container.classList.add("active");
    })
    login.addEventListener("click", ()=>{
        container.classList.remove("active");
    })


    document.addEventListener('DOMContentLoaded', function () {
        const loginButton = document.getElementById('loginButton');
        loginButton.addEventListener('click', submitLoginForm);
    });
    
    function submitLoginForm() {
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
    
        // Perform AJAX request for login
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        })
        .then(response => response.json())
        .then(data => {
            // Display error message in the corresponding error container
            const errorContainer = document.getElementById(data.type + '-error');
            errorContainer.textContent = data.error || ''; // If there's no error, clear the previous error message
            
            // If there's an error, you can display an alert or handle it in another way
            if (data.error) {
                alert(data.error);
            }
        })
        .catch(error => {
            console.error('Error during login:', error);
            // Handle other errors if needed
        });
    }
    