// CI/CD环境专用脚本
// Tests/Newman/ci-newman.js
// Script Newman optimisé pour CI/CD / CI/CD优化的Newman脚本

const newman = require('newman');
const path = require('path');
const fs = require('fs');

console.log('🚀 CI/CD Newman Tests Starting...');
console.log('📋 Running in CI environment');

// 确保报告目录存在
const reportsDir = path.join(__dirname, '../Newman-reports');
if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
}

const reportPath = path.join(reportsDir, `newman-report-${Date.now()}.html`);

newman.run({
    // Collection et environnement / 集合和环境
    collection: require.resolve('../Api/tasks.postman_collection.json'),
    environment: require.resolve('../Api/master-task-environment.json'),
    
    // Rapporteurs pour CI / CI报告器
    reporters: ['cli', 'htmlextra'],
    
    // Configuration du rapport HTML / HTML报告配置
    reporter: {
        htmlextra: {
            export: reportPath,
            title: 'Task Management API - CI/CD Test Report',
            browserTitle: 'CI Tests',
            titleSize: 4,
            subTitle: `Executed: ${new Date().toISOString()}`,
            showOnlyFails: true,      // CI中只显示失败
            logs: true,
            noSyntaxHighlighting: false,
            testPaging: true,
            timezone: 'UTC'
        }
    },
    
    // Options d'exécution optimisées pour CI / CI优化执行选项
    delayRequest: 500,        // Délai réduit pour CI / 减少延迟
    timeout: 5000,            // Timeout strict / 严格超时
    ignoreRedirects: false,
    insecure: false,
    
    // Configuration globale / 全局配置
    globalVar: [
        {
            key: 'ci_mode',
            value: 'true'
        }
    ]
    
}, function (err, summary) {
    console.log('\n' + '='.repeat(60));
    console.log('📊 CI/CD NEWMAN TEST SUMMARY');
    console.log('='.repeat(60));
    
    if (err) {
        console.error('❌ CI Test Execution Error:', err.message);
        process.exit(1);
    }
    
    const stats = summary.run.stats;
    
    // Affichage des statistiques / 显示统计信息
    console.log(`📨 Total Requests: ${stats.requests.total}`);
    console.log(`✅ Passed Requests: ${stats.requests.passed}`);
    console.log(`❌ Failed Requests: ${stats.requests.failed}`);
    console.log(`🧪 Total Tests: ${stats.tests.total}`);
    console.log(`✅ Passed Tests: ${stats.tests.passed}`);
    console.log(`❌ Failed Tests: ${stats.tests.failed}`);
    console.log(`🕒 Total Duration: ${summary.run.timings.completed}ms`);
    
    // Gestion des échecs / 失败处理
    if (summary.run.failures.length > 0) {
        console.log('\n❌ FAILED TESTS:');
        summary.run.failures.forEach((failure, index) => {
            console.log(`\n   ${index + 1}. ${failure.source.name}`);
            console.log(`      Error: ${failure.error.message}`);
            if (failure.error.test) {
                console.log(`      Test: ${failure.error.test}`);
            }
        });
        
        console.log('\n🔧 CI Pipeline will fail due to test failures');
        process.exit(1);  // Exit code 1 pour échec CI / 退出码1表示CI失败
        
    } else {
        console.log('\n🎉 ALL CI TESTS PASSED!');
        console.log(`📄 Report saved: ${reportPath}`);
        process.exit(0);  // Exit code 0 pour succès CI / 退出码0表示CI成功
    }
});

// Gestion des erreurs non capturées / 未捕获错误处理
process.on('uncaughtException', (error) => {
    console.error('💥 UNHANDLED ERROR:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('💥 UNHANDLED PROMISE REJECTION:', reason);
    process.exit(1);
});