<?php


namespace MarketplaceWebService\Samples;


class GetReportSample 
{
  
  public function __construct($parameters)
  {
    $this->parameters=$parameters;
  }

  public function index(){

    $parameters=$this->parameters;

    $config = array (
      'ServiceURL' => $parameters['serviceUrl'],
      'ProxyHost' => null,
      'ProxyPort' => -1,
      'MaxErrorRetry' => 3,
    );

    $service = new \MarketplaceWebService_Client(
       AWS_ACCESS_KEY_ID, 
       AWS_SECRET_ACCESS_KEY, 
       $config,
       APPLICATION_NAME,
       APPLICATION_VERSION);

    $parameters['Merchant'] = MERCHANT_ID;
    $parameters['Report'] = @fopen('php://memory', 'rw+');

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