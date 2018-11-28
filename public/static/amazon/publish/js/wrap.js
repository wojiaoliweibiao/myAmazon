/**
 * Created by Administrator on 2016/8/26.
 */
$(function(){
    var invite_code = "",
        secret = "",
        $search = location.search,
        re = /^(\?)code=[A-Z]{4}\&secret=[0-9a-z]+$/;
    if($search && re.test($search)){
        $(".auth-content").animate({"left": "-200%"}, 200);
        $(".auth-area").animate({"height": "320px"}, 200);
        $(".error-label").remove();
        var param = location.search;
        invite_code = param.substr(6,4);
        secret = param.substr(18);
    }
    var Info_dic = {
        reg_code_status: 0, // 注册验证码发送状态
        ret_code_status: 0, // 重置密码验证码发送状态,
        reg_code: 0, // 注册验证码验证状态
        ret_code: 0, // 重置密码验证码验证状态，
        reg_number: 0, // 手机号验证状态
        ret_number: 1
    };
    var retrieve_mobile = $("#retrieve-mobile"),
        retrieve_pwd = $("#new-pwd"),
        login_mobile = $("#login-mobile"),
        login_pwd = $("#login-pwd"),
        register_mobile = $("#register-mobile"),
        register_pwd = $("#register-pwd"),
        retrieve_code = $("#retrieve-v-code"),
        register_code = $("#register-v-code");
    var Register = {
        init: function(){
            Register.set_account();
            $.judge_browser();
            $("#go-regist").click(Register.go_register);
            $("#go-login, #return-to-login").click(Register.go_login);
            $("#go-retrieve").click(Register.go_retrieve);
            $("#register-mobile,#retrieve-mobile").on("blur", Register.verify_mobile);
            $("#register-pwd,#new-pwd").on("blur", Register.verify_pwd);
            $(".input-box").click(Register.remove_tip);
            $(".input-box input").keydown(Register.remove_tip);
            $(".input-comp").click(Register.remove_tip);
            $(".input-comp input").keydown(Register.remove_tip);
            $(".verify-area a").click(Register.send_code);
            $(".regist-btn").click(Register.register);
            $(".login-btn").click(Register.login);
            $(".retrieve-btn").click(Register.reset_pwd);
            $(document).keydown(Register.enter_press);
        },
        set_account: function(){
            var arr,
                reg = new RegExp("(^| )" + "account" + "=([^;]*)(;|$)");
            if (arr=document.cookie.match(reg)){
                $("#login-mobile").val(arr[2]);
            }
        },
        go_register: function(){
            $(".auth-content").animate({"left": "-200%"}, 200);
            $(".auth-area").animate({"height": "320px"}, 200);
            $(".error-label").remove();
        },
        go_login: function(){
            $(".auth-content").animate({"left": "-100%"}, 200);
            $(".auth-area").animate({"height": "290px"}, 200);
            $(".error-label").remove();
        },
        go_retrieve: function(){
            $(".auth-content").animate({"left": "0"}, 200);
            $(".auth-area").animate({"height": "320px"}, 200);
            $(".error-label").remove();
        },
        error_tip: function(target, text){
            var tip = $("<label>").addClass("error-label").text(text ? text : "您填写的信息有误");
            target.closest("div").find(".error-label").remove();
            target.after(tip);
        },
        verify_mobile: function(){
            var $this = $(this),
                $id = $this.attr("id"),
                mobile = $this.val().trim();
            if(mobile == ""){
                Register.error_tip($this, "请输入手机号");
            }else if(/^1[3|4|5|7|8|9][0-9]\d{4,8}$/.test(mobile)){
                if($id == "register-mobile"){
                    $.ajax({
                        url: "/api/verifymobile/"+mobile,
                        type: "GET",
                        dataType: "json",
                        success: function (data) {
                            if(data.status == "success"){
                                Info_dic.reg_number = 1;
                            }else{
                                Info_dic.reg_number = -1;
                                Register.error_tip($this, data.message);
                            }
                        }
                    });
                }
            }else{
                Register.error_tip($this, "请输入正确的手机号");
            }
        },
        verify_pwd: function(){
            var $this = $(this),
                pwd = $this.val();
            if(pwd.length == 0){
                Register.error_tip($this, "请输入密码");
            }else if(pwd.length < 6 && $this.attr("id") != "login-pwd"){
                Register.error_tip($this, "密码长度不能低于6位");
            }
        },
        remove_tip: function(){
            $(this).find(".error-label").remove();
        },
        register: function(){
            var $this = $(this),
                cur_mobile = register_mobile.val();
            if(!(/^1[3|4|5|6|7|8|9][0-9]\d{4,8}$/.test(cur_mobile))){
                Register.error_tip(register_mobile, "请输入正确的手机号");
                return 0;
            }
            switch(Info_dic.reg_number){
                case -1:{
                    Register.error_tip(register_mobile, "手机号已存在");
                    return 0;
                }
                case 0:{
                    Register.error_tip(register_mobile, "手机号验证失败, 重新输入手机号");
                    return 0;
                }
                default:
                    break;
            }
            if(register_pwd.val().length < 6){
                Register.error_tip(register_pwd, "密码长度不能低于6位");
                return 0;
            }
            if(register_code.val()==""){
                Register.error_tip(register_code, "验证码不能为空");
                return 0;
            }
            switch(Info_dic.reg_code){
                case -1:{
                    Register.error_tip(register_code, "验证码不正确");
                    break;
                }
                case 1:{
                    var data = {"mobile": register_mobile.val(), "password": register_pwd.val(), "code": invite_code,
                                "secret": secret};
                    $this.button("loading");
                    $.ajax({
                        "type": "POST",
                        "url": "/register",
                        "data": data,
                        "cache": true,
                        "dataType": "json",
                        "success": function(data){
                            if(data.status == "error"){
                                $this.button("reset");
                                if(data["error_code"] == "100") {
                                    alert(data["msg"]);
                                }
                            }else{
                                location.replace(data.data);
                            }
                        },
                        "error": function(){
                            console.log("请求失败，请查看网络");
                            $this.button("reset");
                            alert("请求失败，请查看网络");
                        }
                    });
                    break;
                }
                default:{
                    break;
                }
            }
        },
        send_code: function(){
            var $this = $(this),
                $id = $this.attr("data-id"),
                cur_div = $this.closest(".auth-apart"),
                mobile = cur_div.find('[name="username"]').val();
            if($id == "register" && Info_dic.reg_code_status == 1)
                return 0;
            if($id == "retrieve" && Info_dic.ret_code_status == 1)
                return 0;
            if(!(/^1[3|4|5|6|7|8|9][0-9]\d{4,8}$/.test(mobile))){
                Register.error_tip(cur_div.find('[name="username"]'), "请输入正确的手机号码");
                return 0;
            }else if(($id == "register" && (Info_dic.reg_number ==0|| Info_dic.reg_number ==-1)) || ($id == "retrieve" && (Info_dic.ret_number ==0|| Info_dic.ret_number ==-1))){
                return 0;
            }else if(cur_div.find('[name="password"]').val() < 6){
                return 0;
            }
            $this.after($("<div>").addClass("btn-layer"));
            $this.html("正在发送. . .");
            $.ajax({
                url: "/api/getcode/"+mobile,
                type: "GET",
                dataType: "json",
                success: function (data) {
                    if(data.status=="success") {
                        if($id == "register"){
                            Info_dic.reg_code_status = 1;
                        }else if($id == "retrieve"){
                            Info_dic.ret_code_status = 1;
                        }
                        $this.closest(".input-comp").find("input").on("keyup", Register.verify_code);
                        var interval_id = setInterval(function () {
                            var second = 60;
                            function run() {
                                if (second <= 0) {
                                    clearInterval(interval_id);
                                    $this.next(".btn-layer").remove();
                                    $this.html("重新发送");
                                    if($id == "register"){
                                        Info_dic.reg_code_status = 0;
                                    }else if($id == "retrieve"){
                                        Info_dic.ret_code_status = 0;
                                    }
                                } else {
                                    $this.html("已发送（" + second + "）");
                                    second -= 1;
                                }
                            }
                            return run;
                        }(), 1000);

                    }else {
                        alert("验证码发送失败，请刷新后再次尝试！");
                    }
                }
            });
        },
        verify_code: function(){
            var $this = $(this),
                verify_code = $this.val(),
                type = $this.attr("id"),
                cur_code = 0;
            if(verify_code.length <4){
                cur_code = -1;
            }if(verify_code.length == 4){
                $.ajax({
                    url: "/api/verifycode/"+verify_code,
                    type: "GET",
                    dataType: "json",
                    success: function (data) {
                        if(data.status == "success"){
                            cur_code = 1;
                            if(type == "register-v-code"){
                                Info_dic.reg_code = cur_code;
                            }else if(type == "retrieve-v-code"){
                                Info_dic.ret_code = cur_code;
                            }
                        }
                        else{
                            Register.error_tip(register_code, "验证码不正确");
                            if(type == "register-v-code"){
                                Info_dic.reg_code = cur_code;
                            }else if(type == "retrieve-v-code"){
                                Info_dic.ret_code = cur_code;
                            }
                            cur_code = -1;
                        }
                    }
                });
            }else if(verify_code.length > 4){
                Register.error_tip(register_code, "验证码为四位数字");
                cur_code = -1;
            }
            if(type == "register-v-code"){
                Info_dic.reg_code = cur_code;
            }else if(type == "retrieve-v-code"){
                Info_dic.ret_code = cur_code;
            }
        },
        login: function(){
            var $this = $(this),
                mobile = login_mobile.val(),
                pwd = login_pwd.val(),
                flag = true;
            if(mobile == ""){
                flag = false;
                Register.error_tip(login_mobile, "请输入手机号");
            }
            if(pwd == ""){
                flag = false;
                Register.error_tip(login_pwd, "请输入密码");
            }
            if(!flag) return 0;
            $this.button("loading");
            $.ajax({
                "type": "POST",
                "url": "/login",
                "data": {
                    "mobile": mobile,
                    "password": pwd
                },
                "cache": true,
                "dataType": "json",
                "success": function(data){
                    if(data.status == "error"){
                        $this.button("reset");
                        switch (data["error_code"]) {
                            case "0":
                                alert("参数不全");
                                break;
                            case "1":
                                Register.error_tip(login_mobile, "账户有问题，多个用户存在");
                                break;
                            case "2":
                                Register.error_tip(login_mobile, "用户不存在");
                                break;
                            case "3":
                                Register.error_tip(login_pwd, "密码错误");
                                break;
                            case "100":
                                Register.error_tip(login_pwd, "未知错误");
                                break;
                        }
                    }else{
                        document.cookie = "account=" + mobile;
                        location.replace(data.data);
                    }
                },
                "error": function(){
                    $this.button("reset");
                    console.log("请求失败，请查看网络");
                }
            });
        },
        enter_press: function(e){
            var theEvent = e || window.event;
            if(theEvent.keyCode == 13){
                if(login_mobile.is(":focus") || login_pwd.is(":focus")){
                    $(".login-btn").trigger("click");
                }
            }
        },
        reset_pwd: function(){
            var $this = $(this),
                mobile = retrieve_mobile.val();
            if(mobile == ""){
                Register.error_tip(retrieve_mobile, "请输入手机号");
                return 0;
            }else if(!(/^1[3|4|5|7|8|9][0-9]\d{4,8}$/.test(mobile))){
                Register.error_tip(retrieve_mobile, "请输入正确的手机号");
                return 0;
            }
            switch(Info_dic.ret_number){
                case -1:{
                    Register.error_tip(retrieve_mobile, "用户不存在");
                    return 0;
                }
                case 0:{
                    Register.error_tip(retrieve_mobile, "手机号验证失败, 重新输入手机号");
                    return 0;
                }
                default:
                    break;
            }
            if(retrieve_pwd.val().length < 6){
                Register.error_tip(retrieve_pwd, "密码长度不能低于6位");
                return 0;
            }
            if(retrieve_code.val()==""){
                Register.error_tip(retrieve_code, "验证码不能为空");
                return 0;
            }
            switch(Info_dic.ret_code){
                case -1:{
                    Register.error_tip(retrieve_code, "验证码不正确");
                    break;
                }
                case 0:{
                    Register.error_tip(retrieve_code, "正在检查验证码");
                    break;
                }
                case 1:{
                    var data = {"mobile": mobile, "password": retrieve_pwd.val()};
                    $this.button("loading");
                    $.ajax({
                        "type": "POST",
                        "url": "/reset",
                        "data": data,
                        "cache": true,
                        "dataType": "json",
                        "success": function(data){
                            $this.button("reset");
                            if(data.status == "error"){
                                if(data["error_code"] == "100") {
                                    alert(data["msg"]);
                                }
                            }else{
                                alert("重置密码成功");
                                retrieve_mobile.val("");
                                retrieve_pwd.val("");
                                retrieve_code.val("");
                                Register.go_login();
                            }
                        },
                        "error": function(){
                            $this.button("reset");
                            alert("请求失败，请查看网络");
                        }
                    });
                    break;
                }
                default:{
                    break;
                }
            }
        }
    };
    Register.init();
});