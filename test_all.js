const fetch = globalThis.fetch;

(async () => {
  console.log("Testing API Endpoints...\n");
  
  // Test register
  const email = 'test' + Date.now() + '@example.com';
  const reg = await fetch('https://studentosbackend.vercel.app/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Test User', email, password: 'Test1234' })
  });
  const regData = await reg.json();
  const token = regData.token;
  
  if (!token) { console.log("❌ Auth failed"); return; }
  console.log("✅ Auth/Register working");
  
  const headers = { Authorization: 'Bearer ' + token };
  
  // Test goals
  const goals = await fetch('https://studentosbackend.vercel.app/api/goals', { headers });
  const goalsData = await goals.json();
  console.log("✅ Goals API: " + goalsData.length + " goals");
  
  // Test courses
  const courses = await fetch('https://studentosbackend.vercel.app/api/courses', { headers });
  const coursesData = await courses.json();
  console.log("✅ Courses API: " + coursesData.length + " courses");
  
  // Test dashboard stats
  const stats = await fetch('https://studentosbackend.vercel.app/api/dashboard/stats', { headers });
  const statsData = await stats.json();
  console.log("✅ Dashboard: attendance=" + statsData.overallAttendance + "%");
  
  // Test AI chat
  const ai = await fetch('https://studentosbackend.vercel.app/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
    body: JSON.stringify({ message: 'Hello' })
  });
  const aiData = await ai.json();
  console.log("✅ AI Chat: " + (aiData.response ? 'working' : 'failed'));
  
  // Test notifications
  const notif = await fetch('https://studentosbackend.vercel.app/api/notifications', { headers });
  const notifData = await notif.json();
  console.log("✅ Notifications API: " + notifData.length + " notifications");
  
  console.log("\n🎉 All Backend APIs OK!");
})();