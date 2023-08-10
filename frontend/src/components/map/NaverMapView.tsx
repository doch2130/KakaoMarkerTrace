/* eslint-disable react-hooks/exhaustive-deps */
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

const mapDataInit:latlngInterface = {
  x: 0,
  y: 0,
  _lat: 0,
  _lng: 0
}

export default function NaverMapView(props:naverMapInterface) {
  const [markerList, setMarkerList] = useState<latlngInterface[]>([mapDataInit]);

  const [infoWindowList, setInfoWindowList] = useState<naver.maps.InfoWindow[]>([]);

  const [polyLineList, setPolyLineList] = useState<latlngInterface[]>([mapDataInit]);

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

    // 지도 줄 설정
    new naver.maps.Polyline({
      map: map,
      path: polyLineList[0].x === 0 ? [] : polyLineList,
      strokeColor: '#13121a',
      strokeWeight: 2
    });

    // 마커 클릭 이벤트 발생 함수 등록
    naver.maps.Event.addListener(map, 'click', function(e) {
      // 마커 제한 개수 설정 (최대 5개)
      if(markerList.length >= 5) {
        console.log('최대 5개까지 설정할 수 있습니다.');
        return ;
      }

      // 마커 줄 연결 설정
      if(polyLineList.length === 1 && polyLineList[0].x === 0) {
        setPolyLineList([e.coord]);
      } else {
        setPolyLineList((prev:latlngInterface[]) => {
          return [...prev, e.coord];
        });
      }

      // 위경도를 주소로 변환 함수 호출
      searchCoordinateToAddress(e.coord);

      // 초기 값 셋팅인 경우 새로운 값으로 재설정
      if(markerList.length === 1 && markerList[0].x === 0) {
        setMarkerList([e.coord]);
        // setInfoWindowList([infoWindowAddress]);
        return ;
      }
      // 2번째 마커부터는 기존 데이터랑 새로운 데이터 합치기
      setMarkerList((prev:latlngInterface[]) => {
        return [...prev, e.coord];
      });
    });

    // 마커 출력
    if(markerList.length >= 1 && markerList[0].x !== 0) {
      markerList.forEach((el, index) => {
        // 마커 출력
        const marker = new naver.maps.Marker({
          map: map,
          position: el,
          icon: {
            url: `./markerImage/defaultMarker${index+1}.png`,
            size: new naver.maps.Size(30, 40),
            scaledSize: new naver.maps.Size(30, 40),
            origin: new naver.maps.Point(0, 0),
            anchor: new naver.maps.Point(15, 38)
          }
        });

        // 마커에 주소 표시 이벤트 설정
        naver.maps.Event.addListener(marker, 'click', getClickHandler(index, marker));
      });
    }

    // 해당 마커의 인덱스를 markerIndex라는 클로저 변수로 저장하는 이벤트 핸들러를 반환합니다.
    function getClickHandler(markerIndex:number, marker:naver.maps.Marker) {
      return function() {
          const infoWindow = infoWindowList[markerIndex];

          if (infoWindow.getMap()) {
              infoWindow.close();
          } else {
              infoWindow.open(map, marker);
          }
      }
    }
    
  }, [markerList, props.mapData.x, props.mapData.y, searchCoordinateToAddress]);




  console.log('markerList ', markerList);
  console.log('infoWindoList ', infoWindowList);







  
  // 주소 정리하는 함수
  function makeAddress(item:any) {
    if (!item) return;

    const name = item.name,
        region = item.region,
        land = item.land,
        isRoadAddress = name === 'roadaddr';

    let sido = '', sigugun = '', dongmyun = '', ri = '', rest = '';

    if (hasArea(region.area1)) {
        sido = region.area1.name;
        // setValueHandler('mateBoardAddress1', sido);
    }

    if (hasArea(region.area2)) {
        sigugun = region.area2.name;
        // setValueHandler('mateBoardAddress2', sigugun);
    }

    if (hasArea(region.area3)) {
        dongmyun = region.area3.name;
        // setValueHandler('mateBoardAddress3', dongmyun);
    }

    if (hasArea(region.area4)) {
        ri = region.area4.name;
    }

    if (land) {
        if (hasData(land.number1)) {
            if (hasData(land.type) && land.type === '2') {
                rest += '산';
            }

            rest += land.number1;

            if (hasData(land.number2)) {
                rest += ('-' + land.number2);
            }

            if( hasData(land.type) && land.type === '1') {
              // setValueHandler('mateBoardAddress4', rest);
            }
        }

        if (isRoadAddress === true) {
            if (checkLastString(dongmyun, '면')) {
                ri = land.name;
            } else {
                dongmyun = land.name;
                ri = '';
            }

            if (hasAddition(land.addition0)) {
                rest += ' ' + land.addition0.value;
            }
        }
    }

    return [sido, sigugun, dongmyun, ri, rest].join(' ');
  }

  function hasArea(area:any) {
    return !!(area && area.name && area.name !== '');
  }
  
  function hasData(data:string) {
      return !!(data && data !== '');
  }
  
  function checkLastString (word:string, lastString:string) {
      return new RegExp(lastString + '$').test(word);
  }
  
  function hasAddition (addition:any) {
      return !!(addition && addition.value);
  }

  // 위경도 주소 변환 함수
  function searchCoordinateToAddress(latlng:latlngInterface) {
    // console.log('latlng ', latlng);
    naver.maps.Service.reverseGeocode({
        coords: latlng,
        orders: [
            naver.maps.Service.OrderType.ADDR,
            naver.maps.Service.OrderType.ROAD_ADDR
        ].join(',')
    }, function(status, response) {
        if (status === naver.maps.Service.Status.ERROR) {
            return alert('Something Wrong!');
        }

        let items = response.v2.results,
            address = '',
            htmlAddresses = [];

        for (let i=0, ii=items.length, item, addrType; i<ii; i++) {
            item = items[i];
            address = makeAddress(item) || '';
            addrType = item.name === 'roadaddr' ? '[도로명 주소]' : '[지번 주소]';

            htmlAddresses.push((i+1) +'. '+ addrType +' '+ address);

            // if(addrType === '[지번 주소]') {
            //   setValueHandler('address', address.trim().replace(/ +/g, " "));
            //   setValueHandler('mateBoardLng', latlng._lng);
            //   setValueHandler('mateBoardLat', latlng._lat);
            // }
        }

        // 마커 설명 옵션
        const InfoWindowOptions: naver.maps.InfoWindowOptions = {
          content: '',
          maxWidth: 300,
          borderWidth: 2,
          anchorSkew: true,
        }

        // 마커 설명 옵션 적용
        const infoWindow = new naver.maps.InfoWindow(InfoWindowOptions);
        infoWindow.setContent([
            '<div style="padding:5px;min-width:200px;line-height:150%;font-size: 12px;">',
            htmlAddresses.join('<br />'),
            '</div>'
        ].join('\n'));

        console.log('infoWindow ', infoWindow);
        console.log('infoWindowList length ', infoWindowList.length);
        if(!infoWindowList[0]) {
          console.log('infoWindowList 1');
          setInfoWindowList([infoWindow]);
        } else {
          console.log('infoWindowList 2');
          setInfoWindowList([...infoWindowList, infoWindow]);
        }
    });
  }

  return (
    <div ref={mapElement} style={{ minHeight: props.height }} />
  )
}
