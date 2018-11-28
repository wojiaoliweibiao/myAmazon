/**
 * Created by xuhe on 15/5/26.
 */
$(function(){
    var shop_id = $("#shop-id").val();
    var trigger_cate_btn; // 触发目录模态框的button
    Inform.init();
    init_meitu();
    if($("#quote_product").length > 0){
        $("#quote_product").referPro({"shop_id": shop_id});
    }else if($("#quote_template").length>0){
        $("#quote_template").referPro({"shop_id": shop_id});
    }
    var category_group = [],
        c_level = 0,
        images = [],
        next = 0,
        pack_detail = $("#package-size").find("input"),
        pic_index = -1,
        picture_div = $("#feed_img"),
        image_url ="",
        image_size ="",
        dirty_value = 0,
        category_uid = 0,
        root_id = 0,
        cate_names = [], this_div,target_index,target_url,target_size, btn, button;
    compute_pack_size();
    search_keyup();
    footer_bottom();
    $("#t-upcase-btn").click(function(){
        var $dom = $(this).closest(".form-group").find(":text"),
            $title = $dom.val().trim();
        if($title!=""){
            var new_title = $title.replace(/\s[a-z]/g,function($1){return $1.toLocaleUpperCase()}).replace(/^[a-z]/,function($1){return $1.toLocaleUpperCase()}).replace(/\sOr[^a-zA-Z]|\sAnd[^a-zA-Z]|\sOf[^a-zA-Z]|\sAbout[^a-zA-Z]|\sFor[^a-zA-Z]|\sWith[^a-zA-Z]|\sOn[^a-zA-Z]/g,function($1){return $1.toLowerCase()});
            $dom.val(new_title);
        }
    });
    $("#st-upcase-btn").click(function(){
        var $dom = $(this).closest(".form-group").find(":text"),
            $title = $dom.val().trim();
        if($title!=""){
            var new_title = $title.replace(/\s[a-z]/g,function($1){return $1.toLocaleUpperCase()}).replace(/^[a-z]/,function($1){return $1.toLocaleUpperCase()}).replace(/\sOr[^a-zA-Z]|\sAnd[^a-zA-Z]|\sOf[^a-zA-Z]|\sAbout[^a-zA-Z]|\sFor[^a-zA-Z]|\sWith[^a-zA-Z]|\sOn[^a-zA-Z]/g,function($1){return $1.toLowerCase()});
            $dom.val(new_title);
        }
    });
    $("#trigger-goto").click(goto_source);
    $(".form-horizontal input,select").change(function(){
        dirty_value=1;
    });
    $(window).bind("beforeunload",function(e){
        if(dirty_value){
            return "提示:未保存的信息将会丢失"
        }
    });
    pack_detail.bind("blur", compute_pack_size);
    $(".category").find("li").click(choose_category);
    $("#image-space").click(modal_show);
    //$("#sku-prop").on("click","[data-self]", modal_show);
    $(".workspace").on("click","[data-category]",category_show);
    $("#category-tree").on('hide.bs.modal', function(){
        if(trigger_cate_btn){
            trigger_cate_btn.removeAttr("data-this");
            $("#choose-category").off("click.a");
        }
    });
    $("#Title, #product-title, #title, #short-des").on("keydown", check_title_limit)
        .on("change", check_title_limit)
        .on("keyup", check_title_limit);
    $("#sub-title").on("keydown", check_title_limit)
        .on("change", check_title_limit)
        .on("keyup", check_title_limit)
        .on("change", check_title_limit);
    $("#img-ensure-btn").click(img_ensure);
    $("#load-more").click(get_img_info);
    $(".form-horizontal").children("#footer:last-child").find("button").click(function(){
        $(window).unbind("beforeunload");
    });
    $("#cate-modal").click(select_group);
    $("#sel-exit").children("li").click(function () {
        var target = $(this),
            un_target = $(this).siblings();
        target.attr("class", "active");
        un_target.attr("class", "");
        $(target.attr("data-target")).show();
        $(un_target.attr("data-target")).hide();
    });
    picture_div.on("dragstart", ".thumbnail", function(e){
        e = e || window.event;
        e.dataTransfer = e.originalEvent.dataTransfer;
        e.dataTransfer.setData("xxx", "xx");
        this_div = $(this);
        if($(this).find("img").attr("src")!="/static/image/add.png"){
            $(this).css("cursor","move");
            pic_index = $.inArray(platform, ["Wish", "Lazada", "Linio", "Jumia"])!=-1 ? $(this).closest(".img-div").index() : $(this).attr("data-index");
            image_url = $(this).find("img").attr("src");
            image_size = $(this).find(".pro-img-size").text();
        }else{
            this_div.css("cursor","default");
            image_url ="";
            pic_index = -1;
        }
    });
    picture_div.on("dragenter", ".thumbnail", function(e){
        if($(this).find("img").attr("src")!="/static/image/add.png"){
            $(this).css("cursor","move");
            target_index = $.inArray(platform, ["Wish", "Lazada", "Linio", "Jumia"])!=-1 ? $(this).closest(".img-div").index() : $(this).attr("data-index");
            target_url = $(this).find("img").attr("src");
            target_size = $(this).find(".pro-img-size").text();
            this_div.css("cursor","default");
            $(document).bind("dragend",function(e){
                if(pic_index!=-1){
                    picture_div.find("img").eq(target_index).attr("src",image_url);
                    picture_div.find(".pro-img-size").eq(target_index).text(image_size);
                    picture_div.find(".edit-pic").eq(target_index).attr("href",'/transfer?link='+encodeURIComponent(image_url));
                    picture_div.find("img").eq(pic_index).attr("src",target_url);
                    picture_div.find(".pro-img-size").eq(pic_index).text(target_size);
                    picture_div.find(".edit-pic").eq(pic_index).attr("href",'/transfer?link='+encodeURIComponent(target_url));
                    pic_index = -1;
                    $(document).unbind("dragend");
                }
            })
        }else{
            image_url ="";
            pic_index = -1;
            if(this_div){
               this_div.css("cursor","default");
            }
        }
    });
    var load_img = $("#feed_img").find(".image"),image_length;
    var platform = $(".shop-info").find("span").eq(0).text();
    var img_length_info = {
        "AliExpress": 6,
        "AliExpress2": 6,
        "eBay": 12,
        "Amazon": 9,
        "Wish": 10,
        "Lazada": 8,
        "Joom": 10,
        "DHgate": 8,
        "Linio": 8,
        "Jumia": 8
    };
    var title_limit_info = {
        "AliExpress": 128,
        "AliExpress2": 128,
        "eBay": 80,
        "Lazada": 255,
        "Amazon": 200,
        "DHgate": 140,
        "Joom": 100
    };
    image_length = img_length_info[platform];
    var title_limit = title_limit_info[platform];
    for(var i=0;i<image_length;i++){
        var url=load_img.eq(i).attr("src");
        if (url!="/static/image/add.png"){
            images.push(url);
        }
    }
    function check_title_limit(){
        if(title_limit){
            var $this = $(this),
                al_ipt = $this.closest(".form-group").find(".already-input"),
                le_ipt = $this.closest(".form-group").find(".left-input"),
                $tl = $this.attr("id") == "sub-title" ? 55 : title_limit;
            $tl = $this.attr("id") == "short-des" ? 500 : title_limit;
            var title_length = $this.val().trim().length;
            //if(title_length > $tl){
            //    if(platform != "Amazon"){
            //        $this.val($this.val().trim().substring(0, $tl))
            //    }
            //}
            title_length = $this.val().trim().length;
            al_ipt.text(title_length);
            le_ipt.text($tl-title_length);
        }
    }
    function init_meitu(){
        $(".edit-pic").each(function(){
            var $this = $(this),
                src = $this.closest(".thumbnail").find("img").attr("src");
            if(src != "/static/image/add.png"){
                var $href = '/transfer?link='+encodeURIComponent(src);
                $this.attr({"href": $href, "target": "_blank"});
            }
        })
    }
    function category_show(){
        var btn = $(this).attr("data-this", 1),
            category_name = btn.closest("div").find(".full-category-name"),
            is_additional = btn.attr("data-category") == "additional";
        trigger_cate_btn = $(this);
        $("#category-tree").modal("show");
        if(is_additional){

        }
        $("#choose-category").on("click.a",function(){
            category_group = [];
//            if($.inArray(platform.toLowerCase(), ["amazon"]) != -1){
//                if($("#use-exist").is(":hidden")){
//                    $("#category-tree").find(".chosen").each(function(){
//                       category_group.push($(this).text());
//                    })
//                }else{
//                    category_group = $(".on").parent().attr("data-names").split(";");
//                }
//                category_name.attr("data-id", category_uid)
//                    .html(category_group.join(" &gt; "));
//            }else{
//                var cate_info = $(".selected-cate-displayer");
//                category_name.attr("data-id", cate_info.attr("data-id")).html(cate_info.text());
//            }
            var cate_info = $(".selected-cate-displayer");
            if(is_additional && $.inArray(platform, ["Linio", "Jumia"]) != -1){
                if($(".full-category-name[data-id='"+cate_info.attr("data-id")+"']").length == 0){
                    btn.before('<div class="additional-cate"><p class="full-category-name form-control-static" data-id="'+cate_info.attr("data-id")+'">'+cate_info.text()+'</p><a class="delete-add-cate" href="javascript:void(0);"><span class="glyphicon glyphicon-remove"></span></a></div>');
                    if($(".additional-cate").length > 2){
                        btn.hide();
                    }
                }
            }else{
                $("#add-cate-area").show();
                if($(".additional-cate .full-category-name[data-id='"+cate_info.attr("data-id")+"']").length != 0){
                    $(".additional-cate .full-category-name[data-id='"+cate_info.attr("data-id")+"']").parent().remove();
                }
                category_name.attr("data-id", cate_info.attr("data-id")).attr("data-root", cate_info.attr("data-root")).html(cate_info.text());
            }
            btn.removeAttr("data-this");
            $(this).off("click.a");
        });
    }
    function img_ensure(){
            var checked = $("#image-space-modal :checkbox:checked");
        var checked_num = checked.length;
        for(var i=0;i<checked_num;i++){
            var net_url = checked.closest(".col-md-2").find("img").eq(i).attr("src");
            var skupic = btn.closest("tr").find("td[data-id]").attr("data-id");
            if(btn.attr("data-self") == "sku"){
                var a_dom = $("td[data-id=\"" + skupic +"\"]").closest("tr").find("a[data-pic]").html('');
                var imgas = $("<img/>").attr("style","width:100%;height:100%").attr("src",net_url).appendTo(a_dom);
                var del_btn = $("<a/>").attr("href","javascript:void(0)").attr("data-name","del-pic")
                                .attr("style","float:right;padding:inherit").text("删除");
                            a_dom.closest("a").before(del_btn);
                $("a[data-name='del-pic']").each(function(x,y){
                    var del_btn = $(y);
                    del_btn.click(function(){
                        $(this).closest("td").find("img")
                            .closest("a").removeAttr("href").attr("href","javascript:void(0)");
                        $(this).closest("td").find("img").remove();
                        $(this).remove();
                    })
                });
            }else{
                $("#feed_img").find(".image").eq(images.length).attr("src", net_url).attr("draggable","false");
                images.push(net_url);
            }

        }
        $("#image-space-modal").modal("hide");
    }
    function modal_show(){
        btn = $(this);
        next = 0;
        if(platform == "Amazon"){
            $("#max-select").text(image_length-images.length);
        }else{
            $("#max-select").text(image_length-images.length);
        }
        $("#has-select").text(0);
        $("#img-content").html("");
        $("#image-space-modal").modal("show");
        get_img_info();
    }
    function check_img_num(){
        var has_select = $("#has-select");
        var selected_num = has_select.text();
        var max_select = $("#max-select").text();
        if (this.checked){
            if(selected_num<max_select){
                has_select.text(Number(selected_num) + 1);
            }else{
                $(this).removeAttr("checked");
            }
        }else{
            has_select.text(Number(selected_num) - 1);
        }
    }
    function get_img_info(){
        var image_content = $("#img-content");
        $("#image-space-modal").find("input[type=checkbox]").unbind("click");
        $.ajax({
            "type": "POST",
            "url": "/create/"+shop_id+"/picture/get",
            "dataType": "json",
            "data": "next="+next,
            "success":function(data){
                next = data.next;
                var picture_info = data["pictures"];
                var pic_num = picture_info.length;
                for (var i=0;i<pic_num;i++){
                    var div=$("<div/>").attr("class","col-md-2");
                    var img_html_str="<div class='thumbnail'>"
                                +"<div class='checkbox'><label>"
                                +"<input type='checkbox' class='pull-left select-pic'>"
                                +"选择图片</span></label></div>"
                                +"<img src='"+picture_info[i].Link+"' class='image img-responsive'>"
                                +"<div class='caption'>"
                                +"<div class='pic-name'>"+picture_info[i].Size
                                +" / " + picture_info[i].Length+"</div>"
                                +"</div></div>";
                    div.html(img_html_str).appendTo(image_content);
                }
                $("#image-space-modal").find("input[type=checkbox]").click(check_img_num);
                if(next>data.count||picture_info.length==0){
                    $("#load-more").prop("disabled", "true").html("没有更多了");
                }else{
                    $("#load-more").show("disabled", "false");
                }
            }
        })
    }
    function select_group() {
        $.ajax({
            "url": "/product/" + shop_id + "/category/exist",
            "type": "POST",
            "data": {},
            "dataType": "json",
            "success": function (data) {
                console.log(data);
                if (data["group_list"].length == 0) {
                    $(".group-detail").html("您的产品未设置分组");
                } else {
                    $(".group-detail").html("");
                    render_group(data["group_list"], 0);
                }
            },
            "error": function () {

            }
        })
    }
    function render_group(group_list, p_tag) {
        var gl = search_group(group_list, p_tag);
        for (var i = 0; i < gl.length; i++) {
            cate_names[gl[i].level-1] = gl[i].name;
            cate_names = cate_names.slice(0, gl[i].level);
            if (gl[i]["is_leaf"]) {
                $("<div/>").attr({
                    class: "cate",
                    "data-id": gl[i]["cid"],
                    "data-root": root_id,
                    "data-names": cate_names.join(";")
                }).css({"margin-left": (gl[i]["level"] - 1) * 26 + "px"
                }).html("<a href ='javascript: void(0)'>"+gl[i]["name"] + "(" + gl[i]["count"] + ")"+"</a>").click(function () {
                    $(".on").removeClass("on");
                    $(this).find("a").addClass("on");
                    category_uid = $(this).attr("data-id");
                    $("#choose-category").attr({"disabled": false});
                    $("#second-choose-category").attr({"disabled": false});
                }).appendTo($(".group-detail"));
            } else {
                if(gl[i].level==1){
                    root_id = gl[i].cid;
                }
                $("<div/>").attr({class: "cate", "data-id": gl[i]["cid"]}).css({
                    "margin-left": (gl[i]["level"] - 1) * 26 + "px"
                }).text(gl[i]["name"] + "(" + gl[i]["count"] + ")").appendTo($(".group-detail"));
                render_group(group_list, gl[i]["cid"]);
            }
        }
    }
    function search_group(group_list, p_tag) {
        var gl = [];
        for (var j = 0; j < group_list.length; j++) {
            if (group_list[j]["pid"] == p_tag) {
                gl.push(group_list[j]);
            }
        }
        return gl;
    }
    function choose_category(){
        var cate = $(this);
        var is_leaf = cate.attr("data-leaf") == "1";
        var level = cate.attr("data-level");
        var name = cate.find("a").text();
        var html_str = "";
        var pop_times, temp_level;
        level = parseInt(level);
        if(is_leaf){
            category_uid = cate.attr("data-id");
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
            cate.attr("class", "chosen");
            cate.siblings("li").attr("class", "");
            $("#choose-category").removeAttr("disabled");
            $("#second-choose-category").removeAttr("disabled");
        }else{
            $("#choose-category").attr("disabled","disabled");
            $("#second-choose-category").attr("disabled","disabled");
            if(!cate.hasClass("chosen")){
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
                var category_dom = $("<ul/>").attr({
                    "class": "category loading-cate",
                    "data-level": level + 1
                }).appendTo(".category-area");
                cate.attr("class", "chosen");
                cate.siblings("li").attr("class", "");
                $.ajax({
                    url: "/api/category/get",
                    type: "GET",
                    data: {
                        shop_id: shop_id,
                        parent_id: cate.attr("data-id")
                    },
                    dataType: "json",
                    success: function(data) {
                        if(data["categories"].length > 0){
                            html_str = render_category(data["categories"]);
                            category_dom.html(html_str).removeClass("loading-cate");
                            category_dom.find("li").click(choose_category);
                            search_keyup();
                        }
                    },
                    error: function(){
                        /**
                        alert("请求出错");
                        **/
                        Inform.show("请求出错");
                    }
                });
            }
        }
        function render_category(categories){
            var shop_name=$(".shop-info").find(".text").find("span")[0].innerText;
            if(shop_name == "AliExpress" || shop_name == "AliExpress2"){
                var html_str = "<div class='form-group search-div'><input type='text' class='cate-search form-control'"
                        +" placeholder='请输入名称/拼音首字母'><span class='glyphicon glyphicon-search form-control-feedback'></span></div>";
                for(var i=0;i<categories.length;i++){
                    var category = categories[i];
                    var class_name = category["leaf"] == 0 ? "has-leaf" : "no-leaf";
                        html_str += "<li class=\"" + class_name +"\" "
                            + "data-id=\"" + category["id"] + "\""
                            + "data-level=\"" + category["level"] + "\""
                            + "data-leaf=\"" + category["leaf"] + "\""
                            + "data-tag=\"" + category["tag"] + "\""
                            + "data-query=\"" + category["query"] + "\""
                            + "data-cn=\""+ category["name"] +"\""
                            + "data-en=\""+ category["pin"] +"\">"
                            + "<a href=\"javascript: void(0)\">"
                            + category["name"] +"</a></li>";
                    };
                }else{
                var html_str = "<div class='form-group search-div'><input type='text' class='cate-search form-control'"
                        +" placeholder='搜索.....'><span class='glyphicon glyphicon-search form-control-feedback'></span></div>";
                for(var i=0;i<categories.length;i++){
                    var category = categories[i];
                    var class_name = category["leaf"] == 0 ? "has-leaf" : "no-leaf";
                     html_str += "<li class=\"" + class_name +"\" "
                        + "data-id=\"" + category["id"] + "\""
                        + "data-level=\"" + category["level"] + "\""
                        + "data-leaf=\"" + category["leaf"] + "\""
                        + "data-tag=\"" + category["tag"] + "\""
                        + "data-query=\"" + category["query"] + "\""
                        + "data-cn=\"\""
                        + "data-en=\""+ category["name"] +"\">"
                        + "<a href=\"javascript: void(0)\">"
                        + category["name"] +"</a></li>";
                }
            }
            return html_str;
        }
    }
    $("#image-net").click(function(){
        var m = $("#image-net-url");
        var net_url = m.val();
        if(!net_url || net_url == ""){
            return 0;
        }
        $("#feed_img").find(".image").eq(images.length).attr("src", net_url).attr("draggable","false");
        m.val("");
        $("#image-net-collapse").collapse("hide");
        images.push(net_url);
    });
    $("#trans-control").click(function(){
        var modal = $("#trans-control-modal");
        var trans_title = $(".tr-title").prop("checked");
        var trans_desc = $(".tr-desc").prop("checked");
        var trans_spec = $(".tr-spec").prop("checked") || false;
        var trans_key = $(".tr-key").prop("checked") || false;
        var trans_point = $(".tr-point").prop("checked") || false;
        var trans_pid = $("#trans-pid").val();
        var src_lang = $("#src-lang").val() || "";
        var tar_lang = $("#tar-lang").val() || "";
        if(!src_lang){
            modal.find(".tips").text("请选择源语言!");
            return
        }
        if(!tar_lang){
            modal.find(".tips").text("请选择目标语言!");
            return
        }
        $(this).attr("disabled", false);
        modal.modal("hide");
        Inform.disable();
        Inform.show("", true, "正在提交请求...");
        var request_body = {
            "Title": trans_title,
            "Description": trans_desc,
            "Specifics": trans_spec,
            "KeyWords": trans_key,
            "BulletPoints": trans_point,
            "product_id": trans_pid,
            "src_lang": src_lang,
            "tar_lang": tar_lang
        };
        $.ajax({
            "url": "/create/" + shop_id + "/product/trans",
            "type": "POST",
            "dataType": "json",
            "data": request_body,
            "success": function(data){
                $(this).attr("disabled", true);
                console.log(data);
                if(data.status == 1){
                    Inform.enable("/product/"+shop_id+"/dealing");
                    Inform.show("翻译请求已提交");
                }else{
                    Inform.enable();
                    Inform.show("翻译请求被拒绝" + data.message);
                }
            },
            "error": function(){
                console.log("there is some error happened");
            }
        })
    });
    $("#feed_img").on("click", ".del-pic", function(){
        if($(this).closest(".thumbnail").find("img").attr("src")!="/static/image/add.png"){
            var cur_dom = $(this),
                img_area = $("#feed_img"),
                images_dom = img_area.find(".image"),
                edit_btn = img_area.find(".edit-pic");
            //if($.inArray(platform, ["Wish", "Lazada", "Linio", "Jumia", "Joom"]) == -1){
            if($.inArray(platform, ["Wish", "Lazada", "Linio", "Jumia"]) == -1){
                images = [];
                for(var i=0;i<image_length;i++){
                    var url=load_img.eq(i).attr("src");
                    if (url!="/static/image/add.png"){
                        images.push(url);
                    }
                }
                var image_index = parseInt(cur_dom.attr("data-index"));
                for(var i=image_index; i<images.length-1;i++){
                    images[i] = images[i+1];
                    images_dom.eq(i).attr("src", images[i]).attr("draggable","false").trigger("pro.img.change");
                    edit_btn.eq(i).attr("href", '/transfer?link='+encodeURIComponent(images[i]));
                }
                images_dom.eq(images.length-1).attr("src", "/static/image/add.png").attr("draggable","false").trigger("pro.img.change");
                edit_btn.eq(images.length-1).attr("href", "javascript:void(0)");
                images.splice(images.length-1, 1);
                console.log(images);
            }else{
                if(images_dom.length > 1){
                    cur_dom.closest(".img-div").remove();
                    //cur_dom.closest(".img-div").length ? cur_dom.closest(".img-div").remove(): cur_dom.closest(".col-lg-3.col-md-4.col-sm-4").remove();
                }else{
                    images_dom.eq(0).attr("src", "/static/image/add.png").attr("draggable","false").trigger("pro.img.change");
                    edit_btn.eq(0).attr("href", "javascript:void(0)");
                }
            }
        }else{
            return 0;
        }
    }).on("pro.img.change", ".image", function(){
        var img = new Image,
            _this = $(this),
            src = _this.attr("src"),
            caption = _this.next(".caption");
        if(src && src != "/static/image/add.png"){
            img.src = _this.attr("src");
            var comp = function(){
                if(caption.find(".pro-img-size").length>0){
                    caption.find(".pro-img-size").text("尺寸: {0} x {1}".format(this.width, this.height));
                }else{
                    caption.prepend('<p class="pro-img-size">'+'尺寸: {0} * {1}'.format(this.width, this.height)+'</p>');
                }
            };
            if(img.complete){
                comp.call(img);
            }else{
                img.onload = function(){comp.call(this)};
                img.onerror = function(){
                    if(caption.find(".pro-img-size").length>0){
                        caption.find(".pro-img-size").text("加载失败");
                    }else{
                        caption.prepend('<p class="pro-img-size">加载失败</p>');
                    }
                };
//                img.onabort
            }
        }else{
            caption.find(".pro-img-size").text("尺寸: 无图片");
        }
    });
    void function(){
        $("#feed_img").find("img").each(function(){
            $(this).trigger("pro.img.change")
        });
    }();
    $(".del-s-pic").click(function(){
        $("#spread-img").find(".image").attr("src", "/static/image/add.png");
        $(this).siblings("a").attr("href", "javascript:void(0)");
    });
    var base_upload_complete = function(pictures){
        var str = '';
        for(var i=0;i<pictures.length;i++) {
            var $href = '/transfer?link='+encodeURIComponent(pictures[i]);
            //if($.inArray(platform, ["Wish", "Lazada", "Linio", "Jumia", "Joom"]) == -1){
            if($.inArray(platform, ["Wish", "Lazada", "Linio", "Jumia"]) == -1){
                var this_img = $("#feed_img").find(".image").eq(images.length);
                if(this_img.length){
                    this_img.attr("src", decodeURIComponent(pictures[i])).attr("draggable","false").trigger("pro.img.change");
                    // 美图秀秀
                    this_img.closest("div").find(".edit-pic").attr({"href": $href, "target": "_blank"});
                    images.push(decodeURIComponent(pictures[i]));
                }
            }else{
                //if(platform == "Joom" && Joom_check() == i || platform == "Wish" && wish_check() == i || platform == "Lazada" && lazada_check() == i || platform == "Linio"&& lazada_check() == i || platform == "Jumia" && lazada_check() == i){
                if(platform == "Wish" && wish_check() == i || platform == "Lazada" && lazada_check() == i || platform == "Linio"&& lazada_check() == i || platform == "Jumia" && lazada_check() == i){
                    break
                }else if(i == 0 && (this_img = $("#feed_img").find(".image").eq(0)).attr("src") == "/static/image/add.png"){
                    this_img.attr("src", decodeURIComponent(pictures[i])).attr("draggable","false").trigger("pro.img.change");
                    this_img.closest("div").find(".edit-pic").attr({"href": $href, "target": "_blank"});
                }else{
                    /*if(platform == "Joom"){
                        str += '<div class="col-lg-3 col-md-4 col-sm-4">' +
                            '<div class="thumbnail" data-index="{{ i }}" draggable="true">' +
                            '<img class="image" src="' + decodeURIComponent(pictures[i]) + '" draggable="false"/>' +
                            '<div class="caption">' +
                            '<p class="pro-img-size">尺寸: 计算中</p>' +
                            '<a href="javascript:void(0)" class="btn btn-sm btn-warning del-pic" data-index="{{ i }}">删除</a> ' +
                            '<a href="' + $href + '" class="btn btn-sm btn-success edit-pic" data-index="{{ i }} target="_blank">在线美图</a>' +
                            '</div>' +
                            '</div>' +
                            '</div>';
                    }else {*/
                        str += '<div class="img-div">' +
                            '<div class="thumbnail" draggable="true">' +
                            '<img class="image" src="' + decodeURIComponent(pictures[i]) + '" draggable="false"/>' +
                            '<div class="caption caption-sm">' +
                            '<a href="javascript:void(0)" class="btn btn-warning del-pic btn-xs">删除</a> ' +
                            '<a href="' + $href + '" class="btn btn-success edit-pic btn-xs" target="_blank">在线美图</a>' +
                            '</div>' +
                            '</div>' +
                            '</div>';
                    //}
                }
            }
        }
        if(($.inArray(platform, ["Wish", "Lazada", "Linio", "Jumia", "Joom"]) != -1) && str){
            $("#feed_img").append(str).find("img").each(function(){$(this).trigger("pro.img.change");})
        }
        if(platform == "Linio" || platform == "Jumia"){
            $("#feed_img").parent().find(".error-tip").text("");
        }
    };
    var Joom_check = function(){
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
        return 20 - sum;
    };
    var wish_check = function(){
        var sum = 0;
        $(".wish-sku-pic").each(function(){
            if($(this).attr("src")) sum += 1;
        });
        $("#feed_img").find("img").each(function(){
            if($(this).attr("src") != '/static/image/add.png') sum += 1;
        });
        return 20-sum
    };
    var lazada_check = function(){
        var sum = 0;
        $("#feed_img").find("img").each(function(){
            if($(this).attr("src") != '/static/image/add.png') sum += 1;
        });
        return 8-sum
    };
    var spread_upload_complete = function(pictures){
        var this_img = $("#spread-img").find(".image");
        if(this_img.length){
             var $href = '/transfer?link='+encodeURIComponent(pictures[0]);
            this_img.attr("src", decodeURIComponent(pictures[0])).attr("draggable","false");
            this_img.closest("div").find(".edit-pic").attr({"href": $href, "target": "_blank"});
            images.push(decodeURIComponent(pictures[0]));
        }
    };
    var header = "https://www.actneed.com/img";
    //var header = "";
    var opt1ions= {
        list_style: false,
        local_picture : true,
        network_picture: true,
        hosting_picture: true,
        claim_picture: true,
        button_text:"",
        local_picture_config:{
            auto:false,
            fileTypeExts:'*.jpg;*.png;*.gif;*.jpeg',
            multi:true,
            fileObjName:'Filedata',
            fileSizeLimit:9999,
            showUploadedPercent:true,
            removeTimeout:2000,
            buttonText:'本地图片选取1',//本地上传按钮上的文字
            formData:{special:1},
            uploader:header+"/picture/upload/local",
            onUploadComplete:function(file, data){
                data = eval("("+ data +")");
                if(data["status"] == 1){
                    base_upload_complete(data["pictures"]);
                }else{
                    console.log("本地图片上传失败。")
                }
            },
            onDelete:function(file){
                console.log('删除的文件：'+file);
                console.log(file);
            },
            onUploadError: function () {
                Inform.enable();
                Inform.show("上传失败，请您稍后再试。");
            }
        },
        network_picture_config: {
            network_pic_nums : image_length,
            crawl: false,
            url: header+"/picture/upload/net",
            type: "POST",
            data: {
                special: 1
            },
            dataType: "json",
            ensure_picture_fun: base_upload_complete
        },
        hosting_picture_config: {
            space_pic_nums: image_length,
            modal_init_url : header+"/picture/group/pic",
            modal_init_type: "POST",
            show_group_pic_url : header+"/picture/group/pic",
            show_group_pic_type: "POST",
            search_pic_url : header+"/picture/search",
            search_pic_type: "POST",
            filter_pic_url : header+"/picture/filter",
            filter_pic_type: "POST",
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            data: {},
            ensure_picture_fun: base_upload_complete,
            apply_to_fun: function(){
                console.log("a++")
            },
            dataType: "json"
        },
        claim_picture_config: {
            claim_pic_nums: image_length,
            ensure_picture_fun: base_upload_complete
        }
    };
    var spread_img_option= {
        list_style: false,
        local_picture : true,
        network_picture: true,
        hosting_picture: true,
        button_text:"添加",
        local_picture_config:{
            auto:false,
            fileTypeExts:'*.jpg;*.png;*.gif;*.jpeg',
            multi:true,
            fileObjName:'Filedata',
            fileSizeLimit:9999,
            showUploadedPercent:true,
            removeTimeout:2000,
            buttonText:'本地图片选取',//本地上传按钮上的文字
            formData:{special:1},
            uploader:header+"/picture/upload/local",
            onUploadComplete:function(file, data){
                data = eval("("+data+")");
                if(data["status"] == 1){
                    spread_upload_complete(data["pictures"]);
                }
            },
            onDelete:function(file){
                console.log('删除的文件：'+file);
                console.log(file);
            },
            onUploadError: function () {
                Inform.enable();
                Inform.show("上传失败，请您稍后再试。");
            }
        },
        network_picture_config: {
            network_pic_nums : 1,
            crawl: false,
            url: header+"/picture/upload/net",
            type: "POST",
            data: {
                special: 1
            },
            dataType: "json",
            ensure_picture_fun: spread_upload_complete
        },
        hosting_picture_config: {
            space_pic_nums: 1,
            modal_init_url : header+"/picture/group/pic",
            modal_init_type: "POST",
            show_group_pic_url : header+"/picture/group/pic",
            show_group_pic_type: "POST",
            search_pic_url : header+"/picture/search",
            search_pic_type: "POST",
            filter_pic_url : header+"/picture/filter",
            filter_pic_type: "POST",
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            data: {},
            ensure_picture_fun: spread_upload_complete,
            apply_to_fun: function(){
                console.log("a++");
            },
            dataType: "json"
        }
    };
    $("#upload").uploadPictures(options);
    $("#spread-pic").uploadPictures(spread_img_option);
    function set_progress(now,max){
        var rate = parseInt(now/max*100);
        $(".progress-bar").attr({
            "aria-valuenow": now,
            "aria-valuemax": max,
            "style": "width: "+rate+"%;"
        }).text((rate>100?100:rate)+"%");
    }
    function compute_pack_size(){
        var l = parseFloat(pack_detail.eq(0).val());
        var w = parseFloat(pack_detail.eq(1).val());
        var h = parseFloat(pack_detail.eq(2).val());
        if(!l){
            pack_detail.eq(0).val(1);
            l = 1;
        }else{
            pack_detail.eq(0).val(l)
        }
        if(!w){
            pack_detail.eq(1).val(1);
            w = 1;
        }else{
            pack_detail.eq(1).val(w)
        }
        if(!h){
            pack_detail.eq(2).val(1);
            h = 1
        }else{
            pack_detail.eq(2).val(h)
        }
        $("#pac-size").text(l*w*h);
    }
    function search_keyup(){
        $(".cate-search").keyup(function(){
            $(this).closest("ul").find("li").show();
            var this_list = $(this).closest("ul");
            clear_html(this_list);
            var en_cn = "en";
            var search_str_A = $(this).val().trim().toUpperCase();
            var str_len = search_str_A.length;
            for (var j=0;j<str_len;j++){
                if(/[\u4e00-\u9fa5A-Za-z]/.test(search_str_A[j])){
                    if(/[\u4e00-\u9fa5]/.test(search_str_A[j])){
                        en_cn = "cn";
                        break
                    }
                }
            }
            if(str_len){
                this_list.find("a").each(function(n,ob){
                    var obj = $(ob);
                    var sear_tag =obj.closest("li").attr("data-"+en_cn).toUpperCase();
                    var index = sear_tag.indexOf(search_str_A);
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
    }
    function check_url(str_url){
        var re = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
        return re.test(str_url)
    }
    function goto_source(){
        var $this = $(this),
            goto_btn = $(".goto-source"),
            $url = $this.closest(".input-group").find("input").val().trim();
        if($url){
            if(check_url($url)){
                goto_btn.attr("href", $url);
                goto_btn.get(0).click();
            }else{
                Inform.enable();
                Inform.show("您输入的链接不合法");
            }
        }
    }
    function clear_html(obj){
        obj.find("a").each(function(n,o){
            o.innerHTML = o.text;
        })
    }
    function footer_bottom(){
        var bottom_height = $(document).height() - $(window).scrollTop() - $(window).height(),
                footer = $("#footer");
            if (bottom_height < 54) {
                //console.log("b===" + bottom_height);
                footer.removeClass("sub_button");
            } else {
                footer.addClass("sub_button");
                footer.find(".col-md-12").css("bottom", "3px");
        }
    }
    function get_mobile_detail(content){
        var re = /<img|<br\s*\/>|\/>/,
            src_re = /src\=\"([\S\s]+?)\"/,
            detail_list = content.split(re),
            mobile_detail = [],
            flag = "text";
        for(var i=0;i<detail_list.length;i++){
            var cur = detail_list[i];
            if(cur.trim()!=""){
                if(src_re.test(cur)){
                    var src = cur.match(src_re);
                    if(src.length>0){
                        src = src[1];
                        if(flag == "text"){
                            mobile_detail.push({
                                "col": 1,
                                "images": [src],
                                "type": "image"
                            })
                        }else if(flag == "img"){
                            mobile_detail[mobile_detail.length-1]["images"].push(src);
                        }
                        flag = "img";
                    }
                }else{
                    mobile_detail.push({
                        "content": cur,
                        "type": "text"
                    });
                    flag = "text";
                }
            }
        }
        return mobile_detail
    }
    function init_ue(){
        if(location.hostname == "www.actneed.com") document.domain = "actneed.com";
        if(platform == "Amazon"){
            window.ue_des = UE.getEditor('Description', {
                toolbars: [
                    ['fullscreen', 'source']
                ],
                initialFrameHeight: 350,
                catchRemoteImageEnable: false,
                disabledTableInTable: false,
                autoHeight: false,
                scaleEnabled: true,
                allowDivTransToP: false,
                autoFloatEnabled: false,
                maximumWords: 2000
            });
            if(ue_des){
                ue_des.ready(function(){
                    ue_des.setContent($("#detailHtml").text())
                })
            };
            window.GB = UE.getEditor('DescriptionGB', {
                toolbars: [
                    ['fullscreen', 'source']
                ],
                initialFrameHeight: 350,
                catchRemoteImageEnable: false,
                disabledTableInTable: false,
                autoHeight: false,
                scaleEnabled: true,
                allowDivTransToP: false,
                autoFloatEnabled: false,
                maximumWords: 2000
            });
            if(GB){
                GB.ready(function(){
                    GB.setContent($("#detailHtml").text())
                })
            };
            window.FR = UE.getEditor('DescriptionFR', {
                toolbars: [
                    ['fullscreen', 'source']
                ],
                initialFrameHeight: 350,
                catchRemoteImageEnable: false,
                disabledTableInTable: false,
                autoHeight: false,
                scaleEnabled: true,
                allowDivTransToP: false,
                autoFloatEnabled: false,
                maximumWords: 2000
            });
            if(FR){
                FR.ready(function(){
                    FR.setContent($("#detailHtml").text())
                })
            };
            window.DE = UE.getEditor('DescriptionDE', {
                toolbars: [
                    ['fullscreen', 'source']
                ],
                initialFrameHeight: 350,
                catchRemoteImageEnable: false,
                disabledTableInTable: false,
                autoHeight: false,
                scaleEnabled: true,
                allowDivTransToP: false,
                autoFloatEnabled: false,
                maximumWords: 2000
            });
            if(DE){
                DE.ready(function(){
                    DE.setContent($("#detailHtml").text())
                })
            };
            window.IT = UE.getEditor('DescriptionIT', {
                toolbars: [
                    ['fullscreen', 'source']
                ],
                initialFrameHeight: 350,
                catchRemoteImageEnable: false,
                disabledTableInTable: false,
                autoHeight: false,
                scaleEnabled: true,
                allowDivTransToP: false,
                autoFloatEnabled: false,
                maximumWords: 2000
            });
            if(IT){
                IT.ready(function(){
                    IT.setContent($("#detailHtml").text())
                })
            };
            window.ES = UE.getEditor('DescriptionES', {
                toolbars: [
                    ['fullscreen', 'source']
                ],
                initialFrameHeight: 350,
                catchRemoteImageEnable: false,
                disabledTableInTable: false,
                autoHeight: false,
                scaleEnabled: true,
                allowDivTransToP: false,
                autoFloatEnabled: false,
                maximumWords: 2000
            });
            if(ES){
                ES.ready(function(){
                    ES.setContent($("#detailHtml").text())
                })
            };
            window.US = UE.getEditor('DescriptionUS', {
                toolbars: [
                    ['fullscreen', 'source']
                ],
                initialFrameHeight: 350,
                catchRemoteImageEnable: false,
                disabledTableInTable: false,
                autoHeight: false,
                scaleEnabled: true,
                allowDivTransToP: false,
                autoFloatEnabled: false,
                maximumWords: 2000
            });
            if(US){
                US.ready(function(){
                    US.setContent($("#detailHtml").text())
                })
            };
            window.CA = UE.getEditor('DescriptionCA', {
                toolbars: [
                    ['fullscreen', 'source']
                ],
                initialFrameHeight: 350,
                catchRemoteImageEnable: false,
                disabledTableInTable: false,
                autoHeight: false,
                scaleEnabled: true,
                allowDivTransToP: false,
                autoFloatEnabled: false,
                maximumWords: 2000
            });
            if(CA){
                CA.ready(function(){
                    CA.setContent($("#detailHtml").text())
                })
            };
            window.MX = UE.getEditor('DescriptionMX', {
                toolbars: [
                    ['fullscreen', 'source']
                ],
                initialFrameHeight: 350,
                catchRemoteImageEnable: false,
                disabledTableInTable: false,
                autoHeight: false,
                scaleEnabled: true,
                allowDivTransToP: false,
                autoFloatEnabled: false,
                maximumWords: 2000
            });
            if(MX){
                MX.ready(function(){
                    MX.setContent($("#detailHtml").text())
                })
            };
            window.JP = UE.getEditor('DescriptionJP', {
                toolbars: [
                    ['fullscreen', 'source']
                ],
                initialFrameHeight: 350,
                catchRemoteImageEnable: false,
                disabledTableInTable: false,
                autoHeight: false,
                scaleEnabled: true,
                allowDivTransToP: false,
                autoFloatEnabled: false,
                maximumWords: 2000
            });
            if(JP){
                JP.ready(function(){
                    JP.setContent($("#detailHtml").text())
                })
            };
            window.AU = UE.getEditor('DescriptionAU', {
                toolbars: [
                    ['fullscreen', 'source']
                ],
                initialFrameHeight: 350,
                catchRemoteImageEnable: false,
                disabledTableInTable: false,
                autoHeight: false,
                scaleEnabled: true,
                allowDivTransToP: false,
                autoFloatEnabled: false,
                maximumWords: 2000
            });
            if(AU){
                AU.ready(function(){
                    AU.setContent($("#detailHtml").text())
                })
            };
            window.IN = UE.getEditor('DescriptionIN', {
                toolbars: [
                    ['fullscreen', 'source']
                ],
                initialFrameHeight: 350,
                catchRemoteImageEnable: false,
                disabledTableInTable: false,
                autoHeight: false,
                scaleEnabled: true,
                allowDivTransToP: false,
                autoFloatEnabled: false,
                maximumWords: 2000
            });
            if(IN){
                IN.ready(function(){
                    IN.setContent($("#detailHtml").text())
                })
            };
        }else if($.inArray(platform, ["Wish", "Joom"]) == -1){
            UE.registerUI('pic-space', function (editor, uiName) {
                //注册按钮执行时的command命令，使用命令默认就会带有回退操作
                editor.registerCommand(uiName, {
                    execCommand: function () {
                        alert('execCommand:' + uiName)
                    }
                });
                //创建一个button
                var btn = new UE.ui.Button({
                    //按钮的名字
                    name: uiName,
                    //提示
                    title: "图片空间",
                    //添加额外样式，指定icon图标，这里默认使用一个重复的icon
                    cssRules: 'background-position: -15px -1248px;width: 52px !important;background-image:url(../../static/image/editor_custom.png) !important',
                    //点击时执行的命令
                    onclick: function () {
                        $("#shadow-btn").trigger("click");
                        window.current_editor = editor;
                    }
                });
                //当点到编辑内容上时，按钮要做的状态反射
                editor.addListener('selectionchange', function () {
                    var state = editor.queryCommandState(uiName);
                    if (state == -1) {
                        btn.setDisabled(true);
                        btn.setChecked(false);
                    } else {
                        btn.setDisabled(false);
                        btn.setChecked(state);
                    }
                });
                //因为你是添加button,所以需要返回这个button
                return btn;
            }, 25, 'Description');
            UE.registerUI('add-template', function (editor, uiName) {
                //注册按钮执行时的command命令，使用命令默认就会带有回退操作
                editor.registerCommand(uiName, {
                    execCommand: function () {
                        alert('execCommand:' + uiName)
                    }
                });
                //创建一个button
                var btn = new UE.ui.Button({
                    //按钮的名字
                    name: uiName,
                    //提示
                    title: "选取模板",
                    //添加额外样式，指定icon图标，这里默认使用一个重复的icon
                    cssRules: 'background-position: -15px -1266.5px;width: 52px !important;background-image:url(../../static/image/editor_custom.png) !important',
                    //点击时执行的命令
                    onclick: function () {
                        window.current_editor = editor;
                        $("#info-template-new").modal("show");
                    }
                });
                //当点到编辑内容上时，按钮要做的状态反射
                editor.addListener('selectionchange', function () {
                    var state = editor.queryCommandState(uiName);
                    if (state == -1) {
                        btn.setDisabled(true);
                        btn.setChecked(false);
                    } else {
                        btn.setDisabled(false);
                        btn.setChecked(state);
                    }
                });
                //因为你是添加button,所以需要返回这个button
                return btn;
            }, 27, 'Description');
            UE.registerUI('pic-claim', function (editor, uiName) {
                //注册按钮执行时的command命令，使用命令默认就会带有回退操作
                editor.registerCommand(uiName, {
                    execCommand: function () {
                        alert('execCommand:' + uiName)
                    }
                });
                //创建一个button
                var btn = new UE.ui.Button({
                    //按钮的名字
                    name: uiName,
                    //提示
                    title: "采集图片",
                    //添加额外样式，指定icon图标，这里默认使用一个重复的icon
                    cssRules: 'background-position: -16px -1231px;width: 50px !important;background-image:url(../../static/image/editor_custom.png) !important',
                    //点击时执行的命令
                    onclick: function () {
                        $("#shadow-btn2").trigger("click");
                        window.current_editor = editor;
                    }
                });
                //当点到编辑内容上时，按钮要做的状态反射
                editor.addListener('selectionchange', function () {
                    var state = editor.queryCommandState(uiName);
                    if (state == -1) {
                        btn.setDisabled(true);
                        btn.setChecked(false);
                    } else {
                        btn.setDisabled(false);
                        btn.setChecked(state);
                    }
                });
                //因为你是添加button,所以需要返回这个button
                return btn;
            }, 29, 'Description');
            UE.registerUI('pic-net', function (editor, uiName) {
                //注册按钮执行时的command命令，使用命令默认就会带有回退操作
                editor.registerCommand(uiName, {
                    execCommand: function () {
                        alert('execCommand:' + uiName)
                    }
                });
                //创建一个button
                var btn = new UE.ui.Button({
                    //按钮的名字
                    name: uiName,
                    //提示
                    title: "网络图片",
                    //添加额外样式，指定icon图标，这里默认使用一个重复的icon
                    cssRules: 'background-position: -16px -1214px;width: 50px !important;background-image:url(../../static/image/editor_custom.png) !important',
                    //点击时执行的命令
                    onclick: function () {
                        $("#shadow-btn3").trigger("click");
                        window.current_editor = editor;
                    }
                });
                //当点到编辑内容上时，按钮要做的状态反射
                editor.addListener('selectionchange', function () {
                    var state = editor.queryCommandState(uiName);
                    if (state == -1) {
                        btn.setDisabled(true);
                        btn.setChecked(false);
                    } else {
                        btn.setDisabled(false);
                        btn.setChecked(state);
                    }
                });
                //因为你是添加button,所以需要返回这个button
                return btn;
            }, 31, 'Description');
            UE.registerUI('pic-space-mobile', function (editor, uiName) {
                //注册按钮执行时的command命令，使用命令默认就会带有回退操作
                editor.registerCommand(uiName, {
                    execCommand: function () {
                        alert('execCommand:' + uiName)
                    }
                });
                //创建一个button
                var btn = new UE.ui.Button({
                    //按钮的名字
                    name: uiName,
                    //提示
                    title: "图片空间",
                    //添加额外样式，指定icon图标，这里默认使用一个重复的icon
                    cssRules: 'background-position: -15px -1248px;width: 52px !important;background-image:url(../../static/image/editor_custom.png) !important',
                    //点击时执行的命令
                    onclick: function () {
                        $("#shadow-btn").trigger("click");
                        window.current_editor = editor;
                    }
                });
                //当点到编辑内容上时，按钮要做的状态反射
                editor.addListener('selectionchange', function () {
                    var state = editor.queryCommandState(uiName);
                    if (state == -1) {
                        btn.setDisabled(true);
                        btn.setChecked(false);
                    } else {
                        btn.setDisabled(false);
                        btn.setChecked(state);
                    }
                });
                //因为你是添加button,所以需要返回这个button
                return btn;
            }, 7, 'mobileDes');
            UE.registerUI('add-img-link', function(editor, uiName) {
                editor.registerCommand(uiName, {
                    execCommand: function () {
                        alert('execCommand:' + uiName)
                    }
                });
                //创建一个button
                var btn = new UE.ui.Button({
                    //按钮的名字
                    name: uiName,
                    //提示
                    title: "设置图片链接",
                    //添加额外样式，指定icon图标，这里默认使用一个重复的icon
                    cssRules: 'background-position: -500px 0;width: 20px !important;background-image:url(../../static/js/ueditor/themes/default/images/icons.png) !important',
                    //点击时执行的命令
                    onclick: function () {
                        window.current_editor = editor;
                        var mobile_detail = get_mobile_detail(editor.getContent()),
                            modal = $("#appLink-modal"),
                            modal_body = modal.find(".modal-body").empty(),
                            flag = false;
                        for(var i=0;i<mobile_detail.length;i++){
                            var cur = mobile_detail[i];
                            if(cur["type"] == "image"){
                                flag = true;
                                for(var j=0;j<cur["images"].length;j++){
                                    var $img = cur["images"][j],
                                        $link = link_map[$img] ? link_map[$img] : "";
                                    modal_body.append('<div class="app-link-inline"><div><img src="'+$img+'"></div><input class="form-control" value="'+$link+'" placeholder="设置图片的产品链接，没有请留空"></div>');
                                }
                            }
                        }
                        if(!flag) modal_body.append('您尚未添加图片');
                        modal.modal("show");
                    }
                });
                //当点到编辑内容上时，按钮要做的状态反射
                editor.addListener('selectionchange', function () {
                    var state = editor.queryCommandState(uiName);
                    if (state == -1) {
                        btn.setDisabled(true);
                        btn.setChecked(false);
                    } else {
                        btn.setDisabled(false);
                        btn.setChecked(state);
                    }
                });
                //因为你是添加button,所以需要返回这个button
                return btn;
            }, 9, 'mobileDes');
            UE.registerUI('generate-mobile-des', function(editor, uiName) {
                editor.registerCommand(uiName, {
                    execCommand: function () {
                        alert('execCommand:' + uiName)
                    }
                });
                //创建一个button
                var btn = new UE.ui.Button({
                    //按钮的名字
                    name: uiName,
                    //提示
                    title: "一键生成详情",
                    //添加额外样式，指定icon图标，这里默认使用一个重复的icon
                    cssRules: 'background-position: -560px 0;width: 20px !important;background-image:url(../../static/js/ueditor/themes/default/images/icons.png) !important',
                    //点击时执行的命令
                    onclick: function () {
                        window.current_editor = editor;
                        try
                        {
                            var str = ue_des.getContent().trim();
                            if(str){
                                str = ('<p>'+str.replace(/<(?!img).*?>/g, '<br/>')
                                    .replace(/<img((?!>).)+class=\"actneed-temp\"((?!>).)+>/g, "")
                                    .replace(/<img[\s\S]+?>/g, function(a){return '<br/>'+a+'<br/>'})
                                    .replace(/(<br\/>)+/g, "<br\/>").split(/<br\/>/).join('</p><p>')+'</p>')
                                    .replace(/<p><\/p>/g, '');
                                current_editor.setContent(str)
                            }
                        }
                        catch(e)
                        {
                            Inform.enable();
                            Inform.show("请稍后再试");
                        }

                    }
                });
                //当点到编辑内容上时，按钮要做的状态反射
                editor.addListener('selectionchange', function () {
                    var state = editor.queryCommandState(uiName);
                    if (state == -1) {
                        btn.setDisabled(true);
                        btn.setChecked(false);
                    } else {
                        btn.setDisabled(false);
                        btn.setChecked(state);
                    }
                });
                //因为你是添加button,所以需要返回这个button
                return btn;
            }, 11, 'mobileDes');
            UE.registerUI('preview-mobile', function(editor, uiName) {
                editor.registerCommand(uiName, {
                    execCommand: function () {
                        alert('execCommand:' + uiName)
                    }
                });
                //创建一个button
                var btn = new UE.ui.Button({
                    //按钮的名字
                    name: uiName,
                    //提示
                    title: "预览",
                    //添加额外样式，指定icon图标，这里默认使用一个重复的icon
                    cssRules: 'background-position: -420px -20px;width: 20px !important;background-image:url(../../static/js/ueditor/themes/default/images/icons.png) !important',
                    //点击时执行的命令
                    onclick: function () {
                        window.current_editor = editor;
                        var mobile_detail = get_mobile_detail(editor.getContent()),
                            mb_content = $(".mb-detail").empty(),
                            modal = $("#mb-preview");
                        for(var i=0;i<mobile_detail.length;i++){
                            var cur = mobile_detail[i];
                            if(cur["type"] == "text"){
                                mb_content.append('<p>'+cur["content"]+'</p>');
                            }else if(cur["type"] == "image"){
                                for(var j=0;j<cur["images"].length;j++){
                                    mb_content.append('<img src="'+cur["images"][j]+'"/>')
                                }
                            }
                        }
                        modal.show();
                    }
                });
                //当点到编辑内容上时，按钮要做的状态反射
                editor.addListener('selectionchange', function () {
                    var state = editor.queryCommandState(uiName);
                    if (state == -1) {
                        btn.setDisabled(true);
                        btn.setChecked(false);
                    } else {
                        btn.setDisabled(false);
                        btn.setChecked(state);
                    }
                });
                //因为你是添加button,所以需要返回这个button
                return btn;
            }, 13, 'mobileDes');
            UE.registerUI('pic-claim-mobile', function (editor, uiName) {
                //注册按钮执行时的command命令，使用命令默认就会带有回退操作
                editor.registerCommand(uiName, {
                    execCommand: function () {
                        alert('execCommand:' + uiName)
                    }
                });
                //创建一个button
                var btn = new UE.ui.Button({
                    //按钮的名字
                    name: uiName,
                    //提示
                    title: "采集图片",
                    //添加额外样式，指定icon图标，这里默认使用一个重复的icon
                    cssRules: 'background-position: -16px -1231px;width: 50px !important;background-image:url(../../static/image/editor_custom.png) !important',
                    //点击时执行的命令
                    onclick: function () {
                        $("#shadow-btn2").trigger("click");
                        window.current_editor = editor;
                    }
                });
                //当点到编辑内容上时，按钮要做的状态反射
                editor.addListener('selectionchange', function () {
                    var state = editor.queryCommandState(uiName);
                    if (state == -1) {
                        btn.setDisabled(true);
                        btn.setChecked(false);
                    } else {
                        btn.setDisabled(false);
                        btn.setChecked(state);
                    }
                });
                //因为你是添加button,所以需要返回这个button
                return btn;
            }, 15, 'mobileDes');
            UE.registerUI('pic-net-mobile', function (editor, uiName) {
                //注册按钮执行时的command命令，使用命令默认就会带有回退操作
                editor.registerCommand(uiName, {
                    execCommand: function () {
                        alert('execCommand:' + uiName)
                    }
                });
                //创建一个button
                var btn = new UE.ui.Button({
                    //按钮的名字
                    name: uiName,
                    //提示
                    title: "网络图片",
                    //添加额外样式，指定icon图标，这里默认使用一个重复的icon
                    cssRules: 'background-position: -16px -1214px;width: 50px !important;background-image:url(../../static/image/editor_custom.png) !important',
                    //点击时执行的命令
                    onclick: function () {
                        $("#shadow-btn3").trigger("click");
                        window.current_editor = editor;
                    }
                });
                //当点到编辑内容上时，按钮要做的状态反射
                editor.addListener('selectionchange', function () {
                    var state = editor.queryCommandState(uiName);
                    if (state == -1) {
                        btn.setDisabled(true);
                        btn.setChecked(false);
                    } else {
                        btn.setDisabled(false);
                        btn.setChecked(state);
                    }
                });
                //因为你是添加button,所以需要返回这个button
                return btn;
            }, 17, 'mobileDes');
            UE.registerUI('pic-space-highlight', function (editor, uiName) {
                //注册按钮执行时的command命令，使用命令默认就会带有回退操作
                editor.registerCommand(uiName, {
                    execCommand: function () {
                        alert('execCommand:' + uiName)
                    }
                });
                //创建一个button
                var btn = new UE.ui.Button({
                    //按钮的名字
                    name: uiName,
                    //提示
                    title: "图片空间",
                    //添加额外样式，指定icon图标，这里默认使用一个重复的icon
                    cssRules: 'background-position: -15px -1248px;width: 52px !important;background-image:url(../../static/image/editor_custom.png) !important',
                    //点击时执行的命令
                    onclick: function () {
                        $("#shadow-btn").trigger("click");
                        window.current_editor = editor;
//                        if(arguments[1]){
//                            var e = arguments[1];
//                            e.stopPropagation();
//                        }
                    }
                });
                //当点到编辑内容上时，按钮要做的状态反射
                editor.addListener('selectionchange', function () {
                    var state = editor.queryCommandState(uiName);
                    if (state == -1) {
                        btn.setDisabled(true);
                        btn.setChecked(false);
                    } else {
                        btn.setDisabled(false);
                        btn.setChecked(state);
                    }
                });
                //因为你是添加button,所以需要返回这个button
                return btn;
            }, 25, 'hlDes');
            UE.registerUI('pic-claim-highlight', function (editor, uiName) {
                //注册按钮执行时的command命令，使用命令默认就会带有回退操作
                editor.registerCommand(uiName, {
                    execCommand: function () {
                        alert('execCommand:' + uiName)
                    }
                });
                //创建一个button
                var btn = new UE.ui.Button({
                    //按钮的名字
                    name: uiName,
                    //提示
                    title: "采集图片",
                    //添加额外样式，指定icon图标，这里默认使用一个重复的icon
                    cssRules: 'background-position: -16px -1231px;width: 50px !important;background-image:url(../../static/image/editor_custom.png) !important',
                    //点击时执行的命令
                    onclick: function () {
                        $("#shadow-btn2").trigger("click");
                        window.current_editor = editor;
//                        if(arguments[1]){
//                            var e = arguments[1];
//                            e.stopPropagation();
//                        }
                    }
                });
                //当点到编辑内容上时，按钮要做的状态反射
                editor.addListener('selectionchange', function () {
                    var state = editor.queryCommandState(uiName);
                    if (state == -1) {
                        btn.setDisabled(true);
                        btn.setChecked(false);
                    } else {
                        btn.setDisabled(false);
                        btn.setChecked(state);
                    }
                });
                //因为你是添加button,所以需要返回这个button
                return btn;
            }, 27, 'hlDes');
            UE.registerUI('pic-net-highlight', function (editor, uiName) {
                //注册按钮执行时的command命令，使用命令默认就会带有回退操作
                editor.registerCommand(uiName, {
                    execCommand: function () {
                        alert('execCommand:' + uiName)
                    }
                });
                //创建一个button
                var btn = new UE.ui.Button({
                    //按钮的名字
                    name: uiName,
                    //提示
                    title: "网络图片",
                    //添加额外样式，指定icon图标，这里默认使用一个重复的icon
                    cssRules: 'background-position: -16px -1214px;width: 50px !important;background-image:url(../../static/image/editor_custom.png) !important',
                    //点击时执行的命令
                    onclick: function () {
                        $("#shadow-btn3").trigger("click");
                        window.current_editor = editor;
                    }
                });
                //当点到编辑内容上时，按钮要做的状态反射
                editor.addListener('selectionchange', function () {
                    var state = editor.queryCommandState(uiName);
                    if (state == -1) {
                        btn.setDisabled(true);
                        btn.setChecked(false);
                    } else {
                        btn.setDisabled(false);
                        btn.setChecked(state);
                    }
                });
                //因为你是添加button,所以需要返回这个button
                return btn;
            }, 29, 'hlDes');
            window.ue_des = UE.getEditor('Description', {
                toolbars: [
                    ['fullscreen', 'source', 'undo', 'redo'],
                    [
                        'bold', 'italic', 'underline', '|',
                        'forecolor', 'backcolor', '|',
                        'justifyleft', 'justifyright', 'justifycenter', 'justifyjustify', '|',
                        'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|',
                        'fontfamily', 'fontsize', 'paragraph'
                    ],
                    [
                        'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
                        'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', '|',
                        'link', 'unlink', '|',
                        'simpleupload', 'insertimage', '|', '|', "|", "|"
                    ]
                ],
                initialFrameHeight: 350,
                catchRemoteImageEnable: false,
                disabledTableInTable:false,
                autoHeight: false,
                scaleEnabled: true,
                allowDivTransToP: false,
                autoFloatEnabled: false,
                maximumWords: platform == "Linio" ? 25000 : 10000
            });
            if(platform == "Linio" || platform == "Jumia"){
                window.ue_short = UE.getEditor('shortDes', {
                    toolbars: [
                        ['fullscreen', 'source', 'undo', 'redo'],
                        [
                            'bold', 'italic', 'underline', '|',
                            'forecolor', 'backcolor', '|',
                            'justifyleft', 'justifyright', 'justifycenter', 'justifyjustify', '|',
                            'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|',
                            'fontfamily', 'fontsize', 'paragraph'
                        ],
                        [
                            'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
                            'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', '|',
                            'link', 'unlink', '|',
                            'simpleupload', 'insertimage'
                        ]
                    ],
                    initialFrameHeight: 300,
                    catchRemoteImageEnable: false,
                    disabledTableInTable:false,
                    autoHeight: false,
                    scaleEnabled: true,
                    allowDivTransToP: false,
                    autoFloatEnabled: false
                });
                window.ue_warranty = UE.getEditor('warrantyEditor', {
                    toolbars: [
                        ['fullscreen', 'source', 'undo', 'redo'],
                        [
                            'bold', 'italic', 'underline', '|',
                            'forecolor', 'backcolor', '|',
                            'justifyleft', 'justifyright', 'justifycenter', 'justifyjustify', '|',
                            'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|',
                            'fontfamily', 'fontsize', 'paragraph'
                        ],
                        [
                            'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
                            'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', '|',
                            'link', 'unlink', '|',
                            'simpleupload', 'insertimage'
                        ]
                    ],
                    initialFrameHeight: 300,
                    catchRemoteImageEnable: false,
                    disabledTableInTable:false,
                    autoHeight: false,
                    scaleEnabled: true,
                    allowDivTransToP: false,
                    autoFloatEnabled: false
                });
                window.ue_box = UE.getEditor('boxEditor', {
                    toolbars: [
                        ['fullscreen', 'source', 'undo', 'redo'],
                        [
                            'bold', 'italic', 'underline', '|',
                            'forecolor', 'backcolor', '|',
                            'justifyleft', 'justifyright', 'justifycenter', 'justifyjustify', '|',
                            'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|',
                            'fontfamily', 'fontsize', 'paragraph'
                        ],
                        [
                            'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
                            'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', '|',
                            'link', 'unlink', '|',
                            'simpleupload', 'insertimage'
                        ]
                    ],
                    initialFrameHeight: 300,
                    catchRemoteImageEnable: false,
                    disabledTableInTable:false,
                    autoHeight: false,
                    scaleEnabled: true,
                    allowDivTransToP: false,
                    autoFloatEnabled: false
                });
                var short_detail = $("#shortHtml").text() || "";
                ue_short.ready(function(){
                    ue_short.execCommand('insertunorderedlist','disc');
                    ue_short.setContent(short_detail);
                });
                var warranty_detail = $("#warrantyHtml").text();
                if(warranty_detail){
                    ue_warranty.ready(function(){
                        ue_warranty.setContent(warranty_detail);
                    })
                }
                var box_detail = $("#boxHtml").text();
                if(box_detail){
                    ue_box.ready(function(){
                        ue_box.setContent(box_detail);
                    })
                }
            }
            if(platform == "Lazada"){
                window.ue_highlight = UE.getEditor('hlDes', {
                    toolbars: [
                        ['fullscreen', 'source', 'undo', 'redo'],
                        [
                            'bold', 'italic', 'underline', '|',
                            'forecolor', 'backcolor', '|',
                            'justifyleft', 'justifyright', 'justifycenter', 'justifyjustify', '|',
                            'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|',
                            'fontfamily', 'fontsize', 'paragraph'
                        ],
                        [
                            'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
                            'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', '|',
                            'link', 'unlink', '|',
                            'simpleupload', 'insertimage', '|', "|", "|"
                        ]
                    ],
                    initialFrameHeight: 350,
                    catchRemoteImageEnable: false,
                    disabledTableInTable:false,
                    autoHeight: false,
                    scaleEnabled: true,
                    allowDivTransToP: false,
                    autoFloatEnabled: false
                });
                var highlight_detail = $("#hlHtml").text();
                if(highlight_detail){
                    ue_highlight.ready(function(){
                        ue_highlight.setContent(highlight_detail);
                    })
                }
            }
            if(platform === "AliExpress" || platform === "AliExpress2"){
                window.ue_mobile = UE.getEditor('mobileDes', {
                    toolbars: [
                        ['fullscreen', 'undo', 'redo', '|', 'simpleupload', 'insertimage', '|', '|', '|', '|', "|", "|"]
                    ],
                    initialFrameHeight: 350,
                    catchRemoteImageEnable: false,
                    disabledTableInTable:false,
                    autoHeight: false,
                    scaleEnabled: true,
                    allowDivTransToP: false,
                    autoFloatEnabled: false
                });
                var mobile_detail = $("#mobile-detailHtml").text(),
                    str = '';
                mobile_detail = eval("("+mobile_detail+")");
                mobile_detail = mobile_detail["mobileDetail"] || [];
                for(var i=0;i<mobile_detail.length;i++){
                    var cur = mobile_detail[i];
                    if(cur["type"] == "text"){
                        str += cur["content"]+'<br />'
                    }else if(cur["type"] == "image"){
                        for(var j=0;j<cur["images"].length;j++){
                            str += '<img src="'+cur["images"][j]["imgUrl"]+'" /><br />';
                            link_map[cur["images"][j]["imgUrl"]] = cur["images"][j]["targetUrl"];
                        }
                    }
                }
                ue_mobile.ready(function(){
                    ue_mobile.setContent(str);
                });
                window.ue_lang = UE.getEditor('lang-des', {
                    toolbars: [
                        ['source', 'undo', 'redo'],
                        [
                            'bold', 'italic', 'underline', '|',
                            'forecolor', 'backcolor', '|',
                            'justifyleft', 'justifyright', 'justifycenter', 'justifyjustify', '|',
                            'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|',
                            'fontfamily', 'fontsize', 'paragraph'
                        ],
                        [
                            'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
                            'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', '|',
                            'link', 'unlink', '|',
                            'simpleupload', 'insertimage'
                        ]
                    ],
                    initialFrameHeight: 200,
                    catchRemoteImageEnable: false,
                    disabledTableInTable:false,
                    autoHeight: false,
                    scaleEnabled: true,
                    allowDivTransToP: false,
                    autoFloatEnabled: false
                });
                window.ue_lang_mobile = UE.getEditor('lang-mobile-des', {
                    toolbars: [
                        ['undo', 'redo', '|', 'simpleupload', 'insertimage']
                    ],
                    initialFrameHeight: 200,
                    catchRemoteImageEnable: false,
                    disabledTableInTable:false,
                    autoHeight: false,
                    scaleEnabled: true,
                    allowDivTransToP: false,
                    autoFloatEnabled: false
                });
            }
            var cache = $("#detailHtml"),
                detail = cache.text(),
                mem = $("<div/>");
            if(detail){
                mem.html(detail);
                mem.find("[data-widget-type]").each(function (k, v) {
                    var vv = $(v);
                    var src_str = "https://www.actneed.com/static/image/{0}?id={1}&ti={2}&ty={3}";
                    src_str = src_str.format(
                        vv.attr("type") == "custom" || vv.attr("type") == "description" ? "widget1.png" : "widget2.png",
                        vv.attr("id"), vv.attr("title"), vv.attr("type"));
                    var image_url = "<img src=\"" + src_str + "\" class=\"actneed-temp\" />";
                    var origin_str = '<kse:widget data-widget-type="{0}" id="{1}" title="{2}" type="{3}"></kse:widget>';
                    origin_str = origin_str.format(
                        vv.attr("type") == "custom" || vv.attr("type") == "description" ? "customText" : "relatedProduct",
                        vv.attr("id"), vv.attr("title"), vv.attr("type"));
                    detail = detail.replace(origin_str, image_url);
                });
                if(ue_des){
                    ue_des.ready(function(){
                        ue_des.setContent(detail)
                    })
                }
            }
        }
        var header = "https://www.actneed.com/img",
            hosting_picture_config = {
                space_pic_nums: 12,
                modal_init_url: header + "/picture/group/pic",
                modal_init_type: "POST",
                show_group_pic_url: header + "/picture/group/pic",
                show_group_pic_type: "POST",
                search_pic_url: header + "/picture/search",
                search_pic_type: "POST",
                filter_pic_url: header + "/picture/filter",
                filter_pic_type: "POST",
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                data: {},
                ensure_picture_fun: function (picture, modal_trigger) {
                    picture = picture || [];
                    var pic_str = "";
                    for (var i = 0; i < picture.length; i++) {
                        pic_str += '<img src=' + picture[i] + '>';
                    }
                    if (window.current_editor) {
                        window.current_editor.execCommand('inserthtml', pic_str);
                    }
                },
                apply_to_fun: function () {
                    console.log("a++");
                },
                dataType: "json"
            },
            network_picture_config = {
                space_pic_nums : 12,
                crawl: false,
                ensure_picture_fun: function (picture, modal_trigger) {
                    picture = picture || [];
                    var pic_str = "";
                    for (var i = 0; i < picture.length; i++) {
                        pic_str += '<img src=' + picture[i] + '>';
                    }
                    if (window.current_editor) {
                        window.current_editor.execCommand('inserthtml', pic_str);
                    }
                },
                apply_to_fun: function () {
                    console.log("a++");
                }
            };
        $("#shadow-btn").selectHostingPic(hosting_picture_config);
        $("#shadow-btn2").selectClaimPic({
            ensure_picture_fun: function (picture) {
                picture = picture || [];
                var pic_str = "";
                for (var i = 0; i < picture.length; i++) {
                    pic_str += '<img src=' + picture[i] + '>';
                }
                if (window.current_editor) {
                    window.current_editor.execCommand('inserthtml', pic_str);
                }
            }
        });
        $("#shadow-btn3").selectNetworkPic(network_picture_config);
    }
    init_ue();
    $(window).scroll(footer_bottom);
});
function meitu_callback(old, url){
    if(typeof url == "string" && url != ""){
        if(old.indexOf('proxy.actneed.com') !== -1){
            old = old.replace('proxy.actneed.com/','')
        }else if(old.indexOf('agent.actneed.com') !== -1){
            old = old.replace('agent.actneed.com/','')
        }
        var change_img = $("img[src='"+old+"']");
        if(change_img.length>0){
            var $href = '/transfer?link='+encodeURIComponent(url);
            change_img.closest("div").find(".edit-pic").attr({"href": $href});
            change_img.attr("src", url).trigger("pro.img.change");
        }else{

        }
    }
}
function ue_callback(old, url, ue_id){
    if(ue_id){
        var cur = UE.getEditor2(ue_id);
        cur.ready(function(){
            var content = cur.getContent();
            cur.setContent(content.replace(old, url))
        })
    }
}