<?php
namespace app\index\controller;

use think\Db;
use think\Loader;
use think\Controller;
use MarketplaceWebService\Samples\RequestReportSample;
use MarketplaceWebService\Samples\GetReportRequestListSample;
use MarketplaceWebService\Samples\GetReportSample;
use MarketplaceWebService\Samples\GetFeedSubmissionListSample;
use app\index\model\SubmitFeed;
use app\index\model\Orders;
use app\index\model\Report;


class Home  extends Permission
{
  
    
    public function index()
    {

        return $this->fetch();

    }

    public function test(){
       

    }
   
    public function submit()
    {
         // var_dump(input('post.'));

         $data = input('post.');
        // 50262017836
         // dump($data);
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

         $submitdata[0]=$data['data'];
         $submitdata[0]['searchTerms']=$searchTerms;
         $submitdata[0]['bulletPoint']=$bulletPoint;
         
         $submitdata[0]['date']=time();


         $url = savePicture();
         $imgorder = array('mainimg','img2','img3','img4');
         if(!$url){
           return '图片格式出错';
         }
  
         foreach ($url as $key => $value) {
            if($key>4){
              continue;
            }
           // $submitdata[$imgorder[$key]]=$value;
           $submitdata[0][$imgorder[$key]]='http://bpic.588ku.com/element_origin_min_pic/18/06/08/e29977141f6af13c01865c7120a217c4.jpg';
         }

        // Db::name('amazon_public')->insert($submitdata);
        $submitdata[0]['searchTerms']=$data['searchTerms'];
        $submitdata[0]['bulletPoint']=$data['bulletPoint'];
        $submitdata[0]['ProductType']=$data['ProductType'];
    
        $userIdentify=Db::name('index_user')->where('user_id',$_SESSION['module']['user_id'])->find();

        $parameters['MarketplaceIdList'] = array("Id" => array('ATVPDKIKX0DER'));
        $parameters['Merchant'] = $userIdentify['Merchant'];
        $parameters['PurgeAndReplace'] = false;

        // 变体
        $submitdata[0]['Size']='X-Small';
        $submitdata[0]['Color']='red';

        // 身份信息
        $service = array(
                        'KEY_ID' => $userIdentify['awsAccessKeyId'],
                        'ACCESS_KEY' => $userIdentify['awsSecretAcessKey'],
                        'NAME' => $userIdentify['APPLICATION_NAME'],
                        'VERSION' => APPLICATION_VERSION,
                    );


        $submitFeed = new SubmitFeed($parameters,$service,$submitdata);
     
        $submitFeed->submitFile();
        
    }

   



    
}
	


