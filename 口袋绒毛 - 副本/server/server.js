require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDatabase } = require('./db');

const authRoutes = require('./routes/auth');
const gameDataRoutes = require('./routes/gamedata');
const aiRoutes = require('./routes/ai');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/gamedata', gameDataRoutes);
app.use('/api/ai', aiRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
});

app.use((err, req, res, next) => {
    console.error('服务器错误:', err);
    res.status(500).json({ error: '服务器内部错误' });
});

// 先初始化数据库，再启动服务器
async function startServer() {
    try {
        await initDatabase();
        app.listen(PORT, () => {
            console.log(`口袋绒毛服务器运行在 http://localhost:${PORT}`);
            console.log(`环境: ${process.env.NODE_ENV || 'development'}`);
        });
    } catch (error) {
        console.error('数据库初始化失败:', error);
        process.exit(1);
    }
}

startServer();