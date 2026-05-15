const express = require('express');

const router = express.Router();

router.post('/chat', async (req, res) => {
    try {
        const { messages } = req.body;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: '无效的请求' });
        }

        if (!process.env.DEEPSEEK_API_KEY) {
            return res.status(500).json({ error: 'AI服务未配置' });
        }

        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + process.env.DEEPSEEK_API_KEY
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: messages,
                max_tokens: 200,
                temperature: 0.8
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('DeepSeek API错误:', response.status, errorData);
            return res.status(response.status).json({ error: 'AI服务调用失败' });
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('AI代理错误:', error);
        res.status(500).json({ error: 'AI服务出错' });
    }
});

module.exports = router;
