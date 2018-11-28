<?php
namespace app\index\controller;

use think\Db;
use think\Loader;
use think\Controller;
use think\Url;
use app\index\model\SubmitFeed;
class Index  extends controller
{
  
    
    public function index()
    {
        Url::root('/index.php');

      return $this->fetch();


    }
    public function yhjm()
    {


        
        Url::root('/index.php');



        return $this->fetch();


    }

    public function test()
    { 
      
        Url::root('/index.php');
          // var_dump($_FILES);
        // DUMP(input('files.'))
        return $this->fetch();


    }
    public function testsubmit()
    {
      dump(input('post.'));
      var_dump($_POST);
      
      uploadimg();

    }
    public function category(){
        // var_dump($_GET);
       
        $pid=input('get.');
        $categorys=Db::name('amazon_categorys')->where('parent_id',$pid['parent_id'])->select();
        $data=array('categories'=>$categorys);
        return $data;    

    }


   




}
	


