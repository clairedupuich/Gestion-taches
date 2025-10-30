// Backend/model.js
// Modèle de données pour les tâches / 任务数据模型

class TaskModel {
    constructor() {
        this.tasks = [
            {
                id: 1,
                title: 'Acheter du lait',
                description: 'Acheter du lait au supermarché',
                completed: false,
                createdAt: new Date('2024-01-15T10:30:00Z'),
                updatedAt: new Date('2024-01-15T10:30:00Z')
            },
            {
                id: 2,
                title: 'Faire les devoirs',
                description: 'Terminer le projet JavaScript',
                completed: true,
                createdAt: new Date('2024-01-14T15:20:00Z'),
                updatedAt: new Date('2024-01-15T09:15:00Z')
            }
        ];
        this.nextId = 3; // Prochain ID à attribuer / 下一个分配的ID
    }

    // Récupérer toutes les tâches / 获取所有任务
    getAllTasks() {
        return this.tasks;
    }

    // Récupérer une tâche par ID / 根据ID获取任务
    getTaskById(id) {
        const taskId = parseInt(id);
        return this.tasks.find(task => task.id === taskId);
    }

    // Créer une nouvelle tâche / 创建新任务
    createTask(taskData) {
        const newTask = {
            id: this.nextId++,
            title: taskData.title,
            description: taskData.description || '',
            completed: taskData.completed || false,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        this.tasks.push(newTask);
        return newTask;
    }

    // Mettre à jour une tâche / 更新任务
    updateTask(id, updateData) {
        const taskId = parseInt(id);
        const taskIndex = this.tasks.findIndex(task => task.id === taskId);
        
        if (taskIndex === -1) {
            return null;
        }

        // Mettre à jour seulement les champs fournis / 只更新提供的字段
        this.tasks[taskIndex] = {
            ...this.tasks[taskIndex],
            ...updateData,
            updatedAt: new Date()
        };

        return this.tasks[taskIndex];
    }

    // Supprimer une tâche / 删除任务
    deleteTask(id) {
        const taskId = parseInt(id);
        const taskIndex = this.tasks.findIndex(task => task.id === taskId);
        
        if (taskIndex === -1) {
            return null;
        }

        const deletedTask = this.tasks.splice(taskIndex, 1)[0];
        return deletedTask;
    }

    // Marquer une tâche comme terminée / 标记任务为完成
    markTaskCompleted(id) {
        const taskId = parseInt(id);
        const taskIndex = this.tasks.findIndex(task => task.id === taskId);
        
        if (taskIndex === -1) {
            return null;
        }

        this.tasks[taskIndex].completed = true;
        this.tasks[taskIndex].updatedAt = new Date();

        return this.tasks[taskIndex];
    }
}

// Exporter une instance du modèle / 导出模型实例
module.exports = new TaskModel();