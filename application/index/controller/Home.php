<?php
namespace app\index\controller;

use think\Db;
use think\Loader;
use think\Controller;
use MarketplaceWebService\Samples\RequestReportSample;
use MarketplaceWebService\Samples\GetReportRequestListSample;
use MarketplaceWebService\Samples\GetReportSample;
use app\index\model\SubmitFeed;

// Loader::import('MarketplaceWebService/Client', EXTEND_PATH);
// Loader::import('MarketplaceWebService/Model/RequestReportRequest', EXTEND_PATH);
// Loader::import('MarketplaceWebService/Model/GetReportRequestListRequest', EXTEND_PATH);
// Loader::import('MarketplaceWebService/Model/GetReportRequest', EXTEND_PATH);


class Home  extends Permission
{
  
    
    public function index()
    {

        return $this->fetch();

    }

    public function test(){
       
    	return $this->fetch();
    }
   
    public function submit()
    {
         // var_dump(input('post.'));

         $data=input('post.');
        

        // 50262017836

         // dump($file);
       
         for ($i=0; $i <5 ; $i++) { 
           if($data['searchTerms'][$i]==''){
              unset($data['searchTerms'][$i]);
           }
           if($data['bulletPoint'][$i]==''){
              unset($data['bulletPoint'][$i]);
           }
         }
         $searchTerms=implode(',',$data['searchTerms']);
         $bulletPoint=implode(',',$data['bulletPoint']);

         $submitdata=$data['data'];
         $submitdata['searchTerms']=$searchTerms;
         $submitdata['bulletPoint']=$bulletPoint;
         $submitdata['date']=time();


         $url=savePicture();
         $imgorder=array('mainimg','img2','img3','img4');
         if(!$url){
           return '图片格式出错';
         }
  
         foreach ($url as $key => $value) {
            if($key>4){
              continue;
            }
           // $submitdata[$imgorder[$key]]=$value;
           $submitdata[$imgorder[$key]]='http://bpic.588ku.com/element_origin_min_pic/18/06/08/e29977141f6af13c01865c7120a217c4.jpg';
         }

        // Db::name('amazon_public')->insert($submitdata);
        $submitdata['searchTerms']=$data['searchTerms'];
        $submitdata['bulletPoint']=$data['bulletPoint'];
        $submitFeed=new SubmitFeed($submitdata);
     
        $submitFeed->submitFile($submitdata);
        
    }



    public function jsonamazon()
    {
        $xmlobj=new Xml();
        $xml=$xmlobj->index();
        $arr=json_decode($xml,true);
        $arr=$arr['browseElements'];
        // dump($arr);
        foreach ($arr as $key => $value) {
            $data[$key]['cid']=$value['browsePath'];
            $data[$key]['level']=$value['level'];
            $data[$key]['name']=$value['label'];
            $data[$key]['browsePath']=$value['browsePath'];
            $data[$key]['pid']=3;
            $data[$key]['parent_id']=3;
            $data[$key]['site']=3;
            $id=Db::name('amazon_categor')->where($data[$key])->find();
            if(!$id){
               $category[$key]=Db::name('amazon_categor')->insert($data[$key]);
            }
            
        }
        dump($category);
       
    }

    public function requestreport()
    {
       
        $RequestReportSample=new RequestReportSample;
        $where['level']=1;
        $where['site']=3;
        $where['hasdone']='0';
        $foreach=Db::name('amazon_categor')->where($where)->select();
        // dump($foreach);die;
        foreach ($foreach as $key => $value) {
           
            $isexisit=Db::name('report_log')->where('cid',$value['cid'])->find();
            if(!$isexisit){
                $data=$RequestReportSample->index($value['cid']);
                $data['cid']=$value['cid'];
                $data['date']=time();
                $data['name']=$value['name'];
                $id=Db::name('report_log')->insert($data);
                sleep(20);
            }
        }
       
        // $this->GetReportRequestList($id,$data['ReportRequestId']);
    }
    public function GetReportRequestList($id='',$ReportRequestId='50287017837')
    {   

        $where['issuccess']=0;
        $foreach=Db::name('report_log')->where($where)->select();

        $update['issuccess']=1;
        $where=array();
        // dump($foreach);die;
        $RequestReportSample=new GetReportRequestListSample;
        foreach ($foreach as $key => $value) {
            $where['id']=$value['id'];
            
            $data=$RequestReportSample->index($value['ReportRequestId']);
            // dump($data);
            if(!empty($data['0']['GeneratedReportId'])){
                $update['GeneratedReportId']=$data['0']['GeneratedReportId'];
                $update['ReportProcessingStatus']=$data['0']['ReportProcessingStatus'];
                Db::name('report_log')->where($where)->update($update);
            }
                sleep(13);
            
        }
       
        // $data[0]['id']=$id;

       
        // Db::name('report_log')->update($data[0]);

    }
  
    public function GetReport()
    {   

        $logwhere['hasdone']='0';
        $logwhere['issuccess']='1';

        $log=Db::name('report_log')->where($logwhere)->select();
        // dump($log);die;
        $catewhere['site']=2;
        $catewhere['level']=1;
        $catewhere['hasdone']=1;
        $category=Db::name('amazon_categor')->where($catewhere)->select();


        $GetReport=new GetReportSample;
        foreach ($log as $key => $value){

            foreach ($category as $k => $v) {
                if($v['cid']==$value['cid']){
                    echo 'cid为"'.$v['cid'].'已存在';
                    $updatelog['hasdone']='1';
                    Db::name('report_log')->where('id',$value['id'])->update($updatelog);
                    die;
                }
            }

           // $GeneratedReportId=$value['GeneratedReportId'];
           $GeneratedReportId='12084221879017843';
           $xml=$GetReport->index($GeneratedReportId);
           $xml=xmlToarr($xml);
           // dump($xml);die;
           $this->save($xml);
           die;
           // sleep(10);

        }
        
        // dump($result);
        // $result=xmlToarr($result);
        // dump($result);
        // $this->save();
    }

    public function save($xml)
    {
        // $xmlobj=new Xml();
        // $xml=$xmlobj->index();
        // dump($xml);
        // DIE;
        // $xml=xmlToarr($xml);die;
        // dump($xml['Node']);die;
        $browseNodeId=$xml['Node'][0]['browseNodeId'];
        // level 1
        // $xml=json_decode($xml,true);
        // dump($xml['browseElements']);die;
        // level 1 end
        echo '总共'.count($xml['Node']).'条<br>';
        $data=array();
        // $k=12;
        // $xml['Node']
        $k=0;
        $i=0;
        $error=array();
        $j=0;
        foreach ($xml['Node'] as $key => $value) {
           if($key!=0){
              $data[$key]['cid']=$value['browseNodeId'];

              $arrpid=explode(',',$value['browsePathById']);
              $data[$key]['level']=count($arrpid)-1;
              $countpid=count($arrpid)-2;
              if($data[$key]['level']==1){
                $data[$key]['name']=$value['browseNodeStoreContextName'];
              }else{
                $data[$key]['name']=$value['browseNodeName'];
              }
              $data[$key]['parent_id']=$arrpid[$countpid];
              $data[$key]['date']=time();
              $data[$key]['site']=3;
              $data[$key]['browsePathById']=$value['browsePathById'];

              // 如果有子分类
              if($value['hasChildren']!='false'){
                $data[$key]['leaf']=0;
              }else{
                $data[$key]['leaf']=1;
              }
              if(!empty($value['productTypeDefinitions'])){
                $data[$key]['productTypeDefinitions']=$value['productTypeDefinitions'];
              }
              // $k++;
              $ss=$data[$key];
              unset($ss['date']);
              // $ss=Db::name('amazon_categor')->where($ss)->find();
              // if($ss){
              //   $error[$key]['data']=$data[$key];
              //   $error[$key]['copy']=$ss;
              //   $i++;
              // }else{

                $ifsuccess=Db::name('amazon_categor')->insert($data[$key]);
                if(!$ifsuccess){
                    $j++;
                }
                $k++;

                
              // }
           }
        }
        echo '......................................<br>';
        echo  '来源:'.$browseNodeId.'<br>';
        echo '总共'.count($xml['Node']).'条<br>';
        echo '录入'.$k.'条<br>';
        echo '已存在'.$i.'条<br>';
        echo '失败'.$j.'条';
        dump($error);
        // 避免重复
        $hasdone['hasdone']='1';
        Db::name('amazon_categor')->where('cid',$browseNodeId)->update($hasdone);
        Db::name('report_log')->where('cid',$browseNodeId)->update($hasdone);
        
     

        // 查询
        // Db::name('amazon_category')->getLastSql();

       
    }
    public function chuli()
    {
     
        // $where['level']='2';
        // $data['2']=Db::name('amazon_categor')->where($where)->select();
        $where['level']=array('gt','1');
        $where['pid']=0;
        $where['site']=3;

        $data=Db::name('amazon_categor')->where($where)->limit(1000)->select();
        // dump($data);die;
     
        $update=array();                   
        foreach ($data as $key => $value){
          $id=Db::name('amazon_categor')->where('cid',$value['parent_id'])->find();

          $update[$key]['id']=$value['id'];
          $update[$key]['pid']=$id['id'];
       
          
        }
            // dump($update);die;
            foreach ($update as $key => $value){

                Db::name('amazon_categor')->update($value);
            }

    }


    public function category()
    {
        
    }
}
	


