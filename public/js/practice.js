

const mode = 'practice';

document.addEventListener("DOMContentLoaded", function () {


  function executeGameSQL(sql) {
    // Check if the timer has reached zero before executing the SQL
  

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
             // Clear error message if successful
             document.getElementById('errorMessage').textContent = '';
        } else {
          console.error('Error executing SQL statement:', data.errorMessage);
              // Display error message
              document.getElementById('errorMessage').textContent = data.errorMessage;

        }
      })
      .catch(error => console.error('Error executing SQL statement:', error));
  }

  const config = {
    locateFile: (filename) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.0/${filename}`,
  };


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



  document.getElementById('executeBtn1').addEventListener('click', function () {
    
   
      userInput = document.getElementById('sqlInput').value;
      executeGameSQL(userInput);
    
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
const overlay = document.querySelector('.overlay');

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
const book = document.querySelector('.practiceBig');
const showBook = document.querySelector(".bookPop");
const unshowBook = document.querySelector(".book-close");


unshowBook.addEventListener("click", () => {
    book.classList.remove('active');
    overlay.classList.remove('active');
});


var timer_sound = document.getElementById('timer-sound');

