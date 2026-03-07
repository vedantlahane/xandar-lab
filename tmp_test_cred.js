const http = require('http');

const body = JSON.stringify({
    username: 'test',
    password: 'password', // Assuming this fails or we just see the callback
    redirect: false
});

const req = http.request('http://localhost:3000/api/auth/callback/credentials', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': body.length,
        'Cookie': 'next-auth.csrf-token=your_csrf_token_here' // We might need a real CSRF token...
    }
}, res => {
    console.log(res.statusCode);
    console.log(res.headers['set-cookie']);
    let d = '';
    res.on('data', c => d += c);
    res.on('end', () => console.log(d));
});
req.write(body);
req.end();
