# Online Judge (OJ)

An Online Judge platform designed for seamless code submission and execution. It features Docker-based code execution, Redis-Celery job queueing, and support for personal and public notes. Submissions are tracked for users to review and improve their solutions.

## Features

- Code submission with support for multiple languages
- Docker-based code execution for secure and isolated runs
- Job queueing with Redis and Celery for efficient task handling
- Notes system (personal and public)
- Submission history with verdicts: Accepted, Wrong Answer, Compilation Error, Runtime Error, TLE, MLE

## Prerequisites

Ensure the following are installed on your system before setting up the project:

- Node.js and npm
- Docker
- Redis
- Python and pip (for Celery)

## Installation & Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Whizzion957/OJ.git
   cd OJ

2. Add env to server according to sample.env with MONGODB_URL and JWT_SECRET

3. Turn on docker desktop and run the following command:
    ```bash
    docker run -p 6379:6379 redis

4. Install and run the server.
    ```bash
    cd server
    npm install
    npm start

5. Open a new terminal and run the client
    ```bash
    cd client
    npm install
    npm start
