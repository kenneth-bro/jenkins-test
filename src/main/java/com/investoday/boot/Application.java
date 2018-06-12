package com.investoday.boot;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.ServletComponentScan;
import org.springframework.boot.web.support.SpringBootServletInitializer;

//扫描Servlet注解
@ServletComponentScan
@SpringBootApplication
public class Application extends SpringBootServletInitializer{
	
	@Override
	protected SpringApplicationBuilder configure(
			SpringApplicationBuilder application) {
		return application.sources(Application.class);
	}
	
	public static void main(String[] args) {
		System.setProperty("file.encoding", "UTF-8");
		new SpringApplicationBuilder(Application.class).web(true).run(args);
	}
}
