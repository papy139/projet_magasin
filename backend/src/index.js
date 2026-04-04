require('dotenv').config();
const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));

app.use(errorHandler);

app.listen(PORT, () => {});
