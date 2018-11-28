<?php

namespace MarketplaceWebServiceOrders\Samples;

class ListOrderItemsSample{

  public function __construct($parameters = null)
  {
  
    $this->parameters=$parameters;

  }
  public function index($AmazonOrderId='')
  {

    $parameters=$this->parameters;

    if(empty($parameters['AmazonOrderId']))
    {
      $parameters['AmazonOrderId'] = $AmazonOrderId;
    }

    $config = array (
      'ServiceURL' => $parameters['serviceUrl'],
      'ProxyHost' => null,
      'ProxyPort' => -1,
      'ProxyUsername' => null,
      'ProxyPassword' => null,
      'MaxErrorRetry' => 3,
    );

    $service = new \MarketplaceWebServiceOrders_Client(
        AWS_ACCESS_KEY_ID,
        AWS_SECRET_ACCESS_KEY,
        APPLICATION_NAME,
        APPLICATION_VERSION,
        $config);

    $parameters['Merchant']=MERCHANT_ID;
    // dump($parameters);die;
    $request = new \MarketplaceWebServiceOrders_Model_ListOrderItemsRequest($parameters);
 
    return $this->invokeListOrderItems($service, $request);

  }
  public  function invokeListOrderItems(\MarketplaceWebServiceOrders_Interface $service, $request)
  {
    try{
        $response = $service->ListOrderItems($request);
    
        $dom = new \DOMDocument();
        $dom->loadXML($response->toXML());
        $dom->preserveWhiteSpace = false;
        $dom->formatOutput = true;
        return  $dom->saveXML();
      }catch (MarketplaceWebServiceOrders_Exception $ex){
        echo("Caught Exception: " . $ex->getMessage() . "\n");
        echo("Response Status Code: " . $ex->getStatusCode() . "\n");
        echo("Error Code: " . $ex->getErrorCode() . "\n");
        echo("Error Type: " . $ex->getErrorType() . "\n");
        echo("Request ID: " . $ex->getRequestId() . "\n");
        echo("XML: " . $ex->getXML() . "\n");
        echo("ResponseHeaderMetadata: " . $ex->getResponseHeaderMetadata() . "\n");
     }
  }

}