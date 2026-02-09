import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'UniApply API',
    version: '1.0.0',
    description: 'API documentation for UniApply authentication',
  },
  servers: [
    {
      url: 'http://localhost:4000',
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      Program: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          created_by: { type: 'number', example: 10 },
          program_coordinator_id: { type: 'number', nullable: true, example: null },
          name: { type: 'string', example: 'Software Engineering' },
          level: { type: 'string', enum: ['undergraduate', 'postgraduate'], example: 'undergraduate' },
          duration_years: { type: 'number', example: 4 },
          short_description: { type: 'string', example: 'Build modern software systems.' },
          about_text: { type: 'string', example: 'About program...' },
          entry_requirements_text: { type: 'string', example: 'Requirements...' },
          scholarships_text: { type: 'string', example: 'Scholarships...' },
          created_at: { type: 'string', example: '2025-01-01T00:00:00.000Z' },
        },
      },
      ProgramResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: {
            type: 'object',
            properties: {
              program: { $ref: '#/components/schemas/Program' },
            },
          },
        },
      },
      ProgramListResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: { $ref: '#/components/schemas/Program' },
              },
              page: { type: 'number', example: 1 },
              limit: { type: 'number', example: 10 },
              total: { type: 'number', example: 42 },
            },
          },
        },
      },
      AuthUser: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          first_name: { type: 'string', example: 'Zeka' },
          last_name: { type: 'string', example: 'Shadrac' },
          email: { type: 'string', example: 'zeka@test.com' },
          role: { type: 'string', enum: ['dean', 'applicant'], example: 'dean' },
          created_at: { type: 'string', example: '2025-01-01T00:00:00.000Z' },
        },
      },
      AuthResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: {
            type: 'object',
            properties: {
              user: { $ref: '#/components/schemas/AuthUser' },
              token: { type: 'string', example: '<jwt>' },
            },
          },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: {
            type: 'object',
            properties: {
              message: { type: 'string', example: 'Validation error' },
              code: { type: 'string', example: 'VALIDATION_ERROR' },
              details: { type: 'array', items: { type: 'object' } },
            },
          },
        },
      },
    },
  },
  paths: {
    '/api/v1/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  first_name: { type: 'string', example: 'Zeka' },
                  last_name: { type: 'string', example: 'Shadrac' },
                  email: { type: 'string', example: 'zeka@test.com' },
                  password: { type: 'string', example: 'StrongPass123!' },
                  role: { type: 'string', enum: ['dean', 'applicant'], example: 'dean' },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'User registered',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthResponse' },
              },
            },
          },
          409: {
            description: 'Email already exists',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/v1/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', example: 'zeka@test.com' },
                  password: { type: 'string', example: 'StrongPass123!' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Login successful',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthResponse' },
              },
            },
          },
          401: {
            description: 'Invalid credentials',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/v1/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Get current user',
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: 'Authenticated user',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'object',
                      properties: {
                        user: { $ref: '#/components/schemas/AuthUser' },
                      },
                    },
                  },
                },
              },
            },
          },
          401: {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/v1/programs': {
      get: {
        tags: ['Programs'],
        summary: 'List programs',
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: { type: 'number', example: 1 },
          },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'number', example: 10 },
          },
          {
            name: 'level',
            in: 'query',
            schema: { type: 'string', enum: ['undergraduate', 'postgraduate'] },
          },
          {
            name: 'search',
            in: 'query',
            schema: { type: 'string', example: 'Software' },
          },
        ],
        responses: {
          200: {
            description: 'Programs list',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ProgramListResponse' },
              },
            },
          },
        },
      },
      post: {
        tags: ['Programs'],
        summary: 'Create a program',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'Software Engineering' },
                  level: { type: 'string', enum: ['undergraduate', 'postgraduate'] },
                  duration_years: { type: 'number', example: 4 },
                  short_description: { type: 'string', example: 'Build modern software systems.' },
                  about_text: { type: 'string', example: 'About program...' },
                  entry_requirements_text: { type: 'string', example: 'Requirements...' },
                  scholarships_text: { type: 'string', example: 'Scholarships...' },
                },
                required: [
                  'name',
                  'level',
                  'duration_years',
                  'short_description',
                  'about_text',
                  'entry_requirements_text',
                  'scholarships_text',
                ],
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Program created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ProgramResponse' },
              },
            },
          },
          400: {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          401: {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          403: {
            description: 'Forbidden',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/v1/programs/{id}': {
      get: {
        tags: ['Programs'],
        summary: 'Get program by id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'number' },
          },
        ],
        responses: {
          200: {
            description: 'Program details',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ProgramResponse' },
              },
            },
          },
          404: {
            description: 'Not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      put: {
        tags: ['Programs'],
        summary: 'Update program',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'number' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'Software Engineering' },
                  level: { type: 'string', enum: ['undergraduate', 'postgraduate'] },
                  duration_years: { type: 'number', example: 4 },
                  short_description: { type: 'string', example: 'Build modern software systems.' },
                  about_text: { type: 'string', example: 'About program...' },
                  entry_requirements_text: { type: 'string', example: 'Requirements...' },
                  scholarships_text: { type: 'string', example: 'Scholarships...' },
                },
                required: [
                  'name',
                  'level',
                  'duration_years',
                  'short_description',
                  'about_text',
                  'entry_requirements_text',
                  'scholarships_text',
                ],
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Program updated',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ProgramResponse' },
              },
            },
          },
          400: {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          401: {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          403: {
            description: 'Forbidden',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          404: {
            description: 'Not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
  },
};

const swaggerSpec = swaggerJSDoc({
  swaggerDefinition,
  apis: [],
});

export default swaggerSpec;
