package com.investoday.boot.util.token.entity;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

/**
 * Token校验返回结果
 * @author liq
 * @date 2017年11月22日
 */
@ApiModel(value = "AccessToken", description = "accessToken")
public class AccessToken {

	@ApiModelProperty(value = "token")
	private String accessToken;
	
	@ApiModelProperty(value = "token类型")
	private String tokenType;
	
	@ApiModelProperty(value = "过期时间")
	private long expireIn;

	public String getAccessToken() {
		return accessToken;
	}

	public void setAccessToken(String accessToken) {
		this.accessToken = accessToken;
	}

	public String getTokenType() {
		return tokenType;
	}

	public void setTokenType(String tokenType) {
		this.tokenType = tokenType;
	}

	public long getExpireIn() {
		return expireIn;
	}

	public void setExpireIn(long expireIn) {
		this.expireIn = expireIn;
	}
	
}
