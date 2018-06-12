package com.investoday.boot.util.request;

import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.Map;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * 请求工具类
 * @author liq
 *
 */
public class AppRquestUtil {
	//日志
	private static Logger logger = LoggerFactory.getLogger(AppRquestUtil.class);
	/**
	 * 将对象转换为JSON字符数据
	 * @param obj
	 * @return
	 */
	public static String Object2Json(Object obj){
		if(obj == null){
			return null;
		}
		String result = null;
		try {
			ObjectMapper objectMapper = new ObjectMapper();
			//设置时间格式
			objectMapper.setDateFormat(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"));
			result = objectMapper.writeValueAsString(obj);
		} catch (Exception e) {
			logger.error("[Jackson] Object2Json error ", e);
		}
		return result;
	}
	
	/**
	 * URL参数编码 GET
	 * 编码：默认
	 * 注：Java只针对参数进行编码
	 * @param url
	 * @return
	 */
	public static String urlEncode(String url){
		String result = url;
		if(url != null && !"".equals(url)){
			if(url.contains("?")){
				int markIndex  = url.indexOf("?");
				String urlPart1 = url.substring(0, markIndex + 1);
				String urlPart2 = url.substring(markIndex + 1, url.length());
				//参数分隔
				String encodeUrlPart2 = "";
				if(urlPart2.contains("&")){
					//多个参数
					String[] params = urlPart2.split("&");
					for(int i=0; i < params.length; i++){
						//使用索引第一个等号
						String param = params[i];
						String key = param.substring(0, param.indexOf("="));
						String value = param.substring(param.indexOf("=") + 1, param.length());
						//编码
						value = URLEncoder.encode(value);
						if(i == 0){
							encodeUrlPart2 += key + "=" + value;
						}else{
							encodeUrlPart2 += "&" + key + "=" + value;
						}
					}
				}else{
					//单个参数
					String key = urlPart2.substring(0, urlPart2.indexOf("="));
					String value = urlPart2.substring(urlPart2.indexOf("=") + 1, urlPart2.length());
					encodeUrlPart2 = key + "=" + value;
				}
				result = urlPart1 + encodeUrlPart2;
			}
		}
		return result;
	}
	
	/**
	 * URL参数编码 POST
	 * 编码：默认
	 * 注：Java只针对参数进行编码
	 * @param params
	 * @return
	 */
	public static void urlEncode(Map<String, String> params){
		if(params != null){
			Set<String> keys = params.keySet();
			for (String key : keys) {
				String value = params.get(key);
				params.put(key, URLEncoder.encode(value));
			}
		}
	}
}
