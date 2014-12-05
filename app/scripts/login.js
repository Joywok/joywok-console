$(function(){



	var login = Backbone.View.extend({
		initialize:function(options){
			var self = this;
			_.extend(this,options);
			return ;
			this._init_main();
		},
		_init_main:function(){
			this.$el.html('<div class="blog-w">\
									<div class="blog-c">\
										<div class="login">\
											<div class="login-w"></div>\
										</div>\
									</div>\
								</div>')
		}
	})


	new login({
		el:$('.blog')
	})

})