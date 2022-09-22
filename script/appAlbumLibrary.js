//Just to ensure we force js into strict mode in HTML scrips - we don't want any sloppy code
'use strict';  // Try without strict mode

//import * as proto from './picture-album-prototypes.js';
import * as lib from '../model/picture-library-browser.js';

const ratingJSON = "../app-data/library/picture-rating.json";
let allRatings;

const libraryJSON = "picture-library.json";
let library; //Global varibale, Loaded async from the current server in window.load event
let albumNumber;
//use the DOMContentLoaded, or window load event to read the library async and render the images
window.addEventListener('DOMContentLoaded', async () => {

  allRatings = await fetch('http://localhost:8080/ratings').then((response) => response.json());
  library = await fetch('http://localhost:8080/library').then((response) => response.json());
  //library = lib.pictureLibraryBrowser.createFromTemplate();  //generating a library template instead of reading JSON

  for (const album of library.albums) {
      renderImage(album.headerImage, album.id, album.title);
  }
  
  renderModal();
  
  const addAlbumMenu = document.querySelector('#newAlbum');
  const modal = document.querySelector('.modal');
  addAlbumMenu.addEventListener('click', () => {
    modal.style.display = 'block';
  });
  
  const submit = document.querySelector('.submit');
  submit.addEventListener('click', () => {
    const titleInput = document.querySelector('#title-input');
    const fileInput = document.querySelector('.fileInput');
    
    const formData = new FormData();
    formData.append('image', fileInput.files[0]);
    

    if(titleInput.value != ''){
      addHeaderImg(formData);
      addAlbum(titleInput.value, fileInput.files[0].name);
      modal.style.display = 'none';
    }
    else{

    }

  });

  window.addEventListener('click', (e) => {
    if (e.target == modal) {
        modal.style.display = 'none';
    }
  })
});


window.addEventListener('click',  () => {

  //just to confirm that the library is accessible as a global variable read async
  console.log (`library has ${library.albums.length} albums`);
});

//Render the images
function renderImage(src, tag, title) {

  const aTag = document.createElement('a');
  aTag.href = './album.html?id=' + tag;
  
  const div = document.createElement('div');
  aTag.appendChild(div);

  const pTitle = document.createElement('p');
  pTitle.innerHTML = `${title}`;
  pTitle.className = 'pText Titel';
  div.appendChild(pTitle);
  
  const img = document.createElement('img');
  img.src = src;
  div.appendChild(img);

  const imgFlex = document.querySelector('.FlexWrap');
  imgFlex.appendChild(aTag);
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

  modalContent.appendChild(titleFormTitle);
  modalContent.appendChild(titleForm);
  modalContent.appendChild(file);
  modalContent.appendChild(submit);
  modal.appendChild(modalContent);

}

function addHeaderImg(file){
  fetch("http://localhost:8080/addHeaderImg", {
    method: "POST",
    body: file,
  });
}

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
