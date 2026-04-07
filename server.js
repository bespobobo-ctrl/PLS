const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_FILE = path.join(__dirname, 'db.json');

app.use(cors());
app.use(bodyParser.json());

// Initial Data Structure
const initialData = {
    rooms: [
        { id: 1, name: 'VIP_01', price: '18,500', club: 'PLS Kokand-1', isBlocked: false, isBusy: false, startTime: null, dailyHours: 0, dailyRevenue: 0, sessionBarTotal: 0, barItems: [] },
        { id: 2, name: 'ROOM_02', price: '12,000', club: 'PLS Kokand-1', isBlocked: false, isBusy: false, startTime: null, dailyHours: 0, dailyRevenue: 0, sessionBarTotal: 0, barItems: [] },
        { id: 3, name: 'ROOM_03', price: '12,000', club: 'PLS Kokand-1', isBlocked: false, isBusy: false, startTime: null, dailyHours: 0, dailyRevenue: 0, sessionBarTotal: 0, barItems: [] }
    ],
    inventory: [
        { id: 1, name: 'Pepsi 0.5L', price: 8000, stock: 24 },
        { id: 2, name: 'Coca-Cola 0.5L', price: 8000, stock: 24 },
        { id: 3, name: 'Flash Energy', price: 12000, stock: 12 },
        { id: 4, name: 'Chips Lays', price: 15000, stock: 10 },
        { id: 5, name: 'Sandwich', price: 18000, stock: 5 }
    ],
    debts: [],
    sessions: [],
    sales: []
};

// Database Helpers
const readDB = () => {
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
        return initialData;
    }
    return JSON.parse(fs.readFileSync(DATA_FILE));
};

const writeDB = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// API Endpoints
app.get('/api/data', (req, res) => {
    res.json(readDB());
});

app.post('/api/sync', (req, res) => {
    writeDB(req.body);
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
