const express = require('express')
const router = express.Router()
const dbo = require('../db/connect')

// error handler
function asyncHandler(cb) {
	return async (req,res, next) => {
		try {
			await cb(req, res, next)
		} catch(err) {
			next(err)
		}
	}
}

// get all records
router.route('/creatures').get(asyncHandler(async (req, res) => {
	const dbConnect = dbo.getDb()

	dbConnect
		.collection('creatures')
		.find({})
		.limit(99)
		.toArray((err, result) => {
			if (err) {
				res.status(400).send('Unable to fetch creatures')
			} else {
				res.json(result)
			}
		})
}))

// create a record
router.route('/creatures/create').post(asyncHandler(async (req, res) => {
	const dbConnect = dbo.getDb()
	const creature = {
		modified: new Date(),
		name: req.body.name,
		desc: req.body.desc,
		fact: req.body.fact,
		region: req.body.region,
		type: req.body.type
	}

	dbConnect
		.collection('creatures')
		.insertOne(creature, (err, result) => {
			if (err) {
				res.status(400).send(`Creature not added: ${result.name}`)
			} else {
				console.log(`Creature added: ${result.name}`)
				res.status(204).send()
			}
		})
}))

// update a record
router.route('/creatures/update/:id').post(asyncHandler(async (req, res) => {
	const dbConnect = dbo.getDb()
	const creature = { _id: req.params.id }
	const updates = {
		$set: {
			name: req.body.name,
			desc: req.body.desc,
			fact: req.body.fact,
			region: req.body.region,
			type: req.body.type
		}
	}

	dbConnect
		.collection('creatures')
		.updateOne(creature, updates, (err, _result) => {
			if (err) {
				res
					.status(400)
					.send(`Creature not updated: ${creature.name}`)
			} else {
				console.log(`Creature updated: ${creature.name}`)
			}
		})
}))

// delete a record
router.route('/creatures/delete/:id').delete(asyncHandler(async (req, res) => {
	const dbConnect = dbo.getDb()
	const creature = { _id: req.params.id }

	dbConnect
		.collection('creatures')
		.deleteOne(creature, (err, _result) => {
			if (err) {
				res
					.status(400)
					.send(`Creature not deleted: ${creature.name}`)
			} else {
				console.log(`Creature deleted: ${creature.name}`)
			}
		})
}))

module.exports = router
