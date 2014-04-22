function login() {
	Ext.QuickTips.init();
	var loginForm = Ext.create('Ext.form.Panel', temp);
	var loginWin = Ext.create('widget.window', {
		autoHeight: true,
		width: 300,
		title: '用户登录',
		closable: false,
		plain: true,
		layout: 'fit',
		items: [loginForm],
		buttons: [{
			text: '登录',
			type: 'submit',
			handler: function() {}
		}, {
			text: '重置',
			type: 'reset',
			handler: function() {
				this.up('form').getForm().reset();
			}
		}]
	});
	loginWin.center().show();

}
// 需要什么资源
Ext.require([
	'Ext.window.Window',
	'Ext.form.*',
	'Ext.toolbar.Spacer',
	'Ext.layout.container.Card',
	'Ext.layout.container.Border'
]);
Ext.onReady(function() {
	// 加载表单的模版、json数据 动态构建
	login();
	cv['eb'].registerHandler("hd.core.server.info", function(msg, replyTo) {
		//console.log(msg);
	});
});