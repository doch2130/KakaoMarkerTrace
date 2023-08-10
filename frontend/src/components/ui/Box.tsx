import style from './Box.module.css';

interface boxProps {
}

export default function Box(props:boxProps) {
  return (
    <div className={style.wrap}>
      <div className={style.content}>
        <div className={style.contentLeft}>
          Left
        </div>
        <div className={style.contentRight}>
          Right
        </div>
      </div>
    </div>
  )
}
