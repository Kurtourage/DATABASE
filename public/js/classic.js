

const mode = 'classic';

document.addEventListener("DOMContentLoaded", function () {
  let problemStatement;
  let correctAnswers;

  function executeGameSQL(sql) {
    // Check if the timer has reached zero before executing the SQL
    if (timeLeft < 0) {
      alert("Time is up! Your score: ", correctAnswers);
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
          displayResults(data.tableHtml);
        } else {
          console.error('Error executing SQL statement:', data.error);
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
    const clearExit = document.querySelector(".computer-close");

    // Clear previous results
    while (tableContainer.firstChild) {
      tableContainer.removeChild(tableContainer.firstChild);
    }
    tableContainer.innerHTML = tableHtml;

    clearContainer.addEventListener("click", () => {
      // Clear result
      while (tableContainer.firstChild) {
        tableContainer.removeChild(tableContainer.firstChild);
      }
    });
  }

  let userInput;

  let timer;
  let timeLeft = 1 * 60; // 5 minutes in seconds

  function startTimer() {
    timer = setInterval(function () {
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      document.getElementById('timer').textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
      timeLeft--;

      if (timeLeft < 0) {

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
        document.getElementById('timer').textContent = 'Time Up!';
        // Additional logic when the timer reaches zero (end the game, etc.)
        alert("Time is up! Your score: ", correctAnswers);
        showStartAgainButton();

        fetch('/classic-add-coins', {
          method: 'get',
          headers: {
            'Content-Type': 'application/json',
          },
        }) 
        .then(response => response.json())
        .then(data => {
          console.log('Server resonse: ', data);

              // Display coins information in a new div
          const coinsInfoDiv = document.getElementById('coins-info');
          coinsInfoDiv.textContent = `You earned ${data.coins} coins!`;

          const correctAnswersInfoDiv = document.getElementById('correct-answers-info');
          correctAnswersInfoDiv.textContent = `You got ${data.correctAnswers} correct answers!`;
  
          // You can further customize how the correct answers information is displayed (e.g., styling)
          correctAnswersInfoDiv.style.display = 'block';
          
        // You can further customize how the coins information is displayed (e.g., styling)
        coinsInfoDiv.style.display = 'block';

        })

        .catch(error => {

          console.error("error sending request: ", error);
        })
      }
    }, 1000);
  }




  function showStartAgainButton() {
    const startAgainButton = document.createElement('button');
    startAgainButton.textContent = 'Start Again';
    startAgainButton.id = 'startAgainButton';
  
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
    });
  
    document.body.appendChild(startAgainButton);
  }
  

  function resetGame() {
    timeLeft = 1 * 60;
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

