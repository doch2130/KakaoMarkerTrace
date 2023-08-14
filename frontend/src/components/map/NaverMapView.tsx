import { useCallback, useEffect, useRef, useState } from 'react'
import { MapType } from '../../recoil/naverMap';

const { naver } = window;

interface naverMapInterface {
  height: string;
  mapData: MapType;
  searchAddressResult: {
    x: number;
    y: number;
  };
  setSearchAddressResult: Function;
}

const mapDataInit:MapType = {
  x: 0,
  y: 0,
  _lat: 0,
  _lng: 0
}
interface handleMapEventType {
  coord: MapType;
}

export default function NaverMapView(props:naverMapInterface) {
  const { mapData, searchAddressResult, setSearchAddressResult } = props;
  const mapElement = useRef<HTMLDivElement>(null);
  const [mapView, setMapView] = useState<naver.maps.Map>();
  
  const [markerList, setMarkerList] = useState<MapType[]>([mapDataInit]);
  const [polyLineList, setPolyLineList] = useState<MapType[]>([mapDataInit]);

  useEffect(() => {
    // map, naver null 값 체크
    if (!mapElement.current || !naver) return;
    // 지도 현재 위치 표시 (임시 지정 값)
    const location = new naver.maps.LatLng(mapData.y, mapData.x);
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
    setMapView(map);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if(mapView !== undefined && searchAddressResult.x !== 0 && searchAddressResult.y !== 0) {
      // mapView.setCenter(searchAddressResult);
      setSearchAddressResult(() => {
        mapView.setCenter(searchAddressResult);
        return { x: 0, y: 0}
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapView, searchAddressResult]);

  useEffect(() => {
    if(mapView !== undefined) {
      // 마커 줄 옵션
      new naver.maps.Polyline({
        map: mapView,
        path: polyLineList[0].x === 0 && polyLineList[0].y === 0 ? [] : polyLineList,
        strokeColor: '#FF0000',
        strokeWeight: 3
      });
    }
  }, [mapView, polyLineList])

  // 마커 추가 함수 (분리)
  const addMarker = useCallback((coord: MapType) => {
    setMarkerList((prevMarkerList) => {
      if (prevMarkerList.length >= 9) {
        console.log('최대 9개까지 설정할 수 있습니다.');
        return [...prevMarkerList];
      } else if (prevMarkerList.length === 1 && prevMarkerList[0].x === 0 && prevMarkerList[0].y === 0) {
        return [coord];
      } else {
        return [...prevMarkerList, coord];
      }
    });
  }, []);

  // 마커 줄 연결 함수 (분리)
  const addPolyLine = useCallback((coord: MapType) => {
    setPolyLineList((prevPolyLineList) => {
      if (prevPolyLineList.length >= 9) {
        console.log('라인 최대 9개까지 설정할 수 있습니다.');
        return [...prevPolyLineList];
      } else if(prevPolyLineList.length === 1 && prevPolyLineList[0].x === 0 && prevPolyLineList[0].y === 0) {
        return [coord];
      } else {
        return [...prevPolyLineList, coord];
      }
    });
  }, []);

  useEffect(() => {
    // 네이버 지도 마커 추가 함수 클릭 이벤트 등록
    const handleMapClick = (e: handleMapEventType) => {
      addMarker(e.coord);
      addPolyLine(e.coord);
    };

    if (mapView !== undefined) {
      naver.maps.Event.addListener(mapView, 'click', handleMapClick);
    }

    // 지도가 기본 컴포넌트로 설정되어 있고, 언마운트가 될 일이 없어서 return은 등록하지 않음
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapView]);

  useEffect(() => {
    if (mapView !== undefined) {
      // 마커 출력
      if(markerList.length >= 1 && markerList[0].x !== 0) {
        markerList.forEach((el, index) => {
          // 마커 출력
          // const marker = new naver.maps.Marker({
          new naver.maps.Marker({
            map: mapView,
            position: el,
            icon: {
              url: `./markerImage/defaultMarker${index+1}.png`,
              size: new naver.maps.Size(30, 40),
              scaledSize: new naver.maps.Size(30, 40),
              origin: new naver.maps.Point(0, 0),
              anchor: new naver.maps.Point(15, 38)
            }
          });
        });
      }
    }
  }, [mapView, markerList]);

  console.log('setMarkerList ', markerList);
  console.log('polyLineList ', polyLineList);

  return (
    <div ref={mapElement} style={{ minHeight: props.height }} />
  )
}
