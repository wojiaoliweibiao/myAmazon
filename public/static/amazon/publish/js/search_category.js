/**
 * Created by Administrator on 2016/7/21.
 */
(function($){
    var global = {
        is_leaf: false,
        element: ""
    };
    $.fn.searchCategory = {
        init: function(obj, opts){
            opts = opts || {};
            global.element = obj;
            var defaults = {
                    category_div : "#category-search",
                    max_layers : 9,
                    select_cate_url : '',
                    select_type: "GET",
                    search_cate_url : '',
                    search_type: "POST",
                    data: {"parent_id": 0},
                    after_init: null,
                    after_check: null,
                    fre_cate_click: null,
                    frequently: false,
                    custom_data: {
//                        data-name: data-key
                    },
                    frequent_data: []
                };
            var options = $.extend(defaults, opts),
                element = $(obj),
                c_level = 0,
                category_group = [],
                category_name = [],
                category_id  = "",
                temp_cate_info = {"id": "", "name": ""},
                category_div = $(options.category_div),
                allSearch = '<div class="plug-search-div">' +
                                '<input type="text" class="plug-search-input all-input-search" value="" placeholder="请输入英文产品关键词,如：mp3">' +
                                '<a href="javascript:void(0)" id="search-in-all-cate"><span class="glyphicon glyphicon-search search-icon" ></span></a>' +
                            '</div>',
                navbar = '<nav class="navbar navbar-default cate-navbar">' +
                            '<div class="container-fluid">' +
                            '<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">' +
                            '<ul class="nav navbar-nav">' +
                            '<li class="{0}"><a data-target="#frequent-cate-content" data-toggle="tab" class="tab-a tab-to-fre">常用分类</a></li>' +
                            '<li class="{1}"><a data-target="#all-cate-content" data-toggle="tab" class="tab-a tab-to-all">所有分类</a></li>' +
                            '</ul>' +
                            '<div class="navbar-form navbar-right">' +
                            allSearch +
                            '</div>' +
                            '</div>' +
                            '</div>' +
                            '</nav>',
                cate_select_wrap = '<div class="cate-select-wrap">'+
                                        '<div class="cate-search-result cate-list" style="display: none;">'+
                                            '<div class="cate-search-panel">'+
                                                '<span>为您匹配到</span><span class="cate-search-total">0</span><span>个类目</span>'+
                                                '<a class="cancel-cate-search" href="javascript:;">返回类目</a>'+
                                            '</div>'+
                                            '<ul class="cate-search-ul cate-list-ul">'+
                                            '</ul>'+
                                           '<div class="status"><span></span></div>'+
                                        '</div>'+
                                    '</div>',
                cate_list_select = '<div class="cate-list-select"></div>',
                cate_lists = '',
                last_null_div = '<div class="last-null-div" ></div>',
                cate_list_first = '<div class="cate-list" >' +
                                '<div class="cate-filter-wrap">' +
                                    '<span class="glyphicon glyphicon-search search-icon cate-search"></span>'+
                                    '<input class="plug-search-input cate-filter" type="text" placeholder="请输入名称/拼音首字母">' +
                                '</div>' +
                            '</div>',
                cate_list = '<div class="cate-list" style="display: none;">' +
                                '<div class="cate-filter-wrap">' +
                                    '<span class="glyphicon glyphicon-search search-icon cate-search"></span>'+
                                    '<input class="plug-search-input cate-filter" type="text" placeholder="请输入名称/拼音首字母">' +
                                '</div>' +
                            '</div>',
                selected_cate_banner = '<div class="selected-cate-banner clearfix">' +
                                            '<span class="plug-cate-tip"><strong>您当前选择的类目：</strong></span>' +
                                            '<span class="selected-cate-displayer cate-content"></span>' +
                                       '</div>',
                reset_cate = function(site_id, shop_id, callback){
                    options.data["site_id"] = site_id;
                    options.data["parent_id"] = 0;
                    if(shop_id) options.data["shop_id"] = shop_id;
                    var fre_content = '',
                        flag = false,
                        is_array = Object.prototype.toString.call(options.frequent_data) == '[object Array]' ? options.frequent_data.length : false;
                    if(is_array){
                        fre_content = '<div class="fre-title"><span>您有以下</span><span class="fre-count">'+
                                        options.frequent_data.length+'</span><span>个常用类目</span>' +
                                        '<p>点击其中一个可直接选取该目录</p>' +
                                        '</div>' +
                                        '<ul class="frequent-cate-ul">';
                        for(var i=0;i<options.frequent_data.length;i++){
                            if(!options.frequent_data[i].site_id || options.frequent_data[i].site_id == options.data.site_id){
                                fre_content += '<li><a class="fre-leaf-a" data-leaf="1" data-id=' + options.frequent_data[i].id + ' data-level="1">'+options.frequent_data[i].name+'</a></li>';
                                flag = true;
                            }
                        }
                        fre_content += '</ul>';
                        if(!flag){
                            fre_content ='<p class="no-fre-tip">您暂时没有可选的常用分类</p>';
                            category_div.find(".tab-to-all").trigger("click");
                        }else{
                            category_div.find(".tab-to-fre").trigger("click");
                        }
                    }else{
                        fre_content ='<p class="no-fre-tip">您暂时没有可选的常用分类</p>';
                        category_div.find(".tab-to-all").trigger("click");
                    }
                    element.each(function(){
                        if(options.frequently){
                            $("#frequent-cate-content").empty().append(fre_content);
                            if(typeof options.fre_cate_click === "function") $(".fre-leaf-a").click(options.fre_cate_click);
                        }
                        category_div.find(".cate-list-select").find(".cate-list:gt(0)").hide();
                        CategoryObj.select_cate_sub(options.data, 0);
                    });
                    CategoryObj.clear_cate_displayer();
                    if(typeof options.after_init === "function") options.after_init();
                },
                CategoryObj = {
                select_cate_sub: function(data, level){
                    if(data.site_id == -1){
                        category_div.find(".cate-list").hide();
                        return
                    }
                    category_div.find(".cate-list:eq(1)").show();
                    var cate_select_wrap = category_div.find(".cate-select-wrap");
                    var req_cate = function(){
                        $.ajax({
                            "url": options.select_cate_url,
                            "type":  options.select_type,
                            "dataType": "json",
                            "data": data,
                            "success": function(data){
                                if(data.status || data.categories){
                                    if(options.frequently && level == 0){
                                        options.frequent_data = data.frequent_data;
                                        var fre_content = '',
                                            flag = false,
                                            is_array = Object.prototype.toString.call(options.frequent_data) == '[object Array]' ? options.frequent_data.length : false;
                                        if(is_array){
                                            fre_content = '<div class="fre-title"><span>您有以下</span><span class="fre-count">'+
                                                            options.frequent_data.length+'</span><span>个常用类目</span>' +
                                                            '<p>点击其中一个可直接选取该目录</p>' +
                                                            '</div>' +
                                                            '<ul class="frequent-cate-ul">';
                                            for(var i=0;i<options.frequent_data.length;i++){
                                                if(!options.frequent_data[i].site_id || options.frequent_data[i].site_id == options.data.site_id){
                                                    fre_content += '<li><a class="fre-leaf-a" data-leaf="1" data-id=' + options.frequent_data[i].id + ' data-level="1">'+options.frequent_data[i].name+'</a></li>';
                                                    flag = true;
                                                }
                                            }
                                            fre_content += '</ul>';
                                            if(!flag){
                                                fre_content ='<p class="no-fre-tip">您暂时没有可选的常用分类</p>';
                                                category_div.find(".tab-to-all").trigger("click");
                                            }else{
                                                category_div.find(".tab-to-fre").trigger("click");
                                            }
                                        }else{
                                            fre_content ='<p class="no-fre-tip">您暂时没有可选的常用分类</p>';
                                            category_div.find(".tab-to-all").trigger("click");
                                        }
                                        $("#frequent-cate-content").empty().append(fre_content);
                                        if(typeof options.fre_cate_click === "function") $(".fre-leaf-a").click(options.fre_cate_click);
                                    }
                                    CategoryObj.render_category(data.categories, level);
                                    category_div.find("li a").not(".tab-a,.fre-leaf-a").off("click").click(CategoryObj.choose_category);
                                    CategoryObj.search_key_up();
                                }else{
                                   console.log(data.message);
                                }
                            },
                            "error": function(){
                                console.log("请求失败.");
                            }
                        })
                    };
                    if (level >0)category_div.find(".cate-list-select").find(".cate-list").eq(level).show();
                    if(level>=4){
//                        cate_select_wrap.attr("class", "cate-select-wrap overflow-scroll");
                        cate_select_wrap.stop().animate({scrollLeft:978},600,req_cate);
                    }else{
                        req_cate();
                    }
                },
                render_category:function(cate, level){
                    var cate_ul ="", cate_li = "";
                    for(var i=0; i< cate.length; i++){
                        var leaf = cate[i].leaf ? "": "plug-has-leaf",
                            spell = cate[i].py ? cate[i].py: cate[i].name,
                            cate_data = {};
                        if(typeof options["custom_data"] == "object"){
                            for(var k in options["custom_data"]){
                                var cur_data = cate[i][options["custom_data"][k]];
                                if(cur_data) cate_data["data-"+k] = cur_data;
                            }
                        }
                        cate_data = $.extend(cate_data, {"class":leaf, "data-id": cate[i].id, "data-leaf": cate[i].leaf, "data-py":spell,
                                        "data-level": cate[i].level, "data-en": cate[i].name, "title": cate[i].name,
                                        "data-cn": cate[i].cn});
                        var cate_a = $("<a>", cate_data).text(cate[i].name);
                            cate_li += '<li>'+cate_a.prop("outerHTML")+'</li>';
                    }
                    cate_ul = '<ul class="cate-list-ul">'+ cate_li +'</ul>';
                    if (level >0)category_div.find(".cate-list-select").find(".cate-list").eq(level).show();
                    var cur_cate_area = category_div.find(".cate-list-select").find(".cate-list").eq(level);
                    cur_cate_area.find(".cate-list-ul").remove();
                    cur_cate_area.append(cate_ul);
                    //CategoryObj.search_key_up();
                },
                choose_category:function(e){
//                    e.stopPropagation();
                    var cate = $(this);
                    var is_leaf = cate.attr("data-leaf") == "1";
                    var level = cate.attr("data-level");
                    var name = cate.text();
                    var html_str = "";
                    var pop_times, temp_level;
                    level = parseInt(level);
                    global.is_leaf = is_leaf;
                    if(level<4){
                        var cate_select_wrap = category_div.find(".cate-select-wrap");
                        cate_select_wrap.animate({scrollLeft:0},600);
//                        cate_select_wrap.attr("class", "cate-select-wrap overflow-hidden");
                    }
                    if(typeof options.after_check === "function") options.after_check(cate);
                    if(is_leaf){
                        if(cate.closest("ul").attr("class").indexOf("cate-search-ul") == -1){
                            category_div.find(".cate-list-select").find(".cate-list:gt("+(level-1)+")").hide();
                        }
//                        category_div.find(".cate-select-wrap").css("overflow-x", "hidden");
                        if(c_level < level){
                            category_group.push(name);
                        }else{
                            pop_times = c_level - level + 1;
                            temp_level = level;
                            while(pop_times > 0){
                                category_group.pop();
                                temp_level += 1;
                                $(".category[data-level=" + temp_level + "]").remove();
                                pop_times -= 1;
                            }
                            category_group.push(name);
                        }
                        c_level = level;
                        cate.closest("ul").find("a").removeClass("selected");
                        cate.addClass("selected");
                        category_div.find(".selected-cate-displayer").attr({"data-id": cate.attr("data-id"), "data-root": cate.attr("data-root") || category_div.find(".selected[data-level='1']").attr("data-id")}).text(category_group.join(" > "));
                    }else{
                        if(!cate.hasClass("selected")){
                            if(c_level < level){
                                category_group.push(name);
                            }else{
                                pop_times = c_level - level + 1;
                                temp_level = level;
                                while(pop_times > 0){
                                    category_group.pop();
                                    temp_level += 1;
                                    $(".category[data-level=" + temp_level + "]").remove();
                                    pop_times -= 1;
                                }
                                category_group.push(name);
                            }
                            c_level = level;
//                            var category_dom = $("<ul/>").attr({ "class": "category loading-cate", "data-level": level + 1
//                                                                }).appendTo(".category-area");
                            cate.closest("ul").find("a").removeClass("selected");
                            cate.addClass("selected");
                            options.data.parent_id = cate.attr("data-id");
                            category_div.find(".selected-cate-displayer").attr("data-id", "").text(category_group.join(" > "));
                            console.log("level=="+level);
                            category_div.find(".cate-list-select").find(".cate-list:gt("+(level-1)+")").find(".cate-filter").val("");
                            if(cate.data("leaf")){
                                category_name = category_group;
                                category_id = cate.data("id");
                                category_div.find(".cate-list-select").find(".cate-list:gt("+(level-1)+")").hide().find("ul").remove();
                            }else{
                                category_name = category_group;
                                category_id = cate.data("id");
//                                CategoryObj.select_cate_sub(options.data, level);
                                category_div.find(".cate-list-select").find(".cate-list:gt("+(level)+")").hide();
                                category_div.find(".cate-list-select").find(".cate-list:gt("+(level-1)+")").find("ul").remove();
                                CategoryObj.select_cate_sub(options.data, level);
                            }
                        }
                    }
                },
                all_search: function(){
                    if (event.type == "click" || event.keyCode == 13) {
                        var selected_cate = $(".selected-cate-displayer");
                        temp_cate_info["id"] = selected_cate.attr("data-id");
                        temp_cate_info["name"] = selected_cate.text();
                        temp_cate_info["root"] = selected_cate.attr("data-root");
//                        category_div.find(".selected").removeClass("selected");
                        var search_text = category_div.find(".all-input-search").val();
                        if ($.trim(search_text)) {
                            category_div.find(".tab-to-all").trigger("click");
                            category_div.find(".cate-search-result").show();
    //                        CategoryObj.clear_cate_displayer();
                            category_div.find(".cate-list-select").hide();
                            options.data["name"] = $.trim(search_text);
                            var search_ul = category_div.find(".cate-search-ul"),
                                load_img = '<li class="like-a"><img src="https://static.actneed.com/static/image/spinner.gif" style="width:21px;height:21px;" align="center"></li>',
                                cate_search_total = category_div.find(".cate-search-total"),
                                cst_prev = cate_search_total.prev(),
                                cst_next = cate_search_total.next();
                            cst_prev.text("正在搜索 . . .");
                            cate_search_total.text("");
                            cst_next.text("");
                            search_ul.html(load_img);
                            $.ajax({
                                "url": options.search_cate_url,
                                "type": options.search_type,
                                "dataType": "json",
                                "data": options.data,
                                "success": function (data) {
                                    if (data.status) {
                                        var search_li = '',
                                            search_result = data.json.categories,
                                            search_total = search_result.length;
                                        for (var i = 0; i < search_total; i++) {
                                            search_li += '<li><a data-leaf="1" data-root="'+search_result[i].root_id+'" data-id=' + search_result[i].id + ' data-level="1" title="' + search_result[i].full_name
                                                + '">' + search_result[i].full_name + '</a></li>';
                                        } // 改
                                        cst_prev.text("为您匹配到");
                                        cst_next.text("个类目");
                                        cate_search_total.text(search_total);
                                        search_ul.html(search_li);
                                        search_ul.find("li a").click(CategoryObj.choose_category);
                                    } else {
                                        cst_prev.text("为您匹配到");
                                        cst_next.text("个类目");
                                        cate_search_total.text(0);
                                        var error_li = '<li class="like-a">' + data.message + '</li>';
                                        search_ul.html(error_li);
                                    }
                                },
                                "error": function(){
                                    cst_prev.text("为您匹配到");
                                    cst_next.text("个类目");
                                    cate_search_total.text(0);
                                }
                            })
                        }
                    }
                },
                init_search_panel: function(){
    //                CategoryObj.clear_cate_displayer();
                    $(".selected-cate-displayer").attr({"data-id": temp_cate_info["id"], "data-root": temp_cate_info["root"]}).text(temp_cate_info["name"]);
                    category_div.find(".cate-search-result").hide();
                    category_div.find(".cate-list-select").show();
                },
                clear_html: function(obj){
                    obj.find("a").each(function(n,o){
                        o.innerHTML = o.text;
                    })
                },
                search_key_up: function(){
                    $(".cate-filter").keyup(function(){
                        var _this = $(this);
                        _this.closest(".cate-list").find("li").show();
                        var this_list = _this.closest(".cate-list").find("ul");
                        CategoryObj.clear_html(this_list);
                        var en_cn = "en";
                        var search_str_A = $.trim(_this.val()).toUpperCase();
                        var str_len = search_str_A.length;
                        if(str_len){
                            this_list.find("a").each(function(n,ob){
                                var obj = $(ob),
                                    sear_tag =obj.attr("title").toUpperCase(),
                                    index = sear_tag.indexOf(search_str_A);
                                if(index<0 && obj.attr("title") !== obj.attr("data-py")){
                                    sear_tag =obj.attr("data-py").toUpperCase();
                                    index = sear_tag.indexOf(search_str_A);
                                }
                                if (index == -1){
                                    obj.closest("li").hide();
                                }else{
                                    var start_html = obj.text();
                                    var replace_str = start_html.substring(index,index+str_len);
                                    var tar_html = start_html.replace(replace_str,"<span style='color:red'>"+replace_str+"</span>");
                                    obj.html(tar_html);
                                }
                            })
                        }
                    })
                },
                clear_cate_displayer: function(){
                    category_div.find(".selected-cate-displayer").attr("data-id", "").attr("data-root", "").text("");
                },
                init_cate: function(element){

                }

            };
            global.category_div = $(options.category_div);
            if(options.frequently){
                var fre_div = '<div id="frequent-cate-content" class="{0}">{1}</div>',
                    fre_content = '',
                    flag = false,
                    is_array = Object.prototype.toString.call(options.frequent_data) == '[object Array]' ? options.frequent_data.length : false;
                if(is_array){
                    fre_content = '<div class="fre-title"><span>您有以下</span><span class="fre-count">'+
                                    options.frequent_data.length+'</span><span>个常用类目</span>' +
                                    '<p>点击其中一个可直接选取该目录</p>' +
                                    '</div>' +
                                    '<ul class="frequent-cate-ul">';
                    for(var i=0;i<options.frequent_data.length;i++){
                        if(!options.frequent_data[i].site_id || options.frequent_data[i].site_id == options.data.site_id){
                            fre_content += '<li><a class="fre-leaf-a" data-leaf="1" data-id=' + options.frequent_data[i].id + ' data-level="1">'+options.frequent_data[i].name+'</a></li>';
                            flag = true;
                        }
                    }
                    fre_content += '</ul>';
                    if(flag){
                        navbar = navbar.format("active", "");
                    }else{
                        fre_content ='<p class="no-fre-tip">您暂时没有可选的常用分类</p>';
                        navbar = navbar.format("", "active");
                    }
                }else{
                    fre_content ='<p class="no-fre-tip">您暂时没有可选的常用分类</p>';
                    navbar = navbar.format("", "active");
                }
                fre_div = fre_div.format((is_array ? "active" : ""), fre_content);
                element.each(function(){
                    for(var i=0; i<options.max_layers-1; i++) cate_lists += cate_list;
                    category_div.append(navbar+'<div id="all-cate-content" class="'+(is_array ? "" : "active")+'">'+cate_select_wrap + selected_cate_banner+'</div>' + fre_div);
                    category_div.find(".cate-select-wrap").append(cate_list_select);
                    category_div.find(".cate-list-select").append(cate_list_first + cate_lists + last_null_div);
                    //CategoryObj.render_category(data.categories, 0);
                    CategoryObj.select_cate_sub(options.data, 0);
                    category_div.find(".all-input-search").keyup(CategoryObj.all_search);
                    category_div.find("#search-in-all-cate").click(CategoryObj.all_search);
                    category_div.find(".cancel-cate-search").click(CategoryObj.init_search_panel);
                });
                if(typeof options.fre_cate_click === "function") $(".fre-leaf-a").click(options.fre_cate_click);
            }else{
                element.each(function(){
                    for(var i=0; i<options.max_layers-1; i++) cate_lists += cate_list;
                    category_div.append(allSearch + cate_select_wrap + selected_cate_banner);
                    category_div.find(".cate-select-wrap").append(cate_list_select);
                    category_div.find(".cate-list-select").append(cate_list_first + cate_lists + last_null_div);
                    //CategoryObj.render_category(data.categories, 0);
                    CategoryObj.select_cate_sub(options.data, 0);
                    category_div.find(".all-input-search").keyup(CategoryObj.all_search);
                    category_div.find("#search-in-all-cate").click(CategoryObj.all_search);
                    category_div.find(".cancel-cate-search").click(CategoryObj.init_search_panel);
                });
            }
            if(typeof options.after_init === "function") options.after_init();
            return reset_cate
        },
        get_selected: function(){

        },
        is_leaf: function(cur_cate_area){
            return global.is_leaf
        }
    };
})(jQuery);