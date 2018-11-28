<?php
namespace app\index\controller;

use think\Db;
use think\Loader;
use think\Controller;


class Curservice  extends Permission
{
    // North America:
  
    public function Index()
    {           
        return $this->fetch();

    }

    public function customer()
    {           
        return $this->fetch();

    }

    public function custormerlist()
    {           
        return $this->fetch();

    }

    public function rma()
    {           
        return $this->fetch();

    }

    public function rmareport()
    {           
        return $this->fetch();

    }


}
	