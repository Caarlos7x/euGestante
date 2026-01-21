const { db } = require("../lib/firebaseAdmin");
const { requireAuth } = require("../lib/auth");
const { methodNotAllowed } = require("../lib/http");

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

  const collectionRef = db.collection("users").doc(user.uid).collection("exames");

  if (req.method === "GET") {
    const snapshot = await collectionRef.orderBy("data", "desc").limit(100).get();
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).json({ items: data });
    return;
  }

  const payload = req.body || {};
  const record = {
    ...payload,
    createdAt: new Date().toISOString(),
  };

  const docRef = await collectionRef.add(record);
  res.status(201).json({ id: docRef.id, ...record });
};
