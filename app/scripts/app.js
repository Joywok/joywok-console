$(function(){

  /*
                       _ooOoo_
                      o8888888o
                      88" . "88
                      (| -_- |)
                      O\  =  /O
                   ____/`---'\____
                 .'  \\|     |//  `.
                /  \\|||  :  |||//  \
               /  _||||| -:- |||||-  \
               |   | \\\  -  /// |   |
               | \_|  ''\---/''  |   |
               \  .-\__  `-`  ___/-. /
             ___`. .'  /--.--\  `. . __
          ."" '<  `.___\_<|>_/___.'  >'"".
         | | :  `- \`.;`\ _ /`;.`/ - ` : | |
         \  \ `-.   \_ __\ /__ _/   .-` /  /
    ======`-.____`-.___\_____/___.-`____.-'======
                       `=---='
    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                 佛祖保佑       永无BUG
    */

  _.each(types,function(item){
    item["key"] = item['id'];
    item["txt"] = item['name'];
  })
  types.unshift({key:'0',id:'0',name:'所有',txt:'所有'})

  var publish_types = new Object(types);

  _.each(authors,function(item){
    item['key'] = item["id"]
    item["txt"] = item["name"]
  })

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
      'click .list-item-input-cancel':'cance_save',
      'click .list-item-remove':'removeType',
      'click .goB':'changePost',
      'click .goT':'changePost'
    },
    initialize:function(){
      var self = this;
      _.bindAll(this,'render','remove','removeType')
      this.model.bind('change',this.render)
      this.model.bind('remove destroy',this.remove);
    },
    render:function(){
      var index = this.model.collection.indexOf(this.model);
      if(index%2 == 1) this.$el.addClass('even');
      if(!this.model.get("isnew")){
        if(index == 0){
          if(this.model.collection.length==1){
            this.$el.addClass('noGoT')
            this.$el.addClass('noGoB')
          }else{
            this.$el.addClass('noGoT')
          }
        }else{
          if(index == this.model.collection.length-1){
            if(this.model.collection.length==1){
              this.$el.addClass('noGoT')
            }
            this.$el.addClass('noGoB')
          }
        }
        this.model.set({index:index})
      }
      // '+(!this.model.get("isnew")?'<div class="list-item-remove" model-id="'+this.model.get("id")+'"></div>':'')+'\
      this.$el.html('<div class="list-item-w">\
                        <div class="list-item-c">\
                            <div class="list-item-num">'+(!this.model.get("isnew")?index:'')+'</div>\
                            <div class="list-item-edit"></div>\
                            <div class="list-item-content">\
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
      if(this.model.get("isnew")){
        this.model.unset('isnew',{silent:true})
        Backbone.sync('create',null,{url:basurl+'/blog/type',data:JSON.stringify({name:this.model.get("name")}),success:function(resp){
          if(resp['ret'] == 'success'){
            self.model.set({name:self.model.get("name"),id:resp["data"]['id'],key:resp["data"]['id'],txt:self.model.get("name")},{silent:true});
            self.model.collection.trigger('reset');
          }
        }})
      }else{
        this.model.save({name:this.model.get("name"),id:this.model.get("id")},{patch:true,success:function(resp){
          self.model.set({txt:self.model.get("name")});
          self.save_c.attr('disabled','disabled').html('保存');
        }})
      }
    },
    cance_save:function(){
      if(this.model.get("isnew")){
        this.model.collection.remove(this.model)
      }else{
        this.model.set({name:this.old_title})
        this.$el.removeClass('editing');
        this.input_w.addClass('hide')
        this.name_c.removeClass('hide');
        this.save_c.attr('disabled','disabled').html('保存');
      }
    },
    removeType:function(){
      var self = this;
      new jw.Confirm({content:'确认删除此栏目么？此操作不可恢复。',confirm:function(){
        self.model.destroy({url:basurl+'/blog/type',data:JSON.stringify({id:self.model.get("id")}),success:function(){
          // self.model.collection.remove(self.model);
          console.log(self.model.collection)
          // self.model.collection.trigger("reset")
        }})
      }});
    },
    changePost:function(evt){
      var self = this;
      var target = $(evt.currentTarget);
      var model = this.model
      var type = target.attr('action-type');
      var moved_mode;
      console.log(model.toJSON(),'xxxxx')
      if(type == 'T'){
        var index = parseInt(model.get("index"));
        model.set({index:index-1},{silent:true});
        moved_mode = this.model.collection.at(index-1)
        moved_mode.set({index:index},{silent:true});
      }else{
        var index = parseInt(model.get("index"));
        model.set({index:index+1},{silent:true});
        moved_mode = this.model.collection.at(index+1)
        moved_mode.set({index:index},{silent:true});
        console.log(index+1,index)
      }
      Backbone.sync('update',null,{url:basurl+'/blog/typesort',data:JSON.stringify({id:model.get("id"),sid:moved_mode.get("id")}),success:function(resp){
        if(resp['ret'] == 'success') self.model.collection.sortData();
      }})
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
    initialize:function(){
      this.data = {};
    },
    parse:function(data,options){
      this.data['parseno'] = data["data"]['pagination']['pagenum'];
      this.data['num'] = parseInt(data["data"]['pagination']['pagesum']);
      var listData = data["data"]['articles'];
      return listData
    },
    getData:function(options,type,func){
      var self = this;
      _.extend(this.data,options);
      var data = {
        pageno:this.data['pageno'],
        type:this.data["type"],
        pagesize:10
      }
      var time = new jw.SysNotice({type  : 2,text  : '努力加载中……',delay:1000});
      this.fetch({url:basurl+'/blog/list',data:data,reset:(type=="update"?false:true),remove:(type=="update"?false:true),success:function(collection,resp){
        time.HideBar()
        self.trigger('list:change')
        if(func) func()
      }})
    },
    sortData:function(){
      var data = _.sortBy(this.toJSON(),function(item){
        return Math.max(item['index']);
      });
      //console.log(data);
      this.remove(this.models);
      this.add(data);
    }
  })
  blog.setting_m = Backbone.Model.extend()
  blog.setting = Backbone.View.extend({
    events:{
      'click .cancel-save':'cancelSave',
      'click .list-title-save':'saveAll',
      
      'click .list-title-new':'newType',
      'click .list-title-submit':'publish'
    },
    initialize:function(options){
      var self = this;
      _.extend(this,options);
      this.model = new blog.setting_m(this.data)
      this.old_model = this.model.clone();
      this.collection = new blog.setting_Collection(this.data);
      this.$el = $('<div class="m-i-c setting"></div>');
      this.$el.css({left:this.parentEl.width()+'px',width:this.parentEl.width()+'px'});
      this.parentEl.append(this.$el);
      this.$el.stop().animate({left:'190px'},500,function(){
        self.$el.css({width:'auto'});
      })
      this._init_main();
      this._init_name();
      this.bindEvt();
      this.addAll();
    },
    _init_main:function(){
      // <button type="button" class="list-title-save" disabled="disabled">保存</button>\
      this.$el.html('<div class="columns-list">\
                        <div class="columns-w list-w">\
                          <div class="list-top">\
                                <div class="list-title">可拖动改变栏目显示顺序</div>\
                                <button type="button" class="list-title-new">新建栏目</button>\
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
      this.collection.bind('all',function(){
        types = self.collection.toJSON();
      })
      this.collection.bind('list:change',function(){
        var data = self.collection.data;
        if(data['pageno'] == parseInt(data["num"])-1){
          self.addmore_btn.addClass('hide');
          self.container.css({bottom:'20px'})
        }else{
          self.addmore_btn.removeClass('hide')
          self.container.css({bottom:'50px'})
        }
      })
    },
    addOne:function(model){
      var view = new blog.setting_view({model:model});
      if(model.get('isnew')){
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
      // this.save_btn.html('保存中…').attr({disabled:'disabled'});
      // console.log('保存给服务器？')
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
    newType:function(){
      this.collection.add({isnew:true})
    },
    publish:function(){
      var self = this;
      this.publish_btn.attr({disabled:'disabled'}).html('发布中…')
      Backbone.sync("update",null,{url:basurl+'/blog/typepost',success:function(resp){
        if(resp['ret'] == 'success'){
          publish_types = self.collection.toJSON();
          publish_types.unshift({key:'0',id:'0',name:'所有',txt:'所有'})
          self.publish_btn.removeAttr('disabled').html('发布')
        }
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
      // '+(this.model.get("type")&&this.model.get("type")!=""?'<div class="list-show-item-tag ellipsis" title="'+types[this.model.get("type")-1]['name']+'">'+types[this.model.get("type")-1]['name']+'</div>':'')+'\
      console.log('这里走了么')
      if(this.model.get("type")!='0'){
        var type_obj = _.findWhere(publish_types,{id:this.model.get("type")})  
      }
      this.$el.html('<div class="list-show-item-w">\
                          <div class="list-show-item-c">\
                              <div class="list-show-item-imgc">\
                                  <img src="'+this.model.get("img")+'"/>\
                                  '+(this.model.get("type")&&this.model.get("type")!='0'?'<div class="list-show-item-tag ellipsis">'+type_obj["name"]+'</div>':'')+'\
                              </div>\
                              <div class="list-show-item-name">'+this.model.get("title")+'</div>\
                              <div class="list-show-item-info">\
                                  <span>'+this.model.get("author")["name"]+'</span>\
                                  <span>'+new Date(this.model.get("intime")*1000).FormatTime('yyyy-MM-dd')+'</span>\
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
      this.$el.html('');
      this.collection.each(this.addOne);
    }
  })

  blog.list_item_view = Backbone.View.extend({
    className:'list-item',
    initialize:function(){
      var self = this;
      _.bindAll(this,'render','remove');
      this.model.bind('change',this.render)
      this.model.bind('destroy remove',this.remove);
    },
    render:function(){
      var index = this.model.collection.indexOf(this.model);
      if(index%2 == 1) this.$el.addClass('even');
      if(index == 0){
          if(this.model.get('coverflag') == '1'){
            this.$el.addClass('noGoB');  
          }
          this.$el.addClass('noGoT');
          if(this.model.collection.length-1 == index){
            this.$el.addClass('noGoB');
          }
      }else{
        if(index == 1){
          if(this.model.collection.at(index-1).get("coverflag")== "1"){
            this.$el.addClass('noGoT')
          }
          if(index == this.model.collection.length-1){
            this.$el.addClass('noGoB')
          }
        }else{
          if(index == this.model.collection.length-1){
            if(this.model.collection.length==1){
              this.$el.addClass('noGoT')
            }
            this.$el.addClass('noGoB')
          }
        }
      }
      this.model.set({index:index})
      if(this.model.get('showflag') !="1") this.$el.addClass('noShow');
      this.$el.html('<div class="list-item-w">\
                        <div class="list-item-c">\
                            <div class="list-item-num">'+index+'</div>\
                            <div class="list-item-edit" model-id="'+this.model.get("id")+'"></div>\
                            <div class="list-item-top '+(this.model.get("coverflag")&&this.model.get("coverflag")=='1'?'active':'')+'" model-id="'+this.model.get("id")+'"></div>\
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
      this.data['pageno'] = parseInt(data["data"]['pagination']['pagenum']);
      this.data['num'] = parseInt(data["data"]['pagination']['pagesum']);
      var listData = data["data"]['articles'];
      listData.reverse();
      return this.sortData(listData);
    },
		getData:function(options,type,func){
			var self = this;
			_.extend(this.data,options);
      var data = {
        pageno:this.data['pageno'],
        type:this.data["type"],
        pagesize:10
      }
      var time = new jw.SysNotice({type  : 2,text  : '努力加载中……'});
			this.fetch({url:basurl+'/blog/list',data:data,reset:(type=="update"?false:true),remove:(type=="update"?false:true),success:function(collection,resp){
        time.HideBar()
        self.trigger('list:change')
				if(func) func()
			}})
		},
    sortData:function(d){
      if(d&&d.length!=0){
        var data = d;
        var coverflag = [];
        var datas = [];
        _.each(data,function(item){
          if(item['coverflag'] == '1') coverflag.push(item)
          else datas.push(item)
        })
        datas = _.sortBy(datas,function(item){
          return Math.max(item['index'])
        });
        coverflag = coverflag.concat(datas);
        return coverflag
      }else{
        var data = this.toJSON();
        var coverflag = [];
        var datas = [];
        _.each(data,function(item){
          if(item['coverflag'] == '1') coverflag.push(item)
          else datas.push(item)
        })
        datas = _.sortBy(datas,function(item){
          return Math.max(item['index'])
        });
        coverflag = coverflag.concat(datas);
        this.remove(this.models);
        this.add(coverflag);
      }
      // var data = this.toJSON();
      // data = _.sortBy(data,function(item){
      //   return Math.max(item['index'])
      // });
      // // coverflag = coverflag.concat(datas);
      // this.remove(this.models);
      // this.add(data);
    }
	})
	blog.list = Backbone.View.extend({
		events:{
			'click .m-i-t-opear-i':'changTab',
			'click .new-blog':'newBlog',
      'click .m-i-c.list .list-item-top':'setCollage',
      'click .m-i-c.list .list-c-addmore':'getMore',
      'click .m-i-c.list .goB':'changePost',
      'click .m-i-c.list .goT':'changePost',
      'click .m-i-c.list .list-item-remove':'removeBlog',
      'click .m-i-c.list .list-item-edit':'editBlog',
      'click .m-i-c.list .list-title-submit':'publish'
		},
		initialize:function(options){
			var self = this;
			_.extend(this,options);
      _.bindAll(this,'_init')
      this.showType = '1';
			this.collection = new blog.list_collection();
			this.$el = $('<div class="m-i list"><div class="spinner"></div></div>');
			this.parentEl.append(this.$el);
      this.collection.getData({type:1,pageno:0,pagesize:10},'reset',this._init)
		},
    _init:function(){
      this._init_main();
      this._init_name();
      this.bindEvt();
      this._init_show();
      this.addAll();
      this.collection.trigger('list:change');
    },
		_init_main:function(){
			this.$el.html('<div class="m-i-t">\
                          <div class="m-i-ico-c">\
                              <div class="m-i-ico"></div>\
                          </div>\
                          <div class="m-i-t-opear">\
                              <div class="m-i-t-opear-i active" action-type="1">已发布</div>\
                              <div class="m-i-t-opear-i" action-type="0">未发布</div>\
                              <div class="m-i-t-opear-i" action-type="types">栏目管理</div>\
                          </div>\
                          <div class="m-i-t-b">\
                              <div class="new-blog">\
                                  <div class="new-blog-ico"></div>\
                                  <div class="new-blog-txt">撰写博客</div>\
                              </div>\
                          </div>\
                      </div>\
                      <div class="m-i-c list">\
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
                                    <button class="list-c-addmore '+(this.collection.data["pageno"]>=this.collection["data"]["num"]-1?'hide':'')+'" type="button">加载更多</button>\
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
      this.list_c = this.$el.find('.m-i-c.list');
      this.addmore_btn = this.$el.find('.list-c-addmore');
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
        var data = self.collection.data;
        if(data['type'] == "1"){
          if(self.collection.length!=0){
            self.publish_btn.removeClass('hide');
          }else{
            self.publish_btn.addClass('hide');
          }
        }
        if(data['pageno'] >= parseInt(data["num"])-1){
          self.addmore_btn.addClass('hide');
          self.container.css({bottom:'20px'});
        }else{
          self.addmore_btn.removeClass('hide');
          self.container.css({bottom:'50px'});
        }
      })
      $.subscribe('unpublish',function(evt,data){
        self.collection.remove(data);
        self.addAll();
      })
      $.subscribe('editSuccess',function(evt,data){
        if(self.showType == data['showflag']){
          if(self.collection.length ==0){
            self.container.html('');
          }
          if(self.collection.get(data['id'])){
            self.collection.add(data,{merge:true})
          }else{
            data['isnew'] = true
            self.collection.add(data,{at:1,silent:true})
            // console.log(self.collection.toJSON())
            // self.addAll();
            self.collection.trigger('reset');
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
          self.list_w.css({left:'530px'})
        },200)
        if(this.collection.data["type"] =="1") self.publish_btn.removeClass('hide')
				this.collection.each(this.addOne);
			}else{
        setTimeout(function(){
          self.list_w.css({left:'190px'})
        },200)
        if(this.collection.data["type"] =="1") self.publish_btn.addClass('hide')
				this.container.html('<div class="list-c-none">还没有博客呢？撰写一份吧～</div>');
			}
		},
		changTab:function(evt){
			var target = $(evt.currentTarget);
			this.tabs_item.removeClass('active');
			target.addClass('active');
      this.showType = target.attr("action-type");
      if(this.showType == "types"){
        // this.list_c.stop().animate({opacity:0})
        this.list_c.addClass('hide')
        var data = _.filter(types,function(item){
          return item['key'] !="0"
        })
        this.settings = new blog.setting({
          parentEl:this.$el,
          data:data
        })
      }else{
        // this.list_c.stop().animate({opacity:1})
        this.list_c.removeClass('hide')
        if(this.settings){
          this.settings.removeEl()
        }
        if(this.showType == '0'){
          this.list_w.addClass('unissues')
        }else{
          this.list_w.removeClass('unissues')
        }
  			this.collection.getData({type:this.showType,pageno:0},'reset',this.addAll)
      }
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
            item.set({coverflag:0},{silent:true})
          })
          model.set({coverflag:1},{silent:true})
          self.collection.sortData();
          new jw.SysNotice({type  : 2,text  : '设置封面成功',delay:1000});
        }
      }})
    },
    getMore:function(){
      this.collection.getData({pageno:(parseInt(this.collection.data['pageno'])+1)},'update')
    },
    changePost:function(evt){
      var self = this;
      var target = $(evt.currentTarget);
      var model = this.collection.get(target.attr('model-id'));
      var type = target.attr('action-type');
      var moved_mode;
      if(type == 'T'){
        var index = parseInt(model.get("index"));
        model.set({index:index-1},{silent:true});
        moved_mode = this.collection.at(index-1);
        moved_mode.set({index:index},{silent:true});
      }else{
        var index = parseInt(model.get("index"));
        model.set({index:index+1},{silent:true});
        moved_mode = this.collection.at(index+1);
        moved_mode.set({index:index},{silent:true});
      }
      Backbone.sync('update',null,{url:basurl+'/blog/sort',data:JSON.stringify({id:model.get("id"),sid:moved_mode.get("id")}),success:function(resp){
        if(resp['ret'] == 'success'){
          self.collection.sortData();
          new jw.SysNotice({type  : 2,text  : '移动成功',delay:1000});
        }
      }})
    },
    removeBlog:function(evt){
      var self = this;
      var target = $(evt.currentTarget);
      var model = this.collection.get(target.attr('model-id'));
      var url = model.get("showflag") == '1'?basurl+'/blog/post':basurl+'/blog/update/';
      new jw.Confirm({content:'确认删除此博客么？此操作不可恢复。',confirm:function(){
        model.destroy({url:url,data:JSON.stringify({id:model.get("id")}),success:function(resp){
          if(resp) self.addAll();
        }})
      }});
    },
    editBlog:function(evt){
      var target = $(evt.currentTarget);
      var model = this.collection.get(target.attr('model-id'));
      $.publish('editBlog',{data:{id:model.get("id")}})
    },
    publish:function(){
      var self = this;
      this.publish_btn.attr({disabled:"disabled"}).html('发布中…')
      Backbone.sync('update',null,{url:basurl+'/blog/post',success:function(resp){
        if(resp['ret'] == 'success'){
          new jw.SysNotice({type  : 2,delay : 1000,text  : '发布成功'});
          self.publish_btn.removeAttr("disabled").html('发布')
        }
      }})
    }
	})

	blog.new_blog_m = Backbone.Model.extend({
    url:basurl+'/blog/cmtnew',
		defaults:{
			img:basurl+'/console/app/images/list-demo.jpg',
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
			this.model = new blog.new_blog_m();
      if(options['data']){
        this.model.set(options['data']);
        this.old_model = this.model.clone();
        this.isEditParent.$el.addClass('hide');
      }
      $('.m-i.list').addClass('hide')
			this.$el = $('<div class="m-i new"><div class="spinner"></div></div>')
			this.parentEl.append(this.$el);
      setTimeout(function(){
  			self._init_main();
        self._init_name();
  			self._init_func();
        self.bindEvt();
      },200)
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
        el: this.$el.find('.new-blog-content-c'),
        pasteReg:function(html){
          html = html.replace(/(href="(.*?)")|(style="(.*?)")/img,'');
          return html;
        },
        uploadAction:basurl+'/blog/upload',
        styles:'div,section h1,section p,section div,section a{margin:0 0 10px 0;font-size: 16px!important;line-height: 30px!important;color: #999!important;} img{max-width:700px!important;} body{margin:0 0 10px 0!important;font-size: 16px!important;line-height: 30px!important;color: #999!important;}'
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
          if(this.get('title')!=""&&this.get('content')!=''){
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
            self.removeEl();
            if(self.isEditParent){
              console.log(resp["data"])
              self.isEditParent.model.set(resp["data"]);
              // self.isEditParent.old_model.set(resp["data"]);
            }
            self.isEditParent.$el.removeClass('hide');
          }else{
            self.model.set({id:resp['data']['url'].split('?id=')[1]},{silent:true})
            self.trigger('saveSuccess',self.model.toJSON())
          }
        }
      }})
		},
    cancelSave:function(){
      if(this.isEditParent){
        this.isEditParent.$el.removeClass('hide')
      }else{
        $('.m-i.list').removeClass('hide')
      }
      this.$el.remove();
    },
		removeEl:function(func){
			var self = this;
			this.$el.remove();
			if(func && typeof func == 'function') func()
		}
	})
	
	blog.edit_blog_m = Backbone.Model.extend({
    url:basurl+'/blog/cmtnew',
    defaults:{
      intime:parseInt(jw.timetostamp_now(jw.systime)),
      author:authors[0],
      type:'0',
      seodescription:'',
      img:basurl+'/console/app/images/list-demo.jpg',
      content:'',
      title:''
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
      'click .edit-updata-btn':'upData'
		},
		initialize:function(options){
			var self = this;
			_.extend(this,options);
			_.bindAll(this,'_init','_init_show');
      $('.m-i.list').addClass('hide')
			this.model = new blog.edit_blog_m();
      if(this.newParent){
        this.newParent.removeEl();
      }
			this.$el = $('<div class="m-i edit"><div class="spinner"></div></div>');
			this.parentEl.append(this.$el);
      Backbone.sync('read',null,{url:basurl+'/blog/article?id='+this.data["id"],success:function(resp){
        if(resp){
          self.model.set(resp["data"]);
          self.old_model = self.model.clone();
          self._init();
        }
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
			this.$el.html('<div class="m-i-t">\
					            <div class="m-i-ico-c">\
					                <div class="m-i-ico"></div>\
					            </div>\
					            <div class="m-i-t-opear">\
					                <div class="m-i-t-opear-i active">编辑博客</div>\
					            </div>\
					            <div class="m-i-t-b">\
                          <button type="button" class="edit-unsubmit-btn '+(this.model.get("showflag")==0?'hide':'')+'">下架</button>\
					                <button type="button" class="edit-submit-btn '+(this.model.get("showflag")==1?'hide':'')+'">发表</button>\
                          <button type="button" class="edit-updata-btn '+(this.model.get("showflag")==1?'':'hide')+'" disabled="disabled">更新发布</button>\
                          <button type="button" class="edit-save-btn" disabled="disabled">保存</button>\
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
					                                    </div>\
					                                </div>\
					                            </div>\
					                            <div class="edit-item columns">\
					                                <div class="edit-item-title">所在栏目</div>\
					                                <div class="edit-item-c">\
					                                    <div class="edit-opear">\
					                                        <div class="edit-select"></div>\
					                                    </div>\
					                                </div>\
					                            </div>\
					                            <div class="edit-item tag">\
					                                <div class="edit-item-title">标签</div>\
					                                <div class="edit-item-c">\
					                                    <div class="edit-opear">\
					                                        <div class="edit-input"></div>\
					                                    </div>\
					                                </div>\
					                            </div>\
					                            <div class="edit-item time">\
					                                <div class="edit-item-title">时间</div>\
					                                <div class="edit-item-c">\
					                                    <div class="edit-opear">\
					                                        <div class="edit-input"></div>\
					                                    </div>\
					                                </div>\
					                            </div>\
					                            <div class="edit-item seo-title">\
					                                <div class="edit-item-title">SEO主题</div>\
					                                <div class="edit-item-c">\
					                                    <div class="edit-opear">\
					                                        <div class="edit-input"></div>\
					                                    </div>\
					                                </div>\
					                            </div>\
					                            <div class="edit-item seo-tag">\
					                                <div class="edit-item-title">SEO Keywords</div>\
					                                <div class="edit-item-c">\
					                                    <div class="edit-opear">\
					                                        <div class="edit-input"></div>\
					                                    </div>\
					                                </div>\
					                            </div>\
                                      <div class="edit-item seodescription">\
                                          <div class="edit-item-title">描述</div>\
                                          <div class="edit-item-c">\
                                              <div class="edit-opear">\
                                                  <div class="edit-input"></div>\
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
      this.save_btn = this.$el.find('.edit-save-btn');
      this.updata_btn = this.$el.find('.edit-updata-btn')
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
      // this.model.bind('change',this._init_show);
      this.model.bind('change',function(){
        self._init_show()
        var data = self.old_model.changedAttributes(self.model.toJSON());
        if(data){
          self.updata_btn.removeAttr('disabled');
          self.save_btn.removeAttr('disabled');
        }else{
          self.updata_btn.attr({disabled:'disabled'});
          self.save_btn.attr({disabled:'disabled'});
        }
      })
    },
		_init_show:function(){
			this.show_c.html('<div class="edit-show-pic">\
                                <img src="'+this.model.get("img")+'">\
                            </div>\
                            <div class="edit-show-info">\
                                <span>by</span>\
                                <span class="specail">'+this.model.get("author")["name"]+'</span>\
                                <span>'+new Date(this.model.get("intime")*1000).FormatTime('yyyy-MM-dd')+'</span>\
                            </div>\
                            <div class="edit-show-name">'+this.model.get("title")+'</div>\
                            <div class="edit-show-content">\
                              '+this.model.get('content')+'\
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
					items:publish_types,
					_default:this.model.get("type")
				}
			})
      this.columen.bind('change',function(resp){
        self.model.set({type:resp["id"]})
      })
		},
		_init_tags:function(){
      var self = this;
      this.tags_btn = this.$el.find('.edit-item.tag .edit-item-submit');
      this.tags = new jw.input({
        el:this.$el.find('.edit-item.tag .edit-input'),
        tip:'每个标签用逗号分割',
        style:1
      })
      this.tags.setTxt(this.model.get("tags"))
      this.tags.bind('change',function(resp){
        self.model.set({tags:resp})
      })
		},
		_init_date:function(){
      var self = this;
      this.time_btn = this.$el.find('.edit-item.time .edit-item-submit')
      console.log(this.model.get("intime"))
      this.time = new jw.SelDate({
        el:this.$el.find('.edit-item.time .edit-input'),
        model:this.model,
        name:'intime',
        _default:parseInt(this.model.get('intime')),
        stop_evt:1
      })
      this.time.bind('change',function(resp){
        var date = jw.timestamp(resp);
        console.log(self.old_model.get('intime'),date)
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
      this.seo_tag.setTxt(this.model.get("seokeywords"))
      this.seo_tag.bind('change',function(resp){
        self.model.set({seokeywords:resp})
      })
		},
    _init_seo_description:function(){
      var self = this;
      this.seodescription_btn = this.$el.find('.edit-item.seodescription .edit-item-submit')
      this.seodescription = new jw.input({
        el:this.$el.find('.edit-item.seodescription .edit-input'),
        model:this.model,
        name:'seodescription',
        style:1
      })
      this.seodescription.setTxt(this.model.get("seodescription"))
      this.seodescription.bind('change',function(resp){
        self.model.set({seodescription:resp})
      })
    },
		cancelSave:function(){
			this.removeEl();
		},
		save:function(evt){
      var self = this;
      var target = $(evt.currentTarget);
      target.html('保存中').attr({disabled:'disabled'});
      var data = self.old_model.changedAttributes(self.model.toJSON());
      data["id"] = this.model.get("id");
      this.model.save(data,{patch:true,success:function(resp){
        target.html('保存').attr({disabled:'disabled'});
        self.old_model.set(self.model.toJSON())
        new jw.SysNotice({type  : 2,text  : '保存成功',delay:1000});
        $.publish('editSuccess',self.model.toJSON());
      }})
		},
    upData:function(evt){
      var self = this;
      var target = $(evt.currentTarget);
      var data = self.old_model.changedAttributes(self.model.toJSON());
      if(!data){
        new jw.FormNotice({text:'您没有更改任何选项！修改后更新～'})
        return 
      }
      data["id"] = this.model.get("id");
      target.html('更新中…').attr({disabled:'disabled'})
      Backbone.sync('update',null,{url:basurl+'/blog/savepost',data:JSON.stringify(data),success:function(resp){
        target.html('更新').removeAttr('disabled')
        new jw.SysNotice({type  : 2,text  : '更新成功',delay:1000});
        $.publish('editSuccess',self.model.toJSON())
        self.removeEl();
      }})
    },
		publish:function(){
      var self = this;
      var time = new jw.SysNotice({type  : 2,text  : '发表中……'});
      this.model.save({showflag:1,id:this.model.get("id")},{patch:true,success:function(resp){
        time.HideBar()
        // self.status_c.html('已发表').addClass('publish')
        // self.un_publish_btn.removeClass('hide');
        $.publish('editSuccess',self.model.toJSON())
        self.removeEl();
      }});
		},
    unpublish:function(){
      var self = this;
      var time = new jw.SysNotice({type  : 2,text  : '下架中…'});
      this.model.save({showflag:0,id:this.model.get("id")},{patch:true,success:function(resp){
        time.HideBar();
        self.status_c.html('未发表').removeClass('publish')
        self.un_publish_btn.addClass('hide');
        $.publish('unpublish',self.model.get("id"))
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
			this.$el.remove();
      $('.m-i.list').removeClass('hide')
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
