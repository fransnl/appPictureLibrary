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
  if(albumId !== null){

    const slideShow = document.createElement('a');
    slideShow.innerHTML = 'go to slideshow';
    slideShow.href = '#';
    
    const imgFlex = document.querySelector('.FlexWrap');
    imgFlex.appendChild(slideShow);

    for (const album of library.albums) {
      if(album.id == albumId){
        for (const picture of album.pictures) {
            
          const comment = picture.comment.substring(0, 50) + '...';
          renderImage(`${album.path}/${picture.imgLoRes}`, picture.id, picture.title, comment);
            
        }
      }
    }
    
    const allPictures = document.querySelectorAll('.FlexItem');
    console.log(allPictures);
    
    slideShow.addEventListener("click", () => {
      const allChecked = []
      allPictures.forEach(item => {
        if(item.querySelector('input').checked === true){
          const purl = item.href
          const purlString = new URL(purl);
          const pid = purlString.searchParams.get('id');
          allChecked.push(pid);
        }
      });
      if(allChecked !== []){
        let surl = '/slideShow.html?'
        for(let i = 0; i < allChecked.length; i++){
          if(i === 0){
            surl += `id=${allChecked[i]}`;
          } else {
            surl += `&id=${allChecked[i]}`;
          }

        }

        slideShow.href = surl;
      }
    })


  } else [
    renderError()
  ]
});

//Render the images
function renderImage(src, tag, title, comment) {

    const div = document.createElement('a');
    div.className = `FlexItem`;
    div.dataset.albumId = tag;
    div.href = './picture.html?id=' + tag;

    const checkBox = document.createElement('input');
    checkBox.type = 'checkbox';
    div.appendChild(checkBox);
  
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

function renderError(){
  const error = document.createElement('a');
  error.innerHTML = '<- no album found, go back to home page'
  error.href = '/';
  const imgFlex = document.querySelector('.FlexWrap');
    imgFlex.appendChild(error);
}

function renderImageEmpty(){
  const div = document.createElement('a');
  div.className = `FlexItem`;
  div.dataset.albumId = tag;
  div.href = './picture.html?id=' + tag;

  const checkBox = document.createElement('input');
  checkBox.type = 'checkbox';
  div.appendChild(checkBox);

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
}




