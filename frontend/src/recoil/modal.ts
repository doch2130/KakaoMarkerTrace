import { atom } from "recoil";

export interface ModalType {
  isOpen: boolean;
  backDrop: boolean;
  content: JSX.Element | string;
  size: string;
  callback?: () => any;
}

export const modalState = atom<ModalType>({
  key: "modalState",

  default: {
    isOpen: false,
    backDrop: false,
    size: 'lg',
    content: '',
  }
});
