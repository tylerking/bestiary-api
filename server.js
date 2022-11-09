// Loads the configuration from config.env to process.env
require('dotenv').config()

const express = require('express') 
const cors = require('cors')
const dbo = require('./db/connect')
const PORT = process.env.PORT || 5000
const app = express()

// express middleware
app.use(cors())
app.use(express.json())
app.use(express.static('public'))
app.set('view engine', 'pug')

// routes
const routes = require ('./routes/records')
app.use('/api', routes)

app.get('/', (req, res) => {
	const dbConnect = dbo.getDb()

	dbConnect
		.collection('creatures')
		.find({})
		.limit(99)
		.toArray((err, result) => {
			if (err) {
				res.status(400).send('Unable to fetch creatures')
			} else {
				res.render('index', { 
					title: 'American Bestiary', 
					data: result 
				})
			}
		})  
})

// if no routes are found use this middleware
app.use((req, res, next) => {
	const err = new Error('Not Found')
	err.status = 404
	next(err)
})

app.use((err, req, res) => {
	res.status(err.status || 500)
	res.json({
		error: {
			message: err.message
		}
	})
})

// connect to database on server start
dbo.connectToServer((err) => {
	if (err) {
		console.error(err)
		process.exit()
	}

	// start Express server
	app.listen(PORT, () => {
		console.log(`Server running on port: ${PORT}`)
	})
})