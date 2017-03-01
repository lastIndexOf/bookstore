const MovieSchema = require('../Schemas/Movie')
		, mongoose = require('mongoose')

let Movie = mongoose.model('Movie', MovieSchema)
	, Book = mongoose.model('Book', MovieSchema)

module.exports = { Movie, Book }
