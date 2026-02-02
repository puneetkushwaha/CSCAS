import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';

import Careers from './pages/Careers';
import CareersPlus from './pages/CareersPlus';
import TechCareers from './pages/TechCareers';
import IndustrySectors from './pages/IndustrySectors';
import PartnersEcosystem from './pages/PartnersEcosystem';
import Academic from './pages/Academic';
import AcademicPrograms from './pages/AcademicPrograms';
import Resources from './pages/Resources';
import Certifications from './pages/Certifications';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/careers-plus" element={<CareersPlus />} />
        <Route path="/tech-careers" element={<TechCareers />} />
        <Route path="/industry-sectors" element={<IndustrySectors />} />
        <Route path="/partners" element={<PartnersEcosystem />} />
        <Route path="/academic" element={<Academic />} />
        <Route path="/academic-catalog" element={<AcademicPrograms />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/certifications" element={<Certifications />} />
      </Routes>
    </Router>
  );
}

export default App;