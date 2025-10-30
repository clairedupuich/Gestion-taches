// ============================================
// PARTIE 1: Simulation API (Promises) - Pour tests locaux
// 第一部分：模拟API（Promise） - 用于本地测试
// ============================================
function simulateApiCall() {
    // (1) Retourner une nouvelle promesse / 返回一个新的Promise  Succès: resolve(data); Échec: reject(error)
    return new Promise((resolve, reject) => {
        console.log('Début de la simulation API... / API模拟开始...');
        
        // (2) Utiliser setTimeout pour simuler un délai réseau / 使用setTimeout模拟网络延迟 setTimeout(() => {}, 1000) - 模拟1秒网络延迟
        setTimeout(() => {
            // (4) Avoir une chance sur 10 de rejeter la promesse / 有十分之一的几率拒绝Promise
            const shouldFail = Math.random() < 0.1; // 10% de chance d'échec / 10%失败几率
            
            if (shouldFail) {
                // Rejeter la promesse avec une erreur / 用错误拒绝Promise
                const error = new Error('Erreur réseau simulée / 模拟网络错误');
                console.error('API call failed / API调用失败:', error.message);
                reject(error);
            } else {
                // (3) Résoudre la promesse avec des données fictives / 用模拟数据解析Promise
                const fakeTasks = [
                    { id: 1, text: 'Tâche exemple 1 / 示例任务1', completed: false },
                    { id: 2, text: 'Tâche exemple 2 / 示例任务2', completed: true },
                    { id: 3, text: 'Tâche exemple 3 / 示例任务3', completed: false }
                ];
                console.log('API call successful / API调用成功:', fakeTasks);
                resolve(fakeTasks);
            }
        }, 1000); // 1 seconde de délai / 1秒延迟
    });
}

// Utilisation de la fonction avec .then() et .catch() / 使用.then()和.catch()调用函数
// .then() - 处理成功情况
// .catch() - 处理错误情况
// .finally() - 无论成功失败都执行
// Test de la simulation locale / 本地模拟测试
function testLocalAPI() {
    // Appeler la fonction et gérer le résultat / 调用函数并处理结果
    simulateApiCall()
        .then(data => console.log('Simulation OK:', data))
        .catch(error => console.error('Simulation Error:', error))
        .finally(() => console.log('=== Appel API terminé === / === API调用结束 ==='));
}

// Exporter les fonctions pour utilisation dans d'autres fichiers / 导出函数供其他文件使用
// export { simulateApiCall, testLocalAPI };

// Test de la fonction API / 测试API函数
// testLocalAPI();




// 第二部分：Fetch API（Async/Await） - 用于真实API
// Fonction pour récupérer des tâches avec async/await / 使用async/await获取任务的函数
async function fetchTaskFromAPI() {
    const apiUrl = 'https://jsonplaceholder.typicode.com/todos/1';
    
    console.log('Début de la requête Fetch API... / Fetch API请求开始...');
    
    try {
        // Attendre la réponse / 等待响应
        const response = await fetch(apiUrl);
        
        console.log('📡 Réponse reçue, statut HTTP:', response.status);
        
        // Vérifier si la réponse HTTP est réussie / 检查HTTP响应是否成功
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status} - ${response.statusText} / HTTP错误: ${response.status} - ${response.statusText}`);
        }
        
        // Attendre le parsing JSON / 等待JSON解析
        const taskData = await response.json();
        
        // Afficher le titre de la tâche / 显示任务标题
        console.log('Tâche récupérée avec succès / 任务获取成功:');
        console.log('   Titre / 标题:', taskData.title);
        console.log('   Complétée / 完成状态:', taskData.completed);
        console.log('   ID utilisateur / 用户ID:', taskData.userId);
        
        return taskData;
        
    } catch (error) {
        // Gestion unifiée des erreurs / 统一的错误处理
        console.error('Erreur lors de la requête Fetch / Fetch请求错误:');
        
        if (error.name === 'TypeError') {
            console.error('   Problème de réseau ou CORS / 网络问题或CORS:', error.message);
        } else {
            console.error('   Erreur / 错误:', error.message);
        }
        
        // Propager l'erreur si nécessaire / 必要时传播错误
        throw error;
    } finally {
        console.log('=== Requête Fetch terminée === / === Fetch请求结束 ===');
    }
}

// Fonction pour tester avec une URL incorrecte / 使用错误URL测试的函数
async function testFetchWithError() {
    const wrongUrl = 'https://jsonplaceholder.typicode.com/nonexistent';
    
    console.log('Test avec URL incorrecte... / 使用错误URL测试...');
    
    try {
        const response = await fetch(wrongUrl);
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP ${response.status} / HTTP错误 ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Données reçues / 接收到的数据:', data);
        
    } catch (error) {
        console.error('Erreur capturée (test) / 捕获的错误(测试):', error.message);
    }
}

// Fonction pour récupérer plusieurs tâches / 获取多个任务的函数
async function fetchMultipleTasks() {
    const apiUrl = 'https://jsonplaceholder.typicode.com/todos?_limit=3';
    
    console.log('Récupération de plusieurs tâches... / 获取多个任务...');
    
    try {
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const tasks = await response.json();
        
        console.log(`${tasks.length} tâches récupérées / ${tasks.length}个任务获取成功:`);
        
        tasks.forEach((task, index) => {
            console.log(`   ${index + 1}. ${task.title} (${task.completed ? 'Terminée' : 'En cours'}) / (${task.completed ? '已完成' : '进行中'})`);
        });
        
        return tasks;
        
    } catch (error) {
        console.error('Erreur:', error.message);
        throw error;
    }
}

// Version encore plus concise avec gestion d'erreur externe / 更简洁的版本，外部错误处理
async function fetchTaskSimple(taskId = 1) {
    const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${taskId}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
}

// Exporter les nouvelles fonctions / 导出新函数



// ============================================
// FONCTIONS CRUD AVEC JSONPLACEHOLDER API
// 使用JSONPLACEHOLDER API的CRUD函数
// ============================================

// (1) Fonction pour récupérer toutes les tâches (GET) / 获取所有任务的函数 (GET)
async function getTasks() {
    const apiUrl = 'https://jsonplaceholder.typicode.com/todos?_limit=5';
    
    console.log('🔄 Récupération des tâches... / 获取任务中...');
    
    try {
        // Requête GET simple / 简单的GET请求
        const response = await fetch(apiUrl);
        
        console.log('📡 Statut de la réponse GET / GET响应状态:', response.status);
        
        // Vérifier si la réponse HTTP est réussie / 检查HTTP响应是否成功
        if (!response.ok) {
            throw new Error(`Erreur HTTP ${response.status}: ${response.statusText} / HTTP错误 ${response.status}: ${response.statusText}`);
        }
        
        // Convertir la réponse en JSON / 将响应转换为JSON
        const tasks = await response.json();
        
        // Afficher les résultats dans la console / 在控制台显示结果
        console.log('✅ Tâches récupérées avec succès / 任务获取成功:');
        console.log(`   Nombre de tâches / 任务数量: ${tasks.length}`);
        
        tasks.forEach((task, index) => {
            console.log(`   ${index + 1}. [${task.id}] ${task.title} - ${task.completed ? '✅ Terminée' : '⏳ En cours'} / ${task.completed ? '✅ 已完成' : '⏳ 进行中'}`);
        });
        
        return tasks;
        
    } catch (error) {
        // Gestion des erreurs réseau et serveur / 处理网络和服务器错误
        console.error('❌ Erreur lors de la récupération des tâches / 获取任务时错误:');
        
        if (error.name === 'TypeError') {
            console.error('   Problème de connexion réseau / 网络连接问题:', error.message);
        } else {
            console.error('   Erreur serveur / 服务器错误:', error.message);
        }
        
        throw error;
    }
}

// (2) Fonction pour ajouter une nouvelle tâche (POST) / 添加新任务的函数 (POST)
async function addTask(taskData) {
    const apiUrl = 'https://jsonplaceholder.typicode.com/todos';
    
    console.log('🔄 Ajout d\'une nouvelle tâche... / 添加新任务中...');
    console.log('   Données à envoyer / 要发送的数据:', taskData);
    
    try {
        // Configuration de la requête POST / POST请求配置
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Important pour JSON / JSON必须
            },
            body: JSON.stringify(taskData) // Convertir l'objet en chaîne JSON / 将对象转换为JSON字符串
        };
        
        const response = await fetch(apiUrl, options);
        
        console.log('📡 Statut de la réponse POST / POST响应状态:', response.status);
        
        // Vérifier la réponse HTTP / 检查HTTP响应
        if (!response.ok) {
            throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`);
        }
        
        // Convertir la réponse en JSON / 将响应转换为JSON
        const newTask = await response.json();
        
        console.log('✅ Tâche ajoutée avec succès / 任务添加成功:');
        console.log('   Tâche créée / 创建的任务:', newTask);
        
        return newTask;
        
    } catch (error) {
        // Gestion des erreurs / 错误处理
        console.error('❌ Erreur lors de l\'ajout de la tâche / 添加任务时错误:');
        
        if (error.name === 'TypeError') {
            console.error('   Problème de connexion réseau / 网络连接问题:', error.message);
        } else {
            console.error('   Erreur serveur / 服务器错误:', error.message);
        }
        
        throw error;
    }
}

// Fonction utilitaire pour tester les deux fonctions / 测试两个函数的工具函数
async function testCRUDFunctions() {
    console.log('🧪 === TEST DES FONCTIONS CRUD === / === CRUD函数测试 ===');
    
    try {
        // Test GET / 测试GET
        console.log('\n--- Test GET ---');
        const tasks = await getTasks();
        
        // Test POST / 测试POST
        console.log('\n--- Test POST ---');
        const newTaskData = {
            title: 'Ma nouvelle tâche de test / 我的新测试任务',
            completed: false,
            userId: 1
        };
        
        const newTask = await addTask(newTaskData);
        console.log('✅ Test CRUD terminé avec succès! / CRUD测试成功完成!');
        
    } catch (error) {
        console.error('❌ Test CRUD échoué / CRUD测试失败:', error.message);
    }
}

// Fonction pour ajouter une tâche simple / 添加简单任务的函数
async function addSimpleTask(taskTitle) {
    const taskData = {
        title: taskTitle,
        completed: false,
        userId: 1
    };
    
    return await addTask(taskData);
}

// ============================================
// EXPORTS ADDITIONNELS / 额外导出


// ============================================
// FONCTIONS CRUD COMPLÈTES AVEC ASYNC/AWAIT
// 完整的CRUD函数（使用Async/Await）
// ============================================

// (3) Fonction pour mettre à jour une tâche existante (PUT) / 更新现有任务的函数 (PUT)
async function updateTask(taskId, updatedData) {
    const apiUrl = `https://jsonplaceholder.typicode.com/todos/${taskId}`;
    
    console.log('Mise à jour de la tâche... / 更新任务中...', { taskId, updatedData });
    
    try {
        // Configuration de la requête PUT / PUT请求配置
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData)
        };
        
        const response = await fetch(apiUrl, options);
        
        console.log('Statut de la réponse PUT / PUT响应状态:', response.status);
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP ${response.status}: ${response.statusText} / HTTP错误 ${response.status}: ${response.statusText}`);
        }
        
        const updatedTask = await response.json();
        
        console.log('Tâche mise à jour avec succès / 任务更新成功:', updatedTask);
        
        return updatedTask;
        
    } catch (error) {
        console.error('Erreur lors de la mise à jour / 更新时错误:');
        
        if (error.name === 'TypeError') {
            console.error('Problème de connexion réseau / 网络连接问题:', error.message);
        } else {
            console.error('Erreur serveur / 服务器错误:', error.message);
        }
        
        throw error;
    }
}

// (4) Fonction pour supprimer une tâche (DELETE) / 删除任务的函数 (DELETE)
async function deleteTask(taskId) {
    const apiUrl = `https://jsonplaceholder.typicode.com/todos/${taskId}`;
    
    console.log('Suppression de la tâche... / 删除任务中...', taskId);
    
    try {
        // Configuration de la requête DELETE / DELETE请求配置
        const options = {
            method: 'DELETE'
        };
        
        const response = await fetch(apiUrl, options);
        
        console.log('Statut de la réponse DELETE / DELETE响应状态:', response.status);
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`);
        }
        
        console.log('Tâche supprimée avec succès / 任务删除成功, ID:', taskId);
        
        return { success: true, id: taskId };
        
    } catch (error) {
        console.error('Erreur lors de la suppression / 删除时错误:');
        
        if (error.name === 'TypeError') {
            console.error('Problème de connexion réseau / 网络连接问题:', error.message);
        } else {
            console.error('Erreur serveur / 服务器错误:', error.message);
        }
        
        throw error;
    }
}

// (5) Fonction pour exécuter plusieurs requêtes en parallèle / 并行执行多个请求的函数
async function parallelRequests() {
    console.log('Début des requêtes parallèles... / 开始并行请求...');
    
    try {
        // Créer plusieurs promesses pour les requêtes / 创建多个请求的Promise
        const promises = [
            getTasks(),                                      // Récupérer les tâches / 获取任务
            fetchTaskSimple(1),                             // Récupérer une tâche spécifique / 获取特定任务
            addTask({                                        // Ajouter une nouvelle tâche / 添加新任务
                title: 'Tâche créée en parallèle / 并行创建的任务',
                completed: false,
                userId: 1
            })
        ];
        
        // Exécuter toutes les requêtes en parallèle / 并行执行所有请求
        const results = await Promise.all(promises);
        
        console.log('Toutes les requêtes parallèles terminées / 所有并行请求完成:');
        console.log('Nombre de résultats / 结果数量:', results.length);
        
        // Traiter les résultats / 处理结果
        results.forEach((result, index) => {
            console.log(`Résultat ${index + 1} / 结果 ${index + 1}:`, result);
        });
        
        return results;
        
    } catch (error) {
        console.error('Erreur dans les requêtes parallèles / 并行请求错误:');
        
        // Gestion d'erreur détaillée / 详细错误处理
        if (error.name === 'TypeError') {
            console.error('Erreur de réseau / 网络错误:', error.message);
        } else if (error.message.includes('HTTP')) {
            console.error('Erreur HTTP / HTTP错误:', error.message);
        } else {
            console.error('Erreur inattendue / 意外错误:', error.message);
        }
        
        throw error;
    }
}

// (6) Fonction avec gestion d'erreurs robuste pour l'utilisateur / 为用户提供健壮错误处理的函数
async function getTasksWithUserFeedback() {
    try {
        const tasks = await getTasks();
        
        // Message de succès pour l'utilisateur / 给用户的成功消息
        console.log('Opération réussie: Tâches chargées avec succès / 操作成功: 任务加载成功');
        return tasks;
        
    } catch (error) {
        // Messages d'erreur informatifs pour l'utilisateur / 给用户的信息性错误消息
        let userMessage = '';
        
        if (error.name === 'TypeError') {
            userMessage = 'Problème de connexion. Vérifiez votre connexion Internet. / 连接问题，请检查网络连接';
        } else if (error.message.includes('404')) {
            userMessage = 'Service non disponible. Réessayez plus tard. / 服务不可用，请稍后重试';
        } else if (error.message.includes('500')) {
            userMessage = 'Erreur du serveur. Notre équipe a été notifiée. / 服务器错误，我们的团队已收到通知';
        } else {
            userMessage = 'Une erreur inattendue est survenue. / 发生意外错误';
        }
        
        console.error('Message pour l utilisateur / 用户消息:', userMessage);
        console.error('Erreur technique / 技术错误:', error.message);
        
        // Ici on pourrait afficher ce message dans l'interface utilisateur
        // 这里可以在用户界面显示这些消息
        
        throw new Error(userMessage);
    }
}

// ============================================
// EXPORTS FINAUX / 最终导出
// ============================================

window.updateTask = updateTask;
window.deleteTask = deleteTask;
window.parallelRequests = parallelRequests;
window.getTasksWithUserFeedback = getTasksWithUserFeedback;

// Assurez-vous que tous les exports sont ici / 确保所有导出都在这里
window.simulateApiCall = simulateApiCall;
window.testLocalAPI = testLocalAPI;
window.fetchTaskFromAPI = fetchTaskFromAPI;
window.testFetchWithError = testFetchWithError;
window.fetchMultipleTasks = fetchMultipleTasks;
window.fetchTaskSimple = fetchTaskSimple;
window.getTasks = getTasks;
window.addTask = addTask;
window.testCRUDFunctions = testCRUDFunctions;
window.addSimpleTask = addSimpleTask;


// 测试 GET 获取任务
// await getTasks();

// const tasks = await getTasks();
// console.log('完整数据:', tasks);
// 测试 POST 添加任务
// await addTask({
//     title: "Ma tâche de test",
//     completed: false,
//     userId: 1
// });

// 测试更新任务
// await updateTask(1, { title: 'Tâche mise à jour', completed: true });

// 测试删除任务  
// await deleteTask(1);

// 测试并行请求
// await parallelRequests();

// 测试用户友好的错误处理
// await getTasksWithUserFeedback();