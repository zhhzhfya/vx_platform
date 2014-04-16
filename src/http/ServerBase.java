package http;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.LinkOption;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Scanner;

import org.vertx.java.core.AsyncResult;
import org.vertx.java.core.Handler;
import org.vertx.java.core.json.JsonArray;
import org.vertx.java.core.json.JsonObject;
import org.vertx.java.core.logging.Logger;
import org.vertx.java.platform.Verticle;

import frame.MainFrame;

public class ServerBase extends Verticle {
	HashMap<String, String> modules = new HashMap<String, String>();

	public void start() {
		final Logger logger = container.logger();
		JsonObject appConfig = container.config();
		JsonArray deployModules = appConfig.getArray("deploy_modules");
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
		MainFrame frame = new MainFrame(vertx.eventBus());
		frame.setVisible(true);
	}
}
