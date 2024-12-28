const socket = io();

const map = new ol.Map({
  target: "map",
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM()
    })
  ],
  view: new ol.View({
    center: ol.proj.fromLonLat[0, 0],
    zoom: 11
  })
})

const mapNewLayer = new ol.layer.Vector({
  source: new ol.source.Vector()
});
map.addLayer(mapNewLayer);

const updateMarkerFeature = new ol.Feature({
  geometry: new ol.geom.Point(ol.proj.fromLonLat([0, 0]))
});

updateMarkerFeature.setStyle(
  new ol.style.Style({
    image: new ol.style.Icon({
      src: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
      scale: 0.1
    })
  })
)
mapNewLayer.getSource().addFeature(updateMarkerFeature)

function updateMarkerPosition(coords) {
  const newCoords = ol.proj.fromLonLat([coords.longitude, coords.latitude])
  updateMarkerFeature.getGeometry().setCoordinates(newCoords);

  map.getView().setCenter(newCoords);
}

// Get user's current position and update the map
if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { longitude, latitude } = position.coords;

       // Update the map's view to the user's current location
      map.getView().setCenter(ol.proj.fromLonLat([longitude, latitude]))

      // Update the marker position
      updateMarkerPosition({ longitude, latitude })
      
      socket.emit("user-position", position.coords);
      console.log("Initial position: ", position.coords);
    },
    (error) => {
      console.log("Error getting location", error);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 5000
    }
  )
} else {
  console.log("Geolocation is not supported by your browser.");
  
}