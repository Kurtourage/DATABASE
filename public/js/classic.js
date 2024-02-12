

const mode = 'classic';

document.addEventListener("DOMContentLoaded", function () {
  let problemStatement;
  let correctAnswers;


  function getDbCoins(){
    fetch('/get-dbcoins', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

  }

  function executeGameSQL(sql) {
    // Check if the timer has reached zero before executing the SQL
    if (timeLeft < 0) {
      showStartAgainButton();
      return;
    }

    fetch('/execute-game-sql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql, mode }),
      
          })
          .then(response => response.json())
          .then(data => {
            if (data.success) {
              console.log("Query results:", data.tableHtml);
                
                 // Clear error message if successful
                 document.getElementById('errorMessage').textContent = '';
                 displayResults(data.tableHtml);
            } else { 
              console.error('Error executing SQL statement:', data.errorMessage);
                  // Display error message
                  const tableContainer = document.getElementById("tableContainer");
                  while (tableContainer.firstChild) {
                    tableContainer.removeChild(tableContainer.firstChild);
                  }
                  document.getElementById('errorMessage').textContent = data.errorMessage;
    
            }
          })
        .catch(error => console.error('Error executing SQL statement:', error));
    
  }

  const config = {
    locateFile: (filename) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.0/${filename}`,
  };

  // Initialize the database on the server
  fetch('/initialize-db', {
    method: 'POST',
  })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error initializing database:', error));

    function displayResults(tableHtml) {
      const tableContainer = document.getElementById("tableContainer");
      const clearContainer = document.getElementById("clearTable");
    
      // Clear previous results
      while (tableContainer.firstChild) {
        tableContainer.removeChild(tableContainer.firstChild);
      }
      tableContainer.innerHTML = tableHtml;
    }
    
    // Event listener for clearContainer outside of displayResults
    document.getElementById("clearTable").addEventListener("click", () => {
      console.log("clear table is clicked.");
    
      // Check if there's an error message and clear it
      const errorMessageElement = document.getElementById('errorMessage');
      if (errorMessageElement.textContent.trim() !== '') {
        errorMessageElement.textContent = '';
      }
    
      // Clear other elements or perform additional actions if needed
      // For example, clear the table results
      const tableContainer = document.getElementById("tableContainer");
      while (tableContainer.firstChild) {
        tableContainer.removeChild(tableContainer.firstChild);
      }
    });
    


    
    

    
  let userInput;

  let timer;
  let timeLeft = 10 * 60; // 5 minutes in seconds

  function startTimer() {
    timer = setInterval(function () {
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      document.getElementById('timer').textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
      timeLeft--;

      if (timeLeft < 0) {

       

        fetch('/classic-add-coins', {
          method: 'get',
          headers: {
            'Content-Type': 'application/json',
          },
        }) 
        .then(response => response.json())
        .then(data => {
              // Display coins information in a new div
          const overlayactive = document.querySelector('.overlay');
          const postgameactive = document.getElementById('post-game');
          const coinsInfoDiv = document.getElementById('coins-info');
          coinsInfoDiv.textContent = `${data.coins}`;
          const correctAnswersInfoDiv = document.getElementById('correct-answers-info');
          correctAnswersInfoDiv.textContent = `${data.correctAnswers}`;
          // You can further customize how the correct answers information is displayed (e.g., styling)
          correctAnswersInfoDiv.style.display = 'block';
          postgameactive.classList.add('active');
        // You can further customize how the coins information is displayed (e.g., styling)
          coinsInfoDiv.style.display = 'block';
          overlayactive.classList.add('active');
          board.classList.remove('active');
          computer.classList.remove('active');
          riddle.classList.remove('active');
          tutorial.classList.remove('active');
          timer_sound.pause();
        })

        .catch(error => {

          console.error("error sending request: ", error);
        })


        fetch('/update-high-score', {
          method: 'GET',
          headers: {
            'Content-type': 'Application/json',
          },
        })

        .then(response => {
          if(!response.ok) {
            throw new Error ('Network response not OK');
          }
          return response.json();
        })

        .then(data => {
          console.log('Server response: ', data);
        })

        .catch(error => {
          console.error('Error: ', error); 
        })
        clearInterval(timer);
        // Additional logic when the timer reaches zero (end the game, etc.)
        showStartAgainButton();
      }
    }, 1000);
  }



  function showStartAgainButton() {
    const startAgainButton = document.createElement('button');
    startAgainButton.id = 'startAgainButton';
    const postgame = document.getElementById('post-game');
    const overlaystartAgain = document.querySelector('.overlay');
    const postStartAgain = document.querySelector('.startagain-btn');
    startAgainButton.addEventListener('click', function () {
      // Perform the reset on the client side
      resetGame();
      // Fetch the reset-counter endpoint on the server side
      fetch('/reset-counter', {
        method: 'POST',
      })
      .then(response => response.json())
      .then(data => {
        console.log('Counter reset on the server side:', data);
      })
      .catch(error => console.error('Error resetting counter on the server side:', error));
  
      // Start the timer, get a new problem, and remove the "Start Again" button
      startTimer();
      getProblem();
      document.getElementById('startAgainButton').remove();
      postgame.classList.remove('active');
      overlaystartAgain.classList.remove('active');
      timer_sound.currentTime = .5;
      timer_sound.play();
      timer_sound.volume = 0.5;
    });
    postStartAgain.appendChild(startAgainButton);
  }
  

  function resetGame() {
    timeLeft = 10 * 60;
    userInput = '';
    document.getElementById('sqlInput').value = '';
    document.getElementById('timer').textContent = '';
    document.getElementById('hud-container').textContent = '';
    document.getElementById('button-container').innerHTML = '';
  }

  function getProblem() {
    fetch('/random-sql-template', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          console.log("Problem Statement:", data.problemStatement);
          console.log("Generated SQL Query:", data.sqlQuery);
          problemStatement = data.problemStatement;
          
          correctAnswers = data.counter;
          console.log(data.counter);
          updateHUD(problemStatement);
        } else {
          console.error('Error generating random SQL template:', data.error);
        }
      })
      .catch(error => console.error('Error generating random SQL template:', error));
  }

  function handleCheckResult(result) {
    const resultMessage = document.getElementById('result-message');
    const buttonContainer = document.getElementById('button-container');

    buttonContainer.innerHTML = '';
    if (result.success == true) {
      getProblem();
    }
  }

  // Function to update the HUD with the problem statement
  function updateHUD(problemStatement) {
    const hudContainer = document.getElementById('hud-container');
    hudContainer.textContent = problemStatement;
  }

  document.getElementById('executeBtn1').addEventListener('click', function () {
    // Check if the timer has reached zero before allowing the user to input
    if (timeLeft >= 0) {
      userInput = document.getElementById('sqlInput').value;
      executeGameSQL(userInput);
    }
  });

  document.getElementById("executeBtn1").addEventListener("click", checkUserAnswer);

  async function checkUserAnswer() {
    try {
      const response = await fetch('/check-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userInput }),
      });

      if (!response.ok) {
        throw new Error('Failed to check the level answer');
      }

      const result = await response.json();
      handleCheckResult(result);

    } catch (error) {
      console.error(error);
    }
  }

  document.getElementById('startGameBtn').addEventListener('click', function () {
    timer_sound.currentTime = .5;
    timer_sound.play();
    timer_sound.volume = 0.5;
    resetGame();
    startTimer();
    // Call the function to execute the first SQL query when the game starts
    getProblem();
  });
});

const cheatsheetContent = `
<div class="cheatsheet">
<br>
<h3>Basic Commands:</h3>
<br>
<p><strong>CREATE:</strong> Used to create a new table in a database.<br>
<em>CREATE TABLE table_name (column1 datatype, column2 datatype,<br>column3 datatype);</em></p>
<br>
<p><strong>SELECT:</strong> Retrieve data from a database.<br>
<em>SELECT column1, column2 FROM table_name WHERE condition;</em></p>
<br>
<p><strong>INSERT:</strong> Add new records into a table.<br>
<em>INSERT INTO table_name (column1, column2) VALUES (value1, value2);</em></p>
<br>
<p><strong>UPDATE:</strong> Modify existing records in a table.<br>
<em>UPDATE table_name SET column1 = value1 WHERE condition;</em></p>
<br>
<p><strong>DELETE:</strong> Remove records from a table.<br>
<em>DELETE FROM table_name WHERE condition;</em></p>
<br>
<hr>
<br>
<h3>Data Types:</h3>
<br>
<p><strong>INTEGER:</strong><br>
Examples:<br>
<em>INT<br> INTEGER<br> TINYINT<br> SMALLINT<br> MEDIUMINT<br> BIGINT<br> UNSIGNED BIG INT<br> INT2<br> INT3</em><br>
<strong>TEXT:</strong><br>
Examples:<br>
<em>CHARACTER(20)<br> VARCHAR(255)<br> VARYING CHARACTER(255)<br> NCHAR(55)<br> NATIVE CHARACTER(70)<br> NVARCHAR(100)<br> TEXT<br> CLOB</em><br>
<strong>BLOB:</strong><br>
Examples:<br>
<em>BLOB</em><br>
<strong>REAL:</strong><br>
Examples:<br>
<em>DOUBLE<br> DOUBLE PRECISION<br> FLOAT</em><br>
<strong>NUMERIC:</strong><br>
Examples:<br>
<em>DECIMAL(10, 5)<br> BOOLEAN<br> DATE<br> DATETIME</em><br>
</p>
<br>
<hr>
<br>
      <h3>Filtering Data:</h3>
      <br>
      <p><strong>WHERE:</strong> Conditionally filter rows.<br>
      <em>SELECT * FROM table_name WHERE condition;</em></p>
      <br>
      <p><strong>AND/OR:</strong> Combine multiple conditions.<br>
      <em>SELECT * FROM table_name WHERE condition1 AND/OR condition2;</em></p>
      <br>
      <p><strong>LIKE:</strong> Pattern matching with wildcard characters.<br>
      <em>SELECT * FROM table_name WHERE column_name LIKE 'pattern';</em></p>
      <br>
      <hr>
      <br>
      <h3>Sorting Data:</h3>
      <br>
      <p><strong>ORDER BY:</strong> Sort query results.<br>
      <em>SELECT * FROM table_name ORDER BY column_name ASC/DESC;</em></p>
      <br>
      <hr>
      <br>
      <h3>Aggregation Functions:</h3>
      <br>
      <p><strong>COUNT:</strong> Count number of rows.<br>
      <em>SELECT COUNT(column_name) FROM table_name;</em></p>
      <br>
      <p><strong>SUM:</strong> Calculate sum of values.<br>
      <em>SELECT SUM(column_name) FROM table_name;</em></p>
      <br>
      <p><strong>AVG:</strong> Compute average value.</em><br>
      <em>SELECT AVG(column_name) FROM table_name;</em></p>
      <br>
      <p><strong>MAX/MIN:</strong> Retrieve maximum/minimum value.<br>
      <em>SELECT MAX(column_name) FROM table_name;</em><br>
      <em>SELECT MIN(column_name) FROM table_name;</em></p>
      <br>
      <hr>
      <br>
      <h3>Joining Tables:</h3>
      <br>
      <p><strong>INNER JOIN:</strong> Combine rows from different tables.<br>
      <em>SELECT * FROM table1 INNER JOIN table2 ON table1.column_name = table2.column_name;</em></p>
      <br>
      <p><strong>LEFT JOIN:</strong> Retrieve all records from the left table and matching records from the right table.<br>
      <em>SELECT * FROM table1 LEFT JOIN table2 ON table1.column_name = table2.column_name;</em></p>
      <br>
      <p><strong>RIGHT JOIN:</strong> Retrieve all records from the right table and matching records from the left table.<br>
      <em>SELECT * FROM table1 RIGHT JOIN table2 ON table1.column_name = table2.column_name;</em></p>
      <br>
      <hr>
      <br>
      <h3>Grouping Data:</h3>
      <br>
      <p><strong>GROUP BY:</strong> Group rows that have the same values.<br>
      <em>SELECT column1, COUNT(column2) FROM table_name GROUP BY column1;</em></p>
      <br>
      <p><strong>HAVING:</strong> Filter groups based on conditions.<br>
      <em>SELECT column1, COUNT(column2) FROM table_name GROUP BY column1 HAVING COUNT(column2) > value;</em></p>
      <br>
      <br>
  </div>`;

const existingDiv = document.getElementById('cheatsheet');
existingDiv.innerHTML = cheatsheetContent;

const starting = document.querySelector('.startgame');

starting.addEventListener("click", () => {
  starting.classList.remove('active');
});

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
// FOR BOOK
const book = document.querySelector('.classicBig');
const showBook = document.querySelector(".bookPop");
const unshowBook = document.querySelector(".book-close");


unshowBook.addEventListener("click", () => {
    book.classList.remove('active');
    overlay.classList.remove('active');
});

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
    "assets/classic-tutorial/classic1.png",
    "assets/classic-tutorial/classic2.png"
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
  prev.classList.add('active');
  next.classList.remove('active');
})

prev.addEventListener('click', ()=>{ 
  index--;
  if(index < 0){
    index = 0;
  }
  layout();
  prev.classList.remove('active');
  next.classList.add('active');
})
var timer_sound = document.getElementById('timer-sound');
const music_btn = document.querySelector('.music-btn');
music_btn.addEventListener("click", () => {
    music_btn.classList.toggle('inactive');
    if (music_btn.classList.contains('inactive')) {
        timer_sound.volume = 0;
    } else {
        // Set the desired volume when the 'inactive' class is not present
        timer_sound.volume = 0.5;
    }
});

