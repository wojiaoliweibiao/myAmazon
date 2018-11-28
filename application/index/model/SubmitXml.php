<?php
namespace app\index\model;

use think\Db;
use think\Loader;
use think\Controller;
use MarketplaceWebService\Samples\SubmitFeedSample;
use MarketplaceWebService\Samples\GetFeedSubmissionListSample;
use MarketplaceWebService\Samples\GetFeedSubmissionResultSample;
class SubmitXml  extends Controller
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
        $xml='<?xml version="1.0" ?>
        <AmazonEnvelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="amzn-envelope.xsd">
            <Header>
                <DocumentVersion>1.01</DocumentVersion>
                <MerchantIdentifier>AFEY1F2OP0KNC</MerchantIdentifier>
            </Header>
            <MessageType>Product</MessageType>';
        return $xml;
    }
	public function clothingAccessories()
	{
		$submitdata=$this->submitdata;
                    // <StandardProductID>
                    //     <Type>UPC</Type>
                    //     <Value>'.$submitdata["upc"].'</Value>
                    // </StandardProductID>
        $bulletPoint='';
        $searchTerms='';
       foreach ($submitdata["bulletPoint"] as $key => $value) {
          
            $bulletPoint=$bulletPoint.'<BulletPoint>'.$value.'</BulletPoint>';
             # code...
       } 
       foreach ($submitdata["searchTerms"] as $key => $value) {
          
            $searchTerms=$searchTerms.'<SearchTerms>'.$value.'</SearchTerms>';
             # code...
       }
        $headerxml=$this->headerxml();
		$messagexml='<Message>
                <MessageID>1</MessageID>
                <OperationType>Update</OperationType>
                <Product>
                    <SKU>'.$submitdata["parentSKU"].'</SKU>
                    <StandardProductID>
                        <Type>UPC</Type>
                        <Value>'.$submitdata["upc"].'</Value>
                    </StandardProductID>
                    <Condition>
                      <ConditionType>New</ConditionType>
                    </Condition>

                    <DescriptionData>

                        <Title>'.$submitdata["title"].'</Title>
                        <Brand>'.$submitdata["brand"].'</Brand>
                        <Description>'.$submitdata["description"].'</Description>
                        '.$bulletPoint.'
                        <Manufacturer>'.$submitdata["Manufacturer"].'</Manufacturer>
                        '.$searchTerms.'
                        <ItemType>'.$submitdata["itemType"].'</ItemType>
                    </DescriptionData>
                    <ProductData>
                        <ClothingAccessories>
                             <VariationData>
                                  <Size>X-Small</Size>
                                  <Color>red</Color>
                             </VariationData>
                            <ClassificationData>
                            	<Department>boys</Department>
                            </ClassificationData>
                        </ClothingAccessories>
                    </ProductData>
                </Product>
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