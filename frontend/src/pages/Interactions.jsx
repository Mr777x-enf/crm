import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import api from '../services/api';

export default function Interactions(){
  const [items,setItems]=useState([]),[customers,setCustomers]=useState([]),[open,setOpen]=useState(false),[type,setType]=useState(''),[error,setError]=useState('');
  const load=()=>Promise.all([api.get('/interactions',{params:type?{type}:{} }),api.get('/customers')]).then(([a,b])=>{setItems(a.data);setCustomers(b.data)});
  useEffect(load,[type]);
  const save=async e=>{e.preventDefault();setError('');
    const form=new FormData(e.target); const body=Object.fromEntries(form);
    try{await api.post('/interactions',body);setOpen(false);load()}catch(err){setError(err.response?.data?.message||'Could not save interaction.')};
  };
  return <div className="page"><div className="page-heading"><div><h1>Interactions</h1><p>Customer communication history</p></div><button className="btn primary" onClick={()=>setOpen(true)}><Plus/> Add interaction</button></div>
  <div className="toolbar"><select value={type} onChange={e=>setType(e.target.value)}><option value="">All types</option>{['Call','Email','Meeting','Visit','Other'].map(x=><option key={x}>{x}</option>)}</select></div>
  <div className="panel table-wrap"><table><thead><tr><th>Customer</th><th>Type</th><th>Date</th><th>Notes</th><th>Next action</th></tr></thead><tbody>{items.map(i=><tr key={i._id}><td><strong>{i.customerId?.name}</strong></td><td><span className="badge confirmed">{i.type}</span></td><td>{new Date(i.interactionDate).toLocaleString()}</td><td>{i.notes}</td><td>{i.nextAction||'-'}</td></tr>)}</tbody></table>{!items.length&&<p className="empty">No interactions found.</p>}</div>
  {open&&<div className="modal-backdrop"><form className="modal" onSubmit={save}><h2>Add interaction</h2>{error&&<p className="form-error">{error}</p>}<div className="form-grid"><label>Customer<select required name="customerId"><option value="">Select customer</option>{customers.map(c=><option value={c._id} key={c._id}>{c.name}</option>)}</select></label><label>Type<select name="type" defaultValue="Call">{['Call','Email','Meeting','Visit','Other'].map(x=><option key={x}>{x}</option>)}</select></label><label>Date<input required type="datetime-local" name="interactionDate"/></label><label>Staff name<input name="staffName"/></label><label className="full">Notes<textarea required name="notes"/></label><label className="full">Next action<input name="nextAction"/></label></div><div className="modal-actions"><button type="button" className="btn" onClick={()=>setOpen(false)}>Cancel</button><button className="btn primary">Save interaction</button></div></form></div>}
  </div>;
}
