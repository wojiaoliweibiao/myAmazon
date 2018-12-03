<?php

namespace MarketplaceWebServiceProducts\Samples;


class  GetMatchingProductForIdSample{


  public function __construct($parameters,$service)
  {
    $this->parameters=$parameters;
    $this->service=$service;
  }


  public function index($data){


    $parameters = $this->parameters;
    
    $ser = $this->service;


   $config = array (
     'ServiceURL' => $parameters['ServiceURL'],
     'ProxyHost' => null,
     'ProxyPort' => -1,
     'ProxyUsername' => null,
     'ProxyPassword' => null,
     'MaxErrorRetry' => 3,
   );

   $service = new \MarketplaceWebServiceProducts_Client(
          $ser['KEY_ID'],
          $ser['ACCESS_KEY'],
          $ser['NAME'],
          $ser['VERSION'],
          $config);
 
  


   $request = new \MarketplaceWebServiceProducts_Model_GetMatchingProductForIdRequest($data);
   $request->setSellerId($this->parameters['SellerId']);
   // object or array of parameters
   $data=$this->invokeGetMatchingProductForId($service, $request);

   
   return $data=xmltoarr($data);
   

  }

 public  function invokeGetMatchingProductForId(\MarketplaceWebServiceProducts_Interface $service, $request)
  {
      try {
        
        $response = $service->GetMatchingProductForId($request);


        $dom = new \DOMDocument();
        $dom->loadXML($response->toXML());
        $dom->preserveWhiteSpace = false;
        $dom->formatOutput = true;
        return  $dom->saveXML();

     } catch (MarketplaceWebServiceProducts_Exception $ex) {
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