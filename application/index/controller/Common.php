<?php 



namespace app\index\controller;

use \think\Cache;
use \think\Controller;
use think\Loader;
use think\Db;
use \think\Cookie;
use \think\Session;
// use \think\Verify;

class Common extends Controller
{
	public function index(){

	}

	public function login(){

		if(!Session::has('username')){
		
			//1.判断是否post方式提交的数据
			if(request()->isPost()){
				// 2.接收登录页提交的数据				
			    $all_data = input('post.');
			    // 3.验证验证码
			    if(!captcha_check($all_data['verify'])){
			        // 校验失败
			        $this->error('验证码不正确');
	           	}
	           	// 4.获取登录信息
				$data=$all_data['data'];
				// 5.加密密码

				$data['password']=encrypt_password($data['password']);
				// 6.查询数据库,判断是否有此账号
				$user_db=Db::name('index_user')->where($data)->find();
				// 7.如果有,登陆成功
				if(!empty($user_db)){
					// 保存登录信息
					Session::set('username',$user_db['username']);
					Session::set('user_id',$user_db['user_id']);
					$this->redirect('index/index');
					die;
				}
			}
			// 登录页面
			return $this->fetch();

		}else{
			// 已经登录
			$this->redirect('home/index');
		}

	}

	
	public function dologin(){
		//1.判断是否post方式提交的数据
		if(request()->isPost()){
				// 2.接收登录页提交的数据				
			    $all_data = input('post.');
				// 3.加密密码
				// var_dump($all_data);exit;
				$data['password']=encrypt_password($all_data['yhPassword']);
				// 4.查询数据库,判断是否有此账号
				$data['username']=$all_data['yhLoginName'];
				$user_db=Db::name('index_user')->where($data)->find();
				$result=array();
				// echo 1;
				// 5.如果有,登陆成功
				if(!empty($user_db)){
					// 保存登录信息
					Session::set('username',$user_db['username']);
					Session::set('user_id',$user_db['user_id']);

					$result['HasError']=false;
					
				}else{
					$result['Message']='用户名或密码错误';
					$result['HasError']=true;
				}

				return $result;
			}




		return $result;

	}
	public function logout(){
		Session::delete('username');
        Session::delete('user_id');
        if(Session::has('username') or Session::has('user_id')) {
            return $this->error('退出失败');
        } else {
            return $this->redirect('./index/common/login');
        }
	}


	public  function regist(){
			// 1.获取提交的数据
			$data=$_POST['data'];
				// 密码加密和时间戳
				$data['password']=encrypt_password($data['password']);
				$data['date']=time();
				// 权限默认为1,普通
				$data['group_id']=1;
			// 2.判断用户是否存在
			$arr=array('username'=>$data['username'],'email'=>$data['email']);
			$is_rep=Db::name('index_user')->where($arr)->find();
			// 3.如果存在则回到注册页面
			if($is_rep){
				$this->error('该用户名已经注册','index/common/login');
				die;
			}
			// 4.如果不存在,存储用户信息
			$user=Db::name('index_user')->data($data)->insert();
			if($user){
				$this->success('用户注册成功','index/common/login');
			}

	}
}


