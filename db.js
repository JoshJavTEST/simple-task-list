
 //the database reference
 let db;

 //initializes the database
 function initDatabase() {

     //create a unified variable for the browser variant
     window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

     window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;

     window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

         //if a variant wasn't found, let the user know
     if (!window.indexedDB) {
             window.alert("Your browser doesn't support a stable version of IndexedDB.")
     }

    //attempt to open the database
     let request = window.indexedDB.open("guests", 1);
     request.onerror = function(event) {
         console.log(event);
     };

    //map db to the opening of a database
     request.onsuccess = function(event) {
         db = request.result;
         console.log("success: " + db);
     };

    //if no database, create one and fill it with data
     request.onupgradeneeded = function(event) {
       var db = event.target.result;
       var objectStore = db.createObjectStore("guest", {keyPath: "firstname"});

       for (var i in guestData) {
          objectStore.add(guestData[i]);
       }
    }
 }

 //adds a record as entered in the form
 function add() {
     //get a reference to the fields in html
     let firstname = document.querySelector("#firstname").value;
     let lastname = document.querySelector("#lastname").value;
     let email = document.querySelector("#email").value;
     let notes = document.querySelector("#notes").value;

    //create a transaction and attempt to add data
     var request = db.transaction(["guest"], "readwrite")
     .objectStore("guest")
     .add({ firstname: firstname, lastname: lastname, email: email, notes: notes });

    //when successfully added to the database
     request.onsuccess = function(event) {
         console.log(`${firstname} has been added to your database.`);
     };

    //when not successfully added to the database
     request.onerror = function(event) {
     console.log(`Unable to add data\r\n${firstname} is already in your database! `);
     }

     readAll();
 }

 //not used in code example
 //reads one record by id
 function read() {
    //get a transaction
    var transaction = db.transaction(["guest"]);

    //create the object store
    var objectStore = transaction.objectStore("guest");

    //get the data by id
    var request = objectStore.get("asiemer@hotmail.com");

    request.onerror = function(event) {
       console.log("Unable to retrieve daa from database!");
    };

    request.onsuccess = function(event) {
       // Do something with the request.result!
       if(request.result) {
          console.log("First Name: " + request.result.firstname + ", Last Name: " + request.result.lastname + ", Email: " + request.result.email);
       }

       else {
          console.log("Andy couldn't be found in your database!");
       }
    };
 }

 //reads all the data in the database
 function readAll() {
     clearList();

    var objectStore = db.transaction("guest").objectStore("guest");

    //creates a cursor which iterates through each record
    objectStore.openCursor().onsuccess = function(event) {
       var cursor = event.target.result;

       if (cursor) {
          console.log("First Name: " + cursor.value.firstname + ", Email: " + cursor.value.email);
          addEntry(cursor.value.firstname, cursor.value.lastname,       cursor.value.email, cursor.value.notes);
          cursor.continue();
       }

       else {
          console.log("No more entries!");
       }
    };
 }

 //deletes a record by id
 function remove() {
     let delid = document.querySelector("#delid").value;
    var request = db.transaction(["guest"], "readwrite")
    .objectStore("guest")
    .delete(delid);

    request.onsuccess = function(event) {
       console.log("Entry has been removed from your database.");
    };
 }

 function addEntry(firstname, lastname, email, notes) {
     // Your existing code unmodified...
    var iDiv = document.createElement('div');
    iDiv.className = 'entry';
    iDiv.innerHTML = firstname + " " + lastname + " " + email + "<BR>" + notes + "<HR>";
    document.querySelector("#entries").appendChild(iDiv);
 }
 function clearList() {
     document.querySelector("#entries").innerHTML = "";
 }

 initDatabase();






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
