<?php
namespace app\index\model;

use think\Db;
use think\Loader;
use think\Controller;
use MarketplaceWebService\Samples\SubmitFeedSample;
use MarketplaceWebService\Samples\GetFeedSubmissionListSample;
use MarketplaceWebService\Samples\GetFeedSubmissionResultSample;
class SubmitVariationXml  extends Controller
{
	public function __construct($submitdata,$parameters)
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
        $this->submitdata = $submitdata;
        $this->parameters = $parameters;
        
    }
    public function headerxml()
    {

        $parameters = $this->parameters;
        
        $xml='<?xml version="1.0" ?>
        <AmazonEnvelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="amzn-envelope.xsd">
            <Header>
                <DocumentVersion>1.01</DocumentVersion>
                <MerchantIdentifier>'.$parameters['Merchant'].'</MerchantIdentifier>
            </Header>
            <MessageType>Product</MessageType>';
        return $xml;
    }
	public function clothingAccessories_clothingAccessories()
	{

		$submitdata=$this->submitdata;
                    // <StandardProductID>
                    //     <Type>UPC</Type>
                    //     <Value>'.$submitdata["upc"].'</Value>
                    // </StandardProductID>

        $headerxml=$this->headerxml();
        $i = 1;

        $messagexml = '';

        foreach ($submitdata as $key => $value) {

                $bulletPoint='';
                $searchTerms='';
                foreach ($value["bulletPoint"] as $key => $value) {
                  
                    $bulletPoint = $bulletPoint.'<BulletPoint>'.$value.'</BulletPoint>';
                     # code...
                } 
                foreach ($value["searchTerms"] as $key => $value) {
                  
                    $searchTerms = $searchTerms.'<SearchTerms>'.$value.'</SearchTerms>';
                     # code...
                }
            $messagexml = $messagexml.'
            <Message>
                <MessageID>'.$i.'</MessageID>
                <OperationType>Update</OperationType>
                <Product>
                    <SKU>'.$value["parentSKU"].'</SKU>
                    <StandardProductID>
                        <Type>UPC</Type>
                        <Value>'.$value["upc"].'</Value>
                    </StandardProductID>
                    <Condition>
                      <ConditionType>New</ConditionType>
                    </Condition>
                    <DescriptionData>
                        <Title>'.$value["title"].'</Title>
                        <Brand>'.$value["brand"].'</Brand>
                        <Description>'.$value["description"].'</Description>
                        '.$bulletPoint.'
                        <Manufacturer>'.$value["Manufacturer"].'</Manufacturer>
                        '.$searchTerms.'
                        <ItemType>'.$value["itemType"].'</ItemType>
                    </DescriptionData>
                    <ProductData>
                        <ClothingAccessories>
                             <VariationData>
                                  <Size>'.$value["Size"].'</Size>
                                  <Color>'.$value["Color"].'</Color>
                             </VariationData>
                            <ClassificationData>
                                <Department>boys</Department>
                            </ClassificationData>
                        </ClothingAccessories>
                    </ProductData>
                </Product>
            </Message>
            <Message>
                <MessageID>'.$i++.'</MessageID>
                <OperationType>Update</OperationType>
                <Product>
                    <SKU>'.$value["parentSKU"].'</SKU>
                    <StandardProductID>
                        <Type>UPC</Type>
                        <Value>'.$value["upc"].'</Value>
                    </StandardProductID>
                    <Condition>
                      <ConditionType>New</ConditionType>
                    </Condition>
                    <DescriptionData>
                        <Title>'.$value["title"].'</Title>
                        <Brand>'.$value["brand"].'</Brand>
                        <Description>'.$value["description"].'</Description>
                        '.$bulletPoint.'
                        <Manufacturer>'.$value["Manufacturer"].'</Manufacturer>
                        '.$searchTerms.'
                        <ItemType>'.$value["itemType"].'</ItemType>
                    </DescriptionData>
                    <ProductData>
                        <ClothingAccessories>
                             <VariationData>
                                  <Size>'.$value["Size"].'</Size>
                                  <Color>'.$value["Color"].'</Color>
                             </VariationData>
                            <ClassificationData>
                                <Department>boys</Department>
                            </ClassificationData>
                        </ClothingAccessories>
                    </ProductData>
                </Product>
            </Message>
';

            $i++;
        }
        
        $xml=$headerxml.$messagexml.'</AmazonEnvelope>';
        // dump($xml);
        return $xml;
	}



}