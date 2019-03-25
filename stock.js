


let db;
let tasks;
let dbReq = indexedDB.open('simpleTasks', 1,);
dbReq.onupgradeneeded = function(event) {
  // Set the db variable to our database so we can use it!  
  db = event.target.result;
  getAndDisplayTasks(db);

  // Create an object store named notes. Object stores
  // in databases are where data are stored.
  let tasks = db.createObjectStore('tasks', {autoIncrement: true});
}

dbReq.onsuccess = function(event) {
  db = event.target.result;
}

dbReq.onerror = function(event) {
  alert('error opening database ' + event.target.errorCode);
}


function addTask(db, message) {
  // Start a database transaction and get the notes object store
  let tx = db.transaction(['tasks'], 'readwrite');
  let store = tx.objectStore('tasks');
  // Put the sticky note into the object store
  let task = {text: message};
  store.add(task);
  // Wait for the database transaction to complete
  tx.oncomplete = function() { getAndDisplayTasks(db);  }
  tx.onerror = function(event) {
    alert('error storing task ' + event.target.errorCode);
  }
}

dbReq.onsuccess = function(event) {
  db = event.target.result;
}


function getAndDisplayTasks(db) {
  let tx = db.transaction(['tasks'], 'readonly');
  let store = tx.objectStore('tasks');
  // Create a cursor request to get all items in the store, which 
  // we collect in the allNotes array
  let req = store.openCursor();
  let allTasks = [];

  req.onsuccess = function(event) {
    // The result of req.onsuccess is an IDBCursor
    let cursor = event.target.result;
    if (cursor != null) {
      // If the cursor isn't null, we got an IndexedDB item.
      // Add it to the note array and have the cursor continue!
      allTasks.push(cursor.value);
      cursor.continue();
    } else {
      // If we have a null cursor, it means we've gotten
      // all the items in the store, so display the notes we got
      displayTasks(allTasks);
    }
  }
  req.onerror = function(event) {
    alert('error in cursor request ' + event.target.errorCode);
  }
}



function displayTasks(tasks) {
  let listHTML = '<ul>';
  for (let i = 0; i < tasks.length; i++) {
    let taskx = tasks[i];
    listHTML += '<li>' + taskx.text + ' ' +  '</li>';
  }
  document.getElementById("myUL").innerHTML = listHTML;
  
}



// Create a "close" button and append it to each list item
var myNodelist = document.getElementsByTagName("li");
var i;
for (i = 0; i < myNodelist.length; i++) {
  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  myNodelist[i].appendChild(span);
}

// Click on a close button to hide the current list item
var close = document.getElementsByClassName("close");
var i;
for (i = 0; i < close.length; i++) {
  close[i].onclick = function() {
    var div = this.parentElement;
    div.style.display = "none";
  }
}

// Add a "checked" symbol when clicking on a list item
var list = document.querySelector('ul');
list.addEventListener('click', (ev) => {
  if (ev.target.tagName === 'LI') {
    ev.target.classList.toggle('checked');
  }
}, false);



// Create a new list item when clicking on the "Add" button
function newElement() {
  let message = document.getElementById('myInput');
  addTask(db, message.value);

  var li = document.createElement("li");
  var inputValue = document.getElementById("myInput").value;
  var t = document.createTextNode(inputValue);
  li.appendChild(t);
  if (inputValue === '') {
    alert("You must write something!");
  } else {
    document.getElementById("myUL").appendChild(li);
  }
  document.getElementById("myInput").value = "";
  message.value = '';

  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  li.appendChild(span);

  for (i = 0; i < close.length; i++) {
    close[i].onclick = function() {
      var div = this.parentElement;
      div.style.display = "none";
    }
  }
}


 
