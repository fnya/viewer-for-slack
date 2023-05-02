import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Index } from './components/Index';
import { Initialize } from './components/Initialize';
import { InitializeUser } from './components/InitializeUser';
import { Login } from './components/Login';
import { Viewer } from './components/layout/Viewer';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="initialize" element={<Initialize />} />
        <Route path="initializeUser" element={<InitializeUser />} />
        <Route path="login" element={<Login />} />
        <Route path="viewer" element={<Viewer />} />
        <Route path="*" element={<Index />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
