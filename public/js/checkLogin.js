fetch('/check-login')
.then(response => response.json())
.then(data => {
  if (!data.loggedIn) {
    window.location.href = '/login.html';
  }
})
.catch(error => console.error('Error checking login status:', error));