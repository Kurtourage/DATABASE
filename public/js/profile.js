const whole_profile = document.querySelector('.profileBtn');
const overlay = document.querySelector('.overlay');
const profilePopup = document.querySelector('.profilepopup');
const profileClose = document.querySelector('.closeProfile');


whole_profile.addEventListener("click", () => {
    overlay.classList.add('active');
    profilePopup.classList.add('active');
});

profileClose.addEventListener("click", () => {
    overlay.classList.remove('active');
    profilePopup.classList.remove('active');
});
