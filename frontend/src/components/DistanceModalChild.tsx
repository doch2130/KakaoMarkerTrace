import { MouseEventHandler, useRef } from 'react'
import style from './DistanceModalChild.module.css';

interface DistanceModalChildPropsType {
  closeModalHandler: Function;
  setManualAddMarkerValue: Function;
}

export default function DistanceModalChild(props:DistanceModalChildPropsType) {
  const { closeModalHandler, setManualAddMarkerValue } = props;
  const manualAddMarkerSelect = useRef<HTMLSelectElement>(null);
  const manualAddMarkerInput = useRef<HTMLInputElement>(null);
  
  const submitHandler = (event:React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();    
    // console.log('manualAddMarkerInput.current?.value ', manualAddMarkerInput.current?.value);
    if(manualAddMarkerInput.current?.value === '') {
      alert('0 이상의 값을 입력해주세요.');
      return ;
    }
    const distanceValue = Number(manualAddMarkerInput.current?.value);
    if(distanceValue < 0) {
      alert('0 이상의 값을 입력해주세요.');
      return ;
    }

    const directionValue = manualAddMarkerSelect.current?.value;

    // console.log('distanceValue ', distanceValue);
    // console.log('directionValue ', directionValue);
    setManualAddMarkerValue({
      state: true,
      distance: distanceValue,
      direction: directionValue
    });
    closeModalHandler();
    return ;
  }

  return (
  <div>
    <form className={style.formWrap}>
      <div className={style.row}>
        <label htmlFor='direction'>방향: </label>
        <select id='direction' ref={manualAddMarkerSelect}>
          {/* 지도에서 표출 시 위, 아래의 값을 반대로 설정해야 정상적으로 출력,
          좌표 변환 함수에서 문제인지 지도의 기준 값이 문제인지는 정확한 파악이 어려움*/}
          <option value='180'>위</option>
          <option value='0'>아래</option>
          <option value='90'>오른쪽</option>
          <option value='270'>왼쪽</option>
        </select>
      </div>
      <div className={style.row}>
        <label htmlFor='distance'>거리: </label>
        <input id='distance' type='number' ref={manualAddMarkerInput} required={true} />
        <span> M</span>
      </div>
      <div className={style.buttonGroup}>
        <button type='button' onClick={submitHandler}>추가</button>
        <button type='button' onClick={closeModalHandler as MouseEventHandler}>취소</button>
      </div>
    </form>
  </div>
  )
}
