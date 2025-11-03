// Tests/Unit/model.test.js
// Tests unitaires pour le modèle de tâches / 任务模型单元测试

const TaskModel = require('../../Backend/model');

// Données de test locales / 本地测试数据
const testTasks = [
    {
        id: 1,
        title: "Tâche test 1",
        description: "Description test 1",
        completed: false,
        createdAt: new Date('2024-01-15T10:00:00Z'),
        updatedAt: new Date('2024-01-15T10:00:00Z')
    },
    {
        id: 2, 
        title: "Tâche test 2",
        description: "Description test 2",
        completed: true,
        createdAt: new Date('2024-01-14T15:00:00Z'),
        updatedAt: new Date('2024-01-15T09:00:00Z')
    }
];

// Réinitialiser le modèle avant chaque test / 每个测试前重置模型
beforeEach(() => {
    TaskModel.tasks = JSON.parse(JSON.stringify(testTasks)); // Deep copy / 深拷贝
    TaskModel.nextId = 3;
});

describe('📝 Tests Unitaires - Modèle de Tâches', () => {
    // 1. Test de Création de Tâche / 任务创建测试
    test('create_task_with_valid_data_returns_new_task', () => {
        const taskData = {
            title: "Nouvelle tâche unit test",
            description: "Description unit test",
            completed: false
        };
        
        const newTask = TaskModel.createTask(taskData);
        
        expect(newTask.id).toBe(3);
        expect(newTask.title).toBe("Nouvelle tâche unit test");
        expect(newTask.description).toBe("Description unit test");
        expect(newTask.completed).toBe(false);
        expect(newTask.createdAt).toBeInstanceOf(Date);
        expect(newTask.updatedAt).toBeInstanceOf(Date);
        expect(TaskModel.tasks).toHaveLength(3);
    });

    // 2. Test de Récupération par ID / 按ID获取测试
    test('get_existing_task_by_id_returns_correct_task', () => {
        const task = TaskModel.getTaskById(1);
        
        expect(task).toBeDefined();
        expect(task.id).toBe(1);
        expect(task.title).toBe("Tâche test 1");
    });

    test('get_nonexistent_task_by_id_returns_undefined', () => {
        const task = TaskModel.getTaskById(999);
        expect(task).toBeUndefined();
    });

    // 3. Test de Mise à Jour / 更新测试
    test('update_existing_task_with_new_data_returns_updated_task', () => {
        const updateData = {
            title: "Titre mis à jour unit test",
            completed: true
        };
        
        const updatedTask = TaskModel.updateTask(1, updateData);
        
        expect(updatedTask).toBeDefined();
        expect(updatedTask.title).toBe("Titre mis à jour unit test");
        expect(updatedTask.completed).toBe(true);
        expect(updatedTask.updatedAt).not.toBe(updatedTask.createdAt);
    });

    test('update_nonexistent_task_returns_null', () => {
        const result = TaskModel.updateTask(999, { title: "Test" });
        expect(result).toBeNull();
    });

    // 4. Test de Suppression / 删除测试
    test('delete_existing_task_returns_deleted_task', () => {
        const deletedTask = TaskModel.deleteTask(1);
        
        expect(deletedTask).toBeDefined();
        expect(deletedTask.id).toBe(1);
        expect(TaskModel.tasks).toHaveLength(1);
        expect(TaskModel.getTaskById(1)).toBeUndefined();
    });

    test('delete_nonexistent_task_returns_null', () => {
        const result = TaskModel.deleteTask(999);
        expect(result).toBeNull();
        expect(TaskModel.tasks).toHaveLength(2);
    });

    // 5. Test de Validation / 验证测试
    test('create_task_with_empty_title_still_works', () => {
        const invalidData = {
            title: "", // Titre vide / 空标题
            description: "Description valide"
        };
        
        const newTask = TaskModel.createTask(invalidData);
        
        expect(newTask.title).toBe("");
        expect(newTask.id).toBeDefined();
    });
});

// Tests supplémentaires / 补充测试
describe('📊 Tests Complémentaires', () => {
    test('get_all_tasks_returns_complete_list', () => {
        const allTasks = TaskModel.getAllTasks();
        expect(allTasks).toHaveLength(2);
        expect(Array.isArray(allTasks)).toBe(true);
    });

    test('mark_task_completed_updates_status', () => {
        const completedTask = TaskModel.markTaskCompleted(1);
        expect(completedTask.completed).toBe(true);
        
        const taskInList = TaskModel.getTaskById(1);
        expect(taskInList.completed).toBe(true);
    });
});

console.log('✅ Tests unitaires du modèle prêts / 模型单元测试准备就绪');