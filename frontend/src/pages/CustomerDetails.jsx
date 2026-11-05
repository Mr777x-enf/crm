import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin } from 'lucide-react';
import api from '../services/api';

export default function CustomerDetails() {
  const {id}=useParams(); const [data,setData]=useState(null);
  useEffect(()=>api.get('/customers/'+id).then(r=>setData(r.data)),[id]);
  if(!data) return <div className="page">Loading...</div>;
  const {customer:c,interactions,followUps,bookings}=data;
  return <div className="page"><Link className="back-link" to="/customers"><ArrowLeft/> All customers</Link><div className="page-heading"><div><h1>{c.name}</h1><p>Customer profile and complete history</p></div></div>
  <div className="grid lg:grid-cols-3 gap-5"><section className="panel profile-card"><div className="avatar">{c.name[0]}</div><h2>{c.name}</h2><p><Mail/> {c.email}</p><p><Phone/> {c.phone}</p><p><MapPin/> {c.address||'No address'}</p><h3>Communication consent</h3><div className="consent-grid"><span>Email: <b>{c.consent.email?'Yes':'No'}</b></span><span>SMS: <b>{c.consent.sms?'Yes':'No'}</b></span><span>Phone: <b>{c.consent.phoneCall?'Yes':'No'}</b></span></div></section>
  <section className="panel lg:col-span-2"><h2>Interaction timeline</h2>{interactions.map(i=><div className="timeline-item" key={i._id}><span>{i.type}</span><div><strong>{new Date(i.interactionDate).toLocaleString()}</strong><p>{i.notes}</p>{i.nextAction&&<small>Next: {i.nextAction}</small>}</div></div>)}{!interactions.length&&<p className="empty">No interactions recorded.</p>}</section></div>
  <div className="grid lg:grid-cols-2 gap-5 mt-5"><section className="panel"><h2>Follow-ups</h2>{followUps.map(f=><div className="list-row" key={f._id}><div><strong>{f.title}</strong><span>{new Date(f.scheduledAt).toLocaleString()}</span></div><span className={`badge ${f.status.toLowerCase()}`}>{f.status}</span></div>)}</section><section className="panel"><h2>Bookings</h2>{bookings.map(b=><div className="list-row" key={b._id}><div><strong>{b.title}</strong><span>{b.bookingDate} · {b.startTime}-{b.endTime}</span></div><span className={`badge ${b.status.toLowerCase()}`}>{b.status}</span></div>)}</section></div></div>;
}
