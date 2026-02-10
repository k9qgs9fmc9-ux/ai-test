# Qwen Q&A Service Demo

This project demonstrates a simple Q&A service using React, Redux, Ant Design, and the Qwen (DashScope) API.

## Prerequisites

- Node.js installed
- A DashScope API Key (for Qwen model access)

## Setup

1.  **Install Dependencies**
    ```bash
    # Root (Frontend)
    npm install
    
    # Server (Backend)
    cd server
    npm install
    ```

2.  **Configure API Key**
    -   Go to `server` directory.
    -   Copy `.env.example` to `.env`.
    -   Edit `.env` and paste your DashScope API Key.
        ```
        DASHSCOPE_API_KEY=your_actual_api_key_here
        ```

3.  **Run the Application**
    
    You need two terminals.

    **Terminal 1 (Backend):**
    ```bash
    cd server
    node index.js
    ```
    Server runs on `http://localhost:3001`.

    **Terminal 2 (Frontend):**
    ```bash
    npm run dev
    ```
    Frontend runs on `http://localhost:5173`.

## Features

-   **Frontend**: React + Vite
-   **UI Library**: Ant Design
-   **State Management**: Redux Toolkit
-   **Backend**: Express + Axios (Proxies requests to Alibaba Cloud DashScope)
