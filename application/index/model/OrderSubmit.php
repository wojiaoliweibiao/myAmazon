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
        Loader::import('MarketplaceWebService/Client', EXTEND_PATH);
        Loader::import('MarketplaceWebService/Model/SubmitFeedRequest', EXTEND_PATH);
        Loader::import('MarketplaceWebService/Model/GetFeedSubmissionListRequest', EXTEND_PATH);
        Loader::import('MarketplaceWebService/Model/GetFeedSubmissionResultRequest', EXTEND_PATH);

        $this->submitdata= $data;
        $this->submitdata['marketplaceIdArray'] = array("Id" => array('ATVPDKIKX0DER'));

        $this->submitdata['serviceUrl'] = "https://mws.amazonservices.com";
    }

    // 整合上传数据功能(订单确认 )
	public function submitFile($sconfig=array(),$submitdata=array())
	{
        // 提交数据
        $submitdata=$this->submitdata;

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
        $xml='<?xml version="1.0" encoding="utf-8" ?>
                <AmazonEnvelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="amzn-envelope.xsd">
                <Header>
                    <DocumentVersion>1.01</DocumentVersion>
                    <MerchantIdentifier>AFEY1F2OP0KNC</MerchantIdentifier>
                </Header>
                <MessageType>'.$MessageType.'</MessageType>';
        return $xml;
    }


}