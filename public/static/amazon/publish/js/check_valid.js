/**
 * Created by GF on 2016/6/27.
 */
var Valid = {
    init: function(required_list, valid_dic){
        Valid.scroll_height = 10000;
        Valid.flag = true;
        Valid.check_count = 0;
        Valid.required = required_list || [];
        Valid.valid_dic = valid_dic;
        Valid.platform = $(".shop-info").find("span").eq(0).text();
        Valid.title_limit = {
            "AliExpress": 128,
            "eBay": 80,
            "Lazada": 255,
            "Amazon": 200,
            "DHgate": 140
        }[Valid.platform];
        Valid.weight_digit = {
            "AliExpress": 5,
            "eBay": 1,
            "Lazada": 2,
            "DHgate": 3
        }[Valid.platform];
        Valid.pack_digit = {
            "eBay": 1,
            "Lazada": 2,
            "DHgate": 2
        }[Valid.platform];
        $(document).on("change", ".need-check .form-control", Valid.value_change)
            .on("change", ".valid-tips .form-control", Valid.value_change);
    },
    reset_flag: function(){
        Valid.flag = true;
        Valid.check_count = 0;
        Valid.scroll_height = 10000;
    },
    simple_check: function(){
        Valid.check_count = 0;
        Valid.check_title("#title,#Title");
        Valid.check_category2();
        Valid.check_variation();
        Valid.flag || $("html,body").animate({scrollTop:Valid.scroll_height},300);
        return Valid.flag
    },
    execute_check: function(){
        Valid.check_count = 0;
        Valid.execute_check_no_scroll();
        Valid.check_ali_brand();
        Valid.flag || $("html,body").animate({scrollTop:Valid.scroll_height},300);
        return Valid.flag
    },
    check_variation:　function () {
        if(Valid.check_count == 0){
            if(Valid.valid_dic){
                for(var j in Valid.valid_dic){
                    var $v = Valid.valid_dic[j];
                    eval("Valid.check_" + j)($v, "simple");
                }
            }
            if(Valid.platform == "Joom" || Valid.platform == "Wish"){
                Valid.check_tag("#tags-ul");
                Valid.check_shipping(".v-shipping-price:visible", 'simple');
                Valid.check_shipping(".v-price:visible", 'simple');
            }
            Valid.check_count = 1;
        }
    },
    execute_check_no_scroll: function(){
        if(Valid.check_count == 0){
            if(Valid.valid_dic){
                for(var j in Valid.valid_dic){
                    var $v = Valid.valid_dic[j];
                    eval("Valid.check_" + j)($v);
                }
            }
            Valid.check_img("#feed_img", "*请至少添加一张产品图片");
            Valid.check_title("#title,#Title");
            Valid.check_deses();
            Valid.check_other_required();
            Valid.check_sku();
            if(Valid.platform == "Wish" || Valid.platform == "Joom"){
                Valid.check_tag("#tags-ul");
                Valid.check_shipping(".v-shipping-price:visible");
                Valid.check_shipping(".v-price:visible");
                Valid.check_shipping_time();
            }else{
                Valid.check_category();
            }
            if(Valid.platform == "DHgate"){
                Valid.check_stock_status();
                Valid.check_location();
                Valid.check_sale_mode();
                Valid.check_sale_range();
                Valid.check_dh_price();
                Valid.check_dh_stock();
                Valid.check_dh_interval();
            }
            if(Valid.platform == "eBay"){
                Valid.check_ebay_upc();
                Valid.check_location_post();
//                Valid.check_ebay_shipping();
            }
            Valid.check_ali_pack();
            Valid.check_count = 1;
        }
    },
    check_other_required: function(){
        if($('div.variation-set').filter(":visible").length){
            $('#Price').attr('required',false);
            $('#Price').closest('div.form-group').find('span.required').hide();
            $('#Quantity').attr('required',false);
            $('#Quantity').closest('div.form-group').find('span.required').hide();
            $('#ShippingCost').attr('required',false);
            $('#ShippingCost').closest('div.form-group').find('span.required').hide();
            $(':radio[name="ShippingTime"]').eq(0).closest('div.form-group').find('span.required').hide();
        }else {
            $('#Price').attr('required',true);
            $('#Price').closest('div.form-group').find('span.required').show();
            $('#Quantity').attr('required',true);
            $('#Quantity').closest('div.form-group').find('span.required').show();
            $('#ShippingCost').attr('required',true);
            $('#ShippingCost').closest('div.form-group').find('span.required').show();
            $(':radio[name="ShippingTime"]').eq(0).closest('div.form-group').find('span.required').show();
        }
        var spec_div = $(".required").filter(":visible"),
            check_input = $(":required").filter(":visible"),
            tip_html_str = "<p style='color:#eb3c00'>*此项为必输项</p>",
            height_t;
        if($('.shop-info').eq(0).find('.text').find('span').eq(0).text() === "Joom"){
            if($('#ParentSKU').val().length == 0){
                Valid.flag = false;
                Valid.remove_tip($('#ParentSKU'));
                Valid.set_tip($('#ParentSKU'), "父SKU不能为空", "sku");
                height_t = $('#ParentSKU').offset().top;
                Valid.scroll_height = Valid.scroll_height < height_t ? Valid.scroll_height : height_t;
            };
            if($('#ParentSKU').val().length > 50){
                Valid.flag = false;
                Valid.remove_tip($('#ParentSKU'));
                Valid.set_tip($('#ParentSKU'), "父SKU字符长度需要保持50个字节以内!", "sku");
                height_t = $('#ParentSKU').offset().top;
                Valid.scroll_height = Valid.scroll_height < height_t ? Valid.scroll_height : height_t;
            };
        }
        spec_div.each(function (i, v) {
            var check_form = $(v).closest(".form-group");
            if(check_form.find(":checkbox").length > 0 || check_form.attr("data-type") == "CheckBox"){
                var checked_box = check_form.find("input:checked");
                $(v).closest("label").find(".blank").remove();
                if (checked_box.length == 0) {
                    $("<p/>").addClass("blank").html("*此项为必输项").appendTo($(v).closest("label"));
                    $(v).closest(".form-group").find("input:checkbox");
                    Valid.flag = false;
                    height_t = $(v).offset().top;
                    Valid.scroll_height = Valid.scroll_height < height_t ? Valid.scroll_height : height_t;
                    check_form.find(":checkbox").click(Valid.check_click);
                }
            }
            if(check_form.find("select").length > 0 && $(v).closest("label").attr("data-en") != "Brand Name"){
                var check_select = check_form.find("select");
                check_select.next(".blank").remove();
                if(check_select.attr("class").indexOf("input-select") == -1){
                    if ((!check_select.find(":selected").attr("value") || (check_select.attr("id")=="ListingDuration" && check_select.find(":selected").attr("value") == "default")) && !check_select.find(":selected").attr("data-id") && !check_select.find(":selected").attr("data-name")) {
                        check_select.after(tip_html_str).css("border-color", "#eb3c00");
                        Valid.flag = false;
                        height_t = $(v).offset().top;
                        Valid.scroll_height = Valid.scroll_height < height_t ? Valid.scroll_height : height_t;
                        check_form.find("select").unbind("change", Valid.must_select_change).change(Valid.must_select_change);
                    }
                }else{
                    if (check_select.closest("div").find(".select-input").val().trim() == "") {
                        check_select.after(tip_html_str).css("border-color", "#eb3c00");
                        Valid.flag = false;
                        height_t = $(v).offset().top;
                        Valid.scroll_height = Valid.scroll_height < height_t ? Valid.scroll_height : height_t;
                        check_form.find("select").unbind("change", Valid.must_select_change).change(Valid.must_select_change);
                        check_select.closest("div").find(".select-input").unbind("change").change(function(){
                            var $this = $(this);
                            if ($this.val().trim() == "") {
                                $this.closest("div").find(".input-select").after("<p style='color:#eb3c00'>*此项为必输项</p>").css("border-color", "#eb3c00");
                            }else{
                                $this.closest("div").find(".input-select").next().remove();
                                $this.closest("div").find(".input-select").css("border-color", "");
                            }
                        })
                    }
                }
            }
        });
        for(var i = 0; i < check_input.length; i++){
            var cur_dom = check_input.eq(i),
                text = cur_dom.closest(".form-group").find("label").text();
            if ((cur_dom.parent().attr("class").indexOf("valid-tips") == -1 && cur_dom.parent().attr("class").indexOf("need-check") == -1) ||
                (text.indexOf("价格")!=-1 || (text.indexOf("运费") != -1 && text.indexOf("运费模板") == -1) || text.indexOf("起始价")!=-1 || text.indexOf("库存")!=-1 || text.indexOf("备货时间")!=-1 || text.indexOf("包装后尺寸")!=-1 || text.indexOf("包装后重量")!=-1 || text.indexOf("毛重")!=-1)) {
                if(cur_dom.val() == undefined || cur_dom.val().trim() == ""){
                    cur_dom.next().remove();
                    cur_dom.after(tip_html_str).css("border-color", "#eb3c00").keyup(Valid.must_input_keyup);
                    Valid.flag = false;
                    height_t = cur_dom.offset().top;
                    Valid.scroll_height = Valid.scroll_height < height_t ? Valid.scroll_height : height_t;
                }else if(text.indexOf("价格")!=-1 || (text.indexOf("运费") != -1 && text.indexOf("运费模板") == -1) || text.indexOf("起始价")!=-1 || text.indexOf("包装后尺寸")!=-1 || text.indexOf("包装后重量")!=-1 || text.indexOf("毛重")!=-1){
                    if(text.indexOf("包装后尺寸")!=-1){
                        if(Valid.platform == "AliExpress"){
                            Valid.check_int(cur_dom, "other_required");
                        }else{
                            Valid.check_float(cur_dom, "other_required", Valid.pack_digit);
                        }
                    }else if(text.indexOf("包装后重量")!=-1 || text.indexOf("毛重")!=-1){
                        Valid.check_float(cur_dom, "other_required", Valid.weight_digit);
                    }else{
                        Valid.check_float(cur_dom, "other_required");
                    }
                }else if(text.indexOf("库存")!=-1 || text.indexOf("备货时间")!=-1){
                    Valid.check_int(cur_dom, "other_required");
                }
                if(cur_dom.closest("select").length>0){
                    cur_dom.unbind("change", Valid.must_select_change).change(Valid.must_select_change);
                }
            }
        }
    },
    must_input_keyup: function(){
        var product_unit = $("#ProductUnit :selected");
        if(product_unit.attr("data-id") && $(this) == $("#ProductUnit")){
            $(this).css("border-color", "");
            $(this).next().remove();
        }else if($(this).val().trim() != ""){
            $(this).css("border-color", "");
            $(this).next().remove();
        }
    },
    must_select_change: function(){
        var $this = $(this);
        if (!$this.find(":selected").attr("value") && !$this.find(":selected").attr("data-id") && !$this.find(":selected").attr("data-name") && ($this.val() == undefined || $this.val() == "" || $this.val() == "请选择")) {
            $this.after("<p style='color:#eb3c00'>*此项为必输项</p>").css("border-color", "#eb3c00");
        }else{
            $this.next().remove();
            $this.css("border-color", "");
        }
    },
    check_click: function(){
        var $dom = $(this).closest(".form-group");
        var checked_box = $dom.find("input:checked");
        $dom.children("label").find(".blank").remove();
        if (checked_box.length == 0) {
            $("<p/>").addClass("blank").html("*此项为必输项").appendTo($dom.children("label"));
        }
    },
    re_check: function(element, value, pattern, is_required, type, tip, digit, arg4){
        if(value == ""){
            if(arg4 && arg4 == "simple"){}else {
                if(is_required){
                    Valid.set_tip(element, "*此项为必填项", type);
                }else{
                    Valid.remove_tip(element);
                }
            }
        }else if(!pattern.test(value)){
            Valid.set_tip(element, tip, type);
        }else{
            if(arguments[6]){
                if(value.split(".")[1] && value.split(".")[1].length>parseInt(arguments[6])){
                    Valid.set_tip(element, tip, type);
                }else{
                    Valid.remove_tip(element);
                }
            }else{
                Valid.remove_tip(element);
            }
        }
    },
    check_int: function(){
        var int_pattern = /^\d+$/,
            element = arguments[0],
            type = arguments[1],
            $element = $(element),
            value = $element.val().trim(),
            is_required = $.inArray(type, Valid.required) != -1;
        Valid.re_check(element, value, int_pattern, is_required, type, "此项的值必须为整数");
    },
    check_float: function(){
        var float_pattern = /^(\d+(\.\d+)?)$/,
            element = arguments[0],
            type = arguments[1],
            $element = $(element),
            digit = arguments[2] || null,
            tip = digit ? ("此项的值必须为整数或"+digit+"位以下小数") : "此项的值必须为数字",
            value = $element.val().trim(),
            is_required = $.inArray(type, Valid.required) != -1;
        Valid.re_check(element, value, float_pattern, is_required, type, tip, digit, arguments[3]);
    },
    check_stock: function(){
        var element = arguments[0] || this,
            $element = $(element).not(":disabled");
        $element.each(function(k, v){
            Valid.check_int(v, "stock");
        })
    },
    check_price: function(){
        var element = arguments[0] || this,
            $element = $(element).not(":disabled");
        var arg1 = arguments[1];
        $element.each(function(k, v){
            Valid.check_float(v, "price", null, arg1);
        })
    },
    check_cu: function(){
        var element = arguments[0] || this,
            $element = $(element).not(":disabled");
        var arg1 = arguments[1];
        $element.each(function(k, v){
            Valid.check_float(v, "cu", null, arg1);
        })
    },
    check_shipping: function(){
        var element = arguments[0] || this,
            $element = $(element).not(":disabled");
        var arg1 = arguments[1];
        $element.each(function(k, v){
            Valid.check_float(v, "shipping", null, arg1);
        });
    },
    check_sku: function(){
        var sku = $(".v-sku:visible").not(":disabled");
        if(Valid.platform == "Wish" || Valid.platform == "Joom" || Valid.platform == "Lazada"){
            sku.each(function(k, v){
                var kv = $(v);
                if(kv.val().trim() == ""){
                    Valid.set_tip(kv, "SKU不能为空", "sku")
                }else{
                    // 验证sku长度
                    if(Valid.platform == "Joom"){
                        if(kv.val().trim().length > 50){
                            Valid.remove_tip(kv);
                            Valid.set_tip(kv, "SKU字符长度需要保持50个以内!", "sku");
                        }else {
                            Valid.remove_tip(kv);
                        }
                    }else{
                        Valid.remove_tip(kv);
                    }
                }
            })
        }else if(Valid.platform == "AliExpress"){
            sku.each(function(k, v){
                var kv = $(v);
                if(kv.val().trim() != ""){
                    var re = /[a-zA-Z0-9\-_]+/;
                    if(re.test(kv.val().trim())){
                        if(kv.val().trim().length>20){
                            Valid.set_tip(kv, "SKU不能超过20字符", "sku");
                        }else{
                            Valid.remove_tip(kv);
                        }
                    }else{
                        Valid.set_tip(kv, "SKU包含特殊字符", "sku");
                    }
                }else{
                    Valid.remove_tip(kv);
                }
            })
        }
    },
    check_range: function(){

    },
    check_string: function(){

    },
    check_ebay_upc: function(){
        if(Valid.platform == "eBay"){
            var upc = $(".v-upc:visible").not(":disabled");
            upc.each(function(k, v){
                var kv = $(v);
                if(kv.val().trim() == ""){
                    Valid.set_tip(kv, "此项不能为空", "ebay_upc")
                }else{
                    Valid.remove_tip(kv);
                }
            })
        }
    },
    check_location_post: function(){
        var location = $("#Location"),
            post_code = $("#PostalCode");
        if(location.val().trim() == "" && post_code.val().trim() == ""){
            var height = location.offset().top;
            Valid.scroll_height = Valid.scroll_height < height ? Valid.scroll_height : height;
            Valid.flag = false;
            location.closest("div").find("span").remove();
            post_code.closest("div").find("span").remove();
            location.closest("div").append('<span style="color:#eb3c00">物品所在地和邮编不能同时为空</span>');
            post_code.closest("div").append('<span style="color:#eb3c00">物品所在地和邮编不能同时为空</span>');
        }
    },
    check_ebay_shipping: function(){
        if(Valid.platform == "eBay"){
            $('[name="free-shipping"]').each(function(k, v){
                var kv = $(v),
                    ipt = kv.closest(".row").find('input[type="text"]');
                if(!ipt.prop("disabled") && ipt.val().trim() == ""){
                    Valid.set_tip(ipt, "此项不能为空", "ebay_shipping")
                }else{
                    Valid.remove_tip(ipt);
                }
            })
        }
    },
    check_ali_pack: function(){
        if(Valid.platform == "AliExpress"){
            if($("#pack-sell").prop("checked")){
                var value = $("#LotNum").val().trim();
                if(value == "" || parseInt(value)<2){
                    Valid.set_tip("#LotNum", "每包件数必须为大于一的整数", "ali_pack");
                }
            }
        }
    },
    check_ali_brand: function(){
        if(Valid.platform == "AliExpress"){
            var brand_btn = $('label[data-en="Brand Name"]').closest("div").find(".ss-select-btn");
            if(brand_btn.length == 1){
                var $id = brand_btn.attr("data-id");
                if($id == "null"){
                    Valid.set_tip(brand_btn, "*此项为必填项", "ali_brand");
                }
            }
        }
    },
    check_title: function(){
        var element = arguments[0] || this,
            $element = $(element),
            cn_pattern = /[\u4e00-\u9fa5]+/,
            title = $element.val().trim(),
            tip_str = "";
        if(title == ""){
            tip_str = "标题不能为空";
        }else if(title.match(cn_pattern)){
            tip_str = "标题中含有中文字符";
        }else if(Valid.title_limit && title.length > Valid.title_limit){
            tip_str = "标题不能超过" + Valid.title_limit + "个字符";
        }
        if(tip_str == ""){
            Valid.remove_tip(element);
        }else{
            Valid.set_tip(element, tip_str, "title");
        }
    },
    check_tag: function(){
        var element = arguments[0] || this,
            $element = $(element),
            tag = $("#tags-ul");
        if(tag.children("li").length<3){
            Valid.set_tip(element, "*至少输入2个标签", "tag")
        }else if(tag.children("li").length>11){
            Valid.set_tip(element, "*标签最多不能超过十个", "tag");
        }else{
            Valid.remove_tip(element);
        }
    },
    check_deses: function(){
        var editors = $(".ke-container");
        if(Valid.platform == "Lazada"){
            Valid.check_des(window.ue_highlight, "#hlHtml");
        }else if(Valid.platform == "Joom" || Valid.platform == "Wish"){
            var element = $("#description");
            if(element.val().trim() == ""){
                Valid.set_tip(element, "产品描述不能为空", "deses");
            }else{
                Valid.remove_tip(element);
            }
        }else{
            if(typeof(ue_des) != "undefined"){
                Valid.check_des(ue_des, "#detailHtml");
            }
            if(Valid.platform == "DHgate"){
                var dh_ele = $("#short-des");
                if(dh_ele.val().trim() == ""){
                    Valid.set_tip(dh_ele, "产品简短描述不能为空", "deses");
                }else{
                    Valid.remove_tip(dh_ele);
                }
            }
        }
    },
    check_des: function(des_obj, element){
        var $e;
        if(des_obj){
            var content = "";
            des_obj.ready(function(){
                content = des_obj.getPlainTxt().trim();
                if(content == ""){
                    $e = $(element);
                    if($e.length>0){
                        if($e.text() == ""){
                            Valid.set_tip($e.closest("div"), "*此项为必填项", "deses")
                        }else{
                            Valid.remove_tip($e.closest("div"));
                            $e.empty();
                        }
                    }
                }else{
                    Valid.remove_tip($(element).closest("div"));
                }
            });
        }else{
            $e = $(arguments[2]);
            if($e.length>0){
                if($e.text() == ""){
                    Valid.set_tip($e, "*此项为必填项", "deses")
                }else{
                    Valid.remove_tip($e);
                }
            }
        }
    },
    check_img: function(element, tip){
        var cur_tip = tip || "请上传产品图片";
        if($(element).find("img").eq(0).attr("src") == "/static/image/add.png"){
            Valid.set_tip(element, cur_tip);
        }else{
            Valid.remove_tip(element);
        }
    },
    check_category: function(){
        if($.inArray(Valid.platform, ["AliExpress", "eBay", "Amazon", "DHgate", "Lazada"]) != -1){
            var cate = $("#CategoryID");
            if(!cate.attr("data-id") || cate.attr("data-id") == "0"){
                Valid.set_tip(cate.closest("div"), "请选择分类");
            }else{
                Valid.remove_tip(cate.closest("div"));
            }
        }
    },
    check_category2: function(){
        if($.inArray(Valid.platform, ["AliExpress", "eBay", "Amazon", "DHgate", "Lazada"]) != -1){
            var cate = $("#CategoryID");
            if(!cate.attr("data-id") || cate.attr("data-id") == "0"){
                Valid.set_tip(cate.closest("div"), "请选择分类");
                Inform.enable();
                Inform.show("请选择分类")
            }else{
                Valid.remove_tip(cate.closest("div"));
            }
        }
    },
    check_sale_mode: function(){
        if($(".sale-mode:checked").val() == "package"){
            Valid.check_int($("#num-every-package"), "sale_mode");
        }else{
            Valid.remove_tip($("#num-every-package"));
        }
    },
    check_stock_status: function(){
        if($(".stock-status").filter(":checked").attr("id") == "wait-stocking"){
            var max_purchase = $("#max-purchase").val().trim();
            if(max_purchase == ""){
                Valid.set_tip("#max-purchase", "一次最大购买量应为整数数字，且不能大于10000", "stock_status");
            }else{
                var re = /^[1-9]\d*$/g;
                if(!re.test(max_purchase) || parseInt(max_purchase) > 10000){
                    Valid.set_tip("#max-purchase", "一次最大购买量应为整数数字，且不能大于10000", "stock_status");
                }
            }
        }
    },
    check_location: function(){
        if($(".stock-status").filter(":checked").attr("id") == "has-stocking"){
            var location_lists = $(".stocking-location").find(":selected");
            if(location_lists.length>1){
                var $lo = [];
                location_lists.each(function(k, v){
                    if($.inArray($(v).attr("data-id"), $lo) == -1){
                        $lo.push($(v).attr("data-id"));
                    }else{
                        Valid.flag =false;
                        Valid.set_tip($(".stocking-location").find(".well"), "请勿添加相同的备货地", "");
                    }
                });
            }
        }
    },
    check_sale_range: function(){
        var type = $(".price-set-mode:checked").attr("id"),
            flag = true,
            re_int = /^[1-9]\d*$/,
            re_float = /^[0-9]+(.[0-9]{1,2})?$|^[1-9]\d*$/ ,
            $area,
            $tip,
            tip_str,
            temp_amount = 0,
            temp_value = 0;
        if(type == "unity-set"){
            $area = $("#price-uni");
            $area.find(".form-inline").each(function(k, v){
                var kv = $(v);
                var $amount = kv.find("input").eq(0).val().trim(),
                    $value = kv.find("input").eq(1).val().trim();
//                if($amount != "" && $value != ""){
                if(!re_int.test($amount) || parseInt($amount) > 10000){
                    flag = false;
                    tip_str = "<span>购买数量应该为整数数字,且不能大于10000</span>";
                    return
                }
                if(!re_float.test($value) || parseFloat($value) > 999999 || parseFloat($value) <0.01){
                    flag = false;
                    tip_str = "<span>价格必须为数字,最多允许两位小数。0.01-999999</span>";
                    return
                }
                if(k == 0){
                    temp_amount = parseInt($amount);
                    temp_value = parseFloat($value);
                }else{
                    if(parseInt($amount) <= temp_amount){
                        flag = false;
                        tip_str = "<span>价格区间的购买数量应大于上个区间的购买数量</span>";
                        return
                    }
                    if(parseFloat($value) >= temp_value){
                        flag = false;
                        tip_str = "<span>价格区间的价格必须依次递减</span>";
                        return
                    }
                    temp_amount = parseInt($amount);
                    temp_value = parseFloat($value);
                }
//                }
            })
        }else{
            $area = $("#price-every");
            $area.find(".form-inline").each(function(k, v){
                var kv = $(v);
                var $amount = kv.find("input").eq(0).val().trim(),
                    $value = k == 0 ? "0" : kv.find("input").eq(1).val().trim();
//                if($amount != "" && $value != ""){
                if(!re_int.test($amount) || parseInt($amount) > 10000){
                    flag = false;
                    tip_str = "<span>购买数量应该为整数数字,且不能大于10000</span>";
                    return
                }
                if(k != 0 && (!re_int.test($value) || parseInt($value) > 99 || parseFloat($value) <1)){
                    flag = false;
                    tip_str = "<span>折扣应该为1-99的整数</span>";
                    return
                }
                if(k == 0){
                    temp_amount = parseInt($amount);
                    temp_value = parseFloat($value);
                }else{
                    if(parseInt($amount) <= temp_amount){
                        flag = false;
                        tip_str = "<span>价格区间的购买数量应大于上个区间的购买数量</span>";
                        return
                    }
                    if(parseInt($value) <= temp_value){
                        flag = false;
                        tip_str = "<span>折扣不能小于等于上一区间折扣</span>";
                        return
                    }
                    temp_amount = parseInt($amount);
                    temp_value = parseFloat($value);
                }
//                }
            })
        }
        $tip = $area.find(".sale-range-tip");
        if(!flag){
            $tip.html(tip_str).show();
            Valid.flag = false;
            var height_t = $tip.offset().top;
            Valid.scroll_height = Valid.scroll_height < height_t ? Valid.scroll_height : height_t;
        }else{
            $tip.hide();
        }
    },
    check_dh_stock: function(){
        var int_pattern = /^\d+$/;
        var uniform_price = true,
            $set_mode = $(".price-set-mode").filter(":checked").attr("id") == "unity-set",
            sku_area;
        var stock_status = $(".stock-status:checked").attr("id") == "has-stocking";
        if(!$(".price-set-mode").eq(0).closest(".radio").is(":hidden")){
            uniform_price = $set_mode;
        }
        if(uniform_price){
            sku_area = $(".p-uni-l");
        }else{
            sku_area = $(".p-every-l");
        }
        if(stock_status){
            sku_area.each(function(k, v){
                $(v).find(".v-stock").each(function(m, n){
                    if(!int_pattern.test($(n).val().trim())){
                        Valid.set_tip($(n), "库存必须为整数", "dh_stock")
                    }
                });
            });
        }
    },
    check_dh_price: function(){
        var uniform_price = true,
            $set_mode = $(".price-set-mode").filter(":checked").attr("id") == "unity-set",
            float_pattern = /^(\d+(\.\d+)?)$/,
            sku_area;
        if(!$(".price-set-mode").eq(0).closest(".radio").is(":hidden")){
            uniform_price = $set_mode;
        }
        if(uniform_price){
            sku_area = $(".p-uni-l");
        }else{
            sku_area = $(".p-every-l");
        }
        sku_area.each(function(k, v){
            $(v).find(".v-price").each(function(m, n){
                if(!float_pattern.test($(n).val().trim())){
                    Valid.set_tip($(n), "价格必须为数字", "dh_price")
                }
            });
        });
    },
    check_dh_interval: function(){
        var stock_tip = '<p class="stock-tip" style="color: #eb3c00;">*备货期不能为空，请设置</p>',
            stock_area = $(".price-set-mode:checked").attr("id") == "unity-set" ? $("#price-uni") : $("#price-every");
        stock_area.find(".stock-tip").remove();
        stock_area.find(".v-stock-interval").each(function(k, v){
            if($(v).text() == ""){
                stock_area.append(stock_tip);
                Valid.flag = false;
                var height_t = stock_area.offset().top;
                Valid.scroll_height = Valid.scroll_height < height_t ? Valid.scroll_height : height_t;
                return false;
            }
        });
    },
    check_shipping_time: function(){
        var max_times = $(".v-time-max").not(":disabled"),
            int_pattern = /^\d+$/;
        $(".v-time-min").not(":disabled").each(function(k, v){
            var kv = $(v),
                min_time = kv.val().trim(),
                max_time = max_times.eq(k).val().trim();
            if(min_time == "" || max_time == ""){
                Valid.set_tip(kv, "运送时间不能为空", "shipping_time")
            }else if(!int_pattern.test(min_time) || !int_pattern.test(max_time)){
                Valid.set_tip(kv, "运送时间必须为整数", "shipping_time")
            }else if(parseInt(min_time)<2){
                Valid.set_tip(kv, "最小运送时间不能小于2", "shipping_time")
            }else if(parseInt(min_time) > parseInt(max_time)){
                Valid.set_tip(kv, "最大时间小于最小时间", "shipping_time")
            }else{
                Valid.remove_tip(kv);
            }
        })
    },
    set_tip: function(element, tip, valid_type){
        $(element).parent().removeClass("need-check").addClass("valid-tips").attr("data-content", tip).attr("data-valid", valid_type);
        var height = $(element).offset().top;
        Valid.scroll_height = Valid.scroll_height < height ? Valid.scroll_height : height;
        Valid.flag = false;
    },
    value_change: function(){
        var $this = $(this),
            valid_info = $this.closest(".valid-tips");
        valid_info.length == 0 && (valid_info = $this.closest(".need-check"));
        try{
            eval("Valid.check_"+valid_info.attr("data-valid"))($this)
        }catch (e){

        }
    },
    remove_tip: function(element){
        $(element).closest(".valid-tips").removeClass("valid-tips").addClass("need-check");
    }
};