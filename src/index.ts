import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import userRoutes from './routes/user.routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/user', userRoutes);
app.use('/data', userRoutes); 

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});