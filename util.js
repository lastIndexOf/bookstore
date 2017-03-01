const cheerio = require('cheerio')
		, Books = require('./Models/Movie')
		, Book = Books.Book
		, baseUrl = 'http://www.quanshu.net/book'
		 
exports.html2data = function*(html, request) {
	const $ = cheerio.load(html)
			, src = $('#navList .seeWell.cf li:first-child > a').attr('href')

	if (src) {
		const book = yield getBook(src, request)
				, jQuery = cheerio.load(book)	
		let _book = {}

		_book.authors = jQuery('.author .bookDetail .bookso').find('dd a').text()
		_book.cover = jQuery('#container .mainnav .main.b-detail').find('.l.mr11 > img').attr('src')
		_book.src = jQuery('#container .mainnav .main.b-detail .detail .b-info .b-oper > a:first-child').attr('href').split(baseUrl)[1]
		_book.summary = jQuery('#container .mainnav .main.b-detail').find('.detail .b-info #waa').text()
		_book._is = 1

		return _book
	} 
	else if ($('.author .bookDetail .bookso').find('dd a').text()) {
		let _book = {}

		_book.authors = $('.author .bookDetail .bookso').find('dd a').text()
		_book.cover = $('#container .mainnav .main.b-detail').find('.l.mr11 > img').attr('src')
		_book.summary = $('#container .mainnav .main.b-detail').find('.detail .b-info #waa').text()
		_book.src = $('#container .mainnav .main.b-detail .detail .b-info .b-oper > a:first-child').attr('href').split(baseUrl)[1]
		_book._is = 1

		return _book
	}
	else
		return { _is: 0, cover: 'http://www.quanshu.net/modules/article/images/nocover.jpg', authors: '没有找到这本书%>_<%', summary: '没有爬到数据...' }
}

exports.getCurPage = function*(request, src, page) {
	let curPage = {}
	const URL = baseUrl + src
			, pages = yield getBook(URL, request)
			, $ = cheerio.load(pages)
			, pageslist = $('#chapter .chapterSo .chapterNum ul .clearfix.dirconone li')
			, pageA = $(pageslist[`${ page }`]).find('a')
			, contentPage = yield getBook(URL + '/' + pageA.attr('href'), request)

	curPage.title = pageA.text()
	curPage.content = cheerio.load(contentPage)('#content').text()

	return curPage
}

exports.getPageslist = function*(src, request, title) {
	const html = yield getBook(baseUrl + src, request)
			, $ = cheerio.load(html)

	let arcs = []
	$('#chapter .chapterSo .chapterNum ul .clearfix.dirconone li')
		.each((index, item) => {
			arcs.push({ _id: '', title: $(item).find('a').text(), page: index })
		})

	return { arcs, title, src }
}

function getBook(url, request) {
	return new Promise((resolve, reject) => {
		let key = false
			, get = false
		setTimeout(() => {
			if (!key) {
				get = true
				console.log('请求超时...')
				resolve('timeout')
			}
		},20000)
		console.log(`正在爬取${ url }...`)
		request.get(url)
				.charset('gbk')
				.end((err, res) => {
					if (get)
						return
					if (err)
						reject(err)
					key = true
					console.log('爬取成功,正在分析...')
					// console.log(res)
					resolve(res.text)
				}).on('error', (err) => {
					reject(err)
				})
	})
}

// function addBook(html) {
// 	return new Promise((resolve, reject) => {
// 		const $ = cheerio.load(html)

// 		book.name =	$('#container .mainnav .main.b-detail').find('.detail .b-info > h1').text()
// 		book.autor = $('.author .bookDetail .bookso').find('dd a').text()
// 		book.avaiter = $('#container .mainnav .main.b-detail').find('.l.mr11 > img').attr('src')
// 		book.intrudoce = $('#container .mainnav .main.b-detail').find('.detail .b-info #waa').text()
// 		book.arcs =[]

// 		book = new Movie(book)

// 		book.save((err) => {
// 			if (err)
// 				reject(err)

// 			resolve()
// 		})
// 	})
// }