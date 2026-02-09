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
      ProgramCoordinator: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 12 },
          full_name: { type: 'string', example: 'Dr. John Smith' },
          email: { type: 'string', example: 'john.smith@university.edu' },
          picture: { type: 'string', nullable: true, example: 'https://example.com/pic.jpg' },
          telephone_number: { type: 'string', nullable: true, example: '+90 5xx xxx xx xx' },
          nationality: { type: 'string', nullable: true, example: 'Cyprus' },
          academic_qualification: { type: 'string', nullable: true, example: 'PhD' },
          speciality: { type: 'string', nullable: true, example: 'Software Engineering' },
          office_location: { type: 'string', nullable: true, example: 'Engineering Building, Room 203' },
          office_hours: { type: 'string', nullable: true, example: 'Mon-Fri 10:00-12:00' },
          created_at: { type: 'string', example: '2025-01-01T00:00:00.000Z' },
        },
      },
      ProgramCoordinatorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: {
            type: 'object',
            properties: {
              program_coordinator: { $ref: '#/components/schemas/ProgramCoordinator' },
            },
          },
        },
      },
      AssignCoordinatorRequest: {
        type: 'object',
        properties: {
          program_coordinator_id: { type: 'number', nullable: true, example: 12 },
        },
        required: ['program_coordinator_id'],
      },
      ProgramMinimal: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          program_coordinator_id: { type: 'number', nullable: true, example: 12 },
        },
      },
      ApplicantProfile: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          user_id: { type: 'number', example: 5 },
          reference_code: { type: 'string', example: 'APP-ABC123' },
          first_name: { type: 'string', example: 'Zeka' },
          last_name: { type: 'string', example: 'Shadrac' },
          date_of_birth: { type: 'string', example: '2002-01-01' },
          gender: { type: 'string', example: 'male' },
          passport_no: { type: 'string', example: 'P1234567' },
          id_no: { type: 'string', example: 'ID998877' },
          place_of_birth: { type: 'string', example: 'Nicosia' },
          contact_number: { type: 'string', example: '+90 5xx xxx xx xx' },
          email_address: { type: 'string', nullable: true, example: 'zeka@test.com' },
          application_owner: { type: 'string', nullable: true, example: 'Self' },
          country: { type: 'string', example: 'Cyprus' },
          address_line: { type: 'string', example: 'Street 1' },
          city: { type: 'string', example: 'Lefkosa' },
          state: { type: 'string', example: 'TRNC' },
          zip_postcode: { type: 'string', example: '99010' },
          mother_full_name: { type: 'string', example: 'Mother Name' },
          father_full_name: { type: 'string', example: 'Father Name' },
          heard_about_university: { type: 'string', example: 'Instagram' },
          created_at: { type: 'string', example: '2025-01-01T00:00:00.000Z' },
        },
      },
      Application: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          applicant_id: { type: 'number', example: 1 },
          program_id: { type: 'number', example: 1 },
          status: { type: 'string', enum: ['submitted', 'accepted', 'rejected'], example: 'submitted' },
          created_at: { type: 'string', example: '2025-01-01T00:00:00.000Z' },
        },
      },
      ApplicationListItem: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          program_id: { type: 'number', example: 1 },
          status: { type: 'string', enum: ['submitted', 'accepted', 'rejected'], example: 'submitted' },
          created_at: { type: 'string', example: '2025-01-01T00:00:00.000Z' },
          program: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              name: { type: 'string', example: 'Software Engineering' },
              level: { type: 'string', enum: ['undergraduate', 'postgraduate'], example: 'undergraduate' },
            },
          },
        },
      },
      SubmitApplicationRequest: {
        type: 'object',
        properties: {
          program_id: { type: 'number', example: 1 },
          profile: { $ref: '#/components/schemas/ApplicantProfile' },
        },
        required: ['program_id', 'profile'],
      },
      ApplicationListResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: { $ref: '#/components/schemas/ApplicationListItem' },
              },
              page: { type: 'number', example: 1 },
              limit: { type: 'number', example: 10 },
              total: { type: 'number', example: 1 },
            },
          },
        },
      },
      Course: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          program_id: { type: 'number', example: 1 },
          year_number: { type: 'number', example: 1 },
          course_name: { type: 'string', example: 'Introduction to Programming' },
          course_code: { type: 'string', example: 'SE101' },
          credits: { type: 'number', example: 3 },
          theoretical_hours: { type: 'number', example: 2 },
          practical_hours: { type: 'number', example: 2 },
          distance_hours: { type: 'number', example: 0 },
          ects: { type: 'number', example: 7.5 },
          course_description: { type: 'string', example: 'Basics of programming...' },
          created_at: { type: 'string', example: '2025-01-01T00:00:00.000Z' },
        },
      },
      CourseResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: {
            type: 'object',
            properties: {
              course: { $ref: '#/components/schemas/Course' },
            },
          },
        },
      },
      CourseListResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: {
            type: 'object',
            properties: {
              program_id: { type: 'number', example: 1 },
              items: {
                type: 'array',
                items: { $ref: '#/components/schemas/Course' },
              },
            },
          },
        },
      },
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
    '/api/v1/applicant/profile': {
      get: {
        tags: ['Applicants'],
        summary: 'Get applicant profile',
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: 'Applicant profile',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'object',
                      properties: {
                        profile: { $ref: '#/components/schemas/ApplicantProfile' },
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
          403: {
            description: 'Forbidden',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          404: {
            description: 'Profile not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      put: {
        tags: ['Applicants'],
        summary: 'Upsert applicant profile',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApplicantProfile' },
            },
          },
        },
        responses: {
          200: {
            description: 'Applicant profile updated',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'object',
                      properties: {
                        profile: { $ref: '#/components/schemas/ApplicantProfile' },
                      },
                    },
                  },
                },
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
    '/api/v1/applications': {
      post: {
        tags: ['Applications'],
        summary: 'Submit application',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SubmitApplicationRequest' },
            },
          },
        },
        responses: {
          201: {
            description: 'Application submitted',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'object',
                      properties: {
                        application: { $ref: '#/components/schemas/Application' },
                        profile: { $ref: '#/components/schemas/ApplicantProfile' },
                      },
                    },
                  },
                },
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
            description: 'Program not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/v1/applications/me': {
      get: {
        tags: ['Applications'],
        summary: 'List my applications',
        security: [{ BearerAuth: [] }],
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
        ],
        responses: {
          200: {
            description: 'Applications list',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApplicationListResponse' },
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
            description: 'Profile not found',
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
    '/api/v1/program-coordinators': {
      post: {
        tags: ['ProgramCoordinators'],
        summary: 'Create program coordinator',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  full_name: { type: 'string', example: 'Dr. John Smith' },
                  email: { type: 'string', example: 'john.smith@university.edu' },
                  picture: { type: 'string', example: 'https://example.com/pic.jpg' },
                  telephone_number: { type: 'string', example: '+90 5xx xxx xx xx' },
                  nationality: { type: 'string', example: 'Cyprus' },
                  academic_qualification: { type: 'string', example: 'PhD' },
                  speciality: { type: 'string', example: 'Software Engineering' },
                  office_location: { type: 'string', example: 'Engineering Building, Room 203' },
                  office_hours: { type: 'string', example: 'Mon-Fri 10:00-12:00' },
                },
                required: ['full_name', 'email'],
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Program coordinator created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ProgramCoordinatorResponse' },
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
    '/api/v1/program-coordinators/{id}': {
      get: {
        tags: ['ProgramCoordinators'],
        summary: 'Get program coordinator by id',
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
            description: 'Program coordinator details',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ProgramCoordinatorResponse' },
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
        tags: ['ProgramCoordinators'],
        summary: 'Update program coordinator',
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
                  full_name: { type: 'string', example: 'Dr. John Smith' },
                  email: { type: 'string', example: 'john.smith@university.edu' },
                  picture: { type: 'string', example: 'https://example.com/pic.jpg' },
                  telephone_number: { type: 'string', example: '+90 5xx xxx xx xx' },
                  nationality: { type: 'string', example: 'Cyprus' },
                  academic_qualification: { type: 'string', example: 'PhD' },
                  speciality: { type: 'string', example: 'Software Engineering' },
                  office_location: { type: 'string', example: 'Engineering Building, Room 203' },
                  office_hours: { type: 'string', example: 'Mon-Fri 10:00-12:00' },
                },
                required: ['full_name', 'email'],
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Program coordinator updated',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ProgramCoordinatorResponse' },
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
    '/api/v1/programs/{programId}/courses': {
      get: {
        tags: ['Courses'],
        summary: 'List courses for a program',
        parameters: [
          {
            name: 'programId',
            in: 'path',
            required: true,
            schema: { type: 'number' },
          },
          {
            name: 'year',
            in: 'query',
            schema: { type: 'number', example: 1 },
          },
          {
            name: 'sort',
            in: 'query',
            schema: { type: 'string', enum: ['year', 'name'] },
          },
        ],
        responses: {
          200: {
            description: 'Courses list',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CourseListResponse' },
              },
            },
          },
          404: {
            description: 'Program not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      post: {
        tags: ['Courses'],
        summary: 'Create a course for a program',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'programId',
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
                  year_number: { type: 'number', example: 1 },
                  course_name: { type: 'string', example: 'Introduction to Programming' },
                  course_code: { type: 'string', example: 'SE101' },
                  credits: { type: 'number', example: 3 },
                  theoretical_hours: { type: 'number', example: 2 },
                  practical_hours: { type: 'number', example: 2 },
                  distance_hours: { type: 'number', example: 0 },
                  ects: { type: 'number', example: 7.5 },
                  course_description: { type: 'string', example: 'Basics of programming...' },
                },
                required: [
                  'year_number',
                  'course_name',
                  'course_code',
                  'credits',
                  'theoretical_hours',
                  'practical_hours',
                  'distance_hours',
                  'course_description',
                ],
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Course created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CourseResponse' },
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
            description: 'Program not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          409: {
            description: 'Course code already exists',
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
      patch: {
        tags: ['Programs'],
        summary: 'Assign program coordinator',
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
              schema: { $ref: '#/components/schemas/AssignCoordinatorRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'Program coordinator assigned',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'object',
                      properties: {
                        program: { $ref: '#/components/schemas/ProgramMinimal' },
                      },
                    },
                  },
                },
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
    '/api/v1/courses/{id}': {
      get: {
        tags: ['Courses'],
        summary: 'Get course by id',
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
            description: 'Course details',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CourseResponse' },
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
        tags: ['Courses'],
        summary: 'Update course',
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
                  year_number: { type: 'number', example: 1 },
                  course_name: { type: 'string', example: 'Introduction to Programming' },
                  course_code: { type: 'string', example: 'SE101' },
                  credits: { type: 'number', example: 3 },
                  theoretical_hours: { type: 'number', example: 2 },
                  practical_hours: { type: 'number', example: 2 },
                  distance_hours: { type: 'number', example: 0 },
                  ects: { type: 'number', example: 7.5 },
                  course_description: { type: 'string', example: 'Basics of programming...' },
                },
                required: [
                  'year_number',
                  'course_name',
                  'course_code',
                  'credits',
                  'theoretical_hours',
                  'practical_hours',
                  'distance_hours',
                  'course_description',
                ],
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Course updated',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CourseResponse' },
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
          409: {
            description: 'Course code already exists',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      delete: {
        tags: ['Courses'],
        summary: 'Delete course',
        security: [{ BearerAuth: [] }],
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
            description: 'Course deleted',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'object',
                      properties: {
                        deleted: { type: 'boolean', example: true },
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
