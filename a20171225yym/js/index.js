var sArea = isWeiXin() ? '1' : (isQQLogin() ? '2' : 2);
var sData = {};
var isLogin;
var isReserve = 0; //�Ƿ�ԤԼ  1-��ԤԼ 0-δԤԼ
var inviteCount = 0; //������ĺ�����
var myCode = ''; //�û�ר��������
var inCode = milo.request('inCode')||''; // ���ܵ�������
var reserveNum; //�ɹ�ԤԼ������
var lotteryNum = 0; //ʣ��ĳ齱����
var terminal = 1; //PC��δ0���ƶ���Ϊ1
var waitTime = 60;
var dj = null;
var ua = window.navigator.userAgent.toLowerCase();
var nickName; //�ǳ�
var headPic;
var REGEXP_IOS_QQ = /(iPad|iPhone|iPod).*? QQ\/([\d\.]+)/;
var REGEXP_ANDROID_QQ = /\bV1_AND_SQI?_([\d\.]+)(.*? QQ\/([\d\.]+))?/;
var homePage;
function isWeiXin(){   //΢�ŵ�¼
   if(ua.match(/MicroMessenger/i)=="micromessenger") {
       return true;
   } else {
       return false;
   }
}
function isWeiXin(){
    return /MicroMessenger/ig.test(navigator.userAgent);
}
function isQQLogin(){  //qq��¼
    var chkRes = false;
    mqq.device.isMobileQQ(function(result){
        chkRes = result;
    });
    return chkRes;
}
//��֤�뵹��ʱ
function daojishi() {
    if(waitTime == 0) {
        $("#hqyzm").removeClass('disabled');
        $("#hqyzm").text('������֤��');
        clearInterval(dj);
        waitTime = 60;
    } else {
        $("#hqyzm").text(waitTime+'��');
        waitTime--;
    }
}
//��֤��֤��
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
                    $("#login_text").text("���ã�"+nickName).show();
                });
                sData = {
                    "appid":'wx1cd4fbe9335888fe', //��Ѷ��Ϸ��ŵ�appid
                    "sArea":sArea,
                    "sServiceType":"txyxhdh",
                    "ams_appname":"TXYX_TO_GAME",	//openid_to_openid�ӿڵ�Ӧ�����ƣ��̶�����
                    "ams_targetappid":"wx1d0a2931e0e8a2b0"	//��Ҫ����openidת������Ϸҵ��appid������ʵ������޸�
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
            $("#login_text").text("���ã�"+nickName).show();
            amsCfg_427066.sData = sData;
            amsSubmit(133716,427066); //��ȡԤԼ��Ϣ
        }, function(){
            // if(isWeiXin()){//δ��¼ʱ΢���ڴ򿪻����΢����Ȩ
                LoginManager.loginByWX({
                    redirect_wx_url : "http://iu.qq.com/wxauth/redirect.html?url="+encodeURIComponent(homePage)//�ص�url
                });
            // }else if (isQQLogin()) {
            //     //QQ�ͻ�����תQQ��¼����
            //     LoginManager.login();
            // }else{
            //     amsCfg_427067.sData.appid = '1105999355'; //��ȡԤԼ����
            //     amsCfg_427067.sData.sArea = 2; //��ȡԤԼ����
            //     amsSubmit(133716,427067);
            // }
        },{
            appConfig: {
                WxAppId : 'wx1cd4fbe9335888fe', //��Ѷ��Ϸ���appid
                scope : 'snsapi_userinfo'  //snsapi_base��ȡ�û�openid��Ϣ��snsapi_userinfo���Ի�ȡ��ͼ���ǳ� �ȵ���Ϣ
            }
        });
    });

    amsCfg_427066 = {  //��ȡԤԼ��Ϣ
        "iActivityId": 133716, //�id
        "iFlowId":    427067, //����id
        "sData": {},
        "_everyRead" : true, // ÿ�ζ��ض�amsCfg_427066�������
        "fFlowSubmitEnd": function(res){
            if(res.jData.iRet == 0){
                isReserve = res.jData.rsvtStatus;  //�Ƿ�ԤԼ
                shareFriend();
                if(isReserve == 1){
                    myCode = res.jData.inviteCode;  //������
                    inviteCount = res.jData.inviteNum;  //��������
                    lotteryNum = parseInt(res.jData.extend1)-parseInt(res.jData.extend2); //ʣ��ĳ齱����
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
                reserveNum = res.jData.rsvtNum;  //ԤԼ����
                $("#inviteCount").text(inviteCount);
                $("#reserveNum").text(reserveNum);
                $("#lotteryNum").text(lotteryNum);
                //��ʾ�����˵�ͷ��
                list = res.jData.frdInfo.list;
                showHeadImgs();
                //ԤԼ��������չʾ
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

    amsCfg_427067 = {  //��ȡԤԼ����(δ��¼)
        "iActivityId": 133716, //�id
        "iFlowId":    427067, //����id
        "sData":{},
        "fFlowSubmitEnd": function(res){
            if(res.jData.iRet == 0){
                reserveNum = res.jData.rsvtNum;  //ԤԼ����
                $("#reserveNum").text(reserveNum);
            }
            return;
        }
    };

    //�������ԤԼ
    $('#reserve-now3').on('touchend', function() {
        if(isLogin == true){
            if(isReserve == 1){  //��ԤԼ
                showDia('fixe_dimg_3');
            }else{
                showDia('fixe_dimg_2');
            }
        }else{
            showDia('fixe_dimg_1');
        }
    });

    //�������ԤԼ��ť
    $('#ljyy-btn').on('touchend', function() {
        // if(isLogin == true){
        //     var sPlatId = $("input[name='cp']:checked").val();
        //     var sMobile  = $('#tel').val();
        //     var sVftCode  = $('#uni').val();
        //     var inCode1 = $("#invcode").val();  //������
            // if(sMobile == '') {
            //     alert('�����������ֻ�����');
            //     return;
            // }
            // if(!milo.isMobile(sMobile)) {
            //     alert('��������ֻ���������');
            //     return;
            // }
            // if(sVftCode == '') {
            //     alert('��������֤��');
            //     return;
            // }
            // if(!isVercOde(sVftCode)) {
            //     alert('��������ȷ����֤��');
            //     return;
            // }
            // if(inCode1 != ''){
            //     if(inCode1.length < 6 || inCode1.length > 10){
            //         alert('��������ȷ��������');
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

    amsCfg_427062 = {  //����ԤԼ��Ϣ
        "iActivityId": 133716, //�id
        "iFlowId":    427062, //����id
        "_everyRead" : true, // ÿ�ζ��ض�amsCfg_427062�������
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
                alert("������������벻����");
            }else{
                showDia('fixe_dimg_2');
                alert(decodeURIComponent(res.jData.errMsg));
            }
            return;
        }
    };

    //������Ͷ��Ű�ť
    $('#hqyzm').on('click', function() {
        if($(this).hasClass('disabled')){
            return false;
        }
        // if(isLogin == true){
            var sMobile  = $('#tel').val();
            if(sMobile == '') {
                alert('�����������ֻ�����');
                return;
            }
            if(!milo.isMobile(sMobile)) {
                alert('��������ֻ���������');
                return;
            }
            sData.sMobile = sMobile;
            amsCfg_427065.sData = sData;
            amsSubmit(133716,427065); //���Ͷ���
        // }else{
        //     showDia('fixe_dimg_1');
        // }
    });

    amsCfg_427065 = {
        "iActivityId": 133716, //�id
        "iFlowId":    427065, //����id
        "_everyRead" : true, // ÿ�ζ��ض�amsCfg_427065�������
        "sData":{},
        "fFlowSubmitEnd": function(res){
            $('#hqyzm').addClass('disabled');
            showDia('fixe_dimg_2');
            if(res.jData.iRet < 0) {
                $("#hqyzm").removeClass('disabled');
                alert(decodeURIComponent(res.jData.errMsg));
            } else {
                dj = setInterval('daojishi()', 1000);	//��ʼ����ʱ
                alert('��֤���Ѿ����͵�����ֻ����뼰ʱ���գ�');
            }
        }
    };

    //����������
    $('#inviteFriend').on('touchend', function() {
        if(isLogin == true){
            if(isReserve == 1){  //��ԤԼ
                showDia('fixe_dimg_7');
            }else{
                showDia('fixe_dimg_15');
            }
        }else{
            showDia('fixe_dimg_1');
        }
    });

    //�����ø���齱����
    $('#spr-btn-more').on('click', function() {
        if(isLogin == true){
            if(isReserve == 1){  //��ԤԼ
                showDia('fixe_dimg_7');
            }else{
                showDia('fixe_dimg_15');
            }
        }else{
            showDia('fixe_dimg_1');
        }
    });

    //��ʼ���齱�����SWFOBJ
    //ת�̵����ĵ�����Ϊ��0,0����
    var SWFOBJo= new Lottery({
        'r':8,//��Ʒ����
        'width':'201',//flash���
        'height':'205',//flash�߶�
        'flashFirst':false,
        's':'//game.gtimg.cn/images/ysyy/cp/a20171225yym/pointer-num.png',//��ʼ�齱��ťͼƬ
        'bx':0,//Բ�̵�ͼƬλ��x���� ��ת�̵����ĵ�����Ϊ��0,0����
        'by':0,//Բ�̵�ͼƬλ��y����
        'sx':0,//��ʼ�齱��ťx����
        'sy':0,//��ʼ�齱��ťy����
        'contentId' : 'ltpanel',//Ƕ��swf ��div��� id
        'onClickRollEvent' : callJsToStarto,//��Ӧ����ӿ�
        'onCompleteRollEvent':callJsToCompleteo //��Ӧ����ӿ�
    });

    var luckinfo = {
        '753728':0,//���ů��
        '753729':1,//��ʿ�󸣹���
        '753733':2,// лл����
        '753730':3,//����x88
        '753731':4,//���x1888
        '753732':5,//���x2
        '753716':6,//CHANEL���˵���ˮ50ML
        '753679':7//IPHONE X
    };
    var packAgeName = {
        '753728':"���ů��",
        '753729':"��ʿ�󸣹���",
        '753733':" лл����",
        '753730':"����x88",
        '753731':"���x1888",
        '753732':"���x2",
        '753716':"CHANEL���˵���ˮ50ML",
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
        'iAMSActivityId' : '133716', // AMS���
        'activityId' : '195653', // ģ��ʵ����
        "sData": {},
        "_everyRead" : true,
        'onBeginGetGiftEvent' : function(){
            return 0; // �齱ǰ�¼�������0��ʾ�ɹ�
        },
        'onGetGiftFailureEvent' : function(callbackObj){// �齱ʧ���¼�
            $("#ltpanel_start").addClass("ltpanel_start");
            if(callbackObj.sMsg == '���ĳ齱������ȫ������'){  //�ﵽ30��
                showDia('fixe_dimg_17');
            }else if(callbackObj.sMsg == 'ÿ�����5��'){ //����ﵽ5��
                showDia('fixe_dimg_10');
            }else if(callbackObj.sMsg == '���ĳ齱����������'){
                showDia('fixe_dimg_8');
            }else{
                LotteryManager.alert(callbackObj.sMsg);
            }
        },
        'onGetGiftSuccessEvent' : function(callbackObj){// �齱�ɹ��¼�
            iPackageId= callbackObj.iPackageId;
            luckid = luckinfo[iPackageId];
            if(SWFOBJo)SWFOBJo.stopRoll(luckid);
        }
    };

    //3��flash�������֪ͨjs  flash->js
    function callJsToCompleteo(){
        SWFOBJo.enable();
        lotteryNum = lotteryNum-1;
        if(lotteryNum <0){
            lotteryNum=0;
        }
        $("#lotteryNum").text(lotteryNum);
        $("#packAgeName").text(packAgeName[iPackageId]);
        $("#packAgeName1").text(packAgeName[iPackageId]);
        if(luckid==0||luckid==1||luckid==6||luckid==7){ //ʵ���¼
            showDia('fixe_dimg_12');
        }else if(luckid==2){
            showDia('fixe_dimg_9');
        }else{
            showDia('fixe_dimg_11');
        }
    }

    //�����д��Ϣ��ť
    $('#btn-fillInfo').on('click', function () {
        // if (isLogin == true) {
            sData.iShow = 1;
            amsCfg_427060.sData = sData;
            amsSubmit(133716,427060); //ʵ���ύ
        // } else {
        //     showDia('fixe_dimg_1');
        // }
    });

    //�ύ������Ϣ
    amsCfg_427060 = {
        'iActivityId' : '133716', // AMS���
        'iFlowId' : '427060', // ���̺�
        'sData':{},
        '_everyRead' : true,
        'success': function(res){ //�ύ�ɹ��Ļص�
            if (typeof res.jData == "object") { //�����Ѿ��ύ�����ݣ����ҳ��
                need(["biz.provincecityselector", "util.form"], function (pcs, FormManager) {
                    //��ʾ������
                    showDia('fixe_dimg_13');
                    //�ύ��ť�¼�
                    g('personInfoContentBtn_407785').onclick = function () {
                        var name = $('#name').val();
                        var address = $("#addr").val();
                        var mobile = $('#tel2').val();
                        if (name == '') {
                            alert('�������ռ���');
                            return;
                        }
                        if (name.length > 20) {
                            alert('�ռ��˵ĳ��Ȳ��ܴ���20');
                            return;
                        }
                        if (mobile == '') {
                            alert('��������ϵ��ʽ');
                            return;
                        }
                        if (!milo.isMobile(mobile)) {
                            alert('���������ϵ��ʽ����');
                            return;
                        }
                        if (address == '') {
                            alert('�������ռ���ַ');
                            return;
                        }
                        if (address.length > 100) {
                            alert('�ռ���ַ���ܴ���100');
                            return;
                        }
                        // if(isWeiXin){
                            amsCfg_427060.sData = {
                                'sName': name,
                                'sMobile': mobile,
                                'sAddress': address,
                                "appid": 'wxfa0c35392d06b82f', //��Ѷ��Ϸ��ŵ�appid
                                "sArea": sArea,
                                "sServiceType":"txyxhdh",
                                "ams_appname":"TXYX_TO_GAME",	//openid_to_openid�ӿڵ�Ӧ�����ƣ��̶�����
                                "ams_targetappid": "wx1d0a2931e0e8a2b0" //��Ҫ����openidת������Ϸҵ��appid������ʵ������޸�
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
                        amsSubmit(133716,427060);//ʵ���ύ
                    };
                });
            } else {
                if (res.iRet == 0) {
                    showDiahide();
                    alert("�ύ�ɹ�");
                } else {
                    alert(res.sMsg);
                }
            }
        }
    };

    //�����ѯ�齱��¼
    $("#query_lottery_record").on('click',function(){
        // if (isLogin == true) {
            if(isReserve == 0){
                showDia('fixe_dimg_15');
                return;
            }else{
                amsCfg_427059.sData = sData;
                amsSubmit(133716,427059); //�鿴�ҵ����
            }
        // }else{
        //     showDia('fixe_dimg_1');
        // }
    });

    // ���˻񽱼�¼��ʼ��
    amsCfg_427059 = {
        'iAMSActivityId' : '133716', // AMS���
        'iLotteryFlowId' : '427059', //  ��ѯ���ֲ������̺�
        'activityId' : '195653', // ģ��ʵ����
        'contentId' : 'getGiftContent_427059', //����ID
        'templateId' : 'getGiftTemplate_427059', //ģ��ID
        'contentPageId' : 'getGiftPageContent_427059',	//��ҳ����ID
        'showContentId' : 'fixe_dimg_18', //������ID
        'isForce' : true, //false Ĭ��ǰ���л����¼�������Ҫÿ�ζ�ȥ��̨��ѯ�����Ϊtrue,
        'pageSize': 5
    };


    //���QQ��¼
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

    //���΢�ŵ�¼
    $("#btn-wx").on("click",function(){
        if(ua.match(/MicroMessenger/i) == 'micromessenger'){
            //window.location.href = auth_url;
        }else{
            window.location.href = location.protocol+'//game.weixin.qq.com/cgi-bin/comm/openlink?noticeid=90126707&appid=wx1d0a2931e0e8a2b0&url=https%3A%2F%2Fysyy.qq.com%2Fcp%2Fa20171225yym%2Findex_wqm.html#wechat_redirect';
        }
    });

    function shareFriend(){
        var textName = '�������¹ٷ��������Σ�Ψ��ԤԼ�Ķ�����~';
        var textDesc = '�����󴥣���װ���ˣ�����ԤԼ��Ϸ��ӮIPhoneX�����ζ���ˮ�ȶ��غ���';
        var codeStr = myCode?'?inCode=' + myCode : '';
        var textLink = window.location.protocol+'//ysyy.qq.com/cp/a20171225yym/index_wqm.html' + codeStr;
        var textImg  = window.location.protocol+'//game.gtimg.cn/images/ysyy/cp/a20171225yym/share.png';
        if(sArea == '1'){
            need("biz.wxclient", function(WXClient){
                //΢�ſͻ���ʼ���ɹ��󣬷���wx����
                WXClient.init({"sAppId":"wxfeb5a65212da517c"},function(wx){
                    //�����õ���Ϣ����
                    var shareObj={
                        title: textName,
                        desc: textDesc,
                        link: textLink,
                        imgUrl: textImg,
                        actName:"a20171225yym",//���������
                        success: function (sres) {
                            PTTSendClick('btn','a20171225yym.wxshare','success');
                        },
                        cancel: function (sres) {
                            PTTSendClick('btn','a20171225yym.wxshare','cancel');
                        }
                    }
                    //Ϊ���͸����ѡ���������Ȧ������QQ������΢��ͬʱ�󶨷����¼�
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