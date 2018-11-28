<?php
namespace app\index\model;

use think\Db;
use think\Loader;
use think\Controller;
use MarketplaceWebService\Samples\SubmitFeedSample;

use app\index\model\SubmitXml;
use MarketplaceWebService\Samples\GetFeedSubmissionListSample;
use MarketplaceWebService\Samples\GetFeedSubmissionResultSample;


Loader::import('MarketplaceWebService/Client', EXTEND_PATH);
Loader::import('MarketplaceWebService/Model/SubmitFeedRequest', EXTEND_PATH);
Loader::import('MarketplaceWebService/Model/GetFeedSubmissionListRequest', EXTEND_PATH);
Loader::import('MarketplaceWebService/Model/GetFeedSubmissionResultRequest', EXTEND_PATH);

class SubmitFeed  extends Controller
{

	// 整合上传数据功能
	public function submitFile($sconfig=array(),$submitdata=array())
	{

		// Loader::import('MarketplaceWebService/Client', EXTEND_PATH);
        // Loader::import('MarketplaceWebService/Model/SubmitFeedRequest', EXTEND_PATH);
        // 提交数据
        $submitdata=[
            'sku' => '2Z-500ABR4',
            'upc' => '8011111000409',
            'title' =>'hello',
            'brand' => 'ear',
            'description' => 'try again',
            'bulletPoint' =>'BulletPoint',
            'manufacturer' => 'Manufacturer',
            'itemType' => 'cuff-links',
            'searchTerms' => 'SearchTerms',
        ];

        // 账户信息
        $sconfig['marketplaceIdArray'] = array("Id" => array('ATVPDKIKX0DER'));
        $sconfig['serviceUrl'] = "https://mws.amazonservices.com";
      
        // 获取对应xml
        $SubmitXml=new SubmitXml($submitdata);
        $xml=$SubmitXml->clothingAccessories();

        // 上传数据,new公用类
        $submitFeed=new SubmitFeedSample();
		$account = $this->submitFeed($submitFeed,$xml,$sconfig);  
        // 整合上传数据功能
        // Step1:判断是否提交成功并返回feedSubmissionId.
        if(!empty($account['feedSubmissionId']))
        {
        	// 上传记录
        	$account['date']=time();
            dump($account);
        	Db::name('amazon_log')->insert($account);

            $id = Db::name('user')->getLastInsID();
            // Step2:判断是否提交成功处理 ,返回__DONE__.
        	if(!($this->getFeedSubmissionList($account['feedSubmissionId'])))
        	{
                // Step3:是否提交(刊登)基础信息成功.
        	    if($this->getFeedSubmissionResult($account['feedSubmissionId'],$id)){
                    // 库存，价格，图片提交
                    $sconfig['sku']=$submitdata['sku'];
                    $result=$this->inventoryFeed($submitFeed,$sconfig);
                    $result=$this->priceFeed($submitFeed,$sconfig,$result);
                    $result=$this->imageFeed($submitFeed,$sconfig,$result);
                    $result=$this->relationshipFeed($submitFeed,$sconfig,$result);
                    // 记录上传
                    Db::name('amazon_log')->where('id', $id)->update($result);
                    // // 查询处理情况，直到返回__DONE__;
                    // $feedid=array($result['priceId'],$result['inventoryId'],$result['imageId']);
                    // $atAll=$this->getAllList($feedid);
                    // if(!$atAll)
                    // {

                    //     Db::name('amazon_log')->where('id', $id)->update($result);
                    // }
                } 
        	}
        }
	}
	/// <summary>
    /// 获得账户信息
    /// </summary>
    public function GetConfig()
    {
    	
    }
	public function GetClient()
	{
    
	}

	// Step 1:上传数据
	public function submitFeed($submitFeed,$xml='',$sconfig='')
	{

        
	    $sconfig['FeedType']='_POST_PRODUCT_DATA_';
	    // $submitFeed=new SubmitFeedSample();
	    $account=$submitFeed->index($xml,$sconfig);
	    return $account;

	}
	// Step 2:提交一个SubmissionList，等待亚马逊返回"_DONE"状态，如果没有返回则一直等待。
	public function getFeedSubmissionList($feedSubmissionId)
	{

        // Loader::import('MarketplaceWebService/Model/GetFeedSubmissionListRequest', EXTEND_PATH);

        $isSuccess=true;
        if(!is_array($feedSubmissionId))
        {
          $feedSubmissionId=array($feedSubmissionId);
        }
        $k=0;
        while ($isSuccess)
        {
	       $submitFeed=new GetFeedSubmissionListSample();  
           $result=$submitFeed->index($feedSubmissionId);
           $k++;
           if($result['Status']=='_DONE_')
           {
               $isSuccess=false;
            
           }else
           {
            // 休息两分钟
                if($k==10)
                {
                    return true;
                }else{
                    sleep(30); 
                    
                }
           }
        }

        return $isSuccess;
	}
	// Step 3:返回上传数据处理报告。
	public function getFeedSubmissionResult($feedSubmissionId,$id)
	{
        // Loader::import('MarketplaceWebService/Model/GetFeedSubmissionResultRequest', EXTEND_PATH);
	    $submitFeed=new GetFeedSubmissionResultSample();
	    $result=$submitFeed->index($feedSubmissionId);

        if(!$result['ProcessingSummary']['MessagesWithError'])
        {
            return true;
        }else
        {
            if(!empty($result['Result']))
            {
                if(!empty($result['Result'][0])){
                    foreach ($result['Result'] as $key => $value)
                    {
                        $ResultCode[$key]=$value['ResultMessageCode'];
                        $ResultDescr[$key]=$value['ResultDescription'];
                 
                    }
                }else{
                        $ResultCode[0]=$result['Result']['ResultMessageCode'];
                        $ResultDescr[0]=$result['Result']['ResultDescription'];
                }
                
                $ResultMessageCode=json_encode($ResultCode);
                $ResultDescription=json_encode($ResultDescr);
                Db::name('amazon_log')->where('id', $id)->update(['isError' => '1','submitDate'=>time(),'ResultDescription'=>$ResultDescription,'ResultMessageCode'=>$ResultMessageCode,'feedSubmissionStatus'=>'__DONE__']);
                return false;
            }
        }
 
	}


    public function imageFeed($submitFeed,$sconfig,$result=array())
    {

       
        $sconfig['FeedType']='_POST_PRODUCT_IMAGE_DATA_';

        // $submitFeed=new SubmitFeedSample();
        // 建立图片上传xml
        $xmlheader=$this->xmlheader('ProductImage');

        $xmlmessage='
                <Message>
                    <MessageID>1</MessageID>
                    <OperationType>Update</OperationType>
                    <ProductImage>
                    <SKU>'.$sconfig['sku'].'</SKU>
                    <ImageType>Main</ImageType>
                    <ImageLocation>https://bpic.588ku.com/element_banner/20/18/10/58ea13c2be8c691425abe804408acd89.jpg!/unsharp/true/compress/true</ImageLocation>
                    </ProductImage>
                </Message> ';
        $xml=$xmlheader.$xmlmessage.'</AmazonEnvelope>';


        $account=$submitFeed->index($xml,$sconfig);
        $result['imageId']=$account['feedSubmissionId'];
        $result['imageStasus']=$account['feedSubmissionStatus'];
        return $result;

    }

    public function priceFeed($submitFeed,$sconfig,$result=array())
    {
     
   
        $sconfig['FeedType']='_POST_PRODUCT_PRICING_DATA_';
        // $submitFeed=new SubmitFeedSample();
        // 建立价格上传xml
        $xmlheader=$this->xmlheader('Price');
        $xmlmessage='<Message>
                        <MessageID>1</MessageID>
                        <Price>
                            <SKU>'.$sconfig["sku"].'</SKU>
                            <StandardPrice currency="USD">11.99</StandardPrice>
                        </Price>
                    </Message>
                   ';
        $xml=$xmlheader.$xmlmessage.'</AmazonEnvelope>';

        $account=$submitFeed->index($xml,$sconfig);
        $result['priceId']=$account['feedSubmissionId'];
        $result['priceStatus']=$account['feedSubmissionStatus'];
        return $result;

    }


    public function inventoryFeed($submitFeed,$sconfig,$result=array())
    {
        

        $sconfig['FeedType']='_POST_INVENTORY_AVAILABILITY_DATA_';
        // $submitFeed=new SubmitFeedSample();
        // 建立库存上传xml
        $xmlheader=$this->xmlheader('Inventory');
        $xmlmessage='<Message>
                  <MessageID>1</MessageID>
                  <OperationType>Update</OperationType>
                  <Inventory>
                  <SKU>'.$sconfig["sku"].'</SKU>
                  <Quantity>8</Quantity>
                  <FulfillmentLatency>1</FulfillmentLatency>
                  </Inventory>
                </Message> ';
         $xml=$xmlheader.$xmlmessage.'</AmazonEnvelope>';

         $account=$submitFeed->index($xml,$sconfig);
         $result['inventoryId']=$account['feedSubmissionId'];
         $result['inventoryStatus']=$account['feedSubmissionStatus'];
         return $result;
    }


    public function relationshipFeed($submitFeed,$sconfig,$result=array())
    {
       
        $sconfig['FeedType']='_POST_PRODUCT_RELATIONSHIP_DATA_';
        // $submitFeed=new SubmitFeedSample();'.$sconfig["sku"].'

        $xmlheader=$this->xmlheader('Relationship');
        $xmlmessage='
                <Message>
                    <MessageID>1</MessageID>
                    <OperationType>Update</OperationType>
                    <Relationship>
                        <ParentSKU>500ABR</ParentSKU>
                        <Relation>
                            <SKU>'.$sconfig["sku"].' </SKU>
                            <Type>Variation</Type>
                        </Relation>
                    </Relationship>
                </Message>';
        $xml=$xmlheader.$xmlmessage.'</AmazonEnvelope>';


        $account=$submitFeed->index($xml,$sconfig);
        $result['relationId']=$account['feedSubmissionId'];
        $result['relationStatus']=$account['feedSubmissionStatus'];
        return $result;
        
    }


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