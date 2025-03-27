import React from 'react';
import ReactDOM from "react-dom/client";
import { Provider} from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import { store } from "./redux/store";
import AppLayout from './components/AppLayout';

const App = () => {
  return (
    <React.StrictMode>
      <Provider store={store}>
        <AppLayout />
      </Provider>
    </React.StrictMode>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
