const express = require('express')
const morgan = require('morgan')

const app = express()

app.use(express.json())

morgan.token('body', req => JSON.stringify(req.body))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/info', (req, res) => {
    const date = new Date()
    const personCount = persons.length
    res.send(
        `<p>Phonebook has infor for ${personCount} people.<p>
        <p>${date}</p>`
    )
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    person = persons.find(person => person.id === req.params.id)
    
    if (person) {
        res.json(person)
    }
    else {
        res.status(404).end()
    }
})

app.post('/api/persons', (req, res) => {

    const generateID = () => {
        const maxID = persons.length > 0
            ? Math.max(...persons.map(person => person.id))
            : 0
        return String(maxID + 1)
    }

    const body = req.body

    if ( !body.name || !body.number ) {
        return res.status(400).json(
            { error: "name or number is missing"}
        )
    }

    else if ( persons.find(person => person.name === body.name)) {
        return res.status(400).json(
            { error: "name already in phonebook"}
        )
    }

    else {
        const person = {
            name: body.name,
            number: body.number,
            id: generateID(),
        }

        persons = persons.concat(person)

        res.json(person)
    }
})

app.delete('/api/persons/:id', (req, res) => {
    persons = persons.filter(person => person.id !== req.params.id)
    res.status(204).end()
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const port = 3001
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})