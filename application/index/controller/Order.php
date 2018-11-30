<?php
namespace app\index\controller;

use think\Db;
use think\Loader;
use think\Controller;
use app\index\model\Orders;

// use app\index\model\AwsProduct;

class Order  extends Permission
{
   

    public function Index()
    {
        
    }
    public function order()
    {
        // 编辑请求信息
        $parameters=[
            'MarketplaceId'=>explode(',',MARKETPLACEARRAY),
            'CreatedAfter'=>date('Y-m-d',time()-3600*24*2),   
            'serviceUrl'=>'https://mws.amazonservices.com/Orders/2013-09-01',
            'SellerId'=> MERCHANT_ID,

        ];
        $orders=new Orders($parameters);
        $orders->ListOrders();
    }


}
	