import { useEffect, useState } from 'react';
import { Users, MessagesSquare, Clock3, AlertTriangle, CalendarCheck } from 'lucide-react';
import api from '../services/api';

export default function Dashboard() {
  const [d, setD] = useState(null);
  const load = () => api.get('/dashboard').then(r => setD(r.data)).catch(console.error);
  useEffect(load, []);
  const cards = d ? [
    ['Total Customers', d.totalCustomers, Users], ['Interactions', d.totalInteractions, MessagesSquare],
    ['Pending Follow-ups', d.pendingFollowUps, Clock3], ['Overdue Follow-ups', d.overdueFollowUps, AlertTriangle],
    ['Upcoming Bookings', d.upcomingBookings, CalendarCheck]
  ] : [];
  return <div className="page">
    <div className="page-heading"><div><h1>Dashboard</h1><p>Business overview at a glance</p></div></div>
    <div className="stats-grid">{cards.map(([label, value, Icon]) => <div className="stat-card" key={label}><div className="stat-icon"><Icon/></div><div><span>{label}</span><strong>{value}</strong></div></div>)}</div>
    <div className="grid lg:grid-cols-2 gap-5 mt-5">
      <section className="panel"><h2>Recent activity</h2>{d?.recentInteractions.map(item => <div className="activity-row" key={item._id}><div className="activity-dot"/><div><strong>{item.customerId?.name || 'Customer'}</strong><span>{item.type} · {new Date(item.interactionDate).toLocaleDateString()}</span><p>{item.notes}</p></div></div>) || <p className="empty">No interactions yet.</p>}</section>
      <section className="panel"><h2>Upcoming follow-ups</h2>{d?.upcomingFollowUps.map(item => <div className="list-row" key={item._id}><div><strong>{item.title}</strong><span>{item.customerId?.name}</span></div><span className="badge pending">Pending</span></div>) || <p className="empty">No upcoming follow-ups.</p>}</section>
    </div>
  </div>;
}
