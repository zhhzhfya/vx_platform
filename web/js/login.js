function login() {
	Ext.QuickTips.init();
	// Ext.Msg.alert("系统提示","login.js is here");
	var loginForm = new Ext.form.FormPanel({
		id: 'loginForm',
		baseCls: 'x-plain',
		plain: true,
		defaults: {
			anchor: '95%'
		},
		defaultType: 'textfield',
		items: [{
			id: 'userNo',
			name: 'userNo',
			fieldLabel: '用户名',
			blankText: "用户名不能为空!",
			allowBlank: false
		}, {
			id: 'password',
			name: 'password',
			fieldLabel: '密&nbsp;&nbsp;&nbsp;码',
			inputType: 'password',
			blankText: "密码不能为空!",
			allowBlank: false
		}]
	});
	var loginWin = new Ext.Window({
		title: '系统登录页面',
		width: 300,
		height: 140,
		items: loginForm,
		plain: true,
		closable: false,
		bodyStyle: 'padding:5px;',
		buttonAlign: 'center',
		layout: 'fit',
		buttons: [{
			text: '登录',
			handler: submitForm
		}, {
			text: '重置',
			handler: resetForm
		}],
		listeners: {
			'show': function() {
				this.findByType('textfield')[0].focus(true, true); // 第一个textfield获得焦点
			}
		}
	});

	function submitForm() {
		//alert("submit...");
		var form = Ext.getCmp("loginForm").getForm();
		if (form.isValid()) {
			//alert("isvalid");
			form.submit({
				url: 'login.do?method=login',
				method: 'POST',
				success: function(form, action) {
					var isSucc = action.result.success;
					if (isSucc) {

						var forward = action.result.data;
						//alert(forward);
						window.location.href = forward;
					} else {

						Ext.Msg.alert("系统提示", "用户登录失败");
					}
				},
				failure: function(form, action) {
					Ext.Msg.alert("系统提示", "用户登录失败");
				}

			});
		}
	}

	function resetForm() {
		alert("reset...");
		Ext.getCmp("loginForm").getForm().reset();
	}
	loginWin.show();

}
Ext.onReady(function() {
	login();
	cv['eb'].registerHandler("hd.core.server.info", function(msg, replyTo) {
		//console.log(msg);
	});


	var data = [{
		name: 'Jul 07',
		visits: 3,
		views: 12
	}, {
		name: 'Aug 07',
		visits: 34,
		views: 12
	}, {
		name: 'Sep 07',
		visits: 13,
		views: 35
	}, {
		name: 'Oct 07',
		visits: 14,
		views: 16
	}, {
		name: 'Nov 07',
		visits: 15,
		views: 62
	}, {
		name: 'Dec 07',
		visits: 16,
		views: 12
	}, {
		name: 'Jan 08',
		visits: 17,
		views: 13
	}, {
		name: 'Feb 08',
		visits: 18,
		views: 11
	}]
	var store = new Ext.data.Store({
		proxy: new Ext.data.MemoryProxy(data),
		reader: new Ext.data.JsonReader({}, [{
			name: 'name'
		}, {
			name: 'visits',
			type: 'float'
		}, {
			name: 'views',
			type: 'float'
		}])
	});
	store.load();
	// extra extra simple         
	new Ext.Panel({
		title: 'ExtJS.com Visits Trend',
		applyTo: document.body,
		width: 500,
		height: 300,
		layout: 'fit',
		items: {
			xtype: 'linechart',
			store: store,
			xField: 'name',
			listeners: {
				itemclick: function(o) {
					var rec = store.getAt(o.index);
					Ext.example.msg('Item Selected', 'You chose {0}.', rec.get('name'));
				}
			},
			series: [{ //列                       
				type: 'line', //类型可以改变（线）                       
				displayName: 'Visits',
				yField: 'visits',
				style: {
					color: 0xE1E100
				}
			}]
		}
	});



});