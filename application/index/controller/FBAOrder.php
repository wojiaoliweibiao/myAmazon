<?php
namespace app\index\controller;

use think\Db;
use think\Loader;
use think\Controller;


class FBAOrder  extends Permission
{
    // North America:
  
    public function Index()
    {        
        
        return $this->fetch();
    }
    

}
	