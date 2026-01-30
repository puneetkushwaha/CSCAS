import Navbar from './components/Navbar';
import Careers from './sections/Strategies';
import ScrollingBanner from './sections/ScrollingBanner';
import Enterprise from './sections/NextGenDefense';
import Certifications from './sections/Services';
import Footer from './components/Footer';
import Hero from './components/Hero';
import WhyChoose from './sections/Defense';
import PartnerSection from './sections/PartnerSection';
import AcademicSection from './sections/AcademicSection';

function App() {
  return (
    <div className="relative">
      <Navbar />
      <Hero />
      <main>
        <WhyChoose />
        <Certifications />
        <Careers />
        <ScrollingBanner />
        <Enterprise />
        <PartnerSection />
        <AcademicSection />
        <Footer />
      </main>
    </div>
  );
}

export default App;