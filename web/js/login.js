	var cpuLoadStore = Ext.create('store.json', {
		fields: ['core1', 'core2', 'time']
	});

	function login() {
		Ext.QuickTips.init();
		//var loginForm = Ext.create('Ext.form.Panel', temp);

		var generateCpuLoad = function() {
			var me = this,data = [];

			if (data.length === 0) {
				data.push({
					core1: 0,
					core2: 0,
					time: 0
				});

				cpuLoadStore.loadData(data);
			} else {
				cpuLoadStore.data.removeAt(0);
				cpuLoadStore.data.each(function(item, key) {
					item.data.time = key;
				});

				var lastData = cpuLoadStore.last().data;
				cpuLoadStore.loadData([{
					core1: generate(lastData.core1),
					core2: generate(lastData.core2),
					time: lastData.time + 1
				}], true);
			}

		}
		var createCpu1LoadChart = function() {
			return {
				flex: 1,
				xtype: 'chart',
				theme: 'Category1',
				animate: false,
				store: cpuLoadStore,
				legend: {
					position: 'bottom'
				},
				axes: [{
					type: 'Numeric',
					position: 'left',
					minimum: 0,
					maximum: 20,
					fields: ['core1'],
					title: 'CPU Load',
					grid: true,
					labelTitle: {
						font: '13px Arial'
					},
					label: {
						font: '11px Arial'
					}
				}],
				series: [{
					title: 'Core 1 (3.4GHz)',
					type: 'line',
					lineWidth: 4,
					showMarkers: false,
					fill: true,
					axis: 'left',
					xField: 'time',
					yField: 'core1',
					style: {
						'stroke-width': 1
					}
				}]
			};
		};
		var loginWin = Ext.create('widget.window', {
			autoHeight: true,
			width: 480,
			height: 370,
			title: '用户登录',
			closable: false,
			plain: true,
			maximizable : true,
			layout: 'fit',
			items: [createCpu1LoadChart()],
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
		generateCpuLoad();
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
		var t = 0;
		cv['eb'].registerHandler("hd.core.server.info", function(msg, replyTo) {
			if (cpuLoadStore.data.length == 20) {
				cpuLoadStore.data.removeAt(0);
			};

			cpuLoadStore.data.each(function(item, key) {
				item.data.time = key;
			});

			var lastData = cpuLoadStore.last().data;
			cpuLoadStore.loadData([{
				core1: parseInt(msg['free']),
				core2: parseInt(msg['total']),
				time: lastData.time + 1
			}], true);
		});
	});