<?php  
namespace app\index\controller;  
use think\Controller;  
class Wx extends Controller {  
    public function index()  
    {  
        return $this->fetch('This is for Wechat','utf-8');  
    }  
    //用户首次配置开发环境  
    public function echoStr()  
    {  
        $signature = $_GET["signature"];  
        $timestamp = $_GET["timestamp"];  
        $nonce     = $_GET["nonce"];  
        $echostr   = $_GET['echostr'];        
        $token     = 'skye';  
        $tmpArr    = array($token, $timestamp, $nonce);  
        sort($tmpArr, SORT_STRING);  
        $tmpStr    = implode( $tmpArr );  
        $tmpStr    = sha1( $tmpStr );  
        if( $tmpStr == $signature && $echostr)  
        {  
            echo $echostr;  
        }else{  
            $this->reposeMsg();  
        }  
    }  
  
    //回复消息  
    public function reposeMsg()  
    {  
        //1.接受数据  
        $postArr = $GLOBALS['HTTP_RAW_POST_DATA'];  //接受xml数据  
        //2.处理消息类型,推送消息  
        $postObj = simplexml_load_string( $postArr );   //将xml数据转化为对象  
        if( strtolower( $postObj->MsgType ) == 'event')  
        {     
            //关注公众号事件  
            if( strtolower( $postObj->Event ) == 'subscribe' )  
            {  
                $toUser    =  $postObj->FromUserName;  
                $fromUser  =  $postObj->ToUserName;  
                $time      =  time();  
                $msgType   =  'text';  
                $content   =  '你终于来啦,等你等的好辛苦啊!可尝试输入关键字:教程,Tel,wechat,1等000';  
                $template  =  "<xml>  
                        <ToUserName><![CDATA[%s]]></ToUserName>  
                        <FromUserName><![CDATA[%s]]></FromUserName>  
                        <CreateTime>%s</CreateTime>  
                        <MsgType><![CDATA[%s]]></MsgType>  
                        <Content><![CDATA[%s]]></Content>  
                        </xml>";  
                echo sprintf($template, $toUser, $fromUser, $time, $msgType, $content);  
            }  
    }  
  
    //回复文本信息  
    if( strtolower( $postObj->MsgType ) == 'text' && trim($postObj->Content)=='wechat')  
    {  
        $toUser = $postObj->FromUserName;  
        $fromUser = $postObj->ToUserName;  
        $arr = array( 
            array(  
                'title'=>'test',  
                'description'=>"just so so...",  
                'picUrl'=>'http://www.acting-man.com/blog/media/2014/11/secret-.jpg',  
                'url'=>'http://www.imooc.com',  
            ),  
            array(  
                'title'=>'hao123',  
                'description'=>"hao123 is very cool",  
                'picUrl'=>'https://www.baidu.com/img/bdlogo.png',  
                'url'=>'http://www.hao123.com',  
            ),  
            array(  
                'title'=>'qq',  
                'description'=>"qq is very cool",  
                'picUrl'=>'http://www.imooc.com/static/img/common/logo.png',  
                'url'=>'http://www.qq.com',  
            ),  
        );  
        $template = "<xml>  
                 <ToUserName><![CDATA[%s]]></ToUserName>  
                 <FromUserName><![CDATA[%s]]></FromUserName>  
                 <CreateTime>%s</CreateTime>  
                 <MsgType><![CDATA[%s]]></MsgType>  
                 <ArticleCount>".count($arr)."</ArticleCount>  
                 <Articles>";  
        foreach($arr as $k=>$v){  
            $template .="<item>  
                    <Title><![CDATA[".$v['title']."]]></Title>   
                    <Description><![CDATA[".$v['description']."]]></Description>  
                    <PicUrl><![CDATA[".$v['picUrl']."]]></PicUrl>  
                    <Url><![CDATA[".$v['url']."]]></Url>  
                    </item>";  
        }  
              
        $template .="</Articles>  
                 </xml> ";  
        echo sprintf($template, $toUser, $fromUser, time(), 'news');  
        //注意：进行多图文发送时，子图文个数不能超过10个  
        }else{  
            switch( trim( $postObj->Content ) )  
            {  
                case 1:  
                    $content = '你输入了个数字1';  
                    break;  
                case Tel:  
                    $content = '12345678901';  
                    break;  
                case '教程':  
                    $content = "<a href='www.imooc.com'>慕课网</a>";  
                    break;  
                case '博客':  
                    $content = "<a href='blog.abc.com'>测试微信</a>";  
                    break;  
                default:  
                    $content = '升级打造中...';  
                    break;  
            }  
            $toUser     =  $postObj->FromUserName;  
            $fromUser   =  $postObj->ToUserName;  
            $time       =  time();  
            $msgType    =  'text';  
            $template   =  "<xml>  
                        <ToUserName><![CDATA[%s]]></ToUserName>  
                        <FromUserName><![CDATA[%s]]></FromUserName>  
                        <CreateTime>%s</CreateTime>  
                        <MsgType><![CDATA[%s]]></MsgType>  
                            <Content><![CDATA[%s]]></Content>  
                        </xml>";  
            echo sprintf($template, $toUser, $fromUser, $time, $msgType, $content);  
        }  
    }  
}  