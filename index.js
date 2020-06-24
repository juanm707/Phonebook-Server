const express = require('express');
const app = express();
app.use(express.json());

var morgan = require('morgan');
morgan.token('body', function getBody(req) {
	return JSON.stringify(req.body);
});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

// hardcoded data
let persons = [{
	name: "Arto Hellas",
	number: "040-123456",
	id: 1
	},
	{
		name: "Ada Lovelace",
		number: "39-44-532523",
		id: 2
	},
	{
		name: "Dan Abramov",
		number: "12-43-234345",
		id: 3
	}];

const generateID = () => {
	const maxID = persons.length > 0 ? Math.max(...persons.map(p => p.id)) : 0;
	return maxID + 1;
}

app.get('/', (req, res) => {
	res.send('<h1>This is a phonebook app</h1>');
});

app.get('/api/persons', (req, res) => {
	res.json(persons);
});

app.get('/info', (req, res) => {
	var len = persons.length;
	var resData = `<p>Phonebook has info for ${len} people</p>` + `<p>${new Date()}</p>`;
	//console.log(resData);
	res.send(resData);
});


app.post('/api/persons', (req, res) => {
	// console.log(req.headers);
	const body = req.body;
	if (!body.name) {
	    return res.status(400).json({
		    error: 'name is missing'
	       	});
	}
	if (!body.number) {
		return res.status(400).json({
			error: 'number is missing'
		});
	}
	if (persons.find(p => p.name === body.name)) {
		return res.status(400).json({
			error: 'name already in phonebook, name must be unique'
		});
	}

	const person = {
	    name: body.name,
	    number: body.number,
	    id: generateID(),
	}

	persons = persons.concat(person);
	//console.log(note);
	res.json(person);
});

app.get('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id);
	//console.log(id, typeof id);
	const person = persons.find(p => p.id === id);
	if (person) {
	    res.json(person);
	} else {
	    res.status(404).end();
	}
});

app.delete('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id);
	persons = persons.filter(p => p.id !== id);
	res.status(204).end();
});


const PORT = 3001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
