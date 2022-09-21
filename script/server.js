'use strict'
//fs/promises for async read/write
import * as pls from "fs/promises";
import express from "express";
//cors needed for accepting requests from other "webservers"
import cors from "cors";
import fileUpload from "express-fileupload";

const app = express();
app.listen(8080);
app.use(express.json());
app.use(cors());
app.use(fileUpload());

console.log("Server is running!");

app.get('/library', async (req, res) =>{
    const response = await pls.readFile("../app-data/library/picture-library.json");
    res.send(response);
});

app.get('/ratings', async (req, res) =>{
    const response = await pls.readFile("../app-data/library/picture-rating.json");
    res.send(response);
});

//listening to post requests on 8080/addrating
app.post("/addrating", async (req, res) => {
  const ratings = await pls
    .readFile("../app-data/library/picture-rating.json")
    .then(JSON.parse);

    ratings.ratings.push(req.body);

    await pls.writeFile('../app-data/library/picture-rating.json', JSON.stringify(ratings));

    let totRating = [];
    let ratingExist = false;

    for (const rating of ratings.ratings) {
        if (rating.id == req.body.id) {
        ratingExist = true;
        totRating = [...totRating, parseInt(rating.rating)];
        }
    }

    if ((totRating != undefined || totRating.length != 0) & ratingExist) {
        let nrofratings = 0;
        let r = 0;
        let pictureObj = null;
        let albumObj = null;
        const library = await pls.readFile('../app-data/library/picture-library.json').then(JSON.parse);

        for(const album of library.albums){
            for(const picture of album.pictures){
                if(req.body.id == picture.id 
                    && album.id != 1 
                    && album.id != 2
                    && album.id != 3
                    && album.id != 4){
                    pictureObj = picture;
                    albumObj = album;
                    pictureObj.path = albumObj.path
                }
            }
        }

        for (const rating of totRating) {
        nrofratings += 1;
        r += rating;
        }
        r = r / nrofratings;

        if(r == 5){
            r = 4;
        }

        let ratingAlbumExists = false;
        let pictureExists = false;

        for(const album of library.albums){
            if(album.id == Math.floor(r)){
                ratingAlbumExists = true;
                for(const picture of album.pictures){
                    if(req.body.id == picture.id){
                        pictureExists = true;
                    }
                }
            }
        }

        if(!pictureExists && ratingAlbumExists){
            const index = library.albums.findIndex(x => x.id == Math.floor(r));
            library.albums[index].pictures.push(pictureObj)
        }
        
        if(!ratingAlbumExists){
            library.albums.push(
            {
                id: Math.floor(r),
                title: Math.floor(r) + "+ rating",
                headerImage: "app-data/library/pictures/album-header/rating-album.png",
                pictures: []
            }
            );
            for(const album of library.albums){
                if(album.id == Math.floor(r)){
                    album.pictures.push(pictureObj);
                }
            }
        }
        const ratingAlbums = [4, 3, 2, 1]
        const index = ratingAlbums.indexOf(Math.floor(r));
        ratingAlbums.splice(index, 1);

        for(const album of library.albums){
            for(const id of ratingAlbums){
                if(album.id == id){
                    for(const picture of album.pictures){
                        if(picture.id == req.body.id){
                            album.pictures.splice(album.pictures.indexOf(picture), 1);
                            if(album.pictures.length == 0){
                                library.albums.splice(library.albums.indexOf(album), 1);
                            }
                        }
                    }
                }
            }
        }

        await pls.writeFile('../app-data/library/picture-library.json', JSON.stringify(library));

    }

    console.log('rating saved...');
});

// Post title/comment
app.post("/changeTitleComment", async (req, res) => {
    const library = await pls
      .readFile("../app-data/library/picture-library.json")
      .then(JSON.parse);
  
    for (const album of library.albums) {
      for (const picture of album.pictures) {
        if (req.body.id == picture.id) {
          picture.title = req.body.title;
          picture.comment = req.body.comment;
          await pls.writeFile(
            "../app-data/library/picture-library.json",
            JSON.stringify(library)
          );
        }
      }
    }
});
  
  // Function to remove a picture when in an album view
app.post("/removePicture", async (req, res) => {
const library = await pls
    .readFile("../app-data/library/picture-library.json")
    .then(JSON.parse);

for (const album of library.albums) {
    for (const picture of album.pictures) {
        if (req.body.id == picture.id) {
            const idx = album.pictures.indexOf(picture);
            album.pictures.splice(idx, 1);
            await pls.writeFile(
            "../app-data/library/picture-library.json",
            JSON.stringify(library)
            );
        }

    }
}
});
  
// Function to add a new album
app.post("/addAlbum", async (req, res) => {
    const library = await pls
        .readFile("../app-data/library/picture-library.json")
        .then(JSON.parse);

    const path = "../app-data/library/pictures/" + req.body.title;

    pls.mkdir(path);

    library.albums.push({
            id: uniqueId(),
            title: req.body.title,
            path: path,
            headerImage: "../app-data/library/pictures/album-header/" + req.body.fileName,
            pictures: []
        });

    await pls.writeFile(
    "../app-data/library/picture-library.json",
    JSON.stringify(library)
    );

});

app.post("/addHeaderImg", async (req, res) => {
    
    const { image } = req.files;

    if (!image) return res.sendStatus(400);

    image.mv("../app-data/library/pictures/album-header/" + image.name);
});

//adds picture
app.post("/addPicture", async (req, res) => {
    
    const {hiRes, orig, loRes} = req.files
    
    if (!hiRes || !orig || !loRes) return res.sendStatus(400);
    
    const library = await pls
    .readFile("../app-data/library/picture-library.json")
    .then(JSON.parse);

    let Path = '';

    for (const album of library.albums) {
        if(album.id == req.body.albumId){
            album.pictures.push({
                id: uniqueId(),
                title: req.body.title,
                comment: req.body.comment,
                imgHiRes: hiRes.name,
                imgOrig: orig.name,
                imgLoRes: loRes.name
            });
            Path = album.path;
        }
    }

    
    await pls.writeFile(
        "../app-data/library/picture-library.json",
        JSON.stringify(library)
        );
    
        
    hiRes.mv(Path + '/' + hiRes.name);
    orig.mv(Path + '/' + orig.name);
    loRes.mv(Path + '/' + loRes.name);

});

function uniqueId() {
    const dateString = Date.now().toString(36);
    const randomness = Math.random().toString(36).substring(2);
    return dateString + randomness;
}

// Function to remove album
//   app.post("/removeAlbum", async (req, res) => {
//     const library = await pls
//       .readFile("../app-data/library/picture-test.json")
//       .then(JSON.parse);
  
//     for (const album of library.albums) {
//       if (req.body.id == album.id) {
//         const idx = library.findIndex((album) => album.id);
//         library.splice(idx, 1);
//         await pls.writeFile(
//           "../app-data/library/picture-test.json",
//           JSON.stringify(library)
//         );
//       }
//     }
//   });