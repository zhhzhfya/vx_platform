var cv = {
	message_services: {},
	translateEvent: function(message) {
		if (message['acts'] && message['acts'].length > 0) {
			jQuery.each(message['acts'], function(i, msg) {
				// 消息类型，js服务注册、加载资源（同步、异步）渲染+数据、更新数据、初始化参数、消息里包含多个处理
				// 执行消息:模版、数据、控制、业务DNA 表单的消息. act:,load_res,form,update_datas,char,,,,,,,,,,,,,,,,,,,,
				if (msg['act'] == 'service_reg') {
					//load_res,aaa
					var services = msg['services'].split(';');
					$.each(services, function(i, ser) {
						try {
							var ss = ser.split(',');
							if (typeof eval(ss[1]) == 'function') {
								cv.message_services[ss[0]] = eval(ss[1]);
							}
						} catch (e) {}
					});
				}
				if (msg['act'] == 'load_res') {
					var ress = new Array();
					// 加载资源
					jQuery.each(msg['resources'], function(i, res) {
						ress[i] = res['mod'];
						In.add(res['mod'], res);
						//In(res['mod'], function() {});
					});
					In.use.apply(this, ress);
				}
				if (cv.message_services[msg['act']] && typeof cv.message_services[msg['act']] == 'function') {
					// 把消息交给这个js函数处理
					cv.message_services[msg['act']].apply(this, msg);
				}
			});
		}
	},
	doLogin: function() {
		// 如果没有连接，连接并发送登录消息
		if (!cv['connect']) {
			In.add('sockjs', {
				path: 'js/util/sockjs-0.3.4.js',
				type: 'js',
				charset: 'utf-8'
			});
			In.add('vertxbus', {
				path: 'js/util/vertxbus-2.1.js',
				type: 'js',
				charset: 'utf-8'
			});
			In.add('jquery', {
				path: 'js/util/jquery-1.7.1.min.js',
				type: 'js',
				charset: 'utf-8'
			});
			In('sockjs', 'vertxbus', 'jquery', function() {
				if (!cv['eb']) {
					cv['eb'] = new vertx.EventBus("/eventbus");
					cv['eb'].onopen = function() {
						cv['connect'] = true;
						// 进行登录，发送登录消息
						cv['eb'].send("hd.core", {
							"act": "login"
						}, function(msg, replyTo) {
							// 消息分发
							cv.translateEvent(msg);
						});
					};
					cv['eb'].onclose = function() {
						cv['eb'] = null;
					};
				}
			});
		}
	}
};
// 资源按顺序加载
In.config('serial', true);
In.ready(function() {
	cv.doLogin();
});