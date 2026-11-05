import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import api from '../services/api';

export default function Bookings(){
  const [items,setItems]=useState([]),[customers,setCustomers]=useState([]),[open,setOpen]=useState(false),[error,setError]=useState('');
  const load=()=>Promise.all([api.get('/bookings'),api.get('/customers')]).then(([a,b])=>{setItems(a.data);setCustomers(b.data)});
  useEffect(load,[]);
  const save=async e=>{e.preventDefault();setError('');const body=Object.fromEntries(new FormData(e.target));try{await api.post('/bookings',body);setOpen(false);load()}catch(x){setError(x.response?.data?.message||'Could not save booking')}};
  const cancel=async i=>{await api.patch(`/bookings/${i._id}/cancel`);load()};
  return <div className="page"><div className="page-heading"><div><h1>Bookings</h1><p>Appointments and service returns</p></div><button className="btn primary" onClick={()=>setOpen(true)}><Plus/> New booking</button></div>
  <div className="panel table-wrap"><table><thead><tr><th>Customer</th><th>Service</th><th>Date & time</th><th>Status</th><th></th></tr></thead><tbody>{items.map(i=><tr key={i._id}><td><strong>{i.customerId?.name}</strong></td><td>{i.title}</td><td>{i.bookingDate}<small>{i.startTime} - {i.endTime}</small></td><td><span className={`badge ${i.status.toLowerCase()}`}>{i.status}</span></td><td>{i.status==='Confirmed'&&<button className="btn small" onClick={()=>cancel(i)}>Cancel</button>}</td></tr>)}</tbody></table>{!items.length&&<p className="empty">No bookings found.</p>}</div>
  {open&&<div className="modal-backdrop"><form className="modal" onSubmit={save}><h2>New booking</h2>{error&&<p className="form-error">{error}</p>}<div className="form-grid"><label>Customer<select required name="customerId"><option value="">Select customer</option>{customers.map(c=><option value={c._id} key={c._id}>{c.name}</option>)}</select></label><label>Service<input required name="title"/></label><label>Date<input required type="date" name="bookingDate"/></label><label></label><label>Start time<input required type="time" name="startTime"/></label><label>End time<input required type="time" name="endTime"/></label><label className="full">Description<textarea name="description"/></label></div><div className="modal-actions"><button type="button" className="btn" onClick={()=>setOpen(false)}>Cancel</button><button className="btn primary">Check & book</button></div></form></div>}
  </div>;
}
