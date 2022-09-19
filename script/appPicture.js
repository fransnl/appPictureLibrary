//Just to ensure we force js into strict mode in HTML scrips - we don't want any sloppy code
"use strict"; // Try without strict mode

//import * as proto from './picture-album-prototypes.js';
import * as lib from "../model/picture-library-browser.js";

const libraryJSON = "picture-library.json";
const ratingJSON = "../app-data/library/picture-rating.json";
let library; //Global varibale, Loaded async from the current server in window.load event
let allRatings;

const submit = document.createElement("button");

//gets picture id from url
const url = window.location.href;
const urlString = new URL(url);
const pictureId = urlString.searchParams.get("id");

//use the DOMContentLoaded, or window load event to read the library async and render the images
window.addEventListener("DOMContentLoaded", async () => {
  //reading ratings and library json local files
  allRatings = await fetch(ratingJSON).then((response) => response.json());
  library = await lib.pictureLibraryBrowser.fetchJSON(libraryJSON);

  render:
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
        break render;
      }
    }
  }

  const ratings = document.querySelectorAll("#rating");
  const submit = document.querySelector(".submit");
  let selectedRating = null;

  ratings.forEach((rating) => {
    rating.addEventListener("click", () => {
      selectedRating = rating.innerHTML;
    });
  });

  submit.addEventListener("click", () => {
    if (selectedRating == null) {
      console.log("no rating selected");
    } else {
      submitRating(selectedRating);
    }
  });
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

  const editComment = document.createElement("button");
  editComment.textContent = `Edit`;
  div.appendChild(editComment);

  editComment.addEventListener("click", function () {
    editComment.hidden = true;
    saveComment.hidden = false;
    pComment.contentEditable = true;
    pTitle.contentEditable = true;
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
    pTitle.contentEditable = false;
    pComment.style.backgroundColor = "grey";
    pComment.style.color = "lightgrey";
  });

  const imgFlex = document.querySelector(".FlexWrap");
  imgFlex.appendChild(div);

  const rElement = document.querySelector(".ratings");

  const pRating = document.createElement("p");
  pRating.innerHTML = "no ratings yet!";
  pRating.className = "totRating";

  let totRating = [];
  let ratingExist = false;

  for (const rating of allRatings.ratings) {
    if (rating.id == pictureId) {
      ratingExist = true;
      totRating = [...totRating, parseInt(rating.rating)];
    }
  }

  if ((totRating != undefined || totRating.length != 0) & ratingExist) {
    let nrofratings = 0;
    let r = 0;
    for (const rating of totRating) {
      nrofratings += 1;
      r += rating;
    }
    r = r / nrofratings;
    pRating.innerHTML = `Rating: ${r}`;
  }

  rElement.append(pRating);

  for (let i = 0; i < 5; i++) {
    const rating = document.createElement("div");
    rating.id = "rating";
    rating.href = "#";
    rating.tabIndex = i + 1;
    rating.innerHTML = i + 1;
    rElement.appendChild(rating);
  }

  submit.className = "submit";
  submit.innerHTML = "submit";
  rElement.appendChild(submit);
}

function submitRating(rating) {
  //fetch POST request to node server
  fetch("http://localhost:8080/addrating", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify({ rating, id: pictureId }),
  });
}
