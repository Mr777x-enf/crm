import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import api from '../services/api';

const empty = { name:'', email:'', phone:'', address:'', consent:{ email:true,sms:false,phoneCall:true,preferredMethod:'Phone' } };
export default function Customers() {
  const [items,setItems]=useState([]), [query,setQuery]=useState(''), [open,setOpen]=useState(false), [form,setForm]=useState(empty), [editing,setEditing]=useState(null);
  const load=()=>api.get('/customers',{params:{search:query}}).then(r=>setItems(r.data));
  useEffect(load,[query]);
  const save=async e=>{
    e.preventDefault();
    await api[editing?'put':'post'](`/customers${editing?'/'+editing:''}`,form);
    setOpen(false); setEditing(null); setForm(empty); load();
  };
  const edit=item=>{setForm({name:item.name,email:item.email,phone:item.phone,address:item.address||'',consent:item.consent});setEditing(item._id);setOpen(true)};
  const remove=async item=>{if(confirm(`Delete ${item.name}?`)){await api.delete('/customers/'+item._id);load()}};
  const set=(key,value)=>setForm({...form,[key]:value});
  return <div className="page"><div className="page-heading"><div><h1>Customers</h1><p>Manage customer profiles and consent</p></div><button className="btn primary" onClick={()=>{setForm(empty);setEditing(null);setOpen(true)}}><Plus/> Add customer</button></div>
  <div className="toolbar"><label><Search/><input placeholder="Search name, email or phone" value={query} onChange={e=>setQuery(e.target.value)}/></label></div>
  <div className="panel table-wrap"><table><thead><tr><th>Customer</th><th>Contact</th><th>Preferred method</th><th>Consent</th><th></th></tr></thead><tbody>{items.map(c=><tr key={c._id}><td><Link className="customer-name" to={`/customers/${c._id}`}>{c.name}</Link><small>{c.address||'No address'}</small></td><td><strong>{c.email}</strong><small>{c.phone}</small></td><td>{c.consent?.preferredMethod}</td><td><span className={`badge ${c.consent?.email?'confirmed':'cancelled'}`}>{c.consent?.email?'Email allowed':'No email'}</span></td><td className="actions"><button onClick={()=>edit(c)}><Pencil/></button><button onClick={()=>remove(c)}><Trash2/></button></td></tr>)}</tbody></table>{!items.length&&<p className="empty">No customers found.</p>}</div>
  {open&&<div className="modal-backdrop" onMouseDown={()=>setOpen(false)}><form className="modal" onSubmit={save} onMouseDown={e=>e.stopPropagation()}><h2>{editing?'Edit':'Add'} customer</h2><div className="form-grid"><label>Full name<input required value={form.name} onChange={e=>set('name',e.target.value)}/></label><label>Email<input required type="email" value={form.email} onChange={e=>set('email',e.target.value)}/></label><label>Phone<input required value={form.phone} onChange={e=>set('phone',e.target.value)}/></label><label>Address<input value={form.address} onChange={e=>set('address',e.target.value)}/></label><label>Preferred contact<select value={form.consent.preferredMethod} onChange={e=>set('consent',{...form.consent,preferredMethod:e.target.value})}><option>Phone</option><option>Email</option><option>SMS</option></select></label></div><div className="consents">{['email','sms','phoneCall'].map(k=><label key={k}><input type="checkbox" checked={form.consent[k]} onChange={e=>set('consent',{...form.consent,[k]:e.target.checked})}/>{k==='phoneCall'?'Phone call':k.toUpperCase()}</label>)}</div><div className="modal-actions"><button type="button" className="btn" onClick={()=>setOpen(false)}>Cancel</button><button className="btn primary">Save customer</button></div></form></div>}
  </div>;
}
