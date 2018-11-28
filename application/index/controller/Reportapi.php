<?php
namespace app\index\controller;

use think\Db;
use think\Loader;
use think\Controller;
use app\index\model\Report;


class Reportapi  extends Permission
{
   
    public function index()
    {
        
    }

    public function report()
    {
        // 格式:array("Id" => array('A1AM78C64UM0Y8'));
        $parameters['marketplaceIdArray']['Id'] = explode(',',MARKETPLACEARRAY);

        // 请求类型,格式：_GET_XML_BROWSE_TREE_DATA_；
        $parameters['ReportType'] = '_GET_SELLER_FEEDBACK_DATA_';

        $report=new report($parameters);

        $data=$report->reportFile();
        // 10
       
        dump($data);
    }
  

}
	