const express = require('express');
const { getUserGameData, saveUserGameData } = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, (req, res) => {
    try {
        const gameData = getUserGameData(req.userId);
        res.json(gameData);
    } catch (error) {
        console.error('获取数据错误:', error);
        res.status(500).json({ error: '获取数据失败' });
    }
});

router.post('/', authMiddleware, (req, res) => {
    try {
        const gameData = req.body;
        const firstDate = req.body.firstDate || gameData.firstDate || null;
        
        if (!gameData || typeof gameData !== 'object') {
            return res.status(400).json({ error: '无效的 gameData' });
        }
        
        saveUserGameData(req.userId, gameData, firstDate);
        res.json({ message: '保存成功' });
    } catch (error) {
        console.error('保存数据错误:', error);
        res.status(500).json({ error: '保存数据失败' });
    }
});

module.exports = router;
