//fs/promises for async read/write
import * as pls from "fs/promises";
import express from "express";
//cors needed for accepting requests from other "webservers"
import cors from "cors";

const app = express();
app.listen(8080);
app.use(express.json());
app.use(cors());

console.log("Server is running!");
//listening to post requests on 8080/addrating
app.post("/addrating", async (req, res) => {
  const ratings = await pls
    .readFile("../app-data/library/picture-rating.json")
    .then(JSON.parse);

  let r = ratings.ratings;
  r = [...r, { rating: req.body.rating, id: req.body.id }];
  console.log(r);
  await pls.writeFile(
    "../app-data/library/picture-rating.json",
    `{ "ratings": ${JSON.stringify(r)}}`
  );
  console.log("rating saved...");
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
          "../app-data/library/picture-test.json",
          JSON.stringify(library)
        );
      }
    }
  }
  console.log(req.body.comment);
  console.log(req.body.title);
});

// Function to remove a picture when in an album view
app.post("/removePicture", async (req, res) => {
  const library = await pls
    .readFile("../app-data/library/picture-test.json")
    .then(JSON.parse);

  for (const album of library.albums) {
    for (const picture of album.pictures) {
      if (req.body.id == picture.id) {
        const idx = library.albums.findIndex((picture) => picture.id);
        library.albums.splice(idx, 1);
        await pls.writeFile(
          "../app-data/library/picture-test.json",
          JSON.stringify(library)
        );
      }
    }
  }
});

// Function to add a new album
app.post("/addAlbum", async (req, res) => {
  const library = await pls
    .readFile("../app-data/library/picture-test.json")
    .then(JSON.parse);

  for (const album of library.albums) {
    for (const picture of album.pictures) {
      if (req.body.id == picture.id) {
        picture.title = req.body.title;
        picture.comment = req.body.comment;
        picture.src = req.body.img;

        console.log(picture.title);
        console.log(picture.comment);
        console.log(picture.src);
        await pls.writeFile(
          "../app-data/library/new-album.json",
          JSON.stringify(library)
        );
      }
    }
  }
});

// Function to remove album
app.post("/removeAlbum", async (req, res) => {
  const library = await pls
    .readFile("../app-data/library/picture-test.json")
    .then(JSON.parse);

  for (const album of library.albums) {
    if (req.body.id == album.id) {
      const idx = library.findIndex((album) => album.id);
      library.splice(idx, 1);
      await pls.writeFile(
        "../app-data/library/picture-test.json",
        JSON.stringify(library)
      );
    }
  }
});

app.post("/addPicture", async (req, res) => {
  const library = await pls
    .readFile("../app-data/library/picture-test.json")
    .then(JSON.parse);

  for (const album of library.albums) {
    for (const picture of album.pictures) {
      if (req.body.id == picture.id) {
        picture.title = req.body.title;
        picture.comment = req.body.comment;
        picture.src = req.body.img;

        console.log(picture.title);
        console.log(picture.comment);
        console.log(picture.src);
        await pls.writeFile(
          "../app-data/library/new-album.json",
          JSON.stringify(library)
        );
      }
    }
  }
});
