const express = require('express')
const Queue = require('bull')
const PORT = process.env.PORT || 4007
let REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

let amazingWorkQueue = new Queue('amazing_work', REDIS_URL)

const app = express()
// app.use(express.static(path.join(__dirname, 'public')))

app.listen(PORT, () => console.log(`App listening on port ${PORT}!`))

// app.get('/', (req, res) => res.send('Hello World!'))
app.get('/', (req, res) => res.sendFile('index.html', { root: __dirname }))
app.get('/client.js', (req, res) => res.sendFile('client.js', { root: __dirname }))

app.post('/job', async (req, res) => {
	let job = await amazingWorkQueue.add()
	res.json({ id: job.id })
});

app.get('/job/:id', async (req, res) => {
	let id = req.params.id
	let job = await amazingWorkQueue.getJob(id)

	if (job === null) {
		res.status(404).end()
	} else {
		let state = await job.getState()
		let progress = job._progress
		let reason = job.failedReason
		res.json({ id, state, progress, reason })
	}
});

amazingWorkQueue.on('global:completed', (jobId, result) => {
  console.log(`Job completed with result ${result}`)
})