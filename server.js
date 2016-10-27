var express = require('express')
var app = express()
var server = require('http').createServer(app)
var io = require('socket.io').listen(server)
var users = []
var connections = []
var geocoder = require('geocoder')

app.use(express.static(__dirname + '/public/'))

server.listen(process.env.PORT || 3000)
console.log('server running on port 3000')

app.get('/', function (req, res) {
  res.render('index')
})

io.sockets.on('connection', function (socket) {
  connections.push(socket)
  console.log('Connected: %s sockets connected', connections.length)

  socket.on('disconnect', function (data) {
    users.splice(users.indexOf(socket.username), 1)
    updateUsernames()
    connections.splice(connections.indexOf(socket), 1)
    console.log('Disconnected: %s sockets connected', connections.length)
  })

  // Send message

  socket.on('send message', function (data) {
    console.log(data)
    io.sockets.emit('new message', {msg: data, user: socket.username})
  })

  // New user
  socket.on('new user', function (data, callback) {
    callback(true)
    socket.username = data
    users.push(socket.username)
    updateUsernames()
  })

  function updateUsernames () {
    io.sockets.emit('get users', users)
  }

  // Send event
  // socket.on('send event', function (data) {
  //   console.log(data)
  //   io.sockets.emit('new event', {event: data})
  // })
  //
  // socket.on('send icon', function (data) {
  //   console.log('data send ', data)
  //   io.sockets.emit('new icon', data)
  // })
  socket.on('search', function (data) {
    geocoder.geocode(data, function (err, response) {
      console.log(response)
      if (response.results[0].geometry['bounds'] !== undefined ) {
        latlong = response.results[0].geometry['bounds']['northeast']
      } else if (response.results[0].geometry['bounds'] === undefined ){
        // console.log(response.results[0].geometry['location'])
        latlong = response.results[0].geometry['location']
      }
      var searchTerm = {place: data, latlng: latlong, user: socket.username}
      io.sockets.emit('geocoded latlong', searchTerm )
    })
  })
})

// io.sockets.on('connection', function (socket) {
//   connections.push(socket)
//   console.log('Connected: %s sockets connected', connections.length)
//
//   socket.on('disconnect', function (data) {
//     users.splice(users.indexOf(socket.username), 1)
//     // updateUsernames()
//     connections.splice(connections.indexOf(socket), 1)
//     console.log('Disconnected: %s sockets connected', connections.length)
//   })
//
//   socket.on('search', function (data) {
//     geocoder.geocode(data, function (err, response) {
//       console.log(response);
//       if (response.results[0].geometry['bounds'] !== undefined ) {
//         latlong = response.results[0].geometry['bounds']['northeast']
//       } else if (response.results[0].geometry['bounds'] === undefined ){
//         // console.log(response.results[0].geometry['location'])
//         latlong = response.results[0].geometry['location']
//       }
//       var searchTerm = {place: data, latlng: latlong}
//       io.sockets.emit('geocoded latlong', searchTerm)
//     })
//   })
// })
