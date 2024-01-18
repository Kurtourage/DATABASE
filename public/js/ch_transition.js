const slides = document.querySelector('.slide');
const title = document.querySelector('.title');
const first = document.querySelector('.text-1');
const second = document.querySelector('.text-2');
const next1 = document.querySelector('.next-btn-1');
const next2 = document.querySelector('.next-btn-2');
const end = document.querySelector('.end-btn');

next1.addEventListener("click", ()=>{
    title.classList.remove("active");
    first.classList.add('active');
    next2.classList.add('active');
    next1.classList.remove('active');
})
next2.addEventListener("click", ()=>{
    first.classList.remove('active');
    second.classList.add('active');
    end.classList.add('active');
    next2.classList.remove('active');
})
end.addEventListener("click", ()=>{
    second.classList.remove('active');
    end.classList.remove('active');
    slides.classList.remove('visible');
})



