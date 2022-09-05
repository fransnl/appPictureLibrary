//Just to ensure we force js into strict mode in HTML scrips - we don't want any sloppy code
'use strict';  // Try without strict mode

//import * as proto from './picture-album-prototypes.js';
import * as lib from '../model/picture-library-browser.js';

const libraryJSON ="picture-library.json";
const ratingJSON = '../app-data/library/picture-rating.json';
let library;  //Global varibale, Loaded async from the current server in window.load event
let allRatings;

const submit = document.createElement('a');

const url = window.location.href;
const urlString = new URL(url);
const pictureId = urlString.searchParams.get('id');
//use the DOMContentLoaded, or window load event to read the library async and render the images
window.addEventListener('DOMContentLoaded', async () => {

allRatings = await (await fetch(ratingJSON)).json();
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
  
    const ratings = document.querySelectorAll('#rating');
    const submit = document.querySelector('.submit');
    let selectedRating = null;

    ratings.forEach(rating => {
      rating.addEventListener('click', () => {
        selectedRating = rating.innerHTML
      })
    });

    submit.addEventListener('click', () => {
      if(selectedRating == null){
        console.log('no rating selected');
      }
      else{
        submitRating(selectedRating);
      }
    });
})

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

  const rElement = document.querySelector('.ratings');

  for(let i = 0; i < 5; i++){
    const rating = document.createElement('div');
    rating.id = 'rating';
    rating.href = '#';
    rating.tabIndex = i+1;
    rating.innerHTML = i+1;
    rElement.appendChild(rating);
  }

  submit.className = 'submit';
  submit.innerHTML = 'submit';
  rElement.appendChild(submit);



  for(rating of allRatings.ratings){
    
  }
  
};

function submitRating(rating){

  submit.href=`/picture.html?id=${pictureId}&rating=${rating}`;
  
}






