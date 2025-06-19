// dotenv
require('dotenv').config()
// express initialisation
const express = require('express')
const app = express()

// model
const Person = require('./models/person')
// dist
app.use(express.static('dist'))
// json-parser
app.use(express.json())

// morgan
const morgan = require('morgan')
morgan.token('body', req => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// info
app.get('/info', (req, res) => {
  const date = new Date()
  Person.countDocuments({}).then(count => {
    res.send(
      `<p>Phonebook has info for ${count} people.<p>
      <p>${date}</p>`
    )
  })
})

// getAll
app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

// getById
app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      }
      else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

// create
app.post('/api/persons', (req, res, next) => {

  const body = req.body

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    res.json(savedPerson)
  }).catch(error => next(error))
})

// update
app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body

  Person.findById(req.params.id)
    .then(person => {
      if (!person) {
        return res.status(404).end()
      }

      person.name = name
      person.number = number

      return person.save().then(updatedPerson => {
        res.json(updatedPerson)
      })
    })
    .catch(error => next(error))
})

// delete
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

// unknownEndpoint
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

// errorHandler
const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }

  else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

// port, app, start
const port = 3001
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})