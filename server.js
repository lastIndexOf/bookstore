const koa = require('koa')
		, router = require('koa-route')
		, static = require('koa-static')
		, bodyParser = require('koa-bodyparser')
		,	mongoose = require('mongoose')
		, superagent = require('superagent')
		, install = require('superagent-charset')
		, views = require('co-views')
		, iconv = require('iconv-lite')
		, querystring = require('querystring')
		,	Books = require('./Models/Movie')
		, util = require('./util')
		, service = require('./service/webAppService')
		, appData = require('./data.json')
	  , seller = appData.seller
	  , goods = appData.goods
	  , ratings = appData.ratings
		, app = koa()
		, request = install(superagent)

const dbUrl = 'mongodb://localhost:27017/avMovies'
		, Book = Books.Movie
		, render = views('app/views', {
				map: { html: 'ejs' }
			})
// 连接数据库
mongoose.connect(dbUrl)


app.use(static('app', { index: 'none' }))
app.use(bodyParser())

app.use(router.get('/', function*() {
	this.body = yield render('index', {
		title: '首页'
	})
}))
app.use(router.get('/book', function*() {
	const query = this.request.query
			, _id = query.id
			, title = query.title

	if (_id && _id !== 'undefined') {
		const book = yield Book.findOne({_id: _id}, ['title', 'cover', 'summary', 'authors'])	
		this.body = yield render('book', { book })
	} else {
		const _title = escape(iconv.encode(title, 'gb2312').toString('binary'))
		let result = yield request.get('http://www.quanshu.net/modules/article/search.php')
			.query(`searchkey=${ _title }`)
			.query('searchtype=articlename&searchbuttom.x=0&searchbuttom.y=0')
			.charset('gbk')

		result = yield util.html2data(result.text, request)
		result.title = title

		if (result._is)
			this.body = yield render('book', { book: result })
		else {
			this.body = yield render('book', { book: result })
		}
	}

}))

app.use(router.get('/category', function*() {
	this.body = yield render('category', { title: '爬自全书网...' })
}))

app.use(router.get('/api/seller', function* () {
  this.body = {
    errno: 0,
    data: seller
  }
}))
app.use(router.get('/api/goods', function* () {
  this.body = {
    errno: 0,
    data: goods
  }
}))
app.use(router.get('/api/ratings', function* () {
  this.body = {
    errno: 0,
    data: ratings
  }
}))
app.use(router.get('/catalog', function*() {
	const query = this.request.query
			, _id = query.id
			, _title = query.title
			, _src = query.src
			, page = query.page - 0

	let data = []

	if (_id)
		data = yield Book.findOne({_id: _id}, ['title', 'arcs'])
	else
		data = yield util.getPageslist(_src, request, _title)

	this.body = yield render('catalog', { title: _title, page, data: data })
}))

// app.use(router.get('/male', function*() {
// 	this.body = yield render('male', {})
// }))
// app.use(router.get('/female', function*() {
// 	this.body = yield render('female', {})
// }))
// app.use(router.get('/search', function*() {
// 	this.body = yield render('search', {})
// }))
// app.use(router.get('/rank', function*() {
// 	this.body = yield render('rank', {})
// }))

app.use(router.get('/ajax/index', function*(){
	this.body = service.get_index_data()
}))

app.use(router.get('/ajax/book', function*(){
	var params = querystring.parse(this.req._parsedUrl.query)
	var id = params.id
	if(!id){
	   id = ""
	}
	this.body = service.get_book_data(id)
}))

app.use(router.get('/ajax/page', function*() {
	const query = this.request.query
			, _id = query.id
			, page = query.page - 0

	if (_id) {
		const pageDate = yield Book.findOne({_id: _id}, ['arcs'])
		this.body = { ERROR: 1, data: pageDate.arcs[`${ page }`] }
	} else {
		const _title = query.title 
				, _src = query.src
				, pageDate = yield util.getCurPage(request, _src, page)
		
		this.body = { ERROR: 1, data: pageDate }
	}
}))

app.use(router.get('/ajax/category', function*(){
	const books = yield Book.find({}, ['title', 'authors', 'cover', 'summary']).limit(9)

	if (books)
		this.body = { ERROR: 0, data: books }
	else
		this.body = { ERROR: 1 }
}))

// app.use(router.get('/ajax/chapter_data', function*(){
// 	var params = querystring.parse(this.req._parsedUrl.query)
// 	var id = params.id
// 	if(!id){
// 	   id = ""
// 	}
// 	this.body = service.get_chapter_content_data(id)
// }))

// app.use(router.get('/ajax/rank', function*(){
// 	this.body = service.get_rank_data()
// }))

// app.use(router.get('/ajax/male', function*(){
// 	this.body = service.get_male_data()
// }))

// app.use(router.get('/ajax/female', function*(){
// 	this.body = service.get_female_data()
// }))

app.listen(3004)
console.log('listing on 3004')
