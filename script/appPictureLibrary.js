"use strict";

const libraryJSON = "picture-library.json";
let library; // Global variable

// Convert window url to URL parameter
const url = window.location.href;
const urlString = new URL(url);
const albumId = urlString.searchParams.get("id");

//use the DOMContentLoaded, or window load event to read the library async and render the images
window.addEventListener("DOMContentLoaded", async () => {
  library = await fetch("http://localhost:8080/library").then((response) =>
    response.json()
  ); // Read library from JSON on local server

  if (albumId !== null) {
    const imgFlex = document.querySelector(".FlexWrap");

    for (const album of library.albums) {
      if (album.id == albumId) {
        for (const picture of album.pictures) {
          // String is cut off after 50 characters to make a preview comment in header
          const comment = picture.comment.substring(0, 50) + "...";
          if (album.path != undefined) {
            renderImage(
              `${album.path}/${picture.imgLoRes}`,
              picture.id,
              picture.title,
              comment
            );
          } else {
            renderImage(
              `${picture.path}/${picture.imgLoRes}`,
              picture.id,
              picture.title,
              comment
            );
          }
        }
      }
    }
    // Render modal window
    renderModal();

    const allPictures = document.querySelectorAll(".FlexItem");
    // Variable for button in menu
    const select = document.querySelector("#slideshow");
    // Button for going to slideshow
    const goToSlideshow = document.querySelector(".slideshow");
    goToSlideshow.style.visibility = "hidden";

    select.addEventListener("click", () => {
      allPictures.forEach((item) => {
        if (item.querySelector(".check").style.visibility === "hidden") {
          item.querySelector(".check").style.visibility = "visible";
          goToSlideshow.style.visibility = "visible";
        } else {
          item.querySelector(".check").style.visibility = "hidden";
          goToSlideshow.style.visibility = "hidden";
        }
      });
    });

    goToSlideshow.addEventListener("click", () => {
      const allChecked = []; // Array of checked images
      allPictures.forEach((item) => {
        if (item.querySelector(".check").checked === true) {
          const pictureUrl = item.querySelector(".link").href;
          const pictureUrlString = new URL(pictureUrl); // Convert picture URL to URL parameter
          const pictureId = pictureUrlString.searchParams.get("id");
          allChecked.push(pictureId); // Push all pictureId to allChecked array
        }
      });
      let slideshowUrl = "#";
      if (allChecked.length != 0) {
        slideshowUrl = "/slideShow.html?";
        for (let i = 0; i < allChecked.length; i++) {
          if (i === 0) {
            slideshowUrl += `id=${allChecked[i]}`;
          } else {
            slideshowUrl += `&id=${allChecked[i]}`;
          }
        }
      }
      goToSlideshow.href = slideshowUrl;
    });

    const addNewPicBtn = document.querySelector("#addNewPic");
    const modal = document.querySelector(".modal");
    addNewPicBtn.addEventListener("click", () => {
      modal.style.display = "block";
    });

    // When submitting pictures to the library, event listener will wait for button to be clicked
    const submit = document.querySelector(".submit");
    submit.addEventListener("click", () => {
      // Get matching CSS selectors using queryselector and queryselectorall
      const titleInput = document.querySelector("#title-input");
      const commentInput = document.querySelector("#comment-input");
      const fileInput = document.querySelectorAll(".fileInput");

      // Manipulate the 3 different pictures information and set the name based on resolution
      const hiRes = new File(
        [fileInput[0].files[0]],
        fileInput[0].files[0].name.split(".")[0] +
          "~big." +
          fileInput[0].files[0].name.split(".")[1]
      );
      const orig = new File(
        [fileInput[1].files[0]],
        fileInput[1].files[0].name.split(".")[0] +
          "~orig." +
          fileInput[1].files[0].name.split(".")[1]
      );
      const loRes = new File(
        [fileInput[2].files[0]],
        fileInput[2].files[0].name.split(".")[0] +
          "~small." +
          fileInput[2].files[0].name.split(".")[1]
      );

      // Images and information about them are sent using the form data
      const formData = new FormData();
      formData.append("hiRes", hiRes);
      formData.append("orig", orig);
      formData.append("loRes", loRes);
      formData.append("albumId", albumId);
      formData.append("title", titleInput.value);
      formData.append("comment", commentInput.value);

      // Check if the picture is given a title, and then send it to the server
      if (titleInput.value != "") {
        addPicture(formData);
        modal.style.display = "none";
      } else {
        alert("Must give the picture a title.");
      }
    });

    window.addEventListener("click", (e) => {
      if (e.target == modal) {
        modal.style.display = "none";
      }
    });
  } else [renderError()];
});

//Render the images
function renderImage(src, tag, title, comment) {
  const div = document.createElement("div");
  div.className = `FlexItem`;

  const link = document.createElement("a");
  link.className = `link`;
  link.dataset.albumId = tag;
  link.href = "./picture.html?id=" + tag;

  const checkBox = document.createElement("input");
  checkBox.type = "checkbox";
  checkBox.className = "check";
  checkBox.style.visibility = "hidden";
  div.appendChild(checkBox);

  const pTitle = document.createElement("p");
  pTitle.innerHTML = `${title}`;
  pTitle.className = "pText Title";
  link.appendChild(pTitle);

  const img = document.createElement("img");
  img.src = src;
  link.appendChild(img);

  const pComment = document.createElement("p");
  pComment.innerHTML = `${comment}`;
  pComment.className = "pText Comment";
  link.appendChild(pComment);

  const imgFlex = document.querySelector(".FlexWrap");
  div.appendChild(link);
  imgFlex.appendChild(div);
}

function renderModal() {
  const modal = document.querySelector(".modal");

  const modalContent = document.createElement("div");
  modalContent.className = "modal-content";

  const titleFormTitle = document.createElement("p");
  titleFormTitle.innerHTML = "Title";
  titleFormTitle.className = "titles";

  const titleForm = document.createElement("input");
  titleForm.className = "input";
  titleForm.id = "title-input";
  titleForm.type = "text";

  const commentFormTitle = document.createElement("p");
  commentFormTitle.innerHTML = "Comment";
  commentFormTitle.className = "comment";

  const commentForm = document.createElement("input");
  commentForm.className = "input";
  commentForm.id = "comment-input";
  commentForm.type = "text";

  const hiResFormTitle = document.createElement("p");
  hiResFormTitle.innerHTML = "High Resolution Image";
  hiResFormTitle.className = "titles";

  const hiRes = document.createElement("input");
  hiRes.className = "fileInput";
  hiRes.type = "file";
  hiRes.name = "hiRes";

  const origFormTitle = document.createElement("p");
  origFormTitle.innerHTML = "Medium Resoulution";
  origFormTitle.className = "titles";

  const orig = document.createElement("input");
  orig.className = "fileInput";
  orig.type = "file";
  orig.name = "orig";

  const loResFormTitle = document.createElement("p");
  loResFormTitle.innerHTML = "Low Res Image";
  loResFormTitle.className = "titles";

  const loRes = document.createElement("input");
  loRes.className = "fileInput";
  loRes.type = "file";
  loRes.name = "loRes";

  const submit = document.createElement("button");
  submit.innerHTML = "Add Album";
  submit.className = "submit";

  [
    titleFormTitle,
    titleForm,
    commentFormTitle,
    commentForm,
    hiResFormTitle,
    hiRes,
    origFormTitle,
    orig,
    loResFormTitle,
    loRes,
    submit,
  ].forEach((item) => modalContent.appendChild(item));
  modal.appendChild(modalContent);
}

// If no album tag is given, display a-tag that returns to index
function renderError() {
  const error = document.createElement("a");
  error.innerHTML = "<- no album found, go back to home page";
  error.href = "/";
  const imgFlex = document.querySelector(".FlexWrap");
  imgFlex.appendChild(error);
}
// Function for posting picture to server
function addPicture(file) {
  fetch("http://localhost:8080/addPicture", {
    method: "POST",
    body: file,
  });
}
