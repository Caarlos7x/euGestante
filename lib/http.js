function methodNotAllowed(res) {
  res.status(405).json({ error: "Method not allowed" });
}

function badRequest(res, message) {
  res.status(400).json({ error: message });
}

module.exports = { methodNotAllowed, badRequest };
