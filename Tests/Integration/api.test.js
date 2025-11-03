// 此文件终端运行命令是  npx jest Tests/Integration/
//Tests/Integration/api.test.js
// Tests d'intégration pour les endpoints API / API端点集成测试

const request = require('supertest');
const express = require('express');
const taskRoutes = require('../../Backend/routes');

// Créer une instance Express pour les tests / 为测试创建Express实例
const app = express();
app.use(express.json());
app.use('/api', taskRoutes);

describe('🔗 Tests d\'Intégration - API Endpoints', () => {
    let createdTaskId;

    // 1. Test GET /api/tasks
    test('GET /api/tasks retourne 200 et la liste des tâches', async () => {
        const response = await request(app)
            .get('/api/tasks')
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(typeof response.body.count).toBe('number');
        
        console.log('✅ GET /api/tasks - Succès, tâches trouvées:', response.body.count);
    });

    // 2. Test POST /api/tasks
    test('POST /api/tasks crée une nouvelle tâche et retourne 201', async () => {
        const newTask = {
            title: 'Tâche de test intégration',
            description: 'Description pour test d\'intégration',
            completed: false
        };

        const response = await request(app)
            .post('/api/tasks')
            .send(newTask)
            .expect('Content-Type', /json/)
            .expect(201);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data.title).toBe(newTask.title);
        expect(response.body.data.description).toBe(newTask.description);
        expect(response.body.data.completed).toBe(false);

        // Sauvegarder l'ID pour les tests suivants / 保存ID用于后续测试
        createdTaskId = response.body.data.id;
        
        console.log('✅ POST /api/tasks - Tâche créée avec ID:', createdTaskId);
    });

    // 3. Test GET /api/tasks/:id
    test('GET /api/tasks/:id retourne une tâche spécifique', async () => {
        const response = await request(app)
            .get(`/api/tasks/${createdTaskId}`)
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(createdTaskId);
        expect(response.body.data.title).toBe('Tâche de test intégration');
        
        console.log('✅ GET /api/tasks/:id - Tâche trouvée:', response.body.data.title);
    });

    // 4. Test PUT /api/tasks/:id
    test('PUT /api/tasks/:id met à jour une tâche existante', async () => {
        const updatedData = {
            title: 'Tâche mise à jour intégration',
            description: 'Description mise à jour',
            completed: true
        };

        const response = await request(app)
            .put(`/api/tasks/${createdTaskId}`)
            .send(updatedData)
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.title).toBe(updatedData.title);
        expect(response.body.data.description).toBe(updatedData.description);
        expect(response.body.data.completed).toBe(true);
        
        console.log('✅ PUT /api/tasks/:id - Tâche mise à jour');
    });

    // 5. Test DELETE /api/tasks/:id
    test('DELETE /api/tasks/:id supprime une tâche', async () => {
        const response = await request(app)
            .delete(`/api/tasks/${createdTaskId}`)
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(createdTaskId);
        
        console.log('✅ DELETE /api/tasks/:id - Tâche supprimée');
    });

    // 6. Test d'erreur - Tâche non trouvée
    test('GET /api/tasks/:id inexistant retourne 404', async () => {
        const response = await request(app)
            .get('/api/tasks/9999')
            .expect('Content-Type', /json/)
            .expect(404);

        expect(response.body.success).toBe(false);
        expect(response.body.error.code).toBe('TASK_NOT_FOUND');
        
        console.log('✅ Gestion d\'erreur 404 - Comportement correct');
    });

    // 7. Test de validation - Titre requis
    test('POST /api/tasks sans titre retourne erreur 400', async () => {
        const invalidTask = {
            description: 'Tâche sans titre',
            completed: false
        };

        const response = await request(app)
            .post('/api/tasks')
            .send(invalidTask)
            .expect('Content-Type', /json/)
            .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.error.code).toBe('VALIDATION_ERROR');
        
        console.log('✅ Validation d\'erreur - Titre requis');
    });

    // 8. Test PATCH /api/tasks/:id/complete
    test('PATCH /api/tasks/:id/complete marque une tâche comme terminée', async () => {
        // D'abord créer une tâche pour ce test / 先为此测试创建一个任务
        const newTask = {
            title: 'Tâche à compléter',
            description: 'Test de complétion',
            completed: false
        };

        const createResponse = await request(app)
            .post('/api/tasks')
            .send(newTask);

        const taskId = createResponse.body.data.id;

        const response = await request(app)
            .patch(`/api/tasks/${taskId}/complete`)
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.completed).toBe(true);
        expect(response.body.data.id).toBe(taskId);
        
        console.log('✅ PATCH /api/tasks/:id/complete - Tâche marquée comme terminée');
    });
});

describe('🔗 Tests de Performance API', () => {
    test('GET /api/tasks répond en moins de 100ms', async () => {
        const startTime = Date.now();
        
        await request(app)
            .get('/api/tasks')
            .expect(200);

        const responseTime = Date.now() - startTime;
        expect(responseTime).toBeLessThan(100);
        
        console.log(`✅ Performance - Temps de réponse: ${responseTime}ms`);
    });
});

console.log('🚀 Tests d\'intégration API prêts / API集成测试准备就绪');