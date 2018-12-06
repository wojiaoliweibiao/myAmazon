<?php
namespace app\index\model;

use think\Db;
use think\Loader;
use think\Controller;
use MarketplaceWebService\Samples\SubmitFeedSample;

use app\index\model\SubmitXml;
use MarketplaceWebService\Samples\GetFeedSubmissionListSample;
use MarketplaceWebService\Samples\GetFeedSubmissionResultSample;

class OrderSubmit  extends Controller
{

    public function __construct($parameters,$server)
    {
       
        $config = array (
          'ServiceURL' => "https://mws.amazonservices.com",
          'ProxyHost' => null,
          'ProxyPort' => -1,
          'MaxErrorRetry' => 3,
        );

        $this->service = $service;
        $this->service['config'] = $config;

        // $this->submitdata['marketplaceIdArray'] = array("Id" => array('ATVPDKIKX0DER'));
        $this->parameters = $parameters;

        $this->submitdata = $submitdata;
    }

    // 整合上传数据功能(订单确认 )
	public function submitFile()
	{
        // 提交数据
        $submitdata = $this->submitdata;

        // 身份参数
        $parameters = $this->parameters;
        $service=$this->service;

        // 获取对应xml
        $SubmitXml=new SubmitXml($submitdata);
        $xml=$SubmitXml->clothingAccessories();

        // 上传数据,new公用类
        $submitFeed=new SubmitFeedSample();
		$account = $this->submitFeed($submitFeed,$xml,$submitdata);  
       
	}

	// Step 1:上传数据
	public function submitFeed($submitFeed,$xml='')
	{

        $submitdata=$this->submitdata;
	    $submitdata['FeedType']='_POST_ORDER_FULFILLMENT_DATA_';
	    // $submitFeed=new SubmitFeedSample();
	    $account=$submitFeed->index($xml,$submitdata);
	    return $account;

	}


    // xml公共头部
    public function xmlheader($MessageType){

        $parameters = $this->parameters;
        // OrderFulfillment
        $xml='<?xml version="1.0" encoding="utf-8" ?>
                <AmazonEnvelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="amzn-envelope.xsd">
                <Header>
                    <DocumentVersion>1.01</DocumentVersion>
                    <MerchantIdentifier>'.$parameters['Merchant'].'</MerchantIdentifier>
                </Header>
                <MessageType>'.$MessageType.'</MessageType>';
        return $xml;
    }
    
    public function OrderFulfillment()
    {
        $submitdata=$this->submitdata;
      
        $headerxml=$this->headerxml();
        $messagexml='<Message>
                    <MessageID>1</MessageID>
                    <OrderFulfillment>
                        <AmazonOrderID>114-1xxxxx8-2xxxxx7</AmazonOrderID>
                        <FulfillmentDate>2018-09-24T03:15:52Z</FulfillmentDate>
                        <FulfillmentData>
                            <CarrierCode>USPS</CarrierCode>
                            <ShippingMethod>First Class Mail</ShippingMethod>
                            <ShipperTrackingNumber>9400xxxxxxxxxxxxxx5204</ShipperTrackingNumber>
                        </FulfillmentData>
                        <Item>
                            <AmazonOrderItemCode>08xxxxxxxxxx02</AmazonOrderItemCode>
                            <Quantity>2</Quantity>
                        </Item>
                    </OrderFulfillment>
                    </Message>';
        $xml=$headerxml.$messagexml.'</AmazonEnvelope>';
        // dump($xml);
        return $xml;
    }

}