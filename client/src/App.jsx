import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Landing from './pages/Landing.jsx';
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import Dashboard from './pages/dashboard/Dashboard.jsx';
import Freelancers from './pages/Freelancers.jsx';
import FreelancerDetail from './pages/FreelancerDetail.jsx';
import Projects from './pages/Projects.jsx';
import ProjectDetail from './pages/ProjectDetail.jsx';
import Hiring from './pages/Hiring.jsx';
import Contracts from './pages/Contracts.jsx';
import Profile from './pages/Profile.jsx';
import Notifications from './pages/Notifications.jsx';
import Saved from './pages/Saved.jsx';
import Messages from './pages/Messages.jsx';
function OwnerOnly({children}) { const {user}=useAuth(); return user?.role==='BUSINESS_OWNER'?children:<Navigate to="/projects" replace/>; }
function NotFound(){return <div className="not-found"><div className="brand"><span className="brand-mark">✳</span><span>hirely<span className="brand-period">.</span></span></div><div className="eyebrow">404 · WRONG TURN</div><h1>This page is taking a different path.</h1><p>Let's get you back to the good work.</p><a className="btn btn-dark" href="/">Back to Hirely</a></div>}
function AppRoutes(){return <Routes><Route path="/" element={<Landing/>}/><Route path="/login" element={<Login/>}/><Route path="/register" element={<Register/>}/><Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/><Route path="/freelancers" element={<ProtectedRoute><OwnerOnly><Freelancers/></OwnerOnly></ProtectedRoute>}/><Route path="/freelancers/:id" element={<ProtectedRoute><OwnerOnly><FreelancerDetail/></OwnerOnly></ProtectedRoute>}/><Route path="/projects" element={<ProtectedRoute><Projects/></ProtectedRoute>}/><Route path="/projects/new" element={<ProtectedRoute><OwnerOnly><Projects/></OwnerOnly></ProtectedRoute>}/><Route path="/projects/:id" element={<ProtectedRoute><ProjectDetail/></ProtectedRoute>}/><Route path="/hiring" element={<ProtectedRoute><Hiring/></ProtectedRoute>}/><Route path="/contracts" element={<ProtectedRoute><Contracts/></ProtectedRoute>}/><Route path="/messages" element={<ProtectedRoute><Messages/></ProtectedRoute>}/><Route path="/notifications" element={<ProtectedRoute><Notifications/></ProtectedRoute>}/><Route path="/saved" element={<ProtectedRoute><OwnerOnly><Saved/></OwnerOnly></ProtectedRoute>}/><Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>}/><Route path="*" element={<NotFound/>}/></Routes>}
export default function App(){return <AuthProvider><Toaster position="top-right" toastOptions={{style:{fontSize:'13px',borderRadius:'12px',padding:'14px 16px'}}}/><AppRoutes/></AuthProvider>}
