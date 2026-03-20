
async function fullTest() {
  const API_URL = 'http://127.0.0.1:8000/api';
  
  // 1. Login
  const loginRes = await fetch(API_URL + '/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ username: 'superadmin', password: 'password' })
  });
  
  const loginData = await loginRes.json();
  if (!loginData.success) {
      console.error('Login Failed:', loginData);
      return;
  }
  
  const token = loginData.data.token;
  console.log('Login Success. Token:', token);
  
  // 2. Test endpoints
  const endpoints = ['/admin/nav', '/admin/home', '/admin/portfolio/categories'];
  
  for (const ep of endpoints) {
      const res = await fetch(API_URL + ep, {
          headers: {
              'Accept': 'application/json',
              'Authorization': 'Bearer ' + token
          }
      });
      console.log('--- ' + ep + ' ---');
      console.log('Status:', res.status);
      const data = await res.text();
      console.log('Response:', data.substring(0, 100) + '... (truncated)');
  }
}

fullTest();
