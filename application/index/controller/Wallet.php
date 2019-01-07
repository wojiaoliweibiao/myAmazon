<?php
namespace app\api\controller;

use think\Db;
use think\Loader;
use think\Controller;



class Wallet  extends Permission
{

    // 列出用户api
    public function index()
    {
        // 接受请求
        $select = input('post.');

        $sel = array();
        if(!empty($select))
        {
          $sel['company'] = $select['company'];
          $sel['name'] = $select['name'];
          $sel['balance'] = array('lt',$select['company']);
          $sel['status'] = 1;
          $user = Db::name('index_user')->where($select)->select();     
        }else{
          // 所有用户
          $user = Db::name('index_user')->where('status','1')->select();
        }
        

        // 返回用户的姓名，所属公司，钱包余额，钱包类型.... 数据
        $data = array();

        foreach ($user as $key => $value) {
            $data[$key]['id'] = $user['id'];
            $data[$key]['name'] = $user['name'];
            $data[$key]['company'] = $user['company'];
            $data[$key]['balance'] = $user['balance'];
            $data[$key]['type'] = $user['type'];
            $data[$key]['addTime'] = $user['addTime'];
        }
        

        return $data;


    }
 
    // 充值
    public function topup()
    {
        // 接受请求
        $require = input('post.');

        $data = array();

        $wallet = Db::name('company_wallet')->where('id',$require['id'])->find();

        $balance = $wallet['balance'];

        // 充值总和
        $total = $balance + $require['topup']; 
        $wallet_update['total'] = $total;
        // 跟新余额
        Db::name('company_wallet')->where('id',$require['id'])->update($wallet_update);

        // 添加记录
        $data['topup'] = $require['topup'];
        $data['type'] = $require['type'];
        $data['orderid'] = $require['orderid'];
        $data['remark'] = $require['remark'];
        $data['uid'] = $require['id'];
       

        $issuccess = $Db::name('company_wallet_log')->add($data);

        if($issuccess)
        {
            return true;
        }else{
            return false;
        }


    }


       // 钱包设置详情
    // 可不用
    public function detail()
    {
        // 返回部分数据
        $require = input('post.');

        $wallet = Db::name('company_wallet')->where('id',$require['id'])->find();

        $data = array();

        $data['name'] = $wallet['name'];
        $data['id'] = $wallet['id'];

       return $data;

    }

}