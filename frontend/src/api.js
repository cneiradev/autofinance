const AUTH = 'Basic ' + btoa('root:root');
const BASE = 'http://localhost:8081/api';
export async function api(path, opts={}) {
  const res = await fetch(BASE + path, {
    ...opts,
    headers: { 'Content-Type':'application/json', 'Authorization': AUTH, ...(opts.headers||{}) }
  });
  if (!res.ok) throw new Error(await res.text());
  if (res.status === 204) return null;
  return res.json();
}
