<?php
// +----------------------------------------------------------------------
// | ThinkPHP [ WE CAN DO IT JUST THINK ]
// +----------------------------------------------------------------------
// | Copyright (c) 2006-2016 http://thinkphp.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: liu21st <liu21st@gmail.com>
// +----------------------------------------------------------------------

// [ 应用入口文件 ]

// 定义应用目录
define('APP_PATH', __DIR__ . '/../application/');
// define('EXTEND_PATH', '../extend/')
// define('APPLICATION_VERSION','2');
// define('AWS_ACCESS_KEY_ID', 'AKIAJ5U6OZJKLQSSDTEA');
// define('AWS_SECRET_ACCESS_KEY', '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');
// define('APPLICATION_NAME', 'miaoyanjun');
// define ('MERCHANT_ID', 'A2AUIKWDKUD2ZG');
// define ('MARKETPLACE_ID', 'ATVPDKIKX0DER');

set_include_path(get_include_path() . PATH_SEPARATOR . '../../.');

// 加载框架引导文件

require __DIR__ . '/../thinkphp/start.php';
    