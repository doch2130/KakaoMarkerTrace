import SideBarPage from './SideBarPage';
import MapPage from './MapPage';
import style from './MainPage.module.css';
import { useState } from 'react';

export default function MainPage() {
  const [searchAddressResult, setSearchAddressResult] = useState();

  return (
    <div className={style.wrap}>
      <div className={style.sideBar}>
        <SideBarPage setSearchAddressResult={setSearchAddressResult} />
      </div>
      <div className={style.map}>
        <MapPage searchAddressResult={searchAddressResult} />
      </div>
    </div>
  )
}
