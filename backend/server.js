const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

// **Setup Sequelize Connection**
const sequelize = new Sequelize('mydb', 'admin', 'Timndbpw10!', {
  host: "database-1.cnqe00p5d1ax.us-east-1.rds.amazonaws.com",
  dialect: 'mysql'
});

// **Test the connection**
sequelize.authenticate()
  .then(() => console.log('Connected to the mydb database via Sequelize!'))
  .catch(err => console.error('Unable to connect to database:', err));

// **Define Puppy Model**
const Puppy = sequelize.define('Puppy', {
  pet_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(50), allowNull: false },
  breed: { type: DataTypes.STRING(20), allowNull: true },
  age_est: { type: DataTypes.INTEGER, allowNull: true },
  current_kennel_number: { type: DataTypes.INTEGER, allowNull: true }
}, {
  tableName: 'puppies',  // Make sure this matches your actual MySQL table name
  timestamps: false
});

// **Sync Model with Database**
sequelize.sync()
  .then(() => console.log('Puppy table synced with database'))
  .catch(err => console.error('Error syncing database:', err));

// **Routes**
app.get('/puppies', async (req, res) => {
  try {
    const puppies = await Puppy.findAll();
    res.json(puppies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/puppies/:id', async (req, res) => {
  try {
    const puppy = await Puppy.findByPk(req.params.id);
    if (!puppy) return res.status(404).json({ message: 'Puppy not found' });
    res.json(puppy);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/puppies', async (req, res) => {
  try {
    const newPuppy = await Puppy.create(req.body);
    res.status(201).json(newPuppy);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/puppies/:id', async (req, res) => {
  try {
    const [updated] = await Puppy.update(req.body, { where: { pet_id: req.params.id } });
    if (!updated) return res.status(404).json({ message: 'Puppy not found' });
    res.json({ message: 'Puppy updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/puppies/:id', async (req, res) => {
  try {
    const deleted = await Puppy.destroy({ where: { pet_id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'Puppy not found' });
    res.json({ message: 'Puppy deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// **Start Server**
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
