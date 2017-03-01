const mongoose = require('mongoose')

let BeautySchema = new mongoose.Schema({
	src: Buffer,
	meta: {
		createAt: {
			type: Date,
			default: new Date()
		},
		updateAt: {
			type: Date,
			default: new Date()
		}
	}
})

module.exports = BeautySchema