<?php 
namespace app\index\controller;
use think\Controller;
use think\Db;
use think\Loader;
use think\Session;
use think\Url;



class Permission  extends Controller
{

	protected function _initialize()
	{
			Url::root('/index.php');
			//1. 验证是否登录，没有则跳到登录页面
			if(!Session::has('username'))
			{
				$this->redirect('/index.php/index/Common/login');
			}else{


				$data=Db::name('index_user')->where('user_id',$_SESSION['module']['user_id'])->find();
				if(!defined('AWS_ACCESS_KEY_ID'))
				{
					define('DATE_FORMAT', 'Y-m-d\TH:i:s\Z'); 
					define('AWS_ACCESS_KEY_ID', $data['awsAccessKeyId']);
					define('AWS_SECRET_ACCESS_KEY', $data['awsSecretAcessKey']);
					define('APPLICATION_NAME', 'miaoyanjun');
					define('APPLICATION_VERSION', '2');
					define ('MERCHANT_ID', $data['merchantId']);
					define ('MARKETPLACEARRAY', $data['marketplaceIdArray']);

				}
				
			}

		

	}


}