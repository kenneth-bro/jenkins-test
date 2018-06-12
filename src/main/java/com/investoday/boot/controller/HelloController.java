package com.investoday.boot.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class HelloController {

	//到主页
	@RequestMapping(value = "/")
	public String toIndex(HttpServletRequest request){
		return "redirect:/mindex.html";
	}
}
