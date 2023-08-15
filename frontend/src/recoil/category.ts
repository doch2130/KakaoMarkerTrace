import { atom } from 'recoil';

export interface categoryDataType {
  La: number;
  Ma: number;
}

export interface categoryType {
  key: categoryDataType[]
}

export const cateogryState = atom<categoryType[]>({
  key: 'category',
  default: [
    {
      key: [
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
