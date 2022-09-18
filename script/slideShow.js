'use strict';
import * as lib from "../model/picture-library-browser.js";
const libraryJSON = "picture-library.json";
let library;

const url = window.location.href;
const urlString = new URL(url);
const pictureIds = urlString.searchParams.getAll("id");

console.log(pictureIds)

var images = [];

var i = 0;

window.addEventListener('DOMContentLoaded', async () => {
    library = await lib.pictureLibraryBrowser.fetchJSON(libraryJSON);
    for (const album of library.albums) {
        for (const picture of album.pictures) {
            pictureIds.forEach(item => {
                if(picture.id == item){
                    images.push(`${album.path}/${picture.imgHiRes}`);
                }
            });
        }
    }
    render();
});

function render(){
    const imgContainer = document.createElement('div');
    imgContainer.className = "img_Container";

    const imgBox = document.createElement('img');
    imgBox.className = 'img-box';
    imgBox.src = images[0];
    imgContainer.appendChild(imgBox);

    const next = document.createElement('a');
    next.className = "next";
    next.addEventListener('click',() => {
        if(i >= images.length - 1) 
        i = -1;

        imgBox.src = images[++i];
    });
    next.innerHTML = '&#10095';

    const prev = document.createElement('a');
    prev.className = "prev";
    prev.addEventListener('click',() => {
        if(i <= 0 ) //Prevents error and takes you back to the end of the array if you try to go beyond [0]
        i = images.length; 
    //Goes one step back in the array then changes the src attribute.
        imgBox.src = images[--i];
    });
    prev.innerHTML = '&#10094';

    const slideshow = document.querySelector('.slideshow');
    slideshow.appendChild(imgContainer);
    slideshow.appendChild(next);
    slideshow.appendChild(prev);
}



