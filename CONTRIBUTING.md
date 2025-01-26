How to Contribute to Win Your Argument
Hello, and thank you for your interest in contributing to Win Your Argument! Your help is vital in enhancing this AI agent to make it more effective and impactful. Here's a guide to ensure your contributions align with the project structure and development practices.

Project Structure
Win Your Argument is organized into two primary domains:

Frontend (ui directory): A Next.js application that manages the user interface and user interactions.
Backend (root and src directory): The backend logic resides in the src folder, while the root directory contains the main package.json for managing backend dependencies.
The core functionality is powered by the Retrieval-Augmented Generation (RAG) agent, implemented in the `src/search/metaSearchAgent.ts` file. It integrates APIs like Groq, Gemini, and SearchXNG to deliver data-driven insights.
Setting Up Your Environment
Follow these steps to set up your development environment:

Backend
Locate the sample.config.toml file in the root directory.
Rename it to config.toml and populate it with the required backend configurations.
Run npm install to install the backend dependencies.
Run npm run db:push to initialize the local SQLite database.
Start the backend in development mode using npm run dev.
Frontend
Go to the ui directory and rename .env.example to .env, filling in the frontend-specific environment variables.
Execute npm install in the ui directory to install frontend dependencies.
Start the frontend development server with npm run dev.
Note: Docker configurations are available for production environments, but npm run dev is recommended for local development.

Coding and Contribution Practices
Before submitting your changes:

Thoroughly test your code to ensure it works as expected.
Run npm run format:write to format your code according to the project's style guide.
While a formal code of conduct is in progress, we ask you to collaborate respectfully and constructively.
Your contributions will play a vital role in improving Win Your Argument and bringing its full potential to life. Thank you for your dedication and effort