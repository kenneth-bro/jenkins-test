package com.investoday.boot.controller;

import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.investoday.boot.util.auth.AuthUtil;
import com.investoday.boot.util.request.Request;

@Controller
@RequestMapping(value = "/request", method = {RequestMethod.GET, RequestMethod.POST}, produces = {"application/json;charset=UTF-8"})
public class RequestUrlController {
	//安全方式，一般使用http
	@Value("${app.prop.apigatewayHttpMethod:http}")
	public String httpMethod;
	
	//请求方式，一般使用POST请求
	@Value("${app.prop.apigatewayRequestMethod:GET}")
	public String requestMethod;
	
	//网关IP
	@Value("${app.prop.apigatewayIp}")
	public String apigatewayIp;
	
	//网关端口
	@Value("${app.prop.apigatewayPort}")
	public String apigatewayPort;
	

	/**
	 * 请求网关Api地址，并将数据返回
	 * page参数作为请求地址的部分URL，并拼接对应的IP和端口
	 * 其它参数构造成正常参数发送
	 * @param request
	 * @return
	 */
	@RequestMapping("/api")
	@ResponseBody
	public String requestApi(HttpServletRequest request, HttpSession session){
		String uri = request.getParameter("page");
		//请求方式
		String requestType = request.getParameter("requestType");
		String result = "";
		if(uri != null){
			Map<String, String> params = new HashMap<String, String>();
			//整合发送参数
			Enumeration<String> keys =  request.getParameterNames();
			while(keys.hasMoreElements()){
				String key = keys.nextElement();
				if(!"page".equals(key) && !"requestType".equals(key)){
					params.put(key, request.getParameter(key));
				}
			}
			
			//发送数据
			if(requestType != null && !"".equals(requestType)){
				if("get".equalsIgnoreCase(requestType)){
					result = Request.requestGet(httpMethod + "://" + apigatewayIp + ":" + apigatewayPort + uri, params);
				}else if("post".equalsIgnoreCase(requestType)){
					result = Request.requestPost(httpMethod + "://" + apigatewayIp + ":" + apigatewayPort + uri, params);
				}else{
					if("GET".equals(requestMethod)){
						result = Request.requestGet(httpMethod + "://" + apigatewayIp + ":" + apigatewayPort + uri, params);
					}else{
						result = Request.requestPost(httpMethod + "://" + apigatewayIp + ":" + apigatewayPort + uri, params);
					}
				}
			}else{
				if("GET".equals(requestMethod)){
					result = Request.requestGet(httpMethod + "://" + apigatewayIp + ":" + apigatewayPort + uri, params);
				}else{
					result = Request.requestPost(httpMethod + "://" + apigatewayIp + ":" + apigatewayPort + uri, params);
				}
			}
		}
		return result;
	}
	
	/**
	 * 请求外部网络地址获取数据
	 * page参数作为请求地址的全部URL
	 * 其他参数构造正常参数发送
	 * @param request
	 * @return
	 */
	@RequestMapping("/extra")
	@ResponseBody
	public String requestExtraUrl(HttpServletRequest request, HttpSession session){
		String url = request.getParameter("page");
		String result = "";
		if(url != null){
			Map<String, String> params = new HashMap<String, String>();
			//整合发送参数
			Enumeration<String> keys =  request.getParameterNames();
			while(keys.hasMoreElements()){
				String key = keys.nextElement();
				if(!"page".equals(key)){
					params.put(key, request.getParameter(key));
				}
			}
			
			//发送数据
			if("GET".equals(requestMethod)){
				result = Request.requestGet(url, params);
			}else{
				result = Request.requestPost(url, params);
			}
		}
		return result;
	}
}
