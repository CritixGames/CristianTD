import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AdMob } from '@capacitor-community/admob';
import App from './App.tsx';
import './index.css';

const initializeAdMob = async () => {
    try {
        await AdMob.initialize({
            initializeForTesting: true,
        });
    } catch (error) {
        console.error('AdMob initialization failed:', error);
    }
};

initializeAdMob();

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>
);