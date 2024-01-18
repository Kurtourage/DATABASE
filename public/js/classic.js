document.addEventListener("DOMContentLoaded", function () {
    let problemStatement;
  
    function executeGameSQL(sql) {
      // Check if the timer has reached zero before executing the SQL
      if (timeLeft < 0) {
        alert("Time is up! Your score: [calculate your score here]");
        return;
      }
  
      fetch('/execute-game-sql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sql }),
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
        document.getElementById('timer').textContent = `Time Left: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        timeLeft--;
  
        if (timeLeft < 0) {
          clearInterval(timer);
          document.getElementById('timer').textContent = 'Time Up!';
          // Additional logic when the timer reaches zero (end the game, etc.)
          alert("Time is up! Your score: [calculate your score here]");
          // Additional logic to handle the end of the game
        }
      }, 1000);
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
      startTimer();
      // Call the function to execute the first SQL query when the game starts
      getProblem();
    });
  });
  