const { db } = require("../lib/firebaseAdmin");
const { requireAuth } = require("../lib/auth");
const { methodNotAllowed, badRequest } = require("../lib/http");

const ALLOWED_FIELDS = [
  "nome",
  "dataGestacaoInicio",
  "dataPrevistaParto",
  "idadeGestacionalAtual",
  "telefone",
];

module.exports = async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "GET" && req.method !== "POST") {
    methodNotAllowed(res);
    return;
  }

  const user = await requireAuth(req, res);
  if (!user) {
    return;
  }

  const userRef = db.collection("users").doc(user.uid);

  if (req.method === "GET") {
    const snapshot = await userRef.get();
    res.status(200).json({ id: user.uid, ...(snapshot.data() || {}) });
    return;
  }

  const payload = req.body || {};
  const update = {};

  for (const field of ALLOWED_FIELDS) {
    if (payload[field] !== undefined) {
      update[field] = payload[field];
    }
  }

  if (Object.keys(update).length === 0) {
    badRequest(res, "No valid fields provided");
    return;
  }

  update.atualizadoEm = new Date().toISOString();
  await userRef.set(update, { merge: true });

  res.status(200).json({ ok: true });
};
