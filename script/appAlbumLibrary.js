//Just to ensure we force js into strict mode in HTML scrips - we don't want any sloppy code
'use strict';  // Try without strict mode

//import * as proto from './picture-album-prototypes.js';
import * as lib from '../model/picture-library-browser.js';

const libraryJSON ="picture-library.json";
let library;  //Global varibale, Loaded async from the current server in window.load event


const url = window.location.href;
const urlString = new URL(url);
const albumId = urlString.searchParams.get("id");


//use the DOMContentLoaded, or window load event to read the library async and render the images
window.addEventListener('DOMContentLoaded', async () => {

library = await lib.pictureLibraryBrowser.fetchJSON(libraryJSON);  //reading library from JSON on local server 
//library = lib.pictureLibraryBrowser.createFromTemplate();  //generating a library template instead of reading JSON

for (const album of library.albums) {

    renderImage(album.headerImage, album.id, album.title)
  }
  renderImageEmpty();
})

window.addEventListener('click',  () => {

  //just to confirm that the library is accessible as a global variable read async
  console.log (`library has ${library.albums.length} albums`);
});

//Render the images
function renderImage(src, tag, title) {

  const div = document.createElement('a');
  div.href = './album.html?id=' + tag;
  div.className = `FlexItem`;
  div.dataset.albumId = tag;

  const pTitle = document.createElement('p');
  pTitle.innerHTML = `${title}`;
  div.appendChild(pTitle);

  const img = document.createElement('img');
  img.src = src;
  div.appendChild(img);

  const imgFlex = document.querySelector('.FlexWrap');
  imgFlex.appendChild(div);
};



function renderImageEmpty() {
  const div = document.createElement('a');
  
  div.className = `FlexItem`;
  

  const pTitle = document.createElement('p');
  pTitle.innerHTML = `New album`;
  div.appendChild(pTitle);

  const pPlusSign = document.createElement('button');
  pPlusSign.innerHTML = "+";
  div.appendChild(pPlusSign);

  pPlusSign.addEventListener("click", function(){
    submitNewAlbum(pTitle.innerHTML);
  })

  const imgFlex = document.querySelector('.FlexWrap');
  imgFlex.appendChild(div);
}

function submitNewAlbum(){
    //fetch POST request to node server
    fetch("http://localhost:8080/addAlbum", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify({ id: albumId }),
    });
  }