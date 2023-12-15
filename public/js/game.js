const config = {
    locateFile: (filename) => `/dist/${filename}`,
  };
  initSqlJs(config).then(function (SQL) {
    const db = new SQL.Database();

    function executeGameSQL(sql) {
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


          // Function to start a level on the server
       async function startLevel(levelId) {
        try {
          const response = await fetch('/start-level', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ levelId }),
          });

          if (!response.ok) {
            throw new Error('Failed to start the level');
          }

          document.getElementById("executeBtn1").addEventListener("click", function () {
            const userInput = document.getElementById("sqlInput").value;
          executeGameSQL(userInput);
          checkLevelAnswer(userInput, generatedTableHtml);
        });
          const result = await response.json();
          console.log(result.mission); // You can use the mission data as needed

        } catch (error) {
          console.error(error);
        }

         
      }


        // Function to check the user's answer for the current level on the server
async function checkLevelAnswer(userInput, generatedTableHtml) {
  try {
    const response = await fetch('/check-level-answer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userInput, generatedTableHtml }),
    });

    if (!response.ok) {
      throw new Error('Failed to check the level answer');
    }

    const result = await response.json();
    if (result.success) {
      console.log('Level completed!'); // You can handle level completion on the client side
    } else {
      console.log('Level not completed.'); // You can handle the result accordingly
    }

  } catch (error) {
    console.error(error);
  }
}




    // Initialize the database on the server
    fetch('/initialize-game-db', {
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
      clearExit.addEventListener("click", () => {
        // Clear result
        while (tableContainer.firstChild) {
          tableContainer.removeChild(tableContainer.firstChild);
        }

      });

    
    }

    // Function to hide all levels
    function hideAllLevels() {
      const levels = document.querySelectorAll('.level');
      levels.forEach(level => {
        level.style.display = 'none';
      });
    }

    



startLevel(1);
    
  

    

  });