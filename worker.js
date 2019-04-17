const throng = require('throng')
const Queue = require('bull')

const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379"
const workers = process.env.WEB_CONCURRENCY || 2
const maxJobsPerWorker = 50

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms))
}

function start() {
	const workQueue = new Queue('work', REDIS_URL)
	
	workQueue.process(maxJobsPerWorker, async (job) => {
		console.log('====> Job started')
		let progress = 0
		
		// simulate an error 5% of the time
		if (Math.random() < 0.05) {
			throw new Error("This job failed!")
		}
		
		while (progress < 100) {
			await sleep(50)
			progress += 1
			job.progress(progress)
		}

		return { value: "This will be stored" }
	});
}

throng({ workers, start })
console.log('====> Worker started and listening...')
