
var audio = document.getElementById("music-sound");
window.onload = () => {
    const transition_el = document.querySelector('.transition');
    setTimeout(() => {
        transition_el.classList.remove('is-active');
    }, 1);
    audio.volume = 0.02;
    audio.loop = true;
    audio.play();
}

const music_btn = document.querySelector('.music-btn');
music_btn.addEventListener("click", () => {
    music_btn.classList.toggle('inactive');
    if (music_btn.classList.contains('inactive')) {
        audio.volume = 0;
    } else {
        // Set the desired volume when the 'inactive' class is not present
        audio.volume = 0.02;
    }
});








