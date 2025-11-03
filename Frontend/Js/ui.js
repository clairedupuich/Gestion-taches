// 在此项目里不是很必要，因为app.js已经实现了基本功能。
// Frontend/Js/ui.js
// Module pour les opérations d'interface utilisateur / 用户界面操作模块

/**
 * Affiche un message de notification à l'utilisateur / 向用户显示通知消息
 * @param {string} message - Le message à afficher / 要显示的消息
 * @param {string} type - Le type de message (success, error, warning) / 消息类型
 */
function showNotification(message, type = 'success') {
    // Créer l'élément de notification / 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Styles pour la notification / 通知样式
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 6px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        max-width: 300px;
    `;
    
    // Couleurs selon le type / 根据类型设置颜色
    const colors = {
        success: '#27ae60',
        error: '#e74c3c',
        warning: '#f39c12',
        info: '#3498db'
    };
    
    notification.style.backgroundColor = colors[type] || colors.info;
    
    // Ajouter au DOM / 添加到DOM
    document.body.appendChild(notification);
    
    // Animation d'entrée / 进入动画
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Supprimer après 3 secondes / 3秒后移除
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

/**
 * Met à jour le compteur de tâches / 更新任务计数器
 * @param {number} total - Nombre total de tâches / 总任务数
 * @param {number} completed - Nombre de tâches terminées / 已完成任务数
 */
function updateTaskCounter(total, completed) {
    let counterElement = document.getElementById('taskCounter');
    
    if (!counterElement) {
        // Créer l'élément compteur s'il n'existe pas / 如果计数器元素不存在则创建
        counterElement = document.createElement('div');
        counterElement.id = 'taskCounter';
        counterElement.style.cssText = `
            margin: 10px 0;
            padding: 8px 12px;
            background: #f8f9fa;
            border-radius: 6px;
            font-size: 0.9em;
            color: #6c757d;
        `;
        
        const tasksSection = document.querySelector('.tasks-section');
        if (tasksSection) {
            tasksSection.insertBefore(counterElement, tasksSection.querySelector('.tasks-container'));
        }
    }
    
    counterElement.textContent = `Tâches: ${completed} terminée(s) sur ${total} total / 任务: ${completed} 已完成，总计 ${total}`;
}

/**
 * Affiche un état de chargement / 显示加载状态
 * @param {boolean} show - Afficher ou cacher le chargement / 显示或隐藏加载状态
 */
function showLoading(show = true) {
    let loadingElement = document.getElementById('loadingIndicator');
    
    if (show) {
        if (!loadingElement) {
            loadingElement = document.createElement('div');
            loadingElement.id = 'loadingIndicator';
            loadingElement.innerHTML = `
                <div style="text-align: center; padding: 20px;">
                    <div style="
                        width: 40px;
                        height: 40px;
                        border: 4px solid #f3f3f3;
                        border-top: 4px solid #3498db;
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                        margin: 0 auto;
                    "></div>
                    <p style="margin-top: 10px; color: #666;">Chargement... / 加载中...</p>
                </div>
            `;
            
            // Ajouter les styles d'animation / 添加动画样式
            const style = document.createElement('style');
            style.textContent = `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
            
            const tasksContainer = document.querySelector('.tasks-container');
            if (tasksContainer) {
                tasksContainer.appendChild(loadingElement);
            }
        }
    } else {
        if (loadingElement) {
            loadingElement.remove();
        }
    }
}

/**
 * Formate la date pour l'affichage / 格式化日期用于显示
 * @param {string} dateString - Date au format ISO / ISO格式的日期
 * @returns {string} Date formatée / 格式化后的日期
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Filtre les tâches affichées / 过滤显示的任务
 * @param {string} filter - Type de filtre (all, active, completed) / 过滤类型
 */
function filterTasks(filter) {
    const tasks = document.querySelectorAll('.task');
    
    tasks.forEach(task => {
        switch (filter) {
            case 'active':
                task.style.display = task.classList.contains('task-completed') ? 'none' : 'flex';
                break;
            case 'completed':
                task.style.display = task.classList.contains('task-completed') ? 'flex' : 'none';
                break;
            default: // 'all'
                task.style.display = 'flex';
        }
    });
}

/**
 * Crée les boutons de filtre / 创建过滤按钮
 */
function createFilterButtons() {
    const filtersContainer = document.createElement('div');
    filtersContainer.className = 'task-filters';
    filtersContainer.style.cssText = `
        display: flex;
        gap: 10px;
        margin-bottom: 15px;
        justify-content: center;
    `;
    
    const filters = [
        { key: 'all', text: 'Toutes / 全部' },
        { key: 'active', text: 'En cours / 进行中' },
        { key: 'completed', text: 'Terminées / 已完成' }
    ];
    
    filters.forEach(filter => {
        const button = document.createElement('button');
        button.textContent = filter.text;
        button.className = 'filter-btn';
        button.setAttribute('data-filter', filter.key);
        
        button.style.cssText = `
            padding: 8px 16px;
            border: 2px solid #3498db;
            background: white;
            color: #3498db;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.3s ease;
        `;
        
        button.addEventListener('click', () => {
            // Mettre à jour le style des boutons / 更新按钮样式
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.style.background = 'white';
                btn.style.color = '#3498db';
            });
            
            button.style.background = '#3498db';
            button.style.color = 'white';
            
            // Appliquer le filtre / 应用过滤器
            filterTasks(filter.key);
        });
        
        filtersContainer.appendChild(button);
    });
    
    // Activer le filtre "Toutes" par défaut / 默认激活"全部"过滤器
    filtersContainer.querySelector('[data-filter="all"]').style.background = '#3498db';
    filtersContainer.querySelector('[data-filter="all"]').style.color = 'white';
    
    const tasksSection = document.querySelector('.tasks-section');
    if (tasksSection) {
        const existingFilters = tasksSection.querySelector('.task-filters');
        if (existingFilters) {
            existingFilters.remove();
        }
        tasksSection.insertBefore(filtersContainer, tasksSection.querySelector('.tasks-container'));
    }
}

/**
 * Initialise les fonctionnalités UI / 初始化UI功能
 */
function initUI() {
    createFilterButtons();
    console.log('UI module initialisé / UI模块已初始化');
}

// Exporter les fonctions pour utilisation dans app.js / 导出函数供app.js使用
window.ui = {
    showNotification,
    updateTaskCounter,
    showLoading,
    formatDate,
    filterTasks,
    createFilterButtons,
    initUI
};

// Initialiser l'UI quand le DOM est chargé / DOM加载完成后初始化UI
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUI);
} else {
    initUI();
}