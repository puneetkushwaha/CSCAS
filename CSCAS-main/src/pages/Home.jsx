import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Careers from '../sections/Strategies';
import ScrollingBanner from '../sections/ScrollingBanner';
import Enterprise from '../sections/NextGenDefense';
import Certifications from '../sections/Services';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import WhyChoose from '../sections/Defense';
import PartnerSection from '../sections/PartnerSection';
import AcademicSection from '../sections/AcademicSection';
import ExamAlertPopup from '../components/ExamAlertPopup';

function Home() {
    const { user } = useAuth();
    const navigate = useNavigate();


    return (
        <div className="relative">
            <Navbar />
            <Hero />
            <ExamAlertPopup />
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

export default Home;
