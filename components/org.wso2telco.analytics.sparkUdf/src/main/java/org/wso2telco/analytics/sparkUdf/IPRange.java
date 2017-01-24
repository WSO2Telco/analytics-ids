package org.wso2telco.analytics.sparkUdf;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.Arrays;
import java.util.List;

public class IPRange {

	public Boolean checkIpRange(String min, String max, String xForward){
		Boolean status=false;
		if(min !=null && max !=null && xForward !=null){
			List<String> ipList = Arrays.asList(xForward.split(","));
			for(String ip : ipList){
				try {
					if(InetAddress.getByName(min)!=null && InetAddress.getByName(max)!=null){
						long ipLo = ipToLong(InetAddress.getByName(min));
						long ipHi = ipToLong(InetAddress.getByName(max));
						if(InetAddress.getByName(ip.trim())!=null){
							long ipToTest = ipToLong(InetAddress.getByName(ip.trim()));
							if (ipToTest >= ipLo && ipToTest <= ipHi){
								status=true;
							}
						}
					}
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		}
		return  status;
	}

	public static long ipToLong(InetAddress ip) throws Exception{
		byte[] octets = ip.getAddress();
		long result = 0;
		for (byte octet : octets) {
			result <<= 8;
			result |= octet & 0xff;
		}
		return result;
	}
}
