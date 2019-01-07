<?php

namespace MarketplaceWebService\Samples;

class GetFeedSubmissionListSample
{

  public function __construct($parameters,$service)
  {
    $this->parameters=$parameters;
    $this->service=$service;
  }

  public function index($feedSubmissionId='')
  {

    $parameters = $this->parameters;

    $ser = $this->service;


    $service = new \MarketplaceWebService_Client(
       $ser['KEY_ID'], 
       $ser['ACCESS_KEY'], 
       $ser['config'],
       $ser['NAME'],
       $ser['VERSION']);

  // $feedSubmissionId=array('id1','id2',...)
  if(!empty($feedSubmissionId))
  {
    $feedSubmissionId = array("Id" => $feedSubmissionId);
    $parameters['FeedSubmissionIdList'] = $feedSubmissionId;
  }

   // 'FeedProcessingStatusList' => array ('Status' => array ('_DONE_')),
   // 'MWSAuthToken' => 'amzn.mws.ccb17e01-312c-6496-0205-3d3a3ac65cc9', // Optional

  $request = new \MarketplaceWebService_Model_GetFeedSubmissionListRequest($parameters);

  //$request = new MarketplaceWebService_Model_GetFeedSubmissionListRequest();
  //$request->setMerchant(MERCHANT_ID);
  //$request->setMWSAuthToken('<MWS Auth Token>'); // Optional
  //
  //$statusList = new MarketplaceWebService_Model_StatusList();
  //$request->setFeedProcessingStatusList($statusList->withStatus('_SUBMITTED_'));
  

  $account=$this->invokeGetFeedSubmissionList($service, $request);


  return $account;
 
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