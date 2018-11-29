<?php
namespace app\index\model;

use think\Db;
use think\Loader;
use think\Controller;
use app\index\model\Report;
use MarketplaceWebService\Samples\MarketplaceWebServiceOrders;
use MarketplaceWebServiceOrders\Samples\ListOrdersSample;
use MarketplaceWebServiceOrders\Samples\ListOrderItemsSample;
use MarketplaceWebServiceOrders\Samples\GetOrderSample;
//导入自定义模型类
use app\index\model\Staff;
class Orders extends Controller
{


    public function __construct($parameters = null)
    {

      Loader::import('MarketplaceWebServiceOrders/Client', EXTEND_PATH);
      Loader::import('MarketplaceWebServiceOrders/Model/ListOrdersRequest', EXTEND_PATH);
      Loader::import('MarketplaceWebServiceOrders/Model/ListOrderItemsRequest', EXTEND_PATH);

      $parameters['CreatedAfter']=date('y-m-d',time()-3600*24*15);
      $this->parameters = $parameters;

    }

    public function ListOrders()
    {

      // 请求信息
      $parameters=$this->parameters;
      

      // 实例化 获取订单 类
      $listorder=new ListOrdersSample($parameters);

      // 获取订单信息
      $orderMessage=$listorder->index();
      // dump($orderMessage);

      // 是否有下一页
      if(!empty($orderMessage['ListOrdersResult']['NextToken']))
      {
        $NextToken=$orderMessage['ListOrdersResult']['NextToken'];
      }
      
      // 订单信息
      $order=$orderMessage['ListOrdersResult']['Orders']['Order'];

      // 查找数据库订单
      $order_where['uid'] = $_SESSION['module']['user_id'];

      $allOrders=Db::name('index_order')->where($order_where)->field('AmazonOrderId')->select();

      $allOrder=array();
      foreach ($allOrders as $key => $value) {
        $allOrder[$key] = $value['AmazonOrderId'];
      }
      
      foreach ($order as $k => $v) {

        $data[$k]['AmazonOrderId'] = $v['AmazonOrderId'];//订单编号
        // 订单是否重复
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

          if(!empty($v['LatestDeliveryDate']))
          {
            $data[$k]['LatestDeliveryDate'] = $v['LatestDeliveryDate'];// 最晚收日期
          }
          // 配送地址
          if(!empty($v['ShippingAddress']))
          {

            // 处理返回数据
            $data[$k]['BuyerName'] = $v['ShippingAddress']['Name'];// 买家姓名
            $data[$k]['AddressLine1'] = $v['ShippingAddress']['AddressLine1'];// 市内地址
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

          $data[$k]['uid'] = $_SESSION['module']['user_id'];// 订单对应用户

          Db::name('index_order')->insert($data[$k]);
          $oid=Db::name('index_order')->getLastInsID();
          $data[$k]['oid'] = $oid;

        }else{
          unset($data[$k]);
        }

      }
      // dump($data);
      if(!empty($data))
      {
        $this->orderItems($data);
      }



    }
    //详情获取方式1： 获取订单详情的报告
    // 吐槽:你直接详细地址弄出来会死啊
    public function orderItems($data='')
    {
            
      // 请求参数
      $parameters['ReportType']='_GET_XML_ALL_ORDERS_DATA_BY_ORDER_DATE_';
      $parameters['StartDate']=$this->parameters['CreatedAfter']; // 处理一天的

      if(!empty(MARKETPLACEARRAY))
      {
        $parameters['MarketplaceIdList']['Id']=explode(',',MARKETPLACEARRAY);
      }

      $report = new Report($parameters);

      // 获取报告结果
      $reportdata = $report->reportFile();

      // 将结果转为数组
      $reportdata = xmlToarr($reportdata);

      // 订单数据
      $Message=$reportdata['Message'];

      if(!empty($data)){
        foreach ($Message as $key => $value) {

          foreach ($data as $k => $v) {
            if($value['Order']['AmazonOrderID'] == $v['AmazonOrderId'])
            {

            }
          }
          
        }
      }
      
      dump($Message);

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



 
}