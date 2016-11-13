/* global $ L */
var socket = io.connect()

$(function () {
  var $messageForm = $('#messageForm')
  var $message = $('#message')
  var $chat = $('#chat')
  var $messageArea = $('#messageArea')
  var $userFormArea = $('#userFormArea')
  var $userForm = $('#userForm')
  var $users = $('#users')
  var $username = $('#username')
  var $pacInput = $('#pac-input')
  var $pacInputForm = $('#pac-input-form')
  var $success = $('#success')

  $messageForm.submit(function (e) {
    e.preventDefault()
    socket.emit('send message', $message.val())
    $message.val(' ')
  })

  socket.on('new message', function (data) {
    $chat.append('<li><strong>' + data.user + '</strong>: ' + data.msg + '</li>')
  })

  // $pacInputForm.submit(function (e) {
  //   e.preventDefault()
  //   socket.emit('send event', $pacInput.val())
  //   $pacInput.val(' ')
  // })



  // submit username
  $userForm.submit(function (e) {
    e.preventDefault()
    $('.content').show(500, function(){

    })
    console.log('submitted')
    socket.emit('new user', $username.val(), function (data) {
      if (data) {
        $userForm.hide()
        $success.show()
      }
    })
    $username.val(' ')
  })

  // show username on the left
  socket.on('get users', function (data) {
    var html = ''
    for (i = 0; i < data.length;i++) {
      html += '<li class="list-group-item">' + data[i] + '</li>'
    }
    $users.html(html)
  })
})

/////////////////////////***MAP**//////////////////////
$(document).ready(function () {
  // loading the base map
  var mymap = L.map('mapid').setView([1.3481, 103.8208], 12).invalidateSize(true)

  L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: '<a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    zoomControl: false,
    accessToken: 'pk.eyJ1IjoiZGF2aWZpZWQiLCJhIjoiY2lxYWoxMnF3MDF0Z2Z2bTZ6MHl3cWdiMyJ9.JhNjMNWSTxbGzp7ck3ahMA'
  }).addTo(mymap)

  $('#searchBar').submit(function(e) {
    e.preventDefault()
    var searchTerm = $('input#search').val()
    socket.emit('search', searchTerm)
  })



  socket.on('geocoded latlong', function(data) {
    var marker = L.marker([data.latlng.lat, data.latlng.lng]).addTo(mymap).bindPopup(data.user);
    $('ul#list').append('<li>' + data.place + '</li>')
  })
})
