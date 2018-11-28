/**
 * Created by Administrator on 2018/1/11.
 * version 2.6
 */

$(function(){
    window.Bus = new Vue();
    Bus.dataTitle = [];
    Inform.init();
    var header = "https://www.actneed.com/img";
    var pic_upload_complete = function (pictures, modal_trigger) {
        var data_picname = modal_trigger.closest("td").siblings().data("sku"),
            pic_len = $("td[pic='" + data_picname + "']").find("div[class='pre-all']").length,
            pic_lens = pictures.length;
        if (pic_len >= 9) {
            alert("最多上传9张图片。");
            return 0;
        } else {
            var pic_str = "",
                $tr = modal_trigger.closest("tr"),
                main_alias = $("#main-alias").val() || "",
                t_span = $tr.prev().find("span[data-name]").get().filter(function (a) {
                    return $(a).attr("data-name").toLowerCase() == main_alias;
                })[0],
                value;
            if (t_span) value = $(t_span).attr("data-value") || ""; else value = "";
            for (var i = 0; i < pictures.length; i++) {
                pic_str += '<div class="img-pre-box" data-id=""><a href="javascript:void(0)"><span class="del-temp-img"></span></a><img src=' + pictures[i] + '></div>'
            }
            if (value) {
                var f_span = $(".variation-row").find("span[data-name]").get().filter(function (a) {
                    return ($(a).attr("data-name").toLowerCase() == main_alias) && ($(a).attr("data-value") == value)
                });
                $tr = $(f_span).closest(".variation-row").next();
            }
            $tr.get().map(function (a) {
                var first_img = $(a).find(".img-sort-list").find("img").eq(0);
                first_img.attr("src") == "/static/image/add.png" && first_img.closest("div").remove();
            });
            $tr.removeClass("error").find(".img-sort-list").append(pic_str);
        };
        if($(modal_trigger).closest('td').find('.img-pre-box').length > 0){
            $(modal_trigger).closest("td").find('.img-pre-box').each(function (index,item) {
                $(item).find('.del-temp-img').on('click',function () {
                    var cur = $(item).closest("div"),
                        len = $(item).closest("div.row").find("div.img-pre-box").length;
                    if (len === 1) {
                        cur.find("img").attr("src", "/static/image/add.png");
                        $(this).css("display", "none");
                    } else {
                        cur.remove();
                    }
                })
            })
        };
    };
    var sku_img_option = {
        list_style: true,
        local_picture: true,
        network_picture: true,
        hosting_picture: true,
        claim_picture: true,
        button_text: "添加",
        local_picture_config: {
            auto: false,
            fileTypeExts: '*.jpg;*.png;*.gif;*.jpeg',
            multi: true,
            fileObjName: 'Filedata',
            fileSizeLimit: 9999,
            showUploadedPercent: true,
            removeTimeout: 2000,
            buttonText: '本地图片选取', //本地上传按钮上的文字
            formData: {special: 1},
            uploader: header + "/picture/upload/local",
    //          console.log()
            onUploadComplete: function (file, data, modal_trigger) {
                data = eval("(" + data + ")");
                if (data["status"] == 1) {
                    pic_upload_complete(data['pictures'], modal_trigger)
                } else {
                    console.log("本地图片上传失败。")
                }
            },
            onDelete: function (file) {
                console.log('删除的文件：' + file);
                console.log(file);
            },
            onUploadError: function () {
                Inform.enable();
                Inform.show("上传失败，请您稍后再试。");
            }
        },
        network_picture_config: {
            network_pic_nums: 5,
            crawl: false,
            url: header + "/picture/upload/net",
            type: "POST",
            data: {
                special: 1
            },
            dataType: "json",
            ensure_picture_fun: pic_upload_complete
        },
        hosting_picture_config: {
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
            ensure_picture_fun: pic_upload_complete,
            apply_to_fun: function () {
                console.log("a++");
            },
            dataType: "json"
        },
        claim_picture_config: {
            claim_pic_nums: 1,
            ensure_picture_fun: pic_upload_complete
        }
    };
    console.log(Bus.dataTitle);
    Vue.component('check-input', {
        props: ['text', 'tips', 'pattern', 'valueRequired', "value", "id", "propName", "childName", "suggest", "placeholder", "spanishow", "ishow", "totalnum", "upcase", "widthlength", "type", "dataday", 'tit'],
        template: '<div class="form-group" :data-id="id" v-show="ishow">\
            <label class="control-label col-md-2" :class="{\'v-required\': valueRequired}">${ text }</label>\
            <div class="col-md-10" :class="widthlength">\
                <div v-if="suggest" class="input-group">\
                    <input ref="input" v-on:input="check_valid($event.target.value)" :value="value" :id="id" :data-site="siteId" :type="type" class="form-control">\
                    <span class="input-group-btn">\
                        <button type="button" class="btn btn-success" v-on:click="insert_value">${suggest}</button>\
                    </span>\
                </div>\
                <input v-else v-on:input="check_num" ref="input" :id="id" :data-value="value" :type="type" :data-site="siteId" :value="value" :maxlength="totalnum" class="form-control" :placeholder="placeholder" :data-id="id">\
                <div class="title-btns" @click="check_upCase" v-if="upcase">\
                    <a href="javascript: void(0)" id="t-upcase-btn" data-key="upCase" title="首字母大写">\
                        <span class="glyphicon glyphicon-text-size"></span>\
                    </a>\
                </div>\
                <ul v-show="titShow" ref="titL" class="col-md-12" id="data-list-title">\
                    <li v-for="v in tit" :data-value="v">${v}</li>\
                </ul> \
                <span  v-if="spanishow" style="position: absolute;right: 20px;top: 9px;">\
                    <span class="sku-num" ref="skuNum" style="color:red">0</span>/<span class="max-num">${totalnum}</span>\
                </span>\
                <div class="value-tip" v-if="ishow"><p ref="error" class="error-tip"></p><p v-for="tip in tips">${ tip }</p></div>\
            </div>\
        </div>',
        data: function(){
            return {
                ishow: true,
                titShow: false
            }
        },
        mounted: function(){
            var _this = this;
            if(this._props.text === '产品标题') {
                $(this.$refs.input).blur(function () {
                    var newAry = [];
                    $('input[data-id="product-title"]').each(function (index, item) {
                        $(item).val().trim() !== '' && newAry.indexOf($(item).val().trim()) == -1 ? newAry.push($(item).val().trim()) : null;
                    });
                    _this.$props.value = $(this).val();
                    if(newAry.length > 0){
                        Bus.dataTitle = newAry;
                        vueParent.$refs.tit.forEach(function (value) {
                            value.$props.tit = Bus.dataTitle;
                        });
                    }
                });
                $(this.$refs.input).focus(function () {
                    Bus.dataTitle.length > 0 ? $(_this.$refs.titL).show() : $(_this.$refs.titL).hide();
                });
                $(document).on('click',function (e) {
                    var tar = e.target || e.srcElement;
                    if($(tar).attr('data-id') === 'product-title'){
                        return;
                    }else if (tar.tagName.toLowerCase() === 'li') {
                        $(tar).closest('.col-md-10').find('input').val($(tar).text());
                        $(_this.$refs.titL).hide();
                    }else {
                        $(_this.$refs.titL).hide();
                    }
                });
                /*$(this.$refs.input).focus(function () {
                    var newAry = [];
                    $(_this.$refs.titL).empty();
                    $('input[data-id="product-title"]').each(function (index, item) {
                        $(item).val().trim() !== '' && newAry.indexOf($(item).val().trim()) == -1 ? newAry.push($(item).val().trim()) : null;
                    });
                    titAry = newAry;
                    if (titAry.length > 0) {
                        var aLi = '';
                        titAry.forEach(function (value) {
                            aLi += '<li>' + value + '</li>';
                        });
                        $(_this.$refs.titL).css('display', 'block').append(aLi);
                    }
                });
                $(document).on('click',function (e) {
                    var tar = e.target || e.srcElement;
                    if($(tar).attr('data-id') === 'product-title'){
                        return;
                    }
                    if (tar.tagName.toLowerCase() === 'li') {
                        $(tar).closest('.col-md-10').find('input').val($(tar).text());
                        $(_this.$refs.titL).hide();
                    }else {
                        $(_this.$refs.titL).empty().hide();
                    }
                })*/
            }
        },
        methods: {
            check_valid: function(value){
                var format_value = value.trim();
                if(format_value == ""){
                    if(this.valueRequired){
                        this.$refs.input.className += " " + "error";
                        this.$refs.error.innerText ="此项为必填项,不能为空";
                    }
                }else{
                    if(this.pattern){

                    }else{
                        var reg = new RegExp('(\\s|^)error(\\s|$)');
                        this.$refs.input.className = this.$refs.input.className.replace(reg, ' ');
                        this.$refs.error.innerText = "";
                    }
                }
            },
            check_num: function () {
                var inputVal = $(this.$refs.input).val().trim();
                $(this.$refs.skuNum).text(inputVal.length);
                if(this.type === 'Number' && !(/\d+/.test(inputVal))){
                    Inform.show('格式错误，请输入有效数字');
                    $(this.$refs.input).val('');
                }
                if(this.dataday && this.type === 'Number' && /\d+/.test(inputVal)){
                    if(parseInt(inputVal) > parseInt(this.dataday)){
                       $(this.$refs.input).val('30');
                    }
                }
            },
            check_upCase: function () {
                if($(this.$refs.input).val().length > 0){
                    var upCase = $(this.$refs.input).val()[0].toUpperCase();
                    upCase = upCase + $(this.$refs.input).val().slice(1);
                    $(this.$refs.input).val(upCase);
                }
            },
            insert_value: function(){
                $(this).$refs.input.value = this.suggest;
            }
        },
        created: function(){
            var self = this;
            Bus.$on("change", function(){
                if(self.propName){
                    var data = Bus.data[self.propName];
                    self.valueRequired = data["Required"] || data[self.childName]["Required"] || false;
                    if(data[self.childName] === false){
                        self.is_show = false;
                    }
                }
            })
        }
    });
    Vue.component('check-input-one', {
        props: ['text', 'tips', 'pattern', 'valueRequired', "value", "id", "propName", "siteid", "suggest", "placeholder", "spanishow", "ishow", "totalnum","upcase","widthlength","name"],
        template: '<div class="col-md-12" v-show="ishow">\
            <input type="text" v-on:input="check_valid($event.target.value)" :data-site="siteid" ref="input" class="form-control" :data-site="siteId" :maxlength="totalnum" :name="name" value="" :placeholder="placeholder">\
            <span v-show="spanishow" style="position: absolute;right: 20px;top:9px;">\
                <span class="key-num" ref="skuNum" style="color:red">0</span>/<span class="max-num">${totalnum}</span>\
            </span>\
            <div class="value-tip" v-show="ishow"><p ref="error" class="error-tip"></p><p v-for="tip in tips">${ tip }</p></div>\
        </div>',
        data: function(){
            return {
                ishow: true
            }
        },
        methods: {
            check_valid: function(value){
                var format_value = value.trim();
                if(format_value == ""){
                    if(this.valueRequired){
                        this.$refs.input.className += " " + "error";
                        this.$refs.error.innerText ="此项为必填项,不能为空";
                    }
                }else{
                    if(this.pattern){

                    }else{
                        var reg = new RegExp('(\\s|^)error(\\s|$)');
                        this.$refs.input.className = this.$refs.input.className.replace(reg, ' ');
                        this.$refs.error.innerText = "";
                    }
                }
                var inputVal = $(this.$refs.input).val().trim().length;
                $(this.$refs.skuNum).text(inputVal);
            }
        }
    });
    Vue.component('check-textarea', {
        props: {
            text: {
                type: String,
                default: ''
            },
            ishow: {
                type: String,
                default: false
            },
            siteId: {
                type: String,
                default: ''
            },
            valueRequired: {
                type: String,
                default: ''
            },
            value: {
                type: String,
                default: ''
            },
            id: {
                type: String,
                default: ''
            },
            tips: {
                type: String,
                default: ''
            }
        },
        template: '<div class="form-group" v-show="ishow">\
            <label class="control-label col-md-2" :class="{\'v-required\': valueRequired}">${ text }</label>\
            <div class="col-md-10" :data-site="siteId" @click="removeClassError">\
                <script :id="Description" :data-site="siteId" type="text/plain"></script>\
                <div id="detailHtml" style="display:none;" >${value}</div>\
                <div class="value-tip" v-if="tips ? true:false">\
                    <p ref="error" class="error-tip"></p><p v-for="tip in tips">${ tip }</p>\
                </div>\
                <p style="margin: 10px 0;color: #aaa;">\
                    <span class="attention">注意</span>编辑描述请先点击『\
                    <span class="editp" style="" title="HTML代码"></span>』进入编辑状态，再点击『\
                    <span class="editp" style="" title="HTML代码"></span>』是预览效果。默认是展示预览效果。\
                </p>\
            </div>\
        </div>',
        data: function(){
            return {
                Description: 'DescriptionGB'
            }
        },
        mounted:  function(){
           this.Description = "Description"+this.siteId;
        },
        methods: {
            removeClassError: function () {
                if($(this).find('div.value-tip:visible').length){
                    $(this).find('div.value-tip').remove();
                }
            },
            check_valid: function(value){
                var format_value = value.trim(),
                    pattern = "";
                if(format_value == ""){
                    if(this.valueRequired){
                        this.$refs.textarea.className += " " + "error";
                        this.$refs.error.innerText ="此项为必填项,不能为空";
                    }
                }else{
                    if(this.pattern){

                    }else{
                        var reg = new RegExp('(\\s|^)error(\\s|$)');
                        this.$refs.textarea.className = this.$refs.textarea.className.replace(reg, ' ');
                        this.$refs.error.innerText = "";
                    }
                }
            }
        },
        created: function(){
            var self = this;
            Bus.$on("change", function(){
                if(self.propName){
                    var data = Bus.data[self.propName];
                    if (data != null)
                        self.valueRequired = data["Required"] || data[self.childName]["Required"] || false;
                }
            })
        }
    });
    Vue.component('check-select', {
        props: ['text', 'tips', 'pattern', 'valueRequired', "slted", "id", "propName", "childName", "siteId", "widthlength", "name", "isshow"],
        template: '<div class="form-group" v-show="isshow" :data-site="siteId">\
            <label ref="lab" class="control-label col-md-2" :class="{\'v-required\': valueRequired}">${ text }</label>\
            <div class="col-md-10" :class="widthlength">\
            <select class="form-control" :id="id" :data-id="id" :data-site="siteId" ref="slt" v-on:change="check_valid">\
            <option>请选择</option>\
            <option v-for="item in items">${ item }</option>\
            </select>\
            <div v-show="tips? true : false" class="value-tip"><p ref="error" class="error-tip"></p><p v-for="tip in tips">${ tip }</p></div>\
            </div>\
            </div>',
        methods: {
            check_valid: function(e){
                var target = e.target || e.srcElement;
                e.stopPropagation();
                if($(target).hasClass('error')){
                    $(target).removeClass('error');
                };
                if($(target).next('.error-tip').length){
                    $(target).next('.error-tip').remove();
                };
                var format_value = $(target).find('option:selected').val(),
                    pattern = "";
                if(!format_value || format_value == "请选择"){
                    if(this.valueRequired){
                        this.$refs.slt.className += " " + "error";
                        this.$refs.error.innerText ="此项为必选项,请选择一个选项";
                    }
                }else{
                    if(this.pattern){

                    }else{
                        var reg = new RegExp('(\\s|^)error(\\s|$)');
                        this.$refs.slt.className = this.$refs.slt.className.replace(reg, ' ');
                        this.$refs.error.innerText = "";
                    }
                }
            }
        },
        data: function(){
            return {
                items: []
            }
        },
        created: function(){
            var self = this;
            Bus.$on("change", function(){
                if(self.propName){
                    var data = Bus.data[self.propName],
                        site = Bus.data.current_site || "";
                    if(!self.siteId || (site === self.siteId)){
                        self.items = data["Options"] || data[self.childName]["Options"];
                        if(self.childName){
                            self.valueRequired = data[self.childName]["Required"]
                        }else{
                            self.valueRequired = data["Required"]
                        }
                        // self.valueRequired = data["Required"] || data[self.childName]["Required"];
                        Vue.nextTick(function () {
                            // DOM 更新了
                            if($.inArray(self.slted, self.items) != -1){
                                self.$refs.slt.value = self.slted;
                            }
                        });
                    }
                }
            })
        }
    });
    Vue.component('check-radio',{
        props:['text', 'tips', 'pattern', 'valueRequired', "slted", "id", "propName", "childName", "siteId", "name", "isshow"],
        template:'<div class="form-group" v-show="isshow" :data-site="siteId">\
            <label class="control-label col-md-2" :class="{\'v-required\': valueRequired}">${text}</label>\
            <div class="col-md-10">\
                <label class="radio-inline" style="margin-right: 50px">\
                    <input type="radio" :data-site="siteId" :name="siteId" :id="name" value="1">是\
                </label>\
                <label class="radio-inline" style="margin-right: 50px">\
                    <input type="radio" :data-site="siteId" :name="siteId" :id="name" value="0" checked="checked">否\
                </label>\
            </div>\
        </div>',
    });
    Vue.component('first-route-model',{
        props:{
            siteId:  {
                type: String,
                default: ''
            },
            Choice:  {
                type: String,
                default: ''
            },
            dataData: {
                type: Array,
                default: function () {
                    return [];
                }
            },
            firstBtnData: {
                type: Array,
                default: function () {
                    return [];
                }
            }
        },
        template:'<div class="task firstAppend" data-id="firstAppend" :data-site="siteId">\
            <div class="form-group" :data-site="siteId" v-for="item in dataData" :data-name="item.name">\
                <lable class="col-md-2 control-label">\
                    <span class="asterisk" ref="span" :class="{\'v-required\': item.firReq}" style="font-weight: 700;">${item.name}</span>\
                    <span class="col-md-12 text-right" @click="delRoute" v-if="item.firReq == true? false : true"><a href="javascript:0" class="text-danger">-删除属性</a></span>\
                </lable>\
                <first-valueOrChildren v-show="true" :item="item"></first-valueOrChildren>\
            </div>\
        </div>',
        watch: {
            dataData: function (val) {
                //console.log(val);
            }
        }
    });
    Vue.component('first-valueOrChildren', {
        props:{
            item: {
                type: Object,
                default: function () {
                    return {}
                }
            },
            choice:  {
                type: String,
                default: ''
            },
        },
        template: '<div class="col-md-10">\
            <route-value v-if="item.valShow" :item="item"></route-value>\
            <div v-else class="material padding-lr col-md-12" v-else>\
                <div class="secondAppend">\
                    <second-route ref="second" v-for="N2 in item.name2" :N2="N2" :attributes="item.attributes" :parentName="item.name"></second-route>\
                </div>\
                <childBtn v-if="item.secondBtnShow" divClass="secondBtn" aClass="btn-warning" :routeBtnData="item.secondBtnRoute"  v-on:getRoute="getRouteEval"></childBtn>\
            </div>\
        </div>',
        methods: {
            getRouteEval: function (name) {
                var secondEle = {
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
                    displayNameShow: false,
                    valShow: false,
                    valWidth: 'col-md-3',
                    regex: '.*'
                };
                secondEle.name = name;
                var typeB = this.item.attributes[this.item.name]['elements'][name]['type'];
                secondEle.unitB = this.item.attributes[this.item.name]['elements'][name]['unit'];
                secondEle.numB = this.item.attributes[this.item.name]['elements'][name]['maxOccurs'];
                secondEle.secondReq = this.item.attributes[this.item.name]['elements'][name]['required'];
                secondEle.displayName = this.item.attributes[this.item.name]['elements'][name]['display_name'];
                secondEle.threeBtnRoute = (this.item.attributes[this.item.name]['elements'][name]['element'] !== {})? this.item.attributes[this.item.name]['elements'][name]['route'] : [];
                secondEle.secondShow = true;
                if(typeB === "String"){
                    secondEle.valShow = true;
                    secondEle.inpShow = true;
                    if(this.item.attributes[this.item.name]['elements'][name]['values'].length > 0){
                        secondEle.groom = this.item.attributes[this.item.name]['elements'][name]['values'];
                        secondEle.groomShow = true;
                    }
                }else if(typeB === "List"){
                    secondEle.selVal = this.item.attributes[this.item.name]['elements'][name]['values'];
                    secondEle.selShow = true;
                    secondEle.valShow = true;
                }else if(typeB === "Bool"){
                    secondEle.boolShow = true;
                    secondEle.valShow = true;
                };
                if(secondEle.unitB.length > 0){
                    secondEle.secondUnitShow = true;
                };
                if(secondEle.threeBtnRoute !== [] && secondEle.threeBtnRoute !== undefined){
                    secondEle.threeBtnShow = true;
                };
                if(secondEle.displayName.length > 0){
                    secondEle.displayNameShow = true;
                };
                if(this.item.attributes[this.item.name]['elements'][name]['regex'].length > 0){
                    secondEle.regex = true;
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
                this.item.name2.push(secondEle);
            }
        }
    });
    Vue.component('route-value',{
        props:{
            item:  {
                type: Object,
                default: function(){
                    return {}
                }
            }
        },
        template: '<div class="material padding-lr col-md-12">\
            <inp-or-sel-or-bool v-if="true" v-for="i in item.numA" :valWidth="item.valWidth" :valObj="item"></inp-or-sel-or-bool>\
            <unit v-if="item.firstUnitShow" :unitData="item.unitA"></unit>\
            <p v-if="item.displayNameShow" class="col-md-12 row" data-name="values" style="margin: 15px auto 0px -8px; float: left;">\
                <span class="col-md" style="padding: 0px 3px; display: block; float: left;">【友情提示】:</span>\
                <span style="color: #ce841c" href="inp" :data-name="item.displayName">${item.displayName}</span>\
            </p>\
            <p v-if="item.groomShow" class="col-md-12 row" data-name="values" style="margin: 5px auto auto -8px; float: left;">\
                <span class="col-md" style="padding: 6px 10px; display: block; float: left;">推荐值:</span>\
                <a class="groom" style="cursor: pointer;" @click="addValue" v-for="g in item.groom" :data-name="g">${g}</a>\
            </p>\
        </div>',
        methods: {
            addValue: function (e) {
                var target = e.target || e.srcElement;
                e.stopPropagation();
                e.preventDefault();
                document.onselectstart=new Function("return false");
                $(target).closest('.form-group').find('input:text').each(function (i, t) {
                    if($(t).val().trim() == ''){
                         $(t).val($(target).text());
                         return false;
                    }
                });
                if($(target).closest('.form-group').find('input:text').length === 1){
                    $(target).closest('.form-group').find('input:text').val($(target).text());
                }
            }
        }

    });
    Vue.component('inp-or-sel-or-bool',{
        props:{
            valObj: {
                type: Object,
                default: function(){
                    return {}
                }
            },
        },
        template: '<div :class="valObj.valWidth">\
            <inp-value :regex="valObj.regex" v-if="valObj.inpShow"></inp-value>\
            <sel-value v-else-if="valObj.selShow" :selVal="valObj.selVal"></sel-value>\
            <bool-value v-else="valObj.boolShow" stage="route"></bool-value>\
        </div>'
    });
    Vue.component('inp-value',{
        props:{
            regex:{
                type: String,
                default: '.*'
            },
        },
        template: '<input type="text" @blur="check_regex" class="form-control" value="" placeholder="请输入内容">',
        methods: {
            check_regex: function (e) {
                var target = e.target || e.srcElement;
                e.stopPropagation();
                var inpVal = $(target).val().trim();
                console.log(inpVal,(new RegExp(this.regex)));
                if(inpVal.length > 0){
                    if(new RegExp(this.regex).test(inpVal)){}else{
                        Inform.show('输入不合法，请重新输入');
                        return;
                    }
                };
            }
        }
    });
    Vue.component('sel-value',{
        props:{
            selVal: {
                type: Array,
                default: function(){
                    return []
                }
            },
        },
        template: '<select v-on:change="removeClassError" class="form-control choice" data-id="choice-val">\
            <option value="">--</option>\
            <option v-for="ele in selVal" :data-value="ele">${ ele }</option>\
        </select>',
        methods: {
            removeClassError: function (e) {
                var target = e.target || e.srcElement;
                e.stopPropagation();
                if($(target).hasClass('error')){
                    $(target).removeClass('error');
                };
                if($(target).next('.value-tip').length){
                    $(target).next('.value-tip').remove();
                };
            },
        }
    });
    Vue.component('bool-value',{
        props:{
            stage: {
                type: String,
                default: ''
            }
        },
        template: '<div :stage="stage">\
            <label class="radio-inline" style="margin-right: 50px">\
                <input type="radio" name="checkRadio" value="1">是\
            </label>\
            <label class="radio-inline" style="margin-right: 50px">\
                <input type="radio" name="checkRadio" value="0" checked="">否\
            </label>\
        </div>',
    });
    Vue.component('second-route', {
        props:{
            N2:  {
                type: Object,
                default: function(){
                    return {}
                }
            },
            attributes: {
                type: Object,
                default: function(){
                    return {}
                }
            },
            parentName: {
                type: String,
                default: ''
            }
        },
        template: '<div class="form-group" :data-name="N2.name">\
            <lable class="control-label col-md-2">\
                <span class="asterisk" :class="{\'v-required\': N2.secondReq}">${N2.name}</span>\
                <span class="col-md-12 text-right" @click="delRoute" v-if="N2.secondReq == true? false : true"><a href="javascript:0" class="text-danger">-删除属性</a></span>\
            </lable>\
            <div class="material col-md-10">\
                <inp-or-sel-or-bool v-if="N2.valShow" :valWidth="N2.valWidth" v-for="num in N2.numB" :valObj="N2"></inp-or-sel-or-bool>\
                <unit v-if="N2.secondUnitShow" :unitData="N2.unitB"></unit>\
                <p v-if="N2.displayNameShow" class="col-md-12 row" data-name="values" style="margin: 15px auto 0px -8px; float: left;">\
                    <span class="col-md" style="padding: 0px 3px; display: block; float: left;">【友情提示】:</span>\
                    <span style="color: #ce841c" ref="inp" :data-name="N2.displayName">${N2.displayName}</span>\
                </p>\
                <p v-if="N2.groomShow" class="col-md-12 row" data-name="values" style="margin: 5px auto auto -8px; float: left;">\
                    <span class="col-md" style="padding: 6px 10px; display: block; float: left;">推荐值:</span>\
                    <a class="groom" style="cursor: pointer;" v-for="g in N2.groom" :data-name="g"  @click="addValue" >${g}</a>\
                </p>\
                <div class="threeAppend" v-if="N2.valShow == true? false : true">\
                    <three-route v-for="N3 in N2.name3" :N3="N3"></three-route>\
                </div>\
                <childBtn v-if="N2.threeBtnShow" divClass="threeBtn" aClass="btn-success" :routeBtnData="N2.threeBtnRoute" v-on:getRoute="getRouteEval" offsetLeft=""></childBtn>\
            </div>\
        </div>',
        methods: {
            getRouteEval: function (name) {
                var threeEle = {};
                console.log(this.parentName,this.N2.name,name);
                this.N2.name3.push(AmazonRule.thirdGetData(this.attributes,threeEle,this.parentName,this.N2.name,name));
            },
            addValue: function (e) {
                var target = e.target || e.srcElement;
                e.stopPropagation();
                e.preventDefault();
                document.onselectstart=new Function("return false");
                $(target).closest('.form-group').find('input:text').each(function (i, t) {
                    if($(t).val().trim() === ''){
                         $(t).val($(target).text())
                        return false;
                    }
                });
                if($(target).closest('.form-group').find('input:text').length === 1){
                    $(target).closest('.form-group').find('input:text').val($(target).text());
                }
            }
        },
    });
    Vue.component('three-route',{
        props:{
            N3:  {
                type: Object,
                default: function(){
                    return {};
                }
            }
        },
        template: '<div class="form-group" :data-name="N3.name">\
            <div class="col-md-12 material padding-1r">\
                <lable class="col-md-2 text-right rBor">\
                    <span class="asterisk" :class="{\'v-required\': N3.threeReq}">${N3.name}</span>\
                    <span class="col-md-12 text-right" @click="delRoute" v-if="this.N3.threeReq == true? false : true"><a href="javascript:0" class="text-danger">-删除属性</a></span>\
                </lable>\
                <div class="col-md-10">\
                    <inp-or-sel-or-bool v-for="n in N3.numC" v-if="true" :valWidth="N3.valWidth" :valObj="N3"></inp-or-sel-or-bool>\
                    <unit v-show="N3.threeUnitShow" :unitData="N3.unitC"></unit>\
                    <p v-if="N3.displayNameShow" class="col-md-12 row" data-name="values" style="margin: 15px auto 0px -8px; float: left;">\
                        <span class="col-md" style="padding: 0px 3px; display: block; float: left;">【友情提示】:</span>\
                        <span style="color: #ce841c;" ref="inp" :data-name="N3.displayName">${N3.displayName}</span>\
                    </p>\
                    <p v-if="N3.groomShow" class="col-md-12 row" data-name="values" style="margin: 5px auto auto -8px; float: left;">\
                        <span class="col-md" style="padding: 6px 10px; display: block; float: left;">推荐值:</span>\
                        <a class="groom" v-for="g in N3.groom" style="cursor: pointer;" @click="addValue" :data-name="g">${g}</a>\
                    </p>\
                </div>\
            </div>\
        </div>',
        methods: {
            addValue: function (e) {
                var target = e.target || e.srcElement;
                e.stopPropagation();
                e.preventDefault();
                document.onselectstart=new Function("return false");
                $(target).closest('.form-group').find('input:text').each(function (i, t) {
                    if($(t).val().trim() == ''){
                         $(t).val($(target).text());
                         return false;
                    }
                });
                if($(target).closest('.form-group').find('input:text').length === 1){
                    $(target).closest('.form-group').find('input:text').val($(target).text());
                }
            }
        }
    })
    Vue.component('unit',{
        props:{
            unitData:  {
                type: Array,
                default: function(){
                    return []
                }
            }
        },
        template: '<div class="col-md-2">\
            <select class="form-control" data-name="unit">\
                <option value="">--</option>\
                <option v-for="e in unitData" :value="e" :data-value="e">${ e }</option>\
            </select>\
        </div>',
    });
    Vue.component('childBtn',{
        props:{
            research: {
                type: Boolean,
                default: false
            },
            divClass: {
                type: String,
                default: '',
            },
            aClass: {
                type: String,
                default: ''
            },
            routeBtnData:  {
                type: Array,
                default: function(){
                    return []
                }
            },
            getRoute: {
                type: String,
                default: ''
            },
            offsetLeft: {
                type: String,
                default: 'col-md-offset-2'
            }
        },
        template: '<div class="form-group top5 upp-local-picture" :class="divClass">\
            <a href="javascript:0" class="btn show btn-xs dropdown-toggle" :class="[aClass,offsetLeft]" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">+添加属性</a>\
            <div class="dropdown-menu col-md-8 padding15  table-bordered route_hidden col-md-offset-2">\
                <input v-show="research" type="text" class="form-control" placeholder="search" aria-describedby="basic-addon2">\
                <span v-show="research" class="input-group-addon" id="basic-addon2">\
                    <span class="glyphicon glyphicon-remove" style="color: #fff;" aria-hidden="true"></span>\
                </span>\
                <a href="javascript:" v-for="e in routeBtnData" ref="a" @click="secondBtnClick" class="page-header sr-only-focusable  pull-left" :title="e">${e}</a>\
            </div>\
        </div>',
        methods: {
            secondBtnClick: function(event) {
                var target = event.target || event.srcElement;
                if($(target).closest('.form-group.top5').prev('div').find('.form-group[data-name="'+target.title+'"]').length){
                    return Inform.show('该属性已存在，请选择其他属性');
                };
                this.$emit('getRoute', target.title);
            }
        }
    });
    Vue.component('sku-item-prop-tab',{
        props:{
            siteId: {
                type: String,
                default: ''
            },
            priceUnite: {
                type: String,
                default: ''
            },
            skudata: {
                type: Array,
                default: function(){
                    return []
                }
            },
            data:  {
                type: Array,
                default: function(){
                    return []
                }
            },
            stockData:  {
                type: Array,
                default: function(){
                    return []
                }
            },
        },
        template: '<div class="panel-body" :data-site="siteId">\
            <sku-item-prop v-on:checkSelected="getInpVal" :siteid="siteId" :skudata="skudata" :data="data" :defaultshow="defaultshow"></sku-item-prop>\
            <sku-item-tab :siteId="siteId" :price-unite="priceUnite" v-if="tab"  :variation="variation" :num="num"></sku-item-tab>\
        </div>',
        data: function () {
            return {
                tab: false,
                num: 11,
                defaultshow: [],
                variation: {
                    name: [],
                    value: [],
                }
            }
        },
        watch: {
            skudata: function () {
                var _this = this;
                var ar = [];
                var ele = {};
                this.defaultshow = [];
                if(this.data && this.skudata.length > 0 && this.skudata[0] !== ''){
                    this.checkSalHide();
                    this.skudata.forEach(function (item) {
                        if(!item){return};
                        ele = {
                            name: '',
                            value: [],
                            newVal: '',
                            defaultBool: false,
                            unit: [],
                            unitShow: false
                        };
                        var itemVal = _this.data['attributes']['elements'][item];
                        ele.name = item;
                        if(itemVal.values.length){
                            ele.defaultBool = true;
                            ele.value = itemVal.values;
                        }
                        if(itemVal.unit.length){
                            ele.unit = itemVal.unit;
                            ele.unitShow = true;
                        }
                        ar.push(ele);
                    })
                }else {
                    this.checkSalShow();
                }
                this.defaultshow = ar;
                this.tab = false;
            }
        },
        methods: {
            getInpVal: function (val) {
                if(val.mark){
                    var _this = this;
                    var ary = this.defaultshow;
                    if(ary.length){
                        ary.forEach(function (ite) {
                            ite.newVal = '';
                            if(ite.name === val.name){
                                ite.defaultBool = true;
                                if(ite.value.indexOf(val.value) === -1){
                                    ite.value.push(val.value);
                                    ite.newVal = val.value;
                                }else{
                                    Inform.show('此属性已存在');
                                    return false;
                                }
                            }
                        })
                    }
                    this.defaultshow = ary;
                    return this.defaultshow;
                };
                this.num = 11 + this.variation.name.length;
                var variations = {
                    name: [],
                    value: []
                };
                var _this = this;
                if(val.length === 1){
                    this.tab = true;
                    this.checkSalHide();
                    if(variations.name.indexOf(val[0].name)){
                        variations.name.push(val[0].name)
                    };
                    val[0].value.forEach(function (it) {
                        variations.value.push([it]);
                        variations.value.push([it]);
                    });
                }else if(val.length > 1){
                    this.tab = true;
                    this.checkSalHide();
                    if(val.length === 2){
                        if(variations.name.indexOf(val[0].name) && variations.name.indexOf(val[1].name)){
                            variations.name.push(val[0].name);
                            variations.name.push(val[1].name)
                        };
                        val[0].value.forEach(function (it) {
                            val[1].value.forEach(function (ite) {
                                variations.value.push([it,ite]);
                                variations.value.push([it,ite]);
                            })
                        });
                    }else if(val.length === 3){
                        if(variations.name.indexOf(val[0].name) && variations.name.indexOf(val[1].name) && variations.name.indexOf(val[2].name)){
                            variations.name.push(val[0].name);
                            variations.name.push(val[1].name);
                            variations.name.push(val[2].name);
                        };
                        val[0].value.forEach(function (it) {
                            val[1].value.forEach(function (ite) {
                                val[2].value.forEach(function (itd) {
                                    variations.value.push([it,ite,itd]);
                                    variations.value.push([it,ite,itd]);
                                    console.log(variations);
                                })
                            })
                        });
                    }
                }else{
                    this.tab = false;
                }
                this.variation = variations;
            },
            checkSalHide: function () {
                var _this = this;
                if($('.form-group[data-id="UPC"]').length){
                    $('.form-group[data-id="UPC"]').each(function (index,item) {
                        if($(item).attr('site-id') == _this.siteId){
                            $(item).hide();
                        }
                    });
                }
                if($('.form-group[data-id="price"]').length){
                    $('.form-group[data-id="price"]').each(function (index,item) {
                        if($(item).attr('data-site') == _this.siteId){
                            $(item).hide();
                        }
                    });
                }
                if($('.form-group[data-id="setSal"]').length){
                    $('.form-group[data-id="setSal"]').each(function (index,item) {
                        if($(item).attr('data-site') == _this.siteId){
                            $(item).hide();
                        }
                    });
                }
                if($('.form-group[data-id="stock"]').length){
                    $('.form-group[data-id="stock"]').each(function (index,item) {
                        if($(item).attr('data-site') == _this.siteId){
                            $(item).hide();
                        }
                    });
                }
            },
            checkSalShow: function () {
                var _this = this;
                if($('.form-group[data-id="UPC"]').length){
                    $('.form-group[data-id="UPC"]').each(function (index,item) {
                        if($(item).attr('site-id') == _this.siteId){
                            $(item).show();
                        }
                    });
                }
                if($('.form-group[data-id="price"]').length){
                    $('.form-group[data-id="price"]').each(function (index,item) {
                        if($(item).attr('data-site') == _this.siteId){
                            $(item).show();
                        }
                    });
                };
                if($('.form-group[data-id="setSal"]').length){
                    $('.form-group[data-id="setSal"]').each(function (index,item) {
                        if($(item).attr('data-site') == _this.siteId){
                            $(item).show();
                        }
                    });
                };
                if($('.form-group[data-id="stock"]').length){
                    $('.form-group[data-id="stock"]').each(function (index,item) {
                        if($(item).attr('data-site') == _this.siteId){
                            $(item).show();
                        }
                    });
                }
            }
        }
    });
    Vue.component('sku-item-prop',{
        props:{
            siteid: {
                type: String,
                default: ''
            },
            defaultshow:  {
                type: Array,
                default: function(){
                    return []
                }
            },
            skudata: {
                type: Array,
                default: function(){
                    return []
                }
            },
            data:  {
                type: Array,
                default: function(){
                    return []
                }
            },
        },
        template: '<div class="sku-prop" :data-site="siteid">\
            <div class="form-group" v-for="item in defaultshow" :data-name="item.name" data-select="single" data-type="CheckBox" data-need="true">\
                <label class="col-md-2 control-label v-required" :data-name="item.name">${item.name}</label>\
                <div class="col-md-10 form-inline checkInp">\
                    <div class="row" style="padding-left: 15px;">\
                        <div class="checkbox" style="width: 210px" v-if="item.defaultBool" v-for="e in item.value">\
                            <label @click="checkInput" :data-name="item.name"><input type="checkbox" class="kcb" :name="e" :data-name="item.name" :data-value="e">${e}</label>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-md-10 col-md-offset-2 form-inline">\
                    <input type="text" ref="input" class="form-control col-md-4" style="margin-right:8px" placeholder="输入自定义属性">\
                    <select ref="select" v-if="item.unitShow" @click="checkSelVal" class="form-control col-md-2" style="margin-right: 8px;">\
                        <option>--</option>\
                        <option v-for="u in item.unit">${u}</option>\
                    </select>\
                    <button type="button" @click="addSku" class="btn btn-primary" name="addSpec">添加自定义属性</button>\
                </div>\
            </div>\
        </div>',
        data: function () {
            return {
                oldTmp: [],
                oldCheckboxVal: []
            }
        },
        watch: {
            skudata: function () {
                var _this = this;
                this.skudata.forEach(function (t) {
                    if($('div[data-id="firstAppend"][data-site="'+_this.siteid+'"]').find('.form-group[data-name="'+t+'"]').length){
                        $('div[data-id="firstAppend"][data-site="'+_this.siteid+'"]').find('.form-group[data-name="'+t+'"]').hide();
                    }else if(/(\w+)_V/.test(t)){
                        var reg = /(\w+)_V/.exec(t);
                        $('div[data-id="firstAppend"][data-site="'+_this.siteid+'"]').find('.form-group[data-name="'+reg[1]+'"]').hide();
                    };
                });
                if(this.oldTmp.length > 0 && this.oldTmp !== this.skudata){
                    this.oldTmp.forEach(function (item) {
                        _this.skudata.forEach(function (t) {
                            if(item !== t){
                                $('div[data-id="firstAppend"][data-site="'+_this.siteid+'"]').find('.form-group[data-name="' + item + '"]').show();
                                if(/(\w+)_V/.test(item)){
                                    var reg = /(\w+)_V/.exec(item);
                                    $('div[data-id="firstAppend"][data-site="'+_this.siteid+'"]').find('.form-group[data-name="'+reg[1]+'"]').show();
                                }
                            }
                        })
                    })
                };
                this.oldTmp = this.skudata;
                if($('.sku-prop').find('.checkbox').length){
                    $('.sku-prop').find('.checkbox').each(function (i,item) {
                        $(item).find('input').prop('checked',false);
                    });
                };
                if(this.oldCheckboxVal.length > 0){
                    var _this = this;
                    this.oldCheckboxVal.forEach(function (item,index) {
                        if($('.sku-prop').find(':checkbox[data-value="'+item+'"]').length){
                            $('.sku-prop').find(':checkbox[data-value="'+item+'"]').closest('div.checkbox').eq(0).remove();
                            _this.oldCheckboxVal.splice(index,1);
                        }
                    });
                }

            }
        },
        methods: {
            checkSelVal: function (event) {
                var target = event.target || event.srcElement;
                event.stopPropagation();
                $($(target)).removeClass('error');
            },
            addSku: function (event) {
                var target = event.target || event.srcElement;
                event.stopPropagation();
                var v = '',
                    n = $(target).closest('div[data-select="single"]').attr('data-name');
                if($(target).closest('.col-md-offset-2.form-inline').prev('.form-inline.checkInp').find('p.error-tip').length){
                    $(target).closest('.col-md-offset-2.form-inline').prev('.form-inline.checkInp').removeClass('error');
                    $(target).closest('.col-md-offset-2.form-inline').prev('.form-inline.checkInp').find('p.error-tip').remove();
                };
                if($(target).prev('select').length){
                    $(target).prev('select').removeClass('error');
                    if($(target).prev('select').prev('input').val().trim() == ''){
                        $(target).prev('select').prev('input').addClass('error');
                        return false;
                    }
                    if($(target).prev('select').find('option:selected').val() === '--'){
                        $(target).prev('select').addClass('error');
                        return false;
                    }
                    v = $(target).prev('select').prev('input').val().trim()+"("+$(target).prev('select').find('option:selected').val()+")";
                    $(target).prev('select').prev('input').val('');
                    $(target).prev('select').find('option').eq(0).prop('selected',true);
                }else{
                    if($(target).prev('input').val().trim() == ''){
                        $(target).prev('input').addClass('error');
                        return false;
                    }
                    v = $(target).prev('input').val().trim();
                    $(target).prev('input').val('')
                }
                this.oldCheckboxVal.push(v);
                var check_inp = '<div class="checkbox" style="width: 210px">\
                    <label @click="" data-name="'+n+'">\
                    <input type="checkbox" class="kcb" name="e" data-name="'+n+'" data-value="'+v+'">'+v+'</label>\
                </div>';
                if(!$(target).closest('.sku-prop').children('div[data-name="'+n+'"]').find('input[data-value="'+v+'"]').length){
                    $(target).closest('.sku-prop').children('div[data-name="'+n+'"]').find('div.checkInp').append(check_inp);
                    $(target).closest('.sku-prop').children('div[data-name="'+n+'"]').find('input[data-value="'+v+'"]').prop('checked',true);
                    $(target).closest('.sku-prop').children('div[data-name="'+n+'"]').find('input[data-value="'+v+'"]').closest('label').on('click',this.checkInput);
                }else {
                    Inform.show('此属性已存在');
                }
                this.checkInput(event);
                /*var addVal = {
                    name: '',
                    value: '',
                    mark: 'addSku'
                };
                if($(target).closest('.col-md-offset-2.form-inline').prev('.form-inline.checkInp').find('p.error-tip').length){
                    $(target).closest('.col-md-offset-2.form-inline').prev('.form-inline.checkInp').removeClass('error');
                    $(target).closest('.col-md-offset-2.form-inline').prev('.form-inline.checkInp').find('p.error-tip').remove();
                };
                addVal.name = $(target).closest('div[data-select="single"]').attr('data-name');
                if($(target).prev('select').length){
                    $(target).prev('select').removeClass('error');
                    if($(target).prev('select').prev('input').val().trim() == ''){
                        $(target).prev('select').prev('input').addClass('error');
                        return false;
                    }
                    if($(target).prev('select').find('option:selected').val() === '--'){
                        $(target).prev('select').addClass('error');
                        return false;
                    }
                    addVal.value = $(target).prev('select').prev('input').val().trim()+"("+$(target).prev('select').find('option:selected').val()+")";
                    $(target).prev('select').prev('input').val('');
                    $(target).prev('select').find('option').eq(0).prop('selected',true);
                }else{
                    if($(target).prev('input').val().trim() == ''){
                        $(target).prev('input').addClass('error');
                        return false;
                    }
                    addVal.value = $(target).prev('input').val().trim();
                    $(target).prev('input').val('')
                }
                console.log(addVal);
                this.oldCheckboxVal.push(addVal.value);
                this.$emit('checkSelected',addVal);
                */
            },
            checkInput: function (event) {
                var target = event.target || event.srcElement;
                event.stopPropagation();
                var skuProp = $(target).closest('div.sku-prop');
                var _this = this;
                var ary = [];
                if($(target).closest('.form-inline.checkInp').find('p.error-tip').length){
                    $(target).closest('.form-inline.checkInp').removeClass('error');
                    $(target).closest('.form-inline.checkInp').find('p.error-tip').remove();
                };
                skuProp.find('div[data-select="single"]').each(function (i, item) {
                    if($(item).find(':checkbox:checked').length){
                        ary.push({
                            name: $(item).attr('data-name'),
                            value: $(item).find(':checkbox:checked').get().map(function (a) {
                                return $(a).attr('data-value');
                            })
                        });
                    }
                    return ary;
                });
                _this.$emit('checkSelected',ary);
            }
        }
    });
    Vue.component('sku-item-tab',{
        props:{
            siteId: {
                type: String,
                default: ''
            },
            priceUnite: {
                type: String,
                default: ''
            },
            num: {
              type: Number,
              default: 11
            },
            variation: {
                type: Object,
                default: function(){
                    return {}
                }
            }
        },
        template:'<div id="sku-variation" :data-site="siteId" :data-length="variation.value.length">\
            <div class="form-group">\
                <div class="col-md-12">\
                    <div class="form-inline">\
                        <span style="margin:8px 8px 8px 0">批量设置促销信息:</span>\
                        <a class="btn btn-success" href="#" @click="showSalMode" data-toggle="modal" data-target="#bulk-set-sale">一键设置</a>\
                        <div class="modal fade in" v-if="setDateSal" id="bulk-set-sale" tabindex="-1" role="dialog" aria-labelledby="groupLabel" aria-hidden="false" style="display: block; padding-right: 17px; background-color: rgba(0, 0, 0, 0.4);">\
                            <div class="modal-dialog" style="width: 800px">\
                                <div class="modal-content">\
                                    <div class="modal-header">\
                                        <button @click="hideSalMode" type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>\
                                        <h3 class="modal-title">设置促销信息</h3>\
                                    </div>\
                                    <div class="modal-body">\
                                        <form class="form-horizontal">\
                                            <div class="form-group">\
                                                <label class="col-md-2 control-label">促销设置:</label>\
                                                    <div class="col-md-10">\
                                                        <div class="material">\
                                                            <table style="margin-bottom: -10px">\
                                                                <tbody>\
                                                                     <tr>\
                                                                         <td style="width:120px">促销价格</td>\
                                                                         <td style="padding: 4px">\
                                                                                <input type="text" @blur="check_Number" class="form-control" id="bulk-sale-price" value="" placeholder="促销价格">\
                                                                        </td>\
                                                                     </tr>\
                                                                     <tr>\
                                                                         <td style="width:120px">促销开始时间</td>\
                                                                         <td style="padding: 4px;position: relative">\
                                                                            <input type="text" @click="setSalTime" class="form-control date-choose" id="bulk-sale-from" value="" placeholder="促销开始时间">\
                                                                         </td>\
                                                                         <td style="width:120px; padding-left: 15px">促销结束时间</td>\
                                                                         <td style="padding: 4px;position: relative">\
                                                                            <input type="text" @click="setSalTime" class="form-control date-choose" id="bulk-sale-to" value="" placeholder="促销结束时间">\
                                                                         </td>\
                                                                     </tr>\
                                                                </tbody>\
                                                            </table>\
                                                         </div>\
                                                    </div>\
                                                </lable>\
                                            </div>\
                                        </form>\
                                    </div>\
                                    <div class="modal-footer">\
                                        <button type="button" class="btn btn-default" @click="hideSalMode" data-dismiss="modal">关闭</button>\
                                        <button type="button" class="btn btn-primary" @click="batch_set_sale" data-loading-text="处理中...">提交</button>\
                                    </div>\
                                </div>\
                            </div>\
                        </div>\
                        <span style="margin:8px">批量设置产品编码(只适用于品牌入驻卖家将产品编码与SKU设置一致):</span>\
                        <a @click="bulkSpecialupc" class="btn btn-info bulk-special-upc" href="javascript:void(0)">一键设置</a>\
                    </div>\
                </div>\
                <div class="col-md-12">\
                    <table class="table table-striped table-bordered">\
                        <thead>\
                            <tr class="variation-row">\
                                <td style="width: 100px">启用</td>\
                                <td class="variation-name" v-for="name in variation.name" style="width: 150px" :data-name="name">${name}</td>\
                                <td class="variation-th">\
                                    价格(${priceUnite})\
                                    <a type="button" @click="render_batch_pop_price" :data-site="siteId" class="one-btn-price" href="javascript:void(0)">(批量设置)</a>\
                                    <upop-model v-on:clickSet="hideUpModel" dataName="price" dataClass=".v-price" v-if="priceShow"></upop-model>\
                                </td>\
                                <td class="variation-th">促销价格(${priceUnite})</td>\
                                <td>促销开始日期</td>\
                                <td>促销结束日期</td>\
                                <td class="variation-th">库存(件/个)<a type="button" @click="render_batch_pop_stock" :data-site="siteId" class="one-btn-stock" href="javascript:void(0)">(批量设置)</a>\
                                    <upop-model v-on:clickSet="hideUpModel" dataName="stock" dataClass=".v-stock" v-if="stock"></upop-model>\
                                </td>\
                                <td style="width: 150px">产品编码(UPC/EAN)<a @click="render_batch_pop_upcs" class="onekey-upcs" href="javascript:void(0)">(批量设置)</a>\
                                    <set-sku-ean :upcNum="upcNum" v-on:clickSetUpc="hide_show_upc_model" v-if="upcs"></set-sku-ean>\
                                </td>\
                                <td style="width: 200px">\
                                    SKU编码\
                                    <a class="one-btn-sku" @click="getParentSKU" id="onekey-SKU" href="javascript:void(0)">(一键生成SKU)</a>/ \
                                    <a class="one-sku-set" @click="one_setting_sku" id="one-sku-set" href="javascript:void(0)">设置</a>\
                                    <sku-set-modal v-if="skuShowHide" v-on:clickSkuModel="watchclickSku" :setSkuData="setSkuData" :names="names" :setSkuP="setSkuP" :mid="mid" :aliasNext="aliasNext" :aliasPrev="aliasPrev"></sku-set-modal>\
                                </td>\
                                <td>标题和关键词和BulletPoint<a id="onekey-info" @click="batch_sku_info" href="javascript:void(0)">(与父商品一致)</a></td>\
                            </tr>\
                        </thead>\
                        <tbody>\
                            <tbody-content-model v-for="(v,i) in variation.value" :index="i" :value="v" :num="num" :name="variation.name"></tbody-content-model>\
                        </tbody>\
                    </table>\
                </div>\
            </div>\
        </div>',
        data: function () {
            return {
                priceShow: false,
                stock: false,
                setDateSal: false,
                skuTitlKey: false,
                upcNum: null,
                upcs: false,
                skuShowHide: false,
                setSkuP: '',
                mid: '',
                aliasNext: '',
                aliasPrev: '',
                names: [],
                setSkuData:　[]
            }
        },
        mounted: function () {
            $('#sku-variation').find(".date-choose").each(function(i,item){
                $(item).datetimepicker({format: 'YYYY-MM-DD'});
            });
            /*$('html,body').off().on('click',function (e) {
                var target = e.target || e.srcElement;
                e.stopPropagation();
                if(!$(target).hasClass('batch-set-pop') && !$(target).hasClass('batch-set-title') && !$(target).hasClass('batch-set-content') && !$(target).hasClass('batch-set-ipt')){
                    this.priceShow = false;
                    this.stock = false;
                }
            });*/
        },
        methods: {
            watchclickSku: function (val) {
                this.skuShowHide = val;
                return;
            },
            check_Number: function (e) {
                var target = e.target || e.srcElement;
                e.stopPropagation();
                var inpVal = $(target).val().trim();
                if(/\d+/.test(inpVal)){}else{
                    if(inpVal.length > 0){
                        Inform.show('输入的不是有效数字');
                        return;
                    }
                };
            },
            one_setting_sku: function (e) {
                var target = e.target || e.srcElement;
                e.stopPropagation();
                var block_list = $(target).closest('#sku-variation').prev(".sku-prop").find(".form-group"),
                    storage = window.localStorage, name_list = [];
                this.setSkuData = [];
                if(storage&&(storage["alias-mid"] != undefined)) this.mid = storage["alias-mid"]; else this.mid = "-";
                for(var i=0; i< block_list.length; i++){
                    var $block = block_list.eq(i),
                        $name = $block.attr("data-name"),
                        v_content = $block.find(".col-md-10.checkInp"),
                        $values = [];
                    $values = v_content.find(":checkbox:checked").length? v_content.find(":checkbox:checked").get().map(function(a){ return $(a).attr("data-value");}) : [];
                    var newArr = [];
                    newArr = split_array($values,3);
                    function split_array(arr, len){
                        var a_len = arr.length;
                        var result = [];
                        for(var i=0;i<a_len;i+=len){
                            result.push(arr.slice(i,i+len));
                        }
                        return result;
                    }
                    if(newArr.length) {
                        this.setSkuData.push({
                            name: $name,
                            value: newArr
                        });
                        name_list.push($name);
                    }
                    console.log(JSON.stringify(this.setSkuData));
                };
                this.aliasNext = storage&&storage["alias-next"] || "";
                this.aliasPrev = storage&&storage["alias-prev"] || "";
                this.set_sku_add_name(name_list, storage);
                this.setSkuP = $(target).closest('.site-info-area').find("#ParentSKU").val().trim();
                this.skuShowHide = true;
            },
            set_sku_add_name: function(names, storage){
                if(storage && storage["alias-order-list"]){
                    var order_list = storage["alias-order-list"].split(",");
                    names.sort(function(a, b){
                        var _a = order_list.indexOf(a),
                            _b = order_list.indexOf(b);
                        _a = _a===-1? 100: _a;
                        _b = _b===-1? 100: _b;
                        return _a - _b
                    });
                }
                this.names = names;
            },
            hide_show_upc_model: function (val) {
                this.upcs = val;
                return;

            },
            setTdInp_upcs: function (e) {
                var target = e.target || e.srcElement;
                e.stopPropagation();
                var priceVal = $(target).prev('input').val();
            },
            hideUpModel: function (val) {
                if(val.name === "stock"){
                    this.stock = val.value;
                    return;
                };
                if(val.name === "price"){
                    this.priceShow = val.value;
                    return;
                }
            },
            render_batch_pop_price: function(e){
                this.priceShow = true;
                var target = e.target || e.srcElement;
                $(target).closest('td').css({"position": "relative"});
            },
            render_batch_pop_stock: function(e){
                this.stock = true;
                var target = e.target || e.srcElement;
                e.stopPropagation();
                $(target).closest('td.variation-th').css({"position": "relative"});
            }
            ,render_batch_pop_upcs: function(e){
                this.upcs = true;
                var target = e.target || e.srcElement;
                this.upcNum = $(target).closest('.table').find('input.v-upc').length;
            },
            setTdInp_price: function (e) {
                var target = e.target || e.srcElement;
                e.stopPropagation();
                var inpVal = $(target).prev('input').val().trim(),
                    sku_table_tr = $(target).closest(".table").find("tr");
                sku_table_tr.each(function (i, v) {
                    $(v).find(".v-price").val(inpVal);
                });
                this.priceShow = false;
                return;
            },
            hideSalMode: function (e) {
                var target = e.target || e.srcElement;
                e.stopPropagation();
                this.setDateSal = false;
                $("#bulk-set-sale").modal("hide");
                $(target).closest('.modal-content').find('#bulk-sale-price').val('');
                $(target).closest('.modal-content').find('#bulk-sale-from').val('');
                $(target).closest('.modal-content').find('#bulk-sale-to').val('');
            },
            showSalMode: function (e) {
                this.setDateSal = true;
            },
            setSalTime: function (e) {
                var target = e.target || e.srcElement;
                $(target).closest('.form-inline').find(".date-choose").each(function(i,item){
                    $(item).datetimepicker({format: 'YYYY-MM-DD'});
                });
            },
            batch_set_sale: function (e) {
                var target = e.target || e.srcElement;
                e.stopPropagation();
                var flag = true;
                var sale_price = $(target).closest('.modal-content').find("#bulk-sale-price");
                var sale_begin = $(target).closest('.modal-content').find("#bulk-sale-from");
                var sale_end =  $(target).closest('.modal-content').find("#bulk-sale-to"),
                    sku_table_tr = $(target).closest('#sku-variation').find(".table").find("tr");
                if (!((/^([\d\.])+$/g).test(sale_price.val().trim()) && parseFloat(sale_price.val().trim()) > 0)) {
                    flag = false;
                    Inform.show("价格不合法!")
                    return;
                }
                else if (sale_price.val() && !sale_begin.val() || !sale_end.val()) {
                    flag = false;
                    Inform.show("请将促销信息中的起止日期填写完整!")
                }
                if (!flag) {
                    return 0
                } else {
                    sku_table_tr.find(".v-sale-price").each(function (k, v) {
                        $(v).val(sale_price.val().trim());
                    });
                    sku_table_tr.find(".v-time-s").each(function (k, v) {
                        $(v).val(sale_begin.val().trim());
                    });
                    sku_table_tr.find(".v-time-e").each(function (k, v) {
                        $(v).val(sale_end.val().trim());
                    });
                    $("#bulk-set-sale").modal("hide");
                    $(target).closest('.modal-content').find('#bulk-sale-price').val('');
                    $(target).closest('.modal-content').find('#bulk-sale-from').val('');
                    $(target).closest('.modal-content').find('#bulk-sale-to').val('');
                }
                this.setDateSal = false;
                $("#bulk-set-sale").modal("hide");
            },
            batch_sku_info: function (e) {
                var target = e.target || e.srcElement;
                e.stopPropagation();
                var title = $(target).closest('.site-info-area').find("#product-title").val().trim(),
                    sku_table_tr = $(target).closest('.site-info-area').find(".table").find("tr"),
                    keywords_list = [],
                    BulletPoint_list = [],
                    keywords = $(target).closest('.site-info-area').find("input[name='keyword']"),
                    BulletPoint = $(target).closest('.site-info-area').find('input[name="bullet_point"]');
                for (var i = 0; i < keywords.length; i++) {
                    if(!$(keywords[i]).val()){
                        $(keywords[i]).css('border','solid 1px red');
                        return $('html,body').animate({'scrollTop': $('html,body').scrollTop() > $(keywords[i]).offset().top ? ($(keywords[i]).offset().top-300+'px') : $('html,body').scrollTop()},300);
                    }else {
                        keywords_list.push($(keywords[i]).val());
                    }
                };
                for (var j = 0; j < BulletPoint.length; j++) {
                    BulletPoint_list.push($(BulletPoint[j]).val());
                    if($(BulletPoint[j]).val()){
                        $(BulletPoint[j]).attr('data-value','true');
                    }else{
                        $(BulletPoint[j]).removeAttr('data-value','true');
                    }
                };
                if(!$('input[data-value="true"]').length){
                    BulletPoint.eq(0).css('border','solid 1px red');
                    return $('html,body').animate({'scrollTop':BulletPoint.eq(0).offset().top-300+'px'},300);
                };
                if(title === ''){
                    $("#product-title").css('border','solid 1px red');
                    return $('html,body').animate({'scrollTop':$("#product-title").offset().top-300+'px'},300);
                };
                var info = {"Title": title, "KeyWords": keywords_list,"BulletPoint": BulletPoint_list};
                sku_table_tr.each(function (i, v) {
                    $(v).find(".v-title-keys").val(JSON.stringify(info));
                })
            },
            bulkSpecialupc: function (e) {
                this.getUpcSku(e,".v-upc");
            },
            getParentSKU: function (e) {
                this.getUpcSku(e,".v-sku");
            },
            getUpcSku: function (e,classVal) {
                var target = e.target || e.srcElement;
                e.stopPropagation();
                var title = $(target).closest('.site-info-area').find("#ParentSKU").val().trim(),
                    sku_table_tr_td = $(target).closest('.site-info-area').find(".table").find("tr").find(classVal);
                var v = [];
                var ar = [];
                var tab_tr = $(target).closest('.site-info-area').find(".table").find("tr");
                tab_tr.each(function (ind, ite) {
                    var trAry = [];
                    if(ite !== tab_tr[0]){
                        $(ite).find('.variation-attr').each(function (i, t) {
                            trAry.push($(t).attr('data-value'));
                            ar.push(trAry);
                        })
                    }
                });
                //v.push($(target).closest('.site-info-area').find(".table").find("tr").find('.variation-attr').attr('data-value'));
                if(title === ''){
                    $(target).closest('.site-info-area').find("#ParentSKU").addClass('error');
                    return $('html,body').animate({'scrollTop':$(target).closest('.site-info-area').find("#ParentSKU").offset().top-300+'px'},300);
                }
                var setSku = '';
                ar.forEach(function (item) {
                    if (item.length === 1){
                        setSku = title +'-'+ item[0];
                    };
                    if (item.length === 2){
                        setSku = title +'-'+ item[0] +'-'+ item[1];
                    };
                    if (item.length === 3){
                        setSku = title +'-'+ item[0] +'-'+ item[1] +'-'+ item[2];
                    };
                    if (item.length === 4){
                        setSku = title +'-'+ item[0] +'-'+ item[1] +'-'+ item[2] +'-'+ item[3];
                    }
                    v.push(setSku);
                });
                sku_table_tr_td.each(function (i, t) {
                    $(t).val(v[i]);
                });
            }
        }
    });
    Vue.component('tbody-content-model',{
        props:{
            index: {
                type: Number,
                default: null
            },
            num: {
              type: Number,
              default: 11
            },
            name: {
                type: Array,
                default: function(){
                    return []
                }
            },
            value: {
                type: Array,
                default: function(){
                    return []
                }
            }
        },
        template:'<tr class="variation-row">\
            <template v-if="index%2 === 0">\
                <td><label><input @click="checkSkuEffect" type="checkbox" class="sku-effect" checked=""></label></td>\
                <td v-for="(a,i) in value"><span :data-name="name[i]" :data-value="a" class="variation-attr" style="word-break: break-all">${a}</span></td>\
                <td><input type="text" class="form-control v-price"></td>\
                <td><input type="text" class="form-control v-sale-price sale"></td>\
                <td style="width:160px !important;position:relative"><input type="text" @click="dateChoose" class="form-control v-time-s date-choose sale"></td>\
                <td style="width:160px !important;position:relative"><input type="text" @click="dateChoose" class="form-control v-time-e date-choose sale"></td>\
                <td><input type="text" class="form-control v-stock"></td>\
                <td><input type="text" class="form-control v-upc"></td>\
                <td><input type="text" class="form-control v-sku" style="word-break: break-all"></td>\
                <td style="width:268px">\
                    <sku-title-keys v-if="skuTitKey" :base="bases" v-on:checkTitKeyBul="skuTitKeyShow"></sku-title-keys>\
                    <div class="input-group">\
                        <input type="text" class="form-control v-title-keys" :value="setInput" style="word-break: break-all" readonly="readonly">\
                        <div class="input-group-addon btn btn-primary sku-title-keys" @click="checkSkuTitKey">设置</div>\
                    </div>\
                </td>\
            </template>\
            <template v-else>\
                <td style="padding:0 10px;" :colspan="num">\
                    <div class="row img-sort-list ui-sortable">\
                        <div class="img-pre-box ui-sortable-handle" data-id="">\
                            <a href="javascript:void(0)" style="display:none;"><span class="del-temp-img"></span></a>\
                            <img src="/static/image/add.png">\
                        </div>\
                    </div>\
                    <div class="sku-img" ref="sku_img" style="position:relative;vertical-align: top;padding: 20px 0 0 20px;">\
                    </div>\
                    <div style="position:relative; vertical-align: top;padding: 20px 0 0 20px;display:inline-block;">\
                        <select ref="sel" class="apply-other form-control">\
                            <option value="0">应用至</option>\
                            <option value="all">所有变体</option>\
                            <option v-for="n in name" :value="n">相同${n}</option>\
                        </select>\
                    </div>\
                </td>\
            </template>\
        </tr>',
        data: function () {
            return {
                bases: {},
                setInput: '',
                tempData: '',
                skuTitKey: false,
                isVariation: true
            }
        },
        mounted: function () {
            if(this.$refs.sku_img){
               $(this.$refs.sku_img).uploadPictures(sku_img_option);               　
            };
            if(this.$refs.sel){
                $(this.$refs.sel).on('change',this.applyOther);
            };
        },
        methods: {
            applyOther: function (e) {
                var target = e.target || e.srcElement;
                var $name = $(target).val(),
                    $tr = $(target).closest("tr"),
                    $table = $(target).closest("table"),
                    $value = $(target).closest("tr").prev("tr.variation-row").find("[data-name=\"" + $name + "\"]").attr("data-value"),
                    tar_tr_list = $(target).closest("table").find("[data-name=\"" + $name + "\"][data-value=\"" + $value + "\"]").closest("tr");
                var pictures = [];
                $tr.find("img").each(function (k, v) {
                    var url = $(v).attr("src");
                    if (url != "/static/image/add.png") {
                        pictures.push(url);
                    }
                });
                if ($name == "all") {
                    tar_tr_list = $table.find("tr.variation-row");
                    $(target).val('0');
                }
                if (pictures.length > 0) {
                    tar_tr_list.each(function (k, v) {
                        var pic_str = "";
                        for (var i = 0; i < pictures.length; i++) {
                            pic_str += '<div class="img-pre-box" data-id=""><a href="javascript:void(0)"><span class="del-temp-img"></span></a><img src=' + pictures[i] + '></div>'
                        }
                        $(v).next("tr").find(".img-sort-list").empty().append(pic_str);
                        $('.del-temp-img').off().on('click',function (event) {
                            var tar = event.target || event.srcElement;
                            event.stopPropagation();
                            var cur = $(tar).closest("div"),
                                par = $(tar).closest("div.img-sort-list"),
                                len = par.find(".img-pre-box").length;
                            if (len === 1) {
                                cur.find("img").attr("src", "/static/image/add.png");
                                $(tar).css("display", "none");
                            } else {
                                cur.remove();
                            }
                        });
                        $(v).next("tr").removeClass("error");
                    })
                    $(target).val('0');
                }
            },
            skuTitKeyShow: function (val) {
                if(typeof(val) === "object" && val.mark == ''){
                    this.skuTitKey = val.name;
                    if(JSON.parse(this.tempData).TitleNum !== 0){
                        if(typeof(this.tempData) === 'string'){
                            this.setInput = this.tempData;
                        }else{
                            this.setInput = JSON.stringify(this.tempData);
                        }
                    }
                    return;
                }else if(typeof(val) === 'string') {
                    this.setInput = val;
                    this.skuTitKey = false;
                }
            },
            dateChoose: function () {
                $(".v-time-s, .v-time-e").each(function(i,item){
                    $(item).datetimepicker({format: 'YYYY-MM-DD'});
                });
            },
            checkSkuEffect: function (e) {
                var target = e.target || e.srcElement;
                if ($(target).prop("checked")) {
                    $(target).closest("tr").removeClass("no-effect").find(":text").removeAttr("disabled");
                } else {
                    $(target).closest("tr").addClass("no-effect").find(":text").attr("disabled", "disabled").removeClass("error");
                }
            },
            checkSkuTitKey: function (e) {
                this.skuTitKey = true;
                var target = e.target || e.srcElement;
                e.stopPropagation();
                var $sku_modal = $(target).closest('td').find("#set-title-keys");
                $sku_modal.modal("show");
                $(target).closest('.site-info-area').find("input.child-keys, input.BulletPoint, #child-title").val("").css("border-color", "");
                $(target).closest('.site-info-area').find(".key-number, .BulletPoint-number, .title-number").text("0");
                $(target).closest('.site-info-area').find("input.BulletPoint").eq(0).addClass('req');
                var child_info = $(target).parent().find(".v-title-keys");
                var baseData = {
                    Title: "",
                    TitleNum: 0,
                    KeyWords: [{name: '', num: 0},{name: '', num: 0},{name: '', num: 0},{name: '', num: 0},{name: '', num: 0}],
                    BulletPoint: [{name: '', num: 0},{name: '', num: 0},{name: '', num: 0},{name: '', num: 0},{name: '', num: 0}],
                    };
                if (child_info.val().trim() !== '') {
                    var baseOld = JSON.parse(child_info.val().trim());
                    baseData.Title = baseOld.Title;
                    var newKeyWords = baseOld.KeyWords,
                        newBulletPoint = baseOld.BulletPoint;
                };
                baseData.TitleNum = baseData.Title.length;
                if(newKeyWords){
                    baseData.KeyWords = [];
                    for (var i = 0; i < newKeyWords.length; i++) {
                        if(typeof(newKeyWords[i]) === 'object'){
                            baseData.KeyWords = newKeyWords;
                        }else{
                            baseData.KeyWords.push({
                                name: newKeyWords[i],
                                num: newKeyWords[i].length
                            });
                        }

                    }
                };
                if(!newBulletPoint){}else{
                    baseData.BulletPoint = [];
                    for (var i = 0; i < newBulletPoint.length; i++) {
                        if(typeof(newBulletPoint[i]) === 'object'){
                            baseData.BulletPoint = newBulletPoint;
                        }else {
                            baseData.BulletPoint.push({
                                name: newBulletPoint[i],
                                num: newBulletPoint[i].length
                            });
                        }
                    }
                };
                if(baseData.TitleNum == 0){
                    this.setInput = '';
                }
                this.tempData = JSON.stringify(baseData);
                return this.bases = baseData;
            }
        }
    });
    Vue.component('upop-model',{
        props:{
            dataName: {
                type: String,
                default: ''
            },
            dataClass: {
                type: String,
                default: ''
            }
        },
        template:'<div class="batch-set-pop" style="left: 60px; width: 189px">\
            <div class="batch-set-arrow"></div>\
            <div @blur="check_Number" class="batch-set-title">批量设置</div>\
            <div class="batch-set-content form-inline">\
                <input type="number" class="form-control batch-set-ipt">\
                <button class="btn btn-primary ensure-batch" @click="one_Key_Setting" :data-name="dataName">确定</button>\
            </div>\
        </div>',
        methods: {
            check_Number: function (e) {
                var target = e.target || e.srcElement;
                e.stopPropagation();
                var inpVal = $(target).val().trim();
                if(/\d+/.test(inpVal)){}else{
                    if(inpVal.length > 0){
                        Inform.show('输入的不是有效数字');
                        return;
                    }
                }
            },
            one_Key_Setting: function (e) {
                var target = e.target || e.srcElement;
                e.stopPropagation();
                $(target).closest('td.variation-th').css({"position": "relative"});
                var inpVal = $(target).prev('input').val().trim(),
                    sku_table_tr = $(target).closest(".table").find("tr");
                var _this = this;
                sku_table_tr.each(function (i,v) {
                    $(v).find(_this.dataClass).val(inpVal);
                });
                this.$emit('clickSet',{
                    name: this.dataName,
                    value: false
                });
                return;
            }
        }
    });
    Vue.component('set-sku-ean',{
        props:{
            upcNum: {
                type: String,
                default: ''
            },
            dataClass: {
                type: String,
                default: ''
            }
        },
        template:'<div class="modal fade in" id="child-upcs-modal" tabindex="-1" role="dialog" aria-labelledby="groupLabel" aria-hidden="false" style="display: block; padding-right: 17px; background-color: rgba(0, 0, 0, 0.4);">\
            <div class="modal-dialog" style="width: 800px">\
                <div class="modal-content">\
                    <div class="modal-header">\
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true" @click="hide_sku_mode">×</button>\
                        <h3 class="modal-title">批量设置产品编码</h3>\
                    </div>\
                    <div class="modal-body">\
                        <form class="form-horizontal">\
                            <textarea class="form-control" v-on:keyup="on_sku_num" ref="textarea" id="child-upc-list" rows="5" data-name="pro-upc" placeholder="多个upc/ean用Enter换行"></textarea>\
                        </form>\
                        <div>总共需要<span id="child-length">${upcNum}</span>个upc,已经填写<span id="exit-upc-length" style="color: red;">0</span></div>\
                    </div>\
                    <div class="modal-footer">\
                        <button type="button" class="btn btn-default" data-dismiss="modal" @click="hide_sku_mode">关闭</button>\
                        <button type="button" class="btn btn-primary" data-loading-text="处理中..." @click="one_SKUEAN_Setting" id="commit-child-upc" autocomplete="off">提交</button>\
                    </div>\
                </div>\
            </div>\
        </div>',
        methods: {
            on_sku_num: function (e) {
                var target = e.target || e.srcElement;
                var length = $(target).val().trim().split("\n").length;
                $(target).closest('#child-upcs-modal').find("#exit-upc-length").text(length);
            },
            one_SKUEAN_Setting: function (e) {
                var target = e.target || e.srcElement;
                e.stopPropagation();
                $(target).closest('td.variation-th').css({"position": "relative"});
                var textareaVal = $(target).closest('#child-upcs-modal').find('textarea').val().split('\n'),
                    sku_table_upc = $(target).closest(".table").find(".v-upc");
                sku_table_upc.each(function (i,v) {
                    var upc = $(v).val(textareaVal[i]) ? textareaVal[i] : "";
                    $(v).val(upc);
                });
                this.$emit('clickSetUpc',false);
                return;
            },
            hide_sku_mode: function (e) {
                var target = e.target || e.srcElement;
                e.stopPropagation();
                $(target).closest("#child-upcs-modal").modal("hide");
                $(target).closest('#child-upcs-modal').find('textarea').val('');
                this.$emit('clickSetUpc',false);
                return;
            }
        }
    });
    Vue.component('sku-set-modal',{
        props:{
            setSkuP: {
                type: String,
                default: ''
            },
            mid: {
                type: String,
                default: ''
            },
            aliasNext: {
                type: String,
                default: ''
            },
            aliasPrev: {
                type: String,
                default: ''
            },
            names: {
                type: Array,
                default: function () {
                    return [];
                }
            },
            setSkuData: {
                type: Array,
                default: function () {
                    return [];
                }
            }
        },
        template:'<div class="modal fade in" id="sku-set-modal" tabindex="-1" role="dialog" aria-labelledby="templateLabel" aria-hidden="false" style="display: block; padding-right: 17px; background-color: rgba(0, 0, 0, 0.4);">\
            <div class="modal-dialog modal-lg">\
                <div class="modal-content">\
                    <div class="modal-header">\
                        <button type="button" @click="hideSkuModel" class="close" data-dismiss="modal" aria-hidden="true">×</button>\
                        <h3 class="modal-title">自定义sku</h3>\
                    </div>\
                    <div class="modal-body form-horizontal">\
                        <div class="form-group" id="sku-set-1">\
                            <div class="col-md-3 form-inline">\
                                <label class="control-label">前缀:</label>\
                                <input type="text" v-on:input="setSkuForm" :value="aliasPrev" class="form-control" id="alias-prev">\
                            </div>\
                            <div class="col-md-3 form-inline">\
                                <label class="control-label">连接符:</label>\
                                <input type="text" v-on:input="setSkuForm" :value="mid" class="form-control" id="alias-mid">\
                            </div>\
                            <div class="col-md-3 form-inline">\
                                <label class="control-label">后缀:</label>\
                                <input type="text" v-on:input="setSkuForm" :value="aliasNext" class="form-control" id="alias-next">\
                            </div>\
                        </div>\
                        <div class="form-group" id="sku-set-2">\
                            <div class="col-md-12"><label for="">拖动调整sku拼接顺序</label></div>\
                            <div ref="sortableSku" class="col-md-12 ui-sortable" id="set-sku-order">\
                                <div class="set-sku-order-block set-p-sku-block ui-sortable-handle" data-name="p-sku">\
                                    <input type="text" v-on:input="setSkuForm" :value="setSkuP" id="set-sku-p" placeholder="父SKU">\
                                </div>\
                                <div v-for="name in names" class="set-sku-order-block" :data-name="name">${name}</div>\
                            </div>\
                        </div>\
                        <div class="form-group" id="sku-set-3">\
                            <div class="col-md-12"><label for="">设置sku对应关系</label></div>\
                            <div class="col-md-12">\
                                <div id="set-sku-alias-content">\
                                    <div class="set-sku-alias-block" v-for="item in setSkuData">\
                                        <div class="alias-head">${item.name}</div>\
                                        <div>\
                                            <table class="alias-table" :data-name="item.name">\
                                                <tbody>\
                                                    <tr v-for="v in item.value">\
                                                        <template v-for="childV in v">\
                                                            <td>${childV}</td>\
                                                            <td><input type="text" :value="aliased[v]" v-on:input="setSkuForm" class="alias-v" :data-o="childV"></td>\
                                                        </template>\
                                                    </tr>\
                                                </tbody>\
                                            </table>\
                                        </div>\
                                    </div>\
                                </div>\
                            </div>\
                        </div>\
                        <hr>\
                        <div class="form-group form-inline" id="sku-set-4">\
                            <div class="col-md-12">\
                                <label class="control-label">sku生成预览:</label>\
                                <input disabled="disabled" type="text" class="form-control" id="alias-ex">\
                            </div>\
                        </div>\
                    </div>\
                    <div class="modal-footer">\
                        <div id="up-alias-content"><input type="checkbox" id="up-alias-set-reg" checked="checked">是否保存此次操作</div>\
                        <button type="button" @click="hideSkuModel" class="btn btn-default" data-dismiss="modal">关闭</button>\
                        <button type="button" @click="edit_sku_ensure" class="btn btn-primary" data-loading-text="处理中..." id="edit-sku-ensure">确认</button>\
                    </div>\
                </div>\
            </div>\
        </div>',
        data: function () {
            return {
                aliasEx: '',
                aliased: ''
            }
        },
        created: function () {
            var _this = this;
            this.setSkuData.forEach(function (ite) {
                var name = ite.name;
                _this.aliased = alias[name.toLowerCase()]||{};
            });
        },
        mounted: function () {
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
            $(this.$refs.sortableSku).sortable({
                "items": ".set-sku-order-block",
                "update": this.setSkuForm
            });
        },
        methods: {
            setSkuForm: function (e) {
                var target = e.target || e.srcElement;
                e.stopPropagation();
                this.aliasEx = $(target).val().trim();
                var value_list = $(target).closest('#sku-set-modal').find("#set-sku-order").find(".set-sku-order-block").get().map(function(a){
                    var _name = $(a).attr("data-name");
                    if(_name === "p-sku") return $(a).find(":text").val();
                    else{
                        var _dom = $(target).closest('#sku-set-modal').find(".alias-table[data-name='"+_name+"']").find("input:text").eq(0);
                        return _dom.val()||_dom.attr("data-o")
                    }
                }), prev = $(target).closest('#sku-set-modal').find("#alias-prev").val().trim(), next = $(target).closest('#sku-set-modal').find("#alias-next").val().trim(), mid = $("#alias-mid").val();
                if(prev) value_list.unshift(prev);
                if(next) value_list.push(next);
                $("#alias-ex").val(value_list.join(mid));
            },
            edit_sku_ensure: function (e) {
                var target = e.target || e.srcElement;
                e.stopPropagation();
                var order_list = $(target).closest('#sku-set-modal').find("#set-sku-order").find(".set-sku-order-block").get().map(function(a){return $(a).attr("data-name")}),
                    alias_list = [],
                    block_list = $(target).closest('#sku-set-modal').find(".alias-table"),
                    prev = $(target).closest('#sku-set-modal').find("#alias-prev").val().trim(),
                    next= $(target).closest('#sku-set-modal').find("#alias-next").val().trim(),
                    mid = $(target).closest('#sku-set-modal').find("#alias-mid").val().trim(),
                    p_sku = $(target).closest('#sku-set-modal').find("#set-sku-p").val().trim();
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
                this.create_sku_by_set($(target).closest(".table.table-striped"),prev, next, mid, order_list, p_sku);
                $(target).closest("#sku-set-modal").modal("hide");
                if ($(target).closest('#sku-set-modal').find("#up-alias-set-reg").prop("checked")){
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
                return this.$emit('clickSkuModel',false);
            },
            create_sku_by_set: function(par ,prev, next, mid, order_list, p_sku){
                var sku_trs = par.find(".variation-row");
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
            hideSkuModel: function () {
                return this.$emit('clickSkuModel',false);
            },
            on_sku_num: function (e) {
                var target = e.target || e.srcElement;
                var length = $(target).val().trim().split("\n").length;
                $(target).closest('#child-upcs-modal').find("#exit-upc-length").text(length);
            },
            one_SKUEAN_Setting: function (e) {
                var target = e.target || e.srcElement;
                e.stopPropagation();
                $(target).closest('td.variation-th').css({"position": "relative"});
                var textareaVal = $(target).closest('#child-upcs-modal').find('textarea').val().split('\n'),
                    sku_table_upc = $(target).closest(".table").find(".v-upc");
                sku_table_upc.each(function (i,v) {
                    var upc = $(v).val(textareaVal[i]) ? textareaVal[i] : "";
                    $(v).val(upc);
                });
                this.$emit('clickSetUpc',false);
                return;
            },
            hide_sku_mode: function (e) {
                var target = e.target || e.srcElement;
                e.stopPropagation();
                $(target).closest("#child-upcs-modal").modal("hide");
                $(target).closest('#child-upcs-modal').find('textarea').val('');
                this.$emit('clickSetUpc',false);
                return;
            }
        }
    });
    Vue.component('tr-model', {
        props: {
            value: {
                type: Array,
                default: function () {
                    return [];
                }
            }
        },
        template: '<tr>\
            <template>\
                <td ></td>\
                <td><input type="text" class="alias-v" data-o="34 inches"></td>\
            </template>\
        </tr>'
    });
    Vue.component('sku-title-keys',{
        props: {
            base: {
                type: Object,
                default: function () {
                    return {};
                }
            }
        },
        template:'<div class="modal fade in" id="set-title-keys" tabindex="-1" role="dialog" aria-labelledby="groupLabel" aria-hidden="false" style="display: block; padding-right: 17px; background-color: rgba(0, 0, 0, 0.4)">\
            <div class="modal-dialog" style="width: 800px">\
                <div class="modal-content">\
                    <div class="modal-header">\
                        <button type="button" class="close" @click="hideSalMode" data-dismiss="modal" aria-hidden="true">×</button>\
                        <h3 class="modal-title">设置变体标题和关键词和BulletPoint</h3>\
                    </div>\
                    <div class="modal-body">\
                        <form class="form-horizontal">\
                            <div class="form-group">\
                                <label class="col-md-2 control-label v-required">标题:</label>\
                                <div class="col-md-9">\
                                    <input ref="input" type="text" maxlength="500" v-on:input="checkInp" id="child-title" placeholder="长度建议不超过500个字符" class="form-control req" :value="base.Title">\
                                    <div><span ref="num" class="title-number" style="color: red">${base.TitleNum}</span>/500</div>\
                                </div>\
                            </div>\
                            <div class="form-group">\
                                <label class="col-md-2 control-label v-required">关键词:</label>\
                                <div class="col-md-9">\
                                    <div v-for="key in base.KeyWords">\
                                        <input ref="keyInput" type="text" maxlength="200" v-on:input="checkInp" class="form-control child-keys req" style="position: relative" placeholder="关键字的长度不应超过200个字符!" :value="key.name">\
                                        <div><span ref="keyNum" class="key-number" style="color: red">${key.num}</span>/200</div>\
                                    </div>\
                                </div>\
                            </div>\
                            <div class="form-group" style="margin-bottom: -12px;">\
                                <label class="col-md-2 control-label v-required">BulletPoint:</label>\
                                <div class="col-md-9">\
                                    <div>\
                                        <input type="text" ref="bullInput" maxlength="500" v-on:input="checkInp" class="form-control BulletPoint req" style="position: relative" placeholder="BulletPoint的长度不应超过500个字符!" :value="base.BulletPoint[0].name">\
                                        <div><span ref="bollNum" class="BulletPoint-number" style="color: red">${base.BulletPoint[0].num}</span>/500</div>\
                                    </div>\
                                    <div>\
                                        <input type="text" ref="bullInput" maxlength="500" v-on:input="checkInp" class="form-control BulletPoint" style="position: relative" placeholder="BulletPoint的长度不应超过500个字符!" :value="base.BulletPoint[1].name">\
                                        <div><span ref="bollNum" class="BulletPoint-number" style="color: red">${base.BulletPoint[1].num}</span>/500</div>\
                                    </div>\
                                    <div>\
                                        <input type="text" ref="bullInput" maxlength="500" v-on:input="checkInp" class="form-control BulletPoint" style="position: relative" placeholder="BulletPoint的长度不应超过500个字符!" :value="base.BulletPoint[2].name">\
                                        <div><span ref="bollNum" class="BulletPoint-number" style="color: red">${base.BulletPoint[2].num}</span>/500</div>\
                                    </div>\
                                    <div>\
                                        <input type="text" ref="bullInput" maxlength="500" v-on:input="checkInp" class="form-control BulletPoint" style="position: relative" placeholder="BulletPoint的长度不应超过500个字符!" :value="base.BulletPoint[3].name">\
                                        <div><span ref="bollNum" class="BulletPoint-number" style="color: red">${base.BulletPoint[3].num}</span>/500</div>\
                                    </div>\
                                    <div>\
                                        <input type="text" ref="bullInput" maxlength="500" v-on:input="checkInp" class="form-control BulletPoint" style="position: relative" placeholder="BulletPoint的长度不应超过500个字符!" :value="base.BulletPoint[4].name">\
                                        <div><span ref="bollNum" class="BulletPoint-number" style="color: red">${base.BulletPoint[4].num}</span>/500</div>\
                                    </div>\
                                    <p style="color:red; line-height: 25px;">*BulletPoint至少填写一条数据,默认第一条为必填项</p>\
                                </div>\
                            </div>\
                        </form>\
                    </div>\
                    <div class="modal-footer">\
                        <button type="button" @click="hideSalMode" class="btn btn-default" data-dismiss="modal">关闭</button>\
                        <button type="button" @click="batchSetSale" class="btn btn-primary" data-loading-text="处理中..." autocomplete="off">提交</button>\
                    </div>\
                </div>\
            </div>\
        </div>',
        data: function () {
            return {
                base: {
                    Title: "",
                    TitleNum: 0,
                    KeyWords: [{name: '', num: 0},{name: '', num: 0},{name: '', num: 0},{name: '', num: 0},{name: '', num: 0}],
                    BulletPoint: [{name: '', num: 0},{name: '', num: 0},{name: '', num: 0},{name: '', num: 0},{name: '', num: 0}],
                }
            }
        },
        methods: {
            checkInp: function ($event) {
                var target = $event.target || $event.srcElement;
                $(target).val().length > 1 && $(target).removeClass('error');
                var inputVal = $(target).val().trim().length;
                $(target).next('div').find('span').text(inputVal);
            },
            hideSalMode: function (e) {
                var target = e.target || e.srcElement;
                e.stopPropagation();
                this.setDateSal = false;
                $("#bulk-set-sale").modal("hide");
                this.$emit('checkTitKeyBul',{name:false, mark:""});
            },
            batchSetSale: function (e) {
                var target = e.target || e.srcElement;
                e.stopPropagation();
                var flag = checkInp();
                function checkInp() {
                    var $input = $(target).closest('.modal-content').find("input.req"),
                        flag = true;
                    $input.each(function (i, v) {
                        if (!$(v).val().trim()) {
                            $(v).addClass('error');
                            flag = false;
                        };
                    });
                    return flag
                };
                if (!flag) {
                    Inform.show("请将红框中的内容补充完成！");
                    return 0
                }
                var title = $(target).closest('.modal-content').find("#child-title").val().trim(),
                    $keys = $(target).closest('.modal-content').find(".child-keys"),
                    $bulletPoints = $(target).closest('.modal-content').find("input.BulletPoint"),
                    keys = [],
                    bulletPointL = [];

                if($keys){
                    for (var i = 0; i < $keys.length; i++) {
                        var key = $keys.eq(i).val().trim();
                        if (key) {
                            keys.push(key)
                        }
                    }
                };
                if($bulletPoints){
                    for (var i = 0; i < $bulletPoints.length; i++) {
                        var bulletPointe = $bulletPoints.eq(i).val().trim();
                        bulletPointL.push(bulletPointe);

                    }
                };
                this.$emit('checkTitKeyBul',JSON.stringify({"Title": title, "KeyWords": keys, "BulletPoint": bulletPointL}));
                $("#set-title-keys").modal("hide");
            },
        }
    });
    Vue.prototype.delRoute = function (event) {
        var target = event.target || event.srcElement;
        $(target).closest('.form-group').remove();
    };
    window.vueParent = new Vue({
        el: ".workspace",
    });
});

