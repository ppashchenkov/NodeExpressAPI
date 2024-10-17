import express from 'express';
import bodyParser from 'body-parser';
import usersRoutes from './routes/users.js';
import path from 'path'
import Log from './logger/logger.js'

const app = express();
const PORT = 5000;

let staticPath = path.join(path.resolve(), 'public')

app.use(bodyParser.json());
app.use(express.static('public'))
app.use('/api/users', usersRoutes);

//GET '/'
app.get('/', (req, res) => {
    res.sendFile(path.join(staticPath, 'index.html'))
})

app.get('/api/', (req, res) => {
    Log.info("GET request to endpoint '/' received.");

    res.send("Node Express API Server App");
})



app.listen(PORT, () => Log.server(`Server is running on http://localhost:${PORT}`))
