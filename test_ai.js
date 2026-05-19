const fetch = globalThis.fetch;

(async () => {
  const email = 'test' + Date.now() + '@example.com';
  const registerRes = await fetch('https://studentosbackend.vercel.app/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Test', email, password: 'Test1234' })
  });
  const registerData = await registerRes.json();
  
  if (registerData.token) {
    const token = registerData.token;
    const questions = [
      'What are study techniques?',
      'Create a study routine for me',
      'How many classes can I miss safely?',
      'Tips for better productivity'
    ];
    
    console.log('\n=== AI CHAT TESTS ===\n');
    
    for (const q of questions) {
      const res = await fetch('https://studentosbackend.vercel.app/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
        body: JSON.stringify({ message: q })
      });
      const data = await res.json();
      console.log('Q:', q);
      console.log('Status:', res.status);
      console.log('A:', data.response.substring(0, 100) + '...\n');
    }
  }
})().catch(e => console.error(e));
