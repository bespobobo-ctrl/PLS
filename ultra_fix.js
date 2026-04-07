const fs = require('fs');
const path = require('path');

// Fayllarni mutlaqo toza UTF-8 (BOMsiz) formatda yozish funksiyasi
function writeCleanFile(name, content) {
    fs.writeFileSync(name, content, { encoding: 'utf8', flag: 'w' });
    console.log(`✅ ${name} toza holatda yozildi.`);
}

const mainContent = `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`;

const appContent = `import React from 'react';

function App() {
  return (
    <div style={{ 
      backgroundColor: '#05020a', 
      color: 'white', 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center',
      fontFamily: 'sans-serif'
    }}>
      <h1 style={{ color: '#00f2ff', fontSize: '32px', marginBottom: '10px' }}>PLS GAME CLUB</h1>
      <p style={{ opacity: 0.6 }}>Mini App muvaffaqiyatli ishga tushdi!</p>
      <div style={{ 
        marginTop: '30px', 
        padding: '20px', 
        border: '1px solid rgba(255,255,255,0.1)', 
        borderRadius: '20px',
        backgroundColor: 'rgba(255,255,255,0.05)'
      }}>
        🛠️ Tez orada Login va Signup paneli qo'shiladi.
      </div>
    </div>
  );
}

export default App;`;

const indexContent = `<!doctype html>
<html lang="uz">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>PLS Game Club</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`;

writeCleanFile('src/main.jsx', mainContent);
writeCleanFile('src/App.jsx', appContent);
writeCleanFile('index.html', indexContent);
