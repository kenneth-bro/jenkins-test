package com.investoday.boot.util.auth;

import javax.servlet.http.HttpSession;

/**
 * 校验公共类
 * 
 * @author liq
 * @date 2017年3月30日
 */
public class AuthUtil {

	/**
	 * 使用校验时从session中获取账户号
	 * 
	 * @author liq
	 * @date 2017年3月30日
	 * @param accountId
	 * @param isOauth
	 * @param session
	 * @return
	 */
	public static String getAccountIdBySession(String accountId, boolean isOauth, HttpSession session) {
		String result = accountId;
		try {
			if (isOauth) {
				// 从session中获取账户Id
				result = (String) session.getAttribute("accountId");
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return result;
	}
}
