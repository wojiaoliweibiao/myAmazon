/**
 * Created by xuhe on 15/6/2.
 */
var Inform = {
    init: function(){
        Inform.inform = $("#global-inform");
        Inform.header = Inform.inform.find(".md-header");
        Inform.body = Inform.inform.find(".md-body");
        Inform.panel = Inform.inform.find(".md-panel");
        Inform.loading = Inform.inform.find(".md-loading");
        Inform.l_text = Inform.inform.find(".md-loading-text");
        Inform.footer = Inform.inform.find(".md-footer");
        Inform.close = Inform.inform.find(".close-inform");
        Inform.close.click(Inform.hide);
        Inform.header.html("系统通知");
    },
    show: function(content, loading, load_text, header){
        if(header)
            Inform.header.html(header);
        if(!loading) {
            Inform.loading.css({"display": "none"});
            Inform.panel.css({"display": "block"});
            Inform.panel.html(content);
        }else{
            Inform.loading.css({"display": "block"});
            Inform.panel.css({"display": "none"});
            Inform.l_text.html(load_text);
        }
        Inform.inform.attr({"class": "md-modal md-effect-1 md-show"});
    },
    hide: function(){
        Inform.inform.removeClass("md-show");
        if(Inform.location_url){
            setTimeout(function(){
                location.href = Inform.location_url;
            }, 500);
        }
    },
    enable: function(url, reload){
        if(reload){
            Inform.close.click(function(){
                location.reload();
            });
        }
        Inform.location_url = url;
        Inform.footer.css({"display": "block"});
        Inform.close.prop("disabled", false).click(Inform.hide);
        return Inform
    },
    disable: function(){
        Inform.footer.css({"display": "none"});
        Inform.close.unbind().prop("disabled", true);
    },
    empty: function(){
        Inform.header.html("");
        Inform.body.html("");
    }
};
var Tip = (function(){
    var color_map = {
        "success": "rgba(223,240,216,{0})",
        "warning": "rgba(252,248,227,{0})",
        "info": "rgba(217,237,247,{0})",
        "danger": "rgba(242,222,222,{0})"
    };
    function create_dom (type, text, o){
        return $("<div>", {
            "class": "alert alert-{0} ware-tip".format(type),
            "role": "alert",
            "style": "background-color:"+color_map[type].format(o||0.7)
        }).html(text).prepend('<button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>');
    }
    function show_dom(dom ,fn, time){
        if(typeof time == "function"){
            fn = time;
            time = ""
        }
        dom.appendTo($("body")).fadeIn(300).delay(time||1500).fadeOut(500, function(){
            $(this).remove();
            if(fn && (typeof(fn)=="function")) fn();
        });
    }
    function success(text, time, fn, ext){
        if(!isNaN(text)&&parseFloat(text)<=1){
            var dom = create_dom("success", time, text);
            success(time, fn, ext, dom);
            return
        }
        if (typeof ext != "object") ext = create_dom("success", text);
        show_dom(ext,fn, time)
    }
    function info(text, time, fn, ext){
         if(!isNaN(text)&&parseFloat(text)<=1){
            var dom = create_dom("info", time, text);
            info(time, fn, ext, dom);
            return
        }
        if (typeof ext != "object") ext = create_dom("info", text);
        show_dom(ext,fn, time)
    }
    function danger(text, time, fn, ext){
         if(!isNaN(text)&&parseFloat(text)<=1){
            var dom = create_dom("danger", time, text);
            danger(time, fn, ext, dom);
            return
        }
        if (typeof ext != "object") ext = create_dom("danger", text);
        show_dom(ext,fn, time)
    }
    function warning(text, time, fn, ext){
         if(!isNaN(text)&&parseFloat(text)<=1){
            var dom = create_dom("warning", time, text);
            warning(time, fn, ext, dom);
            return
        }
        if (typeof ext != "object") ext = create_dom("warning", text);
        show_dom(ext,fn, time)
    }
    return {
        "success": success,
        "info": info,
        "danger": danger,
        "warning": warning
    }
})();
var SelectTip = (function(){
    function create_dom (title, body){
        var modal = $("#st-modal");
        if (modal.length == 1){
            modal.find(".modal-body").empty().append(body);
            modal.find(".modal-title").text(title);
            return modal
        } else
            return $("<div>", {"class": "modal fade in", "tabindex": "-1", "role": "dialog", "aria-labelledby": "templateLabel", "aria-hidden": "false", "id": "st-modal"})
                .append($("<div>", {"class": "modal-dialog modal-lg"}).append($("<div>", {"class": "modal-content", "style": "overflow: hidden; position: relative"}).append(
                    $("<div>", {"class": "modal-header"}).append(
                        "<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">×</button>",
                        $("<h3>", {"class": "modal-title"}).text(title)
                    ),
                    $("<div>", {"class": "modal-body form-horizontal"}).append(body),
                    $("<div>", {"class": "modal-footer"}).append(
                        $("<button>", {"type": "button", "class": "btn btn-default st-cancel-btn"}).text("取消"),
                        $("<button>", {"type": "button", "class": "btn btn-primary st-ensure-btn"}).text("确认")
                    )
                )))
    }
    function show(title, body, ensure_fn, cancel_fn, mold){
        var modal_dom = create_dom(title, body),
            cancel_btn = modal_dom.find(".st-cancel-btn").unbind("click.st");
        modal_dom.find(".modal-dialog").attr("class", "modal-dialog modal-"+(["md", "lg", "sm"].indexOf(mold) >= 0? mold: "lg"));
        modal_dom.find(".st-ensure-btn").unbind("click.st").on("click.st", ensure_fn);
        if (typeof cancel_fn != "function") cancel_btn.attr("data-dismiss", "modal");
        else cancel_btn.removeAttr("data-dismiss").on("click.st", cancel_fn);
        modal_dom.modal("show");
    }
    function danger(title, text, ensure_fn, cancel_fn, mold){
        var body = $("<table>", {"class": "table"}).append(
            $("<tr>").append(
                $("<td>", {"style": "text-align: center; border:0;"}).append($("<span>", {"class": "modal-tip-icon warning-icon"})),
                $("<td>", {"style": "vertical-align: middle; border:0;"}).append(text)
            )
        );
        show(title, body, ensure_fn, cancel_fn, mold);
    }
    return {
        "show": show,
        "danger": danger
    }
})();
(function(){
    $.fn.loading = function(text){
        if(this[0].tagName === "BUTTON") return this.attr("data-region", this.text()).prop("disabled", true).text(text||"Loading...");
        else if(this[0].tagName === "A") return this.after($("<div>", {"class": "opt-loading"}));
    };
    $.fn.regain = function(){
        if(this[0].tagName === "BUTTON") return this.prop("disabled", false).text(this.attr("data-region"));
        else if(this[0].tagName === "A") return this.next(".opt-loading").remove();
    };
    // Date.prototype.format = function(format) {
    //     var date = {
    //        "M+": this.getMonth() + 1,
    //        "d+": this.getDate(),
    //        "h+": this.getHours(),
    //        "m+": this.getMinutes(),
    //        "s+": this.getSeconds(),
    //        "q+": Math.floor((this.getMonth() + 3) / 3),
    //        "S+": this.getMilliseconds()
    //     };
    //     if (/(y+)/i.test(format)) {
    //        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    //     }
    //     for (var k in date) {
    //        if (new RegExp("(" + k + ")").test(format)) {
    //            format = format.replace(RegExp.$1, RegExp.$1.length === 1
    //               ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
    //        }
    //     }
    //     return format;
    // };
    $("body").on("shown.bs.modal", ".modal", function(){
        var $this = $(this);
        setTimeout(function () {
            $this.find('.modal-backdrop').remove();
        }, 0);
    });
    $("body").on("hidden.bs.modal", ".modal", function(){
        var body = $("body");
        if($(".modal").get().some(function(a){ return $(a).is(":visible")})) body.addClass("modal-open");
        else body.css("padding-right", 0);
    });
})();

(function () {
    var fixed_menu1 = $("<div>", {"class": "fixed-menu"}),
        to_top = function () {
            $("html, body").animate({scrollTop: 0}, 200);
        },
        to_bottom = function () {
            $("html, body").animate({scrollTop: $(document).height()}, 200)
        },
        show_input = function() {
            $.post("/feedback/user", function(data){
                var contact_input = $("#fixed-feedback-contact"),
                    name_input = $("#fixed-feedback-name");
                if(data.status){
                    if(!contact_input.val().trim()) contact_input.val(data.contact);
                    if(!name_input.val().trim()) name_input.val(data.name);
                }else console.log("获取用户信息失败！")
            });
            $(".feed-back").hide();
            $(".fixed-input-content").animate({"right": "15px"}, 200)
        };
    var input_content = $("<div>", {"class": "fixed-input-content row form-horizontal"}).append(
        $("<div>", {"class": "fixed-input-content-head"}).text("意见反馈").append(
            $("<i>", {"class": "glyphicon glyphicon-remove fixed-cancel-input"})
        ),
        $("<div>", {"class": "fixed-input-content-body"}).append(
            $("<div>", {"class": "form-group"}).append(
                $("<label>", {"class": "col-md-3 control-label"}).text("姓名："),
                $("<div>", {"class": "col-md-5"}).append($("<input>", {"type": "text", "class": "form-control", "id": "fixed-feedback-name"})),
                $("<div>", {"class": "col-md-4"})
            ),
            $("<div>", {"class": "form-group"}).append(
                $("<label>", {"class": "col-md-3 control-label"}).text("店铺名称："),
                $("<div>", {"class": "col-md-9"}).append($("<input>", {"type": "text", "class": "form-control", "id": "fixed-feedback-shop"}))
            ),
            $("<div>", {"class": "form-group"}).append(
                $("<label>", {"class": "col-md-3 control-label"}).text("QQ："),
                $("<div>", {"class": "col-md-9"}).append($("<input>", {"type": "text", "class": "form-control", "id": "fixed-feedback-qq"}))
            ),
            $("<div>", {"class": "form-group"}).append(
                $("<label>", {"class": "col-md-3 control-label"}).text("联系方式："),
                $("<div>", {"class": "col-md-9"}).append($("<input>", {"type": "text", "class": "form-control", "id": "fixed-feedback-contact"}))
            ),
            $("<div>", {"class": "form-group"}).append(
                $("<label>", {"class": "col-md-3 control-label"}).text("反馈内容："),
                $("<div>", {"class": "col-md-9"}).append($("<textarea>", {"class": "form-control", "id": "fixed-feedback-content"}))
            ),

            $("<div>", {"class": "form-group"}).append(
                $("<form>", {"action": "/img/picture/upload/feedback", "method": "post", "enctype":"multipart/form-data", "target": "upframe", "style": "text-align: center;"}).append(
                    $("<button>", {"type": "button", "id": "fixed-add-pic"}).text("添加图片"),
                    '<input type="file" name="file" id="mypic" multiple="multiple" accept="image/gif, image/jpeg, image/jpg, image/png" style="display: none;"/><br />',
                    '<button type="submit" name="submit" id="mypic-sub" style="display: none;">上传</button>'
                ),
                $("<iframe>", {"id": "upframe", "name":"upframe", "style": "display:none;"}),
                $("<table>", {"id": "fixed-img-content"})
            )
        ),
        $("<div>", {"class": "fixed-input-content-footer"}).append(
            $("<button>", {"class": "fixed-input-cancel-btn", "type": "button"}).text("取消"),
            $("<button>", {"class": "fixed-input-ensure-btn", "type": "button"}).text("确认")
        )
    );
    fixed_menu.append(
        $("<div>", {"class":"fixed-btn to-top"}).click(to_top),
        $("<div>", {"class":"fixed-btn feed-back"}).text("意见反馈").click(show_input),
        $("<div>", {"class":"fixed-btn to-bottom"}).click(to_bottom),
        input_content
    );
    $("body").append(fixed_menu);
    $(".fixed-cancel-input, .fixed-input-cancel-btn").click(function() {
        $(".fixed-input-content").animate({"right": "-350px"}, 200, function(){
            $(".feed-back").fadeIn(300);
        })
    });
    $("#fixed-add-pic").click(function(){ $("#mypic").click();});
    $("#mypic").change(function() { $("#fixed-add-pic").loading("上传中...").prop("disabled", true); $("#mypic-sub").click();});
    $(".fixed-input-ensure-btn").click(function () {
        var $this = $(this).loading();
        $.post("/feedback/upload", {"info":JSON.stringify({
            "name": $("#fixed-feedback-name").val().trim(),
            "contact": $("#fixed-feedback-contact").val().trim(),
            "content": $("#fixed-feedback-content").val().trim(),
            "shop": $("#fixed-feedback-shop").val().trim(),
            "qq": $("#fixed-feedback-qq").val().trim(),
            "images": $("#fixed-img-content").find("img").get().map(function(a){return $(a).attr("src")}).join(";")
        })}, function(data){
            if (data.status){
                $this.regain();
                Tip.success("提交反馈成功, 感谢您对ActNeed的支持！");
                $("#fixed-feedback-name, #fixed-feedback-contact, #fixed-feedback-shop, #fixed-feedback-qq").val("");
                $("#fixed-img-content").empty();
                $(".fixed-input-cancel-btn").click();
            } else Tip.danger(data.message);
        })
    });
    $("#fixed-img-content").on("click", ".remove-fixed-img", function(){ $(this).closest("tr").remove(); });
    $(window).scroll(function () {
        var menu = $(".fixed-menu");
        if(window.scrollY > 300)
            menu.find(".to-top").fadeIn(300);
        else menu.find(".to-top").fadeOut(300);
        //if($(document).height() - (window.scrollY+$(window).height()) > 300)
        //    menu.find(".to-bottom").show();
        //else menu.find(".to-bottom").hide();
    });
    window.feedback_up_pick_back = function(url, name) {
        $("#fixed-add-pic").regain().prop("disabled", false);
        var content = $("#fixed-img-content");
        content.append(
            $("<tr>").append(
                $("<td>", {"class": "fixed-img-content"}).append($("<img>", {"class": "fixed-img", "src": url})),
                $("<td>", {"class": "fixed-img-name"}).text(name),
                $("<td>", {"class": "remove-fixed-img"}).append(
                    $("<i>", {"class": "glyphicon glyphicon-remove"})
                )
            )
        )
    };
})();
