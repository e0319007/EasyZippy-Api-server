const express = require('express');
const router = express.Router();

router.get('/test', async (req, res) => {
  return res.status(200).send('Test');
});

module.exports = router;