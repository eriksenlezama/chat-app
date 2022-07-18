const express = require('express')
const app = express()
const http = require('http')
const cors = require('cors')
const { Server } = require('socket.io')
const { addUser, getUser, getUsers, removeUser } = require('./users')

app.use(cors())

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3004',
    methods: ['GET', 'POST']
  }
})

io.on('connection', (socket) => {
  socket.on('joinRoom', ({ username, room }) => {
    addUser(socket.id, username, room)
    socket.join(room)
    io.in(room).emit('updateUsers', getUsers())
  })

  socket.on('disconnect', () => {
    removeUser(socket.id)
    io.emit('updateUsers', getUsers())
  })
})

const port = 3006

server.listen(port, () => {
  console.log(`Server running in port ${port}`)
})