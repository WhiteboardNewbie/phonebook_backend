const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.static('dist'))
app.use(express.json())

morgan.token('data', (req) => {
    return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

data = [
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

app.get('/api/persons', (request, response) => {
    response.json(data)
})

app.get('/info', (request, response) => {
    response.send(`
        <p>Phonebook has info for ${data.length} people</p><p>${new Date()}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = data.find(person => person.id === id)
    if (person) {
        response.json(person)
    }
    else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    data = data.filter(person => person.id !== id)
    response.status(204).end()
})

const generateID = () => {
    const maxID = data.length > 0
        ? Math.max(...data.map(n => n.id))
        : 0
    return String(maxID + 1)
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: "name or number missing"
        })
    }

    const person = {
        "name": body.name,
        "number": body.number,
        "id": generateID()
    }

    if (data.find(p => p.name === person.name)) {
        return response.status(400).json({
            error: "name must be unique"
        })
    }

    data = data.concat(person)

    response.json(person)
})

PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})