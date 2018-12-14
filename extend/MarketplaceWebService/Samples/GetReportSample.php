<?php


namespace MarketplaceWebService\Samples;


class GetReportSample 
{
  
  public function __construct($parameters,$service)
  {
    $this->parameters=$parameters;
    $this->service=$service;
  }

  public function index(){

    $parameters=$this->parameters;

    $ser = $this->service;

     $config = array (
      'ServiceURL' => $parameters['serviceUrl'],
      'ProxyHost' => null,
      'ProxyPort' => -1,
      'MaxErrorRetry' => 3,
    );

    $service = new \MarketplaceWebService_Client(
        $ser['KEY_ID'], 
        $ser['ACCESS_KEY'], 
        $config,
        $ser['NAME'],
        $ser['VERSION']);


    // Merchant卖家
    $parameters['Merchant'] = $parameters['Merchant'];
    $parameters['Report'] = @fopen(ROOT_PATH.'\public\static\amazon.txt', 'rw+');
    // $parameters['Report'] = @fopen('php://memory', 'rw+');

    $request = new \MarketplaceWebService_Model_GetReportRequest($parameters);
    
    return $result=$this->invokeGetReport($service, $request);

  }


  public function invokeGetReport(\MarketplaceWebService_Interface $service, $request) 
  {

      try {
              $response = $service->getReport($request);
              
              return  stream_get_contents($request->getReport());

      } catch (MarketplaceWebService_Exception $ex) {
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