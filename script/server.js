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

    let r = ratings.ratings;
    r = [...r, {rating: req.body.rating, id: req.body.id}];
    console.log(r);
    await pls.writeFile('../app-data/library/picture-rating.json', `{ "ratings": ${JSON.stringify(r)}}`);
    console.log('rating saved...');
});