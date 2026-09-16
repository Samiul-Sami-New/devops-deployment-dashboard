# DevOps Deployment Dashboard

A lightweight, production-oriented Node.js and Express application for displaying application runtime status.

This project demonstrates a practical DevOps workflow covering application development, automated testing, Docker containerization, GitHub Actions CI, GitHub Container Registry (GHCR), and automated AWS EC2 deployment using GitHub OIDC and AWS Systems Manager.

---

## Project Overview

The goal of this project is to demonstrate an end-to-end DevOps deployment workflow for a containerized web application.

The project was developed and validated using:

- Node.js
- Express
- Docker
- Docker Compose
- GitHub Actions
- GitHub Container Registry (GHCR)
- AWS EC2
- AWS Systems Manager (SSM)
- AWS IAM
- GitHub OpenID Connect (OIDC)

The application was successfully deployed and validated on a RHEL 8 EC2 environment.

---

## Architecture

### CI/CD Architecture

```text
                    Developer
                       |
                       v
                  GitHub Repository
                       |
                       v
                GitHub Actions
                       |
              +--------+--------+
              |                 |
              v                 v
          npm tests        Docker Build
                                |
                                v
                              GHCR
                                |
                                v
                         GitHub OIDC
                                |
                                v
                           AWS IAM
                                |
                                v
                         AWS SSM
                                |
                                v
                         AWS EC2
                       (RHEL 8.10)
                                |
                                v
                         Docker Compose
                                |
                                v
                     DevOps Dashboard
                                |
                                v
                         Health Check
````

---

## Application Features

* Lightweight Node.js and Express application
* Runtime status dashboard
* Application health endpoint
* Runtime status API
* Environment-based configuration
* Structured JSON request logging
* Docker health check
* Production-oriented Docker image
* Non-root container execution
* Read-only container filesystem
* Temporary filesystem for `/tmp`
* Automatic container restart policy

---

## API Endpoints

### Health Check

```http
GET /health
```

Returns a lightweight health response.

Example:

```json
{
  "status": "ok"
}
```

### Application Status

```http
GET /api/status
```

Returns runtime information including:

* Application name
* Application version
* Environment
* Operational status
* Uptime
* Timestamp

Example:

```json
{
  "data": {
    "application": "DevOps Deployment Dashboard",
    "version": "2.0.0-local",
    "environment": "docker",
    "status": "operational",
    "uptimeSeconds": 105,
    "timestamp": "2026-09-15T18:52:51.719Z"
  }
}
```

---

## Requirements

* Node.js 20 or newer
* npm
* Docker
* Docker Compose

---

## Run Locally

Install dependencies:

```bash
npm install
```

Create the local environment file:

```bash
copy .env.example .env
```

Start the application:

```bash
npm start
```

Open:

```text
http://localhost:3000
```

---

## Application Commands

Run the application:

```bash
npm start
```

Run with Node.js watch mode:

```bash
npm run dev
```

Run automated tests:

```bash
npm test
```

---

## Docker

The application includes a production-oriented Docker configuration.

The Docker image:

* Uses a lightweight Node.js base image
* Installs production dependencies only
* Runs as a non-root user
* Includes a Docker health check
* Uses a read-only root filesystem
* Uses `/tmp` as a temporary writable filesystem
* Enables automatic restart through Docker Compose
* Uses an isolated Docker network

### Build and Run

```bash
docker compose up --build -d
```

Check container status:

```bash
docker compose ps
```

Stop the application:

```bash
docker compose down
```

The local Docker deployment is available at:

```text
http://localhost:3000
```

---

## Environment Configuration

The application supports the following environment variables:

| Variable      | Description                | Example  |
| ------------- | -------------------------- | -------- |
| `PORT`        | Application listening port | `3000`   |
| `APP_VERSION` | Application version        | `2.0.0`  |
| `ENVIRONMENT` | Runtime environment        | `docker` |
| `LOG_LEVEL`   | Application log level      | `info`   |

Create a local `.env` file from:

```bash
.env.example
```

Environment files containing secrets or local configuration must not be committed to Git.

---

# CI Pipeline

GitHub Actions is used to automate testing and Docker image publishing.

The CI workflow runs on:

* Pushes to `main`
* Pull requests targeting `main`

### CI Workflow

```text
Git Push / Pull Request
        |
        v
GitHub Actions
        |
        v
Checkout Repository
        |
        v
Setup Node.js
        |
        v
Install Dependencies
        |
        v
Run Tests
        |
        v
Docker Build
        |
        v
GHCR
```

For pushes to `main`, the workflow:

1. Checks out the repository
2. Sets up Node.js
3. Installs dependencies
4. Runs automated tests
5. Authenticates to GHCR
6. Builds the Docker image
7. Publishes the Docker image to GHCR

Pull requests additionally validate that the Docker image can be built successfully.

---

# GitHub Container Registry

The Docker image is published to GitHub Container Registry:

```text
ghcr.io/samiul-sami-new/devops-deployment-dashboard
```

Two image tags are published for `main` builds:

```text
latest
```

and:

```text
<github-commit-sha>
```

The commit SHA tag provides an immutable reference to the image produced by a specific GitHub commit.

---

# AWS Deployment — Validated

The application was successfully deployed to an AWS EC2 environment during project validation.

### Deployment Architecture

```text
GitHub Actions
      |
      v
GitHub OIDC
      |
      v
AWS IAM Role
      |
      v
AWS Systems Manager
      |
      v
RHEL 8.10 EC2
      |
      v
Docker Compose
      |
      v
GHCR Docker Image
      |
      v
Running Container
```

The deployment process used AWS Systems Manager instead of inbound SSH.

This allowed the deployment workflow to operate without opening an additional inbound SSH port on the EC2 security group.

---

## AWS Deployment Process

The validated deployment workflow performed the following steps:

1. GitHub Actions authenticated to AWS using GitHub OIDC.
2. AWS IAM authorized the GitHub Actions deployment role.
3. AWS Systems Manager sent the deployment command to the EC2 instance.
4. The EC2 instance synchronized the application repository.
5. Docker Compose pulled the GHCR image.
6. Docker Compose recreated the application container.
7. The application health endpoint was checked.
8. The deployment was marked successful only after the health check passed.

---

## Deployment Verification

The AWS deployment was successfully validated with:

```text
SSM deployment completed successfully.
Health check passed
```

The deployed Docker container reported:

```text
Status: healthy
```

The application health endpoint returned:

```json
{
  "status": "ok"
}
```

The application status endpoint reported:

```text
status: operational
environment: docker
```

The running container was also verified to use the published GHCR image.

---

## Security

Security-related practices demonstrated in this project include:

* GitHub OIDC instead of long-lived AWS access keys for GitHub Actions
* AWS IAM role-based authentication
* Repository and branch-restricted OIDC trust policy
* No inbound SSH requirement for automated deployment
* Docker container runs as a non-root user
* Read-only container filesystem
* `no-new-privileges` security setting
* Production dependencies only in the production image
* Environment files excluded from the Docker build context
* Secrets are not committed to the repository

---

## Project Structure

```text
devops-deployment-dashboard/
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── src/
│   └── ...
│
├── tests/
│   └── ...
│
├── .dockerignore
├── .env.example
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── package.json
├── package-lock.json
└── README.md
```

---

# Testing

The application includes automated API tests.

Run:

```bash
npm test
```

The test suite validates the application's core API behavior.

Docker deployment was additionally validated through:

```bash
docker compose ps
```

and:

```bash
curl http://localhost:8080/health
```

during AWS deployment validation.

---

# Deployment Validation Summary

| Area                       | Status |
| -------------------------- | ------ |
| Node.js Application        | ✅      |
| Express API                | ✅      |
| Automated Tests            | ✅      |
| Docker Build               | ✅      |
| Docker Compose             | ✅      |
| Container Health Check     | ✅      |
| GHCR Publishing            | ✅      |
| GitHub Actions CI          | ✅      |
| GitHub OIDC Authentication | ✅      |
| AWS IAM                    | ✅      |
| AWS Systems Manager        | ✅      |
| AWS EC2 Deployment         | ✅      |
| Deployment Health Check    | ✅      |

---

# Future Improvements

Potential future enhancements include:

* Prometheus metrics
* Grafana dashboards
* Centralized log aggregation
* Application performance monitoring
* Automated alerting
* Deployment rollback strategy
* Immutable production image deployment
* Infrastructure as Code using Terraform
* Kubernetes deployment
* Blue/green or canary deployment

---

## Project Status

### Core DevOps Workflow — Completed

The project successfully demonstrates an end-to-end containerized application workflow from source code to automated CI and validated cloud deployment.

The AWS environment used for the deployment demonstration may be decommissioned after validation; the deployment architecture and implementation remain documented in this repository.

---

## Author

**Samiul Sami**

Senior Software QA Engineer

This project demonstrates practical skills in:

* Software Testing
* Automation
* Docker
* CI/CD
* GitHub Actions
* Container Registry
* AWS
* Cloud Deployment
* DevOps Engineering