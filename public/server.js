const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const DEMO_PASSWORD =
  process.env.QX999_PASSWORD || "123456";

app.use(express.json());

app.use(
  express.static(
    path.join(__dirname, "public")
  )
);

app.post("/api/check-password", (req, res) => {
  const password =
    String(req.body?.password || "");

  if (password === DEMO_PASSWORD) {
    return res.json({
      valid: true
    });
  }

  return res.status(401).json({
    valid: false
  });
});

app.listen(PORT, () => {
  console.log(
    `QX999 Demo running on port ${PORT}`
  );
});
