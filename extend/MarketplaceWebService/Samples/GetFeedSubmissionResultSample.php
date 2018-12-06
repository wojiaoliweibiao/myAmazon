<?php

namespace MarketplaceWebService\Samples;


class GetFeedSubmissionResultSample
{

  public function __construct($parameters,$service)
  {
    $this->parameters=$parameters;
    $this->service=$service;
  }

  public function index($FeedSubmissionId)
  {

    $parameters = $this->parameters;

    $ser = $this->service;


    $service = new \MarketplaceWebService_Client(
           $ser['KEY_ID'], 
           $ser['ACCESS_KEY'], 
           $ser['config'],
           $ser['NAME'],
           $ser['VERSION']);
  
    // object or array of parameters
    $files=@fopen('php://memory', 'rw+');

    $parameters['FeedSubmissionId'] = $FeedSubmissionId;
    $parameters['FeedSubmissionResult'] = $files;


    $request = new \MarketplaceWebService_Model_GetFeedSubmissionResultRequest($parameters);

  //$request = new MarketplaceWebService_Model_GetFeedSubmissionResultRequest();
  //$request->setMerchant(MERCHANT_ID);
  //$request->setFeedSubmissionId('<Feed Submission Id>');
  //$request->setFeedSubmissionResult(@fopen('php://memory', 'rw+'));
  //$request->setMWSAuthToken('<MWS Auth Token>'); // Optional

  $this->invokeGetFeedSubmissionResult($service, $request);


  $data=fread($files,'10000');
  $account=xmlToarr($data);
  // dump($account);
  $account=$account['Message']['ProcessingReport'];
  dump($account);
  return $account; 
  // example1:
  // $filename = DIR.’/file.xml’;
  // $handle = fopen($filename, ‘w+’);
  // $request = new MarketplaceWebService_Model_GetFeedSubmissionResultRequest();
  // $request->setMerchant(MERCHANT_ID);
  // $request->setFeedSubmissionId(‘7763008192’);
  // $request->setFeedSubmissionResult($handle)

  
  }
  public  function invokeGetFeedSubmissionResult(\MarketplaceWebService_Interface $service, $request) 
    {
        try {
                $response = $service->getFeedSubmissionResult($request);
      
                 
                  if ($response->isSetGetFeedSubmissionResultResult()) {
                    $getFeedSubmissionResultResult = $response->getGetFeedSubmissionResultResult(); 
                    
                    if ($getFeedSubmissionResultResult->isSetContentMd5()) {
                      // ContentMd5
                      // $getFeedSubmissionResultResult->getContentMd5();
                    }
                  }
                  if ($response->isSetResponseMetadata()) { 
                      // ResponseMetadata
                      $responseMetadata = $response->getResponseMetadata();
                      if ($responseMetadata->isSetRequestId()) 
                      {
                          // echo("                RequestId\n");
                          $responseMetadata->getRequestId();
                      }
                  } 

                 
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
                              
