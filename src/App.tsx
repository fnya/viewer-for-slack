// import { Initialize } from './components/Initialize';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login } from './components/Login';
import { NotFound } from './components/NotFound';
import { Viewer } from './components/Viewer';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="viewer" element={<Viewer />} />
        <Route path="*" element={<NotFound />} />
        {/* <Route path="/initialize" element={<Initialize />} />
         */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
