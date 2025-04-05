# Email Service

A Node.js email service that receives emails via ForwardEmail.net webhooks and stores them in Supabase.

## Features

- Receives emails via ForwardEmail.net webhooks
- Stores email data in Supabase database
- Simple REST API interface

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables (if needed)
4. Start the server:
   ```bash
   npm start
   ```

## API Endpoints

- `GET /email` - Returns API usage information
- `POST /email` - Receives email webhooks from ForwardEmail.net

## Deployment

This service is designed to be deployed on Render.com. The service expects to receive webhooks from ForwardEmail.net.

## Environment Variables

- `PORT` - Server port (default: 3000)
- Supabase credentials are currently hardcoded (should be moved to environment variables in production) 