/**
 * jw 上传文件组件
 * author:Dogesoft
 * version:1.0
 *
 * events
 *        onFiletypeError:function(filetype){} filetype: 用户选择的文件类型
 */
var jw=jw||{};
var dropResponseAreas=[];
jw.uploader=function(options){
	this._options={
		element:null,			// 拖拽相应区
		responses:null,			// 拖拽相应区(一组,半透明背景下，需要多层div)
		uploadBtn:null,			// 上传文件按钮
		multiple:true,			// 允许多文件上传
		action:'',
		prefix_id:'',
		params:{},
		allowFiletypes:[],
		unUpFiletypes:['php','js','exe','bat','sh'],
		sizeLimit: 0,
		allUpload:true,			// 是否允许上传文件 状态
		enterDoc:false,
		onSubmit:function(id,fileName){},
		onProgress:function(id,name,loaded,total){},
		onComplete:function(id,fileName,responseJSON){},
		EnterAppendEvt:function(){},
		LeaveAppendEvt:function(){},
		InputBtnOnClick:function(evt){}
		// onCheckError:function( msgstr ){}
	};
	// showDebug(this._options);
	this.allUpload=this._options.allUpload;
	$.extend(this._options,options);
	// trace(this._options);
	($.inArray('dataTransfer',jQuery.event.props)==-1&&jQuery.event.props.push('dataTransfer'))
	this._element=this._options.element;
	// showDebug(this._element.nodeName);
	var self=this;
	if(this._options.responses){
		$.each(this._options.responses,function(i,item){
			dropResponseAreas.push(item);
		})
	}// dropResponseAreas.push(this._options.responses);
	else dropResponseAreas.push($(this._element));
	
	if(this._element.nodeType!=1) throw new Error('element param of FileUploader should be dom node');
	this._filesInProgress=0;
	
	this._handler=this._createUploadHandler();
	if(this._options.uploadBtn){
		this._options.uploadBtnc=$(this._options.uploadBtn).parent();
		var self = this;
		this._button = new jw.UploadButton({
	        element:this._options.uploadBtn,
			uploadBtnc:this._options.uploadBtnc,
	        multiple:self._options.multiple&&jw.UploadHandlerXhr.isSupported(),
	        onChange:function(input){
	            self._onInputChange(input);
	        },
			onClick:function(evt){
				self._options.InputBtnOnClick(evt);
				/*showDebug('typeof element['+typeof _ele+']');
				if(typeof _ele=='object'){
					self._options.element=_ele;
					showDebug($(self._options.element).html());
				}*/
			}
	    });
	}
	this._setupDragDrop();
	return this;
}

jw.uploader.prototype={
	_createUploadHandler:function(){
		var self=this,handlerClass;
		if(jw.UploadHandlerXhr.isSupported()){handlerClass='UploadHandlerXhr';}
		else{handlerClass='UploadHandlerForm';}
		
		var handler=new jw[handlerClass]({
			action:this._options.action,
			onProgress:function(id,fileName,loaded,total){
				// is only called for xhr upload
				// self._updateProgress(id,loaded,total);
				// trace('onProgress id['+(self._options.prefix_id+id)+']');
				self._options.onProgress(self._options.prefix_id+id,fileName,loaded,total);
			},
			onComplete:function(id,fileName,result){
				self._filesInProgress--;
				// mark completed
				/*
				var item=self._getItemByFileId(id);
				
				jw.remove(self._getElement(item,'cancel'));
				jw.remove(self._getElement(item,'spinner'));

				if(result.success){jw.addClass(item,self._classes.success);}
				else{
					jw.addClass(item,self._classes.fail);
					if (result.error){self._options.showMessage(result.error);}
				}
				*/
				// trace('onComplete id['+(self._options.prefix_id+id)+']');
				self._options.onComplete(self._options.prefix_id+id,fileName,result);
			}
		});
		return handler;
	},
	_setupDragDrop:function(){
		if(!jw.UploadHandlerXhr.isSupported()) return;
		function isValidDrag(evt){			
			var dt=evt.dataTransfer,
				// do not check dt.types.contains in webkit,because it crashes safari 4			
				isWebkit=navigator.userAgent.indexOf("AppleWebKit") > -1;						

			// dt.effectAllowed is none in Safari 5
			// dt.types.contains check is for firefox			
			return dt && dt.effectAllowed!='none' && 
				(dt.files || (!isWebkit && dt.types.contains && dt.types.contains('Files')));
		}
		function isInTarget(evt){
			var inTarget=-1;
			$.each(dropResponseAreas,function(i,dropResponseArea){
				if($(this).context==evt.target||$.contains($(this).context,evt.target)){
					inTarget=i;return false;
				}
			})
			return inTarget;
		}
		function hideUFMask(){
			$.each(dropResponseAreas,function(i,dropResponseArea){
				$(this).removeClass('dragging preparing');
			})
		}
		var self=this,
			hideTimeHandle;
		hideUFMask();
		$(document).unbind('dragenter dragover dragleave dragend')
			.bind('dragenter',function(evt){
				self._options.enterDoc=true;
				$.each(dropResponseAreas,function(i,dropResponseArea){
					dropResponseArea.addClass('preparing');
				});
				self._options.EnterAppendEvt(evt);
				$.publish('dragentering',evt);
				evt.preventDefault();
			}).bind('dragover',function(evt){
				if(isValidDrag(evt)){
					if(hideTimeHandle){clearTimeout(hideTimeHandle);}
					var inTarget=isInTarget(evt);
					if(inTarget>=0){
						var effect=evt.dataTransfer.effectAllowed;
						if(effect=='move'||effect=='linkMove'){
							evt.dataTransfer.dropEffect = 'move'; // for FF (only move allowed)	
						}else{
							evt.dataTransfer.dropEffect = 'copy'; // for Chrome
						}
						dropResponseAreas[inTarget].addClass('dragging');
						evt.stopPropagation();
					}else{
						$.each(dropResponseAreas,function(i,dropResponseArea){
							dropResponseArea.removeClass('dragging').addClass('preparing');
						})
						evt.dataTransfer.dropEffect='none';
					}
					evt.preventDefault();
				}
			}).bind('dragleave',function(evt){
				if(isValidDrag(evt)){
					// showDebug('dragleave');
					var inTarget=isInTarget(evt);
					if(inTarget>=0){
						dropResponseAreas[inTarget].removeClass('dragging');
						evt.stopPropagation();
						self._options.enterDoc=false;
						setTimeout(function(){												
							if(!self._options.enterDoc){
								$.each(dropResponseAreas,function(i,dropResponseArea){
									dropResponseArea.removeClass('dragging preparing');
								});
								self._options.LeaveAppendEvt(evt);
								$.publish('dragleaveing',evt);
							}
						},77);
					}else{
						if(hideTimeHandle){clearTimeout(hideTimeHandle);}
						hideTimeHandle=setTimeout(function(){												
							$.each(dropResponseAreas,function(i,dropResponseArea){
								dropResponseArea.removeClass('dragging preparing');
							});
							self._options.LeaveAppendEvt(evt);
							$.publish('dragleaveing',evt);
						},77);
					}
				}
			});
			$(this._element).bind('drop',function(evt){
				hideUFMask();
				self._options.LeaveAppendEvt(evt);
				evt.preventDefault();
				evt.stopPropagation();
				if(!self._options.multiple&&evt.dataTransfer.files.length>1){
					self._options.onError && self._options.onError({type:20120,desc:'不允许上传多个文档'});
					// joyAlertDlg('不允许上传多个文档','',function(){});
					// self._showTip( '不允许上传多个文档' );
					// jw.alert('不允许上传多个文档');
					return false;
				}
				$.each(evt.dataTransfer.files,function(i,file){
					//console.log('name['+file.name+'] type['+file.type+'] size['+file.size+']');
					// file.getAsText
				});
				self._uploadFileList(evt.dataTransfer.files);
			});
	},
	_isAllowedFileType:function(fileName){
		var ext=(-1 !== fileName.indexOf('.')) ? fileName.replace(/.*[.]/, '').toLowerCase() : '';
		var unuptypes = this._options.unUpFiletypes;
		if(unuptypes.length){
			for(var i = 1; i<unuptypes.length;i++){
				if(unuptypes[i].toLowerCase() == ext){
					return false;
				}
			}
		}
		var allowed=this._options.allowFiletypes;
		if(!allowed.length){return true;}		
		for(var i=0; i<allowed.length; i++){
			if(allowed[i].toLowerCase() == ext){
				return true;
			}	
		}
		this._file_extname=ext;
		return false;
	},
	_uploadFileList: function(files){
		var valid=true;

		var i=files.length;
		while (i--){		 
			if (!this._validateFile(files[i])){
				valid=false;
				break;
			}
		}  
		if (valid){
			var fileList = [];
			for(var i=0; i<files.length; i++){
				fileList.push(files[i]);
			}
			// fileList = fileList.reverse();
			for(var i=0; i<fileList.length; i++){
				this._uploadFile(fileList[i]);
			}
			// console.log(fileList, 'fileList')
			// var i=files.length;
			// while (i--){ this._uploadFile(files[i]); }  
		}
	},
	_uploadFile: function(fileContainer){			
		// showDebug('_uploadFile');
		var id=this._handler.add(fileContainer);
		// showDebug('fileContainer.name:'+fileContainer.name);
		var name=this._handler.getName(id);		
		// this._options.onSubmit(id,name);
		/*$.each(fileContainer,function(key,val){
			showDebug('key['+key+'] val ['+val+']');
		})*/
		this._options.onSubmit(this._options.prefix_id+id,fileContainer);		
		this._addToList(id,name);
		this._handler.upload(id,this._options.params);		
	},
	_showTip:function( str ){
		var options={
			type:'sysalert',
			content:str
		};
		var fixeddlg=new jw.fd.noticeDlg(options);
		fixeddlg.preHide(10000);
	},
	_validateFile: function(file){
		var name,size;
		if (file.value){
			// it is a file input			
			// get input value and remove path to normalize
			name=file.value.replace(/.*(\/|\\)/, "");
		} else {
			// fix missing properties in Safari
			name=file.fileName!=null ? file.fileName : file.name;
			size=file.fileSize!=null ? file.fileSize : file.size;
		}
		// alert(name+','+size);
		file.name = name;
		if (! this._isAllowedFileType(name)){
			this._options.onError && this._options.onError({type:20112,desc:'文件类型错误',file:file});
			// jw.alert('文件类型不允许上传:'+name);
			// if(this._options.onFiletypeError) this._options.onFiletypeError(this._file_extname);
			// else this._showTip( '系统禁止上传该类型的文件！' );
			
			// var err = jw.cmn.trans('jw_err_filetype')+':'+name;
			// 
			// if( typeof(this._options.onCheckError)=='function' )
			// 	this._options.onCheckError( err );
			// else
			// 	jw.alert( err );
			return false;
			
		} else if (size === 0){			
			this._options.onError && this._options.onError({type:20114,desc:'系统禁止上传空文件',file:file});
			// jw.alert('文件大小为0:'+name);
			// this._showTip( '系统禁止上传空文件！' );
			
			// var err = jw.cmn.trans('jw_err_filesizenull')+':'+name;
			// if( typeof(this._options.onCheckError)=='function' )
			// 	this._options.onCheckError( err );
			// else
			// 	jw.alert( err );
			return false;
			
		} else if (size && this._options.sizeLimit && size > this._options.sizeLimit){
			this._options.onError && this._options.onError({type:20113,desc:'您上传的文件大小超过了系统限制',file:file});
			// this._showTip( '您上传的文件大小超过了系统限制（'+jw.cmn.filesize(this._options.sizeLimit,1)+'）' );
			// var err = jw.cmn.trans('jw_err_filesize')+':'+name+'<br/> '+jw.cmn.trans('jw_n_filesize')+':'
			// 		+jw.cmn.filesize(this._options.sizeLimit,1)
			// 		+'<br/>'+jw.cmn.trans('jw_n_filesizetrue')+':'+jw.cmn.filesize(size,2);
			// if( typeof(this._options.onCheckError)=='function' )
			// 	this._options.onCheckError( err );
			// else
			// 	jw.alert( );
			// var err = jw.cmn.trans('jw_err_filesize')+':'+name+'<br/> '+jw.cmn.trans('jw_n_filesize')+':'
			// 		+jw.cmn.filesize(this._options.sizeLimit,1)
			// 		+'<br/>'+jw.cmn.trans('jw_n_filesizetrue')+':'+jw.cmn.filesize(size,2);
			// if( typeof(this._options.onCheckError)=='function' )
			// 	this._options.onCheckError( err );
			// else
			// 	jw.alert('文件超过允许上传的大小:'+name+'<br/> 上传最大文件：'
			// 			+jw.cmn.filesize(this._options.sizeLimit,1)
			// 			+'<br/>文件实际大小：'+jw.cmn.filesize(size,2) );
			/*
			jw.alert('文件超过允许上传的大小:'+name+'<br/> 上传最大文件：'
					+jw.cmn.filesize(this._options.sizeLimit,1)
					+'<br/>文件实际大小：'+jw.cmn.filesize(size,2));
			*/
			return false;			
		}
		
		return true;				
	},
	_addToList: function(id,fileName){
		// 默认展现 
		/*
		
		*/
		this._filesInProgress++;
	},
	_updateProgress: function(id,loaded,total){
		// 更新进度
		/*
		var item=this._getItemByFileId(id);
		var size=this._getElement(item,'size');
		size.style.display='inline';
		
		var text; 
		if (loaded!=total){
			text=Math.round(loaded / total * 100) + '% from ' + this._formatSize(total);
		} else {								   
			text=this._formatSize(total);
		}		  
		
		qq.setText(size,text);
		*/
		
	},
	_formatSize: function(bytes){
		var i=-1;									
		do {
			bytes=bytes / 1024;
			i++;  
		} while (bytes > 99);
		
		return Math.max(bytes,0.1).toFixed(1) + ['kB','MB','GB','TB','PB','EB'][i];		  
	},
	_onInputChange: function(input){
		if (this._handler instanceof jw.UploadHandlerXhr){
			// showDebug(this._options.uploadBtn.files);
			/*$.each(input.files,function(i,file){
				showDebug('name ['+file.name+'] type['+file.type+'] size['+file.size+']');
			});*/
			this._uploadFileList(input.files);
		} else {
			// alert('_onInputChange');
			if (this._validateFile(input)){
				// alert('after _validateFile')
				this._uploadFile(input);
			}
		}
		this._button.reset();
	},
	setAllowUpload:function(allow){
		this.allUpload=allow;
	}
};


jw.UploadHandlerXhr=function(options){
	this._options={
		// url of the server-side upload script,
		// should be on the same domain
		action:'/upload',
		onProgress:function(id,fileName,loaded,total){},
		onComplete:function(id,fileName,response){}
	};
	if( options.action==window.undefined || options.action=='' ){
		options.action = basurl+'/file/upload';
	}
	$.extend(this._options,options);

	this._files=[];
	this._xhrs=[];
};

// static method
jw.UploadHandlerXhr.isSupported=function(){
	// return false;
	return typeof File!="undefined" &&
		typeof (new XMLHttpRequest()).upload!="undefined";
};	
jw.UploadHandlerXhr.prototype={
	/**
	 * Adds file to the queue
	 * Returns id to use with upload,cancel
	 **/	
	add:function(file){
		return this._files.push(file) - 1;		
	},
	/**
	 * Sends the file identified by id and additional query params to the server
	 * @param {Object} params name-value string pairs
	 */	
	upload:function(id,params){
		var file=this._files[id],
			name=this.getName(id),
			size=this.getSize(id);
		
		if(!file){
			throw new Error('file with passed id was not added,or already uploaded or cancelled');   
		}
						
		var xhr=this._xhrs[id]=new XMLHttpRequest();
		var self=this;
		
		xhr.upload.timeout=600000;						
		xhr.upload.onprogress=function(evt){
			if (evt.lengthComputable){
				self._options.onProgress(id,name,evt.loaded,evt.total);
			}
		};

		xhr.onreadystatechange=function(){
			// the request was aborted/cancelled
			if(!self._files[id]) return;
			if (xhr.readyState == 4){
				self._options.onProgress(id,name,size,size);
				if (xhr.status == 200){
					var response;
					try {
						response=eval("(" + xhr.responseText + ")");
					}catch(err){
						response={};
					}
					self._options.onComplete(id,name,response);
				} else {
					// responseText
					self._options.onComplete(id,name,{errcode:xhr.status,memo:xhr.responseText});
				}
				
				self._files[id]=null;
				self._xhrs[id]=null;				
			}
		};

		// build query string
		// trace(params, 'params');
		var queryString='jwfile=';
		if(params.upload_key!=window.undefined) queryString = 'pic=';
		queryString = queryString + encodeURIComponent(name);
		for (var key in params){
			queryString += '&' + key + '=' + encodeURIComponent(params[key]);
		}
		var actionUrl = this._options.action+ (this._options.action.indexOf('?')==-1?'?':'&') + queryString

		xhr.open("POST",actionUrl,true);
		xhr.send(file);
	},
	cancel: function(id){
		this._files[id]=null;
		
		if (this._xhrs[id]){
			this._xhrs[id].abort();
			this._xhrs[id]=null;								   
		}
	},
	getName: function(id){
		var file=this._files[id];
		return file.fileName!=null ? file.fileName : file.name;	   
	},
	getSize: function(id){
		var file=this._files[id];
		return file.fileSize!=null ? file.fileSize : file.size;
	}
};

/**
 * Class for uploading files using form and iframe
 */
jw.UploadHandlerForm = function(options){
	this._options = {
		// URL of the server-side upload script,
		// should be on the same domain to get response
		// action: '/file/cmnupfile',
		action: '/file/upload',
		// fires for each file, when iframe finishes loading
		onComplete: function(id, fileName, response){}
	};
	if( options.action==window.undefined  || options.action=='' ){
		options.action = basurl+'/file/upload';
		// options.action = basurl+'/file/uploadfile';
	}
	$.extend(this._options, options);
	   
	this._inputs = {};
};

jw.UploadHandlerForm.prototype = {
	/**
	 * Adds file input to the queue
	 * Returns id to use with upload, cancel
	 **/	
	add: function(fileInput){
		// fileInput.setAttribute('name', 'qqfile');
		// var id = 'qq-upload-handler-iframe' + qq.getUniqueId();
		trace(this._options,'this.options')	   
		var id='jw_upload_iframe'+jw.guid();
		$(fileInput).attr('name','jwfile');
		this._inputs[id] = fileInput;
		// remove file input from DOM
		if (fileInput.parentNode){
			// qq.remove(fileInput);
			// $(fileInput).remove();
		}
		return id;
	},
	/**
	 * Sends the file identified by id and additional query params to the server
	 * @param {Object} params name-value string pairs
	 */
	upload: function(id, params){
		var input = this._inputs[id];
		if (!input){
			throw new Error('file with passed id was not added, or already uploaded or cancelled');
		}				
		var fileName = this.getName(id);
		var iframe = this._createIframe(id);
		var form = this._createForm(iframe, params);
		var inputc=$(input).parent();
		form.appendChild(input);
		// form.appendChild($(input).clone(true)[0]);
		// return;
		var self = this;
		this._attachLoadEvent(iframe, function(){			
			// alert('_attachLoadEvent over id['+id+']name['+fileName+']');
			// self._options.onComplete(id, fileName, self._getIframeContentJSON(iframe));
			self._options.onComplete(id, fileName, self._getIframeContentJSON(document.getElementById(id)));
			// showDebug(self._inputs.length);
			delete self._inputs[id];
			// showDebug(self._inputs.length);
			// timeout added to fix busy state in FF3.6
			setTimeout(function(){
				// qq.remove(iframe);
				$(iframe).remove();
			}, 1);
		});

		form.submit();
		$(form).remove();
		// qq.remove(form);		
		return id;
	},
	cancel: function(id){		
		if (id in this._inputs){
			delete this._inputs[id];
		}		

		var iframe = document.getElementById(id);
		if (iframe){
			// to cancel request set src to something else
			// we use src="javascript:false;" because it doesn't
			// trigger ie6 prompt on https
			iframe.setAttribute('src', 'javascript:false;');

			// qq.remove(iframe);
			$(iframe).remove();
		}
	},
	getName: function(id){
		// get input value and remove path to normalize
		return this._inputs[id].value.replace(/.*(\/|\\)/, "");
	},  
	_attachLoadEvent: function(iframe, callback){
		$(iframe).bind('load',function(){
			if (!iframe.parentNode){
				return;
			}
			// alert('_attachLoadEvent 1');
			// fixing Opera 10.53
			if (iframe.contentDocument &&
				iframe.contentDocument.body &&
				iframe.contentDocument.body.innerHTML == "false"){
				// In Opera event is fired second time
				// when body.innerHTML changed from false
				// to server response approx. after 1 sec
				// when we upload file with iframe
				return;
			}
			// alert('_attachLoadEvent 2');
			callback();
		})
		/*qq.attach(iframe, 'load', function(){
			// when we remove iframe from dom
			// the request stops, but in IE load
			// event fires
			if (!iframe.parentNode){
				return;
			}

			// fixing Opera 10.53
			if (iframe.contentDocument &&
				iframe.contentDocument.body &&
				iframe.contentDocument.body.innerHTML == "false"){
				// In Opera event is fired second time
				// when body.innerHTML changed from false
				// to server response approx. after 1 sec
				// when we upload file with iframe
				return;
			}

			callback();
		});*/
	},
	/**
	 * Returns json object received by iframe from server.
	 */
	_getIframeContentJSON: function(iframe){
		
		// iframe.contentWindow.document - for IE<7
		var doc = iframe.contentDocument ? iframe.contentDocument: iframe.contentWindow.document,
			response;
		try{
			// document.write(doc.body.innerText);
			// alert(doc.body.innerText);
			response = eval("(" + doc.body.innerText + ")");
			// alert('success')
			// response = eval("(" + doc.body.innerHTML + ")");
		} catch(err){
			// alert('false');
			response = {};
		}

		return response;
	},
	/**
	 * Creates iframe with unique name
	 */
	_createIframe: function(id){
		// We can't use following code as the name attribute
		// won't be properly registered in IE6, and new window
		// on form submit will open
		// var iframe = document.createElement('iframe');
		// iframe.setAttribute('name', id);
		// var iframe = qq.toElement();
		var iframe=$('<iframe src="javascript:false;" name="' + id + '" ></iframe>');
		// src="javascript:false;" removes ie6 prompt on https

		// iframe.setAttribute('id', id);
		iframe.attr('id',id);
		$(iframe).css('display','none');
		// iframe.style.display = 'none';
		// document.body.appendChild(iframe[0]);
		$('body').append(iframe);

		return iframe[0];
	},
	/**
	 * Creates form, that will be submitted to iframe
	 */
	_createForm: function(iframe, params){
		// We can't use the following code in IE6
		// var form = document.createElement('form');
		// form.setAttribute('method', 'post');
		// form.setAttribute('enctype', 'multipart/form-data');
		// Because in this case file won't be attached to request
		// var form = qq.toElement('<form method="post" enctype="multipart/form-data"></form>');
		var form=$('<form method="post" enctype="multipart/form-data"></form>')[0];

		var queryString = '?';
		for (var key in params){
			queryString += '&' + key + '=' + encodeURIComponent(params[key]);
		}
		
		form.setAttribute('action', this._options.action + queryString);
		form.setAttribute('target', iframe.name);
		form.style.display = 'none';
		document.body.appendChild(form);

		return form;
	}
};
	
jw.UploadButton=function(options){
	this._options={
		element:null,  
		// if set to true adds multiple attribute to file input	  
		multiple:false,
		// name attribute of file input
		name:'file',
		uploadBtnc:null,
		onChange:function(input){},
		onClick:function(evt){}			// input click event
	};
	
	$.extend(this._options, options);
	// showDebug(this._options);
	// showDebug(this._options.element.nodeName);
	this._element = this._options.element;
	
	// make button suitable container for input
	this._input = this._createInput();
};

jw.UploadButton.prototype = {
	/* returns file input element */	
	getInput: function(){
		return this._input;
	},
	/* cleans/recreates the file input */
	reset: function(){
		// $(this._element).remove();
		// qq.removeClass(this._element, this._options.focusClass);
		// this._createInput();
		// showDebug('reset');
		this._input = this._createInput();
	},	
	_createInput: function(){
		var self = this;
		var oldinput=this._options.uploadBtnc.find('input');
		
		if(oldinput.length==1){
			oldinput.remove();
		}
		// showDebug(this._options);
		this._options.uploadBtnc.append('<input type="file" name="file" style="position:absolute;right:0pt;top:0pt;z-index:1;font-size:460px;margin:0pt;padding:0pt;cursor:pointer;opacity:0;filter:alpha(opacity=0);" />');
		this._element=this._options.uploadBtnc.find('input')[0];
		// showDebug($(this._element).length);
		if(this._options.multiple) this._element.setAttribute("multiple", "multiple");
		$(this._element).bind('change',function(){
			// showDebug('Input button Change');
			self._options.onChange(this);
		}).bind('click',function(evt){
			// showDebug('Input button click');
			self._options.onClick(evt);
		})
		// IE and Opera, unfortunately have 2 tab stops on file input
		// which is unacceptable in our case, disable keyboard access
		if (window.attachEvent){
			// it is IE or Opera
			$(this._element).attr('tabIndex', "-1");
		}

		return this._element;			
	}	
};

jw.cmn = jw.cmn||{};
jw.cmn.getFileIconByName=function(filename){
	if(!filename||filename.indexOf('.')<0){
		return '/public/images/fileicon/file_100.png';
	}
	var filelogo='',fns=filename.split('.'),filetype=fns[fns.length-1];
	filetype=filetype.toLowerCase();
	console.log(filetype, 'filetype');
	filelogo=jw.cmn.getFileIcon(filetype);
	return filelogo;
}
/**
 * 通过文件扩展名获取文件 icon
 * param filetype 文件扩展名
 * return logo url
 */
jw.cmn.getFileIcon=function(filetype){
	filetype=filetype.toLowerCase();
	var iconUrl='';
	if( $.inArray(filetype,['jpg','bmp','png','gif'] )>-1){
		iconUrl='/public/images/fileicon/photo_100.png';
		// iconUrl='/public/images/fileicon/photo.gif';
	}else if( $.inArray(filetype,['doc','docx'] )>-1){
		iconUrl = '/public/images/fileicon/doc_notr.png';
	}else if( $.inArray(filetype,['xls','xlsx'] )>-1){
		iconUrl = '/public/images/fileicon/xls_notr.png';
	}else if( $.inArray(filetype,['ppt','pptx','pps','ppsx'] )>-1){
		iconUrl = '/public/images/fileicon/ppt_notr.png';
	}else if( $.inArray(filetype,['txt','text'] )>-1){
		iconUrl = '/public/images/fileicon/txt.png';
	}else if( filetype=='ai' ){
		iconUrl = '/public/images/fileicon/ai.png';
	}else if( filetype=='csv' ){
		iconUrl = '/public/images/fileicon/csv.png';
	}else if( filetype=='eps' ){
		iconUrl = '/public/images/fileicon/eps.png';
	}else if( filetype=='gz' ){
		iconUrl = '/public/images/fileicon/gz.png';
	}else if( filetype=='log' ){
		iconUrl = '/public/images/fileicon/log.png';
	}else if( filetype=='pdf' ){
		iconUrl = '/public/images/fileicon/pdf_notr.png';
	}else if( filetype=='psd' ){
		iconUrl = '/public/images/fileicon/psd.png';
	}else if( filetype=='rar' ){
		iconUrl = '/public/images/fileicon/rar.png';
	}else if( filetype=='rtf' ){
		iconUrl = '/public/images/fileicon/rtf.png';
	}else if( filetype=='rtx' ){
		iconUrl = '/public/images/fileicon/rtx.png';
	}else if( filetype=='swf' ){
		iconUrl = '/public/images/fileicon/swf.png';
	}else if( filetype=='text' ){
		iconUrl = '/public/images/fileicon/text.png';
	}else if( filetype=='tgz' ){
		iconUrl = '/public/images/fileicon/tgz.png';
	}else if( filetype=='tif' ){
		iconUrl = '/public/images/fileicon/tif.png';
	}else if( filetype=='tiff' ){
		iconUrl = '/public/images/fileicon/tiff.png';
	}else if( filetype=='zip' ){
		iconUrl = '/public/images/fileicon/zip.png';
	}else if( filetype=='mp4' ){
		iconUrl = '/public/images/fileicon/video_2014.png';
	}else{
		iconUrl = '/public/images/fileicon/nofile.png';
	}
	// showDebug('filetype['+filetype+'] iconUrl['+iconUrl+']');
	return iconUrl;
}
// Generate four random hex digits.
jw.S4 = function() {
   return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
};

// Generate a pseudo-GUID by concatenating random hexadecimal.
jw.guid = function() {
   return (jw.S4()+jw.S4()+"-"+jw.S4()+"-"+jw.S4()+"-"+jw.S4()+"-"+jw.S4()+jw.S4()+jw.S4());
};


