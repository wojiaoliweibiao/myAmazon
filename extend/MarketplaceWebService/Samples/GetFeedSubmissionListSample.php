<?php

namespace MarketplaceWebService\Samples;

class GetFeedSubmissionListSample
{

  public function index($feedSubmissionId)
  {
  // include_once ('.config.inc.php'); 
  $serviceUrl = "https://mws.amazonservices.com";
 

  $config = array (
    'ServiceURL' => $serviceUrl,
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


  $FeedProcessingStatusList = array("Id" => $feedSubmissionId);

  $parameters = array (
   'Merchant' => MERCHANT_ID,
   // 'FeedProcessingStatusList' => array ('Status' => array ('_DONE_')),
   'FeedSubmissionIdList' =>$FeedProcessingStatusList,
   // 'MWSAuthToken' => 'amzn.mws.ccb17e01-312c-6496-0205-3d3a3ac65cc9', // Optional
  );
  //
  $request = new \MarketplaceWebService_Model_GetFeedSubmissionListRequest($parameters);

  //$request = new MarketplaceWebService_Model_GetFeedSubmissionListRequest();
  //$request->setMerchant(MERCHANT_ID);
  //$request->setMWSAuthToken('<MWS Auth Token>'); // Optional
  //
  //$statusList = new MarketplaceWebService_Model_StatusList();
  //$request->setFeedProcessingStatusList($statusList->withStatus('_SUBMITTED_'));
  

  $account=$this->invokeGetFeedSubmissionList($service, $request);


  // dump($account);
  if(count($feedSubmissionId)<=1)
  {
    unset($account[0]['ReportType']);
    return $account[0];
    
  }else{

    return $account;
  }

 }
  public function invokeGetFeedSubmissionList(\MarketplaceWebService_Interface $service, $request) 
  {
      try {
              $response = $service->getFeedSubmissionList($request);
              
              
                if ($response->isSetGetFeedSubmissionListResult()) { 
                   
                    $getFeedSubmissionListResult = $response->getGetFeedSubmissionListResult();


                    $feedSubmissionInfoList = $getFeedSubmissionListResult->getFeedSubmissionInfoList();
                    $k=0;
                    foreach ($feedSubmissionInfoList as $feedSubmissionInfo) {
                        if ($feedSubmissionInfo->isSetFeedProcessingStatus()) 
                        {
                            $account[$k]['Status']=$feedSubmissionInfo->getFeedProcessingStatus();
                        }
                        if ($feedSubmissionInfo->isSetStartedProcessingDate()) 
                        {
                            $account[$k]['StartedProcessingDate']=$feedSubmissionInfo->getStartedProcessingDate()->format(DATE_FORMAT);
                        }
                        if ($feedSubmissionInfo->isSetCompletedProcessingDate()) 
                        {
                            $account[$k]['CompletedProcessingDate']=$feedSubmissionInfo->getCompletedProcessingDate()->format(DATE_FORMAT);
                        }
                        if ($feedSubmissionInfo->isSetFeedSubmissionId()) 
                        {
                            $account[$k]['FeedSubmissionId']=$feedSubmissionInfo->getFeedSubmissionId();
                           
                        }
                        if ($feedSubmissionInfo->isSetFeedType()) 
                        {
                            $account[$k]['ReportType']=$feedSubmissionInfo->getFeedType();
                        }
                        $k++;
                    }
                } 

            return $account;
               
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