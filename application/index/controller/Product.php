<?php
namespace app\index\controller;

use think\Db;
use think\Loader;
use think\Controller;


class Product  extends Permission
{
    // North America:
  
    public function index()
    {        
        
    }

    public function productlist()
    {        
        
        return $this->fetch();
    }

    public function photobank()
    {        
        
        return $this->fetch();
    }

    public function photobanklist()
    {        
        
        return $this->fetch();
    }

    public function goodsmap()
    {        
        
        return $this->fetch();
    }

    public function skumap()
    {        
        
        return $this->fetch();
    }
    public function productserial()
    {        
        
        return $this->fetch();
    } 
    // 包材管理
    public function material()
    {        
        
        return $this->fetch();
    }
 // 包材目录
    public function materialCatalog()
    {        
        
        return $this->fetch();
    }


}
	