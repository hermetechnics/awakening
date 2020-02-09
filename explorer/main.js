const container = document.getElementById("container");

const mapOptions = {
  position: new google.maps.LatLng(-20.324089,-69.7531624),
  pov: { heading: 308.77, pitch: 3 },
  clickToGo: true
};

const map = new google.maps.StreetViewPanorama(container, mapOptions);
