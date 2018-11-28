/**
 * Created by xuhe on 15/5/21.
 */
$(function(){
    var arr = [];
    $("#change-shop").click(function(){
        $.ajax({
            "type": "POST",
            "url": "/shop/"+$("#shop-id").val()+"/change",
            "dataType": "json",
            "success": function(data){
                if(data.status==1) {
                    if(data['shop_cnt'] < 20 && data['shop_cnt'] !== 0){
                        $('#changeShopSearch').parent().parent().hide();
                    }else if(data['shop_cnt'] === 0){
                        return $('#shops').text('当前没有可展示的店铺。').css('color', "#eb3c00");
                    }
                    render_model(data["shops"]);
                }
            },
            "error": function(){
                //location.href = "/"
            }
        });
    });
    $('div#myModal').on('shown.bs.modal', function (e) {
        $('#shops').find('a[data-attr-shop]').each(function (i, t) {
            if(arr.indexOf($(t).attr('data-attr-shop').trim()) === -1){
                arr.push($(t).attr('data-attr-shop').trim());
            }
        });
        $('#changeShopSearch').on('input',changeShopSearch);
    });
    function changeShopSearch() {
        if(this === window) return;
        var val = $(this).val().trim();
        if(val.length){
            if(arr.length){
                $(this).next().addClass('glyphicon-remove').css("cursor","pointer");
                $(this).next().off().click(function () {
                    $(this).prev().val('');
                    $(this).removeClass('glyphicon-remove');
                    $('#shops').find('.searchValClass').css('color','#337ab7');
                    $('a.errShop span').css({"color":"#959da0"});
                    $('#shops').find('a[data-attr-shop]').parent().show();
                    $('div[data-attr-id="model"]').show();
                    $('div.shopModel[data-attr-name]').show();
                });
                arr.forEach(function (v) {
                    if(v.toLowerCase().indexOf(val.toLowerCase()) === -1){
                        $('#shops').find('a[data-attr-shop="'+v+'"]').parent().hide();
                        if($('#shops').find('a[data-attr-shop="'+v+'"]').closest('div[data-attr-id="model"]').find('a:visible').length){
                            $('#shops').find('a[data-attr-shop="'+v+'"]').closest('div[data-attr-id="model"]').show();
                            $('#shops').find('a[data-attr-shop="'+v+'"]').closest('div.shopModel').show();
                        } else {
                            $('#shops').find('a[data-attr-shop="'+v+'"]').closest('div[data-attr-id="model"]').hide();
                        }
                        if(!$('#shops').find('a[data-attr-shop="'+v+'"]').closest('div.shopModel').find('a:visible').length){
                            $('#shops').find('a[data-attr-shop="'+v+'"]').closest('div.shopModel').hide();
                        }
                    }else {
                        var index = v.toLowerCase().indexOf(val.toLowerCase()),
                            aVal = v.slice(index, index - 0 + val.length),
                            vSpan = ''+v.replace(aVal, '<span class="searchValClass" style="color: #b7a433;">'+aVal+'</span>');
                        $('#shops').find('a[data-attr-shop="'+v+'"]').empty().append(vSpan).parent().show();
                        $('#shops').find('a[data-attr-shop="'+v+'"]').closest('div[data-attr-id="model"]').show();
                        $('#shops').find('a[data-attr-shop="'+v+'"]').closest('div.shopModel').show();
                    }
                });
            }
        }else {
            $(this).next().removeClass('glyphicon-remove');
            $('#shops').find('.searchValClass').css('color','#337ab7');
            $('a.errShop span').css({"color":"#959da0"});
            $('#shops').find('a[data-attr-shop]').parent().show();
            $('div[data-attr-id="model"]').show();
            $('div.shopModel[data-attr-name]').show();
        }
    }
    function render_model(shops){
        var html_str = "";
        var v_content = '',
            v_content_text = '';
        $("#shops").empty();
        shops.forEach(function (value, index) {
            html_str = $('<div class="col-md-12 shopModel" data-attr-name="'+ value[0] +'">\
                <div class="col-md-12">\
                    <h3 style="border-bottom: 1px solid #ccc; line-height: 50px; margin: 0 auto 8px; font-weight: bolder; font-size: 19px;"><i class="glyphicon glyphicon-home siteColor'+index+'" style="font-size: 15px;"></i> '+ value[0] +'</h3>\
                </div>\
                <div class="col-md-12" data-action-name="'+value[0]+'">\
                    \
                </div>\
            </div>');
            $("#shops").append(html_str);
            value[1].forEach(function (v) {
                v_content = '<div class="row" data-attr-id="model">\
                    <div class="col-sm-2 col-md-2" data-site="'+ v[0] +'" style="font-weight: 600;text-indent: 2px;">'+ v[0] +':</div>\
                    <div class="col-sm-10 col-md-10" data-attr-number="'+ value[1].length +'" data-n="'+value[0]+'" data-v="'+v[0]+'">\
                        \
                    </div>\
                </div>';
                $("#shops").find('div[data-action-name="'+value[0]+'"]').append(v_content);
                v[1].forEach(function (vText) {
                    if(vText['expire']) {
                        v_content_text = '<span style="position: relative">\
                            <a href="/online/' + vText['id'] + '/selling" class="errShop" data-attr-shop="' + vText['name'] + '" style="margin-right: 15px; color:#959da0;">' + vText['name'] + '</a>\
                            <span style="position: absolute; top: -4px; right: 2px; line-height: 14px; font-size: 11px; font-size-adjust: 11px; -moz-font-size-adjust: 11px; -webkit-font-size-adjust: 11px; width: 34px; border-radius: 10px; height: 14px; background-color: #1010101f; color: #ff4040; text-align: center;">过期</span>\
                        </span>';
                    }else {
                        v_content_text = '<span style="position: relative">\
                            <a href="/online/' + vText['id'] + '/selling" data-attr-shop="' + vText['name'] + '" style="margin-right: 15px;">' + vText['name'] + '</a>\
                        </span>';
                    }
                    $("#shops").find('div[data-n="'+value[0]+'"][ data-v="'+v[0]+'"]').append(v_content_text);
                });
            });
        });
        $("#shops").find('a').parent().css('float',"left");
        /*for(var i=0;i<shops.length;i++){
            var shop = shops[i];
            html_str += "<div class=\"col-md-4\">";
            //if(shop.platform != "Amazon"){
                html_str += "<a href=\"/online/" + shop.shop_id +"/selling\"";
            //}else{
            //    html_str += "<a href=\"/online/" + shop.shop_id +"/selling\"";
            //}
            html_str += " class=\"thumbnail-btn";
            html_str += " p-" + shop.platform.toLowerCase() + "\"";
            html_str += ">"
            + "<span>店铺：" + shop.name + "</span><br/>"
            + "<span>平台：" + shop.platform + "</span><br/>"
            + "<span>站点：" + shop.site_name + "</span>"
            + "</a></div>"
        }
        $("#shops").html(html_str);*/
    }
});