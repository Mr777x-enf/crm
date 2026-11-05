import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Users, MessagesSquare, CalendarClock, CalendarCheck, Menu } from 'lucide-react';

const links = [
  ['/', 'Dashboard', LayoutDashboard], ['/customers', 'Customers', Users],
  ['/interactions', 'Interactions', MessagesSquare], ['/followups', 'Follow-ups', CalendarClock],
  ['/bookings', 'Bookings', CalendarCheck]
];
export default function Layout() {
  return <div className="min-h-screen lg:flex">
    <aside className="sidebar">
      <div className="logo">CRM<span>Desk</span></div>
      <nav>{links.map(([path, label, Icon]) => <NavLink key={path} to={path} end={path === '/'} className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}><Icon size={19}/>{label}</NavLink>)}</nav>
    </aside>
    <main className="main-content"><header className="topbar"><Menu className="lg:hidden"/><div><strong>Customer relationship manager</strong><small>Keep every customer connection on track</small></div></header><Outlet/></main>
  </div>;
}
