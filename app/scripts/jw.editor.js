var testRng = false;
window.jm_last_updatetime = 0;
var isIE = (!+[1,]) || (window.ScriptEngineMinorVersion&&!window.ScriptEngineMinorVersion());
var firstComment = 0;
if(navigator.product=='Gecko') isIE = false;

jw.scrollTo = function($c, $el){
	var of = $el.offset();
	var p = $c.parent();
	var pof=p.offset();
	var st = p.scrollTop();
	p.scrollTop( of.top-pof.top+st-p.height()/3*1 );
};

jw.editor = Backbone.View.extend({
	initialize: function(options){
		this.$el.css({position: 'relative'});
		this.options = options;
		if(this.options.adaptHeight==window.undefined) this.options.adaptHeight = -1;
		// this.model.on('change:'+this.options.editKey, this.changeContent, this);
		this.render();
	},
	changeContent: function(){
		this.wysiwyg.document.body.innerHTML = this.model.get(this.options.editKey);
	},
	fresh: function(){
		this.model.set(this.options.editKey, this.wysiwyg.document.body.innerHTML );
	},
	render: function(){
		var rnd = Math.floor(Math.random()*10000);
		this.appid = this.options.appid||'';
		this.$el.html('<div class="upload_masker"><span>将文件、图片拖到此处即可添加附件</span></div><div class="editor_toolbar"></div><div class="editor_content"><iframe id="ifm_'+rnd+'" style="width:100%;height:100%;border:0px;padding:0;outline:0;overflow:hidden;" frameborder="no"></iframe></div><div class="jm_new_attachments"></div>');
		this.editor  = this.$el.find('#ifm_'+rnd)[0];
		this.wysiwyg = this.editor.contentWindow;
		this.wysiwyg.document.designMode = 'on';
     	this.wysiwyg.document.contentEditable = 'true';
     	var str = '.reply_content_tip{font-size: 13px; color: #808080; } .reply_content_tip strong{color: #4174d9; text-decoration: underline; }\
.reply_content_source{padding: 10px 0px 10px 10px; border-left: 1px solid #b0b0b0; margin: 5px 0px 0px; }\
.reply_content_showmore{margin: 5px 0 12px; -webkit-user-select:none; -moz-user-select:none;}\
.reply_content_showmore i{display: block; width: 30px; height: 20px; background: url('+SrcFolder+'/public/images/icons_mail.png) -99px -57px no-repeat; cursor: pointer;}\
.reply_content_showmore i:hover{background-position: -99px -37px;}\
'+ (window.getSelection?'html{overflow:hidden;} body{height:100%;}':'') +'\
::-webkit-scrollbar{width:8px;-webkit-border-radius:15px;} \
::-webkit-scrollbar-thumb{background-color:rgba(0, 0, 0, 0.2);-webkit-border-radius:15px;} \
body{'+(window.getSelection?'overflow-x:hidden;overflow-y:auto;':'')+'font-size:14px; margin:10px; margin-right:0; font-family:arial;word-break:break-all;}\
body:hover::-webkit-scrollbar-thumb{background-color:rgba(0, 0, 0, 0.5);}\
.tmp{max-width:100%;}';

		if(this.options['styles']) str+= this.options['styles'];

		console.log(str)

		this.wysiwyg.document.open();
		this.wysiwyg.document.writeln('<html><style>'+str+'</style><script src="'+SrcFolder+'/public/scripts/jquery.js"></script><body id="editContent" contenteditable="true" designMode="on" spellcheck="false">'+this.model.get(this.options.editKey)+'</body></html>');
		this.wysiwyg.document.close();
		var that = this;

		this.heightTimer = false;

		var keyupTimer = false;
		$(this.wysiwyg.document).bind('keydown', function(evt){
			evt.stopPropagation();
			if(evt.ctrlKey && evt.keyCode==13){
				that.model.set(that.options.editKey, that.wysiwyg.document.body.innerHTML );
				that.model.trigger('edit_'+that.options.editKey);
				return false;
			}
			if(evt.keyCode==13) that.wysiwyg.document.execCommand('formatBlock', false,'<div>');
		}).bind('keyup', function(){
			if(keyupTimer) clearTimeout(keyupTimer);
			keyupTimer = setTimeout(function(){
				that.model.set(that.options.editKey, that.wysiwyg.document.body.innerHTML);
			}, 100);
			// if(that.options.adaptHeight>0){
				// if(that.heightTimer) clearTimeout( that.heightTimer );
				// that.heightTimer = setTimeout(function(){

				// }, 200);
				// console.log( $(that.wysiwyg.document.body).height() )
			// }
		}).bind('click', function(){
			$(that.wysiwyg.document).find('#defaultValue').remove();
			// that.focus();
		}).one('keydown', function(){
			$(that.wysiwyg.document).find('#defaultValue').remove();
		});

		setTimeout(function(){
			that.focus();
		}, 100);

		this.editorMenu = new jw.editor.menu({toolbar: this.options.toolbar, el: this.$el.find('.editor_toolbar'), model: this.model, editorView: this, editor: this.editor, attachmentsEl: this.$el.find('.jm_new_attachments'), 
			attachOnAdd: function(d){
				var atts = that.model.get('attaches_list');
				if(d!=null){
					_.uniq(atts, function(item){
						return item.id;
					});
					atts.push(d);
				}
				that.$el.find('.jm_new_attachments').show();
				that.model.set('attaches_list', atts);
				that.$el.find('.editor_content').css({top: 34, bottom: that.getAttachHeight()});
			},
			attachOnRemove: function(d){
				var atts = that.model.get('attaches_list');
				atts = _.filter(atts, function(item){ return item.id!=d; });
				if(atts.length<1){
					that.$el.find('.jm_new_attachments').hide();
					that.$el.find('.editor_content').css({top: 34, bottom: 0});
				}
				that.model.set('attaches_list', atts);
			}
		, uploadAction: this.options.uploadAction || basurl+'/file/upload', apptype:this.options.apptype, pasteReg: this.options.pasteReg});
		this.$el.find('.editor_content').css({top: 34, bottom: 0});
		return this;
	},
	events: {
		'click .zoom_editor': 'zoom'
	},
	zoom: function(e){
		this.trigger('editor_zoom');
	},
	getToolbarHeight: function(){
		return this.$el.find('.editor_toolbar').outerHeight();
	},
	getAttachHeight: function(){
		return this.$el.find('.jm_new_attachments').outerHeight();
	},
	focus: function(){
		var that = this;
		if(!that.wysiwyg.getSelection){
			setTimeout(function(){
				var rng = that.wysiwyg.document.body.createTextRange();
				try{
					rng.moveToPoint(0, 0);
					rng.select();
				}catch(e){}
			}, 100);
		}else{
			if(!this.wysiwyg.document.body) return;
			$(this.wysiwyg.document.body).focus();
			var sel = this.wysiwyg.getSelection();
			if(sel&&sel.getRangeAt && sel.rangeCount){
				var position = sel.getRangeAt(0).startContainer.nodeName=='#text'?sel.getRangeAt(0).startContainer.length:0;
				sel.collapse( sel.getRangeAt(0).startContainer, position);
			}
		}
	},
	update: function(d){
		if(d=='') d='<br>';
		if(this.wysiwyg.document.body){
			this.wysiwyg.document.body.innerHTML = d;
			this.model.set(this.options.editKey, d );
		}
	}
});
jw.editor.menu = Backbone.View.extend({
	initialize: function(options){
		var that = this;
		this.options = options;
		if(this.options.apptype=='jw_n_subscribe'){
			this.options.uploadAction = basurl+'/file/upcustomsize?w=640';
		}
		this.fontList = ['宋体','黑体','隶书','楷体','幼圆','微软雅黑',
				'Arial', 'Comic Sans MS', 'Courier New', 'Geneva', 'Georgia',
				'Helvetica', 'Impact', 'Lucida Grande', 'Marker Felt', 'Monaco', 'Palatino',
				'Papyrus', 'Tahoma', 'Times', 'Times New Roman', 'Trebuchet MS', 'Verdana'
		];
		this.rnd = Math.floor(Math.random()*10000);
		this.editWindow = this.options.editor.contentWindow;
		this.editor = $(this.editWindow.document);
		this.editorView = options.editorView==window.undefined?false:options.editorView;
		this.bindHotkeys();
		this.render();
		this.bindEvents();
	},
	uploadInClipboardData: function(o, iid){
		var that = this;
		var handlerClass='UploadHandlerForm';
		if(jw.UploadHandlerXhr.isSupported()) handlerClass='UploadHandlerXhr';
		var upfile = new jw[handlerClass]({
			action:this.options.uploadAction,
			allowFiletypes:['jpg', 'jpeg', 'png', 'gif'],
			params:{app_type:'jw_app_joymail', app_id:this.editor.appid,type:'loginthumb'},
			onProgress:function(id,fileName,loaded,total){},
			onComplete:function(id,fileName,result){
				var img = that.editor.find('#'+iid);
				if(that.options.apptype!='jw_n_subscribe'){
					img.attr('src', basurl+'/file/vieworiginal?id='+result.id).attr('id', result.id);
				}else{
					img.attr('src', basurl+'/file/viewresizel?id='+result.id).attr('id', result.id);
				}
				img.load(function(){
					if(that.editorView) that.editorView.fresh();
					if(result.width>800) img.width(800);
				});
			}
		});
		upfile.add(o);
		upfile.upload(0, {app_type:apptype, app_id:this.editor.appid,type:'loginthumb'});
	},
	bindEvents: function(){
		var that = this;
		$(this.editWindow.document).bind('mouseup keyup', function(e){
			that.saveSelection();
			that.checkQueryCommandState();
			if(e.keyCode==13){
				var tar;
				if(isIE){
					tar = that.RNG.parentElement;
				}else{
					tar = that.RNG.startContainer.parentNode;
				}
				if( $.trim(tar.innerText)==''){
					var div = $(tar).closest('div');
					div.html('<br>');
					if(!that.editWindow.getSelection){
						that.RNG.collapse(true);
					}else{
						that.RNG.collapse(div[0], 0);
					}
				}
			}
		}).mousedown(function(e){
			$('.jw-dropdown,.edtool_color_w').addClass('hide');
		}).unbind('paste').bind('paste', function(e) {
			var clipboardData = e.clipboardData || e.originalEvent.clipboardData;
			if( clipboardData==window.undefined ){
				e.stopPropagation();
				e.preventDefault();
				return;
			}
			if(isIE) return;
			var items = clipboardData.items;
			if(items!=window.undefined && items.length>0){
				var item = items[0];
				if(item.type&&item.type.indexOf('image')===0){
					var bolb = item.getAsFile();
					var id = jw.guid();
					bolb.fileName = null;
					bolb.name = 'Screenshot_'+id+'.'+bolb.type.replace('image/', '');
					var img = '<br><img class="tmp" id="'+id+'" src="'+SrcFolder+'/public/images/loading.gif">&nbsp;<br>';
					that.execCommand('insertHTML', img);
					that.uploadInClipboardData(bolb, id);
				}else if(item.type=='text/plain'){
					var text = clipboardData.getData('text/html');
					if(typeof that.options.pasteReg=='function'){
						text = that.options.pasteReg(text);
						// console.log('走着里面了么',text)
						that.execCommand('insertHTML', text);
						e.stopPropagation();
						e.preventDefault();
						return;
					}
					// else{
					// 	text = text.replace(/<style(.*?)<\/style>/img, '');
					// 	text = text.replace(/class="(.*?)"/img, '');
					// 	text = text.replace(/style="(.*?)"/img, '');
					// }
				}
			}else{
				if(clipboardData&&clipboardData.types){
					var image = false;
					_.each(clipboardData.types, function(item){
						if(item.indexOf('image/')==0){
							image = true;
						}
					});
				}
				if(image){
					e.stopPropagation();
					e.preventDefault();
				}
			}
		}).mouseout(function(){
			that.saveSelection();
		});
		this.bindInsertImage();
	},
	insertHTML: function(str){
		var span = this.editWindow.document.createElement('span');
		this.RNG.surroundContents(span);
		span.innerHTML = str;
	},
	execCommand : function (commandWithArgs, valueArg) {
		var commandArr = commandWithArgs.split(' '),
			command = commandArr.shift(),
			args = commandArr.join(' ') + (valueArg || '');
		if(commandWithArgs=='insertHTML'){
			this.insertHTML(args);
		}else{
			this.editWindow.document.execCommand(command, 0, args);
		}
		if(this.editorView) this.editorView.fresh();
	},
	bindInsertImage: function(){
		var that = this;
		$('#inner_attt_mask').remove();
		$('body').append('<div id="inner_attt_mask" style="position:absolute; left:-999em; top:-999em;"></div>');
		new jw.uploader({
			element:$('#inner_attt_mask')[0],
			allowFiletypes:['jpg', 'jpeg', 'png', 'gif'],
			uploadBtn: this.$el.find('.m_image i')[0],
			action:this.options.uploadAction,
			params:{app_type:'jw_app_joymail', app_id:this.editor.appid,type:'loginthumb'},
			EnterAppendEvt: function(){},
			LeaveAppendEvt: function(){},
			onSubmit: function(id, file){
				var param = '</br>&nbsp;<img class="tmp" id="inner_attt_'+id+'" src="'+SrcFolder+'/public/images/loading.gif">&nbsp;</br>';
				that.editWindow.document.body.focus();
				that.restoreSelection();
				if( isIE ){
					if(that.RNG==window.undefined||that.RNG==null) that.RNG = that.getCurrentRange();
					that.RNG.moveToPoint(0,0);
					that.RNG.select();
					that.RNG.pasteHTML(param);
				}else{
					that.execCommand('insertHTML', param);
				}
			},
			onProgress:function(id,name,loaded,total){
				var p = Math.floor(loaded/total*100);
				if(p>100) p=100;
				that.editor.find('#inner_attt_'+id+':after').css('width', (100-p)+'%');
			},
			onComplete:function(id,fileName,responseJSON){
				var img = that.editor.find('#inner_attt_'+id);
				img.attr('src',responseJSON['data']);
				that.editorView.fresh();
			},
			onError:function(error){
				switch(error.type){
					case 20112 : 	error.desc = '该文件类型不允许上传';break;
					case 20113 : 	error.desc = '文件大小超限';break;
					case 20114 : 	error.desc = '文件为空';break;
					default  : 	error.desc = '该文件类型不允许上传';break;
				}
			}
		});
		this.$el.find('.m_image input').attr('accept', 'image/*').attr('tabindex', '1001');
	},
	hotKeys: {
		'ctrl+b meta+b'	: 'bold',
		'ctrl+i meta+i'	: 'italic',
		'ctrl+u meta+u'	: 'underline',
		'ctrl+z meta+z'	: 'undo',
		'ctrl+y meta+y meta+shift+z': 'redo',
		'ctrl+l meta+l'	: 'justifyleft',
		'ctrl+r'		: 'justifyright',
		'ctrl+e meta+e'	: 'justifycenter',
		'ctrl+j meta+j'	: 'justifyfull',
		// 'shift+	'		: 'outdent',
		// 'tab	'		: 'indent',
		'ctrl+1 meta+1'	: 'fontsize 6',
		'ctrl+2 meta+2'	: 'fontsize 5',
		'ctrl+3 meta+3'	: 'fontsize 3',
		'ctrl+4 meta+4'	: 'fontsize 2',
		'ctrl+p meta+p'	: 'insertunorderedlist',
		'ctrl+o meta+o'	: 'insertorderedlist',
		'ctrl+h meta+h'	: 'inserthorizontalrule',
		'ctrl+d meta+d'	: 'removeformat'
	},
	isOpKey: function(e){
		if(e.altKey) return 'alt+';
		if(e.ctrlKey) return 'ctrl+';
		if(e.metaKey&&e.shiftKey) return 'meta+shift+';
		if(e.metaKey) return 'meta+';
		if(e.shiftKey) return 'shift+';
		if(e.keyCode==9) return 'tab'
		return false;
	},
	bindHotkeys : function () {
		var that = this;
		this.editor.keydown(function(e){
			var key = that.isOpKey(e);
			var str = (String.fromCharCode(e.keyCode)).toLowerCase();
			var command = '';
			$.each(that.hotKeys, function(item, i){
				if(item.indexOf( key+str )!=-1){
					command = i;
				}
			});
			if(command!=''){
				e.preventDefault();
				e.stopPropagation();
				command = command.split(' ');
				if(command.length==1){
					that.execCommand(command[0]);
				}else if(command.length==2){
					that.execCommand(command[0], command[1]);
				}
				that.checkQueryCommandState();
			}
		});
	},
	getCurrentRange : function () {
		var sel = null;
		if(!isIE){
			sel = this.editWindow.getSelection();
			if (sel.getRangeAt && sel.rangeCount) {
				return sel.getRangeAt(0);
			}
		}else{
			// IE
			try{
				sel = this.editWindow.document.selection.createRange();
			}catch(e){}
			return sel;
		}
	},
	saveSelection : function () {
		this.RNG = this.getCurrentRange();
	},
	restoreSelection : function () {
		if(!isIE){
			var selection = this.editWindow.getSelection();
			if(this.RNG){
				try{ selection.removeAllRanges(); }catch(ex){}
				selection.addRange(this.RNG);
			}
		}else{
			if(this.RNG){
				this.RNG.select();
			}
		}
	},
	markSelection : function (input, color) {
		this.restoreSelection();
		this.editWindow.document.execCommand('hiliteColor', 0, color || 'transparent');
		this.saveSelection();
	},
	// 字体 字体大小 颜色 加粗 斜体 下划线  左对齐 居中对齐 右对齐 列表 链接   附件
	tools: function(){
		var arr = {};
		if(this.options.toolbar.fonts) arr.m_fonts = '字体';
		if(this.options.toolbar.fontSize) arr.m_fontsize = '字体大小';
		if(this.options.toolbar.fontColor) arr.m_forecolor = '字体颜色';
		if(this.options.toolbar.fontWeight) arr.bold = '加粗';
		if(this.options.toolbar.fontStyle) arr.italic = '斜体';
		if(this.options.toolbar.textDecoration) arr.underline = '下划线';
		if(this.options.toolbar.alignLeft) arr.justifyleft = '左对齐';
		if(this.options.toolbar.alignCenter) arr.justifycenter = '居中对齐';
		if(this.options.toolbar.alignRight) arr.justifyright = '右对齐';
		if(this.options.toolbar.ul) arr.InsertUnorderedList = '无序列表';
		if(this.options.toolbar.url) arr.m_url = '链接';
		if(this.options.toolbar.image) arr.m_image = '插入图片';
		return arr;
	},
	events: {
		'click span': 'changeStyle'
	},
	getStyleProperty: function(el, propName){
		if(window.getComputedStyle){
			return window.getComputedStyle(el, null)[propName]+'';
		}else if(el.currentStyle){
			return el.currentStyle[propName]+'';
		}
	},
	checkQueryCommandState: function(){
		if(!isIE){
			var s = this.editWindow.getSelection();
			var tag = false;
			if(s.focusNode!=window.undefined) tag = s.focusNode.parentNode;
		}else{
			var s = this.editWindow.document.selection.createRange();
			if(!s.parentElement) return;
			var tag = s.parentElement();
		}
		var as = $( tag ).closest('a');

		this.$el.find('>span').removeClass('in-edit');
		if( this.editWindow.document.queryCommandState('bold')!=false ) this.$el.find('span[rel="bold"]').addClass('in-edit');
		if( this.editWindow.document.queryCommandState('italic')!=false ) this.$el.find('span[rel="italic"]').addClass('in-edit');
		if( this.editWindow.document.queryCommandState('underline')!=false ) this.$el.find('span[rel="underline"]').addClass('in-edit');
		if( this.editWindow.document.queryCommandState('justifyleft')!=false ) this.$el.find('span[rel="justifyleft"]').addClass('in-edit');
		if( this.editWindow.document.queryCommandState('justifycenter')!=false ) this.$el.find('span[rel="justifycenter"]').addClass('in-edit');
		if( this.editWindow.document.queryCommandState('justifyright')!=false ) this.$el.find('span[rel="justifyright"]').addClass('in-edit');
		if( this.editWindow.document.queryCommandState('InsertUnorderedList')!=false ) this.$el.find('span[rel="InsertUnorderedList"]').addClass('in-edit');

		var fn = this.editWindow.document.queryCommandValue('fontname');

		if(fn&&fn!=false){
			fn = ($.trim( (fn+'').split(',')[0] )).toLowerCase().replace(/\'/g, '');
			if(fn){
				try{
					this.fonts.select(fn, {silent:true});
					this.$el.find('.m_fonts').css('font-family', fn);
				}catch(e){

				}
			}
		}
		fn = this.editWindow.document.queryCommandValue('fontsize');
		if(fn&&fn!=false ){
			fn=fn*1;
			if( _.isNumber(fn) ){
				try{
					this.fontSize.select(fn+'', {silent:true});
				}catch(e){

				}
			}
		}
		fn = this.editWindow.document.queryCommandValue('ForeColor');
		if( !window.getSelection ){
			fn=this.getStyleProperty(tag, 'color').toUpperCase();
		}
		this.$el.find('a[rel="m_forecolor"]').removeClass('in-edit');
		if(fn&&fn!=false){
			fn = (fn+'').replace('rgb', '').replace('(', '').replace(')','').replace(/ /g, '').replace('#', '');
			if(window.getSelection){
				fn = fn.split(',');
				if(fn.length==3) fn = this.toRgb(fn[0]*1, fn[1]*1, fn[2]*1);
			}
			if(typeof fn!='string') fn='000000';
			$('#edtool_fcolor a.cur').removeClass('cur');
			$('#edtool_fcolor a[rel="#'+fn+'"]').addClass('cur');
			if(fn!='515151'&&fn!='000000') this.$el.find('a[rel="m_forecolor"]').addClass('in-edit');
		}
		fn = this.editWindow.document.queryCommandValue('BackColor');
		if( !window.getSelection ) fn=this.getStyleProperty(tag, 'backgroundColor').toUpperCase();
		if(fn&&fn!=false){
			fn = (fn+'').replace('rgb', '').replace('(', '').replace(')','').replace(/ /g, '').replace('#', '');
			if(window.getSelection){
				fn = fn.split(',');
				if(fn.length==3) fn = this.toRgb(fn[0]*1, fn[1]*1, fn[2]*1);
			}
			if(typeof fn!='string') fn='FFFFFF';
			$('#edtool_bgcolor a.cur').removeClass('cur');
			$('#edtool_bgcolor a[rel="#'+fn+'"]').addClass('cur');
			if(fn!='FFFFFF'&&fn!='TRANSPARENT') this.$el.find('a[rel="m_forecolor"]').addClass('in-edit');
		}
		if(as.length>0){
			this.$el.find('a[rel="m_url"]').addClass('in-edit');
		}else{
			this.$el.find('a[rel="m_url"]').removeClass('in-edit');
		}
	},
	changeStyle: function(e){
		e.stopPropagation();
		e.preventDefault();
		e.cancelBubble = true;

		var command = $(e.target).attr('rel')+'';
		this.restoreSelection();
		this.editor.focus();
		this.execCommand( command );
		this.saveSelection();
		this.checkQueryCommandState();
	},
	toRgb: function(r, g, b){
	    var a = ['0','1','2','3','4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
	    var r1=Math.floor(r/16), r2=r%16;
	    var g1=Math.floor(g/16), g2=g%16;
	    var b1=Math.floor(b/16), b2=b%16;
	    return a[r1]+a[r2]+a[g1]+a[g2]+a[b1]+a[b2];
	},
	bindDropList: function(){
		// 字体
		var fonts = _.map(this.fontList, function(item){
			return {key:item.toLowerCase(), txt:item};
		});
		var that = this;
		var font_btn = this.$el.find('.m_fonts');
		font_btn.click(function(e){
			$(document).click();
			e.preventDefault();
			e.stopPropagation();
			that.restoreSelection();
		});
		this.fonts = new jw.FormCombo({
			el:font_btn,
			dropdownparams:{
				items:fonts,
				_default:'arial'
			}
		});
		this.fonts._dropdowndlg.$el.find('.jw-fd-t').each(function(){
			$(this).css('font-family', $(this).html() );
		});
		this.fonts.bind('change', function(item){
			that.restoreSelection();
			that.editor.focus();
			that.execCommand( 'FontName', item.key);
			that.$el.find('.m_fonts').css('font-family', item.key);
			that.saveSelection();
		});
		// 字号
		var fontSize = [{key:'1', txt:'小'}, {key:'2', txt:'中'}, {key:'5', txt:'大'}, {key:'6', txt:'特大'}];
		var fontsize_btn = this.$el.find('.m_fontsize');
		fontsize_btn.click(function(e){
			$(document).click();
			e.preventDefault();
			e.stopPropagation();
			that.restoreSelection();
		});
		this.fontSize = new jw.FormCombo({
			el:this.$el.find('.m_fontsize'),
			dropdownparams:{
				items:fontSize,
				_default:'2'
			}
		});
		this.fontSize._dropdowndlg.$el.find('.jw-fd-t').each(function(i){
			var font = ['12', '14', '24', '30'];
			$(this).css('font-size', font[i]+'px' );
		});
		this.fontSize.bind('change', function(item){
			that.restoreSelection();
			that.editor.focus();
			that.execCommand( 'FontSize', item.key);
			that.saveSelection();
		});
		// 颜色
		var color_arr = ['000000','808080','FFFFFF', '9D1811', 'CD232C', 'D36A53','A46016','DD902F', 'E4AC64',
					'AC9E19', 'FDEF2B', 'FDF869', '5B8828', '8FCA40', 'ADD773', '4C76A2', '70ACED', '7DBEF1',
					'440062', '652191', '845AA7', '9C005C', 'CB008E', 'D264AA'];
		    str = '';
        var clen = color_arr.length;

        var f_colors = '', b_colors='';
        for(var i=0; i<clen; i++){
            f_colors += '<a rel="#'+color_arr[i]+'" '+(i==0?'class="cur"':'')+' style="background:#'+color_arr[i]+';border:1px solid #'+(color_arr[i]=='FFFFFF'?'ddd':color_arr[i])+'"><i>√</i></a>';
        }
        for(var i=0; i<clen; i++){
            b_colors += '<a rel="#'+color_arr[i]+'" '+(i==2?'class="cur"':'')+' style="background:#'+color_arr[i]+';border:1px solid #'+(color_arr[i]=='FFFFFF'?'ddd':color_arr[i])+'"><i>√</i></a>';
        }
        
        str = '<div class="edtool_color_w" id="edtool_color_w'+this.rnd+'"><div class="edtool_color" id="edtool_fcolor"><h3>文字</h3><div class="edtool_color_item">'+f_colors+'</div></div><div class="edtool_color" style="margin:0 0 0 16px;" id="edtool_bgcolor"><h3>背景</h3><div class="edtool_color_item">'+b_colors+'</div></div></div>';

        	$('#edtool_color_w'+this.rnd).remove();
			$('body').append(str);
			$('#edtool_color_w'+this.rnd).addClass('.hide').unbind('click').click(function(evt){
				evt.preventDefault();
				evt.stopPropagation();
				that.restoreSelection();
				that.editor.focus();
				that.saveSelection();
			});
			$('#edtool_fcolor a').click(function(e){
				e.stopPropagation();
				e.preventDefault();
				that.restoreSelection();
				that.editor.focus();
				that.execCommand( 'ForeColor', $(this).attr('rel'));
				that.saveSelection();
				$('#edtool_fcolor a').removeClass('cur');
				$(this).addClass('cur');
			});
			$('#edtool_bgcolor a').click(function(e){
				e.stopPropagation();
				e.preventDefault();
				that.restoreSelection();
				that.editor.focus();
				that.execCommand( 'backColor', $(this).attr('rel'));
				that.saveSelection();
				$('#edtool_bgcolor a').removeClass('cur');
				$(this).addClass('cur');
			});
			
		var btn = this.$el.find('.m_forecolor');
		btn.unbind('click').click(function(evt){
			console.log(that.model.get('content'))
			$(document).click();
			evt.preventDefault();
			evt.stopPropagation();
			that.restoreSelection();
		});
		var customcombo=new jw.SimpleCombo({
			inittype:1,
			btn: btn,
			el:$('#edtool_color_w'+this.rnd)
		});
        // 链接
        this.$el.find('.m_url').unbind('click').click(function(ee){
        	ee.stopPropagation();
        	ee.preventDefault();
        	that.restoreSelection();
        	var link_str = '';
        	var dlg = '<div class="jm_link_conf"><p>请输入链接：</p><div id="jm_link_input" class="jm_link_input"></div>\
        	<div class="jm_link_btns"><button type="button" class="jw-btn3 jw-btn" id="jm_link_btns_ok">插入链接</button><button type="button" class="jw-btn4 jw-btn" id="jm_link_btns_cc">取消</button></div></div>';
        	var linkDlg = new jw.dialog({
				style:'custom',
				content:dlg,
				modal:true,
				CloseOnEscape:false
			});

			var input = new jw.input({ el: $('#jm_link_input') });
			var input = input.$el.find('input');

			if(!isIE){
				if(that.RNG){
					var tag = that.RNG.commonAncestorContainer.parentNode;
					var as = $(tag).closest('a');
				}
			}else{
				var s = that.RNG;
				var tag = that.RNG.parentElement();
				var as = $(tag).closest('a');
			}
			if(as&&as.length>0){
				link_str = as.attr('href');
			}
			input.val(link_str).focus();
			$('#jm_link_btns_ok').unbind('click').click(function(e){
				e.stopPropagation();
				that.restoreSelection();
				that.editor.focus();
				var link = input[0].value;
				var q = link.indexOf('https://')!=-1?'https://':'http://';
				link = q+link.replace('http://', '').replace('https://', '');
				that.execCommand('createlink', link);
				that.saveSelection();
				if(that.RNG){
					if( isIE ){
						var p = that.RNG.parentElement();
					}else{
						var p = that.RNG.commonAncestorContainer.parentNode;
					}
					if((p.nodeName).toUpperCase()=='A'){
						$(p).attr('title', $(p).attr('href')).attr('target', '_blank');
					}else{
						var as = $(p).find('a');
						as.each(function(){
							$(this).attr('title', $(this).attr('href')).attr('target', '_blank');
						});
					}
				}
				linkDlg._close();
			});
			input.unbind('keydown').on('keydown', function(evt){
				if(evt.keyCode==13){
					$('#jm_link_btns_ok').click();
					evt.stopPropagation();
					return false;
				}
			});
			$('#jm_link_btns_cc').click(function(){
				linkDlg._close();
			});
        });
	},
	render: function(){
		var str = '';
		$.each(this.tools(), function(item, i){
			if( item.indexOf('_')==-1 ){
				str += '<span title="'+i+'" rel="'+item+'" class="edtool '+item+'"></span>';
			}else{
				str += '<a title="'+i+'" rel="'+item+'" class="m_edtool '+item+'">'+(item=='m_image'?'<i></i>':'')+'</a>';
			}
		});
		this.$el.append(str);
		this.bindDropList();

		this.$el.append('<div class="toolbar_right"></div>');


		if(this.options.toolbar.attachment){
			var masker = $(this.options.editor).parent().parent().find('.upload_masker');
			if( masker.length>0 ){
				var that = this;
				this.$el.find('.toolbar_right').append('<div class="add_attachment"><b></b></div>');
				this.initUpload(masker);
				this.$el.find('.add_attachment input').attr('tabindex', '1000');
			}
		}
		var that = this;
		var str = '放大编辑';
		if(this.options.toolbar.zoom===false) str = '缩小编辑';
		if(this.options.toolbar.zoom==true||this.options.toolbar.zoom===false){
			this.$el.find('.toolbar_right').append('<div class="zoom_editor">'+str+'</div>');
		}
		return this;
	},
	getPreview: function(file, img, pos){
		var _XhrSupported=jw.UploadHandlerXhr.isSupported();
		if(_XhrSupported==true){
			var arr = file.name.split('.');
		}else{
			var arr = file.value.split('\\');
				arr = arr[arr.length-1].split('.');
		}
		var _type = (arr[arr.length-1]).toLowerCase();
		if( _.indexOf( ['jpg', 'jpeg','bmp','png','gif'], _type)==-1 ){
			img.attr('src', (''+_type).getFileIcon() );
		}else if(_XhrSupported && file.type.indexOf('image')>=0&&typeof FileReader!=="undefined"){
			var reader = new FileReader();
			reader.onload = function(evt) {
				img.attr('src', this.result).load(function(){
					// 调整文件居中显示
					if(pos==window.undefined){
						var w=img.width(),h=img.height();
						// img.css('margin-left',(60-w)/2+'px');
						img.css('margin-top',(80-h)/2+'px');
					}
				});
			}
			reader.readAsDataURL(file);
		}else{
			img.attr('src', (''+_type).getFileIcon() );
			return file;
		}
	},
	initUpload: function(masker){
		var that = this;
		if(that.options.attachmentsEl){
			that.options.attachmentsEl.html('<ul></ul>');
			if(this.model.get('attaches_list')==null) this.model.set('attaches_list', []);
		}
		else return;
		if(this.model.get('attaches_list')!=null&&this.model.get('attaches_list').length>0){
			that.options.attachmentsEl.show();
			_.each(this.model.get('attaches_list'), function(item){
				var icon = (item.append.thumbnails.link.indexOf('public/')==-1?basurl:'')+item.append.thumbnails.link;
				that.options.attachmentsEl.find('ul').append('<li id="jm_attachment_'+item.id+'" rel="'+item.id+'"><del class="att_remove"></del><img src="'+icon+'"><span>'+(item.name||item.show_name)+'</span></li>');
				$('#jm_attachment_'+item.id+' del').click(function(){
					$(this).parent().remove();
					that.model.trigger('remove_attachment', $(this).parent().attr('rel'));
				});
			});
		}
		new jw.uploader({
			element: masker[0],
			uploadBtn: this.$el.find('.add_attachment b')[0],
			action:this.options.uploadAction,
			params:{app_type:'jw_app_joymail', app_id:this.editor.appid,type:'loginthumb'},
			EnterAppendEvt: function(){
				that.$el.find('.upload_masker').show();
			},
			LeaveAppendEvt: function(){
				that.$el.$('.upload_masker').hide();
			},
			onSubmit: function(id, file){
				that.options.attachmentsEl.show();
				that.options.attachmentsEl.find('ul').append('<li id="jm_attachment_'+id+'"><del class="att_remove"></del><img src=""><span>'+file.name+'</span><div class="jm_progress"><u></u><var>0%</var></div></li>');
				that.model.trigger('submit_file', this);
				$('#jm_attachment_'+id+' del').click(function(){
					$(this).parent().remove();
					that.options.attachOnRemove($(this).parent().attr('rel'));
					that.model.trigger('remove_attachment', $(this).parent().attr('rel'));
				});
				that.getPreview(file, $('#jm_attachment_'+id+' img') );
				if( !jw.UploadHandlerXhr.isSupported() ){
					var tag = $('#jm_attachment_'+id+' .jm_progress');
					tag.addClass('ie8');
					jw.loading(tag);
				}
			},
			onProgress:function(id,name,loaded,total){
				var p = Math.floor(loaded/total*100);
				if(p>100) p=100;
				$('#jm_attachment_'+id+' .jm_progress u').css('width', p+'%');
				$('#jm_attachment_'+id+' .jm_progress var').html(p+'%');
				if(p==100) $('#jm_attachment_'+id+' .jm_progress').hide();
			},
			onComplete:function(id,fileName,responseJSON){
				$('#jm_attachment_'+id).attr('rel', responseJSON.id);
				that.model.trigger('add_attachment', {fileinfo:responseJSON, attachmentElHeight: $('.jm_new_attachments').outerHeight() });
				that.options.attachOnAdd(responseJSON);
				$('#jm_attachment_'+id+' .jm_progress').remove();
				if( !jw.UploadHandlerXhr.isSupported() ){
					$('#jm_attachment_'+id+' img').attr('src', responseJSON.append.thumbnails.link);
				}
			},
			onError:function(error){
				switch(error.type){
					case 20112 : 	error.desc = '该文件类型不允许上传';break;
					case 20113 : 	error.desc = '文件大小超限';break;
					case 20114 : 	error.desc = '文件为空';break;
					default  : 	error.desc = '该文件类型不允许上传';break;
				}
			}
		});
	}
});
