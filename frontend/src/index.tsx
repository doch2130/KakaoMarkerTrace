import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { RecoilRoot } from 'recoil';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

declare global {
  interface Window {
    kakao: any;
  }
}

root.render(
  <RecoilRoot>
    <App />
  </RecoilRoot>
);

