document.getElementById("logoutBtn").addEventListener("click", () => {
    // Trigger the logout by fetching the /logout route
    fetch('/logout')
      .then(() => {
        // Redirect to the login page after logout
        window.location.href = '/index.html';
      })
      .catch(error => console.error('Error logging out:', error));
  });