import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { ChainId, ThirdwebProvider } from '@thirdweb-dev/react';
import './index.css';
import App from './App';
import { StateContextProvider } from "./context/index.jsx";

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <ThirdwebProvider desiredChainId={ChainId.Mumbai}> 
    <Router>
      <StateContextProvider >
        <App />
      </StateContextProvider>
    </Router>
  </ThirdwebProvider> 
)