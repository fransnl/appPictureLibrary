//Just to ensure we force js into strict mode in HTML scrips - we don't want any sloppy code
"use strict"; // Try without strict mode

//import * as proto from './picture-album-prototypes.js';
import * as lib from "../model/picture-library-browser.js";

const libraryJSON = "picture-library.json";
let library; //Global varibale, Loaded async from the current server in window.load event

const url = window.location.href;
const urlString = new URL(url);
const pictureId = urlString.searchParams.get("id");
//use the DOMContentLoaded, or window load event to read the library async and render the images
window.addEventListener("DOMContentLoaded", async () => {
  library = await lib.pictureLibraryBrowser.fetchJSON(libraryJSON); //reading library from JSON on local server
  //library = lib.pictureLibraryBrowser.createFromTemplate();  //generating a library template instead of reading JSON

  for (const album of library.albums) {
    for (const picture of album.pictures) {
      if (picture.id == pictureId) {
        const comment = picture.comment;
        renderImage(
          `${album.path}/${picture.imgHiRes}`,
          picture.id,
          picture.title,
          comment
        );
      }
    }
  }
});

window.addEventListener("click", () => {
  //just to confirm that the library is accessible as a global variable read async
  console.log(`library has ${library.albums.length} albums`);
});

//Render the images
function renderImage(src, tag, title, comment) {
  const div = document.createElement("div");
  div.className = `FlexItem`;
  div.dataset.albumId = tag;

  const pTitle = document.createElement("p");
  pTitle.innerHTML = `${title}`;
  div.appendChild(pTitle);

  const img = document.createElement("img");
  img.src = src;
  div.appendChild(img);

  const pComment = document.createElement("p");
  pComment.innerHTML = `${comment}`;
  div.appendChild(pComment);

  const imgFlex = document.querySelector(".FlexWrap");
  imgFlex.appendChild(div);

  const editComment = document.createElement("button");
  editComment.textContent = `Edit`;
  div.appendChild(editComment);

  editComment.addEventListener("click", function () {
    editComment.hidden = true;
    saveComment.hidden = false;
    pComment.contentEditable = true;
    pComment.style.backgroundColor = "aliceblue";
    pComment.style.color = "black";
  });
  const saveComment = document.createElement("button");
  saveComment.hidden = true; /* hide when rendered 1st time */
  saveComment.textContent = `Save`;
  div.appendChild(saveComment);

  saveComment.addEventListener("click", function () {
    saveComment.hidden = true; /* hide save button when save button is clicked */
    editComment.hidden = false; /* display edit button when save button is clicked*/
    pComment.contentEditable = false;
    pComment.style.backgroundColor = "grey";
    pComment.style.color = "lightgrey";
  });

  /*const ratePicture = document.createElement("");*/
}
