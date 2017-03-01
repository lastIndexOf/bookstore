$.get('/ajax/index', function(data) {
	new Vue({
		data: {
			top: data.items[0].data.data,
			hot: data.items[1].data.data,
			recommend: data.items[2].data.data,
			female: data.items[3].data.data,
			male: data.items[4].data.data,
			free: data.items[5].data.data,
			highlight: 1,
			tabA: 0,
			isMale: true
		},
		computed: {
			tabSwipe: function() {
				if (this.highlight === 1)
					return `translateX(-${ this.tabA }px)`
				else {
					const width = this.$refs.tabA.offsetWidth
							, distance = (width + 34) / 2

					return `translateX(${ distance }px)`
				}				
			}
		},
		mounted: function() {
			const width = this.$refs.tabA.offsetWidth
						, distance = (width - 34) / 2 
			
			this.tabA = distance 
		}
	}).$mount('#index')
}, 'json')