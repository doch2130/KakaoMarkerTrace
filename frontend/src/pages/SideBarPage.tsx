import { useRef } from 'react';
import Box from '../components/ui/Box';
import style from './SideBarPage.module.css';
import React from 'react';
import { useRecoilState } from 'recoil';
import { cateogryState, categoryType } from '../recoil/category';

interface sideBarPageProps {
  setSearchAddressResult: Function;
  sideIndexNumber?: number;
  setSideIndexNumber?: Function;
}

export default function SideBarPage(props:sideBarPageProps) {
  const { setSearchAddressResult, sideIndexNumber, setSideIndexNumber } = props;
  const searchInput = useRef<HTMLInputElement>(null);
  const [cateogryList, setCateogryList] = useRecoilState<categoryType[]>(cateogryState);

  const searchAddressHandler = (e:React.KeyboardEvent<HTMLInputElement>) => {
    if(!searchInput.current) {
      return ;
    }

    if(e.key === 'Enter') {
      locationSearchFunction();
    }
    return ;
  };

  
  function locationSearchFunction() {
    if(!searchInput.current) {
      return ;
    }

    const address = searchInput.current.value;

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

  const addCategoryHandler = () => {
    setCateogryList((prevCategoryList:categoryType[]) => {
      // console.log('prevCategoryList ', prevCategoryList);
      const newName = `새 카테고리${prevCategoryList.length + 1}`;
      const updateData:categoryType = { name: newName, latlngArr: [{La:0, Ma:0}] }
      return [...prevCategoryList, updateData]
    })
  }

  // reverse는 일단 보류
  // reverse 사용 시 카테고리 추가할 때 menuIndexNumber + 1 값도 설정해야 함
  // const reverse = [...cateogryList].reverse();

  return (
    <div>
      <div className={style.header}>
        <input ref={searchInput} type='text' placeholder='지역 검색' onKeyDown={searchAddressHandler} />
        <button type='button' onClick={locationSearchFunction}>검색</button>
      </div>
      <div className={style.body}>
        <div className={style.add}>
          <span onClick={addCategoryHandler}>카테고리 추가하기</span>
        </div>
        {cateogryList?.map((el, index) => {
        // {/* {reverse?.map((el, index) => { */}
          return <Box key={index} indexNumber={index} categoryKey={el} setCateogryKey={setCateogryList}
          sideIndexNumber={sideIndexNumber} setSideIndexNumber={setSideIndexNumber}/>
        })}
      </div>
    </div>
  )
}
