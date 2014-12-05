$(function(){

	var blog = {};

	blog.sidbar = Backbone.View.extend({
		events:{
			'click .nav-item':'changTab',
			'click .opear-setting':'setting',
			'click .opear-exit':'exit'
		},
		initialize:function(options){
			var self = this;
			_.extend(this,options);
			_.bindAll(this,'changTab')
			this._init_main();
			this._init_name();
		},
		_init_main:function(){
			this.$el.html('<div class="sidbar-w">\
									<div class="sidbar-c">\
                            <div class="user">\
                                <div class="user-logo">\
                                    <img src="images/l.jpg" alt=""/>\
                                </div>\
                                <div class="user-name">翟磊</div>\
                            </div>\
                            <div class="nav">\
                                <div class="nav-w">\
                                    <div class="nav-c">\
                                        <div class="nav-item blog active" action-type="blog">\
                                            <div class="nav-item-c">\
                                                <div class="nav-ico-c">\
                                                    <div class="nav-ico"></div>\
                                                </div>\
                                                <div class="nav-txt">博客</div>\
                                            </div>\
                                        </div>\
                                        <div class="nav-item activity" action-type="activity">\
                                            <div class="nav-item-c">\
                                                <div class="nav-ico-c">\
                                                    <div class="nav-ico"></div>\
                                                </div>\
                                                <div class="nav-txt">活动</div>\
                                            </div>\
                                        </div>\
                                        <div class="nav-item data" action-type="data">\
                                            <div class="nav-item-c">\
                                                <div class="nav-ico-c">\
                                                    <div class="nav-ico"></div>\
                                                </div>\
                                                <div class="nav-txt">统计数据</div>\
                                            </div>\
                                        </div>\
                                        <div class="nav-item manage" action-type="manage">\
                                            <div class="nav-item-c">\
                                                <div class="nav-ico-c">\
                                                    <div class="nav-ico"></div>\
                                                </div>\
                                                <div class="nav-txt">企业管理</div>\
                                            </div>\
                                        </div>\
                                    </div>\
                                </div>\
                            </div>\
                        </div>\
                       </div>\
                       <div class="opear">\
	                        <div class="opear-setting">\
	                            <div class="ico"></div>\
	                        </div>\
	                        <div class="opear-exit">\
	                            <div class="ico"></div>\
	                        </div>\
	                    </div>');
		},
		_init_name:function(){
			this.nav_item = this.$el.find('.nav-item')
		},
		changTab:function(evt){
			var target = $(evt.currentTarget);
			this.nav_item.removeClass('active');
			target.addClass('active');
			this.trigger('tab:change',target.attr("action-type"))
		},
		setting:function(){

		},
		exit:function(){

		}
	})

	blog.list_model = Backbone.Model.extend({})
	blog.list_collection = Backbone.Collection.extend({
		mode:blog.list_model,
		getData:function(options){
			var self = this;
			_.extend(this.data,options);
			this.fetch({url:'/',data:data,success:function(modes,resp){
				consoe.log(resp);
			}})
		}
	})
	blog.list = Backbone.View.extend({
		events:{
			'click .m-i-t-opear-i':'changTab',
			'click .new-blog':'newBlog'
		},
		initialize:function(options){
			var self = this;
			_.extend(this,options);
			this.collection = new blog.list_collection();
			this.$el = $('<div class="m-i list"></div>');
			this.parentEl.append(this.$el);
			this._init_main();
			this._init_name();
		},
		_init_main:function(){
			this.$el.html('<div class="m-i-t">\
                              <div class="m-i-ico-c">\
                                  <div class="m-i-ico"></div>\
                              </div>\
                              <div class="m-i-t-opear">\
                                  <div class="m-i-t-opear-i active" action-type="1">已发布</div>\
                                  <div class="m-i-t-opear-i" action-type="2">未发布</div>\
                              </div>\
                              <div class="m-i-t-b">\
                                  <div class="new-blog">\
                                      <div class="new-blog-ico"></div>\
                                      <div class="new-blog-txt">撰写博客</div>\
                                  </div>\
                              </div>\
                          </div>\
                          <div class="m-i-c">\
                              <div class="list-show">\
                                  <div class="list-show-item">\
                                      <div class="list-show-item-w">\
                                          <div class="list-show-item-c">\
                                              <div class="list-show-item-imgc">\
                                                  <img src="images/list-demo.jpg"/>\
                                                  <div class="list-show-item-tag">Futuer of Work</div>\
                                              </div>\
                                              <div class="list-show-item-name">Forrester:企业社会化软件市场2016年将达64亿美金</div>\
                                              <div class="list-show-item-info">\
                                                  <span>Michael Lee</span>\
                                                  <span>2014-08-09</span>\
                                              </div>\
                                          </div>\
                                      </div>\
                                  </div>\
                                  <div class="list-show-item">\
                                      <div class="list-show-item-w">\
                                          <div class="list-show-item-c">\
                                              <div class="list-show-item-imgc">\
                                                  <img src="images/list-demo.jpg"/>\
                                                  <div class="list-show-item-tag">Futuer of Work</div>\
                                              </div>\
                                              <div class="list-show-item-name">Forrester:企业社会化软件市场2016年将达64亿美金</div>\
                                              <div class="list-show-item-info">\
                                                  <span>Michael Lee</span>\
                                                  <span>2014-08-09</span>\
                                              </div>\
                                          </div>\
                                      </div>\
                                  </div>\
                              </div>\
                              <div class="list-w">\
                                  <div class="list-top">\
                                      <div class="list-title">更新博客显示顺序，指定封面文章</div>\
                                      <button type="button" class="list-title-submit">提交</button>\
                                  </div>\
                                  <div class="list-sep"></div>\
                                  <div class="list-c">\
                                      <div class="list-c-tip">\
                                          <div class="list-tip-num">顺序</div>\
                                          <div class="list-tip-edit">编辑</div>\
                                          <div class="list-tip-top">封面</div>\
                                          <div class="list-tip-name">博文名称</div>\
                                      </div>\
                                      <div class="list-c-c">\
                                          <div class="list-item">\
                                              <div class="list-item-w">\
                                                  <div class="list-item-c">\
                                                      <div class="list-item-num">1</div>\
                                                      <div class="list-item-edit"></div>\
                                                      <div class="list-item-top"></div>\
                                                      <div class="list-item-content">\
                                                          <div class="list-item-name">企业软件，以社交之名</div>\
                                                          <div class="list-item-opear">\
                                                              <div class="goB"></div>\
                                                              <div class="goT"></div>\
                                                          </div>\
                                                      </div>\
                                                  </div>\
                                              </div>\
                                          </div>\
                                      </div>\
                                  </div>\
                              </div>\
                          </div>')
		},
		_init_name:function(){
			this.container = this.$el.find('.list-c-c');
			this.tabs_item = this.$el.find('.m-i-t-opear-i');
		},
		addOne:function(model){
			var view = new blog.list_item_view({model:model})
			this.container.append(view.render().el)
		},
		addAll:function(){
			this.container.html('');
			if(this.collection.length!=0){
				this.collection.each(this.addOne);
			}else{
				this.container.html('还没有博客呢？撰写一份吧～');
			}
		},
		changTab:function(evt){
			var target = $(evt.currentTarget);
			this.tabs_item.removeClass('active');
			target.addClass('active');
			// this.collection.getData({type:target.attr("action-type"),pageno:0})
		},
		newBlog:function(evt){
			this.trigger('new-blog');
			evt.stopPropagation();
		}
	})

	blog.new_blog_m = Backbone.Model.extend({
		defaults:{
			logo:'images/list-demo.jpg',
			content:''
		}
	})
	blog.new_blog = Backbone.View.extend({
		events:{
			'click .cancel-save':'cancelSave',
			'click .save-btn':'save'
		},
		initialize:function(options){
			var self = this;
			_.extend(this,options);
			this.model = new blog.new_blog_m()
			this.$el = $('<div class="m-i new"></div>')
			this.$el.css({left:this.parentEl.width()+'px',width:this.parentEl.width()+'px'});
			this.parentEl.append(this.$el);
			this.$el.stop().animate({left:0},500,function(){
				self.$el.css({width:'auto'});
			})
			this._init_main();
			this._init_func();
		},
		_init_main:function(){
			this.$el.html('<div class="m-i-t">\
                           <div class="m-i-ico-c">\
                               <div class="m-i-ico"></div>\
                           </div>\
                           <div class="m-i-t-opear">\
                               <div class="m-i-t-opear-i active">撰写博客</div>\
                           </div>\
                           <div class="m-i-t-b">\
                               <button type="button" class="save-btn">保存并继续</button>\
                               <button type="button" class="cancel-save">放弃</button>\
                           </div>\
                       </div>\
                       <div class="m-i-c">\
                           <div class="new-w">\
                               <div class="new-c">\
                                   <div class="new-blog-title">\
                                       <div class="new-blog-title-t">博客标题</div>\
                                       <div class="new-blog-title-input"></div>\
                                   </div>\
                                   <div class="new-blog-logo">\
                                       <div class="new-blog-logo-t">封面配图</div>\
                                       <div class="new-blog-logo-c">\
                                       	<div class="jw-form-logo">\
                                            <div class="jw-form-logo-c"><img src="'+this.model.get('logo')+'" /></div></div>\
                                        <div class="jw-form-logo-bar">\
                                            <div class="jw-form-logo-h">建议尺寸500*500</div>\
                                            <div class="jw-form-logo-btnw">\
                                                <div class="jw-form-logo-btnc">\
                                                <button class="jw-btn3 jw-btn" type="button">上传图片</button>\
                                                </div>\
                                            </div>\
                                        </div>\
                                       </div>\
                                   </div>\
                                   <div class="new-blog-content">\
                                       <div class="new-blog-content-t">正文</div>\
                                       <div class="new-blog-content-c">\
                                       	<div class="new-blog-content-tool"></div>\
                                       	 <div class="new-blog-content-content"></div>\
                                       </div>\
                                   </div>\
                               </div>\
                           </div>\
                       </div>')
		},
		_init_func:function(){
			this.title = new jw.Form.input({
                el:this.$el.find('.new-blog-title-input'),
                required:1,
                model:this.model,
                name:'name',
                tip:'标题'
            })
			this.logo = new jw.Form.logos({
            el:this.$el.find('.new-blog-logo-c'),
            name:'logo',
            model:this.model,
            action:'images/list-demo.jpg',
            imgType:1
         })
         this.content = new jw.editor({
                toolbar: {textDecoration:true, alignLeft:true, alignRight:true, alignRight:true, ul:true, url:true,image:true,zoom:true},  // 工具栏
                model: this.model,
                editKey: 'content',
                el: this.$el.find('.new-blog-content-c')
            });
		},
		cancelSave:function(){
			this.removeEl();
		},
		save:function(){
			if(this.isEdit){
				this.isEditParent.model.set(this.model.toJSON())
				this.removeEl();
			}else this.trigger('saveSuccess',this.model.toJSON())
		},
		removeEl:function(func){
			var self = this;
			var width = this.parentEl.width();
			this.$el.stop().animate({left:width+'px',width:width+'px'},500,function(){
				self.$el.remove();
				if(func && typeof func == 'function') func()
			})
		}
	})

	
	blog.edit_blog_m = Backbone.Model.extend({})
	blog.edit_blog = Backbone.View.extend({
		events:{
			'click .edit-cancel-btn':'cancelSave',
			'click .edit-save-btn':'save',
			'click .edit-submit-btn':'publish',
			'click .edit-show-t-edit':'editContent'
		},
		initialize:function(options){
			var self = this;
			_.extend(this,options);
			_.bindAll(this,'_init');
			this.model = new blog.edit_blog_m();
			this.$el = $('<div class="m-i edit"></div>');
			this.$el.css({left:this.parentEl.width()+'px',width:this.parentEl.width()+'px'});
			this.parentEl.append(this.$el);
			if(this.newParent){
				this.newParent.removeEl(this._init)
			}else{
				this._init()
			}
		},
		_init:function(){
			var self = this;
			this.$el.stop().animate({left:0},500,function(){
				self.$el.css({width:'auto'});
			})
			this._init_main();
			this._init_name();
			this._init_func();
		},
		_init_main:function(){
			this.$el.html('<div class="m-i-t">\
					            <div class="m-i-ico-c">\
					                <div class="m-i-ico"></div>\
					            </div>\
					            <div class="m-i-t-opear">\
					                <div class="m-i-t-opear-i active">编辑博客</div>\
					            </div>\
					            <div class="m-i-t-b">\
					                <button type="button" class="edit-submit-btn">发表</button>\
					                <button type="button" class="edit-save-btn">保存</button>\
					                <button type="button" class="edit-cancel-btn">放弃</button>\
					            </div>\
					        </div>\
					        <div class="m-i-c">\
					            <div class="edit-show">\
					                <div class="edit-show-w">\
					                    <div class="edit-show-c">\
						                    	<div class="edit-show-t">\
					                            <div class="edit-show-t-txt">展示样式</div>\
					                            <div class="edit-show-t-edit"></div>\
					                        </div>\
					                        <div class="edit-show-main">\
					                        </div>\
					                    </div>\
					                </div>\
					            </div>\
					            <div class="edit-info">\
					                <div class="edit-info-w">\
					                    <div class="edit-info-c">\
					                        <div class="edit-status">状态：<span>未发表</span></div>\
					                        <div class="edit-sep"></div>\
					                        <div class="edit-items">\
					                            <div class="edit-item creator">\
					                                <div class="edit-item-title">作者</div>\
					                                <div class="edit-item-c">\
					                                    <div class="edit-creator">\
					                                        <div class="edit-creator-logo">\
					                                            <img src="images/l.jpg">\
					                                        </div>\
					                                        <div class="edit-creator-info">\
					                                            <div class="edit-creator-name">Michael Lee</div>\
					                                            <div class="edit-creator-title">Joywok市场总监，专注于社会化商业研究和实践</div>\
					                                        </div>\
					                                    </div>\
					                                    <div class="edit-opear">\
					                                        <div class="edit-select"></div>\
					                                        <button type="button" class="edit-item-submit">提交</button>\
					                                    </div>\
					                                </div>\
					                            </div>\
					                            <div class="edit-item columns">\
					                                <div class="edit-item-title">所在栏目</div>\
					                                <div class="edit-item-c">\
					                                    <div class="edit-opear">\
					                                        <div class="edit-select"></div>\
					                                        <button type="button" class="edit-item-submit">提交</button>\
					                                    </div>\
					                                </div>\
					                            </div>\
					                            <div class="edit-item tag">\
					                                <div class="edit-item-title">标签</div>\
					                                <div class="edit-item-c">\
					                                    <div class="edit-opear">\
					                                        <div class="edit-input"></div>\
					                                        <button type="button" class="edit-item-submit">提交</button>\
					                                    </div>\
					                                </div>\
					                            </div>\
					                            <div class="edit-item time">\
					                                <div class="edit-item-title">时间</div>\
					                                <div class="edit-item-c">\
					                                    <div class="edit-opear">\
					                                        <div class="edit-input"></div>\
					                                        <button type="button" class="edit-item-submit">提交</button>\
					                                    </div>\
					                                </div>\
					                            </div>\
					                            <div class="edit-item seo-title">\
					                                <div class="edit-item-title">SEO主题</div>\
					                                <div class="edit-item-c">\
					                                    <div class="edit-opear">\
					                                        <div class="edit-input"></div>\
					                                        <button type="button" class="edit-item-submit">提交</button>\
					                                    </div>\
					                                </div>\
					                            </div>\
					                            <div class="edit-item seo-tag">\
					                                <div class="edit-item-title">SEO Keywords</div>\
					                                <div class="edit-item-c">\
					                                    <div class="edit-opear">\
					                                        <div class="edit-input"></div>\
					                                        <button type="button" class="edit-item-submit">提交</button>\
					                                    </div>\
					                                </div>\
					                            </div>\
					                        </div>\
					                    </div>\
					                </div>\
					            </div>\
					        </div>')
		},
		_init_name:function(){
			this.show_c = this.$el.find('.edit-show-main')
		},
		_init_func:function(){
			this._init_show();
			this._init_create();
			this._init_columens();
			this._init_tags();
			this._init_date();
			this._init_seo_title();
			this._init_seo_tag();
		},
		_init_show:function(){
			this.show_c.html('<div class="edit-show-pic">\
                                <img src="images/list-demo.jpg">\
                            </div>\
                            <div class="edit-show-info">\
                                <span>by</span>\
                                <span class="specail">Michael Lee</span>\
                                <span>2014年8月9日</span>\
                            </div>\
                            <div class="edit-show-name">2011企业社会化软件使用现状</div>\
                            <div class="edit-show-content">\
                                <p>2011年的最后一天，我们为大家整理了这份信息图。该图数据来自xxxx第5次关于社会化技术在企业使用状况的调研。经过对全球4200名企业高管的访问，发现72%的企业至少不熟了一种社会化技术，这些新技术和工作正在帮助企业转变业务流程，提升写作和生产能力。</p>\
                                <p>经过几年的发展，企业正在提升他们对社会化技术的驾驭力。全球各行业部署了企业社会化软件的高管一致认为。</p>\
                            </div>')
		},
		_init_create:function(){
			this.creator = new jw.Combobox({
				el:this.$el.find('.edit-item.creator .edit-select'),
				appendtype:1,
				dropdownparams:{
					items:[
						{key:'k1',txt:'Michael Lee'},
						{key:'k2',txt:'Michael Lee'}
					],
					_default:'k1'
				}
			})
		},
		_init_columens:function(){
			// edit-select
			this.columen = new jw.Combobox({
				el:this.$el.find('.edit-item.columns .edit-select'),
				appendtype:1,
				dropdownparams:{
					items:[
						{key:'k1',txt:'Michael Lee'},
						{key:'k2',txt:'Michael Lee'}
					],
					_default:'k1'
				}
			})
		},
		_init_tags:function(){
			this.tags = new jw.Form.input({
				el:this.$el.find('.edit-item.tag .edit-input'),
				model:this.model,
				name:'tags',
				style:1
			})
		},
		_init_date:function(){

		},
		_init_seo_title:function(){
			this.seo_title = new jw.Form.input({
				el:this.$el.find('.edit-item.seo-title .edit-input'),
				model:this.model,
				name:'seoTitle',
				style:1
			})
		},
		_init_seo_tag:function(){
			this.seo_tag = new jw.Form.input({
				el:this.$el.find('.edit-item.seo-tag .edit-input'),
				model:this.model,
				name:'seoTag',
				style:1
			})
		},
		cancelSave:function(){
			this.removeEl();
		},
		save:function(){

		},
		publish:function(){

		},
		editContent:function(){
			var data = {
				data:this.model.toJSON(),
				isEdit:true,
				isEditParent:this
			}
			$.publish('newBlog',data)
		},
		removeEl:function(){
			var self = this;
			var width = this.parentEl.width();
			this.$el.stop().animate({left:width+'px',width:width+'px'},500,function(){
				self.$el.remove();
			})
		}
	})

	blog.console = Backbone.View.extend({
		initialize:function(options){
			var self = this;
			_.extend(this,options);
			this._init_sidbar();
			this._init_list();
			this.bindEvt();
		},
		bindEvt:function(){
			var self = this;
			$.subscribe("newBlog",function(evt,data){
				var datas = {
					parentEl:self.$el.find('.main-c')
				}
				if(data){
					_.extend(datas,data)
				}
				self.newBlog = new blog.new_blog(datas)
				self.newBlog.bind('saveSuccess',function(data){
					var datas = {
						data:data,
						newParent:self.newBlog
					}
					$.publish('editBlog',datas)
				})
			})
			$.subscribe('editBlog',function(evt,data){
				var datas = {
					parentEl:self.$el.find('.main-c')
				}
				_.extend(datas,data);
				self.editBlog = new blog.edit_blog(datas)
			})
		},
		_init_sidbar:function(){
			this.sidbar = new blog.sidbar({
				el:this.$el.find('.sidbar')
			})
			this.sidbar.bind('tab:change',function(data){
				console.log(data);
			})
		},
		_init_list:function(){
			var self = this;
			this.list = new blog.list({
				parentEl:this.$el.find('.main-c')
			})
			this.list.bind('new-blog',function(){
				$.publish('newBlog')
			})
		}
	})

	new blog.console({
		el:$('.blog-main')
	})

})
