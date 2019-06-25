const express = require('express')
const expressStaticGzip = require('express-static-gzip')
const path = require('path')

const PORT = 80
const SERVER_INFO = {
    url: 'ws://localhost:42069'
}
const ROOT = path.resolve(__dirname, '..')

const app = express()

app.get('/', (req, res) => {
    res.sendFile(ROOT + '/public/views/game.html')
})

app.get('/data/server-info', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(JSON.stringify(SERVER_INFO))
})

app.use('/static/scripts', expressStaticGzip('./public/scripts', {
    enableBrotli: true,
    orderPreference: ['br', 'gz'],
    setHeaders: function (res, path) {
        res.setHeader("Cache-Control", "public, max-age=31536000");
    }
}))

app.use('/static/styles', express.static('./public/styles'))
app.use('/static/styles/bootstrap', express.static('./node_modules/bootstrap/dist/css'))

app.use('/static/images/', express.static('./public/images'))

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
