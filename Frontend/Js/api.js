// Fonction pour simuler un appel API / 用于模拟API调用的函数
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
function testApiCall() {
    console.log('=== Test de la simulation API === / === API模拟测试 ===');
    
    // Appeler la fonction et gérer le résultat / 调用函数并处理结果
    simulateApiCall()
        .then(tasks => {
            // Gérer le succès / 处理成功情况
            console.log('Données reçues avec succès / 数据接收成功:', tasks);
            console.log('Nombre de tâches reçues / 接收到的任务数量:', tasks.length);
            
            // Traiter les données / 处理数据
            tasks.forEach(task => {
                console.log(`- ${task.text} (${task.completed ? 'Terminée' : 'En cours'}) / (${task.completed ? '已完成' : '进行中'})`);
            });
        })
        .catch(error => {
            // Gérer les erreurs / 处理错误情况
            console.error('❌ Erreur lors de l\'appel API / API调用错误:', error.message);
            console.log('Veuillez réessayer plus tard. / 请稍后重试。');
        })
        .finally(() => {
            // Code exécuté dans tous les cas / 无论成功失败都会执行的代码
            console.log('=== Appel API terminé === / === API调用结束 ===');
        });
}

// Exporter les fonctions pour utilisation dans d'autres fichiers / 导出函数供其他文件使用
export { simulateApiCall, testApiCall };

// Test de la fonction API / 测试API函数
// testApiCall();





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
window.fetchTaskFromAPI = fetchTaskFromAPI;
window.testFetchWithError = testFetchWithError;
window.fetchMultipleTasks = fetchMultipleTasks;
window.fetchTaskSimple = fetchTaskSimple;