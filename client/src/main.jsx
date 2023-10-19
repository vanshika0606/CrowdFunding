import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { ChainId, ThirdwebProvider } from '@thirdweb-dev/react';
import './index.css';
import App from './App';
import { StateContextProvider } from "./context/index.jsx";

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <ThirdwebProvider activeChain={ChainId.Mumbai} clientId={import.meta.env.VITE_TEMPLATE_CLIENT_ID}> 
    <Router>
      <StateContextProvider >
        <App />
      </StateContextProvider>
    </Router>
  </ThirdwebProvider> 
)