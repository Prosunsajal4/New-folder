const fetch = globalThis.fetch;

(async () => {
  const email = 'test' + Date.now() + '@example.com';
  const registerRes = await fetch('https://studentosbackend.vercel.app/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Test', email, password: 'Test1234' })
  });
  const registerData = await registerRes.json();
  console.log('Register:', registerData.token ? 'Token OK' : 'Failed');

  if (registerData.token) {
    const res = await fetch('https://studentosbackend.vercel.app/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + registerData.token },
      body: JSON.stringify({ message: 'What are study techniques?' })
    });
    const data = await res.json();
    console.log('AI:', data.response);
  }
})();