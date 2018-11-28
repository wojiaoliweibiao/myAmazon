/**
 * Created by GF on 2016/7/13.
 */
(function($){
    $.fn.referPro = function(options){
        var defaults = {
            "url": "/interface/warehouse",
            "modal_btn": "#quote_product",
            "refer_info_btn": "#quote_template",
            "shop_id": "",
            "refer_status": [],
            "refer_shops": []
        };
        var ops = $.extend(defaults, options);
        var s_option = "t",
            s_value = "";
        var modal = '<div class="modal fade" id="refer-modal" tabindex="-1" role="dialog"'+
                    'aria-labelledby="templateLabel" aria-hidden="true">'+
                    '<div class="modal-dialog modal-lg">'+
                    '<div class="modal-content">'+
                    '<div class="modal-header">'+
                    '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'+
                    '<h3 class="modal-title" id="info-template-Label" >引用产品</h3>'+
                    '</div>'+
                    '<div class="modal-body">'+
                    '<div class="row">'+
                    '<div class="col-md-3">'+
                    '<select class="form-control" id="refer-shop-slt"></select>'+
                    '</div>'+
                    '<div class="col-md-9">'+
                    '<div class="input-group">'+
                    '<div class="input-group-btn">'+
                    '<button type="button" class="btn btn-default dropdown-toggle"'+
                    'data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'+
                    '<span class="search-refer-key">标题</span>'+
                    '<span class="caret"></span>'+
                    '</button>'+
                    '<ul class="dropdown-menu" id="search-refer-options">'+
                    '<li><a href="javascript: void(0)" data-key="t">标题</a></li>'+
                    '<li><a href="javascript: void(0)" data-key="i">产品ID</a></li>'+
                    '<li><a href="javascript: void(0)" data-key="k">产品SKU</a></li>'+
                    '</ul>'+
                    '</div>'+
                    '<input type="text" class="form-control" id="search-refer-ipt">'+
                    '<div class="input-group-btn">'+
                    '<button type="button" class="btn btn-success" id="search-refer-btn">搜索</button>'+
                    '</div>'+
                    '</div>'+
                    '</div>'+
                    '</div>'+
                    '<div class="content-manage row">'+
                    '<div style="margin: 5px; float: left">'+
                    '符合查询条件的产品有<span class="important refer-num"></span>件'+
                    '</div>'+
                    '<ul class="manage-control">'+
                    '<li>'+
                    '每页显示'+
                    '<a class="page-num-control on" href="javascript:void(0)" data-id="5">5</a>'+
                    '<a class="page-num-control" href="javascript:void(0)" data-id="10">10</a>'+
                    '<a class="page-num-control" href="javascript:void(0)" data-id="20">20</a>'+
                    '</ul>'+
                    '</div>'+
                    '<div class="refer-content">' +
                    '<div class="loading-refer"><img src="https://static.actneed.com/static/image/spinner.gif" ></div>'+
                    '<div class="no-refer-tip">没有找到可引用的产品</div>'+
                    '</div>'+
                    '</div>'+
                    '<div class="modal-footer refer-footer">'+
                    '</div>'+
                    '</div>'+
                    '</div>'+
                    '</div>';
        var Refer = {
            init: function(){
                if($(document).find("#refer-modal").length == 0){
                    $("body").append(modal);
                }
                $("#search-refer-options").find("a").click(Refer.choose_option);
                $("#search-refer-pro").click(Refer.search_pro);
                $(ops.modal_btn).click(Refer.show_modal);
                $(ops.refer_info_btn).click(Refer.request_information);
                $("#search-refer-btn").click(function(){
                    if($("#search-refer-ipt").val().trim()!=""){
                        Refer.search_pro("search");
                    }
                });
                $(".page-num-control").click(function(){
                    var $this = $(this);
                    if($this.attr("class") != "page-num-control on"){
                        Refer.search_pro("page", $this.text())
                    }
                });
                $(document).on("click", ".change-refer-page", function(){
                    var $this = $(this);
                    if($this.closest("li").attr("class") != "active" && $this.closest("li").attr("class") != "disabled"){
                        var index = $this.attr("data-index");
                        Refer.search_pro("goto", index);
                    }
                });
                $(document).on("click", "#skip-refer-btn", function(){
                    var page = $("#skip-refer-ipt").val().trim(),
                        cur = $("#refer-modal .pagination").find(".active").text(),
                        re = /[1-9]+/;
                    if(re.test(page) && page != cur){
                        Refer.search_pro("goto", page);
                    }
                });
                $("#refer-modal").on("click", ".refer-btn", function(){
                    var product_id = $(this).attr("data-id");
                    location.href = "/create/" + ops.shop_id + "/edit?product_id=" + product_id+"&type=use&source=" + $("#refer-shop-slt").val();
                });
                $("#refer-shop-slt").change(function(){Refer.search_pro("shop")});
            },
            show_modal: function(){
                var $modal = $("#refer-modal"),
                    loading = $modal.find(".loading-refer"),
                    tip = $modal.find(".no-refer-tip");
                tip.hide();
                loading.show();
                $modal.modal("show");
                $(".refer-content").find("table").remove();
                $("#refer-shop-slt").empty();
                $.ajax({
                    url: "/shop/"+ops.shop_id+"/platform",
                    type: "POST",
                    success: function(data){
                        if(data.status == 1){
                            for(var i=0;i<data["shops"].length;i++){
                                $("#refer-shop-slt").append(
                                    '<option value="'+data["shops"][i]["shop_id"]+'">'+data["shops"][i]["name"]+'</option>'
                                )
                            }
                            $("#refer-shop-slt").val(ops.shop_id);
                        }
                    }
                });
                $.ajax({
                    url: ops.url,
                    type: "GET",
                    data: {
                        "s": ops.shop_id
                    },
                    success: function(data){
                        loading.hide();
                        if(data.status == 1){
                            $(".refer-num").text(data["json"]["ps_len"]);
                            if(data["json"]["products"].length > 0){
                                Refer.render_pro(data["json"]["products"]);
                                Refer.render_refer_page(data["json"]["pa_th"], data["json"]["pa_len"]);
                            }else{
                                tip.show();
                            }
                        }else{
                            tip.show();
                        }
                    },
                    error: function(){
                        loading.hide();
                        tip.show();
                    }
                })
            },
            choose_option: function(){
                $(".search-refer-key").text($(this).text());
                s_option = $(this).attr("data-key");
            },
            search_pro: function(type){
                var $this = $(this),
                    search_ipt = $("#search-refer-ipt"),
                    $modal = $("#refer-modal"),
                    loading = $modal.find(".loading-refer"),
                    tip = $modal.find(".no-refer-tip");
                tip.hide();
                loading.show();
                $modal.modal("show");
                $(".refer-content").find("table").remove();

                var data = {
                    "s": $("#refer-shop-slt").val()
                };
                if(type == "search"){
                    data["n"] = $(".page-num-control.on").text();
                    data[s_option] = search_ipt.val();
                    s_value = [s_option, search_ipt.val()];
                }
                if(type == "page"){
                    data["p"] = 1;
                    data["n"] = arguments[1];
                    data[s_value[0]] = s_value[1];
                }
                if(type == "goto"){
                    data["n"] = $(".page-num-control.on").text();
                    data["p"] = arguments[1];
                    data[s_value[0]] = s_value[1];
                }
                if(type == "shop"){
                    s_value = "";
                    search_ipt.val("");
                    data["n"] = $(".page-num-control.on").text();
                }
                $.ajax({
                    "url": ops.url,
                    "type": "GET",
                    "data": data,
                    "dataType": "json",
                    "success": function(data){
                        loading.hide();
                        $(".refer-num").text(data["json"]["ps_len"]);
                        $(".page-num-control").removeClass("on");
                        $('[data-id="'+data["json"]["pa_nu"]+'"]').addClass("on");
                        if(data["json"]["products"].length > 0){
                            Refer.render_pro(data["json"]["products"]);
                        }else{
                            tip.show();
                        }
                        Refer.render_refer_page(data["json"]["pa_th"], data["json"]["pa_len"]);
                    }
                })
            },
            render_pro: function(pro_list){
                if(pro_list.length == 0) return;
                var trs= "",
                    refer_content = $(".refer-content");
                for(var i=0;i<pro_list.length;i++){
                    var cur_pro = pro_list[i];
                    trs += '<tr><td><div class="refer-image"><img src="'+cur_pro["picture"]+'"></div></td><td>'+cur_pro["store"]+'</td><td><a href="'+cur_pro["link"]+'" target="_blank">'+cur_pro["title"]+'</a></td><td class="refer-btn-td">' +
                        '<a type="button" data-id="'+cur_pro["id"]+'" class="refer-btn btn btn-info btn-sm" title="引用此产品">引用</a></td></tr>'
                }
                refer_content.append(
                    '<table class="table table-striped table-bordered refer-table">' +
                    '<tr style="text-align:center;"><td>图片</td><td>店铺</td><td>产品标题</td><td style="width:10%">操作</td></tr>' + trs +
                    '</table>'
                )
            },
            render_refer_page: function(cur, total){
                var $modal = $("#refer-modal"),
                    body_str = "",
                    cur_page = parseInt(cur),
                    total_page = parseInt(total),
                    refer_footer = $(".refer-footer"),
                    footer_str = '<nav><ul class="pagination">' +
                        '<li><a class="change-refer-page" href="javascript:void(0)" data-fun="first" data-index="1"><span>首页</span></a></li>' +
                        '<li><a class="change-refer-page" href="javascript:void(0)" data-fun="previous" data-index="'+(cur_page-1)+'"><span>上一页</span></a></li>{0}' +
                        '<li><a class="change-refer-page" href="javascript:void(0)" data-fun="next" data-index="'+(cur_page+1)+'"><span>下一页</span></a></li>' +
                        '<li><a class="change-refer-page" href="javascript:void(0)" data-fun="last" data-index="'+total_page+'"><span>尾页</span></a></li>' +
                        '</ul></nav>';
                total_page == 0 && refer_footer.hide();
                total_page == 0 || refer_footer.show();
                var page_prev = cur_page < 6 ? (cur_page - 1) : 4;
                for(var j=cur_page-page_prev;j<total_page+1;j++){
                    if(j==cur_page){
                        body_str += '<li class="active"><a class="change-refer-page" href="javascript:void(0)" data-index="'+j+'">'+j+'</a></li>'
                    }else if(j<cur_page+9-page_prev){
                        body_str += '<li><a class="change-refer-page" href="javascript:void(0)" data-index="'+j+'">'+j+'</a></li>'
                    }
                }
                refer_footer.html(footer_str.format(body_str));
                if(cur_page == 1){
                    $modal.find('a[data-fun="previous"]').closest("li").addClass("disabled");
                    $modal.find('a[data-fun="first"]').closest("li").addClass("disabled");
                }
                if(cur_page == total_page){
                    $modal.find('a[data-fun="next"]').closest("li").addClass("disabled");
                    $modal.find('a[data-fun="last"]').closest("li").addClass("disabled");
                }
            },
            request_information: function(){
                var $modal = $("#refer-info-modal"),
                    loading = $modal.find(".loading-refer"),
                    tip = $modal.find(".no-refer-tip"),
                    target = $modal.find(".refer-info-content");
                target.empty();
                tip.hide();
                loading.show();
                $modal.modal("show");
                $.ajax({
                    "url": "/template/" + $("#shop-id").val() + "/list/information",
                    "type": "POST",
                    "success": function(data){
                        loading.hide();
                        if(data["json"].length == 0){
                            tip.show();
                            return 0;
                        }else{
                            Refer.render_info_temps(target, data["json"]);
                        }
                    }
                });
            },
            render_info_temps: function(target, templates){
                var table_head = "<table class=\"table table-hover " +
                    "table-striped\" style='margin-bottom:0;'><tr><td>模板名称</td>" +
                    "<td>包含模块</td>"+
                    "<td>创建时间</td>"+
                    "<td>选择模板</td></tr>";
                var table_tail = "</table>";
                var rows = "";
                var mold_name_dic = {
                    'title': '标题',
                    'des': '描述信息',
                    'tag': '标签',
                    'package': '包装信息',
                    'shipping': '运送信息',
                    'template': '模板信息',
                    'other': '其它常用信息'
                };
                for(var i=0; i<templates.length;i++) {
                    var template = templates[i];
                    var radio_box = "<input name='info-refer' type=\"radio\" data-custom=\""+template["is_custom"]+"\"" +
                        " data-title=\"" + template["template_name"] + "\" data-id=\"" + template["template_id"] + "\" />";
                    var mold_contain = "";
                    for(var j=0;j<template["mold_contain"].length;j++){
                        mold_contain += mold_name_dic[template["mold_contain"][j]]+","
                    }
                    rows += "<tr><td>{0}</td><td>{1}</td><td>{2}</td><td>{3}</td>"
                            .format(template["template_name"], mold_contain.substring(0, mold_contain.length-1), template["create_time"], radio_box);
                }
                target.html(table_head + rows + table_tail);
            }
        };
        Refer.init();
    }
})(jQuery);