/**
 * Created by Administrator on 2017/8/28.
 */

var ClaimPic = (function($) {
    var defaults = {
        claim_pic_nums: 1,
        modal_init_url : "",
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
        },
        ensure_picture_fun: null // 自定义函数 将选中图片显示到商品图片，或者变体图片预览框
    };
    var claim_pic_modal = '<div class="modal fade" id="upp-claim-picture-modal" tabindex="-1" role="dialog">'
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
        +'</div></div></div></div>', modal_trigger;
    var claim_init = function(btns, options){
        var Claim = {
            init: function () {
                if (!$("#upp-claim-picture-modal").length) Claim.append_modal();
                btns.on("click", Claim.init_modal);
            },
            append_modal: function () {
                $("body").append(claim_pic_modal);
                var modal = $("#upp-claim-picture-modal");
                modal.on("click", ".claim-pic", Claim.pick_click)
                    .on("click", ".del-temp-img", Claim.del_select_pic);
            },
            ensure_up_claim: function () {
                var modal = $("#upp-claim-picture-modal");
                var img_list = modal.find(".select-list").find("img").get().map(function(dom){return $(dom).attr("src")});
                options.ensure_picture_fun && options.ensure_picture_fun(img_list, modal_trigger);
                modal.modal("hide");
            },
            del_select_pic: function () {
                var $block = $(this).closest(".claim-img-box").remove(),
                    src = $block.attr("data-id"),
                    content = $("#upp-claim-picture-modal").find(".claim-pic-area");
                content.find("img[src='"+src+"']").closest(".claim-pic").removeClass("on");
            },
            pick_click: function () {
                var $this = $(this),
                    content = $(".select-list"),
                    src = $(this).find("img").attr("src");
                if($this.hasClass("on")){
                    $this.removeClass("on");
                    content.find("[data-id='"+src+"']").remove();
                }else{
                    $this.addClass("on");
                    content.append(
                        $("<div>", {"class": "claim-img-box", "data-id": src}).append(
                            '<a href="javascript:void(0)"><span class="del-temp-img"></span></a>',
                            $("<img>", {"src": src})
                        )
                    )
                }
            },
            init_modal: function () {
                var modal = $("#upp-claim-picture-modal");
                if(!options.before_check() && !modal_trigger.closest("td").find("img").attr("src")){
                    Inform.show("产品图片和变体图片最多只能添加20张");
                    return
                }
                modal_trigger = $(this);
                if(!modal.find(".claim-pic").length&&!modal.find(".no-claim-pic").length) Claim.get_claim_pics(options);
                else modal.find(".claim-pic").removeClass("on").end().find(".select-list").empty();
                $("#add-claim-pic").unbind().click(Claim.ensure_up_claim);
                modal.modal("show");
            },
            get_claim_pics: function () {
                $(".loading-claim").remove();
                var product_id = Claim.get_query_string("product_id"),
                    url = "/create/{0}/collect/image".format($("#shop-id").val());
                if(product_id)
                    $.post(url, { product_id: product_id }, function(data){
                        if(data.status) $(".claim-pic-area").append(data["images"].map(Claim.create_pic));
                        else $(".claim-pic-area").append($("<div>", {"class": "no-claim-pic"}).text(data.message));
                    })
            },
            get_query_string: function (name) {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
                var r = window.location.search.substr(1).match(reg);
                if (r != null)return decodeURI(r[2]);
                return null;
            },
            create_pic: function (src) {
                return $("<div>", {"class": "claim-pic"}).append(
                    $("<div>", {"class": "claim-pic-content"}).append($("<img>", {"class": "claim-pic-img", "src": src}))
                )
            }
        };
        Claim.init()
    };
    $.fn.selectClaimPic = function(args){
        var options = $.extend(true, {}, defaults, args);
        return claim_init($(this), options);
    };
    return {}
})(jQuery);
