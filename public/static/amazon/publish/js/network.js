/**
 * Created by Administrator on 2016/8/2.
 */
(function($){
    $.fn.selectNetworkPic = function(opts){
        var defaults ={
                network_pic_nums: 10, // 网络图片数量
                crawl: false, // 是否保存网络图片到服务器
                url: "",
                type: "POST",
                data: {},
                dataType: "json",
                ensure_picture_fun: null, //上传完成后外部调用函数
                before_check: function(){
                    if($(".shop-info").find("span").eq(0).text() == "Wish"){
                        var sum = 0;
                        $(".wish-sku-pic").each(function(){
                            if($(this).attr("src")) sum += 1;
                        });
                        $("#feed_img").find("img").each(function(){
                            if($(this).attr("src")) sum += 1;
                        });
                        return !(sum >= 20)
                    }else{
                        return true
                    }
                }
            },
        options = $.extend(defaults, opts),
        modal_trigger,
        upp_network_modal = '<div class="modal fade" id="upp-network-picture-modal" tabindex="-1" role="dialog" '+
                                            'aria-labelledby="myModalLabel" aria-hidden="true">'+
                        '<div class="modal-dialog modal-lg">'+
                            '<div class="modal-content">'+
                                '<div class="modal-header">'+
                                   ' <button type="button" class="close" data-dismiss="modal" aria-hidden="true"> &times;'+
                                    '</button>'+
                                   '<h3 class="modal-title" id="myModalLabel">网络图片选取</h3>'+
                                '</div>'+
                                '<div class="modal-body">'+
                                    '<div class="loading-refer"><img src="https://static.actneed.com/static/image/spinner.gif" ></div>'+
                                    '<div class="no-refer-tip"></div>'+
                                    '<div class="refer-info-content"></div>'+
                                '</div>'+
                                '<div class="modal-footer">'+
                                    '<button type="button" class="btn btn-default" data-dismiss="modal">关闭'+
                                    '</button>'+
                                    '<button type="button" class="btn btn-primary" id="upp-network-pic">上传'+
                                    '</button>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                    '</div>';
        this.each(function(){
            var _this = $(this);
            var networkObj = {
                init: function(){
                    networkObj.init_modal();
                    _this.on("click", networkObj.show_network_modal);
                },
                init_modal: function(){
                    var network_modal = $("#upp-network-picture-modal");
                    if(!network_modal.length){
                        $("body").append(upp_network_modal);
                    }
                },
                show_network_modal: function(){
                    modal_trigger = $(this);
                    if(!options.before_check() && !modal_trigger.closest("td").find("img").attr("src")){
                        Inform.show("产品图片和变体图片最多只能添加20张");
                        return
                    }
                    var network_modal = $("#upp-network-picture-modal"),
                        net_url = '<form class="form-horizontal">';
                    for(var i =1; i<options.network_pic_nums+1; i++){
                        net_url += '<div class="form-group">'+
                                        '<label for="url'+i+'" class="col-md-1 col-md-offset-1 control-label upp-url">链接'+i+'</label>'+
                                        '<div class="col-md-8">'+
                                            '<input type="url" class="form-control url" id="url'+i+'" placeholder="链接'+i+'">'+
                                        '</div>'+
                                        '<div class="col-md-2 upp-pre-img">'+
                                            '<img type="url" class="network-pic-pro" data-id="url'+i+'" ' +
                                            'src="/static/image/add.png">'+
                                       '</div>'+
                                    '</div>';
                    }
                    net_url += '</form>';
                    network_modal.find(".modal-body").html(net_url);
                    network_modal.modal("show");
                    $("#upp-network-pic").unbind().click(networkObj.network_picture_save);
                    network_modal.find("input").on("blur", networkObj.netwrok_picture_pre);
                },
                network_picture_save: function(){
                    var picture_urls = [];
                    var $this = $(this);
                    $("#upp-network-picture-modal").find(".url").each(function(k, v){
                        var picture_url = $(v).val(),
                            text = $(v).closest(".form-group").find(".uploaded-tip");
                        /*if($(".shop-info").find("span").eq(0).text() == "Joom"){ // 判断产品图片和变体图片中不同的图片最多只能添加20张
                            var sum = 0,
                                sku_img_arry = [],
                                pro_img_arry = [];
                            $(".wish-sku-pic").each(function(){
                                if($(this).attr("src") && sku_img_arry.indexOf($(this).attr("src")) === -1 && pro_img_arry.indexOf($(this).attr("src")) === -1){
                                    sku_img_arry.push($(this).attr("src"));
                                }
                            });
                            $("#feed_img").find("img").each(function(){
                                if($(this).attr("src") && pro_img_arry.indexOf($(this).attr("src")) === -1 && sku_img_arry.indexOf($(this).attr("src")) === -1){
                                    pro_img_arry.push($(this).attr("src"));
                                }
                            });
                            sum = sku_img_arry.length + pro_img_arry.length;
                            console.log('Joom',sum);

                            if(sum >= 20 && (!($.inArray(picture_url,sku_img_arry) !== -1) && !($.inArray(picture_url,pro_img_arry) !== -1))){
                                Inform.show("产品图片和变体图片中不同的图片最多只能添加20张，不包含重复图片");
                                return;
                            }
                        }*/
                        if(picture_url && picture_url != ""){
                            if(text.length)text.remove();
                            $(v).closest(".form-group").find("img").attr("src","https://static.actneed.com/static/image/spinner.gif").show();
                            picture_urls.push(picture_url);
                        }
                    });
                    //Inform.disable();
                    //Inform.show("", true, "正在抓取图片...");
                    if(options.crawl){
                        options.data.p_urls = JSON.stringify(picture_urls);
                        options.data.special = 1;
                        $.ajax({
                            url: options.url,
                            type: options.type,
                            data: options.data,
                            dataType: options.dataType,
                            success: function(data){
                                if(data.status == 1){
                                    //Inform.enable();
                                    //Inform.show(data.message);
                                    var pictures = data["pictures"];
                                    if(pictures.length){
                                        $("#upp-network-picture-modal").find(".url").each(function(k, v){
                                            var src = $(v).closest(".form-group").find("img").attr("src");
                                            if(src==="https://static.actneed.com/static/image/spinner.gif"&&$(v).val()!=""){
                                                var success = $("<div/>", {"class": "uploaded-tip upload-success"}).text("上传成功");
                                                $(v).closest(".form-group").find("img").hide();
                                                $(v).closest(".form-group").find(".upp-pre-img").append(success);
                                                $(v).val("");
                                            }
                                        });
                                        options.ensure_picture_fun&&options.ensure_picture_fun(pictures, modal_trigger);
                                    }else{
                                        $("#upp-network-picture-modal").find(".url").each(function(k, v){
                                            var src = $(v).closest(".form-group").find("img").attr("src"),
                                                failed = $(v).closest(".form-group").find(".uploaded-tip");
                                            if(src==="https://static.actneed.com/static/image/spinner.gif"&&$(v).val()!=""){
                                                if(!failed.length){
                                                    var failure = $("<div/>", {"class": "uploaded-tip upload-failed"}).text("上传失败");
                                                    $(v).closest(".form-group").find("img").hide();
                                                    $(v).closest(".form-group").find(".upp-pre-img").append(failure);
                                                }
                                            }
                                        });
                                    }
                                }else{
                                    Inform.enable();
                                    Inform.show("操作失败");
                                }
                            },
                            error: function(){
                                Inform.enable();
                                Inform.show("上传操作失败");
                            }
                        });
                    }else{
                        //Inform.enable();
                        //Inform.show("上传成功！");
                        $("#upp-network-picture-modal").find(".url").each(function(k, v){
                            var src = $(v).closest(".form-group").find("img").attr("src");
                            if(src==="https://static.actneed.com/static/image/spinner.gif"&&$(v).val()!=""){
                                var success = $("<div/>", {"class": "uploaded-tip upload-success"}).text("上传成功");
                                $(v).closest(".form-group").find("img").hide();
                                $(v).closest(".form-group").find(".upp-pre-img").append(success);
                                $(v).val("");
                            }
                        });
                        options.ensure_picture_fun&&options.ensure_picture_fun(picture_urls, modal_trigger);
                    }
                },
                netwrok_picture_pre: function(){
                    // 将用户输入的URL，直接以缩图的方式预览
                    var $this = $(this),
                        img = $this.closest(".form-group").find("img"),
                        v = $this.val();
                    $this.closest(".form-group").find(".uploaded-tip").remove();
                    if(v){
                        img.attr("src", v).show();
                    }else{
                        img.attr("src", "/static/image/add.png").show();
                    }
                }
            };
            networkObj.init();
        })
    }
})(jQuery);
