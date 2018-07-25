const Joi = require('joi');
const express = require('express');
const app = express();
app.use(express.json());//To allow post requests

app.get('/', (req, res)=>{
	res.send('Hello Vidly');
});

const genres = [
	{id : 1, title: "Jazz", year:2001, month:3},
	{id : 2, title: "Rock", year:2003, month:7},
	{id : 3, title: "Pop", year:2004, month:5},
	{id : 4, title: "Dance Hall", year:2006, month:8},
];

//To get all genres
app.get('/api/genres', (req, res)=>{
	res.send(genres);
});

//Get genres by Id
app.get('/api/genres/:id', (req, res)=>{
	const genre =  genres.find( c=> c.id === parseInt(req.params.id)); 
	if (!genre) return res.status(404).send("The genre with this ID doesn't exist");
	res.send(genre);
});

//Get genres using two url paramenter
app.get('/api/genres/:year/:month', (req, res)=>{
	const genre = genres.find( c=> (c.year === parseInt(req.params.year)) && (c.month === parseInt(req.params.month)));
	if(!genre) return res.status(404).send("No genre has the specified year and month");
	res.send(genre);
});

//Handling post requests
app.post('/api/genres', (req, res)=>{

	//Validate the genre follows the pattern we want, otherwise return 400 (Bad Reqest) if it's invalid
	const {error} = validateGenre(req.body);
	if(error) return res.status(400).send(error.details[0].message);

	const genre = {
		id: genres.length+1,
		title: req.body.title,
		year: req.body.year,
		month: req.body.month
	};
	genres.push(genre);
	res.send(genre);
});

//Handling PUT/UPDATE request
app.put('/api/genres/:id', (req, res)=>{

	//find the genre
	const genre = genres.find( c=> c.id === parseInt(req.params.id)); 
	
	//If genre doesn't exist, return 404 (Not Found) and exit function
	if (!genre) return res.status(404).send("The genre with this ID doesn't exist");
	res.send(genre);
	
	//If it exists, validate the genre and return 400 (Bad Reqest) if it's invalid
	const {error} = validateGenre(req.body);
	if(error) return res.status(400).send(error.details[0].message);

	//If all is ok, the update the genre
	genre.title = req.body.title;
	genre.year = req.body.year,
	genre.month = req.body.month
	res.send(genre);
});

app.delete('/api/genres/:id', (req, res)=>{
	//find the genre
	const genre = genres.find( c=> c.id === parseInt(req.params.id)); 
	
	//If genre doesn't exist, return 404 (Not Found) and exit function
	if (!genre) return res.status(404).send("The genre with this ID doesn't exist");
	res.send(genre);

	//If found, delete the genre
	const genreIndex = genres.indexOf(genre);
	genres.splice(genreIndex, 1);
	res.send(genre);	
});

function validateGenre(genre){
	const schema = {
		title: Joi.string().min(5).required(),
		year: Joi.number().integer().required(),
		month: Joi.number().integer().required(),
	};
	return Joi.validate(genre, schema);
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));