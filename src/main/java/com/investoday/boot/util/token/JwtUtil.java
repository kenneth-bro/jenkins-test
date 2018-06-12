package com.investoday.boot.util.token;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.investoday.boot.util.token.entity.AccessToken;
import com.investoday.boot.util.token.entity.TokenAuth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;

/**
 * JWT Token生成
 * @author liq
 * @date 2017年11月22日
 */
public class JwtUtil {
	//日志
	private static Logger logger = LoggerFactory.getLogger(JwtUtil.class);
	
	//头部header
	private static final String TOKEN_HEADER = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9";
	
	//payload 和 secert 分隔符
	private static final String TOKEN_SPLIT = "-";
	
	/**
	 * 生成token值
	 * @author liq
	 * @date 2017年11月22日
	 * @param username 用户名
	 * @param password 密码
	 * @param source 来源
	 * @param expire 过期时间
	 * @param security 秘钥
	 * @return
	 */
	public static AccessToken createToken(String userName, String password, long expire, String security){
		//过期时长,默认 1小时
		long expireIn = 60 * 60 * 1000;
		if(expire != 0){
			expireIn = expire;
		}
		//生成token
		AccessToken token = new AccessToken();
		try {
			String accessToken = JwtHelper.createJWTN(userName, password, expireIn, security);
			//进行header、payload、signature的拆分
			String[] accessTokens = accessToken.split("\\.");
			//重新生成token值
			String tokenStr = accessTokens[1] + TOKEN_SPLIT + accessTokens[2];
			
			token.setAccessToken(tokenStr);
			token.setExpireIn(expireIn);
//			token.setTokenType("bearer");
		} catch (Exception e) {
			logger.error("[token] token 生成 error.", e);
		}
		return token;
	}
	
	/**
	 * 核对token值是否正确或者是否已过期
	 * @author liq
	 * @date 2017年11月22日
	 * @param token
	 * @param username
	 * @param security
	 * @return
	 */
	public static TokenAuth authToken(String token, String security){
		TokenAuth tokenAuth = new TokenAuth();
		try {
			//重新整合token
			token = token.replaceFirst(TOKEN_SPLIT, ".");
			token = TOKEN_HEADER + "." + token;
			Claims claim = JwtHelper.parseJWT(token, security);
			String username = (String) claim.get("userName");
			tokenAuth.setUserName(username);
			tokenAuth.setValid(true);
			tokenAuth.setAuthMessage("符合预期的有效范围内.");
		} catch (ExpiredJwtException e) {
			logger.error("[token] token已超过有效时间范围[" + e.getMessage() +"]");
			tokenAuth.setValid(false);
			tokenAuth.setAuthMessage("token已超过有效时间范围[" + e.getMessage() +"].");
		} catch(Exception e){
			logger.error("[token] token校验error.", e);
			tokenAuth.setValid(false);
			tokenAuth.setAuthMessage("token校验异常[" + e.getMessage() +"].");
		}
		return tokenAuth;
	}
}
