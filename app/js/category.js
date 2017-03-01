$.get('/ajax/category', (data) => {
	if (!data.ERROR)
		new Vue({
			data: function() {
				return {
					male: data.data,
					isMale: false
				}
			}
		}).$mount('#category')
})
