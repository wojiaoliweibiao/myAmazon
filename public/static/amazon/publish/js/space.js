/**
 * Created by Administrator on 2016/8/2.
 */

(function($) {
    var modal_trigger,
        btn_status,
        upp_check_img_num = 0;
    $.fn.selectHostingPic = function(opts){
        var defaults = {
                space_pic_nums: 1,
                modal_init_url : "",
                modal_init_type: "POST",
                show_group_pic_url : "",
                show_group_pic_type: "POST",
                search_pic_url : "",
                search_pic_type: "POST",
                filter_pic_url : "",
                filter_pic_type: "POST",
                ensure_picture_fun: null, // 自定义函数 将选中图片显示到商品图片，或者变体图片预览框
                apply_to_fun: null,  // 自定义函数 Amazon sku图片引用至相同的size, color或者所有变体
                xhrFields: {
                    withCredentials: false
                },
                crossDomain: false,
                data: {},
                dataType: "json",
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
            m_images = [],
            condition_info=[],
            btn,
            global_user_id="",
            search_id = "",
            load_img = $("#feed_img").find(".image"),
            image_limit = 1024,
            histing_modal = ' <div class="modal fade" id="hosting-picture-modal" tabindex="-1" role="dialog" '+
                     ' aria-labelledby="img-select-Label" aria-hidden="true"> '+
                    '<div class="modal-dialog modal-lg modal-lg-img">'+
                        '<div class="modal-content">'+
                            '<div class="modal-header">'+
                                '<button type="button" class="close"'+
                                   'data-dismiss="modal" aria-hidden="true">&times;</button>'+
                                '<h3 class="modal-title" id="" > 空间图片选取 </h3>'+
                           '</div>'+
                            '<div class="modal-body" style="position: relative">'+
                                '<div class="pic-sidebar" id="photoBankGroup">'+
                                    '<div id="upp-photoBankGroupList">'+
                                        '<div id="upp-capacity-box">'+
                                            '<div class="progress">' +
                                                '<div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%">' +
                                                    '<span class="sr-only">100% Complete</span>' +
                                                '</div>' +
                                            '</div>' +
                                            '<a href="javascript: void(0);" id="capacity-btn">扩容</a>'+
                                            '<div id="upp-capacity-value">'+
                                               '<div class="percent-status"></div>'+
                                                '<div class="percent-value"></div>'+
                                            '</div>'+
                                        '</div>'+
                                        '<div id="groupList">'+
                                            '<div class="groupTitle activeGroup" id="upp-btnShowAllGroup">'+
                                                '<span class="glyphicon glyphicon-th-large"></span>&nbsp&nbsp所有分组'+
                                            '</div>'+
                                            '<div id="groupTree" style="margin: 10px 0 0 5px">'+
                                                '<ul id="tree" class="ztree"></ul>'+
                                            '</div>'+
                                        '</div>'+
                                        //'<div class="groupTitle" id="recycleBox" style="margin-bottom: 15px">'+
                                        //    '<span class="glyphicon glyphicon-trash"></span>&nbsp&nbsp图片回收站'+
                                        //'</div>'+
                                    '</div>'+
                                '</div>'+
                                '<div class="container-fluid wrap space-wrap">'+
                                    '<div class="row" id="upp-photoBankStatus">'+
                                        '<div class="search-bar col-sm-6">'+
                                            '<div class="input-group">'+
                                                '<input type="text" class="form-control" id="upp-search-input" placeholder="图片名称">'+
                                                '<span class="input-group-btn">'+
                                                '<button class="btn btn-success" type="button" data-loading-text="......" id="search-pic">搜索</button>'+
                                                '</span>'+
                                            '</div>'+
                                        '</div>'+
                                        '<div class="search-bar col-md-6">'+
                                            '<button class="btn btn-warning" type="button" id="upp-pic-filter" style="float: right;margin-right: -19px">筛选</button>'+
                                            '<div class="col-sm-4" style="float: right">'+
                                                '<input type="text" id="end-time" class="form-control">'+
                                            '</div>'+
                                            '<div class="upp-dao">到</div>'+
                                            '<div class="col-sm-4" style="float: right">'+
                                                '<input type="text" id="upp-start-time" class="form-control">'+
                                            '</div>'+
                                        '</div>'+
                                    '</div>'+
                                    '<div class="row" id="upp-photoBankContents">'+
                                        '<div class="box" id="upp-photoBankBox">'+
                                            '<div id="upp-photoArea">'+
                                                '<div class="photoBoxTip" id="no-pic-tip">此分组下无图片。</div>'+
                                                '<div class="photoBoxTip" id="no-search-tip">找不到符合条件的信息。请重试。</div>'+
                                                '<div class="photoBoxTip loading-tip"></div>'+
                                                '<div id="photoList">'+
                                                '</div>'+
                                            '</div>'+
                                        '</div>'+
                                    '</div>'+
                                    '<div class="row img-temp-list" id="upp-sortable"></div>'+
                                '</div>'+
                            '</div>'+
                            '<div class="modal-footer">'+
                                '<span>最多可选</span><span id="upp-max-select" style="color:red">'+options.space_pic_nums+'</span>'+
                                '<span>张,</span><span>已选</span><span id="upp-has-select" style="color:red">0</span><span>张。</span>'+
                                '<button type="button" class="btn btn-default"'+
                                    'data-dismiss="modal">关闭</button>'+
                                '<button type="button" class="btn btn-primary" id="upp-ensure-picture">确认</button>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                '</div>';
        this.each(function(){
            var  _this = $(this);
            var hostingObj = {
                init:function(){
                    hostingObj.init_modal();
                    _this.on("click", hostingObj.show_hosting_modal);
                },
                init_modal: function(){
                    var hosting_modal = $("#hosting-picture-modal");
                    if(!hosting_modal.length){
                        $("body").append(histing_modal);
                        $("#upp-sortable").sortable().disableSelection();
                        $("#end-time").datetimepicker({format: 'YYYY-MM-DD',defaultDate:{Default: true}});
                        $("#upp-start-time").datetimepicker({format: 'YYYY-MM-DD',defaultDate:{Default: true}});
                        $(".img-temp-list").on("click",".del-temp-img",upp_tree.del_temp_img);
                        $("#search-pic").click(upp_tree.search_pic);
                        $("#upp-pic-filter").click(upp_tree.filter_pic);
                        //$("#upp-photoArea").on("click",".goto-page",upp_tree.go_to_page)
                        //               .on("click",".pic-every-page",upp_tree.go_to_page);
                    }
                },
                show_hosting_modal: function(){
                    modal_trigger = $(this);
                    if(!options.before_check() && !modal_trigger.closest("td").find("img").attr("src")){
                        Inform.show("产品图片和变体图片最多只能添加20张");
                        return
                    }
                    var hosting_modal = $("#hosting-picture-modal");
                    upp_tree.img_modal_init();
                    $("#upp-ensure-picture").unbind().click(upp_tree.img_ensure);
                    hosting_modal.modal("show");
                }
            };
            var upp_tree = {
                trigger_click_checkbox: function(){
                    $(this).find("input[type=checkbox]").trigger("click");
                },
                group_active:function(){
                    btn_status = "group";
                    upp_tree.check_all_group(); // cancel tree node selected
                    var $this = $(this);
                    $this.addClass("activeGroup").closest("#upp-photoBankGroupList").find(".groupTitle").not($this).removeClass("activeGroup");
                },
                check_all_group:function(){
                    var treeObj;
                    if(btn){
                        treeObj = $.fn.zTree.getZTreeObj("tree");
                    }
                    if(treeObj){
                        if(treeObj.getSelectedNodes()){
                            treeObj.cancelSelectedNode();
                        }
                    }
                },
                check_pic:function(e){
                    e.stopPropagation();
                    var $this = $(this),
                        is_check = $this.prop("checked"),
                        pic_src = $this.closest(".picture").find("img").attr("src"),
                        pic_id = $this.closest(".photo-operate").attr("data-id"),
                        img_temp_list, pic_str;
                    is_check ? $this.siblings(".operate-btns").show() : $this.siblings(".operate-btns").hide();
                    if(btn && window.btn_show_modal==""){
                        img_temp_list = $("#upp-sortable");
                        if(is_check){
                            upp_check_img_num+=1;
                            pic_str = '<div class="img-pre-box" data-id="'+pic_id+'"><a href="javascript:void(0)"><span class="del-temp-img"></span></a><img src='+pic_src+'></div>';
                            img_temp_list.append(pic_str);
                            $this.closest(".picture").addClass("pic-checked")
                        }else{
                            upp_check_img_num -=1;
                            $this.closest(".picture").removeClass("pic-checked");
                        }
                        $("#upp-has-select").text(upp_check_img_num);
                    }else{
                        img_temp_list = $("#upp-sortable");
                        var $text = $("#upp-has-select");
                        var $length = Number($text.text());
                        if($length< options.space_pic_nums){
                            if(is_check){
                                $length+=1;
                                pic_str = '<div class="img-pre-box" data-id="'+pic_id+'"><a href="javascript:void(0)">' +
                                    '<span class="del-temp-img"></span></a><img src='+pic_src+'></div>';
                                img_temp_list.append(pic_str);
                                $this.closest(".picture").addClass("pic-checked")
                            }else{
                                $length-=1;
                                $this.closest(".picture").removeClass("pic-checked");
                            }
                        }else{
                            is_check ? $(this).removeAttr("checked") : $length-=1 ;
                            is_check || $this.closest(".picture").removeClass("pic-checked");
                        }
                        upp_check_img_num = $length;
                        $text.text($length);
                    }
                    is_check || img_temp_list.find("div[data-id='"+pic_id+"']").remove();
                },
                show_group_pic:function(){
                    var $this = $(this);
                    var group_id = "-1";
                    var page_n = $(".footer-stat").find("button").attr("data-name") || 30;
                    if($this.prop("id")=="upp-btnShowAllGroup"){
                        upp_tree.show_group_pic_ajax("all_group",page_n,1)
                    }
                    //else if($this.prop("id")=="recycleBox"){
                    //    group_id = "tree_0";
                    //    upp_tree.show_group_pic_ajax(group_id,page_n,1)
                    //}
                    search_id = group_id;
                },
                del_temp_img:function(){
                    var $this = $(this);
                    var img_id = $this.closest(".img-pre-box").attr("data-id");
                    $this.closest(".img-pre-box").remove();
                    upp_check_img_num-=1;
                    $("#upp-max-select").text(options.space_pic_nums-m_images.length);
                    $("#upp-has-select").text(upp_check_img_num);
                    $("#photoList").find(".photo-operate[data-id=\""+img_id+"\"]").find(".photo-checkbox").attr("checked",false);
                },
                empty_pic_area:function(){
                    var pic_area = $("#photoList");
                    pic_area.empty();
                    pic_area.siblings(".footer-stat").remove();
                },
                show_group_pic_ajax:function(group_id, page_n, c_page){
                    $(".loading-tip").show().siblings().hide();
                    $.ajax({
                        url: options.show_group_pic_url,
                        type: options.show_group_pic_type,
                        data: {
                            group: group_id == "all_group" ? "-1" : group_id.toString(),
                            page_n: page_n,
                            c_page: c_page
                        },
                        success: function(data){
                            $(".loading-tip").hide();
                            if(data.status == 1){
                                if(data["pictures"].length==0){
                                    var no_pic_tip = $("#no-pic-tip");
                                    no_pic_tip.show().siblings().hide();
                                    $(".img-temp-list").css("margin-top","");
                                }else{
                                    var pictures = data["pictures"],
                                        col_map = data["col_map"],
                                        page_total = data["page_total"] || data["pages"][data["pages"].length-1],
                                        page_n = data["page_n"],
                                        pages = data["pages"],
                                        c_page = data["c_page"];
                                    upp_tree.render_pic(pictures,col_map,page_total,page_n,pages,c_page);
                                    $(".img-temp-list").css("margin-top","21px");
                                }
                            }else{
                                Inform.show("操作失败");
                                console.log(data);
                            }
                        },
                        error: function(){
                            Inform.enable();
                            Inform.show("操作失败");
                        }
                    });
                },
                create_pic:function(picture){
                    var operate_div, operate_str,img_div, img, info_div, title_div, block;
                    block = $("<div/>").attr("class", "picture");
                    img = $("<img/>").attr({
                        "class": "image",
                        "title": picture.Name,
                        "src":  'https://img.actneed.com/image/'+ global_user_id + '/' + picture.Filename // picture.Link
                    });
                    operate_str = '<label><input type="checkbox" class="photo-checkbox"></label>'+
                                    '<span class="operate-btns" style="display: none;">'+
                                        '<a class="pic-delete" href="javascript:void(0)" title="删除">'+
                                            '<span class="glyphicon glyphicon-remove"></span></a>'+
                                        '<a class="pic-edit" href="javascript:void(0)" title="编辑图片">'+
                                            '<span class="glyphicon glyphicon-edit"></span></a>'+
                                        '<a class="copy_link" href="javascript:void(0)" title="复制图片链接">'+
                                            '<span class="glyphicon glyphicon-copy"></span></a>' +
                                  '</span>';
                    img_div = $("<div/>").attr("class", "img-content");
                    operate_div = $("<div/>").attr({
                        "class": "photo-operate",
                        "data-id": picture.Filename
                    }).append(operate_str);
                    img_div.append(img);
                    info_div = $("<div/>").attr("class", "pic-info").html("<span>尺寸：{0}</span> <span>大小：{1}</span>"
                        .format(picture.Size, (picture.Length/1024).toFixed(1)+'k'));
                    title_div = $("<div/>").attr("class", "pic-name").text(picture.Name);
                    block.append(operate_div,img_div,title_div,info_div);
                    return block
                },
                render_pic:function(pictures,col_map,page_total,page_n,pages,c_page){
                    upp_tree.empty_pic_area();
                    var pic_area = $("#photoList");
                    pic_area.show().siblings().hide();
                    for(var i=0; i<pictures.length; i++){
                        var add_div = upp_tree.create_pic(pictures[i]);
                        pic_area.append(add_div);
                    }
                    var page_str = '<div class="row footer-stat">'+
                                        '<ul class="nav pull-right">'+
                                            '<li><ul class="pagination page-bar">{0}{1}{2}</ul></li>'+
                                            '<li class="btn-group page-n-ctrl">'+
                                                '<button type="button" class="btn btn-default dropdown-toggle" ' +
                                                    'data-toggle="dropdown" aria-expanded="false" data-name='+page_n+'>'+
                                                    '每页显示'+page_n+'个 <span class="caret"></span>'+
                                                '</button>'+
                                                '<ul class="dropdown-menu" role="menu">'+
                                                    '<li><a href="javascript:void(0)" class="pic-every-page">30</a></li>'+
                                                    '<li><a href="javascript:void(0)" class="pic-every-page">50</a></li>'+
                                                '</ul>'+
                                            '</li>'+
                                            '<li style="line-height:36px;">共'+page_total+'页</li>'+
                                        '</ul></div>',
                        p_str = "",
                        n_str = "",
                        m_str = "";
                    if(c_page==1){
                        p_str = '<li class="disabled">'+
                                    '<a href="javascript:void(0)" aria-label="Previous">'+
                                        '<span aria-hidden="true">&laquo;</span>'+
                                    '</a>'+
                                '</li>';
                    }else{
                        p_str = '<li>'+
                                    '<a href="javascript:void(0)" aria-label="Previous" class="goto-page" data-name='+(c_page-1)+'>'+
                                        '<span aria-hidden="true">&laquo;</span>'+
                                    '</a>'+
                                '</li>';
                    }
                    if(c_page >= page_total){
                        n_str = '<li class="disabled">'+
                                    '<a href="javascript:void(0)" aria-label="Previous">'+
                                        '<span aria-hidden="true">&raquo;</span>'+
                                    '</a>'+
                                '</li>';
                    }else{
                        n_str = '<li>'+
                                    '<a href="javascript:void(0)" aria-label="Next" class="goto-page" data-name='+(c_page+1)+'>'+
                                        '<span aria-hidden="true">&raquo;</span>'+
                                    '</a>'+
                                '</li>';
                    }
                    for(var page=0;page<pages.length;page++){
                        if(pages[page]==c_page){
                            m_str += '<li class="active" data-name='+pages[page]+'>'+
                                        '<a href="javascript:void(0)">'+pages[page]+'</a>'+
                                     '</li>';
                        }else if ((pages[page]<c_page+4) && (pages[page]>c_page-4)){
                            m_str += '<li>'+
                                        '<a href="javascript:void(0)" class="goto-page" data-name='+pages[page]+'>' +
                                            pages[page] + '</a>'+
                                     '</li>';
                        }
                    }
                    page_str = page_str.format(p_str,m_str,n_str);
                    pic_area.after(page_str);
                    pic_area.find(".photo-checkbox").click(upp_tree.check_pic);
                    $("#upp-photoBankBox").find(".picture").click(upp_tree.trigger_click_checkbox);
                    var upp_photo = $("#upp-photoArea");
                    upp_photo.find(".goto-page").click(upp_tree.go_to_page);
                    upp_photo.find(".pic-every-page").click(upp_tree.go_to_page);
//                    $(".img-temp-list").empty();
                    upp_check_img_num = 0;
                    $("#upp-has-select").text(upp_check_img_num)
                },
                img_modal_init:function(){
                    $("#tree").empty();
                    upp_tree.zTreeNodes = [];
                    var loading_tip = $(".loading-tip"),
                        loading_group = $(".loading-group"),
                        space_progress = $(".progress"),
                        cap_value = $("#upp-capacity-value");
                    cap_value.hide();
                    loading_tip.show();
                    loading_group.show();
                    space_progress.show();
                    $.ajax({
                        url: options.modal_init_url,
                        type: options.modal_init_type,
                        xhrFields: {
                            withCredentials: true
                        },
                        crossDomain: true,
                        data: {
                            group: -1,
                            page_n: 30,
                            c_page: 1
                        },
                        success: function(data){
                            if(data.status == 1){
                                loading_tip.hide();
                                loading_group.hide();
                                var used_space = (data["used_space"]/1024.0/1024.0).toFixed(2);
                                global_user_id = data["user_id"];
                                image_limit = (data["total_space"]/1024/1024).toFixed(0);
                                upp_tree.check_used_space(image_limit,used_space);
                                cap_value.show();
                                space_progress.hide();
                                $("#capacity-value").show();
                                var pic_group = data["gr_stat"];
                                if(pic_group.length!=0){
                                    zTreeNodes = pic_group["children"];
                                    zTreeNodes[0]['open'] = false;
                                    zTreeNodes[0]['isParent'] = false;
                                }
                                btn_status = btn_status === undefined ? "group" :btn_status;
                                zTreeObj = $.fn.zTree.init($("#tree"), setting, zTreeNodes);
                                if(data["pictures"].length!=0){
                                    var pictures = data["pictures"],
                                        col_map = data["col_map"],
                                        page_total = data["page_total"] || data["pages"][data["pages"].length-1],
                                        page_n = data["page_n"],
                                        pages = data["pages"],
                                        c_page = data["c_page"];
                                        upp_tree.render_pic(pictures, col_map, page_total, page_n,pages,c_page);
                                    $(".img-temp-list").css("margin-top","21px");
                                }else{
                                    upp_tree.empty_pic_area();
                                    var no_search_tip = $("#no-search-tip");
                                    no_search_tip.show().siblings().hide();
                                    $(".img-temp-list").css("margin-top","");
                                }
                                $(".groupTitle").click(upp_tree.group_active, upp_tree.show_group_pic);
                                $("#upp-btnShowAllGroup").addClass("activeGroup");
//                                $("#upp-btnShowAllGroup").trigger("click");
                            }else{
                                Inform.show("图片空间初始化失败。");
                            }
                        }
                    });
                    var max_select2 = $("#upp-max-select");
                    if(window.btn_show_modal=="" || $(".shop-info").find("span").eq(0).text() == "Wish"){
                        max_select2.hide().prev().hide();
                        max_select2.next().hide();
                        $("#upp-has-select").text(0);
                    }else{
                        max_select2.text(options.space_pic_nums);
                        $("#upp-has-select").text(0);
                    }
                    $(".img-temp-list").empty();
                    upp_check_img_num = 0;
                },
                check_used_space:function(max_space, used_space){
                    used_space = parseFloat(used_space);
                    var percent = used_space/max_space;
                    var percent_div = $(".percent-status");
                    $(".percent-value").text(used_space+"/"+max_space+"M");
                    percent_div.css("width",percent*100+"%");
                    if(percent>0){
                        if(percent<0.5){
                            percent_div.css("background-color","#5fb129");
                        }else if(percent>=0.5&&percent<0.8){
                            percent_div.css("background-color","#f0ad4e");
                        }else{
                            percent_div.css("background-color","#d9534f");
                        }
                    }
                },
                check_img_length:function(){
                    m_images = [];
                    for(var i=0;i<options.space_pic_nums;i++){
                        var url=load_img.eq(i).attr("src");
                        if (url!="/static/image/add.png"){
                            m_images.push(url);
                        }
                    }
                },
                img_ensure:function(){
                    var checked = $(".img-temp-list").find("img"),
                        pictures = [];
                    for(var i=0; i<checked.length; i++){
                        var pic = checked.eq(i).attr("src");
                        pictures.push(pic)
                    }
                    options.ensure_picture_fun && options.ensure_picture_fun(pictures, modal_trigger);
                    $("#hosting-picture-modal").modal("hide");
                },
                go_to_page:function(){
                    var treeObj, group_id, group_tid;
                    treeObj = $.fn.zTree.getZTreeObj("tree");
                    group_id = "all_group";
                    try{
                        var nodes = treeObj.getSelectedNodes();
                        if(nodes.length==0){
                            group_id = "-1";
                            group_tid = "all_group";
                        }else{
                            group_id = nodes[0].id;
                            group_tid = nodes[0].tId;
                        }
                    }catch(e){
                        console.log(e);
                    }
                    var $this = $(this);
                    var page_n, c_page;
                    if($this.attr("class")=="pic-every-page"){
                        page_n = $this.text();
                        c_page = 1;
                    }else{
                        page_n = $this.closest(".footer-stat").find("button").attr("data-name");
                        c_page = $(this).attr("data-name");
                    }
                    if(btn_status=="group"){
                        upp_tree.show_group_pic_ajax(group_id,page_n,c_page);
                    }else if(btn_status=="group-filter"||btn_status=="search-filter"){
                        upp_tree.filter_pic(page_n,c_page);
                    }else if(btn_status=="search"){
                        upp_tree.search_pic(page_n,c_page)
                    }
                },
                search_pic:function(){
                    var pic_title_input;
                    pic_title_input = $("#upp-search-input");
                    var pic_title = pic_title_input.val().trim();
                    var start_time = "",
                        end_time = "";
                    if(btn_status=="filter"){
                        start_time = condition_info["start_time"];
                        end_time = condition_info["end_time"];
                    }
                    btn_status = "search";
                    condition_info["group_id"] = search_id;
                    condition_info["pic_title"] = pic_title;
                    var page_n = Number($(".pic-every-page").text()),
                        c_page = 1;
                    if(arguments&&arguments.length>1){
                        page_n = arguments[0];
                        c_page = arguments[1];
                    }
                    if(pic_title){
                        pic_title_input.prop("placeholder","图片名称");
                        $(".loading-tip").show().siblings().hide();
                        $.ajax({
                            url: options.search_pic_url,
                            type: options.search_pic_type,
                            xhrFields: options.xhrFields,
                            crossDomain: options.crossDomain,
                            data: {
                                "group": search_id == "all_group" ? "-1" : search_id,
                                "title": pic_title,
                                "page_n": page_n,
                                "c_page": c_page
                            },
                            success:function(data){
                                $(".loading-tip").hide();
                                if(data.status == 1){
                                    if(data["pictures"].length!=0){
                                    var pictures = data["pictures"],
                                        col_map = data["col_map"],
                                        page_total = data["page_total"] || data["pages"][data["pages"].length-1],
                                        page_n = data["page_n"],
                                        pages = data["pages"],
                                        c_page = data["c_page"];
                                        upp_tree.render_pic(pictures, col_map, page_total, page_n,pages,c_page);
                                    }else{
                                        upp_tree.empty_pic_area();
                                        var no_search_tip = $("#no-search-tip");
                                        no_search_tip.show().siblings().hide();
                                    }
                                }else{
                                    Inform.show("操作失败");
                                }
                            }
                        })
                    }else{
                        pic_title_input.prop("placeholder","请输入图片名称");
                    }
                },
                filter_pic:function(){
                    var start_time, end_time, treeObj;
                        start_time = $("#upp-start-time").val();
                        end_time = $("#end-time").val();
                        treeObj = $.fn.zTree.getZTreeObj("tree");
                    var nodes = treeObj.getSelectedNodes();
                    var group_id = nodes.length==0 ? "-1" : nodes[0].id;
                    var pic_title = "";
                    if(btn_status=="search"||btn_status=="search-filter"){
                        group_id = condition_info["group_id"];
                        pic_title = condition_info["pic_title"];
                        btn_status = "search-filter";
                    }else{
                        btn_status = "group-filter";
                    }
                    condition_info["start_time"] = start_time;
                    condition_info["end_time"] = end_time;
                    var page_n = Number($(".pic-every-page").text()),
                        c_page = 1;
                    if(arguments&&arguments.length>1){
                        page_n = arguments[0];
                        c_page = arguments[1];
                    }
                    $(".loading-tip").show().siblings().hide();
                    $.ajax({
                        url: options.filter_pic_url,
                        type: options.filter_pic_type,
                        xhrFields: options.xhrFields,
                        crossDomain: options.crossDomain,
                        data: {
                            "group": group_id == "all_group" ? "-1": group_id,
                            "start_time": start_time,
                            "end_time": end_time,
                            "title": pic_title,
                            "page_n": page_n,
                            "c_page": c_page
                        },
                        success:function(data){
                            $(".loading-tip").hide();
                            if(data.status == 1){
                                if(data["pictures"].length!=0){
                                var pictures = data["pictures"],
                                    col_map = data["col_map"],
                                    page_total = data["page_total"] || data["pages"][data["pages"].length-1],
                                    page_n = data["page_n"],
                                    pages = data["pages"],
                                    c_page = data["c_page"];
                                    upp_tree.render_pic(pictures,col_map,page_total,page_n,pages,c_page);
                                }else{
                                    upp_tree.empty_pic_area();
                                    var no_search_tip = $("#no-search-tip");
                                    no_search_tip.show().siblings().hide();
                                }
                            }else{
                                Inform.show("操作失败");
                            }
                        }
                    })
                },
                zTreeOnMouseUp: function() {
                    $("#upp-photoBankGroupList").find(".groupTitle").removeClass("activeGroup");
                },
                zTreeOnClick:function(event, treeId, treeNode) {
                    btn_status = "group";
                    var t_id = treeNode["tId"],
                        cur_id = treeNode["id"],
                        page_n;
                    if(treeId=="tree"){
                        page_n = $(".footer-stat").find("button").attr("data-name") || 30;
                        upp_tree.show_group_pic_ajax(cur_id,page_n,1);
                        search_id = cur_id;
                    }else if(treeId=="search-tree"){
                        $(".search-key").text(treeNode["name"]).attr("data-id",cur_id);
                    }
                }
            };
        var zTreeObj,
            setting = {
                view: {
                    selectedMulti: false,
                    fontCss : {fontSize:"16px"}
                },
                drag:{
                    isMove: false,
                    isCopy: false
                },
                callback:{
                    onMouseUp: upp_tree.zTreeOnMouseUp,
                    onClick: upp_tree.zTreeOnClick
                },
                data:{
                    simpleData: {
                        enable: true,
                        idKey: "id",
                        pIdKey: "pId",
                        rootPId: null
                    }
                }
            },
            zTreeNodes = [];
            hostingObj.init();
        });
    }
})(jQuery);
