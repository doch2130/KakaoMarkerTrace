import { MapType } from '../recoil/naverMap';
import NaverMapView from '../components/map/NaverMapView';

interface mapPageProps {
  searchAddressResult: any;
}

export default function MapPage(props:mapPageProps) {
  // 임시 Map Data 값
  // 나중에는 getPosition으로 바꾸면 될 듯
  const mapData:MapType = {
    x: 126.9628,
    y: 37.5586,
    _lng: 126.9628,
    _lat: 37.5586
  }
  
  return (
    <div>
      <NaverMapView height='100vh' mapData={mapData} searchAddressResult={props.searchAddressResult} />
    </div>
  )
}
