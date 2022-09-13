//Just to ensure we force js into strict mode in HTML scrips - we don't want any sloppy code
'use strict';  // Try without strict mode

//import * as proto from './picture-album-prototypes.js';
import * as lib from '../model/picture-library-browser.js';

const libraryJSON ="picture-library.json";
let library;  //Global varibale, Loaded async from the current server in window.load event

const url = window.location.href;
const urlString = new URL(url);
const albumId = urlString.searchParams.get('id');
console.log(albumId);
//use the DOMContentLoaded, or window load event to read the library async and render the images
window.addEventListener('DOMContentLoaded', async () => {

library = await lib.pictureLibraryBrowser.fetchJSON(libraryJSON);  //reading library from JSON on local server 
//library = lib.pictureLibraryBrowser.createFromTemplate();  //generating a library template instead of reading JSON

for (const album of library.albums) {
    if(album.id == albumId){
      for (const picture of album.pictures) {
        
        const comment = picture.comment.substring(0, 50) + '...';
        renderImage(`${album.path}/${picture.imgLoRes}`, picture.id, picture.title, comment);
        
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

  const div = document.createElement('a');
  div.className = `FlexItem`;
  div.dataset.albumId = tag;
  div.href = './picture.html?id=' + tag;

  const pTitle = document.createElement('p');
  pTitle.innerHTML = `${title}`;
  pTitle.className = 'pText'
  div.appendChild(pTitle);

  const img = document.createElement('img');
  img.src = src;
  div.appendChild(img);
  
  const pComment = document.createElement('p');
  pComment.innerHTML = `${comment}`;
  pComment.className = 'pText'
  div.appendChild(pComment); 

  const imgFlex = document.querySelector('.FlexWrap');
  imgFlex.appendChild(div);
};




