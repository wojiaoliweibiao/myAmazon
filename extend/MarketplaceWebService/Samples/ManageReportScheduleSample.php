<?php

namespace MarketplaceWebService\Samples;

class ManageReportScheduleSample
{

  public function __construct($parameters = null)
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
 

    $request = new \MarketplaceWebService_Model_ManageReportScheduleRequest($parameters);


    $this->invokeManageReportSchedule($service, $request);

 
  }
  public function invokeManageReportSchedule(\MarketplaceWebService_Interface $service, $request) 
  {
      try {
              $response = $service->manageReportSchedule($request);
              
                echo ("Service Response\n");
                echo ("=============================================================================\n");

                echo("        ManageReportScheduleResponse\n");
                if ($response->isSetManageReportScheduleResult()) { 
                    echo("            ManageReportScheduleResult\n");
                    $manageReportScheduleResult = $response->getManageReportScheduleResult();
                    if ($manageReportScheduleResult->isSetCount()) 
                    {
                        echo("                Count\n");
                        echo("                    " . $manageReportScheduleResult->getCount() . "\n");
                    }
                    $reportScheduleList = $manageReportScheduleResult->getReportScheduleList();
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
            
