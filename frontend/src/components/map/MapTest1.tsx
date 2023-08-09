import { useEffect, useRef, useState } from 'react'

const { naver } = window;

interface naverMapInterface {
  height: string;
  mapData: latlngInterface;
}

interface latlngInterface {
  x: number;
  y: number;
  _lat: number;
  _lng: number;
}

export default function MapTest1(props:naverMapInterface) {
  const [markerList, setMarkerList] = useState<latlngInterface[]>([{
    x: 0,
    y: 0,
    _lat: 0,
    _lng: 0
  }]);
  const [infoWindowList, setInfoWindowList] = useState([]);
  const mapElement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // map, naver null 값 체크
    if (!mapElement.current || !naver) return;

    // 지도 현재 위치 표시 (임시 지정 값)
    const location = new naver.maps.LatLng(props.mapData.y, props.mapData.x);
    // 지도 컨트롤러 옵션
    const mapOptions: naver.maps.MapOptions = {
      center: location,
      zoom: 15,
      zoomControl: true,
      zoomControlOptions: {
        style: naver.maps.ZoomControlStyle.SMALL,
        position: naver.maps.Position.TOP_RIGHT
      }
    };

    // 지도 출력
    const map = new naver.maps.Map(mapElement.current, mapOptions);

    // 마커 클릭 이벤트 발생 함수 등록
    naver.maps.Event.addListener(map, 'click', function(e) {
      // 지도 마커 이벤트 발생 후 처리
      // 초기 값 셋팅인 경우 새로운 값으로 재설정
      if(markerList.length === 1 && markerList[0].x === 0) {
        setMarkerList([e.coord]);
        return ;
      }
      // 2번째 마커부터는 기존 데이터랑 새로운 데이터 합치기
      setMarkerList((prev:latlngInterface[]) => {
        return [...prev, e.coord];
      })
    });

    // 마커 출력
    if(markerList.length === 1 && markerList[0].x === 0) {
      markerList.forEach((el) => {

      })
    }
    

  //   function showMarker(map, marker) {
  //     if (marker.setMap()) return;
  //     marker.setMap(map);
  //   }

  //   var marker = new naver.maps.Marker({
  //     map: map,
  //     position: position,
  //     icon: {
  //       url: ICON_SPRITE_IMAGE_URL,
  //       size: new naver.maps.Size(26, 36), // 이미지 크기
  //       origin: new naver.maps.Point(iconSpritePositionX, iconSpritePositionY), // 스프라이트 이미지에서 클리핑 위치
  //       anchor: new naver.maps.Point(13, 36), // 지도상 위치에서 이미지 위치의 offset
  //       scaledSize: new naver.maps.Size(395, 79)
  //     }
  // });

  }, [markerList, props.mapData.x, props.mapData.y]);

  console.log('markerList ', markerList);

  return (
    <div ref={mapElement} style={{ minHeight: props.height }} />
  )
}
