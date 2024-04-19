import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './style.css';
import './index.css';
import { enableMocking } from './mocks/enableMocking.ts';

enableMocking().then(() => {
	ReactDOM.createRoot(document.getElementById('root')!).render(
		<React.StrictMode>
			<App />
		</React.StrictMode>,
	);
});
