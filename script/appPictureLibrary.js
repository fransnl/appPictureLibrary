//Just to ensure we force js into strict mode in HTML scrips - we don't want any sloppy code
"use strict"; // Try without strict mode

//import * as proto from './picture-album-prototypes.js';
import * as lib from "../model/picture-library-browser.js"; // Unused
const libraryJSON = "picture-library.json";                 // Unused

let library;  // Global variable, loaded async from the current server in window.load event

const url = window.location.href;
const urlString = new URL(url); // How is it used in code?
const albumId = urlString.searchParams.get("id");

// Use the DOMContentLoaded, or window load event to read the library async and render the images
window.addEventListener("DOMContentLoaded", async () => {
  library = await fetch('http://localhost:8080/library').then((response) => response.json()); //reading library from JSON on local server
  // Library = lib.pictureLibraryBrowser.createFromTemplate();  //generating a library template instead of reading JSON // UNUSED
  
  if (albumId !== null) {
    const imgFlex = document.querySelector(".FlexWrap");  // Unused?

    for (const album of library.albums) {
      if (album.id == albumId) {
        for (const picture of album.pictures) {
            
          const comment = picture.comment.substring(0, 50) + '...';
          if (album.path != undefined) {
            renderImage(`${album.path}/${picture.imgLoRes}`, picture.id, picture.title, comment);
          } else {
            renderImage(`${picture.path}/${picture.imgLoRes}`, picture.id, picture.title, comment);
          };
        };
      };
    };

    renderModal();

    const allPictures = document.querySelectorAll(".FlexItem");
    console.log(allPictures);

    const select = document.querySelector('#slideshow');
    const slideShow = document.querySelector('.slideshow');
    slideShow.hidden = true;

    select.addEventListener('click', () => {
      allPictures.forEach((item) => {
        if (item.querySelector(".check").hidden === true) {
          item.querySelector(".check").hidden = false;
          slideShow.hidden = false;
        } else {
          item.querySelector(".check").hidden = true;
          slideShow.hidden = true;
        };
      });
    });

    slideShow.addEventListener("click", () => {
      const allChecked = [];
      allPictures.forEach((item) => {
        if (item.querySelector("input").checked === true) {
          const purl = item.href;
          const purlString = new URL(purl);
          const pid = purlString.searchParams.get("id");
          allChecked.push(pid);
        }
      });
      let sUrl = "#";
      if (allChecked.length != 0) {
        sUrl = "/slideShow.html?";
        for (let i = 0; i < allChecked.length; i++) {
          if (i === 0) {
            sUrl += `id=${allChecked[i]}`;
          } else {
            sUrl += `&id=${allChecked[i]}`;
          }
        }

      }
      slideShow.href = sUrl;
    });

    // Query selector returns the first element from node that matches the selector
    const addNewPicBtn = document.querySelector('#addNewPic');
    const modal = document.querySelector('.modal');
    // Event listener that waits for a click
    addNewPicBtn.addEventListener('click', () => {
      modal.style.display = 'block';
    });

    const submit = document.querySelector('.submit');
    submit.addEventListener('click', () => {
      
      const titleInput = document.querySelector('#title-input');
      const commentInput = document.querySelector('#comment-input');
      const fileInput = document.querySelectorAll('.fileInput');

      const hiRes = new File([fileInput[0].files[0]], fileInput[0].files[0].name.split('.')[0] + "~big." + fileInput[0].files[0].name.split('.')[1]);
      const orig = new File([fileInput[1].files[0]], fileInput[1].files[0].name.split('.')[0] + "~orig." + fileInput[1].files[0].name.split('.')[1]);
      const loRes = new File([fileInput[2].files[0]], fileInput[2].files[0].name.split('.')[0] + "~small." + fileInput[2].files[0].name.split('.')[1]);

      const formData = new FormData();

      [('hiRes', hiRes), ('orig', orig), ('loRes', loRes), ('albumId', albumId), 
      ('title', titleInput.value), ('comment', commentInput.value)]
      .forEach((item) => formData.append(item));

      // formData.append('hiRes', hiRes);
      // formData.append('orig', orig);
      // formData.append('loRes', loRes);
      // formData.append('albumId', albumId);
      // formData.append('title', titleInput.value);
      // formData.append('comment', commentInput.value);

      if(titleInput.value != ''){
        addPicture(formData);
        modal.style.display = 'none';
      }
      else{
        // Don't add picture
      }

    });

    window.addEventListener('click', (e) => {
      if (e.target == modal) {
          modal.style.display = 'none';
      }
    })

  } else [renderError()];
});

//Render the images
function renderImage(src, tag, title, comment) {
  const div = document.createElement("a");
  div.className = `FlexItem`;
  div.dataset.albumId = tag;
  div.href = "./picture.html?id=" + tag;
  
  /*MENUBAR START*/
  const menuBar = document.createElement('details');

  const summary = document.createElement('summary');
  menuBar.appendChild(summary);

  const navMenuBar = document.createElement('nav');
  navMenuBar.className = 'menu';

  const aTagMenuBar = document.createElement('a');
  aTagMenuBar.href = 'link';
  aTagMenuBar.innerText = 'Hej Ferri';
  navMenuBar.appendChild(aTagMenuBar);

  
  menuBar.appendChild(navMenuBar);
  
  div.appendChild(menuBar);

  // MENUBAR END
  
  const checkBox = document.createElement('input');
  checkBox.type = 'checkbox';
  checkBox.className = 'check';
  checkBox.hidden = true;
  div.appendChild(checkBox);

  const pTitle = document.createElement('p');
  pTitle.innerHTML = `${title}`;
  pTitle.className = 'pText Title';
  div.appendChild(pTitle);

  const img = document.createElement("img");
  img.src = src;
  div.appendChild(img);

  const pComment = document.createElement('p');
  pComment.innerHTML = `${comment}`;
  pComment.className = 'pText Comment';
  div.appendChild(pComment);

  const imgFlex = document.querySelector(".FlexWrap");
  imgFlex.appendChild(div);
}

function renderModal(){
  const modal = document.querySelector('.modal');

  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content'

  const titleFormTitle = document.createElement('p');
  titleFormTitle.innerHTML = 'Title';
  titleFormTitle.className = 'titles';

  const titleForm = document.createElement('input');
  titleForm.className = 'input';
  titleForm.id = 'title-input';
  titleForm.type = 'text';

  const commentFormTitle = document.createElement('p');
  commentFormTitle.innerHTML = 'Comment';
  commentFormTitle.className = 'comment';

  const commentForm = document.createElement('input');
  commentForm.className = 'input';
  commentForm.id = 'comment-input';
  commentForm.type = 'text';

  const hiRes = document.createElement('input');
  hiRes.className = 'fileInput';
  hiRes.type = 'file';
  hiRes.name = 'hiRes';

  const orig = document.createElement('input');
  orig.className = 'fileInput';
  orig.type = 'file';
  orig.name = 'orig';

  const loRes = document.createElement('input');
  loRes.className = 'fileInput';
  loRes.type = 'file';
  loRes.name = 'loRes';
  
  const submit = document.createElement('button');
  submit.innerHTML = 'Add Album';
  submit.className = 'submit';


  [titleFormTitle, titleForm, commentFormTitle, commentForm, hiRes, orig, loRes, submit]
  .forEach((item) => listItem.appendChild(item));

  // modalContent.appendChild(titleFormTitle);
  // modalContent.appendChild(titleForm);
  // modalContent.appendChild(commentFormTitle);
  // modalContent.appendChild(commentForm);
  // modalContent.appendChild(hiRes);
  // modalContent.appendChild(orig);
  // modalContent.appendChild(loRes);
  // modalContent.appendChild(submit);
  modal.appendChild(modalContent);

}

// Functions 
function renderError() {
  const error = document.createElement("a");
  error.innerHTML = "<- no album found, go back to home page";
  error.href = "/";
  const imgFlex = document.querySelector(".FlexWrap");
  imgFlex.appendChild(error);
}

function addPicture(file){
  fetch("http://localhost:8080/addPicture", {
    method: "POST",
    body: file,
  });
}

// UNUSED?

// function submitRemove(id) {
//   //fetch POST request to node server
//   fetch("http://localhost:8080/removeAlbum", {
//     method: "POST",
//     headers: {
//       Accept: "application/json",
//       "Content-Type": "application/json",
//     },
//     mode: "cors",
//     body: JSON.stringify({ id: pictureId }),
//   });
// }
