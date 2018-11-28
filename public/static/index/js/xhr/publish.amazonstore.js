/*
首字母大写
*/
$("#Conversion").click(function () {
    var ProductName = $("#ProductName").val();
    ProductName = titleFirstCase(ProductName);
    $("#ProductName").val(ProductName);
});

function titleFirstCase(str) {  
    return str.replace(/( |^)[a-z]/g, (L) => L.toUpperCase());  
}
//移除sku行
function RemoveSkuTr(event) {
    $(event).parent().parent().remove();
    var settingTable = $("#divSkuSettingPanel").children("table");
    if (settingTable.length == 0 || settingTable.find("tr").length > 1) {
        $("#divNoSkuPanel").addClass("hide");
        $("#divSkuSettingPanel").removeClass("hide");
    }
    else {
        settingTable.remove();
        $("#divSkuSettingPanel").addClass("hide");
        $("#divNoSkuPanel").removeClass("hide");
    }
}
var isBeginLoad = true;//是否初始加载
//加载尺码
function LoadWishSizeAttr(catalogId) {
    $.ajax({
        type: "POST",
        url: "../LoadCatalogAttr",
        data: { catalogId: catalogId },
        datatype: "json",
        success: function (data) {
            if (data.HasError) {
                redgle.showMessage("操作失败:" + data.Message);
            }
            else {
                // $.each(data.MapData, function (key, value) {
                //     if (key == "sizechart") {
                //         var $SizeAttr = $("#SizeAttr");
                //         $("#SizeAttr").empty();
                //         $.each(value, function (index, itemValue) {
                //             $SizeAttr.append("<label style='width: 250px;margin-right: 10px;'><input type='checkbox' valuename='" + itemValue.ValueName + "' valuenameen='" + itemValue.ValueName + "' onchange='doSKUAttrValueChange(event)' />" + itemValue.ValueName + "</label>");
                //         })
                //     }
                // })
                // if (isBeginLoad) {
                //     var hideErpPreviewProductSpecJson = $("#hideErpPreviewProductSpecJson").val();
                //     if (hideErpPreviewProductSpecJson) {
                //         var jsonArray = eval("(" + hideErpPreviewProductSpecJson + ")");
                //         setProductSizeAttr(jsonArray, "SizeAttr")
                //     }
                // }
            }
            isBeginLoad = false;
        }
    });
}
function doShowCreateProductSku() {
    var width = 700;
    var height = 460;
    var url = "/Product/CreateProductSku";
    var selectProductModal = new redgle.modal({ type: "iframe", content: url, title: translate.format("<hg:trans>生成产品SKU</hg:trans>"), width: width, height: height });
    selectProductModal.show();
}

function doGetSelectedProductSKU(sku) {
    $("#ParentSKU").val(sku);
    $("#ParentSKU").change();
}

function doGetSelectedCatalogId(catalogid) {
    $("#localCatalogId").val(catalogid);
    $("#localCatalogId").change();
}

//=======================Begin： 处理商品的分类与属性===========================================

/*
    处理商品分类SKU值选项变动事件
*/
function doSKUAttrValueChange(event) {
    debugger
    var src = event.target || window.event.srcElement;
    var skuAttrPanel = $(src).parents("#divProductSkuPanel");
    var currentAttrPanel = $(src).parents("div[itemid]");

    //if ($(src).is(":checked")) {
    //生成批量设置SKU属性内容
    doCreateSkuBatchSettingPanel();

    //提取Sku值
    var skuAttrIndex = 0;
    var skuList = { attrList: [], skuValueList: [] }; //attrList:属性(表头th)，skuValueList：属性值(表内容td)

    //保存已生成的table中的文本
    var skuValueList = [];
    $("#divSkuSettingPanel table tr").each(function (index, item) {
        debugger
        var $this = $(this);
        if (index != 0) { //index=0 的时候是表头
            var key = $this.find("td[attrid]").map(function () {
                if ($(this).find("input").length > 0) {
                    if ($(this).find("input").val().length > 0)
                        return $(this).find("input").val();
                } else {
                    return $(this).text();
                }
            }).get().join("-");  //获取属性的文本用‘-’连接
            var oldSpecPicImgEment = $this.find("#divSkuPhoto").find("img");
            var oldPicUrl = "";
            if (oldSpecPicImgEment.length > 0) {
                oldPicUrl = oldSpecPicImgEment.attr("src")
            }        
            skuValueList[index - 1] = { key: key, sku: $this.find("#txtSpecSku").val(), salePrice: $this.find("#txtSpecPrice").val(), msrPrice: $this.find("#txtMsrPrice").val(), stockNum: $this.find("#txtSpecStockNum").val(), oldPicUrl: oldPicUrl };
        }
    });

    //获取选中的属性
    $("#divProductSkuPanel>div[itemid]").each(function () { //循环带有属性的行（颜色、尺寸）
        debugger
        var $self = $(this);
        var orderNo = $self.attr("orderno");

        if ($self.find("input:checked").length > 0) { //循环选中的属性，获取属性(表头)
            skuList.attrList[skuAttrIndex] = {
                attrId: $self.attr("itemid"),
                orderNo: orderNo,
                attrName: $self.attr("attrname")
            };
            skuAttrIndex += 1;
            var valueList = [];
            var skuIndex = 0;
            var key = "";
            $self.find("input:checked").each(function (index) { //循环选中的属性，获取属性值(表内容)
                debugger
                if (skuList.attrList.length == 1) {
                    valueList[index] = { key: "", specId: "0", sku: "", salePrice: "",msrPrice:"", stockNum: "",picUrl:"" };
                    valueList[index]["skuid"] = $(this).attr("valueid");
                    if (valueList[index]["key"]) {
                        valueList[index]["key"] = valueList[index]["key"] + "-" + $(this).attr("valuename");
                    }
                    else {
                        valueList[index]["key"] = $(this).attr("valuename");
                    }
                    valueList[index][$self.attr("itemid")] = {
                        valueId: $(this).attr("valueid"),
                        valueName: $(this).attr("valuename")
                    };
                }
                else {
                    for (var i = 0; i < skuList.skuValueList.length; i++) {
                        valueList[skuIndex] = $.extend(true, {}, skuList.skuValueList[i]);
                        valueList[skuIndex]["skuid"] = valueList[skuIndex]["skuid"] + "-" + $(this).attr("valueid");
                        if (valueList[skuIndex]["key"]){
                            valueList[skuIndex]["key"] = valueList[skuIndex]["key"] + "-" + $(this).attr("valuename");
                        }
                        else {
                            valueList[skuIndex]["key"] = $(this).attr("valuename");
                        }
                        valueList[skuIndex][$self.attr("itemid")] = {
                            valueId: $(this).attr("valueid"),
                            valueName: $(this).attr("valuename")
                        };
                        skuIndex += 1;
                    }
                }
            });
            skuList.skuValueList = $.map(valueList, function (obj) {
                return $.extend(true, {}, obj);
            });
        }

    });
    debugger
    //根据key匹配值对应的值
    for (var j = 0; j < skuList.skuValueList.length; j++) {
        $.each(skuValueList, function (iteminex, item) {
            if (skuList.skuValueList[j].key == item.key) {
                skuList.skuValueList[j].sku = item.sku;
                skuList.skuValueList[j].salePrice = item.salePrice;//零售价
                skuList.skuValueList[j].msrPrice = item.msrPrice;//建议售价
                skuList.skuValueList[j].stockNum = item.stockNum;
                skuList.skuValueList[j].picUrl = item.oldPicUrl;              
            }
        })
    }
    //生成SKU列表
    doCreateProductSkuTable(skuList.attrList, skuList.skuValueList);
    //}
    //else {
    //    var settingTable = $("#divSkuSettingPanel").children("table");
    //    if (settingTable.length > 0) {
    //        var valueId = $(src).attr("valueid");
    //        var attrId = currentAttrPanel.attr("itemid");
    //        if (currentAttrPanel.find("input:checked").length > 0 || $("#divProductSkuPanel>div[itemid] input:checked").length == 0) {
    //            settingTable.find("td[valueid='" + valueId + "']").each(function () {
    //                $(this).parent().remove();
    //            });
    //        }
    //        else {
    //            settingTable.find("td[attrid='" + attrId + "']").each(function () {
    //                $(this).remove();
    //            });
    //            settingTable.find("th[attrid='" + attrId + "']").each(function () {
    //                $(this).remove();
    //            });
    //        }
    //    }
    var attrNum = $("#SizeAttr").find("input:checked").length + $("#colorDiv").find("input:checked").length;

    if (attrNum == 0) {
        $("#divNoSkuPanel").removeClass("hide");
        var settingTable = $("#divSkuSettingPanel").children("table");
        if (settingTable) {
            settingTable.remove();
            $("#divSkuSettingPanel").addClass("hide");

        }

    } else {
        $("#divNoSkuPanel").addClass("hide");
        $("#divSkuSettingPanel").removeClass("hide");
    }
    //    //else {
    //    //    settingTable.remove();
    //    //    $("#divSkuSettingPanel").addClass("hide");
    //    //    $("#divNoSkuPanel").removeClass("hide");
    //    //}
    //}
}

/*
    生成SKU变参属性批量修改内容
*/
function doCreateSkuBatchSettingPanel() {
    if ($("#divSkuSettingPanel").children("#divSkuBatchSettingPanel").length == 0) {
        var skuBatchSettingPanel = $("<div></div>").attr({ "id": "divSkuBatchSettingPanel", "class": "form-inline" }).appendTo("#divSkuSettingPanel");
        skuBatchSettingPanel.append("<div class=\"form-group input-group\" style=\"margin-left: 0px; margin-right: 15px;\"><input type=\"text\" id=\"txtBatchPrice\" class=\"form-control input-sm\" placeholder=\"输入产品的零售价\"><span class=\"input-group-btn\"><button type=\"button\" id=\"btnSetBatchPrice\" class=\"btn btn-info btn-sm\">批量设置</button></span></div>");
        skuBatchSettingPanel.append("<div class=\"form-group input-group\" style=\"margin-left: 0px; margin-right: 15px;\"><input type=\"text\" id=\"txtBatchMsPrice\" class=\"form-control input-sm\" hgtrans=\"true\" placeholder=\"输入产品的促销价\" value=\"\"><span class=\"input-group-btn\"><button type=\"button\" id=\"btnSetBatchMsPrice\" class=\"btn btn-info btn-sm\"><hg:trans>批量设置</hg:trans></button></span></div>");

        $("#divSkuBatchSettingPanel").find("#btnSetBatchPrice").click(function () {
            var price = $.trim($("#txtBatchPrice").val());
            if (!checkDecimal(price)) {
                doShowError({ "txtBatchPrice": "请输入正确的价格" });
                return false;
            }
            $("#divSkuSettingPanel>table #txtSpecPrice").each(function () {
                $(this).val(price);
            });
        });
        $("#divSkuBatchSettingPanel").find("#btnSetBatchMsPrice").click(function () {
            var BatchMsPrice = $.trim($("#txtBatchMsPrice").val());
            if (!checkDecimal(BatchMsPrice)) {
                doShowError({ "txtBatchMsPrice": "请输入正确的价格，只允许输入数字" });
                return false;
            }
            $("#divSkuSettingPanel>table #txtMsrPrice").each(function () {
                $(this).val(BatchMsPrice);
            });
        });


    }
}

/*
    生成SKU变参列表
*/
function doCreateProductSkuTable(attrList, skuValueList) {
    if (skuValueList.length == 0) {
        return;
    }

    var settingTable = $("#divSkuSettingPanel").children("table");
    if (settingTable.length > 0) {
        settingTable.empty();
    }
    else {
        settingTable = $("<table></table>").attr({ "class": "table table-bordered table-hover" }).appendTo("#divSkuSettingPanel");
    }

    //生成Table
    var thead = $("<thead></thead>").appendTo(settingTable)
    var tableHead = $("<tr></tr>").appendTo(thead);
    $.each(attrList, function (index, item) {
        tableHead.append("<th attrid='" + item.attrId + "' style='width:80px'>" + item.attrName + "</th>");
    });
    tableHead.append("<th style='width:150px'>SKU <a href='javascript:void(0);' id='lnkAutoCreateSku'>自动生成</a></th><th style='width:80px'>零售价</th><th  style='width:80px'>促销价</th><th>图片</th><th  style='width:40px'></th>");
    
    $("#lnkAutoCreateSku").click(function () {
        var parentSku = $.trim($("#ParentSKU").val());
        if (parentSku.length == 0) {
            alert("请先填写父SKU值，再进行此操作");
            return;
        };
        $("#divSkuSettingPanel>table>tbody>tr").each(function () {
            var trPanel = $(this);
            var newSpecSKU=parentSku;
            $(trPanel).children("td[valueid]").each(function () {
                if ($(this).attr("data-type") == "颜色") {
                    if ($(this).find("#txtSpecValueInput").length > 0)
                    {                            
                        newSpecSKU+="-"+ $(this).find("#txtSpecValueInput").val() ;                           
                    }
                    else {
                        newSpecSKU+="-"+  $(this).text();
                    }
                }
                if ($(this).attr("data-type") == "尺寸") {
                    if ($(this).find("#txtSpecValueInput").length > 0)
                    {
                        newSpecSKU+="-"+ $(this).find("#txtSpecValueInput").val() ;    
                    }
                    else {
                        newSpecSKU+="-"+  $(this).text();
                    }
                }
            });
            trPanel.find("#txtSpecSku").attr("title", newSpecSKU.replace(/amp;/g, "")).val(newSpecSKU.replace(/amp;/g, ""));
        });
    });
    var MsrPrice = $("#MsrPrice").val();
    var MainPrice = $("#ProductPrice").val();
    var shipPrice = $("#ShippingCost").val();
    var tbody = $("<tbody></tbody>").appendTo(settingTable)
    //生成表格内容
    for (var i = 0; i < skuValueList.length; i++) {
        var skuValue = skuValueList[i];
        var dataRow = $("<tr specid='" + skuValue.specId + "'></tr>").appendTo(tbody);
        $.each(attrList, function (index, item) {
            dataRow.append("<td attrid='" + item.attrId + "' valueid='" + skuValue[item.attrId].valueId + "'  data-type='" + item.attrName + "'data-namevalue='" + skuValue[item.attrId].valueName + "' >" + skuValue[item.attrId].valueName + "</td>");
        });
        dataRow.append("<td><input type=\"text\" id=\"txtSpecSku\" value='" + skuValue.sku + "' class=\"form-control input-sm\"></td><td><input type=\"text\" id=\"txtSpecPrice\" value='" + skuValue.salePrice + "' class=\"form-control input-sm\"></td><td><input type=\"text\" id=\"txtMsrPrice\" value='" +skuValue.msrPrice+ "' class=\"form-control input-sm\"></td>");
        var photpStr = '<td >';
        photpStr += '<div id="divSkuPhoto" valueid="' + i + '" style="margin:auto;height:100px" align="center" class="photo-list">';
        if (skuValue.picUrl && skuValue.picUrl != '') {
            var urlList=skuValue.picUrl.split(';')
            for(var j=0;j<urlList.length;j++)
            {
                //photpStr += '<div status="loaded"draggable="false" style="position:relative;height: 80px;">'
                //photpStr += '<img src="' + skuValue.picUrl + '" draggable="false" onmouseover="showPic(this)" onmouseout="hidePic(this)">';
                //photpStr += '<div class="tags">';
                //photpStr += '<span class="label-holder">';
                //photpStr += '<a href="javascript:void(0)" class="label  label-warning arrowed-in" onclick="doMoveOutPublishPhoto(this)" draggable="false"><hg:trans>移出</hg:trans></a>';
                //photpStr += '</span>';
                //photpStr += '</div>';
                //photpStr += '</div>';
                photpStr += ' <div style="height: 80px;" status="unload"><img src="/Content/img/addpic.png" / style="width:60px;height:60px" onclick="doChooseProductPhoto(this)"></div>';
            }
        }else{
            photpStr += ' <div style="height:80px;" status="unload"><img src="/Content/img/addpic.png" / style="width:60px;height:60px"  onclick="doChooseProductPhoto(this)"></div>';
        }  
        photpStr += '</div></td>';
        photpStr += '<td style="width:13%"><a href="javascript:void(0)" class="btn btn-default btn-lg" role="button"  onclick="RemoveSkuTr(this)">移除</a>';
        if (i != 0) {
            photpStr += '<a href="javascript:void(0)" class="btn btn-default btn-lg" role="button" onclick="SetToTop(this)"><hg:trans>置顶</hg:trans></a>';
        }
        photpStr += '</td>';
        dataRow.append(photpStr);
    }
}

//=======================End： 处理商品的分类与属性===========================================

//=======================Begin：商品图片处理===========================================
var currentSkuPhotoId = ""; //当前SKU的值
/*
    显示添加/上传图片的对话框
*/
function doUploadPruductPhoto(option, title, attrValueId) {
    if (attrValueId == null)
        currentSkuPhotoId = "";
    else
        currentSkuPhotoId = attrValueId;

    var url = "/PhotoBank/Edit/?parentPageKey=doPreview" + option;
    var messageModal = new redgle.modal({ type: "iframe", title: title, content: url, isShowMessage: true, height: 650 });
    messageModal.show();
}

/*
    显示从本地图片银行选择图片的对话框
*/
function doSelectProductPhoto(attrValueId) {
    if (attrValueId == null)
        currentSkuPhotoId = "";
    else
        currentSkuPhotoId = attrValueId;

    //异步获取弹出
    var url = "/PhotoBank/UserPhotoBankCheck?parentPageKey=doPreview";
    var title = "从系统图片银行选取图片";
    var messageModal = new redgle.modal({ type: "iframe", title: title, content: url, isShowMessage: true });
    messageModal.show();
}

/*
    显示选择本产品图片
*/
var $thisPhotoTh;//这里是this 点击图片时的按钮是那一个
function doChooseProductPhoto(event) {
    $thisPhotoTh = $(event);
    $("#ChoosePicModal").find("i").removeClass("glyphicon glyphicon-ok")
    $("#ChoosePicModal").modal('show');
}

//单选（选择本产品图片）
function Check(obj) {
    var objinfo = {
        PhotoBankId: $(obj).attr("id"),
        Url: $(obj).attr("src")
    };
    var photoTr = $thisPhotoTh.closest("tr"); //这一行
    var photoPanel = photoTr.find("div[id='divSkuPhoto']"); //图片
    var unloadDiv=photoPanel.find("div[status='unload']")
    if(photoPanel.find("div[status='loaded']").length>8)
    {
        alert("最多添加9张变参图片！")
        return;
    }
    if(photoPanel.find("img[src='"+ objinfo.Url+"']").length==0)
    {
        var htmlPanel = "";
        htmlPanel += ('<div style="height: 80px;" status="loaded"><img src="' + objinfo.Url + '" style="width:60px;height:60px"> <span onclick="javascript: doRemoveSpecPhoto(this)" align="center" style="width:100%"><hg:trans>移除</hg:trans></span></div>');
        //htmlPanel += ('</div>')
        unloadDiv.before(htmlPanel);
        var $i = $(obj).parent().find("i")
        if ($i.length > 0) {
            var $photo_list = $(obj).closest("#ChoosePicModal")
            $i.addClass("glyphicon glyphicon-ok");
        }
        objinfo.Url = "";
        try {
            var skuplist = photoTr.find("#divSkuPhoto")[0];
            new Sortable(skuplist);
        } catch (e) {
    
        }
    }
}

/*根据颜色和尺寸批量设置子sku图片*/
function doSetProductMic(obj) {
    var color = $(obj).attr("specColor");
    var chooseName = $(obj).attr("chooseName");
    var size = $(obj).attr("specSize");
    var imageUrl = $(obj).attr("imageUrl");
    //处理产品变参数据
    var specList = new Array();
    $("#divSkuSettingPanel>table tr[specid]").each(function (trindex, tritem) {
        var specId = $(this).attr("specid");
        var spec = { ProductSpecId: specId };
        $(this).children("td[valueid]").each(function (index, item) {
            var datatype = $(this).attr("data-type");
            var photoPanel = $("div[id='divSkuPhoto'][valueid='" + specId + "']");
            if (specId == 0) {
                photoPanel = $("div[id='divSkuPhoto'][valueid='" + trindex + "']");
            }
            if (chooseName == "color") {
                var SpecValue1 = "";
                var SpecValue1 = $("tr[specid='" + specId + "'] td:first input").val();
                if (SpecValue1 == "" || SpecValue1 == undefined) {
                    SpecValue1 = $("div[id='divSkuPhoto'][valueid='" + trindex + "']").parent().parent().children().eq(0).html();
                }
                if (SpecValue1 != undefined) {
                    if (SpecValue1.toUpperCase() == color.toUpperCase()) {
                        doPhotoPanelAppend(photoPanel, imageUrl, specId, trindex);
                    }
                }
            } else {
                var SpecValue2 = "";
                var SpecValue2 = $("tr[specid='" + specId + "'] td:nth-child(2) input").val();
                if (SpecValue2 == "" || SpecValue2 == undefined) {
                    SpecValue2 = $("div[id='divSkuPhoto'][valueid='" + trindex + "']").parent().parent().children().eq(1).html();
                }
                if (SpecValue2 != undefined) {
                    if (SpecValue2.toUpperCase() == size.toUpperCase()) {
                        doPhotoPanelAppend(photoPanel, imageUrl, specId, trindex);
                    }
                }
            }
        });
    });
}

/*添加选择本产品图片添加的html*/
function doPhotoPanelAppend(photoPanel, imageUrl, specId, trindex) {
    var color = "";
    var color = $("tr[specid='" + specId + "'] td:first input").val();
    if (color == "" || color == undefined) {
        color = $("div[id='divSkuPhoto'][valueid='" + trindex + "']").parent().parent().children().eq(0).html();
    }

    var size = "";
    var size = $("tr[specid='" + specId + "'] td:nth-child(2) input").val();
    if (size == "" || size == undefined) {
        var sizeNode = $("div[id='divSkuPhoto'][valueid='" + trindex + "']").parent().parent().children().eq(1);
        /// 有可能没有选择尺寸第二行就是sku了 就不显示按尺寸批量设置了
        if (sizeNode.children().eq(0).prop("id") == "txtSpecSku") {
            var size = undefined;
        }
        else {
            size = sizeNode.html();
        }
    }
    photoPanel.empty();

    var htmlPanel = ("");
    //htmlPanel += ('<div id="divSkuPhoto" valueid="@specItem.ProductSpecId" style="margin:auto;height:180px;border:none" align="center" class="photo-list"></div>')
    htmlPanel += ('<img src="' + imageUrl + '" style="width:100px;" onmouseover="showPic(this)" onmouseout="hidePic(this)"/>')
    htmlPanel += ('<span onclick="javascript:doRemoveSpecPhoto(this)" align="center" style="width:100%"><hg:trans>移除</hg:trans></span>')
    htmlPanel += ('<span style="height:10px;margin-right:32px"><div class="mRight10 dropdown" style="height:30px"><button class="btn btn-sumool-default" type="button" id="dropdownMenu" data-toggle="dropdown" aria-expanded="true">批量设置图片<span class="caret"></span></button>');
    htmlPanel += ('<ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu2">');
    if (color != undefined) {
        htmlPanel += ('<li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:;" onclick="javascript:doSetProductMic(this)" chooseName="color" align="center" id="' + specId + '" specColor="' + color + '" specSize="' + size + '"  imageUrl="' + imageUrl + '"><hg:trans>根据当前颜色批量设置子SKU图片</hg:trans></a></li>')
    }
    if (size != undefined) {
        htmlPanel += ('<li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:;" onclick="javascript:doSetProductMic(this)"  chooseName="size" align="center" id="' + specId + '" specColor="' + color + '"  specSize="' + size + '" imageUrl="' + imageUrl + '"><hg:trans>根据当前尺寸批量设置子SKU图片</hg:trans></a></li>');
    }
    htmlPanel += ('</ul></div></span>')
    photoPanel.append(htmlPanel);
}

/*
    显示本地上传的图片
*/
function doPreviewReturnUrlData(obj) {
    for (var i = 0; i < obj.length; i++) {
        doPreviewGetPhotoBankId(obj[i]);
    }
}

/*
    处理已选择的图片
*/
function doPreviewGetPhotoBankId(obj) {
    var thisU1 = window.location.protocol; // http:
    var thisU2 = window.location.host;   // localhost:81
    if (obj.Url != null && obj.Url.indexOf("http") < 0) {
        obj.Url = thisU1 + "//" + thisU2 + "/" + obj.Url;
    }
    if (currentSkuPhotoId == null || currentSkuPhotoId.length == 0) {
        if (doCheckPhotoExists(obj.Url))
            return;

        var unloadPhoto = $("<div photoid='0' style='height: 148px;' status='unload'><img src='/Content/img/nopic.jpg' /></div>");
        //if (unloadPhoto.length == 0)
        //    return;
        var photoPanel = unloadPhoto.eq(0);
        photoPanel.attr({ "status": "loaded", "itemid": obj.PhotoBankId, "type": "0" }).empty();
        photoPanel.append("<img src='" + obj.Url + "'/>");
        photoPanel.append("<div class='tags'><span class='label-holder'> <a class='label  label-primary arrowed-in ' istrue='false' onclick='doMoveToPublishPhoto(this)'>移入发布区</a><a href='javascript:void(0)' class='label  label-warning arrowed-in' onclick='doRemoveSKUPhoto(this)'>删除</a> </span></div>");
        $("#divAlternativePhotoPanel").append(photoPanel);
    }
    else if (currentSkuPhotoId == "-1") {
        editor1.insertHtml("<img type='0' src='" + obj.Url + "'/>");
    }
    else {
        var photoPanel = $("div[id='divSkuPhoto'][valueid='" + currentSkuPhotoId + "']");
        photoPanel.empty();
        var color = "";
        var color = $("tr[specid='" + currentSkuPhotoId + "'] td:first input").val();
        //if (color == "" || color == undefined) {
        //    color = $("div[id='divSkuPhoto'][valueid='" + currentSkuPhotoId + "']").parent().parent().children().eq(0).html();
        //}
        var size = "";
        var size = $("tr[specid='" + currentSkuPhotoId + "']>td:eq(1)").find("input").val();
        //if (size == "" || size == undefined) {
        //    size = $("div[id='divSkuPhoto'][valueid='" + currentSkuPhotoId + "']").parent().parent().children().eq(1).html();
        //}
        var htmlPanel = ("");
        //htmlPanel += ('<div id="divSkuPhoto" valueid="@specItem.ProductSpecId" style="margin:auto;height:180px;border:none" align="center" class="photo-list"></div>')
        htmlPanel += ('<img src="' + obj.Url + '" style="width:100px;" onmouseover="showPic(this)" onmouseout="hidePic(this)"/>')
        htmlPanel += ('<span onclick="javascript:doRemoveSpecPhoto(this)" align="center" style="width:100%"><hg:trans>移除</hg:trans></span>')
        if (color != "" || size != "") {
            htmlPanel += ('<span style="height:10px;margin-right:32px"><div class="mRight10 dropdown" style="height:30px"><button class="btn btn-sumool-default" type="button" id="dropdownMenu" data-toggle="dropdown" aria-expanded="true">批量设置图片<span class="caret"></span></button>');
            htmlPanel += ('<ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu2">');
        }
        if (color != undefined && color != "") {
            htmlPanel += ('<li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:;" onclick="javascript:doSetProductMic(this)" chooseName="color" align="center" id="' + currentSkuPhotoId + '" specColor="' + color + '" specSize="' + size + '"  imageUrl="' + obj.Url + '"><hg:trans>根据当前颜色批量设置子SKU图片</hg:trans></a></li>')
        }
        if (size != undefined && size != "") {
            htmlPanel += ('<li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:;" onclick="javascript:doSetProductMic(this)"  chooseName="size" align="center" id="' + currentSkuPhotoId + '" specColor="' + color + '"  specSize="' + size + '" imageUrl="' + obj.Url + '"><hg:trans>根据当前尺寸批量设置子SKU图片</hg:trans></a></li>');
        }
        if (color != "" || size != "") {
            htmlPanel += ('</ul></div></span>');
        }
        photoPanel.append(htmlPanel);
        //photoPanel.append('<div id="divSkuPhoto" valueid="@specItem.ProductSpecId" style="margin:auto;height:120px;border:none" align="center" class="photo-list">')
        //photoPanel.append('<img src="' + obj.Url + '" style="width:100px;height:100px;" onmouseover="showPic(this)" onmouseout="hidePic(this)"/>')
        //photoPanel.append('<span onclick="javascript:doRemoveSpecPhoto(this)" align="center" style="width:100%"><hg:trans>移除</hg:trans></span></div>')
    }
    //本产品图片添加图片
    if($("#ChoosePicModal").find("img[src='"+obj.Url+"']").length==0)
    {
        var choosePicModalHtml='<div photoid="0" status="loaded" itemid="0" type="速猫图片银行" draggable="false">';
        choosePicModalHtml+='<img src=\"'+obj.Url+'\" draggable="false" title="0" onclick="Check(this)" id="0">';
        choosePicModalHtml+='<div class="tags">';
        choosePicModalHtml+='<span class="label-holder">';
        choosePicModalHtml+='<a href="javascript:void(0)" class="label  label-primary arrowed-in " src=\"'+obj.Url+'\" istrue="false" onclick="Check(this)" draggable="false" id="0"><i></i>选择</a>';
        choosePicModalHtml+='</span>';
        choosePicModalHtml+='';
        choosePicModalHtml+='</div>';
        choosePicModalHtml+='</div>';
        $("#ChoosePicModal .photo-list").append(choosePicModalHtml)      
    }
    //图片美图
    $.smartMenu.remove()
    $("#tabContent_liProductEdit img").smartMenu(imageMenuData, {
        name: "image"
    });
}

/*
设为主图
*/
function doSetMaiPhoto(PhotoBankId, obj) {
    $("#divMainPhotoPanel").find("a[istrue]").each(function () {
        if (typeof ($(this).attr("istrue")) != "undefined") {
            $(this).attr("istrue", false).html("").text("设置主图");
        }
    });
    $(obj).attr("istrue", true).text("").append('<i class="glyphicon glyphicon-ok"></i>');
}

/*
    移除SKU的产品图片
*/
function doRemoveSKUPhoto(event) {
    var $src = $(event);
    var photoPanel = $src.parent().parent().parent();
    photoPanel.css("height", "148px")
    photoPanel.empty().html("<img src=\"/Content/img/nopic.jpg\" />").attr("status", "unload");
    if ($("#divMainPhotoPanel>div").length > 8) {
        photoPanel.remove();
    }
    else {
        photoPanel.attr("photoid", "0").remove().appendTo($("#divMainPhotoPanel"));
    }
}
function doRemoveSpecPhoto(event) {
    var $src = $(event);
    var photoPanel = $src.parent();
    photoPanel.remove()
}
/*
    检查指定的图片是否已经添加到商品主图中
*/
function doCheckPhotoExists(url) {
    var hasImage = false;
    $("#divMainPhotoPanel>div img").each(function () {
        if ($(this).attr("src") == url) {
            hasImage = true;
            return false;
        }
    });
    $("#divAlternativePhotoPanel>div img").each(function () {
        if ($(this).attr("src") == url) {
            hasImage = true;
            return false;
        }
    });



    return hasImage;
}
//=======================End：商品图片处理===========================================

//=======================Begin：商品相关选项同步===========================================


//=======================End：商品相关选项同步===========================================

//=======================Begin：保存及发布相关操作===========================================

jQuery(function () {
    //映射到本地产品
    $("#btnMappingData").click(function () {
        var hasError = doCheckSubmitDataFormat();
        if (hasError) {
            redgle.showMessage("您填写的信息有误，请修正之后再进行此操作");
            return;
        }
        $("#ImportParentSkuModal").modal('show');
    });

    //点击确定映射到本地产品
    $("#btnSaveSku").click(function () {
        var oldsku = $.trim($("#OldParentSKU").val())
        if (oldsku == "") {
            redgle.showMessage("请填写SKU值！");
            return;
        }
        var parentSku = $.trim($("#ParentSKU").val());
        //获取请求数据
        var requestData = doGetRequestData();
        //首先判断要映射到本地产品的父sku是否存在
        $.ajax({
            type: "POST",
            url: "../WishPublish/MappingProduct",
            data: requestData,
            datatype: "json",
            success: function (data) {
                if (data.ResultObject != null && data.ResultObject.length > 0) {
                    $("#PreviewProductId").val(data.ResultObject);
                }
                if (data.HasError) {
                    var msg = "";
                    if (data.Message != null && data.Message.length > 0) {
                        msg = data.Message + " <br />";
                    }
                    if (data.MapData != null) {
                        msg += "<ul>"
                        $.each(data.MapData, function (index, item) {
                            msg += "<li>" + index + "：" + item + "</li>";
                        });
                        msg += "</ul>"
                    }
                    redgle.showMessage("操作失败:" + msg);
                } else {
                    $("#ImportParentSkuModal").modal('hide');
                    if (data.Message != null && data.Message.length > 0) {
                        redgle.showConfirm("线上商品保存成功！<br/> 提示:" + data.Message + "<br/><span style='color:red'>是否跳转到SKU映射页面</span>", "doCloseOpenSkuMapp()");
                    } else {                      
                        redgle.showMessage("保存成功！");
                    }
                }
            },
            error: function () {
                redgle.showMessage("操作失败！");
            }
        });
    });
});
//提交
function Save(type) {
    var hasError = doCheckSubmitDataFormat();
    if (hasError) {
        redgle.showMessage("您填写的信息有误，请修正之后再进行此操作");
        return;
    }
    //获取请求数据
    var requestData = doGetRequestData();
    requestData["type"] = type;
    $.ajax({
        type: "POST",
        url: "../AmazonPublish/SaveProductStore",
        data: requestData,
        datatype: "json",
        success: function (data) {
            if (data.HasError) {
                var msg = "";
                if (data.Message != null && data.Message.length > 0) {
                    msg = data.Message + " <br />";
                }
                if (data.MapData != null) {
                    msg += "<ul>"
                    $.each(data.MapData, function (index, item) {
                        msg += "<li>" + index + "：" + item + "</li>";
                    });
                    msg += "</ul>"
                }
                redgle.showMessage("操作失败:" + msg);

            } else {
                doClosePreviewEdit();
                if (type == 2) {
                    //打开产品编辑页 填写信息
                    doProductInfo(data.MapData.ProductId);
                    $("#liProductEdit a").attr("role", "tab");
                }
            }
        },
        error: function () {
            redgle.showMessage("操作失败！");
        }
    });
}
function doProductInfo(id, productType, showModule) {
    if (id == undefined)
        id = 0;
    if (productType == undefined || productType == "")
        productType = "normal";
    if (showModule == undefined)
        showModule = "";
    var url = "/Product/ProductInfo/" + id + "?productType=" + productType + "&showModule=" + showModule;
    redgle.tab.create("liProductEdit", url, translate.format("<hg:trans>产品详情</hg:trans>"));
}


function doForcePublish() {
    $("#syncProductPublish").modal('hide');
    var productId = $("#PreviewProductId").val();
    $.ajax({
        type: "POST",
        url: "../WishPublish/ForcePublish",
        data: { id: productId },
        datatype: "json",
        success: function (data) {
            if (data.HasError) {
                redgle.showMessage("操作失败:" + data.Message);
            } else {
                doClosePreviewEdit();
            }
        },
        error: function () {
            redgle.showMessage("操作失败！");
        }
    });
}

function doGetRequestData() {
    var thisU1 = window.location.protocol; // http:
    var thisU2 = window.location.host;   // localhost:81
    //验证产品标签值长度
    var requestData = redgle.request.getFormData("ProductEditForm");
    //产品图片
    var photoList = new Array();
    $("#divMainPhotoPanel>div[status='loaded']").each(function () {
        var photoId = $(this).attr("photoid");
        if (photoId == null || photoId.length == 0)
            photoId = "0";
        var from = $(this).attr("type");
        var relationId = $(this).attr("itemid");
        var url = $(this).find("img").attr("src");
        if (url != null && url != '' && url != 'undefined' && url.indexOf("http") < 0) {
            url = thisU1 + "//" + thisU2 + "/" + url;
        }
        var ismain = $(this).find("img").next().find("[istrue]").attr("istrue")
        photoList[photoList.length] = {
            PhotoId: photoId,
            PhotoRelationId: relationId,
            PhotoFrom: from,
            ImageUrl: url,
            IsMain: ismain,
            IsPublish: true
        };
    });
    $("#divAlternativePhotoPanel>div[status='loaded']").each(function () {
        var photoId = $(this).attr("photoid");
        if (photoId == null || photoId.length == 0)
            photoId = "0";
        var from = $(this).attr("type");
        var relationId = $(this).attr("itemid");
        var url = $(this).find("img").attr("src");
        if (url != null && url != '' && url != 'undefined' && url.indexOf("http") < 0) {
            url = thisU1 + "//" + thisU2 + "/" + url;
        }
        photoList[photoList.length] = {
            PhotoId: photoId,
            PhotoRelationId: relationId,
            PhotoFrom: from,
            ImageUrl: url,
            IsMain: false,
            IsPublish: false
        };
    });
    requestData["ProductPhotoList"] = JSON.stringify(photoList);

    //处理产品变参数据
    var specList = new Array();
    $("#divSkuSettingPanel>table tr[specid]").each(function (trindex, tritem) {
        var specId = $(this).attr("specid");
        var spec = { ProductSpecId: specId };
        $(this).children("td[valueid]").each(function (index, item) {
            var datatype = $(this).attr("data-type");
            if (datatype == "颜色") {
                var SpecValue1 = "";
                if ($(this).find("input").length > 0) {
                    SpecValue1 = $(this).find("input:first").val();
                } else {
                    SpecValue1 = $(this).text();
                }
                if (SpecValue1 != "") {
                    spec["Spec1"] = "color";
                    spec["SpecValue1"] = SpecValue1;
                }
            } else {
                var SpecValue2 = "";
                if ($(this).find("input").length > 0) {
                    SpecValue2 = $(this).find("input:first").val();
                } else {
                    SpecValue2 = $(this).text();
                }
                if (SpecValue2 != "") {
                    spec["Spec2"] = "size";
                    spec["SpecValue2"] = SpecValue2;
                }
            }
        });
        spec["SKU"] = $.trim($(this).find("#txtSpecSku").val());
        spec["ProductPrice"] = $.trim($(this).find("#txtSpecPrice").val());
        var tSalePrice= $.trim($(this).find("#txtMsrPrice").val());
        if(tSalePrice.length==0)
        {
            tSalePrice="0";
        }
        spec["SalePrice"] =tSalePrice
        spec["ExtraImages"] = $(this).find("div[status='loaded']>img").map(function(){return $(this).attr("src");}).get().join(";");    
        if (trindex == 0) {
            spec["MessgeNum"] = "1";
        } else {
            spec["MessgeNum"] = null;
        }
        specList[specList.length] = spec;
    });
    requestData["ProductSpecList"] = JSON.stringify(specList);
    var Color = ""; var Size = "";
    $("#divProductSkuPanel>div[attrnameen='Color']").find("input").each(function () {
        var $this = $(this)
        if ($this.is(":checked")) {
            if (Color == "") {
                Color = $this.attr("valuenameen");
            } else {
                Color += "," + $this.attr("valuenameen");
            }
        }
    })
    $("#divProductSkuPanel>div[attrnameen='Size']").find("input").each(function () {
        var $this = $(this)
        if ($this.is(":checked")) {
            if (Size == "") {
                Size = $this.attr("valuenameen");
            } else {
                Size += "," + $this.attr("valuenameen");
            }
        }
    })
    var ProductFieldList = new Array();
    requestData["ProductFieldList"] = JSON.stringify(ProductFieldList);
    console.log(requestData["ProductFieldList"])
    return requestData;
}

function doCheckSubmitDataFormat() {
    var hasError = false;
    var error = {};
    var ProductName = $("input[name='ProductCnName']").val();
    var ProductEnName = $("input[name='ProductEnName']").val();

    var ProductFrName = $("input[name='ProductFrName']").val();
    var ProductDeName = $("input[name='ProductDeName']").val();
    var ProductEsName = $("input[name='ProductEsName']").val();
    var ProductItName = $("input[name='ProductItName']").val();
    var ProductJpName = $("input[name='ProductJpName']").val();
    if (ProductName.length == 0 || ProductEnName.length == 0|| ProductFrName.length == 0|| ProductDeName.length == 0|| ProductEsName.length == 0|| ProductItName.length == 0|| ProductJpName.length == 0) {
        hasError = true;
        error["ProductCnName"] = "产品名称不允许为空";
    }
    var CnFeatures = $("textarea[name='CnFeatures']").val();
    var EnFeatures = $("textarea[name='EnFeatures']").val();

    var FrFeatures = $("textarea[name='FrFeatures']").val();
    var DeFeatures = $("textarea[name='DeFeatures']").val();
    var EsFeatures = $("textarea[name='EsFeatures']").val();
    var ItFeatures = $("textarea[name='ItFeatures']").val();
    var JpFeatures = $("textarea[name='JpFeatures']").val();

    if (EnFeatures.length == 0 || CnFeatures.length == 0|| FrFeatures.length == 0|| DeFeatures.length == 0|| EsFeatures.length == 0|| ItFeatures.length == 0|| JpFeatures.length == 0) {
        hasError = true;
        error["CnFeatures"] = "产品特点不允许为空";
    }
    var CnKeywords = $("textarea[name='CnKeywords']").val();
    var EnKeywords = $("textarea[name='EnKeywords']").val();


    var FrKeywords = $("textarea[name='FrKeywords']").val();
    var DeKeywords = $("textarea[name='DeKeywords']").val();
    var EsKeywords = $("textarea[name='EsKeywords']").val();
    var ItKeywords = $("textarea[name='ItKeywords']").val();
    var JpKeywords = $("textarea[name='JpKeywords']").val();
    if (CnKeywords.length == 0 || EnKeywords.length == 0|| FrKeywords.length == 0|| DeKeywords.length == 0|| EsKeywords.length == 0|| ItKeywords.length == 0|| JpKeywords.length == 0) {
        hasError = true;
        error["CnKeywords"] = "产品关键字不允许为空";
    }else{
        EnKeywords=EnKeywords.split("\n");
        for(var i=0;i<EnKeywords.length;i++)
        {
            if(EnKeywords[i].length>50)
            {
                hasError = true;
                error["EnKeywords"] = "每行为一个关键字，英文单个关键字不应超过50个字符";
                break;
            }
        }
        var FrKeywords = $("textarea[name='FrKeywords']").val().split("\n");
        for(var i=0;i<FrKeywords.length;i++)
        {
            if(FrKeywords[i].length>50)
            {
                hasError = true;
                error["FrKeywords"] = "每行为一个关键字，法文单个关键字不应超过50个字符";
                break;
            }
        }
        var DeKeywords = $("textarea[name='DeKeywords']").val().split("\n");
        for(var i=0;i<DeKeywords.length;i++)
        {
            if(DeKeywords[i].length>50)
            {
                hasError = true;
                error["DeKeywords"] = "每行为一个关键字，德文单个关键字不应超过50个字符";
                break;
            }
        }
        var EsKeywords = $("textarea[name='EsKeywords']").val().split("\n");
        for(var i=0;i<EsKeywords.length;i++)
        {
            if(EsKeywords[i].length>50)
            {
                hasError = true;
                error["EsKeywords"] = "每行为一个关键字，西班牙文单个关键字不应超过50个字符";
                break;
            }
        }
        var ItKeywords = $("textarea[name='ItKeywords']").val().split("\n");
        for(var i=0;i<ItKeywords.length;i++)
        {
            if(ItKeywords[i].length>50)
            {
                hasError = true;
                error["ItKeywords"] = "每行为一个关键字，意大利文单个关键字不应超过50个字符";
                break;
            }
        }
        var JpKeywords = $("textarea[name='JpKeywords']").val().split("\n");
        for(var i=0;i<JpKeywords.length;i++)
        {
            if(JpKeywords[i].length>50)
            {
                hasError = true;
                error["JpKeywords"] = "每行为一个关键字，日文单个关键字不应超过50个字符";
                break;
            }
        }
    }
    var CnDesc = $("textarea[name='CnDesc']").val();
    var Endesc = $("textarea[name='Endesc']").val();

    var Frdesc = $("textarea[name='Frdesc']").val();
    var Dedesc = $("textarea[name='Dedesc']").val();
    var Esdesc = $("textarea[name='Esdesc']").val();
    var Itdesc = $("textarea[name='Itdesc']").val();
    var Jpdesc = $("textarea[name='Jpdesc']").val();
    if (CnDesc.length == 0 || Endesc.length == 0|| Frdesc.length == 0|| Dedesc.length == 0|| Esdesc.length == 0|| Itdesc.length == 0|| Jpdesc.length == 0) {
        hasError = true;
        error["CnDesc"] = "产品描述不允许为空";
    }
    var ParentSKU = $("#ParentSKU").val();
    if (ParentSKU.length == 0) {
        hasError = true;
        error["ParentSKU"] = "不允许为空";
    }
    //检查图片
    if ($("#divMainPhotoPanel>div[status='loaded']").length == 0) {
        hasError = true;
        $("#spanProductPhotoMessage").html("<font color='red'>请添加产品图片</font>");
    }
    if ($("#divMainPhotoPanel>div[status='loaded']").length > 8) {
        hasError = true;
        $("#spanProductPhotoMessage").html("<font color='red' style='font-size:30px'>发布的图片不要超过8张</font>");
    }




    //零售价
    if ($("#divNoSkuPanel").hasClass("hide") == false) {
        var message = doCheckProductPrice($("#ProductPrice"));
        if (message.length > 0) {
            hasError = true;
            doShowElementError($("#ProductPrice"), message);
        }
        //message = doCheckStockNum($("#StockNum"));
        //if (message.length > 0) {
        //    hasError = true;
        //    doShowElementError($("#StockNum"), message);
        //}
        //message = doCheckProductShippingPrice($("#ShippingCost"));
        //if (message.length > 0) {
        //    hasError = true;
        //    doShowElementError($("#ShippingCost"), message);
        //}
    }
    //if ($("#MsrPrice").val().trim() != "") {
    //    var message = doCheckProductPrice($("#MsrPrice"));
    //    if (message.length > 0) {
    //        hasError = true;
    //        doShowElementError($("#MsrPrice"), message);
    //    }
    //}
    //验证SKU属性
    if ($("#divProductSkuPanel").hasClass("hide") == false) {
        $("#divSkuSettingPanel input[id='txtSpecSku']").each(function () {
            var sku = $.trim($(this).val());
            if (sku.length == 0) {
                hasError = true;
                doShowElementError(this, "不允许为空");
            }
        });
        $("#divSkuSettingPanel input[id='txtSpecPrice']").each(function () {
            var message = doCheckProductPrice(this);
            if (message.length > 0) {
                hasError = true;
                doShowElementError(this, message);
            }
        });

        $("#divSkuSettingPanel>table tr[specid]").each(function () {
            var valueError = true;
            $(this).children("td[valueid]").each(function (index, item) {
                var SpecValue = "";
                if ($(this).find("input").length > 0) {
                    SpecValue = $(this).find("input:first").val();
                } else {
                    SpecValue = $(this).text();
                }
                if (SpecValue != "") {
                    valueError = false;
                }

            });
            if (valueError) {
                hasError = true;
                $(this).children("td[valueid]").each(function () {
                    $(this).find("input").each(function () {
                        doShowElementError(this, "颜色和尺寸不能同时为空！");
                    })
                })
            }
        });

        $("#divSkuSettingPanel input[id='txtMsrPrice']").each(function () {
            var errorMessage = "";
            var strPrice = $(this).val();
            if (strPrice.length != 0 && !checkDecimal(strPrice)) {
                errorMessage = "请正确填写促销价格";
            }
            else {
                var price = parseFloat(strPrice);
                if (price < 0.01 || price > 100000) {
                    errorMessage = "价格请输入 0.01 - 100000 之间的金额";
                }
            }
            if (errorMessage.length > 0) {
                hasError = true;
                doShowElementError(this, message);
            }
        });

        $("#divSkuSettingPanel input[id='txtSpecStockNum']").each(function () {
            var message = doCheckStockNum(this);
            if (message.length > 0) {
                hasError = true;
                doShowElementError(this, message);
            }
        });
    }
    if (hasError && error != {}) {
        doShowError(error);
    }

    return hasError;
}

function doCheckProductPrice(obj) {
    var errorMessage = "";
    var strPrice = $(obj).val();
    if (strPrice.length == 0 || !checkDecimal(strPrice)) {
        errorMessage = "请正确填写价格";
    }
    else {
        var price = parseFloat(strPrice);
        if (price < 0.01 || price > 100000) {
            errorMessage = "价格请输入 0.01 - 100000 之间的金额";
        }
    }
    return errorMessage;
}
function doCheckProductShippingPrice(obj) {
    var errorMessage = "";
    var strPrice = $(obj).val();
    if (strPrice.length == 0 || !checkDecimal(strPrice)) {
        errorMessage = "请正确填写价格";
    }
    else {
        var price = parseFloat(strPrice);
        if (price < 0.00) {
            errorMessage = "价格请输入 0.00 - 100000 之间的金额";
        }
    }
    return errorMessage;
}
function doCheckStockNum(obj) {
    var errorMessage = "";
    var strNum = $(obj).val();
    if (strNum.length == 0 || !checkInt(strNum)) {
        errorMessage = "请正确填写库存";
    }
    else {
        var num = parseInt(strNum);
        if (num < 1 || num > 999999) {
            errorMessage = "库存请输入 1 - 999999 之间的数字";
        }
    }
    return errorMessage;
}

//=======================End：保存及发布相关操作===========================================

/*
    显示指定的错误信息
*/
function doShowError(error) {
    $.each(error, function (key, value) {
        $("#" + key).tooltip({ title: value });
        $("#" + key).tooltip("show");
        $("#" + key).parent().addClass("has-error");
        $("#" + key).change(function () {
            $("#" + key).tooltip("destroy");
            $("#" + key).parent().removeClass("has-error");
        });
    });
}

/*
    显示指定元素的错误提示信息
*/
function doShowElementError(obj, message) {
    $(obj).tooltip({ title: message });
    $(obj).tooltip("show");
    $(obj).parent().addClass("has-error");
    $(obj).change(function () {
        $(obj).tooltip("destroy");
        $(obj).parent().removeClass("has-error");
    });
}