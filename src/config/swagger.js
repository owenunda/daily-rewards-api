import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Daily Rewards API',
      version: '1.0.0',
      description: 'API para sistema de recompensas diarias. Esta API permite a los usuarios registrarse, autenticarse y reclamar recompensas diarias con sistema de cooldown.',
      contact: {
        name: 'API Support',
        email: 'support@dailyrewards.com'
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de Desarrollo'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Ingresa el token JWT obtenido al hacer login o registro'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID único del usuario',
              example: 1
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email del usuario',
              example: 'usuario@ejemplo.com'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de creación de la cuenta',
              example: '2025-12-28T10:00:00Z'
            }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'Email del usuario',
              example: 'usuario@ejemplo.com'
            },
            password: {
              type: 'string',
              format: 'password',
              description: 'Contraseña del usuario',
              example: 'password123',
              minLength: 6
            }
          }
        },
        RegisterRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'Email del usuario (debe ser único)',
              example: 'nuevo@ejemplo.com'
            },
            password: {
              type: 'string',
              format: 'password',
              description: 'Contraseña del usuario (mínimo 6 caracteres)',
              example: 'password123',
              minLength: 6
            }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
              description: 'Token JWT para autenticación',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
            },
            user: {
              $ref: '#/components/schemas/User'
            }
          }
        },
        DailyReward: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID único de la recompensa',
              example: 1
            },
            user_id: {
              type: 'integer',
              description: 'ID del usuario que recibió la recompensa',
              example: 1
            },
            coins: {
              type: 'integer',
              description: 'Cantidad de monedas otorgadas',
              example: 100
            },
            streak: {
              type: 'integer',
              description: 'Racha de días consecutivos',
              example: 3
            },
            claimed_at: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha y hora en que se reclamó la recompensa',
              example: '2025-12-28T10:00:00Z'
            }
          }
        },
        RewardHistory: {
          type: 'array',
          items: {
            $ref: '#/components/schemas/DailyReward'
          }
        },
        CooldownStatus: {
          type: 'object',
          properties: {
            canClaim: {
              type: 'boolean',
              description: 'Indica si el usuario puede reclamar una recompensa',
              example: true
            },
            nextClaimTime: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha y hora de la próxima recompensa disponible',
              example: '2025-12-29T10:00:00Z',
              nullable: true
            },
            timeRemaining: {
              type: 'integer',
              description: 'Tiempo restante en segundos hasta la próxima recompensa',
              example: 86400,
              nullable: true
            },
            currentStreak: {
              type: 'integer',
              description: 'Racha actual de días consecutivos',
              example: 3
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Mensaje de error',
              example: 'Error al procesar la solicitud'
            }
          }
        },
        ValidationError: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Descripción del error de validación',
              example: 'El campo email es requerido'
            }
          }
        }
      },
      responses: {
        UnauthorizedError: {
          description: 'Token de autenticación no válido o ausente',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                error: 'Token no válido o ausente'
              }
            }
          }
        },
        InternalServerError: {
          description: 'Error interno del servidor',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                error: 'Error interno del servidor'
              }
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Auth',
        description: 'Endpoints de autenticación y registro de usuarios'
      },
      {
        name: 'User',
        description: 'Endpoints relacionados con información del usuario'
      },
      {
        name: 'Daily Rewards',
        description: 'Endpoints para gestión de recompensas diarias'
      }
    ]
  },
  apis: ['./src/**/*.routes.js'] // Archivos donde están las rutas con anotaciones
};

const swaggerSpec = swaggerJSDoc(options);

export { swaggerUi, swaggerSpec };
