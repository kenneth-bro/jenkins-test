package com.investoday.boot.util.security;

import java.io.UnsupportedEncodingException;
import java.math.BigInteger;
import java.security.MessageDigest;

import sun.misc.BASE64Decoder;
import sun.misc.BASE64Encoder;

/**
 * 安全类
 * @Description: TODO
 * @author 2016年7月19日 liq
 */
public class SecurityUtil {
	
	private static final String CHAR = "UTF-8";
	
	private static final String KEY_SHA="SHA";
	
	private static final String KEY_MD5="MD5";
	
	/**
	 * MD5加密
	 * @Medtod MD5
	 * @author 2016年7月19日 liq
	 * @param s
	 * @return
	 */
	public final static String MD5(String s) {
		char hexDigits[] = { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
				'A', 'B', 'C', 'D', 'E', 'F' };

		try {
			byte[] btInput = s.getBytes();
			// 获得MD5摘要算法的 MessageDigest 对象
			MessageDigest mdInst = MessageDigest.getInstance("MD5");
			// 使用指定的字节更新摘要
			mdInst.update(btInput);
			// 获得密文
			byte[] md = mdInst.digest();
			// 把密文转换成十六进制的字符串形式
			int j = md.length;
			char str[] = new char[j * 2];
			int k = 0;
			for (int i = 0; i < j; i++) {
				byte byte0 = md[i];
				str[k++] = hexDigits[byte0 >>> 4 & 0xf];
				str[k++] = hexDigits[byte0 & 0xf];
			}
			return new String(str);
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}
	
	/**
	 * SHA加密算法
	 * @Medtod SHA
	 * @author 2016年8月5日 liq
	 * @param s
	 * @return
	 */
	public static String SHA(String s){
		try {
			BigInteger sha = new BigInteger(encryptSHA(s.getBytes()));
			return sha.toString(32);
		} catch (Exception e) {
			return null;
		}
	}
	
	/**
	 * Base64加密 字符串
	 * @Medtod getBase64
	 * @author 2016年7月19日 liq
	 * @param str
	 * @return
	 */
	public static String encodeBase64(String str){
		byte[] b = null;
		String s = null;
		try {
			b = str.getBytes(CHAR);
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		if (b != null) {
			s = new BASE64Encoder().encode(b);
		}
		return s;
	}
	
	/**
	 * Base64 解密 字符串
	 * @Medtod decodeBase64
	 * @author 2016年7月19日 liq
	 * @param s
	 * @return
	 */
	public static String decodeBase64(String s){
		byte[] b = null;
		String result = null;
		if (s != null) {
			BASE64Decoder decoder = new BASE64Decoder();
			try {
				b = decoder.decodeBuffer(s);
				result = new String(b, CHAR);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		return result;
	}
	
	/**
	 * BASE64解密 
	 * 参数 字符串
	 * 结果 字节数组
	 * @Medtod decryptBASE64
	 * @author 2016年7月28日 liq
	 * @param key
	 * @return
	 * @throws Exception
	 */
	public static byte[] decryptBASE64(String key) throws Exception{
		return (new BASE64Decoder()).decodeBuffer(key);
	}
	
	/**
	 * BASE64加密 
	 * 参数 字节数组
	 * 结果 字符串
	 * @Medtod encryptBASE64
	 * @author 2016年7月28日 liq
	 * @param key
	 * @return
	 * @throws Exception
	 */
	public static String encryptBASE64(byte[] key)throws Exception{
		return (new BASE64Encoder()).encodeBuffer(key);
	}
	
	/**
	 * MD5加密
	 * 参数 字节数组
	 * 结果 字节数组
	 * @param data
	 * @return
	 * @throws Exception
	 */
	public static byte[] encryptMD5(byte[] data)throws Exception{
		MessageDigest md5 = MessageDigest.getInstance(KEY_MD5);
		md5.update(data);
		return md5.digest();
	}
	
	/**
	 * SHA加密
	 * 参数 字节数组
	 * 结果 字节数组
	 * @param data
	 * @return
	 * @throws Exception
	 */
	public static byte[] encryptSHA(byte[] data)throws Exception{
		MessageDigest sha = MessageDigest.getInstance(KEY_SHA);
		sha.update(data);
		return sha.digest();
	}
	
	
	public static void main(String[] args) {
		System.out.println(encodeBase64("hrsec|bearer|hrsec"));
	}
	
}
