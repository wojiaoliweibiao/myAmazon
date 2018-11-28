/**
 * Created by Administrator on 2016/8/2.
 */
(function($, cp){
    $.fn.uploadPictures = function(opts){
        var wish_check = function(){
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
            },
            defaults = {
                list_style: true,
                btn_class: "btn-default",
                local_picture : true,
                network_picture: true,
                hosting_picture: true,
                claim_picture: false,
                button_text: '选择图片',
                local_picture_config:{before_check: wish_check},
                network_picture_config: {before_check: wish_check},
                hosting_picture_config:{before_check: wish_check},
                claim_picture_config: {before_check: wish_check}
            },
            options = $.extend(defaults, opts),
            list = '<div class="btn-group" role="group">'+
                        '<button class="btn '+options.btn_class+' dropdown-toggle" type="button" id="" data-toggle="dropdown" ' +
                        'aria-haspopup="true" aria-expanded="false"><span class="caret"></span>'+
                        '</button>'+
                        '<ul class="dropdown-menu" aria-labelledby="dropdownMenu1">'+
                        '<li>'+
                        '<a class="use-pro" href="javascript: void(0)" data-id="57bfaa8691b32711d9b1d157"></a>'+
                        '</li>'+
                        '</ul>'+
                    '</div>',
            local_picture_btn = '<li><a class="upp-btn upp-local-picture upp-list">'+options.local_picture_config.buttonText+'</a></li>',
            network_picture_btn = '<li><a class="upp-btn upp-network-picture upp-list">网络图片选取</a></li>',
            hosting_picture_btn = '<li><a class="upp-btn upp-hosting-picture upp-list">图片空间选取</a></li>',
            claim_picture_btn = '<li><a class="upp-btn upp-claim-picture upp-list">采集图片选取</a></li>',
            upload_btn = '<div class="btn-group" role="group">'+
                            '<button class="btn '+options.btn_class+' dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" ' +
                            'aria-haspopup="true" aria-expanded="false">'+ options.button_text +'<span class="caret"></span>'+
                            '</button>'+
                            '<ul class="dropdown-menu" aria-labelledby="dropdownMenu1">'+
                            '{0}'+
                            '</ul>'+
                        '</div>',
            local_picture_btn2 = '<div class="pull-left"><a class="upp-btn upp-local-picture"></a></div>',
            network_picture_btn2 = '<div class="m-left pull-left"><a class="upp-btn upp-network-picture" href="javascript:void(0)">网络图片选取</a></div>',
            hosting_picture_btn2 = '<div class="m-left pull-left"><a class="upp-btn upp-hosting-picture" href="javascript:void(0)">图片空间选取</a></div>',
            claim_picture_btn2 = '<div class="m-left pull-left"><a class="upp-btn upp-claim-picture" href="javascript:void(0)">采集图片选取</a></div>',
            upload_btn2 = '<div class="row"><div class="col-md-12" id="upload-btn2"></div></div>',
            network_modal = '<div class="modal fade" id="upp-network-picture-modal" tabindex="-1" role="dialog" '+
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
                                    '<button type="button" class="btn btn-primary" id="upp-network-pic">确认'+
                                    '</button>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                    '</div>',
            local_modal = '<div class="modal fade" id="upp-local-picture-modal" tabindex="-1" role="dialog">'+
                    '<div class="modal-dialog modal-lg" role="document">'+
                        '<div class="modal-content">'+
                            '<div class="modal-header">'+
                                '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;'+
                                '</button>'+
                                '<h3 class="modal-title">本地图片选取</h3>'+
                            '</div>'+
                            '<div class="modal-body" style="min-height: 500px;max-height: 500px;overflow: auto">'+
                                '<div id="upp-upload"></div>'+
                                //'<div id="success-tip" style="display: none;color: #eea236;">上传成功</div>'+
                            '</div>'+
                            '<div class="modal-footer">'+
                                '<button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>'+
                                '<button type="button" class="btn btn-primary" id="upp-ensure-up" >上传</button>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                '</div>',
            claim_pic_modal = '<div class="modal fade" id="upp-claim-picture-modal" tabindex="-1" role="dialog">'
                +'<div class="modal-dialog modal-lg" role="document">'
                +'<div class="modal-content">'
                +'<div class="modal-header">'
                +'<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'
                +'<h3 class="modal-title">采集图片选取</h3></div>'
                +'<div class="modal-body"><div class="claim-pic-area">'
                +'<div class="loading-claim"><img src="https://static.actneed.com/static/image/spinner.gif"></div>'
                +'</div>'
                +'<div class="select-list"></div>'
                +'</div>'
                +'<div class="modal-footer">'
                +'<button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>'
                +'<button type="button" class="btn btn-primary" id="add-claim-pic">上传</button>'
                +'</div></div></div></div>';
        this.each(function(){
            var _this = $(this);
            if(options.list_style){
                // 优化
                var cur_btns = "";
                if(options.local_picture){
                    cur_btns += local_picture_btn;
                }
                if(options.network_picture){
                    cur_btns +=network_picture_btn;
                }
                if(options.hosting_picture){
                    cur_btns += hosting_picture_btn;
                }
                if(options.claim_picture){
                    cur_btns += claim_picture_btn
                }
                upload_btn = upload_btn.format(cur_btns);
                _this.append(upload_btn);
                if(options.network_picture){
                    _this.find(".upp-network-picture").selectNetworkPic(options.network_picture_config);
                }
                if(options.hosting_picture){
                    _this.find(".upp-hosting-picture").selectHostingPic(options.hosting_picture_config);
                }
                if(options.claim_picture){
                    _this.find(".upp-claim-picture").selectClaimPic(options.claim_picture_config)
                }
                // 这样不停的append效率很低
//                if(options.local_picture){
//                    _this.find("ul").append(local_picture_btn);
//                    _this.find(".upp-local-picture").text(options.local_picture_config.buttonText);
//                }
//                if(options.network_picture){
//                    _this.find("ul").append(network_picture_btn);
//                    _this.find(".upp-network-picture").selectNetworkPic(options.network_picture_config);
//                }
//                if(options.hosting_picture){
//                    _this.find("ul").append(hosting_picture_btn);
//                    _this.find(".upp-hosting-picture").selectHostingPic(options.hosting_picture_config);
//                }
//                if(options.claim_picture){
//                    _this.find("#upload-btn2").append(claim_picture_btn2);
//                    _this.find(".upp-claim-picture").click(function(){
//
//                    })
//                }
            }else{
                _this.append(upload_btn2);
                if(options.local_picture){
                    _this.find("#upload-btn2").append(local_picture_btn2);
                    _this.find(".upp-local-picture").text(options.local_picture_config.buttonText);
                }
                if(options.network_picture){
                    _this.find("#upload-btn2").append(network_picture_btn2);
                    _this.find(".upp-network-picture").selectNetworkPic(options.network_picture_config);
                }
                if(options.hosting_picture){
                    _this.find("#upload-btn2").append(hosting_picture_btn2);
                    _this.find(".upp-hosting-picture").selectHostingPic(options.hosting_picture_config);
                }
                if(options.claim_picture){
                    _this.find("#upload-btn2").append(claim_picture_btn2);
                    _this.find(".upp-claim-picture").selectClaimPic(options.claim_picture_config)
                }
            }
            var btnObj = {
                init: function(){
                    btnObj.set_modal();
                    //_this.hover(btnObj.show_ul_btn, btnObj.hide_ul_btn);
                    _this.on("click", ".upp-local-picture", btnObj.show_local_modal);
                },
                claim_modal_show: function(){
                    window.claim_modal_btn = $(this);
                    if($(".loading-claim").length != 0){
                        $.ajax({
                            url: "",
                            type: "",
                            data: {

                            },
                            success: function(data){
                                $(".loading-claim").remove();
                                if(data[""].length == 0){

                                }else{
                                    var tip = '<div class="no-claim-tip">没有采集图片可供使用</div>'
                                }
                            }
                        })
                    }
                },
                show_ul_btn: function(){
                    _this.find("ul").fadeIn(500, function(){$(this).show()});
                },
                hide_ul_btn: function(){
                    _this.find("ul").fadeOut(500, function(){$(this).hide()});
                },
                set_modal: function(){
                    var network_picture_modal = $("#upp-network-picture-modal"),
                        local_picture_modal = $("#upp-local-picture-modal"),
                        claim_modal = $("#upp-claim-picture-modal");
                    if(!network_picture_modal.length) $("body").append(network_modal);
                    if(!local_picture_modal.length) $("body").append(local_modal);
                    if(!claim_modal.length) $("body").append(claim_pic_modal);
                },
                show_local_modal: function(){
                    var local_model = $("#upp-local-picture-modal");
                    var modal_trigger = $(this);
                    if(!wish_check() && !modal_trigger.closest("td").find("img").attr("src")){
                        Inform.show("产品图片和变体图片最多只能添加20张");
                        return
                    }
                    local_model.modal("show");
                    //options.local_picture_config["onUploadStart"] =
                    //    function(){
                    //        $(".uploadify-button").prop("disabled",true);
                    //    };
                    //options.local_picture_config["onSelect"]&& options.local_picture_config["onSelect"]
                    //    .append(function(){
                    //        $("#upp-ensure-up").prop("disabled",false);
                    //    });
                    //options.local_picture_config["onUploadComplete"] =
                    //    function(){
                    //        $("#upp-ensure-up").prop("disabled",true);
                    //    };
                    options.local_picture_config["modal_trigger"] = modal_trigger;
                    var local_upload = $('#upp-upload').html("").upp_Huploadify(options.local_picture_config);
                    $("#upp-ensure-up").click(function(){
                        local_upload.upload('*');
                    });
                },
                show_network_modal: function(){
                    var network_modal = $("#upp-network-picture-modal"),
                        net_url = '<form class="form-horizontal">';
                    for(var i =1; i<options.network_nums+1; i++){
                        net_url += '<div class="form-group">'+
                                        '<label for="url'+i+'" class="col-md-2 control-label">链接'+i+'</label>'+
                                        '<div class="col-md-9">'+
                                            '<input type="url" class="form-control url" id="url'+i+'" placeholder="链接'+i+'">'+
                                        '</div>'+
                                        '<div class="col-md-1">'+
                                            '<img type="url" class="network-pic-pro" data-id="url'+i+'" ' +
                                            'src="/static/image/add.png">'+
                                       '</div>'+
                                    '</div>';
                    }
                    net_url += '</form>';
                    network_modal.find(".modal-body").html(net_url);
                    network_modal.modal("show");
                    $("#upp-network-pic").click(btnObj.network_picture_save);
                    network_modal.find("input").on("blur", btnObj.network_picture_pre);
                },
                network_picture_save: function(){
                    var picture_urls = [];
                    var $this = $(this);
                    //$this.button("loading");
                    $("#upp-network-picture-modal").modal("hide").find(".url").each(function(k, v){
                        var picture_url = $(v).val();
                        if(picture_url && picture_url != ""){
                            picture_urls.push(picture_url);
                            $(v).val("");
                        }
                    });
                    options.network_picture_config.data.picture_urls = JSON.stringify(picture_urls);
                    $.ajax({
                        url: options.network_picture_config.url,
                        type: options.network_picture_config.type,
                        data: options.network_picture_config.data,
                        dataType: options.network_picture_config.dataType,
                        success: function(data){
                            $this.button("reset");
                            if(data.status == 1){
                                Inform.enable();
                                Inform.show(data.message);
                                console.log("上传测试成功...");
                                options.network_picture_config.ensure_picture_fun
                                &&options.network_picture_config.ensure_picture_fun(options.network_picture_config.picture_urls);
                            }else{
                                Inform.show("操作失败");
                            }
                        },
                        error: function(){
                            Inform.enable();
                            Inform.show("操作失败");
                        }
                    });
                },
                network_picture_pre: function(){
                    // 将用户输入的URL，直接以缩图的方式预览
                    var $this = $(this),
                        img = $this.closest(".form-group").find("img"),
                        v = $this.val();
                    if(v){
                        img.attr("src", v);
                    }else{
                        img.attr("src", "/static/image/add.png");
                    }
                }
            };
            btnObj.init();
        });
    }
})(jQuery, ClaimPic);