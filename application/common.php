<?php

function arrayToString($arr) { 
if (is_array($arr)){ 
return implode('+', array_map('arrayToString', $arr)); 
} 
return $arr; 
} 
/** 
* @method 多维数组变成一维数组 
* @staticvar array $result_array 
* @param type $array 
* @return type $array 
* @author yanhuixian 
*/
function multi2array($array) { 
static $result_array = array(); 
foreach ($array as $key => $value) { 
if (is_array($value)) { 
array_multi2array($value); 
} 
else
$result_array[$key] = $value; 
} 
return $result_array; 
}
//get
function httpGet($url) {
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_TIMEOUT, 500);
    // 为保证第三方服务器与微信服务器之间数据传输的安全性，所有微信接口采用https方式调用，必须使用下面2行代码打开ssl安全校验。
    // 如果在部署过程中代码在此处验证失败，请到 http://curl.haxx.se/ca/cacert.pem 下载新的证书判别文件。
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
    curl_setopt($curl, CURLOPT_URL, $url);

    $res = curl_exec($curl);
    curl_close($curl);

    return $res;
}

//post
function httpPost($url, $data) {
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_TIMEOUT, 50);
    // 为保证第三方服务器与微信服务器之间数据传输的安全性，所有微信接口采用https方式调用，必须使用下面2行代码打开ssl安全校验。
    // 如果在部署过程中代码在此处验证失败，请到 http://curl.haxx.se/ca/cacert.pem 下载新的证书判别文件。
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
    curl_setopt($curl, CURLOPT_URL, $url);

    if ($data){
        curl_setopt($curl, CURLOPT_POST, 1);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
    }

    $res = curl_exec($curl);
    curl_close($curl);

    return $res;
}


//安全URL编码
function base64_encode_new($data) {
    return str_replace(array('+', '/', '='), array('-', '_', ''), base64_encode(serialize($data)));
}

//安全URL解码
function base64_decode_new($string) {
    $data = str_replace(array('-', '_'), array('+', '/'), $string);
    $mod4 = strlen($data) % 4;
    ($mod4) && $data .= substr('====', $mod4);
    return unserialize(base64_decode($data));
}

//rc4对称加密&base64编码
function rc4_base64_encode($str) {
    return base64_encode_new(rc4_code(C('CODE_KEY'), $str));
}

//rc4对称解密&base64解码
function rc4_base64_decode($str) {
    return rc4_code(C('CODE_KEY'), base64_decode_new($str));
}

/*//log记录
function __log($str) {
    $data = file_get_contents(__DIR__ . '/log.txt');
    file_put_contents(__DIR__ . '/log.txt', "====" . date('Y-m-d H:i:s', time()) . "====\n" .  $str . "\n\n" . $data);
}*/

//



/**
 * [SendMail 邮件发送]
 * @param [type] $address  [description]
 * @param [type] $title    [description]
 * @param [type] $message  [description]
 * @param [type] $from     [description]
 * @param [type] $fromname [description]
 * @param [type] $smtp     [description]
 * @param [type] $username [description]
 * @param [type] $password [description]
 */
function SendMail($address)
{
    vendor('phpmailer.PHPMailerAutoload');
    //vendor('PHPMailer.class#PHPMailer');
    $mail = new \PHPMailer();          
     // 设置PHPMailer使用SMTP服务器发送Email
    $mail->IsSMTP();                
    // 设置邮件的字符编码，若不指定，则为'UTF-8'
    $mail->CharSet='UTF-8';         
    // 添加收件人地址，可以多次使用来添加多个收件人
    $mail->AddAddress($address); 

    $data = \think\Db::name('emailconfig')->where('email','email')->find();
            $title = $data['title'];
            $message = $data['content'];
            $from = $data['from_email'];
            $fromname = $data['from_name'];
            $smtp = $data['smtp'];
            $username = $data['username'];
            $password = $data['password'];   
    // 设置邮件正文
    $mail->Body=$message;           
    // 设置邮件头的From字段。
    $mail->From=$from;  
    // 设置发件人名字
    $mail->FromName=$fromname;  
    // 设置邮件标题
    $mail->Subject=$title;          
    // 设置SMTP服务器。
    $mail->Host=$smtp;
    // 设置为"需要验证" ThinkPHP 的config方法读取配置文件
    $mail->SMTPAuth=true;
    //设置html发送格式
    $mail->isHTML(true);           
    // 设置用户名和密码。
    $mail->Username=$username;
    $mail->Password=$password; 
    // 发送邮件。
    return($mail->Send());
}


/**
 * 阿里大鱼短信发送
 * @param [type] $appkey    [description]
 * @param [type] $secretKey [description]
 * @param [type] $type      [description]
 * @param [type] $name      [description]
 * @param [type] $param     [description]
 * @param [type] $phone     [description]
 * @param [type] $code      [description]
 * @param [type] $data      [description]
 */
function SendSms($param,$phone)
{
    // 配置信息
    import('dayu.top.TopClient');
    import('dayu.top.TopLogger');
    import('dayu.top.request.AlibabaAliqinFcSmsNumSendRequest');
    import('dayu.top.ResultSet');
    import('dayu.top.RequestCheckUtil');

    //获取短信配置
    $data = \think\Db::name('smsconfig')->where('sms','sms')->find();
            $appkey = $data['appkey'];
            $secretkey = $data['secretkey'];
            $type = $data['type'];
            $name = $data['name'];
            $code = $data['code'];
    
    $c = new \TopClient();
    $c ->appkey = $appkey;
    $c ->secretKey = $secretkey;
    
    $req = new \AlibabaAliqinFcSmsNumSendRequest();
    //公共回传参数，在“消息返回”中会透传回该参数。非必须
    $req ->setExtend("");
    //短信类型，传入值请填写normal
    $req ->setSmsType($type);
    //短信签名，传入的短信签名必须是在阿里大于“管理中心-验证码/短信通知/推广短信-配置短信签名”中的可用签名。
    $req ->setSmsFreeSignName($name);
    //短信模板变量，传参规则{"key":"value"}，key的名字须和申请模板中的变量名一致，多个变量之间以逗号隔开。
    $req ->setSmsParam($param);
    //短信接收号码。支持单个或多个手机号码，传入号码为11位手机号码，不能加0或+86。群发短信需传入多个号码，以英文逗号分隔，一次调用最多传入200个号码。
    $req ->setRecNum($phone);
    //短信模板ID，传入的模板必须是在阿里大于“管理中心-短信模板管理”中的可用模板。
    $req ->setSmsTemplateCode($code);
    //发送
    

    $resp = $c ->execute($req);
}


/**
 * 替换手机号码中间四位数字
 * @param  [type] $str [description]
 * @return [type]      [description]
 */
function hide_phone($str){
    $resstr = substr_replace($str,'****',3,4);  
    return $resstr;  
}

// 对密码进行加密
function  encrypt_password($password){

    $pass='250'.md5(md5($password)).'520';
    return $pass;
}


function xmlToArray($xml){
 
 //禁止引用外部xml实体 
 
libxml_disable_entity_loader(true); 
 
$xmlstring = simplexml_load_string($xml, 'SimpleXMLElement', LIBXML_NOCDATA,'ns2',TRUE); 
 
$val = json_decode(json_encode($xmlstring),true); 
 
return $val; 
 
}

/**
 * XML编码
 * @param mixed $data 数据 
 * @param string $root 根节点名
 * @param string $item 数字索引的子节点名
 * @param string $attr 根节点属性
 * @param string $id   数字索引子节点key转换的属性名
 * @param string $encoding 数据编码
 * return string
 */


function xml_encode($data, $root='think', $item='item', $attr='', $id='id', $encoding='utf-8') {
    if(is_array($attr)){
        $_attr = array();
        foreach ($attr as $key => $value) {
            $_attr[] = "{$key}=\"{$value}\"";
        }
        $attr = implode(' ', $_attr);
    }
    $attr   = trim($attr);
    $attr   = empty($attr) ? '' : " {$attr}";
    $xml    = "<?xml version=\"1.0\" encoding=\"{$encoding}\"?>";
    $xml   .= "<{$root}{$attr}>";
    $xml   .= data_to_xml($data, $item, $id);
    $xml   .= "</{$root}>";
    return $xml;
}
/**
 * 数据XML编码
 * @param mixed  $data 数据
 * @param string $item 数字索引时的节点名称
 * @param string $id   数字索引key转换为的属性名
 * return string
 */
function data_to_xml($data, $item='item', $id='id') {
    $xml = $attr = '';
    foreach ($data as $key => $val) {
        if(is_numeric($key)){
            $id && $attr = " {$id}=\"{$key}\"";
            $key  = $item;
        }
        $xml    .=  "<{$key}{$attr}>";
        $xml    .=  (is_array($val) || is_object($val)) ? data_to_xml($val, $item, $id) : $val;
        $xml    .=  "</{$key}>";
    }
    return $xml;
}


function xml_to_array($xml){
    $reg="/<(\\w+)[^>]*?>([\\x00-\\xFF]*?)<\\/\\1>/";
    if(preg_match_all($reg,$xml,$matches)){
        $count=count($matches[0]);
        $arr=array();

        for($i=0;$i<$count;$i++){
            $key=$matches[1][$i];
            $val=xml_to_array($matches[2][$i]);//递归

            if(array_key_exists($key,$arr)){

                if(is_array($arr($key))){
                    if(!array_key_exists(0, $arr[$key])){
                        $arr[$key]=array($arr[$key]);
                    }
                }else{
                    $arr[$key]=array($arr[$key]);
                }
                $arr[$key][]=$val;
            }else{
                $arr[$key]=$val;
            }
        }
        return $arr;
    }else{
        return $xml;
    }
}
// 类似XPATH的数组选择器
function xml_array_select($xml){
  $arrpath=trim($arrpath,'/');
  if(!$arrpath) return $arr;
  $self='xml_array_select';
  $pos=strpos($arrpath,'/');
  $pos=$pos?$pos:strlen($arrpath);
  $curpath=substr($arrpath,0,$pos);
  $next=substr($arrpath,$pos);

  if(preg_match("/\\[(\\d+)\\]$/",$curpath,$predicath)){
    $curpath=substr($curpath,0,strpos($curpath,"[{$predicate[1]}]"));
    $result=$arr[$curpath][$predicate[1]];
  }else{
    $result=$arr[$curpath];
  }

  if(is_array($arr) && !array_key_exists($curpath,$arr)){
    die('key is not exists:'.$curpath);
  }
  return $self($result,$next);
}

// 如果输入的数组是全数字键，则将元素值依次传输到$callback,否则将吱声传输给$callback
function xml_array_each($arr,$callback){
    if(func_num_args()<2){
        die('parameters error');
    }
    if(!is_array($arr)){
        die('parameter 1 should be an array!');
    }
    if(!is_callable($callback)){
        die('parameter 2 should be an function!');
    }
    $keys=array_keys($arr);
    $isok=true;
    foreach ($keys as $key) {
        if(!is_int($key)){
            $isok=false;
            break;
        }
    }
    if($isok){
        foreach ($arr as $val) {
            $result[]=$calssback($val);
        }
    }else{
            $result[]=$callback($arr);
        }
    
    return $result;
}


function  classify_crumbs($classify,$classify_id,$level=2){
    dump($classify_id);
    dump($classify);
    $data=array();
    $data[]=$classify['classify_name'];
    foreach ($classify['list'] as $key => $value) {
        if($classify_id==$value['classify_id']){

        }
    }
    die;
    // return $result;

}
/** 
 * 数组 转 对象 
 * 
 * @param array $arr 数组 
 * @return object 
 */  
function array_to_object($arr) {  
    if (gettype($arr) != 'array') {  
        return;  
    }  
    foreach ($arr as $k => $v) {  
        if (gettype($v) == 'array' || getType($v) == 'object') {  
            $arr[$k] = (object)array_to_object($v);  
        }  
    }  
   
    return (object)$arr;  
}


/**
 * @param $xml
 * @return mixed
 */
function  xmlToarr($xml){
   
    
    $xmlstr = preg_replace('/\sxmlns="(.*?)"/', ' _xmlns="${1}"', $xml);

    $xmlstr = preg_replace('/<(\/)?(\w+):(\w+)/', '<${1}${2}_${3}', $xmlstr);  
    $xmlstr = preg_replace('/(\w+):(\w+)="(.*?)"/', '${1}_${2}="${3}"', $xmlstr);  

    $xmlstr = preg_replace('/(\w+):(\w+)="(.*?)"/', '${1}_${2}="${3}"', $xmlstr);

    $xmlobj = simplexml_load_string($xmlstr);
    
     return $json = json_decode(json_encode($xmlobj), true);
  
}
 /**
 * $str Unicode编码后的字符串
 * $decoding 原始字符串的编码，默认GBK
 * $prefix 编码字符串的前缀，默认"&#"
 * $postfix 编码字符串的后缀，默认";"
 */
function foo($str) {
    $json = '{"foo":"' . $str . '"}';
    $d = json_decode($json, true);
     return    $str = $d['foo']; // 这个就是你想要的
}
// 尝试
function changearray($arr){

    $array=$arr;
    foreach ($arr as $k => $v) {
        if(is_array($v)){
            $v[$k]=changearray($v);
        }else{
             $array[$k]=foo($v);
        }
    }
    return $array;
}


// 制表符到数组，残缺版
function tabtoarr($str,$num='4'){
    $array=preg_split('/\s+/is',$str);
    $i=0;
    $k=0;
    $arr=array();

    foreach ($array as $key => $value) {
          if(!is_int($key/$num)){
            $arr[$i][$k]=$value;
            $k++;
          }else{
            $i++;
            $k=0;
            $arr[$i][$k]=$value;
            $k++;
          }
    }
    return $arr;
}




function getname($name) { 
 $urlqueue = "";
$contents = "";
$titles = "";
$str = "http://translate.google.cn/translate_a/t?client=t&;text=".$name."&;hl=zh-CN&;sl=en&;tl=zh-CN&;ie=UTF-8&;oe=UTF-8&;multires=1&;otf=1&;pc=1&;it=srcd_gms.1378&;ssel=4&;tsel=6&;sc=1";
ob_start(); 
readfile($str);
$result = ob_get_contents(); 
ob_end_clean();
preg_match_all('//[/[/[/"([/s/S]*?)/"/',$result,$match);

//$arr=json_decode($result,true);
$namenew = $match[1][0];
return $namenew;
}


// 保存图片
function savePicture()
{
    // dump($_FILES);
 
    foreach ($_FILES as $key => $value) 
    {
        // 允许上传的图片后缀
        // dump($value);die;
        // 记录每个存储的位置
        $fileurl=array();

        $num=count($value['name']);
        $allowedExts = array("gif", "jpeg", "jpg", "png");
        for ($i=0; $i < $num; $i++) 
        { 

            $temp = explode(".", $value["name"][$i]);
             // echo $value["size"][$i];
             $extension = end($temp);     // 获取文件后缀名

            if ((($value["type"][$i] == "image/gif")
            || ($value["type"][$i] == "image/jpeg")
            || ($value["type"][$i] == "image/jpg")
            || ($value["type"][$i] == "image/pjpeg")
            || ($value["type"][$i] == "image/x-png")
            || ($value["type"][$i] == "image/png"))
            && ($value["size"][$i] < 204800)   // 小于 200 kb
            && in_array($extension, $allowedExts))
            {
                // 判断是否提交错误
                if ($value["error"][$i] > 0)
                {
                    return $value["error"][$i];
                }else{
                    // 如果没有 upload 目录，你需要创建它，upload 目录权限为 777
                    // 如果 upload 目录不存在该文件则将文件上传到 upload 目录下
                    $tempurl=$value["tmp_name"][$i];
                    $dir=ROOT_PATH."public/uploads/".date('ymd',time());
                    if(!is_dir($dir))
                    {
                        mkdir($dir, 0777, true); 
                    }
                    $saveurl=$dir.'/'.time().$value["name"][$i];
                    $result=move_uploaded_file($tempurl,$saveurl);
                    if($result)
                    {
                        $fileurl[$i]=$saveurl;
                    }
                    
                }
            }else{
                return  false;
            }

        }
    }
    
    return $fileurl;  
       
      

}

// 简单判断是否索引数组
function _checkAssocArray($arr)
{
    $index = 0;
    foreach (array_keys($arr) as $key) {
        if ($index++ != $key) return false;
    }
    return true;
}


