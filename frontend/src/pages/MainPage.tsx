import SideBarPage from './SideBarPage';
import MapPage from './MapPage';
import style from './MainPage.module.css';
import { useState } from 'react';
// import { KakaoSearchDataType } from '../recoil/kakaoMap';
import { useRecoilState } from 'recoil';
import { categoryType, cateogryState, categoryDataType, menuIndexNumberType, menuIndexState } from '../recoil/category';


export default function MainPage() {
  const [searchAddressResult, setSearchAddressResult] = useState<categoryDataType>({
    La: 0,
    Ma: 0,
  });

  const [cateogryList, setCateogryList] = useRecoilState<categoryType[]>(cateogryState);
  const [sideIndexNumber, setSideIndexNumber] = useRecoilState<menuIndexNumberType>(menuIndexState);

  return (
    <div className={style.wrap}>
      <div className={style.sideBar}>
        <SideBarPage setSearchAddressResult={setSearchAddressResult} sideIndexNumber={sideIndexNumber.index} setSideIndexNumber={setSideIndexNumber} />
      </div>
      <div className={style.map}>
        <MapPage searchAddressResult={searchAddressResult} setSearchAddressResult={setSearchAddressResult} />
      </div>
    </div>
  )
}
