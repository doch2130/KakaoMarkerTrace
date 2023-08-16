import { useRef, useEffect, useState, useCallback } from 'react'
import { Map } from 'react-kakao-maps-sdk';
import { useRecoilState } from 'recoil';
import { MapType } from '../../recoil/naverMap';
import { cateogryState, categoryType, menuIndexState, menuIndexNumberType, categoryDataType } from '../../recoil/category';
// import { KakaoMapType, KakaoSearchDataType } from '../../recoil/kakaoMap';

const { kakao } = window;

interface kakaoMapInterface {
  height: string;
  mapData: MapType;
  searchAddressResult: categoryDataType;
  setSearchAddressResult: Function;
}

interface handleMapEventType {
  latLng: categoryDataType,
  point: { x: number, y: number}
}

export default function KakaoMapView(props:kakaoMapInterface) {
  const { mapData, searchAddressResult, setSearchAddressResult } = props;

  const [menuIndex, setMenuIndex] = useRecoilState<menuIndexNumberType>(menuIndexState);
  const [category, setCategory] = useRecoilState<categoryType[]>(cateogryState);

  const mapElement = useRef<HTMLDivElement>(null);
  const [mapView, setMapView] = useState<kakao.maps.Map>();

  // const [markerList, setMarkerList] = useState<categoryDataType[]>(category[menuIndex.index].key);
  const [markers, setMarkers] = useState<kakao.maps.Marker[]>([]);
  const [polylines, setPolylines] = useState<kakao.maps.Polyline[]>([]);
  // const [polyLineList, setPolyLineList] = useState<categoryDataType[]>(category[menuIndex.index].key);


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
      setSearchAddressResult({La: 0, Ma: 0 });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapView, searchAddressResult]);

  // 마커 추가 함수 (분리)
  const addMarker = useCallback((coord: categoryDataType, menuIndex: number) => {
    setCategory((prevCategory) => {
      // console.log('prevCategory[menuIndex.state].latlngArr ', prevCategory[menuIndex].latlngArr);
      const updatedCategory = prevCategory.map((categoryItem, index) => {
        // console.log('categoryItem ', categoryItem);
        if (index === menuIndex) {
          if(prevCategory[index].latlngArr.length >= 9) {
            alert('최대 9개까지 설정할 수 있습니다.');
            return categoryItem;
          } else if(prevCategory[index].latlngArr.length === 1 && prevCategory[index].latlngArr[0].La === 0 && prevCategory[index].latlngArr[0].Ma === 0) {
            return { 
              name: prevCategory[index].name,
              latlngArr: [coord]
            };
          } else {
            // console.log('coord ', coord);
            const updateMapData = [...prevCategory[index].latlngArr, coord];
            // console.log('updateMapData ', updateMapData);
            return { 
              name: prevCategory[index].name,
              latlngArr: updateMapData
            };
          }
        }
        return categoryItem;
      });
      // console.log('updatedCategory ', updatedCategory);
      return updatedCategory;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // 카카오 지도 마커 추가 함수 클릭 이벤트 등록 (분리)
  const handleMapClick = useCallback((e: handleMapEventType) => {
    // console.log('click');
    const coord = e.latLng;
    addMarker(coord, menuIndex.index);
    // addPolyLine(coord, menuIndex.index);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuIndex.index]);

  useEffect(() => {
    // 카카오 지도 마커 추가 함수 클릭 이벤트 등록
    if (mapView !== undefined) {
      // 이벤트 중첩을 막기 위한 삭제 후 재등록
      kakao.maps.event.removeListener(mapView, 'click', handleMapClick);
      kakao.maps.event.addListener(mapView, 'click', handleMapClick);
    }

    // 언마운트 시 이벤트 삭제
    return () => {
      if (mapView !== undefined) {
        kakao.maps.event.removeListener(mapView, 'click', handleMapClick);
      }
    };
  }, [handleMapClick, mapView]);

  useEffect(() => {
    if (mapView !== undefined) {
      // 기존 마커들 삭제
      markers.forEach(marker => {
        marker.setMap(null);
      });

      const newMarkers: kakao.maps.Marker[] = [];

      // 마커 출력
      if (category[menuIndex.index].latlngArr.length >= 1
        && category[menuIndex.index].latlngArr[0].La !== 0 && category[menuIndex.index].latlngArr[0].Ma) {
        category[menuIndex.index].latlngArr.forEach((el, index) => {

          // 마커 이미지 옵션
          const markerImage = new kakao.maps.MarkerImage(
            `./markerImage/defaultMarker${index+1}.png`,
            new kakao.maps.Size(30, 40),
            {offset: new kakao.maps.Point(15, 40)}
          )

          // 마커 출력
          const marker = new kakao.maps.Marker({
            // map: mapView,
            position: el,
            image: markerImage,
          });
          newMarkers.push(marker);
        });
      }
      
      // 새로운 마커들을 상태 업데이트로 설정
      setMarkers(newMarkers);

      // 새로운 마커들을 지도에 추가
      newMarkers.forEach(marker => {
        marker.setMap(mapView);
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, mapView, menuIndex.index]);


  // 라인 추가 및 설정
  useEffect(() => {
    if (mapView !== undefined) {
      // 기존 라인 삭제
      polylines.forEach(polyline => {
        polyline.setMap(null);
      });
      const newPolylines: kakao.maps.Polyline[] = [];
      // 라인 출력
      if (category[menuIndex.index].latlngArr.length >= 1
        && category[menuIndex.index].latlngArr[0].La !== 0 && category[menuIndex.index].latlngArr[0].Ma) {

          const polyline = new kakao.maps.Polyline({
            path: category[menuIndex.index].latlngArr, // 선을 구성하는 좌표배열 입니다
            // path: polylines, // 선을 구성하는 좌표배열 입니다
            strokeWeight: 5, // 선의 두께 입니다
            strokeColor: '#FF0000', // 선의 색깔입니다
            strokeOpacity: 0.7, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
            strokeStyle: 'solid' // 선의 스타일입니다
          });

          polyline.setMap(mapView);
          newPolylines.push(polyline);
          console.log('polyline ', polyline.getLength());
          // console.log('test ', calculateCoordinates(250, 45));
      }
      
      // 새로운 라인들을 상태 업데이트로 설정
      setPolylines(newPolylines);
      // console.log('newPolylines ', newPolylines);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, mapView, menuIndex.index]);

  // 도 각도를 라디안 각도로 변환하는 함수
  function degreesToRadians(degrees:number) {
    return degrees * (Math.PI / 180);
  }

  // 거리와 각도로 좌표를 계산하는 함수
  function calculateCoordinates(distance:number, angleInDegrees:number) {
    const angleInRadians = degreesToRadians(angleInDegrees);
    
    const x = distance * Math.cos(angleInRadians);
    const y = distance * Math.sin(angleInRadians);
    
    return { x, y };
  }


  return (
    <div ref={mapElement} style={{ minHeight: props.height }} />
  )
}
