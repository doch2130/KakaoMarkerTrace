import React from 'react'
import SideBarPage from './SideBarPage';
import MapPage from './MapPage';
import style from './MainPage.module.css';

export default function MainPage() {
  return (
    <div className={style.wrap}>
      <div className={style.sideBar}>
        <SideBarPage />
      </div>
      <div className={style.map}>
        <MapPage />
      </div>
    </div>
  )
}
