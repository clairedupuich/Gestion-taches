une application web complète de gestion de tâches (ToDo List). Ce projet vous permettra de mettre en œuvre l'ensemble des compétences essentielles du développement web moderne, depuis la création de l'interface utilisateur jusqu'à l'automatisation des tests.


## 🛠️ Résolution des Problèmes de Permissions Jest

### Problème Rencontré
Lors de l'exécution des tests Jest dans GitHub Actions, l'erreur suivante est apparue :

### Causes Possibles
1. **Structure de projet non standard** - Tests dans `Tests/` au lieu de `__tests__/`
2. **Multiples package.json** - Dépendances réparties entre racine et `Backend/`
3. **Permissions binaires** - Fichiers exécutables dans `node_modules/.bin/` sans permissions d'exécution
4. **Environnement CI restrictif** - Restrictions de sécurité dans GitHub Actions

### Solution Implémentée
Création d'un exécuteur Jest personnalisé utilisant l'API Node.js directement :
```javascript
// Tests/run-jest.js
const { runCLI } = require('jest');
runCLI(config, [__dirname]).then((result) => {
  // Gestion des résultats
});


### **中文版本**
```markdown
## 🛠️ Jest 权限问题解决方案

### 遇到的问题
在 GitHub Actions 中运行 Jest 测试时出现以下错误：

### 可能的原因
1. **项目结构非标准** - 测试文件在 `Tests/` 而不是标准的 `__tests__/`
2. **多个 package.json** - 依赖分布在根目录和 `Backend/` 目录
3. **二进制文件权限** - `node_modules/.bin/` 中的可执行文件没有执行权限
4. **CI 环境限制** - GitHub Actions 中的安全限制

### 实施的解决方案
创建自定义 Jest 运行器，直接使用 Node.js API：
```javascript
// Tests/run-jest.js
const { runCLI } = require('jest');
runCLI(config, [__dirname]).then((result) => {
  // 处理测试结果
});