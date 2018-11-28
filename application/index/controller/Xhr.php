<?php
namespace app\index\controller;

use think\Db;
use think\Loader;
use think\Controller;
use think\Url;

class Xhr  extends Permission
{
  
    
    public function index()
    {
        

      return $this->fetch();


    }


    public function productStoreEdit(){

    	return $this->fetch();
    	
    }

    public function loadRoot(){
    	
    }
  
       
}
	


