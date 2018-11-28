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


     public function __construct($data = null)
    {
     
        parent::__construct();
    }
 

    public function Index()
    {           
      
    
      
    }



    public function GetMatchingProductForId(){


      Loader::import('MarketplaceWebServiceProducts/Client', EXTEND_PATH);
      Loader::import('MarketplaceWebServiceProducts/Model/GetMatchingProductForIdRequest', EXTEND_PATH);
      $getproduct=new GetMatchingProductForIdSample();
      $data=$getproduct->index();
      // var_dump($data);
      return $data; 


    }





    public function ListMatchingProducts(){


      Loader::import('MarketplaceWebServiceProducts/Client', EXTEND_PATH);
      // Loader::import('MarketplaceWebServiceProducts/Mock', EXTEND_PATH);
      Loader::import('MarketplaceWebServiceProducts/Model/ListMatchingProductsRequest', EXTEND_PATH);
      $getproduct=new ListMatchingProductsSample();
      $data=$getproduct->index();
      // var_dump($data);
      return $data; 


    }



    public function GetServiceStatus(){

      Loader::import('MarketplaceWebServiceProducts/Client', EXTEND_PATH);
      Loader::import('MarketplaceWebServiceProducts/Model/GetServiceStatusRequest', EXTEND_PATH);
      $getproduct=new GetServiceStatusSample();
      $data=$getproduct->index();

       return $data; 
    }












 
}