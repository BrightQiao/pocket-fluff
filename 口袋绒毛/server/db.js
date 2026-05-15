const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'database.db');
let db = null;

// 初始化数据库
async function initDatabase() {
    const SQL = await initSqlJs();
    
    if (fs.existsSync(dbPath)) {
        const fileBuffer = fs.readFileSync(dbPath);
        db = new SQL.Database(fileBuffer);
    } else {
        db = new SQL.Database();
    }
    
    // 创建用户表
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            game_data TEXT,
            first_date TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
    
    saveDatabase();
    console.log('数据库初始化成功');
    return db;
}

function saveDatabase() {
    if (db) {
        const data = db.export();
        const buffer = Buffer.from(data);
        fs.writeFileSync(dbPath, buffer);
    }
}

function getDb() {
    return db;
}

// 检查用户是否存在
function userExists(username) {
    const stmt = db.prepare("SELECT COUNT(*) as count FROM users WHERE username = ?");
    const result = stmt.get([username]);
    return result.count > 0;
}

// 根据用户名获取用户（修复：将数组结果转换为对象）
function getUserByUsername(username) {
    const stmt = db.prepare("SELECT * FROM users WHERE username = ?");
    const result = stmt.get([username]);
    console.log('getUserByUsername raw result:', result);
    
    // sql.js 返回的是数组，转换成对象
    if (result && Array.isArray(result)) {
        return {
            id: result[0],
            username: result[1],
            password: result[2],
            game_data: result[3],
            first_date: result[4],
            created_at: result[5]
        };
    }
    return result;
}

// 创建新用户
function createUser(username, hashedPassword) {
    const stmt = db.prepare("INSERT INTO users (username, password) VALUES (?, ?)");
    const result = stmt.run([username, hashedPassword]);
    saveDatabase();
    return result.lastInsertRowid;
}

function getUserGameData(userId) {
    const stmt = db.prepare("SELECT game_data, first_date FROM users WHERE id = ?");
    const result = stmt.get([userId]);
    
    // 处理数组格式返回
    let gameData = null;
    let firstDate = null;
    
    if (result && Array.isArray(result)) {
        gameData = result[0];
        firstDate = result[1];
    } else if (result) {
        gameData = result.game_data;
        firstDate = result.first_date;
    }
    
    if (gameData) {
        try {
            return JSON.parse(gameData);
        } catch (e) {
            return {};
        }
    }
    return {};
}

function saveUserGameData(userId, gameData, firstDate) {
    const gameDataStr = JSON.stringify(gameData);
    const stmt = db.prepare("UPDATE users SET game_data = ?, first_date = ? WHERE id = ?");
    stmt.run([gameDataStr, firstDate, userId]);
    saveDatabase();
}

function closeDatabase() {
    if (db) {
        saveDatabase();
        db.close();
    }
}

module.exports = {
    initDatabase,
    getDb,
    saveDatabase,
    closeDatabase,
    userExists,
    getUserByUsername,
    createUser,
    getUserGameData,
    saveUserGameData
};