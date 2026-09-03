import { app } from "../src/app";
import { createVercelHandler } from "@vercel/node";

// Vercel serverless adapter: wraps Express app for Vercel
export default createVercelHandler(app);