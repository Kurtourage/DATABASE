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
    "assets/testimony/testimony1.png",
    "assets/testimony/testimony2.png",
    "assets/testimony/testimony3.png",
    "assets/testimony/testimony4.png",
    "assets/testimony/testimony5.png",
    "assets/testimony/testimony6.png",
    "assets/testimony/testimony7.png",
    "assets/testimony/testimony8.png",
    "assets/testimony/testimony9.png",
    "assets/testimony/testimony10.png",
    "assets/testimony/testimony11.png",
    "assets/testimony/testimony12.png",
    "assets/testimony/testimony13.png",
    "assets/testimony/testimony14.png",
    "assets/testimony/testimony15.png",
    "assets/testimony/testimony16.png",
    "assets/testimony/testimony17.png",
    "assets/testimony/testimony18.png",
    "assets/testimony/testimony19.png",
    "assets/testimony/testimony20.png",
    "assets/testimony/testimony21.png",
    "assets/testimony/testimony22.png",
    "assets/testimony/testimony23.png",
    "assets/testimony/testimony24.png",
    "assets/testimony/testimony25.png",
    "assets/testimony/testimony26.png",
    "assets/testimony/testimony27.png",
    "assets/testimony/testimony28.png",
    "assets/testimony/testimony29.png",
    "assets/testimony/testimony30.png",
    "assets/testimony/testimony31.png",
    "assets/testimony/testimony32.png",
    "assets/testimony/testimony33.png",
    "assets/testimony/testimony34.png",
    "assets/testimony/testimony35.png",
    "assets/testimony/testimony36.png",
    "assets/testimony/testimony37.png",
    "assets/testimony/testimony38.png",
    "assets/testimony/testimony39.png",
    "assets/testimony/testimony40.png",
    "assets/testimony/testimony41.png",
    "assets/testimony/testimony42.png",
    "assets/testimony/testimony43.png",
    "assets/testimony/testimony44.png"    
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

const newspaperContent = `
`