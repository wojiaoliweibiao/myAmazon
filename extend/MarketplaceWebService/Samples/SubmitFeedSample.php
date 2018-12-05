<?php



namespace MarketplaceWebService\Samples;





class SubmitFeedSample
{

  public function __construct($parameters,$service)
  {
    $this->parameters=$parameters;
    $this->service=$service;
  }


  public function index($xml,$submitdata)
  {

    $parameters = $this->parameters;

    $ser = $this->service;


    $service = new \MarketplaceWebService_Client(
           $ser['KEY_ID'], 
           $ser['ACCESS_KEY'], 
           $ser['config'],
           $ser['NAME'],
           $ser['VERSION']);

    $feed = $xml;
 
 
    $feedHandle = @fopen('php://temp', 'rw+');
    fwrite($feedHandle, $feed);
    rewind($feedHandle);


    $parameters['FeedType'] = $submitdata['FeedType'];
    $parameters['FeedContent'] = $feedHandle;
    $parameters['ContentMd5'] = $base64_encode(md5(stream_get_contents($feedHandle), true));


    rewind($feedHandle);
    $request = new \MarketplaceWebService_Model_SubmitFeedRequest($parameters);

    $account=$this->invokeSubmitFeed($service, $request);
    // dump($account);
    return $account;
  }
  public function invokeSubmitFeed(\MarketplaceWebService_Interface $service, $request) 
  {
      try {
              $response = $service->submitFeed($request);
                if ($response->isSetSubmitFeedResult()) { 
                    $submitFeedResult = $response->getSubmitFeedResult();
                    if ($submitFeedResult->isSetFeedSubmissionInfo()) { 
                      
                        $feedSubmissionInfo = $submitFeedResult->getFeedSubmissionInfo();
                        if ($feedSubmissionInfo->isSetFeedSubmissionId()) 
                        {
                          $account['feedSubmissionId']=$feedSubmissionInfo->getFeedSubmissionId();
                        }else{
                          $account['feedSubmissionId']=false;
                        }
                        if ($feedSubmissionInfo->isSetFeedType()) 
                        {         
                          $account['feedType']=$feedSubmissionInfo->getFeedType();
                        }
                        if ($feedSubmissionInfo->isSetSubmittedDate()) 
                        {
                          $account['submitDate']=$feedSubmissionInfo->getSubmittedDate()->format(DATE_FORMAT);
                        }
                        if ($feedSubmissionInfo->isSetFeedProcessingStatus()) 
                        {
                          $account['feedSubmissionStatus']=$feedSubmissionInfo->getFeedProcessingStatus();
                        }
                      
                    } 
                }else{
                  $account['feedSubmissionId']=false;
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