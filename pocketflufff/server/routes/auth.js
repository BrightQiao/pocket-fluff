const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getUserByUsername, createUser, userExists } = require('../db');

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('注册请求:', { username, password });

        if (!username || !password) {
            return res.status(400).json({ error: '用户名和密码不能为空' });
        }

        if (username.length < 3 || username.length > 20) {
            return res.status(400).json({ error: '用户名长度应为3-20个字符' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: '密码长度至少6个字符' });
        }

        const exists = userExists(username);
        console.log('用户名是否存在:', exists);
        
        if (exists) {
            return res.status(400).json({ error: '用户名已存在' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = createUser(username, hashedPassword);
        console.log('用户创建成功, userId:', userId);

        const token = jwt.sign(
            { userId: userId, username: username },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: '注册成功',
            token: token,
            userId: userId
        });
    } catch (error) {
        console.error('注册错误详情:', error);
        res.status(500).json({ error: '服务器错误：' + error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('登录请求:', { username });

        if (!username || !password) {
            return res.status(400).json({ error: '用户名和密码不能为空' });
        }

        const user = getUserByUsername(username);
        console.log('查询到的用户:', user);

        if (!user) {
            return res.status(401).json({ error: '用户名或密码错误' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log('密码匹配结果:', isMatch);

        if (!isMatch) {
            return res.status(401).json({ error: '用户名或密码错误' });
        }

        const token = jwt.sign(
            { userId: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: '登录成功',
            token: token,
            userId: user.id
        });
    } catch (error) {
        console.error('登录错误详情:', error);
        res.status(500).json({ error: '服务器错误：' + error.message });
    }
});

module.exports = router;