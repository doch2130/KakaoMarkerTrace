import { useRef } from 'react';
import Box from '../components/ui/Box';
import style from './SideBarPage.module.css';
import React from 'react';

interface sideBarPageProps {
  setSearchAddressResult: Function;
}

export default function SideBarPage(props:sideBarPageProps) {
  const { setSearchAddressResult } = props;
  const searchInput = useRef<HTMLInputElement>(null);

  const searchAddressHandler = (e:React.KeyboardEvent<HTMLInputElement>) => {
    if(!searchInput.current) {
      return ;
    }

    if(e.key === 'Enter') {
      locationSearchFunction(searchInput.current.value);
    }
    return ;
  };

  
  function locationSearchFunction(address:string) {
    if(address === null || address === undefined || address.trim() === '') {
      alert('주소나 지역을 입력해주세요');
      return ;
    }
    // 주소-좌표 변환 객체를 생성합니다
    const geocoder = new kakao.maps.services.Geocoder();

    // 주소로 좌표를 검색합니다
    geocoder.addressSearch(address, function(result, status) {
        // 정상적으로 검색이 완료됐으면 
        // console.log('status ', status);
        if (status === kakao.maps.services.Status.OK) {
          // console.log('result ', result);
          const coords = {
            La: Number(result[0].x),
            Ma: Number(result[0].y),
          }
          setSearchAddressResult(coords);
        } else if (status === 'ZERO_RESULT') {
          alert('일치하는 주소, 지역 값이 없습니다');
        }
    });
  }


  return (
    <div>
      <div className={style.header}>
        <input ref={searchInput} type='text' placeholder='지역 검색' onKeyDown={searchAddressHandler} />
        <button type='button' onClick={() => {
          if(searchInput.current) {
            locationSearchFunction(searchInput.current.value)
          }
        }}>검색</button>
      </div>
      <div className={style.body}>
        <Box />
      </div>
    </div>
  )
}
