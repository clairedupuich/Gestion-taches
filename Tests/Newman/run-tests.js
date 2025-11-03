// 本地开发环境使用
// Tests/Newman/run-tests.js
// Script pour exécuter les tests Newman automatisés / Newman自动化测试执行脚本

const newman = require('newman');
const path = require('path');
const fs = require('fs');

// Créer le dossier reports s'il n'existe pas / 如果reports文件夹不存在则创建
const reportsDir = path.join(__dirname, 'reports');
if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
    console.log('📁 Dossier reports créé / reports文件夹已创建');
}

console.log('🚀 Démarrage des tests Newman automatisés... / 启动Newman自动化测试...');
console.log('📋 Collection: Task Management API - Tests');
console.log('🌍 Environnement: Master Task');
console.log('🔗 URL de base: http://localhost:3000');
console.log('⏳ Veuillez patienter... / 请稍候...\n');

// Configuration Newman / Newman配置
const newmanOptions = {
    // ===== COLLECTION ===== / 集合配置
    collection: require.resolve('../Api/tasks.postman_collection.json'),
    
    // ===== ENVIRONMENT ===== / 环境配置
    environment: require.resolve('../Api/master-task-environment.json'),
    
    // ===== REPORTEURS ===== / 报告器配置
    reporters: ['cli', 'htmlextra'],
    
    // ===== CONFIGURATION RAPPORT HTML ===== / HTML报告配置
    reporter: {
        htmlextra: {
            // Fichier de sortie / 输出文件
            export: path.join(reportsDir, 'newman-report.html'),
            
            // Métadonnées du rapport / 报告元数据
            title: 'Task Management API - Rapport de Tests Automatisés',
            browserTitle: 'API Gestion de Tâches - Tests Newman',
            titleSize: 4,
            
            // Informations supplémentaires / 附加信息
            subTitle: `Test exécuté le: ${new Date().toLocaleString('fr-FR')}`,
            subtitleSize: 3,
            
            // Options d'affichage / 显示选项
            showOnlyFails: false,
            logs: true,
            noSyntaxHighlighting: false,
            testPaging: true,
            skipHeaders: false,
            skipSensitiveData: false,
            
            // Style et format / 样式和格式
            timezone: 'Europe/Paris',
            dateFormat: 'DD/MM/YYYY HH:mm:ss',
            styles: {
                "color": "blue"
            }
        }
    },
    
    // ===== OPTIONS D'EXÉCUTION ===== / 执行选项
    delayRequest: 1000,        // Délai entre les requêtes (ms) / 请求间延迟(毫秒)
    timeout: 5000,             // Timeout par requête (ms) / 每个请求超时时间(毫秒)
    ignoreRedirects: false,    // Suivre les redirections / 跟随重定向
    
    // ===== OPTIONS DE SÉCURITÉ ===== / 安全选项
    insecure: false,           // Autoriser les certificats auto-signés / 允许自签名证书
    sslClientCert: null,
    sslClientKey: null,
    sslClientPassphrase: null
};

// Exécuter les tests Newman / 执行Newman测试
newman.run(newmanOptions, function (err, summary) {
    console.log('\n' + '='.repeat(60));
    console.log('📊 RAPPORT FINAL DES TESTS NEWMAN / NEWMAN测试最终报告');
    console.log('='.repeat(60));
    
    if (err) {
        console.error('❌ ERREUR CRITIQUE / 严重错误:');
        console.error('   ', err.message);
        console.log('\n🔧 Dépannage / 故障排除:');
        console.log('   1. Vérifiez que le serveur backend est démarré');
        console.log('   2. Vérifiez les fichiers collection et environment');
        console.log('   3. Vérifiez la connexion réseau');
        process.exit(1);
    }
    
    // Afficher les statistiques détaillées / 显示详细统计信息
    const stats = summary.run.stats;
    console.log(`✅ Collection: ${summary.collection.name}`);
    console.log(`🌍 Environnement: ${summary.environment ? summary.environment.name : 'N/A'}`);
    console.log(`🕒 Durée totale: ${summary.run.timings.completed} ms`);
    console.log(`📈 Statistiques détaillées:`);
    console.log(`   📨 Requêtes totales: ${stats.requests.total}`);
    console.log(`   ✅ Requêtes réussies: ${stats.requests.passed}`);
    console.log(`   ❌ Requêtes échouées: ${stats.requests.failed}`);
    console.log(`   🧪 Tests exécutés: ${stats.tests.total}`);
    console.log(`   ✅ Tests réussis: ${stats.tests.passed}`);
    console.log(`   ❌ Tests échoués: ${stats.tests.failed}`);
    console.log(`   ✅ Assertions: ${stats.assertions.total}`);
    console.log(`   ✅ Assertions réussies: ${stats.assertions.passed}`);
    console.log(`   ❌ Assertions échouées: ${stats.assertions.failed}`);
    
    // Gérer les échecs / 处理失败情况
    if (summary.run.failures.length > 0) {
        console.log('\n❌ DÉTAILS DES ÉCHECS / 失败详情:');
        summary.run.failures.forEach((failure, index) => {
            console.log(`\n   ${index + 1}. ${failure.source.name}`);
            console.log(`      Message: ${failure.error.message}`);
            console.log(`      Test: ${failure.error.test}`);
        });
        
        console.log('\n🔧 Recommandations / 建议:');
        console.log('   1. Vérifiez que le serveur backend fonctionne');
        console.log('   2. Vérifiez les variables d\'environnement');
        console.log('   3. Vérifiez la logique des tests dans Postman');
        
        process.exit(1);
    } else {
        console.log('\n🎉 SUCCÈS TOTAL! / 完全成功!');
        console.log('✨ Tous les tests ont été exécutés avec succès');
        console.log(`📄 Rapport HTML généré: file://${path.resolve(reportsDir, 'newman-report.html')}`);
        console.log('\n🚀 Prochaines étapes / 下一步:');
        console.log('   - Intégrer dans CI/CD (GitHub Actions, GitLab CI, etc.)');
        console.log('   - Configurer des tests planifiés');
        console.log('   - Ajouter plus de scénarios de test');
        
        process.exit(0);
    }
});

// Gestion des erreurs non capturées / 未捕获错误处理
process.on('uncaughtException', (error) => {
    console.error('💥 ERREUR NON GÉRÉE / 未处理错误:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('💥 PROMESSE REJETÉE NON GÉRÉE / 未处理的Promise拒绝:', reason);
    process.exit(1);
});