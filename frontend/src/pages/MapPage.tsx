import { MapType } from '../recoil/naverMap';
import KakaoMapView from '../components/map/KakaoMapView';
import { KakaoSearchDataType } from '../recoil/kakaoMap';
import style from './MapPage.module.css';
import { useModal } from '../hooks/useModal';
import DistanceModalChild from '../components/DistanceModalChild';
import { useRef, useState } from 'react';

interface mapPageProps {
  searchAddressResult: KakaoSearchDataType;
  setSearchAddressResult: Function;
}

interface manualAddMarkerValue {
  state: Boolean;
  distance: number;
  direction: number;
}

export default function MapPage(props:mapPageProps) {
  const { searchAddressResult, setSearchAddressResult } = props;
  const { openModal, closeModal } = useModal();
  const [ manualAddMarkerValue, setManualAddMarkerValue] = useState<manualAddMarkerValue>({
    state: false,
    distance: 0,
    direction: 0
  });

  // 임시 Map Data 값
  // 나중에는 getPosition으로 바꾸면 될 듯
  const mapData:MapType = {
    x: 126.9628,
    y: 37.5586,
    _lng: 126.9628,
    _lat: 37.5586
  }

  const latlngModalOpen = () => {
    openModal({
      size: 'sm',
      backDrop: true,
      content: <DistanceModalChild closeModalHandler={closeModal} setManualAddMarkerValue={setManualAddMarkerValue} />
    });
  }

  return (
    <div className={style.wrap}>
      <div className={style.topButton} onClick={latlngModalOpen}>
        <img src='/icon/plus.png' alt='plus' />
      </div>
      <KakaoMapView height='100vh' mapData={mapData}
      searchAddressResult={searchAddressResult} setSearchAddressResult={setSearchAddressResult} manualAddMarkerValue={manualAddMarkerValue} setManualAddMarkerValue={setManualAddMarkerValue} />
    </div>
  )
}
