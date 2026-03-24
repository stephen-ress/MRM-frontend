import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
});

// REQUEST INTERCEPTOR: Attach Token to every request
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // or however you store your JWT
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR: Handle 401 globally (optional but recommended)
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Logic to logout user or redirect to login if token is invalid
      console.warn("Session expired or unauthorized");
    }
    return Promise.reject(error);
  }
);

export default client;