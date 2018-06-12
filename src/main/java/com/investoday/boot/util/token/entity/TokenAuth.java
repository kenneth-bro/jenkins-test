package com.investoday.boot.util.token.entity;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

/**
 * Token校验信息
 * @author liq
 * @date 2017年11月23日
 */
@ApiModel(value = "TokenAuth", description = "token校验信息")
public class TokenAuth {
	@ApiModelProperty(value = "用户名")
	private String userName;
	
	@ApiModelProperty(value = "是否有效")
	private boolean valid;
	
	@ApiModelProperty(value = "校验信息")
	private String authMessage;

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}
	
	public boolean isValid() {
		return valid;
	}

	public void setValid(boolean valid) {
		this.valid = valid;
	}

	public String getAuthMessage() {
		return authMessage;
	}

	public void setAuthMessage(String authMessage) {
		this.authMessage = authMessage;
	}
	
}
