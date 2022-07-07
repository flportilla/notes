const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}


const express = require('express')
const app = express()
const cors = require('cors')

require('dotenv').config()

const Note = require('./models/note')
app.use(express.static('build'))
app.use(express.json())
app.use(requestLogger)
app.use(cors())


let notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2022-05-30T17:30:31.098Z",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    date: "2022-05-30T18:39:34.091Z",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2022-05-30T19:20:14.298Z",
    important: true
  }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', async (request, response) => {

  const allNotes = await Note.find({})
  response.json(allNotes)
})

app.get('/api/notes/:id', async (request, response, next) => {

  try {
    const noteById = await Note.findById(request.params.id)
    response.json(noteById)
  } catch (error) {
    console.log(error)
    next(error)
  }

})

app.delete('/api/notes/:id', async (request, response, next) => {

  try {
    const deletedNote = await Note.findByIdAndRemove(request.params.id)
    response.status(204).end()

  } catch (error) {
    next(error)
  }

})


app.post('/api/notes', async (request, response, next) => {
  const body = request.body

  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  })

  try {
    const savedNote = await note.save()
    response.json(savedNote)
  } catch (error) {
    next(error)
  }

})

app.put('/api/notes/:id', async (request, response, next) => {
  const body = request.body
  const id = request.params.id

  const { content, important } = request.body


  try {
    const updatedNote = await Note
      .findByIdAndUpdate(
        id,
        { content, important },
        { new: true, runValidators: true, context: 'query' }
      )

    response.json(updatedNote)

  } catch (error) {
    next(error)
  }
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})