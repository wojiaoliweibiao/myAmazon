<?php

namespace MarketplaceWebServiceOrders\Samples;




class GetServiceStatusSample{

  public function __construct($parameters,$service)
  {
    $this->service = $service;
    $this->parameters = $parameters;
  }
  public function index()
  {

   $parameters = $this->parameters;

   $ser = $this->service;

   $service = new \MarketplaceWebServiceOrders_Client(
          $ser['KEY_ID'],
          $ser['ACCESS_KEY'],
          $ser['NAME'],
          $ser['VERSION'],
          $ser['config']
        );
   
   $request = new \MarketplaceWebServiceOrders_Model_GetServiceStatusRequest();
   $request->setSellerId($parameters['SellerId']);
  
   $this->invokeGetServiceStatus($service, $request);
  }


  public function invokeGetServiceStatus(\MarketplaceWebServiceOrders_Interface $service, $request)
  {
      try {

        $response = $service->GetServiceStatus($request);

        echo ("Service Response\n");
        echo ("=============================================================================\n");

        $dom = new \DOMDocument();
        $dom->loadXML($response->toXML());
        $dom->preserveWhiteSpace = false;
        $dom->formatOutput = true;
        echo $dom->saveXML();


     } catch (MarketplaceWebServiceOrders_Exception $ex) {
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