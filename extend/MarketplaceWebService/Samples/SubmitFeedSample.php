<?php



namespace MarketplaceWebService\Samples;





class SubmitFeedSample
{




  public function index($xml,$submitdata)
  {

    $config = array (
      'ServiceURL' => $submitdata['serviceUrl'],
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
   
    $feed = $xml;
    // Constructing the MarketplaceId array which will be passed in as the the MarketplaceIdList 
    // parameter to the SubmitFeedRequest object.
    // $marketplaceIdArray = array("Id" => array('ATVPDKIKX0DER'));
         
    // MWS request objects can be constructed two ways: either passing an array containing the 
    // required request parameters into the request constructor, or by individually setting the request
    // parameters via setter methods.
    // Uncomment one of the methods below.
    /********* Begin Comment Block *********/
    $feedHandle = @fopen('php://temp', 'rw+');
    fwrite($feedHandle, $feed);
    rewind($feedHandle);
    $parameters = array (
     'Merchant' => MERCHANT_ID,
     'MarketplaceIdList' => $submitdata['marketplaceIdArray'],
     'FeedType' => $submitdata['FeedType'],
     'FeedContent' => $feedHandle,
     'PurgeAndReplace' => false,
     'ContentMd5' => base64_encode(md5(stream_get_contents($feedHandle), true)),
    // 'MWSAuthToken' => '<MWS Auth Token>', // Optional
    );

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