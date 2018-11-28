function panelshow() {
    $(".panel-title>span").addClass("glyphicon glyphicon-triangle-bottom");
    $(".panel-body").addClass("collapse in");
    $(".panel-heading").click(function() {
        var n = $(this).find("span");
        n.attr("class").indexOf("glyphicon-triangle-bottom") > 0 ? (n.removeClass("glyphicon-triangle-bottom").addClass("glyphicon-triangle-right"), $(this).parent().find(".panel-body").removeClass("in")) : (n.removeClass("glyphicon-triangle-right").addClass("glyphicon-triangle-bottom"), $(this).parent().find(".panel-body").addClass("in"))
    })
}
function doInitWdatePickerEndDate(n) {
    n == "begin" && WdatePicker({
        dateFmt: "yyyy-MM-dd HH:mm:ss",
        startDate: redgle.datetime.getTodayBeginString()
    });
    n == "end" ? WdatePicker({
        dateFmt: "yyyy-MM-dd HH:mm:ss",
        startDate: redgle.datetime.getTodayEndString()
    }) : WdatePicker({
        dateFmt: "yyyy-MM-dd HH:mm:ss"
    })
}
function doLoadOrderNum() {
    $.ajax({
        type: "POST",
        url: "../Order/OrderApproveNum",
        datatype: "json",
        global: !1,
        success: function(n) {
            n.HasError || ($("a[itemid='erp_orderapprove'] .hide").removeClass("hide").text("（" + n.MapData.OrderApprove + "）"), $("a[itemid='erp_orderaccording'] .hide").removeClass("hide").text("（" + n.MapData.OrderAccording + "）"), $("a[itemid='erp_orderprint'] .hide").removeClass("hide").text("（" + n.MapData.OrderPrint + "）"), $("a[itemid='erp_ordervirtual'] .hide").removeClass("hide").text("（" + n.MapData.OrderVirtual + "）"), $("a[itemid='erp_orderpicking'] .hide").removeClass("hide").text("（" + n.MapData.OrderPicking + "）"), $("a[itemid='erp_orderpostbacked'] .hide").removeClass("hide").text("（" + n.MapData.OrderPostBacked + "）"), $("a[itemid='erp_allocationexception'] .hide").removeClass("hide").text("（" + n.MapData.OrderException + "）"))
        },
        error: function() {}
    })
}
function Translate(n) {
    var t = $("#" + n).val(),
    i,
    r,
    u;
    if (t.trim() == "") {
        redgle.showMessage(translate.trans("请先填写需要翻译的内容！"));
        return
    }
    if (i = t.match(/\[[\u4E00-\u9FA5]{2,20}\]/g), i) for (r = 0; r < i.length; r++) t = t.replace(/\[[\u4E00-\u9FA5]{2,20}\]/, "{" + r + "}");
    u = [];
    $.ajax({
        url: "../BaiduTranslate/BaiduTranslateApi",
        type: "post",
        data: {
            query: t,
            from: "zh",
            to: "en"
        },
        success: function(t) {
            i ? $("#" + n).val(t.format(i)) : $("#" + n).val(t)
        },
        error: function(n) {
            redgle.showMessage(translate.trans("操作发生未知异常：{0} - {1}", [n.status, n.statusText]))
        }
    })
}
function keyTranslate(n, t, i, r, u) {
    var e = {
        to: u
    },
    o,
    h,
    v,
    l,
    f,
    a;
    for (n != "" && $("#" + n) && $("#" + n).val() && $("#" + n).val().length > 0 && $("#" + n).GoogleTranslate(e), t != "" && $("#" + t) && $("#" + t).val() && $("#" + t).val().length > 0 && $("#" + t).GoogleTranslate(e), o = $("input[id='CustomValue']"), h = o.length, f = 0; f < h; f++) v = o.eq(f).val(),
    setOtherAttrFy(h, f, v, o, e);
    if (r) i != "" && $("#" + i) && $("#" + i).GoogleTranslate(e);
    else {
        if (editortrans = editor1, !editortrans) return;
        $("#cacheDiv").length == 0 && $("body").append("<div style='display:none' id='cacheDiv'><\/div>");
        $("#cacheDiv").val(editortrans.html());
        detailT = transition()
    }
    if (!r) {
        var s = "|||",
        c = trimLabel(detailT, s),
        y = getTitle1(detailT, s, / [a-zA-Z0-9_-]+=("([^\"]*[\u4e00-\u9fa5]+.*?)"|'([^\']*[\u4e00-\u9fa5]+.*?)')/i);
        for (c = c + s + y, l = c.split(s), f = 0; f < l.length; f++) a = l[f],
        $.trim(a) != "" && setDetailTransate(a, e)
    }
}
function getTitle1(n, t, i) {
    for (var r = "",
    u; i.test(n);) u = RegExp.$1,
    n = n.replace(u, t),
    r = r == "" ? u: r + t + u;
    return r
}
function trimLabel(n, t) {
    for (var i;
    /(<.*?>)/i.test(n);) i = RegExp.$1,
    n = n.replace(i, t);
    return n
}
function showPic(n) {
    var i = $(n).attr("src"),
    r = "<div name ='mainPicShow' style='position: absolute; z-index:9999; border: 1px solid silver; background: #ffffff;width:300px;height:300px; line-height:300px'><img  style='width:100%;' src='" + i + "' /><\/div>",
    t = $(r).appendTo($("body"));
    t.css("top", $(n).offset().top - 250);
    t.css("left", $(n).offset().left + $(n).width() + 10)
}
function hidePic() {
    var n = $("body").find("[name=mainPicShow]");
    n != undefined && n.remove()
}
function SearchOptonRedgle() {
    var n = {
        templ: "",
        Droptempl: "",
        bindId: "listItem",
        bindDropId: "DropListItem",
        CallDelFun: function() {},
        CallUserFun: function() {},
        CallTabFun: function() {},
        CallExtendFun: function() {},
        BindUserData: function() {},
        EventMultiBtnFunc: function(n) {
            var f = $(this).parents(".sl-wrap"),
            c = $(this).parents(".sl-tab-cont-item"),
            e = $(c).find(" .J_valueList li[class*='selected']"),
            t,
            o,
            u,
            s;
            if (e.length > 0) {
                $("#J_crumbsBar").show();
                $(this).parents(".sl-tab-cont").length == 0 ? (t = $(f).find(".sl-key").attr("typeid"), o = $(f).find(".sl-key").text().trim().split(" ")[0]) : (t = $(f).find(".trig-curr").attr("typeid"), o = $(f).find(".trig-curr").text().trim() + ":");
                var r = "",
                i = "",
                h = "";
                for (u = 0; u < e.length; u++) r += $(e[u]).attr("id") + ",",
                i += $(e[u]).text().trim() + "、";
                r = r.substr(0, r.length - 1);
                i = i.substr(0, i.length - 1);
                maxnum = i.length > 20 ? 20 : i.length;
                h += i.substr(0, maxnum);
                s = ' <a class="crumb-select-item" typeid="' + t + '" href="javascript:;" title="' + i + '" atrrvalue="' + r + '"><b>' + o.split(" ")[0] + ":<\/b><em>" + h + "<\/em><i ><\/i><\/a> ";
                $(".crumbs-nav-main").find("[typeid='" + t + "']").length > 0 ? $(".crumbs-nav-main [typeid='" + t + "']").replaceWith(s) : $("#baritem").append(s);
                $(".crumb-select-item[typeid='" + t + "'] i").on("click", {
                    CallDelFun: n.data.CallDelFun,
                    typeId: t
                },
                n.data.DelFun);
                n.data.CallTabFun(t)
            }
        },
        BindDataUI: function(n, t, i, r, u, f, e, o, s) {
            var c = this.templ,
            h, v, l, a;
            if (f && f.length > 0 && (c = f), !c || c.length == 0) {
                console.log("模板未定义:Droptempl");
                return
            }
            h = {};
            v = "";
            h.SingleLineStr = "s-line ";
            h.isMoreLine = r;
            r && (h.SingleLineStr = "oc_select");
            l = "";
            l = u ? "multiples": "single";
            e = e ? e: !1;
            o = o ? o: !1;
            s || (s = "");
            h.TypeName = t;
            h.TypeId = i;
            h.listItem = n;
            h.isMultiple = u;
            h.isMultioleStr = l;
            h.hasSearch = e;
            h.isEdit = o;
            h.ClassName = s;
            a = doT.template(c);
            $("#" + this.bindId).append(a(h))
        },
        HasAndAddDropBox: function() {
            if ($("#J_selectorSenior").length == 0) {
                var n = '<div id="J_selectorSenior" class="J_selectorLine s-line s-senior">';
                n += ' <div class="sl-wrap"> <div class="sl-key"><span>高级选项<\/span><\/div> <div class="sl-value">';
                n += ' <div class="sl-v-tab"><div class="sl-tab-trigger clearfix">  <\/div><\/div><\/div>';
                n += '<div class="sl-tab-cont"><\/div> <\/div><\/div>';
                $("#" + this.bindDropId).append(n)
            }
        },
        BindDropDataUI: function(n, t, i, r, u, f, e, o) {
            var s = this.Droptempl,
            h, c, l, a;
            if (u && u.length > 0 && (s = u), !s || s.length == 0) {
                console.log("模板未定义:Droptempl");
                return
            }
            h = "";
            h = r ? "multiple": "single";
            f = f ? f: !1;
            o || (o = "");
            e = e ? e: !1;
            $(".trig-item[typeid='" + i + "'] ").length == 0 && (c = ' <a class="trig-item ' + h + ' " typeid="' + i + '"menutype="' + e + '"    href="javascript:;"><span class="text">', c += translate.format("<hg:trans>{0}<\/hg:trans>", [t]), c += ' <b><\/b><\/span><i class="arrow"><\/i><\/a>', $(".sl-v-tab .sl-tab-trigger").append(c), l = doT.template(s), a = {
                data: n,
                isMultiple: r,
                isMultioleStr: h,
                TypeId: i,
                hasSearch: f,
                isEdit: e,
                ClassName: o
            },
            $(".sl-tab-cont").append(l(a)))
        },
        DelFun: function(n) {
            var t = n.data.typeId,
            u = $("#" + t + "  li[class*='selected']").attr("class"),
            i,
            f,
            r;
            u && u.length > 0 && (i = "", t == "AccountUser" ? (i = $("#J_selector #" + t + " li[class*='selected']").attr("class").replace("J_active", ""), $("#" + t + " li[class*='selected']").attr("class", i)) : (i = $("#J_selector #" + t + " li[class*='selected'] a").attr("class"), i && i.length > 0 && (i = i.replace("J_active", ""), $("#" + t + " li[class*='selected'] a").attr("class", i))));
            f = $("#" + t + " li[class*='selected']").attr("class").replace("selected", "");
            $("#" + t + " li[class*='selected']").attr("class", f);
            $("a[typeid='" + t + "'] b").html("");
            $("#baritem a[typeid='" + t + "']").remove();
            r = $("#" + t).parents(".sl-tab-cont-item").find(".sl-btns .J_btnsConfirm");
            r && ($(r).hasClass("disabled") || $(r).addClass("disabled"));
            $(".crumbs-nav-main .crumb-select-item").length == 0 && $("#J_crumbsBar").hide();
            n.data.CallDelFun(t)
        },
        BeforeInit: function(n) {
            if (n == undefined && (n = !0), n && $(".trig-item[id='BtnSet'] ").length == 0) {
                var t = ' <a class="trig-item"  id="BtnSet"  href="javascript:;"><span class="text">';
                t += translate.format("<hg:trans>设置常用菜单<\/hg:trans>");
                t += " <b><\/b><\/span><\/a>";
                $(".sl-v-tab .sl-tab-trigger").append(t)
            }
        },
        initEvent: function(t) {
            var r = this.CallUserFun,
            f = this.EventMultiBtnFunc,
            e = this.CallTabFun,
            u = this.DelFun,
            i = this.CallDelFun,
            o = this.CallExtendFun;
            n.BeforeInit(t);
            $(".sl-e-more").on("click",
            function() {
                var t = !0,
                n = $(this).parents(".sl-wrap"),
                i;
                $(n).hasClass("extend") ? ($(this).html(translate.format("<hg:trans>更多<i><\/i><\/hg:trans>")), $(this).removeClass("opened"), $(n).removeClass("extend"), $(n).find(".J_valueList").attr("style", ""), t = !1) : ($(this).html(translate.format("<hg:trans>收起<i><\/i><\/hg:trans>")), $(n).addClass("extend "), $(this).addClass("opened"), $(n).find(".J_valueList").attr("style", "max-height:200px;overflow-y:auto;width:100%"), t = !0);
                i = $(n).find(".sl-value").attr("id");
                o(i, t)
            });
            $(".J_tabMultiple").on("click",
            function() {
                var n = $(this).parents(".sl-tab-cont-item");
                n.hasClass("multiple") || ($(n).addClass("multiple"), $(".trig-curr").addClass("multiple"))
            });
            $(".J_btnsCancel").on("click",
            function() {
                var n = $(this).parents(".sl-wrap");
                $(n).removeClass("multiple");
                $(".trig-curr").removeClass("multiple");
                $(n).find(".sl-ext").show()
            });
            $(".J_tabCancel").on("click",
            function() {
                var n = $("#J_selectorSenior .sl-v-tab .trig-curr");
                n.length > 0 && ($(n).parent().find(".trig-curr").removeClass("trig-curr"), $(n).removeClass("trig-curr"), $("#J_selector #" + $(n).attr("typeid")).hide());
                $(n).find(".sl-v-list").attr("style", "")
            });
            $(".trig-item[typeid]").on("click",
            function() {
                var n = $(this).parents(".sl-wrap"),
                t = $(this).attr("typeid");
                $(this).hasClass("trig-curr") ? ($(this).parent().find(".trig-curr").removeClass("trig-curr"), $(this).removeClass("trig-curr"), $("#J_selector #" + t).hide(), $(n).find(".sl-v-list .J_valueList").attr("style", "")) : ($(this).parent().find(".trig-curr").removeClass("trig-curr"), $(".sl-tab-cont .sl-tab-cont-item").hide(), $(".sl-v-tab .trig-item").removeClass("trig-curr"), $(this).addClass("trig-curr"), $("#J_selector #" + t).show(), $(n).find(".sl-v-list .J_valueList").attr("style", "max-height:350px;overflow-y:auto;width:100%;height:100%"))
            });
            $(document).on("click",
            function(n) {
                var t = $("#J_selectorSenior .sl-v-tab .trig-curr"),
                u = $(n.target).parent(),
                i = $(t).attr("typeid"),
                r = $("#J_selectorSenior .sl-v-tab .trig-curr");
                if (r.has(n.target).length === 0) {
                    if ($("#J_selector #" + i).has(n.target).length > 0) return;
                    t.length > 0 && ($(t).parent().find(".trig-curr").removeClass("trig-curr"), $(t).removeClass("trig-curr"), $("#J_selector #" + i).hide())
                }
            });
            $(".J_valueList a").on("click",
            function(n) {
                var f, l, c, b;
                if (n.preventDefault(), f = $(this).parents(".sl-wrap"), $(f).hasClass("SearchType")) {
                    r($(f).find(".sl-key").attr("typeid"), $(this).attr("id"));
                    return
                }
                var a = !1,
                e, v = "",
                t, w, y, p = !1;
                $(this).parents(".sl-tab-cont-item").length > 0 ? (a = $(this).parents(".sl-tab-cont-item").hasClass("multiple"), a ? ($(this).parent().hasClass("selected") ? $(this).parent().removeClass("selected") : ($(this).parent().addClass("selected"), p = !0), e = $(this).parents(".sl-tab-cont-item"), $(e).find(".selected").length > 0 ? $(e).find(".J_btnsConfirm").removeClass("disabled") : $(e).find(".J_btnsConfirm").addClass("disabled")) : (e = $(this).parents(".sl-v-list"), $(this).parent().hasClass("selected") ? ($(this).removeClass("J_active"), $(this).parent().removeClass("selected"), p = !0) : ($(e).find(" .J_valueList li[class*='selected'] a").removeClass("J_active"), $(e).find(" .J_valueList li[class*='selected']").removeClass("selected"), $(this).addClass("J_active"), $(this).parent().addClass("selected"))), t = $(f).find(".trig-curr").attr("typeid"), w = $(f).find(".trig-curr .text").text().trim().split(" ")[0] + "：", y = !0) : (t = $(f).find(".sl-key").attr("typeid"), e = $(this).parents(".sl-v-list"), $(f).hasClass("multiples") ? $(this).parent().hasClass("selected") ? ($(this).parent().removeClass("selected"), t == "AccountUser" ? $(this).parent().removeClass("J_active") : $(this).removeClass("J_active"), p = !0) : ($(this).parent().addClass("selected"), t == "AccountUser" ? $(this).parent().addClass("J_active") : $(this).addClass("J_active")) : $(this).parent().hasClass("selected") ? ($(this).removeClass("J_active"), $(this).parent().removeClass("J_active"), $(this).parent().removeClass("selected"), p = !0) : ($(e).find(" .J_valueList li[class*='selected'], .J_valueList li[class*='selected'] a ").removeClass("J_active"), $(e).find(".J_valueList li[class*='selected']").removeClass("selected"), $(this).parent().addClass("selected"), t == "AccountUser" ? $(this).parent().addClass("J_active") : $(this).addClass("J_active")), w = $(f).find(".sl-key").text().trim().split(" ")[0] + "：");
                var h = "",
                o = "",
                k = "",
                s = $(e).find(" .J_valueList li[class*='selected']");
                if (s.length > 0) {
                    for (l = 0; l < s.length; l++) h += $(s[l]).attr("id") + ",",
                    o += $(s[l]).text().trim() + "、";
                    if (h = h.substr(0, h.length - 1), o = o.substr(0, o.length - 1), y) {
                        if (s.length > 1 ? v = "&nbsp; 已选：" + s.length: s.length == 1 ? (c = $(s[0]).text().trim(), c = c.length > 10 ? c.substr(0, 10) + "…": c, v = "&nbsp;" + c) : v = "", $(f).find(".trig-curr b").html(v), a) return
                    } else $("#J_crumbsBar").show();
                    if (!$(f).hasClass("NoEvent")) {
                        maxnum = o.length > 20 ? 20 : o.length;
                        k += o.substr(0, maxnum);
                        b = ' <a class="crumb-select-item" typeid="' + t + '" href="javascript:;" title="' + o + '" atrrvalue="' + h + '"><b>' + w + "<\/b><em>" + k + "<\/em><i><\/i><\/a> ";
                        $(".crumbs-nav-main").find("[typeid='" + t + "']").length > 0 ? $(".crumbs-nav-main [typeid='" + t + "']").replaceWith(b) : $("#baritem").append(b);
                        $(".crumb-select-item[typeid='" + t + "'] i").on("click", {
                            CallDelFun: i,
                            typeId: t
                        },
                        u)
                    }
                } else y && $(f).find(".trig-curr b").html(""),
                $(".crumbs-nav-main [typeid='" + t + "']").remove();
                $(".crumb-select-item").length == 0 ? $("#J_crumbsBar").hide() : $("#J_crumbsBar").show();
                y && a || r(t, h)
            });
            $(".J_btnsConfirm").on("click", {
                CallTabFun: e,
                CallDelFun: i,
                DelFun: u
            },
            f);
            $(".JClear").on("click",
            function() {
                var n = $(this).attr("typeid"),
                t;
                $("#J_selector #" + n + " li[class*='selected'] a").attr("class", " ");
                $("#J_selector #" + n + " li[class*='selected']").attr("class", " ");
                $("a[typeid='" + n + "'] b").html("");
                $("#baritem a[typeid='" + n + "']").remove();
                $(".crumbs-nav-main .crumb-select-item").length == 0 && $("#J_crumbsBar").hide();
                t = $(this).parent().find(".J_btnsConfirm");
                $(t).hasClass("disabled") || $(t).addClass("disabled");
                i(n)
            });
            $(".MenuSearchInfoBtn").on("click",
            function() {
                var t = $(this).parent().find("input").val().trim(),
                n = $(this).parents(".sl-v-list");
                if (t.length > 0) {
                    if ($(n).find(".J_valueList li a[title*='" + t + "']").length == 0) {
                        alert(translate.format("<hg:trans>{0}<\/hg:trans>", ["未搜索到查询结果"]));
                        return
                    }
                    $(n).find(".J_valueList li").hide();
                    $(n).find(".J_valueList li a[title*='" + t + "']").parent().show()
                } else $(n).find(".J_valueList li").show()
            });
            $("#BtnSet").on("click",
            function() {
                var n = [],
                t;
                $("#J_selector .sl-wrap[menutype='true']").each(function() {
                    var t = {
                        typeid: $(this).find(".sl-key").attr("typeid"),
                        typeName: $(this).find(".sl-key ").text().replace("：", ""),
                        isExtend: !0
                    };
                    n.push(t)
                });
                $("#DropListItem .trig-item[menutype='true']").each(function() {
                    var t = {
                        typeid: $(this).attr("typeid"),
                        typeName: $(this).find(".text ").text().trim(),
                        isExtend: !1
                    };
                    n.push(t)
                });
                t = doT.template($("#SetMenuTempl").html());
                $("#SearchMenuModal .modal-body").html(t(n));
                $("#SearchMenuModal .modal-body input[type='checkbox']:checked").length > 2 && $("#SearchMenuModal .modal-body input:not(:checked)").each(function() {
                    $(this).attr("disabled", "disabled ")
                });
                $("#SearchMenuModal .modal-body input[type='checkbox']").on("click",
                function() {
                    $("#SearchMenuModal .modal-body input[type='checkbox']:checked").length > 2 ? $("#SearchMenuModal .modal-body input:not(:checked)").each(function() {
                        $(this).attr("disabled", "disabled")
                    }) : $("#SearchMenuModal .modal-body input").removeAttr("disabled")
                });
                $("#SearchMenuModal").modal({
                    keyboard: !1
                })
            })
        }
    };
    return n.HasAndAddDropBox(),
    n
}
function enterMenuSearch(n) {
    var r = window.event || arguments.callee.caller.arguments[0],
    i,
    t;
    if (r.keyCode == 13) if (i = $(n).val().trim(), t = $(n).parents(".sl-v-list"), i.length > 0) {
        if ($(t).find(".J_valueList li a[title*='" + i + "']").length == 0) {
            alert(translate.format("<hg:trans>{0}<\/hg:trans>", ["未搜索到查询结果"]));
            return
        }
        $(t).find(".J_valueList li").hide();
        $(t).find(".J_valueList li a[title*='" + i + "']").parent().show()
    } else $(t).find(".J_valueList li").show()
}
function checkNum(n) {
    return n.match(/\D/) == null
}
function checkDecimal(n) {
    return n.match(/^-?\d+(\.\d+)?$/g) == null ? !1 : !0
}
function checkInteger(n) {
    return n.match(/^[-+]?\d*$/) == null ? !1 : !0
}
function checkInt(n) {
    return n.match(/(^[0-9]\d*$)/) == null ? !1 : !0
}
function checkStr(n) {
    return /[^\x00-\xff]/g.test(n) ? !1 : !0
}
function checkChinese(n) {
    return escape(n).indexOf("%u") != -1 ? !0 : !1
}
function checkEmail(n) {
    return n.match(/^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_.-])+/) == null ? !1 : !0
}
function checkMobilePhone(n) {
    return n.match(/^0?[0-9]{11}$/) == null ? !1 : !0
}
function checkTelephone(n) {
    return n.match(/^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/) == null ? !1 : !0
}
function checkQQ(n) {
    return n.match(/^\d{5,10}$/) == null ? !1 : !0
}
function checkIdCard(n) {
    return n.match(/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/) == null && n.match(/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[A-Z])$/) == null ? !1 : !0
}
function checkIP(n) {
    return n.match(/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/) == null ? !1 : !0
}
function checkURL(n) {
    return n.match("[a-zA-z]+://[^s]*") == null ? !1 : !0
}
function checkPersonalBank(n) {
    return checkInteger(n) == !1 ? !1 : n.length > 15 && n.length < 20 ? !0 : !1
}
function checkQuote(n) {
    var t = ["~", "`", "!", "@", "#", "$", "%", "^", "&", "*", "{", "}", "[", "]", "(", ")"],
    i;
    for (t.push(":", ";", "'", "|", "\\", "<", ">", "?", "/", "<<", ">>", "||", "//"), t.push("select", "delete", "update", "insert", "create", "drop", "alter", "trancate"), n = n.toLowerCase(), i = 0; i < t.length; i++) if (n.indexOf(t[i]) >= 0) return ! 0;
    return ! 1
}
function checkEnterpriseCode(n) {
    return checkQuote(n) ? !0 : n.match(/^[a-zA-Z]{1}[a-zA-Z0-9_]*$/) == null ? !0 : !1
}
function trim(n) {
    return n.replace(/(^\s*)|(\s*$)/g, "")
}
function checkDate(n) {
    var t = n.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/),
    i;
    return t == null ? !1 : (i = new Date(t[1], t[3] - 1, t[4]), i.getFullYear() == t[1] && i.getMonth() + 1 == t[3] && i.getDate() == t[4])
}
function checkTime(n) {
    var t = n.match(/^(\d{1,2})(:)?(\d{1,2})\2(\d{1,2})$/);
    return t == null ? !1 : t[1] > 24 || t[3] > 60 || t[4] > 60 ? !1 : !0
}
function checkFullTime(n) {
    var t = n.match(/^(?:19|20)[0-9][0-9]-(?:(?:0[1-9])|(?:1[0-2]))-(?:(?:[0-2][1-9])|(?:[1-3][0-1])) (?:(?:[0-2][0-3])|(?:[0-1][0-9])):[0-5][0-9]:[0-5][0-9]$/);
    return t == null ? !1 : !0
}
function IdCardValidate(n) {
    if (n = trim(n.replace(/ /g, "")), n.length == 15) return isValidityBrithBy15IdCard(n);
    if (n.length == 18) {
        var t = n.split("");
        return isValidityBrithBy18IdCard(n) && isTrueValidateCodeBy18IdCard(t) ? !0 : !1
    }
    return ! 1
}
function isTrueValidateCodeBy18IdCard(n) {
    var i = 0,
    t;
    for (n[17].toLowerCase() == "x" && (n[17] = 10), t = 0; t < 17; t++) i += Wi[t] * n[t];
    return valCodePosition = i % 11,
    n[17] == ValideCode[valCodePosition] ? !0 : !1
}
function maleOrFemalByIdCard(n) {
    return n = trim(n.replace(/ /g, "")),
    n.length == 15 ? n.substring(14, 15) % 2 == 0 ? "female": "male": n.length == 18 ? n.substring(14, 17) % 2 == 0 ? "female": "male": null
}
function isValidityBrithBy18IdCard(n) {
    var i = n.substring(6, 10),
    r = n.substring(10, 12),
    u = n.substring(12, 14),
    t = new Date(i, parseFloat(r) - 1, parseFloat(u));
    return t.getFullYear() != parseFloat(i) || t.getMonth() != parseFloat(r) - 1 || t.getDate() != parseFloat(u) ? !1 : !0
}
function isValidityBrithBy15IdCard(n) {
    var i = n.substring(6, 8),
    r = n.substring(8, 10),
    u = n.substring(10, 12),
    t = new Date(i, parseFloat(r) - 1, parseFloat(u));
    return t.getYear() != parseFloat(i) || t.getMonth() != parseFloat(r) - 1 || t.getDate() != parseFloat(u) ? !1 : !0
}
var GoogleTranslateText, setDetailTransate, setOtherAttrFy, setting, Wi, ValideCode;
if (!
function(n, t) {
    "object" == typeof module && "object" == typeof module.exports ? module.exports = n.document ? t(n, !0) : function(n) {
        if (!n.document) throw new Error("jQuery requires a window with a document");
        return t(n)
    }: t(n)
} ("undefined" != typeof window ? window: this,
function(n, t) {
    function ri(n) {
        var t = n.length,
        r = i.type(n);
        return "function" === r || i.isWindow(n) ? !1 : 1 === n.nodeType && t ? !0 : "array" === r || 0 === t || "number" == typeof t && t > 0 && t - 1 in n
    }
    function ui(n, t, r) {
        if (i.isFunction(t)) return i.grep(n,
        function(n, i) {
            return !! t.call(n, i, n) !== r
        });
        if (t.nodeType) return i.grep(n,
        function(n) {
            return n === t !== r
        });
        if ("string" == typeof t) {
            if (ef.test(t)) return i.filter(t, n, r);
            t = i.filter(t, n)
        }
        return i.grep(n,
        function(n) {
            return ft.call(t, n) >= 0 !== r
        })
    }
    function ur(n, t) {
        while ((n = n[t]) && 1 !== n.nodeType);
        return n
    }
    function of(n) {
        var t = fi[n] = {};
        return i.each(n.match(c) || [],
        function(n, i) {
            t[i] = !0
        }),
        t
    }
    function ht() {
        u.removeEventListener("DOMContentLoaded", ht, !1);
        n.removeEventListener("load", ht, !1);
        i.ready()
    }
    function v() {
        Object.defineProperty(this.cache = {},
        0, {
            get: function() {
                return {}
            }
        });
        this.expando = i.expando + v.uid++
    }
    function fr(n, t, r) {
        var u;
        if (void 0 === r && 1 === n.nodeType) if (u = "data-" + t.replace(hf, "-$1").toLowerCase(), r = n.getAttribute(u), "string" == typeof r) {
            try {
                r = "true" === r ? !0 : "false" === r ? !1 : "null" === r ? null: +r + "" === r ? +r: sf.test(r) ? i.parseJSON(r) : r
            } catch(f) {}
            e.set(n, t, r)
        } else r = void 0;
        return r
    }
    function lt() {
        return ! 0
    }
    function k() {
        return ! 1
    }
    function hr() {
        try {
            return u.activeElement
        } catch(n) {}
    }
    function vr(n, t) {
        return i.nodeName(n, "table") && i.nodeName(11 !== t.nodeType ? t: t.firstChild, "tr") ? n.getElementsByTagName("tbody")[0] || n.appendChild(n.ownerDocument.createElement("tbody")) : n
    }
    function bf(n) {
        return n.type = (null !== n.getAttribute("type")) + "/" + n.type,
        n
    }
    function kf(n) {
        var t = pf.exec(n.type);
        return t ? n.type = t[1] : n.removeAttribute("type"),
        n
    }
    function ei(n, t) {
        for (var i = 0,
        u = n.length; u > i; i++) r.set(n[i], "globalEval", !t || r.get(t[i], "globalEval"))
    }
    function yr(n, t) {
        var u, c, f, s, h, l, a, o;
        if (1 === t.nodeType) {
            if (r.hasData(n) && (s = r.access(n), h = r.set(t, s), o = s.events)) {
                delete h.handle;
                h.events = {};
                for (f in o) for (u = 0, c = o[f].length; c > u; u++) i.event.add(t, f, o[f][u])
            }
            e.hasData(n) && (l = e.access(n), a = i.extend({},
            l), e.set(t, a))
        }
    }
    function o(n, t) {
        var r = n.getElementsByTagName ? n.getElementsByTagName(t || "*") : n.querySelectorAll ? n.querySelectorAll(t || "*") : [];
        return void 0 === t || t && i.nodeName(n, t) ? i.merge([n], r) : r
    }
    function df(n, t) {
        var i = t.nodeName.toLowerCase();
        "input" === i && er.test(n.type) ? t.checked = n.checked: ("input" === i || "textarea" === i) && (t.defaultValue = n.defaultValue)
    }
    function pr(t, r) {
        var f, u = i(r.createElement(t)).appendTo(r.body),
        e = n.getDefaultComputedStyle && (f = n.getDefaultComputedStyle(u[0])) ? f.display: i.css(u[0], "display");
        return u.detach(),
        e
    }
    function si(n) {
        var r = u,
        t = oi[n];
        return t || (t = pr(n, r), "none" !== t && t || (at = (at || i("<iframe frameborder='0' width='0' height='0'/>")).appendTo(r.documentElement), r = at[0].contentDocument, r.write(), r.close(), t = pr(n, r), at.detach()), oi[n] = t),
        t
    }
    function it(n, t, r) {
        var e, o, s, u, f = n.style;
        return r = r || vt(n),
        r && (u = r.getPropertyValue(t) || r[t]),
        r && ("" !== u || i.contains(n.ownerDocument, n) || (u = i.style(n, t)), hi.test(u) && wr.test(t) && (e = f.width, o = f.minWidth, s = f.maxWidth, f.minWidth = f.maxWidth = f.width = u, u = r.width, f.width = e, f.minWidth = o, f.maxWidth = s)),
        void 0 !== u ? u + "": u
    }
    function br(n, t) {
        return {
            get: function() {
                return n() ? void delete this.get: (this.get = t).apply(this, arguments)
            }
        }
    }
    function gr(n, t) {
        if (t in n) return t;
        for (var r = t[0].toUpperCase() + t.slice(1), u = t, i = dr.length; i--;) if (t = dr[i] + r, t in n) return t;
        return u
    }
    function nu(n, t, i) {
        var r = ne.exec(t);
        return r ? Math.max(0, r[1] - (i || 0)) + (r[2] || "px") : t
    }
    function tu(n, t, r, u, f) {
        for (var e = r === (u ? "border": "content") ? 4 : "width" === t ? 1 : 0, o = 0; 4 > e; e += 2)"margin" === r && (o += i.css(n, r + p[e], !0, f)),
        u ? ("content" === r && (o -= i.css(n, "padding" + p[e], !0, f)), "margin" !== r && (o -= i.css(n, "border" + p[e] + "Width", !0, f))) : (o += i.css(n, "padding" + p[e], !0, f), "padding" !== r && (o += i.css(n, "border" + p[e] + "Width", !0, f)));
        return o
    }
    function iu(n, t, r) {
        var o = !0,
        u = "width" === t ? n.offsetWidth: n.offsetHeight,
        e = vt(n),
        s = "border-box" === i.css(n, "boxSizing", !1, e);
        if (0 >= u || null == u) {
            if (u = it(n, t, e), (0 > u || null == u) && (u = n.style[t]), hi.test(u)) return u;
            o = s && (f.boxSizingReliable() || u === n.style[t]);
            u = parseFloat(u) || 0
        }
        return u + tu(n, t, r || (s ? "border": "content"), o, e) + "px"
    }
    function ru(n, t) {
        for (var e, u, s, o = [], f = 0, h = n.length; h > f; f++) u = n[f],
        u.style && (o[f] = r.get(u, "olddisplay"), e = u.style.display, t ? (o[f] || "none" !== e || (u.style.display = ""), "" === u.style.display && tt(u) && (o[f] = r.access(u, "olddisplay", si(u.nodeName)))) : (s = tt(u), "none" === e && s || r.set(u, "olddisplay", s ? e: i.css(u, "display"))));
        for (f = 0; h > f; f++) u = n[f],
        u.style && (t && "none" !== u.style.display && "" !== u.style.display || (u.style.display = t ? o[f] || "": "none"));
        return n
    }
    function s(n, t, i, r, u) {
        return new s.prototype.init(n, t, i, r, u)
    }
    function fu() {
        return setTimeout(function() {
            d = void 0
        }),
        d = i.now()
    }
    function wt(n, t) {
        var r, u = 0,
        i = {
            height: n
        };
        for (t = t ? 1 : 0; 4 > u; u += 2 - t) r = p[u],
        i["margin" + r] = i["padding" + r] = n;
        return t && (i.opacity = i.width = n),
        i
    }
    function eu(n, t, i) {
        for (var u, f = (rt[t] || []).concat(rt["*"]), r = 0, e = f.length; e > r; r++) if (u = f[r].call(i, t, n)) return u
    }
    function fe(n, t, u) {
        var f, a, p, v, o, w, h, b, l = this,
        y = {},
        s = n.style,
        c = n.nodeType && tt(n),
        e = r.get(n, "fxshow");
        u.queue || (o = i._queueHooks(n, "fx"), null == o.unqueued && (o.unqueued = 0, w = o.empty.fire, o.empty.fire = function() {
            o.unqueued || w()
        }), o.unqueued++, l.always(function() {
            l.always(function() {
                o.unqueued--;
                i.queue(n, "fx").length || o.empty.fire()
            })
        }));
        1 === n.nodeType && ("height" in t || "width" in t) && (u.overflow = [s.overflow, s.overflowX, s.overflowY], h = i.css(n, "display"), b = "none" === h ? r.get(n, "olddisplay") || si(n.nodeName) : h, "inline" === b && "none" === i.css(n, "float") && (s.display = "inline-block"));
        u.overflow && (s.overflow = "hidden", l.always(function() {
            s.overflow = u.overflow[0];
            s.overflowX = u.overflow[1];
            s.overflowY = u.overflow[2]
        }));
        for (f in t) if (a = t[f], re.exec(a)) {
            if (delete t[f], p = p || "toggle" === a, a === (c ? "hide": "show")) {
                if ("show" !== a || !e || void 0 === e[f]) continue;
                c = !0
            }
            y[f] = e && e[f] || i.style(n, f)
        } else h = void 0;
        if (i.isEmptyObject(y))"inline" === ("none" === h ? si(n.nodeName) : h) && (s.display = h);
        else {
            e ? "hidden" in e && (c = e.hidden) : e = r.access(n, "fxshow", {});
            p && (e.hidden = !c);
            c ? i(n).show() : l.done(function() {
                i(n).hide()
            });
            l.done(function() {
                var t;
                r.remove(n, "fxshow");
                for (t in y) i.style(n, t, y[t])
            });
            for (f in y) v = eu(c ? e[f] : 0, f, l),
            f in e || (e[f] = v.start, c && (v.end = v.start, v.start = "width" === f || "height" === f ? 1 : 0))
        }
    }
    function ee(n, t) {
        var r, f, e, u, o;
        for (r in n) if (f = i.camelCase(r), e = t[f], u = n[r], i.isArray(u) && (e = u[1], u = n[r] = u[0]), r !== f && (n[f] = u, delete n[r]), o = i.cssHooks[f], o && "expand" in o) {
            u = o.expand(u);
            delete n[f];
            for (r in u) r in n || (n[r] = u[r], t[r] = e)
        } else t[f] = e
    }
    function ou(n, t, r) {
        var h, e, o = 0,
        l = pt.length,
        f = i.Deferred().always(function() {
            delete c.elem
        }),
        c = function() {
            if (e) return ! 1;
            for (var s = d || fu(), t = Math.max(0, u.startTime + u.duration - s), h = t / u.duration || 0, i = 1 - h, r = 0, o = u.tweens.length; o > r; r++) u.tweens[r].run(i);
            return f.notifyWith(n, [u, i, t]),
            1 > i && o ? t: (f.resolveWith(n, [u]), !1)
        },
        u = f.promise({
            elem: n,
            props: i.extend({},
            t),
            opts: i.extend(!0, {
                specialEasing: {}
            },
            r),
            originalProperties: t,
            originalOptions: r,
            startTime: d || fu(),
            duration: r.duration,
            tweens: [],
            createTween: function(t, r) {
                var f = i.Tween(n, u.opts, t, r, u.opts.specialEasing[t] || u.opts.easing);
                return u.tweens.push(f),
                f
            },
            stop: function(t) {
                var i = 0,
                r = t ? u.tweens.length: 0;
                if (e) return this;
                for (e = !0; r > i; i++) u.tweens[i].run(1);
                return t ? f.resolveWith(n, [u, t]) : f.rejectWith(n, [u, t]),
                this
            }
        }),
        s = u.props;
        for (ee(s, u.opts.specialEasing); l > o; o++) if (h = pt[o].call(u, n, s, u.opts)) return h;
        return i.map(s, eu, u),
        i.isFunction(u.opts.start) && u.opts.start.call(n, u),
        i.fx.timer(i.extend(c, {
            elem: n,
            anim: u,
            queue: u.opts.queue
        })),
        u.progress(u.opts.progress).done(u.opts.done, u.opts.complete).fail(u.opts.fail).always(u.opts.always)
    }
    function pu(n) {
        return function(t, r) {
            "string" != typeof t && (r = t, t = "*");
            var u, f = 0,
            e = t.toLowerCase().match(c) || [];
            if (i.isFunction(r)) while (u = e[f++])"+" === u[0] ? (u = u.slice(1) || "*", (n[u] = n[u] || []).unshift(r)) : (n[u] = n[u] || []).push(r)
        }
    }
    function wu(n, t, r, u) {
        function e(s) {
            var h;
            return f[s] = !0,
            i.each(n[s] || [],
            function(n, i) {
                var s = i(t, r, u);
                return "string" != typeof s || o || f[s] ? o ? !(h = s) : void 0 : (t.dataTypes.unshift(s), e(s), !1)
            }),
            h
        }
        var f = {},
        o = n === ci;
        return e(t.dataTypes[0]) || !f["*"] && e("*")
    }
    function ai(n, t) {
        var r, u, f = i.ajaxSettings.flatOptions || {};
        for (r in t) void 0 !== t[r] && ((f[r] ? n: u || (u = {}))[r] = t[r]);
        return u && i.extend(!0, n, u),
        n
    }
    function ae(n, t, i) {
        for (var e, u, f, o, s = n.contents,
        r = n.dataTypes;
        "*" === r[0];) r.shift(),
        void 0 === e && (e = n.mimeType || t.getResponseHeader("Content-Type"));
        if (e) for (u in s) if (s[u] && s[u].test(e)) {
            r.unshift(u);
            break
        }
        if (r[0] in i) f = r[0];
        else {
            for (u in i) {
                if (!r[0] || n.converters[u + " " + r[0]]) {
                    f = u;
                    break
                }
                o || (o = u)
            }
            f = f || o
        }
        if (f) return (f !== r[0] && r.unshift(f), i[f])
    }
    function ve(n, t, i, r) {
        var h, u, f, s, e, o = {},
        c = n.dataTypes.slice();
        if (c[1]) for (f in n.converters) o[f.toLowerCase()] = n.converters[f];
        for (u = c.shift(); u;) if (n.responseFields[u] && (i[n.responseFields[u]] = t), !e && r && n.dataFilter && (t = n.dataFilter(t, n.dataType)), e = u, u = c.shift()) if ("*" === u) u = e;
        else if ("*" !== e && e !== u) {
            if (f = o[e + " " + u] || o["* " + u], !f) for (h in o) if (s = h.split(" "), s[1] === u && (f = o[e + " " + s[0]] || o["* " + s[0]])) {
                f === !0 ? f = o[h] : o[h] !== !0 && (u = s[0], c.unshift(s[1]));
                break
            }
            if (f !== !0) if (f && n.throws) t = f(t);
            else try {
                t = f(t)
            } catch(l) {
                return {
                    state: "parsererror",
                    error: f ? l: "No conversion from " + e + " to " + u
                }
            }
        }
        return {
            state: "success",
            data: t
        }
    }
    function vi(n, t, r, u) {
        var f;
        if (i.isArray(t)) i.each(t,
        function(t, i) {
            r || pe.test(n) ? u(n, i) : vi(n + "[" + ("object" == typeof i ? t: "") + "]", i, r, u)
        });
        else if (r || "object" !== i.type(t)) u(n, t);
        else for (f in t) vi(n + "[" + f + "]", t[f], r, u)
    }
    function ku(n) {
        return i.isWindow(n) ? n: 9 === n.nodeType && n.defaultView
    }
    var w = [],
    a = w.slice,
    bi = w.concat,
    ti = w.push,
    ft = w.indexOf,
    et = {},
    nf = et.toString,
    ii = et.hasOwnProperty,
    f = {},
    u = n.document,
    ki = "2.1.3",
    i = function(n, t) {
        return new i.fn.init(n, t)
    },
    tf = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
    rf = /^-ms-/,
    uf = /-([\da-z])/gi,
    ff = function(n, t) {
        return t.toUpperCase()
    },
    y,
    ot,
    nr,
    tr,
    ir,
    rr,
    c,
    fi,
    st,
    l,
    b,
    at,
    oi,
    oe,
    su,
    g,
    hu,
    bt,
    cu,
    kt,
    dt,
    yi,
    ni,
    pi,
    wi,
    du,
    gu;
    i.fn = i.prototype = {
        jquery: ki,
        constructor: i,
        selector: "",
        length: 0,
        toArray: function() {
            return a.call(this)
        },
        get: function(n) {
            return null != n ? 0 > n ? this[n + this.length] : this[n] : a.call(this)
        },
        pushStack: function(n) {
            var t = i.merge(this.constructor(), n);
            return t.prevObject = this,
            t.context = this.context,
            t
        },
        each: function(n, t) {
            return i.each(this, n, t)
        },
        map: function(n) {
            return this.pushStack(i.map(this,
            function(t, i) {
                return n.call(t, i, t)
            }))
        },
        slice: function() {
            return this.pushStack(a.apply(this, arguments))
        },
        first: function() {
            return this.eq(0)
        },
        last: function() {
            return this.eq( - 1)
        },
        eq: function(n) {
            var i = this.length,
            t = +n + (0 > n ? i: 0);
            return this.pushStack(t >= 0 && i > t ? [this[t]] : [])
        },
        end: function() {
            return this.prevObject || this.constructor(null)
        },
        push: ti,
        sort: w.sort,
        splice: w.splice
    };
    i.extend = i.fn.extend = function() {
        var e, f, r, t, o, s, n = arguments[0] || {},
        u = 1,
        c = arguments.length,
        h = !1;
        for ("boolean" == typeof n && (h = n, n = arguments[u] || {},
        u++), "object" == typeof n || i.isFunction(n) || (n = {}), u === c && (n = this, u--); c > u; u++) if (null != (e = arguments[u])) for (f in e) r = n[f],
        t = e[f],
        n !== t && (h && t && (i.isPlainObject(t) || (o = i.isArray(t))) ? (o ? (o = !1, s = r && i.isArray(r) ? r: []) : s = r && i.isPlainObject(r) ? r: {},
        n[f] = i.extend(h, s, t)) : void 0 !== t && (n[f] = t));
        return n
    };
    i.extend({
        expando: "jQuery" + (ki + Math.random()).replace(/\D/g, ""),
        isReady: !0,
        error: function(n) {
            throw new Error(n);
        },
        noop: function() {},
        isFunction: function(n) {
            return "function" === i.type(n)
        },
        isArray: Array.isArray,
        isWindow: function(n) {
            return null != n && n === n.window
        },
        isNumeric: function(n) {
            return ! i.isArray(n) && n - parseFloat(n) + 1 >= 0
        },
        isPlainObject: function(n) {
            return "object" !== i.type(n) || n.nodeType || i.isWindow(n) ? !1 : n.constructor && !ii.call(n.constructor.prototype, "isPrototypeOf") ? !1 : !0
        },
        isEmptyObject: function(n) {
            for (var t in n) return ! 1;
            return ! 0
        },
        type: function(n) {
            return null == n ? n + "": "object" == typeof n || "function" == typeof n ? et[nf.call(n)] || "object": typeof n
        },
        globalEval: function(n) {
            var t, r = eval;
            n = i.trim(n);
            n && (1 === n.indexOf("use strict") ? (t = u.createElement("script"), t.text = n, u.head.appendChild(t).parentNode.removeChild(t)) : r(n))
        },
        camelCase: function(n) {
            return n.replace(rf, "ms-").replace(uf, ff)
        },
        nodeName: function(n, t) {
            return n.nodeName && n.nodeName.toLowerCase() === t.toLowerCase()
        },
        each: function(n, t, i) {
            var u, r = 0,
            f = n.length,
            e = ri(n);
            if (i) {
                if (e) {
                    for (; f > r; r++) if (u = t.apply(n[r], i), u === !1) break
                } else for (r in n) if (u = t.apply(n[r], i), u === !1) break
            } else if (e) {
                for (; f > r; r++) if (u = t.call(n[r], r, n[r]), u === !1) break
            } else for (r in n) if (u = t.call(n[r], r, n[r]), u === !1) break;
            return n
        },
        trim: function(n) {
            return null == n ? "": (n + "").replace(tf, "")
        },
        makeArray: function(n, t) {
            var r = t || [];
            return null != n && (ri(Object(n)) ? i.merge(r, "string" == typeof n ? [n] : n) : ti.call(r, n)),
            r
        },
        inArray: function(n, t, i) {
            return null == t ? -1 : ft.call(t, n, i)
        },
        merge: function(n, t) {
            for (var u = +t.length,
            i = 0,
            r = n.length; u > i; i++) n[r++] = t[i];
            return n.length = r,
            n
        },
        grep: function(n, t, i) {
            for (var u, f = [], r = 0, e = n.length, o = !i; e > r; r++) u = !t(n[r], r),
            u !== o && f.push(n[r]);
            return f
        },
        map: function(n, t, i) {
            var u, r = 0,
            e = n.length,
            o = ri(n),
            f = [];
            if (o) for (; e > r; r++) u = t(n[r], r, i),
            null != u && f.push(u);
            else for (r in n) u = t(n[r], r, i),
            null != u && f.push(u);
            return bi.apply([], f)
        },
        guid: 1,
        proxy: function(n, t) {
            var u, f, r;
            return "string" == typeof t && (u = n[t], t = n, n = u),
            i.isFunction(n) ? (f = a.call(arguments, 2), r = function() {
                return n.apply(t || this, f.concat(a.call(arguments)))
            },
            r.guid = n.guid = n.guid || i.guid++, r) : void 0
        },
        now: Date.now,
        support: f
    });
    i.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),
    function(n, t) {
        et["[object " + t + "]"] = t.toLowerCase()
    });
    y = function(n) {
        function r(n, t, i, r) {
            var p, s, a, c, w, y, d, v, nt, g;
            if ((t ? t.ownerDocument || t: h) !== o && k(t), t = t || o, i = i || [], c = t.nodeType, "string" != typeof n || !n || 1 !== c && 9 !== c && 11 !== c) return i;
            if (!r && l) {
                if (11 !== c && (p = hr.exec(n))) if (a = p[1]) {
                    if (9 === c) {
                        if (s = t.getElementById(a), !s || !s.parentNode) return i;
                        if (s.id === a) return i.push(s),
                        i
                    } else if (t.ownerDocument && (s = t.ownerDocument.getElementById(a)) && et(t, s) && s.id === a) return i.push(s),
                    i
                } else {
                    if (p[2]) return b.apply(i, t.getElementsByTagName(n)),
                    i;
                    if ((a = p[3]) && u.getElementsByClassName) return b.apply(i, t.getElementsByClassName(a)),
                    i
                }
                if (u.qsa && (!e || !e.test(n))) {
                    if (v = d = f, nt = t, g = 1 !== c && n, 1 === c && "object" !== t.nodeName.toLowerCase()) {
                        for (y = ft(n), (d = t.getAttribute("id")) ? v = d.replace(cr, "\\$&") : t.setAttribute("id", v), v = "[id='" + v + "'] ", w = y.length; w--;) y[w] = v + vt(y[w]);
                        nt = dt.test(n) && ti(t.parentNode) || t;
                        g = y.join(",")
                    }
                    if (g) try {
                        return b.apply(i, nt.querySelectorAll(g)),
                        i
                    } catch(tt) {} finally {
                        d || t.removeAttribute("id")
                    }
                }
            }
            return oi(n.replace(lt, "$1"), t, i, r)
        }
        function gt() {
            function n(r, u) {
                return i.push(r + " ") > t.cacheLength && delete n[i.shift()],
                n[r + " "] = u
            }
            var i = [];
            return n
        }
        function c(n) {
            return n[f] = !0,
            n
        }
        function v(n) {
            var t = o.createElement("div");
            try {
                return !! n(t)
            } catch(i) {
                return ! 1
            } finally {
                t.parentNode && t.parentNode.removeChild(t);
                t = null
            }
        }
        function ni(n, i) {
            for (var u = n.split("|"), r = n.length; r--;) t.attrHandle[u[r]] = i
        }
        function wi(n, t) {
            var i = t && n,
            r = i && 1 === n.nodeType && 1 === t.nodeType && (~t.sourceIndex || li) - (~n.sourceIndex || li);
            if (r) return r;
            if (i) while (i = i.nextSibling) if (i === t) return - 1;
            return n ? 1 : -1
        }
        function lr(n) {
            return function(t) {
                var i = t.nodeName.toLowerCase();
                return "input" === i && t.type === n
            }
        }
        function ar(n) {
            return function(t) {
                var i = t.nodeName.toLowerCase();
                return ("input" === i || "button" === i) && t.type === n
            }
        }
        function tt(n) {
            return c(function(t) {
                return t = +t,
                c(function(i, r) {
                    for (var u, f = n([], i.length, t), e = f.length; e--;) i[u = f[e]] && (i[u] = !(r[u] = i[u]))
                })
            })
        }
        function ti(n) {
            return n && "undefined" != typeof n.getElementsByTagName && n
        }
        function bi() {}
        function vt(n) {
            for (var t = 0,
            r = n.length,
            i = ""; r > t; t++) i += n[t].value;
            return i
        }
        function ii(n, t, i) {
            var r = t.dir,
            u = i && "parentNode" === r,
            e = ki++;
            return t.first ?
            function(t, i, f) {
                while (t = t[r]) if (1 === t.nodeType || u) return n(t, i, f)
            }: function(t, i, o) {
                var s, h, c = [a, e];
                if (o) {
                    while (t = t[r]) if ((1 === t.nodeType || u) && n(t, i, o)) return ! 0
                } else while (t = t[r]) if (1 === t.nodeType || u) {
                    if (h = t[f] || (t[f] = {}), (s = h[r]) && s[0] === a && s[1] === e) return c[2] = s[2];
                    if (h[r] = c, c[2] = n(t, i, o)) return ! 0
                }
            }
        }
        function ri(n) {
            return n.length > 1 ?
            function(t, i, r) {
                for (var u = n.length; u--;) if (!n[u](t, i, r)) return ! 1;
                return ! 0
            }: n[0]
        }
        function vr(n, t, i) {
            for (var u = 0,
            f = t.length; f > u; u++) r(n, t[u], i);
            return i
        }
        function yt(n, t, i, r, u) {
            for (var e, o = [], f = 0, s = n.length, h = null != t; s > f; f++)(e = n[f]) && (!i || i(e, r, u)) && (o.push(e), h && t.push(f));
            return o
        }
        function ui(n, t, i, r, u, e) {
            return r && !r[f] && (r = ui(r)),
            u && !u[f] && (u = ui(u, e)),
            c(function(f, e, o, s) {
                var l, c, a, p = [],
                y = [],
                w = e.length,
                k = f || vr(t || "*", o.nodeType ? [o] : o, []),
                v = !n || !f && t ? k: yt(k, p, n, o, s),
                h = i ? u || (f ? n: w || r) ? [] : e: v;
                if (i && i(v, h, o, s), r) for (l = yt(h, y), r(l, [], o, s), c = l.length; c--;)(a = l[c]) && (h[y[c]] = !(v[y[c]] = a));
                if (f) {
                    if (u || n) {
                        if (u) {
                            for (l = [], c = h.length; c--;)(a = h[c]) && l.push(v[c] = a);
                            u(null, h = [], l, s)
                        }
                        for (c = h.length; c--;)(a = h[c]) && (l = u ? nt(f, a) : p[c]) > -1 && (f[l] = !(e[l] = a))
                    }
                } else h = yt(h === e ? h.splice(w, h.length) : h),
                u ? u(null, e, h, s) : b.apply(e, h)
            })
        }
        function fi(n) {
            for (var o, u, r, s = n.length,
            h = t.relative[n[0].type], c = h || t.relative[" "], i = h ? 1 : 0, l = ii(function(n) {
                return n === o
            },
            c, !0), a = ii(function(n) {
                return nt(o, n) > -1
            },
            c, !0), e = [function(n, t, i) {
                var r = !h && (i || t !== ht) || ((o = t).nodeType ? l(n, t, i) : a(n, t, i));
                return o = null,
                r
            }]; s > i; i++) if (u = t.relative[n[i].type]) e = [ii(ri(e), u)];
            else {
                if (u = t.filter[n[i].type].apply(null, n[i].matches), u[f]) {
                    for (r = ++i; s > r; r++) if (t.relative[n[r].type]) break;
                    return ui(i > 1 && ri(e), i > 1 && vt(n.slice(0, i - 1).concat({
                        value: " " === n[i - 2].type ? "*": ""
                    })).replace(lt, "$1"), u, r > i && fi(n.slice(i, r)), s > r && fi(n = n.slice(r)), s > r && vt(n))
                }
                e.push(u)
            }
            return ri(e)
        }
        function yr(n, i) {
            var u = i.length > 0,
            f = n.length > 0,
            e = function(e, s, h, c, l) {
                var y, d, w, k = 0,
                v = "0",
                g = e && [],
                p = [],
                nt = ht,
                tt = e || f && t.find.TAG("*", l),
                it = a += null == nt ? 1 : Math.random() || .1,
                rt = tt.length;
                for (l && (ht = s !== o && s); v !== rt && null != (y = tt[v]); v++) {
                    if (f && y) {
                        for (d = 0; w = n[d++];) if (w(y, s, h)) {
                            c.push(y);
                            break
                        }
                        l && (a = it)
                    }
                    u && ((y = !w && y) && k--, e && g.push(y))
                }
                if (k += v, u && v !== k) {
                    for (d = 0; w = i[d++];) w(g, p, s, h);
                    if (e) {
                        if (k > 0) while (v--) g[v] || p[v] || (p[v] = gi.call(c));
                        p = yt(p)
                    }
                    b.apply(c, p);
                    l && !e && p.length > 0 && k + i.length > 1 && r.uniqueSort(c)
                }
                return l && (a = it, ht = nt),
                g
            };
            return u ? c(e) : e
        }
        var it, u, t, st, ei, ft, pt, oi, ht, w, rt, k, o, s, l, e, d, ct, et, f = "sizzle" + 1 * new Date,
        h = n.document,
        a = 0,
        ki = 0,
        si = gt(),
        hi = gt(),
        ci = gt(),
        wt = function(n, t) {
            return n === t && (rt = !0),
            0
        },
        li = -2147483648,
        di = {}.hasOwnProperty,
        g = [],
        gi = g.pop,
        nr = g.push,
        b = g.push,
        ai = g.slice,
        nt = function(n, t) {
            for (var i = 0,
            r = n.length; r > i; i++) if (n[i] === t) return i;
            return - 1
        },
        bt = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
        i = "[\\x20\\t\\r\\n\\f]",
        ut = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
        vi = ut.replace("w", "w#"),
        yi = "\\[" + i + "*(" + ut + ")(?:" + i + "*([*^$|!~]?=)" + i + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + vi + "))|)" + i + "*\\]",
        kt = ":(" + ut + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + yi + ")*)|.*)\\)|)",
        tr = new RegExp(i + "+", "g"),
        lt = new RegExp("^" + i + "+|((?:^|[^\\\\])(?:\\\\.)*)" + i + "+$", "g"),
        ir = new RegExp("^" + i + "*," + i + "*"),
        rr = new RegExp("^" + i + "*([>+~]|" + i + ")" + i + "*"),
        ur = new RegExp("=" + i + "*([^\\]'\"]*?)" + i + "*\\]", "g"),
        fr = new RegExp(kt),
        er = new RegExp("^" + vi + "$"),
        at = {
            ID: new RegExp("^#(" + ut + ")"),
            CLASS: new RegExp("^\\.(" + ut + ")"),
            TAG: new RegExp("^(" + ut.replace("w", "w*") + ")"),
            ATTR: new RegExp("^" + yi),
            PSEUDO: new RegExp("^" + kt),
            CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + i + "*(even|odd|(([+-]|)(\\d*)n|)" + i + "*(?:([+-]|)" + i + "*(\\d+)|))" + i + "*\\)|)", "i"),
            bool: new RegExp("^(?:" + bt + ")$", "i"),
            needsContext: new RegExp("^" + i + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + i + "*((?:-\\d)?\\d*)" + i + "*\\)|)(?=[^-]|$)", "i")
        },
        or = /^(?:input|select|textarea|button)$/i,
        sr = /^h\d$/i,
        ot = /^[^{]+\{\s*\[native \w/,
        hr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
        dt = /[+~]/,
        cr = /'|\\/g,
        y = new RegExp("\\\\([\\da-f]{1,6}" + i + "?|(" + i + ")|.)", "ig"),
        p = function(n, t, i) {
            var r = "0x" + t - 65536;
            return r !== r || i ? t: 0 > r ? String.fromCharCode(r + 65536) : String.fromCharCode(r >> 10 | 55296, 1023 & r | 56320)
        },
        pi = function() {
            k()
        };
        try {
            b.apply(g = ai.call(h.childNodes), h.childNodes);
            g[h.childNodes.length].nodeType
        } catch(pr) {
            b = {
                apply: g.length ?
                function(n, t) {
                    nr.apply(n, ai.call(t))
                }: function(n, t) {
                    for (var i = n.length,
                    r = 0; n[i++] = t[r++];);
                    n.length = i - 1
                }
            }
        }
        u = r.support = {};
        ei = r.isXML = function(n) {
            var t = n && (n.ownerDocument || n).documentElement;
            return t ? "HTML" !== t.nodeName: !1
        };
        k = r.setDocument = function(n) {
            var a, c, r = n ? n.ownerDocument || n: h;
            return r !== o && 9 === r.nodeType && r.documentElement ? (o = r, s = r.documentElement, c = r.defaultView, c && c !== c.top && (c.addEventListener ? c.addEventListener("unload", pi, !1) : c.attachEvent && c.attachEvent("onunload", pi)), l = !ei(r), u.attributes = v(function(n) {
                return n.className = "i",
                !n.getAttribute("className")
            }), u.getElementsByTagName = v(function(n) {
                return n.appendChild(r.createComment("")),
                !n.getElementsByTagName("*").length
            }), u.getElementsByClassName = ot.test(r.getElementsByClassName), u.getById = v(function(n) {
                return s.appendChild(n).id = f,
                !r.getElementsByName || !r.getElementsByName(f).length
            }), u.getById ? (t.find.ID = function(n, t) {
                if ("undefined" != typeof t.getElementById && l) {
                    var i = t.getElementById(n);
                    return i && i.parentNode ? [i] : []
                }
            },
            t.filter.ID = function(n) {
                var t = n.replace(y, p);
                return function(n) {
                    return n.getAttribute("id") === t
                }
            }) : (delete t.find.ID, t.filter.ID = function(n) {
                var t = n.replace(y, p);
                return function(n) {
                    var i = "undefined" != typeof n.getAttributeNode && n.getAttributeNode("id");
                    return i && i.value === t
                }
            }), t.find.TAG = u.getElementsByTagName ?
            function(n, t) {
                return "undefined" != typeof t.getElementsByTagName ? t.getElementsByTagName(n) : u.qsa ? t.querySelectorAll(n) : void 0
            }: function(n, t) {
                var i, r = [],
                f = 0,
                u = t.getElementsByTagName(n);
                if ("*" === n) {
                    while (i = u[f++]) 1 === i.nodeType && r.push(i);
                    return r
                }
                return u
            },
            t.find.CLASS = u.getElementsByClassName &&
            function(n, t) {
                if (l) return t.getElementsByClassName(n)
            },
            d = [], e = [], (u.qsa = ot.test(r.querySelectorAll)) && (v(function(n) {
                s.appendChild(n).innerHTML = "<a id='" + f + "'><\/a><select id='" + f + "-\f]' msallowcapture=''><option selected=''><\/option><\/select>";
                n.querySelectorAll("[msallowcapture^='']").length && e.push("[*^$]=" + i + "*(?:''|\"\")");
                n.querySelectorAll("[selected]").length || e.push("\\[" + i + "*(?:value|" + bt + ")");
                n.querySelectorAll("[id~=" + f + "-]").length || e.push("~=");
                n.querySelectorAll(":checked").length || e.push(":checked");
                n.querySelectorAll("a#" + f + "+*").length || e.push(".#.+[+~]")
            }), v(function(n) {
                var t = r.createElement("input");
                t.setAttribute("type", "hidden");
                n.appendChild(t).setAttribute("name", "D");
                n.querySelectorAll("[name=d]").length && e.push("name" + i + "*[*^$|!~]?=");
                n.querySelectorAll(":enabled").length || e.push(":enabled", ":disabled");
                n.querySelectorAll("*,:x");
                e.push(",.*:")
            })), (u.matchesSelector = ot.test(ct = s.matches || s.webkitMatchesSelector || s.mozMatchesSelector || s.oMatchesSelector || s.msMatchesSelector)) && v(function(n) {
                u.disconnectedMatch = ct.call(n, "div");
                ct.call(n, "[s!='']:x");
                d.push("!=", kt)
            }), e = e.length && new RegExp(e.join("|")), d = d.length && new RegExp(d.join("|")), a = ot.test(s.compareDocumentPosition), et = a || ot.test(s.contains) ?
            function(n, t) {
                var r = 9 === n.nodeType ? n.documentElement: n,
                i = t && t.parentNode;
                return n === i || !(!i || 1 !== i.nodeType || !(r.contains ? r.contains(i) : n.compareDocumentPosition && 16 & n.compareDocumentPosition(i)))
            }: function(n, t) {
                if (t) while (t = t.parentNode) if (t === n) return ! 0;
                return ! 1
            },
            wt = a ?
            function(n, t) {
                if (n === t) return rt = !0,
                0;
                var i = !n.compareDocumentPosition - !t.compareDocumentPosition;
                return i ? i: (i = (n.ownerDocument || n) === (t.ownerDocument || t) ? n.compareDocumentPosition(t) : 1, 1 & i || !u.sortDetached && t.compareDocumentPosition(n) === i ? n === r || n.ownerDocument === h && et(h, n) ? -1 : t === r || t.ownerDocument === h && et(h, t) ? 1 : w ? nt(w, n) - nt(w, t) : 0 : 4 & i ? -1 : 1)
            }: function(n, t) {
                if (n === t) return rt = !0,
                0;
                var i, u = 0,
                o = n.parentNode,
                s = t.parentNode,
                f = [n],
                e = [t];
                if (!o || !s) return n === r ? -1 : t === r ? 1 : o ? -1 : s ? 1 : w ? nt(w, n) - nt(w, t) : 0;
                if (o === s) return wi(n, t);
                for (i = n; i = i.parentNode;) f.unshift(i);
                for (i = t; i = i.parentNode;) e.unshift(i);
                while (f[u] === e[u]) u++;
                return u ? wi(f[u], e[u]) : f[u] === h ? -1 : e[u] === h ? 1 : 0
            },
            r) : o
        };
        r.matches = function(n, t) {
            return r(n, null, null, t)
        };
        r.matchesSelector = function(n, t) {
            if ((n.ownerDocument || n) !== o && k(n), t = t.replace(ur, "='$1']"), !(!u.matchesSelector || !l || d && d.test(t) || e && e.test(t))) try {
                var i = ct.call(n, t);
                if (i || u.disconnectedMatch || n.document && 11 !== n.document.nodeType) return i
            } catch(f) {}
            return r(t, o, null, [n]).length > 0
        };
        r.contains = function(n, t) {
            return (n.ownerDocument || n) !== o && k(n),
            et(n, t)
        };
        r.attr = function(n, i) { (n.ownerDocument || n) !== o && k(n);
            var f = t.attrHandle[i.toLowerCase()],
            r = f && di.call(t.attrHandle, i.toLowerCase()) ? f(n, i, !l) : void 0;
            return void 0 !== r ? r: u.attributes || !l ? n.getAttribute(i) : (r = n.getAttributeNode(i)) && r.specified ? r.value: null
        };
        r.error = function(n) {
            throw new Error("Syntax error, unrecognized expression: " + n);
        };
        r.uniqueSort = function(n) {
            var r, f = [],
            t = 0,
            i = 0;
            if (rt = !u.detectDuplicates, w = !u.sortStable && n.slice(0), n.sort(wt), rt) {
                while (r = n[i++]) r === n[i] && (t = f.push(i));
                while (t--) n.splice(f[t], 1)
            }
            return w = null,
            n
        };
        st = r.getText = function(n) {
            var r, i = "",
            u = 0,
            t = n.nodeType;
            if (t) {
                if (1 === t || 9 === t || 11 === t) {
                    if ("string" == typeof n.textContent) return n.textContent;
                    for (n = n.firstChild; n; n = n.nextSibling) i += st(n)
                } else if (3 === t || 4 === t) return n.nodeValue
            } else while (r = n[u++]) i += st(r);
            return i
        };
        t = r.selectors = {
            cacheLength: 50,
            createPseudo: c,
            match: at,
            attrHandle: {},
            find: {},
            relative: {
                ">": {
                    dir: "parentNode",
                    first: !0
                },
                " ": {
                    dir: "parentNode"
                },
                "+": {
                    dir: "previousSibling",
                    first: !0
                },
                "~": {
                    dir: "previousSibling"
                }
            },
            preFilter: {
                ATTR: function(n) {
                    return n[1] = n[1].replace(y, p),
                    n[3] = (n[3] || n[4] || n[5] || "").replace(y, p),
                    "~=" === n[2] && (n[3] = " " + n[3] + " "),
                    n.slice(0, 4)
                },
                CHILD: function(n) {
                    return n[1] = n[1].toLowerCase(),
                    "nth" === n[1].slice(0, 3) ? (n[3] || r.error(n[0]), n[4] = +(n[4] ? n[5] + (n[6] || 1) : 2 * ("even" === n[3] || "odd" === n[3])), n[5] = +(n[7] + n[8] || "odd" === n[3])) : n[3] && r.error(n[0]),
                    n
                },
                PSEUDO: function(n) {
                    var i, t = !n[6] && n[2];
                    return at.CHILD.test(n[0]) ? null: (n[3] ? n[2] = n[4] || n[5] || "": t && fr.test(t) && (i = ft(t, !0)) && (i = t.indexOf(")", t.length - i) - t.length) && (n[0] = n[0].slice(0, i), n[2] = t.slice(0, i)), n.slice(0, 3))
                }
            },
            filter: {
                TAG: function(n) {
                    var t = n.replace(y, p).toLowerCase();
                    return "*" === n ?
                    function() {
                        return ! 0
                    }: function(n) {
                        return n.nodeName && n.nodeName.toLowerCase() === t
                    }
                },
                CLASS: function(n) {
                    var t = si[n + " "];
                    return t || (t = new RegExp("(^|" + i + ")" + n + "(" + i + "|$)")) && si(n,
                    function(n) {
                        return t.test("string" == typeof n.className && n.className || "undefined" != typeof n.getAttribute && n.getAttribute("class") || "")
                    })
                },
                ATTR: function(n, t, i) {
                    return function(u) {
                        var f = r.attr(u, n);
                        return null == f ? "!=" === t: t ? (f += "", "=" === t ? f === i: "!=" === t ? f !== i: "^=" === t ? i && 0 === f.indexOf(i) : "*=" === t ? i && f.indexOf(i) > -1 : "$=" === t ? i && f.slice( - i.length) === i: "~=" === t ? (" " + f.replace(tr, " ") + " ").indexOf(i) > -1 : "|=" === t ? f === i || f.slice(0, i.length + 1) === i + "-": !1) : !0
                    }
                },
                CHILD: function(n, t, i, r, u) {
                    var s = "nth" !== n.slice(0, 3),
                    o = "last" !== n.slice( - 4),
                    e = "of-type" === t;
                    return 1 === r && 0 === u ?
                    function(n) {
                        return !! n.parentNode
                    }: function(t, i, h) {
                        var v, k, c, l, y, w, b = s !== o ? "nextSibling": "previousSibling",
                        p = t.parentNode,
                        g = e && t.nodeName.toLowerCase(),
                        d = !h && !e;
                        if (p) {
                            if (s) {
                                while (b) {
                                    for (c = t; c = c[b];) if (e ? c.nodeName.toLowerCase() === g: 1 === c.nodeType) return ! 1;
                                    w = b = "only" === n && !w && "nextSibling"
                                }
                                return ! 0
                            }
                            if (w = [o ? p.firstChild: p.lastChild], o && d) {
                                for (k = p[f] || (p[f] = {}), v = k[n] || [], y = v[0] === a && v[1], l = v[0] === a && v[2], c = y && p.childNodes[y]; c = ++y && c && c[b] || (l = y = 0) || w.pop();) if (1 === c.nodeType && ++l && c === t) {
                                    k[n] = [a, y, l];
                                    break
                                }
                            } else if (d && (v = (t[f] || (t[f] = {}))[n]) && v[0] === a) l = v[1];
                            else while (c = ++y && c && c[b] || (l = y = 0) || w.pop()) if ((e ? c.nodeName.toLowerCase() === g: 1 === c.nodeType) && ++l && (d && ((c[f] || (c[f] = {}))[n] = [a, l]), c === t)) break;
                            return l -= u,
                            l === r || l % r == 0 && l / r >= 0
                        }
                    }
                },
                PSEUDO: function(n, i) {
                    var e, u = t.pseudos[n] || t.setFilters[n.toLowerCase()] || r.error("unsupported pseudo: " + n);
                    return u[f] ? u(i) : u.length > 1 ? (e = [n, n, "", i], t.setFilters.hasOwnProperty(n.toLowerCase()) ? c(function(n, t) {
                        for (var r, f = u(n, i), e = f.length; e--;) r = nt(n, f[e]),
                        n[r] = !(t[r] = f[e])
                    }) : function(n) {
                        return u(n, 0, e)
                    }) : u
                }
            },
            pseudos: {
                not: c(function(n) {
                    var t = [],
                    r = [],
                    i = pt(n.replace(lt, "$1"));
                    return i[f] ? c(function(n, t, r, u) {
                        for (var e, o = i(n, null, u, []), f = n.length; f--;)(e = o[f]) && (n[f] = !(t[f] = e))
                    }) : function(n, u, f) {
                        return t[0] = n,
                        i(t, null, f, r),
                        t[0] = null,
                        !r.pop()
                    }
                }),
                has: c(function(n) {
                    return function(t) {
                        return r(n, t).length > 0
                    }
                }),
                contains: c(function(n) {
                    return n = n.replace(y, p),
                    function(t) {
                        return (t.textContent || t.innerText || st(t)).indexOf(n) > -1
                    }
                }),
                lang: c(function(n) {
                    return er.test(n || "") || r.error("unsupported lang: " + n),
                    n = n.replace(y, p).toLowerCase(),
                    function(t) {
                        var i;
                        do
                        if (i = l ? t.lang: t.getAttribute("xml:lang") || t.getAttribute("lang")) return i = i.toLowerCase(),
                        i === n || 0 === i.indexOf(n + "-");
                        while ((t = t.parentNode) && 1 === t.nodeType);
                        return ! 1
                    }
                }),
                target: function(t) {
                    var i = n.location && n.location.hash;
                    return i && i.slice(1) === t.id
                },
                root: function(n) {
                    return n === s
                },
                focus: function(n) {
                    return n === o.activeElement && (!o.hasFocus || o.hasFocus()) && !!(n.type || n.href || ~n.tabIndex)
                },
                enabled: function(n) {
                    return n.disabled === !1
                },
                disabled: function(n) {
                    return n.disabled === !0
                },
                checked: function(n) {
                    var t = n.nodeName.toLowerCase();
                    return "input" === t && !!n.checked || "option" === t && !!n.selected
                },
                selected: function(n) {
                    return n.parentNode && n.parentNode.selectedIndex,
                    n.selected === !0
                },
                empty: function(n) {
                    for (n = n.firstChild; n; n = n.nextSibling) if (n.nodeType < 6) return ! 1;
                    return ! 0
                },
                parent: function(n) {
                    return ! t.pseudos.empty(n)
                },
                header: function(n) {
                    return sr.test(n.nodeName)
                },
                input: function(n) {
                    return or.test(n.nodeName)
                },
                button: function(n) {
                    var t = n.nodeName.toLowerCase();
                    return "input" === t && "button" === n.type || "button" === t
                },
                text: function(n) {
                    var t;
                    return "input" === n.nodeName.toLowerCase() && "text" === n.type && (null == (t = n.getAttribute("type")) || "text" === t.toLowerCase())
                },
                first: tt(function() {
                    return [0]
                }),
                last: tt(function(n, t) {
                    return [t - 1]
                }),
                eq: tt(function(n, t, i) {
                    return [0 > i ? i + t: i]
                }),
                even: tt(function(n, t) {
                    for (var i = 0; t > i; i += 2) n.push(i);
                    return n
                }),
                odd: tt(function(n, t) {
                    for (var i = 1; t > i; i += 2) n.push(i);
                    return n
                }),
                lt: tt(function(n, t, i) {
                    for (var r = 0 > i ? i + t: i; --r >= 0;) n.push(r);
                    return n
                }),
                gt: tt(function(n, t, i) {
                    for (var r = 0 > i ? i + t: i; ++r < t;) n.push(r);
                    return n
                })
            }
        };
        t.pseudos.nth = t.pseudos.eq;
        for (it in {
            radio: !0,
            checkbox: !0,
            file: !0,
            password: !0,
            image: !0
        }) t.pseudos[it] = lr(it);
        for (it in {
            submit: !0,
            reset: !0
        }) t.pseudos[it] = ar(it);
        return bi.prototype = t.filters = t.pseudos,
        t.setFilters = new bi,
        ft = r.tokenize = function(n, i) {
            var e, f, s, o, u, h, c, l = hi[n + " "];
            if (l) return i ? 0 : l.slice(0);
            for (u = n, h = [], c = t.preFilter; u;) { (!e || (f = ir.exec(u))) && (f && (u = u.slice(f[0].length) || u), h.push(s = []));
                e = !1; (f = rr.exec(u)) && (e = f.shift(), s.push({
                    value: e,
                    type: f[0].replace(lt, " ")
                }), u = u.slice(e.length));
                for (o in t.filter)(f = at[o].exec(u)) && (!c[o] || (f = c[o](f))) && (e = f.shift(), s.push({
                    value: e,
                    type: o,
                    matches: f
                }), u = u.slice(e.length));
                if (!e) break
            }
            return i ? u.length: u ? r.error(n) : hi(n, h).slice(0)
        },
        pt = r.compile = function(n, t) {
            var r, u = [],
            e = [],
            i = ci[n + " "];
            if (!i) {
                for (t || (t = ft(n)), r = t.length; r--;) i = fi(t[r]),
                i[f] ? u.push(i) : e.push(i);
                i = ci(n, yr(e, u));
                i.selector = n
            }
            return i
        },
        oi = r.select = function(n, i, r, f) {
            var s, e, o, a, v, c = "function" == typeof n && n,
            h = !f && ft(n = c.selector || n);
            if (r = r || [], 1 === h.length) {
                if (e = h[0] = h[0].slice(0), e.length > 2 && "ID" === (o = e[0]).type && u.getById && 9 === i.nodeType && l && t.relative[e[1].type]) {
                    if (i = (t.find.ID(o.matches[0].replace(y, p), i) || [])[0], !i) return r;
                    c && (i = i.parentNode);
                    n = n.slice(e.shift().value.length)
                }
                for (s = at.needsContext.test(n) ? 0 : e.length; s--;) {
                    if (o = e[s], t.relative[a = o.type]) break;
                    if ((v = t.find[a]) && (f = v(o.matches[0].replace(y, p), dt.test(e[0].type) && ti(i.parentNode) || i))) {
                        if (e.splice(s, 1), n = f.length && vt(e), !n) return b.apply(r, f),
                        r;
                        break
                    }
                }
            }
            return (c || pt(n, h))(f, i, !l, r, dt.test(n) && ti(i.parentNode) || i),
            r
        },
        u.sortStable = f.split("").sort(wt).join("") === f,
        u.detectDuplicates = !!rt,
        k(),
        u.sortDetached = v(function(n) {
            return 1 & n.compareDocumentPosition(o.createElement("div"))
        }),
        v(function(n) {
            return n.innerHTML = "<a href='#'><\/a>",
            "#" === n.firstChild.getAttribute("href")
        }) || ni("type|href|height|width",
        function(n, t, i) {
            if (!i) return n.getAttribute(t, "type" === t.toLowerCase() ? 1 : 2)
        }),
        u.attributes && v(function(n) {
            return n.innerHTML = "<input/>",
            n.firstChild.setAttribute("value", ""),
            "" === n.firstChild.getAttribute("value")
        }) || ni("value",
        function(n, t, i) {
            if (!i && "input" === n.nodeName.toLowerCase()) return n.defaultValue
        }),
        v(function(n) {
            return null == n.getAttribute("disabled")
        }) || ni(bt,
        function(n, t, i) {
            var r;
            if (!i) return n[t] === !0 ? t.toLowerCase() : (r = n.getAttributeNode(t)) && r.specified ? r.value: null
        }),
        r
    } (n);
    i.find = y;
    i.expr = y.selectors;
    i.expr[":"] = i.expr.pseudos;
    i.unique = y.uniqueSort;
    i.text = y.getText;
    i.isXMLDoc = y.isXML;
    i.contains = y.contains;
    var di = i.expr.match.needsContext,
    gi = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
    ef = /^.[^:#\[\.,]*$/;
    i.filter = function(n, t, r) {
        var u = t[0];
        return r && (n = ":not(" + n + ")"),
        1 === t.length && 1 === u.nodeType ? i.find.matchesSelector(u, n) ? [u] : [] : i.find.matches(n, i.grep(t,
        function(n) {
            return 1 === n.nodeType
        }))
    };
    i.fn.extend({
        find: function(n) {
            var t, u = this.length,
            r = [],
            f = this;
            if ("string" != typeof n) return this.pushStack(i(n).filter(function() {
                for (t = 0; u > t; t++) if (i.contains(f[t], this)) return ! 0
            }));
            for (t = 0; u > t; t++) i.find(n, f[t], r);
            return r = this.pushStack(u > 1 ? i.unique(r) : r),
            r.selector = this.selector ? this.selector + " " + n: n,
            r
        },
        filter: function(n) {
            return this.pushStack(ui(this, n || [], !1))
        },
        not: function(n) {
            return this.pushStack(ui(this, n || [], !0))
        },
        is: function(n) {
            return !! ui(this, "string" == typeof n && di.test(n) ? i(n) : n || [], !1).length
        }
    });
    nr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/;
    tr = i.fn.init = function(n, t) {
        var r, f;
        if (!n) return this;
        if ("string" == typeof n) {
            if (r = "<" === n[0] && ">" === n[n.length - 1] && n.length >= 3 ? [null, n, null] : nr.exec(n), !r || !r[1] && t) return ! t || t.jquery ? (t || ot).find(n) : this.constructor(t).find(n);
            if (r[1]) {
                if (t = t instanceof i ? t[0] : t, i.merge(this, i.parseHTML(r[1], t && t.nodeType ? t.ownerDocument || t: u, !0)), gi.test(r[1]) && i.isPlainObject(t)) for (r in t) i.isFunction(this[r]) ? this[r](t[r]) : this.attr(r, t[r]);
                return this
            }
            return f = u.getElementById(r[2]),
            f && f.parentNode && (this.length = 1, this[0] = f),
            this.context = u,
            this.selector = n,
            this
        }
        return n.nodeType ? (this.context = this[0] = n, this.length = 1, this) : i.isFunction(n) ? "undefined" != typeof ot.ready ? ot.ready(n) : n(i) : (void 0 !== n.selector && (this.selector = n.selector, this.context = n.context), i.makeArray(n, this))
    };
    tr.prototype = i.fn;
    ot = i(u);
    ir = /^(?:parents|prev(?:Until|All))/;
    rr = {
        children: !0,
        contents: !0,
        next: !0,
        prev: !0
    };
    i.extend({
        dir: function(n, t, r) {
            for (var u = [], f = void 0 !== r; (n = n[t]) && 9 !== n.nodeType;) if (1 === n.nodeType) {
                if (f && i(n).is(r)) break;
                u.push(n)
            }
            return u
        },
        sibling: function(n, t) {
            for (var i = []; n; n = n.nextSibling) 1 === n.nodeType && n !== t && i.push(n);
            return i
        }
    });
    i.fn.extend({
        has: function(n) {
            var t = i(n, this),
            r = t.length;
            return this.filter(function() {
                for (var n = 0; r > n; n++) if (i.contains(this, t[n])) return ! 0
            })
        },
        closest: function(n, t) {
            for (var r, f = 0,
            o = this.length,
            u = [], e = di.test(n) || "string" != typeof n ? i(n, t || this.context) : 0; o > f; f++) for (r = this[f]; r && r !== t; r = r.parentNode) if (r.nodeType < 11 && (e ? e.index(r) > -1 : 1 === r.nodeType && i.find.matchesSelector(r, n))) {
                u.push(r);
                break
            }
            return this.pushStack(u.length > 1 ? i.unique(u) : u)
        },
        index: function(n) {
            return n ? "string" == typeof n ? ft.call(i(n), this[0]) : ft.call(this, n.jquery ? n[0] : n) : this[0] && this[0].parentNode ? this.first().prevAll().length: -1
        },
        add: function(n, t) {
            return this.pushStack(i.unique(i.merge(this.get(), i(n, t))))
        },
        addBack: function(n) {
            return this.add(null == n ? this.prevObject: this.prevObject.filter(n))
        }
    });
    i.each({
        parent: function(n) {
            var t = n.parentNode;
            return t && 11 !== t.nodeType ? t: null
        },
        parents: function(n) {
            return i.dir(n, "parentNode")
        },
        parentsUntil: function(n, t, r) {
            return i.dir(n, "parentNode", r)
        },
        next: function(n) {
            return ur(n, "nextSibling")
        },
        prev: function(n) {
            return ur(n, "previousSibling")
        },
        nextAll: function(n) {
            return i.dir(n, "nextSibling")
        },
        prevAll: function(n) {
            return i.dir(n, "previousSibling")
        },
        nextUntil: function(n, t, r) {
            return i.dir(n, "nextSibling", r)
        },
        prevUntil: function(n, t, r) {
            return i.dir(n, "previousSibling", r)
        },
        siblings: function(n) {
            return i.sibling((n.parentNode || {}).firstChild, n)
        },
        children: function(n) {
            return i.sibling(n.firstChild)
        },
        contents: function(n) {
            return n.contentDocument || i.merge([], n.childNodes)
        }
    },
    function(n, t) {
        i.fn[n] = function(r, u) {
            var f = i.map(this, t, r);
            return "Until" !== n.slice( - 5) && (u = r),
            u && "string" == typeof u && (f = i.filter(u, f)),
            this.length > 1 && (rr[n] || i.unique(f), ir.test(n) && f.reverse()),
            this.pushStack(f)
        }
    });
    c = /\S+/g;
    fi = {};
    i.Callbacks = function(n) {
        n = "string" == typeof n ? fi[n] || of(n) : i.extend({},
        n);
        var u, h, o, c, f, e, t = [],
        r = !n.once && [],
        l = function(i) {
            for (u = n.memory && i, h = !0, e = c || 0, c = 0, f = t.length, o = !0; t && f > e; e++) if (t[e].apply(i[0], i[1]) === !1 && n.stopOnFalse) {
                u = !1;
                break
            }
            o = !1;
            t && (r ? r.length && l(r.shift()) : u ? t = [] : s.disable())
        },
        s = {
            add: function() {
                if (t) {
                    var r = t.length; !
                    function e(r) {
                        i.each(r,
                        function(r, u) {
                            var f = i.type(u);
                            "function" === f ? n.unique && s.has(u) || t.push(u) : u && u.length && "string" !== f && e(u)
                        })
                    } (arguments);
                    o ? f = t.length: u && (c = r, l(u))
                }
                return this
            },
            remove: function() {
                return t && i.each(arguments,
                function(n, r) {
                    for (var u; (u = i.inArray(r, t, u)) > -1;) t.splice(u, 1),
                    o && (f >= u && f--, e >= u && e--)
                }),
                this
            },
            has: function(n) {
                return n ? i.inArray(n, t) > -1 : !(!t || !t.length)
            },
            empty: function() {
                return t = [],
                f = 0,
                this
            },
            disable: function() {
                return t = r = u = void 0,
                this
            },
            disabled: function() {
                return ! t
            },
            lock: function() {
                return r = void 0,
                u || s.disable(),
                this
            },
            locked: function() {
                return ! r
            },
            fireWith: function(n, i) {
                return ! t || h && !r || (i = i || [], i = [n, i.slice ? i.slice() : i], o ? r.push(i) : l(i)),
                this
            },
            fire: function() {
                return s.fireWith(this, arguments),
                this
            },
            fired: function() {
                return !! h
            }
        };
        return s
    };
    i.extend({
        Deferred: function(n) {
            var u = [["resolve", "done", i.Callbacks("once memory"), "resolved"], ["reject", "fail", i.Callbacks("once memory"), "rejected"], ["notify", "progress", i.Callbacks("memory")]],
            f = "pending",
            r = {
                state: function() {
                    return f
                },
                always: function() {
                    return t.done(arguments).fail(arguments),
                    this
                },
                then: function() {
                    var n = arguments;
                    return i.Deferred(function(f) {
                        i.each(u,
                        function(u, e) {
                            var o = i.isFunction(n[u]) && n[u];
                            t[e[1]](function() {
                                var n = o && o.apply(this, arguments);
                                n && i.isFunction(n.promise) ? n.promise().done(f.resolve).fail(f.reject).progress(f.notify) : f[e[0] + "With"](this === r ? f.promise() : this, o ? [n] : arguments)
                            })
                        });
                        n = null
                    }).promise()
                },
                promise: function(n) {
                    return null != n ? i.extend(n, r) : r
                }
            },
            t = {};
            return r.pipe = r.then,
            i.each(u,
            function(n, i) {
                var e = i[2],
                o = i[3];
                r[i[1]] = e.add;
                o && e.add(function() {
                    f = o
                },
                u[1 ^ n][2].disable, u[2][2].lock);
                t[i[0]] = function() {
                    return t[i[0] + "With"](this === t ? r: this, arguments),
                    this
                };
                t[i[0] + "With"] = e.fireWith
            }),
            r.promise(t),
            n && n.call(t, t),
            t
        },
        when: function(n) {
            var t = 0,
            u = a.call(arguments),
            r = u.length,
            e = 1 !== r || n && i.isFunction(n.promise) ? r: 0,
            f = 1 === e ? n: i.Deferred(),
            h = function(n, t, i) {
                return function(r) {
                    t[n] = this;
                    i[n] = arguments.length > 1 ? a.call(arguments) : r;
                    i === o ? f.notifyWith(t, i) : --e || f.resolveWith(t, i)
                }
            },
            o,
            c,
            s;
            if (r > 1) for (o = new Array(r), c = new Array(r), s = new Array(r); r > t; t++) u[t] && i.isFunction(u[t].promise) ? u[t].promise().done(h(t, s, u)).fail(f.reject).progress(h(t, c, o)) : --e;
            return e || f.resolveWith(s, u),
            f.promise()
        }
    });
    i.fn.ready = function(n) {
        return i.ready.promise().done(n),
        this
    };
    i.extend({
        isReady: !1,
        readyWait: 1,
        holdReady: function(n) {
            n ? i.readyWait++:i.ready(!0)
        },
        ready: function(n) { (n === !0 ? --i.readyWait: i.isReady) || (i.isReady = !0, n !== !0 && --i.readyWait > 0 || (st.resolveWith(u, [i]), i.fn.triggerHandler && (i(u).triggerHandler("ready"), i(u).off("ready"))))
        }
    });
    i.ready.promise = function(t) {
        return st || (st = i.Deferred(), "complete" === u.readyState ? setTimeout(i.ready) : (u.addEventListener("DOMContentLoaded", ht, !1), n.addEventListener("load", ht, !1))),
        st.promise(t)
    };
    i.ready.promise();
    l = i.access = function(n, t, r, u, f, e, o) {
        var s = 0,
        c = n.length,
        h = null == r;
        if ("object" === i.type(r)) {
            f = !0;
            for (s in r) i.access(n, t, s, r[s], !0, e, o)
        } else if (void 0 !== u && (f = !0, i.isFunction(u) || (o = !0), h && (o ? (t.call(n, u), t = null) : (h = t, t = function(n, t, r) {
            return h.call(i(n), r)
        })), t)) for (; c > s; s++) t(n[s], r, o ? u: u.call(n[s], s, t(n[s], r)));
        return f ? n: h ? t.call(n) : c ? t(n[0], r) : e
    };
    i.acceptData = function(n) {
        return 1 === n.nodeType || 9 === n.nodeType || !+n.nodeType
    };
    v.uid = 1;
    v.accepts = i.acceptData;
    v.prototype = {
        key: function(n) {
            if (!v.accepts(n)) return 0;
            var r = {},
            t = n[this.expando];
            if (!t) {
                t = v.uid++;
                try {
                    r[this.expando] = {
                        value: t
                    };
                    Object.defineProperties(n, r)
                } catch(u) {
                    r[this.expando] = t;
                    i.extend(n, r)
                }
            }
            return this.cache[t] || (this.cache[t] = {}),
            t
        },
        set: function(n, t, r) {
            var f, e = this.key(n),
            u = this.cache[e];
            if ("string" == typeof t) u[t] = r;
            else if (i.isEmptyObject(u)) i.extend(this.cache[e], t);
            else for (f in t) u[f] = t[f];
            return u
        },
        get: function(n, t) {
            var i = this.cache[this.key(n)];
            return void 0 === t ? i: i[t]
        },
        access: function(n, t, r) {
            var u;
            return void 0 === t || t && "string" == typeof t && void 0 === r ? (u = this.get(n, t), void 0 !== u ? u: this.get(n, i.camelCase(t))) : (this.set(n, t, r), void 0 !== r ? r: t)
        },
        remove: function(n, t) {
            var u, r, f, o = this.key(n),
            e = this.cache[o];
            if (void 0 === t) this.cache[o] = {};
            else for (i.isArray(t) ? r = t.concat(t.map(i.camelCase)) : (f = i.camelCase(t), (t in e) ? r = [t, f] : (r = f, r = (r in e) ? [r] : r.match(c) || [])), u = r.length; u--;) delete e[r[u]]
        },
        hasData: function(n) {
            return ! i.isEmptyObject(this.cache[n[this.expando]] || {})
        },
        discard: function(n) {
            n[this.expando] && delete this.cache[n[this.expando]]
        }
    };
    var r = new v,
    e = new v,
    sf = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
    hf = /([A-Z])/g;
    i.extend({
        hasData: function(n) {
            return e.hasData(n) || r.hasData(n)
        },
        data: function(n, t, i) {
            return e.access(n, t, i)
        },
        removeData: function(n, t) {
            e.remove(n, t)
        },
        _data: function(n, t, i) {
            return r.access(n, t, i)
        },
        _removeData: function(n, t) {
            r.remove(n, t)
        }
    });
    i.fn.extend({
        data: function(n, t) {
            var o, f, s, u = this[0],
            h = u && u.attributes;
            if (void 0 === n) {
                if (this.length && (s = e.get(u), 1 === u.nodeType && !r.get(u, "hasDataAttrs"))) {
                    for (o = h.length; o--;) h[o] && (f = h[o].name, 0 === f.indexOf("data-") && (f = i.camelCase(f.slice(5)), fr(u, f, s[f])));
                    r.set(u, "hasDataAttrs", !0)
                }
                return s
            }
            return "object" == typeof n ? this.each(function() {
                e.set(this, n)
            }) : l(this,
            function(t) {
                var r, f = i.camelCase(n);
                if (u && void 0 === t) {
                    if ((r = e.get(u, n), void 0 !== r) || (r = e.get(u, f), void 0 !== r) || (r = fr(u, f, void 0), void 0 !== r)) return r
                } else this.each(function() {
                    var i = e.get(this, f);
                    e.set(this, f, t); - 1 !== n.indexOf("-") && void 0 !== i && e.set(this, n, t)
                })
            },
            null, t, arguments.length > 1, null, !0)
        },
        removeData: function(n) {
            return this.each(function() {
                e.remove(this, n)
            })
        }
    });
    i.extend({
        queue: function(n, t, u) {
            var f;
            if (n) return (t = (t || "fx") + "queue", f = r.get(n, t), u && (!f || i.isArray(u) ? f = r.access(n, t, i.makeArray(u)) : f.push(u)), f || [])
        },
        dequeue: function(n, t) {
            t = t || "fx";
            var r = i.queue(n, t),
            e = r.length,
            u = r.shift(),
            f = i._queueHooks(n, t),
            o = function() {
                i.dequeue(n, t)
            };
            "inprogress" === u && (u = r.shift(), e--);
            u && ("fx" === t && r.unshift("inprogress"), delete f.stop, u.call(n, o, f)); ! e && f && f.empty.fire()
        },
        _queueHooks: function(n, t) {
            var u = t + "queueHooks";
            return r.get(n, u) || r.access(n, u, {
                empty: i.Callbacks("once memory").add(function() {
                    r.remove(n, [t + "queue", u])
                })
            })
        }
    });
    i.fn.extend({
        queue: function(n, t) {
            var r = 2;
            return "string" != typeof n && (t = n, n = "fx", r--),
            arguments.length < r ? i.queue(this[0], n) : void 0 === t ? this: this.each(function() {
                var r = i.queue(this, n, t);
                i._queueHooks(this, n);
                "fx" === n && "inprogress" !== r[0] && i.dequeue(this, n)
            })
        },
        dequeue: function(n) {
            return this.each(function() {
                i.dequeue(this, n)
            })
        },
        clearQueue: function(n) {
            return this.queue(n || "fx", [])
        },
        promise: function(n, t) {
            var u, e = 1,
            o = i.Deferred(),
            f = this,
            s = this.length,
            h = function() {--e || o.resolveWith(f, [f])
            };
            for ("string" != typeof n && (t = n, n = void 0), n = n || "fx"; s--;) u = r.get(f[s], n + "queueHooks"),
            u && u.empty && (e++, u.empty.add(h));
            return h(),
            o.promise(t)
        }
    });
    var ct = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
    p = ["Top", "Right", "Bottom", "Left"],
    tt = function(n, t) {
        return n = t || n,
        "none" === i.css(n, "display") || !i.contains(n.ownerDocument, n)
    },
    er = /^(?:checkbox|radio)$/i; !
    function() {
        var i = u.createDocumentFragment(),
        n = i.appendChild(u.createElement("div")),
        t = u.createElement("input");
        t.setAttribute("type", "radio");
        t.setAttribute("checked", "checked");
        t.setAttribute("name", "t");
        n.appendChild(t);
        f.checkClone = n.cloneNode(!0).cloneNode(!0).lastChild.checked;
        n.innerHTML = "<textarea>x<\/textarea>";
        f.noCloneChecked = !!n.cloneNode(!0).lastChild.defaultValue
    } ();
    b = "undefined";
    f.focusinBubbles = "onfocusin" in n;
    var cf = /^key/,
    lf = /^(?:mouse|pointer|contextmenu)|click/,
    or = /^(?:focusinfocus|focusoutblur)$/,
    sr = /^([^.]*)(?:\.(.+)|)$/;
    i.event = {
        global: {},
        add: function(n, t, u, f, e) {
            var v, y, w, p, k, h, s, l, o, d, g, a = r.get(n);
            if (a) for (u.handler && (v = u, u = v.handler, e = v.selector), u.guid || (u.guid = i.guid++), (p = a.events) || (p = a.events = {}), (y = a.handle) || (y = a.handle = function(t) {
                if (typeof i !== b && i.event.triggered !== t.type) return i.event.dispatch.apply(n, arguments)
            }), t = (t || "").match(c) || [""], k = t.length; k--;) w = sr.exec(t[k]) || [],
            o = g = w[1],
            d = (w[2] || "").split(".").sort(),
            o && (s = i.event.special[o] || {},
            o = (e ? s.delegateType: s.bindType) || o, s = i.event.special[o] || {},
            h = i.extend({
                type: o,
                origType: g,
                data: f,
                handler: u,
                guid: u.guid,
                selector: e,
                needsContext: e && i.expr.match.needsContext.test(e),
                namespace: d.join(".")
            },
            v), (l = p[o]) || (l = p[o] = [], l.delegateCount = 0, s.setup && s.setup.call(n, f, d, y) !== !1 || n.addEventListener && n.addEventListener(o, y, !1)), s.add && (s.add.call(n, h), h.handler.guid || (h.handler.guid = u.guid)), e ? l.splice(l.delegateCount++, 0, h) : l.push(h), i.event.global[o] = !0)
        },
        remove: function(n, t, u, f, e) {
            var p, k, h, v, w, s, l, a, o, b, d, y = r.hasData(n) && r.get(n);
            if (y && (v = y.events)) {
                for (t = (t || "").match(c) || [""], w = t.length; w--;) if (h = sr.exec(t[w]) || [], o = d = h[1], b = (h[2] || "").split(".").sort(), o) {
                    for (l = i.event.special[o] || {},
                    o = (f ? l.delegateType: l.bindType) || o, a = v[o] || [], h = h[2] && new RegExp("(^|\\.)" + b.join("\\.(?:.*\\.|)") + "(\\.|$)"), k = p = a.length; p--;) s = a[p],
                    !e && d !== s.origType || u && u.guid !== s.guid || h && !h.test(s.namespace) || f && f !== s.selector && ("**" !== f || !s.selector) || (a.splice(p, 1), s.selector && a.delegateCount--, l.remove && l.remove.call(n, s));
                    k && !a.length && (l.teardown && l.teardown.call(n, b, y.handle) !== !1 || i.removeEvent(n, o, y.handle), delete v[o])
                } else for (o in v) i.event.remove(n, o + t[w], u, f, !0);
                i.isEmptyObject(v) && (delete y.handle, r.remove(n, "events"))
            }
        },
        trigger: function(t, f, e, o) {
            var w, s, c, b, a, v, l, p = [e || u],
            h = ii.call(t, "type") ? t.type: t,
            y = ii.call(t, "namespace") ? t.namespace.split(".") : [];
            if (s = c = e = e || u, 3 !== e.nodeType && 8 !== e.nodeType && !or.test(h + i.event.triggered) && (h.indexOf(".") >= 0 && (y = h.split("."), h = y.shift(), y.sort()), a = h.indexOf(":") < 0 && "on" + h, t = t[i.expando] ? t: new i.Event(h, "object" == typeof t && t), t.isTrigger = o ? 2 : 3, t.namespace = y.join("."), t.namespace_re = t.namespace ? new RegExp("(^|\\.)" + y.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, t.result = void 0, t.target || (t.target = e), f = null == f ? [t] : i.makeArray(f, [t]), l = i.event.special[h] || {},
            o || !l.trigger || l.trigger.apply(e, f) !== !1)) {
                if (!o && !l.noBubble && !i.isWindow(e)) {
                    for (b = l.delegateType || h, or.test(b + h) || (s = s.parentNode); s; s = s.parentNode) p.push(s),
                    c = s;
                    c === (e.ownerDocument || u) && p.push(c.defaultView || c.parentWindow || n)
                }
                for (w = 0; (s = p[w++]) && !t.isPropagationStopped();) t.type = w > 1 ? b: l.bindType || h,
                v = (r.get(s, "events") || {})[t.type] && r.get(s, "handle"),
                v && v.apply(s, f),
                v = a && s[a],
                v && v.apply && i.acceptData(s) && (t.result = v.apply(s, f), t.result === !1 && t.preventDefault());
                return t.type = h,
                o || t.isDefaultPrevented() || l._default && l._default.apply(p.pop(), f) !== !1 || !i.acceptData(e) || a && i.isFunction(e[h]) && !i.isWindow(e) && (c = e[a], c && (e[a] = null), i.event.triggered = h, e[h](), i.event.triggered = void 0, c && (e[a] = c)),
                t.result
            }
        },
        dispatch: function(n) {
            n = i.event.fix(n);
            var o, s, e, u, t, h = [],
            c = a.call(arguments),
            l = (r.get(this, "events") || {})[n.type] || [],
            f = i.event.special[n.type] || {};
            if (c[0] = n, n.delegateTarget = this, !f.preDispatch || f.preDispatch.call(this, n) !== !1) {
                for (h = i.event.handlers.call(this, n, l), o = 0; (u = h[o++]) && !n.isPropagationStopped();) for (n.currentTarget = u.elem, s = 0; (t = u.handlers[s++]) && !n.isImmediatePropagationStopped();)(!n.namespace_re || n.namespace_re.test(t.namespace)) && (n.handleObj = t, n.data = t.data, e = ((i.event.special[t.origType] || {}).handle || t.handler).apply(u.elem, c), void 0 !== e && (n.result = e) === !1 && (n.preventDefault(), n.stopPropagation()));
                return f.postDispatch && f.postDispatch.call(this, n),
                n.result
            }
        },
        handlers: function(n, t) {
            var e, u, f, o, h = [],
            s = t.delegateCount,
            r = n.target;
            if (s && r.nodeType && (!n.button || "click" !== n.type)) for (; r !== this; r = r.parentNode || this) if (r.disabled !== !0 || "click" !== n.type) {
                for (u = [], e = 0; s > e; e++) o = t[e],
                f = o.selector + " ",
                void 0 === u[f] && (u[f] = o.needsContext ? i(f, this).index(r) >= 0 : i.find(f, this, null, [r]).length),
                u[f] && u.push(o);
                u.length && h.push({
                    elem: r,
                    handlers: u
                })
            }
            return s < t.length && h.push({
                elem: this,
                handlers: t.slice(s)
            }),
            h
        },
        props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
        fixHooks: {},
        keyHooks: {
            props: "char charCode key keyCode".split(" "),
            filter: function(n, t) {
                return null == n.which && (n.which = null != t.charCode ? t.charCode: t.keyCode),
                n
            }
        },
        mouseHooks: {
            props: "button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
            filter: function(n, t) {
                var e, i, r, f = t.button;
                return null == n.pageX && null != t.clientX && (e = n.target.ownerDocument || u, i = e.documentElement, r = e.body, n.pageX = t.clientX + (i && i.scrollLeft || r && r.scrollLeft || 0) - (i && i.clientLeft || r && r.clientLeft || 0), n.pageY = t.clientY + (i && i.scrollTop || r && r.scrollTop || 0) - (i && i.clientTop || r && r.clientTop || 0)),
                n.which || void 0 === f || (n.which = 1 & f ? 1 : 2 & f ? 3 : 4 & f ? 2 : 0),
                n
            }
        },
        fix: function(n) {
            if (n[i.expando]) return n;
            var f, e, o, r = n.type,
            s = n,
            t = this.fixHooks[r];
            for (t || (this.fixHooks[r] = t = lf.test(r) ? this.mouseHooks: cf.test(r) ? this.keyHooks: {}), o = t.props ? this.props.concat(t.props) : this.props, n = new i.Event(s), f = o.length; f--;) e = o[f],
            n[e] = s[e];
            return n.target || (n.target = u),
            3 === n.target.nodeType && (n.target = n.target.parentNode),
            t.filter ? t.filter(n, s) : n
        },
        special: {
            load: {
                noBubble: !0
            },
            focus: {
                trigger: function() {
                    if (this !== hr() && this.focus) return (this.focus(), !1)
                },
                delegateType: "focusin"
            },
            blur: {
                trigger: function() {
                    if (this === hr() && this.blur) return (this.blur(), !1)
                },
                delegateType: "focusout"
            },
            click: {
                trigger: function() {
                    if ("checkbox" === this.type && this.click && i.nodeName(this, "input")) return (this.click(), !1)
                },
                _default: function(n) {
                    return i.nodeName(n.target, "a")
                }
            },
            beforeunload: {
                postDispatch: function(n) {
                    void 0 !== n.result && n.originalEvent && (n.originalEvent.returnValue = n.result)
                }
            }
        },
        simulate: function(n, t, r, u) {
            var f = i.extend(new i.Event, r, {
                type: n,
                isSimulated: !0,
                originalEvent: {}
            });
            u ? i.event.trigger(f, null, t) : i.event.dispatch.call(t, f);
            f.isDefaultPrevented() && r.preventDefault()
        }
    };
    i.removeEvent = function(n, t, i) {
        n.removeEventListener && n.removeEventListener(t, i, !1)
    };
    i.Event = function(n, t) {
        return this instanceof i.Event ? (n && n.type ? (this.originalEvent = n, this.type = n.type, this.isDefaultPrevented = n.defaultPrevented || void 0 === n.defaultPrevented && n.returnValue === !1 ? lt: k) : this.type = n, t && i.extend(this, t), this.timeStamp = n && n.timeStamp || i.now(), void(this[i.expando] = !0)) : new i.Event(n, t)
    };
    i.Event.prototype = {
        isDefaultPrevented: k,
        isPropagationStopped: k,
        isImmediatePropagationStopped: k,
        preventDefault: function() {
            var n = this.originalEvent;
            this.isDefaultPrevented = lt;
            n && n.preventDefault && n.preventDefault()
        },
        stopPropagation: function() {
            var n = this.originalEvent;
            this.isPropagationStopped = lt;
            n && n.stopPropagation && n.stopPropagation()
        },
        stopImmediatePropagation: function() {
            var n = this.originalEvent;
            this.isImmediatePropagationStopped = lt;
            n && n.stopImmediatePropagation && n.stopImmediatePropagation();
            this.stopPropagation()
        }
    };
    i.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        pointerenter: "pointerover",
        pointerleave: "pointerout"
    },
    function(n, t) {
        i.event.special[n] = {
            delegateType: t,
            bindType: t,
            handle: function(n) {
                var u, f = this,
                r = n.relatedTarget,
                e = n.handleObj;
                return (!r || r !== f && !i.contains(f, r)) && (n.type = e.origType, u = e.handler.apply(this, arguments), n.type = t),
                u
            }
        }
    });
    f.focusinBubbles || i.each({
        focus: "focusin",
        blur: "focusout"
    },
    function(n, t) {
        var u = function(n) {
            i.event.simulate(t, n.target, i.event.fix(n), !0)
        };
        i.event.special[t] = {
            setup: function() {
                var i = this.ownerDocument || this,
                f = r.access(i, t);
                f || i.addEventListener(n, u, !0);
                r.access(i, t, (f || 0) + 1)
            },
            teardown: function() {
                var i = this.ownerDocument || this,
                f = r.access(i, t) - 1;
                f ? r.access(i, t, f) : (i.removeEventListener(n, u, !0), r.remove(i, t))
            }
        }
    });
    i.fn.extend({
        on: function(n, t, r, u, f) {
            var e, o;
            if ("object" == typeof n) {
                "string" != typeof t && (r = r || t, t = void 0);
                for (o in n) this.on(o, t, r, n[o], f);
                return this
            }
            if (null == r && null == u ? (u = t, r = t = void 0) : null == u && ("string" == typeof t ? (u = r, r = void 0) : (u = r, r = t, t = void 0)), u === !1) u = k;
            else if (!u) return this;
            return 1 === f && (e = u, u = function(n) {
                return i().off(n),
                e.apply(this, arguments)
            },
            u.guid = e.guid || (e.guid = i.guid++)),
            this.each(function() {
                i.event.add(this, n, u, r, t)
            })
        },
        one: function(n, t, i, r) {
            return this.on(n, t, i, r, 1)
        },
        off: function(n, t, r) {
            var u, f;
            if (n && n.preventDefault && n.handleObj) return u = n.handleObj,
            i(n.delegateTarget).off(u.namespace ? u.origType + "." + u.namespace: u.origType, u.selector, u.handler),
            this;
            if ("object" == typeof n) {
                for (f in n) this.off(f, t, n[f]);
                return this
            }
            return (t === !1 || "function" == typeof t) && (r = t, t = void 0),
            r === !1 && (r = k),
            this.each(function() {
                i.event.remove(this, n, r, t)
            })
        },
        trigger: function(n, t) {
            return this.each(function() {
                i.event.trigger(n, t, this)
            })
        },
        triggerHandler: function(n, t) {
            var r = this[0];
            if (r) return i.event.trigger(n, t, r, !0)
        }
    });
    var cr = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
    lr = /<([\w:]+)/,
    af = /<|&#?\w+;/,
    vf = /<(?:script|style|link)/i,
    yf = /checked\s*(?:[^=]|=\s*.checked.)/i,
    ar = /^$|\/(?:java|ecma)script/i,
    pf = /^true\/(.*)/,
    wf = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
    h = {
        option: [1, "<select multiple='multiple'>", "<\/select>"],
        thead: [1, "<table>", "<\/table>"],
        col: [2, "<table><colgroup>", "<\/colgroup><\/table>"],
        tr: [2, "<table><tbody>", "<\/tbody><\/table>"],
        td: [3, "<table><tbody><tr>", "<\/tr><\/tbody><\/table>"],
        _default: [0, "", ""]
    };
    h.optgroup = h.option;
    h.tbody = h.tfoot = h.colgroup = h.caption = h.thead;
    h.th = h.td;
    i.extend({
        clone: function(n, t, r) {
            var u, c, s, e, h = n.cloneNode(!0),
            l = i.contains(n.ownerDocument, n);
            if (! (f.noCloneChecked || 1 !== n.nodeType && 11 !== n.nodeType || i.isXMLDoc(n))) for (e = o(h), s = o(n), u = 0, c = s.length; c > u; u++) df(s[u], e[u]);
            if (t) if (r) for (s = s || o(n), e = e || o(h), u = 0, c = s.length; c > u; u++) yr(s[u], e[u]);
            else yr(n, h);
            return e = o(h, "script"),
            e.length > 0 && ei(e, !l && o(n, "script")),
            h
        },
        buildFragment: function(n, t, r, u) {
            for (var f, e, y, l, p, a, s = t.createDocumentFragment(), v = [], c = 0, w = n.length; w > c; c++) if (f = n[c], f || 0 === f) if ("object" === i.type(f)) i.merge(v, f.nodeType ? [f] : f);
            else if (af.test(f)) {
                for (e = e || s.appendChild(t.createElement("div")), y = (lr.exec(f) || ["", ""])[1].toLowerCase(), l = h[y] || h._default, e.innerHTML = l[1] + f.replace(cr, "<$1><\/$2>") + l[2], a = l[0]; a--;) e = e.lastChild;
                i.merge(v, e.childNodes);
                e = s.firstChild;
                e.textContent = ""
            } else v.push(t.createTextNode(f));
            for (s.textContent = "", c = 0; f = v[c++];) if ((!u || -1 === i.inArray(f, u)) && (p = i.contains(f.ownerDocument, f), e = o(s.appendChild(f), "script"), p && ei(e), r)) for (a = 0; f = e[a++];) ar.test(f.type || "") && r.push(f);
            return s
        },
        cleanData: function(n) {
            for (var f, t, o, u, h = i.event.special,
            s = 0; void 0 !== (t = n[s]); s++) {
                if (i.acceptData(t) && (u = t[r.expando], u && (f = r.cache[u]))) {
                    if (f.events) for (o in f.events) h[o] ? i.event.remove(t, o) : i.removeEvent(t, o, f.handle);
                    r.cache[u] && delete r.cache[u]
                }
                delete e.cache[t[e.expando]]
            }
        }
    });
    i.fn.extend({
        text: function(n) {
            return l(this,
            function(n) {
                return void 0 === n ? i.text(this) : this.empty().each(function() { (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) && (this.textContent = n)
                })
            },
            null, n, arguments.length)
        },
        append: function() {
            return this.domManip(arguments,
            function(n) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var t = vr(this, n);
                    t.appendChild(n)
                }
            })
        },
        prepend: function() {
            return this.domManip(arguments,
            function(n) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var t = vr(this, n);
                    t.insertBefore(n, t.firstChild)
                }
            })
        },
        before: function() {
            return this.domManip(arguments,
            function(n) {
                this.parentNode && this.parentNode.insertBefore(n, this)
            })
        },
        after: function() {
            return this.domManip(arguments,
            function(n) {
                this.parentNode && this.parentNode.insertBefore(n, this.nextSibling)
            })
        },
        remove: function(n, t) {
            for (var r, f = n ? i.filter(n, this) : this, u = 0; null != (r = f[u]); u++) t || 1 !== r.nodeType || i.cleanData(o(r)),
            r.parentNode && (t && i.contains(r.ownerDocument, r) && ei(o(r, "script")), r.parentNode.removeChild(r));
            return this
        },
        empty: function() {
            for (var n, t = 0; null != (n = this[t]); t++) 1 === n.nodeType && (i.cleanData(o(n, !1)), n.textContent = "");
            return this
        },
        clone: function(n, t) {
            return n = null == n ? !1 : n,
            t = null == t ? n: t,
            this.map(function() {
                return i.clone(this, n, t)
            })
        },
        html: function(n) {
            return l(this,
            function(n) {
                var t = this[0] || {},
                r = 0,
                u = this.length;
                if (void 0 === n && 1 === t.nodeType) return t.innerHTML;
                if ("string" == typeof n && !vf.test(n) && !h[(lr.exec(n) || ["", ""])[1].toLowerCase()]) {
                    n = n.replace(cr, "<$1><\/$2>");
                    try {
                        for (; u > r; r++) t = this[r] || {},
                        1 === t.nodeType && (i.cleanData(o(t, !1)), t.innerHTML = n);
                        t = 0
                    } catch(f) {}
                }
                t && this.empty().append(n)
            },
            null, n, arguments.length)
        },
        replaceWith: function() {
            var n = arguments[0];
            return this.domManip(arguments,
            function(t) {
                n = this.parentNode;
                i.cleanData(o(this));
                n && n.replaceChild(t, this)
            }),
            n && (n.length || n.nodeType) ? this: this.remove()
        },
        detach: function(n) {
            return this.remove(n, !0)
        },
        domManip: function(n, t) {
            n = bi.apply([], n);
            var h, v, s, c, u, y, e = 0,
            l = this.length,
            w = this,
            b = l - 1,
            a = n[0],
            p = i.isFunction(a);
            if (p || l > 1 && "string" == typeof a && !f.checkClone && yf.test(a)) return this.each(function(i) {
                var r = w.eq(i);
                p && (n[0] = a.call(this, i, r.html()));
                r.domManip(n, t)
            });
            if (l && (h = i.buildFragment(n, this[0].ownerDocument, !1, this), v = h.firstChild, 1 === h.childNodes.length && (h = v), v)) {
                for (s = i.map(o(h, "script"), bf), c = s.length; l > e; e++) u = h,
                e !== b && (u = i.clone(u, !0, !0), c && i.merge(s, o(u, "script"))),
                t.call(this[e], u, e);
                if (c) for (y = s[s.length - 1].ownerDocument, i.map(s, kf), e = 0; c > e; e++) u = s[e],
                ar.test(u.type || "") && !r.access(u, "globalEval") && i.contains(y, u) && (u.src ? i._evalUrl && i._evalUrl(u.src) : i.globalEval(u.textContent.replace(wf, "")))
            }
            return this
        }
    });
    i.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    },
    function(n, t) {
        i.fn[n] = function(n) {
            for (var u, f = [], e = i(n), o = e.length - 1, r = 0; o >= r; r++) u = r === o ? this: this.clone(!0),
            i(e[r])[t](u),
            ti.apply(f, u.get());
            return this.pushStack(f)
        }
    });
    oi = {};
    var wr = /^margin/,
    hi = new RegExp("^(" + ct + ")(?!px)[a-z%]+$", "i"),
    vt = function(t) {
        return t.ownerDocument.defaultView.opener ? t.ownerDocument.defaultView.getComputedStyle(t, null) : n.getComputedStyle(t, null)
    }; !
    function() {
        var s, o, e = u.documentElement,
        r = u.createElement("div"),
        t = u.createElement("div");
        if (t.style) {
            t.style.backgroundClip = "content-box";
            t.cloneNode(!0).style.backgroundClip = "";
            f.clearCloneStyle = "content-box" === t.style.backgroundClip;
            r.style.cssText = "border:0;width:0;height:0;top:0;left:-9999px;margin-top:1px;position:absolute";
            r.appendChild(t);
            function h() {
                t.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;margin-top:1%;top:1%;border:1px;padding:1px;width:4px;position:absolute";
                t.innerHTML = "";
                e.appendChild(r);
                var i = n.getComputedStyle(t, null);
                s = "1%" !== i.top;
                o = "4px" === i.width;
                e.removeChild(r)
            }
            n.getComputedStyle && i.extend(f, {
                pixelPosition: function() {
                    return h(),
                    s
                },
                boxSizingReliable: function() {
                    return null == o && h(),
                    o
                },
                reliableMarginRight: function() {
                    var f, i = t.appendChild(u.createElement("div"));
                    return i.style.cssText = t.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0",
                    i.style.marginRight = i.style.width = "0",
                    t.style.width = "1px",
                    e.appendChild(r),
                    f = !parseFloat(n.getComputedStyle(i, null).marginRight),
                    e.removeChild(r),
                    t.removeChild(i),
                    f
                }
            })
        }
    } ();
    i.swap = function(n, t, i, r) {
        var f, u, e = {};
        for (u in t) e[u] = n.style[u],
        n.style[u] = t[u];
        f = i.apply(n, r || []);
        for (u in t) n.style[u] = e[u];
        return f
    };
    var gf = /^(none|table(?!-c[ea]).+)/,
    ne = new RegExp("^(" + ct + ")(.*)$", "i"),
    te = new RegExp("^([+-])=(" + ct + ")", "i"),
    ie = {
        position: "absolute",
        visibility: "hidden",
        display: "block"
    },
    kr = {
        letterSpacing: "0",
        fontWeight: "400"
    },
    dr = ["Webkit", "O", "Moz", "ms"];
    i.extend({
        cssHooks: {
            opacity: {
                get: function(n, t) {
                    if (t) {
                        var i = it(n, "opacity");
                        return "" === i ? "1": i
                    }
                }
            }
        },
        cssNumber: {
            columnCount: !0,
            fillOpacity: !0,
            flexGrow: !0,
            flexShrink: !0,
            fontWeight: !0,
            lineHeight: !0,
            opacity: !0,
            order: !0,
            orphans: !0,
            widows: !0,
            zIndex: !0,
            zoom: !0
        },
        cssProps: {
            float: "cssFloat"
        },
        style: function(n, t, r, u) {
            if (n && 3 !== n.nodeType && 8 !== n.nodeType && n.style) {
                var o, h, e, s = i.camelCase(t),
                c = n.style;
                return t = i.cssProps[s] || (i.cssProps[s] = gr(c, s)),
                e = i.cssHooks[t] || i.cssHooks[s],
                void 0 === r ? e && "get" in e && void 0 !== (o = e.get(n, !1, u)) ? o: c[t] : (h = typeof r, "string" === h && (o = te.exec(r)) && (r = (o[1] + 1) * o[2] + parseFloat(i.css(n, t)), h = "number"), null != r && r === r && ("number" !== h || i.cssNumber[s] || (r += "px"), f.clearCloneStyle || "" !== r || 0 !== t.indexOf("background") || (c[t] = "inherit"), e && "set" in e && void 0 === (r = e.set(n, r, u)) || (c[t] = r)), void 0)
            }
        },
        css: function(n, t, r, u) {
            var f, s, e, o = i.camelCase(t);
            return t = i.cssProps[o] || (i.cssProps[o] = gr(n.style, o)),
            e = i.cssHooks[t] || i.cssHooks[o],
            e && "get" in e && (f = e.get(n, !0, r)),
            void 0 === f && (f = it(n, t, u)),
            "normal" === f && t in kr && (f = kr[t]),
            "" === r || r ? (s = parseFloat(f), r === !0 || i.isNumeric(s) ? s || 0 : f) : f
        }
    });
    i.each(["height", "width"],
    function(n, t) {
        i.cssHooks[t] = {
            get: function(n, r, u) {
                if (r) return gf.test(i.css(n, "display")) && 0 === n.offsetWidth ? i.swap(n, ie,
                function() {
                    return iu(n, t, u)
                }) : iu(n, t, u)
            },
            set: function(n, r, u) {
                var f = u && vt(n);
                return nu(n, r, u ? tu(n, t, u, "border-box" === i.css(n, "boxSizing", !1, f), f) : 0)
            }
        }
    });
    i.cssHooks.marginRight = br(f.reliableMarginRight,
    function(n, t) {
        if (t) return i.swap(n, {
            display: "inline-block"
        },
        it, [n, "marginRight"])
    });
    i.each({
        margin: "",
        padding: "",
        border: "Width"
    },
    function(n, t) {
        i.cssHooks[n + t] = {
            expand: function(i) {
                for (var r = 0,
                f = {},
                u = "string" == typeof i ? i.split(" ") : [i]; 4 > r; r++) f[n + p[r] + t] = u[r] || u[r - 2] || u[0];
                return f
            }
        };
        wr.test(n) || (i.cssHooks[n + t].set = nu)
    });
    i.fn.extend({
        css: function(n, t) {
            return l(this,
            function(n, t, r) {
                var f, e, o = {},
                u = 0;
                if (i.isArray(t)) {
                    for (f = vt(n), e = t.length; e > u; u++) o[t[u]] = i.css(n, t[u], !1, f);
                    return o
                }
                return void 0 !== r ? i.style(n, t, r) : i.css(n, t)
            },
            n, t, arguments.length > 1)
        },
        show: function() {
            return ru(this, !0)
        },
        hide: function() {
            return ru(this)
        },
        toggle: function(n) {
            return "boolean" == typeof n ? n ? this.show() : this.hide() : this.each(function() {
                tt(this) ? i(this).show() : i(this).hide()
            })
        }
    });
    i.Tween = s;
    s.prototype = {
        constructor: s,
        init: function(n, t, r, u, f, e) {
            this.elem = n;
            this.prop = r;
            this.easing = f || "swing";
            this.options = t;
            this.start = this.now = this.cur();
            this.end = u;
            this.unit = e || (i.cssNumber[r] ? "": "px")
        },
        cur: function() {
            var n = s.propHooks[this.prop];
            return n && n.get ? n.get(this) : s.propHooks._default.get(this)
        },
        run: function(n) {
            var r, t = s.propHooks[this.prop];
            return this.pos = r = this.options.duration ? i.easing[this.easing](n, this.options.duration * n, 0, 1, this.options.duration) : n,
            this.now = (this.end - this.start) * r + this.start,
            this.options.step && this.options.step.call(this.elem, this.now, this),
            t && t.set ? t.set(this) : s.propHooks._default.set(this),
            this
        }
    };
    s.prototype.init.prototype = s.prototype;
    s.propHooks = {
        _default: {
            get: function(n) {
                var t;
                return null == n.elem[n.prop] || n.elem.style && null != n.elem.style[n.prop] ? (t = i.css(n.elem, n.prop, ""), t && "auto" !== t ? t: 0) : n.elem[n.prop]
            },
            set: function(n) {
                i.fx.step[n.prop] ? i.fx.step[n.prop](n) : n.elem.style && (null != n.elem.style[i.cssProps[n.prop]] || i.cssHooks[n.prop]) ? i.style(n.elem, n.prop, n.now + n.unit) : n.elem[n.prop] = n.now
            }
        }
    };
    s.propHooks.scrollTop = s.propHooks.scrollLeft = {
        set: function(n) {
            n.elem.nodeType && n.elem.parentNode && (n.elem[n.prop] = n.now)
        }
    };
    i.easing = {
        linear: function(n) {
            return n
        },
        swing: function(n) {
            return.5 - Math.cos(n * Math.PI) / 2
        }
    };
    i.fx = s.prototype.init;
    i.fx.step = {};
    var d, yt, re = /^(?:toggle|show|hide)$/,
    uu = new RegExp("^(?:([+-])=|)(" + ct + ")([a-z%]*)$", "i"),
    ue = /queueHooks$/,
    pt = [fe],
    rt = {
        "*": [function(n, t) {
            var f = this.createTween(n, t),
            s = f.cur(),
            r = uu.exec(t),
            e = r && r[3] || (i.cssNumber[n] ? "": "px"),
            u = (i.cssNumber[n] || "px" !== e && +s) && uu.exec(i.css(f.elem, n)),
            o = 1,
            h = 20;
            if (u && u[3] !== e) {
                e = e || u[3];
                r = r || [];
                u = +s || 1;
                do o = o || ".5",
                u /= o,
                i.style(f.elem, n, u + e);
                while (o !== (o = f.cur() / s) && 1 !== o && --h)
            }
            return r && (u = f.start = +u || +s || 0, f.unit = e, f.end = r[1] ? u + (r[1] + 1) * r[2] : +r[2]),
            f
        }]
    };
    i.Animation = i.extend(ou, {
        tweener: function(n, t) {
            i.isFunction(n) ? (t = n, n = ["*"]) : n = n.split(" ");
            for (var r, u = 0,
            f = n.length; f > u; u++) r = n[u],
            rt[r] = rt[r] || [],
            rt[r].unshift(t)
        },
        prefilter: function(n, t) {
            t ? pt.unshift(n) : pt.push(n)
        }
    });
    i.speed = function(n, t, r) {
        var u = n && "object" == typeof n ? i.extend({},
        n) : {
            complete: r || !r && t || i.isFunction(n) && n,
            duration: n,
            easing: r && t || t && !i.isFunction(t) && t
        };
        return u.duration = i.fx.off ? 0 : "number" == typeof u.duration ? u.duration: u.duration in i.fx.speeds ? i.fx.speeds[u.duration] : i.fx.speeds._default,
        (null == u.queue || u.queue === !0) && (u.queue = "fx"),
        u.old = u.complete,
        u.complete = function() {
            i.isFunction(u.old) && u.old.call(this);
            u.queue && i.dequeue(this, u.queue)
        },
        u
    };
    i.fn.extend({
        fadeTo: function(n, t, i, r) {
            return this.filter(tt).css("opacity", 0).show().end().animate({
                opacity: t
            },
            n, i, r)
        },
        animate: function(n, t, u, f) {
            var s = i.isEmptyObject(n),
            o = i.speed(t, u, f),
            e = function() {
                var t = ou(this, i.extend({},
                n), o); (s || r.get(this, "finish")) && t.stop(!0)
            };
            return e.finish = e,
            s || o.queue === !1 ? this.each(e) : this.queue(o.queue, e)
        },
        stop: function(n, t, u) {
            var f = function(n) {
                var t = n.stop;
                delete n.stop;
                t(u)
            };
            return "string" != typeof n && (u = t, t = n, n = void 0),
            t && n !== !1 && this.queue(n || "fx", []),
            this.each(function() {
                var s = !0,
                t = null != n && n + "queueHooks",
                o = i.timers,
                e = r.get(this);
                if (t) e[t] && e[t].stop && f(e[t]);
                else for (t in e) e[t] && e[t].stop && ue.test(t) && f(e[t]);
                for (t = o.length; t--;) o[t].elem !== this || null != n && o[t].queue !== n || (o[t].anim.stop(u), s = !1, o.splice(t, 1)); (s || !u) && i.dequeue(this, n)
            })
        },
        finish: function(n) {
            return n !== !1 && (n = n || "fx"),
            this.each(function() {
                var t, e = r.get(this),
                u = e[n + "queue"],
                o = e[n + "queueHooks"],
                f = i.timers,
                s = u ? u.length: 0;
                for (e.finish = !0, i.queue(this, n, []), o && o.stop && o.stop.call(this, !0), t = f.length; t--;) f[t].elem === this && f[t].queue === n && (f[t].anim.stop(!0), f.splice(t, 1));
                for (t = 0; s > t; t++) u[t] && u[t].finish && u[t].finish.call(this);
                delete e.finish
            })
        }
    });
    i.each(["toggle", "show", "hide"],
    function(n, t) {
        var r = i.fn[t];
        i.fn[t] = function(n, i, u) {
            return null == n || "boolean" == typeof n ? r.apply(this, arguments) : this.animate(wt(t, !0), n, i, u)
        }
    });
    i.each({
        slideDown: wt("show"),
        slideUp: wt("hide"),
        slideToggle: wt("toggle"),
        fadeIn: {
            opacity: "show"
        },
        fadeOut: {
            opacity: "hide"
        },
        fadeToggle: {
            opacity: "toggle"
        }
    },
    function(n, t) {
        i.fn[n] = function(n, i, r) {
            return this.animate(t, n, i, r)
        }
    });
    i.timers = [];
    i.fx.tick = function() {
        var r, n = 0,
        t = i.timers;
        for (d = i.now(); n < t.length; n++) r = t[n],
        r() || t[n] !== r || t.splice(n--, 1);
        t.length || i.fx.stop();
        d = void 0
    };
    i.fx.timer = function(n) {
        i.timers.push(n);
        n() ? i.fx.start() : i.timers.pop()
    };
    i.fx.interval = 13;
    i.fx.start = function() {
        yt || (yt = setInterval(i.fx.tick, i.fx.interval))
    };
    i.fx.stop = function() {
        clearInterval(yt);
        yt = null
    };
    i.fx.speeds = {
        slow: 600,
        fast: 200,
        _default: 400
    };
    i.fn.delay = function(n, t) {
        return n = i.fx ? i.fx.speeds[n] || n: n,
        t = t || "fx",
        this.queue(t,
        function(t, i) {
            var r = setTimeout(t, n);
            i.stop = function() {
                clearTimeout(r)
            }
        })
    },
    function() {
        var n = u.createElement("input"),
        t = u.createElement("select"),
        i = t.appendChild(u.createElement("option"));
        n.type = "checkbox";
        f.checkOn = "" !== n.value;
        f.optSelected = i.selected;
        t.disabled = !0;
        f.optDisabled = !i.disabled;
        n = u.createElement("input");
        n.value = "t";
        n.type = "radio";
        f.radioValue = "t" === n.value
    } ();
    g = i.expr.attrHandle;
    i.fn.extend({
        attr: function(n, t) {
            return l(this, i.attr, n, t, arguments.length > 1)
        },
        removeAttr: function(n) {
            return this.each(function() {
                i.removeAttr(this, n)
            })
        }
    });
    i.extend({
        attr: function(n, t, r) {
            var u, f, e = n.nodeType;
            if (n && 3 !== e && 8 !== e && 2 !== e) return typeof n.getAttribute === b ? i.prop(n, t, r) : (1 === e && i.isXMLDoc(n) || (t = t.toLowerCase(), u = i.attrHooks[t] || (i.expr.match.bool.test(t) ? su: oe)), void 0 === r ? u && "get" in u && null !== (f = u.get(n, t)) ? f: (f = i.find.attr(n, t), null == f ? void 0 : f) : null !== r ? u && "set" in u && void 0 !== (f = u.set(n, r, t)) ? f: (n.setAttribute(t, r + ""), r) : void i.removeAttr(n, t))
        },
        removeAttr: function(n, t) {
            var r, u, e = 0,
            f = t && t.match(c);
            if (f && 1 === n.nodeType) while (r = f[e++]) u = i.propFix[r] || r,
            i.expr.match.bool.test(r) && (n[u] = !1),
            n.removeAttribute(r)
        },
        attrHooks: {
            type: {
                set: function(n, t) {
                    if (!f.radioValue && "radio" === t && i.nodeName(n, "input")) {
                        var r = n.value;
                        return n.setAttribute("type", t),
                        r && (n.value = r),
                        t
                    }
                }
            }
        }
    });
    su = {
        set: function(n, t, r) {
            return t === !1 ? i.removeAttr(n, r) : n.setAttribute(r, r),
            r
        }
    };
    i.each(i.expr.match.bool.source.match(/\w+/g),
    function(n, t) {
        var r = g[t] || i.find.attr;
        g[t] = function(n, t, i) {
            var u, f;
            return i || (f = g[t], g[t] = u, u = null != r(n, t, i) ? t.toLowerCase() : null, g[t] = f),
            u
        }
    });
    hu = /^(?:input|select|textarea|button)$/i;
    i.fn.extend({
        prop: function(n, t) {
            return l(this, i.prop, n, t, arguments.length > 1)
        },
        removeProp: function(n) {
            return this.each(function() {
                delete this[i.propFix[n] || n]
            })
        }
    });
    i.extend({
        propFix: {
            "for": "htmlFor",
            "class": "className"
        },
        prop: function(n, t, r) {
            var f, u, o, e = n.nodeType;
            if (n && 3 !== e && 8 !== e && 2 !== e) return o = 1 !== e || !i.isXMLDoc(n),
            o && (t = i.propFix[t] || t, u = i.propHooks[t]),
            void 0 !== r ? u && "set" in u && void 0 !== (f = u.set(n, r, t)) ? f: n[t] = r: u && "get" in u && null !== (f = u.get(n, t)) ? f: n[t]
        },
        propHooks: {
            tabIndex: {
                get: function(n) {
                    return n.hasAttribute("tabindex") || hu.test(n.nodeName) || n.href ? n.tabIndex: -1
                }
            }
        }
    });
    f.optSelected || (i.propHooks.selected = {
        get: function(n) {
            var t = n.parentNode;
            return t && t.parentNode && t.parentNode.selectedIndex,
            null
        }
    });
    i.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"],
    function() {
        i.propFix[this.toLowerCase()] = this
    });
    bt = /[\t\r\n\f]/g;
    i.fn.extend({
        addClass: function(n) {
            var o, t, r, u, s, f, h = "string" == typeof n && n,
            e = 0,
            l = this.length;
            if (i.isFunction(n)) return this.each(function(t) {
                i(this).addClass(n.call(this, t, this.className))
            });
            if (h) for (o = (n || "").match(c) || []; l > e; e++) if (t = this[e], r = 1 === t.nodeType && (t.className ? (" " + t.className + " ").replace(bt, " ") : " ")) {
                for (s = 0; u = o[s++];) r.indexOf(" " + u + " ") < 0 && (r += u + " ");
                f = i.trim(r);
                t.className !== f && (t.className = f)
            }
            return this
        },
        removeClass: function(n) {
            var o, t, r, u, s, f, h = 0 === arguments.length || "string" == typeof n && n,
            e = 0,
            l = this.length;
            if (i.isFunction(n)) return this.each(function(t) {
                i(this).removeClass(n.call(this, t, this.className))
            });
            if (h) for (o = (n || "").match(c) || []; l > e; e++) if (t = this[e], r = 1 === t.nodeType && (t.className ? (" " + t.className + " ").replace(bt, " ") : "")) {
                for (s = 0; u = o[s++];) while (r.indexOf(" " + u + " ") >= 0) r = r.replace(" " + u + " ", " ");
                f = n ? i.trim(r) : "";
                t.className !== f && (t.className = f)
            }
            return this
        },
        toggleClass: function(n, t) {
            var u = typeof n;
            return "boolean" == typeof t && "string" === u ? t ? this.addClass(n) : this.removeClass(n) : this.each(i.isFunction(n) ?
            function(r) {
                i(this).toggleClass(n.call(this, r, this.className, t), t)
            }: function() {
                if ("string" === u) for (var t, e = 0,
                f = i(this), o = n.match(c) || []; t = o[e++];) f.hasClass(t) ? f.removeClass(t) : f.addClass(t);
                else(u === b || "boolean" === u) && (this.className && r.set(this, "__className__", this.className), this.className = this.className || n === !1 ? "": r.get(this, "__className__") || "")
            })
        },
        hasClass: function(n) {
            for (var i = " " + n + " ",
            t = 0,
            r = this.length; r > t; t++) if (1 === this[t].nodeType && (" " + this[t].className + " ").replace(bt, " ").indexOf(i) >= 0) return ! 0;
            return ! 1
        }
    });
    cu = /\r/g;
    i.fn.extend({
        val: function(n) {
            var t, r, f, u = this[0];
            return arguments.length ? (f = i.isFunction(n), this.each(function(r) {
                var u;
                1 === this.nodeType && (u = f ? n.call(this, r, i(this).val()) : n, null == u ? u = "": "number" == typeof u ? u += "": i.isArray(u) && (u = i.map(u,
                function(n) {
                    return null == n ? "": n + ""
                })), t = i.valHooks[this.type] || i.valHooks[this.nodeName.toLowerCase()], t && "set" in t && void 0 !== t.set(this, u, "value") || (this.value = u))
            })) : u ? (t = i.valHooks[u.type] || i.valHooks[u.nodeName.toLowerCase()], t && "get" in t && void 0 !== (r = t.get(u, "value")) ? r: (r = u.value, "string" == typeof r ? r.replace(cu, "") : null == r ? "": r)) : void 0
        }
    });
    i.extend({
        valHooks: {
            option: {
                get: function(n) {
                    var t = i.find.attr(n, "value");
                    return null != t ? t: i.trim(i.text(n))
                }
            },
            select: {
                get: function(n) {
                    for (var o, t, s = n.options,
                    r = n.selectedIndex,
                    u = "select-one" === n.type || 0 > r,
                    h = u ? null: [], c = u ? r + 1 : s.length, e = 0 > r ? c: u ? r: 0; c > e; e++) if (t = s[e], !(!t.selected && e !== r || (f.optDisabled ? t.disabled: null !== t.getAttribute("disabled")) || t.parentNode.disabled && i.nodeName(t.parentNode, "optgroup"))) {
                        if (o = i(t).val(), u) return o;
                        h.push(o)
                    }
                    return h
                },
                set: function(n, t) {
                    for (var u, r, f = n.options,
                    e = i.makeArray(t), o = f.length; o--;) r = f[o],
                    (r.selected = i.inArray(r.value, e) >= 0) && (u = !0);
                    return u || (n.selectedIndex = -1),
                    e
                }
            }
        }
    });
    i.each(["radio", "checkbox"],
    function() {
        i.valHooks[this] = {
            set: function(n, t) {
                if (i.isArray(t)) return n.checked = i.inArray(i(n).val(), t) >= 0
            }
        };
        f.checkOn || (i.valHooks[this].get = function(n) {
            return null === n.getAttribute("value") ? "on": n.value
        })
    });
    i.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),
    function(n, t) {
        i.fn[t] = function(n, i) {
            return arguments.length > 0 ? this.on(t, null, n, i) : this.trigger(t)
        }
    });
    i.fn.extend({
        hover: function(n, t) {
            return this.mouseenter(n).mouseleave(t || n)
        },
        bind: function(n, t, i) {
            return this.on(n, null, t, i)
        },
        unbind: function(n, t) {
            return this.off(n, null, t)
        },
        delegate: function(n, t, i, r) {
            return this.on(t, n, i, r)
        },
        undelegate: function(n, t, i) {
            return 1 === arguments.length ? this.off(n, "**") : this.off(t, n || "**", i)
        }
    });
    kt = i.now();
    dt = /\?/;
    i.parseJSON = function(n) {
        return JSON.parse(n + "")
    };
    i.parseXML = function(n) {
        var t, r;
        if (!n || "string" != typeof n) return null;
        try {
            r = new DOMParser;
            t = r.parseFromString(n, "text/xml")
        } catch(u) {
            t = void 0
        }
        return (!t || t.getElementsByTagName("parsererror").length) && i.error("Invalid XML: " + n),
        t
    };
    var se = /#.*$/,
    lu = /([?&])_=[^&]*/,
    he = /^(.*?):[ \t]*([^\r\n]*)$/gm,
    ce = /^(?:GET|HEAD)$/,
    le = /^\/\//,
    au = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,
    vu = {},
    ci = {},
    yu = "*/".concat("*"),
    li = n.location.href,
    nt = au.exec(li.toLowerCase()) || [];
    i.extend({
        active: 0,
        lastModified: {},
        etag: {},
        ajaxSettings: {
            url: li,
            type: "GET",
            isLocal: /^(?:about|app|app-storage|.+-extension|file|res|widget):$/.test(nt[1]),
            global: !0,
            processData: !0,
            async: !0,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            accepts: {
                "*": yu,
                text: "text/plain",
                html: "text/html",
                xml: "application/xml, text/xml",
                json: "application/json, text/javascript"
            },
            contents: {
                xml: /xml/,
                html: /html/,
                json: /json/
            },
            responseFields: {
                xml: "responseXML",
                text: "responseText",
                json: "responseJSON"
            },
            converters: {
                "* text": String,
                "text html": !0,
                "text json": i.parseJSON,
                "text xml": i.parseXML
            },
            flatOptions: {
                url: !0,
                context: !0
            }
        },
        ajaxSetup: function(n, t) {
            return t ? ai(ai(n, i.ajaxSettings), t) : ai(i.ajaxSettings, n)
        },
        ajaxPrefilter: pu(vu),
        ajaxTransport: pu(ci),
        ajax: function(n, t) {
            function p(n, t, s, h) {
                var v, it, tt, p, nt, c = t;
                2 !== e && (e = 2, b && clearTimeout(b), l = void 0, w = h || "", u.readyState = n > 0 ? 4 : 0, v = n >= 200 && 300 > n || 304 === n, s && (p = ae(r, u, s)), p = ve(r, p, u, v), v ? (r.ifModified && (nt = u.getResponseHeader("Last-Modified"), nt && (i.lastModified[f] = nt), nt = u.getResponseHeader("etag"), nt && (i.etag[f] = nt)), 204 === n || "HEAD" === r.type ? c = "nocontent": 304 === n ? c = "notmodified": (c = p.state, it = p.data, tt = p.error, v = !tt)) : (tt = c, (n || !c) && (c = "error", 0 > n && (n = 0))), u.status = n, u.statusText = (t || c) + "", v ? d.resolveWith(o, [it, c, u]) : d.rejectWith(o, [u, c, tt]), u.statusCode(y), y = void 0, a && k.trigger(v ? "ajaxSuccess": "ajaxError", [u, r, v ? it: tt]), g.fireWith(o, [u, c]), a && (k.trigger("ajaxComplete", [u, r]), --i.active || i.event.trigger("ajaxStop")))
            }
            "object" == typeof n && (t = n, n = void 0);
            t = t || {};
            var l, f, w, v, b, s, a, h, r = i.ajaxSetup({},
            t),
            o = r.context || r,
            k = r.context && (o.nodeType || o.jquery) ? i(o) : i.event,
            d = i.Deferred(),
            g = i.Callbacks("once memory"),
            y = r.statusCode || {},
            tt = {},
            it = {},
            e = 0,
            rt = "canceled",
            u = {
                readyState: 0,
                getResponseHeader: function(n) {
                    var t;
                    if (2 === e) {
                        if (!v) for (v = {}; t = he.exec(w);) v[t[1].toLowerCase()] = t[2];
                        t = v[n.toLowerCase()]
                    }
                    return null == t ? null: t
                },
                getAllResponseHeaders: function() {
                    return 2 === e ? w: null
                },
                setRequestHeader: function(n, t) {
                    var i = n.toLowerCase();
                    return e || (n = it[i] = it[i] || n, tt[n] = t),
                    this
                },
                overrideMimeType: function(n) {
                    return e || (r.mimeType = n),
                    this
                },
                statusCode: function(n) {
                    var t;
                    if (n) if (2 > e) for (t in n) y[t] = [y[t], n[t]];
                    else u.always(n[u.status]);
                    return this
                },
                abort: function(n) {
                    var t = n || rt;
                    return l && l.abort(t),
                    p(0, t),
                    this
                }
            };
            if (d.promise(u).complete = g.add, u.success = u.done, u.error = u.fail, r.url = ((n || r.url || li) + "").replace(se, "").replace(le, nt[1] + "//"), r.type = t.method || t.type || r.method || r.type, r.dataTypes = i.trim(r.dataType || "*").toLowerCase().match(c) || [""], null == r.crossDomain && (s = au.exec(r.url.toLowerCase()), r.crossDomain = !(!s || s[1] === nt[1] && s[2] === nt[2] && (s[3] || ("http:" === s[1] ? "80": "443")) === (nt[3] || ("http:" === nt[1] ? "80": "443")))), r.data && r.processData && "string" != typeof r.data && (r.data = i.param(r.data, r.traditional)), wu(vu, r, t, u), 2 === e) return u;
            a = i.event && r.global;
            a && 0 == i.active++&&i.event.trigger("ajaxStart");
            r.type = r.type.toUpperCase();
            r.hasContent = !ce.test(r.type);
            f = r.url;
            r.hasContent || (r.data && (f = r.url += (dt.test(f) ? "&": "?") + r.data, delete r.data), r.cache === !1 && (r.url = lu.test(f) ? f.replace(lu, "$1_=" + kt++) : f + (dt.test(f) ? "&": "?") + "_=" + kt++));
            r.ifModified && (i.lastModified[f] && u.setRequestHeader("If-Modified-Since", i.lastModified[f]), i.etag[f] && u.setRequestHeader("If-None-Match", i.etag[f])); (r.data && r.hasContent && r.contentType !== !1 || t.contentType) && u.setRequestHeader("Content-Type", r.contentType);
            u.setRequestHeader("Accept", r.dataTypes[0] && r.accepts[r.dataTypes[0]] ? r.accepts[r.dataTypes[0]] + ("*" !== r.dataTypes[0] ? ", " + yu + "; q=0.01": "") : r.accepts["*"]);
            for (h in r.headers) u.setRequestHeader(h, r.headers[h]);
            if (r.beforeSend && (r.beforeSend.call(o, u, r) === !1 || 2 === e)) return u.abort();
            rt = "abort";
            for (h in {
                success: 1,
                error: 1,
                complete: 1
            }) u[h](r[h]);
            if (l = wu(ci, r, t, u)) {
                u.readyState = 1;
                a && k.trigger("ajaxSend", [u, r]);
                r.async && r.timeout > 0 && (b = setTimeout(function() {
                    u.abort("timeout")
                },
                r.timeout));
                try {
                    e = 1;
                    l.send(tt, p)
                } catch(ut) {
                    if (! (2 > e)) throw ut;
                    p( - 1, ut)
                }
            } else p( - 1, "No Transport");
            return u
        },
        getJSON: function(n, t, r) {
            return i.get(n, t, r, "json")
        },
        getScript: function(n, t) {
            return i.get(n, void 0, t, "script")
        }
    });
    i.each(["get", "post"],
    function(n, t) {
        i[t] = function(n, r, u, f) {
            return i.isFunction(r) && (f = f || u, u = r, r = void 0),
            i.ajax({
                url: n,
                type: t,
                dataType: f,
                data: r,
                success: u
            })
        }
    });
    i._evalUrl = function(n) {
        return i.ajax({
            url: n,
            type: "GET",
            dataType: "script",
            async: !1,
            global: !1,
            throws: !0
        })
    };
    i.fn.extend({
        wrapAll: function(n) {
            var t;
            return i.isFunction(n) ? this.each(function(t) {
                i(this).wrapAll(n.call(this, t))
            }) : (this[0] && (t = i(n, this[0].ownerDocument).eq(0).clone(!0), this[0].parentNode && t.insertBefore(this[0]), t.map(function() {
                for (var n = this; n.firstElementChild;) n = n.firstElementChild;
                return n
            }).append(this)), this)
        },
        wrapInner: function(n) {
            return this.each(i.isFunction(n) ?
            function(t) {
                i(this).wrapInner(n.call(this, t))
            }: function() {
                var t = i(this),
                r = t.contents();
                r.length ? r.wrapAll(n) : t.append(n)
            })
        },
        wrap: function(n) {
            var t = i.isFunction(n);
            return this.each(function(r) {
                i(this).wrapAll(t ? n.call(this, r) : n)
            })
        },
        unwrap: function() {
            return this.parent().each(function() {
                i.nodeName(this, "body") || i(this).replaceWith(this.childNodes)
            }).end()
        }
    });
    i.expr.filters.hidden = function(n) {
        return n.offsetWidth <= 0 && n.offsetHeight <= 0
    };
    i.expr.filters.visible = function(n) {
        return ! i.expr.filters.hidden(n)
    };
    var ye = /%20/g,
    pe = /\[\]$/,
    bu = /\r?\n/g,
    we = /^(?:submit|button|image|reset|file)$/i,
    be = /^(?:input|select|textarea|keygen)/i;
    i.param = function(n, t) {
        var r, u = [],
        f = function(n, t) {
            t = i.isFunction(t) ? t() : null == t ? "": t;
            u[u.length] = encodeURIComponent(n) + "=" + encodeURIComponent(t)
        };
        if (void 0 === t && (t = i.ajaxSettings && i.ajaxSettings.traditional), i.isArray(n) || n.jquery && !i.isPlainObject(n)) i.each(n,
        function() {
            f(this.name, this.value)
        });
        else for (r in n) vi(r, n[r], t, f);
        return u.join("&").replace(ye, "+")
    };
    i.fn.extend({
        serialize: function() {
            return i.param(this.serializeArray())
        },
        serializeArray: function() {
            return this.map(function() {
                var n = i.prop(this, "elements");
                return n ? i.makeArray(n) : this
            }).filter(function() {
                var n = this.type;
                return this.name && !i(this).is(":disabled") && be.test(this.nodeName) && !we.test(n) && (this.checked || !er.test(n))
            }).map(function(n, t) {
                var r = i(this).val();
                return null == r ? null: i.isArray(r) ? i.map(r,
                function(n) {
                    return {
                        name: t.name,
                        value: n.replace(bu, "\r\n")
                    }
                }) : {
                    name: t.name,
                    value: r.replace(bu, "\r\n")
                }
            }).get()
        }
    });
    i.ajaxSettings.xhr = function() {
        try {
            return new XMLHttpRequest
        } catch(n) {}
    };
    var ke = 0,
    gt = {},
    de = {
        0 : 200,
        1223 : 204
    },
    ut = i.ajaxSettings.xhr();
    return n.attachEvent && n.attachEvent("onunload",
    function() {
        for (var n in gt) gt[n]()
    }),
    f.cors = !!ut && "withCredentials" in ut,
    f.ajax = ut = !!ut,
    i.ajaxTransport(function(n) {
        var t;
        if (f.cors || ut && !n.crossDomain) return {
            send: function(i, r) {
                var f, u = n.xhr(),
                e = ++ke;
                if (u.open(n.type, n.url, n.async, n.username, n.password), n.xhrFields) for (f in n.xhrFields) u[f] = n.xhrFields[f];
                n.mimeType && u.overrideMimeType && u.overrideMimeType(n.mimeType);
                n.crossDomain || i["X-Requested-With"] || (i["X-Requested-With"] = "XMLHttpRequest");
                for (f in i) u.setRequestHeader(f, i[f]);
                t = function(n) {
                    return function() {
                        t && (delete gt[e], t = u.onload = u.onerror = null, "abort" === n ? u.abort() : "error" === n ? r(u.status, u.statusText) : r(de[u.status] || u.status, u.statusText, "string" == typeof u.responseText ? {
                            text: u.responseText
                        }: void 0, u.getAllResponseHeaders()))
                    }
                };
                u.onload = t();
                u.onerror = t("error");
                t = gt[e] = t("abort");
                try {
                    u.send(n.hasContent && n.data || null)
                } catch(o) {
                    if (t) throw o;
                }
            },
            abort: function() {
                t && t()
            }
        }
    }),
    i.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /(?:java|ecma)script/
        },
        converters: {
            "text script": function(n) {
                return i.globalEval(n),
                n
            }
        }
    }),
    i.ajaxPrefilter("script",
    function(n) {
        void 0 === n.cache && (n.cache = !1);
        n.crossDomain && (n.type = "GET")
    }),
    i.ajaxTransport("script",
    function(n) {
        if (n.crossDomain) {
            var r, t;
            return {
                send: function(f, e) {
                    r = i("<script>").prop({
                        async: !0,
                        charset: n.scriptCharset,
                        src: n.url
                    }).on("load error", t = function(n) {
                        r.remove();
                        t = null;
                        n && e("error" === n.type ? 404 : 200, n.type)
                    });
                    u.head.appendChild(r[0])
                },
                abort: function() {
                    t && t()
                }
            }
        }
    }),
    yi = [],
    ni = /(=)\?(?=&|$)|\?\?/,
    i.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
            var n = yi.pop() || i.expando + "_" + kt++;
            return this[n] = !0,
            n
        }
    }),
    i.ajaxPrefilter("json jsonp",
    function(t, r, u) {
        var f, o, e, s = t.jsonp !== !1 && (ni.test(t.url) ? "url": "string" == typeof t.data && !(t.contentType || "").indexOf("application/x-www-form-urlencoded") && ni.test(t.data) && "data");
        if (s || "jsonp" === t.dataTypes[0]) return (f = t.jsonpCallback = i.isFunction(t.jsonpCallback) ? t.jsonpCallback() : t.jsonpCallback, s ? t[s] = t[s].replace(ni, "$1" + f) : t.jsonp !== !1 && (t.url += (dt.test(t.url) ? "&": "?") + t.jsonp + "=" + f), t.converters["script json"] = function() {
            return e || i.error(f + " was not called"),
            e[0]
        },
        t.dataTypes[0] = "json", o = n[f], n[f] = function() {
            e = arguments
        },
        u.always(function() {
            n[f] = o;
            t[f] && (t.jsonpCallback = r.jsonpCallback, yi.push(f));
            e && i.isFunction(o) && o(e[0]);
            e = o = void 0
        }), "script")
    }),
    i.parseHTML = function(n, t, r) {
        if (!n || "string" != typeof n) return null;
        "boolean" == typeof t && (r = t, t = !1);
        t = t || u;
        var f = gi.exec(n),
        e = !r && [];
        return f ? [t.createElement(f[1])] : (f = i.buildFragment([n], t, e), e && e.length && i(e).remove(), i.merge([], f.childNodes))
    },
    pi = i.fn.load,
    i.fn.load = function(n, t, r) {
        if ("string" != typeof n && pi) return pi.apply(this, arguments);
        var u, o, s, f = this,
        e = n.indexOf(" ");
        return e >= 0 && (u = i.trim(n.slice(e)), n = n.slice(0, e)),
        i.isFunction(t) ? (r = t, t = void 0) : t && "object" == typeof t && (o = "POST"),
        f.length > 0 && i.ajax({
            url: n,
            type: o,
            dataType: "html",
            data: t
        }).done(function(n) {
            s = arguments;
            f.html(u ? i("<div>").append(i.parseHTML(n)).find(u) : n)
        }).complete(r &&
        function(n, t) {
            f.each(r, s || [n.responseText, t, n])
        }),
        this
    },
    i.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"],
    function(n, t) {
        i.fn[t] = function(n) {
            return this.on(t, n)
        }
    }),
    i.expr.filters.animated = function(n) {
        return i.grep(i.timers,
        function(t) {
            return n === t.elem
        }).length
    },
    wi = n.document.documentElement,
    i.offset = {
        setOffset: function(n, t, r) {
            var e, o, s, h, u, c, v, l = i.css(n, "position"),
            a = i(n),
            f = {};
            "static" === l && (n.style.position = "relative");
            u = a.offset();
            s = i.css(n, "top");
            c = i.css(n, "left");
            v = ("absolute" === l || "fixed" === l) && (s + c).indexOf("auto") > -1;
            v ? (e = a.position(), h = e.top, o = e.left) : (h = parseFloat(s) || 0, o = parseFloat(c) || 0);
            i.isFunction(t) && (t = t.call(n, r, u));
            null != t.top && (f.top = t.top - u.top + h);
            null != t.left && (f.left = t.left - u.left + o);
            "using" in t ? t.using.call(n, f) : a.css(f)
        }
    },
    i.fn.extend({
        offset: function(n) {
            if (arguments.length) return void 0 === n ? this: this.each(function(t) {
                i.offset.setOffset(this, n, t)
            });
            var r, f, t = this[0],
            u = {
                top: 0,
                left: 0
            },
            e = t && t.ownerDocument;
            if (e) return r = e.documentElement,
            i.contains(r, t) ? (typeof t.getBoundingClientRect !== b && (u = t.getBoundingClientRect()), f = ku(e), {
                top: u.top + f.pageYOffset - r.clientTop,
                left: u.left + f.pageXOffset - r.clientLeft
            }) : u
        },
        position: function() {
            if (this[0]) {
                var n, r, u = this[0],
                t = {
                    top: 0,
                    left: 0
                };
                return "fixed" === i.css(u, "position") ? r = u.getBoundingClientRect() : (n = this.offsetParent(), r = this.offset(), i.nodeName(n[0], "html") || (t = n.offset()), t.top += i.css(n[0], "borderTopWidth", !0), t.left += i.css(n[0], "borderLeftWidth", !0)),
                {
                    top: r.top - t.top - i.css(u, "marginTop", !0),
                    left: r.left - t.left - i.css(u, "marginLeft", !0)
                }
            }
        },
        offsetParent: function() {
            return this.map(function() {
                for (var n = this.offsetParent || wi; n && !i.nodeName(n, "html") && "static" === i.css(n, "position");) n = n.offsetParent;
                return n || wi
            })
        }
    }),
    i.each({
        scrollLeft: "pageXOffset",
        scrollTop: "pageYOffset"
    },
    function(t, r) {
        var u = "pageYOffset" === r;
        i.fn[t] = function(i) {
            return l(this,
            function(t, i, f) {
                var e = ku(t);
                return void 0 === f ? e ? e[r] : t[i] : void(e ? e.scrollTo(u ? n.pageXOffset: f, u ? f: n.pageYOffset) : t[i] = f)
            },
            t, i, arguments.length, null)
        }
    }),
    i.each(["top", "left"],
    function(n, t) {
        i.cssHooks[t] = br(f.pixelPosition,
        function(n, r) {
            if (r) return (r = it(n, t), hi.test(r) ? i(n).position()[t] + "px": r)
        })
    }),
    i.each({
        Height: "height",
        Width: "width"
    },
    function(n, t) {
        i.each({
            padding: "inner" + n,
            content: t,
            "": "outer" + n
        },
        function(r, u) {
            i.fn[u] = function(u, f) {
                var e = arguments.length && (r || "boolean" != typeof u),
                o = r || (u === !0 || f === !0 ? "margin": "border");
                return l(this,
                function(t, r, u) {
                    var f;
                    return i.isWindow(t) ? t.document.documentElement["client" + n] : 9 === t.nodeType ? (f = t.documentElement, Math.max(t.body["scroll" + n], f["scroll" + n], t.body["offset" + n], f["offset" + n], f["client" + n])) : void 0 === u ? i.css(t, r, o) : i.style(t, r, u, o)
                },
                t, e ? u: void 0, e, null)
            }
        })
    }),
    i.fn.size = function() {
        return this.length
    },
    i.fn.andSelf = i.fn.addBack,
    "function" == typeof define && define.amd && define("jquery", [],
    function() {
        return i
    }),
    du = n.jQuery,
    gu = n.$,
    i.noConflict = function(t) {
        return n.$ === i && (n.$ = gu),
        t && n.jQuery === i && (n.jQuery = du),
        i
    },
    typeof t === b && (n.jQuery = n.$ = i),
    i
}), !jQuery) throw new Error("Bootstrap requires jQuery"); +
function(n) {
    "use strict";
    function t() {
        var i = document.createElement("bootstrap"),
        n = {
            WebkitTransition: "webkitTransitionEnd",
            MozTransition: "transitionend",
            OTransition: "oTransitionEnd otransitionend",
            transition: "transitionend"
        };
        for (var t in n) if (void 0 !== i.style[t]) return {
            end: n[t]
        }
    }
    n.fn.emulateTransitionEnd = function(t) {
        var i = !1,
        u = this,
        r;
        n(this).one(n.support.transition.end,
        function() {
            i = !0
        });
        return r = function() {
            i || n(u).trigger(n.support.transition.end)
        },
        setTimeout(r, t),
        this
    };
    n(function() {
        n.support.transition = t()
    })
} (window.jQuery); +
function(n) {
    "use strict";
    var i = '[data-dismiss="alert"]',
    t = function(t) {
        n(t).on("click", i, this.close)
    },
    r;
    t.prototype.close = function(t) {
        function f() {
            i.trigger("closed.bs.alert").remove()
        }
        var u = n(this),
        r = u.attr("data-target"),
        i;
        r || (r = u.attr("href"), r = r && r.replace(/.*(?=#[^\s]*$)/, ""));
        i = n(r);
        t && t.preventDefault();
        i.length || (i = u.hasClass("alert") ? u: u.parent());
        i.trigger(t = n.Event("close.bs.alert"));
        t.isDefaultPrevented() || (i.removeClass("in"), n.support.transition && i.hasClass("fade") ? i.one(n.support.transition.end, f).emulateTransitionEnd(150) : f())
    };
    r = n.fn.alert;
    n.fn.alert = function(i) {
        return this.each(function() {
            var r = n(this),
            u = r.data("bs.alert");
            u || r.data("bs.alert", u = new t(this));
            "string" == typeof i && u[i].call(r)
        })
    };
    n.fn.alert.Constructor = t;
    n.fn.alert.noConflict = function() {
        return n.fn.alert = r,
        this
    };
    n(document).on("click.bs.alert.data-api", i, t.prototype.close)
} (window.jQuery); +
function(n) {
    "use strict";
    var t = function(i, r) {
        this.$element = n(i);
        this.options = n.extend({},
        t.DEFAULTS, r)
    },
    i;
    t.DEFAULTS = {
        loadingText: "loading..."
    };
    t.prototype.setState = function(n) {
        var i = "disabled",
        t = this.$element,
        r = t.is("input") ? "val": "html",
        u = t.data();
        n += "Text";
        u.resetText || t.data("resetText", t[r]());
        t[r](u[n] || this.options[n]);
        setTimeout(function() {
            "loadingText" == n ? t.addClass(i).attr(i, i) : t.removeClass(i).removeAttr(i)
        },
        0)
    };
    t.prototype.toggle = function() {
        var n = this.$element.closest('[data-toggle="buttons"]'),
        t;
        n.length && (t = this.$element.find("input").prop("checked", !this.$element.hasClass("active")).trigger("change"), "radio" === t.prop("type") && n.find(".active").removeClass("active"));
        this.$element.toggleClass("active")
    };
    i = n.fn.button;
    n.fn.button = function(i) {
        return this.each(function() {
            var u = n(this),
            r = u.data("bs.button"),
            f = "object" == typeof i && i;
            r || u.data("bs.button", r = new t(this, f));
            "toggle" == i ? r.toggle() : i && r.setState(i)
        })
    };
    n.fn.button.Constructor = t;
    n.fn.button.noConflict = function() {
        return n.fn.button = i,
        this
    };
    n(document).on("click.bs.button.data-api", "[data-toggle^=button]",
    function(t) {
        var i = n(t.target);
        i.hasClass("btn") || (i = i.closest(".btn"));
        i.button("toggle");
        t.preventDefault()
    })
} (window.jQuery); +
function(n) {
    "use strict";
    var t = function(t, i) {
        this.$element = n(t);
        this.$indicators = this.$element.find(".carousel-indicators");
        this.options = i;
        this.paused = this.sliding = this.interval = this.$active = this.$items = null;
        "hover" == this.options.pause && this.$element.on("mouseenter", n.proxy(this.pause, this)).on("mouseleave", n.proxy(this.cycle, this))
    },
    i;
    t.DEFAULTS = {
        interval: 5e3,
        pause: "hover",
        wrap: !0
    };
    t.prototype.cycle = function(t) {
        return t || (this.paused = !1),
        this.interval && clearInterval(this.interval),
        this.options.interval && !this.paused && (this.interval = setInterval(n.proxy(this.next, this), this.options.interval)),
        this
    };
    t.prototype.getActiveIndex = function() {
        return this.$active = this.$element.find(".item.active"),
        this.$items = this.$active.parent().children(),
        this.$items.index(this.$active)
    };
    t.prototype.to = function(t) {
        var r = this,
        i = this.getActiveIndex();
        if (! (t > this.$items.length - 1) && !(0 > t)) return this.sliding ? this.$element.one("slid",
        function() {
            r.to(t)
        }) : i == t ? this.pause().cycle() : this.slide(t > i ? "next": "prev", n(this.$items[t]))
    };
    t.prototype.pause = function(t) {
        return t || (this.paused = !0),
        this.$element.find(".next, .prev").length && n.support.transition.end && (this.$element.trigger(n.support.transition.end), this.cycle(!0)),
        this.interval = clearInterval(this.interval),
        this
    };
    t.prototype.next = function() {
        if (!this.sliding) return this.slide("next")
    };
    t.prototype.prev = function() {
        if (!this.sliding) return this.slide("prev")
    };
    t.prototype.slide = function(t, i) {
        var u = this.$element.find(".item.active"),
        r = i || u[t](),
        s = this.interval,
        f = "next" == t ? "left": "right",
        h = "next" == t ? "first": "last",
        o = this,
        e;
        if (!r.length) {
            if (!this.options.wrap) return;
            r = this.$element.find(".item")[h]()
        }
        if (this.sliding = !0, s && this.pause(), e = n.Event("slide.bs.carousel", {
            relatedTarget: r[0],
            direction: f
        }), !r.hasClass("active")) {
            if (this.$indicators.length && (this.$indicators.find(".active").removeClass("active"), this.$element.one("slid",
            function() {
                var t = n(o.$indicators.children()[o.getActiveIndex()]);
                t && t.addClass("active")
            })), n.support.transition && this.$element.hasClass("slide")) {
                if (this.$element.trigger(e), e.isDefaultPrevented()) return;
                r.addClass(t);
                r[0].offsetWidth;
                u.addClass(f);
                r.addClass(f);
                u.one(n.support.transition.end,
                function() {
                    r.removeClass([t, f].join(" ")).addClass("active");
                    u.removeClass(["active", f].join(" "));
                    o.sliding = !1;
                    setTimeout(function() {
                        o.$element.trigger("slid")
                    },
                    0)
                }).emulateTransitionEnd(600)
            } else {
                if (this.$element.trigger(e), e.isDefaultPrevented()) return;
                u.removeClass("active");
                r.addClass("active");
                this.sliding = !1;
                this.$element.trigger("slid")
            }
            return s && this.cycle(),
            this
        }
    };
    i = n.fn.carousel;
    n.fn.carousel = function(i) {
        return this.each(function() {
            var u = n(this),
            r = u.data("bs.carousel"),
            f = n.extend({},
            t.DEFAULTS, u.data(), "object" == typeof i && i),
            e = "string" == typeof i ? i: f.slide;
            r || u.data("bs.carousel", r = new t(this, f));
            "number" == typeof i ? r.to(i) : e ? r[e]() : f.interval && r.pause().cycle()
        })
    };
    n.fn.carousel.Constructor = t;
    n.fn.carousel.noConflict = function() {
        return n.fn.carousel = i,
        this
    };
    n(document).on("click.bs.carousel.data-api", "[data-slide], [data-slide-to]",
    function(t) {
        var f, i = n(this),
        r = n(i.attr("data-target") || (f = i.attr("href")) && f.replace(/.*(?=#[^\s]+$)/, "")),
        e = n.extend({},
        r.data(), i.data()),
        u = i.attr("data-slide-to");
        u && (e.interval = !1);
        r.carousel(e); (u = i.attr("data-slide-to")) && r.data("bs.carousel").to(u);
        t.preventDefault()
    });
    n(window).on("load",
    function() {
        n('[data-ride="carousel"]').each(function() {
            var t = n(this);
            t.carousel(t.data())
        })
    })
} (window.jQuery); +
function(n) {
    "use strict";
    var t = function(i, r) {
        this.$element = n(i);
        this.options = n.extend({},
        t.DEFAULTS, r);
        this.transitioning = null;
        this.options.parent && (this.$parent = n(this.options.parent));
        this.options.toggle && this.toggle()
    },
    i;
    t.DEFAULTS = {
        toggle: !0
    };
    t.prototype.dimension = function() {
        var n = this.$element.hasClass("width");
        return n ? "width": "height"
    };
    t.prototype.show = function() {
        var u, t, r, i, f, e;
        if (!this.transitioning && !this.$element.hasClass("in") && (u = n.Event("show.bs.collapse"), this.$element.trigger(u), !u.isDefaultPrevented())) {
            if (t = this.$parent && this.$parent.find("> .panel > .in"), t && t.length) {
                if (r = t.data("bs.collapse"), r && r.transitioning) return;
                t.collapse("hide");
                r || t.data("bs.collapse", null)
            }
            if (i = this.dimension(), this.$element.removeClass("collapse").addClass("collapsing")[i](0), this.transitioning = 1, f = function() {
                this.$element.removeClass("collapsing").addClass("in")[i]("auto");
                this.transitioning = 0;
                this.$element.trigger("shown.bs.collapse")
            },
            !n.support.transition) return f.call(this);
            e = n.camelCase(["scroll", i].join("-"));
            this.$element.one(n.support.transition.end, n.proxy(f, this)).emulateTransitionEnd(350)[i](this.$element[0][e])
        }
    };
    t.prototype.hide = function() {
        var i, t, r;
        if (!this.transitioning && this.$element.hasClass("in") && (i = n.Event("hide.bs.collapse"), this.$element.trigger(i), !i.isDefaultPrevented())) return t = this.dimension(),
        this.$element[t](this.$element[t]())[0].offsetHeight,
        this.$element.addClass("collapsing").removeClass("collapse").removeClass("in"),
        this.transitioning = 1,
        r = function() {
            this.transitioning = 0;
            this.$element.trigger("hidden.bs.collapse").removeClass("collapsing").addClass("collapse")
        },
        n.support.transition ? (this.$element[t](0).one(n.support.transition.end, n.proxy(r, this)).emulateTransitionEnd(350), void 0) : r.call(this)
    };
    t.prototype.toggle = function() {
        this[this.$element.hasClass("in") ? "hide": "show"]()
    };
    i = n.fn.collapse;
    n.fn.collapse = function(i) {
        return this.each(function() {
            var r = n(this),
            u = r.data("bs.collapse"),
            f = n.extend({},
            t.DEFAULTS, r.data(), "object" == typeof i && i);
            u || r.data("bs.collapse", u = new t(this, f));
            "string" == typeof i && u[i]()
        })
    };
    n.fn.collapse.Constructor = t;
    n.fn.collapse.noConflict = function() {
        return n.fn.collapse = i,
        this
    };
    n(document).on("click.bs.collapse.data-api", "[data-toggle=collapse]",
    function(t) {
        var e, i = n(this),
        s = i.attr("data-target") || t.preventDefault() || (e = i.attr("href")) && e.replace(/.*(?=#[^\s]+$)/, ""),
        r = n(s),
        u = r.data("bs.collapse"),
        h = u ? "toggle": i.data(),
        f = i.attr("data-parent"),
        o = f && n(f);
        u && u.transitioning || (o && o.find('[data-toggle=collapse][data-parent="' + f + '"]').not(i).addClass("collapsed"), i[r.hasClass("in") ? "addClass": "removeClass"]("collapsed"));
        r.collapse(h)
    })
} (window.jQuery); +
function(n) {
    "use strict";
    function r() {
        n(e).remove();
        n(i).each(function(t) {
            var i = u(n(this));
            i.hasClass("open") && (i.trigger(t = n.Event("hide.bs.dropdown")), t.isDefaultPrevented() || i.removeClass("open").trigger("hidden.bs.dropdown"))
        })
    }
    function u(t) {
        var i = t.attr("data-target"),
        r;
        return i || (i = t.attr("href"), i = i && /#/.test(i) && i.replace(/.*(?=#[^\s]*$)/, "")),
        r = i && n(i),
        r && r.length ? r: t.parent()
    }
    var e = ".dropdown-backdrop",
    i = "[data-toggle=dropdown]",
    t = function(t) {
        n(t).on("click.bs.dropdown", this.toggle)
    },
    f;
    t.prototype.toggle = function(t) {
        var f = n(this),
        i,
        e;
        if (!f.is(".disabled, :disabled")) {
            if (i = u(f), e = i.hasClass("open"), r(), !e) {
                if ("ontouchstart" in document.documentElement && !i.closest(".navbar-nav").length && n('<div class="dropdown-backdrop"/>').insertAfter(n(this)).on("click", r), i.trigger(t = n.Event("show.bs.dropdown")), t.isDefaultPrevented()) return;
                i.toggleClass("open").trigger("shown.bs.dropdown");
                f.focus()
            }
            return ! 1
        }
    };
    t.prototype.keydown = function(t) {
        var e, o, s, f, r;
        if (/(38|40|27)/.test(t.keyCode) && (e = n(this), t.preventDefault(), t.stopPropagation(), !e.is(".disabled, :disabled"))) {
            if (o = u(e), s = o.hasClass("open"), !s || s && 27 == t.keyCode) return 27 == t.which && o.find(i).focus(),
            e.click();
            f = n("[role=menu] li:not(.divider):visible a", o);
            f.length && (r = f.index(f.filter(":focus")), 38 == t.keyCode && r > 0 && r--, 40 == t.keyCode && r < f.length - 1 && r++, ~r || (r = 0), f.eq(r).focus())
        }
    };
    f = n.fn.dropdown;
    n.fn.dropdown = function(i) {
        return this.each(function() {
            var r = n(this),
            u = r.data("dropdown");
            u || r.data("dropdown", u = new t(this));
            "string" == typeof i && u[i].call(r)
        })
    };
    n.fn.dropdown.Constructor = t;
    n.fn.dropdown.noConflict = function() {
        return n.fn.dropdown = f,
        this
    };
    n(document).on("click.bs.dropdown.data-api", r).on("click.bs.dropdown.data-api", ".dropdown form",
    function(n) {
        n.stopPropagation()
    }).on("click.bs.dropdown.data-api", i, t.prototype.toggle).on("keydown.bs.dropdown.data-api", i + ", [role=menu]", t.prototype.keydown)
} (window.jQuery); +
function(n) {
    "use strict";
    var t = function(t, i) {
        this.options = i;
        this.$element = n(t);
        this.$backdrop = this.isShown = null;
        this.options.remote && this.$element.load(this.options.remote)
    },
    i;
    t.DEFAULTS = {
        backdrop: !0,
        keyboard: !0,
        show: !0
    };
    t.prototype.toggle = function(n) {
        return this[this.isShown ? "hide": "show"](n)
    };
    t.prototype.show = function(t) {
        var i = this,
        r = n.Event("show.bs.modal", {
            relatedTarget: t
        });
        this.$element.trigger(r);
        this.isShown || r.isDefaultPrevented() || (this.isShown = !0, this.escape(), this.$element.on("click.dismiss.modal", '[data-dismiss="modal"]', n.proxy(this.hide, this)), this.backdrop(function() {
            var u = n.support.transition && i.$element.hasClass("fade"),
            r;
            i.$element.parent().length || i.$element.appendTo(document.body);
            i.$element.show();
            u && i.$element[0].offsetWidth;
            i.$element.addClass("in").attr("aria-hidden", !1);
            i.enforceFocus();
            r = n.Event("shown.bs.modal", {
                relatedTarget: t
            });
            u ? i.$element.find(".modal-dialog").one(n.support.transition.end,
            function() {
                i.$element.focus().trigger(r)
            }).emulateTransitionEnd(300) : i.$element.focus().trigger(r)
        }))
    };
    t.prototype.hide = function(t) {
        t && t.preventDefault();
        t = n.Event("hide.bs.modal");
        this.$element.trigger(t);
        this.isShown && !t.isDefaultPrevented() && (this.isShown = !1, this.escape(), n(document).off("focusin.bs.modal"), this.$element.removeClass("in").attr("aria-hidden", !0).off("click.dismiss.modal"), n.support.transition && this.$element.hasClass("fade") ? this.$element.one(n.support.transition.end, n.proxy(this.hideModal, this)).emulateTransitionEnd(300) : this.hideModal())
    };
    t.prototype.enforceFocus = function() {
        n(document).off("focusin.bs.modal").on("focusin.bs.modal", n.proxy(function(n) {
            this.$element[0] === n.target || this.$element.has(n.target).length || this.$element.focus()
        },
        this))
    };
    t.prototype.escape = function() {
        this.isShown && this.options.keyboard ? this.$element.on("keyup.dismiss.bs.modal", n.proxy(function(n) {
            27 == n.which && this.hide()
        },
        this)) : this.isShown || this.$element.off("keyup.dismiss.bs.modal")
    };
    t.prototype.hideModal = function() {
        var n = this;
        this.$element.hide();
        this.backdrop(function() {
            n.removeBackdrop();
            n.$element.trigger("hidden.bs.modal")
        })
    };
    t.prototype.removeBackdrop = function() {
        this.$backdrop && this.$backdrop.remove();
        this.$backdrop = null
    };
    t.prototype.backdrop = function(t) {
        var r = this.$element.hasClass("fade") ? "fade": "",
        i;
        if (this.isShown && this.options.backdrop) {
            if (i = n.support.transition && r, this.$backdrop = n('<div class="modal-backdrop ' + r + '" />').appendTo(document.body), this.$element.on("click.dismiss.modal", n.proxy(function(n) {
                n.target === n.currentTarget && ("static" == this.options.backdrop ? this.$element[0].focus.call(this.$element[0]) : this.hide.call(this))
            },
            this)), i && this.$backdrop[0].offsetWidth, this.$backdrop.addClass("in"), !t) return;
            i ? this.$backdrop.one(n.support.transition.end, t).emulateTransitionEnd(150) : t()
        } else ! this.isShown && this.$backdrop ? (this.$backdrop.removeClass("in"), n.support.transition && this.$element.hasClass("fade") ? this.$backdrop.one(n.support.transition.end, t).emulateTransitionEnd(150) : t()) : t && t()
    };
    i = n.fn.modal;
    n.fn.modal = function(i, r) {
        return this.each(function() {
            var f = n(this),
            u = f.data("bs.modal"),
            e = n.extend({},
            t.DEFAULTS, f.data(), "object" == typeof i && i);
            u || f.data("bs.modal", u = new t(this, e));
            "string" == typeof i ? u[i](r) : e.show && u.show(r)
        })
    };
    n.fn.modal.Constructor = t;
    n.fn.modal.noConflict = function() {
        return n.fn.modal = i,
        this
    };
    n(document).on("click.bs.modal.data-api", '[data-toggle="modal"]',
    function(t) {
        var i = n(this),
        r = i.attr("href"),
        u = n(i.attr("data-target") || r && r.replace(/.*(?=#[^\s]+$)/, "")),
        f = u.data("modal") ? "toggle": n.extend({
            remote: !/#/.test(r) && r
        },
        u.data(), i.data());
        t.preventDefault();
        u.modal(f, this).one("hide",
        function() {
            i.is(":visible") && i.focus()
        })
    });
    n(document).on("show.bs.modal", ".modal",
    function() {
        n(document.body).addClass("modal-open")
    }).on("hidden.bs.modal", ".modal",
    function() {
        n(document.body).removeClass("modal-open")
    })
} (window.jQuery); +
function(n) {
    "use strict";
    var t = function(n, t) {
        this.type = this.options = this.enabled = this.timeout = this.hoverState = this.$element = null;
        this.init("tooltip", n, t)
    },
    i;
    t.DEFAULTS = {
        animation: !0,
        placement: "top",
        selector: !1,
        template: '<div class="tooltip"><div class="tooltip-arrow"><\/div><div class="tooltip-inner"><\/div><\/div>',
        trigger: "hover focus",
        title: "",
        delay: 0,
        html: !1,
        container: !1
    };
    t.prototype.init = function(t, i, r) {
        var f, e, u, o, s;
        for (this.enabled = !0, this.type = t, this.$element = n(i), this.options = this.getOptions(r), f = this.options.trigger.split(" "), e = f.length; e--;) if (u = f[e], "click" == u) this.$element.on("click." + this.type, this.options.selector, n.proxy(this.toggle, this));
        else "manual" != u && (o = "hover" == u ? "mouseenter": "focus", s = "hover" == u ? "mouseleave": "blur", this.$element.on(o + "." + this.type, this.options.selector, n.proxy(this.enter, this)), this.$element.on(s + "." + this.type, this.options.selector, n.proxy(this.leave, this)));
        this.options.selector ? this._options = n.extend({},
        this.options, {
            trigger: "manual",
            selector: ""
        }) : this.fixTitle()
    };
    t.prototype.getDefaults = function() {
        return t.DEFAULTS
    };
    t.prototype.getOptions = function(t) {
        return t = n.extend({},
        this.getDefaults(), this.$element.data(), t),
        t.delay && "number" == typeof t.delay && (t.delay = {
            show: t.delay,
            hide: t.delay
        }),
        t
    };
    t.prototype.getDelegateOptions = function() {
        var t = {},
        i = this.getDefaults();
        return this._options && n.each(this._options,
        function(n, r) {
            i[n] != r && (t[n] = r)
        }),
        t
    };
    t.prototype.enter = function(t) {
        var i = t instanceof this.constructor ? t: n(t.currentTarget)[this.type](this.getDelegateOptions()).data("bs." + this.type);
        return clearTimeout(i.timeout),
        i.hoverState = "in",
        i.options.delay && i.options.delay.show ? (i.timeout = setTimeout(function() {
            "in" == i.hoverState && i.show()
        },
        i.options.delay.show), void 0) : i.show()
    };
    t.prototype.leave = function(t) {
        var i = t instanceof this.constructor ? t: n(t.currentTarget)[this.type](this.getDelegateOptions()).data("bs." + this.type);
        return clearTimeout(i.timeout),
        i.hoverState = "out",
        i.options.delay && i.options.delay.hide ? (i.timeout = setTimeout(function() {
            "out" == i.hoverState && i.hide()
        },
        i.options.delay.hide), void 0) : i.hide()
    };
    t.prototype.show = function() {
        var o = n.Event("show.bs." + this.type),
        i,
        l;
        if (this.hasContent() && this.enabled) {
            if (this.$element.trigger(o), o.isDefaultPrevented()) return;
            i = this.tip();
            this.setContent();
            this.options.animation && i.addClass("fade");
            var t = "function" == typeof this.options.placement ? this.options.placement.call(this, i[0], this.$element[0]) : this.options.placement,
            s = /\s?auto?\s?/i,
            h = s.test(t);
            h && (t = t.replace(s, "") || "top");
            i.detach().css({
                top: 0,
                left: 0,
                display: "block"
            }).addClass(t);
            this.options.container ? i.appendTo(this.options.container) : i.insertAfter(this.$element);
            var r = this.getPosition(),
            u = i[0].offsetWidth,
            f = i[0].offsetHeight;
            if (h) {
                var e = this.$element.parent(),
                a = t,
                c = document.documentElement.scrollTop || document.body.scrollTop,
                v = "body" == this.options.container ? window.innerWidth: e.outerWidth(),
                y = "body" == this.options.container ? window.innerHeight: e.outerHeight(),
                p = "body" == this.options.container ? 0 : e.offset().left;
                t = "bottom" == t && r.top + r.height + f - c > y ? "top": "top" == t && r.top - c - f < 0 ? "bottom": "right" == t && r.right + u > v ? "left": "left" == t && r.left - u < p ? "right": t;
                i.removeClass(a).addClass(t)
            }
            l = this.getCalculatedOffset(t, r, u, f);
            this.applyPlacement(l, t);
            this.$element.trigger("shown.bs." + this.type)
        }
    };
    t.prototype.applyPlacement = function(n, t) {
        var h, i = this.tip(),
        c = i[0].offsetWidth,
        f = i[0].offsetHeight,
        e = parseInt(i.css("margin-top"), 10),
        o = parseInt(i.css("margin-left"), 10),
        u,
        r,
        s;
        isNaN(e) && (e = 0);
        isNaN(o) && (o = 0);
        n.top = n.top + e;
        n.left = n.left + o;
        i.offset(n).addClass("in");
        u = i[0].offsetWidth;
        r = i[0].offsetHeight; ("top" == t && r != f && (h = !0, n.top = n.top + f - r), /bottom|top/.test(t)) ? (s = 0, n.left < 0 && (s = -2 * n.left, n.left = 0, i.offset(n), u = i[0].offsetWidth, r = i[0].offsetHeight), this.replaceArrow(s - c + u, u, "left")) : this.replaceArrow(r - f, r, "top");
        h && i.offset(n)
    };
    t.prototype.replaceArrow = function(n, t, i) {
        this.arrow().css(i, n ? 50 * (1 - n / t) + "%": "")
    };
    t.prototype.setContent = function() {
        var n = this.tip(),
        t = this.getTitle();
        n.find(".tooltip-inner")[this.options.html ? "html": "text"](t);
        n.removeClass("fade in top bottom left right")
    };
    t.prototype.hide = function() {
        function i() {
            "in" != u.hoverState && t.detach()
        }
        var u = this,
        t = this.tip(),
        r = n.Event("hide.bs." + this.type);
        return this.$element.trigger(r),
        r.isDefaultPrevented() ? void 0 : (t.removeClass("in"), n.support.transition && this.$tip.hasClass("fade") ? t.one(n.support.transition.end, i).emulateTransitionEnd(150) : i(), this.$element.trigger("hidden.bs." + this.type), this)
    };
    t.prototype.fixTitle = function() {
        var n = this.$element; (n.attr("title") || "string" != typeof n.attr("data-original-title")) && n.attr("data-original-title", n.attr("title") || "").attr("title", "")
    };
    t.prototype.hasContent = function() {
        return this.getTitle()
    };
    t.prototype.getPosition = function() {
        var t = this.$element[0];
        return n.extend({},
        "function" == typeof t.getBoundingClientRect ? t.getBoundingClientRect() : {
            width: t.offsetWidth,
            height: t.offsetHeight
        },
        this.$element.offset())
    };
    t.prototype.getCalculatedOffset = function(n, t, i, r) {
        return "bottom" == n ? {
            top: t.top + t.height,
            left: t.left + t.width / 2 - i / 2
        }: "top" == n ? {
            top: t.top - r,
            left: t.left + t.width / 2 - i / 2
        }: "left" == n ? {
            top: t.top + t.height / 2 - r / 2,
            left: t.left - i
        }: {
            top: t.top + t.height / 2 - r / 2,
            left: t.left + t.width
        }
    };
    t.prototype.getTitle = function() {
        var t = this.$element,
        n = this.options;
        return t.attr("data-original-title") || ("function" == typeof n.title ? n.title.call(t[0]) : n.title)
    };
    t.prototype.tip = function() {
        return this.$tip = this.$tip || n(this.options.template)
    };
    t.prototype.arrow = function() {
        return this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow")
    };
    t.prototype.validate = function() {
        this.$element[0].parentNode || (this.hide(), this.$element = null, this.options = null)
    };
    t.prototype.enable = function() {
        this.enabled = !0
    };
    t.prototype.disable = function() {
        this.enabled = !1
    };
    t.prototype.toggleEnabled = function() {
        this.enabled = !this.enabled
    };
    t.prototype.toggle = function(t) {
        var i = t ? n(t.currentTarget)[this.type](this.getDelegateOptions()).data("bs." + this.type) : this;
        i.tip().hasClass("in") ? i.leave(i) : i.enter(i)
    };
    t.prototype.destroy = function() {
        this.hide().$element.off("." + this.type).removeData("bs." + this.type)
    };
    i = n.fn.tooltip;
    n.fn.tooltip = function(i) {
        return this.each(function() {
            var u = n(this),
            r = u.data("bs.tooltip"),
            f = "object" == typeof i && i;
            r || u.data("bs.tooltip", r = new t(this, f));
            "string" == typeof i && r[i]()
        })
    };
    n.fn.tooltip.Constructor = t;
    n.fn.tooltip.noConflict = function() {
        return n.fn.tooltip = i,
        this
    }
} (window.jQuery); +
function(n) {
    "use strict";
    var t = function(n, t) {
        this.init("popover", n, t)
    },
    i;
    if (!n.fn.tooltip) throw new Error("Popover requires tooltip.js");
    t.DEFAULTS = n.extend({},
    n.fn.tooltip.Constructor.DEFAULTS, {
        placement: "right",
        trigger: "click",
        content: "",
        template: '<div class="popover"><div class="arrow"><\/div><h3 class="popover-title"><\/h3><div class="popover-content"><\/div><\/div>'
    });
    t.prototype = n.extend({},
    n.fn.tooltip.Constructor.prototype);
    t.prototype.constructor = t;
    t.prototype.getDefaults = function() {
        return t.DEFAULTS
    };
    t.prototype.setContent = function() {
        var n = this.tip(),
        t = this.getTitle(),
        i = this.getContent();
        n.find(".popover-title")[this.options.html ? "html": "text"](t);
        n.find(".popover-content")[this.options.html ? "html": "text"](i);
        n.removeClass("fade top bottom left right in");
        n.find(".popover-title").html() || n.find(".popover-title").hide()
    };
    t.prototype.hasContent = function() {
        return this.getTitle() || this.getContent()
    };
    t.prototype.getContent = function() {
        var t = this.$element,
        n = this.options;
        return t.attr("data-content") || ("function" == typeof n.content ? n.content.call(t[0]) : n.content)
    };
    t.prototype.arrow = function() {
        return this.$arrow = this.$arrow || this.tip().find(".arrow")
    };
    t.prototype.tip = function() {
        return this.$tip || (this.$tip = n(this.options.template)),
        this.$tip
    };
    i = n.fn.popover;
    n.fn.popover = function(i) {
        return this.each(function() {
            var u = n(this),
            r = u.data("bs.popover"),
            f = "object" == typeof i && i;
            r || u.data("bs.popover", r = new t(this, f));
            "string" == typeof i && r[i]()
        })
    };
    n.fn.popover.Constructor = t;
    n.fn.popover.noConflict = function() {
        return n.fn.popover = i,
        this
    }
} (window.jQuery); +
function(n) {
    "use strict";
    function t(i, r) {
        var u, f = n.proxy(this.process, this);
        this.$element = n(i).is("body") ? n(window) : n(i);
        this.$body = n("body");
        this.$scrollElement = this.$element.on("scroll.bs.scroll-spy.data-api", f);
        this.options = n.extend({},
        t.DEFAULTS, r);
        this.selector = (this.options.target || (u = n(i).attr("href")) && u.replace(/.*(?=#[^\s]+$)/, "") || "") + " .nav li > a";
        this.offsets = n([]);
        this.targets = n([]);
        this.activeTarget = null;
        this.refresh();
        this.process()
    }
    t.DEFAULTS = {
        offset: 10
    };
    t.prototype.refresh = function() {
        var i = this.$element[0] == window ? "offset": "position",
        t;
        this.offsets = n([]);
        this.targets = n([]);
        t = this;
        this.$body.find(this.selector).map(function() {
            var f = n(this),
            r = f.data("target") || f.attr("href"),
            u = /^#\w/.test(r) && n(r);
            return u && u.length && [[u[i]().top + (!n.isWindow(t.$scrollElement.get(0)) && t.$scrollElement.scrollTop()), r]] || null
        }).sort(function(n, t) {
            return n[0] - t[0]
        }).each(function() {
            t.offsets.push(this[0]);
            t.targets.push(this[1])
        })
    };
    t.prototype.process = function() {
        var n, i = this.$scrollElement.scrollTop() + this.options.offset,
        f = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight,
        e = f - this.$scrollElement.height(),
        t = this.offsets,
        r = this.targets,
        u = this.activeTarget;
        if (i >= e) return u != (n = r.last()[0]) && this.activate(n);
        for (n = t.length; n--;) u != r[n] && i >= t[n] && (!t[n + 1] || i <= t[n + 1]) && this.activate(r[n])
    };
    t.prototype.activate = function(t) {
        this.activeTarget = t;
        n(this.selector).parents(".active").removeClass("active");
        var r = this.selector + '[data-target="' + t + '"],' + this.selector + '[href="' + t + '"]',
        i = n(r).parents("li").addClass("active");
        i.parent(".dropdown-menu").length && (i = i.closest("li.dropdown").addClass("active"));
        i.trigger("activate")
    };
    var i = n.fn.scrollspy;
    n.fn.scrollspy = function(i) {
        return this.each(function() {
            var u = n(this),
            r = u.data("bs.scrollspy"),
            f = "object" == typeof i && i;
            r || u.data("bs.scrollspy", r = new t(this, f));
            "string" == typeof i && r[i]()
        })
    };
    n.fn.scrollspy.Constructor = t;
    n.fn.scrollspy.noConflict = function() {
        return n.fn.scrollspy = i,
        this
    };
    n(window).on("load",
    function() {
        n('[data-spy="scroll"]').each(function() {
            var t = n(this);
            t.scrollspy(t.data())
        })
    })
} (window.jQuery); +
function(n) {
    "use strict";
    var t = function(t) {
        this.element = n(t)
    },
    i;
    t.prototype.show = function() {
        var t = this.element,
        e = t.closest("ul:not(.dropdown-menu)"),
        i = t.attr("data-target"),
        r,
        u,
        f; (i || (i = t.attr("href"), i = i && i.replace(/.*(?=#[^\s]*$)/, "")), t.parent("li").hasClass("active")) || (r = e.find(".active:last a")[0], u = n.Event("show.bs.tab", {
            relatedTarget: r
        }), (t.trigger(u), u.isDefaultPrevented()) || (f = n(i), this.activate(t.parent("li"), e), this.activate(f, f.parent(),
        function() {
            t.trigger({
                type: "shown.bs.tab",
                relatedTarget: r
            })
        })))
    };
    t.prototype.activate = function(t, i, r) {
        function f() {
            u.removeClass("active").find("> .dropdown-menu > .active").removeClass("active");
            t.addClass("active");
            e ? (t[0].offsetWidth, t.addClass("in")) : t.removeClass("fade");
            t.parent(".dropdown-menu") && t.closest("li.dropdown").addClass("active");
            r && r()
        }
        var u = i.find("> .active"),
        e = r && n.support.transition && u.hasClass("fade");
        e ? u.one(n.support.transition.end, f).emulateTransitionEnd(150) : f();
        u.removeClass("in")
    };
    i = n.fn.tab;
    n.fn.tab = function(i) {
        return this.each(function() {
            var u = n(this),
            r = u.data("bs.tab");
            r || u.data("bs.tab", r = new t(this));
            "string" == typeof i && r[i]()
        })
    };
    n.fn.tab.Constructor = t;
    n.fn.tab.noConflict = function() {
        return n.fn.tab = i,
        this
    };
    n(document).on("click.bs.tab.data-api", '[data-toggle="tab"], [data-toggle="pill"]',
    function(t) {
        t.preventDefault();
        n(this).tab("show")
    })
} (window.jQuery); +
function(n) {
    "use strict";
    var t = function(i, r) {
        this.options = n.extend({},
        t.DEFAULTS, r);
        this.$window = n(window).on("scroll.bs.affix.data-api", n.proxy(this.checkPosition, this)).on("click.bs.affix.data-api", n.proxy(this.checkPositionWithEventLoop, this));
        this.$element = n(i);
        this.affixed = this.unpin = null;
        this.checkPosition()
    },
    i;
    t.RESET = "affix affix-top affix-bottom";
    t.DEFAULTS = {
        offset: 0
    };
    t.prototype.checkPositionWithEventLoop = function() {
        setTimeout(n.proxy(this.checkPosition, this), 1)
    };
    t.prototype.checkPosition = function() {
        var i;
        if (this.$element.is(":visible")) {
            var s = n(document).height(),
            e = this.$window.scrollTop(),
            o = this.$element.offset(),
            r = this.options.offset,
            f = r.top,
            u = r.bottom;
            "object" != typeof r && (u = f = r);
            "function" == typeof f && (f = r.top());
            "function" == typeof u && (u = r.bottom());
            i = null != this.unpin && e + this.unpin <= o.top ? !1 : null != u && o.top + this.$element.height() >= s - u ? "bottom": null != f && f >= e ? "top": !1;
            this.affixed !== i && (this.unpin && this.$element.css("top", ""), this.affixed = i, this.unpin = "bottom" == i ? o.top - e: null, this.$element.removeClass(t.RESET).addClass("affix" + (i ? "-" + i: "")), "bottom" == i && this.$element.offset({
                top: document.body.offsetHeight - u - this.$element.height()
            }))
        }
    };
    i = n.fn.affix;
    n.fn.affix = function(i) {
        return this.each(function() {
            var u = n(this),
            r = u.data("bs.affix"),
            f = "object" == typeof i && i;
            r || u.data("bs.affix", r = new t(this, f));
            "string" == typeof i && r[i]()
        })
    };
    n.fn.affix.Constructor = t;
    n.fn.affix.noConflict = function() {
        return n.fn.affix = i,
        this
    };
    n(window).on("load",
    function() {
        n('[data-spy="affix"]').each(function() {
            var i = n(this),
            t = i.data();
            t.offset = t.offset || {};
            t.offsetBottom && (t.offset.bottom = t.offsetBottom);
            t.offsetTop && (t.offset.top = t.offsetTop);
            i.affix(t)
        })
    })
} (window.jQuery);
typeof translate == "undefined" && (translate = {});
translate.format = function(n, t) {
    var i, r;
    if (n == null || n.length == 0) return n;
    if (n = n.replace(/<hg:trans>([\w\W]*?)<\/hg:trans>/g, "$1"), typeof t != "undefined" && t.length > 0) for (i = 0; i < t.length; i++) r = new RegExp("\\{" + i + "\\}", "gm"),
    n = n.replace(r, t[i]);
    return n
};
translate.trans = function(n, t) {
    if (n == null || n.length == 0) return "";
    var i = n;
    return typeof t != "undefined" && t.length > 0 && (i = translate.format(i, t)),
    i
};
typeof redgle == "undefined" && (redgle = {});
redgle.request = {
    getFormData: function(n) {
        var t = {};
        return $("#" + n).find("input[type!='submit'][type!='button'][type!='checkbox'][type!='redio']").each(function() {
            t[$(this).attr("name")] = $(this).val()
        }),
        $("#" + n).find("input[type='checkbox']:checked").each(function() {
            t[$(this).attr("name")] = $(this).val()
        }),
        $("#" + n).find("input[type='checkbox']:checked").each(function() {
            t[$(this).attr("name")] = $(this).val()
        }),
        $("#" + n).find("select").each(function() {
            t[$(this).attr("name")] = $(this).val()
        }),
        $("#" + n).find("textarea").each(function() {
            t[$(this).attr("name")] = $(this).val()
        }),
        t
    },
    ajaxExtend: function() {
        $(document).ajaxStart(function() {
            $("#divAjaxLoadingPanel").css("height", $(document).height() + "px").css("display", "")
        });
        $(document).ajaxStop(function() {
            $("#divAjaxLoadingPanel").css("display", "none")
        })
    }
};
redgle.request.ajaxExtend();
redgle.control = {
    createSelectElement: function(n, t, i, r, u) {
        var f = $("<select><\/select>").attr({
            id: n,
            name: n
        });
        return t != null && f.attr(t),
        u == null && (u = !0),
        u && f.append("<option value=''><\/option>"),
        i != null && $.each(i,
        function(n, t) {
            typeof t == "object" ? f.append("<option value='" + n + "' otype='" + t.type + "'>" + t.name + "<\/option>") : f.append("<option value='" + n + "'>" + t + "<\/option>")
        }),
        r != null && f.val(r),
        f
    },
    createInputSelectElement: function(n, t, i) {
        var u = $('<div class="btn-group false"  style="margin-left:0px" ><\/div>'),
        f = $('<input type="text" class="form-control dropdown-toggle" data-toggle="dropdown" aria-expanded="true"  />').attr({
            id: n
        }).appendTo(u),
        r;
        return t != null && f.attr(t),
        i != null && (r = '<ul class="dropdown-menu" role="menu" style="min-width:93px;max-height:200px;overflow:auto">', $.each(i,
        function(n, t) {
            r += '<li data-value="' + t + "\" onclick=\"this.parentNode.parentNode.firstChild.value=this.getAttribute('data-value');this.parentNode.parentNode.setAttribute('class','btn-group false')\"><a   href=\"javascript:void(0)\"   >" + t + "<\/a><\/li>"
        }), r += "<\/ul>", u.append(r)),
        u
    },
    createCheckboxElement: function(n, t, i, r, u) {
        var f = $('<div class="checkbox"><\/div>');
        return i != null && $.each(i,
        function(i, r) {
            var e = $('<label style="padding-right:10px;"><\/label>'),
            o = $("<input type='checkbox' name='" + n + "' id='" + n + "_" + i + "' value='" + i + "' />");
            t != null && e.attr(t);
            u != null && o.attr("onchange", u);
            typeof r == "object" ? e.append(o).append(r.name) : e.append(o).append(r);
            f.append(e)
        }),
        f
    },
    createTextElement: function(n, t, i) {
        var r = $("<input type='text'><\/input>").attr({
            id: n,
            name: n
        });
        return t != null && r.attr(t),
        i != null && r.val(i),
        r
    }
};
redgle.math = {
    round: function(n, t) {
        return (t = t ? parseInt(t) : 0, t <= 0) ? Math.round(n) : Math.round(n * Math.pow(10, t)) / Math.pow(10, t)
    },
    generateRoundNum: function(n) {
        for (var r, u = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"], t = "", i = 0; i < n; i++) r = Math.ceil(Math.random() * 10),
        t += u[r];
        return t
    },
    generateRoundStr: function(n) {
        for (var r, u = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"], t = "", i = 0; i < n; i++) r = Math.ceil(Math.random() * 35),
        t += u[r];
        return t
    }
};
redgle.getFunctionEvent = function() {
    var t, n;
    if (document.all) return window.event;
    for (t = redgle.getFunctionEvent.caller; t != null;) {
        if (n = t.arguments[0], n && (n.constructor == Event || n.constructor == MouseEvent || typeof n == "object" && n.preventDefault && n.stopPropagation)) return n;
        t = t.caller
    }
    return null
};
redgle.getEventSource = function() {
    var n = redgle.getFunctionEvent();
    return n == null ? null: n.srcElement ? n.srcElement: n.target
};
redgle.doCommonAjaxInfo = function(n, t, i, r) {
    i = i && i.length > 0 ? i: "POST";
    var u = $.Deferred();
    return $.ajax({
        type: i,
        url: n,
        data: t,
        datatype: "json",
        success: function(n) {
            u.resolve(n)
        },
        error: function(n) {
            r && r(n)
        }
    }),
    u.promise()
};
redgle.datetime = {
    getMicrosoftDataTime: function(strData) {
        return eval(strData.replace(/\/Date\((\d+)\)\//gi, "new Date($1)"))
    },
    toFomartString: function(n, t) {
        var r = {
            "M+": n.getMonth() + 1,
            "d+": n.getDate(),
            "h+": n.getHours(),
            "m+": n.getMinutes(),
            "s+": n.getSeconds(),
            "q+": Math.floor((n.getMonth() + 3) / 3),
            S: n.getMilliseconds()
        },
        i;
        /(y+)/.test(t) && (t = t.replace(RegExp.$1, (n.getFullYear() + "").substr(4 - RegExp.$1.length)));
        for (i in r) new RegExp("(" + i + ")").test(t) && (t = t.replace(RegExp.$1, RegExp.$1.length == 1 ? r[i] : ("00" + r[i]).substr(("" + r[i]).length)));
        return t
    },
    formatMicrosoftDateTime: function(n) {
        var t = redgle.datetime.getMicrosoftDataTime(n);
        return redgle.datetime.toFomartString(t, "yyyy-MM-dd hh:mm")
    },
    getTodayBeginString: function() {
        var n = new Date;
        return redgle.datetime.toFomartString(n, "yyyy-MM-dd 00:00:00")
    },
    getTodayEndString: function() {
        var n = new Date;
        return redgle.datetime.toFomartString(n, "yyyy-MM-dd 23:59:59")
    }
};
redgle.stringBuilder = function() {
    this._data_ = [];
    this.append = function() {
        return this._data_.push(arguments[0]),
        this
    };
    this.toString = function() {
        return arguments.length > 0 ? this._data_.join(arguments[0]) : this._data_.join("")
    };
    this.isEmpty = function() {
        return this._data_.length <= 0
    };
    this.clear = function() {
        this._data_ = [];
        this._data_.length = 0
    }
};
redgle.modal = function(n) {
    function i() {
        n = $.extend({},
        {
            panelName: "divModalPanel" + Math.floor(Math.random() * 100 + 1),
            width: "800",
            height: "560",
            title: "",
            content: "",
            type: "html",
            isShowConfirm: !1,
            isShowMessage: !1,
            OkCallbackScript: "",
            CancelCallbackScript: ""
        },
        n);
        n.type == "iframe" && n.content.length > 0 && (n.content += "#" + n.panelName, n.content = '<iframe src="' + n.content + '" width="100%" height="100%" frameborder="0"><\/iframe>')
    }
    typeof n == "undefined" && (n = {});
    var t = null;
    this.show = function() {
        var f, e, r, o, h, u;
        i();
        t = document.createElement("div");
        t.id = n.panelName;
        t.className = "modal fade";
        t.innerHTML = n.isShowMessage == !0 || n.isShowConfirm == !0 || n.type == "html" ? '<div class="modal-dialog" style="height:auto !important;height:' + n.height + "px;min-height:" + n.height + "px;width:" + n.width + 'px"><div class="modal-content" style="height:auto !important;min-height:' + n.height + "px;height:" + n.height + "px;width:" + n.width + 'px"><div class="modal-header"><button type="button" class="close" btnType="forClose"><span aria-hidden="true">&times;<\/span><\/button><h4 class="modal-title"> ' + n.title + '<\/h4><\/div><div class="modal-body"><\/div><\/div><\/div>': '<div class="modal-dialog" style="height:' + n.height + "px;width:" + n.width + 'px"><div class="modal-content" style="height:' + n.height + "px;width:" + n.width + 'px"><div class="modal-header"><button type="button" class="close" btnType="forClose"><span aria-hidden="true">&times;<\/span><\/button><h4 class="modal-title" style="font-size:12px !important; margin-top:5px;"> ' + n.title + '<\/h4><\/div><div class="modal-body"><\/div><\/div><\/div>';
        document.body.appendChild(t);
        $(t).find(".modal-body").eq(0).html(n.content);
        $(t).find(".modal-header").css({
            padding: "5px 15px",
            cursor: "move",
            background: "#438EB9 none repeat scroll 0% 0%",
            color: "white"
        });
        n.type == "iframe" && n.content.length > 0 && (o = parseInt(n.height) - 50, $(t).find("iframe").css("height", o));
        var c = parseInt(n.width / 2),
        l = parseInt(n.height / 2.2),
        a = parseInt($(window).height() / 2.2),
        v = parseInt($(window).width() / 2),
        s = 0;
        n.left && (s = n.left);
        h = v - c + s;
        u = a - l;
        n.top && (u = n.top);
        $(t).children(".modal-dialog").css({
            margin: "0px 0px 0px 0px",
            top: u,
            left: h
        });
        $(t).find("button[btnType='forClose']").click(function() {
            $(t).modal("hide")
        });
        n.isShowConfirm == !0 && ($(t).find("button[btnType='forOK']").click(function() {
            $(t).modal("hide");
            n.OkCallbackScript != "" && eval(n.OkCallbackScript)
        }), $(t).find("button[btnType='forCancel']").click(function() {
            $(t).modal("hide");
            n.CancelCallbackScript != "" && eval(n.CancelCallbackScript)
        }));
        $(t).on("hidden.bs.modal",
        function() {
            $(t).html("").remove()
        });
        if ($(t).modal({
            show: !0,
            backdrop: !0,
            keyboard: !1
        }), n.onClosed != null && typeof n.onClosed == "function") $(t).on("hide.bs.modal", n.onClosed);
        $(t).find(".modal-header").mousedown(function(n) {
            n.which && (r = !0, f = n.pageX - parseInt($(t).children(".modal-dialog").css("left")), e = n.pageY - parseInt($(t).children(".modal-dialog").css("top")))
        });
        $(t).find(".modal-header").mousemove(function(n) {
            if (r) {
                var i = n.pageX - f,
                u = n.pageY - e;
                $(t).children(".modal-dialog").css({
                    left: i
                });
                $(t).children(".modal-dialog").css({
                    top: u
                })
            }
        });
        $(t).mouseup(function() {
            r = !1
        })
    };
    this.close = function() {
        t != null && $(t).modal("hide")
    }
};
redgle.modal.closeModal = function(n) {
    $("#" + n).modal("hide")
};
redgle.showMessage = function(n, t) { (t == undefined || t == "") && (t = translate.trans("提示"));
    var i = "<table style='height:190px;min-height:190px;width:340px'><tr><td valign='middle' align='center'><font style='word-break:break-all;font-size:14px'>" + n + "<\/font><\/td><\/tr><tr><td style='height:35px;' align='center' valign='top'><button style='width:70px' class='btn btn-default btn-sm' btnType='forClose'>" + translate.trans("关闭") + "<\/button><\/td><\/tr><\/table>",
    r = new redgle.modal({
        type: "html",
        title: t,
        content: i,
        width: 360,
        height: 245,
        isShowMessage: !0
    });
    r.show()
};
redgle.showConfirm = function(n, t, i, r) { (r == undefined || r == "") && (r = translate.trans("提示"));
    var u = "<table style='height:190px;min-height:190px;width:340px'><tr><td valign='middle' align='center'><font style='word-break:break-all;font-size:14px;'>" + n + "<\/font><\/td><\/tr><tr><td style='height:35px;' align='center' valign='top'><button style='width:70px' class='btn btn-primary btn-sm' btnType='forOK'>" + translate.trans("确定") + "<\/button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button style='width:70px' class='btn btn-default btn-sm' btnType='forCancel'>" + translate.trans("关闭") + "<\/button><\/td><\/tr><\/table>",
    f = new redgle.modal({
        type: "html",
        title: r,
        content: u,
        width: 360,
        height: 245,
        isShowConfirm: !0,
        OkCallbackScript: t != undefined ? t: "",
        CancelCallbackScript: i != undefined ? i: ""
    });
    f.show()
};
redgle.showConfirmWithStyle = function(n, t, i, r, u, f, e) {
    var o, s, h; (u == undefined || u == "") && (u = translate.trans("提示"));
    o = "";
    f == undefined || f == "" ? o += "font-size:14px;": o = "font-size:" + f + "px;";
    e != undefined && e != "" && (o += "color:" + e); (t == undefined || t == "") && (t = "text");
    s = t == "html" ? "<table style='height:190px;min-height:190px;width:340px'><tr><td valign='middle' align='center'>" + n + "<\/td><\/tr><tr><td style='height:35px;' align='center' valign='top'><button style='width:70px' class='btn btn-primary btn-sm' btnType='forOK'>" + translate.trans("确定") + "<\/button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button style='width:70px' class='btn btn-default btn-sm' btnType='forCancel'>" + translate.trans("关闭") + "<\/button><\/td><\/tr><\/table>": "<table style='height:190px;min-height:190px;width:340px'><tr><td valign='middle' align='center'><font style='word-break:break-all;" + o + "'>" + n + "<\/font><\/td><\/tr><tr><td style='height:35px;' align='center' valign='top'><button style='width:70px' class='btn btn-primary btn-sm' btnType='forOK'>" + translate.trans("确定") + "<\/button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button style='width:70px' class='btn btn-default btn-sm' btnType='forCancel'>" + translate.trans("关闭") + "<\/button><\/td><\/tr><\/table>";
    h = new redgle.modal({
        type: "html",
        title: u,
        content: s,
        width: 360,
        height: 245,
        isShowConfirm: !0,
        OkCallbackScript: i != undefined ? i: "",
        CancelCallbackScript: r != undefined ? r: ""
    });
    h.show()
};
redgle.showRemarkConfirm = function(n, t, i, r) { (r == undefined || r == "") && (r = translate.trans("提示"));
    var u = "<table style='height:190px;min-height:190px;width:340px'><tr><td valign='middle' align='center'  colspan='2'><font style='font-size:14px'>" + n + "<\/font><\/td><\/tr><tr><td ><font  style='padding-left:10px;font-size:14px'>" + translate.trans("备注") + "<\/font><\/td><td><textarea class='form-control' id='remarkText' style='width:280PX'  rows='4'><\/textarea><\/td><\/tr> <tr><td style='height:35px;' align='center' valign='top'  colspan='2'><button style='width:70px' class='btn btn-primary btn-sm' btnType='forOK'>" + translate.trans("确定") + "<\/button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button style='width:70px' class='btn btn-default btn-sm' btnType='forCancel'>" + translate.trans("关闭") + "<\/button><\/td><\/tr><\/table>",
    f = new redgle.modal({
        type: "html",
        title: r,
        content: u,
        width: 360,
        height: 245,
        isShowConfirm: !0,
        OkCallbackScript: t != undefined ? t: "",
        CancelCallbackScript: i != undefined ? i: ""
    });
    f.show()
};
redgle.showSelectConfirm = function(n, t, i, r, u) { (r == undefined || r == "") && (r = translate.trans("提示"));
    var f = "<table style='height:190px;min-height:190px;width:340px'><tr><td valign='middle' align='center'><font style='word-break:break-all;font-size:14px'>" + n + "<\/font><\/td><\/tr><tr><td valign='middle' align='center'>" + u + "<label><input type='checkbox' name='SelectConfirmCheckBox' value='1'/>下架<\/label><label style='margin-left:30px'><input type='checkbox'  name='SelectConfirmCheckBox'  value='0'/>删除<\/label><\/td><\/tr><tr><td style='height:35px;' align='center' valign='top'><button style='width:70px' class='btn btn-primary btn-sm' btnType='forOK'>" + translate.trans("确定") + "<\/button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button style='width:70px' class='btn btn-default btn-sm' btnType='forCancel'>" + translate.trans("关闭") + "<\/button><\/td><\/tr><\/table>",
    e = new redgle.modal({
        type: "html",
        title: r,
        content: f,
        width: 360,
        height: 245,
        isShowConfirm: !0,
        OkCallbackScript: t != undefined ? t: "",
        CancelCallbackScript: i != undefined ? i: ""
    });
    e.show()
};
redgle.tree = function(n) {
    function t(t) {
        var i = $(t).parentsUntil("ul").filter("li"),
        r;
        $(t).hasClass("glyphicon-plus") ? i.children("ul").length > 0 ? ($(t).removeClass("glyphicon-plus").addClass("glyphicon-minus"), i.children("ul").show()) : ($(t).removeClass("glyphicon-plus").addClass("glyphicon-asterisk"), r = _self.getElementData(i), n.fnLoadChildren(r.id)) : ($(t).removeClass("glyphicon-minus").addClass("glyphicon-plus"), i.children("ul").length > 0 && i.children("ul").hide())
    }
    function o(t) {
        var i = $(t).parent(),
        r = _self.getElementData(i);
        n.fnNodeClick(r);
        i.nextAll().remove()
    }
    function u(t) {
        var r = $(t).parentsUntil("ul").filter("li"),
        u = _self.getElementData(r),
        i,
        f;
        n.fnNodeClick(u);
        n.allowNavigate && (i = [], i.push(u), $(r).parents("li[item_id]").each(function() {
            var n = _self.getElementData(this);
            i.push(n)
        }), f = $(t).parents("[navigategroup]").attr("navigategroup"), _self.addItemsToNavigate(i.reverse(), f))
    }
    function f(n) {
        return {
            DeptId: n.id,
            DeptName: n.name,
            ParentDeptId: n.parentId,
            DeptIdPath: n.path
        }
    }
    function i(n) {
        var r = {
            id: n.DeptId,
            name: n.DeptName,
            parentId: n.ParentDeptId,
            path: n.DeptIdPath,
            hasChild: n.HasChild
        },
        t;
        if (typeof n.Children != "undefined") for (r.children = [], t = 0; t < n.Children.length; t++) r.children.push(i(n.Children[t]));
        return r
    }
    function e(n) {
        return {
            CatalogId: n.id,
            CatalogName: n.name,
            ParentCatalogId: n.parentId,
            CatalogIdPath: n.path
        }
    }
    function r(n) {
        var i = {
            id: n.CatalogId,
            name: n.CatalogName,
            parentId: n.ParentCatalogId,
            path: n.CatalogIdPath,
            hasChild: n.HasChild
        },
        t;
        if (typeof n.Children != "undefined") for (i.children = [], t = 0; t < n.Children.length; t++) i.children.push(r(n.Children[t]));
        return i
    }
    typeof n == "undefined" && (n = {});
    n = $.extend({},
    {
        contentPanelExpr: "",
        navigatePanelExpr: "",
        allowNavigate: !0,
        fnLoadChildren: null,
        fnNodeClick: null
    },
    n);
    _self = this;
    this.addItemsToNavigate = function(t, i) {
        var u, r, f;
        for ((i == null || typeof i == "undefined") && (i = n.navigatePanelExpr), u = 0; u < t.length; u++) r = t[u],
        $(i + " > li").length > 0 && (r.parentId == 0 ? $(i + " > li").remove() : $(i + " #item_" + r.parentId).nextAll().remove()),
        $(i + " #item_" + r.id).length == 0 && ($(i + " #item_" + r.parentId).nextAll().remove(), f = $("<li><\/li>").appendTo(i).attr({
            id: "item_" + r.id,
            item_id: r.id,
            item_name: r.name,
            item_parent: r.parentId,
            item_path: r.path
        }), $('<a href="javascript:javascript:void(0)"> ' + r.name + " <\/a>").appendTo(f).click(function() {
            o(this)
        }))
    };
    this.AddElementItem = function(i) {
        var f, e, h, o, s;
        if ($(n.contentPanelExpr + " #content_" + i.id).length == 0 && (f = null, i.parentId == 0 ? ($("<ul><\/ul>").appendTo(n.contentPanelExpr), f = $("<li><\/li>").attr({
            id: "content_" + i.id,
            item_id: i.id,
            item_name: i.name,
            item_parent: i.parentId,
            item_path: i.path
        }).appendTo(n.contentPanelExpr + " > ul")) : f = $("<li><\/li>").attr("id", "content_" + i.id).appendTo(n.contentPanelExpr + " #content_" + i.parentId), e = $("<span><\/span>").appendTo(f), i.hasChild && (typeof i.children == "undefined" ? $('<i class="glyphicon glyphicon-plus"><\/i>').appendTo(e).click(function() {
            t(this)
        }) : $('<i class="glyphicon glyphicon-minus"><\/i>').appendTo(e).click(function() {
            t(this)
        })), $('<a href="javascript:javascript:void(0)"> ' + i.name + " <\/a>").appendTo(e).click(function() {
            u(this)
        })), typeof i.children != "undefined" && $(n.contentPanelExpr + " #content_" + i.id + " > ul").length == 0) {
            for (h = $("<ul><\/ul>").appendTo(n.contentPanelExpr + " #content_" + i.id), o = 0; o < i.children.length; o++) {
                var r = i.children[o],
                l = $("<li><\/li>").attr({
                    id: "content_" + r.id,
                    item_id: r.id,
                    item_name: r.name,
                    item_parent: r.parentId,
                    item_path: r.path
                }).appendTo(h),
                c = $("<span><\/span>").appendTo(l);
                r.hasChild && $('<i class="glyphicon glyphicon-plus"><\/i>').appendTo(c).click(function() {
                    t(this)
                });
                $('<a href="javascript:javascript:void(0)"> ' + r.name + " <\/a>").appendTo(c).click(function() {
                    u(this)
                })
            }
            s = $(n.contentPanelExpr + " #content_" + i.id + " > span > i");
            $(s).hasClass("glyphicon-asterisk") && $(s).removeClass("glyphicon-asterisk").addClass("glyphicon-minus")
        }
    };
    this.getElementData = function(n) {
        return {
            id: $(n).attr("item_id"),
            name: $(n).attr("item_name"),
            parentId: $(n).attr("item_parent"),
            path: $(n).attr("item_path")
        }
    };
    this.convertDataToDept = function(n) {
        var i, t;
        if (typeof n.length != "undefined") {
            for (i = [], t = 0; t < n.length; t++) i.push(f(n[t]));
            return i
        }
        return f(n)
    };
    this.convertDeptToData = function(n) {
        var r, t;
        if (typeof n.length != "undefined") {
            for (r = [], t = 0; t < n.length; t++) r.push(i(n[t]));
            return r
        }
        return i(n)
    };
    this.convertDataToCatalog = function(n) {
        var i, t;
        if (typeof n.length != "undefined") {
            for (i = [], t = 0; t < n.length; t++) i.push(e(n[t]));
            return i
        }
        return e(n)
    };
    this.convertCatalogToData = function(n) {
        var i, t;
        if (typeof n.length != "undefined") {
            for (i = [], t = 0; t < n.length; t++) i.push(r(n[t]));
            return i
        }
        return r(n)
    }
};
redgle.tab = {
    tabPanel: "divTabPanel",
    contentPanel: "divTabContentPanel",
    init: function(n) {
        n != null && (n.tabPanel != null && (tabPanel = n.tabPanel), n.contentPanel != null && (contentPanel = n.contentPanel), n.showItemId != null && (showItemId = n.showItemId), $("#" + tabPanel + " li > a").each(function() {
            var n = $(this).parent().attr("id");
            $(this).click(function() {
                redgle.tab.open(n)
            })
        }))
    },
    open: function(n) {
        var i = $("#" + tabPanel + "> li[class='active']"),
        t;
        if (i.length > 0 && (t = $(document).scrollTop(), i.attr("data-sroll", t)), $("#" + n).length) {
            $("#" + tabPanel + " li").each(function() {
                $(this).removeClass("active")
            });
            $("#" + contentPanel + " > div").each(function() {
                $(this).removeClass("active").removeClass("in")
            });
            $("#" + n).addClass("active");
            $("#tabContent_" + n).addClass("active").addClass("in");
            t = $("#" + n).attr("data-sroll");
            typeof t != "undefined" && t.length > 0 ? setTimeout(function() {
                window.scrollTo(0, t)
            },
            100) : setTimeout(function() {
                window.scrollTo(0, 1)
            },
            100);
            try {
                $(document).scroll()
            } catch(r) {}
        }
    },
    create: function(n, t, i, r, u, f) {
        var o, s, h, e;
        if ($("#" + n).length) $("#tabContent_" + n).html("");
        else {
            o = $("<li><\/li>").attr({
                id: n,
                url: t,
                role: "presentation"
            }).appendTo($("#" + tabPanel));
            r != null && o.attr("return", r);
            var c = $("<a><\/a>").attr({
                role: "tab"
            }).css("cursor", "pointer").html(i + " ").appendTo(o),
            l = $('<span class="glyphicon glyphicon-remove"><\/span>').css("cursor", "pointer").appendTo(c),
            a = $("<div><\/div>").attr({
                role: "tabpanel",
                id: "tabContent_" + n,
                tabpanel: n
            }).addClass("tab-pane fade").appendTo($("#" + contentPanel));
            a.html(translate.trans("数据正在加载中..."));
            c.click(function() {
                redgle.tab.open(n)
            });
            l.click(function() {
                if (f != null && typeof f == "function") try {
                    f()
                } catch(t) {}
                redgle.tab.close(n)
            });
            try {
                s = redgle.getEventSource();
                s != null && (h = $(s).parents("div[role='tabpanel']"), h.length > 0 && (e = h.attr("tabpanel"), e != null && e.length > 0 && $("#" + n).attr("sourcepanel", e)))
            } catch(v) {
                alert(v.message)
            }
        }
        $.ajax({
            type: "GET",
            url: t,
            cache: !1,
            data: {
                ajaxType: "text"
            },
            datatype: "text",
            success: function(t) {
                $("#tabContent_" + n).html(t);
                u != null && typeof u == "function" && u()
            },
            error: function(t) {
                $("#tabContent_" + n).html(translate.trans("操作发生未知异常：{0} - {1}", [t.status, t.statusText]))
            }
        });
        setting.cookie.set("TabId", n);
        redgle.tab.open(n)
    },
    close: function(n, t) {
        if ((t == null || t.length == 0) && (t = $("#" + n).attr("sourcepanel")), t != null && t.length > 0 && $("#" + t).length) redgle.tab.open(t);
        else {
            var i = $("#" + n).attr("return"); (typeof i == "undefined" || i.length == 0) && (i = $("#" + tabPanel + " li").first().attr("id"));
            redgle.tab.open(i)
        }
        $("#editor").length && KindEditor.remove('textarea[name="editor"]');
        $("#" + n).length && ($("#tabContent_" + n).html("").remove(), $("#" + n).remove())
    }
};
$(document).ready(function() {
    $("#hidCurrentTypeMenuCode").val() == "erp_sale" && doLoadOrderNum();
    $(".search-panel .more-option input[type='checkbox']").change(function() {
        $(this).is(":checked") ? $("#divMoreSearchOption").removeClass("hide") : $("#divMoreSearchOption").addClass("hide")
    })
});
GoogleTranslateText = function(n, t, i) {
    var u = null,
    f = null,
    r;
    if (t && (u = t), i && (f = i), r = "", n) $.ajax({
        async: !1,
        url: "../BaiduTranslate/GoogleTranslateApi",
        type: "post",
        data: {
            query: n,
            from: u,
            to: f
        },
        success: function(n) {
            if (console.log(n), n.HasError) return "";
            r = n.MapData && n.MapData.resultText && n.MapData.resultText.length > 0 ? n.MapData.resultText + "": ""
        },
        error: function() {
            return ""
        }
    });
    else return "";
    return r
};
$.fn.GoogleTranslate = function(n) {
    var i = $(this),
    t = i.val(),
    r = null,
    u = null; (n && (n.from && (r = n.from), n.to && (u = n.to)), t && t.length != 0) && $.ajax({
        url: "../BaiduTranslate/GoogleTranslateApi",
        type: "post",
        data: {
            query: t,
            from: r,
            to: u
        },
        success: function(n) {
            n.HasError ? redgle.showMessage(translate.trans("翻译失败：{0}", [n.Message])) : n.MapData && n.MapData.resultText && n.MapData.resultText.length > 0 && i.val(n.MapData.resultText + "")
        },
        error: function(n) {
            redgle.showMessage(translate.trans("操作发生未知异常：{0} - {1}", [n.status, n.statusText]))
        }
    })
};
var editortrans = "",
transition = function(n) { (n == "" || n == undefined) && (n = "#cacheDiv");
    var t = editortrans.html();
    return t = t.replace(/<script[^>]*>(.|\n)*?(?=<\/script>)<\/script>/gi, ""),
    $(n).empty(),
    $(n).html(t),
    $(n).find(".noImg").each(function() {
        var n = unescape($(this).attr("data-kse"));
        $(this).replaceWith(n)
    }),
    $(n).find(".smImg").each(function() {
        var n = unescape($(this).attr("data-kse"));
        $(this).replaceWith(n)
    }),
    t = $(n).html(),
    t = replaceAllBlank(t),
    $(n).empty(),
    t
},
setKindeDetail = function(n, t, i) {
    var r;
    n = n.replace(/<script[^>]*>(.|\n)*?(?=<\/script>)<\/script>/gi, "").replace(/<script.*?>.*?<\/script>/g, "").replace(/<span.*?>On.*?information:<\/span>/gi, "");
    r = /(<link[^>]*>|<meta[^>]*>)/gi;
    i && (n = n.replace(r, ""));
    n = replaceAllBlank(n);
    t ? KindEditor.html("#" + t, unTransitionHtml(n)) : editortrans.html(unTransitionHtml(n))
},
unTransitionHtml = function(n) {
    var t = "#cacheDiv";
    return $(t).html(n),
    $(t).find('[data-widget-type="relatedProduct"]').each(function() {
        var i = $(this).attr("type"),
        n = $(this).prop("outerHTML"),
        t = "http://style.aliexpress.com/js/5v/lib/kseditor/plugins/widget/images/widget1.png?t=AEO9LPV";
        i == "relation" && (t = "http://style.aliexpress.com/js/5v/lib/kseditor/plugins/widget/images/widget2.png?t=AEO9LPV");
        n = '<img class="noImg" data-kse="' + escape(n) + '" src="' + t + '">';
        $(this).replaceWith(n)
    }),
    $(t).find('[data-widget-type="customText"]').each(function() {
        var i = $(this).attr("type"),
        n = $(this).prop("outerHTML"),
        t = "http://style.aliexpress.com/js/5v/lib/kseditor/plugins/widget/images/widget1.png?t=AEO9LPV";
        i == "relation" && (t = "http://style.aliexpress.com/js/5v/lib/kseditor/plugins/widget/images/widget2.png?t=AEO9LPV");
        n = '<img class="noImg" data-kse="' + escape(n) + '" src="' + t + '">';
        $(this).replaceWith(n)
    }),
    $(t).find('[sm-data-widget-type="dxmRelatedProduct"]').each(function() {
        var i = $(this).attr("type"),
        r = $(this).prop("outerHTML"),
        n = "http://www.sumool.com/static/img/moban_custom.png",
        t;
        i == 1 && (n = "http://www.sumool.com/static/img/moban.png");
        t = '<img class="noImg" data-kse="' + escape(r) + '" src="' + n + '"/>';
        $(this).replaceWith(t)
    }),
    n = $(t).html(),
    $(t).empty(),
    n
},
replaceAllBlank = function(n) {
    return n.replace(/wxalbum-[ ]{0,1}[\n]{0,2}10001658.image.myqcloud.com/ig, "wxalbum-10001658.image.myqcloud.com")
},
detailT = "";
setDetailTransate = function(n, t) {
    var i = n,
    r = null;
    t && t.to && (r = t.to);
    i != null && i != "" && i.length > 0 && i.indexOf("font-family:") < 0 && /.*[\u4e00-\u9fa5]+.*$/.test(i) && $.ajax({
        url: "../BaiduTranslate/GoogleTranslateApi",
        type: "post",
        data: {
            query: i,
            to: r
        },
        success: function(n) {
            n.HasError || n.MapData && n.MapData.resultText && n.MapData.resultText.length > 0 && (detailT = detailT.replace(i, n.MapData.resultText + ""), setKindeDetail(detailT, null, !1))
        },
        error: function() {}
    })
};
setOtherAttrFy = function(n, t, i, r, u) {
    r.eq(t).GoogleTranslate(u)
};
String.prototype.format = function(n) {
    for (var r, i = this,
    t = 0; t < n.length; t++) n[t] != undefined && (r = new RegExp("({)" + t + "(})", "g"), i = i.replace(r, n[t]));
    return i
};
setting = {};
setting.cookie = {
    get: function(n) {
        var r = n + "=(.*?)(;|$)",
        i = new RegExp(r),
        t;
        return i.test(document.cookie) && (t = i.exec(document.cookie)[1], t != null && t.replace(/\s/, "") != "") ? unescape(t) : ""
    },
    set: function(n, t) {
        var i = arguments,
        r = arguments.length,
        u = null,
        f = r > 3 ? i[3] : "/",
        e = null,
        o = r > 5 ? i[5] : !1;
        document.cookie = n + "=" + escape(t) + (u == null ? "": "; expires=" + u.toGMTString()) + (f == null ? "": "; path=" + f) + (e == null ? "": "; domain=" + e) + (o == !0 ? "; secure": "")
    }
};
$.ShowHgMsg = {
    topMsg: function(n, t) {
        var r = $("<div style='color: #a94442;background-color: #f2dede;border-color: #ebccd1;opacity: 1;text-align:center;height:50px;line-height:50px;   '>" + n + "<\/div>").prependTo("body"),
        i = 3e3;
        t && (i = t);
        setTimeout(function() {
            r.remove()
        },
        i)
    },
    cententMsg: function(n, t) {
        var r = $("<div style='color: #a94442;z-index:999;background-color: #f2dede;border-color: #ebccd1;opacity: 1;text-align:center;height:50px;line-height:50px;position: fixed;top: 0px;left: 0px; right: 0px; bottom: 0px;margin: auto;'>" + n + "<b style='position:absolute;width:10px;height:10px;right:0px;top:0px;z-index:100;cursor:pointer;' onclick='this.parentNode.remove()' class='glyphicon glyphicon-remove'><\/b><\/div>").prependTo("body"),
        i = 3e3;
        t && (i = t);
        setTimeout(function() {
            r.remove()
        },
        i)
    }
};
Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1];
ValideCode = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2]