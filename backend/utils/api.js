export const fetchApi = async (url, options = {}) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
  const appKey = process.env.NEXT_PUBLIC_APP_KEY;

  const isFormData = options.body instanceof FormData;

  const headers = {
    'Accept': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...(appKey && { 'X-API-KEY': appKey }),
    ...(!isFormData && { 'Content-Type': 'application/json' }),
    ...options.headers,
  };

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (response.status === 401) {
    if (typeof window !== 'undefined') {
      [
        'admin_token', 'admin_role', 'admin_name', 'admin_email',
        'admin_username', 'admin_login_type', 'admin_session_at'
      ].forEach(k => localStorage.removeItem(k));
      if (window.location.pathname !== '/v1/auth/sign-in' && window.location.pathname !== '/v1/auth/sign_in') {
        window.location.href = '/v1/auth/sign-in';
      }
    }
    throw new Error('Session expired. Redirecting to login...');
  }

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};
