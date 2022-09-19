//fs/promises for async read/write
import * as pls from 'fs/promises';
import express from 'express';
//cors needed for accepting requests from other "webservers"
import cors from 'cors';

const app = express();
app.listen(8080);
app.use(express.json());
app.use(cors());

//listening to post requests on 8080/addrating
app.post('/addrating', async (req, res) =>{
    const ratings = await pls.readFile('../app-data/library/picture-rating.json')
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