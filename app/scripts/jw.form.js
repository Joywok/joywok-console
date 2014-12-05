/**
 * Joywok Form
 * 
 */ 
(function($){

jw=jw||{};
jw.Form={};

jw.M_Form=Backbone.Model.extend({
	
})
/**
 * 表单基础组件
 * model 表单对应model
 * options
 *			
 * 			required 1 必选
 */
jw.FormBase=Backbone.View.extend({
	// events:{
	// 	"click .jw-form-cmtbtn":"submit"
	// },
	initialize:function(options){
		_.bindAll(this,'submit','CheckPass','CheckFail','getHandle');
		this.FormItems=_.extend({},options.FormItems)
		this._initItems();
	},
	// 初始化表单项
	_initItems:function(){
		var self=this,container=$(this.el);
		_.each(this.FormItems,function(item){
			item.container=container.find('div[name="'+item.name+'"]');
			if(typeof jw.Form[item.type]=='function'){
				item.handle=new jw.Form[item.type](_.extend(item,{
					el:item.container.find('.jw-form-ic'),
					model:self.model,
					name:item.name,
					lists:item.lists?item.lists:'',
					setEvt:item.setEvt?item.setEvt:'',
					tip:item.tip?item.tip:'',
					required:(typeof item.required=='undefined')||(item.required==0)?0:1
				}));
				// self.item.[item.name] = item.handle;
				// Blur/Focus事件如何处理？
			}
		})
		$(this.el).find('.jw-form-cancelbtn').click(function(){this.close});
		$(this.el).find('.jw-form-cmtbtn').click(function(){
			if($(this).hasClass('disabled')||$(this).attr('disabled')=='disabled') return;
			self.submit();
		});
	},
	CheckPass:function(){
		$(this.el).find('.jw-form-bar').find('.jw-form-cmtbtn').removeAttr('disabled')
	},
	CheckFail:function(){
		$(this.el).find('.jw-form-bar').find('.jw-form-cmtbtn').attr('disabled','disabled');
	},
	// 获取表单单项组件句柄 getHandle param:name
	getHandle:function(name){
		var formitem=_.find(this.FormItems,function(item){
			return item.name==name;
		});
		return formitem.handle;
	},
	// 设置表单基础对象正常或错误状态 style:normal/error
	setStyle:function(name,status){
		var handle=this.getHandle(name);
		handle && typeof handle.setStyle=='function' && handle.setStyle(status);
	},
	submit:function(evt){
		// trace('submit',this.model.toJSON());return;
		this.model.save();
	}
});

/**
 * 弹出框模式表单
 */
jw.FormDialog=jw.FormBase.extend({
	initialize:function(options){
		this._dlgcontent=$(options.formhtml);	// 表单HTML
		this.showfunc = options.showfunc;
		_.bindAll(this,'Cancel');
		this.el=this._dlgcontent;
		jw.FormBase.prototype.initialize.call(this,options);
		this.show();
	},
	// 显示弹出框表单
	show:function(){
		var self=this;
		if(this._dlghandle) delete this._dlghandle;
		this._dlghandle=new jw.dialog({
			style:'custom',
			content:this._dlgcontent,
			modal:true,
			CloseOnEscape:true,
			showfunc:function(){
				if(typeof self.showfunc == 'function') self.showfunc();
			}
		});
		this._dlgcontent.find('.jw-form-cancelbtn').click(function(){
			self._dlghandle.close();
			self.close()
		})
	},
	Cancel:function(){
		trace('Cancel');
	},
	close:function(){
		// this.trigger('FormCancel');
		this._dlghandle.close();
		this.trigger('close')
	}
})
/**
 * 自定义表单组件
 * 输入参数
 * 	model
 * 	el
 *  extclass
 * 	FormItems
 *	opbar==1 则添加表单操作栏
 */
jw.FormCustomize=jw.FormBase.extend({
	initialize:function(options){
		this.btnVal = "保存"
		_.extend(this,options);
		this.FormItems=options.FormItems;
		// 1. 根据表单项目拼装表单HTML框架 同时生成新的FormItems (flatten)
		_.bindAll(this,'combineForm','combineOneItem');
		this.formhtml=this.combineForm(this.FormItems);
		$(this.el).append('<div class="jw-form-w"><div class="jw-form-c">'+this.formhtml.join('')+'</div></div>');
		if(options.opbar&&options.opbar==1) $(this.el).append('<div class="jw-form-bar"><button type="button" disabled class="jw-btn2 jw-btn jw-form-cmtbtn">'+this.btnVal+'</button><button type="button" class="jw-btn4 jw-btn jw-form-cancelbtn">取消</button></div>');
		options.FormItems=_.flatten(this.FormItems);
		jw.FormBase.prototype.initialize.call(this,options);
		this._btn = $(this.el).find(".jw-form-cmtbtn")
	},
	combineForm:function(items){
		var self=this;
		return _(items).chain()
			.map(function(item){
				if(_.isArray(item)) return '<div class="jw-form-items jw-form-items-'+item.length+' equally">'+self.combineForm(item).join('')+'</div>';
				else if(item.type=='wlab'){
					var stylestr=item.style&&item.style!=''?' style="'+item.style+'"':'';
					return '<div class="jw-wlab"'+stylestr+'>'+item.label+'</div>';
				}else if(item.type=='sep') return '<div class="jw-form-sep"></div>';
				else return self.combineOneItem(item);
			})
			.value();
	},
	combineOneItem:function(item){
		// return '<div class="jw-form-item" name="'+item.name+'"><div class="jw-form-item-c"><label class="jw-form-lab">'+item.label+'</label><div class="jw-form-ic"></div></div></div>';
		var nolab=(!item.label||item.label=='')?' jw-form-nolab':'',
			style=item.style?' style="'+item.style+'"':'',
			html=item.html || '';
			deschtml = item.desc?'<div class="jw-form-desc">'+item.desc+'</div>':"";
		return '<div class="jw-form-item module_'+item.name+'" name="'+item.name+'"'+style+'>\
					<div class="jw-form-item-c'+nolab+'">\
						<label class="jw-form-lab">'+item.label+'</label>\
						<div class="jw-form-ic">'+html+'</div>\
					'+deschtml+'</div>\
				</div>';
	},
	_set_dis:function(){
		this._btn.attr('disabled',1).html(this.btnVal+'中...')
	},
	_rep_dis:function(){
		$(this.el).find(".jw-form-cmtbtn").removeAttr('disabled').html(this.btnVal)
	}
});
 
/**
 * 弹出框模式表单
 * showfunc 弹出框弹出后，回调函数，传回当前窗口句柄
 */
jw.CustomFormDialog=jw.FormCustomize.extend({
	initialize:function(options){
		_.extend(this,options)
		this._dlgcontent=$('<div class="'+options.formclass+'"></div>');	// 表单HTML
		if(options.header) this._dlgcontent.append(options.header);
		this.position=options.position;
		_.bindAll(this,'Cancel','close');
		this.el=this._dlgcontent;
		options.opbar=1;
		jw.FormCustomize.prototype.initialize.call(this,options);
		this.showfunc=options.showfunc;
		this.show();
	},
	// 显示弹出框表单
	show:function(){
		var self=this;
		if(this._dlghandle) delete this._dlghandle;
		var params={
			style:'custom',
			content:this._dlgcontent,
			modal:true,
			CloseOnEscape:true
		};
		if(this.position) params=_.extend(params,{position:this.position});
		this._dlghandle=new jw.dialog(params);
		this._dlgcontent.find('.jw-form-cancelbtn').click(function(){
			self._dlghandle.close();
			self.close()
		});
		typeof this.showfunc=='function' && this.showfunc(this._dlgcontent);
	},
	Cancel:function(){
		trace('Cancel');
	},
	close:function(){
		this._dlghandle.close();
	},
	submit:function(evt){
		// trace('submit',this.model.toJSON());return;
		$(this.el).find('.jw-form-bar').find('.jw-form-cmtbtn').html("保存中…").attr({disabled:'disabled'})
		this.model.save({},{silent:true});
	}
});


// 表单基础件
/**
 * 纯文本展示
 */
jw.Form.text = Backbone.View.extend({
	initialize:function(options){
		this.$el.append('<span class="jw-form-span">'+options.val+'</span>');
	}
})
/**
 * jw.Form.Input
 */
jw.Form.input=jw.input.extend({
	initialize:function(options){
		options=_.extend(options,{
			inittype:0,
			shadow:0,
			_default:this.model.get(options.name)?this.model.get(options.name):''
		});
		this.required=options.required;
		this.name=options.name;
		this.setEvt=options.setEvt||'change';
		jw.input.prototype.initialize.call(this,options);
		this._initComponent();
	},
	_initComponent:function(){
		_.bindAll(this,'setModel');
		// this.model.bind(this.name+':change');
		if(this.required){
			$(this.el).append('<div class="jw-form-required"></div>')
		}
		this.bind(this.setEvt,this.setModel);
	},
	setModel:function(){
		this.model.set(this.name,this.getText());
	}
});
/**
 * 表单密码基础组件
 */
jw.Form.passwd=jw.passwdInput.extend({
	initialize:function(options){
		options=_.extend(options,{
			inittype:0,
			shadow:0,
			_default:this.model.get(options.name)?this.model.get(options.name):''
		});
		this.required=options.required;
		this.name=options.name;
		this.setEvt=options.setEvt||'change';
		options.type='password';
		jw.passwdInput.prototype.initialize.call(this,options);
		this._initComponent();
	},
	_initComponent:function(){
		_.bindAll(this,'setModel');
		// this.model.bind(this.name+':change');
		if(this.required){
			$(this.el).append('<div class="jw-form-required"></div>')
		}
		this.bind(this.setEvt,this.setModel);
	},
	_change:function(){
		jw.passwdInput.prototype._change.call(this)
	},
	setModel:function(){
		this.model.set(this.name,this.getText());
	}
});
/**
 * jw.Form.text
 */
jw.Form.textarea=jw.Textarea.extend({
	initialize:function(options){
		options=_.extend(options,{
			tip:options.tip,
			status:'normal',
			adaptHeightText:1,
			customborder:1,
			_default:this.model.get(options.name)?this.model.get(options.name):'',
			strictly:options.strictly
		});
		this.name=options.name;
		this.setEvt=options.setEvt||'change';
		jw.Textarea.prototype.initialize.call(this,options);
		this._initComponent();
		options.required && this.$el.closest('.jw-form-ic').append('<div class="jw-form-required"></div>');
	},
	_initComponent:function(){
		_.bindAll(this,'setModel');
		this.model.bind(this.name+':change');
		this.bind(this.setEvt,this.setModel);
	},
	setModel:function(){
		this.model.set(this.name,this.getText());
	}
});

/**
 * jw.Form.select
 * options.settype 需要 key||txt
 */
jw.Form.select=jw.Combobox.extend({
	initialize:function(options){
		options.dropdownparams=options.lists;
		delete options.lists;
		this.name=options.name;
		this.settype=options.settype||'txt';
		if(this.settype == 'txt'){
			var item = _.findWhere(options.dropdownparams.items,{txt:this.model.get(this.name)});
			if(item) options.dropdownparams._default = item.key;
			else{
				options.dropdownparams._default = options.dropdownparams._default||this.model.get(this.name)||'select';
				if(options.dropdownparams._default !='select' && options.dropdownparams._default!=this.model.get(this.name) ) 
					this.model.set(this.name,options.dropdownparams._default);
			} 
		}else{
			options.dropdownparams._default = (typeof this.model.get(this.name)=='undefined'?options.dropdownparams._default+'':this.model.get(this.name)+'');
		}
		jw.Combobox.prototype.initialize.call(this,options);
		this._initComponent();
	},
	_initComponent:function(){
		var self=this;
		this.bind('change',function(selkey){
			trace('this.name['+this.name+']['+selkey[self.settype]+']');
			var val = selkey[self.settype];
			if( val == 'select' || val == '请选择') val = '';
			self.model.set(this.name,val);
			// self.model.set(this.name,selkey.txt);
		});
	}
})
/**
 * jw.Form.checkbox
 */
jw.Form.checkbox=jw.checkbox.extend({
	initialize:function(options){
		this.name=options.name;
		options.list=options.lists.items;
		var defval=this.model.get(this.name)||options.lists._default;
		typeof defval=='string' && (defval=defval.split(','));
		options.defval=defval;
		// options.defval=(this.model.get(this.name)||options.lists._default).split(',');
		delete options.items;
		jw.checkbox.prototype.initialize.call(this,options);
		this._initComponent();
	},
	_initComponent:function(){
		var self=this;
		this.bind('change',function(selkey){
			trace(selkey);
			self.model.set(this.name,selkey);
		});
	}
});
/**
 * 单一的 jw.Form.checkbox
 * 如允许评论，不勾选，则不允许评论
 */
jw.Form.singleCheckbox=jw.checkbox.extend({
	initialize:function(options){
		this.name=options.name;
		options.list=options.lists.items;
		var defval = this.model.get(this.name) || options.lists._default;
		options.defval=[defval];
		delete options.items;
		jw.checkbox.prototype.initialize.call(this,options);
		this._initComponent();
	},
	_initComponent:function(){
		var self=this;
		this.bind('change',function(selkey){
			if(selkey.length==0) self.model.set(this.name,0);
			else self.model.set(this.name,1);
		});
	}
});
/**
 * jw.Form.radio
 */
jw.Form.radio=jw.radio.extend({
	initialize:function(options){
		this.name=options.name;
		options.list=options.lists.items;
		options.defval=this.model.get(this.name)||options.lists._default;
		$(this.el).addClass('radio-vertical');
		delete options.items;
		jw.radio.prototype.initialize.call(this,options);
		this._initComponent();
	},
	_initComponent:function(){
		var self=this;
		this.bind('change',function(selkey){
			self.model.set(this.name,selkey);
		})
	}
});



/**
 * jw.Form.logo
 * 上传Logo 表单组件
 */
jw.Form.logo=Backbone.View.extend({
	initialize:function(options){
		// trace(options.name);
		// this._options={
		// 	_default:'/public/images/group/def_b.png'
		// };
		// _.extend(this, _.pick(_.extend(this._options,options['lists']), ['name','_default']));
		this.name=options.name||'logo';
		// options.lists = {_default: "/public/images/avatar/extnetwork-logo-grey100.png"};
		// _.extend(this,options);
		this.imgType = options['imgType'];
		this.actionUrl = basurl+'/file/uplogo';
		if(options['action']) this.actionUrl = options["action"]
		if(options.model.get(this.name) != ''){
			this._default=options.model.get(this.name);
		}else{
			this._default=options._default;
		}
		this._initUploader();
	},
	_initUploader:function(){
		var self=this;
		_.bindAll(this,'_onSubmit','_onProgress','_onComplete','_onError');
		this._upload=new jw.uploader({
			element:this.el,
			uploadBtn:$(this.el).find('button')[0],
			action:this.actionUrl,
			multiple:false,
			allowFiletypes:['jpg','jpeg','png','bmp','gif'],
			onSubmit:this._onSubmit,
			onProgress:this._onProgress,
			onComplete:this._onComplete,
			onError:this._onError
		});
		this._img=$(this.el).find('img');
		this._default!='' && this._img.attr('src',this._default);
	},
	_onSubmit:function(id,file){
		var self=this;
		if(jw.UploadHandlerXhr.isSupported()){
			if(file.type.indexOf('image')>=0){
				if(typeof FileReader!=="undefined"){
					reader = new FileReader();
					reader.onload = function(evt) {
						self._img.attr('src',this.result);
					}
					reader.readAsDataURL(file);
				}
			}else{
				this._onUploadError();
			}
			// 添加进度条
			this.pgb=$('<div class="jw-form-logo-pgb"><div class="probar-w probar-w0"><div class="probar-c"></div><div class="probar-percent">0%</div></div></div>')
		}else{
			// 添加假进度条
			this.pgb=$('<div class="jw-form-logo-pgb"><img src="/public/images/loading.gif" /></div>');
		}

		$(this.el).append(this.pgb);
	},
	_onProgress:function(id,name,loaded,total){
		var percent=Math.ceil(loaded*100/total)+'%';
		this.pgb.find('.probar-c').css('width',percent);
		this.pgb.find('.probar-percent').html(percent);
	},
	_onComplete:function(id,name,response){
		this.pgb.remove();
		if(this.imgType){
			this._img.attr('src',response.append.resize.link);
			this.model.set(this.name,response.append.resize.link);
		}else{
		// if(!jw.UploadHandlerXhr.isSupported()){
			this._img.attr('src',response.append.thumbnails.link);
			// }
			this.model.set(this.name,response.append.thumbnails.link);
		}
		
	},
	_onError:function(err){
		trace(err);
	},
	changeImg:function(str){
		this._img.attr({src:str})
	}
});
jw.Form.logos = jw.Form.logo.extend({
        _onComplete:function(id,name,response){
            this.pgb.remove();
            if(this.imgType){
                this._img.attr('src',response.preview.url);
                this.model.set(this.name,response.preview.url);
            }else{
            // if(!jw.UploadHandlerXhr.isSupported()){
                this._img.attr('src',response.original.url);
                // }
                this.model.set(this.name,response.original.url);
            }
        }
    })



/**
 * jw.form.log(无html)
 * 上传LOGO组件
 *
 */
jw.Form.logo2 = jw.Form.logo.extend({
	initialize:function(options){
		this._initDOM();
		jw.Form.logo.prototype.initialize.call(this,options);
	},
	_initDOM:function(){
		var html = '<div class="jw-form-logo"><div class="jw-form-logo-c"><img src="/public/images/group/def_b.png" /></div></div>\
					<div class="jw-form-logo-bar">\
						<div class="jw-form-logo-h">请选择一张图片，用来标志外部网络</div>\
						<div class="jw-form-logo-desc">支持BMP、JPG、JPEG、PNG格式，建议200×200像素</div>\
						<div class="jw-form-logo-btnw"><div class="jw-form-logo-btnc"><button type="button" class="jw-btn3 jw-btn">上传图片</button></div></div>\
					</div>';
		$(this.el).html(html);
	}
});



/**
 * 日期组件
 * 年/月/日 格式为2013/03/08
 * 如果用户没有设置 可为 -1/-1/-1 (1980/-1/-1 合法)
 */
jw.Form.DateYMD=Backbone.View.extend({
	initialize:function(options){
		this.name=options.name;
		// 获取model中的日期
		this._getDate();
		// 初始化组件
		this._initDOM();
		_.bindAll(this,'onChange','_bineEvt');
		// 延时绑定
		_.delay(this._bineEvt, 1000);
	},
	_getDate:function(){
		var originDate=this.model.get(this.name);
		if(typeof originDate=='string'&&originDate.length>=8){
			originDate=originDate.split('/');
			trace(originDate)
			this._originDate={
				y:parseInt(originDate[0]),
				m:parseInt(originDate[1]),
				d:parseInt(originDate[2])
			};
		}else{
			this._originDate={y:-1,m:-1,d:-1};
		}
		this._Date=this._originDate;
		// trace(this._originDate);
	},
	_initDOM:function(){
		var self=this;
		$(this.el).append('<div class="YMD-w"><div class="YMD-yc"></div><label class="YMD-label">年</label></div>\
			<div class="YMD-w"><div class="YMD-mc"></div><label class="YMD-label">月</label></div>\
			<div class="YMD-w"><div class="YMD-dc"></div><label class="YMD-label">日</label></div>');
		// 初始化年
		trace(this._originDate);
		this._year=new jw.Combobox({
			el:$(self.el).find('.YMD-yc'),
			dropdownparams:{
				_default:this._originDate.y,
				items:[{key:-1,txt:'&nbsp;'}].concat( 
					_.chain(_.range(1950,2014)).map(function(num){return {key:num,txt:num};}).value()
				)
			}
		});
		this._month=new jw.Combobox({
			el:$(self.el).find('.YMD-mc'),
			dropdownparams:{
				_default:this._originDate.m,
				items:[{key:-1,txt:'&nbsp;'}].concat( this._getNums(12) )
			}
		});
		this._day=new jw.Combobox({
			el:$(self.el).find('.YMD-dc'),
			dropdownparams:{
				_default:this._originDate.d,
				items:[{key:-1,txt:'&nbsp;'}].concat( this._getNums(31) )
			}
		});
		// this._bineEvt();
	},
	_getNums:function( num ){
		return _.chain(_.range( 1, num+1 )).map( function(num){
			return {key:num,txt:num};
		}).value();
	},
	_bineEvt:function(){
		var self=this;
		this._year.bind('change',function(data){
			self._Date.y=self.getKey(data);
			self.onChange();
		});
		this._month.bind('change',function(data){
			self._Date.m=self.getKey(data);
			self.onChange();
		});
		this._day.bind('change',function(data){
			self._Date.d=self.getKey(data);
			self.onChange();
		});
	},
	// TODO 月份变化，日期应当联动
	_monthChange:function( month ){
		// 31天
		if( _.indexOf([1, 3, 5, 7, 8, 10, 12], month) >= 0 ){

		}else if( _.indexOf([4, 6, 9, 11], month ) >=0  ){

		}else{

		}
	},
	getKey:function(item){
		return item.key;
	},
	// 将月、日拼装成2位
	_formatNum:function(num){
		var str=num.toString();
		if(str.length==1) str='0'+str;
		return str;
	},
	onChange:function(){
		// trace(this._Date);
		var datestr=this._Date.y+'/'+this._formatNum(this._Date.m)+'/'+this._formatNum(this._Date.d);
		trace(this.name+'['+datestr+']');
		this.model.set(this.name,datestr);
	}
});
/**
 * 分享范围组件
 */
jw.Form.share=jw.ComplexShare.extend({
	initialize:function(options){
		var _action = options.action?options.action:'';
		this.name=options.name;
		options=options.model.get(this.name);
		if(_action!='') options.action = _action;
		jw.ComplexShare.prototype.initialize.call(this,options);
		var self = this;
		setTimeout(function(){
			self._initComponent();
		},10);
		// this._initComponent();
	},
	_initComponent:function(){
		var self=this;
		var origin_share = this.model.get(this.name);
		this.cursel = {
			share_scope:origin_share.share_scope,
			share_objs:origin_share.share_objs
		};
		// self.model.set(this.name,this.getShare());
		this.model.set(this.name,this.cursel);
		// trace('_initComponent 1',this.cursel,self.model.get(this.name));
		this.bind('change',function(data){
			// if(!data) return;
			// trace('_initComponent',data,this.getShare());
			self.model.set(this.name,this.getShare());
		});
	}
});
/**
 * 标签输入组件
 */
jw.Form.tag=jw.taginput.extend({
	initialize:function(options){
		this.name=options.name;
		var initdata=options.model.get(this.name);
		options={
			action:'tag',
			tip:'+ 添加标签',
			initdata:initdata
		};
		jw.taginput.prototype.initialize.call(this,options);
	},
	_bindEvt:function(){
		jw.BaseShare.prototype._bindEvt.call(this);
		var self=this;
		this.bind('change',function(data){
			self.model.set(this.name,this.getShare(1));
		});
	},
	resetAll:function(){
		var self = this;
		this.initdata = this.model.get(this.name);
		this.empty();
		_.each(this.initdata,function(item){
			self._selobjs && self._selobjs.create(item);
		})
	}
});
/**
 * 关键词输入组件
 */
jw.Form.keyword=jw.Form.tag.extend({
	initialize:function(options){
		this.name=options.name;
		var initdata=options.model.get(this.name);
		options={
			action:'tag',
			tip:'+ 添加关键词',
			initdata:initdata
		};
		jw.taginput.prototype.initialize.call(this,options);
	}
})
/*
 新建小名片，群组添加成员
*/
jw.groupmember_m = Backbone.Model.extend({
	url:'/as/',
	defaults:{
		status:0
	}
})
jw.groupmember_c = Backbone.Collection.extend({
	model:jw.groupmember_m
})
jw.groupmember_v = Backbone.View.extend({
	className:'member',
	events:{
		'click .member-t':'addSelect'
	},
	initialize:function(){
		var self = this;
		_.bindAll(this,'remove','addSelect','remove');
		this.model.bind('destroy',this.remove);
		this.model.bind('remove',this.remove)
		this.model.bind('change:status',function(){
			if(this.get('status')==1) $(self.el).addClass('select')
			else $(self.el).removeClass('select')
		})
	},
	render:function(){
		// ／／this.model.get('avatar')??????this.model.get('avatar').avatar
		// var avatar = this.model.get('avatar').avata_l?this.model.get('avatar').avata_l:this.model.get('avatar')
		// if(this.model.get('avatar').avata_l) avatar = this.model.get('avatar').avata_l
		// else avatar = this.model.get('avatar')
		var avatar = ''
		var admin_pichtml = ''
		if(this.model.get('grole')<2) admin_pichtml = '<div class="admin_pic"></div>';
		if(this.model.get('avatar').avatar_l){
			avatar = this.model.get('avatar').avatar_l
		}
		else avatar = this.model.get('avatar')
		$(this.el).html('<div class="member-t" title="'+this.model.get('name')+'"><div class="member-pic"><img class="pf-50" src="'+avatar+'"/>\
			</div><div class="member-name">\
			<div style="line-height:53px;width:75px;" class="ellipsis">'+this.model.get('name')+'</div></div>\
			'+admin_pichtml+'</div>');
		return this;
	},
	remove:function(){
		$(this.el).remove();
	},
	destroy:function(){
		this.model.destroy();
	},
	addSelect:function(){
		if(this.model.get('status')==0) this.model.set({status:1})
		else this.model.set({status:0})
		//this.model.set({status:!this.model.get('status')})
	}
})
jw.groupmemberController = Backbone.View.extend({
	events:{
		'click .member-remove':'remove'
	},
	initialize:function(options){
		var self = this;
		this.collection = new jw.groupmember_c
		// new jw.groupmember_c
		// new Backbone.Collection.extend({
		// 	model:jw.groupmember_m
		// });
		this.bindEvt();
		this.groupmemberbutton = $(this.el).find('.member-normal')
		this.selectnum = $(this.el).find('.member-num')
		this.container = $(this.el).find('.member-c')
		this.member_remove = $(this.el).find('.member-remove')
	},
	bindEvt:function(){
		var self=this;
		_.bindAll(this,"addOne",'collectionchange');
		this.collection.bind('add',this.addOne);
		this.collection.bind('all',this.collectionchange);
	},
	collectionchange:function(){
		var textcontent=[]
        _.each(this.collection.models,function(model){
        	textcontent.push(model)
        })
        var selectNum = 0
        _.each(this.collection.models,function(model){
        	if(model.get('status')==true) selectNum++
        })
        if(selectNum!=0) this.member_remove.addClass('select')
       	else this.member_remove.removeClass('select')
        this.selectnum.html('('+selectNum+')')
        textcontent = _.filter(textcontent,function(item){
        	return item.get('name')
        })
		this.trigger('change',textcontent);
	},
	addOne:function(groupmember){
        var view = new jw.groupmember_v({model:groupmember})
		$(view.render().el).insertAfter(this.container.find('.member-normal'))
	},
	remove:function(){
		var selmodels=_.filter(this.collection.models,function(model){
			return model.get('status')==true;
		});
		for(var i=selmodels.length-1;i>=0;i--){
				selmodels[i].destroy()
		}
		// for(var i=this.collection.models.length-1;i>=0;i--){
		// 	this.collection.models[i].get('status') && this.collection.models[i].destroy();
		// }
	},
	set:function(data){
		this.collection.add(data)
	}
})
jw.Form.editmember = Backbone.View.extend({
	events:{
		'click .add-member':function(event){
			event.stopPropagation()
		},
		'click .add-member-close':function(){
			this.member_add.addClass('hide')
			$(document).trigger('click')
		},
		'click .member-normal':'seachObject'
	},
	initialize:function(options){
		var self = this
		$(this.el).append('<div class="member-handle">\
		<div class="member-tip"></div>\
		<div class="member-title">已选</div><div class="member-num">(0)</div><div class="member-line"></div><div class="member-remove">删除</div>\
		</div><div class="member-c">\
			<div class="member-normal"><div class="member-add"></div><div class="member-name">添加成员</div></div></div><div class="add-member hide shadow">\
		<div class="add-member-close"></div>\
		<div class="add-member-c">\
			<div class="add-member-title">输入同事的姓名，回车即添加</div>\
			<div class="add-member-input"></div></div>\
		</div>');
		this.member_num = $(this.el).find('.member-num');
		this.member_close = $(this.el).find('.add-member-close');
		this.member_normal = $(this.el).find('.member-normal');
		this.member_add = $(this.el).find('.add-member');//名字
		this.member_add_show=new jw.SimpleCombo({
			inittype:1,
			btn:this.member_normal,
			el:this.member_add,
			posStyle:'custom'
		})
		this.groupmember = new jw.groupmemberController({
			el:$(this.el)
		});
		this.groupmember.bind('change',function(data){
			self.model.unset(self.options.name,{silent:true})
			self.model.set(self.options.name,data)
		})
		if(options.model.get(options.name) && options.model.get(options.name) !=""){
			this.groupmember.set(options.model.get(options.name))
		}
	},
	seachObject:function(){
		var self = this;
		if(!this.seachObjects){
			this.seachObjects = new jw.SearchUser({
				el:$(this.el).find('.add-member-input'),
				tip:'',
				style:0,
				shadow:1,
				posfix:0,	// 使用position:fixed定位
				action:'users'
			});
			this.seachObjects.bind('select',function(data){
				self.groupmember.set(data)
				self.seachObjects._inputw.setTxt('');
			})
		}
		this.seachObjects._inputw.setFocus()
	},
	addUser:function(user){
		this.groupmember.set(user)
	}
})
/**
 * 单个联系方式表单基础组件
 * { contact:{id:'',type:'',val:''} }
 */
jw.Form.contact=Backbone.View.extend({
	initialize:function(options){
		_.bindAll(this,'setModel');
		this.name=options.name;
		this.contact=this.model.get(this.name);
		this.contactmodel=new jw.Form.M_Contact(this.contact);
		var view = new jw.Form.contactV({model:this.contactmodel});
		$(this.el).append(view.render().el);
		this.contactmodel.bind('change',this.setModel)
	},
	setModel:function(){
		this.model.set(this.name,this.contactmodel.toJSON());
		// trace(this.model.toJSON());
	}
});

/**
 * 联系方式表单基础组件，一次编辑一组联系方式
 * 不包含“添加一条”按钮
 */
jw.Form.contacts=Backbone.View.extend({
	initialize:function(options){
		this.name=options.name;
		this.contacts=this.model.get(this.name);
		trace(this.contacts);
		_.bindAll(this,'addOne','setModel');
		this.collection=new Backbone.Collection();
		this.collection.bind('add',this.addOne);
		this.collection.bind('change',this.setModel);
		this.collection.add(_.map(this.contacts,function(val,key){return {type:key,val:val};}));
	},
	addOne:function(model){
		var view = new jw.Form.contactV({model:model});
		$(this.el).append(view.render().el);
	},
	addAll:function(){
		this.collection.each(this.addOne);
	},
	setModel:function(){
		this.model.set(this.name,this.collection.toJSON());
	}
})
/**
 * 联系方式表单基础组件，一次编辑一组联系方式
 * 包含“添加一条”按钮
 */
jw.Form.complexcontacts=jw.Form.contacts.extend({
	initialize:function(options){
		_.bindAll(this,'addNew');
		this._initDOM();
		jw.Form.contacts.prototype.initialize.call(this,options);
	},
	_initDOM:function(){
		this.container=$(this.el);
		this.container.append('<div class="jw-form-contact-c"></div><div class="jw-form-contact-bar"><a class="jw-a" href="javascript:;">继续添加</a></div>');
		this.el=this.container.find('.jw-form-contact-c');
		this.container.find('.jw-form-contact-bar .jw-a').click(this.addNew);
	},
	addNew:function(){
		this.collection.add(new jw.Form.M_Contact);
	}
})
/**
 * 联系方式 model
 */
jw.Form.M_Contact=Backbone.Model.extend({
	defaults:{type:'tel',val:''}
})
/**
 * 联系方式组件(非表单组件) SmallView
 * 联系方式字典 jw.dicts.contact
 * 联系方式分类 jw.ContactClasses
 * 输入参数
 * 		model.type 联系方式分类 只要最细节即可
 * 		model.val 联系方式值
 */
jw.Form.contactV=Backbone.View.extend({
	className:"jw-form-contact",
	initialize:function(options){
		if(!jw.dicts.contact||!jw.ContactClasses) throw '联系方式类型未能初始化';		
		_.bindAll(this,'ChangeType','ChangeSubType');
		// 二级分类数组（所有在二级分类中的项单独拼装一个数组）
		this.secondlev=_(jw.ContactClasses).chain().map(function(item){return item.sub;}).flatten().value();
		var self=this;
		// 一级分类数组
		this.firstlev=_(jw.dicts.contact).chain().map(function(val,key){if($.inArray(key,self.secondlev)<0) return {key:key,txt:val}}).filter(function(item){return item}).value();
		this.firstlev=this.firstlev.concat(_(jw.ContactClasses).map(function(item,key){return {key:key,txt:item.name,sub:true};}));
		// this._initDOM();
	},
	render:function(){
		this._initDOM();
		return this;
	},
	_getLev1:function(subtype){
		var levkey='';
		_.each(jw.ContactClasses,function(items,key){
			if($.inArray(subtype,items.sub)>=0) levkey=key;
		})
		return levkey;
	},
	_initDOM:function(){
		// 1. 生成一级下拉列表
		$(this.el).append('<div class="jw-form-contact"><div class="jw-form-contact-l"></div><div class="jw-form-contact-r"><div class="jw-form-contact-t"></div></div></div>');
		this._container=$(this.el).find('.jw-form-contact-r');
		// 初始化一级分类
		var firstlev_type=$.inArray(this.model.get('type'),this.secondlev)>=0?this._getLev1(this.model.get('type')):this.model.get('type');
		this._type=new jw.Combobox({
			el:$(this.el).find('.jw-form-contact-l'),
			dropdownparams:{
				_default:firstlev_type,
				items:this.firstlev
			}
		});
		this._initInput();
		this._type.bind('change',this.ChangeType)
	},
	// 只有一个输入框
	_initInput:function(){
		this._input = new jw.input({
			el:this._container.find('.jw-form-contact-t'),
			shadow:1,
			_default:this.model.get('val')
		});
		var self=this;
		this._input.bind('change',function(str){
			self.model.set({val:str})
		});
	},
	// 包含一个下拉列表栏的输入项目 items 数组列表 _val 当前值
	_initComplexInput:function(items,_val){
		this._container.addClass('hassub');
		this._container.prepend('<div class="jw-form-contact-sub"></div>');
		// 初始化下拉列表栏
		if(!this._subtype){
			this._subtype=new jw.Combobox({
				el:$(this.el).find('.jw-form-contact-sub'),
				dropdownparams:{
					_default:_val,
					items:items //_.map(jw.dicts.contact,function(item){return {key:item.key,txt:item.name,sub:item.sub};})
				}
			});
			this._subtype.bind('change',this.ChangeSubType);
		}else{
			this._subtype.reset({items:items,_default:_val});
		}
		
	},
	// 一级分类修改
	ChangeType:function(item){
		// 有二级分类
		if(item.sub){
			this._initComplexInput(_.map(jw.ContactClasses[item.key].sub,function(key){return {key:key,txt:jw.dicts.contact[key]}}),this.model.get('type'));
		}else{
			if(this._subtype){
				this._container.removeClass('hassub').find('.jw-form-contact-sub').remove();
				delete this._subtype;
			}
			this.model.set({type:item.key})
		}
		// this._input.setFocus();
	},
	ChangeSubType:function(item){
		this._input.setFocus();
		this.model.set({type:item.key})
	}
});

/**
 * 输入起止时间表单组件
 * model={s:'2010/01/01',e:'2012/01/01'}
 * 当结束日期设置为当前，e='0';
 */
jw.Form.SEDate=Backbone.View.extend({
	initialize:function(options){
		this.endtip=['结束 年/月','直到现在'];
		this.name=options.name;
		this.sedate=_.clone(this.model.get(this.name));
		if(!this.sedate) this.sedate={s:'',e:''};
		_.bindAll(this,'untilNow','setModel');
		this._initDOM();
	},
	_initDOM:function(){
		$(this.el).append('<div class="jw-sedate jw-sedate-s"></div><div class="jw-sedate-sep">-</div><div class="jw-sedate jw-sedate-e"></div><div class="jw-sedate-chk"></div>');
		this._startdatew=$(this.el).find('.jw-sedate-s');
		this._enddatew=$(this.el).find('.jw-sedate-e');
		this._chkw=$(this.el).find('.jw-sedate-chk');
		this._startdate=new jw.input({
			el:this._startdatew,
			shadow:1,
			tip:'开始 年/月',
			_default:this.sedate.s
		});
		this._enddate=new jw.input({
			el:this._enddatew,
			shadow:1,
			tip:this.sedate.e.length<1?this.endtip[1]:this.endtip[0],
			_default:this.sedate.e=='0'?'':this.sedate.e
		});
		this.untilStyle(this.sedate.s, this.sedate.e);

		this._chk=new jw.checkbox({
			el:this._chkw,
			defval:this.sedate.e.length<1&&this.sedate.s.length>0?['until']:[],
			list:[{key:'until',val:'当前'}]
		});
		this._chk.bind('change',this.untilNow);
		this._startdate.bind('change',this.setModel);
		this._enddate.bind('change',this.setModel);
	},
	untilStyle: function(s1, s2){
		if(s2.length<1&&s1.length>0){
			this._enddate.setTxt('').setStatus('disabled').setTip(this.endtip[1]);
		}else{
			this._enddate.setStatus('normal').setTip(this.endtip[0]);
		}	
	},
	untilNow:function(item){
		// 选中了直到现在
		if(item.length==1){
			this._enddate.setTxt('').setStatus('disabled').setTip(this.endtip[1]);
		}else{
			this._enddate.setStatus('normal').setTip(this.endtip[0]);
		}
		this.setModel();
	},
	setModel:function(){
		this.sedate.s=$.trim(this._startdate.getText());
		this.sedate.e=this._enddate.isEnable()?$.trim(this._enddate.getText()):'0';
		this.model.set(this.name,this.sedate);
	}
});
/**
 * 起止时间设置组件
 * 用于日程的编辑
 * model={s:1364260849,e:1364440533}
 * 当结束日期设置为当前，e='0';
 */
jw.Form.SEDatetime=Backbone.View.extend({
	initialize:function(options){
		this.name=options.name;
		this._initDOM();
		this._bindEvt();
		
	},
	_initDOM:function(){
		$(this.el).append('<div class="jw-setime jw-setime-s"></div><span class="jw-setime-sep">-</span><div class="jw-setime jw-setime-e"></div><div class="jw-setime-allday"></div>');
		this._starttime=new jw.SelDatetime({
			el:this.$('.jw-setime-s'),
			_default:this.model.get('setime').s
		});
		this._endtime=new jw.SelDatetime({
			el:this.$('.jw-setime-e'),
			_default:this.model.get('setime').e
		});
		this._allday=new jw.checkbox({
			el:this.$('.jw-setime-allday'),
			defval:this.model.get('setime').allday==1?['allday']:[],
			list:[{key:'allday',val:'全天'}]
		});
		// this.model.get('setime').allday==1 && this._endtime.setStatus('disabled');
		this.model.get('setime').allday==1 && this.allday();
	},
	_bindEvt:function(){
		var self=this;
		this._allday.bind('change',function(d){
			if(d.length==1) self.allday();
			else self.SESchedule();
			self.setModel();
		});
		this._starttime.bind('change',function(t){


			if( self._starttime.gettime()>self._endtime.gettime() ){
				self._endtime.settime( self._starttime.gettime()+(self.model.get('setime').e-self.model.get('setime').s) );
			}
			self.setModel();

			// if(!_.isNumber(t)) return;
			// if(t>self._endtime.gettime())
			// 	self._endtime.settime(t+(self.model.get('setime').e-self.model.get('setime').s));
			// self.setModel();
		});
		this._endtime.bind('change',function(t){
			if( self._starttime.gettime()>self._endtime.gettime() ){
				self._starttime.settime(self._endtime.gettime()-(self.model.get('setime').e-self.model.get('setime').s) + self.model.get('setime').e%86400);
			}
			// trace('starttime',self._starttime.gettime());
			// trace('endtime',self._endtime.gettime());return;
			self.setModel();

			// if(!_.isNumber(t)) return;
			// if(t<self._starttime.gettime()) 
			// 	self._starttime.settime(t-(self.model.get('setime').e-self.model.get('setime').s));
			// self.setModel();
		});
	},
	setModel:function(){
		var time = {
			s:this._starttime.gettime(), 
			e:this._endtime.gettime(),
			allday:this._allday.getValue().length==0?0:1
		};
		this.model.set(this.name, time);
	},
	// 全天事件
	allday:function(){
		$(this.el).addClass('jw-setime-alldayw');
	},
	// 非全天
	SESchedule:function(){
		$(this.el).removeClass('jw-setime-alldayw');
		// 设置截止时间为开始时间+1小时
		var self=this;
		setTimeout(function(){
			self._endtime.settime(self._starttime.gettime()+3600);
		},0)
		// this._endtime.settime(this._starttime.gettime()+3600);
	}
});
/**
 * 起止时间设置组件
 * 单日期组件
 * model={s:1364260849,e:1364440533,now:1}
 * 当结束日期设置为当前，e='0';now:1,是否至今
 * 参考：/css/cal/demo.html
 */
jw.Form.SEDatetimes=Backbone.View.extend({
		initialize:function(options){
			this.name=options.name;
			this._initDOM();
			this._bindEvt();
		},
		_initDOM:function(){
			$(this.el).append('<div class="jw-setime jw-setime-s"></div><span class="jw-setime-sep">-</span><div class="jw-setime jw-setime-e"></div><div class="jw-setime-allday"></div>');
			this._starttime=new jw.SelDate({
				el:this.$('.jw-setime-s'),
				_default:this.model.get('stime'),
				stop_evt:1
			});
			this._endtime=new jw.SelDate({
				el:this.$('.jw-setime-e'),
				_default:this.model.get('etime'),
				stop_evt:1
			});
			this._allday=new jw.checkbox({
				el:this.$('.jw-setime-allday'),
				defval:this.model.get('now')==1?['now']:[],
				list:[{key:'now',val:'至今'}]
			});
			if(this.model.get('now')==1) this._endtime.setTxt('至今').setStatus("disabled");
		},
		_bindEvt:function(){
			var self=this;
			this._allday.bind('change',function(d){
				if(d&&d.length!=0){
					self._endtime.setTxt('至今').setStatus("disabled");
					self.model.set({etime:jw.systime})
				}else{
					self._endtime.setStatus("normal").setTxt(new Date((self.model.get('stime')+864000)*1000).FormatTime('yyyy-MM-dd'),{silent:true})
				}
				self.model.set({now:d.length==0?0:1})
			});
			this._starttime.bind('change',function(t){
				t = jw.timestamp(t)
				if(t>self.model.get("etime")){
					self.model.set({etime:(self.model.get('etime')+(self.model.get('etime')-self.model.get('stime')))})
					self._endtime.setTxt(new Date((self.model.get('etime')+(self.model.get('etime')-self.model.get('stime')))*1000).FormatTime('yyyy-MM-dd'),{silent:true})
				}
				self.model.set({stime:t})
			});
			this._endtime.bind('change',function(t){
				t = jw.timestamp(t)
				if(t<self.model.get("stime")){
					self.model.set({stime:(self.model.get('etime')-(self.model.get('stime')-self.model.get('etime')))})
					self._starttime.setTxt(new Date((self.model.get('etime')-(self.model.get('stime')-self.model.get('etime')))*1000).FormatTime('yyyy-MM-dd'),{silent:true})
				}
				self.model.set({etime:t})
			});
		},
		setStatus:function(str){
			if(str=='disabled'){
				this._starttime.setStatus('disabled');
				this._allday.setStatus('disabled')
				this._endtime.setStatus('disabled');
			}else{
				if(this.model.get("now")==0){
					this._endtime.setStatus('normal');
				}
				this._allday.setStatus(false)
				this._starttime.setStatus('normal');
			}
		}
	});
/**
 * 一天选择时间组件
 * 用于报工选择起止时间
 */
jw.Form.OnedayDatetime=Backbone.View.extend({
	initialize:function(options){
		_.bindAll(this,'endChange');
		this.name=options.name;
		this.setDayStamp(this.model.get('setime').s);
		// 将截止时间生成为时间戳
		this._endtimestamp=(new Date(this.model.get('setime').e*1000)).TimeToStamp();
		this.tmp = this._endtimestamp;
		this._diff=this.model.get('setime').e-this.model.get('setime').s;
		this._initDOM();
		this._bindEvt();
		this.endChange({key: this.tmp});
	},
	setDayStamp:function(t){
		t=new Date(t*1000);
		t=new Date(t.FormatTime('yyyy'),(t.FormatTime('M')-1),t.FormatTime('d'));
		this._daystamp=t.getTime()/1000;
	},
	_initDOM:function(){
		$(this.el).append('<div class="jw-setime jw-setime-s"></div><span class="jw-setime-sep">-</span><div class="jw-setime jw-setime-e"></div>');
		this._starttime=new jw.SelDatetime({
			el:this.$('.jw-setime-s'),
			_default:this.model.get('setime').s
		});
		this._endtime=new jw.stdCombobox({
			el:this.$('.jw-setime-e'),
			dropdownparams:{
				items:jw.combineTimeArray(),
				_default:this._endtimestamp*1
			}
		});
		this._endtime.bind('change',this.endChange);
	},
	_bindEvt:function(){
		var self=this;
		this._starttime.bind('change',function(t){
			trace(t);
			if(!_.isNumber(t)) return;
			// 更新 _daystamp
			self.setDayStamp(t);
			if(t>self._endtimestamp){
				// self._endtimestamp=t+self._diff;
				self._endtimestamp=t;
				self._endtime.select((new Date(self._endtimestamp*1000)).TimeToStamp());
			}
			self.setModel();
		});
	},
	setModel:function(){
		// this.model.set(this.name,{s:this._starttime.gettime(),e:this._endtimestamp});
		this.model.set(this.name,{s:this._starttime.gettime(),e:this._endtimestamp});
	},
	getVal:function(){
		return {s:this._starttime.gettime(),e:this._endtimestamp};
	},
	endChange:function(item){
		this._endtimestamp=this._daystamp+item.key;
		if(this._endtimestamp<this._starttime.gettime()){
			this._starttime.settime(this._endtimestamp);
		}
		this.setModel();
	}
});

/**
 * 分享范围表单
 */
jw.Form.shareusers=jw.BaseShare.extend({
	initialize:function(options){
		_.extend(this,options)
		this.type = 1
		this.name=options.name;
		this.issingle=options.issingle||false;
		this.email=options.email||false;
		jw.BaseShare.prototype.initialize.call(this,{
			action:options.action||'users',
			tip:options.tip||'+ 添加对象',
			initdata:options.model.get(this.name),
			disabled:options.disabled?options.disabled:false,
			email:options.email?true:false
		});
		options.required && $(this.el).closest('.jw-form-ic').append('<div class="jw-form-required"></div>');
	},
	_initDefaults:function(){
		jw.BaseShare.prototype._initDefaults.call(this);
		if(this.issingle&&this.initdata.length>0) this._addSharew.addClass('hide');
	},
	_bindEvt:function(){
		var self=this;
		jw.BaseShare.prototype._bindEvt.call(this);
		this.bind('change',function(data){
			// trace(this.getShare(1));
			self.model.set(this.name,this.getShare(1));
			if(self.issingle){
				if(this.getShare(1).length==0){
					self._addSharew.removeClass('hide');
					self.type = 1
				}else{
					self._addSharew.addClass('hide');
					self.type = 0 ;
				}
			}
		});
	},
	addSelObj:function( selitem ){
		if(!selitem) return 
		this._selobjs.create(selitem);
		if(this.type==0) return
		else{
			this._input._input.val('').focus();
		}
		this.close();
	}
});
/**
 * 去重分享范围表单3
 */
jw.Form.uniq_shareusers = jw.Form.shareusers.extend({
	addSelObj:function(selitem){
		if(!selitem) return 
		if(!this._filter(selitem)) return false
		else{
			this._selobjs.create(selitem);
			this._input._input.val('').focus();
			this.close();
		}
	}
})
/**
 * 分享范围表单元素，指定范围（如项目成员）
 * options app_type/app_id
 */
jw.Form.ShareUsersScope = jw.Form.shareusers.extend({
	initialize:function(options){
		this.name=options.name;
		this.issingle=options.issingle||false;
		jw.BaseShare.prototype.initialize.call(this,{
			action:'scopeusers',
			app:{ app_type: options.app.app_type, app_id: options.app.app_id },
			tip:options.tip||'+ 添加对象',
			initdata:options.model.get(this.name)
		});
		options.required && $(this.el).closest('.jw-form-ic').append('<div class="jw-form-required"></div>');
	}
});
/**
 * 分享给对象
 */
jw.Form.shareobjs=jw.Form.shareusers.extend({
	initialize:function(options){
		this.name=options.name;
		jw.BaseShare.prototype.initialize.call(this,{
			action:'relationobj',
			tip:options.tip||'+ 添加对象',
			initdata:options.model.get(this.name)
		});
	}
});
/**
 * 选择日期组件
 * options.istyle:0 无icon版本，1 有icon版本
 */
jw.Form.seldate=jw.SelDate.extend({
	initialize:function(options){
		this.name=options.name;
		this.form=options.form
		trace($(this.el).addClass('jw-seldate'))
		jw.SelDate.prototype.initialize.call(this,{
			_default:options.model.get(this.name),
			status:options.status
		});
		if(options.style){
			$(this.el).addClass('jw-seldate-hasicon').find('.input-w').prepend('<span class="jw-seldate-i"></span>');
		}
		this._initEvt();
	},
	_initEvt:function(){
		var self=this;
		this.bind('change',function(str){
			self.model.set(self.name,jw.timestamp(str));
		})
	},
	update:function(seldate,options){
		if(typeof seldate=='number'){
			// PHP 时间戳格式，如 1364260849
			seldate=(new Date(seldate*1000)).toObject();
			seldate.m+=1;
		}else if(typeof seldate=='string'){
			// 格式 2013-03-26
			seldate=seldate.ToCDB();
			seldate=seldate.split('-');
			seldate={ y:seldate[0],m:seldate[1],d:seldate[2] };
		}
		if(seldate.m.toString().length==1) seldate.m='0'+seldate.m;
		if(seldate.d.toString().length==1) seldate.d='0'+seldate.d;
		this.setTxt(seldate.y+'-'+seldate.m+'-'+seldate.d,options);
	}
})
jw.Form.seldates = jw.Form.seldate.extend({
})
/**
 * collection form
 * options
 *		collection 实例化后的collection
 *		model 对象类型
 */
jw.FormCollection=Backbone.View.extend({
	events:{
		// 'click .remove-btn':'remove'
	},
	initialize:function(options){
		this.FormItems=options.FormItems;
		_.bindAll(this,'addAll','addOne','change','_initOpbar');
		this.collection.bind('reset',this.addAll);
		this.collection.bind('change destroy',this.change);
		this.collection.bind('add',this.addOne);
		this.collection.length==0 && this.collection.fetch();
		// this._initOpbar();
	},
	_initOpbar:function(){
		$(this.el).append('<div class="jw-form-cls"></div><div class="jw-form-bar"><button type="button" disabled class="jw-btn2 jw-btn jw-form-cmtbtn">保存</button><button type="button" class="jw-btn4 jw-btn jw-form-cancelbtn">取消</button></div>');
		this._opbar=$(this.el).find('.jw-form-bar');
		this._submitbtn=this._opbar.find('.jw-form-cmtbtn');
		this._submitbtn.click($.proxy(this.submit,this));
		this._btn = $(this.el).find(".jw-form-cmtbtn")
	},
	addOne:function(model){
		// 初始化model对应的view
		var view = new jw.FormCollectionSV({
			model:model,
			collection:this.collection,
			FormItems:this.FormItems
		});
		// this._opbar.before(view.render().el);
		$(this.el).find('.jw-form-cls').append(view.render().el);
	},
	addAll:function(){
		if(!this._opbar) this._initOpbar();
		this.collection.each(this.addOne);
	},
	change:function(model){
		this._submitbtn.removeAttr('disabled');
	},
	submit:function(){
		this.trigger('submit');
	},
	_set_dis:function(){
		this._btn.attr('disabled',1).html(this.btnVal+'中....');
	},
	_rep_dis:function(){
		$(this.el).find(".jw-form-cmtbtn").removeAttr('disabled').html(this.btnVal)
	}
});
/**
 * FormCollectionSV - form collection small view
 * 输入参数
 * 	model
 *  style
 * 	FormItems
 */
jw.FormCollectionSV=jw.FormBase.extend({
	className:'jw-form-cl-item',
	events:{
		'click .jw-form-cl-removebtn':'destroy'
	},
	initialize:function(options){
		this.originFormItems=options.FormItems;
		_.bindAll(this,'combineForm','combineOneItem','destroy','remove');
		this.FormItems=_.flatten(this.originFormItems);
		this.model.bind('destroy', this.remove);
	},
	combineForm:function(items){
		var self=this;
		return _(items).chain()
			.map(function(item){
				if(_.isArray(item)) return '<div class="jw-form-items jw-form-items-'+item.length+' equally">'+self.combineForm(item).join('')+'</div>';
				else return self.combineOneItem(item);
			})
			.value();
	},
	combineOneItem:function(item){
		var nolab=item.label==''?' jw-form-nolab':'',
			style=item.style?' style="'+item.style+'"':'';
		return '<div class="jw-form-item" name="'+item.name+'"'+style+'><div class="jw-form-item-c'+nolab+'"><label class="jw-form-lab">'+item.label+'</label><div class="jw-form-ic"></div></div></div>';
	},
	render:function(){
		$(this.el).html(this.combineForm(this.originFormItems));
		$(this.el).append('<div class="jw-form-cl-removebtn"></div>');
		this._initItems();
		return this;
	},
	// 移除单个表单
	destroy:function(){
		if(this.collection.length==1){
			new jw.Alert({content:'不可删除最后一个表单项'});
			return;
		}
		this.model.destroy();
	},
	remove:function() {
		$(this.el).remove();
	}
});
/**
 * 自动补空表单的集合表单
 */
jw.AutoFormCollection=jw.FormCollection.extend({
	initialize:function(options){
		_.bindAll(this,'addNew');
		// 用于比对
		jw.FormCollection.prototype.initialize.call(this,options);
		this.formitems=_.flatten(this.FormItems);
	},
	addAll:function(){
		jw.FormCollection.prototype.addAll.call(this);
		if(this.collection.length==0) this.addNew();
	},
	change:function(model){
		jw.FormCollection.prototype.change.call(this,model);
		// 如果model 是最后一个，则新建一个
		// trace('change len['+this.collection.length+'] ['+JSON.stringify(this.collection.model.defaults)+']');
		if(model.cid&&model.cid==this.collection.at(this.collection.length-1).cid){
			var checkpass=true;
			_.each(this.formitems,function(item){
				if(item.required){
					// checkpass
					trace(typeof model.get(item.name));
					if(typeof model.get(item.name)=='string'&&model.get(item.name)==''){
						checkpass=false;
						return false;
					} 
				}
			});
			if(!checkpass) return;
			// trace(_(this.FormItems).filter(function(item){
			// 	trace(item)
			// 	return item.required;
			// }));
			// 
			// var self=this,checkpass=true;
			// _(this.FormItems).chain().filter(function(item){
			// 	return item.required;
			// }).each(function(item){
			// 	trace(model.get(item.name));
			// });
			this.addNew();
		}
	},
	addNew:function(){
		this.collection.add();
	}
})
}(jQuery));
