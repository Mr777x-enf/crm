import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import api from '../services/api';

export default function FollowUps(){
  const [items,setItems]=useState([]),[customers,setCustomers]=useState([]),[open,setOpen]=useState(false),[filter,setFilter]=useState('all'),[error,setError]=useState('');
  const load=()=>Promise.all([api.get('/followups'),api.get('/customers')]).then(([a,b])=>{setItems(a.data);setCustomers(b.data)});
  useEffect(load,[]);
  const save=async e=>{e.preventDefault();setError('');const body=Object.fromEntries(new FormData(e.target));try{await api.post('/followups',body);setOpen(false);load()}catch(x){setError(x.response?.data?.message||'Could not save follow-up')}};
  const status=async(item,value)=>{await api.patch(`/followups/${item._id}/status`,{status:value});load()};
  const overdue=i=>i.status==='Pending'&&new Date(i.scheduledAt)<new Date();
  const visible=items.filter(i=>filter==='all'||(filter==='overdue'?overdue(i):i.status===filter));
  return <div className="page"><div className="page-heading"><div><h1>Follow-ups</h1><p>Schedule and track customer follow-ups</p></div><button className="btn primary" onClick={()=>setOpen(true)}><Plus/> Schedule follow-up</button></div>
  <div className="toolbar"><select value={filter} onChange={e=>setFilter(e.target.value)}><option value="all">All follow-ups</option><option value="Pending">Pending</option><option value="Completed">Completed</option><option value="overdue">Overdue</option></select></div>
  <div className="panel"><div className="followup-list">{visible.map(i=><div className={`followup-row ${overdue(i)?'overdue':''}`} key={i._id}><div><strong>{i.title}</strong><span>{i.customerId?.name} · {new Date(i.scheduledAt).toLocaleString()}</span><p>{i.description}</p></div><div className="row-actions"><span className={`badge ${overdue(i)?'cancelled':i.status.toLowerCase()}`}>{overdue(i)?'Overdue':i.status}</span>{i.status==='Pending'&&<><button className="btn small" onClick={()=>status(i,'Completed')}>Complete</button><button className="btn small" onClick={()=>status(i,'Cancelled')}>Cancel</button></>}</div></div>)}</div>{!visible.length&&<p className="empty">No follow-ups found.</p>}</div>
  {open&&<div className="modal-backdrop"><form className="modal" onSubmit={save}><h2>Schedule follow-up</h2>{error&&<p className="form-error">{error}</p>}<div className="form-grid"><label>Customer<select required name="customerId"><option value="">Select customer</option>{customers.map(c=><option value={c._id} key={c._id}>{c.name}</option>)}</select></label><label>Title<input required name="title"/></label><label>Scheduled date and time<input required type="datetime-local" name="scheduledAt"/></label><label className="full">Description<textarea name="description"/></label></div><div className="modal-actions"><button type="button" className="btn" onClick={()=>setOpen(false)}>Cancel</button><button className="btn primary">Schedule</button></div></form></div>}
  </div>;
}
