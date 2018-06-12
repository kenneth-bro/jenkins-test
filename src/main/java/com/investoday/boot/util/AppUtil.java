package com.investoday.boot.util;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.ByteBuffer;
import java.nio.channels.Channels;
import java.nio.channels.ReadableByteChannel;
import java.nio.channels.WritableByteChannel;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;

import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.params.CoreConnectionPNames;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.investoday.boot.util.aliyun.api.gateway.constant.Constants;
import com.investoday.boot.util.aliyun.api.gateway.constant.ContentType;
import com.investoday.boot.util.security.SecurityUtil;

/**
 * 工具
 * @author liq
 * @date 2017年11月22日
 */
public class AppUtil {
	//日志
	private static Logger logger = LoggerFactory.getLogger(AppUtil.class);

	/**
	 * 合并链接和参数
	 * @author liq
	 * @date 2017年11月22日
	 * @param url
	 * @param params
	 * @return
	 */
	public static String mergeUrlAndParam(String url, Map<String, String> params){
		Set<String> keys = params.keySet();
		for(String key : keys){
			String value = params.get(key);
			if(url != null && url.contains("?")){
				url += "&" + key + "=" + value;
			}else if(url != null && !url.contains("?")){
				url += "?" + key + "=" + value;
			}else{
				
			}
		}
		return url;
	}
	
	/**
	 * 获取请求者的IP地址
	 * @author liq
	 * @date 2017年11月22日
	 * @param request
	 * @return
	 */
	public static String getRequestIp(HttpServletRequest request){
		String ip = request.getHeader("x-forwarded-for");
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getHeader("Proxy-Client-IP");
		}
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getHeader("WL-Proxy-Client-IP");
		}
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getRemoteAddr();
		}
		return ip;
	}
	
	/**
     * 拼接所有的参数
     * 接收返回字符串 是get的拼接参数
     * 直接使用resultMap 是参数集合
     * @Medtod spliceParams
     * @author 2016年8月16日 liq
     * @param request
     * @return
     */
    public static String spliceParams(HttpServletRequest request, Map<String, String> extraParam, Map<String, String> resultMap){
    	String paramStr = "";
    	Enumeration<String> keys = request.getParameterNames();
    	while(keys.hasMoreElements()){
    		String key = keys.nextElement();
    		String value = request.getParameter(key);
    		resultMap.put(key, value);
    	}
    	
    	//添加额外的参数
    	if(extraParam != null && extraParam.size() > 0){
    		Set<String> extraKeys = extraParam.keySet();
    		for (String key : extraKeys) {
				String value = extraParam.get(key);
				resultMap.put(key, value);
			}
    	}
    	
    	//进行一遍数据处理
    	Set<String> hanldleKeys =  resultMap.keySet();
    	for (String handleKey : hanldleKeys) {
			String handleValue = resultMap.get(handleKey);
			if("accessURL".equals(handleKey) || "lastURL".equals(handleKey) || "pvObj".equals(handleKey)){
				//对链接的参数进行Base64加密
				resultMap.put(handleKey, encodeCharByBase64(handleValue));
			}
		}
    	
    	if(resultMap.size() > 0){
    		Set<String> mapKeys = resultMap.keySet();
        	for (String key : mapKeys) {
    			String value = resultMap.get(key);
    			//格式化值
    			try {
    				//二次编码
    				value = URLEncoder.encode(URLEncoder.encode(value, "UTF-8"), "UTF-8");
				} catch (Exception e) {
					e.printStackTrace();
				}
    			
    			paramStr += "&" + key + "=" + value;
    		}
        	
        	//去掉第一个&
        	paramStr = paramStr.substring(paramStr.indexOf("&") + 1, paramStr.length());
        	
        	paramStr = "?" + paramStr;
    	}
    	
    	return paramStr;
    }
    
    /**
     * 对参数进行Base64加密并替换=为统一特殊字符
     * @Medtod encodeCharByBase64
     * @author 2016年9月5日 liq
     * @param str
     * @return
     */
    public static String encodeCharByBase64(String str){
    	String encodeStr = SecurityUtil.encodeBase64(str);
    	encodeStr = encodeStr.replaceAll("=", "!");
    	return encodeStr;
    }
    
    /**
     * 请求链接并返回结果
     * @Medtod requestPostURL
     * @author 2016年9月5日 liq
     * @param url
     * @param formData
     * @return
     */
    public static String requestPostURL(String url, Map<String, String> formData){
    	try {
    		HttpClient httpClient = new DefaultHttpClient();
        	httpClient.getParams().setParameter(CoreConnectionPNames.CONNECTION_TIMEOUT, 30000);
        	HttpPost post = new HttpPost(url);
        	
        	UrlEncodedFormEntity formEntity = buildFormEntity(formData);
        	if(formEntity != null){
        		post.setEntity(formEntity);
        	}
        	HttpResponse response =  httpClient.execute(post);
        	String result = getResult(response);
        	return result;
		} catch (Exception e) {
			logger.error("日志请求:POST失败", e);
			return null;
		}
    	
    }
    
    /**
     * 构建FormEntity
     * @param formParam
     * @return
     * @throws UnsupportedEncodingException
     */
    private static UrlEncodedFormEntity buildFormEntity(Map<String, String> formParam) throws UnsupportedEncodingException {
        if (formParam != null) {
            List<NameValuePair> nameValuePairList = new ArrayList<NameValuePair>();

            for (String key : formParam.keySet()) {
                nameValuePairList.add(new BasicNameValuePair(key, formParam.get(key)));
            }
            UrlEncodedFormEntity formEntity = new UrlEncodedFormEntity(nameValuePairList);
            formEntity.setContentType(ContentType.CONTENT_TYPE_FORM);
            return formEntity;
        }

        return null;
    }
    
    /**
     * 提取结果
     * @Medtod getResult
     * @author 2016年4月27日 liq
     * @param response
     * @return
     * @throws IllegalStateException
     * @throws IOException
     */
    public static String getResult(HttpResponse response) throws IllegalStateException, IOException{
    	return readStreamAsStr(response.getEntity().getContent()).trim();
    }
    
    /**
     * 将流转换为字符串
     *
     * @param is
     * @return
     * @throws IOException
     */
    public static String readStreamAsStr(InputStream is) throws IOException {
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        WritableByteChannel dest = Channels.newChannel(bos);
        ReadableByteChannel src = Channels.newChannel(is);
        ByteBuffer bb = ByteBuffer.allocate(4096);

        while (src.read(bb) != -1) {
            bb.flip();
            dest.write(bb);
            bb.clear();
        }
        src.close();
        dest.close();
        return new String(bos.toByteArray(), Constants.ENCODING);
    }
	
}
