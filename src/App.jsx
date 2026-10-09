import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import Home from './pages/Home.jsx'
import PostFood from './pages/PostFood.jsx'
import FindFood from './pages/FindFood.jsx'
import DonorDashboard from './pages/DonorDashboard.jsx'
import Auth from './pages/Auth.jsx'
import About from './pages/About.jsx'
import Features from './pages/Features.jsx'
import NGO from './pages/NGO.jsx'
import NgoRegister from './pages/NgoRegister.jsx'
import NgoDashboard from './pages/NgoDashboard.jsx'
import Donate from './pages/Donate.jsx'
import Legal from './pages/Legal.jsx'
import Feedback from './pages/Feedback.jsx'
import CookieBanner from './components/CookieBanner.jsx'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post" element={<PostFood />} />
        <Route path="/find" element={<FindFood />} />
        <Route path="/dashboard" element={<DonorDashboard />} />
        <Route path="/ngo/dashboard" element={<NgoDashboard />} />
        <Route path="/ngo/register" element={<NgoRegister />} />
        <Route path="/map" element={<Navigate to="/find" replace />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/about" element={<About />} />
        <Route path="/features" element={<Features />} />
        <Route path="/ngo" element={<NGO />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/legal" element={<Legal />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="*" element={<Home />} />
      </Routes>
      <CookieBanner />
    </BrowserRouter>
  )
}
