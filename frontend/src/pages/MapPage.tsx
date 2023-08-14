import { MapType } from '../recoil/naverMap';
// import NaverMapView from '../components/map/NaverMapView';
import KakaoMapView from '../components/map/KakaoMapView';
import { KakaoSearchDataType } from '../recoil/kakaoMap';

interface mapPageProps {
  searchAddressResult: KakaoSearchDataType;
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
      {/* <NaverMapView height='100vh' mapData={mapData} searchAddressResult={searchAddressResult} setSearchAddressResult={setSearchAddressResult} /> */}
      <KakaoMapView height='100vh' mapData={mapData}
      searchAddressResult={searchAddressResult} setSearchAddressResult={setSearchAddressResult} />
    </div>
  )
}
