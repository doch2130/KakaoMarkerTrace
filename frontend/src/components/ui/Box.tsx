import { categoryDataType } from '../../recoil/category';
import style from './Box.module.css';

interface boxProps {
  indexNumber: number;
  categoryData: categoryDataType[];
  sideIndexNumber?: number;
  setSideIndexNumber?: Function;
}

export default function Box(props:boxProps) {
  const { indexNumber, categoryData, sideIndexNumber, setSideIndexNumber } = props;

  const menuChangeHandler = ():void => {
    // console.log('indexNumber ', indexNumber);
    // console.log('sideIndexNumber ', sideIndexNumber);

    if(setSideIndexNumber !== undefined) {
      setSideIndexNumber({ index: indexNumber });
    }
    return ;
  }

  return (
    <div className={indexNumber === sideIndexNumber ? `${style.wrap} ${style.active}` : style.wrap}>
      <div className={style.content} onClick={menuChangeHandler}>
        <div className={style.contentLeft}>
          {indexNumber+1}
        </div>
        <div className={style.contentRight}>
          {categoryData.map((el, index) => {
            return <div key={index}>
              <div>{el.La}</div>
              <div>{el.Ma}</div>
              </div>
          })}
        </div>
      </div>
    </div>
  )
}
