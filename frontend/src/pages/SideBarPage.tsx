import { useRef } from 'react';
import Box from '../components/ui/Box';
import style from './SideBarPage.module.css';

interface sideBarPageProps {
  setSearchAddressResult: Function;
}

export default function SideBarPage(props:sideBarPageProps) {
  const searchInput = useRef<HTMLInputElement>(null);
  
  const searchAddressHandler = (e:React.KeyboardEvent<HTMLInputElement>) => {
    if(!searchInput.current) {
      return ;
    }

    if(e.key === 'Enter') {
      searchAddressToCoordinate(searchInput.current.value);
    }
    return ;
  }

  function searchAddressToCoordinate(address:string) {
    const { naver } = window;
    naver.maps.Service.geocode({
        query: address
    }, function(status, response) {
        if (status === naver.maps.Service.Status.ERROR) {
            return alert('Something Wrong!');
        }

        if (response.v2.meta.totalCount === 0) {
            return alert('totalCount' + response.v2.meta.totalCount);
        }

        const item = response.v2.addresses[0];
        const point = new naver.maps.Point(Number(item.x), Number(item.y));

        props.setSearchAddressResult(point);
    });
  }
  
  return (
    <div>
      <div className={style.header}>
        <input ref={searchInput} type='text' placeholder='지역 검색' onKeyDown={searchAddressHandler} />
        <button type='button'>검색</button>
      </div>
      <div className={style.body}>
        <Box />
      </div>
    </div>
  )
}
