//Just to ensure we force js into strict mode in HTML scrips - we don't want any sloppy code
"use strict"; // Try without strict mode

//import * as proto from './picture-album-prototypes.js';
import * as lib from "../model/picture-library-browser.js";

const libraryJSON = "picture-library.json";
let library; //Global varibale, Loaded async from the current server in window.load event
let albumNumber;
//use the DOMContentLoaded, or window load event to read the library async and render the images
window.addEventListener("DOMContentLoaded", async () => {
  library = await lib.pictureLibraryBrowser.fetchJSON(libraryJSON); //reading library from JSON on local server
  //library = lib.pictureLibraryBrowser.createFromTemplate();  //generating a library template instead of reading JSON

  for (const album of library.albums) {
    renderImage(album.headerImage, album.id, album.title);
  }
  for (let i = 0; i < 1; i++) {
    renderNewEmpty();
  }
});

window.addEventListener("click", () => {
  //just to confirm that the library is accessible as a global variable read async
  console.log(`library has ${library.albums.length} albums`);
});

// Render the images
function renderImage(src, tag, title) {
  const div = document.createElement("a");
  div.href = "./album.html?id=" + tag;
  div.className = `FlexItem`;
  div.dataset.albumId = tag;

  const pTitle = document.createElement("p");
  pTitle.innerHTML = `${title}`;
  div.appendChild(pTitle);

  const img = document.createElement("img");
  img.src = src;
  div.appendChild(img);

  const imgFlex = document.querySelector(".FlexWrap");
  imgFlex.appendChild(div);
}

function renderNewEmpty() {
  albumNumber += albumNumber;
  const div = document.createElement("a");
  div.className = `FlexItem`;

  const deleteAlbum = document.createElement("button");
  deleteAlbum.innerHTML = `X`;
  div.appendChild(deleteAlbum);

  deleteAlbum.addEventListener("click", function () {});

  const pTitle = document.createElement("p");
  pTitle.innerHTML = `New album`;
  div.appendChild(pTitle);

  const div2 = document.createElement("button");
  div2.className = `New Album`;
  div2.innerHTML = "+"; // Make plus sign bigger?
  div2.style.width = "200px";
  div2.style.height = "200px";
  div.appendChild(div2);

  div2.addEventListener("click", function () {
    // Create a new empty box for each time a new album is created
    renderNewEmpty();

    // Manipulate JSON; add a new album, get the index of that album, add pictures to it
  });

  const imgFlex = document.querySelector(".FlexWrap");
  imgFlex.appendChild(div);

  function submitRemove(id) {
    //fetch POST request to node server
    fetch("http://localhost:8080/removeAlbum", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify({ id: pictureId }),
    });
  }
}
