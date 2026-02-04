// check-env.js
const dotenv = require("dotenv");

dotenv.config({ path: ".env.local" });

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_URL) {
  console.error("❌ NEXT_PUBLIC_API_BASE_URL est manquante");
  process.exit(1);
}

if (
  API_URL.includes("localhost")
) {
  console.error(
    `❌ Build bloqué : NEXT_PUBLIC_API_BASE_URL ne doit pas contenir localhost (${API_URL})`
  );
  process.exit(1);
}

console.log("✅ Variables d'environnement OK");
