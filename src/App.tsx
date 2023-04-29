import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Initialize } from './components/Initialize';
import { Login } from './components/Login';
import { NotFound } from './components/NotFound';
import { Viewer } from './components/layout/Viewer';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="viewer" element={<Viewer />} />
        <Route path="initialize" element={<Initialize />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
