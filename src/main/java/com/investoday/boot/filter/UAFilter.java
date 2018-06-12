package com.investoday.boot.filter;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.investoday.boot.util.AppUtil;
import com.investoday.boot.util.security.SecurityUtil;

/**
 * ua标识过滤器
 * 过滤逻辑：
 * 		ua作为系统的唯一标识，可以通过ua判断是否为多设备或者单一设备，如无ua参数，系统自动生成一个进行补充
 * @author liq
 * @date 2017年11月22日
 */
public class UAFilter implements Filter{

	@Override
	public void destroy() {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain)
			throws IOException, ServletException {
		HttpServletRequest request = (HttpServletRequest) servletRequest;
		HttpServletResponse response = (HttpServletResponse) servletResponse;
		HttpSession session = request.getSession();
		
		//header中的ua
		String headerUa = request.getHeader("UA");
		//参数中的ua
		String ua = request.getParameter("ua");
		//session中的ua
		String sessionUa = (String) session.getAttribute("ua");
		
		String url = "";
		//链接前部位
		StringBuffer urlLinkFront = request.getRequestURL();
		//链接参数部位
		String queryParam = request.getQueryString();
		if(queryParam != null){
			url = urlLinkFront.append("?").append(queryParam).toString();
		}else{
			url = urlLinkFront.toString();
		}
		
		//对html文件进行过滤
		if(url.contains(".html") && !url.contains("login")){
			if(ua == null){
				//链接不存在，从header或者session中获取
				Map<String, String> params = new HashMap<String, String>();
				String resultUrl = "";
				if(headerUa != null || sessionUa != null){
					String toUa = "";
					if(headerUa != null){
						toUa = headerUa;
					}else if(sessionUa != null){
						toUa = sessionUa;
					}
					params.put("ua", toUa);
					resultUrl = AppUtil.mergeUrlAndParam(url, params);
				}else{
					//两个都为null,系统生成
					String uaKey = SecurityUtil.SHA("invest" + System.currentTimeMillis());
					params.put("ua", uaKey);
					resultUrl = AppUtil.mergeUrlAndParam(url, params);
					//放入session中
					session.setAttribute("ua", uaKey);
				}
				//重定向
				response.sendRedirect(resultUrl);
				return;
			}else{
				//将链接的ua放入session中覆盖
				session.setAttribute("ua", ua);
				filterChain.doFilter(servletRequest, response);
				return;
			}
		}else{
			filterChain.doFilter(servletRequest, servletResponse);
			return;
		}
		
	}

	@Override
	public void init(FilterConfig arg0) throws ServletException {
		// TODO Auto-generated method stub
		
	}
	
}
