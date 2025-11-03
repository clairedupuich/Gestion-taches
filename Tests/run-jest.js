// Tests/run-jest.js
// Custom Jest Runner to avoid permission issues in CI
// Exécuteur Jest personnalisé pour éviter les problèmes de permissions en CI
// 自定义Jest运行器，避免CI环境中的权限问题

const { runCLI } = require('jest');
const path = require('path');

console.log('🚀 Starting Jest tests via Node.js...');
// Démarrage des tests Jest via Node.js... / 通过Node.js启动Jest测试...

// Configuration Jest pour notre projet / Jest configuration for our project / Jest项目配置
const config = {
  rootDir: path.resolve(__dirname, '..'),
  // Répertoire racine du projet / Project root directory / 项目根目录
  
  testMatch: [
    '<rootDir>/Tests/Unit/**/*.test.js',
    '<rootDir>/Tests/Integration/**/*.test.js'
  ],
  // Modèles de fichiers de test / Test file patterns / 测试文件模式
  
  coverageDirectory: '<rootDir>/Tests/coverage',
  // Répertoire pour les rapports de couverture / Coverage reports directory / 覆盖率报告目录
  
  collectCoverageFrom: [
    '<rootDir>/Backend/**/*.js',
    '!<rootDir>/Backend/node_modules/**'
  ],
  // Fichiers à inclure dans la couverture / Files to include in coverage / 包含在覆盖率中的文件
  
  testEnvironment: 'node',
  // Environnement de test Node.js / Node.js test environment / Node.js测试环境
  
  verbose: true
  // Mode verbeux pour plus de détails / Verbose mode for more details / 详细模式获取更多详情
};

// Exécuter Jest avec notre configuration / Run Jest with our configuration / 使用我们的配置运行Jest
runCLI(config, [__dirname]).then((result) => {
  if (result.results.success) {
    console.log('✅ All tests passed!');
    // Tous les tests ont réussi ! / 所有测试通过！
    process.exit(0);
    // Code de sortie 0 pour succès / Exit code 0 for success / 退出码0表示成功
  } else {
    console.log('❌ Some tests failed');
    // Certains tests ont échoué / 部分测试失败
    process.exit(1);
    // Code de sortie 1 pour échec / Exit code 1 for failure / 退出码1表示失败
  }
}).catch((error) => {
  console.error('💥 Jest execution error:', error);
  // Erreur d'exécution Jest / Jest执行错误
  process.exit(1);
});

// Gestion des erreurs non capturées / Unhandled error handling / 未处理错误处理
process.on('uncaughtException', (error) => {
  console.error('💥 UNHANDLED ERROR:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 UNHANDLED PROMISE REJECTION:', reason);
  process.exit(1);
});

// Note: Ce fichier évite les problèmes de permissions en utilisant l'API Node.js directement
// Note: This file avoids permission issues by using Node.js API directly
// 注意：此文件通过直接使用Node.js API避免权限问题
// Au lieu d'exécuter le binaire Jest, nous utilisons son API programmatique
// Instead of executing Jest binary, we use its programmatic API
// 不是执行Jest二进制文件，而是使用其编程API