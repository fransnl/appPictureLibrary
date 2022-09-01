//Just to ensure we force js into strict mode in HTML scrips - we don't want any sloppy code
'use strict';  // Try without strict mode

//import * as proto from './picture-album-prototypes.js';
import * as lib from '../model/picture-library-browser.js';

const libraryJSON ="picture-library.json";
let library;  //Global varibale, Loaded async from the current server in window.load event

const url = window.location.href;
const urlString = new URL(url);
const pictureId = urlString.searchParams.get('id');
//use the DOMContentLoaded, or window load event to read the library async and render the images
window.addEventListener('DOMContentLoaded', async () => {

library = await lib.pictureLibraryBrowser.fetchJSON(libraryJSON);  //reading library from JSON on local server 
//library = lib.pictureLibraryBrowser.createFromTemplate();  //generating a library template instead of reading JSON

for (const album of library.albums) {
    
      for (const picture of album.pictures) {
        if(picture.id == pictureId){

            const comment = picture.comment;
            renderImage(`${album.path}/${picture.imgHiRes}`, picture.id, picture.title, comment);
        }
      }
    }
  
})

window.addEventListener('click',  () => {

  //just to confirm that the library is accessible as a global variable read async
  console.log (`library has ${library.albums.length} albums`);
});

//Render the images
function renderImage(src, tag, title, comment) {

  const div = document.createElement('div');
  div.className = `FlexItem`;
  div.dataset.albumId = tag;

  const pTitle = document.createElement('p');
  pTitle.innerHTML = `${title}`;
  div.appendChild(pTitle);

  const img = document.createElement('img');
  img.src = src;
  div.appendChild(img);
  
  const pComment = document.createElement('p');
  pComment.innerHTML = `${comment}`;
  div.appendChild(pComment); 

  const imgFlex = document.querySelector('.FlexWrap');
  imgFlex.appendChild(div);
};




