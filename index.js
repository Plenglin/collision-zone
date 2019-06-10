import express from 'express';

const PORT = 3000

const app = express()
app.get('/', (req, res) => res.send('test'))

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
