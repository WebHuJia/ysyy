var sArea = isWeiXin() ? '1' : (isQQLogin() ? '2' : 2);
var sData = {};
var isLogin;
var isReserve = 0; //是否预约  1-已预约 0-未预约
var inviteCount = 0; //已邀请的好友数
var myCode = ''; //用户专属邀请码
var inCode = milo.request('inCode')||''; // 接受的邀请码
var reserveNum; //成功预约的人数
var lotteryNum = 0; //剩余的抽奖次数
var terminal = 1; //PC端未0，移动端为1
var waitTime = 60;
var dj = null;
var ua = window.navigator.userAgent.toLowerCase();
var nickName; //昵称
var headPic;
var REGEXP_IOS_QQ = /(iPad|iPhone|iPod).*? QQ\/([\d\.]+)/;
var REGEXP_ANDROID_QQ = /\bV1_AND_SQI?_([\d\.]+)(.*? QQ\/([\d\.]+))?/;
var homePage;
function isWeiXin(){   //微信登录
   if(ua.match(/MicroMessenger/i)=="micromessenger") {
       return true;
   } else {
       return false;
   }
}
function isWeiXin(){
    return /MicroMessenger/ig.test(navigator.userAgent);
}
function isQQLogin(){  //qq登录
    var chkRes = false;
    mqq.device.isMobileQQ(function(result){
        chkRes = result;
    });
    return chkRes;
}
//验证码倒计时
function daojishi() {
    if(waitTime == 0) {
        $("#hqyzm").removeClass('disabled');
        $("#hqyzm").text('发送验证码');
        clearInterval(dj);
        waitTime = 60;
    } else {
        $("#hqyzm").text(waitTime+'秒');
        waitTime--;
    }
}
//验证验证码
function isVercOde(str){
    return /^(\d){6}$/.test(str);
}
function showHeadImgs(){
    var html = '';
    if(list == undefined){
        length = 0;
    }else{
        length=  list.length;
    }
    for(var i = 0;i<length;i++){
        html += '<li class="spr">';
        html += '<img src=" '+decodeURIComponent(list[i].img)+' "/>';
        html += '<p>'+decodeURIComponent(list[i].name)+'</p>';
        html += '</li>';
    }
    for(var j = 0;j<8-length;j++){
        html += '<li class="spr">';
        html += '<span class="spr"></span>';
        html += '<p>--</p>';
        html += '</li>';
    }
    $("#headImgList").html(html);
}
if(inCode == '' || inCode == null || inCode == undefined){
    // if(isWeiXin()){
        homePage = window.location.protocol+'//ysyy.qq.com/cp/a20171225yym/index_wqm.html?acctype=wx&appid=wx1cd4fbe9335888fe';
    // }else{
    //     homePage = window.location.protocol+'//ysyy.qq.com/cp/a20171225yym/index_wqm.html';
    // }
}else{
    // if(isWeiXin()){
        homePage = window.location.protocol+'//ysyy.qq.com/cp/a20171225yym/index_wqm.html?acctype=wx&appid=wx1cd4fbe9335888fe&inCode='+inCode;
    // }else{
    //     homePage = window.location.protocol+'//ysyy.qq.com/cp/a20171225yym/index_wqm.html?inCode='+inCode;
    // }
}
milo.ready(function(){
    need("biz.login", function(LoginManager){
        LoginManager.checkLogin(function(userInfo){
            $("#invcode").val(inCode);
            // if(isWeiXin()){
                LoginManager.getUserInfoByWxOpenId({
                    "openid":milo.cookie.get("openid"),
                    "access_token":milo.cookie.get("access_token")
                },function(wxuser){
                    nickName = wxuser.nickname.replace(/<span[^>]*>([\s\S]*?)<\/span>/g,'');
                    headPic =  wxuser.headimgurl + "/96";
                    $("#unlogin").hide();
                    $("#login_text").text("您好，"+nickName).show();
                });
                sData = {
                    "appid":'wx1cd4fbe9335888fe', //腾讯游戏活动号的appid
                    "sArea":sArea,
                    "sServiceType":"txyxhdh",
                    "ams_appname":"TXYX_TO_GAME",	//openid_to_openid接口的应用名称，固定不变
                    "ams_targetappid":"wx1d0a2931e0e8a2b0"	//需要进行openid转换的游戏业务appid，根据实际情况修改
                };

            // }else{
            //     nickName = LoginManager.getUin();
            //     headPic = location.protocol + "//q.qlogo.cn/g?b=qq&nk=" + userInfo.userUin + "&s=100";
            //     sData = {
            //         "appid":'1105999355',
            //         "sArea":sArea,
            //         "sServiceType":'ysyy'
            //     };
            // }
            isLogin = true;
            $("#unlogin").hide();
            $("#login_text").text("您好，"+nickName).show();
            amsCfg_427066.sData = sData;
            amsSubmit(133716,427066); //获取预约信息
        }, function(){
            // if(isWeiXin()){//未登录时微信内打开活动进行微信授权
                LoginManager.loginByWX({
                    redirect_wx_url : "http://iu.qq.com/wxauth/redirect.html?url="+encodeURIComponent(homePage)//回调url
                });
            // }else if (isQQLogin()) {
            //     //QQ客户端跳转QQ登录界面
            //     LoginManager.login();
            // }else{
            //     amsCfg_427067.sData.appid = '1105999355'; //获取预约人数
            //     amsCfg_427067.sData.sArea = 2; //获取预约人数
            //     amsSubmit(133716,427067);
            // }
        },{
            appConfig: {
                WxAppId : 'wx1cd4fbe9335888fe', //腾讯游戏活动号appid
                scope : 'snsapi_userinfo'  //snsapi_base获取用户openid信息，snsapi_userinfo可以获取到图像，昵称 等等信息
            }
        });
    });

    amsCfg_427066 = {  //获取预约信息
        "iActivityId": 133716, //活动id
        "iFlowId":    427067, //流程id
        "sData": {},
        "_everyRead" : true, // 每次都重读amsCfg_427066这个对象
        "fFlowSubmitEnd": function(res){
            if(res.jData.iRet == 0){
                isReserve = res.jData.rsvtStatus;  //是否预约
                shareFriend();
                if(isReserve == 1){
                    myCode = res.jData.inviteCode;  //邀请码
                    inviteCount = res.jData.inviteNum;  //邀请人数
                    lotteryNum = parseInt(res.jData.extend1)-parseInt(res.jData.extend2); //剩余的抽奖次数
                    if(lotteryNum < 0){
                        lotteryNum = 0;
                    }
                    if(inviteCount >=3 && inviteCount <5){
                        $("#invite3").removeClass("on");
                    }else if(inviteCount >=5 && inviteCount <8){
                        $("#invite3").removeClass("on");
                        $("#invite5").removeClass("on");
                    }else if(inviteCount >=8 ){
                        $("#invite3").removeClass("on");
                        $("#invite5").removeClass("on");
                        $("#invite8").removeClass("on");
                    }
                }else{
                    myCode = '';
                    inviteCount = 0;
                    lotteryNum = 0;
                }
                reserveNum = res.jData.rsvtNum;  //预约人数
                $("#inviteCount").text(inviteCount);
                $("#reserveNum").text(reserveNum);
                $("#lotteryNum").text(lotteryNum);
                //显示邀请人的头像
                list = res.jData.frdInfo.list;
                showHeadImgs();
                //预约进度条的展示
                if(reserveNum>0 && reserveNum<500000){
                    $("#res50").addClass("on");
                }else if(reserveNum>=1000000 &&  reserveNum<3000000){
                    $("#res100").addClass("on");
                }else if(reserveNum>=3000000 && reserveNum<6000000){
                    $("#res300").addClass("on");
                }else if(reserveNum>=6000000 && reserveNum<10000000){
                    $("#res500").addClass("on");
                }else if(reserveNum>=10000000){
                    $("#res500").addClass("on");
                }
            }
            return;
        }
    };

    amsCfg_427067 = {  //获取预约数量(未登录)
        "iActivityId": 133716, //活动id
        "iFlowId":    427067, //流程id
        "sData":{},
        "fFlowSubmitEnd": function(res){
            if(res.jData.iRet == 0){
                reserveNum = res.jData.rsvtNum;  //预约人数
                $("#reserveNum").text(reserveNum);
            }
            return;
        }
    };

    //点击立即预约
    $('#reserve-now3').on('touchend', function() {
        if(isLogin == true){
            if(isReserve == 1){  //已预约
                showDia('fixe_dimg_3');
            }else{
                showDia('fixe_dimg_2');
            }
        }else{
            showDia('fixe_dimg_1');
        }
    });

    //点击立即预约按钮
    $('#ljyy-btn').on('touchend', function() {
        // if(isLogin == true){
        //     var sPlatId = $("input[name='cp']:checked").val();
        //     var sMobile  = $('#tel').val();
        //     var sVftCode  = $('#uni').val();
        //     var inCode1 = $("#invcode").val();  //邀请码
            // if(sMobile == '') {
            //     alert('请输入您的手机号码');
            //     return;
            // }
            // if(!milo.isMobile(sMobile)) {
            //     alert('您输入的手机号码有误');
            //     return;
            // }
            // if(sVftCode == '') {
            //     alert('请输入验证码');
            //     return;
            // }
            // if(!isVercOde(sVftCode)) {
            //     alert('请输入正确的验证码');
            //     return;
            // }
            // if(inCode1 != ''){
            //     if(inCode1.length < 6 || inCode1.length > 10){
            //         alert('请输入正确的邀请码');
            //         return;
            //     }
            // }
            sData.sPlatId = sPlatId;
            sData.sVftCode = sVftCode;
            sData.sInviteCode = inCode1;
            sData.sMobile = sMobile;
            sData.iDevice = terminal;
            sData.head_img = encodeURIComponent(headPic);
            sData.nick_name = encodeURIComponent(nickName);
            amsCfg_427062.sData = sData;
            amsSubmit(133716,427062);
        // }else{
        //     showDia('fixe_dimg_1');
        // }
    });

    amsCfg_427062 = {  //保存预约信息
        "iActivityId": 133716, //活动id
        "iFlowId":    427062, //流程id
        "_everyRead" : true, // 每次都重读amsCfg_427062这个对象
        "sData":{},
        "fFlowSubmitEnd": function(res){
            $("#ltpanel_start").addClass("ltpanel_start");
            if(res.jData.iRet == 0){
                isReserve = 1;
                myCode = res.jData.myInviteCode;
                $("#reserveNum").text(parseInt(reserveNum)+parseInt(Math.random()*5));
                lotteryNum = lotteryNum+1;
                $("#lotteryNum").text(lotteryNum);
                shareFriend();
                showDia('fixe_dimg_4');
            }else if(res.jData.iRet == '-1012'){
                showDia('fixe_dimg_2');
                alert("你输入的邀请码不存在");
            }else{
                showDia('fixe_dimg_2');
                alert(decodeURIComponent(res.jData.errMsg));
            }
            return;
        }
    };

    //点击发送短信按钮
    $('#hqyzm').on('click', function() {
        if($(this).hasClass('disabled')){
            return false;
        }
        // if(isLogin == true){
            var sMobile  = $('#tel').val();
            if(sMobile == '') {
                alert('请输入您的手机号码');
                return;
            }
            if(!milo.isMobile(sMobile)) {
                alert('您输入的手机号码有误');
                return;
            }
            sData.sMobile = sMobile;
            amsCfg_427065.sData = sData;
            amsSubmit(133716,427065); //发送短信
        // }else{
        //     showDia('fixe_dimg_1');
        // }
    });

    amsCfg_427065 = {
        "iActivityId": 133716, //活动id
        "iFlowId":    427065, //流程id
        "_everyRead" : true, // 每次都重读amsCfg_427065这个对象
        "sData":{},
        "fFlowSubmitEnd": function(res){
            $('#hqyzm').addClass('disabled');
            showDia('fixe_dimg_2');
            if(res.jData.iRet < 0) {
                $("#hqyzm").removeClass('disabled');
                alert(decodeURIComponent(res.jData.errMsg));
            } else {
                dj = setInterval('daojishi()', 1000);	//开始倒计时
                alert('验证码已经发送到你的手机，请及时查收！');
            }
        }
    };

    //点击邀请好友
    $('#inviteFriend').on('touchend', function() {
        if(isLogin == true){
            if(isReserve == 1){  //已预约
                showDia('fixe_dimg_7');
            }else{
                showDia('fixe_dimg_15');
            }
        }else{
            showDia('fixe_dimg_1');
        }
    });

    //点击获得更多抽奖机会
    $('#spr-btn-more').on('click', function() {
        if(isLogin == true){
            if(isReserve == 1){  //已预约
                showDia('fixe_dimg_7');
            }else{
                showDia('fixe_dimg_15');
            }
        }else{
            showDia('fixe_dimg_1');
        }
    });

    //初始化抽奖对象的SWFOBJ
    //转盘的中心点坐标为（0,0））
    var SWFOBJo= new Lottery({
        'r':8,//奖品总数
        'width':'201',//flash宽度
        'height':'205',//flash高度
        'flashFirst':false,
        's':'//game.gtimg.cn/images/ysyy/cp/a20171225yym/pointer-num.png',//开始抽奖按钮图片
        'bx':0,//圆盘的图片位置x坐标 （转盘的中心点坐标为（0,0））
        'by':0,//圆盘的图片位置y坐标
        'sx':0,//开始抽奖按钮x坐标
        'sy':0,//开始抽奖按钮y坐标
        'contentId' : 'ltpanel',//嵌入swf 的div层的 id
        'onClickRollEvent' : callJsToStarto,//对应上面接口
        'onCompleteRollEvent':callJsToCompleteo //对应上面接口
    });

    var luckinfo = {
        '753728':0,//充电暖宝
        '753729':1,//哈士企福公仔
        '753733':2,// 谢谢参与
        '753730':3,//祈玉x88
        '753731':4,//金币x1888
        '753732':5,//书卷x2
        '753716':6,//CHANEL邂逅淡香水50ML
        '753679':7//IPHONE X
    };
    var packAgeName = {
        '753728':"充电暖宝",
        '753729':"哈士企福公仔",
        '753733':" 谢谢参与",
        '753730':"祈玉x88",
        '753731':"金币x1888",
        '753732':"书卷x2",
        '753716':"CHANEL邂逅淡香水50ML",
        '753679':"IPHONE X"
    };

    var iPackageId,luckid;

    function callJsToStarto(){
        // if(isLogin == true){
            if(isReserve == 0){
                showDia('fixe_dimg_15');
                $("#ltpanel_start").addClass("ltpanel_start");
                return;
            }
            amsCfg_427058.sData = sData;
            amsSubmit(133716,427058);
        // }else{
        //     showDia('fixe_dimg_2');
        // }
    }

    amsCfg_427058 = {
        'iAMSActivityId' : '133716', // AMS活动号
        'activityId' : '195653', // 模块实例号
        "sData": {},
        "_everyRead" : true,
        'onBeginGetGiftEvent' : function(){
            return 0; // 抽奖前事件，返回0表示成功
        },
        'onGetGiftFailureEvent' : function(callbackObj){// 抽奖失败事件
            $("#ltpanel_start").addClass("ltpanel_start");
            if(callbackObj.sMsg == '您的抽奖次数已全部用完'){  //达到30次
                showDia('fixe_dimg_17');
            }else if(callbackObj.sMsg == '每天最多5次'){ //今天达到5次
                showDia('fixe_dimg_10');
            }else if(callbackObj.sMsg == '您的抽奖次数已用完'){
                showDia('fixe_dimg_8');
            }else{
                LotteryManager.alert(callbackObj.sMsg);
            }
        },
        'onGetGiftSuccessEvent' : function(callbackObj){// 抽奖成功事件
            iPackageId= callbackObj.iPackageId;
            luckid = luckinfo[iPackageId];
            if(SWFOBJo)SWFOBJo.stopRoll(luckid);
        }
    };

    //3、flash动画完成通知js  flash->js
    function callJsToCompleteo(){
        SWFOBJo.enable();
        lotteryNum = lotteryNum-1;
        if(lotteryNum <0){
            lotteryNum=0;
        }
        $("#lotteryNum").text(lotteryNum);
        $("#packAgeName").text(packAgeName[iPackageId]);
        $("#packAgeName1").text(packAgeName[iPackageId]);
        if(luckid==0||luckid==1||luckid==6||luckid==7){ //实物记录
            showDia('fixe_dimg_12');
        }else if(luckid==2){
            showDia('fixe_dimg_9');
        }else{
            showDia('fixe_dimg_11');
        }
    }

    //点击填写信息按钮
    $('#btn-fillInfo').on('click', function () {
        // if (isLogin == true) {
            sData.iShow = 1;
            amsCfg_427060.sData = sData;
            amsSubmit(133716,427060); //实物提交
        // } else {
        //     showDia('fixe_dimg_1');
        // }
    });

    //提交个人信息
    amsCfg_427060 = {
        'iActivityId' : '133716', // AMS活动号
        'iFlowId' : '427060', // 流程号
        'sData':{},
        '_everyRead' : true,
        'success': function(res){ //提交成功的回调
            if (typeof res.jData == "object") { //返回已经提交的数据，填充页面
                need(["biz.provincecityselector", "util.form"], function (pcs, FormManager) {
                    //显示弹出框
                    showDia('fixe_dimg_13');
                    //提交按钮事件
                    g('personInfoContentBtn_407785').onclick = function () {
                        var name = $('#name').val();
                        var address = $("#addr").val();
                        var mobile = $('#tel2').val();
                        if (name == '') {
                            alert('请输入收件人');
                            return;
                        }
                        if (name.length > 20) {
                            alert('收件人的长度不能大于20');
                            return;
                        }
                        if (mobile == '') {
                            alert('请输入联系方式');
                            return;
                        }
                        if (!milo.isMobile(mobile)) {
                            alert('您输入的联系方式有误');
                            return;
                        }
                        if (address == '') {
                            alert('请输入收件地址');
                            return;
                        }
                        if (address.length > 100) {
                            alert('收件地址不能大于100');
                            return;
                        }
                        // if(isWeiXin){
                            amsCfg_427060.sData = {
                                'sName': name,
                                'sMobile': mobile,
                                'sAddress': address,
                                "appid": 'wxfa0c35392d06b82f', //腾讯游戏活动号的appid
                                "sArea": sArea,
                                "sServiceType":"txyxhdh",
                                "ams_appname":"TXYX_TO_GAME",	//openid_to_openid接口的应用名称，固定不变
                                "ams_targetappid": "wx1d0a2931e0e8a2b0" //需要进行openid转换的游戏业务appid，根据实际情况修改
                            };
                        // }else{
                        //     amsCfg_427060.sData = {
                        //         'appid': '1105999355',
                        //         'sName': name,
                        //         'sMobile': mobile,
                        //         'sAddress': address,
                        //         'sArea': sArea,
                        //         'sServiceType': 'ysyy'
                        //     };
                        // }
                        amsSubmit(133716,427060);//实物提交
                    };
                });
            } else {
                if (res.iRet == 0) {
                    showDiahide();
                    alert("提交成功");
                } else {
                    alert(res.sMsg);
                }
            }
        }
    };

    //点击查询抽奖记录
    $("#query_lottery_record").on('click',function(){
        // if (isLogin == true) {
            if(isReserve == 0){
                showDia('fixe_dimg_15');
                return;
            }else{
                amsCfg_427059.sData = sData;
                amsSubmit(133716,427059); //查看我的礼包
            }
        // }else{
        //     showDia('fixe_dimg_1');
        // }
    });

    // 个人获奖记录初始化
    amsCfg_427059 = {
        'iAMSActivityId' : '133716', // AMS活动号
        'iLotteryFlowId' : '427059', //  查询获奖轮播的流程号
        'activityId' : '195653', // 模块实例号
        'contentId' : 'getGiftContent_427059', //容器ID
        'templateId' : 'getGiftTemplate_427059', //模板ID
        'contentPageId' : 'getGiftPageContent_427059',	//分页容器ID
        'showContentId' : 'fixe_dimg_18', //弹出层ID
        'isForce' : true, //false 默认前端有缓存记录，如果需要每次都去后台查询，则改为true,
        'pageSize': 5
    };


    //点击QQ登录
    $("#btn-qq").on("click",function(){
        need("biz.login",function(){
            var UA = navigator.userAgent;
            var homePageQQ = window.location.protocol + "//ysyy.qq.com/cp/a20171225yym/index_wqm.html";
            if(!REGEXP_IOS_QQ.test(UA) && !REGEXP_ANDROID_QQ.test(UA)){
                setTimeout(function(){
                    window.location.href = 'mqqapi://forward/url?url_prefix=' + btoa(homePageQQ+"?_wv=1")+"&version=1&src_type=web";
                },200);
            }else{
                window.location.href=homePage+'?_wv=49957';
            }
        });
    });

    //点击微信登录
    $("#btn-wx").on("click",function(){
        if(ua.match(/MicroMessenger/i) == 'micromessenger'){
            //window.location.href = auth_url;
        }else{
            window.location.href = location.protocol+'//game.weixin.qq.com/cgi-bin/comm/openlink?noticeid=90126707&appid=wx1d0a2931e0e8a2b0&url=https%3A%2F%2Fysyy.qq.com%2Fcp%2Fa20171225yym%2Findex_wqm.html#wechat_redirect';
        }
    });

    function shareFriend(){
        var textName = '云裳羽衣官方正版手游，唯美预约心动开启~';
        var textDesc = '捏脸大触，换装达人！快来预约游戏，赢IPhoneX、香奈儿香水等多重壕礼！';
        var codeStr = myCode?'?inCode=' + myCode : '';
        var textLink = window.location.protocol+'//ysyy.qq.com/cp/a20171225yym/index_wqm.html' + codeStr;
        var textImg  = window.location.protocol+'//game.gtimg.cn/images/ysyy/cp/a20171225yym/share.png';
        if(sArea == '1'){
            need("biz.wxclient", function(WXClient){
                //微信客户初始化成功后，返回wx对象
                WXClient.init({"sAppId":"wxfeb5a65212da517c"},function(wx){
                    //分享用的信息对象
                    var shareObj={
                        title: textName,
                        desc: textDesc,
                        link: textLink,
                        imgUrl: textImg,
                        actName:"a20171225yym",//点击流命名
                        success: function (sres) {
                            PTTSendClick('btn','a20171225yym.wxshare','success');
                        },
                        cancel: function (sres) {
                            PTTSendClick('btn','a20171225yym.wxshare','cancel');
                        }
                    }
                    //为发送给好友、分享到朋友圈、分享到QQ、分享到微博同时绑定分享事件
                    WXClient.shareAll(shareObj);
                });
            });
        }else if(sArea == '2'){
            mqq.ui.setTitleButtons({left:{title:'',callback:''}, right:{title:'', hidden:false, iconID:4,callback:''}});
            mqq.ui.setOnShareHandler(function(type){
                mqq.ui.shareMessage({
                    share_url: textLink,
                    title: textName,
                    desc: textDesc,
                    image_url: textImg,
                    share_type:type
                }),
                    function(retCode){
                        PTTSendClick('btn','a20171225yym.qqshare','fenxiang');
                    };
            });
        }
    }
    shareFriend();


});