<?php



namespace MarketplaceWebService\Samples;





class GetReportScheduleListSample
{

  public function __construct($parameters)
  {
    $this->parameters=$parameters;
  }

  public function index()
  {
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
  
      
    
    $request = new \MarketplaceWebService_Model_GetReportScheduleListRequest($parameters);

    //$request = new MarketplaceWebService_Model_GetReportScheduleListRequest();
    //$request->setMerchant(MERCHANT_ID);
    //$request->setMWSAuthToken('<MWS Auth Token>'); // Optional
    //
    //$typeList = new MarketplaceWebService_Model_TypeList();
    //$request->setReportTypeList($typeList->withType('_GET_ORDERS_DATA_', '_GET_FLAT_FILE_ORDERS_DATA_'));
    //
    $this->invokeGetReportScheduleList($service, $request);

    
  }
  public function invokeGetReportScheduleList(\MarketplaceWebService_Interface $service, $request) 
  {
      try {
              $response = $service->getReportScheduleList($request);
              
                echo ("Service Response\n");
                echo ("=============================================================================\n");

                echo("        GetReportScheduleListResponse\n");
                if ($response->isSetGetReportScheduleListResult()) { 
                    echo("            GetReportScheduleListResult\n");
                    $getReportScheduleListResult = $response->getGetReportScheduleListResult();
                    if ($getReportScheduleListResult->isSetNextToken()) 
                    {
                        echo("                NextToken\n");
                        echo("                    " . $getReportScheduleListResult->getNextToken() . "\n");
                    }
                    if ($getReportScheduleListResult->isSetHasNext()) 
                    {
                        echo("                HasNext\n");
                        echo("                    " . $getReportScheduleListResult->getHasNext() . "\n");
                    }
                    dump($getReportScheduleListResult);
                    $reportScheduleList = $getReportScheduleListResult->getReportSchedule();
                    foreach ($reportScheduleList as $reportSchedule) {
                        echo("                ReportSchedule\n");
                        if ($reportSchedule->isSetReportType()) 
                        {
                            echo("                    ReportType\n");
                            echo("                        " . $reportSchedule->getReportType() . "\n");
                        }
                        if ($reportSchedule->isSetSchedule()) 
                        {
                            echo("                    Schedule\n");
                            echo("                        " . $reportSchedule->getSchedule() . "\n");
                        }
                        if ($reportSchedule->isSetScheduledDate()) 
                        {
                            echo("                    ScheduledDate\n");
                            echo("                        " . $reportSchedule->getScheduledDate()->format(DATE_FORMAT) . "\n");
                        }
                    }
                } 
                if ($response->isSetResponseMetadata()) { 
                    echo("            ResponseMetadata\n");
                    $responseMetadata = $response->getResponseMetadata();
                    if ($responseMetadata->isSetRequestId()) 
                    {
                        echo("                RequestId\n");
                        echo("                    " . $responseMetadata->getRequestId() . "\n");
                    }
                } 

                echo("            ResponseHeaderMetadata: " . $response->getResponseHeaderMetadata() . "\n");
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
    
