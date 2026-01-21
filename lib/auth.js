const { admin } = require("./firebaseAdmin");

async function requireAuth(req, res) {
  const header = req.headers.authorization || "";
  const match = header.match(/^Bearer (.+)$/);

  if (!match) {
    res.status(401).json({ error: "Missing bearer token" });
    return null;
  }

  try {
    const decoded = await admin.auth().verifyIdToken(match[1]);
    return decoded;
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
    return null;
  }
}

module.exports = { requireAuth };
