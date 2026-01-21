const { db } = require("../lib/firebaseAdmin");
const { requireAuth } = require("../lib/auth");
const { methodNotAllowed, badRequest } = require("../lib/http");

const TYPES = {
  peso: { collection: "registros_peso", required: ["data", "pesoKg"] },
  glicemia: {
    collection: "registros_glicemia",
    required: ["dataHora", "valorMgDl", "tipo"],
  },
  pressao: {
    collection: "registros_pressao",
    required: ["dataHora", "sistolica", "diastolica"],
  },
};

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

  const type = (req.query.type || "").toString();
  const config = TYPES[type];

  if (!config) {
    badRequest(res, "Invalid type. Use: peso, glicemia, pressao");
    return;
  }

  const collectionRef = db
    .collection("users")
    .doc(user.uid)
    .collection(config.collection);

  if (req.method === "GET") {
    const limit = Math.min(Number(req.query.limit || 50), 200);
    const snapshot = await collectionRef.orderBy("createdAt", "desc").limit(limit).get();
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).json({ items: data });
    return;
  }

  const payload = req.body || {};

  for (const field of config.required) {
    if (payload[field] === undefined || payload[field] === "") {
      badRequest(res, `Missing field: ${field}`);
      return;
    }
  }

  const record = {
    ...payload,
    createdAt: new Date().toISOString(),
  };

  const docRef = await collectionRef.add(record);
  res.status(201).json({ id: docRef.id, ...record });
};
