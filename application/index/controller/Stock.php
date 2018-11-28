<?php
namespace app\index\controller;

use think\Db;
use think\Loader;
use think\Controller;


class Stock  extends Permission
{

    // 入库管理
    public function index()
    {

        return $this->fetch();


    }
    // 出库管理
    public function outStore()
    {

        return $this->fetch();

        
    }
    // 库存调拨
    public function stockTransfer()
    {

        return $this->fetch();


    }
 
    // 仓库设置
    public function storeSet()
    {

        return $this->fetch();


    }
    // 库存盘点
    public function stockTaking()
    {

        return $this->fetch();


    }
    // 退换货管理
    public function StockReturn()
    {

        return $this->fetch();


    }
    // 仓库清单
    public function stockQuery()
    {

        return $this->fetch();


    }
    
    // 库存流水
    public function stockHistory()
    {

        return $this->fetch();


    }

}
	


