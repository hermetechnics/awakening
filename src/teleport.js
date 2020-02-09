export const Locations = {
  'National Gallery of Art': {
    position: new google.maps.LatLng(38.8917586, -77.019892),
    heading: 0,
    pitch: 0,
  },
  'Google Data Center': {
    position: new google.maps.LatLng(-33.3597461,-70.6971737),
    heading: 10.51,
    pitch: 79,
  }
}

export const teleport = context => location => {
  if (location in Locations) {
    context.map.setPosition(Locations[location].position);
    context.map.setPov(location);
  }
}
