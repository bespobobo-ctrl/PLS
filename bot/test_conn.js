const https = require('https');
const token = '8603912239:AAHHHAA6p66ZRaHTWHgtDdUWwI2BTmXvpGY';
const url = `https://api.telegram.org/bot${token}/getMe`;

console.log('Fetching:', url);
https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        console.log('Response:', data);
    });
}).on('error', (err) => {
    console.error('Error:', err.message);
});
