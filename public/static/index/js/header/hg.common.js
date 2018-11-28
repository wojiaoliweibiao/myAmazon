

$(document).ready(function () {
    //显示订单的数量
    if ($("#hidCurrentTypeMenuCode").val() == "erp_sale") {
        doLoadOrderNum();
    }

    //高级查询条件选项
    $(".search-panel .more-option input[type='checkbox']").change(function () {
        if ($(this).is(":checked")) {
            $("#divMoreSearchOption").removeClass("hide");
        }
        else {
            $("#divMoreSearchOption").addClass("hide");
        }
    });
});
//my97时间类型
function doInitWdatePickerEndDate(type) {
    if (type == "begin") {
        WdatePicker({ dateFmt: 'yyyy-MM-dd HH:mm:ss', startDate: redgle.datetime.getTodayBeginString() });
    }
    if (type == "end") {
        WdatePicker({ dateFmt: 'yyyy-MM-dd HH:mm:ss', startDate: redgle.datetime.getTodayEndString() });
    }
    else {
        WdatePicker({ dateFmt: 'yyyy-MM-dd HH:mm:ss' });
    }
}
function doLoadOrderNum() {
    $.ajax({
        type: "POST",
        url: "../Order/OrderApproveNum",
        datatype: "json",
        global: false,
        success: function (data) {
            if (!data.HasError) {
                //var sMessage = "<div style='margin-bottom:10px;'>全部&nbsp;&nbsp;<span style='color:#008000'>" + data.MapData.AllOrderNum + "</span>&nbsp;&nbsp;|&nbsp;&nbsp;待处理&nbsp;&nbsp;<span style='color:#008000'>" + data.MapData.OrderApprove + "</span>&nbsp;&nbsp;|&nbsp;&nbsp;待配货&nbsp;&nbsp;<span style='color:#008000'>" + data.MapData.OrderAccording + "</span>&nbsp;&nbsp;|&nbsp;&nbsp;待发货&nbsp;&nbsp;<span style='color:#008000'>" + data.MapData.OrderPrint + "</span>&nbsp;&nbsp;|&nbsp;&nbsp;已发货&nbsp;&nbsp;<span style='color:#008000'>" + data.MapData.OrderReceipt + "</span>&nbsp;&nbsp;|&nbsp;&nbsp;已完成&nbsp;&nbsp;<span style='color:#008000'>" + data.MapData.OrderCompleted + "</span>&nbsp;&nbsp;|&nbsp;&nbsp;虚拟发货&nbsp;&nbsp;<span style='color:#008000'>" + data.MapData.OrderVirtual + "</span>&nbsp;&nbsp;|&nbsp;&nbsp;退款与纠纷&nbsp;&nbsp;<span style='color:#008000'>" + data.MapData.OrderIssue + "</span>&nbsp;&nbsp;|&nbsp;&nbsp;作废&nbsp;&nbsp;<span style='color:#008000'>" + data.MapData.orderAbandoned + "</span>&nbsp;&nbsp;|&nbsp;&nbsp;其他&nbsp;&nbsp;<span style='color:#008000'>" + data.MapData.OrderDraft + "</span><div>";
                //$("#liOrderApproveNum").html(sMessage);
                $("a[itemid='erp_orderapprove'] .hide").removeClass("hide").text("（" + data.MapData.OrderApprove + "）");
                $("a[itemid='erp_orderaccording'] .hide").removeClass("hide").text("（" + data.MapData.OrderAccording + "）");
                $("a[itemid='erp_orderprint'] .hide").removeClass("hide").text("（" + data.MapData.OrderPrint + "）");
                $("a[itemid='erp_ordervirtual'] .hide").removeClass("hide").text("（" + data.MapData.OrderVirtual + "）");
                //$("a[itemid='erp_orderreceipt'] .hide").removeClass("hide").text("（" + data.MapData.OrderReceipt + "）");
                $("a[itemid='erp_orderpicking'] .hide").removeClass("hide").text("（" + data.MapData.OrderPicking + "）");
                $("a[itemid='erp_orderpostbacked'] .hide").removeClass("hide").text("（" + data.MapData.OrderPostBacked + "）");
                $("a[itemid='erp_allocationexception'] .hide").removeClass("hide").text("（" + data.MapData.OrderException + "）");
            }
        },
        error: function () {
            //alert("操作失败！");
        }
    });
}

//百度翻译
function Translate(controlId) {
    var content = $("#" + controlId).val();
    if (content.trim() == "") {
        redgle.showMessage(translate.trans("请先填写需要翻译的内容！"))
        return;
    }
    var arry = content.match(/\[[\u4E00-\u9FA5]{2,20}\]/g);
    if (arry) {
        for (var i = 0; i < arry.length; i++) {
            content = content.replace(/\[[\u4E00-\u9FA5]{2,20}\]/, "{" + i + "}");
        }
    }
    var tparry = [];
    $.ajax({
        url: "../BaiduTranslate/BaiduTranslateApi",
        type: "post",
        data: { query: content, from: "zh", to: "en" },
        success: function (data) {
            if (arry) {
                $("#" + controlId).val(data.format(arry))
            } else {
                $("#" + controlId).val(data)
            }
        },
        error: function (xhr) {
            redgle.showMessage(translate.trans("操作发生未知异常：{0} - {1}", [xhr.status, xhr.statusText]));
        }
    })
}
//谷歌翻译($this:需要翻译的文本框或文本yu content:翻译的文本，from：需要翻译的语种，to：翻译成什么语种)

var GoogleTranslateText = function (text, from1, to1) {
    var from = null;
    var to = null;
    if (from1)
        from = from1;
    if (to1)
        to = to1;
    var resultStr = "";
    if (text) {
        $.ajax({
            async: false,
            url: "../BaiduTranslate/GoogleTranslateApi",
            type: "post",           
            data: { query: text, from: from, to: to },
            success: function (data) {
                console.log(data)
                if (data.HasError) {
                    return "";
                } else {
                    if (data.MapData && data.MapData.resultText && data.MapData.resultText.length > 0) {
                        resultStr = data.MapData.resultText + "";
                    } else {
                        resultStr = "";
                    }
                }
            },
            error: function (xhr) {
                return "";
            }
        })
    } else {
        return "";
    }
    return resultStr;
}

$.fn.GoogleTranslate = function (option) {
    var $this = $(this);
    var content = $this.val()
    var from = null;
    var to = null;
    if (option) {
        if (option.from)
            from = option.from;
        if (option.to)
            to = option.to;
    }
    if (!content || content.length == 0) {
        return;
    }
    $.ajax({
        url: "../BaiduTranslate/GoogleTranslateApi",
        type: "post",
        data: { query: content, from: from, to: to },
        success: function (data) {
            if (data.HasError) {
                redgle.showMessage(translate.trans("翻译失败：{0}", [data.Message]));
            } else {
                if (data.MapData && data.MapData.resultText && data.MapData.resultText.length > 0) {
                    $this.val(data.MapData.resultText + "");
                }
            }
        },
        error: function (xhr) {
            redgle.showMessage(translate.trans("操作发生未知异常：{0} - {1}", [xhr.status, xhr.statusText]));
        }
    })
}


var editortrans = "";
//=====begin 翻译脚本====//
var transition = function (obj) {
    if (obj == '' || obj == undefined) {
        obj = '#cacheDiv';
    }
    var str = editortrans.html();
    var reg = /<script[^>]*>(.|\n)*?(?=<\/script>)<\/script>/gi;
    str = str.replace(reg, '');
    $(obj).empty();
    $(obj).html(str);
    //smt模板
    $(obj).find('.noImg').each(function () {
        var newStr = unescape($(this).attr('data-kse'));
        $(this).replaceWith(newStr);
    });
    //自定义模板
    $(obj).find('.smImg').each(function () {
        var dxmStr = unescape($(this).attr('data-kse'));
        $(this).replaceWith(dxmStr);
    })
    str = $(obj).html();
    str = replaceAllBlank(str);
    $(obj).empty();
    return str;
};
var setKindeDetail = function (detail, id, replaceLink) {
    var reg = /<script[^>]*>(.|\n)*?(?=<\/script>)<\/script>/gi;
    detail = detail.replace(reg, '').replace(/<script.*?>.*?<\/script>/g, '').replace(/<span.*?>On.*?information:<\/span>/gi, '');
    var linkReg = /(<link[^>]*>|<meta[^>]*>)/gi;
    if (replaceLink) {
        detail = detail.replace(linkReg, '');
    }
    detail = replaceAllBlank(detail);
    if (id) {
        KindEditor.html('#' + id, unTransitionHtml(detail));
    } else {
        editortrans.html(unTransitionHtml(detail));
    }
};
var unTransitionHtml = function (str) {
    var obj = '#cacheDiv';
    $(obj).html(str);
    //smt模板
    $(obj).find('[data-widget-type="relatedProduct"]').each(function () {
        //得到对象后，把属性拿到，拼个string再写到img里，替换原来的对象
        var type = $(this).attr('type'),
            newStr = $(this).prop('outerHTML'),
            custom = "http://style.aliexpress.com/js/5v/lib/kseditor/plugins/widget/images/widget1.png?t=AEO9LPV",
            relation = "http://style.aliexpress.com/js/5v/lib/kseditor/plugins/widget/images/widget2.png?t=AEO9LPV";
        if (type == 'relation') {
            custom = relation;
        }
        newStr = '<img class="noImg" data-kse="' + escape(newStr) + '" src="' + custom + '">';
        $(this).replaceWith(newStr);
    });
    $(obj).find('[data-widget-type="customText"]').each(function () {
        //得到对象后，把属性拿到，拼个string再写到img里，替换原来的对象
        var type = $(this).attr('type'),
            newStr = $(this).prop('outerHTML'),
            custom = "http://style.aliexpress.com/js/5v/lib/kseditor/plugins/widget/images/widget1.png?t=AEO9LPV",
            relation = "http://style.aliexpress.com/js/5v/lib/kseditor/plugins/widget/images/widget2.png?t=AEO9LPV";
        if (type == 'relation') {
            custom = relation;
        }
        newStr = '<img class="noImg" data-kse="' + escape(newStr) + '" src="' + custom + '">';
        $(this).replaceWith(newStr);
    });
    //自定义模板
    $(obj).find('[sm-data-widget-type="dxmRelatedProduct"]').each(function () {
        //得到对象后，把属性拿到，拼个string再写到img里，替换原来的对象
        var moduleType = $(this).attr('type');
        var dxmStr = $(this).prop('outerHTML');
        var custom = "http://www.sumool.com/static/img/moban_custom.png";
        var relation = "http://www.sumool.com/static/img/moban.png";
        if (moduleType == 1) {
            custom = relation;
        }
        var newStr = '<img class="noImg" data-kse="' + escape(dxmStr) + '" src="' + custom + '"/>';
        $(this).replaceWith(newStr);
    });
    str = $(obj).html();
    $(obj).empty();
    return str;
};
//去掉编辑器图片地址存在空格问题
var replaceAllBlank = function (editorHtml) {
    return editorHtml.replace(/wxalbum-[ ]{0,1}[\n]{0,2}10001658.image.myqcloud.com/ig, 'wxalbum-10001658.image.myqcloud.com');
};
var detailT = "";//详情
// 一键翻译,翻译产品的名称和描述
function keyTranslate(titleId, subTitleId, editorId, isNotHtmlContent, toLanguage) {
    //标题翻译
    var optionLanguage = { to: toLanguage }
    if (titleId != "" && $("#" + titleId) && $("#" + titleId).val() && $("#" + titleId).val().length > 0) {
        $("#" + titleId).GoogleTranslate(optionLanguage);
    }
    //副标题翻译
    if (subTitleId != "" && $("#" + subTitleId) && $("#" + subTitleId).val() && $("#" + subTitleId).val().length > 0) {
        $("#" + subTitleId).GoogleTranslate(optionLanguage);
    }
    //自定义属性
    var otherAttrFyArr = $("input[id='CustomValue']");
    var fyLength = otherAttrFyArr.length;
    for (var i = 0; i < fyLength; i++) {
        var attrValue = otherAttrFyArr.eq(i).val();
        setOtherAttrFy(fyLength, i, attrValue, otherAttrFyArr, optionLanguage);
    }
    //产品详细描述
    if (!isNotHtmlContent) {
        editortrans = editor1;
        if (!editortrans) {
            return;
        }
        if ($("#cacheDiv").length == 0) {
            $("body").append("<div style='display:none' id='cacheDiv'></div>")
        }
        $("#cacheDiv").val(editortrans.html());
        detailT = transition();
    } else {
        if (editorId != "" && $("#" + editorId)) {
            $("#" + editorId).GoogleTranslate(optionLanguage);
        }
    }
    if (!isNotHtmlContent) {
        var splitStr = '|||';
        var detailStr = trimLabel(detailT, splitStr);
        var regP1 = / [a-zA-Z0-9_-]+=("([^\"]*[\u4e00-\u9fa5]+.*?)"|'([^\']*[\u4e00-\u9fa5]+.*?)')/i;
        var titleStr = getTitle1(detailT, splitStr, regP1);
        detailStr = detailStr + splitStr + titleStr;

        var detailArr = detailStr.split(splitStr);
        for (var i = 0; i < detailArr.length; i++) {
            var s = detailArr[i];
            if ($.trim(s) != "") {
                setDetailTransate(s, optionLanguage);
            }
        }
    }
}
//逐个文本翻译
var setDetailTransate = function (s, optionLanguage) {
    var now = s;
    var to = null;
    if (optionLanguage) {
        if (optionLanguage.to)
            to = optionLanguage.to;
    }
    if (now != null && now != "" && now.length > 0 && now.indexOf("font-family:") < 0 && /.*[\u4e00-\u9fa5]+.*$/.test(now)) {
        //now = now.replace(/&nbsp;/g, ' ')
        $.ajax({
            url: "../BaiduTranslate/GoogleTranslateApi",
            type: "post",
            data: { query: now, to: to },
            success: function (data) {
                if (!data.HasError) {
                    if (data.MapData && data.MapData.resultText && data.MapData.resultText.length > 0) {
                        detailT = detailT.replace(now, data.MapData.resultText + "");
                        setKindeDetail(detailT, null, false);
                    }
                }
            },
            error: function (xhr) {
            }
        })
    }
};
//翻译自定义属性
var setOtherAttrFy = function (fyLength, i, attrValue, otherAttrFyArr, optionLanguage) {
    otherAttrFyArr.eq(i).GoogleTranslate(optionLanguage);
};
//获取标题
function getTitle1(s, splitStr, reg) {
    var titleStr = "";
    while (reg.test(s)) {
        var mStr = RegExp.$1;
        s = s.replace(mStr, splitStr);
        if (titleStr == "") {
            titleStr = mStr;
        } else {
            titleStr = titleStr + splitStr + mStr;
        }
    }
    return titleStr;
}
//获取标签中间的值
function trimLabel(s, splitStr) {
    var reg = /(<.*?>)/i;
    while (reg.test(s)) {
        var mStr = RegExp.$1;
        s = s.replace(mStr, splitStr);
    }
    return s;
}



String.prototype.format = function (args) {
    var result = this;
    for (var i = 0; i < args.length; i++) {
        if (args[i] != undefined) {
            var reg = new RegExp("({)" + i + "(})", "g");
            result = result.replace(reg, args[i]);
        }
    }

    return result;
}
function showPic(obj) {
    var urlPic = $(obj).attr("src");
    var html = "<div name ='mainPicShow' style='position: absolute; z-index:9999; border: 1px solid silver; background: #ffffff;width:300px;height:300px; line-height:300px'><img  style='width:100%;' src='" + urlPic + "' /></div>";
    var objDiv = $(html).appendTo($("body"));
    objDiv.css("top", $(obj).offset().top - 250);
    objDiv.css("left", $(obj).offset().left + $(obj).width() + 10);
}

function hidePic(obj) {
    var objDiv = $("body").find("[name=mainPicShow]");
    if (objDiv != undefined) {
        objDiv.remove();
    }
}

var setting = {};

setting.cookie = {
    get: function (cookiename) {
        var regexPattern = cookiename + "=(.*?)(;|$)";
        var regex = new RegExp(regexPattern);
        if (regex.test(document.cookie)) {
            var value = regex.exec(document.cookie)[1];
            if (value != null && value.replace(/\s/, "") != "")
                return unescape(value);
        }
        return "";
    },
    set: function (cookiename, value) {
        var argv = arguments;
        var argc = arguments.length;
        var expires = null;
        var path = (argc > 3) ? argv[3] : '/';
        var domain = null;
        var secure = (argc > 5) ? argv[5] : false;
        document.cookie = cookiename + "=" + escape(value) +
       ((expires == null) ? "" : ("; expires=" + expires.toGMTString())) +
       ((path == null) ? "" : ("; path=" + path)) +
       ((domain == null) ? "" : ("; domain=" + domain)) +
       ((secure == true) ? "; secure" : "");
    }
};


//展示提示
$.ShowHgMsg = {
    topMsg: function (msg, time) {
        var $thisMsgDiv = $("<div style='color: #a94442;background-color: #f2dede;border-color: #ebccd1;opacity: 1;text-align:center;height:50px;line-height:50px;   '>" + msg + "</div>").prependTo("body")
        var thistime = 3000;
        if (time) {
            var thistime = time;
        }
        setTimeout(function () {//定时器 
            $thisMsgDiv.remove();//将图片的display属性设置为none
        }, thistime);
    },
    cententMsg: function (msg, time) {
        var $thisMsgDiv = $("<div style='color: #a94442;z-index:999;background-color: #f2dede;border-color: #ebccd1;opacity: 1;text-align:center;height:50px;line-height:50px;position: fixed;top: 0px;left: 0px; right: 0px; bottom: 0px;margin: auto;'>" + msg + "<b style='position:absolute;width:10px;height:10px;right:0px;top:0px;z-index:100;cursor:pointer;' onclick='this.parentNode.remove()' class='glyphicon glyphicon-remove'></b></div>").prependTo("body")
        var thistime = 3000;
        if (time) {
            var thistime = time;
        }
        setTimeout(function () {//定时器 
            $thisMsgDiv.remove();//将图片的display属性设置为none
        }, thistime);
    }
}

/*使用方法备注：common.js内封装组件，直接初始化调用
 注意：本组件依赖jquery，dot模板引擎组件 （用于灵活定义用户的UI组件呈现于数据绑定） 
var SearchOption = SearchOptonRedgle();//初始化对象
SearchOption.BindDataUI(userfromlists, "平台类型", "userfromlist", false, true);//PlatformTypeTempl
//平台账户　AccountUser 
 var AccountUser = $("#AccountUser").val();
var AccountUser = JSON.parse(AccountUser);
SearchOption.BindDataUI(AccountUser, "平台账户", "AccountUser", true, false, $("#CommonAccountUserTempl").html()); 
//参数解析：数据源（Text,Value）JSON对象,标题描述，标题类型id，是否更多，是否多选（单选，多选），定义模板； 
*/
//封装条件查询 下拉 tab
function SearchOptonRedgle() {




    var SearchOpton = {
        templ: "",//公用展开项模板
        Droptempl: "",//公用下拉模板
        bindId: "listItem",//固定绑定id
        bindDropId: "DropListItem",//下拉绑定位置
        CallDelFun: function (typied) { },//删除类型回调
        CallAllFun: function (typied) { }, //全部查询
        CallUserFun: function (typied, id) { },//控制展开的项点击回调 参数：是不同参数类型的自定义类型参数
        CallTabFun: function (typeid) { }, //这个是控制下拉多选更多按钮触发回调  参数：是不同参数类型的自定义类型参数
        CallExtendFun: function (typeid, isExtend) { },//这个用于用户展开信息，收缩信息回调方法
        BindUserData: function (UserData) { },
        EventMultiBtnFunc: function (event) {//更多按钮 确定提交触发
            //采集数据
            var obj = $(this).parents(".sl-wrap");
            var dataobj = $(this).parents(".sl-tab-cont-item");
            var listSelected = $(dataobj).find(" .J_valueList li[class*='selected']");
            if (listSelected.length > 0) {
                $("#J_crumbsBar").show();
                var typeId;
                var typeName;
                //判断是否是tab
                if ($(this).parents(".sl-tab-cont").length == 0) {
                    typeId = $(obj).find(".sl-key").attr("typeid");
                    typeName = $(obj).find(".sl-key").text().trim().split(' ')[0];
                }
                else {
                    typeId = $(obj).find(".trig-curr").attr("typeid");
                    typeName = $(obj).find(".trig-curr").text().trim() + ":";
                }
                //获取数据
                var idStr = "";
                var textStr = "";
                var textSubStr = "";
                for (var i = 0; i < listSelected.length; i++) {
                    idStr += $(listSelected[i]).attr("id") + ",";
                    textStr += $(listSelected[i]).text().trim() + "、";
                }
                idStr = idStr.substr(0, idStr.length - 1);
                textStr = textStr.substr(0, textStr.length - 1);
                maxnum = textStr.length > 20 ? 20 : textStr.length;
                textSubStr += textStr.substr(0, maxnum);

                var strTempl = ' <a class="crumb-select-item" typeid="' + typeId + '" href="javascript:;" title="' + textStr + '" atrrvalue="' + idStr + '"><b>' + typeName.split(' ')[0] + ':</b><em>' + textSubStr + '</em><i ></i></a> ';
                if ($(".crumbs-nav-main").find("[typeid='" + typeId + "']").length > 0) {
                    //则替换掉
                    $(".crumbs-nav-main [typeid='" + typeId + "']").replaceWith(strTempl);
                }
                else {
                    //否则则追加
                    $("#baritem").append(strTempl);
                }

                $(".crumb-select-item[typeid='" + typeId + "'] i").on("click", { "CallDelFun": event.data.CallDelFun, "typeId": typeId }, event.data.DelFun);

                event.data.CallTabFun(typeId);

                var obj = $("#J_selectorSenior .sl-v-tab .trig-curr");
                if (obj.length > 0) {
                    $(obj).parent().find(".trig-curr").removeClass("trig-curr");
                    $(obj).removeClass("trig-curr");
                    $("#J_selector #" + $(obj).attr("typeid")).hide();

                }
                $(obj).find(".sl-v-list").attr("style", "");
            }
        },
        BindDataUI: function (data, typeName, TypeId, isMore, isMultiple, templUser, hasSearch, isEdit, ClassName)//数据源：{Text:"",Value:""}; 类型名称；类型id，是否单行【更多】;是否多选【单选，多选】；用户自定义模板:灵活选择,是否查询，是否能编辑设置呈现方式
        {
            //用户自定义模板
            var templInfo = this.templ;
            if (templUser && templUser.length > 0) {
                templInfo = templUser;
            }
            if (!templInfo || templInfo.length == 0) {
                console.log("模板未定义:Droptempl");
                return;
            }
            var SearchData = {};
            var SingleLineStr = "";
            SearchData.SingleLineStr = "s-line ";
            SearchData.isMoreLine = isMore;
            if (isMore) {
                SearchData.SingleLineStr = "oc_select";
            }
            var isMultioleStr = "";
            if (isMultiple) {
                isMultioleStr = "multiples";
            }
            else {
                isMultioleStr = "single";
            }
            if (hasSearch) {
                hasSearch = hasSearch;
            }
            else {
                hasSearch = false;
            }
            //debugger;
            if (isEdit) {
                isEdit = isEdit;
            }
            else {
                isEdit = false;
            }
            if (!ClassName) {
                ClassName = "";
            }
            SearchData.TypeName = typeName;
            SearchData.TypeId = TypeId;
            SearchData.listItem = data;
            SearchData.isMultiple = isMultiple;
            SearchData.isMultioleStr = isMultioleStr;
            SearchData.hasSearch = hasSearch;
            SearchData.isEdit = isEdit;
            SearchData.ClassName = ClassName;
            var interText = doT.template(templInfo);
            $("#" + this.bindId).append(interText(SearchData));
        },
        HasAndAddDropBox: function () {
            if ($("#J_selectorSenior").length == 0) {
                var htmlBox = '<div id="J_selectorSenior" class="J_selectorLine s-line s-senior">';
                htmlBox += ' <div class="sl-wrap"> <div class="sl-key"><span>高级选项</span></div> <div class="sl-value">';
                htmlBox += ' <div class="sl-v-tab"><div class="sl-tab-trigger clearfix">  </div></div></div>';
                htmlBox += '<div class="sl-tab-cont"></div> </div></div>';
                $("#" + this.bindDropId).append(htmlBox);
            }
        },
        //数据源；类型名称；类型id；是否多选，用户自定义模板//添加查询接口,是否展示常用菜单，是否能编辑呈现方式
        BindDropDataUI: function (data, typeName, TypeId, isMultiple, templUser, hasSearch, isEdit, ClassName) {
            //用户自定义模板
            var templInfo = this.Droptempl;
            if (templUser && templUser.length > 0) {
                templInfo = templUser;
            }

            if (!templInfo || templInfo.length == 0) {
                console.log("模板未定义:Droptempl");
                return;
            }
            var isMultioleStr = "";
            if (isMultiple) {
                isMultioleStr = "multiple";
            }
            else {
                isMultioleStr = "single";
            }
            if (hasSearch) {
                hasSearch = hasSearch;
            } else {
                hasSearch = false;
            }
            if (!ClassName) {
                ClassName = "";
            }
            //debugger;
            if (isEdit) {
                isEdit = isEdit;
            } else {
                isEdit = false;
            }
            //判断不存在则添加tab 下拉
            if ($(".trig-item[typeid='" + TypeId + "'] ").length == 0) {
                //标题
                var TitleName = ' <a class="trig-item ' + isMultioleStr + ' " typeid="' + TypeId + '"menutype="' + isEdit + '"    href="javascript:;"><span class="text">';
                TitleName += translate.format('<hg:trans>{0}</hg:trans>', [typeName]);
                TitleName += ' <b></b></span><i class="arrow"></i></a>';
                $(".sl-v-tab .sl-tab-trigger").append(TitleName);
                var interText = doT.template(templInfo);
                //内容
                var objData = {
                    data: data,
                    isMultiple: isMultiple,
                    isMultioleStr: isMultioleStr,
                    TypeId: TypeId,
                    hasSearch: hasSearch,
                    isEdit: isEdit,
                    ClassName: ClassName
                };

                $(".sl-tab-cont").append(interText(objData));
            }

        },
        DelFun: function (event) {//删除类型
            var typeid = event.data.typeId;
            var tempaClass = $("#" + typeid + "  li[class*='selected']").attr("class");
            //debugger;
            if (tempaClass && tempaClass.length > 0) {
                var aClass = "";
                if (typeid == "AccountUser") {
                    aClass = $("#J_selector #" + typeid + " li[class*='selected']").attr("class").replace("J_active", "");
                    $("#" + typeid + " li[class*='selected']").attr("class", aClass);
                }
                else {
                    aClass = $("#J_selector #" + typeid + " li[class*='selected'] a").attr("class");
                    if (aClass && aClass.length > 0) {
                        aClass = aClass.replace("J_active", "");
                        $("#" + typeid + " li[class*='selected'] a").attr("class", aClass);
                    }


                }


            }
            var attClass = $("#" + typeid + " li[class*='selected']").attr("class").replace("selected", "");
            $("#" + typeid + " li[class*='selected']").attr("class", attClass);
            $("a[typeid='" + typeid + "'] b").html("");
            $("#baritem a[typeid='" + typeid + "']").remove();
            //处理确定多选确定按钮 
            var parentBtn = $("#" + typeid).parents(".sl-tab-cont-item").find(".sl-btns .J_btnsConfirm");
            if (parentBtn) {
                if (!$(parentBtn).hasClass("disabled")) {
                    $(parentBtn).addClass("disabled");
                }

            }

            if ($(".crumbs-nav-main .crumb-select-item").length == 0) {
                $("#J_crumbsBar").hide();
            }
            event.data.CallDelFun(typeid);
        },
        BeforeInit: function (isShowCommonUseMenu) {
            if (isShowCommonUseMenu == undefined) {
                isShowCommonUseMenu = true
            }
            //this.HasAndAddDropBox();//判断并添加下拉框架
            if (isShowCommonUseMenu) {
                //添加设置按钮
                if ($(".trig-item[id='BtnSet'] ").length == 0) {
                    var BtnSetName = ' <a class="trig-item"  id="BtnSet"  href="javascript:;"><span class="text">';
                    BtnSetName += translate.format('<hg:trans>设置常用菜单</hg:trans>');
                    BtnSetName += ' <b></b></span></a>';
                    $(".sl-v-tab .sl-tab-trigger").append(BtnSetName);
                }
            }
        },
        initEvent: function (isShowCommonUseMenu) {

            var ObjEventCallFunc = this.CallUserFun;//处理回调方法【注意：只针对除了下拉多选，点击选项，都会触发】 
            var ObjMultiCallFunc = this.EventMultiBtnFunc;
            var ObjCallTabFun = this.CallTabFun;
            var ObjDelFun = this.DelFun;
            var ObjCallDelFunc = this.CallDelFun;
            var ObjCallAllFunc = this.CallAllFun; //全部查询
            var ObjCallExtendFun = this.CallExtendFun;
            SearchOpton.BeforeInit(isShowCommonUseMenu);
            //关于UI处理逻辑
            //更多
            $(".sl-e-more").on("click", function () {
                var isExtend = true;
                var obj = $(this).parents(".sl-wrap");
                if ($(obj).hasClass("extend")) {
                    $(this).html(translate.format("<hg:trans>更多<i></i></hg:trans>"));
                    $(this).removeClass("opened");
                    $(obj).removeClass("extend");
                    $(obj).find(".J_valueList").attr("style", "");
                    isExtend = false;
                }
                else {
                    $(this).html(translate.format("<hg:trans>收起<i></i></hg:trans>"));
                    $(obj).addClass("extend ");
                    $(this).addClass("opened");
                    $(obj).find(".J_valueList").attr("style", "max-height:200px;overflow-y:auto;width:100%");
                    isExtend = true;
                }
                var typeid = $(obj).find(".sl-value").attr("id");
                ObjCallExtendFun(typeid, isExtend);

            });
            //tab选择
            $(".J_tabMultiple").on("click", function () {
                var obj = $(this).parents(".sl-tab-cont-item")
                if (!obj.hasClass("multiple")) {
                    $(obj).addClass("multiple");
                    $(".trig-curr").addClass("multiple");
                }
            });

            //多选显示UI
            $(".J_btnsCancel").on("click", function () {
                var obj = $(this).parents(".sl-wrap");
                $(obj).removeClass("multiple");
                $(".trig-curr").removeClass("multiple");
                $(obj).find(".sl-ext").show();

            });


            //tab隐藏UI
            $(".J_tabCancel").on("click", function () {

                var obj = $("#J_selectorSenior .sl-v-tab .trig-curr");
                if (obj.length > 0) {
                    $(obj).parent().find(".trig-curr").removeClass("trig-curr");
                    $(obj).removeClass("trig-curr");
                    $("#J_selector #" + $(obj).attr("typeid")).hide();

                }
                $(obj).find(".sl-v-list").attr("style", "");
            });

            //切换tab
            $(".trig-item[typeid]").on("click", function () {
                var obj = $(this).parents(".sl-wrap");
                var typeid = $(this).attr("typeid");
                if ($(this).hasClass("trig-curr")) {
                    $(this).parent().find(".trig-curr").removeClass("trig-curr");
                    $(this).removeClass("trig-curr");
                    $("#J_selector #" + typeid).hide();
                    $(obj).find(".sl-v-list .J_valueList").attr("style", "");
                }
                else {
                    $(this).parent().find(".trig-curr").removeClass("trig-curr");
                    $(".sl-tab-cont .sl-tab-cont-item").hide();
                    $(".sl-v-tab .trig-item").removeClass("trig-curr");
                    $(this).addClass("trig-curr");
                    $("#J_selector #" + typeid).show();
                    $(obj).find(".sl-v-list .J_valueList").attr("style", "max-height:350px;overflow-y:auto;width:100%;height:100%");
                }
            });
            //点击空白处 关闭下拉
            $(document).on("click", function (e) {
                var obj = $("#J_selectorSenior .sl-v-tab .trig-curr");
                var _con = $(e.target).parent();
                var typeid = $(obj).attr("typeid");
                var _select = $("#J_selectorSenior .sl-v-tab .trig-curr");

                if (_select.has(e.target).length === 0) {
                    if ($("#J_selector #" + typeid).has(e.target).length > 0)
                        return;
                    if (obj.length > 0) {
                        $(obj).parent().find(".trig-curr").removeClass("trig-curr");
                        $(obj).removeClass("trig-curr");
                        $("#J_selector #" + typeid).hide();
                    }
                }
            });

            //点击选项
            $(".J_valueList a").on("click", function (e) {
                //添加单个，累加逻辑
                e.preventDefault();
                var obj = $(this).parents(".sl-wrap");

                //针对搜索条件处理
                if ($(obj).hasClass("SearchType")) {
                    ObjEventCallFunc($(obj).find(".sl-key").attr("typeid"), $(this).attr("id"));
                    return;
                }

                var isMultiple = false;//是否单选
                var dataObj;//获取采集数据
                var textInfo = "";
                var typeId;
                var typeName;
                var isTab;
                var isdel = false;
                //先判断是否是下拉 
                if ($(this).parents(".sl-tab-cont-item").length > 0)//下拉逻辑
                {
                    isMultiple = $(this).parents(".sl-tab-cont-item").hasClass("multiple");//判断是否是多选
                    if (isMultiple) {
                        if ($(this).parent().hasClass("selected")) {
                            $(this).parent().removeClass("selected");
                        }
                        else {
                            $(this).parent().addClass("selected");
                            isdel = true;
                        }
                        dataObj = $(this).parents(".sl-tab-cont-item");
                        if ($(dataObj).find(".selected").length > 0) {
                            $(dataObj).find(".J_btnsConfirm").removeClass("disabled");
                        }
                        else {
                            $(dataObj).find(".J_btnsConfirm").addClass("disabled");
                        }
                    }
                    else {
                        dataObj = $(this).parents(".sl-v-list");
                        if ($(this).parent().hasClass("selected")) {
                            $(this).removeClass("J_active");
                            $(this).parent().removeClass("selected");
                            isdel = true;
                        }
                        else {
                            $(dataObj).find(" .J_valueList li[class*='selected'] a").removeClass("J_active");
                            $(dataObj).find(" .J_valueList li[class*='selected']").removeClass("selected");
                            $(this).addClass("J_active");
                            $(this).parent().addClass("selected");
                        }
                    }
                    typeId = $(obj).find(".trig-curr").attr("typeid");
                    typeName = $(obj).find(".trig-curr .text").text().trim().split(' ')[0] + "：";
                    isTab = true;
                }
                else {
                    //debugger;
                    //关于更多展开逻辑
                    typeId = $(obj).find(".sl-key").attr("typeid");
                    dataObj = $(this).parents(".sl-v-list");
                    if ($(obj).hasClass("multiples"))//判断是否是多选
                    {
                        if ($(this).parent().hasClass("selected")) {
                            $(this).parent().removeClass("selected");
                            if (typeId == "AccountUser") {
                                $(this).parent().removeClass("J_active");
                            }
                            else {

                                $(this).removeClass("J_active");
                            }
                            isdel = true;
                        }
                        else {
                            $(this).parent().addClass("selected");
                            if (typeId == "AccountUser") {
                                $(this).parent().addClass("J_active");
                            }
                            else {
                                $(this).addClass("J_active");
                            }
                        }
                    }
                    else {
                        if ($(this).parent().hasClass("selected")) {
                            $(this).removeClass("J_active");
                            $(this).parent().removeClass("J_active");
                            $(this).parent().removeClass("selected");
                            isdel = true;
                        }
                        else {

                            $(dataObj).find(" .J_valueList li[class*='selected'], .J_valueList li[class*='selected'] a ").removeClass("J_active");
                            $(dataObj).find(".J_valueList li[class*='selected']").removeClass("selected");
                            $(this).parent().addClass("selected");
                            if (typeId == "AccountUser") {
                                $(this).parent().addClass("J_active");
                            }
                            else {
                                $(this).addClass("J_active");
                            }
                        }
                    }

                    typeName = $(obj).find(".sl-key").text().trim().split(' ')[0] + "：";
                }

                //获取数据
                var idStr = "";
                var textStr = "";
                var textSubStr = "";
                //判断是否有 
                var listSelected = $(dataObj).find(" .J_valueList li[class*='selected']");
                if (listSelected.length > 0) {
                    for (var i = 0; i < listSelected.length; i++) {
                        idStr += $(listSelected[i]).attr("id") + ",";
                        textStr += $(listSelected[i]).text().trim() + "、";
                    }
                    idStr = idStr.substr(0, idStr.length - 1);
                    textStr = textStr.substr(0, textStr.length - 1);
                    if (isTab) {
                        if (listSelected.length > 1) {
                            textInfo = "&nbsp; 已选：" + listSelected.length;
                        }
                        else if (listSelected.length == 1) {
                            var textName = $(listSelected[0]).text().trim();
                            textName = textName.length > 10 ? textName.substr(0, 10) + "…" : textName;
                            textInfo = "&nbsp;" + textName;
                        }
                        else {
                            textInfo = "";
                        }
                        $(obj).find(".trig-curr b").html(textInfo);
                        if (isMultiple)//如果是tab
                            return;
                    }
                    else {

                        $("#J_crumbsBar").show();
                    }
                    if (!$(obj).hasClass("NoEvent")) {
                        maxnum = textStr.length > 20 ? 20 : textStr.length;
                        textSubStr += textStr.substr(0, maxnum);
                        var strTempl = ' <a class="crumb-select-item" typeid="' + typeId + '" href="javascript:;" title="' + textStr + '" atrrvalue="' + idStr + '"><b>' + typeName + '</b><em>' + textSubStr + '</em><i></i></a> ';
                        if ($(".crumbs-nav-main").find("[typeid='" + typeId + "']").length > 0) {
                            //则替换掉
                            $(".crumbs-nav-main [typeid='" + typeId + "']").replaceWith(strTempl);
                        }
                        else {
                            //否则则追加
                            // $("#baritem").append(strTempl);
                            $("#baritem").append(strTempl);
                        }
                        $(".crumb-select-item[typeid='" + typeId + "'] i").on("click", { CallDelFun: ObjCallDelFunc, typeId: typeId }, ObjDelFun);

                    }
                }
                else {
                    if (isTab) {
                        $(obj).find(".trig-curr b").html("");
                    }
                    $(".crumbs-nav-main [typeid='" + typeId + "']").remove();
                }

                //如果添加项大于0就显示
                if ($(".crumb-select-item").length == 0) {
                    $("#J_crumbsBar").hide();
                }
                else {
                    $("#J_crumbsBar").show();
                }
                //判断排除tab 下拉多选的事件 回调
                if (!(isTab && isMultiple)) {
                    //debugger;
                    ObjEventCallFunc(typeId, idStr);
                }
            });

            //多选按钮点击处理用户选择数据
            $(".J_btnsConfirm").on("click", { CallTabFun: ObjCallTabFun, CallDelFun: ObjCallDelFunc, DelFun: ObjDelFun }, ObjMultiCallFunc);

            //清空多选
            $(".JClear").on("click", function () {
                var typeid = $(this).attr("typeid");
                $("#J_selector #" + typeid + " li[class*='selected'] a").attr("class", " ");
                $("#J_selector #" + typeid + " li[class*='selected']").attr("class", " ");
                $("a[typeid='" + typeid + "'] b").html("");
                $("#baritem a[typeid='" + typeid + "']").remove();
                if ($(".crumbs-nav-main .crumb-select-item").length == 0) {
                    $("#J_crumbsBar").hide();
                }
                var objBtnConfirm = $(this).parent().find(".J_btnsConfirm");
                if (!$(objBtnConfirm).hasClass("disabled"))
                    $(objBtnConfirm).addClass("disabled");

                ObjCallDelFunc(typeid);

            });

            $(".All").on("click", function () {
                var typeid = $(this).attr("typeid");
                ObjCallAllFunc(typeid);
            });

            //清空多选
            $(".All").on("click", function () {
                var typeid = $(this).attr("typeid");
                ObjCallAllFunc(typeid);
            });

            //公有查询方法
            $(".MenuSearchInfoBtn").on("click", function () {
                var text = $(this).parent().find("input").val().trim();
                var obj = $(this).parents(".sl-v-list");
                if (text.length > 0) {

                    if ($(obj).find(".J_valueList li a[title*='" + text + "']").length == 0) {
                        alert(translate.format("<hg:trans>{0}</hg:trans>", ["未搜索到查询结果"]));
                        return;
                    }
                    $(obj).find(".J_valueList li").hide();
                    $(obj).find(".J_valueList li a[title*='" + text + "']").parent().show();


                }
                else {
                    $(obj).find(".J_valueList li").show();
                }
            });

            //添加设置常用方法
            $("#BtnSet").on("click", function () {
                var objArray = [];
                // debugger;
                //if ($("#SearchMenuModal .modal-body").html() == "") {
                //  var GetSearchMenuUserData=  $("#bindTypeData").val();
                //  //if (GetSearchMenuUserData == "") {
                //  //    debugger;

                //  //  }
                //  //  else {
                //  //    objArray = JSON.parse(GetSearchMenuUserData);
                //    //  }
                //}
                //寻找能编辑的“展开UI”类型
                $("#J_selector .sl-wrap[menutype='true']").each(function () {
                    var objData = {
                        typeid: $(this).find(".sl-key").attr("typeid"),
                        typeName: $(this).find(".sl-key ").text().replace("：", ""),
                        isExtend: true
                    };
                    objArray.push(objData);
                });
                $("#DropListItem .trig-item[menutype='true']").each(function () {
                    var objData = {
                        typeid: $(this).attr("typeid"),
                        typeName: $(this).find(".text ").text().trim(),
                        isExtend: false
                    };
                    objArray.push(objData);
                });

                var interText = doT.template($("#SetMenuTempl").html());
                $("#SearchMenuModal .modal-body").html(interText(objArray));
                if ($("#SearchMenuModal .modal-body input[type='checkbox']:checked").length > 2) {
                    $("#SearchMenuModal .modal-body input:not(:checked)").each(function () {
                        $(this).attr("disabled", "disabled ");
                    });
                }


                //绑定选择事件方法，控制用户只能选择<=3项常用项
                $("#SearchMenuModal .modal-body input[type='checkbox']").on("click", function (e) {

                    if ($("#SearchMenuModal .modal-body input[type='checkbox']:checked").length > 2) {
                        $("#SearchMenuModal .modal-body input:not(:checked)").each(function () {
                            $(this).attr("disabled", "disabled");
                        });
                    }
                    else {
                        $("#SearchMenuModal .modal-body input").removeAttr("disabled");
                    }

                });
                //是否展开
                $('#SearchMenuModal').modal({
                    keyboard: false
                })
            });
        }
    };
    SearchOpton.HasAndAddDropBox();
    return SearchOpton;
}
//回车搜索 
function enterMenuSearch(objText) {
    //debugger;
    var event = window.event || arguments.callee.caller.arguments[0];
    if (event.keyCode == 13) {
        var text = $(objText).val().trim();
        var obj = $(objText).parents(".sl-v-list");
        if (text.length > 0) {
            if ($(obj).find(".J_valueList li a[title*='" + text + "']").length == 0) {
                alert(translate.format("<hg:trans>{0}</hg:trans>", ["未搜索到查询结果"]));
                return;
            }
            debugger;
            $(obj).find(".J_valueList li").hide();
            $(obj).find(".J_valueList li a[title*='" + text + "']").parent().show();
            var ae = "";
        }
        else {
            $(obj).find(".J_valueList li").show();
        }

    }
}