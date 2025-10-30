// Backend/server.js
// Serveur principal de l'application / 应用程序主服务器

const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware CORS pour autoriser les requêtes du frontend / CORS中间件允许前端请求
app.use(cors({
    origin: 'http://localhost:5500', // URL du frontend Live Server / 前端Live Server的URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware pour les logs des requêtes / 请求日志中间件
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Routes de l'API / API路由
app.use('/api', taskRoutes);

// Route de santé pour tester le serveur / 健康检查路由测试服务器
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Serveur en fonctionnement / 服务器运行正常',
        timestamp: new Date().toISOString()
    });
});



// Middleware de gestion d'erreurs global / 全局错误处理中间件
app.use((error, req, res, next) => {
    console.error('Erreur non gérée / 未处理的错误:', error);
    res.status(500).json({
        success: false,
        error: {
            code: 'INTERNAL_ERROR',
            message: 'Erreur interne du serveur / 服务器内部错误'
        }
    });
});


// 404 处理中间件 - 放在所有路由之后. Gestion des routes non trouvées / 处理未找到的路由
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: {
            code: 'ROUTE_NOT_FOUND',
            message: `Route ${req.method} ${req.path} non trouvée`
        }
    });
});

// Démarrer le serveur / 启动服务器
app.listen(PORT, () => {
    console.log(`=== Serveur démarré === / === 服务器已启动 ===`);
    console.log(`Serveur en écoute sur le port ${PORT} / 服务器监听端口 ${PORT}`);
    console.log(`URL de l'API: http://localhost:${PORT}/api / API地址: http://localhost:${PORT}/api`);
    console.log(`Route de santé: http://localhost:${PORT}/health / 健康检查: http://localhost:${PORT}/health`);
    console.log(`Pour arrêter le serveur: Ctrl+C / 停止服务器: Ctrl+C`);
});

module.exports = app;