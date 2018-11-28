/**
 * Created by GF on 2016/10/10.
 */
(function($){
    $.judge_browser = function(options, callback){
        var ops = options || {},
            browser = navigator.appName,
            version = navigator.appVersion.split(";")[1];
        if(version){
            version = version.replace(/[ ]/g,"");
        }else{
            version = "";
        }
        var create_modal = function(){
                if(is_ie()){
                    if($("#browser-dynamic-css").length == 0){
                        $('<style id="browser-dynamic-css" type="text/css">').appendTo("head");
                        $("#browser-dynamic-css").text(
                            '#browser-tip-modal{position: fixed;top: 50%;left: 50%;height: 500px;width: 800px;margin: -330px 0 0 -400px;z-index: 2000;visibility: visible;border:1px solid #ccc;background-color:#fff;}'+
                            '.browser-tip-overlay{position: fixed;width: 100%;height: 100%;visibility: hidden;top: 0;left: 0;z-index: 1000;opacity: 0;background: rgba(0,0,0,.8);transition: all 0.3s;}'+
                            '#browser-tip-modal ~ .browser-tip-overlay {opacity: 1;visibility: visible;}' +
                            '#browser-ul{padding: 40px 0 0 50px;}'+
                            '#browser-ul li{display: inline-block;list-style-type: none;width: 150px;height: 200px;text-align: center;border: 1px solid #ddd;margin-left:20px;padding-top:15px;}'+
                            '#browser-ul span{margin-top:20px;display:block;}' +
                            '#browser-ul img{width:120px;height:120px;}' +
                            '#browser-ul a{color:#808080}' +
                            '.close-browser-modal{position: absolute;right: 10px;top: 7px;font-sutilize: 20px;color: #6f6f6f;}' +
                            '#update-tip-div{padding: 20px 0 0 70px;}' +
                            '#update-tip-div span{font-size:16px;font-weight:normal;}' +
                            '#update-tip-div ul{padding: 10px 0 0 18px;}' +
                            '#update-tip-div li{color:#808080;line-height:20px !important;list-style-type: disc !important;}'
                        )
                    }
                    if($(".browser-tip-overlay").length == 0){
                        $("body").prepend('<div class="browser-tip-overlay"></div>');
                    }
                    if($("#browser-tip-modal").length == 0){
                        var modal_str = $("<div>").attr("id", "browser-tip-modal"),
                            browser_str = $("<ul>").attr("id", "browser-ul"),
                            browser_map = {
                                "Google Chrome": ["/static/image/browser/chrome.png", ""],
                                "Firefox": ["/static/image/browser/firefox.png", ""],
                                "Opera": ["/static/image/browser/opera.png", ""],
                                "Safari": ["/static/image/browser/safari.png", ""]
                            };
                        browser_map["Google Chrome"][1] = "https://www.baidu.com/s?wd=chrome";
                        browser_map["Firefox"][1] = "https://www.baidu.com/s?wd=firefox";
                        browser_map["Opera"][1] = "https://www.baidu.com/s?wd=opera";
                        browser_map["Safari"][1] = "https://www.baidu.com/s?wd=safari";
                        for(var i in browser_map){
                            browser_str.append('<li><a href="'+browser_map[i][1]+'" target="_blank"><img src="'+browser_map[i][0]+'"><span>'+i+'</span></a></li>')
                        }
                        $("body").prepend(modal_str.append(
                                '<a href="javascript:void(0);" class="close-browser-modal">&times;</a>' +
                                '<div style="text-align:center;font-size:18px;color:#808080;padding-top:35px;">很抱歉，您的浏览器版本过低，我们推荐您使用以下浏览器。</div>' +
                                '<div style="padding-top: 10px;font-size: 15px;color: #a0a0a0;text-align: center;">点击下方图标可下载</div>',
                                browser_str,
                                '<div id="update-tip-div"><span>为什么要使用以上浏览器？</span>' +
                                '<ul><li>提升浏览速度</li><li>支持最新的技术</li><li>提升安全性</li></ul>' +
                                '</div>'
                            )
                        );
                        $(".close-browser-modal").click(delete_modal);
                    }
                }
            },
            delete_modal = function(){
                var $modal = $("#browser-tip-modal"),
                    $overlay = $(".browser-tip-overlay");
                $modal.length > 0 && $modal.remove();
                $overlay.length > 0 && $overlay.remove();
            },
            is_ie = function(){
                return ((browser == "Microsoft Internet Explorer" && (version == "MSIE6.0" || version == "MSIE7.0" || version == "MSIE8.0" || version == "MSIE10.0" || version == "MSIE11.0"))||(!!window.ActiveXObject || "ActiveXObject" in window))
            };
        create_modal();
    }
})(jQuery);