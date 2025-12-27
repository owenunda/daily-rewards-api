# Daily Rewards API

Backend API para gestionar recompensas diarias de usuarios, utilizando Redis para el control de cooldowns y PostgreSQL para la persistencia de datos.

Este proyecto demuestra el uso correcto de Redis como sistema de estado temporal y PostgreSQL como fuente de verdad para datos críticos.

---

## Características

- Registro y autenticación de usuarios
- Reclamo de recompensa diaria
- Cooldown de 24 horas por usuario (Redis + TTL)
- Acumulación de puntos por usuario
- Historial de recompensas reclamadas
- Arquitectura backend limpia y escalable

---

## Arquitectura

```
Cliente
   ↓
API (Node.js + Express)
   ↓
Redis (cooldowns / estado temporal)
   ↓
PostgreSQL (usuarios / puntos / historial)
```

---

## Tecnologías utilizadas

- Node.js
- Express
- PostgreSQL
- Redis
- JWT (autenticación)
- bcryptjs (hash de contraseñas)
- CORS (Cross-Origin Resource Sharing)

---

## Instalación

### Prerrequisitos

- Node.js (v18 o superior)
- PostgreSQL
- Redis

### Pasos

1. Clonar el repositorio

```bash
git clone <repository-url>
cd daily-rewards-api
```

2. Instalar dependencias

```bash
npm install
```

3. Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
REDIS_CLIENT_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret_key
DB_HOST=localhost
DB_PORT=5432
DB_NAME=daily_rewards
DB_USER=your_db_user
DB_PASSWORD=your_db_password
```

4. Crear las tablas en PostgreSQL

Ejecutar el siguiente script SQL en tu base de datos:

```sql
CREATE TABLE users (
    id              BIGSERIAL PRIMARY KEY,
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   TEXT NOT NULL,
    reward_points   INTEGER NOT NULL DEFAULT 0,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE daily_rewards (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT NOT NULL,
    reward_amount   INTEGER NOT NULL,
    claimed_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT fk_daily_rewards_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);
```

5. Iniciar el servidor

```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

---

## Modelo de datos

### Tabla `users`

```sql
CREATE TABLE users (
    id              BIGSERIAL PRIMARY KEY,
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   TEXT NOT NULL,
    reward_points   INTEGER NOT NULL DEFAULT 0,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Tabla `daily_rewards`

```sql
CREATE TABLE daily_rewards (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT NOT NULL,
    reward_amount   INTEGER NOT NULL,
    claimed_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT fk_daily_rewards_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);
```

---

## Uso de Redis

Redis se utiliza exclusivamente para controlar el cooldown de la recompensa diaria.

### Clave Redis

```
daily:cooldown:user:{userId}
```

- **Valor**: timestamp del reclamo (opcional)
- **TTL**: 86400 segundos (24 horas)

Redis elimina automáticamente la clave cuando el TTL expira, permitiendo al usuario reclamar nuevamente.

---

## Flujo de la recompensa diaria

1. El usuario solicita la recompensa diaria
2. La API verifica si existe la clave en Redis
   - Si existe → se bloquea el reclamo
   - Si no existe:
     - Se crea la clave Redis con TTL de 24h
     - Se guarda el historial en PostgreSQL
     - Se suman puntos al usuario

### Ejemplo de lógica

```javascript
// Generar clave única por usuario
const redisKey = `daily:cooldown:user:${userId}`;

// Verificar si ya reclamó hoy
const alreadyClaimed = await redisClient.exists(redisKey);

if (alreadyClaimed) {
  const ttl = await redisClient.ttl(redisKey);
  return {
    error: "Ya reclamaste tu recompensa diaria",
    retry_in_seconds: ttl
  };
}

// Establecer cooldown de 24 horas
await redisClient.set(redisKey, Date.now(), {
  EX: 60 * 60 * 24 // 86400 segundos
});

// Guardar en base de datos
await dailyRewardRepository.rewardRecord(userId, 100, new Date());
await dailyRewardRepository.addPointsToUser(userId, 100);

return {
  success: true,
  reward: 100,
  message: "Recompensa diaria reclamada"
};
```
```

---

## Endpoints principales

### Autenticación

#### POST /api/auth/register

Registra un nuevo usuario.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Respuesta exitosa:**
```json
{
  "id": 1,
  "email": "user@example.com"
}
```

#### POST /api/auth/login

Inicia sesión y obtiene un token JWT.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Respuesta exitosa:**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Recompensas

#### POST /api/rewards/daily

Reclama la recompensa diaria (requiere autenticación).

**Headers:**
```
Authorization: Bearer <token>
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "reward": 100,
  "message": "Recompensa diaria reclamada 🎉"
}
```

**Respuesta con cooldown activo:**
```json
{
  "error": "Ya reclamaste tu recompensa diaria",
  "retry_in_seconds": 43200
}
```

---

## Casos cubiertos

- Reclamo duplicado el mismo día
- Control automático del tiempo con Redis TTL
- Persistencia segura de puntos
- Limpieza automática del cooldown

---

## Objetivo del proyecto

Este proyecto fue creado con fines educativos y de portafolio para demostrar:

- Uso real de Redis (TTL, EXISTS, SET)
- Separación de responsabilidades
- Arquitectura backend moderna
- Buenas prácticas de persistencia

---

## Posibles mejoras

- Ranking mensual con Redis Sorted Sets
- Sistema de recompensas variables
- Panel administrativo
- WebSockets para actualizaciones en tiempo real

---

## Licencia

MIT