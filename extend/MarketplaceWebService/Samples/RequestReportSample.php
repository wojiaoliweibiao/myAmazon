<?php


namespace  MarketplaceWebService\Samples;


class RequestReportSample
{

  public function __construct($parameters,$service)
  {
    $this->parameters=$parameters;
    $this->service=$service;
  }

  public function index()
  {    
    // 请求参数
    $parameters=$this->parameters;
    // dump($parameters);
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
    $parameters['Merchant'] = $parameters['SellerId'];
  
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

                                                                                
