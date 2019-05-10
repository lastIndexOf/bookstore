# 简单书城

- [这是另外的一个线上书城](http://www.ibiquwu.com)

利用vue+nodejs+koa+mongodb搭建的简易移动书城

使用

`git clone https://github.com/lastIndexOf/bookstore`

`cd bookstore`

`npm i`

`node server`

`打开浏览器 enjoy`

其中, 排行榜单中的数据来自数据库，直接从数据库中读取，而其他榜单的数据皆来自mock数据，在点进详情页时会自动根据书名去爬全书网，有些mock数据可能爬取不到数据，等待后续优化...
