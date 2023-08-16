import { MouseEventHandler } from 'react'
import style from './DistanceModalChild.module.css';

interface DistanceModalChildPropsType {
  closeModalHandler: Function;
}

export default function DistanceModalChild(props:DistanceModalChildPropsType) {
  const { closeModalHandler } = props;
  
  const submitHandler = (event:React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    console.log('asd');
  }

  return (
  <div>
    <form className={style.formWrap}>
      <div className={style.row}>
        <label htmlFor='direction'>방향: </label>
        <select>
          <option value='동'>동</option>
          <option value='서'>서</option>
          <option value='남'>남</option>
          <option value='북'>북</option>
        </select>
      </div>
      <div className={style.row}>
        <label htmlFor='distance'>거리: </label>
        <input type='number' />
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
