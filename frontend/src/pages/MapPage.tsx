import NaverMapView from '../components/map/NaverMapView';

export default function MapPage() {
  const mapData = {
    x: 126.9628,
    y: 37.5586,
    _lng: 126.9628,
    _lat: 37.5586
  }
  
  return (
    <div>
      <NaverMapView height='100vh' mapData={mapData} />
    </div>
  )
}
