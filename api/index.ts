import { createRequestHandler } from "@vercel/node";
import { app } from "../src/app";

// Vercel serverless adapter: wraps Express app for serverless deployment
export default createRequestHandler(app);