window.onAuthSuccess = function (result) {
    console.log(result)
    authDoneHandler(result.name, result.phone);
        $('#myName').addClass('inputError');
    setTimeout(function () {
        window.alert('본인인증을 완료하였습니다');
    }, 1000)
}
window.onAuthFail = function (msg) {
    console.log(msg)
    window.alert(msg);
}

$(function () {
    areaConfig($('section.cityTab ul.appliUl li.cityCheck'), AREA_SEQ);

    listOrderChange();
    function toggleBtn(e){
        $(e).parent().addClass('hide');
        $(e).parent().siblings().removeClass('hide');
    }
    $('.certiBtn').click(openCheckPlus);
    // $('.certiBtn').click(function(){
    //     if($(this).parent().hasClass('reCert')){
    //         if( $('.certiBtn').siblings('input').val().length == 0){
    //             alert('휴대폰 번호를 입력해주세요.')
    //         }else{
    //             openCheckPlus();
    //             toggleBtn($(this))
    //         }
    //     }else{
    //         openCheckPlus();
    //         toggleBtn($(this))
    //     }
    //
    // });
    $('.submitReport button').click(function (e) {
        e.stopPropagation();
        e.preventDefault();
        let errorMsg = checkValidate();
        if(empty(errorMsg)) {
            saveReport();
        } else {
        errorMsgCheck();
            alert(errorMsg);
        }
    });
})



function listOrderChange() {
 var $cont = $(".appliUl"),
    $seoul = $cont.find('.area_seq-11');
 var temp = $seoul;
    $cont.prepend($seoul);

}

function areaConfig($li, initialSelected) {
    $li.find('a').click(function (e) {
        var $li = $(this).parent('li');
        var seq = $(this).attr('data-area_seq')
        var thisDesc =  listData.filter((item,i)=>item.seq == seq)
        var whenList = thisDesc[0].whenMap()
        var whereList = thisDesc[0].whereMap()
        $('.infoDayTwodepth.when ').empty()
        $('.infoDayTwodepth.where ').empty()
        e.preventDefault();
        e.stopPropagation();

        $li.parent().children().find('>a.cityBtn').removeClass('cityBtnAct');
        $li.parent().children().find('>a.cityBtn .radio-span').addClass('rdImgOff').removeClass('rdImg');
        $li.parent().find('.infoDay').hide();

        $li.find('>a.cityBtn').addClass('cityBtnAct');
        $li.find('>a.cityBtn .radio-span').removeClass('rdImgOff').addClass('rdImg');
        $li.find('.infoDay').fadeIn();
        whenList.map((item,i)=>{
            $('.infoDayTwodepth.when ').append('<p style="line-height: 1.5">'+item+'</p>')
        })
        whereList.map((item,i)=>{
            $('.infoDayTwodepth.where ').append('<p style="line-height: 1.5">'+item+'</p>')
        })

    });
    if (!empty(initialSelected)) {
        $('.appliUl .area_seq-' + initialSelected + " a").trigger("click");
    }

    // let $selected = $('.appliUl .area_seq-' + initialSelected)
    // $selected.find('>a.cityBtn').addClass('cityBtnAct');
    // $selected.find('>a.cityBtn .radio-span').removeClass('rdImgOff').addClass('rdImg');
    // $selected.find('.infoDay').fadeIn();

}

function authDoneHandler(name, phone) {
    $('#myName').val(name);
    $('#myPhone').val(phone);
    $('#ReqNumber').val(reqNumber || '');

    $('.reportTitle .phoneWrap.firstCert').addClass('hide');
    $('.reportTitle .reCert input').val(phone);
    $('.reportTitle .reCert').removeClass('hide');

    $.ajax({
        url: "/api1/ckps",
        type: "POST",
        data: {},
        success: function(response) {
            if (response.error == 0 && !empty(response.data) && !empty(response.data[0])) {
                reqNumber = response.data[0].reqNumber;
                $('form[name=form_chk] input[name=EncodeData]').val(response.data[0].sEncData);
            } else {
                reqNumber = null;
            }
        },
        error: function(xhr) {}
    });
}
function errorMsgCheck () {
    let result = getValue();
    if (empty(result.PHONE) || empty(result.NAME)) {
        $('#myName').addClass('inputError');
        return
    }
}
function getValue() {
    let result = {};
    result.PHONE = $('#myPhone').val();
    result.NAME = $('#myName').val();
    result.req = $('#ReqNumber').val();
    result.AREA_SEQ =$('.appliUl .cityBtn.cityBtnAct').data('area_seq');

    result.agree14 = $('#fourteenAge').prop('checked');
    result.agreeMydata = $('#myData').prop('checked');

    return result;
}

function checkValidate() {
    let result = getValue() || {};
    if (empty(result.PHONE) || empty(result.NAME)) {
        return '핸드폰 인증을 해주세요';
    }
    if (empty(result.AREA_SEQ)) {
        return '창업 설명회 참여 지역을 선택해주세요';
    }
    if (empty(result.agree14)) {
        return '만 14세 이상임을 확인해주세요'
    }
    if (empty(result.agreeMydata)) {
        return '개인정보 수집ㆍ이용에 동의헤주세요'
    }

    return false;
}

function saveReport() {
    $.ajax({
        url: "/api1/request/brief",
        type: "POST",
        data: getValue(),
        success: function(response) {
            if (response.error == 0) {
                window.alert('입력 내용을 확인했습니다. 실제 신청은 접수되지 않습니다.\n' +
                    '이 화면은 가상 브랜드 시연입니다.')
                location.href="daywell24-franchise-session.html";
            } else {
                alert('저장에 실패하였습니다. 잠시 후 다시 시도해주세요')
            }
        },
        error: function(xhr) {
            alert('저장에 실패하였습니다. 잠시 후 다시 시도해주세요')
        }
    });
}


function modalClose(target, event) {
    let modalTitle = $(target).parents('.modal').attr('data-value');

    if ($(target).attr('class') == 'modalConfirm') {
        console.log('동의함');
    } else {
        console.log('동의안함');
        for (
            let i = 0;
            i < document.getElementsByTagName('label').length;
            i++
        ) {
            if (
                document
                    .getElementsByTagName('label')
                    [i].getAttribute('for') == modalTitle
            ) {
                $(document.getElementsByTagName('label')[i])
                    .siblings('input')
                    .prop('checked', false);
            }
        }
    }
    $(target).parents('.modal').css({display: 'none'});
}
function agreeProcess(target, event) {
    let checkedList = $(target).siblings('li').children('input');
    let modalTitle = $(target).children('label').attr('for');
    let modalList = [];
    if ($(target).children('input').prop('checked') == true) {
        $(target).addClass('ckh');
    } else {
        $(target).removeClass('ckh');
    }
    for (
        let i = 0;
        i < document.getElementsByTagName('div').length;
        i++
    ) {
        if (
            document
                .getElementsByTagName('div')
                [i].getAttribute('data-value') == modalTitle
        ) {
            if ($(target).hasClass('ckh')) {
                document.getElementsByTagName('div')[i].style =
                    'display:block';
                modalList.push(
                    document.getElementsByTagName('div')[i],
                );
            } else {
                document.getElementsByTagName('div')[i].style =
                    'display:none';
            }
        }
    }
    console.log(modalList);
    if ($(target).children('label').attr('for') == 'allCheck') {
        if ($(target).children('input').prop('checked') == true) {
            checkedList.prop('checked', true);
        } else {
            checkedList.prop('checked', false);
        }
    } else {
    }
}