//Just to ensure we force js into strict mode in HTML scrips - we don't want any sloppy code
'use strict';  // Try without strict mode

//import * as proto from './picture-album-prototypes.js';
import * as lib from '../model/picture-library-browser.js';

const ratingJSON = "../app-data/library/picture-rating.json";
const libraryJSON = "picture-library.json";

let allRatings;
let library; //Global variable, loaded async from the current server in window.load event

// Use the DOMContentLoaded, or window load event, to read the library async and render the images
window.addEventListener('DOMContentLoaded', async () => {

  library = await fetch('http://localhost:8080/library').
                  then((response) => response.json()).catch(function() {
                    alert("Error loading library - check if node server is running.");
                  });

  // Fetch requests from server with Promise callbacks
  allRatings = await fetch('http://localhost:8080/ratings')
                    .then((response) => response.json()).catch(function() {
                      alert("Error loading ratings - check if node server is running.");
                    })

  
  
  //library = lib.pictureLibraryBrowser.createFromTemplate();  //generating a library template instead of reading JSON

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

  const albumTag = document.createElement('a')
  albumTag.href = './album.html?id=' + tag;
  
  const div = document.createElement('div');
  albumTag.appendChild(div);

  const pictureTitle = document.createElement('p');
  pictureTitle.innerHTML = `${title}`;
  pictureTitle.className = 'pText Titel'
  div.appendChild(pictureTitle);
  
  const img = document.createElement('img');
  img.src = src;
  div.appendChild(img);

  const imgFlex = document.querySelector('.FlexWrap');
  imgFlex.appendChild(albumTag);
};

function renderModal(){
  const modal = document.querySelector('.modal');

  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';

  const titleFormTitle = document.createElement('p');
  titleFormTitle.innerHTML = 'Title';
  titleFormTitle.className = 'titles';

  const titleForm = document.createElement('input');
  titleForm.className = 'input';
  titleForm.id = 'title-input';
  titleForm.type = 'text';

  const file = document.createElement('input');
  file.className = 'fileInput';
  file.type = 'file';
  file.name = 'image';
  
  const submit = document.createElement('button');
  submit.innerHTML = 'Add Album';
  submit.className = 'submit';

 // Append each element in modal window
[titleFormTitle, titleForm, file, submit]
.forEach((item) => modalContent.appendChild(item));
  // modalContent.appendChild(titleFormTitle);
  // modalContent.appendChild(titleForm);
  // modalContent.appendChild(file);
  // modalContent.appendChild(submit);

  modal.appendChild(modalContent);

}

// Function for sending post request to the server, retrieving a header image for album
function addHeaderImg(file){
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