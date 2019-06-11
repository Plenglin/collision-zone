const express = require('express');

const PORT = 3000;
const SERVER_INFO = {
    url: 'ws://localhost:42069'
};

const app = express();

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/views/game.html');
});
app.get('/data/server-info', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(SERVER_INFO));
});

app.use('/static/scripts', express.static('./public/scripts'));
app.use('/static/scripts/bootstrap', express.static('./node_modules/bootstrap/dist/js'));
app.use('/static/scripts/jquery', express.static('./node_modules/jquery/dist'));
app.use('/static/scripts/phaser', express.static('./node_modules/phaser/dist'));
app.use('/static/styles', express.static('./public/styles'));
app.use('/static/styles/bootstrap', express.static('./node_modules/bootstrap/dist/css'));

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
