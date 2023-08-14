import { atom } from 'recoil';

export interface categoryType {
  La: number;
  Ma: number;
}

export const cateogryState = atom<categoryType[][]>({
  key: 'category',
  default: [[]]
});



// 이게 맞나....
interface test {
  key: categoryType[]
}

export const cateogryState2 = atom<test[]>({
  key: 'category2',
  default: [
    {
      key: []
    }
  ]
});
