document.getElementById('signupForm').addEventListener('submit', submitSignupForm);


const signupForm = document.querySelector('.signup form');
const usernameInput = signupForm.querySelector('#username');
const usernameError = signupForm.querySelector('#username-error');
const passwordError = signupForm.querySelector('#password-error');
const passwordInput = signupForm.querySelector('#password');
const confirmPasswordInput = signupForm.querySelector('#confirm_password');
const emailInput = signupForm.querySelector('#email');
const emailError = signupForm.querySelector('#email-error');

usernameError.textContent = '';
passwordError.textContent = '';

function submitSignupForm(event) {
    event.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    const email = emailInput.value.trim();
    const confirm_password = confirmPasswordInput.value.trim();
    
    usernameError.textContent = "";
    passwordError.textContent = "";
    emailError.textContent = "";

    if (username.length > 15) {
        usernameError.textContent = "Username longer than 15 characters"  || "An error occured";
        return;
    }

    if (password === confirm_password) {
        
        emailError.textContent = '';
        usernameError.textContent = '';
        passwordError.textContent = '';

        fetch('/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password, email })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Redirect or perform any client-side action
                window.location.href = '/menu.html';
            }

            else {
                  // Handle other scenarios if needed
                console.error('Signup unsuccessful:', data.error);
                usernameError.textContent = data.reason;
                emailError.textContent = data.reason;
            }
        })
        .catch(error => {
            console.error('Error during signup:', error);
          
        });


    }

    else {
        console.log("Passwords do not match.")
        passwordError.textContent = "Passwords do not match." || 'An error occurred.';
    }
   
};

