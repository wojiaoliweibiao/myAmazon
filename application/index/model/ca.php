<?php
namespace app\index\model;

use think\Db;
use think\Loader;
use think\Controller;
use MarketplaceWebServiceProducts\Samples\GetMatchingProductForIdSample;
use MarketplaceWebServiceProducts\Samples\ListMatchingProductsSample;
use MarketplaceWebServiceProducts\Samples\GetServiceStatusSample;
class Product extends Controller
{


     public function __construct($parameters,$service)
    {

      Loader::import('MarketplaceWebServiceProducts/Client', EXTEND_PATH);
      Loader::import('MarketplaceWebServiceProducts/Model/GetMatchingProductForIdRequest', EXTEND_PATH);

      $this->service = $service;
      $this->parameters = $parameters;
      $this->parameters['ServiceURL'] = "https://mws.amazonservices.com/Products/2011-10-01";

    }
 


    public function GetMatchingProductForId($data){


      $parameters = $this->parameters;
      $service = $this->service;
     
      $getproduct=new GetMatchingProductForIdSample($parameters,$service);

      // $data['IdList']=$id;
      // $data['IdType']='ASIN';
      // $data['MarketplaceId']='ATVPDKIKX0DER';
      $data=$getproduct->index($data);

      return $data; 


    }
 
}