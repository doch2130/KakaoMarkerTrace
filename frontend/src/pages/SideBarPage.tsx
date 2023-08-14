import { useRef } from 'react';
import Box from '../components/ui/Box';
import style from './SideBarPage.module.css';
import React from 'react';
import { useRecoilState } from 'recoil';
import { cateogryState, categoryType } from '../recoil/category';

interface sideBarPageProps {
  setSearchAddressResult: Function;
}

export default function SideBarPage(props:sideBarPageProps) {
  const { setSearchAddressResult } = props;
  const searchInput = useRef<HTMLInputElement>(null);

  // recoil 테스트
  const [cateogryList, setCateogryList] = useRecoilState<categoryType[][]>(cateogryState);

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


  const test = () => {
    const updateData:categoryType[] = [];
    setCateogryList((prevCategoryList) => [...prevCategoryList, updateData])
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
        <div className={style.add}>
          <span onClick={test}>카테고리 추가하기</span>
        </div>
        {cateogryList?.map((el, index) => {
          console.log('el ', el);
          console.log('index ', index);
          return <Box indexNumber={index} categoryData={el} key={index}/>
        })}
      </div>
    </div>
  )
}
