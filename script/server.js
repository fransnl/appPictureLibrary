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
