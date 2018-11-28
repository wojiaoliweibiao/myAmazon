<?php
namespace app\index\controller;

use think\Db;
use think\Loader;
use think\Controller;
use think\Url;

class Api  extends Permission
{
  
    
    public function type()
    {
        
        $data='{"status": true, "item_type": "childrens-dry-erase-markers", "flag": true, "product_type": ["ClothingAccessories.ClothingAccessories"], "other_value": ""}';

        $data=json_decode($data,true);
        return $data;

    }


    public function attribute()
    {

    }

    public function imgSubmit()
    {
        var_dump($_GET);
        var_dump($_POST);
        var_dump($_FILES);

    }


       
}
	


