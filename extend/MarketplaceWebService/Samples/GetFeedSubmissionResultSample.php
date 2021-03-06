<?php

namespace MarketplaceWebService\Samples;


class GetFeedSubmissionResultSample
{


  public function index($FeedSubmissionId)
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
  
   // object or array of parameters
   $files=@fopen('php://memory', 'rw+');

  $parameters = array (
   'Merchant' => MERCHANT_ID,
   'FeedSubmissionId' => $FeedSubmissionId,
   'FeedSubmissionResult' =>$files,
   'MWSAuthToken' => 'amzn.mws.ccb17e01-312c-6496-0205-3d3a3ac65cc9', // Optional
  );
  //
  $request = new \MarketplaceWebService_Model_GetFeedSubmissionResultRequest($parameters);

  //$request = new MarketplaceWebService_Model_GetFeedSubmissionResultRequest();
  //$request->setMerchant(MERCHANT_ID);
  //$request->setFeedSubmissionId('<Feed Submission Id>');
  //$request->setFeedSubmissionResult(@fopen('php://memory', 'rw+'));
  //$request->setMWSAuthToken('<MWS Auth Token>'); // Optional
  echo '<pre>';
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
                              
