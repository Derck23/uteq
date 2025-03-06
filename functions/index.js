const functions = require("firebase-functions");
const app = require("./backend"); // Importa tu backend

// Exporta tu aplicación Express como Cloud Function
exports.api = functions.https.onRequest(app);
