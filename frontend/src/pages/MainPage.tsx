import SideBarPage from './SideBarPage';
import MapPage from './MapPage';
import style from './MainPage.module.css';
import { useState } from 'react';

interface searchAddressResultType {
  x: number;
  y: number;
}

export default function MainPage() {
  const [searchAddressResult, setSearchAddressResult] = useState<searchAddressResultType>({
    x: 0,
    y: 0
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
