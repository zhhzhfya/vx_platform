function login_handler() {
	loginForm.getForm().submit({
				url : '../services/Login.ashx',
				method : 'post',
				waitMsg : "正在登录......",
				success : function(form, action) {
					var loginResult = action.result.success;
					if (loginResult === false) {
						Ext.Msg.alert('提示', action.result.msg);
					} else {
						if (loginResult === true) {
							window.location.href = 'Main.htm';
						}
					}
				},
				failure : function(form, action) {
					form.reset();
					// Ext.Msg.alter("失败");
					switch (action.failureType) {
						case Ext.form.Action.CLIENT_INVALID :
							Ext.Msg.alert("错误1", "提交的表单数据无效,请检查!");
							break;
						case Ext.form.Action.CONNECT_FAILURE :
							Ext.Msg.alert("错误2", "请求失败");
							break;
						case Ext.form.Action.SERVER_INVALID :
							// Ext.Msg.alert("Failure", action.result.msg);
							Ext.Msg.alert("账号或密码错误！", action.result.msg);
					}
				}
			});
}

var loginForm = new Ext.FormPanel({
			standardSubmit : true,
			url : 'MyJsp.jsp',
			renderTo : document.body,
			frame : true,
			title : '用户登陆',
			// bodyStyle:"padding:5px 5px 0",
			width : 400,
			items : [{
						xtype : 'fieldset',
						title : '用户登录',
						collapsible : true,
						autoHeight : true,
						defaultType : 'textfield',
						items : [{
									fieldLabel : '用户名',
									name : 'userName',
									width : 180,
									allowBlank : false,
									blankText : '用户名不能为空',
									minLength : 6,
									minLengthText : '用户名的长度为[6-20]',
									maxLength : 20,
									maxLengthText : '用户名的长度为[6-20]'
								}, {
									inputType : 'password',
									fieldLabel : '密 &nbsp; &nbsp;码',
									name : 'password',
									width : 180,
									allowBlank : false,
									blankText : '密码不能为空',
									minLength : 6,
									minLengthText : '密码的长度为[6-20]',
									maxLength : 20,
									maxLengthText : '密码的长度为[6-20]'
								}, {
									fieldLabel : '验证码',
									name : 'validate',
									width : 80,
									allowBlank : false,
									blankText : '验证码不能为空'
								}]
					}],
			buttons : [{
						text : '登录',
						type : 'button',
						handler : function() {
							if (!loginForm.getForm().isValid())
								return;

							loginForm.getForm().submit();

						}
					}]

		});

loginForm.render();
