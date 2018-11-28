<?php
namespace app\index\controller;

use think\Db;
use think\Loader;
use think\Controller;


class Procurement  extends Permission
{
    // North America:
  
    public function Index()
    {     
        return $this->fetch();
    }

    public function waitigoods()
    {     
        return $this->fetch();
    }

    public function outofstockorder()
    {     
        return $this->fetch();
    }

    public function buyeruser()
    {     
        return $this->fetch();
    }


}
	