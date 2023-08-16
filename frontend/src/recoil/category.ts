import { atom } from 'recoil';

export interface categoryDataType {
  La: number;
  Ma: number;
}

export interface categoryType {
  name: string;
  latlngArr: categoryDataType[]
}

export const cateogryState = atom<categoryType[]>({
  key: 'category',
  default: [
    {
      name: '새 카테고리1',
      latlngArr: [
        {La:0, Ma:0},
      ]
    }
  ]
});

export interface menuIndexNumberType {
  index: number;
}

export const menuIndexState = atom<menuIndexNumberType>({
  key: 'menuIndexNumber',
  default: {
    index: 0
  }
});
