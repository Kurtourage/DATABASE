window.onload = () => {
    const transition_el = document.querySelector('.transition');
    setTimeout(() => {
        transition_el.classList.remove('is-active');
    }, 1);

    var audio = document.getElementById("music-btn");
    audio.loop = true;
    audio.play();
}






