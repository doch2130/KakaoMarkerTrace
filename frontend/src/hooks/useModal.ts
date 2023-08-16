import { useCallback } from "react";
import { useRecoilState } from "recoil";
import { modalState } from "../recoil/modal";

type OpenModalType = {
  backDrop: boolean;
  content: JSX.Element | string;
  size: string;
  callback?: () => any;
};

export const useModal = () => {
  const [modalDataState, setModalDataState] = useRecoilState(modalState);
  const bodyElement = document.querySelector('body') as HTMLBodyElement;

  const closeModal = useCallback(() =>
    setModalDataState((prev:any) => {
      bodyElement.style.overflow = 'auto';
      return { ...prev, isOpen: false };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }), [setModalDataState]
  );

  const openModal = useCallback(({ backDrop, content, size, callback }: OpenModalType) => 
    setModalDataState(() => {
      bodyElement.style.overflow = 'hidden';
      return {
        isOpen: true,
        backDrop: backDrop,
        content: content,
        size: size,
        callback: callback
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }), [setModalDataState]
  );

  return { modalDataState, closeModal, openModal };
};
