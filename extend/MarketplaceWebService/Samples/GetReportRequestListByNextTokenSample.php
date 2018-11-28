<?php
/** 
 *  PHP Version 5
 *
 *  @category    Amazon
 *  @package     MarketplaceWebService
 *  @copyright   Copyright 2009 Amazon Technologies, Inc.
 *  @link        http://aws.amazon.com
 *  @license     http://aws.amazon.com/apache2.0  Apache License, Version 2.0
 *  @version     2009-01-01
 */
/******************************************************************************* 

 *  Marketplace Web Service PHP5 Library
 *  Generated: Thu May 07 13:07:36 PDT 2009
 * 
 */

/**
 * Get Report List  Sample
 */

include_once ('.config.inc.php'); 

/************************************************************************
* Uncomment to configure the client instance. Configuration settings
* are:
*
* - MWS endpoint URL
* - Proxy host and port.
* - MaxErrorRetry.
***********************************************************************/
// IMPORTANT: Uncomment the approiate line for the country you wish to
// sell in:
// United States:
$serviceUrl = "https://mws.amazonservices.com";
// United Kingdom
//$serviceUrl = "https://mws.amazonservices.co.uk";
// Germany
//$serviceUrl = "https://mws.amazonservices.de";
// France
//$serviceUrl = "https://mws.amazonservices.fr";
// Italy
//$serviceUrl = "https://mws.amazonservices.it";
// Japan
//$serviceUrl = "https://mws.amazonservices.jp";
// China
//$serviceUrl = "https://mws.amazonservices.com.cn";
// Canada
//$serviceUrl = "https://mws.amazonservices.ca";
// India
//$serviceUrl = "https://mws.amazonservices.in";

$config = array (
  'ServiceURL' => $serviceUrl,
  'ProxyHost' => null,
  'ProxyPort' => -1,
  'MaxErrorRetry' => 3,
);

/************************************************************************
 * Instantiate Implementation of MarketplaceWebService
 * 
 * AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY constants 
 * are defined in the .config.inc.php located in the same 
 * directory as this sample
 ***********************************************************************/
 $service = new MarketplaceWebService_Client(
     AWS_ACCESS_KEY_ID, 
     AWS_SECRET_ACCESS_KEY, 
     $config,
     APPLICATION_NAME,
     APPLICATION_VERSION);
 
/************************************************************************
 * Uncomment to try out Mock Service that simulates MarketplaceWebService
 * responses without calling MarketplaceWebService service.
 *
 * Responses are loaded from local XML files. You can tweak XML files to
 * experiment with various outputs during development
 *
 * XML files available under MarketplaceWebService/Mock tree
 *
 ***********************************************************************/
 // $service = new MarketplaceWebService_Mock();

/************************************************************************
 * Setup request parameters and uncomment invoke to try out 
 * sample for Get Report List Action
 ***********************************************************************/
 // @TODO: set request. Action can be passed as MarketplaceWebService_Model_GetReportListRequest
 // object or array of parameters
 
$nextToken = '+KrR0z45TC32jpZedg0wbVuY6vtoszFEBZG8sdXkcOBx7XOjymr1G7bvYglpoE8CICyhlLgHd4gqVtOYt5i3YZ1h3Yfci6scf/BtqPQ7WcjLCWwhILJnVkz3/gYqMBsGP2/SC3jZNiiQk9wlC5rT8mDiJfxp/weZrToAsYN83sFmu9hm7DasIP56WMbynWobHg38h2XXMZtDXrCb5TJ+fGBPyacuM2WSZxbju4F4Q1dW27lduqlT+Q49DeheG38W0G5/Mh2vVpi52fN3oK/ZR4SbV7ijsGoPWZjF74HHL2R7cRJdJZJpg4/oRPSlktt7fQOLNWO+cpfyRhg95QJKYh5zIM+C3aYbq87oyLmx1tWqRUlqqp6ep3VV/ksiewiqcI5ixVjyvwY=';
     
$parameters = array (
  'Merchant' => MERCHANT_ID,
  'NextToken' => $nextToken,
  'MWSAuthToken' => 'amzn.mws.ccb17e01-312c-6496-0205-3d3a3ac65cc9', // Optional
);
$request = new MarketplaceWebService_Model_GetReportRequestListByNextTokenRequest($parameters);
 
// $request = new MarketplaceWebService_Model_GetReportRequestListByNextTokenRequest();
// $request->setMerchant(MERCHANT_ID);
// $request->setNextToken($nextToken);
// $request->setMWSAuthToken('<MWS Auth Token>'); // Optional
//
echo  '<pre>'; 
invokeGetReportRequestListByNextToken($service, $request);

                                                                    
/**
  * Get Report Request List By Next Token Action Sample
  * returns a list of reports; by default the most recent ten reports,
  * regardless of their acknowledgement status
  *   
  * @param MarketplaceWebService_Interface $service instance of MarketplaceWebService_Interface
  * @param mixed $request MarketplaceWebService_Model_GetReportRequestListByNextTokenRequest or array of parameters
  */
  function invokeGetReportRequestListByNextToken(MarketplaceWebService_Interface $service, $request) 
  {
      try {
              $response = $service->getReportRequestListByNextToken($request);
              
                echo ("Service Response\n");
                echo ("=============================================================================\n");

                echo("        GetReportRequestListByNextTokenResponse\n");
                if ($response->isSetGetReportRequestListByNextTokenResult()) { 
                    echo("            GetReportRequestListByNextTokenResult\n");
                    $getReportRequestListByNextTokenResult = $response->getGetReportRequestListByNextTokenResult();
                    if ($getReportRequestListByNextTokenResult->isSetNextToken()) 
                    {
                        echo("                NextToken\n");
                        echo("                    " . $getReportRequestListByNextTokenResult->getNextToken() . "\n");
                    }
                    if ($getReportRequestListByNextTokenResult->isSetHasNext()) 
                    {
                        echo("                HasNext\n");
                        echo("                    " . $getReportRequestListByNextTokenResult->getHasNext() . "\n");
                    }
                    $reportRequestInfoList = $getReportRequestListByNextTokenResult->getReportRequestInfoList();
                    foreach ($reportRequestInfoList as $reportRequestInfo) {
                        echo("                ReportRequestInfo\n");
                    if ($reportRequestInfo->isSetReportRequestId()) 
                          {
                              echo("                    ReportRequestId\n");
                              echo("                        " . $reportRequestInfo->getReportRequestId() . "\n");
                          }
                          if ($reportRequestInfo->isSetReportType()) 
                          {
                              echo("                    ReportType\n");
                              echo("                        " . $reportRequestInfo->getReportType() . "\n");
                          }
                          if ($reportRequestInfo->isSetStartDate()) 
                          {
                              echo("                    StartDate\n");
                              echo("                        " . $reportRequestInfo->getStartDate()->format(DATE_FORMAT) . "\n");
                          }
                          if ($reportRequestInfo->isSetEndDate()) 
                          {
                              echo("                    EndDate\n");
                              echo("                        " . $reportRequestInfo->getEndDate()->format(DATE_FORMAT) . "\n");
                          }
                          // add start
                          if ($reportRequestInfo->isSetScheduled()) 
                          {
                              echo("                    Scheduled\n");
                              echo("                        " . $reportRequestInfo->getScheduled() . "\n");
                          }
                          // add end
                          if ($reportRequestInfo->isSetSubmittedDate()) 
                          {
                              echo("                    SubmittedDate\n");
                              echo("                        " . $reportRequestInfo->getSubmittedDate()->format(DATE_FORMAT) . "\n");
                          }
                          if ($reportRequestInfo->isSetReportProcessingStatus()) 
                          {
                              echo("                    ReportProcessingStatus\n");
                              echo("                        " . $reportRequestInfo->getReportProcessingStatus() . "\n");
                          }
                          // add start
                          if ($reportRequestInfo->isSetGeneratedReportId()) 
                          {
                              echo("                    GeneratedReportId\n");
                              echo("                        " . $reportRequestInfo->getGeneratedReportId() . "\n");
                          }
                          if ($reportRequestInfo->isSetStartedProcessingDate()) 
                          {
                              echo("                    StartedProcessingDate\n");
                              echo("                        " . $reportRequestInfo->getStartedProcessingDate()->format(DATE_FORMAT) . "\n");
                          }
                          if ($reportRequestInfo->isSetCompletedDate()) 
                          {
                              echo("                    CompletedDate\n");
                              echo("                        " . $reportRequestInfo->getCompletedDate()->format(DATE_FORMAT) . "\n");
                          }
                          // add end
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
 ?>
