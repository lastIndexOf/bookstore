const mongoose = require('mongoose')

let MovieSchema = new mongoose.Schema({
	title: String,
	authors: String,
	cover: String,
	summary: String,
	allArcs: {
		type: Number,
		default: 0
	},
	arcs: [{
		title: String,
		content: String
	}],
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

MovieSchema.pre('save', function(next) {
	if (this.isNew)
		this.meta.updateAt = this.meta.createAt = new Date()
	else
		this.meta.updateAt = new Date()

	next()
})

MovieSchema.statics = {
	findById: function(id, cb) {
		return this.find({ _id: id })
			.exec(cb)
	},
	fetch: function(cb) {
		return this.find({})
			.exec(cb)
	}
}

module.exports = MovieSchema