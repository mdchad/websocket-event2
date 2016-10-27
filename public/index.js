var socket = io.connect()

$(function () {
  var socket = io.connect()
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
  var $eventHere = $('#eventHere')

  $messageForm.submit(function (e) {
    e.preventDefault()
    console.log('submitted')
    socket.emit('send message', $message.val())
    $message.val(' ')
  })

  socket.on('new message', function (data) {
    $chat.append('<li><strong>' + data.user + '</strong>: ' + data.msg + '</li>')
  })

  $pacInputForm.submit(function (e) {
    e.preventDefault()
    console.log()
    socket.emit('send event', $pacInput.val())
    $pacInput.val(' ')
  })

  socket.on('new event', function (data) {
    $eventHere.append('<li class="vote" id="vote1">' + data.event + '</li>')
  })

  // submit username
  $userForm.submit(function (e) {
    e.preventDefault()
    console.log('submitted')
    socket.emit('new user', $username.val(), function (data) {
      if (data) {
        $userFormArea.hide()
        $messageArea.show()
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

// $('#eventHere').click(function(){
//   console.log("clicked")
// })

// $('#eventHere').click(function(){
//   console.log("clicked")
// })

// var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
// var labelIndex = 0

function initAutocomplete () {
  console.log('map loaded')
  var singapore = { lat: 1.3145408, lng: 103.818668 }
  var map = new google.maps.Map(document.getElementById('map'), {
    center: singapore,
    zoom: 13,
    mapTypeId: 'roadmap'
  })

  // google.maps.event.addListener(map, 'click', function(event) {
  // addMarker(event.latLng, map)
  // })

  // Add a marker at the center of the map.
  // addMarker(singapore, map)

  // Create the search box and link it to the UI element.
  var input = document.getElementById('pac-input')
  var searchBox = new google.maps.places.SearchBox(input)
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input)

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function () {
    searchBox.setBounds(map.getBounds())
  })

  var markers = []
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function () {
    var places = searchBox.getPlaces()

    if (places.length == 0) {
      return
    }
    console.log(markers)

    socket.emit('send icon', markers)

    socket.on('new icon', function (data) {
      // data.push(markers)
    })

    // Clear out the old markers.
    // markers.forEach(function(marker) {
    //   marker.setMap(null)
    // })
    // markers = []

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds()
    places.forEach(function (place) {
      if (!place.geometry) {
        console.log('Returned place contains no geometry')
        return
      }
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      }

      // Create a marker for each place.
      markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      }))

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport)
      } else {
        bounds.extend(place.geometry.location)
      }
    })
    map.fitBounds(bounds)
  })
  // google.maps.event.addDomListener(window, 'load', initialize)

}
