<?php
namespace app\index\model;

use think\Db;
use think\Loader;
use think\Controller;
use MarketplaceWebService\Samples\GetReportSample;
use MarketplaceWebService\Samples\GetReportListSample;
use MarketplaceWebService\Samples\RequestReportSample;
use MarketplaceWebService\Samples\GetReportRequestListSample;
use MarketplaceWebService\Samples\GetReportScheduleListSample;
use MarketplaceWebService\Samples\ManageReportScheduleSample;
class Report  extends Controller
{

  public function __construct($parameters = null,$service)
  {
    Loader::import('MarketplaceWebService/Client', EXTEND_PATH);
    Loader::import('MarketplaceWebService/Model/RequestReportRequest', EXTEND_PATH);
    Loader::import('MarketplaceWebService/Model/GetReportRequestListRequest', EXTEND_PATH);
    Loader::import('MarketplaceWebService/Model/GetReportRequest', EXTEND_PATH);

    // parameters['ReportType'] 必须，明确请求报告类型
    // parameters['StartDate'] ，请求报告开始时间
    $this->parameters=$parameters;
    $this->service=$service;
    if(empty($parameters['serviceUrl']))
    {
      $this->parameters['serviceUrl'] = 'https://mws.amazonservices.com';  
    }
  }

  // 整合请求报告流程
  public function reportFile()
  {
    // 递交请求报告，返回ReportRequestId，ReportProcessingStatus，ReportType
    $requestReport=$this->requestReport();
    $ReportRequestId=$requestReport['ReportRequestId'];
    // dump($requestReport);
    if($ReportRequestId)
    {
      $ReportRequestList=$this->GetReportRequestList($ReportRequestId);
      if(!empty($ReportRequestList[0]['GeneratedReportId']))
      {
        return $this->GetReport($ReportRequestList[0]['GeneratedReportId']);
      }else{
        return $ReportRequestList;
      }
    }
  }

  //Step1:创建报告请求，并将请求提交至亚马逊 MWS。
  public function requestReport()
  {
    // 请求参数
    $parameters = $this->parameters;
    $service = $this->service;

    $requestReport = new  RequestReportSample($parameters,$service);

    // 获取ReportRequestId,52991017849
    return $requestReport->index();
  }

  //Step2:返回可用于获取报告的 ReportRequestId 的报告请求列表。
  public function GetReportRequestList($ReportRequestId)
  {
    $parameters = $this->parameters;
    $service = $this->service;
    
    $parameters['ReportRequestIdList']['Id'] = array($ReportRequestId);

    $service = $this->service;
    $GetReportRequestList = new GetReportRequestListSample($parameters,$service);

    $issuccess=true;

    while($issuccess) 
    {
      // 查看处理结果
      $result = $GetReportRequestList->index(); 
      // dump($result);
      if($result[0]['ReportProcessingStatus'] == '_SUBMITTED_' || $result[0]['ReportProcessingStatus']=='_IN_PROGRESS_')
      {
        sleep(20);
      }else{
        $issuccess=false;
      }   
    }
// https://pic3.zhimg.com/v2-17f5af37b92363ac572e1d6b06acd72e_b.jpg
    return $result;


  }

  //Step3:返回报告内容及所返回报告正文的 Content-MD5 标头。
  public function GetReport($ReportId)
  {
    $parameters = $this->parameters;
    $service = $this->service;
    $parameters['ReportId'] = $ReportId;

    $RequestReport = new GetReportSample($parameters,$service);

    return $RequestReport->index();
  }


  public function test()
  {
    

  }
 
    
}