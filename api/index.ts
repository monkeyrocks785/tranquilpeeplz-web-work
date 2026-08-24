import { app } from "../src/app";

// Serverless adapter: the same Express app serves every route on Vercel.
// vercel.json rewrites all traffic here. The schema+seed bootstrap runs on
// first request via the middleware in src/app.ts.
export default app;
