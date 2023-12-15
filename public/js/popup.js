// FOR BOARD
const board = document.querySelector('.boardBig');
const overlay = document.querySelector('.overlay');
const showBoard = document.querySelector(".boardPop");
const unshowBoard = document.querySelector(".board-close");

showBoard.addEventListener("click", () => {
    board.classList.add('active');
    overlay.classList.add('active');
});

unshowBoard.addEventListener("click", () => {
    board.classList.remove('active');
    overlay.classList.remove('active');
});

//FOR COMPUTER
const computer = document.querySelector('.computerBig');
const showComputer = document.querySelector(".computerPop");
const unshowComputer = document.querySelector(".computer-close");

showComputer.addEventListener("click", () => {
    computer.classList.add('active');
    overlay.classList.add('active');
    
});

unshowComputer.addEventListener("click", () => {
    computer.classList.remove('active');
    overlay.classList.remove('active');
});

const textarea = document.querySelector("textarea");
let prevScrollHeight = textarea.scrollHeight;

textarea.addEventListener("input", function(e) {
    let newScrollHeight = this.scrollHeight;
    if (prevScrollHeight > newScrollHeight) {
        this.style.height = `${newScrollHeight - prevScrollHeight }px`;

    } else {
        this.style.height = "auto";
        this.style.height = `${this.scrollHeight}px`;
    }
    prevScrollHeight = newScrollHeight;
});

// FOR BOOK
const book = document.querySelector('.bookBig');
const showBook = document.querySelector(".bookPop");
const unshowBook = document.querySelector(".book-close");

showBook.addEventListener("click", () => {
    book.classList.add('active');
    overlay.classList.add('active');
});

unshowBook.addEventListener("click", () => {
    book.classList.remove('active');
    overlay.classList.remove('active');
});

// FOR RIDDLE
const riddle = document.querySelector('.riddleBig');
const showRiddle = document.querySelector(".riddlePop");
const unshowRiddle = document.querySelector(".riddle-close");

showRiddle.addEventListener("click", () => {
    riddle.classList.add('active');
    overlay.classList.add('active');
});

unshowRiddle.addEventListener("click", () => {
    riddle.classList.remove('active');
    overlay.classList.remove('active');
});

// FOR tutorial
const tutorial = document.querySelector('.tutorialBig');
const showTutorial = document.querySelector(".tutorialPop");
const unshowTutorial = document.querySelector(".tutorial-close");

showTutorial.addEventListener("click", () => {
    tutorial.classList.add('active');
    overlay.classList.add('active');
});

unshowTutorial.addEventListener("click", () => {
    tutorial.classList.remove('active');
    overlay.classList.remove('active');
});

// FOR tutorial
const newspaper = document.querySelector('.newspaperBig');
const showNewspaper = document.querySelector(".newspaperPop");
const unshowNewspaper = document.querySelector(".newspaper-close");

showNewspaper.addEventListener("click", () => {
    newspaper.classList.add('active');
    overlay.classList.add('active');
});

unshowNewspaper.addEventListener("click", () => {
    newspaper.classList.remove('active');
    overlay.classList.remove('active');
});
