import express from 'express';
import bodyParser from 'body-parser';
import usersRoutes from './routes/users.js';
import path from 'path'
import log from 'npmlog';
import Log from './logger/logger.js'

// const log = require('npmlog')
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
app.get('/add', (req, res) => {
    res.sendFile(path.join(staticPath, 'index.html'))
})
app.get('/search', (req, res) => {
    res.sendFile(path.join(staticPath, 'search.html'))
})

app.get('/edit', (req, res) => {
    res.sendFile(path.join(staticPath, 'edit.html'))
})

app.get('/delete', (req, res) => {
    res.sendFile(path.join(staticPath, 'delete.html'))
})

app.get('/api/', (req, res) => {
    Log.info("GET request to endpoint '/' received.");

    res.send("Node Express API Server App");
})



app.listen(PORT, () => Log.server(`Server is running on http://localhost:${PORT}`))
