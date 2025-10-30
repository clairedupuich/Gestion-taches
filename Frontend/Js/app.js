// (1) Récupérer les références aux éléments clés / 获取关键元素引用
const taskForm = document.querySelector('#taskForm');
const taskInput = document.querySelector('#taskTitle');
const tasksList = document.querySelector('#tasksList');

// (2) Ajouter un écouteur sur le formulaire / 在表单上添加监听器
taskForm.addEventListener('submit', function(event) {
    // Empêcher le comportement par défaut du formulaire / 阻止表单默认行为
    event.preventDefault();
    
    // (3) Récupérer la valeur saisie / 获取输入的值trim()方法是删除前后空白等
    const taskText = taskInput.value.trim();
    
    // Vérifier que le champ n'est pas vide / 检查字段是否为空
    if (taskText === '') {
        return;
    }
    
    // Afficher temporairement dans la console / 在控制台临时显示
    console.log('Tâche saisie:', taskText);
    
    // Créer un nouvel élément de tâche / 创建新的任务元素
    createTaskElement(taskText);
    
    // Vider le champ de saisie après soumission / 提交后清空输入框
    taskInput.value = '';
});

// Fonction pour créer un élément de tâche / 创建任务元素的函数
function createTaskElement(taskText) {
    // Créer l'élément li / 创建 li 元素
    const taskItem = document.createElement('li');
    taskItem.classList.add('task'); // Ajouter la classe CSS / 添加CSS类
    
    // Créer la case à cocher / 创建复选框
    const checkbox = document.createElement('input');
    checkbox.setAttribute('type', 'checkbox');
    checkbox.classList.add('task-checkbox');
    
    // Créer le texte de la tâche / 创建任务文本
    const taskContent = document.createElement('span');
    taskContent.classList.add('task-content');
    taskContent.textContent = taskText;
    
    // Créer le bouton de suppression / 创建删除按钮
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('btn-icon', 'btn-delete');
    deleteButton.textContent = 'Supprimer 🗑️'; // Icône corbeille / 垃圾桶图标
    deleteButton.setAttribute('title', 'Supprimer la tâche'); // 删除任务
    
    // Ajouter l'événement pour la case à cocher / 为复选框添加事件
    checkbox.addEventListener('change', function() {
        // Basculer la classe "task-completed" / 切换 "task-completed" 类
        taskItem.classList.toggle('task-completed', this.checked);
        console.log('Tâche marquée comme terminée:', this.checked); // 任务标记为完成
    });
    // === ANCIENNE MÉTHODE - 旧方法 (commentée) ===
    // Ajouter l'événement pour le bouton de suppression / 为删除按钮添加事件
    // deleteButton.addEventListener('click', function() {
    //     taskItem.remove(); // Supprimer l'élément / 删除元素
    //     console.log('Tâche supprimée:', taskText); // 任务已删除
    // });
    
    // Assembler tous les éléments / 组装所有元素
    taskItem.appendChild(checkbox);
    taskItem.appendChild(taskContent);
    taskItem.appendChild(deleteButton);
    
    // Ajouter à la liste / 添加到列表
    tasksList.appendChild(taskItem);
    
    console.log('Nouvelle tâche créée:', taskText); // 新任务已创建
}

// === NOUVELLE MÉTHODE - 新方法 ===
// Délégation d'événements pour la suppression / 事件委托处理删除
tasksList.addEventListener('click', function(event) {
    // (1) Détecter quel bouton a été cliqué / 检测哪个按钮被点击
    const clickedElement = event.target;
    
    // (2) Vérifier si c'est un bouton de suppression / 检查是否是删除按钮
    if (clickedElement.classList.contains('btn-delete')) {
        // (3) Identifier la tâche correspondante / 识别对应的任务
        const taskItem = clickedElement.closest('li');
        const taskText = taskItem.querySelector('.task-content').textContent;
        
        // (4) Supprimer l'élément du DOM / 从DOM中删除元素
        taskItem.remove();
        
        // Mettre à jour les données de l'application / 更新应用程序数据
        console.log('Tâche supprimée via délégation:', taskText); // 通过委托删除任务
        
        // Empêcher la propagation si nécessaire / 必要时阻止事件传播
        event.stopPropagation();
    }
});