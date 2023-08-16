import { MouseEventHandler } from 'react';
import ReactDOM from 'react-dom';
import { useModal } from '../../hooks/useModal';
import style from './Modal.module.css';

const Backdrop = (props:any) => {
  return <>
    {props.backDropEvent && <div className={style.backdrop} onClick={props.onClose as MouseEventHandler} />}
    {!props.backDropEvent && <div className={style.backdrop} />}
  </>;
};

const ModalOverlay = (props:any) => {
  const { modalDataState } = props;

  return (
    <div className={modalDataState.size === 'lg' ? `${style.modal} ${style.lgModal}` :
    modalDataState.size === 'md' ? `${style.modal} ${style.mdModal}`  : `${style.modal} ${style.smModal}`} >
      <div className={style.wrapClose} onClick={props.onClose as MouseEventHandler}>
        <img src={'./icon/cancle.png'} alt='closeBtn' />
      </div>
      <div className={style.content}>{modalDataState.content}</div>
    </div>
  );
};

const modalElement = document.getElementById('modal') as HTMLDivElement;

function Modal() {
  const { modalDataState, closeModal } = useModal();
  return (
    <>
    {modalDataState.isOpen && (
      <>
        {ReactDOM.createPortal(
          <Backdrop onClose={closeModal} backDropEvent={modalDataState.backDrop} />,
          modalElement
        )}
        {ReactDOM.createPortal(
          <ModalOverlay onClose={closeModal} modalDataState={modalDataState} />,
          modalElement
        )}
      </>
    )}
    </>
  );
};

export default Modal;
