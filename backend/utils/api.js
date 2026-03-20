export const fetchApi = async (url, options = {}) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
  const appKey = process.env.NEXT_PUBLIC_APP_KEY;
  
  const isFormData = options.body instanceof FormData;
  
  const headers = {
    'Accept': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...(appKey && { 'X-App-Key': appKey }),
    ...(!isFormData && { 'Content-Type': 'application/json' }),
    ...options.headers,
  };

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
  
  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });

  const data = await response.json();
  
  if (response.status === 401) {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_name');
        localStorage.removeItem('admin_role');
        window.location.href = '/authentication/sign-in';
    }
    throw new Error('Session expired. Redirecting to login...');
  }

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  
  return data;
};
