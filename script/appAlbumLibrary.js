//Just to ensure we force js into strict mode in HTML scrips - we don't want any sloppy code
'use strict';  // Try without strict mode

//import * as proto from './picture-album-prototypes.js';
import * as lib from '../model/picture-library-browser.js';

const libraryJSON ="picture-library.json";
let library;  //Global varibale, Loaded async from the current server in window.load event


//use the DOMContentLoaded, or window load event to read the library async and render the images
window.addEventListener('DOMContentLoaded', async () => {

library = await lib.pictureLibraryBrowser.fetchJSON(libraryJSON);  //reading library from JSON on local server 
//library = lib.pictureLibraryBrowser.createFromTemplate();  //generating a library template instead of reading JSON

for (const album of library.albums) {

    renderImage(album.headerImage, album.id, album.title);
    
  }
})

window.addEventListener('click',  () => {

  //just to confirm that the library is accessible as a global variable read async
  console.log (`library has ${library.albums.length} albums`);
});

//Render the images
function renderImage(src, tag, title) {

  const div = document.createElement('a');
  div.href = './album.html?id=' + tag;
  div.className = `FlexItem2`;
  div.dataset.albumId = tag;

  const pTitle = document.createElement('p');
  pTitle.innerHTML = `${title}`;
  pTitle.className = 'pText Titel'
  div.appendChild(pTitle);

  const pictureDiv = document.createElement('div');
  pictureDiv.className = 'picContainer';
  div.appendChild(pictureDiv);

  const img = document.createElement('img');
  img.src = src;
  pictureDiv.appendChild(img);

  const imgFlex = document.querySelector('.FlexWrap');
  imgFlex.appendChild(div);
};
