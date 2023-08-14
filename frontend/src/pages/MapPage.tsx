import { MapType } from '../recoil/naverMap';
// import NaverMapViewBackup from '../components/map/NaverMapViewBackup';
import NaverMapView from '../components/map/NaverMapView';

interface mapPageProps {
  searchAddressResult: {
    x: number;
    y: number;
  };
  setSearchAddressResult: Function;
}

export default function MapPage(props:mapPageProps) {
  const { searchAddressResult, setSearchAddressResult } = props;

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
      {/* <NaverMapView height='100vh' mapData={mapData} searchAddressResult={searchAddressResult} /> */}
      <NaverMapView height='100vh' mapData={mapData}
      searchAddressResult={searchAddressResult} setSearchAddressResult={setSearchAddressResult} />
    </div>
  )
}
