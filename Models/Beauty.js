const BeautySchema = require('../Schemas/Beauty')
		, mongoose = require('mongoose')

const Beauty = mongoose.model('beauties', BeautySchema)

module.exports = Beauty
