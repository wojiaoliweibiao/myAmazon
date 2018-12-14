<?php


namespace  MarketplaceWebService\Samples;


class RequestReportSample
{

  public function __construct($parameters,$service)
  {

    $this->field_parameters = array (
        'ReportType' => array('FieldValue' => null, 'FieldType' => 'string'),
        'Merchant' => array('FieldValue' => null, 'FieldType' => 'string'),
        'marketplaceIdArray' => array('Id' => array(), 'FieldType' => 'array'),
    );
    $this->field_service = array (
        'KEY_ID' => array('FieldValue' => null, 'FieldType' => 'string'),
        'ACCESS_KEY' => array('FieldValue' => null, 'FieldType' => 'string'),
        'NAME' => array('FieldValue' => null, 'FieldType' => 'string'),
        'VERSION' => array('FieldValue' => null, 'FieldType' => 'string'),
    );

    $this->parameters=$parameters;
    $this->service=$service;
  }

  public function index()
  {    
    // 请求参数
    $parameters=$this->parameters;
    // dump($parameters);
    $ser = $this->service;

// sell in:
// United States:
//$serviceUrl = "https://mws.amazonservices.com";
// United Kingdom
//$serviceUrl = "https://mws.amazonservices.co.uk";
// Germany
//$serviceUrl = "https://mws.amazonservices.de";
// France
//$serviceUrl = "https://mws.amazonservices.fr";
// Italy
//$serviceUrl = "https://mws.amazonservices.it";
// Japan
//$serviceUrl = "https://mws.amazonservices.jp";
// China
//$serviceUrl = "https://mws.amazonservices.com.cn";
// Canada
//$serviceUrl = "https://mws.amazonservices.ca";
// India
//$serviceUrl = "https://mws.amazonservices.in";

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
  
    $request = new \MarketplaceWebService_Model_RequestReportRequest($parameters);

    $result=$this->invokeRequestReport($service, $request);

    return  $result;
  }
  public function invokeRequestReport(\MarketplaceWebService_Interface $service, $request) 
  {
      try {
              $response = $service->requestReport($request);
                 
                if ($response->isSetRequestReportResult()) 
                { 
                    $requestReportResult = $response->getRequestReportResult();
                    
                    if ($requestReportResult->isSetReportRequestInfo()) 
                    {    
                        $reportRequestInfo = $requestReportResult->getReportRequestInfo();
               
                          if ($reportRequestInfo->isSetReportRequestId()) 
                          {

                            $result['ReportRequestId']=$reportRequestInfo->getReportRequestId();
                          }
                          if ($reportRequestInfo->isSetReportType()) 
                          {
                            $result['ReportType']=$reportRequestInfo->getReportType();
                          }
                         
                          if ($reportRequestInfo->isSetReportProcessingStatus()) 
                          {
                             $result['ReportProcessingStatus']=$reportRequestInfo->getReportProcessingStatus();
                          }
                      }
                } 
               
            return $result;

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
?>

                                                                                
