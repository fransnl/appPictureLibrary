
"use strict";

const ratingJSON = "../app-data/library/picture-rating.json";
const libraryJSON = "picture-library.json";

// Global variables, loaded async from the current server in window.load event
let allRatings;
let library; 

// Use the DOMContentLoaded, or window load event, to read the library async and render the images
window.addEventListener("DOMContentLoaded", async () => {
  library = await fetch("http://localhost:8080/library")
    .then((response) => response.json())
    .catch(function () {
      alert("Error loading library - check if node server is running.");
    });
  // Fetch requests from server with Promise callbacks
  allRatings = await fetch("http://localhost:8080/ratings")
    .then((response) => response.json())
    .catch(function () {
      alert("Error loading ratings - check if node server is running.");
    });

  //library = lib.pictureLibraryBrowser.createFromTemplate();  //generating a library template instead of reading JSON

<<<<<<< HEAD
  // Loop through album in library.albums and render each album
  for (const album of library.albums) {
      renderAlbumImage(album.headerImage, album.id, album.title);
  }
  // Render modal window as hidden until eventlistener registers click
  renderModal();
  
  // Set addAlbumMenu to selector New Album, 
  const addAlbumMenu = document.querySelector('#newAlbum');

  // set modal to selector modal
  // addAlbumMenu listens for click event and displays the modal window as block
  const modal = document.querySelector('.modal');
  addAlbumMenu.addEventListener('click', () => {
    modal.style.display = 'block';
  });
  
  // Submit title input and file input
  const submit = document.querySelector('.submit');
  submit.addEventListener('click', () => {
    const titleInput = document.querySelector('#title-input');
    const fileInput = document.querySelector('.fileInput');
    
    // Add image to FormData()
    const formData = new FormData();
    formData.append('image', fileInput.files[0]);
    
    // FormData is sent using POST to server
    if(titleInput.value != ''){
      addHeaderImg(formData);
      addAlbum(titleInput.value, fileInput.files[0].name);
      modal.style.display = 'none';
    }
    else{
      alert("Must add image and title to album.")
    }

  });

  // Clicking outside modal window closes the modal window
  window.addEventListener('click', (e) => {
    if (e.target == modal) {
        modal.style.display = 'none';
    }
  })
});

//Render the album images
function renderAlbumImage(src, tag, title) {
=======
  // Renders the album images currently contained in the JSON library file
  for (const album of library.albums) {
    renderImage(album.headerImage, album.id, album.title);
  }

  // Render modal window - it will be displayed upon clicking New Album button
  renderModal();

  // Query selectors matches with the CSS element that defines it
  const addAlbumMenu = document.querySelector("#newAlbum");
  const modal = document.querySelector(".modal");
  // Event listener for clicking region outside modal window to exit the modal view
  addAlbumMenu.addEventListener("click", () => {
    modal.style.display = "block";
  });

  const submit = document.querySelector(".submit");
  submit.addEventListener("click", () => {
    const titleInput = document.querySelector("#title-input");
    const fileInput = document.querySelector(".fileInput");

    // FormData is used to send the header image
    const formData = new FormData();
    formData.append("image", fileInput.files[0]);

    // If user has put a title text, send header image and album to server and exit modal window
    if (titleInput.value != "") {
      addHeaderImg(formData);
      addAlbum(titleInput.value, fileInput.files[0].name);
      modal.style.display = "none";
    } else {
      alert("Must add image and title to album.");
    }
  });
  // Event listener for clicking outside modal window region
  window.addEventListener("click", (e) => {
    if (e.target == modal) {
      modal.style.display = "none";
    }
  });
});

//Render the images
function renderImage(src, tag, title) {
  const albumTag = document.createElement("a");
  albumTag.href = "./album.html?id=" + tag;
>>>>>>> main

  const div = document.createElement("div");
  albumTag.appendChild(div);

  const pictureTitle = document.createElement("p");
  pictureTitle.innerHTML = `${title}`;
  pictureTitle.className = "pText Titel";
  div.appendChild(pictureTitle);

  const img = document.createElement("img");
  img.src = src;
  div.appendChild(img);

  const imgFlex = document.querySelector(".FlexWrap");
  imgFlex.appendChild(albumTag);
}

// Renders modal window for adding a new album
function renderModal() {
  const modal = document.querySelector(".modal");

<<<<<<< HEAD
  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';
=======
  const modalContent = document.createElement("div");
  modalContent.className = "modal-content";
>>>>>>> main

  const titleFormTitle = document.createElement("p");
  titleFormTitle.innerHTML = "Title";
  titleFormTitle.className = "titles";

  const titleForm = document.createElement("input");
  titleForm.className = "input";
  titleForm.id = "title-input";
  titleForm.type = "text";

  const inputFormTitle = document.createElement("p");
  inputFormTitle.innerHTML = "Header Image";
  inputFormTitle.className = "titles";

  const file = document.createElement("input");
  file.className = "fileInput";
  file.type = "file";
  file.name = "image";

  const submit = document.createElement("button");
  submit.innerHTML = "Add Album";
  submit.className = "submit";

  // Append each element in modal window
  [titleFormTitle, titleForm, inputFormTitle, file, submit].forEach((item) =>
    modalContent.appendChild(item)
  );

  modal.appendChild(modalContent);
}

// Function for sending post request to the server, retrieving a header image for album
function addHeaderImg(file) {
  fetch("http://localhost:8080/addHeaderImg", {
    method: "POST",
    body: file,
    // mode: "cors",
  });
}

// Function that adds a new album to the JSON library file
function addAlbum(title, fileName) {
  //fetch POST request to node server
  fetch("http://localhost:8080/addAlbum", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify({ title: title, fileName: fileName }),
  });
}

function addHeaderImg(file){
  fetch("http://localhost:8080/addHeaderImg", {
    method: "POST",
    body: file,
  });
}