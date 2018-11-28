模板消息开发
https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1433751277
1、获取  ACCESS_TOKEN
https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET
获取设置的行业信息
http请求方式：GET
https://api.weixin.qq.com/cgi-bin/template/get_industry?access_token=ACCESS_TOKEN
获得模板ID
http请求方式: POST
https://api.weixin.qq.com/cgi-bin/template/api_add_template?access_token=ACCESS_TOKEN
获取模板列表
http请求方式：GET
https://api.weixin.qq.com/cgi-bin/template/get_all_private_template?access_token=ACCESS_TOKEN

删除模板
http请求方式：POST
https://api.weixin.qq.com/cgi-bin/template/del_private_template?access_token=ACCESS_TOKEN

发送模板消息
http请求方式: POST
https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=ACCESS_TOKEN