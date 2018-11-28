/**
 * Created by GF on 2018/1/11
 * version 2.7
 */
$(function(){
    var cate_flag = false;
    var scroll_delay = null;
    var modal_trigger_cache; // 记录触发设置时间的按钮
    var current_site = "";
    var shop_id = $("#shop-id").val(),
        routeReg = /(\w+-?\w+?-?\w+?)\.(\w+)?\.?(\w+)?/i,
        v_area = $("#multi-site-info-area"),
        option_type = get_query_string("type");
    var temp_switch = { // 记录模板nav是否第一次点击
        "description": 0,
        "relation": 0,
        "size": 0
    };
    var nOpt = '<option>请选择</option>';
    var temp_list = []; // 记录选中的模板
    Date.prototype.Format = function(fmt){
        var o = {
            "M+" : this.getMonth()+1,                 //月份
            "d+" : this.getDate(),                    //日
            "h+" : this.getHours(),                   //小时
            "m+" : this.getMinutes(),                 //分
            "s+" : this.getSeconds(),                 //秒
            "q+" : Math.floor((this.getMonth()+3)/3), //季度
            "S"  : this.getMilliseconds()             //毫秒
        };
        if(/(y+)/.test(fmt)){
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
        }
        for(var k in o){
            if(new RegExp("("+ k +")").test(fmt)){
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
            }
        }
        return fmt;
    };
    var next_year = new Date();
    next_year.setFullYear(next_year.getFullYear()+1);
    next_year = next_year.Format('YYYY-MM-dd');
    var site_map = {
        GB: "英国站",
        FR: "法国站",
        DE: "德国站",
        IT: "意大利站",
        ES: "西班牙站",
        US: "美国站",
        CA: "加拿大站",
        MX: "墨西哥站",
        JP: "日本站",
        AU: "澳洲站",
        IN: "印度站"
    };
    var Amazon = {
        init: function(){
            Inform.init();
            var cate_plugin = $.fn.searchCategory.init("#cate-area",{
                "category_div": "#cate-area",
                "select_cate_url": "/index.php/index/index/category",
                "search_cate_url": "/interface/category/search",
                "frequently": true,
                "after_check": function(){$("#choose-category").prop("disabled", !$.fn.searchCategory.is_leaf())},
                "after_init": function(){$("#choose-category").prop("disabled", true)},
                "fre_cate_click": function(){
                    var cate_id = $(this).attr("data-id"),
                        cate_name = $(this).text();
                    $(".CategoryID[data-site='"+current_site+"']").attr("data-id", cate_id).text(cate_name);
                    if(!cate_flag) cate_flag = true;
                    var spec_dict = "";
                    if(cate_flag){
                        spec_dict = Amazon.get_spec_value();
                    }
                    Amazon.tip_toggle($(".CategoryID[data-site='"+current_site+"']"), '');
                    Amazon.get_specifics(cate_id, spec_dict, current_site);
                    $("#category-tree").modal("hide");
                },
                "data":{
                    shop_id: $("#shop-id").val(),
                    site_id: $("#site-id").val(),
                    parent_id: 0
                }
            });
            $('.noPro').each(function (index, item) {
                $(item).css('cursor', "pointer");
                $(item).off().on('click',function () {
                    $("html,body").animate({scrollTop: 0},300);
                })
            });
            $("#choose-category").click(Amazon.choose_category);
            $("#title").on('input', Amazon.title_input);
            $(".toggle-panel").click(Amazon.panel_toggle);
            $("#choose-site").on("click", "input", Amazon.check_site);
            $(".cate-modal-trigger").click(function(){
                $(".cancel-cate-search").trigger("click");
                var site_id_map = {
                    GB: 51,
                    FR: 48,
                    DE: 46,
                    IT: 50,
                    ES: 47,
                    US: 45,
                    CA: 44,
                    MX: 54,
                    JP: 52,
                    AU: 55,
                    IN: 49
                };
                current_site = $(this).attr("data-id");
                cate_plugin(site_id_map[current_site]);
                $("#category-tree").modal("show");
            });
            v_area.on("click", ".time-modal-trigger, .sku-modal-trigger", function(){
                    modal_trigger_cache = $(this);
                })
                .on("focus", "input", function(){
                    Amazon.tip_toggle($(this), '', false);
                })
                .on("click", ".gen-barcode", Amazon.set_barcode)
                .on("click", ".btn-apply-variation", Amazon.copy_variants);
            $(document).on("click", "#toggle-var", Amazon.panel_toggle);
            $(window).on("resize", function(){
                var pop = $(".batch-set-pop");
                if(pop.length>0){
                    var width = pop.closest("th").css("width");
                    pop.css("left", (parseInt(width)/3*2+2)+"px");
                }
            })
                .scroll(Amazon.scroll_listener);
            $("#va-stock-modal").find("[name='set-type']").click(Amazon.choose_set_type);
            $("#set-va-stock").click(Amazon.set_var_stock);
            $("#set-va-price").click(Amazon.set_var_price);
            $("#set-va-sale").click(Amazon.set_var_sale);
            $("#va-time-btn").click(Amazon.set_var_time);
            $("#va-sku-btn").click(Amazon.set_var_sku);
            $("#set-va-btn").click(Amazon.set_var);
            $("#set-time-s").datetimepicker({format: 'YYYY-MM-DD', defaultDate:{Default: true}});
            $("#set-time-e").datetimepicker({format: 'YYYY-MM-DD', defaultDate:{Default: true}}).val(next_year);
            $("#submit-btn").click(Amazon.submit_feed);
            $("#choose-shop-modal").on("click", "#choose-all-shops", function(){
                $(this).closest(".modal").find(":checkbox").prop("checked", $(this).prop("checked"));
            }).on("click", ".shop-checkbox", function(){
                var all_check = $("#choose-all-shops"),
                    modal = $("#choose-shop-modal");
                if(!$(this).prop("checked")){
                    all_check.prop("checked", false);
                }else{
                    if(modal.find(":checked").length >= modal.find(":checkbox").length){
                        all_check.prop("checked", true);
                    }
                }
            });
            $("#publish-choose-shop").click(Amazon.choose_shop_show);
            $("#submit-btn").click(Amazon.choose_shop_show);
            $("#publish-multi-site-pro").click(Amazon.publish_feed);
            $("#timing-publish-btn").click(Amazon.timing_publish);
            $("body").on("change", "#timer-y, #timer-M, #timer-d, #timer-H, #timer-m", Amazon.time_change)
                .on("click", "[data-type='single-timing']", Amazon.timing_ensure);
            $(".cancel-timing").click(Amazon.cancel_timing);
            $("#just-translate").click(Amazon.just_translate);
            $('#info-template-new').on('show.bs.modal', Amazon.info_new_show_before).on("change", "input[type=\"checkbox\"]", Amazon.info_new_check).on("click", "a[data-toggle=\"tab\"]", Amazon.info_new_tab);
            $("#add-info-temp").click(Amazon.add_info_temp);
            $("#refer-info-modal").on("click", "#ensure-refer-info", Amazon.render_refer_info);
//            Amazon.render_page();
            $(".v-time-s, .v-time-e").each(function(i,item){
                    $(item).datetimepicker({format: 'YYYY-MM-DD'})
            });
        },
        title_input: function(){
            if($(this).val().trim() != "") Amazon.tip_toggle($(this), '', false);
            else Amazon.tip_toggle($(this), '此项为必填项,不能为空', true);
        },
        info_new_show_before: function () {
            $(this).find("a[data-id=\"description\"]").trigger("click");
            $(this).find("input[type=\"checkbox\"]").each(function(k, v){
                $(v).prop("checked", false);
            });
            temp_list = [];
        },
        info_new_check: function(){
            var $this = $(this),
                $id = $this.attr("data-id");
            if($this.prop("checked")){
                temp_list.push($id);
            }else{
                var index = $.inArray($id, temp_list);
                if(index != -1) temp_list.splice(index, 1);
            }
        },
        info_new_tab: function () {
            var $this = $(this);
            var $id = $this.attr("data-id"),
                target = $('.temp-area[data-id="'+$id+'"]'),
                err_sp = target.find(".error-span");
            err_sp.length > 0 && err_sp.hide();
            target.show().siblings().hide();
            if(temp_switch[$id] == 0){
                target.empty();
                err_sp = target.find(".error-span");
                $(".load-info").show();
                $.ajax({
                    "url": "/template/" + $("#shop-id").val() + "/list/" + $id,
                    "type": "POST",
                    "success": function(data){
                        target.show().siblings().hide();
                        if(data.status == 0){
                            if(err_sp.length == 1){
                                err_sp.show().html(data.message);
                            }else target.append("<div class=\"error-span\">" + data.message + "</div>");
                            return 0;
                        }
                        if(data["json"].length == 0){
                            if(err_sp.length == 1){
                                err_sp.show().html(data.message);
                            }else target.append("<div class=\"error-span\">您尚未设置模板</div>");
                            return 0;
                        }else{
                            temp_switch[$id] = 1;
                            Amazon.render_info_temps(target, data["json"],$id);
                        }
                    }
                });
            }
        },
        add_info_temp: function () {
            var temp_str = "";
            var $this = $(this);
            if(temp_list.length > 0){
                $this.prop("disabled", true);
                $this.text("处理中");
            }
            for(var i=0;i<temp_list.length;i++){
                var $id = temp_list[i],
                    $checkbox = $('[data-id="'+$id+'"]'),
                    is_custom = !($checkbox.attr("data-custom") == "false");
                if(is_custom){
                    $.ajax({
                        "async": false,
                        "url": "/template/" + $("#shop-id").val() + "/single",
                        "type": "POST",
                        "data": {
                            "id": $id
                        },
                        "success": function (data) {
                            if (data.status == 1) {
                                var temp_data = data["json"],
                                    $type = $checkbox.attr("data-type");
                                if($type == "size"){
                                    if (temp_data["details"]["is_guide"]) {
                                        temp_str += temp_data["size_chart_html"] + temp_data["size_guide_html"];
                                    } else {
                                        temp_str += temp_data["size_chart_html"];
                                    }
                                }else if($type == "description") {
                                    if (temp_data["details"]["title_hide"] == "true") {
                                        temp_str += temp_data["template_html_no_title"];
                                    } else {
                                        temp_str += temp_data["template_html"];
                                    }
                                }else{
                                    temp_str += temp_data["template_html"];
                                }
                            } else {
                                Inform.show("添加失败")
                            }
                        }
                    })
                }else{
                    var image_url = "https://www.actneed.com/static/image/{0}?id={1}&ti={2}&ty={3}";
                    image_url = image_url.format(
                        $type == "custom" ? "widget1.png" : "widget2.png",
                        $id, $checkbox.attr("data-title"), $type);
                    temp_str += "<img src=\"{0}\" class=\"actneed-temp\"/>".format(encodeURI(image_url));
                }
            }
            $this.prop("disabled", false);
            $this.text("确认");
            window.current_editor.execCommand('inserthtml', temp_str.replace(/\n/g, "").replace(/<a class="delete" href="#" style="position: absolute; top: 0px; right: 1px; display: none;">×<\/a>/g, ""));
            $("#info-template-new").modal("hide");
        },
        render_refer_info: function(){
            var check_radio = $("[name='info-refer']:checked");
            if(check_radio.length > 0){
                var id = check_radio.attr("data-id");
                $.ajax({
                    url: "/template/"+shop_id+"/single",
                    "type": "POST",
                    "data": {
                        "id": id
                    },
                    success: function(data){
                        if(data.status == 1){
                            var infos = data["json"];
                            if(infos["Title"]){
                                $("#title,#Title").val(infos["Title"]);
                            }
                            if(infos["Description"]){
                                window.ue_des.setContent(infos["Description"]);
                            }
                            $("#pac-length").val(infos["PackageLength"] || "");
                            $("#pac-width").val(infos["PackageWidth"] || "");
                            $("#pac-height").val(infos["PackageHeight"] || "");
                            $("#pac-weight").val(infos["PackageWeight"] || "");
                            $("#refer-info-modal").modal("hide");
                        }
                    }
                })
            }else{
                $("#refer-info-modal").modal("hide");
            }
        },
        render_info_temps: function(target, templates, type){
            var table_head = "<table class=\"table table-hover " +
                "table-striped\"><tr><td>模块名称</td>" +
                "<td>模块类型</td>" + "<td>是否添加模块</td></tr>";
            var table_tail = "</table>";
            var rows = "";
            for(var i=0; i<templates.length;i++) {
                var template = templates[i];
                var check_box = "<input type=\"checkbox\" data-type=\""+type+"\" data-custom=\""+template["is_custom"]+"\"" +
                    " data-title=\"" + template["template_name"] + "\" data-id=\"" + template["template_oid"] + "\" />";
                rows += "<tr><td>{0}</td><td>{1}</td><td>{2}</td>"
                        .format(template["template_name"], template["mold_name"], check_box);
            }
            target.html(table_head + rows + table_tail);
        },
        check_url: function(str_url){
            var strRegex = '^((https|http|ftp|rtsp|mms)?://)'
                + '?(([0-9a-z_!~*\'().&=+$%-]+: )?[0-9a-z_!~*\'().&=+$%-]+@)?' //ftp的user@
                + '(([0-9]{1,3}.){3}[0-9]{1,3}' // IP形式的URL- 199.194.52.184
                + '|' // 允许IP和DOMAIN（域名）
                + '([0-9a-z_!~*\'()-]+.)*' // 域名- www.
                + '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].' // 二级域名
                + '[a-z]{2,6})' // first level domain- .com or .museum
                + '(:[0-9]{1,4})?' // 端口- :80
                + '((/?)|' // a slash isn't required if there is no file name
                + '(/[0-9a-z_!~*\'().;?:@&=+$,%#-]+)+/?)$';
            var re = new RegExp(strRegex);
            return re.test(str_url)
        },
        set_var_stock: function () {
            $("#set-title").text("库存");
            $("#set-va-btn").attr({"data-t": "v-stock", "data-unit": "int"});
            $("#set-unit").text("数量");
            $("#va-stock-modal").modal("show");
        },
        set_var_price: function () {
            $("#set-title").text("价格");
            $("#set-va-btn").attr({"data-t": "v-price", "data-unit": "float"});
            $("#set-unit").text("金额");
            $("#va-stock-modal").modal("show");
        },
        set_var_sale: function () {
            $("#set-title").text("促销价");
            $("#set-va-btn").attr({"data-t": "v-cu", "data-unit": "float"});
            $("#set-unit").text("金额");
            $("#va-stock-modal").modal("show");
        },
        set_var_time: function () {
            modal_trigger_cache && modal_trigger_cache.closest(".sku-variation").find(".v-time-s").val($("#set-time-s").val()).end().find(".v-time-e").val($("#set-time-e").val());
            $("#va-time-modal").modal("hide");
        },
        set_var_sku: function () {
            var sku = [$("#sku-be").val().trim(),"-{0}-", $("#sku-af").val().trim()].join(""),
                trs = modal_trigger_cache.closest(".sku-variation").find(".variation-row");
            for (var i=0; i<trs.length; i++){
                var tr = trs.eq(i),
                    middle = "";
                tr.find(".variation-attr").each(function(m,n){
                    middle += "-" + ($(n).attr("data-value") || $(n).val().trim()).toLowerCase()}
                );
                tr.find(".v-sku").val(sku.format(middle.substr(1) || (new Date).getTime()));
            }
            $("#va-sku-modal").modal("hide");
        },
        set_var: function () {
            var self = $(this),
                modal = $("#va-stock-modal"),
                this_radio = modal.find("[name='set-type']").filter(":checked"),
                type =  this_radio.val(),
                num = this_radio.closest(".form-inline").find(":text").val().trim(),
                way = this_radio.closest(".form-inline").find("select").val(),
                unit = self.attr("data-unit"),
                target = $("."+self.attr("data-t"));
            if(num){
                target.each(function(){
                    var $this = $(this),
                        o_value = $this.val().trim()||"0",
                        t_value;
                    if(type=="set"){
                        t_value = num;
                    }else if(type=="rate"){
                        if(unit=="int"){
                            t_value = parseInt(way=="add"?parseInt(o_value)+parseInt(o_value)*parseFloat(num)/100:parseInt(o_value)-parseInt(o_value)*parseFloat(num)/100);
                        }else{
                            t_value = parseFloat(way=="add"?parseFloat(o_value)+parseFloat(o_value)*parseFloat(num)/100:parseFloat(o_value)-parseFloat(o_value)*parseFloat(num)/100);
                        }
                    }else if(type=="num"){
                        if(unit=="int"){
                            t_value = way=="add"?parseInt(o_value)+parseInt(num):parseInt(o_value)-parseInt(num);
                        }else{
                            t_value = way=="add"?parseFloat(o_value)+parseFloat(num):parseFloat(o_value)-parseFloat(num);
                        }
                    }
                    $this.val(t_value);
                })
            }
            modal.modal("hide");
        },
        choose_category: function(){
            $(".cate-search-ul").empty();
            var cate_info = $(".selected-cate-displayer"),
                cate_id = cate_info.attr("data-id"),
                $cate_text = $(".CategoryID[data-site='"+current_site+"']");
            if(!cate_flag) cate_flag = true;
            var spec_dict = "";
            if(cate_flag){
                spec_dict = Amazon.get_spec_value();
            }
            Amazon.tip_toggle($cate_text, '');
            $cate_text.attr("data-id", cate_id).html(cate_info.text());
            Amazon.get_specifics(cate_id, spec_dict, current_site);
            $("#category-tree").modal("hide");
        },
        get_spec_value: function(){
            var pro_specifics = {};
            $("#pro-prop").find(".form-group").each(function(){
                var $this = $(this),
                    type = $this.attr("data-type"),
                    name = $this.attr("data-name"),
                    value,
                    temp_list;
                if(type=="check_box"){
                    var boxs = $this.find(":checkbox").filter(":checked");
                    temp_list = [];
                    boxs.length&&boxs.each(function(){
                        temp_list.push($(this).attr("data-value"))
                    });
                    temp_list.length > 0 && (pro_specifics[name] = temp_list);
                }else if(type == "list_box"){
                    value = $this.find("select").val();
                    value&&(pro_specifics[name] = value);
                }else if(type =="input"){
                    value = $this.find(":text").val().trim();
                    value&&(pro_specifics[name] = value);
                }
            });
            return pro_specifics
        },
        get_specifics: function(category_id, spec_dict, site){
            $.ajax({
                url: "/index.php/index/Api/type",  // "/amazon/" + shop_id + "/api/product_type"
                type: "POST",
                async: false,
                data: {
                    child_id: category_id
                },
                dataType: "json",
                success: function(data){
                    if(data.status){ // 后台要提供status
                        
                        $("#ProductType[data-site='"+current_site+"']").empty();
                        $("#changeModel[data-site='"+current_site+"']").empty().closest('.form-group').hide();
                        $(".panel-danger[data-site='"+current_site+"']").hide();
                        $('.panel-success[data-site="'+current_site+'"]').hide();
                        $('#item-type[data-site="'+current_site+'"]').val(data['item_type']);
                        Amazon.display_pro(data.product_type, spec_dict, null, category_id);
                    }
                }
            });
        },
        display_pro: function (pros, spec_dict, site, category_id) {
            site = site || current_site;
            var html = $(),
                content = $("#ProductType[data-site='"+site+"']");
            if(pros.length == 0){
                html = "该分类没有产品属性";
                content.text(html);
                return 0;
            }
            content.empty();
            var opt = '';
            for(var i=0; i<pros.length; i++){
                opt += '<option data-name="'+pros[i]+'">'+pros[i]+'</option>';
            }
            //console.log(content,nOpt,opt);
            Amazon.shopSpecificalShow(site);
            content.append(nOpt,opt);
            content.on('change',function () {
                $('#changeModel[data-site="'+site+'"]').empty();
                $('.panel-success[data-site="'+site+'"]').hide();
                Amazon.check_pro_type(category_id,this,site);
            });
            if(content.find('option[data-name]').length === 1){
                content.find('option[data-name]').attr("selected", true);
                $(".panel-danger[data-site='"+site+"']").show();
                Amazon.get_attribute(category_id, content.find('option[data-name]').html(), site);
            }
        },
        shopSpecificalShow: function (site) {
            $('#ProductType[data-site="'+site+'"]').closest('.form-group').show();
            $('div[data-id="product-title"][site-id="'+site+'"]').show();
            $('div[data-id="ParentSKU"][site-id="'+site+'"]').show();
            $('#Description'+site+'').closest('.form-group').show();
            $('div[data-id="max-time"][site-id="'+site+'"]').show();
            $('div[data-id="Brand"][site-id="'+site+'"]').show();
            $('div[data-id="Manufacture"][site-id="'+site+'"]').show();
            $('div[data-id="MSRP"][site-id="'+site+'"]').show();
            $('div[data-id="UPC"][site-id="'+site+'"]').show();
            $('div[data-id="price"][data-site="'+site+'"]').show();
            $('div[data-id="setSal"][data-site="'+site+'"]').show();
            $('div[data-id="stock"][data-site="'+site+'"]').show();
            $('div[data-id="keywords"][data-site="'+site+'"]').show();
            $('div[data-id="bulletPoint"][data-site="'+site+'"]').show();
            $('.noPro[data-site="'+site+'"]').each(function (i, item) {
                $(item).hide()
            });
        },
        check_pro_type: function(category_id, ele, site){
            if($(ele).find('option:selected').length && $(ele).find('option:selected').val() !== '请选择'){
                Amazon.get_attribute(category_id, $(ele).find('option:selected').text(), site);
                $(".panel-danger[data-site='"+site+"']").show();
                if($(".panel-danger[data-site='"+site+"']").find('div.firstAppend').length && $(".panel-danger[data-site='"+site+"']").find('div.firstAppend').children('div.form-group').length){
                    $(".panel-danger[data-site='"+site+"']").find('div.firstAppend').children('div.form-group').each(function (index,item) {
                        if($(item).css('display') === "none"){
                            $(item).css('display',"block");
                        }
                    })
                };
            }else if($(ele).find('option:selected').text() == '请选择'){
                $(".panel-danger[data-site='"+site+"']").hide();
                $('#changeModel[data-site="'+site+'"]').closest('.form-group').hide();
            }
        },
        get_attribute: function(category_id,pro_type,site){
            $.ajax({
                url: "/index.php/index/Api/attribute",
                type: "POST",
                async: false,
                data: {
                    child_id: category_id,
                    product_type: pro_type,
                    site: site
                },
                dataType: "json",
                success: function(data){
                    if(data.status){ // 后台要提供status
                        current_site = site? site : current_site;
                        $(".sku-pro[data-site='"+current_site+"']").empty();
                        $(".sku-variation[data-site='"+current_site+"']").empty();
                        if(data.VariationTheme .length > 0){
                            $('#changeModel[data-site="'+site+'"]').closest('.form-group').show();
                        }else {
                            $('#changeModel[data-site="'+site+'"]').closest('.form-group').hide();
                        }
                        var sku_item = $('#changeModel[data-site="'+current_site+'"]');
                        Amazon.check_sku_item(sku_item,data,current_site);
                        Amazon.check_brand(data,current_site);
                        AmazonRule.bind_specifics(data,current_site);
                        $(".cate-tip").remove();
                    }
                }
            });
        },
        check_sku_item: function (sku_item,data,sitId) {
            if(data.VariationTheme && data.VariationTheme.length > 0){
                sku_item.empty();
                var opt = '';
                data.VariationTheme.forEach(function(item){
                     opt += "<option data-name='" + item["relation"] + "' data-value ='" + item["v_name"] + "'>"+ item["v_name"] + "</option>";
                });
                sku_item.append(nOpt,opt);
                var siteId = sku_item.attr('data-site');
                sku_item.on('change',function(){
                    if($(this).find('option:selected').length){
                        $('.panel-success[data-site="'+siteId+'"]').show();
                        var skuItemVal = $(this).find('option:selected').attr('data-name');
                        skuItemVal = skuItemVal ? skuItemVal : '';
                        Amazon.check_sku_prop(data,skuItemVal,sitId);
                    }
                    if($(this).find('option:selected').val() === "请选择"){
                        $('.panel-success[data-site="'+siteId+'"]').hide();
                    }
                })
            }else{
                sku_item.closest('.form-group').hide();
            }
        },
        check_sku_prop:function (data,skuItem,sitId) {
            var skus = [];
            skus = skuItem.split(',');
            vueParent.$refs.skuItem.forEach(function (item) {
                if(item.siteId == sitId){
                    item.skudata = skus;
                    item.data = data;
                    item.priceUnite = $('#'+sitId+'').val();
                }
            });
        },
        check_brand: function (data,current_site) {
            //console.log(data)
            var ary = ['ISBN','UPC','EAN','PZN','GTIN','GCID'];
            var opt = '';
            $('#is-brand[data-site="'+current_site+'"]').closest('.form-group').show();
            $('#is-brand[data-site="'+current_site+'"]').eq(1).attr('checked',true).prop('checked',true);
            $('#special-upc[data-site="'+ current_site +'"]').empty();
            $('#product-id-type[data-site="'+ current_site +'"]').empty();
            radio_show();
            $('#is-brand[data-site="'+current_site+'"]').parent().each(function (index,item) {
                $(item).off().on('click',function () {
                    $(this).find('input').prop('checked',true).parent().siblings().find('input').removeProp('checked');
                    if(index == 0){
                        $('#special-upc[data-site="'+ current_site +'"]').closest('.form-group').show();
                        if($('#special-upc[data-site="'+ current_site +'"]').find('option').length === 2 ){
                            $('#special-upc[data-site="'+ current_site +'"]').find('option').eq(1).attr('selected',true);
                        }
                        $('#product-id-type[data-site="'+ current_site +'"]').closest('.form-group').hide();
                    }else{
                        radio_show();
                    }
                })
            });
            function radio_show(){
                $('#product-id-type[data-site="'+ current_site +'"]').closest('.form-group').show();
                $('#special-upc[data-site="'+ current_site +'"]').closest('.form-group').hide();
            };
            ary.forEach(function(item){
                opt += '<option value="'+item+'">'+item+'</option>';
            });
            $('#product-id-type[data-site="'+ current_site +'"]').append(nOpt,opt);
            bind_select();
            function bind_select() {
                var op = '';
                if(data['special_upc'] !== ['']){
                    data['special_upc'].forEach(function(item){
                        op += '<option value="'+item+'">'+item+'</option>';
                    })
                    $('#special-upc[data-site="'+ current_site +'"]').append(nOpt,op);
                }
            }
        },
        get_sku_info: function(site){
            //获取产品sku
            var $tab = $('#sku-variation[data-site="'+site+'"]').find("table.table"),
                        pro_skus = [];
            $tab.find("tr.variation-row").each(function (i, v) {
                if (i != 0 && $(v).find(":checkbox").prop("checked")) {
                    var var_spec = [];
                    var sku_info = {};
                    var img_list = [];
                    $(v).next("tr").find("img").each(function (k, v) {
                        var url = $(v).attr("src");
                        if (url != "/static/image/add.png" && img_list.length < 9) {
                            img_list.push(url);
                        }
                    });
                    $(v).find(".variation-attr").each(function (m, n) {
                        var name = $(n).attr("data-name");
                        var value = $(n).attr("data-value");
                        var_spec.push({
                            "NameID": "",
                            "Name": name,
                            "ValueID": "",
                            "Value": value,
                            "Image": []
                        });
                    });
                    sku_info = {
                        "VariationSpecifics": var_spec,
                        "Stock": $(v).find(".v-stock").val().trim(),
                        "Price": $(v).find(".v-price").val().trim(),
                        "SKU": $(v).find(".v-sku").val().trim(),
                        "Sale": {
                            "SalePrice": $(v).find(".v-sale-price").val().trim(),
                            "SaleDateFrom": $(v).find(".v-time-s").val().trim(),
                            "SaleDateTo": $(v).find(".v-time-e").val().trim()
                        },
                        "Info": JSON.parse($(v).find(".v-title-keys").val().trim()),
                        "UPC": $(v).find(".v-upc").val().trim(),
                        "PictureURL": img_list // 新的获取方式 记得改
                    };
                    $(v).find(".spec-attr").each(function (a, b) {
                        var name = $(b).attr("data-name");
                        var val = $(b).find("option:selected").attr("data-name");
                        var value = val ? val : "";
                        sku_info[name] = value;
                    });
                    pro_skus.push(sku_info);
                }
            });
            return pro_skus;
        },
        get_spec_info: function(siteBox,site){
            var pro_specifics = [];
            siteBox.children('div.form-group').each(function (i,e) {
                var name = $(e).children('.col-md-2.control-label').children('span.asterisk').html();
                var addSecond = $(e).children('div.col-md-10').children('div').children('div.secondAppend');

                var inpL = $(e).children('div.col-md-10').children('div').children('div').children('input[type="text"]'),
                    sele = $(e).children('div.col-md-10').children('div').children('div').children('select[data-id="choice-val"]'),
                    choice_N = $(e).children('div.col-md-10').children('div').children('div.col-md-4').children('select[data-name="choice-name"]'),
                    choice_V = $(e).children('div.col-md-10').children('div').children('div.col-md-8').children(),
                    boolL = $(e).children('div.col-md-10').children('div').children('div').children('.radio-inline').children('input:checked');
                var Unit = $(e).children('div.col-md-10').children('div').children('div').eq(1).find("select option:selected");

                // get second and three route value
                if(addSecond){
                    (addSecond.find('div.form-group')).each(function(x,v){
                        var secondName = $(v).children('.control-label.col-md-2').children('span.asterisk').html();
                        var threeAp = $(v).children('.material.col-md-10').children('div.threeAppend');
                        // get three
                        if(secondName === undefined) return;
                        if(threeAp && threeAp[0]){
                            threeAp.children('div .form-group').each(function(n,ele){
                                var threeName = $(ele).find('.col-md-12.material.padding-1r .col-md-2.text-right.rBor span.asterisk').html();
                                var threeInpL = $(ele).children('div').eq(0).children('div').find('input[type="text"]');
                                var threeSele = $(ele).children('div').eq(0).children('div').find('select[data-id="choice-val"]');
                                var threeBoolL = $(ele).children('div').eq(0).children('div').find('.radio-inline');
                                var unitVals = $(ele).children('div').children('div.col-md-10').children('div').last().find('select[data-id="Unit"]');
                                var new_name = name+'.'+secondName+'.'+threeName;
                                var val = [];
                                var unitVal = '';
                                var value = val ? val : [];
                                if(threeInpL.length){
                                    $.each(threeInpL,function(n,tem){
                                        var cur = $(tem).val().trim();
                                        val.push(cur);
                                        return val;
                                    });
                                };
                                if(threeSele.length){
                                    $.each(threeSele,function(n,tem){
                                        var cur = $(tem).find('option:selected').val();
                                        val.push(cur);
                                        return val;
                                    });
                                };
                                if(threeBoolL.length){
                                    val = threeBoolL.children('input:checked').attr("data-name");
                                };
                                if(unitVals.length) {
                                    unitVal = unitVals.val();
                                };
                                pro_specifics.push({
                                    "NameID": "",
                                    "Name": new_name || "",
                                    "Value": value || "",
                                    "ValueID": "",
                                    "unit": unitVal || ''
                                });
                            })
                        } else {
                            var new_name = name+'.'+secondName;
                            var unitVal = '';
                            var val = [];
                            var value = val ? val : [];
                            var inpList = $(v).children('div').children('div').children('input[type="text"]');
                            var seleList = $(v).children('div').children('div').children('select[data-id="choice-val"]');
                            var boolList = $(v).children('div').find('.radio-inline').children('input:checked');
                            var unitVals = $(v).children('div').children('div').find('select[data-id="Unit"] option:selected');
                            if(inpList.length){
                                //console.log(inpList);
                                $.each(inpList,function(n,tem){
                                    var cur = $(tem).val().trim();
                                    val.push(cur);
                                    return val;
                                });
                            }else if(seleList.length){
                                $.each(seleList,function(n,tem){
                                    var cur = $(tem).children('option:selected').val();
                                    val.push(cur);
                                    return val;
                                });
                            }else if(boolList.length){
                                val.push(boolList.attr("data-name"));
                            };
                            if(unitVals.length) {unitVal = unitVals.val()};
                            pro_specifics.push({
                                "NameID": "",
                                "Name": new_name || "",
                                "Value": value || "",
                                "ValueID": "",
                                "unit": unitVal || ''
                            });
                        }
                    });
                };
                //get first route value
                if(inpL || sele || boolL || choice_N || choice_V){
                    var val = [];
                    var unitVal = '';
                    if(!inpL.length && !sele.length && !boolL.length && !choice_N.length){
                        val = [name]
                    };
                    if(inpL.length){
                        $.each(inpL,function(n,tem){
                            var cur = $(tem).val().trim();
                            val.push(cur);
                            return val;
                        });
                    };
                    if(sele.length && sele.hasClass('choice')){
                        $.each(sele,function(n,tem){
                            var cur = $(tem).find('option:selected').val().trim();
                            val.push(cur);
                            return val;
                        });
                    };
                    if(boolL.length){
                        val = boolL.attr("data-name");
                    };
                    if(choice_N.length){
                        name = 'Choice'+'.'+choice_N.find('option:selected').val();
                        if(choice_V.length){
                            if(choice_V.prop('tagName').toLowerCase() == 'input'){
                                val.push(choice_V.val().trim());
                            }else if(choice_V.prop('tagName').toLowerCase() == 'select'){
                                val.push(choice_V.find('option:selected').val().trim());
                            }
                        }
                    };
                    if(Unit.length) {unitVal = Unit.val()};
                    var value = val ? val : [];
                    pro_specifics.push({
                        "NameID": "",
                        "Name": name || "",
                        "Value": value || "",
                        "ValueID": "",
                        "unit": unitVal || ''
                    });
                }
            });
            return pro_specifics
        },
        gen_random: function(){
            return parseInt(Math.floor(Math.random()*10).toString() + Math.floor(Math.random()*10).toString() + (new Date().getTime().toString().substr(3)+'001'))
        },
        set_barcode: function(){
            var first = Amazon.gen_random();
            $(this).closest(".sku-variation").find(".v-upc").each(function(k, v){
                $(v).val(first+k);
            })
        },
        get_info: function () {
            var site_list = [],
                site_short = "",
                desc,
                site_info_area;
            $("#choose-site").find("input:checked").each(function(){
                site_list.push($(this).val());
            });
            product["MultiSiteInfo"] = {};
            product["PictureURLs"] = [];
            product["SourceID"] = $("#source-id").val();
            product["SupplyLink"] = $("#supply-link").val().trim();
            product["ProductWeight"] = $("#ProductWeight").val();
            product["Condition"] = {
                ID: '',
                Name: $("#Condition").find('option:selected').val().trim()
            };
            product["ShippingWeight"]["Weight"] = $("#shipping-weight").val().trim();
            product["ShippingWeight"]["Unit"] = $("#WeightUnit").find('option:selected').val().trim();
            // 获取单体图片
            $("#feed_img").find("img").each(function(k, v){
                $(v).attr("src")!="/static/image/add.png" && product["PictureURLs"].push($(v).attr("src"));
            });
            // 不同站点信息获取
            for(var i=0;i<site_list.length;i++){
                site_short = site_list[i];
                var temp_key_data = [],
                    temp_point_data = [];
                var $brand_seller = $('#is-brand[name="'+site_short+'"]');
                var is_brand = $brand_seller.filter(":checked").val().trim();
                switch (site_short){
                    case "GB":
                        desc = GB.getContent();
                        break;
                    case "FR":
                        desc = FR.getContent();
                        break;
                    case "DE":
                        desc = DE.getContent();
                        break;
                    case "IT":
                        desc = IT.getContent();
                        break;
                    case "ES":
                        desc = ES.getContent();
                        break;
                    case "US":
                        desc = US.getContent();
                        break;
                    case "CA":
                        desc = CA.getContent();
                        break;
                    case "MX":
                        desc = MX.getContent();
                        break;
                    case "JP":
                        desc = JP.getContent();
                        break;
                    case "AU":
                        desc = AU.getContent();
                        break;
                    case "IN":
                        desc = IN.getContent();
                        break;
                };
                site_info_area = $(".site-info-area[data-id='"+site_short+"']");
                product["MultiSiteInfo"][site_short] = {};
                product["MultiSiteInfo"][site_short]["Category"] = {};
                product["MultiSiteInfo"][site_short]["ItemType"] = $('#item-type[data-site="'+site_short+'"]').val().trim();
                product["MultiSiteInfo"][site_short]["ProductType"] = site_info_area.find("[data-id='ProductType']").find("option:selected").val().trim();
                if(site_info_area.find("[data-id='changeModel']").find("option").length){
                    product["MultiSiteInfo"][site_short]["VariationTheme"] = site_info_area.find("[data-id='changeModel']").find("option:selected").val().trim() == '请选择'? '' : site_info_area.find("[data-id='changeModel']").find("option:selected").val().trim();
                }
                //获得是否品牌入驻卖家信息
                product["MultiSiteInfo"][site_short]["BrandSeller"] = $brand_seller.filter(":checked").val().trim();
                product["MultiSiteInfo"][site_short]["ProductIdType"] = is_brand == "1" ? $("#special-upc").val().trim() : $("#product-id-type").val().trim();

                product["MultiSiteInfo"][site_short]["Title"] = site_info_area.find("input[data-id='product-title']").val().trim();
                product["MultiSiteInfo"][site_short]["ParentSKU"] = site_info_area.find("input[data-id='ParentSKU']").val().trim();
                product["MultiSiteInfo"][site_short]["Description"] = desc; //产品描述
                product["MultiSiteInfo"][site_short]["DispatchTimeMax"] = site_info_area.find("input[data-id='max-time']").val().trim();
                product["MultiSiteInfo"][site_short]["Brand"] = site_info_area.find("input[data-id='Brand']").val().trim();
                product["MultiSiteInfo"][site_short]["Manufacture"] = site_info_area.find("input[data-id='Manufacture']").val().trim();
                product["MultiSiteInfo"][site_short]["MSRP"] = site_info_area.find("input[data-id='MSRP']").val().trim();
                product["MultiSiteInfo"][site_short]["UPC"] = site_info_area.find("input[data-id='UPC']").val().trim();
                product["MultiSiteInfo"][site_short]["StartPrice"] = site_info_area.find("input[data-id='price']").val().trim();
                product["MultiSiteInfo"][site_short]["Sale"] = {
                    SalePrice: '',
                    SaleDateFrom: '',
                    SaleDateTo: ''
                };
                if(site_info_area.find("input[data-id='setSal']").length){
                    product["MultiSiteInfo"][site_short]["Sale"] = {
                        SalePrice: site_info_area.find('#SalePrice:visible').val().trim(),
                        SaleDateFrom: site_info_area.find('#SaleDateFrom:visible').val().trim(),
                        SaleDateTo: site_info_area.find('#SaleDateTo:visible').val().trim()
                    };
                };
                product["MultiSiteInfo"][site_short]["Quantity"] = site_info_area.find("input[data-id='stock']").val().trim();
                site_info_area.find("input[name='keyword']").each(function(i,t){
                    temp_key_data.push($(t).val().trim());
                    return temp_key_data;
                });
                product["MultiSiteInfo"][site_short]["KeyWords"] = temp_key_data;
                site_info_area.find("input[name='bullet_point']").each(function(i,t){
                    temp_point_data.push($(t).val().trim());
                    return temp_point_data;
                });
                product["MultiSiteInfo"][site_short]["BulletPoints"] = temp_point_data;
                product["MultiSiteInfo"][site_short]["ProductSpecifics"] = Amazon.get_spec_info(site_info_area.find("div.firstAppend"),site_short);
                if($('.panel-success[data-site="'+site_short+'"]').css("display") !== "none"){
                    product["MultiSiteInfo"][site_short]["ProductSKUs"] = Amazon.get_sku_info(site_short);
                }
                product["MultiSiteInfo"][site_short]["Category"]["ID"] = $(".CategoryID[data-site='"+site_short+"']").attr("data-id");
                product["MultiSiteInfo"][site_short]["Category"]["Name"] = $(".CategoryID[data-site='"+site_short+"']").text().split(" > ");
            }
        },
        choose_shop_show: function(){
            if($(this).text() === '保存到待发布'){
                $('#just-translate').attr('data-btn','保存到待发布');
            };
            if($(this).text() === '直接发布'){
                $('#just-translate').attr('data-btn','直接发布');
            };
            if(!Amazon.check_amazon()){ // 修改 检查可见部分
                return 0;
            }
            $.ajax({
                "type": "POST",
                "url": "/warehouse/shop/get",
                "data": {},
                "dataType": "json",
                "success": function (data) {
                    var sites = data["shops"],
                        shops = sites["Amazon"],
                        site_list = [],
                        shop_str = "",
                        site_map = {
                            51: "GB",
                            48: "FR",
                            46: "DE",
                            50: "IT",
                            47: "ES",
                            45: "US",
                            44: "CA",
                            54: "MX",
                            52: "JP",
                            55: "AU",
                            49: "IN"
                        },
                        shops_len = shops.length;
                     $("#choose-shop-area").css('overflow',"hidden").empty();
                    $("#choose-site").find("input:checked").each(function(){
                        site_list.push($(this).val());
                    });
                    var oDiv = '';
                        var arr = [];
                        var GBarr = [], FRarr = [], DEarr = [], ITarr = [], ESarr = [], USarr = [], CAarr = [], MXarr = [], JParr = [], AUarr = [], INarr = [];

                    for(var i=0;i<shops_len;i++){
                        var $shop = shops[i];
                        var site_name = [];
                        var oDiv = '<div class="form-group"></div>',
                            aDiv = '';
                        if($.inArray(site_map[$shop["site_id"]], site_list) != -1) {
                            if(site_name.length > 0){
                                if(site_name.indexOf($shop["site_name"]) === -1){
                                    site_name.push($shop["site_name"]);
                                }
                            }else {
                                site_name.push($shop["site_name"]);
                            };
                            if($shop["site_name"] == 'UK'){ //UK英国站（GB）
                                GBarr.push($shop);
                            }
                            if($shop["site_name"] == 'Germany'){
                                DEarr.push($shop);
                            }
                            if($shop["site_name"] == 'France'){
                                FRarr.push($shop);
                            }
                            if($shop["site_name"] == 'Italy'){
                                ITarr.push($shop);
                            }
                            if($shop["site_name"] == 'Spain'){
                                ESarr.push($shop);
                            }
                            if($shop["site_name"] == 'US'){
                                USarr.push($shop);
                            }
                            if($shop["site_name"] == 'Canada'){
                                CAarr.push($shop);
                            }
                            if($shop["site_name"] == 'Mexico'){
                                MXarr.push($shop);
                            }
                            if($shop["site_name"] == 'Japan'){
                                JParr.push($shop);
                            }
                            if($shop["site_name"] == 'Australia'){
                                AUarr.push($shop);
                            }
                            if($shop["site_name"] == 'India'){
                                INarr.push($shop);
                            }
                        }
                    }
                    if(GBarr.length){
                        arr.push(GBarr);
                    }if(FRarr.length){
                        arr.push(FRarr);
                    }if(ITarr.length){
                        arr.push(ITarr);
                    }if(ESarr.length){
                        arr.push(ESarr);
                    }if(DEarr.length){
                        arr.push(DEarr); //------
                    }if(USarr.length){
                        arr.push(USarr);
                    }if(MXarr.length){
                        arr.push(MXarr);
                    }if(CAarr.length){
                        arr.push(CAarr); //------
                    }if(JParr.length){
                        arr.push(JParr);
                    }if(AUarr.length){
                        arr.push(AUarr);
                    }if(INarr.length){
                        arr.push(INarr);
                    }
                    var aDiv = '';
                    if(shops_len > 1){
                        var shop_str_all = '<div class="checkbox all">' +
                                '<label>' +
                                '<input type="checkbox" id="choose-all-shops"> 全选' +
                                '</label>' +
                                '</div>';
                        if(!$("#choose-shop-area").find('div.all').length){
                         $("#choose-shop-area").append(shop_str_all);
                        }
                    }
                    if(arr.length > 0){
                        arr.forEach(function (item) {
                            item.forEach(function (it) {
                                aDiv = '<div class="list" style="float: left; width: auto; height: auto; margin-right: 15px;">\
                                    <div class="nav" style="height: 30px;line-height: 30px;" data-name="'+it["site_name"]+'">'+it["site_name"]+':</div>\
                                    <div class="content">\
                                    </div>\
                                </div>';
                                shop_str = '<div class="checkbox" data-name="'+it["name"]+'">' +
                                    '<label>' +
                                    '<input class="shop-checkbox" type="checkbox" data-id="' + it["shop_id"] + '">' +
                                    it["name"] +
                                    '</label>' +
                                    '</div>';
                                if(!$("#choose-shop-area").find('div[data-name="'+it["site_name"]+'"]').length){
                                    $("#choose-shop-area").append(aDiv);
                                };
                                if($("#choose-shop-area").find('div[data-name="'+it["site_name"]+'"]').length && !$("#choose-shop-area").find('div[data-name="'+it["site_name"]+'"]').next('div').find('div[data-name="'+it["name"]+'"]').length){
                                    $("#choose-shop-area").find('div[data-name="'+it["site_name"]+'"]').next('div').append(shop_str);
                                    return;
                                }
                            });
                        });
                    }
                    $('#choose-shop-modal').addClass('bs-example-modal-lg');
                    $('#choose-shop-modal').find('.modal-dialog').addClass('modal-lg');
                    $("#choose-shop-modal").modal("show");
                    Amazon.activ();
                }
            });
        },
        activ: function () {
            $("#choose-shop-area").find('input:checkbox').off().on('click',function (e) {
                if($(this).closest('.content').find('input:checked').length > 1  && $(this).find('input').prop('checked') !== true && !$(this).closest('div.all').length){
                    Inform.show('您选择了给相同的站点发送同一份数据');
                    if($('#just-translate').attr('data-btn') == '直接发布'){
                        return false;
                    }
                    return;
                }
            });
        },
        copy_variants: function () {
            //复制变体信息到其他站点
            var $sku_container = $(this).closest(".sku-variation");
            var this_site = $sku_container.closest(".site-info-area").attr("data-id");
            var src_currency = $("#currency_"+this_site).val();
            var trs = $sku_container.find(".linio-v-row");
            $(this).closest("#multi-site-info-area").find(".site-info-area").each(function (index, element) {
                if($(element).attr("data-id") != this_site){
                    // 移除当前站点所有变体
                    var $copy_trs = $(trs).clone(true, true);
                    var current_site = $(element).attr("data-id");
                    var tar_currency = $("#currency_" + current_site).val();
                    var $tbody = $($(element).find("tbody"));
                    $tbody.find("tr").each(function (i, tr) {
                        if (i != 0) $(tr).remove();
                    });
                    var currency =Number(src_currency) / Number(tar_currency);
                    $copy_trs.find(".v-price, .v-cu").each(function (i, ele) {
                        if ($(ele).val().trim() != ""){
                            var tmp_value = Number($(ele).val());
                            var tmp_result = tmp_value * currency;
                            $(ele).val(tmp_result.toFixed(2));
                        }

                    });
                    $tbody.append($copy_trs);
                    $tbody.find(".v-time-s, .v-time-e").each(function (i, ele) {
                        $(ele).datepicker({format: 'YYYY-MM-DD', defaultDate:{Default: true}})
                    });
                }
            });
            // $("#test").html("应用完成").fadeIn(300).delay(3000).fadeOut(300)
            console.log("copy complete !")
        },
        publish_feed: function(){
            var url = "",
                shops = [];
            if($('#just-translate').attr('data-btn') == '保存到待发布'){
                url = "/open/api/amazon/save/multi/site/product"
            }else if($('#just-translate').attr('data-btn') == '直接发布'){
                url = "/open/api/amazon/post/multi/site/product"
            }
            $("#choose-shop-area").find(":checked").not("#choose-all-shops").each(function(){
                shops.push($(this).attr("data-id"));
            });
            $("#choose-shop-modal").modal("hide");
            Inform.disable();
            Inform.show("", true, "正在提交产品信息...");
            Amazon.get_info();
            $.ajax({
                type: "POST",
                url: url,
                dataType: "json",
                data: {
                    shop_ids: shops.join(";"),
                    product: JSON.stringify(product)
                },
                timeout: 30000,
                success: function (data){
                    if(data.status == 0){
                        Inform.enable();
                        Inform.show(data.message);
                    }else{
                        Inform.enable('/');
                        Inform.show(data.message);
                    }
                },
                error: function(xhr, code){
                    Inform.enable();
                    Inform.show(xhr.status + code);
                },
                complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
                    if (status == 'timeout') {//超时,status还有success,error等值的情况
                        Inform.enable();
                        Inform.show("请求超时, 请重试");
                    }
                }
            });
        },
        timing_publish: function(){
            var product_id = option_type == "use" ? "" : $("#product-id").val(),
                modal = $("#single-timing-modal"),
                url;
            if(!Amazon.check_amazon()){
                return 0
            }
            Amazon.get_info();
            if(!product_id){
                url = "/create/"+shop_id+"/product/save";
            }else{
                url = "/create/"+shop_id+"/product/update";
            }
            Inform.disable();
            Inform.show("", true, "正在检测此产品...", "系统提示");
            var save_ajax = $.ajax({
                url: url,
                type: "POST",
                data: {
                    "product": JSON.stringify(product),
                    "product_id": product_id,
                    "check": true
                },
                success: function(data){
                    Inform.hide();
                    Inform.enable();
                    if(data.errors){
                        var str = '<p>产品检测未通过，请查看:</p>';
                        for(var i=0;i<data.errors.length;i++){
                            str += '<p>'+data.errors[i]+'</p>';
                        }
                        modal.attr("data-id", "error").find(".modal-body").empty().append(str);
                    }else{
                        product_id = data.pid;
                        var date_obj = new Date(),
                            year = date_obj.getFullYear(),
                            month = date_obj.getMonth() + 1,
                            date = date_obj.getDate();
                        var select = Amazon.generate_slt(year,1,year+1,"timer-y","年") +
                                    Amazon.generate_slt(month,1,12,"timer-M","月") +
                                    Amazon.generate_slt(date,1,new Date(year, month, 0).getDate(),"timer-d","日") +
                                    Amazon.generate_slt(0,1,23,"timer-H","时") +
                                    Amazon.generate_slt(0,15,45,"timer-m","分");
                        modal.attr("data-id", product_id).find(".modal-body").empty().append(
                            '<p>请选择定时发布的时间(北京时间):</p>' +
                            '<div class="form-inline">'+select+'</div>' +
                            '<p class="timing-tip">此产品将于<span>'+year+'年'+month+'月'+date+'日'+'00:00</span>开始上传</p>' +
                            '<p class="error-time-tip"></p>'
                        );
                    }
                    modal.modal("show");
                }
            });
        },
        timing_ensure: function(){
            var modal = $("#single-timing-modal"),
                shop_id = $("#shop-id").val(),
                item_id = modal.attr("data-id");
            if(item_id == "error"){
                modal.modal("hide");
            }
            var yy = $("#timer-y").val(),
                MM = $("#timer-M").val(),
                dd = $("#timer-d").val(),
                HH = $("#timer-H").val(),
                mm = $("#timer-m").val(),
                ss = "00",
                dt_str = yy + "-" + MM + "-" + dd + " " + HH + ":" + mm + ":" + ss,
                date_obj = new Date(parseInt(yy),parseInt(MM)-1,parseInt(dd),parseInt(HH),parseInt(mm),0),
                err_tip = $(".error-time-tip"),
                cur_date;
            $.ajax({
                url: "/scheduler/time",
                async: false,
                type: "OPTIONS",
                complete: function(x){
                    try{
                        cur_date = new Date(x.getResponseHeader("Date"));
                    }catch(e){
                        cur_date = new Date();
                    }
                }
            });
            if((date_obj-cur_date)/60000>=15){
                err_tip.text("");
                var data = {
                        "mold": "publish_product",
                        "shop_id": shop_id,
                        "name": "定时刊登",
                        "trigger": "date",
                        "action": "post_request",
                        "run_date": dt_str,
                        "post_data": JSON.stringify({"shop_id": shop_id, "item_id": item_id, "prior": "0"}),
                        "kwargs": JSON.stringify({"shop_id": shop_id, "item_id": item_id, "prior": "0"})
                    };
                modal.modal("hide");
                Inform.disable();
                Inform.show("", true, "正在提交定时请求...", "系统提示");
                $.ajax({
                    url: "/scheduler/publish",
                    type: "POST",
                    data: data,
                    timeout: 30000,
                    success: function(data){
                        if(data.status == "success"){
                            Inform.enable("/product/"+shop_id+"/waiting");
                            Inform.show("定时上传任务设置成功");
                        }else{
                            Inform.enable();
                            Inform.show(data.message);
                        }
                    },
                    error: function(x){
                        Inform.enable();
                        Inform.show(x.status);
                    },
                    complete: function(X, status){
                        if (status == 'timeout') {
                            Inform.enable();
                            Inform.show("请求超时, 请重试");
                        }else{
                            Inform.enable();
                            Inform.show(status);
                        }
                    }
                })
            }else{
                err_tip.text('定时任务的时间需要至少比当前时间延后15分钟，请重新设置。');
            }
        },
        cancel_timing: function(){
            var id = $("#single-timing-modal").attr("data-id");
            if(id && id != "error"){
                location.href = "/product/"+shop_id+"/waiting"
            }
        },
        time_change: function(){
            var $this = $(this),
                id = $this.attr("id"),
                value = $this.val(),
                date_obj = new Date(),
                year_slt = $("#timer-y"),
                month_slt = $("#timer-M"),
                date_slt = $("#timer-d"),
                c_year = date_obj.getFullYear(),
                c_month;
            if(id == "timer-y"){
                if(c_year == value){
                    month_slt.empty().append(Amazon.generate_slt(date_obj.getMonth() + 1,1,12,"timer-M","月",true));
                }else{
                    month_slt.empty().append(Amazon.generate_slt(1,1,12,"timer-M","月",true));
                }
                month_slt.trigger("change");
            }else if(id == "timer-M"){
                c_month = date_obj.getMonth() + 1;
                if(c_month == value && year_slt.val() == c_year){
                    date_slt.empty().append(Amazon.generate_slt(date_obj.getDate(),1,new Date(c_year, c_month, 0).getDate(),"timer-d","日", true));
                }else{
                    date_slt.empty().append(Amazon.generate_slt(1,1,new Date(c_year+1, value, 0).getDate(),"timer-d","日", true));
                }
            }
            $(".error-time-tip").text("");
            $(".timing-tip").find("span").text(year_slt.val()+'年'+month_slt.val()+'月'+date_slt.val()+'日'+$("#timer-H").val()+':'+$("#timer-m").val());
        },
        generate_slt: function(start, step, limit, id, word, option_only){
            var opt = '';
            for(;start<=limit;start+=step){
                var start_str = (start+"").length == 1 ? "0"+start : start;
                opt += '<option value="'+start_str+'">'+start_str+'</option>';
            }
            if(option_only){
                return opt
            }
            else{
                return '<select class="form-control" style="margin: 0 5px" id="'+id+'">'+opt+'</select>'+word
            }
        },
        render_page: function(){
            var product_id = $("#product-id").val(),
                cate_id = $("#CategoryID").attr("data-id");
            if(!product_id) return 0;
            Amazon.get_specifics(cate_id);
            $.ajax({
                "url": "/create/" + shop_id + "/product/sync",
                "type": "POST",
                "dataType": "json",
                "data": {"product_id": product_id},
                "success": function(data){
                    product["SourceInfo"] = data["source"];
                },
                "error": function(){
                    console.log("there is some error happened");
                }
            })
        },
        render_pro: function(pros){
            for(var i=0; i<pros.length; i++){
                var pro = pros[i],
                    this_block = $(".form-group").filter("[data-name=\""+pro.Name+"\"]"),
                    type = this_block.attr("data-type");
                if(type == "input"){
                    this_block.find(":text").val(pro.Value);
                }else if(type == "list_box"){
                    this_block.find("select").val(pro.Value);
                }else if(type == "check_box"){
                    this_block.find(":checkbox").filter("[data-value=\""+pro.Value+"\"]").prop("checked", true);
                }
            }
        },
        choose_set_type: function () {
          $(this).closest(".form-inline").find(":text").prop("disabled", false).end()
              .siblings(".form-inline").find(":text").val("").attr("disabled", true);
        },
        just_translate: function(){
            var current_site = [],
                btn = $(this);
            $('#choose-site').find('input:checked').each(function (i,item) {
                current_site.push($(item).val().trim());
            });
            current_site.forEach(function (ite,i) {
                Amazon.just_translate_site(ite,btn);
            });
        },
        just_translate_site: function (ite,btn) {
            var siteCur = $('.site-info-area[data-id="'+ite+'"]');
            var title = siteCur.find("#product-title").val(),
                reg = /[\u4e00-\u9fa5]/,
                tags = [],
                point = [],
                points = siteCur.find("input[name='bullet_point']"),
                keywords = siteCur.find("input[name='keyword']"),
                num = 0,
                desc,
                data_temp = {
                    "src_lang": "cn",
                    "tar_lang": $('input[id="'+ite+'"][data-name="language"]').val()
                };
            var sit;
            switch (ite){
                case "GB":
                    desc = GB.getContent();
                    sit = GB;
                    break;
                case "FR":
                    desc = FR.getContent();
                    sit = FR;
                    break;
                case "DE":
                    desc = DE.getContent();
                    sit = DE;
                    break;
                case "IT":
                    desc = IT.getContent();
                    sit = IT;
                    break;
                case "ES":
                    desc = ES.getContent();
                    sit = ES;
                    break;
                case "US":
                    desc = US.getContent();
                    sit = US;
                    break;
                case "CA":
                    desc = CA.getContent();
                    sit = CA;
                    break;
                case "MX":
                    desc = MX.getContent();
                    sit = MX;
                    break;
                case "JP":
                    desc = JP.getContent();
                    sit = JP;
                    break;
                case "AU":
                    desc = AU.getContent();
                    sit = AU;
                    break;
                case "IN":
                    desc = IN.getContent();
                    sit = IN;
                    break;
            }
            for (var i = 0; i < keywords.length; i++) {
                tags.push($(keywords[i]).val());
            }
            for (var j = 0; j < points.length; j++) {
                point.push($(points[j]).val());
            }
            if (reg.test(title)) {
                data_temp["title"] = title;
                num += 1;
            }
            if (reg.test(desc)) {
                data_temp["desc"] = desc;
                num += 1;
            }
            if (reg.test(tags)) {
                data_temp["tags"] = JSON.stringify(tags);
                num += 1;
            }
            if (reg.test(point)) {
                data_temp["point"] = JSON.stringify(point);
                num += 1;
            }
            if (num != 0) {
                btn.text("正在翻译中...").attr("disabled", true);
                $.ajax({
                    "url": "/open/api/amazon/post/multi/translate",
                    "type": "POST",
                    "dataType": "json",
                    "data": data_temp,
                    "success": function (data) {
                        if (data.status == 1) {
                            Amazon.render_translate(data.json, siteCur, sit);
                            btn.text("一键翻译").attr("disabled", false);
                        } else {
                            console.log("Translate error!");
                            btn.text("一键翻译").attr("disabled", false);
                        }
                    }
                });
            }
        },
        render_translate: function(data, siteCur, sit) {
            var key;
            if (data["title"]) siteCur.find("#product-title").val(data["title"]);
            if (data["desc"]) sit.setContent(data["desc"]);
            if (data["tags"]) siteCur.find('input[name="keyword"]').each(function (index,item) {
                if(($(item).val()) in data["tags"]){
                    $(item).val(data["tags"][$(item).val()]);
                }
            });
            if (data["point"]) siteCur.find('input[name="bullet_point"]').each(function (index,item) {
                if(($(item).val()) in data["point"]){
                    $(item).val(data["point"][$(item).val()]);
                };
            });
        },
        check_site_info: function (check_dom) {
            var height = check_dom.offset().top < height ? check_dom.offset().top : height;
                $("html,body").animate({scrollTop: height},300);
            return false;
        },
        dom_undefined: function (check_dom,siteId) {
            if(check_dom === undefined){
                return Inform.show('请检查'+siteId+'站点的信息是否完整');
            }
        },
        check_nav: function (siteId,check_dom) {
            $('a[role="tab"][data-id="'+siteId+'"]').parent('li').addClass("active").siblings('li').removeClass("active");
            $('div.siteModel[data-id="'+siteId+'"]').show().siblings('div.siteModel').hide();
            return Amazon.check_req(check_dom,$('div.siteModel[data-id="'+siteId+'"]'),null,siteId);
        },
        check_req: function (check_dom,parentEle,var_map,siteId) {
            var flag = false;
            var ele = [];
            if(!$('div.siteModel[data-id="'+siteId+'"]').find('.select[data-name="unit"]').closest('.sku-prop').length && ($('div.siteModel[data-id="'+siteId+'"]').find('.select[data-name="unit"]').length > 0 && $('div.siteModel[data-id="'+siteId+'"]').find('.select[data-name="unit"]').find('option:selected').val() && $('div.siteModel[data-id="'+siteId+'"]').find('.select[data-name="unit"]').find('option:selected').val() !== '--' && $('div.siteModel[data-id="'+siteId+'"]').find('.select[data-name="unit"]').closest('.form-group').find('input').length)) {
                check_dom = $('div.siteModel[data-id="'+siteId+'"]').find('.select[data-name="unit"]').closest('.form-group').find('input:visible');
                if (check_dom.val().trim() == "") {
                    Amazon.tip_toggle(check_dom, '此项为必填项,不能为空', true);
                    Amazon.check_site_info(check_dom);
                    return flag = true;
                } else {
                    Amazon.tip_toggle(check_dom, '', false);
                }
            }else if(!$('div.siteModel[data-id="'+siteId+'"]').find('.select[data-name="unit"]').closest('.sku-prop').length &&　($('div.siteModel[data-id="'+siteId+'"]').find('.select[data-name="unit"]').length > 0 && !$('div.siteModel[data-id="'+siteId+'"]').find('.select[data-name="unit"]').find('option:selected').val() && $('div.siteModel[data-id="'+siteId+'"]').find('.select[data-name="unit"]').closest('.form-group').find('input').length && $('div.siteModel[data-id="'+siteId+'"]').find('.select[data-name="unit"]').closest('.form-group').find('input').val().trim() == '')) {
                check_dom = $('div.siteModel[data-id="'+siteId+'"]').find('.select[data-name="unit"]:visible');
                Amazon.dom_undefined(check_dom,siteId);
                if (check_dom.val().trim() == "") {
                    Amazon.tip_toggle(check_dom, '此项为必填项,不能为空', true);
                    Amazon.check_site_info(check_dom);
                    return  flag = true;
                } else {
                    Amazon.tip_toggle(check_dom, '', false);
                }
            };
            if($('div.siteModel[data-id="'+siteId+'"]').find('#sku-variation').length || ($('div.siteModel[data-id="'+siteId+'"]').find('#changeModel').css('display') !== "none" && $('div.siteModel[data-id="'+siteId+'"]').find('#changeModel').find('option:selected').val() !== "请选择")) {
                $('.v-price').each(function (index, item) {
                    if ($(item).val().trim() == '') {
                        Amazon.tip_toggle($(item), '', true);
                        return flag = true;
                    } else {
                        Amazon.tip_toggle($(item), '', false);
                    }
                });
                $('.v-stock').each(function (index, item) {
                    if ($(item).val().trim() == '') {
                        Amazon.tip_toggle($(item), '', true);
                        return flag = true;
                    } else {
                        Amazon.tip_toggle($(item), '', false);
                    }
                });
                $('.v-upc').each(function (index, item) {
                    if ($(item).val().trim() == ''){
                        Amazon.tip_toggle($(item), '', true);
                        return flag = true;
                    } else {
                        Amazon.tip_toggle($(item), '', false);
                    }
                });
                $('.v-sku').each(function (index, item) {
                    if ($(item).val().trim() == '') {
                        Amazon.tip_toggle($(item), '', true);
                        return flag = true;
                    } else {
                        Amazon.tip_toggle($(item), '', false);
                    }
                });
                $('.v-title-keys').each(function (index, item) {
                    if ($(item).val().trim() == '') {
                        Amazon.tip_toggle($(item), '', true);
                        return flag = true;
                    } else {
                        Amazon.tip_toggle($(item), '', false);
                    }
                });
                $('.img-pre-box').each(function (index, item) {
                    if ($(item).find('img').attr('src') === "/static/image/add.png") {
                        Amazon.tip_toggle($(item), '', true);
                        return flag = true;
                    } else {
                        Amazon.tip_toggle($(item), '', false);
                    }
                });
            }
            if(parentEle && parentEle !== undefined && parentEle !== null){
                ele = parentEle.find(".v-required:visible");
            }else {
                ele = $(".v-required:visible");
            }
            ele.each(function(k, v){
                var $v = $(v),
                    parent = $v.parent(),
                    p_tag = parent.get(0).tagName;
                if(parent === undefined) return;
                if($v.closest('div.sku-prop').length){
                    if(!$v.closest('div[data-select="single"]').find('.form-inline.checkInp').find('input:checked').length){
                        $v.closest('div[data-select="single"]').find('.form-inline.checkInp').addClass('error');
                        if(!$v.closest('div[data-select="single"]').find('.form-inline.checkInp').find('p').length){
                            $v.closest('div[data-select="single"]').find('.form-inline.checkInp').append($('<p/>').text('变体属性不能为空，请添加勾选变体属性').addClass('error-tip'));
                        }
                    }else {
                        $v.closest('div[data-select="single"]').find('.form-inline.checkInp').removeClass('error');
                    }
                };
                if(!$v.closest('div.sku-prop').length && (((check_dom = $v.closest('div.form-group.checkInp').children('div.col-md-10').children('input:visible')).length) || ((check_dom = $v.closest('div.form-group').children('div.col-md-10').children('select:visible')).length) || ((check_dom = $v.closest('div.form-group').children('div').children('div').children('div').children('input:visible')).length) || ((check_dom = $v.closest('div.form-group').children('div').children('div').children('input:visible')).length) || ((check_dom = $v.closest('div.form-group').children('div').children('div').children('div').children('select:visible')).length) || ((check_dom = $v.closest('div.form-group').children('div').children('div').children('select:visible')).length))){
                    if(check_dom.val().trim() == "" || check_dom.val().trim() == "--"){
                        Amazon.tip_toggle(check_dom, '此项为必填项,不能为空', true);
                        Amazon.check_site_info(check_dom);
                        return flag = true;
                    }else{
                        Amazon.tip_toggle(check_dom, '', false);
                    }
                };
                if(p_tag == 'DIV'){
                    if(!$v.closest('div.sku-prop').length && (check_dom = parent.find("input.form-control:visible, textarea")).length > 0){
                        if(check_dom.val().trim() == ""){
                            Amazon.tip_toggle(check_dom, '此项为必填项,不能为空', true);
                            Amazon.check_site_info(check_dom);
                            return flag = true;
                        }else{
                            Amazon.tip_toggle(check_dom, '', false);
                        }
                    }else if((check_dom = parent.find("select")).length > 0){
                        if(check_dom.val().trim() == "" || check_dom.val().trim() == "请选择"){
                            Amazon.tip_toggle(check_dom, '此项为必选项,请选择一个选项', true);
                            Amazon.check_site_info(check_dom);
                            return flag = true;
                        }else{
                            Amazon.tip_toggle(check_dom, '', false);
                        }
                    }else if((check_dom = parent.find("#CategoryID")).length > 0){
                        if(!check_dom.attr("data-id")){
                            Amazon.tip_toggle(check_dom, '分类为必选项,请选择');
                            Amazon.check_site_info(check_dom);
                            return flag = true;
                        }else{
                            Amazon.tip_toggle(check_dom, '');
                        }
                    }else if((check_dom = parent.find("#detailHtml")).length > 0){
                        var arr = [];
                        var sit;
                        $('#choose-site').find(':checkbox:checked').each(function (i,t) {
                            arr.push($(t).val().trim())
                        });
                        arr.forEach(function (item) {
                            switch (item){
                                case "GB":
                                    sit = GB;
                                    break;
                                case "FR":
                                    sit = FR;
                                    break;
                                case "DE":
                                    sit = DE;
                                    break;
                                case "IT":
                                    sit = IT;
                                    break;
                                case "ES":
                                    sit = ES;
                                    break;
                                case "US":
                                    sit = US;
                                    break;
                                case "CA":
                                    sit = CA;
                                    break;
                                case "MX":
                                    sit = MX;
                                    break;
                                case "JP":
                                    sit = JP;
                                    break;
                                case "AU":
                                    sit = AU;
                                    break;
                                case "IN":
                                    sit = IN;
                                    break;
                            }
                            if(sit.getPlainTxt().trim() == ""){
                                Amazon.tip_toggle(check_dom, '此项为必填项,不能为空');
                                Amazon.check_site_info(check_dom);
                                return;
                            }else{
                                var getTag = [];
                                var tagAry = ['<img','src','href','<span','</span>','<div','</div>','<tr','</tr>','<td','</td>','<table','</table>'];
                                tagAry.forEach(function (ite) {
                                    if((sit.getPlainTxt().trim()).indexOf(ite) >= 0){
                                        var height = 10000;
                                        var descrp = $(".site-info-area[data-id='"+item+"']").find('.edui-default').eq(0);
                                        height = descrp.offset().top < height ? descrp.offset().top : height;
                                        $("html,body").animate({scrollTop: height},300);
                                        getTag.push(ite);
                                        return flag = true;
                                    }
                                });
                                if(getTag.length > 0){
                                    Inform.show(''+item+'站产品描述含有非文本标签'+getTag[0]+'...等内容，请修改后重试');
                                    return flag = true;
                                }
                                Amazon.tip_toggle(check_dom, '');
                            }
                            return;
                        });
                    }
                }else if(p_tag == 'TR'){
                    var_map[$v.index()] = $v.attr("data-pattern");
                }
            });
            return flag;
        },
        check_amazon: function(){
            var var_map = {},
                check_dom;
            for(var i = 0; i < $('#choose-site').find(':checkbox:checked').length; i++){
                var siteId = $($('#choose-site').find(':checkbox:checked')[i]).val().trim();
                if(Amazon.check_nav(siteId)){
                    break;
                }
            };
            Amazon.check_req(check_dom,null,var_map);
            var img_area = $("#feed_img");
            if(img_area.find("img").eq(0).attr("src") == "/static/image/add.png"){
                Amazon.tip_toggle(img_area, '请至少上传一张产品图片');
                var height = 10000;
                var feedImg = $("#feed_img");
                height = feedImg.offset().top < height ? feedImg.offset().top : height;
                $("html,body").animate({scrollTop: height},300);
                return;
            }else{
                Amazon.tip_toggle(img_area, '');
            }
            var error = $(".error:visible"),
                cate = $(".CategoryID:visible"),
                height = 10000;
            var message = [],
                booleanFlag = true;
            cate.each(function(){
                var $this = $(this),
                    $trs = $("#sku-variation[data-site='"+$this.attr("data-site")+"']").find("table.table"),
                    $changeModel = $("#changeModel[data-site='"+$this.attr("data-site")+"']");
                if($this.attr("data-id")){
                    if(error.length == 0){
                        if($trs.length == 0){
                            if($changeModel.length && $changeModel.closest('.form-group').attr('style') != "display: none;" && typeof($changeModel.find('option:selected').attr("data-value")) != "undefined"){
                                message.push("请为"+site_map[$this.attr("data-site")]+"添加变体");
                            }
                        }
                    }else{
                        if(error.closest('.variation-row').find('.sku-effect').prop('checked') == false || (error.find('img').length && error.closest('.variation-row').prev('tr').find('.sku-effect').prop('checked') == false)){
                            return error.removeClass('error');
                        }
                        height = error.eq(0).offset().top < height ? error.eq(0).offset().top : height;
                        $("html,body").animate({scrollTop: height},300);
                        booleanFlag = false;
                    }
                }else{
                    message.push("请为"+site_map[$this.attr("data-site")]+"选择目录");
                    height = cate.offset().top < height ? cate.offset().top : height;
                    $("html,body").animate({scrollTop: height},300);
                }
            });
            if(message.length>0){
                var str = '';
                for(var i=0;i<message.length;i++){
                    str += '<p>'+message[i]+'</p>';
                }
                Inform.show(str);
                return booleanFlag = false;
            }
            return booleanFlag;
        },
        tip_toggle: function(dom, tip, toggle){
            var area = dom.parent().find(".error-tip");
            if(toggle){
                $(dom).addClass("error");
            }else{
                $(dom).removeClass("error");
            }
            if(tip != ""){
                if(area.length > 0){
                    area.text(tip);
                }else{
                    if(!dom.closest('.sku-prop').length){
                        dom.after('<div class="value-tip"><p class="error-tip">'+tip+'</p></div>');
                    }

                }
            }else{
                area.length > 0 && area.text("");
            }
        },
        prevent: function(e){
            e = e || window.event;
            e.stopPropagation();
        },
        panel_toggle: function(){
            var $this = $(this);
            if($this.text() == "展开"){
                $this.text("收起");
            }else{
                $this.text("展开");
            }
        },
        check_site: function(){
            var $this = $(this),
                data_id = $this.val(),
                set_cate_div = $("#set-category"),
                content_div = function(data_id){
                    var oDiv = $('#multi-site-info-area').find(".site-info-area[data-id='"+data_id+"']").closest('.siteModel');
                    return  oDiv;
                },
                site_tab = $("#site-tab"),
                this_tab = site_tab.find("a[data-id='"+data_id+"']"),
                check_len = $("#choose-site").find("input:checked").length;
            if($this.prop("checked")){
                set_cate_div.find(".form-group[data-id='"+data_id+"']").show();
                this_tab.show();
            }else{
                if(check_len == 0){
                    Amazon.error_message("请至少选择一个站点");
                    $this.prop("checked", true);
                    this_tab.closest('li').addClass('active').siblings('li').removeClass('active');
                    content_div(data_id).show().siblings('.siteModel').hide();
                }else{
                    set_cate_div.find(".form-group[data-id='"+data_id+"']").hide();
                    this_tab.hide();
                    if(this_tab.hasClass("active")){
                        site_tab.find("a:visible").eq(0).trigger("click");
                    };
                    if(check_len == 1){
                        site_tab.find("a:visible").closest('li').addClass('active').siblings('li').removeClass('active');
                        content_div(site_tab.find("a:visible").attr('data-id')).show().siblings('.siteModel').hide();
                    }else{
                        content_div(site_tab.find("a:visible").eq(0).attr('data-id')).show().siblings('.siteModel').hide();
                    }
                }
            }
        },
        error_message: function(message){
            if(!message || typeof message != "string") return;
            var cur_message = $(".error-message"),
                delay;
            clearTimeout(delay);
            if(cur_message.length > 0){
                cur_message.find('p').text(message);
                delay = setTimeout(function(){
                    cur_message.slideUp(500, function(){cur_message.remove()});
                }, 2200);
            }else{
                cur_message  = $('<div>').addClass("error-message").append('<p>'+message+'</p><a class="delete-message">&times;</a><div></div>').appendTo(document.body);
                cur_message.slideDown(500);
                delay = setTimeout(function(){
                    cur_message.slideUp(500, function(){cur_message.remove()});
                }, 2200);
                $(".delete-message").one("click", function(){
                    clearTimeout(delay);
                    cur_message.slideUp(500, function(){cur_message.remove()});
                })
            }
        },
        scroll_listener: function(){
            scroll_delay && clearTimeout(scroll_delay);
            scroll_delay = setTimeout(function(){
                var cur_dom = $(".fixed-wrap-div"),
                    site_area = $("#site-tab"),
                    top = site_area.offset().top - $(window).scrollTop(),
                    distance = $(".siteModel:visible").offset().top - $(window).scrollTop();
                if(top <= 0){
                    cur_dom.addClass("fixed-on");
                    if(distance > 42){
                        cur_dom.removeClass("fixed-on");
                    }
                }
            },50);
        }
    };
    function get_query_string(name) {
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return  unescape(r[2]); return null;
    }
    Amazon.init();
    window.AmazonRule = {
        init:function () {
            $('.siteModel').eq(0).show();
            AmazonRule.siteTab();
        },
        siteTab: function(){
            $('#site-tab').find('li').each(function(index,item){
                $(item).on('click',function(){
                    $('.siteModel').eq(index).show().siblings('.siteModel').hide();
                    $('.siteModel').eq(index).find('.site-info-area').show();
                })
            });
            Amazon.scroll_listener();
        },
        bind_specifics: function (data,site) {
            var attribute = data['attributes'];
            if(data && data['attributes']['show'].length > 0){
                AmazonRule.set_data(attribute,site);
            };
            if(data && data['attributes']['route'].length > 0){
                AmazonRule.first_btn_bind(data,site);
            };
        },
        first_btn_bind: function (data,site) {
            var specificsModel = $('.panel.panel-danger[data-site="'+site+'"]').show(),
                first_btn = specificsModel.find('.btn-group .dropdown-menu'),
                route = data['attributes']['route'];
            route.forEach(function (item) {
                first_btn.append('<a href="javascript:" class="page-header sr-only-focusable  pull-left" title="'+item+'" name="'+item+'">'+item+'</a>');
            });
            AmazonRule.firstClickResearch($('.panel-danger[data-site="'+site+'"]'));
            first_btn.find('a[name]').off().on('click',function(){
                AmazonRule.create_first_route(data['attributes'],site,this)
            });
        },
        create_first_route: function (attributes,site,ele) {
            var vueProps = vueParent.$refs.firstData;
            vueProps.forEach(function(curProps){
                var firEle = {};
                if(curProps['siteId'] === site){
                    if(!$('.firstAppend').find('div[data-name="'+$(ele).html()+'"]').length){
                        curProps.dataData.push(AmazonRule.getRenderData(attributes['elements'],$(ele).html(),firEle));
                    }else if($('.sku-prop').length && $('.sku-prop').find('div[data-name="'+$(ele).html()+'"]').length){
                        Inform.show('已在变体属性中，请选择其他属性');
                        return;
                    }else {
                        Inform.show('该属性已存在，请选择其他属性');
                        return;
                    }
                }

            })
        },
        set_data: function(attributes,site){
            var vueProps = vueParent.$refs.firstData;
            vueProps.forEach(function(curProps){
                if(curProps['siteId'] === site){
                    if(attributes && attributes['show'].length){
                        var dataShow = attributes['show'];
                        if(dataShow.length){
                            AmazonRule.showFn(attributes,curProps);
                        }
                    }
                    curProps.$props.attributes = attributes;
                    //console.log(curProps,attributes,site);
                }
            });
        },
        /**
         * 处理attributes['required']里带"."的属性，这里的属性是后期加的，待处理
         * @param attributes  show上级数据
         * @param curProps    一级组件
         */
        showFn: function (attributes,curProps){
            /*if(attributes['required'].length){
                show_Fn(attributes['required']);
                // name带“.”,有二级目录插入函数
                show_have_second();
            };*/
            AmazonRule.renderNew(attributes,curProps);
        },
        /**
         * 这是默认展示show下的属性，主要处理带点，拆分成一二三级
         * @param attributes  show上级数据
         * @param curProps    一级组件
         */
        renderNew: function (attributes,curProps){
            var Attributes = attributes['elements'];
            var dataShow = attributes['show'],
                defaultAry = [];
            dataShow.forEach(function (item,index) {
                var firEle = {};
                defaultAry.push(AmazonRule.getRenderData(Attributes,item,firEle));
            });
            function reArry(arr){
                for(var i=0; i<arr.length; i++){
                    for(var j=i+1; j<arr.length; j++){
                        if(arr[i].name===arr[j].name){
                            arr[i].name2.push(defaultAry[i+1].name2[0]);
                            arr.splice(j,1);
                            i--;
                        }
                    }
                }
                return arr;
            }
            curProps.dataData = reArry(defaultAry);
            /*for(var i = 0; i < defaultAry.length; i++){
                if(i < defaultAry.length-2 && defaultAry[i].name === defaultAry[i+1].name){
                    defaultAry[i].name2.push(defaultAry[i+1].name2[0]);
                    defaultAry.splice(i+1,1);
                }
            };
            curProps.dataData = defaultAry;*/
            curProps.firstBtnData = attributes['route'];
        },
        getRenderData: function (Attributes,item,firEle){
            firEle = {
                name: '',
                name2: [],
                unitA : [],
                numA : null,
                valShow : false,
                selVal : [],
                inpShow : false,
                selShow : false,
                firstUnitShow : false,
                secondBtnRoute: [],
                secondBtnShow: false,
                boolShow: false,
                delHide: true,
                groom: [],
                groomShow: false,
                displayName: '',
                displayNameShow: false,
                regex: new RegExp('.*'),
                valWidth: 'col-md-3',
                attributes: Attributes
            };
            //console.log(dataShow);
            // 判断是否有二级目录
            if (routeReg.exec(item) && !(/^Choice\.(\w+)/.test(item))) {  // 判断名字带“.”,有二级目录插入
                var regx = routeReg.exec(item);
                var secondEle = {};
                firEle.name = regx[1];
                if(regx[3]){   //判断是有三级目录,并准备它所需的数据
                    var threeEle = {};
                    secondEle.threeBtnRoute = Attributes[regx[1]]['elements'][regx[2]]['route'];
                    secondEle.threeBtnShow = true;
                    secondEle.name3.push(AmazonRule.thirdGetData(Attributes,threeEle,regx[1],regx[2],regx[3]));
                    secondEle.valShow = false;
                }else {   //二级目录,并准备它所需的数据
                    firEle.secondBtnShow = true;
                    firEle.secondBtnRoute = Attributes[regx[1]]['route'];
                    firEle.name2.push(AmazonRule.secondGetData(Attributes,secondEle,regx[1],regx[2]));
                    secondEle.valShow = true;
                }
                firEle.valShow = false;
            } else { // 只有一级目录
                if (Attributes.hasOwnProperty(item)) {
                    firEle.name = item;
                    var typeA = Attributes[item]['type'];
                    firEle.unitA = Attributes[item]['unit'];
                    firEle.numA = Attributes[item]['maxOccurs'];
                    firEle.firReq = Attributes[item]['required'];
                    firEle.displayName = Attributes[item]['display_name'];
                    firEle.valShow = true;
                    firEle.secondShow = false;
                    if(typeA === "String"){
                        firEle.inpShow = true;
                        if(Attributes[item]['values'].length > 0){
                            firEle.groom = Attributes[item]['values'];
                            firEle.groomShow = true;
                        }
                    }else if(typeA === "List"){
                        firEle.selVal = Attributes[item]['values'];
                        firEle.selShow = true;
                    }else if(typeA === "Bool"){
                        firEle.boolShow = true;
                    };
                    if(firEle.firReq){
                        firEle.delHide = false;
                    };
                    if(firEle.unitA.length > 0){
                        firEle.firstUnitShow = true;
                    };
                    if(firEle.displayName.length > 0){
                        firEle.displayNameShow = true;
                    };
                    if(Attributes[item]['regex'].length > 0){
                        firEle.regex = Attributes[item]['regex'];
                    };
                    if(firEle.unitA.length && firEle.numA === 1){
                        firEle.valWidth = 'col-md-10';
                    }else if(!firEle.unitA.length && firEle.numA === 1){
                        firEle.valWidth = 'col-md-12';
                    }else if(!firEle.unitA.length && firEle.numA === 2){
                        firEle.valWidth = 'col-md-6';
                    }else if(firEle.unitA.length && firEle.numA === 2){
                        firEle.valWidth = 'col-md-5';
                    }else if(!firEle.unitA.length && firEle.numA === 3){
                        firEle.valWidth = 'col-md-4';
                    }else if(firEle.unitA.length && firEle.numA === 3){
                        firEle.valWidth = 'col-md-4';
                    };
                    if(Attributes[item].hasOwnProperty('route')) { //判断一级点击进来的数据它的二三级
                        firEle.secondBtnRoute = Attributes[item]['route'];
                        firEle.secondBtnShow = true;
                        Attributes[item]['route'].forEach(function(ele){
                            var secondEle = {};
                            if(Attributes[item]['elements'][ele].required){ // 二级属性req --> true   展示状态
                                firEle.name2.push(AmazonRule.secondGetData(Attributes,secondEle,item,ele));
                            };
                            if(ele.hasOwnProperty('route')){    // 三级属性req --> true   展示状态
                                ele['route'].forEach(function(ite){
                                    if(ele['elements'][ite].required){
                                        var threeEle = {};
                                        secondEle.threeBtnRoute = Attributes[item]['elements'][ele]['route'];
                                        secondEle.threeBtnShow = true;
                                        secondEle.name3.push(AmazonRule.thirdGetData(Attributes,threeEle,item,ele,ite));
                                    };
                                })
                            }
                        });
                    }
                }
            }
            return firEle;
        },
        secondGetData: function (Attributes,secondEle,ele1,ele2) {
            secondEle = {
                name:'',
                name3: [],
                numB : null,
                unitB : [],
                secondShow : false,
                inpShow : false,
                selShow : false,
                selVal : [],
                secondUnitShow : false,
                secondReq: false,
                boolShow: false,
                threeBtnRoute: [],
                threeBtnShow: false,
                groom: [],
                groomShow: false,
                displayName: '',
                valShow: false,
                displayNameShow: false,
                valWidth: 'col-md-3',
                regex: new RegExp('.*')
            };
            secondEle.name = ele2;
            var typeB = Attributes[ele1]['elements'][ele2]['type'];
            secondEle.unitB = Attributes[ele1]['elements'][ele2]['unit'];
            secondEle.numB = Attributes[ele1]['elements'][ele2]['maxOccurs'];
            secondEle.secondReq = Attributes[ele1]['elements'][ele2]['required'];
            secondEle.displayName = Attributes[ele1]['elements'][ele2]['display_name'];
            secondEle.secondShow = true;
            if(typeB === "String"){
                secondEle.inpShow = true;
                if(Attributes[ele1]['elements'][ele2]['values'].length > 0){
                    secondEle.groom = Attributes[ele1]['elements'][ele2]['values'];
                    secondEle.groomShow = true;
                }
                secondEle.valShow = true;
            }else if(typeB === "List"){
                secondEle.selVal = Attributes[ele1]['elements'][ele2]['values'];
                secondEle.selShow = true;
                secondEle.valShow = true;
            }else if(typeB === "Bool"){
                secondEle.boolShow = true;
                secondEle.valShow = true;
            };
            if(secondEle.unitB.length > 0){
                secondEle.secondUnitShow = true;
            };
            if(secondEle.displayName.length > 0){
                secondEle.displayNameShow = true;
            };
            if(Attributes[ele1]['elements'][ele2]['regex'].length > 0){
                secondEle.regex = Attributes[ele1]['elements'][ele2]['regex'];
            };
            if(secondEle.unitB.length && secondEle.numB === 1){
                secondEle.valWidth = 'col-md-10';
            }else if(!secondEle.unitB.length && secondEle.numB === 1){
                secondEle.valWidth = 'col-md-12';
            }else if(!secondEle.unitB.length && secondEle.numB === 2){
                secondEle.valWidth = 'col-md-6';
            }else if(secondEle.unitB.length && secondEle.numB === 2){
                secondEle.valWidth = 'col-md-5';
            }else if(!secondEle.unitB.length && secondEle.numB === 3){
                secondEle.valWidth = 'col-md-4';
            }else if(secondEle.unitB.length && secondEle.numB === 3){
                secondEle.valWidth = 'col-md-4';
            };
            return secondEle;
        },
        thirdGetData: function (Attributes,threeEle,ele1,ele2,ele3){
            threeEle = {
                name: '',
                numC: null,
                unitC: [],
                threeShow: false,
                selShow : false,
                selVal : [],
                inpShow : false,
                threeUnitShow : false,
                threeReq: false,
                boolShow: false,
                groom: [],
                groomShow: false,
                displayName: '',
                displayNameShow: false,
                valWidth: 'col-md-3',
                regex: new RegExp('.*')
            };
            threeEle.name = ele3;
            var typeC = Attributes[ele1]['elements'][ele2]['elements'][ele3]['type'];
            threeEle.unitC = Attributes[ele1]['elements'][ele2]['elements'][ele3]['unit'];
            threeEle.numC = Attributes[ele1]['elements'][ele2]['elements'][ele3]['maxOccurs'];
            threeEle.threeReq = Attributes[ele1]['elements'][ele2]['elements'][ele3]['required'];
            threeEle.displayName = Attributes[ele1]['elements'][ele2]['elements'][ele3]['display_name'];
            threeEle.threeShow = true;
            if(typeC === "String"){
                threeEle.inpShow = true;
                if(Attributes[ele1]['elements'][ele2]['elements'][ele3]['values'].length > 0){
                    threeEle.groom = Attributes[ele1]['elements'][ele2]['elements'][ele3]['values'];
                    threeEle.groomShow = true;
                }
            }else if(typeC === "List"){
                threeEle.selVal = Attributes[ele1]['elements'][ele2]['elements'][ele3]['values'];
                threeEle.selShow = true;
            }else if(typeC === "Bool"){
                threeEle.boolShow = true;
            };
            if(threeEle.unitC.length > 0){
                threeEle.threeUnitShow = true;
            };
            if(threeEle.displayName.length > 0){
                threeEle.displayNameShow = true;
            };
            if(Attributes[ele1]['elements'][ele2]['elements'][ele3]['regex'].length > 0){
                threeEle.regex = Attributes[ele1]['elements'][ele2]['elements'][ele3]['regex'];
            };
            if(threeEle.unitC.length && threeEle.numC === 1){
                threeEle.valWidth = 'col-md-10';
            }else if(!threeEle.unitC.length && threeEle.numC === 1){
                threeEle.valWidth = 'col-md-12';
            }else if(!threeEle.unitC.length && threeEle.numC === 2){
                threeEle.valWidth = 'col-md-6';
            }else if(threeEle.unitC.length && threeEle.numC === 2){
                threeEle.valWidth = 'col-md-5';
            }else if(!threeEle.unitC.length && threeEle.numC === 3){
                threeEle.valWidth = 'col-md-4';
            }else if(threeEle.unitC.length && threeEle.numC === 3){
                threeEle.valWidth = 'col-md-4';
            };
            return threeEle;
        },
        firstClickResearch: function (box) {//一级属性搜索框
            var search_inp = box.find('div.firstBtn').find('div.input-group').find('input');
            var aList = box.find('.firstBtn').find('div.menu').find('a.page-header');
            box.on('click',function(){
                 box.find('.firstBtn').find('div.menu').removeAttr('style');
                search_inp.blur();
            });
            box.find('div.firstBtn').find('a.btn').off().on('click',function(){
                search_inp.focus();
                search_inp.attr('focus',true).attr('data-id','fir_research');
                search_inp.click(function(event){
                    event.stopPropagation();
                     box.find('.firstBtn').find('div.menu').attr('style','display:block;');
                });
                $('#basic-addon2').click(function(event){
                    search_inp.val('');
                    event.stopPropagation();
                     box.find('.firstBtn').find('div.menu').attr('style','display:block;');
                });
                search_inp.on('input propertychange',function(){
                    var search_inp_val = search_inp.val().trim();
                    aList.each(function(index,item){
                        $(item).removeAttr("hidden");
                        if(search_inp_val && $(item).html().toLocaleUpperCase().indexOf(''+search_inp_val.toLocaleUpperCase()+'') !== 0){
                            $(item).attr("hidden","hidden");
                        }else{
                            $(item).removeAttr("hidden");
                        }
                    });
                });
            });
        }
    };
    AmazonRule.init();
    var SkuSet = {
        init: function() {
            $("#sku-set-modal").on("change", "#alias-prev, #alias-next, #alias-mid, #set-sku-p, .alias-v", SkuSet.recreate_sku);
            $("#edit-sku-ensure").click(SkuSet.edit_sku_ensure);
            $("#set-sku-order").sortable({
                "items": ".set-sku-order-block",
                "update": SkuSet.recreate_sku
            });
        },
        create_sku_by_set: function(prev, next, mid, order_list, p_sku){
            var sku_trs = $(".variation-row");
            for(var i=0; i<sku_trs.length; i++){
                var _tr = sku_trs.eq(i),
                    value_list = order_list.map(function(a){
                        if(a === "p-sku") return p_sku;
                        else {
                            var _v = _tr.find(".variation-attr[data-name='"+a+"']").attr("data-value");
                            return alias[a.toLowerCase()][_v]||_v
                        }
                    });
                if(prev) value_list.unshift(prev);
                if(next) value_list.push(next);
                _tr.find(".v-sku").val(value_list.join(mid));
            }
        },
        recreate_sku: function () {
            var value_list = $("#set-sku-order").find(".set-sku-order-block").get().map(function(a){
                var _name = $(a).attr("data-name");
                if(_name === "p-sku") return $(a).find(":text").val();
                else{
                    var _dom = $(".alias-table[data-name='"+_name+"']").find("input:text").eq(0);
                    return _dom.val()||_dom.attr("data-o")
                }
            }), prev = $("#alias-prev").val().trim(), next = $("#alias-next").val().trim(), mid = $("#alias-mid").val();
            if(prev) value_list.unshift(prev);
            if(next) value_list.push(next);
            $("#alias-ex").val(value_list.join(mid));
        },
        onekey_sku_set: function () {
            var block_list = $("#sku-prop").find(".form-group"),
                storage = window.localStorage, mid, name_list = [];
            if(storage&&(storage["alias-mid"] != undefined)) mid = storage["alias-mid"]; else mid = "-";
            $("#set-sku-order").find(".set-p-sku-block").siblings(".set-sku-order-block").remove();
            $("#set-sku-alias-content").empty();
            for(var i=0; i< block_list.length; i++){
                var $block = block_list.eq(i),
                    $name = $block.attr("data-name"),
                    v_content = $block.find(".col-md-10"),
                    $values;
                $values = v_content.find(":checkbox:checked").get().map(function(a){ return $(a).attr("data-name"); });
                if($values.length) {
                    SkuSet.set_sku_add_value($name, $values);
                    name_list.push($name);
                    console.log(name_list)
                }
            }
            SkuSet.set_sku_add_name(name_list, storage);
            $("#set-sku-p").val($("#parent-sku").val().trim());
            $("#alias-mid").val(mid);
            $("#alias-next").val((storage&&storage["alias-next"])||"");
            $("#alias-prev").val((storage&&storage["alias-prev"])||"");
            SkuSet.recreate_sku();
            $("#sku-set-modal").modal("show");
        },
        set_sku_add_name: function(names, storage){
            var content = $("#set-sku-order"),
                cur_dom = $(".set-p-sku-block");
            if(storage && storage["alias-order-list"]){
                var order_list = storage["alias-order-list"].split(","), cur;
                names.push("p-sku");
                names.sort(function(a, b){
                    var _a = order_list.indexOf(a),
                        _b = order_list.indexOf(b);
                    _a = _a===-1? 100: _a;
                    _b = _b===-1? 100: _b;
                    return _a - _b
                });
                cur = names.indexOf("p-sku");
                for(var i=0; i<names.length; i++){
                    if(i<cur) cur_dom.before($("<div>", {"class": "set-sku-order-block", "data-name": names[i]}).text(names[i]));
                    else if(i>cur) content.append($("<div>", {"class": "set-sku-order-block", "data-name": names[i]}).text(names[i]));
                }
            } else content.append(names.map(function(a){return $("<div>", {"class": "set-sku-order-block", "data-name": a}).text(a);}));
        },
        set_sku_add_value: function(name, values){
            var _alias = alias[name.toLowerCase()]||{};
            values = values.reduce(function(prev, curr, index, arr){
                if(index%3 === 0){
                    prev.push([curr, arr[index+1], arr[index+2]]);
                    return prev
                } else return prev;
            }, []);
            $("#set-sku-alias-content").append(
                $("<div>", {"class": "set-sku-alias-block"}).append(
                    $("<div>", {"class": "alias-head"}).text(name),
                    $("<div>").append($("<table>", {"class": "alias-table", "data-name": name}).append(
                        values.map(function(a){
                            var _tr = $("<tr>");
                            $().append.apply(_tr, a.map(function(v){
                                    if(v) return[$("<td>").text(v+":"), $("<td>").append($("<input>", {
                                        "type": "text",
                                        "class": "alias-v",
                                        "data-o": v
                                    }).val(_alias[v]))];
                                    else return [$("<td>"), $("<td>")]
                                })
                            );
                            return _tr
                        })
                    ))
                )
            );
        },
        edit_sku_ensure: function () {
            var order_list = $("#set-sku-order").find(".set-sku-order-block").get().map(function(a){return $(a).attr("data-name")}),
                alias_list = [],
                block_list = $(".alias-table"),
                prev = $("#alias-prev").val().trim(),
                next= $("#alias-next").val().trim(),
                mid = $("#alias-mid").val().trim(),
                p_sku = $("#set-sku-p").val().trim();
            alias = alias || {};
            for(var i=0; i<block_list.length; i++){
                var _block = block_list.eq(i),
                    name  = _block.attr("data-name"),
                    _maps = _block.find(".alias-v"),
                    add_data = {"name": name, values: []};
                if(!alias[name.toLowerCase()]) alias[name.toLowerCase()] = {};
                for (var j=0; j<_maps.length; j++){
                    var _map = _maps.eq(j),
                        _o = _map.attr("data-o"),
                        _value = _map.val().trim();
                    alias[name.toLowerCase()][_o] = _value;
                    add_data["values"].push([_o, _value]);
                }
                alias_list.push(add_data);
            }
            SkuSet.create_sku_by_set(prev, next, mid, order_list, p_sku);
            $("#sku-set-modal").modal("hide");
            if ($("#up-alias-set-reg").prop("checked")){
                var storage = window.localStorage;
                $.post("/alias/add/values", {"info": JSON.stringify(alias_list)}, function(data){
                    if(!data.status) console.log(data.message);
                });
                if(storage){
                    storage["alias-prev"] = prev;
                    storage["alias-next"] = next;
                    storage["alias-mid"] = mid;
                    storage["alias-order-list"] = order_list.join(",")
                }
            }
        }
    };
    SkuSet.init();
});
