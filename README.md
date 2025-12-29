# AI Agent Platform

A NestJS-based platform for managing documents, users, and organizations with AWS S3 integration.

## Features

- **Document Management**: Upload, retrieve, and delete documents with S3 storage
- **User Management**: User entity with organization relationships
- **Organization Management**: Multi-tenant organization support
- **File Storage**: AWS S3 integration for document storage

## Tech Stack

- **Framework**: NestJS 11.x
- **Database**: PostgreSQL 15
- **ORM**: TypeORM
- **Storage**: AWS S3
- **Language**: TypeScript

## Prerequisites

- Node.js
- PostgreSQL (or Docker)
- AWS S3 account with credentials

## Installation

# Install dependencies
npm install

# Start PostgreSQL with Docker
docker-compose up -d

# Set up environment variables (create .env file)
# DATABASE_HOST=localhost
# DATABASE_PORT=5432
# DATABASE_USER=postgres
# DATABASE_PASSWORD=postgres
# DATABASE_NAME=ai_agent_platform
# AWS_REGION=your-region
# AWS_BUCKET_NAME=your-bucket
# AWS_ACCESS_KEY_ID=your-key
# AWS_SECRET_ACCESS_KEY=your-secret## Running the Application

# Development
npm run start:dev

# Production
npm run build
npm run start:prod## API Endpoints

### Documents
- `POST /documents/upload` - Upload a document
- `GET /documents/user/:userId` - Get all documents for a user
- `GET /documents/:id?userId=:userId` - Get a specific document
- `DELETE /documents/:id?userId=:userId` - Delete a document

## Project Structure
