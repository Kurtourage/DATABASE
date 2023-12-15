const slides = document.querySelectorAll('.slide');
const overlay_slide = document.querySelector(".overlay-slide");
let currentIndex = 0;
const nextBtn = document.getElementById('next-btn');
const endBtn = document.getElementById('end-btn');

nextBtn.addEventListener('click', () => {
    overlay_slide.classList.add('active');
    if (currentIndex < slides.length - 1) {
        slides[currentIndex].classList.remove('visible');
        currentIndex++;
        slides[currentIndex].classList.add('visible');
        if (currentIndex === slides.length - 1) {
            nextBtn.style.display = 'none';
            endBtn.style.display = 'block';
        }
    }
});

endBtn.addEventListener('click', () => {
    slides.forEach(slide => slide.classList.remove('visible'));
    overlay_slide.classList.remove('active');
});


