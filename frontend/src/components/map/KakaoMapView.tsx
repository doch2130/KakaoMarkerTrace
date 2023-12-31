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
  manualAddMarkerValue: manualAddMarkerValue;
  setManualAddMarkerValue: Function;
}

interface manualAddMarkerValue {
  state: Boolean;
  distance: number;
  direction: number;
}

interface handleMapEventType {
  latLng: categoryDataType,
  point: { x: number, y: number}
}

export default function KakaoMapView(props:kakaoMapInterface) {
  const { mapData, searchAddressResult, setSearchAddressResult, manualAddMarkerValue, setManualAddMarkerValue } = props;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    // console.log('coord ', coord);
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

      if(category[menuIndex.index] !== undefined) {
        // 마커 출력
        if (category[menuIndex.index].latlngArr.length >= 1 && category[menuIndex.index].latlngArr[0].La !== 0 && category[menuIndex.index].latlngArr[0].Ma) {
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
      }

      
      // 새로운 마커들을 상태 업데이트로 설정
      setMarkers(newMarkers);

      // 새로운 마커들을 지도에 추가
      newMarkers.forEach(marker => {
        marker.setMap(mapView);
      });
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, mapView, menuIndex]);


  // 라인 추가 및 설정
  useEffect(() => {
    if (mapView !== undefined) {
      // 기존 라인 삭제
      polylines.forEach(polyline => {
        polyline.setMap(null);
      });
      const newPolylines: kakao.maps.Polyline[] = [];

      if(category[menuIndex.index] !== undefined) {
        // 라인 출력
        if (category[menuIndex.index].latlngArr.length >= 1 && category[menuIndex.index].latlngArr[0].La !== 0 && category[menuIndex.index].latlngArr[0].Ma) {

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
          // console.log('polyline ', polyline.getLength());
      }
      }

      // 새로운 라인들을 상태 업데이트로 설정
      setPolylines(newPolylines);
      // console.log('newPolylines ', newPolylines);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, mapView, menuIndex.index]);

  function degreesToRadians(degrees:number) {
    return degrees * (Math.PI / 180);
  }

  function calculateCoordinates(distance:number, angleInDegrees:number) {
      const angleInRadians = degreesToRadians(angleInDegrees);

      const x = distance * Math.cos(angleInRadians);
      const y = distance * Math.sin(angleInRadians);

      // x = lon, y = lat
      return { x, y };
  }

  function cartesianToGeodetic(x:number, y:number, originLatitude:number, originLongitude:number) {
      const a = 6378137.0; // GRS80의 장반경 (미터)
      const f = 1 / 298.257222101; // GRS80의 편평도

      const degToRad = Math.PI / 180.0;
      const lat1 = originLatitude * degToRad;

      const e2 = 2 * f - f * f;
      const rho = a * (1 - e2) / Math.pow(1 - e2 * Math.sin(lat1) * Math.sin(lat1), 1.5);
      const nu = a / Math.sqrt(1 - e2 * Math.sin(lat1) * Math.sin(lat1));

      const xRad = x / (nu * Math.cos(lat1));
      const yRad = y / (rho * Math.sin(lat1));

      const lat = originLatitude + yRad * (180.0 / Math.PI);
      const lon = originLongitude + xRad * (180.0 / Math.PI);

      return { latitude: lat, longitude: lon };
  }

  useEffect(() => {
    if (manualAddMarkerValue?.distance === undefined && manualAddMarkerValue?.direction === undefined) return ;

    if(manualAddMarkerValue.state === true &&
      category[menuIndex.index].latlngArr[0].La === 0 && category[menuIndex.index].latlngArr[0].Ma === 0) {
      alert('지도를 클륵해서 마커를 1개 설정해주세요!');
      setManualAddMarkerValue({
        state: false,
        distance: 0,
        direction: 0
      });
      return ;
    }

    if(manualAddMarkerValue.state === true && category[menuIndex.index].latlngArr.length >= 1 && category[menuIndex.index].latlngArr[0].La !== 0 && category[menuIndex.index].latlngArr[0].Ma !== 0) {
      // 거리와 각도를 사용하여 데카르트 좌표 계산
      const cartesianCoords = calculateCoordinates(manualAddMarkerValue?.distance, manualAddMarkerValue?.direction);
      const latlngArrLength = category[menuIndex.index].latlngArr.length - 1;
      // 데카르트 좌표를 위경도 좌표로 변환
      const result = cartesianToGeodetic(cartesianCoords.x, cartesianCoords.y, category[menuIndex.index].latlngArr[latlngArrLength].La, category[menuIndex.index].latlngArr[latlngArrLength].Ma);
      // const result = cartesianToGeodetic(cartesianCoords.x, cartesianCoords.y, category[menuIndex.index].latlngArr[latlngArrLength].Ma, category[menuIndex.index].latlngArr[latlngArrLength].La);
      // console.log("2번째 좌표의 위도:", result.latitude, "경도:", result.longitude);

      setManualAddMarkerValue({
        state: false,
        distance: 0,
        direction: 0
      });
      const coord:categoryDataType =  new kakao.maps.LatLng(result.longitude, result.latitude);
      // console.log('coord2 ', coord);
      addMarker(coord, menuIndex.index);
      return ;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manualAddMarkerValue]);

  return (
    <div ref={mapElement} style={{ minHeight: props.height }} />
  )
}
