import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';

import Careers from './pages/Careers';
import CareersPlus from './pages/CareersPlus';
import PartnersEcosystem from './pages/PartnersEcosystem';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/careers-plus" element={<CareersPlus />} />
        <Route path="/partners" element={<PartnersEcosystem />} />
      </Routes>
    </Router>
  );
}

export default App;