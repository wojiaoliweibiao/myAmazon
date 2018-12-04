<?php
namespace app\index\controller;

use think\Db;
use think\Loader;
use think\Controller;
use app\index\model\Orders;

// use app\index\model\AwsProduct;

class Orderapi  extends Permission
{

    public function index()
    {
        
    }
    public function order()
    {
        // 编辑请求信息
        // echo $this->get_ip();DIE;
        $user_where['status']=1;
        $data=Db::name('index_user')->where($user_where)->select();
        // echo Db::name('index_user')->getLastSql();

        // dump($data);die;
        $config = array (
           'ServiceURL' => 'https://mws.amazonservices.com/Orders/2013-09-01',
           'ProxyHost' => null,
           'ProxyPort' => -1,
           'ProxyUsername' => null,
           'ProxyPassword' => null,
           'MaxErrorRetry' => 3,
        );

        try {
            foreach ($data as $key => $value) {

                if($value['awsAccessKeyId'] != '' && $value['awsSecretAcessKey'] != '' && $value['merchantId'] != '' && $value['marketplaceIdArray'] != '' && $value['APPLICATION_NAME'] != '' && $value['apistatus'] == 0)
                {   
                    // echo $key;
                    $parameters=[
                    'MarketplaceId'=>explode(',',$value['marketplaceIdArray']),
                    'CreatedAfter'=>date('Y-m-d',time()-3600*24*1),   
                    'SellerId'=> $value['merchantId'],
                    ];
                    // dump($parameters);

                    $service = array(
                        'KEY_ID' => $value['awsAccessKeyId'],
                        'ACCESS_KEY' => $value['awsSecretAcessKey'],
                        'NAME' => $value['APPLICATION_NAME'],
                        'VERSION' => APPLICATION_VERSION,
                        'config' => $config
                    );

                    $orders=new Orders($parameters,$service);
                    $orders->ListOrders($value['user_id']);
                }
            }
            
        } catch (Exception $e) {
            
        }
       
    }

    // 获取当前ip
    public function get_ip()
    {
        if(!empty($_SERVER['HTTP_CLIENT_IP'])){
        $cip = $_SERVER['HTTP_CLIENT_IP'];
        }
        else if(!empty($_SERVER['HTTP_X_FORWARDED_FOR'])){
        $cip = $_SERVER["HTTP_X_FORWARDED_FOR"];
        }
        else if(!empty($_SERVER["REMOTE_ADDR"])){
        $cip = $_SERVER["REMOTE_ADDR"];
        }else{
        $cip = '';
        }
        preg_match("/[\d\.]{7,15}/", $cip, $cips);
        $cip = isset($cips[0]) ? $cips[0] : 'unknown';
        unset($cips);
        return $cip;
    }


    public function orderMakeSure()
    {
    <<<EOH
    

         <?xml version="1.0"
        encoding="UTF-8"?>
        <AmazonEnvelope
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="amzn-envelope.xsd">
            <Header>     
        <DocumentVersion>1.01</DocumentVersion>      
        <MerchantIdentifier>My Store</MerchantIdentifier>
            </Header>  
        <MessageType>OrderFulfillment</MessageType>
            <Message>     
        <MessageID>1</MessageID>     
        <OrderFulfillment>         
        <MerchantOrderID>1234567</MerchantOrderID>        
        <MerchantFulfillmentID>1234567</MerchantFulfillmentID>         
        <FulfillmentDate>2002-05-01T15:36:33-08:00</FulfillmentDate>         
        <FulfillmentData>            
        <CarrierCode>UPS</CarrierCode>            
        <ShippingMethod>Second Day</ShippingMethod>             
        <ShipperTrackingNumber>1234567890</ShipperTrackingNumber>        
        </FulfillmentData>          
        <Item>            
        <MerchantOrderItemID>1234567</MerchantOrderItemID>              
        <MerchantFulfillmentItemID>1234567</MerchantFulfillmentItemID>            
        <Quantity>2</Quantity>         
        </Item>     
        </OrderFulfillment>
            </Message>
        </AmazonEnvelope>   
EOH;
    }

}
	