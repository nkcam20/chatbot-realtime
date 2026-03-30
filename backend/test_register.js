const testRegistration = async () => {
  try {
    const res = await fetch('https://chatbot-realtime.onrender.com/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: `testbot_${Date.now()}@example.com`,
        password: 'securepassword123',
        displayName: 'Test Bot'
      })
    });
    const data = await res.json();
    console.log('Registration Response:', data);
  } catch (err) {
    console.error('Registration Error:', err);
  }
};
testRegistration();
