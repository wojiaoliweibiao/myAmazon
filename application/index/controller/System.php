<?php
namespace app\index\controller;

use think\Db;
use think\Loader;
use think\Controller;


class System  extends Permission
{
    // North America:
   //信息模板设置
    public function Index()
    {
   
        return $this->fetch();

    } 
    // 电商平台账号
    public function ApiUser()
    {   
        return $this->fetch();


    }
    // 角色管理目录
    public function roleCatalog()
    {   
        return $this->fetch();


    }
    // 部门管理
    public function deptManage()
    {   
        return $this->fetch();


    }
    // 用户管理
    public function accountManage()
    {   
        return $this->fetch();


    }
    // 操作日志
    public function SysLog()
    {   
        return $this->fetch();


    }
    // 权限管理
    public function roleManage()
    {   
        return $this->fetch();


    }


}
	