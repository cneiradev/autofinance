import { useState, useEffect } from 'react';
import { api } from './api';
import { Routes, Route, Link, useParams } from 'react-router-dom';
function Perfil() {
  const { id } = useParams();
  const [perfil, setPerfil] = useState(null);
  const [compras, setCompras] = useState([]);
  const [form, setForm] = useState({ descripcion:'', casaComercial:'', fechaCompra:new Date().toISOString().slice(0,10), cuotas:1, montoTotal:0, montoCuota:0 });
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const load = async () => {
    const ps = await api('/perfiles');
    setPerfil(ps.find(p=>String(p.id)===String(id)));
    setCompras(await api(`/perfiles/${id}/compras`));
  };
  useEffect(() => { load(); }, [id]);
  const add = async (e) => {
    e.preventDefault();
    await api(`/perfiles/${id}/compras`, { method:'POST', body: JSON.stringify({
      ...form, casaComercial: form.casaComercial, cuotas:Number(form.cuotas), montoTotal:Number(form.montoTotal),
      montoCuota:Number(form.montoCuota)
    }) });
    setForm({ descripcion:'', fechaCompra:new Date().toISOString().slice(0,10), cuotas:1, montoTotal:0, montoCuota:0 });
    load();
  };
  const toggle = async (cid) => { await api(`/compras/${cid}/pago`, { method:'PATCH' }); load(); };
  const del = async (cid) => { await api(`/compras/${cid}`, { method:'DELETE' }); load(); };
  const startEdit = (c) => { setEditId(c.id); setEditForm({...c}); };
  const saveEdit = async () => { await api(`/compras/${editId}`, { method:'PUT', body: JSON.stringify({...editForm, cuotas:Number(editForm.cuotas), montoTotal:Number(editForm.montoTotal), montoCuota:Number(editForm.montoCuota), cuotasPagadas:Number(editForm.cuotasPagadas) }) }); setEditId(null); load(); };
  return (
    <>
      <style>{`@media print { .no-print { display:none !important; } .print-only { display:block !important; } } .print-only { display:none; }`}</style>
      <main className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">{perfil?.nombre}</h2>
      <form onSubmit={add} className="no-print grid grid-cols-2 md:grid-cols-6 gap-2 mb-6 bg-white p-4 rounded-xl shadow">
        <div className="col-span-2">
          <label className="text-xs text-slate-600">Producto</label>
          <input placeholder="Producto" value={form.descripcion} onChange={e=>setForm({...form,descripcion:e.target.value})} className="border rounded px-2 py-1 w-full" required />
        <div>
          <label className="text-xs text-slate-600">Casa comercial</label>
          <input placeholder="Casa comercial" value={form.casaComercial} onChange={e=>setForm({...form,casaComercial:e.target.value})} className="border rounded px-2 py-1 w-full" />
        </div>
        </div>
        <div>
          <label className="text-xs text-slate-600">Fecha compra</label>
          <input type="date" value={form.fechaCompra} onChange={e=>setForm({...form,fechaCompra:e.target.value})} className="border rounded px-2 py-1 w-full" />
        </div>
        <div>
          <label className="text-xs text-slate-600">Cuotas</label>
          <input type="number" placeholder="Cuotas" value={form.cuotas} onChange={e=>setForm({...form,cuotas:e.target.value})} className="border rounded px-2 py-1 w-full" />
        </div>
        <div>
          <label className="text-xs text-slate-600">Monto total</label>
          <input type="number" placeholder="Total" value={form.montoTotal} onChange={e=>setForm({...form,montoTotal:e.target.value})} className="border rounded px-2 py-1 w-full" />
        </div>
        <div>
          <label className="text-xs text-slate-600">Monto cuota</label>
          <input type="number" placeholder="Cuota" value={form.montoCuota} onChange={e=>setForm({...form,montoCuota:e.target.value})} className="border rounded px-2 py-1 w-full" />
        </div>
        <button className="bg-blue-600 text-white px-3 py-1 rounded col-span-2 md:col-span-1 self-end">Agregar</button>
      </form>
      <div className="no-print flex gap-2 mb-3">
        <button onClick={() => { const txt = compras.map(c => `${c.descripcion} - Cuota ${c.cuotasPagadas || 0}/${c.cuotas} - ${new Intl.NumberFormat('es-CL').format(c.montoCuota)}`).join('\n') + `\nTOTAL ESTE MES: ${new Intl.NumberFormat('es-CL').format(compras.filter(c=>!c.oculto).reduce((a,c)=>a+Number(c.montoCuota||0),0))}`; navigator.clipboard.writeText(txt); alert('Copiado al portapapeles'); }} className="bg-green-600 text-white px-3 py-1 rounded text-sm">Copiar WhatsApp</button>
        <button onClick={() => window.print()} className="bg-slate-700 text-white px-3 py-1 rounded text-sm">Imprimir / PDF</button>
      </div>
      <h2 className="print-only text-xl font-bold mb-3">DETALLE CUOTAS MES: {new Date().toLocaleString('es-CL', { month: 'long', year: 'numeric' }).toUpperCase()}</h2>
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-2">Fecha</th><th className="p-2 text-left">Producto</th><th className="p-2">Casa comercial</th><th className="p-2">Cuota</th>
              <th className="p-2">Cuotas</th><th className="p-2">Total</th><th className="p-2">Estado</th><th className="p-2 no-print"></th>
            </tr>
          </thead>
          <tbody>
            {compras.map(c => (
              editId === c.id ? (
                <tr key={c.id} className="border-t bg-slate-50">
                  <td className="p-2"><input type="date" value={editForm.fechaCompra} onChange={e=>setEditForm({...editForm,fechaCompra:e.target.value})} className="border rounded px-1 py-0.5 w-full" /></td>
                  <td className="p-2"><input value={editForm.descripcion} onChange={e=>setEditForm({...editForm,descripcion:e.target.value})} className="border rounded px-1 py-0.5 w-full" /></td>
                  <td className="p-2"><input value={editForm.casaComercial||''} onChange={e=>setEditForm({...editForm,casaComercial:e.target.value})} className="border rounded px-1 py-0.5 w-full" /></td>
                  <td className="p-2"><input type="number" value={editForm.montoCuota} onChange={e=>setEditForm({...editForm,montoCuota:e.target.value})} className="border rounded px-1 py-0.5 w-20" /></td>
                  <td className="p-2"><input type="number" value={editForm.cuotasPagadas} onChange={e=>setEditForm({...editForm,cuotasPagadas:e.target.value})} className="border rounded px-1 py-0.5 w-12" />/<input type="number" value={editForm.cuotas} onChange={e=>setEditForm({...editForm,cuotas:e.target.value})} className="border rounded px-1 py-0.5 w-12" /></td>
                  <td className="p-2"><input type="number" value={editForm.montoTotal} onChange={e=>setEditForm({...editForm,montoTotal:e.target.value})} className="border rounded px-1 py-0.5 w-24" /></td>
                  <td className="p-2 text-center no-print"></td>
                  <td className="p-2 text-center no-print">
                    <button onClick={saveEdit} className="text-emerald-600 mr-2">💾</button>
                    <button onClick={()=>setEditId(null)} className="text-slate-400">✕</button>
                  </td>
                </tr>
              ) : (
                <tr key={c.id} className="border-t">
                  <td className="p-2 text-center">{new Date(c.fechaCompra).toLocaleDateString('es-CL')}</td>
                  <td className="p-2">{c.descripcion}</td>
                  <td className="p-2">{c.casaComercial}</td>
                  <td className="p-2 text-center">${new Intl.NumberFormat('es-CL').format(c.montoCuota)}</td>
                  <td className="p-2 text-center">{c.cuotasPagadas || 0}/{c.cuotas}</td>
                  <td className="p-2 text-center">${new Intl.NumberFormat('es-CL').format(c.montoTotal)}</td>
                  <td className="p-2 text-center">
                    <button onClick={()=>toggle(c.id)} className={`px-2 py-1 rounded text-xs ${c.pagado?'bg-emerald-100 text-emerald-700':'bg-red-100 text-red-700'}`}>
                      {c.pagado ? 'Pagado' : `Pagar cuota`}
                    </button>
                  </td>
                  <td className="p-2 text-center no-print">
                    <button onClick={async ()=>{ await api(`/compras/${c.id}`, { method:'PUT', body: JSON.stringify({...c, oculto: !c.oculto}) }); load(); }} className="text-slate-400 hover:text-purple-600 mr-2">{c.oculto ? '👁️‍🗨️' : '👁️'}</button>
                    <button onClick={()=>startEdit(c)} className="text-slate-400 hover:text-blue-600 mr-2">✏️</button>
                    <button onClick={()=>del(c.id)} className="text-slate-400 hover:text-red-600">✕</button>
                  </td>
                </tr>
              )
            ))}
          </tbody>
          <tfoot className="bg-slate-100 font-semibold">
            <tr>
              <td colSpan="6" className="p-2 text-right">TOTAL ESTE MES</td>
              <td className="p-2 text-center">${new Intl.NumberFormat('es-CL').format(compras.filter(c=>!c.oculto).reduce((a,c)=>a+Number(c.montoCuota||0),0))}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </main>
    </>
  );
}


function Header() {
  return (
    <header className="no-print bg-slate-900 text-white px-6 py-4 flex items-center justify-between shadow">
      <h1 className="text-xl font-bold">autofinance</h1>
      <nav className="space-x-4 text-sm">
        <Link to="/" className="hover:text-emerald-300">Dashboard</Link>
      </nav>
    </header>
  );
}

function Dashboard() {
  const [data, setData] = useState([]);
  const [nombre, setNombre] = useState('');
  useEffect(() => { api('/dashboard').then(setData).catch(console.error); }, []);
  const crear = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) return;
    await api('/perfiles', { method:'POST', body: JSON.stringify({ nombre, color:'#3b82f6' }) });
    setNombre('');
    api('/dashboard').then(setData);
  };
  return (
    <main className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Perfiles</h2>
        <form onSubmit={crear} className="flex gap-2">
          <input value={nombre} onChange={e=>setNombre(e.target.value)} placeholder="Nuevo perfil" className="border rounded px-3 py-2" />
          <button className="bg-emerald-600 text-white px-4 py-2 rounded">Crear</button>
        </form>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.map(d => (
          <div key={d.perfil.id} className="bg-white rounded-xl shadow p-4 border">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg">{d.perfil.nombre}</h3>
              <span className={`text-xs px-2 py-1 rounded ${Number(d.pendiente)>0?'bg-red-100 text-red-700':'bg-emerald-100 text-emerald-700'}`}>
                {Number(d.pendiente)>0?'Debe':'Al día'}
              </span>
            </div>
            <p className="text-sm text-slate-600">Compras: {d.totalCompras}</p>
            <p className="text-sm">Pendiente: <span className="text-red-600 font-semibold">${new Intl.NumberFormat('es-CL').format(d.pendiente)}</span></p>
            <p className="text-sm">Pagado: <span className="text-emerald-600 font-semibold">${new Intl.NumberFormat('es-CL').format(d.pagado)}</span></p>
            <Link to={`/perfil/${d.perfil.id}`} className="mt-3 inline-block text-blue-600 hover:underline text-sm">Ver perfil →</Link>
            <button onClick={async ()=>{ await api(`/perfiles/${d.perfil.id}`, { method:'DELETE' }); api('/dashboard').then(setData); }} className="mt-3 ml-3 inline-block text-red-500 hover:underline text-sm">Eliminar</button>
          </div>
        ))}
      </div>
    </main>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/perfil/:id" element={<Perfil />} />
      </Routes>
    </div>
  );
}
