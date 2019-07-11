const express = require('express')
const expressStaticGzip = require('express-static-gzip')
const path = require('path')

const NODE_ENV = process.env.NODE_ENV || 'dev'
const PORT = (NODE_ENV == 'production') ? 80 : 8080
const ROOT = path.resolve(__dirname, '..')

const app = express()

app.get('/', (req, res) => {
    res.sendFile(ROOT + '/public/views/game.html')
})

app.post('/mm/play', (req, res) => {
    const host = req.get('host').split(':')[0]
    res.json({
        host: `ws://${host}:42069/play`
    })
})

app.get('/mm/spectate', (req, res) => {
    const host = req.get('host').split(':')[0]
    res.json({
        host: `ws://${host}:42069/spectate`
    })
})

app.use('/static/scripts', expressStaticGzip('./public/scripts', {
    enableBrotli: true,
    orderPreference: ['br', 'gz'],
    setHeaders: function (res, path) {
        res.setHeader("Cache-Control", "public, max-age=31536000");
    }
}))

app.use('/static/sourcemaps', express.static('./public/sourcemaps'))

app.use('/static/styles', express.static('./public/styles'))
app.use('/static/styles/bootstrap', express.static('./node_modules/bootstrap/dist/css'))

app.use('/static/images/', express.static('./public/images'))

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
