const whole_profile = document.querySelector('.profileBtn');
const overlay = document.querySelector('.overlay');
const profilePopup = document.querySelector('.profilepopup');
const profileClose = document.querySelector('.closeProfile');
const characterID = document.querySelector('.character-profile');
const shopID = document.querySelector('.shop-popup');
const shopBtn = document.getElementById('shopIDBtn');
const characterBtn = document.getElementById('profileIDBtn')
const invID = document.querySelector('.inventory-popup');
const invBtn = document.getElementById('profileEditBtn');

whole_profile.addEventListener("click", () => {
    overlay.classList.add('active');
    profilePopup.classList.add('active');
    characterID.classList.add('active');
});

profileClose.addEventListener("click", () => {
    overlay.classList.remove('active');
    profilePopup.classList.remove('active');
    characterID.classList.remove('active');
    shopID.classList.remove('active');
    invID.classList.remove('active');
});

shopBtn.addEventListener("click", () => {
    characterID.classList.remove('active');
    shopID.classList.add('active');
    invID.classList.remove('active');
});
characterBtn.addEventListener("click", () => {
    characterID.classList.add('active');
    shopID.classList.remove('active');
    invID.classList.remove('active');
});
invBtn.addEventListener("click", () => {
    characterID.classList.remove('active');
    shopID.classList.remove('active');
    invID.classList.add('active');
});