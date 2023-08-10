import { atom } from 'recoil';

export interface MapType {
  x: number,
  y: number,
  _lat: number,
  _lng: number,
}

export const mapState = atom<MapType[]>({
  key: 'map',
  default: [
    {
      x: 0,
      y: 0,
      _lat: 0,
      _lng: 0,
    }
  ]
});
