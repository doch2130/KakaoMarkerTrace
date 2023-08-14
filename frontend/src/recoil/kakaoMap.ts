import { atom } from 'recoil';

export interface KakaoMapType {
  La: number;
  Ma: number;
}

export interface KakaoSearchDataType {
  La: number;
  Ma: number;
}

export const kakaoMapState = atom<KakaoMapType[]>({
  key: 'map',
  default: [
    {
      La: 0,
      Ma: 0,
    }
  ]
});
