import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import CustomerDetails from './pages/CustomerDetails';
import Interactions from './pages/Interactions';
import FollowUps from './pages/FollowUps';
import Bookings from './pages/Bookings';

export default function App() {
  return <Routes><Route element={<Layout/>}>
    <Route path="/" element={<Dashboard/>}/>
    <Route path="/customers" element={<Customers/>}/>
    <Route path="/customers/:id" element={<CustomerDetails/>}/>
    <Route path="/interactions" element={<Interactions/>}/>
    <Route path="/followups" element={<FollowUps/>}/>
    <Route path="/bookings" element={<Bookings/>}/>
  </Route></Routes>;
}
