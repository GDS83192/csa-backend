const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const { sequelize, User, Produce, Selection } = require('./models');
const auth = require('./middleware/auth');

app.post('/api/register', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).send({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).send(error);
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).send({ error: 'Invalid email or password' });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    res.send({ token });
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get('/api/produce', auth, async (req, res) => {
  try {
    const produce = await Produce.findAll();
    res.send(produce);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/api/selection', auth, async (req, res) => {
  try {
    const selection = await Selection.create({ userId: req.user.id });
    await selection.addProduce(req.body.map(item => item.id));
    res.status(201).send({ message: 'Selection saved successfully' });
  } catch (error) {
    res.status(500).send(error);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await sequelize.sync();
});
