<?php
namespace app\index\controller;
use think\Controller;
use app\index\model\httpPost;
class Test extends Controller
{
 /***********************
 * 模拟登录             *
 *						*
 ************************/
 	public function login_post($url, $cookie, $post)
 	{	
 		header("Content-type: text/html; charset=utf-8");
		$ch = curl_init(); //初始化curl模块
 		$timeout =5;
 		curl_setopt($ch,CURLOPT_ENCODING ,'gzip');//乱码解决
		curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
		curl_setopt($ch, CURLOPT_URL, $url); //登录的地址
		// curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);//忽略https
		// curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE);//忽略https
		curl_setopt($ch, CURLOPT_HEADER, 0); //是否显示头信息
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); //是否自动显示返回的信息
		curl_setopt($ch, CURLOPT_COOKIEJAR, $cookie); //设置cookie信息保存在指定的文件夹中
		curl_setopt($ch, CURLOPT_POST, 1); //以POST方式提交
		curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($post));//要执行的信息
		$rs = curl_exec($ch); //执行CURL
		$httpCode = curl_getinfo($ch,CURLINFO_HTTP_CODE);
		curl_close($ch);
		return $rs;
	}

	public function verify($verify_url,$cookie)
	{	
		// header('Content-type: image/png');
		header("Content-type: text/html; charset=utf-8");
		$ch = curl_init($verify_url); 
		curl_setopt($ch,CURLOPT_ENCODING ,'gzip'); 
        curl_setopt($ch, CURLOPT_URL, $verify_url);  
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);  
        curl_setopt($ch, CURLOPT_TIMEOUT, 100);  
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 100);  
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);   //当需要访问https网站的时候一定要避开证书的验证
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE);  //当需要访问https网站的时候一定要避开证书的验证
        //设置Cookie信息保存在指定的文件中 
        curl_setopt($ch, CURLOPT_COOKIEJAR, $cookie);
        //读取cookie 
        curl_setopt($ch, CURLOPT_COOKIEFILE, $cookie);     
        $file = curl_exec($ch); 
        $file=mb_convert_encoding($img, 'UTF-8', 'UTF-8,GBK,GB2312,BIG5'); 
        curl_close($ch);  
        $fp = fopen('file_name.png', "w");//写入文件
        fwrite($fp, $file);
		fclose($fp);  
        return $file;  
	}
	/*
	上例中声明的函数login_post()，需要提供一个url地址，一个保存cookie文
	件，以及post的数据（用户名和密码等信息），注意php自带的http_build_query()
	函数可以将数组转换成相连接的字符串，如果通过该函数登录成功后，我们要获取
	登录成功个页面信息。声明函数的代码如下所示：
	*/
	public function get_content($url, $cookie)
	{
		$ch = curl_init(); //初始化curl模块
		curl_setopt($ch,CURLOPT_ENCODING ,'gzip');
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);//忽略https
		curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE);//忽略https
		curl_setopt($ch, CURLOPT_URL, $url); //需要获取信息的页面
		curl_setopt($ch, CURLOPT_HEADER, 0); //是否显示头信息
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); //是否自动显示返回的信息
		curl_setopt($ch, CURLOPT_COOKIEJAR, $cookie);//设置cookie信息保存在指定的文件夹中
		curl_setopt($ch, CURLOPT_COOKIEFILE, $cookie);// //读取cookie
		$rs = curl_exec($ch); //执行curl转去页面内容
		curl_close($ch);
		// return $rs; //返回字符串
		

	}
	/*
	get_content()中用curlopt_cookiefile可以读取到登录保存的cookie信
	息 最后讲页面内容返回.我们的目的是获取到模拟登录后的信息，也就是
	只有正常登录成功后菜能获取的有用的信息，下面举例代码
	*/
	public function demo(){
		header("Content-type: text/html; charset=UTF-8");
		$post = array(
		'j_username' => 'bGltaW5neXVlMDMxMg==',
		'j_password' => 'bGltaW5neXVlMDMxMg==',
		'j_loginsuccess_url'=>'',
		'j_validation_code' => 18
		);
		$cookie = 'cookie_ydma.txt'; //设置cookie保存的路径
		$verify_url = 'http://www.pss-system.gov.cn/sipopublicsearch/portal/login-showPic.shtml';
		$url = "http://www.pss-system.gov.cn/sipopublicsearch/portal/uilogin-forwardLogin.shtml"; //登录地址， 和原网站一致
		// $url2 = "https://passport.csdn.net/account/verify"; //需要获取信息的页面

		echo ($this->login_post($url, $cookie, $post));//调用模拟登录

		// dump(($this->verify($verify_url,$cookie)) ;
		// $content = $this->get_content($url2, $cookie); //登录后，调用get_content()函数获取登录后指定的页面信息

		// @unlink($cookie); //删除cookie文件
		// file_put_contents('save.html', $content); //保存抓取的页面内容
	}



}


