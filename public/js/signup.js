document.getElementById('signupForm').addEventListener('submit', submitSignupForm);


const signupForm = document.querySelector('.signup form');
const usernameInput = signupForm.querySelector('#username');
const usernameError = signupForm.querySelector('#username-error');
const passwordError = signupForm.querySelector('#password-error');
const passwordInput = signupForm.querySelector('#password');
const confirmPasswordInput = signupForm.querySelector('#confirm_password');
const emailInput = signupForm.querySelector('#email');



function submitSignupForm(event) {
    event.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    const email = emailInput.value.trim();
    const confirm_password = confirmPasswordInput.value.trim();
    
    if (username.length > 15) {
        usernameError.textContent = "Username longer than 15 characters"  || "An error occured";
    }

    if (password === confirm_password) {

        usernameError.textContent = '';
        passwordError.textContent = '';
        // Use fetch API to send a POST request to the server
        fetch('/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password, email })
        })

     
       
       
        .then(data => {
            if (data.status === 200) {
           
                window.location.href = '/menu.html';
            
            } else {
                // Handle other status codes as needed
                console.error('Unexpected status code:', response.status);
            }
    

        }) 
        

    }

    else {
        console.log("Passwords do not match.")
        passwordError.textContent = "Passwords do not match." || 'An error occurred.';
    }
   
};

