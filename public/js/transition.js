window.onload = () => {
    const transition_el = document.querySelector('.transition');
    setTimeout(() => {
        transition_el.classList.remove('is-active');
    }, 1);
}

const imgs = document.querySelectorAll('img');
const prev = document.querySelector('.prev');
const next = document.querySelector('.next');

let index = 0;

function layout() {
  const xOffsetStep = 100;
  const count = imgs.length;
  const scaleStep = 0.6;
  const opacityStep = 0;
  const imageSources = [
    "https://cdn.discordapp.com/attachments/1142426341002711040/1149739540840456192/img2.jpg",
    "https://cdn.discordapp.com/attachments/1142426341002711040/1149739541066961046/img3.jpg",
    "https://cdn.discordapp.com/attachments/1142426341002711040/1149739541347971153/img4.jpg",
    "https://cdn.discordapp.com/attachments/1142426341002711040/1149739541603819612/img5.jpg",
    "https://cdn.discordapp.com/attachments/1142426341002711040/1149739541868072960/img6.jpg",
    "https://cdn.discordapp.com/attachments/1142426341002711040/1149739540555247620/img1.jpg"
  ];
  
  for(let i = 0; i < imgs.length; i++){
    img = imgs[i];

    
    const sign = Math.sign(i - index);

    let xOffset = (i - index) * xOffsetStep;
    if(i!==index) {
      xOffset = xOffset + 80 * sign;
    }
    const scale = scaleStep ** Math.abs(i - index);
    const rotateY = i === index ? 0 : 30 * -sign;
    img.style.transform = `perspective(800px) translateX(${xOffset}px) scale(${scale}) rotateY(${rotateY}deg)`;
    
    let opacity = opacityStep ** Math.abs(i - index);
    if(Math.abs(i - index) > 2) {
      opacity = 0
    }
    img.style.opacity = opacity;
    
    img.style.zIndex = count - Math.abs(index - i);
    img.src = imageSources[i];
  }
}
layout();

next.addEventListener('click', ()=>{ 
  index++;
  if(index > imgs.length-1){
    index = imgs.length-1;
  }
  layout();
})

prev.addEventListener('click', ()=>{ 
  index--;
  if(index < 0){
    index = 0;
  }
  layout();
})






