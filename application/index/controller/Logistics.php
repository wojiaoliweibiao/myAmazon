<?php
namespace app\index\controller;

use think\Db;
use think\Loader;
use think\Controller;


class Logistics  extends Permission
{

    // 物流商
    public function index()
    {

        return $this->fetch();


    }
    // 揽件地址设置
    public function sendAddressSettingIn()
    {

        return $this->fetch();


    }
    // 报关信息设置
    public function declarationEdit()
    {

        return $this->fetch();


    }
    // 物流方案
    public function logisticPlan()
    {

        return $this->fetch();


    }
    // 自定义面单
    public function template()
    {

        return $this->fetch();


    }
    // 多地址设置
    public function addressSetIndex()
    {

        return $this->fetch();


    }
    // 运费规则
    public function freightRule()
    {

        return $this->fetch();


    }



}
	


