package http;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.HashMap;

import org.vertx.java.core.AsyncResult;
import org.vertx.java.core.Handler;
import org.vertx.java.core.eventbus.Message;
import org.vertx.java.core.json.JsonArray;
import org.vertx.java.core.json.JsonObject;
import org.vertx.java.core.logging.Logger;
import org.vertx.java.platform.Verticle;

import com.fasterxml.jackson.core.JsonFactory;
import com.hd.PingVerticle;

import frame.MainFrame;

public class ServerBase extends Verticle {
	HashMap<String, String> modules = new HashMap<String, String>();

	public void start() {
		final Logger logger = container.logger();
		JsonObject appConfig = container.config();
		JsonArray deployModules = appConfig.getArray("deploy_modules");
		// 发布模块
		deployModules(logger, deployModules);
		// 一共监控界面
		MainFrame frame = new MainFrame(vertx.eventBus());
		frame.setVisible(true);
		container.deployVerticle(PingVerticle.class.getName());
		
		try {
			Thread.sleep(200);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		BufferedReader reader = null;
		try {
			File file = new File("E:\\work\\workspace_vertx\\vx_platform.git\\zips.json0");
			reader = new BufferedReader(new FileReader(file));
			String tempString = null;
			while ((tempString = reader.readLine()) != null) {
				JsonObject m = new JsonObject();
				m.putString("action", "save");
				m.putString("collection", "mydb");
				m.putObject("document", new JsonObject(tempString));
				vertx.eventBus().send("hd.mgo", m, new Handler<Message<JsonObject>>() {
					@Override
					public void handle(Message<JsonObject> event) {
						System.out.println(event.body().toString());
					}
				});
			}
			reader.close();
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (reader != null) {
				try {
					reader.close();
				} catch (IOException e1) {
				}
			}
		}
	}

	private void deployModules(final Logger logger, JsonArray deployModules) {
		for (int i = 0; i < deployModules.size(); i++) {
			JsonObject module = deployModules.get(i);
			JsonObject config = module.getObject("config", new JsonObject());
			final String moduleName = (module).getString("moduleName", "");
			int num = (module).getInteger("num", 1);
			if (!moduleName.equals("")) {
				container.deployModule(moduleName, config, num, new Handler<AsyncResult<String>>() {
					@Override
					public void handle(AsyncResult<String> event) {
						if (event.failed()) {
							logger.info(event.cause().getMessage());
							logger.error("加载" + moduleName + "异常" + event.cause().getLocalizedMessage());
						} else {
							logger.info("发布成功:" + moduleName + ", id:" + event.result());
							modules.put(moduleName, event.result());
						}
					}
				});
			}
		}
	}

	public static void readFileByLines(String fileName) {
		File file = new File(fileName);
		BufferedReader reader = null;
		try {
			System.out.println("以行为单位读取文件内容，一次读一行");
			reader = new BufferedReader(new FileReader(file));
			String tempString = null;
			int line = 1;
			// 一次读一行，读入null时文件结束
			while ((tempString = reader.readLine()) != null) {
				// 把当前行号显示出来
				System.out.println("line " + line + ": " + tempString);
				line++;
			}
			reader.close();
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (reader != null) {
				try {
					reader.close();
				} catch (IOException e1) {
				}
			}
		}
	}

}
