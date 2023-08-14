import SideBarPage from './SideBarPage';
import MapPage from './MapPage';
import style from './MainPage.module.css';
import { useState } from 'react';
import { KakaoSearchDataType } from '../recoil/kakaoMap';


export default function MainPage() {
  const [searchAddressResult, setSearchAddressResult] = useState<KakaoSearchDataType>({
    La: 0,
    Ma: 0,
  });

  return (
    <div className={style.wrap}>
      <div className={style.sideBar}>
        <SideBarPage setSearchAddressResult={setSearchAddressResult} />
      </div>
      <div className={style.map}>
        <MapPage searchAddressResult={searchAddressResult} setSearchAddressResult={setSearchAddressResult} />
      </div>
    </div>
  )
}
