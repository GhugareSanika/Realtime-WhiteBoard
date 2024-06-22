
import React from 'react';
import ReactDOM from 'react-dom/client'; // Use the correct import for createRoot
import { BrowserRouter as Router } from 'react-router-dom';

import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'react-toastify/dist/ReactToastify.min.css';

const rootElement = document.getElementById('root');

// Check if the root element exists before rendering
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <Router>
        <App />
      </Router>
    </React.StrictMode>
  );
}
