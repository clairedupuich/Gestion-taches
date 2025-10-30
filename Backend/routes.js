// Routes API pour la gestion des tâches / 任务管理的API路由
// HTTP 接口层. 
// 主要作用：
// 定义 RESTful API 端点
// 处理 HTTP 请求和响应
// 连接前端请求与后端逻辑
// 错误处理和状态码管理

const express = require('express');
const router = express.Router();
const taskModel = require('./model');


// Middleware pour parser le JSON / 解析JSON的中间件
router.use(express.json());


// 1. Récupérer toutes les tâches / 获取所有任务
router.get('/tasks', (req, res) => {
    try {
        const tasks = taskModel.getAllTasks();
        
        res.status(200).json({
            success: true,
            data: tasks,
            count: tasks.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: {
                code: 'SERVER_ERROR',
                message: 'Erreur interne du serveur / 服务器内部错误'
            }
        });
    }
});

// 2. Récupérer une tâche spécifique / 获取特定任务  路由路径里的冒号 : 表示路径参数（Route Parameter）
router.get('/tasks/:id', (req, res) => {
    try {
        const task = taskModel.getTaskById(req.params.id);
        
        if (!task) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'TASK_NOT_FOUND',
                    message: `La tâche avec l'ID ${req.params.id} n'a pas été trouvée / 未找到ID为${req.params.id}的任务`
                }
            });
        }

        res.status(200).json({
            success: true,
            data: task
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: {
                code: 'SERVER_ERROR',
                message: 'Erreur interne du serveur / 服务器内部错误'
            }
        });
    }
});

// 3. Créer une nouvelle tâche / 创建新任务
router.post('/tasks', (req, res) => {
    try {
        const { title, description, completed } = req.body;

        // Validation des données / 数据验证
        if (!title || title.trim() === '') {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Le champ titre est requis / 标题字段是必需的',
                    details: {
                        field: 'title',
                        constraint: 'required'
                    }
                }
            });
        }

        if (title.length > 255) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Le titre ne doit pas dépasser 255 caractères / 标题不能超过255个字符',
                    details: {
                        field: 'title',
                        constraint: 'max_length'
                    }
                }
            });
        }

        const newTask = taskModel.createTask({
            title: title.trim(),
            description: description ? description.trim() : '',
            completed: completed || false
        });

        res.status(201).json({
            success: true,
            message: 'Tâche créée avec succès / 任务创建成功',
            data: newTask
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: {
                code: 'SERVER_ERROR',
                message: 'Erreur interne du serveur / 服务器内部错误'
            }
        });
    }
});

// 4. Mettre à jour une tâche / 更新任务
router.put('/tasks/:id', (req, res) => {
    try {
        const { title, description, completed } = req.body;
        const taskId = req.params.id;

        // Vérifier si la tâche existe / 检查任务是否存在
        const existingTask = taskModel.getTaskById(taskId);
        if (!existingTask) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'TASK_NOT_FOUND',
                    message: `La tâche avec l'ID ${taskId} n'a pas été trouvée / 未找到ID为${taskId}的任务`
                }
            });
        }

        // Validation / 验证
        if (!title || title.trim() === '') {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Le champ titre est requis / 标题字段是必需的'
                }
            });
        }

        const updatedTask = taskModel.updateTask(taskId, {
            title: title.trim(),
            description: description ? description.trim() : existingTask.description,
            completed: completed !== undefined ? completed : existingTask.completed
        });

        res.status(200).json({
            success: true,
            message: 'Tâche mise à jour avec succès / 任务更新成功',
            data: updatedTask
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: {
                code: 'SERVER_ERROR',
                message: 'Erreur interne du serveur / 服务器内部错误'
            }
        });
    }
});

// 5. Supprimer une tâche / 删除任务
router.delete('/tasks/:id', (req, res) => {
    try {
        const taskId = req.params.id;
        const deletedTask = taskModel.deleteTask(taskId);

        if (!deletedTask) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'TASK_NOT_FOUND',
                    message: `La tâche avec l'ID ${taskId} n'a pas été trouvée / 未找到ID为${taskId}的任务`
                }
            });
        }

        res.status(200).json({
            success: true,
            message: 'Tâche supprimée avec succès / 任务删除成功',
            data: { id: deletedTask.id }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: {
                code: 'SERVER_ERROR',
                message: 'Erreur interne du serveur / 服务器内部错误'
            }
        });
    }
});

// 6. Marquer une tâche comme terminée / 标记任务为完成
router.patch('/tasks/:id/complete', (req, res) => {
    try {
        const taskId = req.params.id;
        const completedTask = taskModel.markTaskCompleted(taskId);

        if (!completedTask) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'TASK_NOT_FOUND',
                    message: `La tâche avec l'ID ${taskId} n'a pas été trouvée / 未找到ID为${taskId}的任务`
                }
            });
        }

        res.status(200).json({
            success: true,
            message: 'Tâche marquée comme terminée / 任务标记为完成',
            data: {
                id: completedTask.id,
                completed: completedTask.completed,
                updatedAt: completedTask.updatedAt
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: {
                code: 'SERVER_ERROR',
                message: 'Erreur interne du serveur / 服务器内部错误'
            }
        });
    }
});

//这个命令是 Node.js 的模块导出机制，它在路由文件中是必需的。
// 作用是将创建好的路由器实例"暴露"出去，让其他文件能够导入和使用它。
module.exports = router;