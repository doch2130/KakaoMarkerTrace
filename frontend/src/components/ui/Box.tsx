import { categoryType } from '../../recoil/category';
import style from './Box.module.css';

interface boxProps {
  indexNumber: number;
  categoryData: categoryType[];
}

export default function Box(props:boxProps) {
  const { indexNumber, categoryData } = props;
  return (
    <div className={style.wrap}>
      <div className={style.content}>
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
