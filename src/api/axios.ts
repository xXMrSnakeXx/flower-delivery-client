import axios from 'axios';
const base = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api';
export default axios.create({ baseURL: base, timeout: 10000 });
