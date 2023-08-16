import { useRef, useState } from 'react';
import { categoryType } from '../../recoil/category';
import style from './Box.module.css';

interface boxProps {
  indexNumber: number;
  categoryKey: categoryType;
  setCateogryKey: Function;
  sideIndexNumber?: number;
  setSideIndexNumber?: Function;
}

export default function Box(props:boxProps) {
  const { indexNumber, categoryKey, setCateogryKey, sideIndexNumber, setSideIndexNumber } = props;

  const [nameChangeState, setNameChangeState] = useState<Boolean>(false);
  const nameChangeInput = useRef<HTMLInputElement>(null);

  const menuChangeHandler = ():void => {
    // console.log('indexNumber ', indexNumber);
    // console.log('sideIndexNumber ', sideIndexNumber);
    if(setSideIndexNumber !== undefined) {
      setSideIndexNumber({ index: indexNumber });
    }
    return ;
  }

  // 이름 변경 활성화 함수
  const menuNameChangeActiveHandler = (event: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    event.stopPropagation();
    // console.log('menu Name Change Active Handler');
    setNameChangeState(true);
    return ;
  }

  const menuNameChangeUnactiveHandler = (event: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    event.stopPropagation();
    setNameChangeState(false);
    return ;
  }

  // 이름 변경 적용 함수
  const menuNameChangeHandler = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();

    if(!nameChangeInput?.current) return ;

    const updateName = nameChangeInput?.current.value.trim();
    if(updateName === '') {
      alert('값을 입력해주세요');
      return ;
    }

    setCateogryKey((prevCateogryKey:any) => {
      // console.log('prevCateogryKey ', prevCateogryKey);
      const updatedCateory = prevCateogryKey.map((el:categoryType, index:number) => {
        if(index === indexNumber) {
          const updateData = {
            name: updateName,
            latlngArr: el.latlngArr
          }
          return updateData;
        }
        return el;
      });
      return updatedCateory;
    });
    setNameChangeState(false);
    return ;
  }

  // 메뉴 삭제 함수
  const menuDeleteHandler = (event: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    event.stopPropagation();
    // console.log('delete');
    if(window.confirm('해당 카테고리를 삭제하시겠습니까?')) {
      setCateogryKey((prevCateogryKey:any) => {
        const updatedCategory = prevCateogryKey.filter((el:categoryType, index:number) => index !== indexNumber);
        // console.log('updatedCategory ', updatedCategory);
        if(updatedCategory.length === 0) {
          return [{name: '새 카테고리1', latlngArr: [{La: 0, Ma: 0}]}];
        }
        return updatedCategory;
      });
    }
    return ;
  }

  return (
    <div className={indexNumber === sideIndexNumber ? `${style.wrap} ${style.active}` : style.wrap}>
      <div className={style.content} onClick={menuChangeHandler}>
        <div className={style.contentLeft}>
          {indexNumber+1}
        </div>
        <div className={style.contentCenter}>
          <div className={style.contentName}>
            {nameChangeState ? 
            <div>
            <input type='text' ref={nameChangeInput} defaultValue={categoryKey.name} ></input><button type='button' onClick={menuNameChangeHandler}>변경</button>
            </div> : categoryKey.name}
          </div>
        </div>
        <div className={style.contentRight}>
          {nameChangeState ?
          <img src={'/icon/cancle.png'} alt='cancle' onClick={menuNameChangeUnactiveHandler}></img> :
          <img src={'./icon/pencil.png'} alt='modify' onClick={menuNameChangeActiveHandler} />}
          <img src={'./icon/trash.png'} alt='empty' onClick={menuDeleteHandler} />
        </div>
      </div>
    </div>
  )
}
