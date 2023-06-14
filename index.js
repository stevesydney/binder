const express = require("express");
const favicon = require('serve-favicon');
const http = require('http');

const app = express();
const server = http.createServer(app);

app.use('/assets', express.static('assets'));
app.use('/js', express.static('js'));
app.use('/css', express.static('css'));
app.use(favicon(__dirname + '/favicon.ico'));


app.get('/test-site-04', (req, res) => {
    res.sendFile(__dirname + '/test-site-04.html');
});

app.get('/test-site-03', (req, res) => {
    res.sendFile(__dirname + '/test-site-03.html');
});

app.get('/test-site-02', (req, res) => {
    res.sendFile(__dirname + '/test-site-02.html');
});

app.get('/test-site-01', (req, res) => {
    res.sendFile(__dirname + '/test-site-01.html');
});


server.listen(3000, () => {
    console.log('listening on *:3000');
});