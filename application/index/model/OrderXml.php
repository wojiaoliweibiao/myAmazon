<?php
namespace app\index\model;

use think\Db;
use think\Loader;
use think\Controller;
use MarketplaceWebService\Samples\SubmitFeedSample;
use MarketplaceWebService\Samples\GetFeedSubmissionListSample;
use MarketplaceWebService\Samples\GetFeedSubmissionResultSample;
class OrderXml  extends Controller
{
	public function __construct($submitdata)
    {
        $this->fields = array (
        'parentSKU' => array('FieldValue' => null, 'FieldType' => 'string'),
        'upc' => array('FieldValue' => null, 'FieldType' => 'string'),
        'title' => array('FieldValue' => null, 'FieldType' => 'string'),
        'brand' => array('FieldValue' => null, 'FieldType' => 'string'),
        'description' => array('FieldValue' => null, 'FieldType' => 'string'),
        'bulletPoint' => array('FieldValue' => null, 'FieldType' => 'string'),
        'Manufacturer' => array('FieldValue' => null, 'FieldType' => 'string'),
        'itemType' => array('FieldValue' => null, 'FieldType' => 'string'),
        'searchTerms' => array('FieldValue' => null, 'FieldType' => 'string'),
        );
        $this->submitdata=$submitdata;
        
    }
    public function headerxml()
    {
        $xml='<?xml version="1.0" encoding="UTF-8"?>
                    <AmazonEnvelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="amzn-envelope.xsd">
                    <Header>
                        <DocumentVersion>1.01</DocumentVersion>
                        <MerchantIdentifier></MerchantIdentifier>
                    </Header>
                <MessageType>OrderFulfillment</MessageType>';
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

  








 // <Message>
 //                <MessageID>2</MessageID>
 //                <OperationType>Update</OperationType>
 //                <Product>
 //                    <SKU>'.$submitdata["sku"].'-redX</SKU>
 //                    <StandardProductID>
 //                        <Type>UPC</Type>
 //                        <Value>8011111000294</Value>
 //                    </StandardProductID>
 //                    <Condition>
 //                      <ConditionType>New</ConditionType>
 //                    </Condition>

 //                    <DescriptionData>

 //                        <Title>'.$submitdata["title"].'</Title>
 //                        <Brand>'.$submitdata["brand"].'</Brand>
 //                        <Description>'.$submitdata["description"].'</Description>
 //                        <BulletPoint>'.$submitdata["bulletPoint"].'</BulletPoint>
 //                        <Manufacturer>'.$submitdata["manufacturer"].'</Manufacturer>
 //                        <SearchTerms>'.$submitdata["searchTerms"].'</SearchTerms>
 //                        <ItemType>'.$submitdata["itemType"].'</ItemType>
 //                    </DescriptionData>
 //                    <ProductData>
 //                        <ClothingAccessories>
 //                             <VariationData>
 //                                  <Parentage>child</Parentage>
 //                                  <Size>Small</Size>
 //                                  <Color>blue</Color>
 //                                  <VariationTheme>SizeColor</VariationTheme>
 //                             </VariationData>
 //                            <ClassificationData>
 //                                <Department>'.$submitdata["itemType"].'</Department>
 //                            </ClassificationData>
 //                        </ClothingAccessories>
 //                    </ProductData>
 //                </Product>
 //            </Message>



}