package com.investoday.boot.util.token;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import java.security.Key;
import java.util.Date;

import javax.crypto.spec.SecretKeySpec;
import javax.xml.bind.DatatypeConverter;

/**
 * JWT Json Web Token
 * 
 * 构造JWT和解析JWT
 * @Description: TODO
 * @author 2016年7月19日 liq
 */
public class JwtHelper {
	
	/**
	 * 校验token是否正确
	 * @Medtod parseJWT
	 * @author 2016年7月19日 liq
	 * @param jsonWebToken
	 * @param base64Security
	 * @return
	 */
	public static Claims parseJWT(String jsonWebToken, String base64Security){
		Claims claims = Jwts
				.parser()
				.setSigningKey(
						DatatypeConverter.parseBase64Binary(base64Security))
				.parseClaimsJws(jsonWebToken).getBody();
		return claims;
	}
	
	/**
	 * 创建JWT
	 * @Medtod createJWT
	 * @author 2016年7月19日 liq
	 * @param userName 用户名
	 * @param password 密码
	 * @param app	来源
	 * @param role	角色名,默认app
	 * @param audience	接收JWT的用户
	 * @param issuer	签发JWT的用户
	 * @param TTLMillis	过期时间
	 * @param base64Security	base64密码
	 * @return
	 */
	public static String createJWT(String userName, String password, String app, String role,
			String audience, String issuer, long TTLMillis,
			String base64Security) {
		
		SignatureAlgorithm signatureAlgorithm = SignatureAlgorithm.HS256;

		long nowMillis = System.currentTimeMillis();
		Date now = new Date(nowMillis);
		
		//生成签名秘钥
		byte[] apiKeySecretBytes = DatatypeConverter.parseBase64Binary(base64Security);
		Key signingKey = new SecretKeySpec(apiKeySecretBytes, signatureAlgorithm.getJcaName());
		
		//添加并构建JWT的参数
		JwtBuilder builder = Jwts.builder().setHeaderParam("typ", "JWT")
				.claim("role", role)
				.claim("userName", userName)
				.claim("password", password)
				.claim("app", app)
				.setIssuer(issuer) 
				.setAudience(audience)
				.signWith(signatureAlgorithm, signingKey);
		
		//添加Token过期时间
		if(TTLMillis >= 0){
			long expMillis = nowMillis + TTLMillis;
			Date exp = new Date(expMillis);
			builder.setExpiration(exp).setNotBefore(now);
		}
		
		//生成JWT
		return builder.compact();
		
	}
	
	/**
	 * 创建token值
	 * @author liq
	 * @date 2017年11月23日
	 * @param userName
	 * @param password
	 * @param ttlMillis
	 * @param base64Security
	 * @return
	 */
	public static String createJWTN(String userName, String password, long ttlMillis, String base64Security){
		SignatureAlgorithm signatureAlgorithm = SignatureAlgorithm.HS256;

		long nowMillis = System.currentTimeMillis();
		Date now = new Date(nowMillis);
		
		//生成签名秘钥
		byte[] apiKeySecretBytes = DatatypeConverter.parseBase64Binary(base64Security);
		Key signingKey = new SecretKeySpec(apiKeySecretBytes, signatureAlgorithm.getJcaName());
		
		//添加并构建JWT的参数
		JwtBuilder builder = Jwts.builder().setHeaderParam("typ", "JWT")
				.claim("userName", userName)
				.claim("password", password)
				.signWith(signatureAlgorithm, signingKey);
		
		//添加Token过期时间
		if(ttlMillis >= 0){
			long expMillis = nowMillis + ttlMillis;
			Date exp = new Date(expMillis);
			builder.setExpiration(exp).setNotBefore(now);
		}
		
		//生成JWT
		return builder.compact();
	}
	
}
