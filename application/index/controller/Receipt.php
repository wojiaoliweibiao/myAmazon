<?php
namespace app\index\controller;

use think\Db;
use think\Loader;
use think\Controller;


class Receipt  extends Permission
{

    // 物流商
    public function index()
    {

        return $this->fetch();


    }



}
	

