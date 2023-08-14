import { useRef, useEffect, useState, useCallback } from 'react'
import { MapType } from '../../recoil/naverMap';
import { KakaoMapType, KakaoSearchDataType } from '../../recoil/kakaoMap';
import { Polyline } from 'react-kakao-maps-sdk';

const { kakao } = window;

interface kakaoMapInterface {
  height: string;
  mapData: MapType;
  // searchAddressResult: any;
  searchAddressResult: KakaoSearchDataType;
  setSearchAddressResult: Function;
}

const mapDataInit:KakaoMapType = {
  La: 0,
  Ma: 0,
}
interface handleMapEventType {
  latLng: KakaoMapType,
  point: { x: number, y: number}
}

export default function KakaoMapView(props:kakaoMapInterface) {
  const { mapData, searchAddressResult, setSearchAddressResult } = props;

  const mapElement = useRef<HTMLDivElement>(null);
  const [mapView, setMapView] = useState<kakao.maps.Map>();

  const [markerList, setMarkerList] = useState<KakaoMapType[]>([mapDataInit]);
  const [polyLineList, setPolyLineList] = useState<KakaoMapType[]>([mapDataInit]);

  useEffect(() => {
    // map null 값 체크
    if(!mapElement.current) return ;

    // 지도 옵션 설정
    const options = {
      center: new kakao.maps.LatLng(mapData.y, mapData.x),
      level: 3
    };

    const map = new kakao.maps.Map(mapElement.current, options);

    // 일반 지도와 스카이뷰로 지도 타입을 전환할 수 있는 지도타입 컨트롤을 생성합니다
    const mapTypeControl = new kakao.maps.MapTypeControl();

    // 지도에 컨트롤을 추가해야 지도위에 표시됩니다
    // kakao.maps.ControlPosition은 컨트롤이 표시될 위치를 정의하는데 TOPRIGHT는 오른쪽 위를 의미합니다
    map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

    // 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
    const zoomControl = new kakao.maps.ZoomControl();
    map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

    setMapView(map);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // 검색으로 지도 이동하기
  useEffect(() => {
    if(mapView !== undefined && searchAddressResult.La !== 0 && searchAddressResult.Ma !== 0) {
      // console.log('searchAddressResult ', searchAddressResult);
      // 지도 위치 설정에서는 반대로 값 입력
      const moveLatLon = new kakao.maps.LatLng(searchAddressResult.Ma, searchAddressResult.La);
      mapView.setCenter(moveLatLon);
      setSearchAddressResult({
        La: 0,
        Ma: 0,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapView, searchAddressResult]);

  // 마커 추가 함수 (분리)
  const addMarker = useCallback((coord: KakaoMapType) => {
    setMarkerList((prevMarkerList) => {
      if (prevMarkerList.length >= 9) {
        // console.log('최대 9개까지 설정할 수 있습니다.');
        alert('최대 9개까지 설정할 수 있습니다.')
        return [...prevMarkerList];
      } else if (prevMarkerList.length === 1 && prevMarkerList[0].La === 0 && prevMarkerList[0].Ma === 0) {
        return [coord];
      } else {
        return [...prevMarkerList, coord];
      }
    });
  }, []);
  
    // 마커 줄 연결 함수 (분리)
    const addPolyLine = useCallback((coord: KakaoMapType) => {
      setPolyLineList((prevPolyLineList) => {
        if (prevPolyLineList.length >= 9) {
          // console.log('라인 최대 9개까지 설정할 수 있습니다.');
          return [...prevPolyLineList];
        } else if(prevPolyLineList.length === 1 && prevPolyLineList[0].La === 0 && prevPolyLineList[0].Ma === 0) {
          return [coord];
        } else {
          return [...prevPolyLineList, coord];
        }
      });
    }, []);

  useEffect(() => {
    // 카카오 지도 마커 추가 함수 클릭 이벤트 등록
    const handleMapClick = (e: handleMapEventType) => {
      const coord = e.latLng;
      addMarker(coord);
      addPolyLine(coord);
    };

    if (mapView !== undefined) {
      kakao.maps.event.addListener(mapView, 'click', handleMapClick);
    }

    // 지도가 기본 컴포넌트로 설정되어 있고, 언마운트가 될 일이 없어서 return은 등록하지 않음
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapView]);

  useEffect(() => {
    if (mapView !== undefined) {
      // 마커 출력
      if(markerList.length >= 1 && markerList[0].La !== 0 && markerList[0].Ma) {
        markerList.forEach((el, index) => {

          // 마커 이미지 옵션
          const markerImage = new kakao.maps.MarkerImage(
            `./markerImage/defaultMarker${index+1}.png`,
            new kakao.maps.Size(30, 40),
            {offset: new kakao.maps.Point(15, 40)}
          )

          // 마커 출력
          // const marker = new kakao.maps.Marker({
          new kakao.maps.Marker({
            map: mapView,
            position: el,
            image: markerImage,
          });
        });
      }
    }
  }, [mapView, markerList]);

  // console.log('setMarkerList ', markerList);
  // console.log('polyLineList ', polyLineList);


  useEffect(() => {
    if(mapView !== undefined) {
      const polyline = new kakao.maps.Polyline({
        // path: linePath, // 선을 구성하는 좌표배열 입니다
        path: polyLineList[0].La === 0 && polyLineList[0].Ma === 0 ? [] : polyLineList,
        // 선을 구성하는 좌표배열 입니다
        strokeWeight: 5, // 선의 두께 입니다
        strokeColor: '#FF0000', // 선의 색깔입니다
        strokeOpacity: 0.7, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
        strokeStyle: 'solid' // 선의 스타일입니다
      });

      polyline.setMap(mapView);
    }
  }, [mapView, polyLineList]);

  return (
    <div ref={mapElement} style={{ minHeight: props.height }} />
  )
}
