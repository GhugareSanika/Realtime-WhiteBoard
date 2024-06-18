// import * as React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './App';
// import './index.css'
// import "bootstrap/dist/css/bootstrap.min.css"
// import "bootstrap/dist/js/bootstrap.bundle.min"
// import { BrowserRouter as Router} from 'react-router-dom';
// import "react-toastify/dist/ReactToastify.min.css"

// const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);


// root.render(
//   <Router>
//     <App/>
//   </Router>,
//   document.getElementById("root")
// );

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { BrowserRouter as Router } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.min.css';

// Assuming you are using ReactDOM from 'react-dom/client'
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
