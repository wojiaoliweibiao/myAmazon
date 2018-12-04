<?php
namespace app\index\model;

use think\Db;
use think\Loader;
use think\Controller;
use app\index\model\Report;
use app\index\model\Product;
use MarketplaceWebService\Samples\MarketplaceWebServiceOrders;
use MarketplaceWebServiceOrders\Samples\ListOrdersSample;
use MarketplaceWebServiceOrders\Samples\ListOrderItemsSample;
use MarketplaceWebServiceOrders\Samples\GetServiceStatusSample;
use MarketplaceWebServiceOrders\Samples\GetOrderSample;
//导入自定义模型类
use app\index\model\Staff;
class Orders extends Controller
{


    public function __construct($parameters = null,$service)
    {

      Loader::import('MarketplaceWebServiceOrders/Client', EXTEND_PATH);
      Loader::import('MarketplaceWebServiceOrders/Model/ListOrdersRequest', EXTEND_PATH);
      Loader::import('MarketplaceWebServiceOrders/Model/ListOrderItemsRequest', EXTEND_PATH);

      // $parameters['CreatedAfter']=date('y-m-d',time()-3600*24*1);
      $this->parameters = $parameters;
      $this->service = $service;
    }

    public function ListOrders($uid)
    {

      // 请求信息
      $parameters=$this->parameters;
      $service=$this->service;

      // 实例化 获取订单 类
      $listorder=new ListOrdersSample($parameters,$service);

      // 获取订单信息
      $orderMessage=$listorder->index();
      // dump($orderMessage);

      // 是否有下一页
      if(!empty($orderMessage['ListOrdersResult']['NextToken']))
      {
        $NextToken=$orderMessage['ListOrdersResult']['NextToken'];
      }
      
      if(empty($orderMessage['ListOrdersResult']['Orders']['Order'])){

        // 没有订单
        return 1;
      }
      // 订单信息
      // 强行变为二维索引数组
      if(!_checkAssocArray($orderMessage['ListOrdersResult']['Orders']['Order']))
      {
        $order[0]=$orderMessage['ListOrdersResult']['Orders']['Order'];
      }else{
        $order=$orderMessage['ListOrdersResult']['Orders']['Order'];
      }
      // 查找数据库订单
      $order_where['uid'] = $uid;

      $allOrders=Db::name('index_order')->where($order_where)->field('AmazonOrderId')->select();

      $allOrder=array();
      foreach ($allOrders as $key => $value) {
        $allOrder[$key] = $value['AmazonOrderId'];
      }
      
      // dump($order);
      foreach ($order as $k => $v) {

        $data[$k]['AmazonOrderId'] = $v['AmazonOrderId'];//订单编号
        // 订单是否重复
        dump($v);
        if(!in_array($v['AmazonOrderId'],$allOrder))
        {
          $data[$k]['OrderStatus'] = $v['OrderStatus'];//订单状态

          if(!empty($v['OrderTotal']))
          {
            $data[$k]['CurrencyCode'] = $v['OrderTotal']['CurrencyCode'];//交易币种
            $data[$k]['TotalAmount'] = $v['OrderTotal']['Amount'];//价格
          }
          
          $data[$k]['MarketplaceId'] = $v['MarketplaceId'];// 交易站点

          $data[$k]['LatestShipDate'] = $v['LatestShipDate'];// 最晚发货日期
          $data[$k]['EarliestShipDate'] = $v['EarliestShipDate'];// 最早发货日期

          if(!empty($v['LatestDeliveryDate']))
          {
            $data[$k]['LatestDeliveryDate'] = $v['LatestDeliveryDate'];// 最晚收日期
          }
          if(!empty($v['EarliestDeliveryDate']))
          {
            $data[$k]['EarliestDeliveryDate'] = $v['EarliestDeliveryDate'];// 最早收日期
          }
          // 配送地址
          if(!empty($v['ShippingAddress']))
          {

            // 处理返回数据
            $data[$k]['BuyerName'] = $v['ShippingAddress']['Name'];// 买家姓名
            $data[$k]['AddressLine1'] = $v['ShippingAddress']['AddressLine1'];// 市内地址

            if(!empty($v['ShippingAddress']['AddressLine2']))
            {
              $data[$k]['AddressLine2'] = $v['ShippingAddress']['AddressLine2'];// 市内地址
            }
            $data[$k]['City'] = $v['ShippingAddress']['City'];// 城市
            $data[$k]['StateOrRegion'] = $v['ShippingAddress']['StateOrRegion'];// 国家或区
            $data[$k]['PostalCode'] = $v['ShippingAddress']['PostalCode'];// 邮政编码
            $data[$k]['CountryCode'] = $v['ShippingAddress']['CountryCode'];// 国家代码
            if(!empty($v['ShippingAddress']['Phone'])){  
              $data[$k]['BuyerPhone'] = $v['ShippingAddress']['Phone'];// 联系人电话
            }
            if(!empty($v['ShippingAddress']['BuyerEmail'])){  
              $data[$k]['BuyerEmail'] = $v['ShippingAddress']['BuyerEmail'];// 买家邮箱
            }
          }
          if(!empty($v['PaymentMethodDetails']['PaymentMethodDetail']))
          {
            $data[$k]['PaymentMethodDetail'] = $v['PaymentMethodDetails']['PaymentMethodDetail'];// 付款方式
          }
          $data[$k]['NumberOfItemsShipped'] = $v['NumberOfItemsShipped'];// 订单数量

          $data[$k]['uid'] = $uid;// 订单对应用户

          Db::name('index_order')->insert($data[$k]);
          $oid=Db::name('index_order')->getLastInsID();
          $data[$k]['oid'] = $oid;

        }else{
          unset($data[$k]);
        }

      }
      // dump($data);
      // die;
      if(!empty($data))
      {
        $ASIN=$this->orderItems($data);
      }

      // if(!empty($ASIN))
      // {
      //   $Product = new Product($this->parameters,$this->service);

      //   $ProductData['IdList']=$ASIN['ASIN'];
      //   $ProductData['IdType']='ASIN';
      //   $ProductData['MarketplaceId']=$this->parameters['MarketplaceId'];

      //   $result = $Product->GetMatchingProductForId($ProductData);
      //   dump($result);
      // }

    }
    //详情获取方式1： 获取订单详情的报告
    // 吐槽:你直接详细地址弄出来会死啊
    public function orderItems($data)
    {
            
      // 请求参数
      $parameters['ReportType']='_GET_XML_ALL_ORDERS_DATA_BY_ORDER_DATE_';
      $parameters['StartDate']=$this->parameters['CreatedAfter']; // 处理一天的
      $parameters['SellerId']=$this->parameters['SellerId']; // 处理一天的

      $service = $this->service;

      if(!empty(MARKETPLACEARRAY))
      {
        $parameters['MarketplaceIdList']['Id']=explode(',',MARKETPLACEARRAY);
      }

      $report = new Report($parameters,$service);

      // 获取报告结果
      $reportdata = $report->reportFile();

      if(!empty($reportdata)){

        // 将结果转为数组
        $reportdata = xmlToarr($reportdata);

        // 订单数据
        $Message=$reportdata['Message'];
        // dump($Message);
        $i = 0;
        $ASIN=array();
        foreach ($Message as $key => $value) {

          foreach ($data as $k => $v) {
            $insert=array();
            if($value['Order']['AmazonOrderID'] == $v['AmazonOrderId'])
            {    
              // 如果是索引数组
              // dump($value['Order']['OrderItem']);
              if(!empty($value['Order']['OrderItem'][0]))
              {
                // dump($value);echo 1;
                foreach ($value['Order']['OrderItem'] as $ke => $val) {
                  $insert['oid']=$v['oid'];
                  $insert['uid']=$v['uid'];
                  $insert['ASIN']=$val['ASIN'];
                  $insert['SellerSKU']=$val['SKU'];
                  $insert['OrderItemId']=$val['AmazonOrderItemCode'];
                  $insert['Title']=$val['ProductName'];
                  $insert['QuantityOrdered']=$val['Quantity'];
                  if(!empty($val['ItemPrice']))
                  {
                    $insert['Amount']=$val['ItemPrice']['Component'][0]['Amount'];//价格
                    $insert['ShippingPrice']=$val['ItemPrice']['Component'][1]['Amount'];  //运输费                
                    $insert['GiftWrapPrice']=$val['ItemPrice']['Component'][2]['Amount']; //包装费 
                  }
                                  
                   // 如果有折扣
                  if(!empty($val['Promotion']))
                  {
                    $insert['ItemPromotionDiscount'] = $val['Promotion']['ItemPromotionDiscount'];
                    $insert['PromotionIDs'] = $val['Promotion']['PromotionIDs'];
                  }
                  $insert['date']=time();

                  Db::name('index_order_orderitems')->insert($insert);

                  $ASIN['sign'][$i]['id']=Db::name('index_order')->getLastInsID();
                  $ASIN['sign'][$i]['ASIN']=$insert['ASIN'];
                  $ASIN['ASIN'][$i]=$insert['ASIN'];

                  $i++;
                }
              }else{
                // dump($value);echo 2;
                $insert['oid']=$v['oid'];
                $insert['uid']=$v['uid'];
                $insert['ASIN']=$value['Order']['OrderItem']['ASIN'];
                $insert['SellerSKU']=$value['Order']['OrderItem']['SKU'];
                $insert['OrderItemId']=$value['Order']['OrderItem']['AmazonOrderItemCode'];
                $insert['Title']=$value['Order']['OrderItem']['ProductName'];
                $insert['QuantityOrdered']=$value['Order']['OrderItem']['Quantity'];
                if(!empty($val['ItemPrice']))
                {
                  $insert['Amount']=$value['Order']['OrderItem']['ItemPrice']['Component'][0]['Amount'];//价格
                  $insert['ShippingPrice']=$value['Order']['OrderItem']['ItemPrice']['Component'][1]['Amount'];//运输费
                  $insert['GiftWrapPrice']=$value['Order']['OrderItem']['ItemPrice']['Component'][2]['Amount']; //包装费
                }
                 // 如果有折扣
                if(!empty($value['Order']['OrderItem']['Promotion']))
                {
                  $insert['ItemPromotionDiscount'] = $value['Order']['OrderItem']['Promotion']['ItemPromotionDiscount'];
                  $insert['PromotionIDs'] = $value['Order']['OrderItem']['Promotion']['PromotionIDs'];
                }

                $insert['date']=time();
                Db::name('index_order_orderitems')->insert($insert);
                $img=Db::name('index_order')->getLastInsID();

                $ASIN['sign'][$i]['id']=Db::name('index_order')->getLastInsID();
                $ASIN['sign'][$i]['ASIN']=$insert['ASIN'];
                $ASIN['ASIN'][$i]=$insert['ASIN'];
                $i++;
              }
              
            }
          }
          
        }

      }
      
      return $ASIN;

    }


    //详情获取方式2： 根据您指定的 AmazonOrderId 返回订单商品。
    // 缺点：一次请求只能获取一个订单详情
    public function listOrderItems($AmazonOrderId)
    {

      $parameters = $this->parameters;

      $listorder = new ListOrderItemsSample($parameters);
      
      $i = 0;
      $list = 0;
      // 查询每个订单的详情
      $update = array();
      foreach ($AmazonOrderId as $key => $value) {

        // 根据订单对应的订单号，查找订单详情
        $data[$i] = $listorder->Index($value['AmazonOrderId']);

        // 将数据转为数组
        $arr = xmlToarr($data[$i]);

        // dump($arr);
        // 订单所有项信息
        $update_data = $arr['ListOrderItemsResult']['OrderItems']['OrderItem'];

        // 简单验证是否是索引数组，如果是说明买了不同变体（款式），则
        if(_checkAssocArray($update_data))
        {
          foreach ($update_data as $k => $v) {
            $update[$list]['ASIN'] = $v['ASIN'];//ASIN
            $update[$list]['SellerSKU'] = $v['SellerSKU'];//SKU

            $update[$list]['OrderItemId'] = $v['OrderItemId'];
            $update[$list]['Title'] = $v['Title'];//标题
            $update[$list]['QuantityOrdered'] = $v['QuantityOrdered'];//订单数量
            if(!empty($v['ItemPrice']))
            {
              $update[$list]['CurrencyCode'] = $v['ItemPrice']['CurrencyCode'];//币种
              $update[$list]['Amount'] = $v['ItemPrice']['Amount'];//价格
            }else{
              $update[$list]['CurrencyCode'] = ' ';//币种
              $update[$list]['Amount'] = ' ';//价格
            }
            if(!empty($v['ShippingPrice']))
            {
              $update[$list]['ShippingPrice'] = $v['ShippingPrice']['Amount'];//运费
            }else{
              $update[$list]['ShippingPrice'] = ' ';//运费
            }
            $update[$list]['uid'] = $_SESSION['module']['user_id'];// 订单对应用户;
            $update[$list]['oid'] = $value['oid'];// 对应订单;

            $update[$list]['date'] = time();//时间

            $list++;

            
          }   
        }else{
            $update[$list]['ASIN'] = $update_data['ASIN'];//ASIN
            $update[$list]['SellerSKU'] = $update_data['SellerSKU'];//SKU

            $update[$list]['OrderItemId'] = $update_data['OrderItemId'];
            $update[$list]['Title'] = $update_data['Title'];//标题
            $update[$list]['QuantityOrdered'] = $update_data['QuantityOrdered'];//订单数量
            if(!empty($update_data['ItemPrice']))
            {
              $update[$list]['CurrencyCode'] = $update_data['ItemPrice']['CurrencyCode'];//币种
              $update[$list]['Amount'] = $update_data['ItemPrice']['Amount'];//价格
            }else{
              $update[$list]['CurrencyCode'] = ' ';//币种
              $update[$list]['Amount'] = ' ';//价格
            }
            if(!empty($update_data['ShippingPrice']))
            {
              $update[$list]['ShippingPrice'] = $update_data['ShippingPrice']['Amount'];//运费
            }else{
              $update[$list]['ShippingPrice'] = ' ';//运费
            }
            $update[$list]['uid'] = $_SESSION['module']['user_id'];// 订单对应用户;
            $update[$list]['oid'] = $value['oid'];// 对应订单;

            $update[$list]['date'] = time();//时间

            $list++;
        }

        // ListOrderItems 和 ListOrderItemsByNextToken 操作共享的最大请求限额为 30 个，恢复速率为每 2 秒钟 1 个请求
        if($i>29)
        {
          // 休息2秒
          sleep(2);
        }
        $i++;

      }
      // 查询每个订单的详情 end

      // 存储到订单详情表中
      // dump($update);
      Db::name('index_order_orderitems')->insertAll($update);


    }

  
    public function GetServiceStatusSample()
    { 
      Loader::import('MarketplaceWebServiceOrders/Model/GetServiceStatusRequest', EXTEND_PATH);
      $parameters = $this->parameters;
      $service = $this->service;
      
      $GetServiceStatusSample = new GetServiceStatusSample($parameters,$service);
      $GetServiceStatusSample->index();
    }
 
}