import "dotenv/config"; // loads .env before any module touches process.env
import { app } from "./src/app.js";
import { ensureDatabase } from "./src/db/bootstrap.js";
const port = Number(process.env.PORT ?? 3000);
async function main() {
    // Create schema and seed demo data before accepting traffic (idempotent).
    await ensureDatabase();
    app.listen(port, () => {
        console.log(`[tranquil-peeplz] Node server running at http://localhost:${port}`);
    });
}
main().catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
});
//# sourceMappingURL=server.js.map