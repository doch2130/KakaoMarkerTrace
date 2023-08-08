import React from 'react';
import MapView from '../components/map/MapView';

export default function MapPage() {
  const mapData = {
    x: 126.9628,
    y: 37.5586,
    _lng: 126.9628,
    _lat: 37.5586
  }
  
  return (
    <div>
      <MapView height='100vh' mapData={mapData} />
    </div>
  )
}
