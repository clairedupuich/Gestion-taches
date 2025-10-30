# Spécification de l'API REST - Gestionnaire de Tâches
# REST API 规范 - 任务管理器

<!-- 
这个文档定义了任务管理应用的完整REST API规范
This document defines the complete REST API specification for the task management application
-->

## Informations de Base / 基础信息
<!-- 基础配置信息 - Basic configuration information -->
- **Version API**: 1.0
- **Base URL**: `http://localhost:3000/api`  <!-- 后端服务器地址 - Backend server address -->
- **Format des données**: JSON              <!-- 数据格式 - Data format -->
- **Authentification**: JWT (pour extensions futures) <!-- 认证方式（未来扩展） - Authentication (for future extensions) -->

## Schéma des Endpoints / 端点概览
<!-- API端点总览表 - API endpoints overview table -->
| Méthode | Endpoint | Description | Statuts HTTP |
|---------|----------|-------------|-------------|
| GET | `/tasks` | Récupérer toutes les tâches / 获取所有任务 | 200, 401, 500 |
| GET | `/tasks/:id` | Récupérer une tâche spécifique / 获取特定任务 | 200, 400, 404, 500 |
| POST | `/tasks` | Créer une nouvelle tâche / 创建新任务 | 201, 400, 422, 500 |
| PUT | `/tasks/:id` | Mettre à jour une tâche / 更新任务 | 200, 400, 404, 500 |
| DELETE | `/tasks/:id` | Supprimer une tâche / 删除任务 | 200, 400, 404, 500 |
| PATCH | `/tasks/:id/complete` | Marquer comme terminée / 标记为完成 | 200, 400, 404, 500 |

## Détails des Endpoints / 端点详情
<!-- 每个端点的详细说明 - Detailed description for each endpoint -->

### 1. Récupérer toutes les tâches / 获取所有任务
<!-- 获取任务列表 - Get task list -->

**GET** `/tasks`

#### Réponse Succès / 成功响应 (200 OK)
```json
{
  "success": true,          <!-- 请求成功标志 - Request success flag -->
  "data": [                 <!-- 任务数据数组 - Task data array -->
    {
      "id": 1,              <!-- 任务ID - Task ID -->
      "title": "Acheter du lait", <!-- 任务标题 - Task title -->
      "description": "Acheter du lait au supermarché", <!-- 任务描述 - Task description -->
      "completed": false,    <!-- 完成状态 - Completion status -->
      "createdAt": "2024-01-15T10:30:00Z", <!-- 创建时间 - Creation time -->
      "updatedAt": "2024-01-15T10:30:00Z"  <!-- 更新时间 - Update time -->
    }
  ],
  "count": 1                <!-- 任务数量 - Task count -->
}