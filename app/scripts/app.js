$(function(){


  _.each(types,function(item){
    item["key"] = item['id'];
    item["txt"] = item['name'];
  })
  types.unshift({key:'0',id:'0',name:'所有',txt:'所有'})

  _.each(authors,function(item){
    item['key'] = item["id"]
    item["txt"] = item["name"]
  })

  console.log(types,authors);

	var blog = {};

  jw.Form.blog_logos = jw.Form.logos.extend({
    _onComplete:function(id,name,response){
        this.pgb.remove();
        if(this.imgType){
            this._img.attr('src',response["data"]);
            this.model.set(this.name,response["data"]);
        }else{
        // if(!jw.UploadHandlerXhr.isSupported()){
            this._img.attr('src',response["data"]);
            // }
            this.model.set(this.name,response["data"]);
        }
    }
  })

  blog.setting_view = Backbone.View.extend({
    className:'list-item',
    events:{
      'click .list-item-edit':'edit',
      'click .list-item-input-save':'edit_save',
      'click .list-item-input-cancel':'cance_save'
    },
    initialize:function(){
      var self = this;
      _.bindAll(this,'render','remove')
      this.model.bind('change',this.render)
      this.model.bind('remove destroy',this.remove);
    },
    render:function(){
      var index = this.model.collection.indexOf(this.model);
      if(index%2 == 1) this.$el.addClass('even');
      if(!this.model.get("isNew")){
        if(index == 0){
          if(this.model.collection.length==1){
            this.$el.addClass('noGoT')
            this.$el.addClass('noGoB')
          }else{
            this.$el.addClass('noGoT')
          }
        }else{
          if(index == this.model.collection.length-1){
            if(this.model.collection.length==2) this.$el.addClass('noGoB')
          }
        }
        this.model.set({index:index})
      }
      this.$el.html('<div class="list-item-w">\
                        <div class="list-item-c">\
                            <div class="list-item-num">'+(!this.model.get("isNew")?index:'')+'</div>\
                            <div class="list-item-edit"></div>\
                            <div class="list-item-content">\
                                '+(!this.model.get("isNew")?'<div class="list-item-remove" model-id="'+this.model.get("id")+'"></div>':'')+'\
                                <div class="list-item-opear">\
                                    <div class="goB" action-type="B" model-id="'+this.model.get("id")+'"></div>\
                                    <div class="goT" action-type="T" model-id="'+this.model.get("id")+'"></div>\
                                </div>\
                                <div class="list-item-name-c">\
                                  <div class="list-item-name">'+this.model.get("name")+'</div>\
                                  <div class="list-item-input-c hide">\
                                    <button class="list-item-input-cancel" type="button">取消</button>\
                                    <button class="list-item-input-save" type="button" disabled="disabled">保存</button>\
                                    <div class="list-item-input"></div>\
                                  </div>\
                                </div>\
                            </div>\
                        </div>\
                    </div>');
      return this;
    },
    remove:function(){
      this.$el.remove();
    },
    edit:function(){
      var self = this;
      this.input_w = this.$el.find('.list-item-input-c');
      this.name_c  = this.$el.find('.list-item-name');
      this.input_c = this.input_w.find('.list-item-input')
      this.input_c.html('')
      this.$el.addClass('editing')
      this.name_c.addClass('hide');
      this.input_w.removeClass('hide');
      this.old_title = this.model.get("name");
      this.save_c = this.$el.find('.list-item-input-save');
      this.input = new jw.input({
        el:this.input_c,
        style:1
      })
      this.input.setTxt(this.old_title,{silent:true})
      this.edit_title = ""
      this.input.bind('change',function(data){
        self.edit_title = data
        if(self.edit_title != self.old_title){
          self.save_c.removeAttr('disabled');
        }else{
          self.save_c.attr('disabled','disabled');
        }
      })
    },
    edit_save:function(){
      var self = this;
      self.save_c.attr('disabled','disabled').html('保存中…');
      this.model.set({name:this.edit_title});
      this.$el.removeClass('editing');
      this.input_w.addClass('hide')
      this.name_c.removeClass('hide');
      if(this.model.get("isNew")){
        this.model.unset('isNew',{silent:true})
        Backbone.sync('create',null,{url:basurl+'/blog/type',data:JSON.stringify({name:this.model.get("name")}),success:function(resp){
          self.model.set(resp,{silent:true});
          self.model.collection.trigger('reset')
        }})
      }else{
        this.model.save({name:this.model.get("name"),id:this.model.get("id")},{patch:true,success:function(resp){
          self.save_c.attr('disabled','disabled').html('保存');
        }})
      }
    },
    cance_save:function(){
      if(this.model.get("isNew")){
        this.model.collection.remove(this.model)
      }else{
        this.model.set({name:this.old_title})
        this.$el.removeClass('editing');
        this.input_w.addClass('hide')
        this.name_c.removeClass('hide');
        this.save_c.attr('disabled','disabled').html('保存');
      }

    },
    setFocus:function(){
      this.input.setFocus()
    }
  })
  blog.setting_model = Backbone.Model.extend({
    url:basurl+'/blog/type',
    defaults:{
      name:''
    }
  })
  blog.setting_Collection = Backbone.Collection.extend({
    model:blog.setting_model,
    sortData:function(){
      var data = _.sortBy(this.toJSON(),function(item){
        return Math.max(item['index'])
      });
      this.remove(this.models)
      this.add(data)
    }
  })
  blog.setting_m = Backbone.Model.extend()
  blog.setting = Backbone.View.extend({
    events:{
      'click .cancel-save':'cancelSave',
      'click .list-title-save':'saveAll',
      'click .goB':'changePost',
      'click .goT':'changePost',
      'click .list-item-remove':'removeType',
      'click .new-type':'newType',
      'click .list-title-submit':'publish'
    },
    initialize:function(options){
      var self = this;
      _.extend(this,options);
      this.model = new blog.setting_m(this.data)
      this.old_model = this.model.clone();
      this.collection = new blog.setting_Collection(this.data);
      this.$el = $('<div class="m-i setting"></div>');
      this.$el.css({left:this.parentEl.width()+'px',width:this.parentEl.width()+'px'});
      this.parentEl.append(this.$el);
      this.$el.stop().animate({left:0},500,function(){
        self.$el.css({width:'auto'});
      })
      this._init_main();
      this._init_name();
      this.bindEvt();
      this.addAll();
    },
    _init_main:function(){
      this.$el.html('<div class="m-i-t">\
                          <div class="m-i-ico-c">\
                              <div class="m-i-ico"></div>\
                          </div>\
                          <div class="m-i-t-opear">\
                            <div class="m-i-t-opear-i active" action-type="1">栏目管理</div>\
                          </div>\
                          <div class="m-i-t-b">\
                              <div class="new-type">\
                                  <div class="new-type-ico"></div>\
                                  <div class="new-type-txt">撰写栏目</div>\
                              </div>\
                              <button type="button" class="cancel-save">返回</button>\
                          </div>\
                      </div>\
                      <div class="m-i-c">\
                        <div class="columns-list">\
                          <div class="columns-w list-w">\
                            <div class="list-top">\
                                  <div class="list-title"></div>\
                                  <button type="button" class="list-title-submit">发布</button>\
                              </div>\
                              <div class="list-sep"></div>\
                              <div class="list-c-tip">\
                                  <div class="list-tip-num">序号</div>\
                                  <div class="list-tip-edit">编辑</div>\
                                  <div class="list-tip-name">栏目名</div>\
                              </div>\
                              <div class="list-c">\
                                  <div class="list-c-c">\
                                  </div>\
                                  <div class="list-c-addmore-c">\
                                    <button class="list-c-addmore hide" type="button">加载更多</button>\
                                  </div>\
                              </div>\
                          </div>\
                        </div>\
                      </div>')
    },
    _init_name:function(){
      this.container = this.$el.find('.list-c-c');
      this.save_btn = this.$el.find('.list-title-save');
      this.publish_btn = this.$el.find('.list-title-submit');
    },
    bindEvt:function(){
      var self = this;
      _.bindAll(this,'addOne','addAll');
      this.collection.bind('add',this.addOne);
      this.collection.bind('reset',this.addAll);
      this.collection.bind('change',function(){
        if(self.old_model.changedAttributes(this.toJSON())){
          self.save_btn.removeClass('hide')
        }else{
          self.save_btn.addClass('hide')
        }
      })
    },
    addOne:function(model){
      var view = new blog.setting_view({model:model});
      if(model.get('isNew')){
        this.container.prepend(view.render().el);
        view.edit();
        view.setFocus();
      }else{
        this.container.append(view.render().el);
      }
    },
    addAll:function(){
      this.container.html('');
      if(this.collection.length!=""){
        this.collection.each(this.addOne);
      }else{
        this.container.html('暂时没有栏目');
      }
    },
    saveAll:function(){
      this.save_btn.html('保存中…').attr({disabled:'disabled'});
      console.log('保存给服务器？')
    },
    changePost:function(evt){
      var self = this;
      var target = $(evt.currentTarget);
      var model = this.collection.get(target.attr('model-id'));
      var type = target.attr('action-type');
      var moved_mode;
      if(type == 'T'){
        var index = parseInt(model.get("index"));
        model.set({index:index-1});
        moved_mode = this.collection.at(index-1)
        moved_mode.set({index:index});
      }else{
        var index = parseInt(model.get("index"));
        model.set({index:index+1});
        moved_mode = this.collection.at(index+1)
        moved_mode.set({index:index});
      }
      Backbone.sync('update',null,{url:basurl+'/blog/typesort',data:JSON.stringify({id:model.get("id"),sid:moved_mode.get("id")}),success:function(resp){
        if(resp['ret'] == 'success') self.collection.sortData();
      }})
    },
    cancelSave:function(){
      this.removeEl();
    },
    removeEl:function(){
      var self = this;
      var width = this.parentEl.width();
      this.$el.stop().animate({left:width+'px',width:width+'px'},500,function(){
        self.$el.remove();
      })
    },
    removeType:function(evt){
      var self = this;
      var target = $(evt.currentTarget)
      var model = this.collection.get(target.attr('model-id'));
      new jw.Confirm({content:'确认删除此栏目么？此操作不可恢复。',confirm:function(){
        model.destroy({url:basurl+'/blog/type',data:JSON.stringify({id:model.get("id")}),success:function(){
          self.addAll();
        }})
      }});
    },
    newType:function(){
      this.collection.add({isNew:true})
    },
    publish:function(){
      var self = this;
      this.publish_btn.attr({disabled:'disabled'}).html('发布中…')
      Backbone.sync("update",null,{url:basurl+'/',success:function(resp){
        self.publish_btn.removeAttr('disabled').html('发布')
      }})
    }
  })

	blog.sidbar = Backbone.View.extend({
		events:{
			'click .nav-item':'changTab',
			'click .opear-setting':'setting'
		},
		initialize:function(options){
			var self = this;
			_.extend(this,options);
			_.bindAll(this,'changTab');
			this._init_name();
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
      var data = _.filter(types,function(item){
        return item['key'] !="0"
      })
      this.settings = new blog.setting({
        parentEl:$('.main-c'),
        data:data
      })
		}
	})



  blog.show_View = Backbone.View.extend({
    className:'list-show-item',
    initialize:function(){
      _.bindAll(this,'render','remove');
      this.model.bind('change',this.render);
      this.model.bind('destroy remove',this.remove)
    },
    render:function(){
      this.$el.html('<div class="list-show-item-w">\
                          <div class="list-show-item-c">\
                              <div class="list-show-item-imgc">\
                                  <img src="'+this.model.get("img")+'"/>\
                                  '+(this.model.get("tags")&&this.model.get("tags")!=""?'<div class="list-show-item-tag ellipsis" title="'+this.model.get("tags")+'">'+this.model.get("tags")+'</div>':'')+'\
                              </div>\
                              <div class="list-show-item-name">'+this.model.get("title")+'</div>\
                              <div class="list-show-item-info">\
                                  <span>'+this.model.get("name")+'</span>\
                                  <span>'+this.model.get("intime")+'</span>\
                              </div>\
                          </div>\
                      </div>')
      return this
    },
    remove:function(){
      this.$el.remove();
    }
  })
  blog.showControler = Backbone.View.extend({
    initialize:function(options){
      var self = this;
      _.extend(this,options);
      this.bindEvt();
      this.addAll();
    },
    bindEvt:function(){
      _.bindAll(this,'addOne','addAll');
      this.collection.bind('add',this.addOne);
      this.collection.bind('reset',this.addAll);
    },
    addOne:function(model){
      var view = new blog.show_View({model:model});
      this.$el.append(view.render().el)
    },
    addAll:function(){
      this.$el.html('')
      this.collection.each(this.addOne);
    }
  })

  blog.list_item_view = Backbone.View.extend({
    className:'list-item',
    initialize:function(){
      var self = this;
      _.bindAll(this,'render','remove');
      this.model.bind('destroy remove',this.remove);
      this.model.bind('change',this.render)
    },
    render:function(){
      console.log(this.model.toJSON());
      var index = this.model.collection.indexOf(this.model);
      if(index%2 == 1) this.$el.addClass('even');
      if(index == 0){
        if(this.model.collection.length==1){
          this.$el.addClass('noGoT')
          this.$el.addClass('noGoB')
        }else{
          this.$el.addClass('noGoT')
        }
      }else{
        if(index == this.model.collection.length-1){
          if(this.model.collection.length==2) this.$el.addClass('noGoB')
        }
      }
      this.model.set({index:index})
      if(this.model.get('showflag') !="1") this.$el.addClass('noShow');
      this.$el.html('<div class="list-item-w">\
                        <div class="list-item-c">\
                            <div class="list-item-num">'+index+'</div>\
                            <div class="list-item-edit" model-id="'+this.model.get("id")+'"></div>\
                            <div class="list-item-top '+(this.model.get("isCollage")&&this.model.get("isCollage")!=''?'active':'')+'" model-id="'+this.model.get("id")+'"></div>\
                            <div class="list-item-content">\
                                <div class="list-item-remove" model-id="'+this.model.get("id")+'"></div>\
                                <div class="list-item-opear">\
                                    <div class="goB" action-type="B" model-id="'+this.model.get("id")+'"></div>\
                                    <div class="goT" action-type="T" model-id="'+this.model.get("id")+'"></div>\
                                </div>\
                                <div class="list-item-name ellipsis">'+this.model.get("title")+'</div>\
                            </div>\
                        </div>\
                    </div>');
      return this;
    },
    remove:function(){
      this.$el.remove();
    }
  })
	blog.list_model = Backbone.Model.extend({
    urlRoot:basurl+'/blog/update'
  })
	blog.list_collection = blog.setting_Collection.extend({
    url:basurl+'/blog/list',
		model:blog.list_model,
    initialize:function(){
      this.data = {};
    },
    parse:function(data,options){
      this.data['parseno'] = data["data"]['pagination']['pagenum'];
      this.data['num'] = parseInt(data["data"]['pagination']['pagesum'])-1;
      var listData = data["data"]['articles'];
      return listData
    },
		getData:function(options,func){
			var self = this;
			_.extend(this.data,options);
			this.fetch({url:basurl+'/blog/list',data:this.data,success:function(collection,resp){
        self.trigger('list:change')
				if(func) func()
			}})
		},
    sortData:function(){
       var data = _.sortBy(this.toJSON(),function(item){
        return Math.max(item['index'])
      });
      this.remove(this.models);
      this.add(data);
    }
	})
	blog.list = Backbone.View.extend({
		events:{
			'click .m-i-t-opear-i':'changTab',
			'click .new-blog':'newBlog',
      'click .list-item-top':'setCollage',
      'click .list-c-addmore':'getMore',
      'click .goB':'changePost',
      'click .goT':'changePost',
      'click .list-item-remove':'removeBlog',
      'click .list-item-edit':'editBlog',
      'click .list-title-submit':'publish'
		},
		initialize:function(options){
			var self = this;
			_.extend(this,options);
      _.bindAll(this,'_init')
      this.showType = '1';
			this.collection = new blog.list_collection();
			this.$el = $('<div class="m-i list"><div class="spinner"></div></div>');
			this.parentEl.append(this.$el);
      this.collection.getData({type:1,pageno:0,pagesize:10},this._init)
		},
    _init:function(){
      this._init_main();
      this._init_name();
      this.bindEvt();
      this.addAll();
    },
		_init_main:function(){
			this.$el.html('<div class="m-i-t">\
                          <div class="m-i-ico-c">\
                              <div class="m-i-ico"></div>\
                          </div>\
                          <div class="m-i-t-opear">\
                              <div class="m-i-t-opear-i active" action-type="1">已发布</div>\
                              <div class="m-i-t-opear-i" action-type="0">未发布</div>\
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
                          </div>\
                          <div class="list-w">\
                              <div class="list-top">\
                                  <div class="list-title">更新博客显示顺序，指定封面文章</div>\
                                  <button type="button" class="list-title-submit">发布</button>\
                              </div>\
                              <div class="list-sep"></div>\
                              <div class="list-c-tip">\
                                    <div class="list-tip-num">顺序</div>\
                                    <div class="list-tip-edit">编辑</div>\
                                    <div class="list-tip-top">封面</div>\
                                    <div class="list-tip-name">博文名称</div>\
                                </div>\
                              <div class="list-c">\
                                  <div class="list-c-c">\
                                  </div>\
                                  <div class="list-c-addmore-c">\
                                    <button class="list-c-addmore hide" type="button">加载更多</button>\
                                  </div>\
                              </div>\
                          </div>\
                      </div>')
		},
		_init_name:function(){
      this.list_w = this.$el.find('.list-w');
			this.container = this.$el.find('.list-c-c');
			this.tabs_item = this.$el.find('.m-i-t-opear-i');
      this.collages = this.$el.find('.list-item-top');
      this.show_c = this.$el.find('.list-show');
      this.publish_btn = this.$el.find('.list-title-submit');
		},
    _init_show:function(){
      this.showControler = new blog.showControler({
        el:this.show_c,
        collection:this.collection
      })
    },
    bindEvt:function(){
      var self = this;
      _.bindAll(this,'addOne','addAll');
      this.collection.bind('add',this.addOne);
      this.collection.bind('reset',this.addAll);
      this.collection.bind('list:change',function(){
        console.log('这里触发了么？');
        //判断是否还又可以加载的
      })
      $.subscribe('editSuccess',function(evt,data){
        console.log(self.showType,data["showflag"])
        if(self.showType == data['showflag']){
          if(self.collection.get(data['id'])){
            self.collection.add(data,{merge:true})
          }else{
            self.collection.add(data)
          }
        }else{
          if(self.collection.get(data['id'])){
            self.collection.remove(self.collection.get(data['id']))
          }
        }
      })
    },
		addOne:function(model){
			var view = new blog.list_item_view({model:model})
			this.container.append(view.render().el)
		},
		addAll:function(){
      var self = this;
			this.container.html('');
			if(this.collection.length!=0){
        setTimeout(function(){
          self.list_w.css({left:'365px'})
        },200)
        this._init_show();
				this.collection.each(this.addOne);
			}else{
        setTimeout(function(){
          self.list_w.css({left:0})
        },200)
				this.container.html('<div class="list-c-none">还没有博客呢？撰写一份吧～</div>');
			}
		},
		changTab:function(evt){
			var target = $(evt.currentTarget);
			this.tabs_item.removeClass('active');
			target.addClass('active');
      this.showType = target.attr("action-type");
      if(this.showType == '0'){
        this.list_w.addClass('unissues')
      }else{
        this.list_w.removeClass('unissues')
      }
			this.collection.getData({type:this.showType,pageno:0,update:false,remove:true,add:false},this.addAll)
		},
		newBlog:function(evt){
			this.trigger('new-blog');
			evt.stopPropagation();
		},
    setCollage:function(evt){
      var self = this;
      var target = $(evt.currentTarget);
      var model = this.collection.get(target.attr('model-id'));
      Backbone.sync('update',null,{url:basurl+'/blog/cover',data:JSON.stringify({id:model.get("id")}),success:function(resp){
        if(resp["ret"] == 'success'){
          _.each(self.collection.models,function(item){
            item.set({isCollage:false})
          })
          model.set({isCollage:true})
        }
      }})
    },
    getMore:function(){
      this.collection.getData({pageno:(this.collection.data['parseno']+1),update:true,remove:false,add:true})
    },
    changePost:function(evt){
      var self = this;
      var target = $(evt.currentTarget);
      var model = this.collection.get(target.attr('model-id'));
      var type = target.attr('action-type');
      var moved_mode;
      if(type == 'T'){
        var index = parseInt(model.get("index"));
        model.set({index:index-1});
        moved_mode = this.collection.at(index-1)
        moved_mode.set({index:index});
      }else{
        var index = parseInt(model.get("index"));
        model.set({index:index+1});
        moved_mode = this.collection.at(index+1)
        moved_mode.set({index:index});
      }
      Backbone.sync('update',null,{url:basurl+'/blog/sort',data:JSON.stringify({id:model.get("id"),sid:moved_mode.get("id")}),success:function(resp){
        if(resp['ret'] == 'success') self.collection.sortData();
      }})
    },
    removeBlog:function(evt){
      var self = this;
      var target = $(evt.currentTarget)
      var model = this.collection.get(target.attr('model-id'));
      new jw.Confirm({content:'确认删除此博客么？此操作不可恢复。',confirm:function(){
        model.destroy({url:basurl+'/blog/update/',data:JSON.stringify({id:model.get("id")}),success:function(){
          self.addAll();
        }})
      }});
    },
    editBlog:function(evt){
      var target = $(evt.currentTarget);
      var model = this.collection.get(target.attr('model-id'));
      $.publish('editBlog',{id:model.get("id")})
    },
    publish:function(){
      var self = this;
      this.publish_btn.attr({disabled:"disabled"}).html('发表中…')
      Backbone.sync('update',null,{url:basurl+'/blog/post',success:function(resp){
        if(resp['ret'] == 'success'){
          this.publish_btn.removeAttr("disabled").html('发表')
        }
      }})
    }
	})

	blog.new_blog_m = Backbone.Model.extend({
    url:basurl+'/blog/cmtnew',
		defaults:{
			img:'',
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
      if(options['data']){
        this.model.set(options['data']);
        this.old_model = this.model.clone();
      }
			this.$el = $('<div class="m-i new"></div>')
			this.$el.css({left:this.parentEl.width()+'px',width:this.parentEl.width()+'px'});
			this.parentEl.append(this.$el);
			this.$el.stop().animate({left:0},500,function(){
				self.$el.css({width:'auto'});
			})
			this._init_main();
      this._init_name();
			this._init_func();
      this.bindEvt();
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
                               <button type="button" class="save-btn" disabled="disabled">'+(this.old_model?'保存':'保存并继续')+'</button>\
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
                                            <div class="jw-form-logo-c"><img src="'+SrcFolder+'images/list-demo.jpg" /></div></div>\
                                        <div class="jw-form-logo-bar">\
                                            <div class="jw-form-logo-h">建议尺寸1920x1283</div>\
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
    _init_name:function(){
      this.save_btn = this.$el.find('.save-btn')
    },
		_init_func:function(){
			this.title = new jw.Form.input({
          el:this.$el.find('.new-blog-title-input'),
          required:1,
          model:this.model,
          name:'title',
          tip:'标题'
      })
			this.logo = new jw.Form.blog_logos({
          el:this.$el.find('.new-blog-logo-c'),
          name:'img',
          model:this.model,
          action:basurl+'/blog/upload',
          imgType:1
       })
      this.content = new jw.editor({
        toolbar: {textDecoration:true, alignLeft:true, alignRight:true, alignRight:true, ul:true, url:true,image:true},  // 工具栏,zoom:true
        model: this.model,
        editKey: 'content',
        el: this.$el.find('.new-blog-content-c')
      });
		},
    bindEvt:function(){
      var self = this;
      this.model.bind('change',function(){
        if(self.old_model){
          var data = self.old_model.changedAttributes(self.model.toJSON())
          if(data){
              if(this.get('title')!=""){
                self.save_btn.removeAttr('disabled')
              }else{
                self.save_btn.attr('disabled','disabled')
              } 
          }else{
            self.save_btn.attr('disabled','disabled')
          }
        }else{
          if(this.get('title')!=""){
            self.save_btn.removeAttr('disabled')
          }else{
            self.save_btn.attr('disabled','disabled')
          } 
        }
      })
    },
		save:function(){
			var self = this;
      this.save_btn.html('保存中…').attr({disabled:'disabled'});
      var senddata={
        title:this.model.get("title"),
        content:this.model.get("content"),
        img:this.model.get("img")
      };
      var data = ('data='+encodeURIComponent(JSON.stringify(senddata)))
      if(this.old_model){
        senddata['id'] = this.model.get("id")
        data = JSON.stringify(senddata)
      }
      Backbone.sync((this.old_model?"update":'create'),null,{url:basurl+'/blog/cmtnew',data:data,success:function(resp){
        if(resp["data"]){
          if(self.isEdit){
            if(self.isEditParent) self.isEditParent.model.set(self.model.toJSON())
            if(self.isEditModel) self.isEditModel.set(self.model.toJSON())
            self.removeEl();
          }else{
            self.trigger('saveSuccess',self.model.toJSON())
          }
        }
      }})
		},
    cancelSave:function(){
      this.removeEl();
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
	
	blog.edit_blog_m = Backbone.Model.extend({
    url:basurl+'/blog/cmtnew',
    defaults:{
      intime:jw.timetostamp_now(jw.systime),
      author:authors[0],
      type:types[0]['id']+'',
      seodescription:''
    }
  })
	blog.edit_blog = Backbone.View.extend({
		events:{
			'click .edit-cancel-btn':'cancelSave',
      'click .edit-back-btn':'cancelSave',
			'click .edit-save-btn':'save',
			'click .edit-submit-btn':'publish',
      'click .edit-unsubmit-btn':'unpublish',
			'click .edit-show-t-edit':'editContent',
      'click .edit-item-submit':'saveItem'
		},
		initialize:function(options){
			var self = this;
			_.extend(this,options);
			_.bindAll(this,'_init','_init_show');
			this.model = new blog.edit_blog_m();
			this.$el = $('<div class="m-i edit"><div class="spinner"></div></div>');
			this.$el.css({left:this.parentEl.width()+'px',width:this.parentEl.width()+'px'});
			this.parentEl.append(this.$el);
      this.$el.stop().animate({left:0},500,function(){
        self.$el.css({width:'auto'});
      })
      if(this.newParent){
        this.newParent.removeEl(this._init)
      }
      Backbone.sync('read',null,{url:basurl+'/blog/article?id='+this.id,success:function(resp){
        self.model.set(resp["data"]);
        console.log(self.model.toJSON())
        self.old_model = self.model.clone();
        self._init()
      }})
		},
		_init:function(){
			var self = this;
			this._init_main();
			this._init_name();
			this._init_func();
      this.bindEvt();
		},
		_init_main:function(){
      //<button type="button" class="edit-save-btn">保存</button>\
      // <button type="button" class="edit-cancel-btn">放弃</button>\
			this.$el.html('<div class="m-i-t">\
					            <div class="m-i-ico-c">\
					                <div class="m-i-ico"></div>\
					            </div>\
					            <div class="m-i-t-opear">\
					                <div class="m-i-t-opear-i active">编辑博客</div>\
					            </div>\
					            <div class="m-i-t-b">\
                          <button type="button" class="edit-unsubmit-btn '+(this.model.get("showflag")==0?'hide':'')+'">下架</button>\
					                <button type="button" class="edit-submit-btn '+(this.model.get("showflag")==0?'':'hide')+'">发表</button>\
                          <button type="button" class="edit-back-btn">返回</button>\
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
					                        <div class="edit-status">状态：<span class="'+(this.model.get("showflag")==0?'':'publish')+'">'+(this.model.get("showflag")==0?'未发表':'已发表')+'</span></div>\
					                        <div class="edit-sep"></div>\
					                        <div class="edit-items">\
					                            <div class="edit-item creator">\
					                                <div class="edit-item-title">作者</div>\
					                                <div class="edit-item-c">\
					                                    <div class="edit-creator">\
					                                        <div class="edit-creator-logo">\
					                                            <img src="'+this.model.get("author")["profile"]+'">\
					                                        </div>\
					                                        <div class="edit-creator-info">\
					                                            <div class="edit-creator-name">'+this.model.get("author")["name"]+'</div>\
					                                            <div class="edit-creator-title">'+this.model.get("author")["title"]+'</div>\
					                                        </div>\
					                                    </div>\
					                                    <div class="edit-opear">\
					                                        <div class="edit-select"></div>\
					                                        <button type="button" class="edit-item-submit" action-type="author" disabled="disabled">提交</button>\
					                                    </div>\
					                                </div>\
					                            </div>\
					                            <div class="edit-item columns">\
					                                <div class="edit-item-title">所在栏目</div>\
					                                <div class="edit-item-c">\
					                                    <div class="edit-opear">\
					                                        <div class="edit-select"></div>\
					                                        <button type="button" class="edit-item-submit" action-type="type" disabled="disabled">提交</button>\
					                                    </div>\
					                                </div>\
					                            </div>\
					                            <div class="edit-item tag">\
					                                <div class="edit-item-title">标签</div>\
					                                <div class="edit-item-c">\
					                                    <div class="edit-opear">\
					                                        <div class="edit-input"></div>\
					                                        <button type="button" class="edit-item-submit" action-type="tags" disabled="disabled">提交</button>\
					                                    </div>\
					                                </div>\
					                            </div>\
					                            <div class="edit-item time">\
					                                <div class="edit-item-title">时间</div>\
					                                <div class="edit-item-c">\
					                                    <div class="edit-opear">\
					                                        <div class="edit-input"></div>\
					                                        <button type="button" class="edit-item-submit" action-type="intime" disabled="disabled">提交</button>\
					                                    </div>\
					                                </div>\
					                            </div>\
					                            <div class="edit-item seo-title">\
					                                <div class="edit-item-title">SEO主题</div>\
					                                <div class="edit-item-c">\
					                                    <div class="edit-opear">\
					                                        <div class="edit-input"></div>\
					                                        <button type="button" class="edit-item-submit" action-type="seotitle" disabled="disabled">提交</button>\
					                                    </div>\
					                                </div>\
					                            </div>\
					                            <div class="edit-item seo-tag">\
					                                <div class="edit-item-title">SEO Keywords</div>\
					                                <div class="edit-item-c">\
					                                    <div class="edit-opear">\
					                                        <div class="edit-input"></div>\
					                                        <button type="button" class="edit-item-submit" action-type="seokeywords" disabled="disabled">提交</button>\
					                                    </div>\
					                                </div>\
					                            </div>\
                                      <div class="edit-item description">\
                                          <div class="edit-item-title">描述</div>\
                                          <div class="edit-item-c">\
                                              <div class="edit-opear">\
                                                  <div class="edit-input"></div>\
                                                  <button type="button" class="edit-item-submit" action-type="description" disabled="disabled">提交</button>\
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
			this.show_c = this.$el.find('.edit-show-main');
      this.publish_btn = this.$el.find('.edit-submit-btn');
      this.un_publish_btn = this.$el.find('.edit-unsubmit-btn');
      this.status_c = this.$el.find('.edit-status span')
		},
		_init_func:function(){
			this._init_show();
			this._init_create();
			this._init_columens();
			this._init_tags();
			this._init_date();
			this._init_seo_title();
			this._init_seo_tag();
      this._init_seo_description();
		},
    bindEvt:function(){
      var self = this;
      this.model.bind('sync',function(resp){
        if(resp['ret'] == 'success'){
          self.old_model.set(resp)
        }
      })
      this.old_model.bind('change',this._init_show)
    },
		_init_show:function(){
			this.show_c.html('<div class="edit-show-pic">\
                                <img src="'+this.old_model.get("img")+'">\
                            </div>\
                            <div class="edit-show-info">\
                                <span>by</span>\
                                <span class="specail">'+this.old_model.get("author")["name"]+'</span>\
                                <span>'+new Date(this.old_model.get("intime")*1000).FormatTime('yyyy-MM-dd')+'</span>\
                            </div>\
                            <div class="edit-show-name">'+this.old_model.get("title")+'</div>\
                            <div class="edit-show-content">\
                              '+this.old_model.get('content')+'\
                            </div>')
		},
		_init_create:function(){
      var self = this;
      this.creator_c = this.$el.find('.edit-creator');
      this.creator_btn = this.$el.find('.edit-item.creator .edit-item-submit')
			this.creator = new jw.Combobox({
				el:this.$el.find('.edit-item.creator .edit-select'),
				appendtype:1,
				dropdownparams:{
					items:authors,
					_default:this.model.get("author")['id']
				}
			})
      this.creator.bind('change',function(resp){
        var data = _.findWhere(authors,{id:resp["id"]});
        self.creator_c.html('<div class="edit-creator-logo">\
                                <img src="'+data["profile"]+'">\
                            </div>\
                            <div class="edit-creator-info">\
                                <div class="edit-creator-name">'+data["name"]+'</div>\
                                <div class="edit-creator-title">'+(data["title"].length>30?data["title"].substring(0,35)+'...':data["title"])+'</div>\
                            </div>')
        if(self.old_model.get("author")['id'] == resp['id']){
          self.creator_btn.attr({disabled:'disabled'})
        }else{
          self.creator_btn.removeAttr('disabled')
        }
        self.model.set({author:data})
      })
		},
		_init_columens:function(){
      var self = this;
      this.columen_btn = this.$el.find('.edit-item.columns .edit-item-submit')
			this.columen = new jw.Combobox({
				el:this.$el.find('.edit-item.columns .edit-select'),
				appendtype:1,
				dropdownparams:{
					items:types,
					_default:this.model.get("type")
				}
			})
      this.columen.bind('change',function(resp){
        if(self.old_model.get('type')!=resp['id']){
          self.columen_btn.removeAttr('disabled')
        }else{
          self.columen_btn.attr({disabled:'disabled'})
        }
        self.model.set({type:resp["id"]})
      })
		},
		_init_tags:function(){
      var self = this;
      this.tags_btn = this.$el.find('.edit-item.tag .edit-item-submit');
      this.tags = new jw.taginput({
        el:this.$el.find('.edit-item.tag .edit-input'),
        action:'tag',
        tip:'+ 添加标签'
      });
      return 
			// this.tags = new jw.Form.tag({
			// 	el:this.$el.find('.edit-item.tag .edit-input'),
			// 	name:'tags',
      //   model:this.model,
			// 	style:1
			// })
      this.tags.bind('change',function(resp){
        if(self.old_model.get("tags")!=resp){
          self.tags_btn.removeAttr('disabled')
        }else{
          self.tags_btn.attr({disabled:'disabled'})
        }
        self.model.set({tags:resp})
      })
		},
		_init_date:function(){
      var self = this;
      this.time_btn = this.$el.find('.edit-item.time .edit-item-submit')
      this.time = new jw.SelDate({
        el:this.$el.find('.edit-item.time .edit-input'),
        model:this.model,
        name:'intime',
        _default:this.model.get('intime'),
        stop_evt:1
      })
      this.time.bind('change',function(resp){
        var date = jw.timestamp(resp);
        console.log(self.old_model.get('intime'),date)
        if(self.old_model.get('intime')!=date){
          self.time_btn.removeAttr('disabled')
        }else{
          self.time_btn.attr({disabled:'disabled'})
        }
        self.model.set({intime:date})
      })
		},
		_init_seo_title:function(){
      var self = this;
      this.seotitle_btn = this.$el.find('.edit-item.seo-title .edit-item-submit')
			this.seo_title = new jw.input({
				el:this.$el.find('.edit-item.seo-title .edit-input'),
				model:this.model,
				name:'seotitle',
				style:1
			})
      this.seo_title.setTxt(this.model.get("seotitle"))
      this.seo_title.bind('change',function(resp){
        if(self.old_model.get('seotitle')!=resp){
          self.seotitle_btn.removeAttr('disabled')
        }else{
          self.seotitle_btn.attr({disabled:'disabled'})
        }
        self.model.set({seotitle:resp})
      })
		},
		_init_seo_tag:function(){
      var self = this;
      this.seokeywords_btn = this.$el.find('.edit-item.seo-tag .edit-item-submit')
			this.seo_tag = new jw.input({
				el:this.$el.find('.edit-item.seo-tag .edit-input'),
				model:this.model,
				name:'seoTag',
				style:1
			})
      this.seo_tag.bind('change',function(resp){
        if(self.old_model.get('seokeywords')!=resp){
          self.seokeywords_btn.removeAttr('disabled')
        }else{
          self.seokeywords_btn.attr({disabled:'disabled'})
        }
        self.model.set({seokeywords:resp})
      })
		},
    _init_seo_description:function(){
      var self = this;
      this.seodescription_btn = this.$el.find('.edit-item.description .edit-item-submit')
      this.seodescription = new jw.input({
        el:this.$el.find('.edit-item.description .edit-input'),
        model:this.model,
        name:'description',
        style:1
      })
      this.seodescription.setTxt(this.model.get("seodescription"))
      this.seodescription.bind('change',function(resp){
        if(self.old_model.get('description')!=resp){
          self.seodescription_btn.removeAttr('disabled')
        }else{
          self.seodescription_btn.attr({disabled:'disabled'})
        }
        self.model.set({seodescription:resp})
      })
    },
		cancelSave:function(){
			this.removeEl();
      $.publish('editSuccess',this.model.toJSON())
		},
		save:function(){
		},
    saveItem:function(evt){
      var self = this;
      var target = $(evt.currentTarget);
      var type = target.attr("action-type");
      var data = {}
      data[type] = this.model.get(type);
      data['id'] = this.model.get("id");
      this.model.save(data,{patch:true,success:function(resp){
        self.old_model.set(data)
        self.$el.find(".edit-item-submit[action-type='"+type+"']").attr({disabled:'disabled'})
      }})
    },
		publish:function(){
      var self = this;
      this.model.save({showflag:1,id:this.model.get("id")},{patch:true,success:function(resp){
        self.status_c.html('已发表').addClass('publish')
        self.publish_btn.addClass('hide');
        self.un_publish_btn.removeClass('hide')
      }});
		},
    unpublish:function(){
      var self = this;
      this.model.save({showflag:0,id:this.model.get("id")},{patch:true,success:function(resp){
        self.status_c.html('未发表').removeClass('publish')
        self.publish_btn.removeClass('hide');
        self.un_publish_btn.addClass('hide');
      }});
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
				parentEl:this.$el.find('.main-c'),
        data:this.data
			})
			this.list.bind('new-blog',function(){
				$.publish('newBlog')
			})
		}
	})

	new blog.console({
		el:$('.blog-main'),
    data:data
	})

})
