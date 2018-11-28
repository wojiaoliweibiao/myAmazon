<?php


namespace  MarketplaceWebService\Samples;


class  GetReportRequestListSample
{
  public function __construct($parameters)
  {
    $this->parameters=$parameters;
  }

  public function index()
  {
    $parameters = $this->parameters;
    
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

    $request = new \MarketplaceWebService_Model_GetReportRequestListRequest($parameters);
   
    return $this->invokeGetReportRequestList($service, $request);

  }                                                                 

  public function invokeGetReportRequestList(\MarketplaceWebService_Interface $service, $request) 
  {
    $k=0;
      try {
              $response = $service->getReportRequestList($request);
           
                if ($response->isSetGetReportRequestListResult()) { 
               
                    $getReportRequestListResult = $response->getGetReportRequestListResult();
                    if ($getReportRequestListResult->isSetNextToken()) 
                    {
                   
                        $data[$k]['NextToken']=$getReportRequestListResult->getNextToken();
                    }
                   
                    $reportRequestInfoList = $getReportRequestListResult->getReportRequestInfoList();
                    foreach ($reportRequestInfoList as $reportRequestInfo) {
                       
                    if ($reportRequestInfo->isSetReportRequestId()) 
                          {
                            
                              $data[$k]['ReportRequestId']=$reportRequestInfo->getReportRequestId();
                          }
                          if ($reportRequestInfo->isSetReportType()) 
                          {
                            
                              $data[$k]['ReportType']=$reportRequestInfo->getReportType();
                          }
                         
                       
                          if ($reportRequestInfo->isSetScheduled()) 
                          {
                             
                              $data[$k]['Scheduled']=$reportRequestInfo->getScheduled();
                          }
                       
                         
                          if ($reportRequestInfo->isSetReportProcessingStatus()) 
                          {
                              $data[$k]['ReportProcessingStatus']=$reportRequestInfo->getReportProcessingStatus();
                          }
                
                          if ($reportRequestInfo->isSetGeneratedReportId()) 
                          {
                              $data[$k]['GeneratedReportId']=$reportRequestInfo->getGeneratedReportId();
                          }
                        
                          $k++;
                          
                    }
                } 
                return $data;
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
