const mode = 'story';


const config = {
    locateFile: (filename) => `/dist/${filename}`,
  };
  initSqlJs(config).then(function (SQL) {
    
    let userInput;
    

     function executeGameSQL(sql) {
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



// Function to extract the level number from the file name
function getCurrentLevelNumber() {
  // Extract the number from the file name (e.g., "CH1.html" -> 1)
  const match = window.location.pathname.match(/\/CH(\d+)\.html/);
  return match ? parseInt(match[1], 5) : 1; // Default to level 1 if not found
}

// Function to start the current level on page load
function startCurrentLevel() {
  const currentLevelNumber = getCurrentLevelNumber();
  startLevel(currentLevelNumber);
}

let missionObj = [];
let mission = [];


// Keep track of completed missions
 let completedMissions = [];

// Call startCurrentLevel() on page load
startCurrentLevel();
  

  

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

         
          const result = await response.json();
          missionObj = result.objective;
          mission = result.mission;
          completedMissions = [];

          updateHUD(missionObj);
          console.log(result);
          

        } catch (error) {
          console.error(error);
        }

         
      }


      document.getElementById("executeBtn1").addEventListener("click", function () {
        userInput = document.getElementById('sqlInput').value;
        executeGameSQL(userInput);
      });
      document.getElementById('sqlInput').addEventListener('keyup', function (event) {
        if (event.key === 'Enter') {
            // Trigger the click event for the button
            document.getElementById("executeBtn1").click();
        }
      });
  
  
      

    // Function to send the user's input to the server for checking
    async function checkUserAnswer() {
      
      try {
        const response = await fetch('/check-level-answer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({userInput}),
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





// Function to update the HUD with the current level mission
function updateHUD(missionObj) {
  fetch('/update-hud')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch update-hud response');
      }
      return response.json();
    })
    .then(completedMissionsIndices => {
      // Process the completed missions indices from the server response
      console.log('Completed missions indices:', completedMissionsIndices);

      // Clear previous HUD content
      hudContainer.innerHTML = '';

      // Create a new element to display the level mission
      const levelMissionElement = document.createElement('h1');
      levelMissionElement.textContent = `Objectives:`;
      hudContainer.appendChild(levelMissionElement);

      // Check if missionObj exists and is an array
      if (missionObj && Array.isArray(missionObj)) {
        // Create a new element for the missionObj in bullet form
        const missionObjElement = document.createElement('ul');
        missionObj.forEach((objective, index) => {
          const listItem = document.createElement('li');
          // Check if the current mission index is in the completed missions array
          const isMissionCompleted = completedMissionsIndices.includes(index);

          // Apply strikethrough for completed missions
          if (isMissionCompleted) {
            const strikeThroughElement = document.createElement('s');
            strikeThroughElement.textContent = objective;
            strikeThroughElement.classList.add('completed-mission');
            listItem.appendChild(strikeThroughElement);
          } else {
            listItem.textContent = objective;
          }

          missionObjElement.appendChild(listItem);
        });

        // Append the missionObj element to the HUD container
        hudContainer.appendChild(missionObjElement);
      }
    })
    .catch(error => {
      console.error('Error fetching update-hud response:', error);
    });
}

// Assume you have defined hudContainer elsewhere in your code.
    const hudContainer = document.getElementById('hud-container');




    // Function to handle the result of checking the user's answer
    function handleCheckResult(result) {
      const resultMessage = document.getElementById('result-message');
      const buttonContainer = document.getElementById('button-container');

      updateHUD(missionObj);
      buttonContainer.innerHTML = '';
      if (result.success == true) {
          
        
        const currentLevelMission = result.mission;
        if (!completedMissions.includes(currentLevelMission)) {
          completedMissions.push(currentLevelMission);
        }
        resultMessage.textContent = 'Level completed!'; 

         // Create a button
          const nextLevelButton = document.createElement('button');
          nextLevelButton.textContent = 'Click anywhere to continue';
          nextLevelButton.id = 'nextLevelButton';
          

        // Append the button to the container
        buttonContainer.appendChild(nextLevelButton);
        document.getElementById('nextLevelButton').addEventListener('click', startNextLevel)
      } 
    }

    // Event listener for the submit button
    document.getElementById('executeBtn1').addEventListener('click', checkUserAnswer);




    async function startNextLevel() {
      try {
        const response = await fetch('/start-next-level', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        });
  
        if (!response.ok) {
          throw new Error('Failed to start the next level');
        }
  
        const result = await response.json();
        console.log(result.mission); // You can use the mission data as needed
        handleStartNextLevelResult(result);
      } catch (error) {
        console.error(error);
      }
    }
  
    function handleStartNextLevelResult(result) {
      const resultMessage = document.getElementById('result-message');
      const buttonContainer = document.getElementById('button-container');
  
      buttonContainer.innerHTML = '';
      if (result.success) {
        resultMessage.textContent = 'Next level started!';

        
        const nextLevelNumber = result.nextLevelNumber; // Adjust this based on your server response
        window.location.href = result.redirectUrl;
        startLevel(nextLevelNumber);
        
        // You can also trigger any additional logic here if needed
      } else {
        resultMessage.textContent = 'Unable to start the next level. ' + result.message;
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
    }
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

