/**
 * joywok.js
 * author
 * version
 */
var jw=jw||{};
jw.SUCC_TIP_LEN = 2000;
jw.AS=jw.AS||{};
var basurl=window.basurl||'';
//
function evtPos(e) {
	var posx = 0;
	var posy = 0;
	if(!e) var e = window.event;
	if(e.pageX || e.pageY){
		posx = e.pageX;
		posy = e.pageY;
	}else if(e.clientX || e.clientY){
		posx = e.clientX + document.body.scrollLeft
			+ document.documentElement.scrollLeft;
		posy = e.clientY + document.body.scrollTop
			+ document.documentElement.scrollTop;
	}
	return {left:posx,top:posy};
}
// Generate four random hex digits.
function S4() {
   return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
};

// Generate a pseudo-GUID by concatenating random hexadecimal.
function guid() {
   return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
};



(function($,exports){


// Our Store is represented by a single JS object in *localStorage*. Create it
// with a meaningful name, like the name you'd give a table.
exports.Store = function(name) {
  this.name = name;
  var store = localStorage.getItem(this.name);
  this.data = (store && JSON.parse(store)) || {};
};

_.extend(Store.prototype, {

  // Save the current state of the **Store** to *localStorage*.
  save: function() {
    localStorage.setItem(this.name, JSON.stringify(this.data));
  },

  // Add a model, giving it a (hopefully)-unique GUID, if it doesn't already
  // have an id of it's own.
  create: function(model) {
    if (!model.id) model.id = model.attributes.id = guid();
    this.data[model.id] = model;
    this.save();
    return model;
  },

  // Update a model by replacing its copy in `this.data`.
  update: function(model) {
  	var self = this;
    this.data[model.id] = model;
    this.save();
    $.publish('store:change:'+this.name,this.data)
    return model;
  },

  // Retrieve a model from `this.data` by id.
  find: function(model) {
    return this.data[model.id];
  },

  // Return the array of all models currently in storage.
  findAll: function() {
    return _.values(this.data);
  },

  // Delete a model from `this.data`, returning it.
  destroy: function(model) {
    delete this.data[model.id];
    this.save();
    return model;
  }

});

/*var trace=function(content){
	try{
		if(typeof content==='object') content=JSON.stringify(content);
		if(window.console&&window.console.log)
			window.console.log(content);
	}catch(e){ window.console.log('show debug error') }
}*/
var trace = function f(){ trace.history = trace.history || []; trace.history.push(arguments); if(this.console) { var args = arguments, newarr; args.callee = args.callee.caller; newarr = [].slice.call(args); if (typeof console.log === 'object') trace.apply.call(console.log, console, newarr); else console.log.apply(console, newarr);}};
// make it safe to use console.log always
(function(a){function b(){}for(var c="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),d;!!(d=c.pop());){a[d]=a[d]||b;}})
(function(){try{console.log();return window.console;}catch(a){return (window.console={});}}());

exports.trace=trace;
//字典开始
jw.dictToArray = function(key){ return _.map(jw.dicts[key],function(v,k){ return {key:k,txt:v}})};
jw.dicts = {
	gender:{male:'男',female:'女'},
	blood_type:{A:'A型',B:'B型',O:'O型',AB:'AB型'},
	nation:{Han:'汉族',Man:'满族',Mongolian:'蒙古族',Zhuang:'壮族',Hui:'回族',Miao:'苗族',Tujia:'维吾尔族',Yi:'土家族',Tibetan:'藏族',Buyei:'布依族',Dong:'侗族',Baipho:'瑶族',Korean:'朝鲜族',Bai:'白族',Hani:'哈尼族',Kazakh:'哈萨克族',Li:'黎族',Dai:'傣族',She:'畲族',Gelao:'仡佬族',Dongxiang:'东乡族',Gaoshan:'高山族',Lahu:'拉祜族族',Shui:'水族',Va:'佤族',Nakhi:'纳西族',Qiang:'羌满族',Monguor:'土族',Mulao:'仫佬族',Xibe:'锡伯族',Kyrgyz:'柯尔克孜族',Daur:'达斡尔族',Jingpo:'景颇族',Maonan:'毛南族',Salar:'撒拉族',Blang:'布朗族',Tajik:'塔吉克族',Achang:'阿昌族',Pumi:'普米族',Evenk:'鄂温克族',Nu:'怒族',Kinh:'京族',Jino:'基诺族',Deang:'德昂族',Bonan:'保安族',Russian:'俄罗斯族',Yughur:'裕固族',Uzbek:'乌孜别克族',Monpa:'门巴族',Oroqen:'鄂伦春族',Derung:'独龙族',Tatar:'塔塔尔族',Nanai:'赫哲族',Lhoba:'珞巴族'},
	specialty:{specialty01:'哲学类',specialty02:'经济学类',specialty03:'财政学类',specialty04:'金融学类',specialty05:'经济与贸易类',specialty06:'法学类',specialty07:'政治学类',specialty08:'社会学类',
		specialty09:'民族学类',specialty10:'马克思主义理论类',specialty11:'公安学类',specialty12:'教育学类',specialty13:'体育学类',specialty14:'中国语言文学类',specialty15:'外国语言文学类',specialty16:'新闻传播学类',
		specialty17:'历史学类',specialty18:'数学类',specialty19:'物理学类',specialty20:'化学类',specialty21:'天文学类',specialty22:'地理科学类',specialty23:'大气科学类',specialty24:'海洋科学类',specialty25:'地球物理学类',
		specialty26:'地质学类',specialty27:'生物科学类',specialty28:'心理学类',specialty29:'统计学类',specialty30:'力学类',specialty31:'机械类',specialty32:'仪器类',specialty33:'材料类',specialty34:'能源动力类',specialty35:'电气类',
		specialty36:'电子信息类',specialty37:'自动化类',specialty38:'计算机类',specialty39:'土木类',specialty40:'水利类',specialty41:'测绘类',specialty42:'化工与制药类',specialty43:'地质类',specialty44:'矿业类',specialty45:'纺织类',
		specialty46:'轻工类',specialty47:'交通运输类',specialty48:'海洋工程类',specialty49:'航空航天类',specialty50:'兵器类',specialty51:'核工程类',specialty52:'农业工程类',specialty53:'林业工程类',specialty54:'环境科学与工程类',specialty55:'生物医学工程类',
		specialty56:'食品科学与工程类',specialty57:'建筑类',specialty58:'安全科学与工程类',specialty59:'生物工程类',specialty60:'公安技术类',specialty61:'植物生产类',specialty62:'图书情报与档案管理类',specialty63:'物流管理与工程类',specialty64:'工业工程类',
		specialty65:'电子商务类',specialty66:'旅游管理类',specialty67:'艺术学理论类',specialty68:'音乐与舞蹈学类',specialty69:'戏剧与影视学类',specialty70:'美术学类',specialty71:'设计学类'},
	contact:{
		tel:'电话',ext:'分机',mobile:'手机',fax:'传真',email:'电子邮件',QQ:'QQ',Skype:'Skype',MSN:'MSN',ICQ:'ICQ',AIM:'AIM',Jabber:'Jabber',GoogleTalk:'Google Talk',fetion:'飞信',weibo:'新浪微博',tecent:'腾讯微博',tecentspace:'腾讯空间',renren:'人人',kaixin:'开心网',Twitter:'Twitter',Facebook:'Facebook',Linkedin:'Linkedin'
	},
	timezone:{'-12':'(GMT -12:00) 埃尼威托克岛, 夸贾林环礁', '-11':'(GMT -11:00) 中途岛, 萨摩亚群岛', '-10':'(GMT -10:00) 夏威夷', '-9':'(GMT -09:00) 阿拉斯加', '-8':'(GMT -08:00) 太平洋时间(美国和加拿大), 提华纳', '-7':'(GMT -07:00) 山区时间(美国和加拿大), 亚利桑那', '-6':'(GMT -06:00) 中部时间(美国和加拿大), 墨西哥城', '-5':'(GMT -05:00) 东部时间(美国和加拿大), 波哥大, 利马, 基多', '-4':'(GMT -04:00) 大西洋时间(加拿大), 加拉加斯, 拉巴斯', '-3.5':'(GMT -03:30) 纽芬兰', '-3':'(GMT -03:00) 巴西利亚, 布宜诺斯艾利斯, 乔治敦, 福克兰群岛', '-2':'(GMT -02:00) 中大西洋, 阿森松群岛, 圣赫勒拿岛', '-1':'(GMT -01:00) 亚速群岛, 佛得角群岛 [格林尼治标准时间] 都柏林, 伦敦, 里斯本, 卡萨布兰卡', '0':'(GMT) 卡萨布兰卡，都柏林，爱丁堡，伦敦，里斯本，蒙罗维亚', '1':'(GMT +01:00) 柏林, 布鲁塞尔, 哥本哈根, 马德里, 巴黎, 罗马', '2':'(GMT +02:00) 赫尔辛基, 加里宁格勒, 南非, 华沙', '3':'(GMT +03:00) 巴格达, 利雅得, 莫斯科, 奈洛比', '3.5':'(GMT +03:30) 德黑兰', '4':'(GMT +04:00) 阿布扎比, 巴库, 马斯喀特, 特比利斯', '4.5':'(GMT +04:30) 坎布尔', '5':'(GMT +05:00) 叶卡特琳堡, 伊斯兰堡, 卡拉奇, 塔什干', '5.5':'(GMT +05:30) 孟买, 加尔各答, 马德拉斯, 新德里', '5.75':'(GMT +05:45) 加德满都', '6':'(GMT +06:00) 阿拉木图, 科伦坡, 达卡, 新西伯利亚', '6.5':'(GMT +06:30) 仰光', '7':'(GMT +07:00) 曼谷, 河内, 雅加达', '8':'(GMT +08:00) 北京, 香港, 帕斯, 新加坡, 台北', '9':'(GMT +09:00) 大阪, 札幌, 首尔, 东京, 雅库茨克', '9.5':'(GMT +09:30) 阿德莱德, 达尔文', '10':'(GMT +10:00) 堪培拉, 关岛, 墨尔本, 悉尼, 海参崴', '11':'(GMT +11:00) 马加丹, 新喀里多尼亚, 所罗门群岛', '12':'(GMT +12:00) 奥克兰, 惠灵顿, 斐济, 马绍尔群岛'}
	/*[
		{key:'tel',name:'电话'},{key:'ext',name:'分机'},{key:'mobile',name:'手机'},{key:'fax',name:'传真'},{key:'email',name:'电子邮件'},
		{key:'IM',name:'聊天工具',sub:[{QQ:'QQ',Skype:'Skype',MSN:'MSN',ICQ:'ICQ',AIM:'AIM',Jabber:'Jabber',GoogleTalk:'Google Talk',fetion:'飞信'}]},
		{key:'SNS',name:'社交网络',sub:[{weibo:'新浪微博',tecent:'腾讯微博',tecentspace:'腾讯空间',renren:'人人',kaixin:'开心网',Twitter:'Twitter',Facebook:'Facebook',Linkedin:'Linkedin'}]}
	]*/
};

jw.ContactClasses={IM:{name:'聊天工具',sub:['QQ','Skype','MSN','ICQ','AIM','Jabber','GoogleTalk','fetion']},SNS:{name:'社交网络',sub:['weibo','tecent','tecentspace','renren','kaixin','Twitter','Facebook','Linkedin']}};

// Generate four random hex digits.
jw.S4 = function() {
   return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
};

// Generate a pseudo-GUID by concatenating random hexadecimal.
jw.guid = function() {
   return (jw.S4()+jw.S4()+"-"+jw.S4()+"-"+jw.S4()+"-"+jw.S4()+"-"+jw.S4()+jw.S4()+jw.S4());
};

//get domain name
jw.getdomainName = function(str){
	str = str||document.location.href;
    var durl=/(http|https):\/\/([^\/]+)\//i;  
    domain = str.match(durl);
 	return domain[1].substr(domain[1].indexOf('.')+1);
 }

jw.getHost = function(){
	var str=document.location.href;
    var durl=/(http|https):\/\/([^\/]+)\//i;  
    var domain = str.match(durl);
    return domain[0];
}

jw.showMap = function(d){
	var closeMap = function(){
		$('#map_bg').remove();
		$('#map_showdiv').remove();
		$('#map_closediv').remove();
	};
	var self = this;
	$('body').append('<div class="map_bg" id="map_bg"></div><div class="map_showdiv" id="map_showdiv"><iframe scrolling="no" src="'+basurl+'/as/amap?longitude='+encodeURIComponent(d.longitude)+'&latitude='+encodeURIComponent(d.latitude)+'&address='+encodeURIComponent(d.address)+'&name='+encodeURIComponent(d.name)+'" style="width:100%;height:100%;border:0px;padding:0;outline:0;overflow:hidden;" frameborder="no"></iframe></div><div class="map_closediv" id="map_closediv"></div>');
	$('#map_closediv').click(function(){
		closeMap();
	});
	$(document).keydown(function(e){
		if(e.keyCode==27){
			closeMap();
		}
	});
	$('#map_bg').show();
	$('#map_showdiv').css({opacity:0,bottom:-20, top:$(window).height(), left:$(window).width()/2-10, right:$(window).width()/2-10}).animate({left:70, top:70, right:70, bottom:70, opacity:1}, 500, function(){
		$('#map_showdiv').animate({left:100, top:100, right:100, bottom:100}, 200, function(){
			$('#map_showdiv').animate({left:80, top:80, right:80, bottom:80}, 300, function(){
				$('#map_showdiv').animate({left:90, top:90, right:90, bottom:90}, 500, function(){
					$('#map_closediv').show();
				});
			});
		});
	});
}
//字典结束
/**
 * 字符串处理函数库
 */
// 计算字符串的长度 （2个英文算1个字符）
String.prototype.LengthW = function(){
	return Math.ceil((this.replace(/[^\x00-\xff]/g,"**").length)/2);
}
// 是否是邮件
String.prototype.isEmail = function(){
	return /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(this);
}
String.prototype.containChi = function(){
	if(/.*[\u4e00-\u9fa5]+.*$/.test(this)){
		return false;
	}
	return true;
}
// 是否是合法的链接地址
String.prototype.isURL = function(){
	var re=/^((http|https|ftp):\/\/)?(\w(\:\w)?@)?([0-9a-z_-]+\.)*?([a-z0-9-]+\.[a-z]{2,6}(\.[a-z]{2})?(\:[0-9]{2,6})?)((\/[^?#<>\/\\*":]*)+(\?[^#]*)?(#.*)?)?$/i;
	return re.test(this);
}
String.prototype.IsURL = function(){
	var re =  /^((https?|ftp|news):\/\/)?([a-z]([a-z0-9\-]*[\.。])+([a-z]{2}|aero|arpa|biz|com|coop|edu|gov|info|int|jobs|mil|museum|name|nato|net|org|pro|travel)|(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))(\/[a-z0-9_\-\.~]+)*(\/([a-z0-9_\-\.]*)(\?[a-z0-9+_\-\.%=&]*)?)?(#[a-z][a-z0-9_]*)?$/ 
	return re.test(this)
}
// 判断域名是否合法
String.prototype.isSite = function(){
	return /^[A-Za-z0-9]*$/.test(this);
}
/**
 * 将url参数转换为数组
 */
String.prototype.getUrlParam=function(){
	if(!this||this==''){
		return null;
	}
	var item,params={},
		items=this.split('&');
	$.each(items,function(i,str){
		item=str.split('=');
		if(item&&item.length==2){
			params[item[0].replace('?','')]=item[1];
		}
	})
	return params;
}
/**
 * 中文字符串截取
 * @param len 待截取的长度
 */
String.prototype.jwSubStr=function(len){
	//length属性读出来的汉字长度为1
	if(!this) return '';
	if(this.length*2 <= len) return this;
	var strlen = 0,s='',last='...';
	for(var i = 0;i < this.length; i++){
		if(this.charCodeAt(i) > 128){
			strlen = strlen + 2;
			if(strlen > len) return s.substring(0,s.length-1) + last;
		}else{
			strlen = strlen + 1;
			if(strlen > len) return s.substring(0,s.length-2) + last;
		}
		s = s + this.charAt(i);
	}
	return s;
}
/**
 * 将全角字符转换为半角字符
 */
String.prototype.ToCDB=function(){
	var tmp = "";
	for(var i=0;i<this.length;i++){
		if(this.charCodeAt(i)>65248&&this.charCodeAt(i)<65375){
			tmp += String.fromCharCode(this.charCodeAt(i)-65248);
		} else {
			tmp += String.fromCharCode(this.charCodeAt(i));
		}
	}
	return tmp;
}
/**
 * 判断字符串是否是合法的日期
 * 字符串为 yyyy-mm-dd 格式
 * 如果合法，返回格式化之后的 yyyy-mm-dd 格式
 * 非法　返回 false
 */
String.prototype.ValidDate=function(){
	var i,j,strTemp;
	// 字符串中是否包含非法字符
	strTemp="0123456789-";
	if ( this.length== 0) return false;
	for (i=0,cnt=this.length;i<cnt;i++){
	  j=strTemp.indexOf(this.charAt(i));
	  if (j==-1&&(i==0&&this.charAt(i)!='-')){
			//说明有字符不是数字
	 		return false;
		}
	}
	var datearr=this.split('-');
	if(datearr.length!=3) return false;
	// 年　月　日
	var date=new Date(Number(datearr[0]),Number(datearr[1])-1,Number(datearr[2]));
	if(date.toString()=='Invalid Date') return false;
	return date.FormatTime('yyyy-MM-dd');
}
/**
 * 转义影响正则的字符
 */
String.prototype.encodeReg=function(){
	return this.replace(/([.*+?^=!:${}()|[\]/\\])/g,'\\$1');
}
/**
 * 企业字典翻译
 */
String.prototype.entdict=function(type){
	if(!type||type==''||!jw.entdicts||!jw.entdicts[type]||!this||this=='') return this;
	return _.findWhere(jw.entdicts[type],{key:this});
}
/**
 * 获取flash播放链接
 */
jw.flashAddr = {
       'v.youku.com' : 'http://player.youku.com/player.php/sid/FLASHVAR=/v.swf',
       'ku6.com' : 'http://player.ku6.com/refer/FLASHVAR/v.swf',
       'youtube.com' : 'http://www.youtube.com/v/FLASHVAR',
       '5show.com' : 'http://www.5show.com/swf/5show_player.swf?flv_id=FLASHVAR',
       'sina.com.cn' : 'FLASHVAR',
       'sohu.com' : 'http://v.blog.sohu.com/fo/v4/FLASHVAR',
       'mofile.com' : 'http://tv.mofile.com/cn/xplayer.swf?v=FLASHVAR',
       'tudou.com' : 'http://www.tudou.com/v/FLASHVAR',
       'music' : 'FLASHVAR',
       'flash' : 'FLASHVAR'
};
String.prototype.getFlashUrl = function(host){
	if(!jw.flashAddr[host]) return this;
	else return jw.flashAddr[host].replace(/FLASHVAR/g, this);
}
/**
 * 获取emoji图标
 */
String.prototype.getEmoji = function(){
	var str = this.toString();
	str = str.replace(/(([\u1F60-\u1F64]|[\u2702-\u27B0][\uf000-\ufe0f]|[\u2702-\u27B0]|[\u1F68-\u1F6C]|[\u1F30-\u1F70]|[\u2600-\u26ff][\uf000-\ufe0f])|[\u2600-\u26ff]|[\u2122-\u2fff]|([\uD800-\uDBFF][\uDC00-\uDFFF]))/ig, function(aa, bb){
			var emojiArr = {"😄":1,"😃":1,"😀":1,"😊":1,"☺️":1,"😉":1,"😍":1,"😘":1,"😚":1,"😗":1,"😙":1,"😜":1,"😝":1,"😛":1,"😳":1,"😁":1,"😔":1,"😌":1,"😒":1,"😞":1,"😣":1,"😢":1,"😂":1,"😭":1,"😪":1,"😥":1,"😰":1,"😅":1,"😓":1,"😩":1,"😫":1,"😨":1,"😱":1,"😠":1,"😡":1,"😤":1,"😖":1,"😆":1,"😋":1,"😷":1,"😎":1,"😴":1,"😵":1,"😲":1,"😟":1,"😦":1,"😧":1,"😈":1,"👿":1,"😮":1,"😬":1,"😐":1,"😕":1,"😯":1,"😶":1,"😇":1,"😏":1,"😑":1,"👲":1,"👳":1,"👮":1,"👷":1,"💂":1,"👶":1,"👦":1,"👧":1,"👨":1,"👩":1,"👴":1,"👵":1,"👱":1,"👼":1,"👸":1,"😺":1,"😸":1,"😻":1,"😽":1,"😼":1,"🙀":1,"😿":1,"😹":1,"😾":1,"👹":1,"👺":1,"🙈":1,"🙉":1,"🙊":1,"💀":1,"👽":1,"💩":1,"🔥":1,"✨":1,"🌟":1,"💫":1,"💥":1,"💢":1,"💦":1,"💧":1,"💤":1,"💨":1,"👂":1,"👀":1,"👃":1,"👅":1,"👄":1,"👍":1,"👎":1,"👌":1,"👊":1,"✊":1,"✌️":1,"👋":1,"✋":1,"👐":1,"👆":1,"👇":1,"👉":1,"👈":1,"🙌":1,"🙏":1,"☝️":1,"👏":1,"💪":1,"🚶":1,"🏃":1,"💃":1,"👫":1,"👪":1,"👬":1,"👭":1,"💏":1,"💑":1,"👯":1,"🙆":1,"🙅":1,"💁":1,"🙋":1,"💆":1,"💇":1,"💅":1,"👰":1,"🙎":1,"🙍":1,"🙇":1,"🎩":1,"👑":1,"👒":1,"👟":1,"👞":1,"👡":1,"👠":1,"👢":1,"👕":1,"👔":1,"👚":1,"👗":1,"🎽":1,"👖":1,"👘":1,"👙":1,"💼":1,"👜":1,"👝":1,"👛":1,"👓":1,"🎀":1,"🌂":1,"💄":1,"💛":1,"💙":1,"💜":1,"💚":1,"❤️":1,"💔":1,"💗":1,"💓":1,"💕":1,"💖":1,"💞":1,"💘":1,"💌":1,"💋":1,"💍":1,"💎":1,"👤":1,"👥":1,"💬":1,"👣":1,"💭":1,"🐶":1,"🐺":1,"🐱":1,"🐭":1,"🐹":1,"🐰":1,"🐸":1,"🐯":1,"🐨":1,"🐻":1,"🐷":1,"🐽":1,"🐮":1,"🐗":1,"🐵":1,"🐒":1,"🐴":1,"🐑":1,"🐘":1,"🐼":1,"🐧":1,"🐦":1,"🐤":1,"🐥":1,"🐣":1,"🐔":1,"🐍":1,"🐢":1,"🐛":1,"🐝":1,"🐜":1,"🐞":1,"🐌":1,"🐙":1,"🐚":1,"🐠":1,"🐟":1,"🐬":1,"🐳":1,"🐋":1,"🐄":1,"🐏":1,"🐀":1,"🐃":1,"🐅":1,"🐇":1,"🐉":1,"🐎":1,"🐐":1,"🐓":1,"🐕":1,"🐖":1,"🐁":1,"🐂":1,"🐲":1,"🐡":1,"🐊":1,"🐫":1,"🐪":1,"🐆":1,"🐈":1,"🐩":1,"🐾":1,"💐":1,"🌸":1,"🌷":1,"🍀":1,"🌹":1,"🌻":1,"🌺":1,"🍁":1,"🍃":1,"🍂":1,"🌿":1,"🌾":1,"🍄":1,"🌵":1,"🌴":1,"🌲":1,"🌳":1,"🌰":1,"🌱":1,"🌼":1,"🌐":1,"🌞":1,"🌝":1,"🌚":1,"🌑":1,"🌒":1,"🌓":1,"🌔":1,"🌕":1,"🌖":1,"🌗":1,"🌘":1,"🌜":1,"🌛":1,"🌙":1,"🌍":1,"🌎":1,"🌏":1,"🌋":1,"🌌":1,"🌠":1,"⭐️":1,"☀️":1,"⛅️":1,"☁️":1,"⚡️":1,"☔️":1,"❄️":1,"⛄️":1,"🌀":1,"🌁":1,"🌈":1,"🌊":1,"🎍":1,"💝":1,"🎎":1,"🎒":1,"🎓":1,"🎏":1,"🎆":1,"🎇":1,"🎐":1,"🎑":1,"🎃":1,"👻":1,"🎅":1,"🎄":1,"🎁":1,"🎋":1,"🎉":1,"🎊":1,"🎈":1,"🎌":1,"🔮":1,"🎥":1,"📷":1,"📹":1,"📼":1,"💿":1,"📀":1,"💽":1,"💾":1,"💻":1,"📱":1,"☎️":1,"📞":1,"📟":1,"📠":1,"📡":1,"📺":1,"📻":1,"🔊":1,"🔉":1,"🔈":1,"🔇":1,"🔔":1,"🔕":1,"📢":1,"📣":1,"⏳":1,"⌛️":1,"⏰":1,"⌚️":1,"🔓":1,"🔒":1,"🔏":1,"🔐":1,"🔑":1,"🔎":1,"💡":1,"🔦":1,"🔆":1,"🔅":1,"🔌":1,"🔋":1,"🔍":1,"🛁":1,"🛀":1,"🚿":1,"🚽":1,"🔧":1,"🔩":1,"🔨":1,"🚪":1,"🚬":1,"💣":1,"🔫":1,"🔪":1,"💊":1,"💉":1,"💰":1,"💴":1,"💵":1,"💷":1,"💶":1,"💳":1,"💸":1,"📲":1,"📧":1,"📥":1,"📤":1,"✉️":1,"📩":1,"📨":1,"📯":1,"📫":1,"📪":1,"📬":1,"📭":1,"📮":1,"📦":1,"📝":1,"📄":1,"📃":1,"📑":1,"📊":1,"📈":1,"📉":1,"📜":1,"📋":1,"📅":1,"📆":1,"📇":1,"📁":1,"📂":1,"✂️":1,"📌":1,"📎":1,"✒️":1,"✏️":1,"📏":1,"📐":1,"📕":1,"📗":1,"📘":1,"📙":1,"📓":1,"📔":1,"📒":1,"📚":1,"📖":1,"🔖":1,"📛":1,"🔬":1,"🔭":1,"📰":1,"🎨":1,"🎬":1,"🎤":1,"🎧":1,"🎼":1,"🎵":1,"🎶":1,"🎹":1,"🎻":1,"🎺":1,"🎷":1,"🎸":1,"👾":1,"🎮":1,"🃏":1,"🎴":1,"🀄️":1,"🎲":1,"🎯":1,"🏈":1,"🏀":1,"⚽️":1,"⚾️":1,"🎾":1,"🎱":1,"🏉":1,"🎳":1,"⛳️":1,"🚵":1,"🚴":1,"🏁":1,"🏇":1,"🏆":1,"🎿":1,"🏂":1,"🏊":1,"🏄":1,"🎣":1,"☕️":1,"🍵":1,"🍶":1,"🍼":1,"🍺":1,"🍻":1,"🍸":1,"🍹":1,"🍷":1,"🍴":1,"🍕":1,"🍔":1,"🍟":1,"🍗":1,"🍖":1,"🍝":1,"🍛":1,"🍤":1,"🍱":1,"🍣":1,"🍥":1,"🍙":1,"🍘":1,"🍚":1,"🍜":1,"🍲":1,"🍢":1,"🍡":1,"🍳":1,"🍞":1,"🍩":1,"🍮":1,"🍦":1,"🍨":1,"🍧":1,"🎂":1,"🍰":1,"🍪":1,"🍫":1,"🍬":1,"🍭":1,"🍯":1,"🍎":1,"🍏":1,"🍊":1,"🍋":1,"🍒":1,"🍇":1,"🍉":1,"🍓":1,"🍑":1,"🍈":1,"🍌":1,"🍐":1,"🍍":1,"🍠":1,"🍆":1,"🍅":1,"🌽":1,"🏠":1,"🏡":1,"🏫":1,"🏢":1,"🏣":1,"🏥":1,"🏦":1,"🏪":1,"🏩":1,"🏨":1,"💒":1,"⛪️":1,"🏬":1,"🏤":1,"🌇":1,"🌆":1,"🏯":1,"🏰":1,"⛺️":1,"🏭":1,"🗼":1,"🗾":1,"🗻":1,"🌄":1,"🌅":1,"🌃":1,"🗽":1,"🌉":1,"🎠":1,"🎡":1,"⛲️":1,"🎢":1,"🚢":1,"⛵️":1,"🚤":1,"🚣":1,"⚓️":1,"🚀":1,"✈️":1,"💺":1,"🚁":1,"🚂":1,"🚊":1,"🚉":1,"🚞":1,"🚆":1,"🚄":1,"🚅":1,"🚈":1,"🚇":1,"🚝":1,"🚋":1,"🚃":1,"🚎":1,"🚌":1,"🚍":1,"🚙":1,"🚘":1,"🚗":1,"🚕":1,"🚖":1,"🚛":1,"🚚":1,"🚨":1,"🚓":1,"🚔":1,"🚒":1,"🚑":1,"🚐":1,"🚲":1,"🚡":1,"🚟":1,"🚠":1,"🚜":1,"💈":1,"🚏":1,"🎫":1,"🚦":1,"🚥":1,"⚠️":1,"🚧":1,"🔰":1,"⛽️":1,"🏮":1,"🎰":1,"♨️":1,"🗿":1,"🎪":1,"🎭":1,"📍":1,"🚩":1,"🇯🇵":1,"🇰🇷":1,"🇩🇪":1,"🇨🇳":1,"🇺🇸":1,"🇫🇷":1,"🇪🇸":1,"🇮🇹":1,"🇷🇺":1,"🇬🇧":1,"1️⃣":1,"2️⃣":1,"3️⃣":1,"4️⃣":1,"5️⃣":1,"6️⃣":1,"7️⃣":1,"8️⃣":1,"9️⃣":1,"0️⃣":1,"🔟":1,"🔢":1,"#️⃣":1,"🔣":1,"⬆️":1,"⬇️":1,"⬅️":1,"➡️":1,"🔠":1,"🔡":1,"🔤":1,"↗️":1,"↖️":1,"↘️":1,"↙️":1,"↔️":1,"↕️":1,"🔄":1,"◀️":1,"▶️":1,"🔼":1,"🔽":1,"↩️":1,"↪️":1,"ℹ️":1,"⏪":1,"⏩":1,"⏫":1,"⏬":1,"⤵️":1,"⤴️":1,"🆗":1,"🔀":1,"🔁":1,"🔂":1,"🆕":1,"🆙":1,"🆒":1,"🆓":1,"🆖":1,"📶":1,"🎦":1,"🈁":1,"🈯️":1,"🈳":1,"🈵":1,"🈴":1,"🈲":1,"🉐":1,"🈹":1,"🈺":1,"🈶":1,"🈚️":1,"🚻":1,"🚹":1,"🚺":1,"🚼":1,"🚾":1,"🚰":1,"🚮":1,"🅿️":1,"♿️":1,"🚭":1,"🈷":1,"🈸":1,"🈂":1,"Ⓜ️":1,"🛂":1,"🛄":1,"🛅":1,"🛃":1,"🉑":1,"㊙️":1,"㊗️":1,"🆑":1,"🆘":1,"🆔":1,"🚫":1,"🔞":1,"📵":1,"🚯":1,"🚱":1,"🚳":1,"🚷":1,"🚸":1,"⛔️":1,"✳️":1,"❇️":1,"❎":1,"✅":1,"✴️":1,"💟":1,"🆚":1,"📳":1,"📴":1,"🅰":1,"🅱":1,"🆎":1,"🅾":1,"💠":1,"➿":1,"♻️":1,"♈️":1,"♉️":1,"♊️":1,"♋️":1,"♌️":1,"♍️":1,"♎️":1,"♏️":1,"♐️":1,"♑️":1,"♒️":1,"♓️":1,"⛎":1,"🔯":1,"🏧":1,"💹":1,"💲":1,"💱":1,"©":1,"®":1,"™":1,"❌":1,"‼️":1,"⁉️":1,"❗️":1,"❓":1,"❕":1,"❔":1,"⭕️":1,"🔝":1,"🔚":1,"🔙":1,"🔛":1,"🔜":1,"🔃":1,"🕛":1,"🕧":1,"🕐":1,"🕜":1,"🕑":1,"🕝":1,"🕒":1,"🕞":1,"🕓":1,"🕟":1,"🕔":1,"🕠":1,"🕕":1,"🕖":1,"🕗":1,"🕘":1,"🕙":1,"🕚":1,"🕡":1,"🕢":1,"🕣":1,"🕤":1,"🕥":1,"🕦":1,"✖️":1,"➕":1,"➖":1,"➗":1,"♠️":1,"♥️":1,"♣️":1,"♦️":1,"💮":1,"💯":1,"✔️":1,"☑️":1,"🔘":1,"🔗":1,"➰":1,"〰":1,"〽️":1,"🔱":1,"◼️":1,"◻️":1,"◾️":1,"◽️":1,"▪️":1,"▫️":1,"🔺":1,"🔲":1,"🔳":1,"⚫️":1,"⚪️":1,"🔴":1,"🔵":1,"🔻":1,"⬜️":1,"⬛️":1,"🔶":1,"🔷":1,"🔸":1,"🔹":1};
			if(emojiArr[aa]!=window.undefined||aa=='☺'||aa=='⌚'){
				var cc = parseInt(encodeURI(bb).split('%').slice(1).map(function(v){ return (Array(8).join(0)+parseInt(v,16).toString(2)).slice(-8) }).join().replace(/^1{2,}0|\,10/g,''),2).toString(16);
				return '<img class="jwim_emoji_input" rel="'+cc+'" src="/public/images/emoji/'+cc+'.png">';
			}
			return aa;
	});
	return str;
}

/**
 * 判断字符串中是否包含中文
 */
String.prototype.isChi=function(){
	if(/[\u4E00-\u9FA5]/gi.test(this)) return true;
	else return false;
}
/**
 * 整形（秒），转换为小时：分钟：秒 格式
 */
Number.prototype.Duration=function(){
	if(!this) return '';
	if(this<=0) return '0"';
	var minutes=Math.floor(this/60),
		second=Math.floor(this-minutes*60);
	var str=minutes>0?minutes+':'+second:second;
	return str+'"';
}
/**
 * 获取某个时间戳 是第几月 第几周
 * 返回值 number
 */
Number.prototype.monthweek = function(){
	var date = new Date( this * 1000 ),
		// w = date.getDay(),
		d = date.getDate();
	// return Math.ceil( (d + 6 - w) / 7 );
	return {week:Math.ceil( d / 7 ),month:date.getMonth()};
}
/*
* 时间转换为时间戳
* 传入（年份-月份-日期）没有算小时后面的
* */
jw.timestamp=function(data){
    var result = data.toString().split('-');
    var datum = new Date(result[0],result[1]-1,result[2]);
    datum = Date.parse(datum)/1000
    return datum;
}
/*
	传入时间戳，转换出时间戳对应的GMT时间
*/
jw.timetostamp = function(data){
	var data = Date.parse(new Date(Math.floor(data/86400)*86400*1000))/1000
	return data
}
jw.timetostamp_now = function(stamp){
	var date = new Date(stamp*1000);
    data = new Date(date.getFullYear(),date.getMonth(),date.getDate());
    var datum = Date.parse(data)/1000
    return datum
}
 /**
 * 传入开始时间戳，结束时间戳
 * 返回数组 1工作时间 2休息时间 3延长后的日期(没有转换的时间戳)
 */
jw.gettime=function(s,e,a){
	var start = parseInt(s/3600/24),end = parseInt(e/3600/24)
	var length = end - start+1
	var array = []
	array.length = length;
	for(var i=0;i<array.length;i++){
		array[i] = s+i*3600*24
	}
	var num = _.reduce(array,function(num,item){
		return num+(new Date(item*1000).getDay()==0||new Date(item*1000).getDay()==6)
	},0)
	if(a){
		var resule =0,date = ''
		for(var i=0;;i++){
			date = new Date((a+i*3600*24)*1000)
			resule+=(date.getDay()==0||date.getDay()==6)?0:1
			if(resule-1==length-num) break
		}
		return new Array(length-num,num,date)
	}else{
		return new Array(length-num,num)
	}
}
/**
* 传入开始时间戳,天数,类型
* 返回算出来结束的时间(分工作日和自然日)
*/
jw.getEndDate = function(start,days,type){
	// var startDate = new Date(start);
	if(!_.isNumber(days)||days=="") return (new Date((parseInt(start))*1000))
	var resule = 0,date = ''
	// 1工作日 2为自然日
	if(type==1){
		for(var i=0;;i++){
			date = new Date((parseInt(start)+i*86400)*1000)
			resule+=(date.getDay()==0||date.getDay()==6)?0:1;
			if(resule == days) break
		}
	}else{
		for(var i=0;;i++){
			date = new Date((parseInt(start)+i*86400)*1000)
			resule++
			if(resule == days) break
		}
	}
	return date
}
// 将时间跨度转换为分:秒格式
jw.Duration2Show=function(duration){
	if(!duration) return '';
	var minutes=Math.floor(duration/60),
		second=Math.floor(duration-minutes*60);
	var str=minutes>0?minutes+':'+second:second;
	return str+'"';
}

/**
 * 将参数拼装为链接参数格式
 */
jw.combineUrlParam=function(params){
	return _(params).map(function(item,key){
			return key+'='+item;
		}).join('&');
}
/**
 * 更新浏览器地址栏
 * params 当前链接参数
 * historyflag 是否计入history
 */
jw.updateURL=function(url){
	var rid=jw.guid();
	var state = {
		title:rid,
		url:url,
		id:'rid_'+rid
	};
	//trace(state);
	try{
		if( $.support.Ie8_9 ){
			window.location.hash = url.split('?')[1];
		}else{
			history.pushState(state, 'rid_'+rid, url); 
		}
	}catch(e){}
}
//密码等级校验
String.prototype.passRank =function(){
	var passRankNum  = ''
	if(/\d{6}/.test(this) || /[a-zA-Z]{6}/.test(this)) passRankNum = 1
	if(this.length>5 && /\d/.test(this) && (/[a-z]/.test(this)||/[A-Z]/.test(this))) passRankNum = 2
	if(this.length>5 && /\d/.test(this) && /[a-z]/.test(this) && /[A-Z]/.test(this)) passRankNum = 3
	if(this.length>5 && /\d/.test(this) && /[a-z]/.test(this) && /[A-Z]/.test(this) &&/\W/.test(this)) passRankNum = 4
	return passRankNum
}
/**
 * 获取应用ICON
 */
String.prototype.getAppsICON=function(){
	if(!this||this=='') return '';
	var icon='/public/images/appicons/';
	switch(this.toString()){
		case 'jw_app_group':
			icon+='group.png';
			break;
		case 'jw_app_dept':
			icon+='dept.png';
			break;
		case 'jw_app_poll':
			icon+='poll.png';
			break;
		case 'jw_app_project':
			icon+='project.png';
			break;
		case 'jw_app_task':
			icon+='task.png';
			break;
		case 'jw_app_file':
		case 'jw_app_files':
			icon+='file.png';
			break;
		case 'jw_n_calendar':
		case 'jw_app_calendar':
			icon+='calendar.png';
			break;
		case 'jw_app_project':
			icon+='project.png';
			break;
		case 'jw_app_joymail':
			icon+='joymail.png';
			break;
		default:
			icon+='as.png';
			break;
	}
	return icon;
};
/**
 * 根据文件类型获取对应 class
 */
String.prototype.getFileClass=function(){
	var _class='';
	if(!this||this=='') return 'fl-logo-unknown';;
	switch(this.toString().toLowerCase()){
		case 'mp4':
			_class='video';break;
		case 'pdf':
			_class='pdf';break;
		case 'xls':
		case 'xlsx':
			_class='xls';break;
		case 'ppt':
		case 'pptx':
		case 'pptm':
			_class='ppt';break;
		case 'doc':
		case 'docx':
			_class='doc';break;
		case 'jpg':
		case 'jpeg':
		case 'png':
		case 'bmp':
		case 'gif':
			_class='img';break;
		default:
			_class='unknown';break;
	}
	return 'fl-logo-'+_class;
};
/**
 * 根据文件类型获取文件 icon
 */
String.prototype.getFileIcon=function(){
	var filetype=this.toLowerCase();
	var iconUrl='';
	if( $.inArray(filetype,['jpg','bmp','png','gif'] )>-1){
		iconUrl='photo_100.png';
		// iconUrl='photo.gif';
	}else if( $.inArray(filetype,['doc','docx'] )>-1){
		iconUrl = 'doc.png';
	}else if( $.inArray(filetype,['xls','xlsx'] )>-1){
		iconUrl = 'xls.png';
	}else if( $.inArray(filetype,['ppt','pptx','pps','ppsx'] )>-1){
		iconUrl = 'ppt.png';
	}else if( $.inArray(filetype,['txt','text'] )>-1){
		iconUrl = 'txt.png';
	}else if( filetype=='ai' ){
		iconUrl = 'ai.png';
	}else if( filetype=='csv' ){
		iconUrl = 'csv.png';
	}else if( filetype=='eps' ){
		iconUrl = 'eps.png';
	}else if( filetype=='gz' ){
		iconUrl = 'gz.png';
	}else if( filetype=='log' ){
		iconUrl = 'log.png';
	}else if( filetype=='pdf' ){
		iconUrl = 'pdf.png';
	}else if( filetype=='psd' ){
		iconUrl = 'psd.png';
	}else if( filetype=='rar' ){
		iconUrl = 'rar.png';
	}else if( filetype=='rtf' ){
		iconUrl = 'rtf.png';
	}else if( filetype=='rtx' ){
		iconUrl = 'rtx.png';
	}else if( filetype=='swf' ){
		iconUrl = 'swf.png';
	}else if( filetype=='text' ){
		iconUrl = 'text.png';
	}else if( filetype=='tgz' ){
		iconUrl = 'tgz.png';
	}else if( filetype=='tif' ){
		iconUrl = 'tif.png';
	}else if( filetype=='tiff' ){
		iconUrl = 'tiff.png';
	}else if( filetype=='zip' ){
		iconUrl = 'zip.png';
	}else if( filetype=='mp4' ){
		iconUrl = 'video_2014.png';
	}else{
		iconUrl = 'file.png';
	}
	// trace('filetype['+filetype+'] iconUrl['+iconUrl+'] ' + webroot+'/public/images/fileicon/'+iconUrl);
	return webroot+'/public/images/fileicon/'+iconUrl;
}


jw.dict={
	'jw_n_image':'图片',
	'jw_n_file':'文件',
	'jw_n_as':'信息流',
	'jw_n_folder':'文件夹',
	'jw_n_doc':'文档',
	'jw_n_group':'群组',
	'jw_n_dept':'团队',
	'jw_n_topic':'话题',
	'jw_n_task':'任务',
	'jw_n_project':'项目',
	'jw_n_calendar':'日历',
	'jw_n_domain':'网络',
	'jw_app_as':'信息流',
	'jw_app_dashboard':'仪表板',
	'jw_app_topic':'话题',
	'jw_app_group':'群组',
	'jw_app_dept':'团队',
	'jw_app_task':'任务',
	'jw_app_file':'文件',
	'jw_app_files':'文件',
	'jw_app_joymail':'享邮',
	'jw_app_joychat':'悦信',
	'jw_app_engagesocial':'连接社交媒体',
	'jw_app_project':'项目',
	'jw_app_profile':'个人主页',
	'public':'公开',
	'custom':'限定范围',
	'private':'仅您自己',
	'user_mouth':'人月',
	'user_day':'人天',
	'user_hour':'工时',
	'todo_jw_task.create':'请您接受',
	'todo_jw_task.complete': '&nbsp;',
	'todo_jw_task.confirm': '待您确认完成'
};
// 翻译
String.prototype.jwtrans=function(){
	if(!jw.dict[this]) return this;
	else return jw.dict[this];
}
/**
 * pub/sub
 */
var o=$({});
$.subscribe=function(){
	o.bind.apply(o,arguments);
}
$.unsubscribe=function(){
	o.unbind.apply(o,arguments);
}
$.publish=function(){
	o.trigger.apply(o,arguments);
}

/*******************************/
/*判断浏览器是否支持placeholder*/
/*******************************/
$.support.placeholder=(function(){
	return ('placeholder' in document.createElement('input'));
})();
/*******************************/
/*判断浏览器是否是ie8或者ie9*/
/*******************************/
$.support.Ie8_9 = (function(){
	var userAgent = navigator.userAgent.toLowerCase()
	return userAgent.indexOf('msie 8.0')>-1 || userAgent.indexOf('msie 9.0')>-1
})();
/*******************************/
/*判断浏览器是否支持canvas*/
/*******************************/
$.support.canvas=(function(){
	return ('getContext' in document.createElement('canvas'));
})();

Number.prototype.getWeek=function(prefix){
	prefix=prefix||'星期';
	return prefix+['日','一','二','三','四','五','六'][this];
}

Number.prototype.getWeekNo = function(){
	return '第' + ['一','二','三','四','五'][this] + '周';
}

Number.prototype.Chi = function(){
	return ['零','一','二','三','四','五','六','七','八','九','十','十一','十二'][this];
}

Number.prototype.get12Hours=function(){
	if(this<13) return ('上午 '+this);
	else return ('下午 '+(this-12));
}

Number.prototype.FormatTime=function(format){
	return new Date(this*1000).FormatTime(format);
}

String.prototype.FormatTime=function(format){
	return new Date(this*1000).FormatTime(format);
}



/**
 * 公共函数库
 */
// 绝对时间
Date.prototype.FormatTime=function(format){
	// trace(format)
	var o = {
		"w+" : this.getDay().getWeek(), 	  //week
		"W+" : this.getDay().getWeek('周'), 	  //week
		"x+" : Math.ceil( this.getDate()/7 ),    // 第几周
		"X+" : Math.floor( this.getDate()/7 ).getWeekNo(),    // 第几周
		"M+" : this.getMonth()+1, //month
		"Z+" : (this.getMonth()+1).Chi(), // 中文月份
		"d+" : this.getDate(),    //day
		"h+" : this.getHours(),   //hour
		"H+" : this.getHours().get12Hours(),   // hour AM:PM
		"m+" : this.getMinutes(), //minute
		"s+" : this.getSeconds(), //second
		"q+" : Math.floor((this.getMonth()+3)/3),  //quarter
		"S" : this.getMilliseconds() //millisecond
	};
	if(/(y+)/.test(format)) format=format.replace(RegExp.$1,(this.getFullYear()+"").substr(4 - RegExp.$1.length));
	for(var k in o)
		if(new RegExp("("+ k +")").test(format)){
			format = format.replace(RegExp.$1,RegExp.$1.length==1 ? o[k] :("00"+ o[k]).substr((""+ o[k]).length));
		}
	return format;
}
/**
 * 相对时间
 * format 格式
 * systime 系统时间
 */
String.prototype.RelativeTime=function(format){
	var diff=jw.systime-this;
	if(diff<=60*60*5){
		// 当日时间，且与当前时间间隔小于5 小时，则显示相对时间
		if( diff < 60 ) return '刚刚';
		else if( diff < 60*60 ) return parseInt(diff/60) + '分钟前';
		else if( diff <= 60*60*5 ){
			return parseInt(diff/(60*60)) + '小时前';
		}
	}
	var format=format||'MM月dd日 hh:mm';
	if((new Date(this*1000)).getFullYear!=(new Date(jw.systime*1000)).getFullYear){
		format='yy年'+format;
	}
	return new Date(this*1000).FormatTime(format);
}
Number.prototype.RelativeTime=function(format){
	var diff=jw.systime-this;
	if(diff<=60*60*5){
		// 当日时间，且与当前时间间隔小于5 小时，则显示相对时间
		if( diff < 60 ) return '刚刚';
		else if( diff < 60*60 ) return parseInt(diff/60) + '分钟前';
		else if( diff <= 60*60*5 ){
			return parseInt(diff/(60*60)) + '小时前';
		}
	}
	var format=format||'MM月dd日 hh:mm';
	if((new Date(this*1000)).getFullYear!=(new Date(jw.systime*1000)).getFullYear){
		format='yy年'+format;
	}
	return new Date(this*1000).FormatTime(format);
}
// 把时间戳转换为对象
Date.prototype.toObject = function(){	
	return {
		y:this.getFullYear(),
		m:this.getMonth(),
		d:this.getDate(),
		h:this.getHours(),
		n:this.getMinutes(),
		s:this.getSeconds(),
		w:this.getDay()
	};
}
/**
 * Determine whether Daylight Saving Time (DST) is in effect
 * @return {Boolean} True if DST is in effect.
 */
Date.prototype.isDST = function () {
    /* TODO: not sure if this is portable ... get from Date.CultureInfo? */
    return this.toString().match(/(E|C|M|P)(S|D)T/)[2] == "D";
};

/**
 * Get the timezone abbreviation of the current date.
 * @return {String} The abbreviated timezone name (e.g. "EST")
 */
Date.prototype.getTimezone = function () {
    return Date.getTimezoneAbbreviation(this.getUTCOffset, this.isDST());
};
Date.getTimezoneOffset = function (s, dst) {
    return (dst || false) ? Date.CultureInfo.abbreviatedTimeZoneDST[s.toUpperCase()] :
        Date.CultureInfo.abbreviatedTimeZoneStandard[s.toUpperCase()];
};

Date.getTimezoneAbbreviation = function (offset, dst) {
    var n = (dst || false) ? Date.CultureInfo.abbreviatedTimeZoneDST : Date.CultureInfo.abbreviatedTimeZoneStandard, p;
    for (p in n) { 
        if (n[p] === offset) { 
            return p; 
        }
    }
    return null;
};
/**
 * 文件大小单位转换函数
 * @param filesize: 文件大小(字节)
 * @param pos: 保留小数点位数
 */
String.prototype.formatFilesize=function(pos){
	function round2(number,fractionDigits){
		with(Math){
			return round(number*pow(10,fractionDigits))/pow(10,fractionDigits);
		}
	}
	var unitname=['Y','Z','E','P','T','G','M','K'];
	var unitsize=[1024*1024*1024*1024*1024*1024*1024*1024,1024*1024*1024*1024*1024*1024*1024,
				1024*1024*1024*1024*1024*1024,1024*1024*1024*1024*1024,
				1024*1024*1024*1024,1024*1024*1024,1024*1024,1024];
	var filesize=parseInt(this);
	if(filesize<1024) return filesize+'B';
	if(typeof pos=='undefined') pos=2;
	for(var i=0;i<unitname.length;i++){
		if(filesize>unitsize[i]||filesize==unitsize[i]){
			filesize=round2((round2(filesize/unitsize[i]*100,pos)/100),pos)+unitname[i];
		}
	}
	return filesize;
}
Number.prototype.formatFilesize=function(pos){
	function round2(number,fractionDigits){
		with(Math){
			return round(number*pow(10,fractionDigits))/pow(10,fractionDigits);
		}
	}
	var unitname=['Y','Z','E','P','T','G','M','K'];
	var unitsize=[1024*1024*1024*1024*1024*1024*1024*1024,1024*1024*1024*1024*1024*1024*1024,
				1024*1024*1024*1024*1024*1024,1024*1024*1024*1024*1024,
				1024*1024*1024*1024,1024*1024*1024,1024*1024,1024];
	var filesize=parseInt(this);
	if(filesize<1024) return filesize+'B';
	if(typeof pos=='undefined') pos=2;
	for(var i=0;i<unitname.length;i++){
		if(filesize>unitsize[i]||filesize==unitsize[i]){
			filesize=round2((round2(filesize/unitsize[i]*100,pos)/100),pos)+unitname[i];
		}
	}
	return filesize;
}
/**
 * 翻译应用类型
 * 函数废弃，使用jwtrans即可
 */
String.prototype.getAppName=function(){
	var appname='';
	switch(this){
		case 'jw_app_as' :
			appname='信息流';
			break;
		case 'jw_app_file' :
			appname='文件';
			break;
		default :
			appname='';
	};
	return appname;
}
/**
 * 获取input/textarea当前光标位置
 * @param txtbox 输入框(DOM)
 * 返回值:selection={start:,end:}
 */
jw.getTextareaCursorPos=function(txtbox){
	var selection;//Start;
	if($.browser.msie){
		if(txtbox.tagName.toLowerCase()=='input'){
			// input 组件特殊处理
			var Sel = document.selection.createRange();
			Sel.moveStart ('character', -txtbox.value.length);
			start = Sel.text.length;
			selection={start:start,end:start};
			return selection;
		}
		var range = document.selection.createRange();
		if(range.parentElement().id == txtbox.id){
			// create a selection of the whole textarea
			var range_all = document.body.createTextRange();
			range_all.moveToElementText(txtbox);
			// 两个range，一个是已经选择的text(range)，一个是整个textarea(range_all)
			//range_all.compareEndPoints()比较两个端点，如果range_all比range更往左(further to the left)，则
			// 返回小于0的值，则range_all往右移一点，直到两个range的start相同。
			// calculate selection start point by moving beginning of range_all to beginning of range
			for (start=0; range_all.compareEndPoints("StartToStart", range) < 0; start++) range_all.moveStart('character', 1);
			// get number of line breaks from textarea start to selection start and add them to start
			// 计算一下\n
			// for (var i=0;i<=start;i++){
				// if (txtbox.value.charAt(i) == '\n') start++;
			// }
			// create a selection of the whole textarea
			var range_all = document.body.createTextRange();
			range_all.moveToElementText(txtbox);
			// calculate selection end point by moving beginning of range_all to end of range
			for (end = 0; range_all.compareEndPoints('StartToEnd', range) < 0; end ++) range_all.moveStart('character', 1);
			// get number of line breaks from textarea start to selection end and add them to end
			for (var i = 0; i <= end; i ++){
				if (txtbox.value.charAt(i) == '\n') end ++;
			}
		}
		selection={start:start,end:end};
	}else{
		selection={start:txtbox.selectionStart,end:txtbox.selectionEnd};
	}
	return selection;
}
/**
 * 移动滚动条到指定位置
 * node 标签 $对象
 * offsettop 高度校准
 */
jw.AdjustScrollPos=function(node,offsettop,speed){
	var offset;
	if(node){
		offset=node.offset();
		if(offset!=window.undefined){
			if(offsettop) offset.top=offset.top-offsettop;
		}else{
			offset={top:0};	
		}
	}else{
		offset={top:0};
	}
	if(!speed) speed=800;
	if($.browser.safari){
		if(speed==0) $(document.body).attr('scrollTop',offset.top);
		else $(document.body).animate({scrollTop:offset.top},speed);
	}else{
		// document.documentElement.scrollTop=offset.top-30;
		// document.body.scrollTop=offset.top-30;
		// $(document.body).attr({scrollTop:offset.top-30});
		if(speed==0){
			$(document.documentElement).attr({scrollTop:offset.top-30});
			$(document.body).attr({scrollTop:offset.top-30});
		}else{
			$(document.documentElement).animate({scrollTop:offset.top-30},speed);
			$(document.body).animate({scrollTop:offset.top-30},speed);
		}
	}
}

/**
 * 将图片居中显示
 * container={width,height}
 * target={width:,height}
 */
jw.PosImageCenter=function(container,target){
	var scale;
	if(target.width/target.height>container.width/container.height){
		// 以宽度算比例
		scale=target.width/container.width;
	}else{
		// 以高度算比例
		scale=target.height/container.height;
	}
	return {left:(container.width-target.width)*scale/2+'px',top:(container.height-target.height)*scale/2+'px'};
}

//获取鼠标点击在屏幕中的位置
jw.getMousePosition=function(evt){
	var posx = 0;
	var posy = 0;
	if (!evt) var evt = window.event;
	if (evt.pageX || evt.pageY) {
		posx = evt.pageX;
		posy = evt.pageY;
	}else if (evt.clientX || evt.clientY) {
		posx = evt.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		posy = evt.clientY + document.body.scrollTop  + document.documentElement.scrollTop;
	}
	return { 'x': posx, 'y': posy };
}

/**
 * 通过文件扩展名获取文件 icon
 * param filetype 文件扩展名
 * return logo url
 */
jw.getFileIcon=function(filetype){
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
	}else{
		iconUrl = '/public/images/fileicon/file.png';
	}
	// trace('filetype['+filetype+'] iconUrl['+iconUrl+']');
	return iconUrl;
}

/**
 * 获取浏览器窗口尺寸
 * @return {width:,height:}
 */
jw.findDimensions=function(){
	//获取窗口宽度
	if(window.innerWidth) winWidth=window.innerWidth;
	else if((document.body)&&(document.body.clientWidth))
		winWidth=document.body.clientWidth;
	//获取窗口高度
	if(window.innerHeight) winHeight=window.innerHeight;
	else if((document.body)&&(document.body.clientHeight))
		winHeight=document.body.clientHeight;
	/*nasty hack to deal with doctype swith in IE*/
	//通过深入Document内部对body进行检测，获取窗口大小
	if(document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth){
		winHeight=document.documentElement.clientHeight;
		winWidth=document.documentElement.clientWidth;
	}
	return {width:winWidth,height:winHeight};
}
/**
 * 标签云组件
 */
jw.tagCloud = function(options){
	var tags = options.length,
		x=options.length%10,
		minnum=Math.ceil(options.length/10)
		num = 0;
	if(options.length!=0){
	return (_(options).chain()
		.map(function(arr){
			arr.weight = arr.stystems*1 +arr.users*3
			return arr})
		.sort(function(a,b){return b.weight-a.weight})
		.map(function(arr){
			arr.index = num++
			var str=arr.index<x*minnum?Math.floor(arr.index/minnum):Math.floor((arr.index%tags-(x*minnum))/Math.floor(tags/10))+x;
			arr.classname='lev-'+(str+1)
			return arr
		})
		.sortBy(function(arr){return 0.5 - Math.random()})
		.map(function(arr){
			return '<a class="jw-tag '+arr.classname+'" href="'+basurl+'/topic?topic='+arr.name+'">'+arr.name+'</a>'
		}).value())
	}else{
		return '<span style="color:#b0b0b0;font-size:13px;">暂无数据</span>'
	}
}
/**
 * button话题
*/
jw.other_topie = function(data){
    var html = data.length!=0?_.map(data,function(item){
        return '<a href="'+basurl+"/topic?topic="+item[0]+'"><button type="button" class="jw-btn4 jw-btn ellipsis" style="max-width:150px;display:inline-block">'+item[0]+'</button></a>'
    }).join(''):'<span style="color:#b0b0b0;">您没有参加其他话题</span>'
    return html
}

/**
 * 异步加载图片
 */
jw.loadimg=function(url,callback){
	var img = new Image(); 				// 创建一个Image对象，实现图片的预下载

	img.onload = function () { 			// 图片下载完毕时异步调用callback函数。
		callback(img);
	};
	img.src = url;
	if(img.complete) { 				// 如果图片已经存在于浏览器缓存，直接调用回调函数
		callback(img);
		return; 						// 直接返回，不用再处理onload事件
	}
}
/**
 * 简单翻页组件
 * options
 * 		style:0 <>,1 首页 < 下一页
 * 		pageno:当前页码
 * 		pagesize:每页条数
 * 		num:总数
 *		model
 */
/*
$(function(){
	new jw.SimplePagination({
		el:$('#pn-demo'),
		pageno:0,
		pagesize:10,
		num:100,
		style:1
	})
})
*/
/*
jw.SimplePagination=Backbone.View.extend({
	initialize:function(options){
		this._options={
			style:1
		};
		_.extend(this._options,options);
		Backbone.View.prototype.initialize.call(this,arguments);
		// this.model=new jw.M_Pagination(this._options);
		this.initDOM();
		this._bindEvt();
	},
	initDOM:function(){
		this._container=$('<div class="page-style-'+this._options.style+'"></div>');
		$(this.el).append(this._container);
		this._pages = Math.ceil(this.num/this.pagesize);
		this.addBtns()
	},
	addBtns:function(){
		if(this._options.style==0){
			
		}else if(this._options.style==1){
			this._container.append('<div class="pn-first-1"><span class="pn-txt">回到首页</span></div><div class="pn-prev-1"><span class="sml-btn-l"></span></div><div class="pn-next-1"><span class="pn-txt">下一页</span><span class="sml-btn-r"></span></div>');
			this._firstbtn=this._container.find('.pn-first-1');
		}
		this._prevbtn=this._container.find('.pn-prev-1');
		this._nextbtn=this._container.find('.pn-next-1');
		this.setPageBtnStatus();
	},
	_bindEvt:function(){
		var self=this;
		_.bindAll(this,'prevPage','nextPage','firstPage','setPageBtnStatus');
		this._prevbtn.click(function(){
			if(!$(this).hasClass('disabled')){
				$(this).addClass('disabled');
				self._nextbtn.addClass('disabled');
				self.prevPage();
			}
		});
		this._nextbtn.click(function(){
			if(!$(this).hasClass('disabled')){
				$(this).addClass('disabled');
				self._prevbtn.addClass('disabled');
				self.nextPage();
			}
		});
		this._firstbtn && this._firstbtn.click(this.firstPage);
		this.model.bind('change:pageno',this.setPageBtnStatus);
	},
	prevPage:function(){
		this.model.set({pageno:(this.model.get('pageno')-1)});
	},
	nextPage:function(){
		this.model.set({pageno:(this.model.get('pageno')+1)});
	},
	// 回到首页
	firstPage:function(){
		this.model.set({pageno:0});
	},
	// 设置按钮disable/enable状态
	setPageBtnStatus:function(){
		trace('setPageBtnStatus');
		trace(this.model.toJSON());
		if(this.model.get('pageno')>=this._pages) this._nextbtn.addClass('disabled');
		else if(this._nextbtn.hasClass('disabled')) this._nextbtn.removeClass('disabled');
		
		if(this.model.get('pageno')==0){
			this._prevbtn.addClass('disabled');
			this._firstbtn && this._firstbtn.addClass('hide');
		}else{
			if(this._prevbtn.hasClass('disabled')){
				this._prevbtn.removeClass('disabled');
			}
			if(this._firstbtn){
				if(this.model.get('pageno')>1) this._firstbtn.removeClass('hide');
				else this._firstbtn.addClass('hide');
			}
		}
		!this._nextbtn.hasClass('disabled') && this._nextbtn.attr('title','第'+(this.model.get('pageno')+2)+'页');
		!this._prevbtn.hasClass('disabled') && this._prevbtn.attr('title','第'+this.model.get('pageno')+'页');
	},
	remove:function(){
		this._container.remove();
	}
});
*/
/** 
 * 燕尾过滤器 Collection
 * jw.C_Dovetail=Backbone.Collection.extend({});
 * 燕尾过滤器视图
 */
jw.DovetailView=Backbone.View.extend({
	className:'as-dovetail-w',
	events:{
		"click .dovetail-remove-btn":"removeFilter"
	},
	initialize:function(){
		this.asmodel=this.options.asmodel;
		_.bindAll(this,'addOne','removeFilter','remove');
		this.collection.bind('add',this.addOne);
		var self = this;
		$('#as-user-detail-close').click(function(){
			self.removeFilter('1', $(this) )
		});
	},
	addOne:function(model){
		if( model.get('id')!='author' ){
			$(this.el).append('<div class="dovetail" action-type="'+model.get('id')+'" action-data="'+model.get('key')+'"><u></u><span class="dovetail-txt">'+model.get('name')+'</span><span class="dovetail-remove-btn"></span><i></i></div>');
		}
		if($(this.el).find('.dovetail').length>0){
			$(this.el).addClass('actived');
		}
		$('#as-user-detail-close').attr('action-type', model.get('id'));
		this.trigger('add',model.toJSON());
	},
	removeFilter:function(evt, el){
		var btn=$(evt.target).closest('.dovetail');
		if(el!=window.undefined) btn = el;
		var model=this.collection.get({id:btn.attr('action-type')});
		var data=model.toJSON();
		this.collection.remove(model);
		if(el==window.undefined) btn.remove();
		if($(this.el).find('.dovetail').length==0) $(this.el).removeClass('actived');
		this.trigger('remove',data);
	},
	clear:function(){
		if($(this.el).find('.dovetail').length>0){
			this.collection.reset();
			$(this.el).removeClass('actived').find('.dovetail').remove();
		}
	}
})

/************************************************************************
|    函数名称： BaseInput                                                	   |
|    函数功能：初始化一个input输入框                                           |
|    入口参数： tip:默认提醒文字 style:设置input的高度(0为29px 1为35px)        |
*************************************************************************/
jw.BaseInput = Backbone.View.extend({
	initialize:function(options){
		//style 为样式 29px或者35px 默认为0;
		var self = this;
		_.extend(this, _.pick(options, ['tip','style']));
		_.bindAll(this,'_change','onFocus', 'onBlur', 'onKeydown','click','_TipControll');
		if($(this.el).is('input')){
			this._input=$(this.el);
		}else{
			if($(this.el).find('input').length==0){
				var str ="input-base "
				if(this.style==1){
					str+='input-base-b'
				}
				$(this.el).append('<input type="text" class="'+str+'" value="" />');
			}
			this._input=$(this.el).find('input');
		}		
		// if(this.tip&&this.tip!='') this._input.attr('placeholder',this.tip);
		if(this.tip&&this.tip!=''){
			if(this.tip&&this.tip!=''&&!$.support.placeholder) this._TipControll(this._input);
			else{
				this._input.attr('placeholder',this.tip);
			}
		}
		setTimeout(function(){
			self._bindEvt();
		},0)
	},
	_bindEvt:function(){
		var self=this;
		this._input.bind('input propertychange',this._change).focus(this.onFocus).blur(this.onBlur).bind('keydown',this.onKeydown).bind('click',this.click);
		// if(this.tip&&this.tip!=''&&!$.support.placeholder) this._TipControll(this._input)
		if($.support.Ie8_9) this._ieChange()
	},
	_change:function(){
		if($.support.Ie8_9){
			var self = this;
			setTimeout(function(){
				if(self._input.val()!=self.tip){
					self.trigger('change',self._input.val());
				}
			},0);
		}else{
			this.trigger('change',this._input.val())
		}
	},
	onFocus:function(evt){
		this.trigger('focus',evt);
	},
	onBlur:function(str){
		this.trigger('onBlur',this._input.val());
	},
	onKeydown:function(evt){
		this.trigger('keydown',evt);
	},
	click:function(evt){
		this.trigger('click',evt);
		evt.stopPropagation()
	},
	// IE 浏览器 PlaceHolder 控制
	_TipControll:function(str){
		var self=this;
		this._input = str;
		this._input.focus(function(){
			$(this).val()==self.tip && $(this).val('')
			$(this).removeClass('input-ie-color')
		});
		this._input.blur(function(){
			$(this).val()=='' && $(this).val(self.tip) && $(this).addClass('input-ie-color')
		});
		if(this._input.val()==''){
			this._input.val(this.tip);
			this._input.addClass('input-ie-color');
		}
	},
	_ieChange:function(){//解决ie下面value change改变 8回退 46删除 (ctrl+88 ctrl+x)
		var self =this;
		this._input.bind('keyup',function(event){
			if(event.keyCode==8||event.keyCode==46||(event.ctrlKey&&event.keyCode==88)){
				self._change()
			}
		})
	},
	getTxt:function(){
		return this._input.val();
	},
	getText:function(){
		return this.getTxt();
	},
	setTxt:function(str,options){
		this._input.val(str);
		if(options&&options.silent){
			// 不触发change事件
			// trace('silent')
		}else{
			this.trigger('change',str);
		}
		return this;

	},
	setTip:function(tip){
		if($.support.placeholder) this._input.attr('placeholder',tip)
		return this;
	},
	setFocus:function(){
		this._input.focus()
	},
	setBlur:function(){
		this._input.blur()
	},
	// 移动光标到最后
	moveCursorLast:function(){
		var pos=this._input.val().length;
		// if(document.createTextRange){
		if($.support.Ie8_9){
			var range=this._input[0].createTextRange();
			range.move("character", pos);
			range.select();
		}else{
			this._input[0].select();
			this._input[0].selectionStart=pos;
			this._input[0].selectionEnd=pos;
		}
		return this;
	}
});
/************************************************************************
|    函数名称：input输入组件                                                 |
|    函数功能：定制一个input输入框                                           |
*************************************************************************/
jw.input=jw.BaseInput.extend({
	initialize:function(options){
		this._options={
			inittype:0,//是否有外面双层的div
			status:'normal',//设置状态
			style:0,//默认0 35 否则1 29
			shadow:0,//定制是否有shadow
			tip:'',//默认提醒的值
			type:'text',
			_default:'',		// 默认值
			maxlength:''
		};
		_.extend(this, _.pick(_.extend(this._options,options), ['inittype','tip','style','status','shadow','type','_default','maxlength']));
		if(this.inittype==0){
			// 还没有初始化	
			var str ='input-w'
			// if(this.style !=0){
			if(this.style==1){
				str += ' input-w-s'
			}
			if(this.shadow ==1){
				str +=' shadow'
			}
			$(this.el).append('<div class="'+str+'"><div class="input-co"><input type="'+this.type+'" class="input-d" placeholder="'+this.tip+'" value="'+this._default+'" '+(this.maxlength&&!isNaN(this.maxlength)?'maxlength="'+this.maxlength+'"':'')+'/></div></div>');
		}
		this._wrap=$(this.el).find('.input-w');
		jw.BaseInput.prototype.initialize.call(this,options);
		this.setStatus();
	},
	setStatus:function(status){
		var self = this
		this.status=status||this.status;
		if(this.status=='disabled') this._input.attr('disabled','disabled'),
			this._wrap.removeClass('shadow');
		else this._input.removeAttr('disabled');
		if(this.status=='readonly') this._input.attr('readonly','readonly');
		else this._input.removeAttr('readonly');
		if(this.shadow == 0) this._wrap.removeClass('shadow')
		this._wrap.removeClass('error normal readonly disabled passed').addClass(this.status);
		return this;
	},
	// 当前输入栏是否可输入状态
	isEnable:function(){
		return !this._input.attr('disabled');
	},
	// 设置输入栏风格：normal/error
	setStyle:function(style){
		if(style=='error'){
			this._wrap.removeClass('normal').addClass(style);	
		} 
		else if(style=='normal') this._wrap.removeClass('error').addClass(style);
	},
	onFocus:function(){
		this._wrap.addClass('focused');
		jw.BaseInput.prototype.onFocus.call(this);
	},
	onBlur:function(){
		this._wrap.removeClass('focused');
		jw.BaseInput.prototype.onBlur.call(this);
	},
	// 临时改变样式使用
	changeStyle:function(){
		if(this._wrap.hasClass('input-w-s')) this._wrap.removeClass('input-w-s');
		else this._wrap.addClass('input-w-s');
	},
	/*_change:function(){
		jw.BaseInput.prototype._change.call(this)
		// this.setStatus('normal')
	},*/
	errorAlert:function(){
		var self=this;
		self.alert_num=0;
		this.alert_handle=setInterval( function(){
			if(self._wrap.hasClass('error')) self._wrap.removeClass('error');
			else self._wrap.addClass('error');
			self.alert_num++;
			if(self.alert_num==4) window.clearInterval(self.alert_handle);
		}, 250);
	}
});
jw.passwdInput = jw.input.extend({
	initialize:function(options){
		this._options={
			inittype:0,//是否有外面双层的div
			status:'normal',//设置状态
			style:0,//默认0 35 否则1 29
			shadow:0,//定制是否有shadow
			tip:'',//默认提醒的值
			type:'text',
			_default:'',		// 默认值
			maxlength:''
		};
		_.extend(this, _.pick(_.extend(this._options,options), ['inittype','tip','style','status','shadow','type','_default','maxlength']));
		if(this.inittype==0){
			// 还没有初始化	
			var str ='input-w'
			// if(this.style !=0){
			if(this.style==1){
				str += ' input-w-s'
			}
			if(this.shadow ==1){
				str +=' shadow'
			}
			if($.support.Ie8_9){
				$(this.el).append('<div class="'+str+'"><div class="input-co ie-input-c"><span class="ie_tip">'+this.tip+'</span><input type="'+this.type+'" class="input-d"'+(this.maxlength&&!isNaN(this.maxlength)?'maxlength="'+this.maxlength+'"':'')+'/></div></div>');
			}else{
				$(this.el).append('<div class="'+str+'"><div class="input-co"><input type="'+this.type+'" class="input-d" placeholder="'+this.tip+'" value="'+this._default+'" '+(this.maxlength&&!isNaN(this.maxlength)?'maxlength="'+this.maxlength+'"':'')+'/></div></div>');
			}
		}
		this._wrap=$(this.el).find('.input-w');
		jw.BaseInput.prototype.initialize.call(this,options);
		this.setStatus();
	},
	_TipControll:function(){
		var self=this;
		this._span = this.$el.find(".ie_tip")
		this._span.click(function(){
			self._span.addClass('hide')
			self._input.focus().removeClass('input-ie-color')
		})
		this._input.focus(function(){
			self._span.addClass('hide')
			self._input.removeClass('input-ie-color')
		});
		this._input.blur(function(){
			$(this).val()==''&& $(this).addClass('input-ie-color')&& self._span.removeClass('hide')
		});
	}
})
/**
 * 搜索输入框控制
 */
jw.inputSearch=jw.input.extend({
	initialize:function(options){
		_.bindAll(this,'onSearch');
		jw.input.prototype.initialize.call(this,options);
		this._initDOM();
	},
	_initDOM:function(){
		var self=this;
		this._wrap.addClass('jw-searchinput').prepend('<div class="jw-searchinput-ic"><div class="jw-searchinput-i"></div></div>')
		this.searchbtn=this._wrap.find('.jw-searchinput-ic');
		this.searchbtn.click(this.onSearch);
		this.bind('change',function(){
			self.searchbtn.removeClass('searching');
		})
	},
	onKeydown:function(evt){
		if(evt.keyCode==13) this.onSearch();
	},
	onSearch:function(){
		// if(this.searchbtn.hasClass('searching')){
		// 	this.restore();
		// 	return;
		// }
		var str=$.trim(this.getTxt());
		if(str=='') return;
		this.trigger('search',str);
		// this.searchbtn.addClass('searching');
	},
	restore:function(){
		this.setTxt('');
		// this.searchbtn.removeClass('searching');
	}
});
/**
 * 有放大镜的搜索组件
 */
jw.inputSearchComplex=jw.inputSearch.extend({
	onSearch:function(){
		if(this.searchbtn.hasClass('searching')){
			this.restore();
			return;
		}
		jw.inputSearch.prototype.onSearch.call(this);
		this.searchbtn.addClass('searching');
	},
	restore:function(){
		jw.inputSearch.prototype.restore.call(this);
		this.searchbtn.removeClass('searching');
	}
})


/**************************************************************/
/*					进度条									  */
/**************************************************************/
jw.BaseProBar = Backbone.View.extend({
	initialize:function(options){
		this.inputOptions = ['style','initval'];
		this._options={
			initval:10
		}
		_.extend(this, _.pick(_.extend(this._options,options), this.inputOptions));
		this._probar = $(this.el);
		this._probar.append('<div class="probar-w"><div class="probar-c"></div></div>');
		this._probarw = this._probar.find('.probar-w');
		this._probarc = this._probarw.find('.probar-c');
		this._width = this._probar.width();
		this._height= this._probar.height();
		this._initstyle();
	},
	_initstyle:function(){
		this._probarw.addClass('probar-w0').css({'border-radius':this._height+'px'});//这是圆角为高度的，椭圆形
		this._probarc.css({'border-radius':this._height+'px'});//这是圆角为高度的，椭圆形
		this._probarw.append('<div class="probar-percent" style="line-height:'+this._height+'px;" ></div>');			
		this.setPost({val:this.initval});
	},
	setPost:function(model){
		if(100>=model.val>=0){
			this._probarw.find('.probar-percent').html(model.val+'%');
			if(model.val == 100){
				this._probarc.css({width:'auto'})
			}else{
				this._probarc.css({width:model.val+'%'});
			}
		}
	}
});

jw.PartProbar = jw.BaseProBar.extend({
	initialize:function(options){
		this.inputOptions = ['initval','partnum','list','cansel','type'];
		this._options={
			initval:2,
			partnum:5,
			list:[],
			cansel:1
		};
		_.extend(this,_.pick(_.extend(this._options,options), this.inputOptions));
		jw.BaseProBar.prototype.initialize.call(this,_.extend(options,{}));
	},
	_initstyle:function(){

		var self = this;
			self.partnum = self.list.length>0?self.list.length:self.partnum;//分几段
		var partwidth=this._width/this.partnum;//每段的长度
		var cansel = this.cansel==0?'unsel':'cansel';//是佛可以点击
		this._probarw.addClass('probar-w1').css({'border-radius':this._height+'px'});//设置圆角
		var str = _.reduce(_.range(1,1+this.partnum),
			function(memo,i){
				return memo+'<li class="probar-part'+i+' probar-border-right-unsel '+cansel+'" action-data="'+i+'" style="width:'+(partwidth-1)+'px;">'+(self.list.length?('<div style="line-height:'+(self._height+2)+'px;">'+self.list[i-1].val+'</div>'):'')+'</div></li>';},'');
		//this._probarc.append('<ul style="list-style:none"></ul>').find('ul').append(str).find('li').first().css({'border-radius':self._height+'px 0 0 '+self._height+'px'});
		//-------------------------------
		this._probarc.html('<ul style="list-style:none">'+str+'</ul>').find('li').first().css({'border-radius':self._height+'px 0 0 '+self._height+'px'});
		//--------------------------------------
		this._probarc.find('ul li').last().css({'border-radius':'0 '+self._height+'px '+this._height+'px 0'});
		this.setPost({val:self.initval});
		this._canSelHandler();
		delete cansel;
	},
	_canSelHandler:function(){//设置可选
		var self = this;
		if(this.cansel == 0){
			this._probarc.find('ul li.cansel').removeClass('cansel').addClass('unsel');
			this._probarc.undelegate('ul li','click');
		}else{
			this._probarc.find('ul li.unsel').removeClass('unsel').addClass('cansel');
			this._probarc.delegate('ul li','click',function(){
				self.trigger('probar-click',{val:$(this).attr('action-data')});
			});
		}
	},
	setCansel:function(model){//
		var self = this;
		if(model.cansel != self.cansel){
			this.cansel = model.cansel;
			self._canSelHandler();
		}
	},
	setPost:function(model){
		var self = this;
		self.unbind('probar-click',self.setPost);
		if(this.type!=1){
			if(!self._preSel){
				self._setStyle(model);
			}else{
				self._clearStyle(model);
			}
		}else{
			this.addprogress(model.val)
		}
	},
	_clearStyle:function(model){
		var self=this;
		if(model.val != self._preSel){
			self._animatePart(self._probarc.find('.probar-part'+self._preSel),self._probarc.find('.probar-part'+model.val),model);
			self._probarc.find('.probar-part'+self._preSel).removeClass('probar-border-right-sel probar1-sel').addClass('probar-border-right-unsel');
			self._probarc.find('.probar-part'+(self._preSel-1)).removeClass('probar-border-right-sel').addClass('probar-border-right-unsel');	
		}else{
			self.bind('probar-click',this.setPost);
		}
	},
	_animatePart:function(p1,p2,model){
		var self = this;
		var animate_css = {};
		var x=p1.clone(),
			offset_p1=p1.offset(),
			offset_p2=p2.offset();
		x.html('').addClass('probar-clone').css({height:self._height,left:offset_p1.left+'px',top:offset_p1.top+'px'}).appendTo('body');
		
		if(x.attr('action-data') == 1){
			if(model.val == self.partnum){
				animate_css = {'border-top-left-radius':'0px','border-bottom-left-radius':'0px','border-top-right-radius':self._height+'px','border-bottom-right-radius':self._height+'px'};
			}else{
				animate_css = {'border-top-left-radius':'0px','border-bottom-left-radius':'0px'};
			}
		}else if(x.attr('action-data') == self.partnum){
			if(model.val == 1){
				animate_css = {'border-top-right-radius':'0px','border-bottom-right-radius':'0px','border-top-left-radius':self._height+'px','border-bottom-left-radius':self._height+'px'};
			}else{
				animate_css = {'border-top-right-radius':'0px','border-bottom-right-radius':'0px'};
			}
		}else{
			if(model.val == 1){
				animate_css = {'border-top-left-radius':self._height+'px','border-bottom-left-radius':self._height+'px'};
			}else if(model.val == self.partnum){
				animate_css = {'border-top-right-radius':self._height+'px','border-bottom-right-radius':self._height+'px'};
			}else{
				animate_css = {};
			}
		}
		_.extend(animate_css,{left:offset_p2.left+'px'});
		x.animate(animate_css,500,function(){
			x.remove();
			self._setStyle(model);
		});
	},
	_setStyle:function(model){
		var self=this;
		if(self.partnum>=model.val>0 && model.val!=self._preSel){
			self._preSel = model.val;
			self._probarc.find('.probar-part'+model.val).removeClass('probar-border-right-unsel').addClass('probar1-sel probar-border-right-sel');
			self._probarc.find('.probar-part'+(model.val-1)).removeClass('probar-border-right-unsel').addClass('probar-border-right-sel');
			self.trigger('probar-set',model.val);
		}
		self.bind('probar-click',this.setPost);
	},
	addprogress:function(num){
		_.each(this._probarc.find('li'),function(item,index){
			if(index+1<=num) $(item).addClass('probar1-sel')
		})
	}
})
// jw.PartProbar2 = jw.BaseProBar.extend({
// 	initialize:function(options){
// 		this.inputOptions = ['num'];
// 		this._options={
// 			initval:2,
// 			partnum:5,
// 			list:[],
// 			cansel:1
// 		};
// 		_.extend(this,_.pick(_.extend(this._options,options),this._inputOptions))
// 		jw.BaseProBar.prototype.initialize.call(this,_.extend(options,{}));
// 	}
// })
// 浮出栏相关组件 start
/**
 * 弹出窗口管理
 * 负责Joywok Dialog/Dropdown List的管理，不负责富提示栏、名片的管理(hover)
 */
jw.fdmng={
	dialogs:[],
	dropdowns:[],
	init:function(){
		var self=this;
		$(document).keydown(function(evt){
			evt.keyCode==27 && self.hideLastEscape();
		})
	},
	/**
	 * 添加一个窗口 
	 * dlgHandle 弹出窗口的句柄
	 */
	show:function(dlgHandle){
		this.dialogs.push(dlgHandle);
	},
	hide:function(dlgHandle){
		if(!dlgHandle) return;
		dlgHandle.mngClose && dlgHandle.mngClose();
		this.removeRegister(dlgHandle);
	},
	removeRegister:function(dlgHandle){
		this.dialogs=_.filter(this.dialogs, function(item){return !_.isEqual(dlgHandle, item);})
	},
	hideLastEscape:function(){
		this.hide(_.last(this.dialogs));
	}
}

jw.fdmng.init();


/*
 * 享邮调用
 * 		type    0: 读取享邮  1: 发送邮件
 * new jw.Jmail({type:0, id: '享邮ID', btn: $('动画起源') });
 *
 * 邮件调用
 * new jw.Jmail({type:1, mailinfo: options });
 *		options:  {	
 							[ id: 5wxN5OKoZAr7TnFs ]
							recipient: [{id, name, email}],  收件人
							bcc:[],  抄送
							cc:[],   密抄
							subject: '', 主题
							content:'', 内容,
							attaches_list: Array[{id, file_type, append, show_name, exe_name ....}],  邮件
						}
 * 
 */
jw.Jmail=Backbone.View.extend({
	initialize: function(options){
		if(typeof jw.joyMail=='undefined'){
			$('body').append('<div class="joymail_js_loading" id="joymail_js_loading"><div class="joymail_js_loader" id="joymail_js_loader"></div><span>正在加载程序文件...</span></div>');
			$('#joymail_js_loading').css({left:$(window).width()/2-$('#joymail_js_loading').width()/2, top:$(window).height()/2-$('#joymail_js_loading').height()/2});
			new jw.loading( $('#joymail_js_loader') );
			async.parallel([
				function(re){
					$.get('/public/styles/jwjoymail_fh.css', function(d){
						$('head').append('<style>'+d+'</style>');
						re();
					});
				},
				function(re){
					$.getScript('/public/scripts/jw.joymail_fh.js', function(){
						re();
					});
				}
			], function(er, re){
				$('#joymail_js_loading').remove();
				if(options.type==1){
			        new jw.joyMail({ mailType:'newMail', mailinfo:options.mailinfo});
				}else{
					new jw.joyMail({mailType:'list', 'id':options.id});
				}
			});
		}else{
			if(options.type==1){
		        new jw.joyMail({ mailType:'newMail', mailinfo:options.mailinfo});
			}else{
				new jw.joyMail({mailType:'list', 'id':options.id});
			}
		}
	}
});
jw.Jtask=Backbone.View.extend({
	initialize: function(options){
		if(typeof jw.task_new=='undefined'){
			$('body').append('<div class="joymail_js_loading" id="joymail_js_loading"><div class="joymail_js_loader" id="joymail_js_loader"></div><span>正在加载程序文件...</span></div>');
			$('#joymail_js_loading').css({left:$(window).width()/2-$('#joymail_js_loading').width()/2, top:$(window).height()/2-$('#joymail_js_loading').height()/2});
			new jw.loading( $('#joymail_js_loader') );
			async.parallel([
				function(re){
					Backbone.sync('read',null,{url:basurl+'/header/task/',success:function(resp){
						if(resp){
							window.space_select = _.map(resp['space'],function(item){
							        return eval("("+'{key:"'+(item)+'",txt:"'+item+'"}'+")")
							    });
						    window.category_select = _.map(resp['category'],function(item){
							        return eval("("+'{key:"'+(item)+'",txt:"'+item+'"}'+")")
							    });
						    window.category_to = _.map(resp['category2'],function(item){
							        return eval("("+'{key:"'+(item)+'",txt:"'+item+'"}'+")")
							    });
						    window.space2 = _.map(resp['space2'],function(item){
							        return eval("("+'{key:"'+(item)+'",txt:"'+item+'"}'+")")
							    });
						    window.space2.unshift({key:'all',txt:'请选择'})
						    window.category_to.unshift({key:'all',txt:'全部'});
							$.get('/public/scripts/jw.task.js', function(d){
								re();
							});
						}
					}})
				}
			], function(er, re){
				$('#joymail_js_loading').remove();
				new jw.task_new();
			});
		}else{
			new jw.task_new();
		}
	}
});
jw.Jporject = Backbone.View.extend({
	initialize: function(options){
		if(typeof jw.new_proect=='undefined'){
			$('body').append('<div class="joymail_js_loading" id="joymail_js_loading"><div class="joymail_js_loader" id="joymail_js_loader"></div><span>正在加载程序文件...</span></div>');
			$('#joymail_js_loading').css({left:$(window).width()/2-$('#joymail_js_loading').width()/2, top:$(window).height()/2-$('#joymail_js_loading').height()/2});
			new jw.loading( $('#joymail_js_loader') );
			async.parallel([
				function(re){
					Backbone.sync('read',null,{url:basurl+'/header/project',success:function(resp){
						console.log(resp)
						if(resp){
							console.log(resp)
							window.template = _.map(resp['template'],function(item){
							        return eval("("+'{key:"'+(item['id'])+'",txt:"'+item['name']+'",id:"'+item['id']+'"}'+")")
							    });
							window.template.unshift({key:"0",id:"0",txt:"选择里程碑模板"})
							window.categorys = _.map(resp['categorys'],function(item){
							        return eval("("+'{key:"'+(item)+'",txt:"'+item+'"}'+")")
							    });
							window.categorys.unshift({key:'0',txt:'全部'})
							window.cates = _.map(resp['cates'],function(item){
							        return eval("("+'{key:"'+(item)+'",txt:"'+item+'"}'+")")
							    });
							window.cates.unshift({key:'0',txt:'全部'})
							window.team = _.map(resp['teams'],function(item){
							        return eval("("+'{key:"'+(item['gid'])+'",txt:"'+item['name']+'",id:"'+item['gid']+'"}'+")")
							    });
							window.team.unshift({key:'0',id:0,txt:'选择团队'});
							$.getScript('/public/scripts/jw.object.js', function(d){
								re();
							});
						}
					}})
				}
			], function(er, re){
				$('#joymail_js_loading').remove();
				var project = new jw.new_proect({
					el:$('body')
				})
				project.bind('edit_success',function(resp){
					window.location.href=basurl+'/projects/info?id='+resp['id']+''
				})
			});
		}else{
			if(apptype !='jw_app_project'){
					$('body').append('<div class="joymail_js_loading" id="joymail_js_loading"><div class="joymail_js_loader" id="joymail_js_loader"></div><span>正在加载程序文件...</span></div>');
					$('#joymail_js_loading').css({left:$(window).width()/2-$('#joymail_js_loading').width()/2, top:$(window).height()/2-$('#joymail_js_loading').height()/2});
					new jw.loading( $('#joymail_js_loader') );
					Backbone.sync('read',null,{url:basurl+'/header/project',success:function(resp){
						if(resp){
							window.template = _.map(resp['template'],function(item){
							        return eval("("+'{key:"'+(item['id'])+'",txt:"'+item['name']+'",id:"'+item['id']+'"}'+")")
							    });
							window.template.unshift({key:"0",id:"0",txt:"选择里程碑模板"})
							window.categorys = _.map(resp['categorys'],function(item){
							        return eval("("+'{key:"'+(item)+'",txt:"'+item+'"}'+")")
							    });
							window.categorys.unshift({key:'0',txt:'全部'})
							window.cates = _.map(resp['cates'],function(item){
							        return eval("("+'{key:"'+(item)+'",txt:"'+item+'"}'+")")
							    });
							window.cates.unshift({key:'0',txt:'全部'})
							window.team = _.map(resp['teams'],function(item){
							        return eval("("+'{key:"'+(item['gid'])+'",txt:"'+item['name']+'",id:"'+item['gid']+'"}'+")")
							    });
							window.team.unshift({key:'0',id:0,txt:'选择团队'});
							$('#joymail_js_loading').remove();
							var project = new jw.new_proect({
								el:$('body')
							})
							project.bind('edit_success',function(resp){
								window.location.href=basurl+'/projects/info?id='+resp['id']+''
							})
						}
					}})
				}else{
					$('#joymail_js_loading').remove();
					var project = new jw.new_proect({
						el:$('body')
					})
					project.bind('edit_success',function(resp){
						window.location.href=basurl+'/projects/info?id='+resp['id']+''
					})
				}
		}
	}
})
jw.Jgroup = Backbone.View.extend({
	initialize: function(options){
		if(typeof jw.group_new=='undefined'){
			$('body').append('<div class="joymail_js_loading" id="joymail_js_loading"><div class="joymail_js_loader" id="joymail_js_loader"></div><span>正在加载程序文件...</span></div>');
			$('#joymail_js_loading').css({left:$(window).width()/2-$('#joymail_js_loading').width()/2, top:$(window).height()/2-$('#joymail_js_loading').height()/2});
			new jw.loading( $('#joymail_js_loader') );
			async.parallel([
				function(re){
					$.getScript('/public/scripts/jw.group.js', function(d){
						re();
					});
				}
			], function(er, re){
				$('#joymail_js_loading').remove();
				new jw.group_new({
			        model:new jw.group_model({
			            sharescope:1
			        }),
			    })
			});
		}else{
			new jw.group_new({
		        model:new jw.group_model({
		            sharescope:1
		        }),
		    })
		}
	}
})
jw.jFile = Backbone.View.extend({
	initialize: function(options){
		if(apptype != 'jw_app_file'){
			if(typeof jw.FileUpload=='undefined'){
				$('body').append('<div class="joymail_js_loading" id="joymail_js_loading"><div class="joymail_js_loader" id="joymail_js_loader"></div><span>正在加载程序文件...</span></div>');
				$('#joymail_js_loading').css({left:$(window).width()/2-$('#joymail_js_loading').width()/2, top:$(window).height()/2-$('#joymail_js_loading').height()/2});
				new jw.loading( $('#joymail_js_loader') );
				async.parallel([
					function(re){
						Backbone.sync('read',null,{url:basurl+'/header/folders/',success:function(resp){
							if(resp){
								window.folders = resp;
								// window.folders = resp;
								// console.log(window.ready_array);
								$.getScript('/public/scripts/jw.upload.file.js', function(d){
									re();
								});
							}
						}})
					}
				], function(er, re){
					$('#joymail_js_loading').remove();
					var file = new jw.FileUpload({});
					file.bind('uploaded',function(resp){
						var src = '';
						if(resp['folder']['id']!='') src='?folder_id='+resp['folder']['id']
						else src=''
						window.location.href = basurl+'/files/'+src
					})
				});
			}else{
				if(apptype!="jw_app_file"){
					$('body').append('<div class="joymail_js_loading" id="joymail_js_loading"><div class="joymail_js_loader" id="joymail_js_loader"></div><span>正在加载程序文件...</span></div>');
					$('#joymail_js_loading').css({left:$(window).width()/2-$('#joymail_js_loading').width()/2, top:$(window).height()/2-$('#joymail_js_loading').height()/2});
					new jw.loading( $('#joymail_js_loader') );
					Backbone.sync('read',null,{url:basurl+'/header/folders/',success:function(resp){
							if(resp){
								$('#joymail_js_loading').remove();
								window.folders = resp;
								var file = new jw.FileUpload({});
								file.bind('uploaded',function(resp){
									var src = '';
									if(resp['folder']['id']!='') src='?folder_id='+resp['folder']['id']
									else src=''
									window.location.href = basurl+'/files/'+src
								})
							}
						}})
				}else{
					var file = new jw.FileUpload({});
					file.bind('uploaded',function(resp){
						var src = '';
						if(resp['folder']['id']!='') src='?folder_id='+resp['folder']['id']
						else src=''
						window.location.href = basurl+'/files/'+src
					})
				}
			}
		}else{
			// var file = new jw.FileUpload({});
			$.publish('new:upload')
		}
	}
})
/**
 * 浮出框
 * el 浮出框 html标签 或 jQuery对象
 * options 
 * 		inittype: 浮出窗口是否已经添加到body 1: 已经有了， 0 还没有DOM 
 * 		CloseOnEscape: escape key 隐藏窗口
 * 		CloseOnClick: click body 隐藏窗口
 * 		removeOnClose: 隐藏窗口后是否删除窗口标签
 * 		autoShow: 是否直接显示
 * 		position:{left:'10px',top:'10px'} 显示的位置
 * events
 * 		onClose: 关闭窗口回调
 * 		onShow: 窗口显示回调
 */
jw.FD=Backbone.View.extend({
	initialize:function(options){
		this._options={
			inittype:1,
			CloseOnEscape:false,
			CloseOnClick:false,
			removeOnClose:true,
			autoShow:true
		};
		_.extend(this, this._options, options);
		if(!$(this.el).hasClass('jw-fd')){
			$(this.el).addClass('jw-fd');
		}
		!this.autoShow && $(this.el).addClass('hide');
		this.position && $(this.el).css(this.position);
		if(this.inittype==0) $('body').append($(this.el));
		this.showing=0;
		this.autoShow && this.show();
	},
	StopPropagation:function(evt){
		evt.stopPropagation()
	},
	show:function(){
		var self=this;
		$(this.el).removeClass('hide');
		this.showing=1;
		this.CloseOnEscape && jw.fdmng.show(this);
		this.CloseOnClick && setTimeout(function(){
			$(document).one('click',function(){
				self.close();
			})
		});
		this.trigger('onShow');
	},
	close:function(){
		if(this.CloseOnEscape) jw.fdmng.hide(this);
		else this._close();
	},
	_close:function(){
		this.showing=0;
		$(this.el).addClass('hide');
		// this.CloseOnClick && $(document).unbind('click');
		this.trigger('onClose');
		this.removeOnClose && $(this.el).remove();
	},
	// 提供给mng调用的关闭接口
	mngClose:function(){
		this._close();
	}
});
/**
 * 下拉列表栏
 * 传入一个数祖，传出一个list-div
 * options
 *  	items - 数组内容 {key,val,icon,disabled: 是否允许选择}
 * 		_default - 默认选中项 key
 * 		type - 初始化类型 1-无icon模式 2-选中状态模式 3-icon 模式
 * events
 * 		change 选择了下拉列表中的项
 */
jw.DropdownList=Backbone.View.extend({
	initialize:function(options){
		var self=this;
		this.type=options.type||2;
		this._default=options._default||'';
		// 如果 _default 不在列表中，则使用列表的第一项
		// if(!_.find(options.items,function(item){return item.key==self._default})){
		// 	this._default=options.items[0].key;
		// }
		this.listdata=options.items;
		this._combineList();
		// 将分割线去掉
		this.items=_.filter(this.items,function(item){
			return typeof item=='object';
		})
		this.itemdata=_.filter(options.items,function(item){
			return item.key!='sep';
		})
		this._default && this.select(this._default);
		this._bindEvt()
	},
	// 瓶装列表
	_combineList:function(){
		var self = this;
		this.items=_.map(this.listdata,function(item){
			return self._combineOne(item);
		});
		// this._default=options._default||'';
		$(this.el).empty();
		$(this.el).append(this.items)
	},
	_combineOne:function(item){
		if(item.key=='sep'){
			return '<div class="jw-fd-sep"></div>';
		}else{
			var iconDOM='',fc='';
			if(this.type==2||this.type==3){
				var iconclass=item.icon?item.icon:'jw-fd-i';
				iconDOM='<span class="'+iconclass+'"></span>';
			}else if(this.type==1){

			}
			if(item.key==-1){
				fc=' cmb-plscheck';
			}
			if(item.disabled) fc+=' disabled';
			else fc+=' normal';
			return $('<div class="jw-fd-item'+fc+'" action-data="'+item.key+'"><div class="jw-fd-itemc ellipsis" title="'+item.txt+'">'+iconDOM+'<span class="jw-fd-t">'+item.txt+'</span></div></div>').data('ddl',item);
		}
	},
	_bindEvt:function(){
		var self=this;
		$(this.el).delegate('.jw-fd-item','hover',function(evt){
			if($(evt.target).closest('.jw-fd-item').hasClass('disabled')) return;
			_(self.items).each(function(item){ item.removeClass('hovered')})
			$(this).addClass('hovered');
			this.currentKey=$(this).attr('action-data');
		}).delegate('.jw-fd-item','click',function(evt){
			if($(evt.target).closest('.jw-fd-item').hasClass('disabled')) return;
			self.select($(this).attr('action-data'));
		})
	},
	select:function(key,options){
		_(this.items).each(function(item){ item.removeClass('selected'); });
		var selitem=_(this.items).find(function(item){
			return item.attr('action-data')==key;
		});
		if(!selitem) return;
		selitem.addClass('selected');
		this.currentKey=key;
		var self=this;
		var ddl = selitem.data('ddl');
		if(options&&options.silent){
			
		}else{
			setTimeout(function(){
				self.trigger('change',ddl);
			},0);
		}
	},
	// 选择下一个 dir 方向 'next' 下一个 'prev' 上一个
	preselitem:function(dir){
		var idx;
		if(!this.currentKey){
			idx=-1;
		}else{
			idx=_.pluck(this.itemdata,'key')
				.indexOf(this.currentKey);
		}
		if(dir=='next'){
			if(idx==this.itemdata.length-1) idx=0;
			else idx++;
		}else{
			if(idx<=0) idx=this.itemdata.length-1;
			else idx--;
		}
		$(this.el).find('.jw-fd-item').removeClass('hovered').eq(idx).addClass('hovered');
		this.currentKey=parseInt($(this.el).find('.jw-fd-item.hovered').attr('action-data'));
	},
	getCurrent:function(){
		var self=this;
		return _.find(this.itemdata,function(item){
			return item.key==self.currentKey;
		})
	},
	// 重置Combo 列表数据
	// data={items:[],_default:''}
	reset:function(data){
		this.listdata=data.items;
		this._default=data._default||'';
		this._combineList();
		this._default && this.select(this._default);
	}
})

/**
 * 简单组合框
 * icon+下拉列表/ 文字（按钮）+ 下拉列表
 * options:
 * 		btn: 点击对象，点击后显示浮出窗口
 * 		el: 弹出窗口（注：弹出窗口内容自定义）
 * 		inittype:0 - 输入数组，初始化浮出窗口 1- 传入el 浮出窗口
 * 		dropdownparams: 下拉列表参数 items/_default
 * 		offset:{x:0,y:20} 浮出框的偏移量  此参数取消
 * 		posStyle: 弹出框相对button位置,上下自适应 bl-优先与左下角盯齐 br-优先与右下角盯齐 tr-优先与右上角盯齐 tl-优先与左上角盯齐 custom - 自定义，组件不控制浮出框位置
 *		type - 初始化类型 1-无icon模式 2-选中状态模式 3-icon 模式
 *		extclass - 附加 classs
 *		appendtype - 0 添加到body中，1 添加到容器中
 * 		disabled - 0 允许点击 1 不允许点击
 * events:
 *      change 
 * function
 * 		setStatus 设置下拉列表组件状态 0 - disabled 1-enabled
 *		getStatus 获取下拉列表组件状态
 */
jw.SimpleCombo=jw.FD.extend({
	initialize:function(options){
		if(!options.btn) throw 'button is null';
		_.bindAll(this,'reset');
		this._btn=options.btn;
		this.extclass=options.extclass||'';
		this.disabled=options.disabled||0;
		// this._offset=_.extend({},options.offset,{x:0,y:20});
		this.posStyle=options.posStyle||'bl';
		this._options={
			inittype:0,
			type:1
		};
		this._options=_.extend(this._options,options);
		options=_.extend({
			inittype:options.inittype||0,
			CloseOnEscape:true,
			CloseOnClick:true,
			removeOnClose:false,
			autoShow:false
		},options);
		this._options.inittype==0 && this._initDlg();
		options.inittype=1;
		jw.FD.prototype.initialize.call(this,_.extend(options,{el:this.el}));
		this._bindEvt();
	},
	_initDlg:function(){
		var self=this,
			dlg=$('<div class="jw-fd jw-dropdown hide '+this.extclass+'"></div>');
		// trace('this.extclass['+this.extclass+']');
		this._dropdowndlg = new jw.DropdownList(_.extend({
			el:dlg,
			type:this._options.type
		},this._options.dropdownparams));
		if( this._options.dropdownparams && typeof this._options.dropdownparams._default!='undefined' ){
			// 设置 cursel 值
			this.cursel = _.findWhere( this._options.dropdownparams.items, {key:this._options.dropdownparams._default+''} );
		}
		$('body').append(dlg);
		
		if(this.appendtype) $(this.el).append(dlg);
		else $('body').append(dlg);
		
		this.el=dlg;
		setTimeout(function(){
			self._dropdowndlg.bind('change',function(data){
				self.cursel=data;
				data && data.key && self.trigger('change',data);
			});
		},0);
		// this._dropdowndlg.bind('change',function(data){
		// 	self.cursel=data;
		// 	data && data.key && self.trigger('change',data);
		// });
		if(this.disabled){
			this._btn.addClass('disabled').attr('disabled',true);
		}
	},
	_bindEvt:function(){
		var self=this;
		!this.autoShow && this._btn.click(function(){
			if($(this).hasClass('disabled')) return;
			self.show();
		});
		this.autoShow && this.show();
	},
	// 显示浮出窗口
	show:function(){
		if(!$(this.el).hasClass('hide')) return;
		// 如果 this.appendtype==1 则不做位置处理
		// 获取 btn 位置
		// 浮出框是否超出窗口
		if(this.appendtype!==1){
			var offset=this._btn.offset(),
				h=$(this.el).height(),
				w=$(this.el).width(),
				docscrolltop=$(document).scrollTop(),
				screenbottom=docscrolltop+$(window).height(),
				btnheight=this._btn.height(),
				newpos;
			var diff=this.options.offset||{x:0,y:0};	// 微调
			if(this.posStyle=='bl'){
				newpos={left:offset.left+'px',top:(offset.top+btnheight)+'px',right:'auto'};
			}else if(this.posStyle=='br'){
				newpos={left:(offset.left-w+this._btn.width()+diff.x)+'px',top:(offset.top+btnheight+diff.y)+'px',right:'auto'};
			}else if(this.posStyle=='tr'){
				newpos={left:(offset.left+this._btn.width()+diff.x)+'px',top:offset.top+diff.y+'px',right:'auto'};
			}else if(this.posStyle=='tl'){
				newpos={left:(offset.left-w)+'px',top:offset.top+'px',right:'auto'};
			}
			if(newpos){
				if((offset.top+btnheight+h)>screenbottom&&(h<(offset.top-docscrolltop))){
					// 需要判断上面的空间>下面的空间，否则还是在先面显示
					if(this.posStyle=='bl'||this.posStyle=='br')
						newpos.top=(offset.top-h-1)+'px';
					else{
						newpos.top=(offset.top-h+btnheight)+'px';
					}
				}
				if(parseInt(newpos.left.replace('px',''))<0) newpos.left=0;
				
				$(this.el).css(newpos);
			}
			this.trigger('showing')
		}
		jw.FD.prototype.show.call(this);
	},
	// 仅用于测试
	setPosStyle:function(posStyle){
		this.posStyle=posStyle;
	},
	// 重置Combo 列表数据
	// {items:items,_default:''}
	reset:function(data){
		this._dropdowndlg.reset(data);
	},
	// 设置下拉列表栏的值
	select:function(key,options){
		this._dropdowndlg.select(key,options);
		return this;
	},
	// 获取当前选中的
	getVal:function(){
		// trace('getVal ====',this.cursel,this.posStyle)
		return this.cursel;
	},
	// 获取当前的items
	getItems:function(){
		return this._dropdowndlg.listdata
	},
	// 设置组件状态
	setStatus:function(status){
		this.disabled=status;
		if(this.disabled) this._btn.addClass('disabled').attr('disabled',true);
		else this._btn.removeClass('disabled').removeAttr('disabled');
	},
	getStatus:function(){
		return this.disabled;
	}
})

/**
 * Joywok 标准下拉列表栏
 * options
 * 		list: 下拉列表数组
 * 		type: 包含icon ？
 * 		appendtype - 0 添加到body中，1 添加到容器中
 */
jw.Combobox=jw.SimpleCombo.extend({
	initialize:function(options){
		// 创建下拉列表button
		this._makeBtn();
		// 获取 button 位置
		options.type=2;
		this.appendtype=options.appendtype||0;
		jw.SimpleCombo.prototype.initialize.call(this,_.extend(options,{btn:this._btn,offset:{x:0,y:0}}));
		// jw.SimpleCombo.prototype.initialize.call(this,_.extend(options,{btn:this._btn,offset:{x:0,y:34}}));
	},
	_makeBtn:function(){
		this._btn=$('<div class="cmb-w normal">\
						<div class="cmb-c"><div class="cmb-btn"><span class="cmb-btn-i"></span></div><div class="cmb-tw ellipsis">&nbsp;</div></div>\
					</div>');
		this._btndropicon=this._btn.find('.cmb-btn');
		this._btntxt=this._btn.find('.cmb-tw');
		$(this.el).append(this._btn);
	},
	_bindEvt:function(){
		var self=this;
		jw.SimpleCombo.prototype._bindEvt.call(this);
		this._dropdowndlg.bind('change',function(data){
			self._btntxt.html(data.txt==''?'&nbsp;':data.txt);
		})
	},
	// 设置下拉列表栏的值
	select:function(key,options){
		if(_.isNumber(key)) key += '';
		this._dropdowndlg.select(key,options);
		var data = _.findWhere(this.dropdownparams['items'],{key:key});
		// console.log(this.dropdownparams["items"],'找到了么')
		// 改了点
		this._btntxt.html(data!=window.undefined&&data.txt==''?'&nbsp;':data.txt);
		return this;
	}
})
/**
 * 无边框下拉列表栏
 * 用于表格中的下拉列表栏
 */
jw.FormCombo=jw.Combobox.extend({
	_makeBtn:function(){
		this._btn=$('<div class="formcmb-w normal">\
						<div class="formcmb-c"><div class="formcmb-btn"><span class="formcmb-btn-i"></span></div><div class="formcmb-tw"></div></div>\
					</div>');
		this._btndropicon=this._btn.find('.formcmb-btn');
		this._btntxt=this._btn.find('.formcmb-tw');
		$(this.el).append(this._btn);
	},
});
/**
 * 复杂Combobox
 * 列表项带icon
 */
jw.ComplexCombobox=jw.Combobox.extend({
	_makeBtn:function(){
		jw.Combobox.prototype._makeBtn.call(this);
		this._btn.addClass('complexcmb').find('.cmb-tw').append('<span class="cmb-i"></span><span class="cmb-t"></span>');
		this._btntxt=this._btn.find('.cmb-t');
		this._btnicon=this._btn.find('.cmb-i');
	},
	_bindEvt:function(){
		var self=this;
		jw.Combobox.prototype._bindEvt.call(this);
		// 给浮出框添加特例样式
		this.el.addClass('complexcmb');
		this._dropdowndlg.bind('change',function(data){
			self._btnicon.attr('class','cmb-i '+data.icon);
		})
	}
});
/**
 * 用于过滤器Combobox
 */
jw.ComboFilter=jw.SimpleCombo.extend({
	initialize:function(options){
		this.btntext=options.btntext;
		// 创建下拉列表button
		this._makeBtn();
		// 获取 button 位置
		options.type=options.type?options.type:2;
		this.appendtype=options.appendtype||0;
		jw.SimpleCombo.prototype.initialize.call(this,_.extend(options,{btn:this._btn,offset:{x:0,y:2}}));
	},
	_makeBtn:function(){
		this._btn=$('<div class="cmb-w normal cmb-filter-btn">\
						<div class="cmb-c"><div class="cmb-btn"><span class="cmb-btn-i"></span></div><div class="cmb-tw">'+this.btntext+'</div></div>\
					</div>');
		this._btndropicon=this._btn.find('.cmb-btn');
		this._btntxt=this._btn.find('.cmb-tw');
		$(this.el).append(this._btn);
	},
	_bindEvt:function(){
		var self=this;
		jw.SimpleCombo.prototype._bindEvt.call(this);
	}
});
/**
 * 下拉列表栏
 * 时间下拉列表样式
 */
jw.stdCombobox=jw.Combobox.extend({
	_makeBtn:function(){
		this._btn=$('<div class="cmb-w std">\
						<div class="cmb-c"><div class="cmb-btn"><span class="cmb-btn-i"></span></div><div class="cmb-tw"></div></div>\
					</div>');
		this._btndropicon=this._btn.find('.cmb-btn');
		this._btntxt=this._btn.find('.cmb-tw');
		$(this.el).append(this._btn);
	},
	isEnable:function(){
		return this._btn.closest('.cal-seltimew').css('display')=='none'?false:true;
	}
});
/**
 * 对象model
 * model data {id,type,name}
 * 		type:jw_n_user/jw_n_project/jw_n_group/jw_n_task
 */

jw.MSocialObj=Backbone.Model.extend({
	save:function(key, val, options){
		trace(key);
		trace(val);
		trace(options);
	},
	destroy:function(options){
		trace('==== MSocialObj destroy====')
		this.trigger('destroy', this, this.collection, options);
	}
});

jw.SocialObjs=Backbone.Collection.extend({
	model: jw.MSocialObj,
	url:function(){	return basurl+'/suggestion'; },
	localStorage: new Store("Joywok"),
	initialize:function(options){
		// TODO: action 不应当保存
		this.action=options.action||'';
		if( options.app_type && options.app_id ){
			this.app_type = options.app_type;
			this.app_id = options.app_id;
		}
		this.basestoreid='SO:'+selfinfo.id+':'+this.action+':';
		Backbone.Collection.prototype.initialize.call(this,arguments);
	},
	sync:function(method, model, options){
		// trace('sync basurl ['+basurl+']')
		if(this._ajaxHandle){
			this._ajaxHandle.abort();
			delete this._ajaxHandle;
		}
		resp = this.localStorage.find({id:this.basestoreid+this.qs});
		if(resp){
			// trace('===== Bingo! localStorage =====');
			// trace(resp);
			if(resp && resp.timestamp && (Math.abs(new Date()-new Date(resp.timestamp))<10000)){
				// 如果小于60秒，直接返回
				options.success(resp);
				return;
			}else{
			}
		}
		// for(var i in arguments){
		// }
		this._ajaxHandle = Backbone.sync.apply(this, arguments);
	},
	parse:function(resp){
		var a = {key:'xxxx',val:'sssaasad'}
		// for(var i in resp){
		// }
		// trace('basurl ['+basurl+']')
		if(resp && resp.timestamp){
			// LocalStorage 数据
			resp=resp.data;
		}else{
			// 服务端回来的数据
			resp=_(resp).map(function(item){
				if(item.type=='jw_n_user')
					return {
						type:item.type,
						id:item.id,
						name:item.name,
						email:item.email,
						avatar:item.avatar&&item.avatar.avatar_s?item.avatar.avatar_s:'',
						title:item.title,
						extension_num:item.extension_num,
						contact:item.contact,
						depts:item.depts
					};
				else if(item.type=='jw_n_dept'||item.type=='jw_n_group')
					return {
						type:item.type,
						id:item.id,
						name:item.name,
						logo:item.logo?item.logo:'',
						num:item.num
					};
				else return item;
			});
			this.localStorage.update({id:this.basestoreid+this.qs,data:resp,timestamp:new Date()});
		}
		return resp;
	},
	fetch:function(action,str){
		// 判断本地是否存在？
		this.action=action||'';
		this.qs=str;
		this.url=basurl+'/suggestion/'+action;
		// trace('sync basurl ['+function(){ return basurl; }+']')
		var params = [];
		if( str != '') params.push('s='+str);
		if( this.app_type ){
			params.push('app_type='+this.app_type);
			params.push('app_id='+this.app_id);
		}
		// if(str!='') this.url+='?s='+str;
		this.url += '?' + params.join('&');
		Backbone.Collection.prototype.fetch.call(this);
	},
	create:function(model,options){
		model = this._prepareModel(model, options);
		this.add(model, options);
		return model;
	}
})
/**
 * 对象下拉列表内容
 * options.app = {app_type,app_id} 需要在指定对象集合中选择社会化对象时传入该参数
 */
jw.SocialObjList=jw.FD.extend({
	initialize:function(options){
		this._action=options.action||'';
		var params = {action:this._action};
		if( options.app ){
			params.app_type = options.app.app_type;
			params.app_id = options.app.app_id;
		}0

		this._socialobjs=new jw.SocialObjs( params );
		_.bindAll(this, 'update','_combineOne');
		this._socialobjs.bind('reset', this.update);
		
		_.extend(options,{
			inittype:1,
			CloseOnEscape:true,
			CloseOnClick:true,
			removeOnClose:false,
			autoShow:false
		});
		this._initDlg();
		jw.FD.prototype.initialize.call(this,_.extend(options,{el:this.el}));
		this._bindEvt()
	},
	_bindEvt:function(){
		var self=this;
		$(this.el).delegate('.jw-obj','hover',function(){
			$(self.el).find('.jw-obj').removeClass('selected');
			$(this).addClass('selected');
		}).delegate('.jw-obj','click',function(evt){
			evt.stopPropagation();
			self.select(self._socialobjs.get($(this).attr('action-data')).toJSON());
		})
	},
	// 获取当前选中项
	getCurrent:function(){
		var cur=this._objw.find('.selected');
		if(cur.length==0) return null;
		return this._socialobjs.get(cur.attr('action-data')).toJSON();
	},
	// 选择ITEM
	selectCurrent:function(){
		var cur=this.getCurrent();
		if(cur) this.select(cur);
	},
	// 选择下一个 dir 方向 'next' 下一个 'prev' 上一个
	selitem:function(dir){
		var curobj=this._objw.find('.selected'),
			objdoms=this._objw.find('.jw-obj'),
			targetobj;
		if(dir=='next'){
			targetobj=curobj.next();
			if(targetobj.length==0) targetobj=this._objw.find('.jw-obj:first');
			else if(targetobj.hasClass('jw-obj-classes')) targetobj=targetobj.next();
		}else{
			targetobj=curobj.prev();
			if(targetobj.length==0) targetobj=this._objw.find('.jw-obj:last');
			else if(targetobj.hasClass('jw-obj-classes')) targetobj=targetobj.prev();
		}
		if(targetobj.length==1){
			targetobj.addClass('selected');
			curobj.removeClass('selected');
		}
	},
	// SocialObjs 数据更新，更新下拉列表内容
	update:function(){
		// trace('update action['+this._socialobjs.action+']')
		console.log('xxxx');
		this.objlist=this._socialobjs.toJSON();
		this._objw.empty();
		this._ClassifyObjs();
		this._combineList();
	},
	// 将对象按类别重新组织数组
	_ClassifyObjs:function(){
		// 筛选出分类
		var self=this,classes=_(this.objlist).chain().pluck('type').union().value();
		this.classes_objs && delete this.classes_objs;
		this.classes_objs={};
		_.each(classes,function(type){
			self.classes_objs[type]=_.filter(self.objlist,function(item){
				return item.type==type;
			})
		})
		// trace(this.classes_objs);
	},
	// 初始化下拉列表浮出窗口
	_initDlg:function(){
		//trace('xxx _initDlg')
		this.el=$('<div class="jw-fd jw-objlist fd-shadow"><div class="jw-objs"></div></div>');
		this._objw=this.el.find('.jw-objs');
		$('body').append(this.el);
	},
	// 拼装下拉列表
	_combineList:function(){
		// this._socialobjs.each(this._combineOne);
		// 如果没有匹配的对象，则隐藏弹出框
		if(this.objlist.length==0){
			this.close();
			return;
		}
		var self=this;
		if(this._socialobjs.action == 'offenused'){
			// 如果是常用对象，则显示
			this._objw.append('<div class="jw-obj-offentip">请选择常用对象或直接输入</div>')
		}
		// 1. 将用户添加到列表
		_.each(this.classes_objs['jw_n_user'],function(item){
			self._combineOne(item);
		});
		// 拼装电子邮件
		_.each(this.classes_objs['jw_n_email'],function(item){
			self._combineEmail(item);
		});
		// 拼装话题
		_.each(this.classes_objs['jw_n_topic'],function(item){
			self._combineOne(item);
		});
		// 2. 拼装非用户对象
		_.each(this.classes_objs,function(item,key){
			if(key!='jw_n_user'&&key!='jw_n_email'&&key!='jw_n_topic'){
				self._objw.append('<div class="jw-obj-classes">'+key.jwtrans()+'</div>');
				_.each(item,self._combineOne);
			}
		});
		this._objw.find('.jw-obj:first').addClass('selected');
		this.show();
	},
	// 拼装单一SocialObj
	_combineOne:function(socialobj){
		// socialobj=socialobj.toJSON();
		// trace(socialobj);
		if(socialobj.type=='jw_n_user'){
			var title = [];
			if(socialobj.title!='') title.push(socialobj.title);
			if(socialobj.depts && socialobj.depts.name) title.push(socialobj.depts.name);
			this._objw.append('<div class="jw-obj" action-data="'+socialobj.id+'"><div class="jwobj-logo"><img class="pf-36" src="'+socialobj.avatar+'" /></div><div class="jwobj-w"><div class="jwobj-name">'+socialobj.name+'</div><div class="jwobj-desc">'+title.join('，')+'</div></div></div>');
		}else if(socialobj.type=='jw_n_group'||socialobj.type=='jw_n_dept')
			this._objw.append('<div class="jw-obj" action-data="'+socialobj.id+'"><div class="jwobj-logo"><img class="jw-obj-logo" src="'+socialobj.logo+'" /></div><div class="jwobj-w"><div class="jwobj-name ellipsis">'+socialobj.name+'</div><div class="jwobj-desc">'+socialobj.num+'个人的'+socialobj.type.jwtrans()+'</div></div></div>');
		else if(socialobj.type=='jw_n_topic')
			this._objw.append('<div class="jw-obj jw-obj-topic" action-data="'+socialobj.id+'"><div class="jwobj-w"><div class="jw-obj-topicnum">'+socialobj.num+'</div><div class="jwobj-name ellipsis"># '+socialobj.name+'</div></div></div>');
		else if(socialobj.type=='jw_n_folder')
			this._objw.append('<div class="jw-obj jw-obj-file" action-data="'+socialobj.id+'"><div class="jwobj-logo"><span class="fl-logo-folder"></span></div><div class="jwobj-w"><div class="jwobj-name ellipsis">'+socialobj.name+'</div><div class="jwobj-desc"></div></div></div>');
		else if(socialobj.type=='jw_n_file'){
			this._objw.append('<div class="jw-obj jw-obj-file" action-data="'+socialobj.id+'"><div class="jwobj-logo"><span class="'+socialobj.ext_name.getFileClass()+'"></span></div><div class="jwobj-w"><div class="jwobj-name ellipsis">'+socialobj.name+'.'+socialobj.ext_name+'</div><div class="jwobj-desc"></div></div></div>');
		}else if(socialobj.type=='jw_n_calendar'){
			// var calname=socialobj.sub_type=='jw_sys_user'?socialobj.user.name+'的'+socialobj.name:socialobj.name;
			var calname=socialobj.user.name+'的'+socialobj.name;
			this._objw.append('<div class="jw-obj jw-obj-cal" action-data="'+socialobj.id+'"><div class="jwobj-logo"><span class="jwobj-logo-cal"></span></div><div class="jwobj-w"><div class="jwobj-name ellipsis">'+calname+'</div><div class="jwobj-desc"></div></div></div>');
		}else if(socialobj.type=='jw_n_task'){
			var task_apndinfo='';
			socialobj.subtype = socialobj.subtype*1;
			if(socialobj.subtype==0){
				task_apndinfo='一般任务';
			}else if(socialobj.subtype == 1){
				task_apndinfo='群组任务';
				if( socialobj.parent ) task_apndinfo += '，' + socialobj.parent.name;
			}else if(socialobj.subtype == 2){
				task_apndinfo='项目任务';
				if( socialobj.parent ) task_apndinfo += '，' + socialobj.parent.name;
			}
			this._objw.append('<div class="jw-obj" action-data="'+socialobj.id+'"><div class="jwobj-logo"><span class="jwobj-logo-task"></span></div><div class="jwobj-w"><div class="jwobj-name ellipsis">'+socialobj.name+'</div><div class="jwobj-desc ellipsis">'+task_apndinfo+'</div></div></div>');
		}else if(socialobj.type == 'jw_n_project'){
			this._objw.append('<div class="jw-obj" action-data="'+socialobj.id+'"><div class="jwobj-logo"><span class="jwobj-logo-project"></span></div><div class="jwobj-w"><div class="jwobj-name ellipsis">'+socialobj.name+'</div><div class="jwobj-desc">'+socialobj.category+'</div></div></div>');
		}else if(socialobj['type'] == 'jw_n_domain'){
			//<img src="/public/images/avatar/extnetwork-logo-grey100.png" alt="">
			this._objw.append('<div class="jw-obj" action-data="'+socialobj.id+'"><div class="jwobj-logo"><img class="jw-obj-logo" src="'+socialobj.logo+'" /></div><div class="jwobj-w"><div class="jwobj-name ellipsis">'+socialobj.name+'</div></div></div>');
		}
	},
	_combineEmail:function(socialobj){
		var apndclass='chkfail';
		if(socialobj.name.isEmail()) apndclass='chkpass';
		this._objw.append('<div class="jw-obj" action-data="'+socialobj.id+'"><div class="jwobj-logo"><img class="pf-36" src="'+socialobj.avatar+'" /></div><div class="jwobj-w"><div class="jwobj-name">发送邀请信至</div><div class="jwobj-desc '+apndclass+'">'+socialobj.name+'</div></div></div>');
	},
	select:function(item){
		var self=this;
		setTimeout(function(){
			self.trigger('select',item);
		},0);
	}
})

/**
 * 对象查找组件
 * posfix:0/1 是否使用 position:fixed 定位
 */
jw.SearchObj=jw.SocialObjList.extend({
	initialize: function(options) {
		this.searchtip=options.searchtip||'在Joywok中搜索';
		this._inputw=new jw.input({
			el:options.el,
			tip:options.tip,
			style:options.style,
			shadow:options.shadow||1
		});
		var offset=options.el.find('.input-w').offset();
		jw.SocialObjList.prototype.initialize.call(this,_.extend(options,{position:{left:offset.left+'px',top:(offset.top+29)+'px'}}));
		if(options.posfix) $(this.el).css('position','fixed');
	},
	_bindEvt:function(){
		var self=this;
		jw.SocialObjList.prototype._bindEvt.call(this);
		this._inputw.bind('change',function(str){
			self._SearchStr=str;
			if(str===''){
				// 如果为空，则隐藏下拉列表
				self._close();
			}else{
				// 匹配
				self._objw.empty()
				self._socialobjs.fetch(self._action,encodeURIComponent(str));
			}
		}).bind('onFocus',function(){
			// 如果内容不为空，则开启搜索
			// var str=$.trim(self._inputw.getText());
			// str!='' && self._socialobjs.fetch(self._action,str);
			// FIXME: 没有解决click 关闭弹出窗口的问题⋯⋯
		}).bind('onBlur',function(){
			// 关闭对象列表
			// self.close();
		}).bind('keydown',function(evt){
			//trace('SearchObj keydown['+evt.keyCode+']');
			// 选择
			if(evt.keyCode==38||evt.keyCode==40){
				// 上下箭头
				self.selitem(evt.keyCode==38?'prev':'next');
				evt.preventDefault();
			}else if(evt.keyCode==13){
				// 回车键
				self.selectCurrent();
			}
		})
	},
	// 重写父类的拼装下拉列表接口，添加“在Joywok中搜索×××”
	_combineList:function(){
		this._objw.append('<div class="jw-obj jw-obj-search-w" action-data="search"><span class="jw-obj-search">'+this.searchtip+'"<b>'+this._SearchStr+'"</b></span></div>');
		// trace('_combineList['+this.objlist.length+']');
		if(this.objlist.length>0){
			jw.SocialObjList.prototype._combineList.call(this);
		}else{
			this._objw.find('.jw-obj:first').addClass('selected');
			this.show();
		}
	},
	// 选择ITEM
	selectCurrent:function(){
		var cur=this._objw.find('.selected');
		this.searchOnEntry = false;
		if(cur.attr('action-data')=='search'){
			// 搜索流程
			this.trigger('search',this._SearchStr);
		}else{
			if( cur.attr('action-data')==window.undefined ){
				this.searchOnEntry = true;
				this.trigger('search',this._SearchStr);
			}else{
				this.select(this._socialobjs.get(cur.attr('action-data')).toJSON());
			}
		}
		this._close();
	},
	setText:function(str){
		this._inputw.setTxt(str,{silent:true});
	}
});
/**
 * 查找用户组件
 */
jw.SearchUser=jw.SearchObj.extend({
	_combineList:function(){
		jw.SocialObjList.prototype._combineList.call(this);
	}
});
/**
 * 查找日历组件 
 */
jw.SearchCal=jw.SearchObj.extend({
	_combineList:function(){
		var self=this;
		_.each(this.classes_objs,function(item,key){
			if(key!='jw_n_user'&&key!='jw_n_email'&&key!='jw_n_topic'){
				_.each(item,self._combineOne);
			}
		});
		this._objw.find('.jw-obj:first').addClass('selected');
		this.show();
	}
});
/**
 * 匹配+搜索组件 jw.inputSearchComplex
 */
jw.MatchSeachObj=jw.SearchObj.extend({
	initialize:function(options){
		this.searchtip=options.searchtip||'在Joywok中搜索';
		this._inputw=new jw.inputSearchComplex({
			el:options.el,
			tip:options.tip,
			style:options.style,
			shadow:options.shadow||1
		});
		var offset=options.el.find('.input-w').offset();
		jw.SocialObjList.prototype.initialize.call(this,_.extend(options,{position:{left:offset.left+'px',top:(offset.top+29)+'px'}}));
		if(options.posfix) $(this.el).css('position','fixed');
	},
	_bindEvt:function(){
		jw.SearchObj.prototype._bindEvt.call(this);
	}
});

//  浮出栏相关组件 end

/****************分页*********************start***/
// TODO: to be delete.
jw.paging = Backbone.View.extend({
	initialize:function(options){
		this.inputOptions = ['pagesize','pageno','num','styles'];
		this._options={
			styles:0,//0:最简化1次简化,2添加数字
			pagesize:10,
			pageno:2,
			num:131
		};
		_.extend(this,_.pick(_.extend(this._options,options),this.inputOptions));
		this._el = $(this.el);
		this._el.append('<div class="paging page-style-'+this.styles+'"><div class="page-btn-prev page-btn-type1 cansel" action-data="prev"></div><div class="page-btn-next page-btn-type1 cansel" action-data="next"></div></div>');
		this._pages = Math.ceil(this.num/this.pagesize);
		this._initstyle();
		this._setUnable();
	},
	_initstyle:function(){
		var self = this;
		if(self.styles == 2){
			self._style3Handler();
		}else if(self.styles == 1){
			self._style2Handler();
		}
		this._el.delegate('.paging div.cansel','click',function(){
			var _page = $(this).attr('action-data');
			if(_page == 'prev'){
				self.pageno --;
			}else if(_page == 'next'){
				self.pageno ++;
			}else{
				self.pageno = _page;
			}
			self._style3Handler();
			self._setUnable();
			self.trigger('page-change',self.pageno);
		});
	},
	_style2Handler:function(){
		var self = this;
		self._el.find('.paging div.page-btn-prev').html('<span class="sml-btn">');
		self._el.find('.paging div.page-btn-next').html('<span class="sml-txt">下一页</span><span class="sml-btn"></span>');
	},
	_style3Handler:function(){
		var self = this;
		var arr = [];
			if(self.styles !=2)return;
			self._el.find('.paging div.page-btn-num').remove();
			self._el.find('.paging div.page-btn-ell').remove();
			self.pageno = parseInt(self.pageno);
			if(self.pageno-7<=0){
				if(self.pageno+4>=self._pages-2){
					arr = _.range(1,1+self._pages);
				}else{
					arr = _.range(1,1+3+self.pageno);
					arr.push('...',self._pages-1,self._pages);
				}
			}else{
				arr = _.range(1,1+2);
				arr.push('...');
				if(self.pageno+4>=self._pages-2){
					arr = arr.concat(_.range(self.pageno-3,1+self._pages));
				}else{
					arr = arr.concat(_.range(self.pageno-3,4+self.pageno));
					arr.push('...',self._pages-1,self._pages);
				}
			}
		var str = _.reduce(arr,function(memo,i){
				if(typeof(i) == "number"){
					return memo+'<div class="page-btn-num page-btn-type2 page-'+i+' cansel" action-data="'+i+'" title="第'+i+'页">'+i+'</div>';
				}else if(typeof(i) == "string" && i=='...'){
					return memo+'<div class="page-btn-ell page-btn-type2" action-data="'+i+'">'+i+'</div>';
				}else{
					return '';
				}
			},'');
		self._el.find('.paging div.page-btn-prev').html('<span class="sml-btn"></span><span class="sml-txt">上一页</span>').after(str);
		self._el.find('.paging div.page-btn-next').html('<span class="sml-txt">下一页</span><span class="sml-btn"></span>');
		self._el.find('.paging div.page-btn-num.page-'+self.pageno).addClass('selected');
		self._setUnable();
	},
	_setUnable:function(){
		var self = this;
		if(self.pageno == 1){
			self._el.find('.paging .page-btn-prev.cansel').removeClass('cansel').addClass('unable');
			self._el.find('.paging .page-btn-next.unable').removeClass('unable').addClass('cansel');
		}else if(self.pageno == self._pages){
			self._el.find('.paging .page-btn-next.cansel').removeClass('cansel').addClass('unable');
			self._el.find('.paging .page-btn-prev.unable').removeClass('unable').addClass('cansel');
		}else{
			self._el.find('.paging .page-btn-prev.unable').removeClass('unable').addClass('cansel');;
			self._el.find('.paging .page-btn-next.unable').removeClass('unable').addClass('cansel');;
		}
		self._el.find('.paging .cansel.page-btn-num.page-'+self.pageno).removeClass('cansel').addClass('unable');

		self.pageno = typeof(self.pageno)=="number"?self.pageno:parseInt(self.pageno);
		if(self.pageno -1 >= 1){
			self._el.find('.paging .page-btn-prev').attr('title','第'+(self.pageno-1)+'页');
		}else{
			self._el.find('.paging .page-btn-prev').attr('title','已经是最前了');
		}
		if(self.pageno +1 <=self._pages){
			self._el.find('.paging .page-btn-next').attr('title','第'+(self.pageno+1)+'页');
		}else{
			self._el.find('.paging .page-btn-next').attr('title','已经是最后了');
		}
	},
	_setPage:function(model){
		var self = this;
		if(typeof(model.pageno)=="number" && 0<model.pageno<=self._pages){
				self.pageno = model.pageno;
				self._style3Handler();
				self._setUnable();
		}
	}
});
/****************分页*********************end***/
// TODO: to be delete
/**
 * 选项页组件
 *
 * @param:style		样式 1,2,3 为横排 4+为竖排
 * @param:curbtn	初始按钮位置
 */
jw.BaseTab = Backbone.View.extend({
	initialize:function(options){
		if(!$(this.el).length) return;
		this.tabbar = $(this.el).find('>.tab_bar>.tb_w');
		this.tabpanel = $(this.el).find('.tab_panel>.tp_w');
		this.tabOptions = ['style','curbtn'];
		this._options = {
			style	: 1,
			curbtn	: ''
		};
		_.extend(this,_.pick(_.extend(this._options,options),this.tabOptions));
		if(!this.tabbar.parent('.tab_bar').find('[action-data="'+this.curbtn+'"]').length){
			this.curbtn = this.tabbar.find('[action-data]:eq(0)').attr('action-data');
		}
		this._initBar();
	},
	_initBar:function(){
		this.tabbar.addClass('tb_w'+this.style);
		this.changePanel(this.curbtn);//初始化默认窗口
		this._bindEvt();
	},
	_bindEvt:function(){
		var self = this;
		this.tabbar.bind('click',function(e){
			if($(e.target).is('.tb_item')){
				if($(e.target).hasClass('disabled')) return
				!$(e.target).hasClass('selected') && self.changePanel($(e.target).attr('action-data'));
			}else if($(e.target).parent('a').is('.tb_item')){
				if($(e.target).parent('a').hasClass('disabled')) return
				!$(e.target).parent('a').hasClass('selected') && self.changePanel($(e.target).parent('a').attr('action-data'));
			}
		});
	},
	changePanel:function(key,notTrigger){
		var self = this;
		var o = this.tabbar.find('[action-data="'+key+'"]');
		if(o.hasClass('selected')) return;
		notTrigger || setTimeout(function(){self.trigger('onChange', key)},0);

		this.tabbar.find('.tb_item').removeClass('selected');
		o.addClass('selected');
		
		this.tabpanel.find('>div').css('display','none');
		this.tabpanel.find('[action-data="'+o.attr('action-data')+'"]')
		.css('display','block');
		
		
	}
});
/**
 * 树形选项卡（非目录结构）
 *
 * @param:curbtn	初始的按钮位置
 * @param:leftC		是否显示按钮左侧红色border-left
 */
jw.TreeTab = jw.BaseTab.extend({
	initialize:function(options){
		this.inputOptions = ['style','curbtn','leftC'];
		this._options={
			leftC:true
		};
		_.extend(this,_.pick(_.extend(this._options,options), this.inputOptions));
		jw.BaseTab.prototype.initialize.call(this,{style:4,curbtn:this.curbtn});
	},
	_bindEvt:function(){
		var self = this;
		this.tabbar.bind('click',function(e){
			var _et = $(e.target);
			if(_et.is('.tb_item,.ou_icon') && !_et.is('.openup')){
				//Note: 如果为当前按钮有二级菜单，则默认选择二级菜单的第一项
				if(_et.is('.ou_icon')){
					var _ptbi =  _et.parent('.tb_item');
					if(!_ptbi.hasClass('openup')){
						_ptbi.addClass('openup').find('.tbs_w').slideDown(300);
						self.changePanel(_ptbi.find('>.tbs_w>.tb_item:eq(0)').attr('action-data'));
					}else{
						_ptbi.removeClass('openup').find('.tbs_w').slideUp(300);
					}
				}else{
					if(typeof _et.attr('action-data') != 'undefined') self.changePanel(_et.attr('action-data'));
				}
			}
		});
	},
	
	changePanel:function(key){
		//Note: 如果默认的按钮是二级菜单，则展开一级菜单
		var c = this.tabbar.find('[action-data="'+key+'"]');
		if(c.hasClass('selected')) return;
		this.trigger('onChange', key);
		if(c.closest('.tbs_w').length) c.closest('.tbs_w').slideDown(300).closest('.tb_item').addClass('openup'); 
		this.tabbar.find('.tb_item').removeClass('selected');
		c.addClass('selected');
		if(!this.leftC) c.css('border-left-color','transparent');
		this.tabpanel.find('>div').css('display','none');
		this.tabpanel.find('[action-data="'+c.attr('action-data')+'"]').css('display','block');
	}
});
//	选项卡结束


/**
 * 系统提示条
 *
 * @param:type	    1为普通样式，2为成功，3为错误
 * @param:text		显示的文字
 * @param:icon		显示的icon
 * @param:delay		显示时间长度，默认为0，程序控制关闭
 * @param:zIndex	CSS的z-index
 * @param:slow		淡出效果的时间
 */

jw.SysNotice = Backbone.View.extend({
	initialize:function(options){
		this.tabOptions = ['type','text','icon','delay','zIndex','slow'];
		this._options = {
			'type'	: 1,
			'text'	: '',
			'icon'	: '',
			'delay'	: 0,
			'zIndex': 4000,
			'slow'	: 600
		};
		_.extend(this,_.pick(_.extend(this._options,options),this.tabOptions));
		this._initBar();
	},
	_initBar:function(){
		var self = this;
		if($('.sysNoticeBar').length) $('.sysNoticeBar').remove();
		this.sysBar = $('<div class="sysNoticeBar" style="z-index:'+this.zIndex+'">\
							<div class="sys_nb">\
								<span class="sn_con sn_t'+this.type+'">'+this.text+'</span>\
							</div>\
						</div>');
		if(this.icon) this.sysBar.find('.sys_nb').prepend('<img class="sn_img" src="'+this.icon+'" \>');
		$('body').prepend(this.sysBar);
		this.delay && setTimeout(function(){
			self.HideBar();
		},this.delay)
	},
	HideBar:function(){
		var self = this;
		this.sysBar.fadeOut(this.slow,function(){
			self.sysBar.remove();
			self.trigger('finish');
		});
	},
	hide:function(){
		this.HideBar();
	}
});

jw.FormNotice=jw.SysNotice.extend({
	_initBar:function(){
		var self=this,
			oldc=$('.jw-formnotice-w');
		if(oldc.length>0) oldc.remove();
		this.sysBar=$('<div class="jw-formnotice-w"><div class="jw-formnotice-c shadow"><span>'+this.text+'</span><a href="javascript:;">知道了</a></div></div>');
		// 居中显示弹出窗口
		var dtop = $(document).scrollTop();
		this.sysBar.css({top:($(document).scrollTop()+40)+'px'});
		$('body').append(this.sysBar);
		_.delay(function(){
			self.HideBar();
		},5000);
		this.sysBar.find('a').click(function(){
			self.trigger('iknown');
			self.HideBar();
		})
	}
})

//系统提示条结束

/**
 * 系统级事件处理(启动前端初始化)
 */
var FrontInit=(function(){
	// 系统错误处理
	$.subscribe('jw:syserror',function(evt,d){
		trace(d);
	});
	// 系统消息处理
	$.subscribe('jw:sysmessage',function(evt,d){
		trace(d);
	});
})();

/**
 * 获取当前链接中的 protocol+host
 * 用于信息流短链接拼装
 */
jw.CombineUrlRoot=function(){
	return window.location.protocol+'//'+window.location.host;
}

/**
 * 基本输入框组件
 * options 
 * 		status		默认状态 normal, disabled 状态
 * 		adaptHeight 自适应高度
 * 		tip			输入框提示文字
 * 		txt			默认文本内容
 * 		minHeight	输入栏最小高度
 *		forbiddenkeys 禁止响应的按键 如escape/37上箭头/39下箭头
 * functions
 * 		setText/getText
 * 		setFocus	设置焦点
 * 		setStatus	设置状态
 * 		setTip		设置提示文字
 * events
 * 		focus
 * 		blur
 * 		keydown
 */
jw.BaseTextarea=Backbone.View.extend({
	initialize:function(options){
		this._options ={
			status:'normal',		// 正常状态 normal, disabled 状态
			adaptHeight:1,			// 自适应高度
			tip:'',					// 输入框提示文字
			txt:'',					// 默认文本内容
			minHeight:0,				// 输入栏最小高度
			_default:''				// 默认值
		};
		_.extend(this, _.pick(_.extend(this._options,options), ['status','adaptHeight','tip','txt','minHeight','_default']));
		var self = this;
		if(!$(this.el).is('textarea')&&$(this.el).find('textarea').length==0){
			this._textarea=$('<textarea class="textarea" placeholder="'+self.tip+'">'+self.txt+'</textarea>');
			$(this.el).append(this._textarea);
			this._textarea.css('minHeight',self.minHeight+'px');
		}else{
			this._textarea = $(this.el).find('textarea');
			if(this.tip!='') this._textarea.attr('placeholder',this.tip);
			if(this.txt!='') this._textarea.html(this.txt);
		}
		if( options.forbiddenkeys ){
			this.forbiddenkeys = options.forbiddenkeys.split(',');
		}
		_.bindAll(this,'onChange');
		this.adaptHeight==1 && this._initAdaptHeight();
		this._bindEvt();
		this.setStatus();
		this._default!='' && this.setText(this._default);
	},
	setStatus:function(status){
		this.status = status;
		if(this.status == "disabled"){
			this._textarea.attr('disabled','disabled')
		}else{
			this._textarea.removeAttr('disabled')
		}
	},
	_bindEvt:function(){
		var self = this;
		if(this.status == 'disabled') return ;
		this._textarea.bind('input propertychange',this.onChange)
			.focus(function(){self.trigger('focus')})
			.blur(function(){self.trigger('blur')})
			.keydown(function(evt){
				if(self.forbiddenkeys && _.indexOf( self.forbiddenkeys, evt.keyCode+'' )>=0) return;
				self.trigger('keydown',evt);
			});
		// 提示文字辅助
		if(this.tip&&this.tip!=''&&!$.support.placeholder) this._TipAssist();
		// IE8/9 change 
		if($.support.Ie8_9) this._ieChange()
	},
	onChange:function(){
		this.adaptHeight==1 && this._updateHeight();
		this.trigger('change',this._textarea.val());
	},
	_initAdaptHeight:function(){
		var self = this;
		var div =$('<div><span></span></div>'),
			e = this._textarea,
			h = this._textarea.height(),
			cssparams={
				position:'absolute', 'z-index':'-1000','font-size':e.css('font-size'),'font-family':e.css('font-family'),'padding-left':e.css('padding-left'),'padding-right':e.css('padding-right'),
				'padding-top':e.css('padding-top'),'padding-bottom':e.css('padding-bottom'),'margin-left':e.css('margin-left'),'margin-right':e.css('margin-right'),
				'margin-top':e.css('margin-top'),'margin-bottom':e.css('margin-bottom'),'line-height':e.css('line-height'),'min-height':e.css('min-height'),'word-wrap':'break-word',
				visibility:'hidden',opacity:0.5,background:'burlyWood'};
                $('body').append(div.css(cssparams));

		$('body').append(div.css(cssparams));
		this._companion = div;
		this._companionH = h;
		setTimeout(function(){
			var offset =self._textarea.offset(),w=self._textarea.width(),
				css=css={width:w+'px',top:offset.top+"px",left:offset.left+"px"};

			self._companion.css(css)
			// if(offset.top==0||offset.left<0){
				self._textarea.one('focus',function(){
					var offset =self._textarea.offset(),w=self._textarea.width(),
						css={width:w+'px',top:offset.top+"px",left:offset.left+"px"};
					self._companion.css(css)
				})
			// }
		},500);
		// this._textarea.focus(function(){
		// 	var offset =self._textarea.offset(),w=self._textarea.width(),
		// 		css={width:w+'px',top:offset.top+"px",left:offset.left+"px"};
		// 	self._companion.css(css)
		// })
	},
	// 更新输入栏高度
	_updateHeight:function(){
		var self = this,
			content = this._textarea.val();
		content=content.replace(/\ /g,'&nbsp;').replace(/\n/g,"<br />&nbsp;").replace(/<script>/g,'&lt;script').replace(/<base/g,'&lt;base');
		this._companion.children('span').html(content);
		// this._textarea.css('height',this._companion.outerHeight()+'px');
		setTimeout(function(){
			self._textarea.css('height',self._companion.outerHeight()+'px');
		},0);
	},
	// IE 下输入栏内容发生变化
	_ieChange:function(){
		var self =this;
		this._textarea.bind('keydown',function(evt){
			self._cachestr=self._textarea.val();
		}).bind('keyup',function(evt){
			if((evt.keyCode==8||evt.keyCode==46||(evt.ctrlKey&&evt.keyCode==88))&&(self._cachestr!=self._textarea.val())){
				self.onChange();
			}
		})
	},
	// 提示文字辅助
	_TipAssist:function(){
		jw.BaseInput.prototype._TipControll.call(this,this._textarea);
	},
	// 设置提示文字
	setTip:function(str){
		this.tip = str;
		if($.support.placeholder) this._textarea.attr('placeholder',str)
		else{
			this._TipAssist();
		}
	},
	// 设置当前输入栏文本
	setText:function(str){
		this._textarea.val(str);
		this.onChange();
		return this;
	},
	// 获取当前输入栏文字
	getText:function(){
		return this._textarea.val();
	},
	setFocus:function(){
		this._textarea.focus();
		this.trigger('onFocus');
		return this;
	},
	// 移动光标到最后
	moveCursorLast:function(){
		var pos=this._textarea.val().length;
		// trace('moveCursorLast ['+pos+']');
		// if(document.createTextRange){
		if($.support.Ie8_9){
			trace('x1')
			var range=this._textarea[0].createTextRange();
			range.move("character", pos);
			range.select();
		}else{
			this._textarea[0].select();
			this._textarea[0].selectionStart=pos;
			this._textarea[0].selectionEnd=pos;
		}
		return this;
	},
	// 移动光标到最前
	moveCursorFirst:function(){
		if(document.createTextRange){
			var range=this._textarea[0].createTextRange();
			range.move("character", 0);
			range.select();
		}else{
			this._textarea[0].select();
			this._textarea[0].selectionStart=0;
			this._textarea[0].selectionEnd=0;
		}
		return this;
	}
});
/**
 * jw.Textarea 组件
 * 继承自 jw.Basetextarea
 * options
 *		strictly		是否严格限制输入，即达到最大数量后是否允许输入
 *		maxselnum		文字最大长度，1个中文 = 两个英文len=1
 *		customborder	默认没有边框
 */
jw.Textarea=jw.BaseTextarea.extend({
	initialize:function(options){
		this._options={
			strictly:0,
			maxselnum:0,
			customborder:0
		};
		_.extend(this, _.pick(_.extend(this._options,options), ['strictly','maxselnum','customborder',"tip"]));
		// 初始化容器
		this._initElement()
		jw.BaseTextarea.prototype.initialize.call(this,_.extend(options,{el:this._wrap.find('textarea')}));
	},
	// 初始化区域
	_initElement:function(){
		this._wrap=$('<div class="textarea-w"><div class="textarea-c"><textarea class="textarea"></textarea></div></div>');
		if(this.maxselnum > 0){
			this._numtip=$('<div class="numtip">'+this.maxselnum+'</div>');
			this._wrap.find('.textarea-c').append(this._numtip);
		}
		this.customborder!=0 && this._wrap.addClass('Border');
		$(this.el).append(this._wrap);
	},
	// 继承父类的change
	onChange:function(){
		this.maxselnum>0 && this._setNumtip()
		jw.BaseTextarea.prototype.onChange.call(this);
	},
	_setNumtip:function(){
		var str=this._textarea.val(),
			num=str.LengthW();
		if(str == this.tip) this._numtip.html(this.maxselnum)
		else this._numtip.html(this.maxselnum-num)
		if(num<this.maxselnum){
			// IE 8/9 不可设置maxlength属性？
			this.strictly==1 && !$.support.Ie8_9 && this._textarea.removeAttr('maxlength');
			this._numtip.removeClass('error');
		}else {
			if(this.strictly==1 && !$.support.Ie8_9 ){
				this._textarea.attr('maxlength',str.length);
			}else{
				this._numtip.html(-(num-this.maxselnum))
				
			}
			this._numtip.addClass('error')
		}
	}
});

/**
 * 包含@对象提示、#标签 提示的多行输入框
 * options
 *		attip:1/0 是否订阅@ 提示
 *		tagtip:1/0 是否订阅标签提示
 *		urltip:1/0 是否订阅链接提示
 */
jw.RichTextarea=jw.Textarea.extend({
	initialize:function(options){
		this._options={
			'attip':1,
			'tagtip':1,
			'urltip':0,
			'tips_interval':500
		};
		_.extend(this, _.pick(_.extend(this._options,options), ['attip','tagtip','urltip','tips_interval']));
		jw.Textarea.prototype.initialize.call(this,_.extend(options));
		if(this.attip||this.tagtip) this._initTip();
		this._curMatch={type:'',key:''};
		this._focused=false;		// 获取焦点状态， 为兼容IE添加
		_.bindAll(this,'selectObj')
		this._objlist=new jw.TextSearchObj();
		this._objlist.bind('select',this.selectObj);
	},
	// 添加上下箭头处理
	_bindEvt:function(){
		var self=this;
		jw.Textarea.prototype._bindEvt.call(this);
		this._textarea.bind('keydown',function(evt){
			if(self._objlist.showing){
				if(evt.keyCode==38||evt.keyCode==40){
					// 上下箭头
					self._objlist.selitem(evt.keyCode==38?'prev':'next');
					evt.preventDefault();
				}else if(evt.keyCode==13){
					// 回车键
					self._objlist.selectCurrent();
					evt.preventDefault();
				}
			}
		});
	},
	_initTip:function(){
		var self=this;
		// 得到焦点时启动timer, 失去焦点时，停止timer
		this._textarea.focus(function(){
			self._startTimer();
			self._focused=true;
		}).blur(function(){
			self._focused=false;
			if(self._tHandler)
				try{ clearTimeout(self._tHandler);}catch(e){}
		});
		this._companionTxtWrap=this._companion.find('span');
	},
	// 启动定时器
	_startTimer:function(){
		var self=this;
		if(this._tHandler)
			try{ clearTimeout(this._tHandler);}catch(e){}
			
		this._inputTip();
		
		this._tHandler=setTimeout(function(){
			self._startTimer();
		},this.tips_interval);
	},
	_inputTip:function(){
		var match=this._getMatch();
		// trace(match);
		if(!match) return;		// 没有匹配的对象，则返回
		// 2. 如果有匹配的关键字"@","#",则显示匹配到的对象或标签
		var atpos=this._getAtPos();
		// trace(atpos);
		atpos.top+=20;
		// trace('searchObj['+match.type+']['+match.key+']');
		if(match.type=='obj')
			this._objlist.searchObj(this._curMatch.key,atpos);
		else if(match.type=='tag')
			this._objlist.searchTag(this._curMatch.key,atpos);
	},
	/**
	 * 匹配文字中的@ #
	 * 光标定为一并在这个函数中处理
	 */
	_getMatch:function(){
		var atreg=/@[^@\s]{0,20}$/g;
		var tagreg=/#[^#\s]{1,20}$/g;
		var matchchr='',matchtype='',key,str=this._textarea.val();
		var snap,snap=value=str.replace(/\r/g,"");
		
		var selection=jw.getTextareaCursorPos(this._textarea[0]),
			selectionStart=selection.start;
		value=value.slice(0,selectionStart);

		/*if((key=value.match(atreg))&&(key=key[0])&&/^@[a-zA-Z0-9\u4e00-\u9fa5_]{0,20}$/.test(key)){
			trace('matchchr @')
		}*/
		// if((key=value.match(atreg))&&(key=key[0])&&/^@[a-zA-Z0-9\u4e00-\u9fa5_]+$/.test(key)) matchchr='@';
		if((key=value.match(atreg))&&(key=key[0])&&/^@[a-zA-Z0-9\u4e00-\u9fa5_]{0,20}$/.test(key)) matchchr='@';
		else if((key=value.match(tagreg))&&(key=key[0])&&/#[a-zA-Z0-9\u4e00-\u9fa5_]+$/.test(key)) matchchr='#';
		
		// trace('matchtype['+matchtype+'] matchchr['+matchchr+']['+key+']');
		if(!key) this._curMatch.key='';
		if(matchchr==''){
			this._curMatch.key = null;
			if(this._objlist.showing) this._objlist._close();
			return null;
		}
		
		key=key.slice(1);
		
		if(matchchr=='#') matchtype='tag';
		else if(matchchr=='@') matchtype='obj';
		// trace('matchtype['+matchtype+'] matchchr['+matchchr+']['+key+'] this._curMatch['+this._curMatch.type+']['+this._curMatch.key+']');
		
		if(this._curMatch.type==matchtype&&this._curMatch.key==key) return;		// 
		
		this._curMatch={type:matchtype,key:key};
		var last=snap.slice(selectionStart-key.length,snap.length);
		// trace('selectionStart ['+selectionStart+'] key['+key+'] value['+value+'] last['+last+']');
		value=value.slice(0,-key.length-1);
		value=value.replace('<','&lt;');
		last=last.replace('<','&lt;');
		var html=value.replace(/\n/g,"<br />")+'<span class="atflag">'+matchchr+'</span>'+last.replace(/\n/g,"<br />");
		this._companionTxtWrap.html(html);
		return this._curMatch;
	},
	// 获取 _companion 中预置的at span位置
	_getAtPos:function(){
		// trace(this._companionTxtWrap.html())
		return this._companionTxtWrap.find('span.atflag:first').offset();
	},
	// 选择了对象
	selectObj:function(selectObj){
		if($.browser.msie&&!this._focused) this._textarea.focus();
		var x=this._SplitByCursor(),
			rstr=selectObj.name.replace(/\ /ig,'_'),
			cursorpos=x.f.length;
		if(this._curMatch.type=='tag'){
			if(x.l.substring(0,1)!='#'){
				rstr+='# ';
				cursorpos+=rstr.length;
			}else{
				cursorpos+=rstr.length+2;
			}
		}else{
			rstr+=' ';
			cursorpos+=rstr.length;
		}
		this._textarea.attr('value',x.f+rstr+x.l);
		this._PosCursor(cursorpos);
		this.trigger('selectObj',selectObj);
		this._curMatch.key='';
	},
	_SplitByCursor:function(){
		var str=this._textarea.val(),
			snap=str.replace(/\r/g,""),
			selection=jw.getTextareaCursorPos(this._textarea[0]);
			selectionStart=selection.start;
		return {f:snap.slice(0,selectionStart-this._curMatch.key.length),
			l:snap.slice(selectionStart,snap.length)};
	},
	// 重新设置光标位置 
	_PosCursor:function(pos){
		//TODO:IE
		if($.browser.msie){
			var range=this._textarea[0].createTextRange();
			range.move("character", pos);
			range.select();
		}else{
			var txt=this._textarea[0];
			txt.select();
			txt.selectionStart=pos;
			txt.selectionEnd=pos;
		}
	}
});
/**
 * Textarea 中对象匹配组件
 */
jw.TextSearchObj=jw.SocialObjList.extend({
	initialize: function(options) {
		var options=options||{};
		options.action='index';
		jw.SocialObjList.prototype.initialize.call(this,options);
	},
	// 设置浮出栏的位置
	searchObj:function(str,pos){
		pos = this._adjustPos(pos);
		$(this.el).css({left:pos.left+'px',top:pos.top+'px'});
		// this._socialobjs.fetch(this._action,str);
		// trace('searchObj ['+str+']')
		if( str == '' ){
			this._socialobjs.fetch('offenused','');
		}else{
			this._socialobjs.fetch(this._action,str);
		}
	},
	// 设置浮出栏的位置
	searchTag:function(str,pos){
		pos = this._adjustPos(pos);
		$(this.el).css({left:pos.left+'px',top:pos.top+'px'});
		this._socialobjs.fetch('topic',str);
	},
	// 调整左右位置
	_adjustPos:function(pos){
		var dimension = jw.findDimensions();
		if((pos.left+320)>dimension.width) pos.left = dimension.width - 320 - 10;
		return pos;
	},
	// 选择ITEM
	selectCurrent:function(){
		var cur=this._objw.find('.selected');
		this.select(this._socialobjs.get(cur.attr('action-data')).toJSON());
		this._close();
	}
});
/**
 * 分享组件
 */

jw.ShareDefDict=[
	{key:'public',name:'公开'}
];
jw.ShareDefObj={
	'public':{id:'public',name:'公开',type:'public'}
}
/**
 * 分享范围组件 - 继承自社会化对象列表组件 (无常用对象支持)
 * options
 * 		action - 获取对象的接口名称(获取所有对象 index， 获取用户 users ...)
 * 		defaults - 默认显示的对象（定制公开、同事等常量）
 * 		initdata - [{id,name,type},...] 初始数据（如编辑任务时，观察员列表）
 * 		style - standard 标准模式（含弹出框选择对象），simple 不含弹出框
 * 		tip - 添加对象的提示文字
 * 		disabled - true
 */
jw.BaseShare=jw.SocialObjList.extend({
	initialize:function(options){
		_.bindAll(this, 'focus', 'blur', 'keydown', 'getObjs','addOneSocialObj', 'addSelObj');
		this._options={
			action:'index',
			defaults:[],
			initdata:[],
			style:1,
			tip:'+ 添加分享对象',
			disabled:false,
			email:false
		};
		_.extend(this, _.pick(_.extend(this._options,options), ['action','defaults','initdata','style','tip','disabled','email']));
		// trace('email',this.email)
		this._initComponent();

		jw.SocialObjList.prototype.initialize.call(this,_.extend(this._options,options));
	},
	_initComponent:function(){
		var self=this;
		// 1. 分享显示区
		$(this.el).append('<div class="share-cw"><div class="share-w"> \
			<div class="share-c"><span class="share-addobj"><span class="share-add-btn">'+this.tip+'</span><input class="share-input input-d" type="text" value="" /></span></div> \
		</div></div>');

		if( this.disabled ){
			this.$el.find('.share-w').addClass('disabled');
			// this.$el.find('.share-add-btn').addClass('disabled');
		} 

		this._wrap=$(this.el);
		this._sharew=this._wrap.find('.share-w');
		this._addSharew=this._sharew.find('.share-addobj');
		// 输入框初始化
		this._input=new jw.BaseInput({
			el:self._wrap.find('input')
		})

		this._selobjs=new jw.SocialObjs({action:'share'});	// 选中的对象 Collection
		
		this._selobjs.bind('add',this.addOneSocialObj);
		this._selobjs.bind('remove',function(){
			self.trigger('change',self._selobjs);
		})
		this._initDefaults();

		/*this.bind('select',function(selitem){
			// trace('select ===')
			self._selobjs.create(selitem);
			self._input._input.val('').focus();
			self.close();
		})*/
		this.bind('select', this.addSelObj );
	},
	// 添加用户选择的社会化对象
	addSelObj:function( selitem ){
		if(!selitem) return;
		if(selitem.type!='jw_n_user'){
			var model=this._selobjs.get('public');
			model && model.destroy();
		}
		this._selobjs.create(selitem);
		this._input._input.val('').focus();
		this.close();
	},
	// 初始化默认对象
	_initDefaults:function(){
		var self=this;
		if(this.defaults.length>0){
			this._selobjs.create(jw.ShareDefObj['public']);
		}
		this.initdata.length>0 && _.each(this.initdata,function(item){
			self._selobjs && self._selobjs.create(item);
		})
		// trace('xxxx',this.defaults)
	},
	// 提供给外部调用
	addOne:function(obj){
		// 如果obj的类型是对象（群组、项目、任务等），则删除public
		if(obj.type!='jw_n_user'){
			var model=this._selobjs.get('public');
			model && model.destroy();
		}
		this._selobjs.create(obj);
	},
	// 添加一个社会化对象按钮
	addOneSocialObj:function(obj){
		var view=new jw.ShareButton({model: obj});
		this._addSharew.before(view.render().el);
		this.trigger('change',this._selobjs);
	},
	_bindEvt:function(){
		var self=this;
		this._input.bind('focus',this.focus);
		this._input.bind('onBlur',this.blur);
		this._input.bind('keydown',this.keydown);
		this._input.bind('change',this.getObjs);		
		// 查找对象状态
		this._sharew.click(function(evt){
			if( self.disabled ) return;
			var classname=$(evt.target).attr('class');
			if(classname=='share-c'||classname=='share-w'||classname=='share-add-btn'||classname=='share-addobj'){
				self._input._input.focus();
			}
		})
		jw.SocialObjList.prototype._bindEvt.call(this);
	},
	focus:function(){
		// 应该默认显示常用对象
		if(this.hiddenTimer) try{clearTimeout(this.hiddenTimer);delete this.hiddenTimer;}catch(e){}
		this._addSharew.find('.share-add-btn').html('&nbsp;')
		this._addSharew.addClass('actived');
		this._input._input.val('');
	},
	blur:function(){
		var self=this;
		try{clearTimeout(this.hiddenTimer);delete this.hiddenTimer;}catch(e){}
		this.hiddenTimer=setTimeout(function(){
			self._addSharew.find('.share-add-btn').html(self.tip);
			self._addSharew.removeClass('actived');
			self.showing && self.close();
			// self._input._input.val('');
			self._input.getText() != '' && self._input.setTxt('',{silent:true});
		},500);
	},
	keydown:function(evt){
		if(evt.keyCode==27){
			// Escape 则隐藏下拉列表
			this._close();
		}else if(evt.keyCode==38||evt.keyCode==40){
			// 移动选中
			evt.preventDefault();
			if(this.showing){
				// 社会化对象列表selected 切换
				this.selitem(evt.keyCode==38?'prev':'next');
			}
		}else if(evt.keyCode==13){
			// 回车键，选中当前
			var selitem;
			if(this.showing){
				// 社会化对象列表中选择当前
				selitem=this.getCurrent();
			}
			this.addSelObj(selitem)
			// this._selobjs.create(selitem);
			// this._input._input.val('');
			this._input.trigger('change','');
		}else if(evt.keyCode==8){
			// 回退键，删除最后一个对象
			if(this._input.getTxt()==''){
				this._selobjs.pop();
			}
		}
		if( this._status && this._status == 'error' ){
			this._status = 'normal';
			this.$el.find('.share-w').removeClass('error');
		}
	},
	getObjs:function(str){
		this._SearchStr=str;
		if(str===''){
			// 如果为空，则隐藏下拉列表
			this._close();
		}else{
			// 匹配
			this._objw.empty();
			if(this.email && this._SearchStr.indexOf('@')>=0){
				this._socialobjs.reset([{type:'jw_n_email',id:this._SearchStr,name:this._SearchStr,avatar:'/public/images/avatar/contact-pic.png'}])
			}else{
				this._socialobjs.fetch(this._action,str);
			}
		}
	},
	// 重写SocialObjList的窗口初始化
	_initDlg:function(){
		$(this.el).append('<div class="jw-fd jw-objlist fd-shadow"><div class="jw-objs"></div></div>');
		this._objw=this.el=$(this.el).find('.jw-objlist');
	},
	/**
	 * 获取分享范围
	 * type 获取分享范围类型 默认返回数组 1 返回整理好的对象 {share_scope:'',share_uids:[],share_objs:[]}
	 */
	getShare:function(type){
		var shareobjs=this._selobjs.toJSON();
		/*trace('getShare ['+typeof type+'] ['+typeof shareobjs.filter+']')
		if(typeof type=='undefined'&&typeof shareobjs.filter=='function'){
			shareobjs = shareobjs.filter(function(item){
				return item.id;
			});
		} */
		// trace('getShare 1');
		shareobjs = _.filter(shareobjs,function(item){
			return item.id;
		});
		// trace('1',shareobjs);
		if(type == 1){
			return _.map(shareobjs,function(item){
				return {id:item.id,name:item.name,type:item.type,email:item.email};
			})
		}
		// trace('2',shareobjs);
		/*if(typeof shareobjs.filter=='function') shareobjs = shareobjs.filter(function(item){
			return item.id;
		});*/
		var sharescope='',share_uids=[],share_objs=[];
		_.each(shareobjs,function(item){
			if(item.type=='public') sharescope='public';
			else{
				if(item.type=='jw_n_user'){
					share_uids.push(item.id);
				}else{
					item.type && share_objs.push({type:item.type,id:item.id});
				}
			}
		});
		return {
			share_scope:sharescope===''?'custom':sharescope,
			share_uids:share_uids,
			share_objs:share_objs
		};
	},
	// 恢复初始状态
	restore:function(type){
		var self = this;
		if(type){
			this.initdata = this.model.get(this.name);
			this.empty();
			_.each(this.initdata,function(item){
				console.log(item)
				self._selobjs && self._selobjs.create(item);
			})
		}else{
			// 删除所有分享对象
			for(var i=0,cnt=this._selobjs.length;i<cnt;i++)
				this._selobjs.pop();
			// 重新初始化
			this._initDefaults();
		}
	},
	empty:function(){
		for(var i=0,cnt=this._selobjs.length;i<cnt;i++)
			this._selobjs.pop();
	},
	// 设置组件错误状态
	setStatus:function( status ){
		trace('status['+status+']')
		if( status == 'error' ){
			this.$el.find('.share-w').addClass('error');
		}else{
			this.$el.find('.share-w').removeClass('error');
		}
		this._status = status;
	}
});
/**
 * 分享范围组件 - 继承自社会化对象列表组件( 支持常用对象 )
 * 扩展自jw.BaseShare，但代码复用不好，待重构
 * options
 * 		action - 获取对象的接口名称(获取所有对象 index， 获取用户 users ...)
 * 		defaults - 默认显示的对象（定制公开、同事等常量）
 * 		initdata - [{id,name,type},...] 初始数据（如编辑任务时，观察员列表）
 * 		offenobjs - 是否展示常用对象
 * 		style - standard 标准模式（含弹出框选择对象），simple 不含弹出框
 * 		tip - 添加对象的提示文字
 */
jw.Share=jw.BaseShare.extend({
	events:{
		'click .share-secondarybtn':'dialogObjs'
	},
	initialize:function(options){
		_.bindAll(this, 'focus', 'blur', 'keydown', 'getObjs', 'refreshOffenObjs','addOneSocialObj','removeOneSocialObj','ShareDlgSucc','addOne');
		this._options={
			action:'index',
			defaults:[],
			initdata:[],
			offenobjs:0,
			style:1,
			tip:'+ 添加分享对象'
		};
		_.extend(this, _.pick(_.extend(this._options,options), ['action','defaults','initdata','offenobjs','style','tip']));
		this._initComponent();

		jw.SocialObjList.prototype.initialize.call(this,_.extend(this._options,options));
	},
	_initComponent:function(){
		var self=this;
		jw.BaseShare.prototype._initComponent.call(this);
		// 添加分享头像
		$(this.el).find('.share-w').addClass('has-secondarybtn').before('<div class="share-secondarybtn"></div>');
		// 常用对象列表
		this._offenuseobjs=new jw.SocialObjs({action:'offenused'});
		this._offenuseobjs.bind('reset', this.refreshOffenObjs);
		setTimeout(function(){
			self._offenuseobjs.fetch('offenused','');
		},1000);
	},
	// 移除一个选中的对象
	removeOneSocialObj:function(obj){
		// trace('removeOneSocialObj 貌似这里不需要处理')
		// $(this.el).remove();
	},
	focus:function(){
		jw.BaseShare.prototype.focus.call(this);
		this._offenDlgFD.show();
	},
	blur:function(){
		var self=this;
		
		try{clearTimeout(this.hiddenTimer);delete this.hiddenTimer;}catch(e){}
		
		this.hiddenTimer=setTimeout(function(){
			self._addSharew.find('.share-add-btn').html(self.tip);
			self._addSharew.removeClass('actived');
			self._offenDlgFD.showing && self._offenDlgFD.close();
			self.showing && self.close();
			// self._input._input.val('');
			// self._input.setTxt('',{silent:true});
			self._input.getText() != '' && self._input.setTxt('',{silent:true});
		},500);
	},
	keydown:function(evt){
		if(evt.keyCode==27){
			// Escape 则隐藏下拉列表
			this._close();
		}else if(evt.keyCode==38||evt.keyCode==40){
			// 移动选中
			evt.preventDefault();
			if(this.showing){
				// 社会化对象列表selected 切换
				this.selitem(evt.keyCode==38?'prev':'next');
			}else if(this._offenDlgFD.showing){
				// 常用对象列表selected 切换
				this._offenlist.preselitem(evt.keyCode==38?'prev':'next');
			}
		}else if(evt.keyCode==13){
			// 回车键，选中当前
			var selitem;
			if(this.showing){
				// 社会化对象列表中选择当前
				selitem=this.getCurrent();
			}else if(this._offenDlgFD.showing){
				// 常用对象列表选择当前
				selitem=this._offenlist.getCurrent();
				if(!selitem) return;
				if(selitem.key=='public'){
					// selitem={id:'public',type:'public',name:'公开'};
					selitem=jw.ShareDefObj['public'];
				}else{
					selitem=_(this._offenuseobjs.toJSON()).find(function(item){
						return selitem.key==item.id;
					});
				}
			}
			this.addSelObj(selitem)
			this._input.trigger('change','');
		}else if(evt.keyCode==8){
			// 回退键，删除最后一个对象
			this._input.getTxt()=='' && this._selobjs.pop();
		}
	},
	getObjs:function(str){
		this._SearchStr=str;
		if(str===''){
			// 如果为空，则隐藏下拉列表
			this._close();
			this._offenDlgFD.show();
		}else{
			// 匹配
			this._offenDlgFD.showing && this._offenDlgFD.close();
			this._objw.empty();
			this._socialobjs.fetch(this._action,str);
		}
	},
	// 常用对象菜单
	refreshOffenObjs:function(){
		this._offenDlg=$('<div class="jw-fd jw-offenobj fd-shadow"></div>');
		this._offenDlgFD=new jw.FD({
			el:this._offenDlg,
			autoShow:false,
			removeOnClose:false,
			CloseOnEscape:true,
			CloseOnClick:true
		});
		this._sharew.parent().append(this._offenDlg);
		// 拼装列表所需要的数据格式
		var offenuses=_.map(this._offenuseobjs.toJSON(),function(item){
			return {key:item.id,txt:item.name};
		});
		this._offenlist=new jw.OffenuseObjView({
			el:this._offenDlg,
			items:_.union([
				{key:'sep'},
				{key:'public',txt:'公开'},
				{key:'sep'}],offenuses)
		});
		// 鼠标点击选中了一个对象
		var self=this;
		this._offenlist.bind('change',function(item){
			// TODO: 应该将创建对象封装一个函数
			if(item.key=='public'){
				// item={id:'public',type:'public',name:'公开'};
				item=jw.ShareDefObj['public'];
			}else{
				item=self._offenuseobjs.get(item.key).toJSON()
			}
			// 如果添加的对象不是用户，则去掉公开
			if(item.type!='jw_n_user'){
				var model=self._selobjs.get('public');
				model && model.destroy();
			}
			self._selobjs.create(item);
			self._input._input.focus();
		})
	},
	dialogObjs:function(evt){
		if( this._dialog ) delete this._dialog;
		this._dialog = new jw.sharedialog( {
			objs: this.getShare(1)
		});
		this._dialog.bind('share_dlg_success',this.ShareDlgSucc);
	},
	ShareDlgSucc:function(objs){
		// if( objs.length == 0 ) return;
		var self = this;
		// this.restore();
		_.each(objs, this.addOne );
	},
	errorAlert:function(){
		var self=this;
		self.alert_num=0;
		var container = this.$el.find('.share-w');
		// trace('container['+container.length+']')
		// trace(this.$el.html())
		this.alert_handle=setInterval( function(){
			if(container.hasClass('error')) container.removeClass('error');
			else container.addClass('error');
			self.alert_num++;
			if(self.alert_num==4) window.clearInterval(self.alert_handle);
		}, 250);
	}
});
/**
 * 支持电子邮件的分享范围组件
 * 电子邮件输入栏宽度要200px
 */
jw.emailShare=jw.BaseShare.extend({
	initialize:function(options){
		options.email = true;
		jw.BaseShare.prototype.initialize.call(this, options);
	},
	_initComponent:function(){
		jw.BaseShare.prototype._initComponent.call(this);
		$(this.el).find('.share-addobj').addClass('share-addemail');
	},
	/**
	 * 获取分享范围
	 * 
	 */
	getUsers:function(x){
		return _.reduce(x,function(catalory, item){
		    _.isArray(catalory[item.type])?catalory[item.type].push(item):catalory[item.type]=[item];
		    return catalory;
		}, {});
	}
});
/**
 * 享邮收件人组件
 */
jw.joymailShare = jw.BaseShare.extend({
	initialize:function(options){
		options.email = true;
		jw.BaseShare.prototype.initialize.call(this, options);
	},
	_initComponent:function(){
		jw.BaseShare.prototype._initComponent.call(this);
		$(this.el).find('.share-addobj').addClass('share-addemail');
		this.bindKeydown();
	},
	addOneEmail: function(){
		var selitem;
		if(this.showing){
			selitem=this.getCurrent();
		}
		this.addSelObj(selitem)
		this._input.trigger('change','');
	},
	bindKeydown: function(){
		var that = this;
		this._input.$el.keydown(function(evt){
			if(evt.keyCode==9){
				if( (that._input.getTxt()+'').isEmail() ){
					that.addOneEmail();
					return true;
				}else if( that._input.getTxt()=='' ){
					return true;
				}else{
					return false;
				}
			}
		});
	},
	keydown:function(evt){
		if(evt.keyCode==27){
			// Escape 则隐藏下拉列表
			this._close();
		}else if(evt.keyCode==38||evt.keyCode==40){
			// 移动选中
			evt.preventDefault();
			if(this.showing){
				// 社会化对象列表selected 切换
				this.selitem(evt.keyCode==38?'prev':'next');
			}
		}else if(evt.keyCode==186||evt.keyCode==188||evt.keyCode==32||evt.keyCode==13){
			// // 回车键，选中当前
			var selitem, canAdd = true;
			if(this.showing){
				// 社会化对象列表中选择当前
				selitem=this.getCurrent();
			}
			if( selitem&&selitem.type&&selitem.type=='jw_n_email' ){
				if(selitem.email){
					canAdd = true;
				}else if( ( $.trim(selitem.id+'')).isEmail() ){
					selitem.id = $.trim(selitem.id+'');
					canAdd = true;
				}else{
					canAdd = false;
				}
			}
			if(canAdd){
				this.addSelObj(selitem);
				this._input.trigger('change','');
			}
		}else if(evt.keyCode==8){
			// 回退键，删除最后一个对象
			if(this._input.getTxt()==''){
				this._selobjs.pop();
			}
		}
		if( this._status && this._status == 'error' ){
			this._status = 'normal';
			this.$el.find('.share-w').removeClass('error');
		}
	},
	/**
	 * 获取分享范围
	 */
	getUsers:function(x){
		return _.reduce(x,function(catalory, item){
		    _.isArray(catalory[item.type])?catalory[item.type].push(item):catalory[item.type]=[item];
		    return catalory;
		}, {});
	},
	_combineEmail:function(socialobj){
		var apndclass='chkfail';
		if($.trim(socialobj.name).isEmail()) apndclass='chkpass';
		if(!socialobj.email) socialobj.email = '发送邮件至';
		else apndclass='chkpass';
		this._objw.append('<div class="jw-obj" action-data="'+socialobj.id+'"><div class="jwobj-logo"><span class="jwobj-logo-email"></span></div><div class="jwobj-w"><div class="jwobj-name ellipsis"><span>'+socialobj.email+'</span></div><div class="jwobj-desc '+apndclass+'">'+socialobj.name+'</div></div></div>');
	}
});
/**
 * 下拉列表+分享范围组合 - 分享范围组件
 */
jw.ComplexShare=jw.Combobox.extend({
	initialize:function(options){
		options=options||{};
		options.dropdownparams={
			items:[
				{key:'public',txt:'公开',icon:'ico-share-public-2'},
				{key:'private',txt:'仅您自己',icon:'ico-share-4'},
				{key:'custom',txt:'自定义',icon:'ico-share-5'}
			],
			_default:(options&&options.share_scope)?options.share_scope:'public'
		};
		this._defaultshare_objs=(options&&options.share_objs)?options.share_objs:[];
		// trace(options, 'options');
		this.getAction = options.action;
		jw.Combobox.prototype.initialize.call(this,options);
	},
	_makeBtn:function(){
		jw.Combobox.prototype._makeBtn.call(this);
		this._btn.addClass('complexcmb jw-share-cmb').find('.cmb-tw').append('<span class="cmb-i"></span><span class="cmb-t"></span>');
		this._btntxt=this._btn.find('.cmb-t');
		this._btnicon=this._btn.find('.cmb-i');
		this._sharecmbw=$('<div class="jw-share-cmb-w"></div>');
		$(this.el).append(this._btn);
		$(this.el).append(this._sharecmbw);
		// trace(this._defaultshare_objs)
		// 初始化分享范围组件
		var params = {
			el:this._sharecmbw,
			initdata:this._defaultshare_objs,	// 默认值,
			action: this.getAction
		};
		if(this.options.action && this.options.action!='') params.action = this.options.action;
		this._share=new jw.BaseShare(params);
	},
	_bindEvt:function(){
		var self=this;
		jw.Combobox.prototype._bindEvt.call(this);
		// 给浮出框添加特例样式
		this.el.addClass('complexcmb');
		
		this._dropdowndlg.bind('change',function(data){
			self._btnicon.attr('class','cmb-i '+data.icon);
			if(data.key=='custom'){
				self._sharecmbw.css('visibility','visible');
			}else{
				self._share.restore();
				self._sharecmbw.css('visibility','hidden');
			}
		});
		this._share.bind('change',function(){
			self.trigger('change');
		})
	},
	getShare:function(){
		if(!this.cursel) return {share_scope:'public'};
		trace('getShare 2')
		if(this.cursel.key=='public'||this.cursel.key=='private'){
			return {share_scope:this.cursel.key};
		}else{
			var curshare=this._share.getShare();
			trace('curshare',curshare);
			if( curshare.share_scope ){
				var share_objs = [];
				_.each(curshare.share_uids,function(item){
					share_objs.push({type:'jw_n_user',id:item});
				})
				_.each(curshare.share_objs,function(item){
					share_objs.push(item);
				})
				return {
					share_scope:curshare.share_scope,
					share_objs:share_objs
				};
			}
			/*
			if(curshare.length==0) return {share_scope:'private'};
			else return {share_scope:this.cursel.key,share_objs:_(curshare).chain().filter(function(item){
					return item.id;
				}).map(function(item){
					return {id:item.id,type:item.type};
				}).value()};
				// FIXME:由于collection中错误的有一个action所以这里很复杂
			*/
		}
	}
});
/**
 * 标签输入提示组件
 * 扩展自分享组件
 */
jw.taginput=jw.BaseShare.extend({
	getObjs:function(str){
		console.log('这里走了么')
		this._SearchStr=str;
		if(str===''){
			// 如果为空，则隐藏下拉列表
			this._close();
		}else{
			// 匹配
			this._objw.empty();
			this._socialobjs.fetch(this._action,str);
		}
	},
	_combineOne:function(tag){
		this._objw.append('<div class="jw-obj jw-obj-topic" action-data="'+tag.id+'"><div class="jwobj-w"><div class="jw-obj-topicnum">0</div><div class="jwobj-name"># '+tag.name+'</div></div></div>');
	},
	_combineList:function(){
		console.log(this.objlist,'xxxx')
		if(this.objlist.length>0){
			// 先判断列表中是否包含用户输入的标签
			var tagobj = _.findWhere( this.classes_objs['jw_n_tag'], {name:this._SearchStr});
			// if(!tagobj) this._combineOne({id:'', name:this._SearchStr});
			_.each(this.classes_objs['jw_n_tag'],this._combineOne);
		}else{
			this._socialobjs.add({id:this._SearchStr,name:this._SearchStr,type:'jw_n_tag'})
			this._combineOne(this._socialobjs.at(0).toJSON());
		}
		this._objw.find('.jw-obj:first').addClass('selected');
		this.show();
	},
	getCurrent:function(){
		var cur=this._objw.find('.selected');
		if(cur.length==0) return null;
		return this._socialobjs.get(cur.attr('action-data')).toJSON();
	}
});

/**
 * 常用对象列表栏
 */
jw.OffenuseObjView=jw.DropdownList.extend({
	initialize:function(options){
		jw.DropdownList.prototype.initialize.call(this,options);
		$(this.el).prepend('<div class="jw-objlist-h">输入分享对象或选择以下常用分享对象</div>');
	},
	_combineOne:function(item){
		if(item.key=='sep'){
			return '<div class="jw-fd-sep"></div>';
		}else{
			var iconclass=item.icon?item.icon:'jw-fd-i';
			return $('<div class="jw-fd-item normal" action-data="'+item.key+'"><div class="jw-fd-itemc ellipsis"><span class="jw-fd-t">'+item.txt+'</span></div></div>').data('ddl',item);
		}
	}
});
/**
 * 分享对象 Button
 */
jw.ShareButton=Backbone.View.extend({
	className:'share-btn',
	events:{
		'click .ico-del-1':'destroy'
	},
	initialize:function(options){
		_.bindAll(this, 'render', 'remove');
		this.model.bind('destroy', this.remove);
		this.model.bind('remove', this.remove);
	},
	remove:function() {
		$(this.el).remove();
    },
    destroy:function() {
		this.model.destroy();
    },
	render:function(){
		var obj=this.model.toJSON(),
			element, apndclass='share-btn2';
		element=$('<div class="share-btn-c"><i class="share-btn-i"></i><tt class="share-btn-t">'+obj.name+'</tt>'+(obj.dRemove?'':'<i class="ico-del-1"></i>')+'</div>');

		if(obj.type=='public'){
			apndclass='share-btn1';
		}
		if(obj.type=='jw_n_user') element.find('.share-btn-i').remove();

		element.find('.share-btn-i').addClass('ico-share-'+(obj.type+'').replace('jw_n_','')+'-1');
		$(this.el).addClass(apndclass).html(element);
		return this;
	}
});
/**
 * checkbox
 */
jw.checkbox = Backbone.View.extend({
	initialize:function(options){
		this.checkboxOptions = ['disabled','defval','list','maxselnum']
		this._options = {
		    disabled:false,
		    defval:[],
		    list:[],
		    maxselnum:0,//最多选中几个
		    val:0//1无文字。0有文字
		}
		_.extend(this,_.pick(_.extend(this._options,options),this.checkboxOptions));
		this._wrap = $('<div class="checkboxWrap"></div>');
		var self = this;
		$(this.el).append(this._wrap)
		this.checkitems=_(this._options.list).map(function(item){
			var str = ""
			if(self._options.val == 0) str+='<span class="checkbox-val">'+item.val+'</span>';
			return $('<a rel="'+item.key+'"><span class="ico-checkbox"></span>'+str+'</a>');//.data('checkdata',item);
		})
		if(this._options.defval) this._options.defval = this._options.defval;
		_.each(this.checkitems,function(item){
			if(_(self._options.defval).find(function(key){ return key==item.attr('rel'); })) item.addClass('select');
			if(self.disabled) item.addClass('disabled')
			self._wrap.append(item);
		});
		this._bindEvt()
	},
	_bindEvt:function(){
		var self = this;
		this._wrap.delegate('a','click',function(){
			if(self._options.disabled==true || $(this).hasClass('disabled')) return 
		        if($(this).is('.select')) $(this).removeClass('select')
		        else $(this).addClass('select');
		        if(self._options.maxselnum != 0){//0 
		            if(self._wrap.find('.select').length>=self._options.maxselnum){
		                self._wrap.find('a').not('.select').addClass('disabled')
		            }else{
		                self._wrap.find('a.disabled').removeClass('disabled')
		            }
		        }
		        self.trigger('change',self.getValue())
		})
	},
	//获取选中的内容，并丢到数组里面
	getValue:function(){
		var val = [];
		var self = this;
		_.each(this.checkitems,function(item,index){
			if(item.hasClass('select')) val.push(item.attr('rel'))
		})
		return val
	},
	setStatus:function(val){
		var self = this
		_.each(this.checkitems,function(item){
			if(val == false) item.removeClass('disabled')
			else item.addClass('disabled')
		})
		self._options.disabled = val
	},
	setCheck:function(){
		this._wrap.find('a').addClass('select')
		this.trigger('change',this.getValue())
	}
})
/**
 * 单选按钮
 */
jw.radio = Backbone.View.extend({
	initialize:function(options){
		this.Foptions = ['defval','list','val']
		this._options = {
			defval:'',
			list:[],
			val:0
		}
		_.extend(this,_.pick(_.extend(this._options,options),this.Foptions));
		var str = '';
		var self = this;
		this._wrap = $('<div class="radioWrap"></div>')
		$(this.el).append(this._wrap)
		this.checkitems=_(this._options.list).map(function(item,i){
            var str = ""
            if(self._options.val == 0) str = '<span class="radio-val">'+item.val+'</span>';
            return $('<a rel="'+item.key+'"action-data="'+i+'"><span class="ico-radio"></span>'+str+(item["tip"]?'<span class="radio-tip">'+item["tip"]+'</span>':'')+'</a>');
		})
		if(this._options.defval) this._options.defval = this._options.defval;
		_.each(this.checkitems,function(item){
			if(item.attr('rel')==self._options.defval) item.addClass('current')
			self._wrap.append(item)
		});
		this._bindEvt()
	},
	_bindEvt:function(){
		var self = this;
		this._wrap.delegate('a','click',function(index){
			// var target = 
			var index = $(this).attr('action-data')
			self._wrap.find('a.current').removeClass('current')
			$(this).addClass('current')
			self.trigger('change',self._options.list[index].key)
		})
	},
	getValue:function(){
		var val = _.find(this.checkitems,function(item){
			if(item.hasClass('current')){
				return item
			}
		})
		return(val.attr('rel'))
	},
	setVal:function(key){
		if(this._wrap.find('a[rel="'+key+'"]').hasClass('current')) return;
		this._wrap.find('a').removeClass('current');
		var t = this._wrap.find('a[rel="'+key+'"]');
		t.addClass('current');
		this.trigger('change',key);
	}
});

/**
 * 弹出窗口
 * 扩展自 jw.FD
 * style: standard 标准弹出窗口（有margin空白）/ custom 用户完全自定义
 * buttons:[{name:'按钮文字',type:'confirm/cancel/...',evt:click事件回调}]
 */
jw.dialog=jw.FD.extend({
	initialize:function(options){
		this._dlgparams={
			style:'standard',		// standard 标准弹出窗口 custom 用户自定义
			autoShow:true,			// true: new 直接弹出，false:调用弹出
			content:'',				// 弹出窗口内容，text||html
			CloseOnEscape: true,	// 键盘Escape按键，退出窗口
			closeText: 'close',		// 关闭按钮提示文字
			closeicon:true,			// 是否显示关闭按钮
			height: 'auto',			// 高度 默认自适应
			maxHeight: false,		// 最大高度，false 不限
			maxWidth: false,		// 最大宽度，false 不限
			minHeight: 150,			// 最小高度
			minWidth: 150,			// 最小宽度
			modal: true,			// true 有半透明黑色背景，false 无
			position: 'center',		// 显示位置 center
			resizable: false,		// 允许调整窗口大小
			title: '',				// 窗口标题
			width: 300,				
			zIndex: 1000,			//
			buttons:[]				// 窗口默认buttons每个button:{name:'按钮文字',type:'jw-btn2',evt:回调函数}
		};
		// _.extend(this._dlgparams,options);
		_.extend(this._dlgparams,options);
		_.extend(this,this._dlgparams);
		this._initDlg();
		this.el=this._dlg;
		this.bind('onShow',function(evt){
			if(typeof options.showfunc == 'function') options.showfunc();

		});
		jw.FD.prototype.initialize.call(this,_.extend(this._dlgparams,{el:this.el}));
		// this.autoShow && this.show();
	},
	_initDlg:function(){
		var self=this;
		this._dlg=$('<div class="jw-dlg '+this.style+'"><div class="jw-dlg-w"></div></div>');
		this._wrap=this._dlg.find('.jw-dlg-w');
		if(this.buttons.length>0){
			this._wrap.append('<div class="jw-dlg-sc"><div class="jw-dlg-c"></div></div>');
			this._wrap=this._wrap.find('.jw-dlg-sc');
			this._opbar=$('<div class="jw-dlg-bar"></div>');
			this._wrap.append(this._opbar);
		}
		// trace(this.content.html())
		if(this.style=='custom')
			this._wrap.append(this.content);
		else
			this._wrap.find('.jw-dlg-c').append(this.content);
		// 标题
		this.title!='' && this._wrap.prepend('<h2>'+this.title+'</h2>');
		// 页面右上角关闭按钮
		if(this.closeicon!=''){
			this._closebtn=$('<div class="jw-dlg-closebtn"></div>').click($.proxy(this._close,this));
			this._dlg.append(this._closebtn);
		}
		_.each(this.buttons,function(item){
			var btn=$('<button type="button" class="jw-btn '+item.type+'">'+item.name+'</button>').click(item.evt);
			self._opbar.append(btn);
		});
		$('body').append(this._dlg);
	},
	show:function(){
		this._maskdiv=$('.jw-mask');
		if(this.modal&&this._maskdiv.length==0){
			// MASK Layer
			this._maskdiv=$('<div class="jw-mask"></div>');
			$('body').append(this._maskdiv);
			this._maskdiv.css('display','block');
		}else{
			var zindex=parseInt(this._maskdiv.css('z-index'))+1000;
			this._maskdiv=$('<div class="jw-mask" style="z-index:'+zindex+';"></div>');
			this._dlg.css('z-index',(zindex+100));
			$('body').append(this._maskdiv);
			this._maskdiv.css('display','block');
		}
		// this._maskdiv.css('display','block');
		// 居中显示弹出窗口
		var self=this,dw = ($(window).width()-this._dlg.width()-20)/2,
			dtop = $(document).scrollTop()+($(window).height()-this._dlg.height())/4;
		if( dw < 0 ) dw = 0;
		if( dtop < 0 ) dtop = 0;
		// trace('this.position ['+this.position+']dtop['+dtop+']')
		if(this.position=='center')
			this._dlg.css({top:dtop+'px',left:dw+'px'});
		else
			this._dlg.css({top:this.position.top+'px',left:this.position.left+'px'});
		jw.FD.prototype.show.call(this);
	},
	_close:function(){
		var self=this;
		this._maskdiv && this._maskdiv.fadeOut(function(){self._maskdiv.remove()});
		jw.FD.prototype._close.call(this);
	}
});
/**
 * options
 * 		content 警示文字
 */
jw.Alert=jw.dialog.extend({
	initialize:function(options){
		var self=this;
		options.buttons=[{
			name:'确定',
			type:'jw-btn2',
			evt:function(){
				self._close();
			}
		}];
		options.style='jw-dlg-sys';
		jw.dialog.prototype.initialize.call(this,options);
	},
	_initDlg:function(){
		this.content='<div class="jw-dlg-l"><span class="jw-dlg-alert"></span></div><div class="jw-dlg-r"><span>'+this.content+'</span></div>';
		jw.dialog.prototype._initDlg.call(this);
	}
});
/**
 * options
 * 		content 警示文字
 * 		confirm:function 确定按钮回调函数
 * 		cancel:function 取消按钮回调函数
 */
jw.Confirm=jw.dialog.extend({
	initialize:function(options){
		var self=this;
		options.buttons=[{
			name:'取消',
			type:'jw-btn4',
			evt:function(){
				trace('button click');
				options.cancel && options.cancel();
				self._close();
			}
		},{
			name:'确定',
			type:'jw-btn2',
			evt:function(){
				trace('button click');
				options.confirm && options.confirm();
				self._close();
			}
		}];
		options.style='jw-dlg-sys';
		jw.dialog.prototype.initialize.call(this,options);
	},
	_initDlg:function(){
		this.content='<div class="jw-dlg-l"><span class="jw-dlg-alert"></span></div><div class="jw-dlg-r"><span>'+this.content+'</span></div>';
		jw.dialog.prototype._initDlg.call(this);
	}
})
/**
 * jw remind
 */
jw.remindDlg=jw.dialog.extend({
	initialize:function(options){
		var self = this;
		options.buttons=[{
			name:'知道了',
			type:'jw-btn3',
			evt:function(){
				trace('button click');
				options.cancel && options.cancel();
				self._close();
			}
		}];
		options.style='jw-dlg-remind';
		jw.dialog.prototype.initialize.call(this,options);
	},
	_initDlg:function(){
		jw.dialog.prototype._initDlg.call(this);
	}
})
/*
jw.M_asfilter = Backbone.Model.extend({
	url:'/as/'
})

jw.C_asfilter = Backbone.Collection.extend({
	model:jw.M_asfilter
})

jw.V_asfilter = Backbone.View.extend({
       tagName:'li',
       events:{
           "click del":"remove"
       },
	initialize:function(){
		_.bindAll(this,'render','update','destroy','remove')
           this.model.bind('destroy',this.destroy);
           this.model.bind('change',this.update)
	},
	render:function(){
           var self = this;
		$(this.el).html('<u></u><a>'+this.model.get("txt")+'</a><del></del>');
		return this;
	},
	destroy:function(){
           $(this.el).remove();
	},
	remove:function(){
           this.model.destroy();
	},
	update:function(){
		$(this.el).find('.filter-val').html(this.model.get('txt'));
	}
})
jw.AsfilterController = Backbone.View.extend({
	initialize:function(initdate){
		var self = this;
		this.collection = new jw.C_asfilter;
		this.bindEvt();
           $.each(initdate,function(i,n){
           	for(var i=0;i<n.length;i++){
           		$('.'+n[i]).delegate('li','click',function(event){
                    var target = event.target;
                    $(this).parent().find('li').removeClass('active')
                    $(this).addClass('active')
                    var action_type = $(this).attr('action_type'),
                        action_data = JSON.parse($(this).attr('action_data'));
                    var model=self.collection.get(action_type);
                    if(model){
                        model.set({id:action_type,key:action_data.key,txt:action_data.val});
                    }else self.collection.add({id:action_type,key:action_data.key,txt:action_data.val})
               	})
           	}
           })
	},
	bindEvt:function(){
		var self=this;
		var textcontent=[]
		_.bindAll(this,"addOne",'addAll','remove')
		this.collection.bind('add',this.addOne)
		this.collection.bind('reset',this.addAll)
		this.collection.bind('update',this.update);
		this.collection.bind('add change destroy',function(){
               textcontent=[]
               for(var i=0;i<self.collection.pluck('key').length;i++){
               	textcontent.push(self.collection.pluck('key')[i]+':'+self.collection.pluck('txt')[i])
               }
			self.trigger('change',textcontent);
		});
	},
	addOne:function(filter){
		var modelId = filter.get('id')
           if(modelId !="as-src"&&modelId!="as-append"){
               var view = new jw.V_asfilter({model:filter})
               $('.filter-content').find('ul').append(view.render().el)
           }else{
              return 
           }
	},
	addAll:function(){
		this.collection.each(this.addOne)
	}
})
*/

// 



/**
 * 进度条组件
 * type: 0 - 标准进度条模式，1-button进度条模式
 */
jw.loading=function(element,options){
	this.opts = $.extend({}, jw.loading.defaults, options);
	this._element=element;
	if($.support.canvas){
		if(this.opts.type==1){
			_.extend(this.opts,{
				width:24,height:24,stepsPerFrame: 3,strokeColor: '#4174d9',
				setup: function() {
					this._.lineWidth = 2;
				},
				path: [
					['arc', 12, 12, 6, 360, 0]
				]
			});
		}
		
		this.play();
	}
	else{
		if(this.opts.type == 1){
			return 
		}else{
			this._originHtml = this._element.html()
			this._element.html('<div style="width:50px;height:50px;"><img class="loading-pic" src="/public/images/loading.gif"/></div>');
			this.play=function(){
				this._originHtml = this._element.html();
				this._element.find('div').html('<img class="loading-pic" src="/public/images/loading.gif"/>')
			};
			this.restore=function(){
				this._element.html(this._originHtml)
			};
			this.status=function(){
				return (this._element.find('img').length)
			}
		}
	}
	return this;
}
jw.loading.prototype={
	play:function(){
		this._sonic = new Sonic(this.opts);
		this._originHtml=this._element.html();
		this._element.empty().append(this._sonic.canvas);
		this._sonic.play();
	},
	restore:function(){
		this._sonic.stop();
		delete this._sonic;
		this._element.html(this._originHtml);
	},
	status:function(){
		return this._sonic;
	}
}

jw.loading.defaults={
	type:0,
	width: 50,
	height: 50,
	stepsPerFrame: 3,
	trailLength: 1,
	pointDistance: .01,
	fps: 30,
	step: 'fader',
	strokeColor: '#000',
	setup: function() {
		this._.lineWidth = 3;
	},
	path: [
		['arc', 25, 25, 10, 360, 0]
	]
};
/**
 * 关注
 * @param:el
 * @param:model model中必须保函 following 和 isfollow两个字段
 */
jw.followBtn = Backbone.View.extend({
    initialize:function(){
        this._initFlvBtn();
        this._bindEvt();
    },
    _initFlvBtn:function(){
        $(this.el).removeClass('too to');
        if(this.model.get('following') && this.model.get('isfollow')){
            $(this.el).html('互相关注').attr('title','互相关注').addClass('too');
        }else if(this.model.get('following')){
            $(this.el).html('已关注').attr('title','已关注').addClass('to');
        }else{
            $(this.el).html('关注').attr('title','关注');
        }
    },
    _bindEvt:function(){
        var self = this;
        $(this.el).hover(function(e){
            ($(self.el).hasClass('too') || $(self.el).hasClass('to')) && $(self.el).html('取消关注').removeClass('jw-btn3').addClass('jw-btn1');
        },function(e){
            $(self.el).html($(self.el).attr('title')).removeClass('jw-btn1').addClass('jw-btn3');
        })

        //更新model
        .click(function(){ ($(self.el).hasClass('too') || $(self.el).hasClass('to')) ? self.model.set('following',false) : self.model.set('following',true)});
        //监听model的更新 在同步至服务器（只同步following 字段）
        self.model.bind('change:following',function(){
            var _action = self.model.get('following')?'addflw':'unflw';
            var _text = self.model.get('following')?'关注':'取消关注';
   			Backbone.sync('read',null,{
                url:basurl+'/user/'+_action+'?uid='+self.model.id,
                success:function(resp, status, xhr){
                	new jw.SysNotice({
                		type:2,
						text:_text+'成功',
						delay:900,
						slow:true
					});
                    self._initFlvBtn();
                    self.trigger(_action,self.model.id);
                    if(_action=='unflw') $.publish('_action',self.model.id)
                }
            });
        })
    }
});




/**
 *  公告
 */
jw.collection = jw.collection || {};
jw.model      = jw.model || {};
jw.model.announcement = Backbone.Model.extend({
    defaluts:{
        allow_comment: '1',
        content: '',
        created_at: '0',
        id: '',
        show_org: [],
        show_type: '0',
        status: '1',
        title: '',
        uid: '',
        updated_at: 0,
        user: {}
    },
    urlRoot: basurl+'/dashboard/setannouncement/'
});
jw.collection.announcement = Backbone.Collection.extend({
    url: basurl+'/dashboard/get/?app=announcement',
    model: jw.model.announcement
});
jw.collection.announcement
jw.announcement = Backbone.View.extend({
    initialize: function(options){
        this.options = options;
        this.options.maxHeight = options.maxHeight=='auto'?options.maxHeight:options.maxHeight||144;
        if(this.options.maxHeight==window.undefined || this.options.maxHeight=='auto') this.options.maxHeight = 'auto';
        else this.options.maxHeight = this.options.maxHeight + 'px';
        
        this.collection = new jw.collection.announcement([]);
        this.collection.on('reset', this.reset, this);
        
        this.collection.fetch();
        if( this.options.isPage!==true ) this.timeout();
    },
    timeout: function(){
        var that = this;
        if(this.timer) clearTimeout(this.timer);
        this.timer = setTimeout(function(){
            that.collection.fetch();
            that.timeout();
        }, 300000);
    },
    events: {
        'click .db-as-prev': 'prev',
        'click .db-as-next': 'next',
        'click .i_know'    : 'iknow'
    },
    getHtml: function(str){
    	str = str.replace(/\n/mg, '<br />');
        var len = str.length;
        var height = 0;
        var isPass = -1;
        $('#fillHtmlContent').empty();
        var maxHeight = this.options.maxHeight.replace('px', '')*1;
        for(var i=0; i<len; i+=10){
            $('#fillHtmlContent').html( str.substring(0, i) );
            height = $('#fillHtmlContent').height();
            if(height>=maxHeight&&maxHeight>0){
                height = maxHeight;
                isPass = i;
                break;
            }
        }
        var id = this.collection.models[this.curpage].get('id');
        var re_str = str;
        if(isPass>=20){
        	re_str = re_str.substring(0, isPass);
        	var last_str = re_str.substring(isPass-3, isPass);
        	var last_i = last_str.indexOf('<');
        	if(last_i!=-1){
        		re_str = re_str.substring(0, isPass-(3-last_i) );
        	}
        	re_str = re_str+'<a href="'+basurl+'/announcement/detail/?id='+id+'" target="_blank">......</a>';
        }
        var re = {
            newStr: re_str,
            isPass: isPass
        };
        $('#announce_content').height(height+45);
        return re;
    },
    prev: function(){
        var that = this;
        this.curpage--;
        if(this.curpage<0){
            this.curpage=0;
            return;
        }
        this.pageStyle();
        var html = _.template( '<%=content%>', this.collection.models[this.curpage].toJSON() );
        var newHtml = this.getHtml(html);
        if(newHtml.isPass>0&&this.options.maxHeight>0) this.$('.announce_more').show(); else this.$('.announce_more').hide();
        // this.$('.announce_content_0').css('z-index', '5');
        this.$('.announce_content_0, .announce_content_1').html( newHtml.newStr )
        //  .css({'z-index':6, left:'-100%' }).animate({left:'25px'}, 500, function(){
        //      that.$('.announce_content_0').html( newHtml.newStr ).css({'z-index':'6'});
        //      that.$('.announce_content_1').css('z-index', '5');
        //  });
    },
    next: function(){
        var that = this;
        this.curpage++;
        if(this.curpage>this.collection.length-1){
            this.curpage=this.collection.length-1;
            return;
        }
        this.pageStyle();
        var html = _.template( '<%=content%>', this.collection.models[this.curpage].toJSON() );
        var newHtml = this.getHtml(html);
        if(newHtml.isPass>0&&this.options.maxHeight>0) this.$('.announce_more').show(); else this.$('.announce_more').hide();
        this.$('.announce_content_0, .announce_content_1').html( newHtml.newStr )
        //  .css({'z-index':6, left:'100%' }).animate({left:'25px'}, 500, function(){
        //      that.$('.announce_content_0').html( newHtml.newStr ).css({'z-index':'6'});
        //      that.$('.announce_content_1').css('z-index', '5');
        //  });
    },
    iknow: function(e){
        if( this.options.isPage===true ){
            this.collection.models[this.curpage].destroy();
            $(e.target).attr('disabled', 'disabled').addClass('jw-btn4').html('已阅读');
        }else{
            this.collection.models[this.curpage].destroy();
            this.curpage--;
            if(this.curpage<0) this.curpage=0;
            this.render();
        }
    },
    pageStyle: function(){
        if( this.options.isPage===true ){
            this.$('.announce_btns a').remove();
        }
        if(this.collection.length==0){
            if(this.options.isShowEl!=window.undefined&&this.options.isShowEl==true){
            }else{
                this.$el.hide();
                this.options.hideEl&&this.options.hideEl.fadeOut(500);
            }
        }else{
            this.$el.show();
            this.options.hideEl&&this.options.hideEl.show();
            this.$('.db-as-prev').removeClass('disabled');
            this.$('.db-as-next').removeClass('disabled');
            if( this.curpage==0 ) this.$('.db-as-prev').addClass('disabled');
            if( this.collection.length==this.curpage+1 ) this.$('.db-as-next').addClass('disabled');
        }
        var m = this.collection.models[this.curpage];
        var str = '';
        if( m.get('show_type')*1==1 ){
            str = m.get('show_org')[0].name;
        }else{
            str = m.get('user').name;
        }
        this.$('.announce_tip span').html( str+'，'+(m.get('created_at')*1).FormatTime('yyyy-MM-dd') );
        this.$('.announce_title').html(m.get('title'));
        this.$('.announce_link').attr('href', basurl+'/announcement/detail/?id='+m.get('id') );
        this.$('.announce_more a').attr('href', basurl+'/announcement/detail/?id='+m.get('id') );

        if(m.get('allow_comment')*1==1){
            this.$('.announce_reply').show();
            new jw.CommentComp({
                el:this.$('.announce_reply'),
                singleitem:this.options.maxHeight==-1?false:true,
                model:new Backbone.Model({
                    app_id:m.get('id'),
                    app_type:'jw_app_announcement'
                })
            });
        }else{
            this.$('.announce_reply').hide();
        }
    },
    _template: function(){
        return '<div class="announce_wrap">\
            <div id="fillHtmlContent" class="fillHtmlContent"></div>\
            <a class="announce_link" href="_blank"><div class="announce_tip"><strong>公告</strong><span></span></div></a>\
            <div class="announce_title"></div>\
            <div class="announce_content" id="announce_content">\
                <div class="announce_content_0"></div>\
                <div class="announce_content_1" style="max-height:'+this.options.maxHeight+'"></div>\
            </div>\
            <div class="announce_more"><a href="#" target="_blank">查看详情...</a></div>\
            <div class="announce_btns">\
                <button type="button" class="jw-btn2 jw-btn i_know">知道了</button>\
                <a class="db-as-btn db-as-prev"><span class="db-as-btn-tl"></span></a>\
                <a class="db-as-btn db-as-next"><span class="db-as-btn-tr"></span></a>\
            </div>\
            <div class="announce_reply db-as-cmtw">\
                <div class="db-as-cmtc"><div class="db-as-cmt-num"></div><div class="db-as-cmt"></div></div>\
            </div>\
        </div>';
    },
    reset: function(){
        this.curpage = 0;
        var curpage = 0;
        var id = this.options.id;
        if(this.options.id&&typeof this.options.id=='string'){
            this.collection.each(function(item, i){
                if(item.get('id')==id){
                    curpage = i;
                }
            });
        }
        this.curpage = curpage;
        this.render();
    },
    render: function(){
        this.$el.html( _.template(this._template(), {}) ).show();
        (this.options.hideEl!=window.undefined)&&this.options.hideEl.show();
        var w = this.$('.announce_content').width()-50;
        this.$('.announce_content_0, .announce_content_1, #fillHtmlContent').width( w );

        if(this.collection.models[this.curpage]!=window.undefined){
            var html = this.collection.models[this.curpage].get('content');
            var newHtml = this.getHtml(html);
            if(newHtml.isPass>0&&this.options.maxHeight>0) this.$('.announce_more').show(); else this.$('.announce_more').hide();

			if(this.options.isShowEl!=window.undefined&&this.options.isShowEl==true){
            }else{
                this.$el.hide();
                this.options.hideEl&&this.options.hideEl.hide();
            }

            if(this.collection.length>0) this.$('.announce_content_0').html( newHtml.newStr );
            this.pageStyle();
        }else{
			if(this.options.isShowEl!=window.undefined&&this.options.isShowEl==true){
            }else{
                this.$el.hide();
                this.options.hideEl&&this.options.hideEl.hide();
            }
        }
        
    }
});


/**
 * 名片 vCard
 *
 */
jw.V_vCard = jw.FD.extend({
    initialize:function(options){
        _.bindAll(this,'render');
    },
    render:function(){
		if(!this.model.get('name')){
			this.el=$('<div class="vcard_item"><div class="vcard_nulltip">查找的对象已不存在或无权限访问</div></div>');
			return this;
		}
		var tibar = this.model.get('title')?['<a>'+this.model.get('title')+'</a>']:[];	
		var deptname = '';
		if(this.model.get('depts') && this.model.get('depts')[0] && this.model.get('depts')[0].name ) deptname=this.model.get('depts')[0].name;
		else if(this.model.get('company')) deptname = this.model.get('company')
		tibar.push('<a class="jw-a" href="javascript:">'+deptname+'</a>')
    	// this.model.get('company_domain') == '' ? this.model.get('company').length && tibar.push('<a class="jw-a" href="javascript:">'+this.model.get('company')+'</a>'):deptname && tibar.push('<a class="jw-a" href="javascript:">'+deptname+'</a>');
		// var deptname = '';
		// if(this.model.get('depts') && this.model.get('depts')[0] && this.model.get('depts')[0].name ) deptname=this.model.get('depts')[0].name;
    	// this.model.get('company_domain') == '' ? this.model.get('company').length && tibar.push('<a class="jw-a" href="javascript:">'+this.model.get('company')+'</a>'):deptname && tibar.push('<a class="jw-a" href="javascript:">'+deptname+'</a>');
    	//if(this.model.get('depts')){
		//	tibar.push('<a class="jw-a" href="javascript:">'+(this.model.get('depts')[0]['name']?this.model.get('depts')[0]['name']:'')+'</a>')
		//}else if(this.model.get('company')){
		//	tibar.push('<a class="jw-a" href="javascript:">'+this.model.get("company")+'</a>')
		//}else tibar.push('<a class="jw-a" href="javascript:"></a>')
    	var _name = this.model.get('name');
    	if(this.model.get('status') == 1) _name +='<span style="color:#b0b0b0;font-size:13px;">(已冻结)</span>';
    	if(this.model.get('status') == 2) _name +='<span style="color:#b0b0b0;font-size:13px;">(已离职)</span>';
    	var _mc = (this.model.get('status') != 0)?'<div style="position:absolute;left:19px;top:19px;width:100px;height:100px;background:#fff;opacity:0.7;z-index:10;"></div>':'';
    	var tagline = this.model.get('desc')==''?'':this.model.get('desc');
    	var scorehtml = '';
    	if(entdomaininfo&&entdomaininfo.id&&entdomaininfo.id==domaininfo.id){
    		scorehtml = '<li class="i_1" title="工分"><i></i><a class="jw-a">'+this.model.get('score')+'</a></li>\
							<li class="i_2" title="级别"><i></i><a class="jw-a">'+this.model.get('grade')+'</a></li>\
							<li class="i_3" title="排名"><i></i><a class="jw-a">'+this.model.get('rank')+'</a></li>';
    	}else{
    		scorehtml = '<li class="i_1" title="关注"><label>关注</label><a class="jw-a">'+this.model.get('friends_num')+'</a></li>\
							<li class="i_2" title="粉丝"><label>粉丝</label><a class="jw-a">'+this.model.get('followers_num')+'</a></li>\
							<li class="i_3" title="信息"><label>信息</label><a class="jw-a">'+this.model.get('posts_num')+'</a></li>';
    	}
    	var videobtn = '';
    	if(this.model.id!=selfinfo.id){
    		videobtn = '<a class="video jw-callvideo" action-data="'+this.model.id+','+this.model.get('name')+'"></a>';
    	}
    	this.el = $('<div class="vcard_item vcard_user">\
    			<div class="vcard-user-w">\
    				<div class="vcard-user-bg">\
	    				<img src="'+this.model.get('vcard_cover')+'" />\
	    				<div class="vcard-user-base">\
	    					<div class="name_w">\
								<a class="name" href="'+basurl+'/profile?id='+this.model.id+'&category=profileInfo">'+_name+'</a>\
								<a class="status '+this.model.get("online")+'"></a>\
							</div>\
							<div class="work_info">'+ tibar.join('，') +'</div>\
	    				</div>\
	    			</div>\
	    			<div class="">\
	    				<div class="vcard-user-phone">\
	    					<div class="vcard-user-item tel">\
	    						<div class="vcard-user-item-ico"></div>\
	    						<div class="vcard-user-item-val">'+(this.model.get("ext")?this.model.get("ext"):(this.model.get("tel")?this.model.get("tel"):'<span>未登记</span>'))+'</div>\
	    					</div>\
	    					<div class="vcard-user-item mobile">\
	    						<div class="vcard-user-item-ico"></div>\
	    						<div class="vcard-user-item-val">'+(this.model.get("mobile")?this.model.get("mobile"):'<span>未登记</span>')+'</div>\
	    					</div>\
	    				</div>\
	    				<ul class="sbtn">'+scorehtml+'</ul>\
						<div class="vcard-user-tagline">'+tagline+'</div>\
	    			</div>\
	    			<a href="'+basurl+'/profile?id='+this.model.id+'&category=profileInfo"><img class="vcard-user-avatar" src="'+this.model.get('avatar')['avatar_l']+'"></a>\
	    			<div class="vc_f">\
						<div class="cm_w">\
							<a class="call"></a>\
							<a class="message"></a>\
							'+videobtn+'\
						</div>\
						<div class="vc_bc"></div>\
					</div>\
    			</div>\
    		</div>');
        if(this.model.id != selfinfo.id){
            var _btn = $('<button type="button" class="jw-btn3 jw-btn vcard-flv-btn"></button>');
            this.el.find('.vc_bc').html(_btn);
            new jw.followBtn({el:_btn,model:this.model})
        }
       	var c_obj = {
        		id: this.model.get('id'),
        		name: this.model.get('name'),
        		type: 'user',
        		avatar: this.model.get('avatar')
        	};
        this.el.find('.message').click(function(){
        	jwIM.chatWith(c_obj);
        });
        this.el.find('.video').click(function(){
        	$.publish('jwim_video_with', c_obj);
        });
        return this;
    }
});
jw.task_card_v = jw.FD.extend({
	initialize:function(){
		_.bindAll(this,"render")
		this.model.bind('change',this.render)
	},
	render:function(){
		if(!this.model.get("name")){
			this.el=$('<div class="vcard_item"><div class="vcard_nulltip">您没有权限访问此任务！</div></div>');
			return this;
		}
		var status = '',type=this.model.get('type');
		switch(this.model.get('status')){
			case "jw_task_pause":
				status = "暂停中"
				break;
			case "jw_task_complete":
				status = "已完成"
				break;
			case 'jw_task_ing':
				status = '进行中'
				break;
			case 'jw_task_overdue':
				status = '已逾期'
				break;
			case 'jw_task_overcom':
				status = '逾期完成'
				break;
			case 'jw_task_confirm':
				status = '完成待确认'
				break;
		}
		var type_value = {
			0:'一般任务',
			1:'群组任务',
			2:'项目任务'
		}
		this.el = $('<div class="task-card">\
				<div class="task-card-bg"></div>\
				<div class="task-card-c">\
					<div class="task-card-name">\
						<div class="card-icon"></div>\
						<a href="'+basurl+'/task/info?id='+this.model.get("id")+'" target="_blank"><div class="card-txt ellipsis">'+this.model.get("name")+'</div></a>\
					</div>\
					<div class="task-card-person">'+this.model.get("creator").name+'分派给'+_.map(_.first(this.model.get("accepts"),3),function(item){
					return item.name
				}).join("")+(this.model.get('accepts').length>3?'等':'')+'的任务</div>\
					<div class="task-card-date">\
						<div class="date-icon"></div>\
						<div class="end-date">'+new Date(this.model.get('plan_complete_at')*1000).FormatTime('yyyy年MM月dd日')+'</div>\
						<div class="task-status">'+status+'</div>\
					</div>\
					<div class="task-card-pic">\
						<div class="card-creator"><img src="'+this.model.get("creator")["avatar"]["avatar_l"]+'" class="pf-80"></div>\
						<div class="card-execute"><img src="'+this.model.get("accepts")[0]["avatar"]["avatar_l"]+'" class="pf-80"></div>\
					</div>\
					<div class="task-card-type">\
						<div class="card-classify">'+type_value[type]+'</div>\
						'+(type=="0"?'':'<div class="card-resp">-</div><div class="card-classify-name ellipsis">'+this.model.get("appInfo")["name"]+'</div>')+'\
					</div>\
					<div class="task-card-progress">\
						<div class="progress-w '+this.model.get("status")+'"style="width:'+parseInt(this.model.get("progress"))+'%;"></div>\
						<div class="progress-txt">'+parseInt(this.model.get("progress"))+'%</div>\
					</div>\
					<button type="button" class="jw-btn4 jw-btn follow">'+(this.model.get("isfollow")==0?'关注':'取消关注')+'</button>\
				</div>\
			</div>')
		return this;
	}
})
jw.group_card_v = jw.FD.extend({
	initialize:function(){
		_.bindAll(this,"render")
		this.model.bind('change',this.render)
	},
	render:function(){
		if(!this.model.get("name")){
			this.el=$('<div class="vcard_item"><div class="vcard_nulltip">查找的对象已不存在或无权限访问</div></div>');
			return this;
		}
		$(this.el).html('<div class="group-card">\
				<div class="group-card-bg"></div>\
				<div class="group-card-c">\
					<div class="group-card-name">\
						<div class="card-icon"></div>\
						<a href="'+basurl+'/groups/group/'+this.model.get("id")+'" target="_blank"><div class="card-txt ellipsis">'+this.model.get("name")+'</div></a>\
					</div>\
					<div class="group-card-mem">'+this.model.get("members_num")+'个人的'+(this.model.get("privacy")=="public"?'公开':'私密')+'群组</div>\
					<div class="group-card-pic">\
						<div class="group-card-img"><img src="'+this.model.get("logo")+'" class="pf-80"></div>\
					</div>\
					<div class="group-card-mems">'+_.map(_.first(this.model.get("members"),5),function(item){return '<img style="margin:0 3px;"src='+item["avatar"]["avatar_s"]+' class="pf-35"/>'}).join('')+'</div>\
					<button type="button" class="jw-btn4 jw-btn follow">'+(this.model.get("role")&&this.model.get("role")!==''?'退出':'加入')+'</button>\
				</div>\
			</div>')
		return this;
	}
})
jw.project_card_v = jw.FD.extend({
	initialize:function(){
		_.bindAll(this,"render")
		this.model.bind('change',this.render)
	},
	render:function(){
		if(!this.model.get("name")){
			this.el=$('<div class="vcard_item"><div class="vcard_nulltip">查找的对象已不存在或无权限访问</div></div>');
			return this;
		}
		var status = '';
		// switch
		var result = {
			jw_project_ing:'进行中',
			jw_project_overdue:'已逾期',
			jw_project_unstart:'未开始',
			jw_project_complete:'已完成',
			jw_project_cancel:'已取消'
		}
		$(this.el).html('<div class="project-card">\
				<div class="project-card-bg"></div>\
				<div class="project-card-c">\
					<div class="project-card-name">\
						<div class="card-icon"></div>\
						<a href="'+basurl+'/projects/info?id='+this.model.get("id")+'" target="_blank"><div class="card-txt ellipsis">'+this.model.get("name")+'</div></a>\
					</div>\
					<div class="project-card-info ellipsis">'+this.model.get('manager')["name"]+'负责的项目</div>\
					<div class="project-card-date">\
						<div class="date-icon"></div>\
						<div class="start-date">'+new Date(this.model.get('start_time')*1000).FormatTime('yyyy-MM-dd')+'</div>\
						<div class="project-card-rep">至</div>\
						<div class="end-date">'+new Date(this.model.get('end_time')*1000).FormatTime('yyyy-MM-dd')+'</div>\
					</div>\
					<div class="project-card-pic">\
						<div class="project-card-img"><img src="'+this.model.get("manager")["avatar"]["avatar_l"]+'" class="pf-80"></div>\
					</div>\
					<div class="project-card-status">'+result[this.model.get("status")]+'</div>\
					<div class="project-card-progress">\
						<div class="progress-w '+this.model.get("status")+'"style="width:'+parseInt(this.model.get("progress"))+'%;"></div>\
						<div class="progress-txt">'+parseInt(this.model.get("progress"))+'%</div>\
					</div>\
					<button type="button" class="jw-btn4 jw-btn follow">'+(this.model.get("isfollow")==0?'关注':'取消关注')+'</button>\
				</div>\
			</div>')
		return this
	}
})
jw.depts_card_v = jw.FD.extend({
	initialize:function(){
		_.bindAll(this,"render")
		this.model.bind('change',this.render)
	},
	render:function(){
		if(!this.model.get("name")){
			this.el=$('<div class="vcard_item"><div class="vcard_nulltip">查找的对象已不存在或无权限访问</div></div>');
			return this;
		}
		$(this.el).html('<div class="depts-card">\
				<div class="depts-card-bg"></div>\
				<div class="depts-card-c">\
					<div class="depts-card-name">\
						<div class="card-icon"></div>\
						<a herf="'+basurl+'/groups/group/'+this.model.get("id")+'" target="_blank"><div class="card-txt">'+this.model.get("name")+'</div></a>\
					</div>\
					<div class="depts-card-mem">'+this.model.get("members_num")+'个人的团队</div>\
					<div class="depts-card-pic">\
						<div class="depts-card-img"><img src="'+this.model.get("logo")+'" class="pf-80"></div>\
					</div>\
					<div class="depts-card-mems">'+_.map(_.first(this.model.get("members"),5),function(item){return '<img style="margin:0 3px;"src='+item["avatar"]["avatar_s"]+' class="pf-35"/>'}).join('')+'</div>\
				</div>\
			</div>')
		return this;
	}
})
// model
jw.M_vCard = Backbone.Model.extend({ 
    sync:function(){
		this.url=basurl+'/vcard';
		if(this.get('type')=='jw_n_task') this.url+='/task';
		else if(this.get('type')=='user') this.url+='/user';
		else if(this.get('type')=="jw_n_group") this.url+='/group';
		else if(this.get('type')=="jw_n_project") this.url+='/project';
		else if(this.get('type')=="jw_n_dept") this.url+='/group'
		this.url+='?id='+this.id+'&type='+this.get('type');
        // this.url=basurl+'/vcard/user?id='+this.id+'&type='+this.get('type');//服务器端还需要改进
        return Backbone.sync.apply(this, arguments);
    }
});
// collection
jw.C_vCard = Backbone.Collection.extend({
    model: jw.M_vCard
});
// constroller
jw.AppvCard = Backbone.View.extend({
    events: {
        "mouseenter .jw_vCard" :  "prepareVcard",
        'click .task-card .follow':'follow',
        'click .group-card .follow':'group_follow',
        'click .project-card .follow':'project_follow'
    },
    initialize:function(){
    	// _.bindAll(this,'_showVcard')
        this.collection = new jw.C_vCard;
        // this.collection = new Backbone.Collection({model:jw.M_vCard});
    },
    prepareVcard:function(evt){
        if(this.settimeout && this.targetEl && this.targetEl == evt.target) return;  
        var self = this;
        window.vcardTimer = setTimeout(function(){
            self.vcard && self._remove($(self.vcard));
        	if(window.showVcard!=true) return;
            self.targetEl = evt.currentTarget;
            var vcardData = $(self.targetEl).attr('vcard-data');
            var type= vcardData.split(':')[0];
            self.type = type;
            var id  = vcardData.split(':')[1];
            var k   = $(self.targetEl).offset();
            self.vcard = $('<div class="jw_vcard_wrap shadow" style="display:block"><div class="jw_vcard_wrap_load"><div class="standard-loading" style="float:left;margin-top: 5px;margin-left: 10px;"></div><a style="display:block;padding:20px 10px;font-size13px;">正在读取信息...</a></div></div>');
           
            // 1.名片距页面的高度（目标元素距页顶距离+目标元素高度+名片高度）   
            var _vh = k.top + $(self.targetEl).height()+196;
            // 2.当前屏幕的下面与页面顶部的距离(即当前距页顶最高距离)
            // var _sh = window.scrollY+jw.findDimensions()['height'];
            var _sh = $(document).scrollTop()+jw.findDimensions()['height'];
            // 名片显示高度定位完了。接下来定位左距离

            var top = _sh>_vh?k.top+10 + $(self.targetEl).height():k.top-196-10;
            // trace('_vh['+_vh+'] _sh['+_sh+'] offset['+JSON.stringify(k)+'] height['+$(self.targetEl).height()+'] top['+top+']');

            var left = k.left+412<jw.findDimensions()['width']?k.left:k.left+$(self.targetEl).width()-412;
            if(left<0) left = 20;
            var _position = {left:left,top:top};
            this.fd = new jw.FD({//REMOVE时销毁
                    el:self.vcard,
                    autoShow:false,
                    removeOnClose:true,
                    CloseOnEscape:true,
                    CloseOnClick:true,
                    position:_position
                });
	    	$("body").append(self.vcard);
	    	var loading=new jw.loading(self.vcard.find('.standard-loading'));
            if(self.collection.get({id:id})){
                self.model = self.collection.get({id:id});
	            self.timerVcard();
            }else{
                self.model  = self.collection.create({type:type,id:id});
				self.model.fetch({
					success: function(){
			            self.timerVcard();
					},
					error: function(){
						self.timerVcard();
					}
				});
            }
        },1000);
		window.showVcard = true;
        $(evt.target).hover(function(){},function(){
        	window.showVcard = false;
        	clearTimeout(window.vcardTimer);
        	self._remove($(self.vcard));
        });
    },
    timerVcard: function(){
    	if(window.showVcard==true){
	    	this._showVcard();
	    }else{
	    	this._remove($(self.vcard));
	    }
    },
    _showVcard:function(){
        var self = this;
        if(this.type=='user') var _v = new jw.V_vCard({model:this.model})
        else if(this.type=="jw_n_task") var _v = new jw.task_card_v({model:this.model})
       	else if(this.type=="jw_n_group") var _v = new jw.group_card_v({model:this.model})
       	else if(this.type=="jw_n_project") var _v = new jw.project_card_v({model:this.model})
       	else if(this.type=="jw_n_dept") var _v = new jw.depts_card_v({model:this.model})
        this.vcard.html(_v.render().el);
        $(this.targetEl).unbind('mouseleave').unbind('mouseenter')//移出目标元素时
        .bind('mouseenter',function(){
            if(window.settimeout) clearTimeout(window.settimeout);
        })
        .bind('mouseleave',function(){
            window.settimeout = setTimeout(function(){
                self._remove(self.vcard);
            },300);
        });
        this.vcard.unbind('mouseenter').unbind('mouseleave')//移出名片时
        .bind("mouseenter",function(){
            if(window.settimeout) clearTimeout(window.settimeout);
        }).bind('mouseleave',function(){
            window.settimeout = setTimeout(function(){
                self._remove(self.vcard);
            },300);
        });
    },
    _remove:function(el){
        el.remove();
        delete(this.settimeout);
    },
    follow:function(){
    	this.model.fetch({data:{id:this.model.get('id'),type:this.model.get("isfollow")==1?5:4},url:basurl+'/task/operate/',success:function(resp){
    		new jw.SysNotice({type	: 2,delay	: 1000,text	: resp.get("isfollow")=="0"?'已取消关注':'关注成功'});
    	}})
    },
    group_follow:function(){
    	var self = this
    	var model = new Backbone.Model()
    	model.url = this.model.get('role')&&this.model.get('role')!=''?basurl+'/groups/leavegroup/':basurl+'/groups/joingroup/';
    	if(this.model.get('role')&&this.model.get('role')!=''){
    		model.set({leave:1,id:self.model.get('gid')})
    	}else{
    		model.set({join:1,id:self.model.get('gid')})
    	}
    	model.bind('sync',function(resp){
    		new jw.SysNotice({type	: 2,delay	: 1000,text	: resp.get("role")&&resp.get("role")!=""?'已加入群组':'已退出群组'});
    		self.model.set(resp.toJSON())
    	})
    	model.save()
    	delete model
    },
    project_follow:function(){
    	var self = this;
    	Backbone.sync('update',null,{data:JSON.stringify({id:this.model.get('id'),status:this.model.get('isfollow')=="1"?false:true}),url:basurl+'/projects/follow/',success:function(resp){
    		new jw.SysNotice({type	: 2,delay	: 1000,text	: resp["isfollow"]=="0"?'已取消关注':'关注成功'});
			self.model.set(resp)
		}})
    }
});
/**
 * 简单翻页组件
 * options
 * 		style:0 <>,1 首页 < 下一页
 * 		pageno:当前页码
 * 		pagesize:每页条数
 * 		num:总数
 *		model
 */
jw.SimplePagination=Backbone.View.extend({
	initialize:function(options){
		this._options={
			style:1
		};
		_.extend(this._options,options);
		Backbone.View.prototype.initialize.call(this,arguments);
		// this.model=new jw.M_Pagination(this._options);
		this.initDOM();
		this._bindEvt();
	},
	initDOM:function(){
		this._container=$('<div class="page-style-'+this._options.style+'"></div>');
		$(this.el).append(this._container);
		this._pages = Math.ceil(this.num/this.pagesize);
		this.addBtns()
	},
	addBtns:function(){
		if(this._options.style==0){
			
		}else if(this._options.style==1){
			this._container.append('<div class="pn-first-1"><span class="pn-txt">回到首页</span></div><div class="pn-prev-1"><span class="sml-btn-l"></span></div><div class="pn-next-1"><span class="pn-txt">下一页</span><span class="sml-btn-r"></span></div>');
			this._firstbtn=this._container.find('.pn-first-1');
		}
		this._prevbtn=this._container.find('.pn-prev-1');
		this._nextbtn=this._container.find('.pn-next-1');
		this.setPageBtnStatus();
	},
	_bindEvt:function(){
		var self=this;
		_.bindAll(this,'prevPage','nextPage','firstPage','setPageBtnStatus');
		this._prevbtn.click(function(){
			if(!$(this).hasClass('disabled')){
				$(this).addClass('disabled');
				self._nextbtn.addClass('disabled');
				self.prevPage();
			}
		});
		this._nextbtn.click(function(){
			if(!$(this).hasClass('disabled')){
				$(this).addClass('disabled');
				self._prevbtn.addClass('disabled');
				self.nextPage();
			}
		});
		this._firstbtn && this._firstbtn.click(this.firstPage);
		// trace(typeof this.model);
		this.model.bind('change:pageno',this.setPageBtnStatus);
	},
	prevPage:function(){
		this.model.set({pageno:(this.model.get('pageno')-1)});
	},
	nextPage:function(){
		this.model.set({pageno:(this.model.get('pageno')+1)});
	},
	// 回到首页
	firstPage:function(){
		this.model.set({pageno:0});
	},
	// 设置按钮disable/enable状态
	setPageBtnStatus:function(){
		// trace(this.model.toJSON());
		this.num=this.model.get('num');
		this.pagesize=this.model.get('pagesize');
		// trace('setPageBtnStatus['+this.num+']['+this.pagesize+']');
		this._pages = Math.ceil(this.num/this.pagesize);
		if((this.model.get('pageno')+1)>=this._pages) this._nextbtn.addClass('disabled');
		else if(this._nextbtn.hasClass('disabled')) this._nextbtn.removeClass('disabled');
		
		if(this.model.get('pageno')==0){
			this._prevbtn.addClass('disabled');
			this._firstbtn && this._firstbtn.addClass('hide');
		}else{
			if(this._prevbtn.hasClass('disabled')){
				this._prevbtn.removeClass('disabled');
			}
			if(this._firstbtn){
				if(this.model.get('pageno')>1) this._firstbtn.removeClass('hide');
				else this._firstbtn.addClass('hide');
			}
		}
		!this._nextbtn.hasClass('disabled') && this._nextbtn.attr('title','第'+(this.model.get('pageno')+2)+'页');
		!this._prevbtn.hasClass('disabled') && this._prevbtn.attr('title','第'+this.model.get('pageno')+'页');
	},
	remove:function(){
		this._container.remove();
	}
});

/**
 * 为collection 分页
 * collection 需要有 pageno/pagesize/num 三个属性
 */
jw.pagesview = Backbone.View.extend({
	events:{
		'click .cansel':'selpage'
	},
	initialize:function(){
		_.bindAll(this,'render','selpage');
		this.collection.bind('all',this.render);
	},
	render:function(){
		// trace('pages render['+this.collection.num+']')
		this.$el.html('<div class="paging page-style-2"></div>')
		if(!this.collection.num) return;
		var nums=this._getPageParams(),cansel='',collection=this.collection;
		if(!nums){
			this.$el.find('.paging').empty();
			return this;
		}
		var html = _.reduce(nums,function(memo,i){
				cansel=(i==collection.pageno+1)?' selected unable':' cansel';
				if(typeof(i) == "number"){
					return memo+'<div class="page-btn-num page-btn-type2 page-'+i+cansel+'" action-data="'+i+'" title="第'+i+'页">'+i+'</div>';
				}else if(typeof(i) == "string" && i=='...'){
					return memo+'<div class="page-btn-ell page-btn-type2" action-data="'+i+'">'+i+'</div>';
				}else{
					return '';
				}
			},'');
		
		var scansel='',ecansel='',stitle='',etitle='';
		if(collection.pageno>0){
			scansel=' cansel';
			stitle=' title="第'+collection.pageno+'页"';
		}
		
		if(collection.pageno<(this.pagenum-1)){
			ecansel=' cansel';
			etitle=' title="第'+(collection.pageno+2)+'页"';
		}
		var scansel=collection.pageno==0?'':' cansel',
			ecansel=collection.pageno==this.pagenum-1?'':' cansel';
		html='<div class="page-btn-prev page-btn-type1'+scansel+'" action-data="prev"'+stitle+'><span class="sml-btn"></span><span class="sml-txt">上一页</span></div>'+html+
			'<div class="page-btn-next page-btn-type1'+ecansel+'" action-data="next"'+etitle+'><span class="sml-txt">下一页</span><span class="sml-btn"></span></div>';
		this.$el.find('.paging').append(html);
		return this;
	},
	_getPageParams:function(){
		var nums;
		this.pagenum=Math.ceil(this.collection.num/this.collection.pagesize);
		if(this.pagenum==1) return null;
		// trace('num['+this.collection.num+'] pagesize['+this.collection.pagesize+'] pageno['+this.collection.pageno+'] pagenum['+this.pagenum+']')
		if(this.collection.pageno<=7){
			if(this.collection.pageno+4 >= this.pagenum-2)
				nums = _.range(1,1+this.pagenum);
			else{
				nums = _.range(1,1+3+this.collection.pageno);
				nums.push('...',this.pagenum-1,this.pagenum);
			}
		}else{
			nums = _.range(1,1+2);
			nums.push('...');
			if(this.collection.pageno+4>=this.pagenum-2){
				nums = nums.concat(_.range(this.collection.pageno-3,1+this.pagenum));
			}else{
				nums = nums.concat(_.range(this.collection.pageno-3,4+this.collection.pageno));
				nums.push('...',this.pagenum-1,this.pagenum);
			}
		}
		return nums;
	},
	selpage:function(evt){
		var pageno=$(evt.target).hasClass('cansel')?$(evt.target).attr('action-data'):$(evt.target).closest('.cansel').attr('action-data');
		// trace('selpage['+pageno+']')
		if(pageno=='next') pageno=this.collection.pageno+1;
		else if(pageno=='prev') pageno=this.collection.pageno-1;
		else pageno=parseInt(pageno)-1;
		this.trigger('change',pageno);
	}
});


/**
 * 选项卡按钮栏View
 * options
 * 		style:1(tb_w1)/2(tb_w2)/3(tb_w3)/4(tb_w4)
 * 如果传入容器为空，则由组件进行初始化动作
 */
jw.Tabs=Backbone.View.extend({
	className:'jw-tabs',
	events:{
		'click .tb_item':'SelTab'
	},
	initialize:function(options){
		this._options={
			style:1
		};
		_.extend(this,_.pick(_.extend(this._options,options),['style']));
		this._container=$(this.el).find('.tb_w');
		if(this._container.length==0){
			this._container=$('<div class="tb_w tb_w'+this._options.style+'"></div>');
			$(this.el).append(this._container);
		}
		this.items=options.items;
		this._default=options._default;
		if(this._container.find('.tb_item').length==0) this._initDOM();
		this._bindEvt();
	},
	_initDOM:function(){
		var self=this;
		this._container.empty();
		this.items && _.each(this.items,function(item){
			var _class = item.disabled?'tb_item disabled':'tb_item';
			self._container.append('<a action-type="'+item.id+'" class="'+_class+'">'+item.name+'</a>');
		});
		if(this._default){
			this._container.find('a[action-type="'+this._default+'"]').addClass('selected');
		}
	},
	_bindEvt:function(){
		_.bindAll(this,'SelTab');
	},
	SelTab:function(evt,options){
		var btn=$(evt.target);
		if(btn.hasClass('selected')||btn.hasClass('disabled')) return;
		this._container.find('.tb_item').removeClass('selected');
		btn.addClass('selected');
		this.curTab=btn.attr('action-type');
		if(options && options.silent){
			
		}else{
			this.trigger('change',btn.attr('action-type'));
		}
	},
	SelKeyTab:function(key){
		this._container.find('.tb_item[action-type="'+key+'"]').trigger('click',{silent:true});
	},
	SelFirst:function(){
		this._container.find('.tb_item:first').trigger('click')
	},
	// 选择第一个，但不触发变更事件
	SelDefaultSilent:function(){
		var btn=this._container.find('.tb_item:first')
		if(btn.hasClass('selected')) return;
		this._container.find('.tb_item').removeClass('selected');
		btn.addClass('selected');
		this.curTab=btn.attr('action-type');
	},
	reset:function(items){
		this.items=items;
		this._initDOM();
		this._container.find('.tb_item:first').trigger('click');
	},
	getCurTab:function(){
		return this.curTab;
	}
});
/**
 * 输入model的Tabs
 * 初始化时，需要传入model对应的key
 */
jw.ModelTabs=jw.Tabs.extend({
	SelTab:function(evt){
		var btn=$(evt.target);
		if(btn.hasClass('selected')||btn.hasClass('disabled')) return;
		jw.Tabs.prototype.SelTab.call(this,evt);
		this.model.set(this.options.key,$(evt.target).attr('action-type'));
	}
})
/**
 * 具备变更Tab项能力的Tabs
 * 需要传入 collection
 */
jw.TabsCollection=jw.Tabs.extend({
	initialize:function(){
		_.bindAll(this,'reset');
		jw.Tabs.prototype.initialize.call(this,arguments);
		this.collection.bind('all',this.reset);
	},
	// 根据传入的数据重新初始化标签栏
	reset:function(){
		this.items=this.collection.toJSON();
		this._container.empty();
		this._initDOM();
		this.SelFirst();
	}
})



/**
 * 头像编辑
 * jw.ep_handle 头像编辑视图句柄
 */	
jw.EditProfile=function(){
	// 判断头像编辑环境是否准备好
	// 准备头像编辑环境
	var prediv=$('<div class="ep-w"><div class="ep-c"><div class="pre-ep-w"><div id="pre-ep-loading"></div><h3>正在加载头像信息...</h3></div></div></div>');
	var preeploading=new jw.loading(prediv.find('#pre-ep-loading'));
	jw.ep_handle=new jw.dialog({
		style:'custom',
		content:prediv
	});
	Backbone.sync('read',null,{
		url:basurl+'/profile/ep',
		success:function(resp, status, xhr){
			prediv.find('.ep-c').html(resp.html);
		}
	});
}
/**
 * 文字高亮
 * @param txt 可为数组
 */
jw.highlight=function(options){
	this._options={
		txtwrap:'',			// 高亮class
		txt:''				// 高亮的文本
	};
	$.extend(this._options,options);
	this._init();
	return this;
}

jw.highlight.prototype={
	_init:function(){
		var strs=[];
		if(typeof this._options.txt=='string'){
			if(this._options.txt.length==0) return false;
			strs.push(this._options.txt);
		}else{
			strs=this._options.txt;
		}
		// var s=this._options.txt;
		var o=this._options.txtwrap;
		if (strs.length==0) return false;
		var s,obj=$(o),self=this;
		for(var j=0,cnt=strs.length;j<cnt;j++){
			s=this.encode(strs[j]);
			obj.each(function(i){
				var t=this.innerHTML.replace(/<span\s+class=.?jw-highlight.?>([^<>]*)<\/span>/gi,"$1");
				this.innerHTML=t; 
				var cnt=self.loopSearch(s,this);
				t=this.innerHTML
				var r=/{searchHL}(({(?!\/searchHL})|[^{])*){\/searchHL}/ig
				t=t.replace(r,"<u class='jw-highlight'>$1</u>");
				this.innerHTML=t;
			});
		}
	},
	loopSearch:function(s,obj){
		var cnt=0,self=this;
		if (obj.nodeType==3){
			cnt=self.replace(s,obj);
			return cnt;
		}
		for (var i=0,c;c=obj.childNodes[i];i++){
			if (!c.className||c.className!="jw-highlight")
			cnt+=self.loopSearch(s,c);
		}
		return cnt;
	},
	replace:function(s,dest){
		var r=new RegExp(s,"ig");
		var tm=null;
		var t=dest.nodeValue;
		var cnt=0,self=this;
		if (tm=t.match(r)){
			cnt=tm.length;
			t=t.replace(r,"{searchHL}"+self.decode(tm[0])+"{/searchHL}")
			dest.nodeValue=t;
		}
		return cnt;
	},
	encode:function(s){
		if( typeof s == 'number' ) s += '';
		return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/([\\\.\*\[\]\(\)\$\^])/g,"\\$1");
	},
	decode:function(s){
		return s.replace(/\\([\\\.\*\[\]\(\)\$\^])/g,"$1").replace(/&gt;/g,">").replace(/&lt;/g,"<").replace(/&amp;/g,"&");
	},
	// 高亮关键词，可传入数组
	refresh:function(txt){
		this._options.txt=txt;
		this._init();
	}
}
// 日历相关
jw.Cal=jw.Cal||{};
/**
 * 时间计算model
 */
jw.Cal.Model=Backbone.Model.extend({
	initialize:function(options){
		// 时差
		this.difftime=new Date().getTimezoneOffset()*-60*1000;
		_.bindAll(this,'calcu');
		this.curtime=options.curtime;
		if(typeof this.curtime=='number')
			this.curtime=new Date(this.curtime*1000);
		this.showtime=this.curtime;
		this._today=this.curtime.toObject();
		this.set({today:this._today});
		
		this.calcu();
	},
	calcu:function(){
		// 当天
		this._showday=this.showtime.toObject();
		this.set({showday:this._showday});
	},
	setShowday:function(daystamp){
		// 当天
		this.showtime=daystamp;
		this.calcu();
		this.trigger('changeShowday');
	},
	// 获取计算了时差时间
	// 获取不含时差的时间戳
	getDateStamp:function(y,m,d){
		return new Date(Number(new Date(y,m,d)));
		// return new Date(Number(new Date(y,m,d))+this.difftime);
	},
	// 获取当前时间
	getCurtime:function(){
		return this.curtime;
	}
})
/**
 * 月model
 */
jw.Cal.M_Month=jw.Cal.Model.extend({
	initialize:function(options){
		jw.Cal.Model.prototype.initialize.call(this,options);
	},
	calcu:function(){
		jw.Cal.Model.prototype.calcu.call(this);
		// 月份的开始日期
		var _firstdaystamp=this.getDateStamp(this._showday.y,this._showday.m,1),
			// 月份开始日期转换为对象
			_firstday=_firstdaystamp.toObject(),
			// 计算miniCal中第一天
			miniCalFirstStamp=new Date(Number(_firstdaystamp)-86400*1000*_firstday.w),
			miniCalFirst=miniCalFirstStamp.toObject();
		this.set({
			firstdaystamp:_firstdaystamp,
			firstday:_firstday,
			miniCalFirstStamp:miniCalFirstStamp,
			miniCalFirst:miniCalFirst
		})
	}
})
/**
 * mini cal
 */
jw.Cal.miniMonth=Backbone.View.extend({
	events:{
		'click td':'selday',
		'click .minical-btn':'changeMonth'
	},
	initialize:function(options){
		var self = this;
		_.bindAll(this,'render');
		this.stop_evt = options["stop_evt"];
		options=options||{};
		if(!this.model){
			this.model=new jw.Cal.M_Month({
				curtime:options.systime||jw.systime
			});
		}
		this.model.bind('changeShowday',function(data){
			self.render()
			self.trigger('changeShowday')
		});
		this.render();
	},
	render:function(){
		$(this.el).html(this.renderHeader());
		$(this.el).find('tbody').html(this.renderBody());
	},
	renderHeader:function(){
		var showday=this.model.get('showday');
		return '<div class="minical"><table cellspacing="0" cellpadding="0"><thead>\
					<tr><th class="minical-header" colspan="7"><div><span class="minical-btn l minical-btn-left" title="上一月"></span><span class="minical-btn r minical-btn-right" title="下一月"></span><a href="#" class="minical-nav">'+showday.y+'年'+(showday.m+1)+'月</a></div></th></tr>\
					<tr class="minical-week-h"><th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th></tr>\
				</thead><tbody></tbody></table></div>';
	},
	renderBody:function(){
		var html='',newstamp,outmonth,
			firststamp=Number(this.model.get('miniCalFirstStamp')),
			today=this.model.get('today'),
			showday=this.model.get('showday');
		for(var i=0;i<6;i++){
			html+='<tr>';
			for(var j=0;j<7;j++){
				newstamp=(new Date(firststamp+(i*7+j)*86400*1000)).toObject();
				outmonth=newstamp.m==showday.m?'':' class="out-of-month"';
				istoday=newstamp.m==today.m&&newstamp.d==today.d?' class="minical-today"':'';
				html+='<td'+outmonth+istoday+'><a href="javascript:;">'+newstamp.d+'</a></td>';
			}
			html+='</tr>';
		}
		return html;
	},
	// 月份切换
	changeMonth:function(evt){
		var showday=this.model.get('showday'),
			newmonth=$(evt.target).hasClass('minical-btn-left')?showday.m-1:showday.m+1;
		this.model.setShowday(new Date(showday.y,newmonth,showday.d));
		evt.stopPropagation();
	},
	selday:function(evt){
		var td=$(evt.target).is('td')?$(evt.target):$(evt.target).parent();
		if( td.hasClass( 'selected' ) ) return;
		this.$el.find( 'td.selected' ).removeClass( 'selected' );
		td.addClass( 'selected' );
		this.trigger('change',(Number(this.model.get('miniCalFirstStamp'))+(td.closest('tr').index()*7+td.index())*86400*1000)/1000);
		if(this.stop_evt){
			evt.stopPropagation()
		}
	},
	// 获取当日字符串　yyyy-mm-dd　格式
	getTodayStr:function(){
		return this.model.getCurtime().FormatTime('yyyy-MM-dd');
	}
});
/**
 * 选择日期组件
 * 添加选项 stop_evt 是否选择日起后阻止冒泡
 */
jw.SelDate=jw.input.extend({
	initialize:function(options){
		var self=this;
		this.stop_evt = options['stop_evt']
        if(typeof options['_default']== "number") options['_default'] = new Date(options['_default']*1000).FormatTime('yyyy-MM-dd')
		jw.input.prototype.initialize.call(this,options);
		_.bindAll(this,'_showMiniCal','_hideMiniCal','setDate');
		// this.bind('focus',this._showMiniCal);
		this.bind('click',this._showMiniCal);
		this.bind('focus',function(){
			clearTimeout(self.Timer)
		})
	},
	onBlur:function(evt,str){
		// if(this.minicalwmousedown){
		// 	this.minicalwmousedown=false;
		// 	return;
		// }
		// var self = this;
		// setTimeout(function(){
		// 	self._hideMiniCal();
		// },10)
		// this._hideMiniCal();
		// 重新格式化输入框中的日期字符串
		var self = this;
		this.Timer = setTimeout(function(){
			var DateStr=self.getText().ValidDate();
			if(!DateStr) DateStr=self.minical.getTodayStr();
			self.setTxt(DateStr);
		},500)
		jw.input.prototype.onBlur.call(this);
	},
	_showMiniCal:function(evt,type){
		// trace('_showMiniCal');
		// clearTimeout(this.Timer)
		if(!this.minical) this._initMinical();
		if(!this.minicalw.hasClass('hide')) return;
		// 获取 input 位置
		var offset=this._wrap.offset(),
			h=this._wrap.height(),
			newpos={left:offset.left+'px',top:(offset.top+h)+'px'},
			docscrolltop=$(document).scrollTop(),
			screenbottom=docscrolltop+$(window).height(),
			minical_h=this.minicalw.height();
		if((newpos.top+minical_h)>screenbottom){
			newpos.top=(offset.top-minical_h-1)+'px';
		}
		this.minicalw.css(newpos).removeClass('hide');
		jw.fdmng.show(this.minicalw);
	},
	_hideMiniCal:function(){
		var self = this;
		setTimeout(function(){
			if( self.minicalw ) self.minicalw.addClass('hide');
		},10)
	},
	_initMinical:function(){
		var self=this;
		// 1. 创建一个空DIV，存放
		this.minicalw=$('<div class="minicalw jw-fd jw-dropdown hide"></div>');
		$('body').append(this.minicalw);
		this.minical=new jw.Cal.miniMonth({
			el:this.minicalw,
			stop_evt:this.stop_evt
		});
		this.minical.bind('change',this.setDate);
		// minical click 时，删除延时句柄
		this.minical.bind('changeShowday',function(){
			// console.log('获取到了么')
			self.setFocus()
		})
		this.minicalw.mousedown(function(evt){
			// console.log('这里捕获到了么')
			self.setFocus()
			evt.stopPropagation()
		})
		this.minicalw.click(function(evt){
			self.setFocus()
			evt.stopPropagation()
		})
		$('body').click(function(){
			self._hideMiniCal()
		})
	},
	setDate:function(seldate){
		// trace('selDate')
		if(typeof seldate=='number'){
			// PHP 时间戳格式，如 1364260849
			seldate=(new Date(jw.timetostamp_now(seldate)*1000)).toObject();
			seldate.m+=1;
		}else if(typeof seldate=='string'){
			// 格式 2013-03-26
			seldate=seldate.ToCDB();
			seldate=seldate.split('-');
			seldate={ y:seldate[0],m:seldate[1],d:seldate[2] };
		}
		if(seldate.m.toString().length==1) seldate.m='0'+seldate.m;
		if(seldate.d.toString().length==1) seldate.d='0'+seldate.d;
		this.setTxt(seldate.y+'-'+seldate.m+'-'+seldate.d);
		this.setFocus()
		this._hideMiniCal()
	}
});

// 时间数组
jw.combineTimeArray=function(){
	var n,str,hour;
	var rng = _.chain( _.range(0,86400,1800) ).map(function(num,i){
		n=num/3600;
		str=n<12?'上午':'下午';
		str+=' ';
		hour=n>12?Math.floor(n-12):Math.floor(n);
		str+=hour>9?hour:'0'+hour;
		str+=n.toString().indexOf('.')>0?':30':':00';
		return {key:num,txt:str};
	}).value();
	return rng;
}

/**
 * 时间字符串转换为时间戳
 * 输入格式 hh:mm
 * 返回 1800~86400 间隔半小时
 */
Date.prototype.TimeToStamp=function(){
	// 时间减去时区差值
	return Math.round((((Number(this)-this.getTimezoneOffset()*60000)/1000)%86400)/1800)*1800;
}
/**
 * Datetime Compontent
 */
jw.SelDatetime=jw.SelDate.extend({
	initialize:function(options){
		_.bindAll(this,'Change','gettime');
		var time=new Date(options._default*1000);
		options._default=time.FormatTime('yyyy-MM-dd');
		this._defaulttime=time.TimeToStamp();
		jw.SelDate.prototype.initialize.call(this,options);
		this._wrap.addClass('cal-seldatew')
		this._initSelTime();
		this.bind('onBlur',this.Change);
	},
	_initSelTime:function(){
		this.seltimew=$('<div class="cal-seltimew"></div>');
		$(this.el).append(this.seltimew);
		var items = _.map(jw.combineTimeArray(),function(item){
			return {key:item.key+'',txt:item.txt};
		});
		// trace('xxx',items);
		this.seltime=new jw.stdCombobox({
			el:this.seltimew,
			dropdownparams:{
				items:items,
				_default:this._defaulttime+''
			}
		});
		this.seltime.bind('change',this.Change);
	},
	Change:function(d){
		if(!this.seltime.getVal()) return;
		var self=this;
		setTimeout(function(){
			self.trigger('change',self.gettime());
		},10);
	},
	// 获取日期+时间 时间戳
	gettime:function(){
		var datestr=this.getText(),timekey,
			datearr=datestr.split('-'),
			datetime=Number(new Date(datearr[0],Number(datearr[1])-1,datearr[2]));
		// trace('datestr['+datestr+']timekey['+timekey+'] date['+Number(datetime)+']')
		// 如果时间选择栏可选状态，则加入时间
		if(this.seltime.isEnable()){
			var seltime=this.seltime.getVal();
			if(seltime) timekey=seltime.key;
			else{
				this.seltime.select(0);
				timekey=0
			}
			datetime=datetime+timekey*1000;
		}
		return datetime/1000;
	},
	// 设置时间 时间戳格式
	settime:function(stamp){
		this.setDate(stamp);
		this.seltime.select((new Date(stamp*1000)).TimeToStamp());
	}
});

/**
 * 富提示组件
 * options
 * 		btn 待提示按钮
 * 		content 提示文字
 */
jw.RichTip=jw.FD.extend({
	initialize:function(options){
		this._options={
			btn:null,
			removeOnClose:false,
			autoShow:false
		};
		options.content=options.content||options.btn.attr('richtip');
		this._btn=options.btn;
		_.extend(this._options,options);
		_.extend(this,this._options);
		this._bindEvt();
	},
	_bindEvt:function(){
		var self=this;
		this._btn.hover(function(){
			if(!self._dlg) self._initDlg();
			self.show();
		},function(){
			self._close();
		})
	},
	_initDlg:function(){
		this._dlg=$('<div class="jw-fd jw-richtip">'+this.content+'</div>');
		$('body').append(this._dlg);
		this.el=this._dlg;
		jw.FD.prototype.initialize.call(this,_.extend(this._options,{el:this.el}));
	},
	show:function(){
		if(this._btn.attr('disabled')) return;
		// 设置窗口位置
		jw.FD.prototype.show.call(this);
		this._dlg.html(this._btn.attr('richtip'))
		var offset=this._btn.offset(),
			btnw=this._btn.width(),
			btnh=this._btn.height(),
			dlgw=this._dlg.width(),
			dlgh=this._dlg.height();
		// trace('dlgw ['+dlgw+'] btnw['+btnw+']')
		this._dlg.css({left:(offset.left-(dlgw-btnw)/2-8)+'px',top:(offset.top+btnh+8)+'px'});
	}
});

/**
 * 右键菜单组件
 */
jw.showmenu=jw.DropdownList.extend({
	initialize:function(options){
		var self=this;
		// 右键事件(click)
		this.evt=options.evt;
		this._initDOM();
		jw.DropdownList.prototype.initialize.call(this,options);
		// 判断位置是否超出窗口
		var docscrolltop=$(document).scrollTop(),
			screenbottom=docscrolltop+$(window).height();
		if((this.pos.top+$(this.el).height())>screenbottom){
			$(this.el).css({top:(screenbottom-$(this.el).height()-30)+'px'});
		}
		jw.fdmng.show(this);
		$(document).one('click',function(){
			self.close();
		})
	},
	_initDOM:function(){
		this.el=$('<div class="jw-showmenu-w jw-dropdown"></div>');
		this.pos=evtPos(this.evt);
		$('body').append(this.el.css({top:this.pos.top+'px',left:this.pos.left+'px'}));
	},
	close:function(){
		jw.fdmng.hide(this);
	},
	mngClose:function(){
		this.el.remove();
	}
});

/**
 * 单张图片显示组件
 * 输入参数：
 *      el    图片显示容器
 *      model || imgs  图片model 或图片数组
 *      current 默认装载的图片
 */
jw.img={};
jw.img.model=Backbone.Model.extend({
	defaults:{
		thumbnail:'',middle:'',big:'',current:'thumbnail',iscurrent:0
	},
	initialize:function(){
		if(this.get('middle')==''){
			this.set('middle',this.get('thumbnail').replace('thumbnail','bmiddle'));
			this.set('big',this.get('thumbnail').replace('thumbnail','mw1024'));
		}
	}
});

jw.img.collection=Backbone.Collection.extend({
	model:jw.img.model
});

jw.img.single=Backbone.View.extend({
	events:{
		'click .sgl-thumb-c img':'viewPreview',
		'click .sgl-close-btn':'closePreview',
		'click .sgl-pw-pic':'closePreview',
		'click canvas':'closePreview',
		// 'click .sgl-close-btn':'viewThumbnail',
		'click .sql-turn-l':'turnLeft',
		'click .sql-turn-r':'turnRight'
	},
	initialize:function(options){
		if(!this.model&&!options.imgs) throw 'img.single initialize params error.';
		_.bindAll(this,'reRender');
		if(!this.model) this.model=new jw.img.model(options.imgs);
		this.render();
		this.viewPreview();
		// this.model.bind('change',this.reRender);
	},
	render:function(){
		this.$el.append('<div class="sgl-w"><div class="sgl-thumb-w"><div class="sgl-thumb-c"><img src="'+this.model.get(this.model.get('current'))+'" /></div></div></div>')
	},
	reRender:function(){
		this.$el.empty();
		this.createMiddle();
	},
	viewPreview:function(){
		this.model.set('current','middle');
		if(!this.middle) this.createMiddle();
		this.$el.find('.sgl-thumb-w').hide();
		this.middle && this.middle.show();
	},
	closePreview:function(){
		this.$el.hide();
		this.trigger('CancelView');
	},
	createMiddle:function(){
		var self=this;
		var progressbar = new jw.SysNotice({
				type:1,
				text:'正在下载图片'
			});
		jw.loadimg(this.model.get('middle'),function(img){
			self.$el.show();
			progressbar.HideBar();
			self.middle=$('<div class="sgl-preview"><div class="sgl-preview-w"><div class="sgl-preview-bar"><a class="sgl-close-btn" title="关闭"><b></b></a><a title="查看原图" target="_blank" href="'+self.model.get('big')+'"><b class="ico-layout-2"></b></a><a class="sql-turn-l" title="左旋转"><b></b></a><a title="右旋转" class="sql-turn-r"><b></b></a></div><div class="sgl-pw-pic"></div></div></div>');
			self.middle.find('.sgl-pw-pic').append(img);
			self.$el.append(self.middle);
		});
	},
	viewThumbnail:function(){
		this.middle.hide();
		this.$el.find('.sgl-thumb-w').show();
	},
	turnLeft:function(){
		this.turnImage('left');
	},
	turnRight:function(){
		this.turnImage('right');
	},
	turnImage:function(dir){
		if(!this._canvas) this._CreateCanvas();
		var img={width:this._img.width(),height:this._img.height()};
		var ctx=this._canvas[0].getContext('2d');
		if(dir=='left') this._curRotate--;
		else this._curRotate++;
		if(this._curRotate>3) this._curRotate=0;
		else if(this._curRotate<0) this._curRotate=3;
		if(this._curRotate==0||this._curRotate==2) this._canvas.attr({'width':img.width,'height':img.height});
		else{
			var nw,nh;
			if(img.height<=img.width){
				nw=img.height;
				nh=img.width;
			}else{
				nw=img.width;
				nh=Math.ceil(nw*img.width/img.height);
			}
			this._canvas.attr({'width':nw,'height':nh});
		}
		if($.browser.msie){
			/* FIXME:Deal IE
			var image=new Image();
			image.src=canvassrc.attr("src");
			var newwh=mbshow.newArea(cur, image.width,image.height);

			if(cur==0||cur==2) canvassrc.attr({'width':newwh.w,'height':newwh.h});
			else canvassrc.attr({'width':newwh.h,'height':newwh.w});
			canvassrc.attr("rel",cur).css("filter","progid:DXImageTransform.Microsoft.BasicImage(Rotation="+cur+")");
			*/
		}else{
			switch (this._curRotate){
				case 0:
					ctx.drawImage(this._img[0],0,0,this._canvas.attr("width"),this._canvas.attr("height"));
					break;
				case 1:
					ctx.rotate(90*Math.PI/180);
					ctx.drawImage(this._img[0],0,-1*this._canvas.attr("width"),this._canvas.attr("height"),this._canvas.attr("width"));
					break;
				case 2:
					ctx.rotate(180*Math.PI/180);
					ctx.drawImage(this._img[0],-1*this._canvas.attr("width"),-1*this._canvas.attr("height"),
									this._canvas.attr("width"),this._canvas.attr("height"));
					break;
				case 3:
					ctx.rotate(270*Math.PI/180);
					trace('['+this._canvas.attr("height")+'] ['+this._canvas.attr("width")+']');
					ctx.drawImage(this._img[0],-1*this._canvas.attr("height"),0,this._canvas.attr("height"),this._canvas.attr("width"));
					break;
			}
		}
	},
	// 创建Canvas
	_CreateCanvas:function(){
		this._img=this.$el.find('.sgl-pw-pic img');
		this.$el.find('.sgl-pw-pic').css('width',this._img.width());
		this._img.hide();
		this._canvasw=$('<div class="as-canvas"><canvas width="'+this._img.width()+'" height="'+this._img.height()+'"></canvas></div>');
		this._canvasw.css('width',this._img.width()+'px');
		this.middle.append(this._canvasw);
		this._canvas=this._canvasw.children('canvas');
		this._curRotate=0;
	}
});

jw.img.thumbidx=Backbone.View.extend({
	className:'jw-img-idx',
	events:{
		'click .jw-img-idxc':'selectImg'
	},
	initialize:function(){
		_.bindAll(this,'render','setFocus');
		this.model.bind('change:iscurrent',this.setFocus);
	},
	render:function(){
		this.$el.append('<div class="jw-img-idxc"><img src="'+this.model.get('thumbnail')+'" /></div>');
		if(this.model.get('iscurrent')) this.$el.addClass('cur');
		return this;
	},
	setFocus:function(){
		if(this.model.get('iscurrent')) this.$el.addClass('cur');
		else this.$el.removeClass('cur');
	},
	selectImg:function(){
		if(this.model.get('iscurrent')) return;
		var model=this.model.collection.findWhere({iscurrent:1});
		model && model.set({iscurrent:0});
		this.model.set('iscurrent',1);
	}
});

jw.img.mutil=Backbone.View.extend({
	initialize:function(){
		_.bindAll(this,'renderOneIdx','renderMain');
		this._initDOM();
		// this.collection.at(0).set({iscurrent:1});
		// this.renderMain();
		this.renderIndex();
		this.collection.bind('change',this.renderMain);
	},
	_initDOM:function(){
		this.$el.append('<div class="jw-img-main"></div><div class="jw-img-idxw"></div>');
		this.indexw=this.$el.find('.jw-img-idxw');
	},
	renderMain:function(){
		var model=this.collection.findWhere({iscurrent:1});
		trace('renderMain ['+typeof model+']')
		if(!model) return;
		// trace(model.toJSON());
		if(!this.single){
			this.single=new jw.img.single({
				el:this.$el.find('.jw-img-main'),
				model:model.clone()
			});
			var self=this;
			this.single.bind('CancelView',function(){
				var m=self.collection.findWhere({iscurrent:1});
				m && m.set({iscurrent:0});
			});
		}else{
			this.single.model.set(model.toJSON());
			this.single.reRender();
		}
		
	},
	renderIndex:function(){
		this.collection.each(this.renderOneIdx);
		// this.collection.at(0).set('iscurrent',1);
	},
	renderOneIdx:function(model){
		var view=new jw.img.thumbidx({model:model});
		this.indexw.append(view.render().el);
	}
});

// 分享到信息流之后的图片展示
jw.img.asmodel=Backbone.Model.extend({
	defaults:{
		thumbnail:'',middle:'',big:'',current:'thumbnail',iscurrent:0
	},
	initialize:function(){
		if(this.get('middle')==''){
			this.set('middle',this.get('thumbnail').replace('viewthumbnails','viewpreview'));
			this.set('big',this.get('thumbnail').replace('viewthumbnails','vieworiginal'));
		}
	}
});

jw.img.ascollection=Backbone.Collection.extend({
	model:jw.img.asmodel
});
jw.img.asmutil=Backbone.View.extend({
	initialize:function(){
		_.bindAll(this,'renderOneIdx','renderMain');
		// this.collection.at(0).set({iscurrent:1});
		// this.renderMain();
		this.indexw=this.$el.find('.jw-img-idxw');
		imgs=[];
		if(this.indexw.find('img').length==0)	return;
		$.each(this.indexw.find('img'),function(item){
			var src=$(this).attr('src');
			imgs.push({thumbnail:src});
		});
		this.collection=new jw.img.ascollection(imgs);
		// trace(this.collection);
		
		// return;
		this.renderIndex();
		this.collection.bind('change',this.renderMain);
	},
	renderMain:function(){
		var model=this.collection.findWhere({iscurrent:1});
		trace('renderMain ['+typeof model+']')
		if(!model) return;
		// trace(model.toJSON());
		if(!this.single){
			this.single=new jw.img.single({
				el:this.$el.find('.jw-img-main'),
				model:model.clone()
			});
			var self=this;
			this.single.bind('CancelView',function(){
				var m=self.collection.findWhere({iscurrent:1});
				m && m.set({iscurrent:0});
			});
		}else{
			this.single.model.set(model.toJSON());
			this.single.reRender();
		}
		
	},
	renderIndex:function(){
		this.indexw.html('');
		this.collection.each(this.renderOneIdx);
		// this.collection.at(0).set('iscurrent',1);
	},
	renderOneIdx:function(model){
		// trace(model);
		var view=new jw.img.thumbidx({model:model});
		this.indexw.append(view.render().el);
	}
});
//自定义右键弹出框
jw.submenu_dialog = Backbone.View.extend({
    initialize:function(options){
        var self = this;
        _.extend(this,options);
        this.evt=options.evt;
        // this.timer;
        this.index = -1;
        this._initDOM();//初始化外部容器
        this.listdata=options.items;//分解选项
        this._combineList();//拼装view
        // this._default && this.select(this._default);//设置默认的
        this.bindEvt();//绑定事件
        this.resetDOM();
        if(this._default&& this._default!='') this.select(this._default);
        $(document).one('click',function(){
            self.close();
        })
    },
    _combineList:function(){
        var self = this;
        this.items=_.map(this.listdata,function(item){
            return self._combineOne(item);
        });
        $(this.el).empty();
        $(this.el).append(this.items)
    },
    _combineOne:function(item){
        if(item.key=='sep'){
            return '<div class="jw-fd-sep"></div>';
        }else{
            var iconDOM='',fc='';
            iconDOM='<span class="jw-fd-i"></span>';
            if(item.key==-1) fc=' cmb-plscheck';
            if(item.disabled) fc+=' disabled';
            else fc+=' normal';
            return $('<div class="jw-fd-item'+fc+(item['submenu']?' multistage':'')+'" action-data="'+item.key+'" title ="'+item.txt+'"><div class="jw-fd-itemc">'+iconDOM+'<span class="jw-fd-t">'+item.txt+'</span>'+(item['submenu']?'<span class="jw-fd-d"></span></div></div>':'')+'').data('ddl',item);
        }
    },
    _initDOM:function(){
        this.el=$('<div class="jw-showmenu-w jw-dropdown-more"></div>');
        this.pos=evtPos(this.evt);
        if(this.parent_el) this.el.addClass('jw-dropdown-more2')
        $('body').append(this.el.css({top:this.pos.top+'px',left:this.pos.left+'px'}));
    },
    resetDOM:function(){
        var clientW = document.documentElement.clientWidth||document.body.clientWidth,
            clientH = document.documentElement.clientHeight || document.body.clientHeight,
            scrollT = document.documentElement.scrollTop || document.body.scrollTop,
            left_num = 0 , left = 0 , right = 0,top_num = 0 ,top = 0 ;
        if(this.parent_el){
            left_num = 0;
            left = parseInt($(this.parent_el).css('left')),right = clientW - left - $(this.parent_el).width();
            if(right<$(this.el).width()){
                left_num = left-$(this.parent_el).width()-3
            }else{
                left_num = left+$(this.parent_el).width()+3
            }
            top = $(this.evt.currentTarget).offset().top,bottom = clientH + scrollT - top - $(this.el).height();
            if($(this.el).height()>clientH){
                $(this.el).css({height:clientH-30+'px'})
                top_num = scrollT
            }else{
                if(bottom<0){
                    top_num = clientH + scrollT - $(this.el).height()-30
                }else{
                    top_num = top
                }
            }
            $(this.el).css({left:left_num+'px',top:top_num+'px'})
        }else{
            left_num = 0;
            left = this.pos.left,right = clientW - left
            top = this.pos.top,bottom = clientH + scrollT - top - $(this.el).height();
            if(bottom<10){
                top_num = clientH + scrollT - $(this.el).height() - 30
            }else{
                top_num = top
            }
            if(right<$(this.el).width()){
                left_num = clientW - $(this.el).width()-10
            }else{
                left_num = left
            }
            $(this.el).css({left:left_num+'px',top:top_num+'px'})
        }
    },
    bindEvt:function(){
        var self=this;
        $(this.el).find('.jw-fd-item').unbind('click')
        $(this.el).find('.jw-fd-item').bind('click',function(evt){
            if($(evt.currentTarget).hasClass('multistage')) return
            else{
                $.publish('submenuClick',{key:$(evt.currentTarget).attr('action-data'),txt:$(evt.currentTarget).attr('title')})
                self.trigger("submenuClick",{key:$(evt.currentTarget).attr('action-data'),txt:$(evt.currentTarget).attr('title')})
            }
        })
        $(this.el).hover(function(){
            if(self.parent){
                clearTimeout(self.parent.item_time)
                var num = 0;
                $(self.parent.el).find('>div').eq(self.parent.index).addClass('hover')
            }
        },function(){
            $(self.el).find('.jw-fd-item').removeClass('hover');
        })
        $(this.el).find('.jw-fd-item').hover(function(evt){
            $(self.el).find('.jw-fd-item').removeClass('hover');
            $(this).addClass('hover');
            if($(evt.currentTarget).hasClass('multistage')){
                var list = self.listdata[$(this).index()]['submenu']['list'];
                var self_c = this;
                if(!self.submenu_dialog){
                    //无submenu,new一个
                    self.submenu_dialog = new jw.submenu_dialog({
                        items:list,
                        evt:evt,
                        parent_el:self.el,
                        parent:self,
                        type:self.listdata[$(this).index()]['submenu']['type']||'',
                        _default:self.listdata[$(this).index()]['submenu']['_default']||''
                    })
                    self.index = $(self_c).index()
                }else{
                    if(self.index==$(this).index()){
                        clearTimeout(self.item_time)
                        $(this).addClass('hover');
                    }else{
                        clearTimeout(self.item_time)
                        self.submenu_dialog.mngClose();
                        setTimeout(function(){
                            self.submenu_dialog = new jw.submenu_dialog({
                                items:list,
                                evt:evt,
                                parent_el:self.el,
                                parent:self
                            })
                            self.index = $(self_c).index()
                        },0)
                    }
                }
            }
        },function(evt){
            if($(evt.currentTarget).hasClass('multistage')){
                if(self.submenu_dialog){
                    self.item_time = setTimeout(function(){
                        self.submenu_dialog.mngClose();
                        self.index = -1
                    },500)
                }
            }
        })
    },
    select:function(key){
        this.el.find('.jw-fd-item').find('.jw-fd-i').removeClass('show')
        this.el.find('.jw-fd-item[action-data='+key+']').find('.jw-fd-i').addClass('show')
    },
    close:function(){
        jw.fdmng.hide(this);
    },
    mngClose:function(){
        this.el.remove();
    }
})
jw.show_dialog = Backbone.View.extend({
    initialize:function(options){
        var self = this;
        _.extend(this,options);
        $('.custom-dialog').remove()
        this.pos = evtPos(this.evt)
        this._init_dom();
        this.resetDOM();
        this.callBack();
        $(this.el).click(function(evt){
            evt.stopPropagation()
        })
        $(document).bind('click',function(){
            self.mngClose()
        })
    },
    _init_dom:function(){
        this.el=$('<div class="custom-dialog"></div>');
        this.el.html(this.content)
        $('body').append(this.el);
    },
    resetDOM:function(){
        var clientW = document.documentElement.clientWidth||document.body.clientWidth,
            clientH = document.documentElement.clientHeight || document.body.clientHeight,
            scrollT = document.documentElement.scrollTop || document.body.scrollTop,
            left_num = 0 , left = 0 , right = 0,top_num = 0 ,top = 0 ;
        left_num = 0;
        left = this.pos.left,right = clientW - left - $(this.el).width();
        top = this.pos.top,bottom = clientH + scrollT - top - $(this.el).height();
        if(bottom<10){
            top_num = clientH + scrollT - $(this.el).height() - 30
        }else{
            top_num = top
        }
        if(right<$(this.el).width()){
            left_num = clientW - $(this.el).width()-10
        }else{
            left_num = left
        }
        $(this.el).css({left:left_num+'px',top:top_num+'px'})
    },
    close:function(){
        jw.fdmng.hide(this);
    },
    mngClose:function(){
        this.el.remove();
    }
})
/*
	自定义滚动条

*/
jw.scroll = Backbone.View.extend({//自定义
		events:{
			'mousedown .scroll':'move'
		},
		initialize:function(options){
			var self = this;
			_.extend(this,options);
			_.bindAll(this,'move_mouse')
			this.scroll = $('<div class="scroll '+(options["hide"]==1?"hide":'')+'"></div>');
			if(this.type == 1){
				// if(this.$el.height()>this.controlC.height()) return//禁用了这个，后面有用么？？？？
				if(this.width) this.scroll.css({width:this.width+'px',borderRadius:this.width+'px',height:this.$el.height()/(this.controlC.height()/this.$el.height())+'px'})
				this.scroll.addClass("horizontal")
			}else{
				if(this.width) this.scroll.css({height:this.width+'px',borderRadius:this.width+'px',width:this.$el.width()/(this.controlC.width()/this.$el.width())+'px'})
				this.scroll.addClass('vertical')
			}
			this.$el.hover(function(){
				self.scroll.removeClass('hide')
			},function(){
				self.scroll.addClass('hide')
			})
			this.$el.append(this.scroll);
			this.$el.bind("mousewheel DOMMouseScroll",this.move_mouse)
		},
		move:function(evt){
			var evt = evt || window.event,
				self = this;
			if(this.type == 1){
				var y = evt.clientY-this.scroll.position()['top'];
			}else{
				var x = evt.clientX-this.scroll.position()['left'];
			}
			this.scroll.addClass('show')
			self.status =0 ;
			document.onmousemove=function(evt){	
				var evt = evt || window.event;
				if(self.type == 1){
					var T = evt.clientY-y;
					if(T<0){
						T=0
					}else if(T>self.$el.height()-self.scroll.height()){
						T = self.$el.height()-self.scroll.height()
					}
					if(T>=self.$el.height()-self.scroll.height()){
						if(self.status == 1) return 
						else{
							self.marginT  = (T / (self.$el.height()-self.scroll.height()))*(self.controlC.height()-self.$el.height())
							self.trigger('scrollHead')
							self.status = 1
						}
					}
					self.scroll.css({top:T+'px'})
					var soleL = T / (self.$el.height()-self.scroll.height())
					self.controlC.css({top: -soleL * (self.controlC.height()-self.$el.height())+'px'})
				}else{
					var T = evt.clientX - x ;
					if(T<0){
						T = 0
					}else if(T>self.$el.width()-self.scroll.width()){
						T = self.$el.width()-self.scroll.width()
						if(self.status == 1) return 
						else{
							self.marginT  = (T / (self.$el.width()-self.scroll.width()))*(self.controlC.width()-self.$el.width())
							self.trigger('scrollHead')
							self.status = 1
						}
					}
					self.scroll.css({left:T+'px'})
					var soleL = T / (self.$el.width() - self.scroll.width());
					self.controlC.css({left: -soleL*(self.controlC.width()-self.$el.width())+'px'})
				}
			}
			document.onmouseup=function(){
				self.scroll.removeClass('show')
				self.status = 0
				document.onmousemove = null;
				document.onmouseup = null;
			}
			return false
		},
		_init_scroll_c:function(){
			this.scroll_c = $('<div class="scroll_c"></div>')
			if(this.type == 1){
				this.scroll_c.css({width:'100%',height:this.controlC.height()/this.$el.height()+'px'})
			}else{
				this.scroll_c.css({height:'100%',width:this.controlC.width()/this.$el.width()+'px'})
			}
		},
		reset_scroll:function(data){
			if(data=='update'){
				if(this.type == 1){
					if(this.controlC.height()==0 || this.controlC.height()<this.$el.height()){
						this.scroll.css({height:0})
					}else{
						this.scroll.css({height:this.$el.height()/(this.controlC.height()/this.$el.height())+'px'})
						var top = (this.marginT/(this.controlC.height()-this.$el.height()))*(this.$el.height()-this.scroll.height())
						this.scroll.css({top:top+'px'})
					}
				}else{
					this.scroll.css({width:this.$el.width()/(this.controlC.width()/this.$el.width())+'px'})
					var left = (this.marginT/(this.controlC.width()-this.$el.width()))*(this.$el.width()-this.scroll.width())
					this.scroll.css({left:left+'px'})
				}
			}else{
				if(this.type == 1){
					if(this.controlC.height()==0 || this.controlC.height()<this.$el.height()){
						this.scroll.css({height:0})
						this.controlC.css({top:0})
					}else{
						this.controlC.css({top:0})
						this.scroll.css({height:this.$el.height()/(this.controlC.height()/this.$el.height())+'px'})
						this.scroll.css({top:'0px'})
					}
				}else{
					this.scroll.css({width:this.$el.width()/(this.controlC.width()/this.$el.width())+'px'})
					this.scroll.css({left:'0px'})
				}
			}
		},
		move_mouse:function(evt){
			var self = this;
			if(this.scroll_status==2 || parseInt(this.scroll.css('height'))=='0') return 
			var ev = evt['originalEvent'] || event;
			var btn = true,T = 0 ;
			this.status = 0;
			this.scroll.removeClass('hide')
			if(this.type == 1){
				if(ev.wheelDelta){
					btn = ev.wheelDelta<0 ? true : false;
				}else{
					btn=ev.detail>0? true : false;
				}
				if(btn){
					T = parseInt(this.scroll.css("top"))+10
				}else{
					T = parseInt(this.scroll.css("top"))-10
				}
				if(T<0){
					T=0
				}else if(T>this.$el.height()-this.scroll.height()){
					T = this.$el.height()-this.scroll.height()
				}
				if(T>=this.$el.height()-this.scroll.height()){
					if(this.status == 1) return 
					else{
						this.marginT  = (T / (this.$el.height()-this.scroll.height()))*(this.controlC.height()-this.$el.height())
						this.trigger('scrollHead')
						this.status = 1
					}
				}
				this.scroll.css({top:T+'px'})
				var soleL = T / (this.$el.height()-this.scroll.height())
				this.controlC.css({top: -soleL * (this.controlC.height()-this.$el.height())+'px'})
				evt.stopPropagation()
				return false
			}
		}
	})
jw.scroll_specail = Backbone.View.extend({//自定义
		events:{
			'mousedown .scroll':'move'
		},
		initialize:function(options){
			var self = this;
			_.extend(this,options);
			_.bindAll(this,'move_mouse')
			this.scroll = $('<div class="scroll"></div>');
			this.scroll_status = 1;
			if(this.type == 1){
				if(this.width) this.scroll.css({width:this.width+'px',borderRadius:this.width+'px',height:this.$el.height()/(this.controlC.height()/this.$el.height())+'px'})
				this.scroll.addClass("horizontal")
			}else{
				if(this.width) this.scroll.css({height:this.width+'px',borderRadius:this.width+'px',width:this.$el.width()/(this.controlC.width()/this.$el.width())+'px'})
				this.scroll.addClass('vertical')
			}
			this.$el.append(this.scroll);
			if(this.$el.height()>this.controlC.height()){
				this.scroll_status = 2
				this.scroll.addClass('hide')
			}
			if(options['special']){
				this.scroll.addClass('hide')
				this.$el.hover(function(){
					if(self.$el.height()>self.controlC.height()){
						self.scroll_status = 2
						self.scroll.addClass('hide')
					}else{
						self.scroll.removeClass('hide')
					}
				},function(){
					self.scroll.addClass(
						'hide')
				})
			}
			this.$el.bind("mousewheel DOMMouseScroll",this.move_mouse);
			this.controlC.bind('mousewheel DOMMouseScroll',this.move_mouse)
			this.$el.bind('click',function(evt){
				evt.stopPropagation()
			})
		},
		move:function(evt){
			var evt = evt || window.event,
				self = this;
			if(this.type == 1){
				var y = evt.clientY-this.scroll.position()['top'];
			}else{
				var x = evt.clientX-this.scroll.position()['left'];
			}
			this.scroll.addClass('show')
			self.status = 0;
			document.onmousemove=function(evt){	
				var evt = evt || window.event;
				if(self.type == 1){
					var T = evt.clientY-y;
					if(T<0){
						T=0
					}else if(T>self.$el.height()-self.scroll.height()){
						T = self.$el.height()-self.scroll.height()
						if(self.status == 1) return 
						else{
							self.marginT  = (T / (self.$el.height()-self.scroll.height()))*(self.controlC.height()-self.$el.height())
							self.trigger('scrollHead')
							self.status = 1
						}
					}
					self.scroll.css({top:T+'px'})
					var soleL = T / (self.$el.height()-self.scroll.height())
					self.controlC.css({top: -soleL * (self.controlC.height()-self.$el.height())+'px'})
					self.trigger('change_type1',-soleL * (self.controlC.height()-self.$el.height())+'px')
				}else{
					var T = evt.clientX - x ;
					if(T<0){
						T = 0
					}else if(T>self.$el.width()-self.scroll.width()){
						T = self.$el.width()-self.scroll.width()
						if(self.status == 1) return 
						else{
							self.marginT  = (T / (self.$el.width()-self.scroll.width()))*(self.controlC.width()-self.$el.width())
							self.trigger('scrollHead')
							self.status = 1
						}
					}
					self.scroll.css({left:T+'px'})
					var soleL = T / (self.$el.width() - self.scroll.width());
					self.controlC.css({left: -soleL*(self.controlC.width()-self.$el.width())+'px'})
				}         
				evt.stopPropagation()
			}
			document.onmouseup=function(){
				self.scroll.removeClass('show')
				self.status = 0
				document.onmousemove = null;
				document.onmouseup = null;
				evt.stopPropagation()
			}
			evt.stopPropagation()
			return false
		},
		_init_scroll_c:function(){
			this.scroll_c = $('<div class="scroll_c"></div>')
			if(this.type == 1){
				this.scroll_c.css({width:'100%',height:this.controlC.height()/this.$el.height()+'px'})
			}else{
				this.scroll_c.css({height:'100%',width:this.controlC.width()/this.$el.width()+'px'})
			}
		},
		reset_scroll:function(data){
			if(this.$el.height()>=this.controlC.height()){
				this.scroll_status = 2
				this.scroll.addClass('hide')
			}else{
				this.scroll_status = 1
				this.scroll.removeClass('hide')
				if(data=='update'){
					if(this.type == 1){
						this.scroll.css({height:this.$el.height()/(this.controlC.height()/this.$el.height())+'px'})
						var top = (this.marginT/(this.controlC.height()-this.$el.height()))*(this.$el.height()-this.scroll.height())
						this.scroll.css({top:top+'px'})
					}else{
						this.scroll.css({width:this.$el.width()/(this.controlC.width()/this.$el.width())+'px'})
						var left = (this.marginT/(this.controlC.width()-this.$el.width()))*(this.$el.width()-this.scroll.width())
						this.scroll.css({left:left+'px'})
					}
				}else{
					if(this.type == 1){
						this.scroll.css({height:this.$el.height()/(this.controlC.height()/this.$el.height())+'px'})
						this.scroll.css({top:'0px'})
						this.controlC.css({top:'0px'})
					}else{
						this.scroll.css({width:this.$el.width()/(this.controlC.width()/this.$el.width())+'px'})
						this.scroll.css({left:'0px'})
					}
				}
			}
		},
		move_mouse:function(evt){
			if(this.scroll_status==2) return 
			var self = this;
			var ev = evt['originalEvent'] || event;
			var btn = true,T = 0 ;
			this.status = 0;
			if(this.type == 1){
				if(ev.detail){
					btn=ev.detail>0? true : false;
				}else{
					btn = ev.wheelDelta<0 ? true : false;
				}
				if(btn){
					T = parseInt(this.scroll.css("top"))+10
				}else{
					T = parseInt(this.scroll.css("top"))-10
				}
				if(T<0){
					T=0
				}else if(T>this.$el.height()-this.scroll.height()){
					T = this.$el.height()-this.scroll.height()
					if(this.status == 1) return 
					else{
						this.marginT  = (T / (this.$el.height()-this.scroll.height()))*(this.controlC.height()-this.$el.height())
						this.trigger('scrollHead')
						this.status = 1
					}
				}
				this.scroll.css({top:T+'px'})
				var soleL = T / (this.$el.height()-this.scroll.height())
				this.controlC.css({top: -soleL * (this.controlC.height()-this.$el.height())+'px'})
				self.trigger('change_type1',-soleL * (self.controlC.height()-self.$el.height())+'px')
				evt.stopPropagation()
				return false
			}
		}
	})

}(jQuery,window));

/*
 * Sonic 0.1
 * --
 * https://github.com/jamespadolsey/Sonic
 * --
 * This program is free software. It comes without any warranty, to
 * the extent permitted by applicable law. You can redistribute it
 * and/or modify it under the terms of the Do What The Fuck You Want
 * To Public License, Version 2, as published by Sam Hocevar. See
 * http://sam.zoy.org/wtfpl/COPYING for more details. */

(function(){
	var emptyFn = function(){};
	function Sonic(d) {
		this.data = d.path || d.data;
		this.imageData = [];
		this.multiplier = d.multiplier || 1;
		this.padding = d.padding || 0;
		this.fps = d.fps || 25;
		this.stepsPerFrame = ~~d.stepsPerFrame || 1;
		this.trailLength = d.trailLength || 1;
		this.pointDistance = d.pointDistance || .05;
		this.domClass = d.domClass || 'sonic';
		this.fillColor = d.fillColor || '#FFF';
		this.strokeColor = d.strokeColor || '#FFF';
		this.stepMethod = typeof d.step == 'string' ?stepMethods[d.step] :d.step || stepMethods.square;
		this._setup = d.setup || emptyFn;
		this._teardown = d.teardown || emptyFn;
		this._preStep = d.preStep || emptyFn;

		this.width = d.width;
		this.height = d.height;

		this.fullWidth = this.width + 2*this.padding;
		this.fullHeight = this.height + 2*this.padding;
		this.domClass = d.domClass || 'sonic';
		this.setup();
	}
	var argTypes = Sonic.argTypes = {DIM: 1,DEGREE: 2,RADIUS: 3,OTHER: 0};

	var argSignatures = Sonic.argSignatures = {
		arc: [1, 1, 3, 2, 2, 0],
		bezier: [1, 1, 1, 1, 1, 1, 1, 1],
		line: [1,1,1,1]
	};

	var pathMethods = Sonic.pathMethods = {
		bezier: function(t, p0x, p0y, p1x, p1y, c0x, c0y, c1x, c1y) {
		    t = 1-t;
		    var i = 1-t,x = t*t,y = i*i,a = x*t,b = 3 * x * i,c = 3 * t * y,d = y * i;
		    return [
		        a * p0x + b * c0x + c * c1x + d * p1x,
		        a * p0y + b * c0y + c * c1y + d * p1y
		    ]
		},
		arc: function(t, cx, cy, radius, start, end) {
		    var point = (end - start) * t + start;
		    var ret = [(Math.cos(point) * radius) + cx,(Math.sin(point) * radius) + cy];
		    ret.angle = point;
		    ret.t = t;
		    return ret;
		},
		line: function(t, sx, sy, ex, ey) {
			return [(ex - sx) * t + sx,(ey - sy) * t + sy]
		}
	};
	var stepMethods = Sonic.stepMethods = {
		square: function(point, i, f, color, alpha) {
			this._.fillRect(point.x - 3, point.y - 3, 6, 6);
		},
		fader: function(point, i, f, color, alpha) {
			this._.beginPath();
			if (this._last) {
				this._.moveTo(this._last.x, this._last.y);
			}
			this._.lineTo(point.x, point.y);
			this._.closePath();
			this._.stroke();
			this._last = point;
		}
	}
	Sonic.prototype = {
		setup: function() {
			var args,type,method,value,data = this.data;
			this.canvas = document.createElement('canvas');
			this._ = this.canvas.getContext('2d');
			this.canvas.className = this.domClass;
			this.canvas.height = this.fullHeight;
			this.canvas.width = this.fullWidth;
			this.points = [];
			for (var i = -1, l = data.length; ++i < l;) {
				args = data[i].slice(1);
				method = data[i][0];
				if (method in argSignatures) for (var a = -1, al = args.length; ++a < al;) {
					type = argSignatures[method][a];
					value = args[a];
					switch (type) {
						case argTypes.RADIUS:
							value *= this.multiplier;
							break;
						case argTypes.DIM:
							value *= this.multiplier;
							value += this.padding;
							break;
						case argTypes.DEGREE:
							value *= Math.PI/180;
							break;
					};
					args[a] = value;
				}
				args.unshift(0);
				for (var r, pd = this.pointDistance, t = pd; t <= 1; t += pd) {
					// Avoid crap like 0.15000000000000002
					t = Math.round(t*1/pd) / (1/pd);
					args[0] = t;
					r = pathMethods[method].apply(null, args);
					this.points.push({x: r[0],y: r[1],progress: t});
				}
			}
			this.frame = 0;
		},
		prep: function(frame) {
			if (frame in this.imageData) {return;}
			this._.clearRect(0, 0, this.fullWidth, this.fullHeight);
			var points = this.points,pointsLength = points.length,pd = this.pointDistance,
				point,index,indexD,frameD;
			this._setup();
			for (var i = -1, l = pointsLength*this.trailLength; ++i < l && !this.stopped;) {
				index = frame + i;
				point = points[index] || points[index - pointsLength];
				if (!point) continue;
				this.alpha = Math.round(1000*(i/(l-1)))/1000;
				this._.globalAlpha = this.alpha;
				this._.fillStyle = this.fillColor;
				this._.strokeStyle = this.strokeColor;
				frameD = frame/(this.points.length-1);
				indexD = i/(l-1);
				this._preStep(point, indexD, frameD);
				this.stepMethod(point, indexD, frameD);
			}
			this._teardown();
			this.imageData[frame] = (
				this._.getImageData(0, 0, this.fullWidth, this.fullWidth)
			);
			return true;
		},
		draw: function() {
			if (!this.prep(this.frame)) {
				this._.clearRect(0, 0, this.fullWidth, this.fullWidth);
				this._.putImageData(
					this.imageData[this.frame],
					0, 0
				);
			}
			this.iterateFrame();
		},
		iterateFrame: function() {
			this.frame += this.stepsPerFrame;
			if (this.frame >= this.points.length) {
				this.frame = 0;
			}
		},
		play: function() {
			this.stopped = false;
			var hoc = this;
			this.timer = setInterval(function(){
				hoc.draw();
			}, 1000 / this.fps);
		},
		stop: function() {
			this.stopped = true;
			this.timer && clearInterval(this.timer);
		}
	};
	window.Sonic = Sonic;
}());