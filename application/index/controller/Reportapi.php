<?php
namespace app\index\controller;

use think\Db;
use think\Loader;
use think\Controller;
use app\index\model\Report;


class Reportapi  extends Permission
{
   
    public function index()
    {
        
    }

    // 获取分类树
    public function report()
    {
        // 格式:array("Id" => array('A1AM78C64UM0Y8'));
        
        $user = Db::name('index_user')->where('user_id',$_SESSION['module']['user_id'])->find();
        // Alexa Skills
        // $parameters['Marketplace'] = 'A1F83G8C2ARO7P';
        // A1PA6795UKMFR9,A1RKKUPIHCS9HS,A13V1IB3VIYZZH,A1F83G8C2ARO7P,APJ6JRA9NG5V4
        // 请求类型,格式：_GET_XML_BROWSE_TREE_DATA_；
        // 13727921011
        $parameters['Merchant'] = $user['Merchant'];

        $parameters['ReportType'] = '_GET_XML_BROWSE_TREE_DATA_';
        $parameters['ReportOptions'] = 'MarketplaceId=A1PA6795UKMFR9';

        $service = array(
                        'KEY_ID' => $user['awsAccessKeyId'],
                        'ACCESS_KEY' => $user['awsSecretAcessKey'],
                        'NAME' => $user['APPLICATION_NAME'],
                        'VERSION' => APPLICATION_VERSION,
                    );

        $report = new report($parameters,$service);

        $data = $report->reportFile();
        // 10

        // $data = xmlToarr($data);
        // dump($data);
        // $insert['site']=6;
        // Db::name('amazon_categor')->
    }
    public function fread()
    {
        $my_file = ROOT_PATH.'public\static\amazon.txt';
        $handle = fopen($my_file,'r');
       
        $data = fread($handle,filesize($my_file));
        
        $data = xmlToarr($data);

        $this->save($data);
        // var_dump($data);
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
        // echo count($xml['Node']);
        // $xml=json_decode($xml,true);
        dump($xml);die;
        // level 1 end
        echo '总共'.count($xml['Node']).'条<br>';
        $data=array();
        // $k=12;
        // $xml['Node']
        $k=0;
        $i=0;
        $error=array();
        $j=0;
        foreach ($xml['Node'] as $key => $value) 
        {
           // if($key!=0){
              $data[$key]['cid']=$value['browseNodeId'];

              $arrpid=explode(',',$value['browsePathById']);
              $data[$key]['level']=count($arrpid)-1;
              $countpid=count($arrpid)-2;
              if($data[$key]['level']==1){
                if(!empty($value['browseNodeStoreContextName']))
                {
                    $data[$key]['name']=$value['browseNodeStoreContextName'];    
                }else{
                    if(!empty($value['browsePathByName']))
                    {

                        $arr[$i]['name']=$value['browsePathByName'];
                    }else{
                        $arr[$i]['name']=$value['browseNodeName'];
                    } 
                }
              }else{
                $data[$key]['name']=$value['browseNodeName'];
              }
              $data[$key]['parent_id']=$arrpid[$countpid];
              $data[$key]['date']=time();
              $data[$key]['site']=6;
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
              // }
                $ifsuccess=Db::name('amazon_categor')->insert($data[$key]);
                if(!$ifsuccess){
                    $j++;
                }
                $k++;
              // }
           // }
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
     
        // $where['id']=array('gt','246091');
        // $where['pid']=0;
        // $where['site']=6;

        // $data=Db::name('amazon_categor')->where($where)->select();
        // Db::name('amazon_categor')->where('id','>',246091)->delete();
        // echo count($data);
        // die;
        $data = array('1');
        while(!empty($data))
        {

            $where['level']=array('gt','1');
            // $where['level']=array('gt','2');
            $where['pid']=0;
            $where['site']=6;

            $data=Db::name('amazon_categor')->where($where)->limit(1000)->select();
            // echo Db::name('amazon_categor')->getLastSql();

            // dump($data);die;
         
            $update=array();  
            if(!empty($data))
            {
                foreach ($data as $key => $value)
                {
                  $id=Db::name('amazon_categor')->where('cid',$value['parent_id'])->find();

                  $update[$key]['id']=$value['id'];
                  // $update[$key]['pid']=6;
                  $update[$key]['pid']=$id['id'];
           
              
                }
                // dump($update);die;
                foreach ($update as $key => $value)
                {

                    Db::name('amazon_categor')->update($value);
                }
            }                 
            
        }

    }

    public function change()
    {
        // $my_file = ROOT_PATH.'public\static\amazon.txt';
        // $handle = fopen($my_file,'r');
       
        // $data = fread($handle,filesize($my_file));
        
        // $data = xmlToarr($data);

        // $data=$data['Node'];
        // dump($data[59929]);die;
        die;
        $arr=array();
        $where=array();
        $where['level'] = 1;
        $where['site'] = 6;
        $which = Db::name('amazon_categor')->where($where)->select();
        dump($which);die;
        $i = 0;
        foreach ($data as $key => $value) {
             
                $arrpid=explode(',',$value['browsePathById']);
                $level = count($arrpid)-1;
                if($level == 1)
                {
                    foreach ($which as $k => $v) {
                        if($v['cid'] == $value['browseNodeId'])
                        {
                            $arr[$i]['id']=$v['id'];
                            $arr[$i]['pid']=6;
                            // $arr[$i]['aid']=$key;
                            if(!empty($value['browsePathByName']))
                            {

                                $arr[$i]['name']=$value['browsePathByName'];
                            }else{
                                $arr[$i]['name']=$value['browseNodeName'];
                            }


                            $i++;
                        }
                    }
                    
                }
        }
        foreach ($arr as $key => $value) {
            Db::name('amazon_categor')->update($value);
        }
        // dump($arr);
        
    }

}
	