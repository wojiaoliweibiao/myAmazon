<?php 

namespace app\index\widget;
use Think\Controller;

use think\Db;

class blog extends Controller{

    public function header()
    {
        // dump(input('param.')); DIE;
        // 获取顶部顶部分类
        $classify=Db::name('index_classify')->where('type_id=1')->order('date asc')->select();
        // 生产url并整理分类
        $classify=$this->classify_url($classify);
      // dump($classify);die;
        $this->assign('classify',$classify);
       return $this->fetch('public/header');
    }
    

    public function left()
    {   
        // dump(input('param.'));
        $data['type_id']=1;
        // 获取传过来的id
        $data['classify_id']=input('param.id');

         //根据传过来的id查询得到对应的分类数据
        $cla=Db::name('index_classify')->where($data)->find();
        // 判断是几级的分类,和其父级id
        $level=$cla['level'];

        $pid=$cla['pid'];


        // 获取顶部分类下的全部分类
        $classify=Db::name('index_classify')->where('type_id=1')->order('date asc')->select();


        //根据function和controller得到传入url()的url,并排列分类
        $classify=$this->classify_url($classify);
       

        $list=array();
        // 根据id得到当前分类的分类列表
        // 如果是一级分类
        if($level==2){
            foreach ($classify as $key => $value) {
                // 判断是否当前分类的数组
                if($value['classify_id']== $data['classify_id'] ){
                    // 获得当前分类的分类列表数组
                  
                    $list=$value;
                }
            }
        }else{
        // 如果是三级分类
            // 获取所属的父级id
            foreach ($classify as $key => $value) {

                if(!empty($value['list'])){
                    foreach ($value['list'] as $k => $v) {
                        if($v['classify_id']==$pid){
                            
                            $list=$value;
                            continue;
                        }
                    }
                }
            }
        }

        // dump($list);
        // die;
        // classify_crumbs($list,$data['classify_id']);
        // 左列表分类

        if(!empty($list['list'])){
          $this->assign('list',$list['list']);
        }
        $this->assign('classify_id',$data['classify_id']);
       return $this->fetch('public/left');
    }

    
    public function menu($name)
    {
        return 'menu:'.$name;
    }






    public function classify_url($classify){
        foreach ($classify as $key => $value){
            
            $classify[$key]['url']=$value['controller']."/".$value['function'];

        }
        return $this->classify($classify);
    }
   
    public function classify($classify){

      // foreach ($classify as $key => $value) {
      //     foreach ($classify as $k => $v) {
      //        if($value['pid']!=$v['classify_id']){
      //           $data[$key]=$value;
      //           unset($classify[$key]);
      //        }
      //     }
      // }
      // if()

      // return $data;

       // 一级分类
       foreach ($classify as $key => $value) {
            if($value['pid']==1){
                $cla[$key]=$value;
            }
       }
       // 二级分类
       foreach ($cla as $key=> $value){
            foreach ($classify as $ke => $val) {
                
                if($value['classify_id']==$val['pid']){
                    $cla[$key]['list'][$ke]=$val;
                }
            }
       }
       // 三级分类
       foreach ($cla as $key => $value) {
            if(!empty($value['list'])){
                foreach ($value['list'] as $ke => $val) {
                    foreach ($classify as $k => $v) {

                        if($val['classify_id']==$v['pid']){
                            $cla[$key]['list'][$ke]['list'][$k]=$v;
                        }
                    }
                }
            }
       }
       return $cla;

    }

}









