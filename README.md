# fullstack-devops-assignmentFull Stack + DevOps Assignment
Overview
This is a microservice-based application demonstrating messaging (RabbitMQ), caching (Redis), secure authentication (JWT with RBAC), and deployment (Docker). The project includes two services: an API service for user management and data retrieval, and a consumer service for processing welcome email events.

# Prerequisites

Node.js
Docker and Docker Compose
Postman (for testing the API)
Git

Setup Instructions

Clone the Repository:
git clone https://github.com/your-username/fullstack-devops-assignment.git
cd fullstack-devops-assignment


Install Dependencies:
npm install


Configure Environment Variables:

Copy .env.example to .env:cp .env.example .env


JWT_SECRET=
REDIS_HOST=redis
REDIS_PORT=6379
RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672
PORT=3000




Build the Project:
npm run build


Run Locally (without Docker):

Start Redis and RabbitMQ locally (or use Docker Compose).
Run the API:npm run dev


Run the consumer in a separate terminal:npm run dev:consumer




Run with Docker:

Start all services (API, consumer, Redis, RabbitMQ):docker-compose up --build


Access the API at http://localhost:3000.
Access RabbitMQ management UI at http://localhost:15672 (default credentials: guest/guest).


Run Tests:
npm test



API Documentation
API documentation is provided in FullStackDevOpsAPI.postman_collection.json.
Using the Postman Collection

Import FullStackDevOpsAPI.postman_collection.json into Postman.
Create a Postman environment with a jwt_token variable (initially empty).
Test endpoints:
POST /user/register: Register a user (e.g., { "username": "testuser", "password": "password123", "role": "user" }).
POST /user/login: Log in to get a JWT token, set it as jwt_token.
GET /data/:id: Fetch data by ID (e.g., id=1). Requires Authorization: Bearer {{jwt_token}}.


Note: Admins access all data; users access only owned data (e.g., ownerId matching user ID).

Endpoints

POST /user/register: { username, password, role? } → { message, userId }
POST /user/login: { username, password } → { token }
GET /data/:id: Requires JWT, returns data if authorized (cached in Redis).

Microservices

API Service: Handles user registration, login, and data retrieval. Publishes messages to RabbitMQ on registration.
Consumer Service: Listens for RabbitMQ messages and logs "Welcome Email Event."
Redis: Caches data for /data/:id.
RabbitMQ: Facilitates messaging between API and consumer.

Security

JWT: Authenticates /data/:id endpoint.
RBAC: Admins access all data; users access only owned data.
Password Hashing: Uses bcrypt for secure password storage.

Bonus Features

RBAC: Implemented in /data/:id (admins vs. users).
Tests: Basic Jest tests in tests/user.test.ts.
CI/CD: GitHub Actions pipeline in .github/workflows/ci.yml (builds, tests).

Troubleshooting

Ensure Redis and RabbitMQ are running (use Docker Compose for simplicity).
Check .env for correct configuration.
Verify JWT_SECRET is set and consistent across services.
For Docker issues, check container logs: docker-compose logs.

