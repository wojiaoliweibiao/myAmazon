<?php
namespace app\index\controller;

use think\Db;
use think\Loader;
use think\Controller;
use app\index\model\Report;
use app\index\model\User ;

use app\index\model\Product;
use app\index\model\SubmitFeed;


class Publish  extends Permission
{

    public function index()
    {       


        

        $data=Db::name('amazon_categorys')->where('level','4')->order('id asc')->field('id,name')->limit(708089,500)->select();
        $data=arrayToString($data);


        print($data);
        die;
        return $this->fetch();

    }

    public function box()
    {   
        // $user = new User;die;
        $data=<<<EHO

EHO;
        $arr=array();
        // $data=str_replace('〜', '~', $data);
        $data=explode('+',$data);
        $num=count($data)-1;
        $k=0;
        dump($data);
        for ($i=0; $i <= $num ; $i++) { 
            $arr[$k]['id']=trim($data[$i]);
            $ii=$i+1;
            $arr[$k]['chinese']=$data[$ii];
            $i++;
            $k++;
            // echo $i.',';
        }
        dump($arr);
        // die;
        // Db::startTrans();
        // try{

            foreach ($arr as $key => $value) {
                Db::name('amazon_categorys')->update($value);
            }

            // 提交事务
        //     Db::commit();    
        // } catch (\Exception $e) {
            // 回滚事务
        //     Db::rollback();
        // }
        die;

        return $this->fetch();

    }
    // 店铺搬家
    public function movehome()
    {           
        return $this->fetch();

    }
    // 产品库
    public function productStore()
    {           


        return $this->fetch();

    }
    // 待发布库
    public function prevview()
    {         
    

        return $this->fetch();
     
       
    }
    // 线上商品
    public function onlinegoods()
    {  

        return $this->fetch(); 

        
    }
    // BTG类目
    public function productBtg(){

        return $this->fetch();
    }


    public function productStoreEdit(){
        return $this->fetch();
    }
 


}
