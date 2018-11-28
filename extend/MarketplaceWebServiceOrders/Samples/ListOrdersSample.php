<?php



namespace MarketplaceWebServiceOrders\Samples;




class ListOrdersSample{

  public function __construct($data = null)
  {

    $this->parameters=$data;
    // parent::__construct($data);
  }

  public function index()
  {
    $parameters=$this->parameters;
  
    $config = array (
     'ServiceURL' => $parameters['serviceUrl'],
     'ProxyHost' => null,
     'ProxyPort' => -1,
     'ProxyUsername' => null,
     'ProxyPassword' => null,
     'MaxErrorRetry' => 3,
    );
    // unset($parameters['serviceUrl']);
    
    $service = new \MarketplaceWebServiceOrders_Client(
          AWS_ACCESS_KEY_ID,
          AWS_SECRET_ACCESS_KEY,
          APPLICATION_NAME,
          APPLICATION_VERSION,
          $config);
    
    $request = new \MarketplaceWebServiceOrders_Model_ListOrdersRequest($parameters);
    $request->setSellerId(MERCHANT_ID);
    // object or array of parameters
    $data=$this->invokeListOrders($service, $request);
    // dump($data);
    return $data;
  }

 public  function invokeListOrders(\MarketplaceWebServiceOrders_Interface $service, $request)
  {
      try {
        $response = $service->ListOrders($request);
       
     
        $dom = new \DOMDocument();
        $dom->loadXML($response->toXML());
        $dom->preserveWhiteSpace = false;
        $dom->formatOutput = true;
        $arr=$dom->saveXML();
        // dump($arr);
        $arr=xmlToarr($arr);
        return $arr;
        // echo("ResponseHeaderMetadata: " . $response->getResponseHeaderMetadata() . "\n");
        // var_dump($response->getResponseHeaderMetadata());

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



