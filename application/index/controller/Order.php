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
            'CreatedAfter'=>'2018-11-06',
            'serviceUrl'=>'https://mws.amazonservices.com/Orders/2013-09-01',
            'SellerId'=> MERCHANT_ID,

        ];
        $orders=new Orders($parameters);
        $orders->ListOrders();
    }


}
	