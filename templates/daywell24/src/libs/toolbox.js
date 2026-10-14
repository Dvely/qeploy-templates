window.getClass = function (obj) {
    if (typeof obj === "undefined")
        return false;
    if (obj === null)
        return false;
    return Object.prototype.toString.call(obj)
        .match(/^\[object\s(.*)\]$/)[1];
};

window.isObject = function (obj) {
    return (obj !== null && typeof obj === 'object');
};

String.prototype.upperFirstLetter = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

Date.prototype.daydiff = function (dt) {
    var a = new Date(this.getTime()), b = new Date(dt.getTime());
    a.setHours(0, 0, 0, 0); b.setHours(0, 0, 0, 0);
    var timeDiff = Math.abs(b.getTime() - a.getTime());
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
}

Date.prototype.timediff = function (dt) {return this.getTime() - dt.getTime();};

if (!String.prototype.format) {
    String.prototype.format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
                ;
        });
    };
}


Array.prototype.hasObject = (
    !Array.indexOf ? function (o)
    {
        var l = this.length + 1;
        while (l -= 1)
        {
            if (this[l - 1] === o)
            {
                return true;
            }
        }
        return false;
    } : function (o)
    {
        return (this.indexOf(o) !== -1);
    }
);

Array.prototype.indexValueOf = function (val) {
    for(var i in this) {
        if (this.hasOwnProperty(i)) {
            if (val == this[i]) {
                return i;
            }
        }
    }
    return -1;
}

Array.prototype.shuffle = function () {
    let currentIndex = this.length,  randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [this[currentIndex], this[randomIndex]] = [this[randomIndex], this[currentIndex]];
    }

    return this;
}

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            size ++;
        }
    }

    return size;
};


window.each = function (objOrArr, callback, reverse) {
    if (!objOrArr) {
        return;
    }
    var keys = Object.keys(objOrArr);
    reverse = reverse || false;
    if (objOrArr instanceof Array) {
        if (reverse) {
            keys.reverse();
        }
    } else {
        if (reverse) {
            keys.sort().reverse();
        } else {
            keys.sort();
        }
    }

    for(var i in keys) {
        if (objOrArr.hasOwnProperty(keys[i])) {
            if (callback(keys[i], objOrArr[keys[i]]) === false) {
                break;
            }
        }
    }
};


window.isArray = function (o) {
    return Object.prototype.toString.call(o) === '[object Array]';
};

window.isNumeric = function (input) {
    return (input - 0) == input && (input+'').replace(/^\s+|\s+$/g, "").length > 0;
};

window.isString = function (input) {
    return (typeof input === 'string' || input instanceof String)
}

window.empty = function (mixed_var) {
    var key;
    if (mixed_var === "" ||
        mixed_var === 0 ||
        mixed_var === "0" ||
        mixed_var === null ||
        mixed_var === false ||
        ((typeof mixed_var === 'number') && isNaN(mixed_var)) ||
        typeof mixed_var === 'undefined')
    {
        return true;
    }
    if (mixed_var instanceof Date) {
        return false;
    }
    if (typeof mixed_var == 'object')
    {
        for (key in mixed_var)
        {
            if (mixed_var.hasOwnProperty(key)) {
                return false;
            }
        }
        return true;
    }

    return false;
};

window.leavePhoneNumber = function (text) {
    return text.replace(/\D+/g, '');
};

window.checkDigit = function (num) {
    var Digit = "1234567890";
    var string = num;
    var len = string.length
    var retVal = "";

    for (var i = 0; i < len; i++)
    {
        if (Digit.indexOf(string.substring(i, i+1)) >= 0)
        {
            retVal = retVal + string.substring(i, i+1);
        }
    }
    return retVal;
};

function GetMsgLen(sMsg) { // 0-127 1byte, 128~ 2byte
    var count = 0
    for(var i=0; i<sMsg.length; i++) {
        if ( sMsg.charCodeAt(i) > 127 ) {
            count += 2
        }
        else {
            count++
        }
    }
    return count
}

window.phoneNumberMinus = function(sMsg) {
    var onlynum = window.leavePhoneNumber(sMsg);  //하이픈 입력시 자동으로 삭제함
    onlynum =  checkDigit(onlynum);  // 숫자만 입력받게 함
    var retValue = "";

    if(onlynum.substring(0,2) == '02') {  // 서울전화번호일 경우  10자리까지만 나타나교 그 이상의 자리수는 자동삭제
        if (GetMsgLen(onlynum) <= 1) retValue = onlynum ;
        if (GetMsgLen(onlynum) == 2) retValue = onlynum + "-";
        if (GetMsgLen(onlynum) == 4) retValue = onlynum.substring(0,2) + "-" + onlynum.substring(2,3) ;
        if (GetMsgLen(onlynum) == 4) retValue = onlynum.substring(0,2) + "-" + onlynum.substring(2,4) ;
        if (GetMsgLen(onlynum) == 5) retValue = onlynum.substring(0,2) + "-" + onlynum.substring(2,5) ;
        if (GetMsgLen(onlynum) == 6) retValue = onlynum.substring(0,2) + "-" + onlynum.substring(2,6) ;
        if (GetMsgLen(onlynum) == 7) retValue = onlynum.substring(0,2) + "-" + onlynum.substring(2,5) + "-" + onlynum.substring(5,7) ; ;
        if (GetMsgLen(onlynum) == 8) retValue = onlynum.substring(0,2) + "-" + onlynum.substring(2,6) + "-" + onlynum.substring(6,8) ;
        if (GetMsgLen(onlynum) == 9) retValue = onlynum.substring(0,2) + "-" + onlynum.substring(2,5) + "-" + onlynum.substring(5,9) ;
        if (GetMsgLen(onlynum) == 10) retValue = onlynum.substring(0,2) + "-" + onlynum.substring(2,6) + "-" + onlynum.substring(6,10) ;
        if (GetMsgLen(onlynum) == 11) retValue = onlynum.substring(0,2) + "-" + onlynum.substring(2,6) + "-" + onlynum.substring(6,10) ;
        if (GetMsgLen(onlynum) == 12) retValue = onlynum.substring(0,2) + "-" + onlynum.substring(2,6) + "-" + onlynum.substring(6,10) ;
    } else if(onlynum.substring(0,2) == '05' ) {  // 05로 시작되는 번호 체크
        if(onlynum.substring(2,3) == 0 ) {  // 050으로 시작되는지 따지기 위한 조건문
            if (GetMsgLen(onlynum) <= 3) retValue = onlynum ;
            if (GetMsgLen(onlynum) == 4) retValue = onlynum + "-";
            if (GetMsgLen(onlynum) == 5) retValue = onlynum.substring(0,4) + "-" + onlynum.substring(4,5) ;
            if (GetMsgLen(onlynum) == 6) retValue = onlynum.substring(0,4) + "-" + onlynum.substring(4,6) ;
            if (GetMsgLen(onlynum) == 7) retValue = onlynum.substring(0,4) + "-" + onlynum.substring(4,7) ;
            if (GetMsgLen(onlynum) == 8) retValue = onlynum.substring(0,4) + "-" + onlynum.substring(4,8) ;
            if (GetMsgLen(onlynum) == 9) retValue = onlynum.substring(0,4) + "-" + onlynum.substring(4,7) + "-" + onlynum.substring(7,9) ; ;
            if (GetMsgLen(onlynum) == 10) retValue = onlynum.substring(0,4) + "-" + onlynum.substring(4,8) + "-" + onlynum.substring(8,10) ;
            if (GetMsgLen(onlynum) == 11) retValue = onlynum.substring(0,4) + "-" + onlynum.substring(4,7) + "-" + onlynum.substring(7,11) ;
            if (GetMsgLen(onlynum) == 12) retValue = onlynum.substring(0,4) + "-" + onlynum.substring(4,8) + "-" + onlynum.substring(8,12) ;
            if (GetMsgLen(onlynum) == 13) retValue = onlynum.substring(0,4) + "-" + onlynum.substring(4,8) + "-" + onlynum.substring(8,12) ;
        } else {
            if (GetMsgLen(onlynum) <= 2) retValue = onlynum ;
            if (GetMsgLen(onlynum) == 3) retValue = onlynum + "-";
            if (GetMsgLen(onlynum) == 4) retValue = onlynum.substring(0,3) + "-" + onlynum.substring(3,4) ;
            if (GetMsgLen(onlynum) == 5) retValue = onlynum.substring(0,3) + "-" + onlynum.substring(3,5) ;
            if (GetMsgLen(onlynum) == 6) retValue = onlynum.substring(0,3) + "-" + onlynum.substring(3,6) ;
            if (GetMsgLen(onlynum) == 7) retValue = onlynum.substring(0,3) + "-" + onlynum.substring(3,7) ;
            if (GetMsgLen(onlynum) == 8) retValue = onlynum.substring(0,3) + "-" + onlynum.substring(3,6) + "-" + onlynum.substring(6,8) ; ;
            if (GetMsgLen(onlynum) == 9) retValue = onlynum.substring(0,3) + "-" + onlynum.substring(3,7) + "-" + onlynum.substring(7,9) ;
            if (GetMsgLen(onlynum) == 10) retValue = onlynum.substring(0,3) + "-" + onlynum.substring(3,6) + "-" + onlynum.substring(6,10) ;
            if (GetMsgLen(onlynum) == 11) retValue = onlynum.substring(0,3) + "-" + onlynum.substring(3,7) + "-" + onlynum.substring(7,11) ;
            if (GetMsgLen(onlynum) == 12) retValue = onlynum.substring(0,3) + "-" + onlynum.substring(3,7) + "-" + onlynum.substring(7,11) ;
        }
    } else if(onlynum.substring(0,2) == '03' || onlynum.substring(0,2) == '04'  || onlynum.substring(0,2) == '06'  || onlynum.substring(0,2) == '07'  || onlynum.substring(0,2) == '08' ) {  // 서울전화번호가 아닌 번호일 경우(070,080포함 // 050번호가 문제군요)
        if (GetMsgLen(onlynum) <= 2) retValue = onlynum ;
        if (GetMsgLen(onlynum) == 3) retValue = onlynum + "-";
        if (GetMsgLen(onlynum) == 4) retValue = onlynum.substring(0,3) + "-" + onlynum.substring(3,4) ;
        if (GetMsgLen(onlynum) == 5) retValue = onlynum.substring(0,3) + "-" + onlynum.substring(3,5) ;
        if (GetMsgLen(onlynum) == 6) retValue = onlynum.substring(0,3) + "-" + onlynum.substring(3,6) ;
        if (GetMsgLen(onlynum) == 7) retValue = onlynum.substring(0,3) + "-" + onlynum.substring(3,7) ;
        if (GetMsgLen(onlynum) == 8) retValue = onlynum.substring(0,3) + "-" + onlynum.substring(3,6) + "-" + onlynum.substring(6,8) ; ;
        if (GetMsgLen(onlynum) == 9) retValue = onlynum.substring(0,3) + "-" + onlynum.substring(3,7) + "-" + onlynum.substring(7,9) ;
        if (GetMsgLen(onlynum) == 10) retValue = onlynum.substring(0,3) + "-" + onlynum.substring(3,6) + "-" + onlynum.substring(6,10) ;
        if (GetMsgLen(onlynum) == 11) retValue = onlynum.substring(0,3) + "-" + onlynum.substring(3,7) + "-" + onlynum.substring(7,11) ;
        if (GetMsgLen(onlynum) == 12) retValue = onlynum.substring(0,3) + "-" + onlynum.substring(3,7) + "-" + onlynum.substring(7,11) ;

    }else if(onlynum.substring(0,2) == '01') {  //휴대폰일 경우
        if (GetMsgLen(onlynum) <= 2) retValue = onlynum ;
        if (GetMsgLen(onlynum) == 3) retValue = onlynum + "-";
        if (GetMsgLen(onlynum) == 4) retValue = onlynum.substring(0,3) + "-" + onlynum.substring(3,4) ;
        if (GetMsgLen(onlynum) == 5) retValue = onlynum.substring(0,3) + "-" + onlynum.substring(3,5) ;
        if (GetMsgLen(onlynum) == 6) retValue = onlynum.substring(0,3) + "-" + onlynum.substring(3,6) ;
        if (GetMsgLen(onlynum) == 7) retValue = onlynum.substring(0,3) + "-" + onlynum.substring(3,7) ;
        if (GetMsgLen(onlynum) == 8) retValue = onlynum.substring(0,3) + "-" + onlynum.substring(3,7) + "-" + onlynum.substring(7,8) ;
        if (GetMsgLen(onlynum) == 9) retValue = onlynum.substring(0,3) + "-" + onlynum.substring(3,7) + "-" + onlynum.substring(7,9) ;
        if (GetMsgLen(onlynum) == 10) retValue = onlynum.substring(0,3) + "-" + onlynum.substring(3,6) + "-" + onlynum.substring(6,10) ;
        if (GetMsgLen(onlynum) == 11) retValue = onlynum.substring(0,3) + "-" + onlynum.substring(3,7) + "-" + onlynum.substring(7,11) ;
        if (GetMsgLen(onlynum) == 12) retValue = onlynum.substring(0,3) + "-" + onlynum.substring(3,7) + "-" + onlynum.substring(7,11) ;
    } else if(onlynum.substring(0,1) == 1) {  // 1588, 1688등의 번호일 경우
        if (GetMsgLen(onlynum) <= 3) retValue = onlynum ;
        if (GetMsgLen(onlynum) == 4) retValue = onlynum + "-";
        if (GetMsgLen(onlynum) == 5) retValue = onlynum.substring(0,4) + "-" + onlynum.substring(4,5) ;
        if (GetMsgLen(onlynum) == 6) retValue = onlynum.substring(0,4) + "-" + onlynum.substring(4,6) ;
        if (GetMsgLen(onlynum) == 7) retValue = onlynum.substring(0,4) + "-" + onlynum.substring(4,7) ;
        if (GetMsgLen(onlynum) == 8) retValue = onlynum.substring(0,4) + "-" + onlynum.substring(4,8) ;
        if (GetMsgLen(onlynum) == 9) retValue = onlynum.substring(0,4) + "-" + onlynum.substring(4,8) ;
        if (GetMsgLen(onlynum) == 10) retValue = onlynum.substring(0,4) + "-" + onlynum.substring(4,8) ;
        if (GetMsgLen(onlynum) == 11) retValue = onlynum.substring(0,4) + "-" + onlynum.substring(4,8) ;
        if (GetMsgLen(onlynum) == 12) retValue = onlynum.substring(0,4) + "-" + onlynum.substring(4,8) ;
    }
    if (retValue.length) {
        return retValue;
    } else {
        return onlynum;
    }

}

window.parseUrlQueryString = function (_search) {
    var query_string = {}, query = '';
    if (empty(_search)) {
        return {};
    } else {
        query = _search || '';
    }

    // var query = _search || realLocation.search.substring(1) || window.location.search.substring(1);
    // var query = _search || realLocation.search.substring(1) || window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        // If first entry with this name
        if (typeof query_string[pair[0]] === "undefined") {
            query_string[pair[0]] = pair[1];
            // If second entry with this name
        } else if (typeof query_string[pair[0]] === "string") {
            var arr = [ query_string[pair[0]], pair[1] ];
            query_string[pair[0]] = arr;
            // If third or later entry with this name
        } else {
            query_string[pair[0]].push(pair[1]);
        }
    }
    return query_string;
};

//http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
window.isValidEmail = function (email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
};
window.isValidPhone = function (phone) {
    var re = /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})-?[0-9]{3,4}-?[0-9]{4}$/;
    return re.test(phone);
};
window.isValidPassword = function (pwd) {
    //  http://stackoverflow.com/questions/12090077/javascript-regular-expression-password-validation-having-special-characters

    // var re = /^(?=.*\d)(?=.*[!@#$%^&*\(\)])(?=.*[a-z])(?=.*[A-Z])[\w!@#$%^&*\(\)]{6,16}$/;
    var re = /^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z0-9!#$%&? "]{8,16}$/i;
    return re.test(pwd);
};

window.isValidURL = function(str) {
    var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
    return regexp.test(str);
}

window.fillzero = function (num, len) {
    num= '000000000000000'+num;
    return num.substring(num.length-len);
};

window.commify = function (n) {
    var reg = /(^[+-]?\d+)(\d{3})/;   // 정규식


    var prefix = '';
    if (n > 999999) {
        n = 999999;
        prefix = '+';
    }

    n += '';                          // 숫자를 문자열로 변환
    while (reg.test(n))
        n = n.replace(reg, '$1' + ',' + '$2');

    return n + prefix;
};


window.nl2br = function (str, is_xhtml) {
    var breakTag = (is_xhtml === true) ? '<br />' : '<br>';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
};


window.imageNice = function (dataURI, handler, config) {
    config = config || {};

    var updateResults = function (img) {
        var href = img.src;
        var dataURLStart;
        var imageType = config.imageType || 'image/jpg';

        if (!(img.src || img instanceof HTMLCanvasElement)) {
            handler(null);
        } else {
            if (!href) {
                href = img.toDataURL(imageType)
                dataURLStart = 'data:' + imageType;

                if (href.slice(0, dataURLStart.length) !== dataURLStart) {
                    handler(href);
                } else {
                    handler(href);
                }
            }
        }
    }, options = {
        // maxWidth: config.width || 300,
        canvas: true,
        pixelRatio: window.devicePixelRatio,
        orientation: true
    }
    if (config.width) {
        options.maxWidth = config.width;
    }

    if (!loadImage(window.dataURItoBlob(dataURI), updateResults, options)) {
        handler(null);
    }
}

// window.imageUploader = function ($uploadBtn, handler) {
window.imageUploader = function (config, handler) {
    var $uploadBtn = config.$uploadBtn,
        currentFile,
        updateResults = function (img, data) {
            var fileName = currentFile.name
            var href = img.src
            var dataURLStart
            var content
            if (!(img.src || img instanceof HTMLCanvasElement)) {
                // console.log('error2');
                console.log(href);
            } else {
                console.log(href);
                if (!href) {
                    href = img.toDataURL(currentFile.type)
                    // href = img.toDataURL(currentFile.type + 'REMOVEME')
                    dataURLStart = 'data:' + currentFile.type
                    console.log(href);
                    if (href.slice(0, dataURLStart.length) !== dataURLStart) {
                        fileName = fileName.replace(/\.\w+$/, '.png')
                        handler(href, fileName);
                    } else {
                        handler(href);
                    }
                }
            }
        }
    var options = {
        // maxWidth: 300,
        maxWidth: config.width || 300,
        canvas: true,
        pixelRatio: window.devicePixelRatio,
        downsamplingRatio: 0.5,
        orientation: true
    }

    if (typeof $uploadBtn.get === 'function') {
        currentFile = $uploadBtn.get(0)
    } else {
        currentFile = $uploadBtn[0];
    }

    $uploadBtn.attr('accept', 'image/*');
    if (currentFile) {
        $uploadBtn.change(function (e) {
            var target = e.dataTransfer || e.target
            var file = target && target.files && target.files[0]
            currentFile = file;
            if (!loadImage(file, updateResults, options)) {
                // console.log('error');
            }

            // reader.readAsDataURL(file.files[0]);
        });
        return true;
    } else {
        return false;
    }
};


//  https://stackoverflow.com/questions/12168909/blob-from-dataurl
window.dataURItoBlob = function(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);

    // create a view into the buffer
    var ia = new Uint8Array(ab);

    // set the bytes of the buffer to the correct values
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    var blob = new Blob([ab], {type: mimeString});
    return blob;
}

window.comp2jpeg = function ($comp, handler, renderer) {
    if (!$comp.length) {
        return false;
    }

    _APP.showPreloader(i18n.ui.paper.labelCreatingImage);
    var w = 800;
    var h = 600;
    var canvas = document.createElement('canvas');
    var radio = window.devicePixelRatio || 1,
        // var radio = 1,
        $parent = $comp.parent(),
        $clone = $parent.clone(),
        // orginalW = $comp.width(), orginalH = $comp.height();
        orginalW = $clone.width(), orginalH = $clone.height();

    // $clone.css({'box-sizing': 'border-box'});
    $clone.width(w);
    $clone.height(w);
    $clone.prependTo($('body'));
    if (typeof renderer === 'function') {
        renderer($clone);
    }

    canvas.width = w * radio;
    canvas.height = h * radio;
    // canvas.style.width = w + 'px';
    // canvas.style.height = h + 'px';
    var context = canvas.getContext('2d');
    context.webkitImageSmoothingEnabled = false;
    context.mozImageSmoothingEnabled = false;
    context.imageSmoothingEnabled = false;
    context.scale(radio, radio);
    // html2Canvas($clone, {
    //     canvas: canvas,
    //     onrendered: function(canvas) {
    //         // Convert and download as image
    //         if (typeof handler === 'function') {
    //             handler(canvas2Image.convertToJPEGData(canvas));
    //         }
    //         // $("#img-out").append(canvas);
    //         // Clean up
    //         // document.body.removeChild(canvas);
    //         $clone.remove();
    //         _APP.hidePreloader();
    //     }
    // });
}

window.resizeImage = function(dataUrl, maxWidth, maxHeight, handler) {
    var img = document.createElement("img");
    img.src = dataUrl;

    img.onload = function () {
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        var MAX_WIDTH = maxWidth;
        var MAX_HEIGHT = maxHeight;
        var width = img.width;
        var height = img.height;

        if (width > height) {
            if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
            }
        } else {
            if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
            }
        }
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // return canvas.toDataURL("image/png");
        handler(canvas.toDataURL("image/jpg"))
    }
}


window.mobilecheck = function() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};

function drawPaging(page, length, total, handler, klass) {
    let $target = $(klass);

    if (empty(total)) {
        $target.hide();
        return;
    }
    //  일단 한번 그린다.
    if(window.innerWidth > 744) {
        let $page = drawPaging10(page, length, total, handler);
        $page.insertBefore($target);
        $target.remove();
    } else {
        let $page = drawPaging5(page, length, total, handler);
        $page.insertBefore($target);
        $target.remove();
    }

    //  리사이징에 대해서 예약한다.
    var timer =null;
    window.addEventListener('resize',function() {
        clearTimeout(timer);
        timer = setTimeout(function() {
            let $target = $(klass);
            if(window.innerWidth > 744) {
                let $page = drawPaging10(page, length, total, handler);
                $page.insertBefore($target);
                $target.remove();
            } else {
                let $page = drawPaging5(page, length, total, handler);
                $page.insertBefore($target);
                $target.remove();
            }
        }, 300)
    })
}

function drawPaging10(page, length, total, handler) {
    let basePage = Math.floor((page - 1) / 10) * 10 + 1;
    let totalPage = Math.ceil(total / length);
    page = parseInt(page);

    let $cont = $('<div class="pageNationWrap"><div class="prevButtons"></div><ul class="pageNation"></ul><div class="nextButtons"></div></div>');
    if (parseInt(basePage) > 10) {
        $('<div class="doublePrev"><img src="assets/assets/imgs/blankImg.png" alt="10페이지 전"/></div>').appendTo($cont.find('.prevButtons')).click(function () {
            handler(basePage - 10)
        });
    } else {
        $('<div class="doublePrev" style="opacity: 0.3;"><img src="assets/assets/imgs/blankImg.png" alt="10페이지 전"/></div>').appendTo($cont.find('.prevButtons'))
    }
    if (parseInt(page) > 1) {
        $('<div class="prev"><img src="assets/assets/imgs/blankImg.png" alt="1페이지 전"/></div>').appendTo($cont.find('.prevButtons')).click(function () {
            handler(page - 1)
        });
    } else {
        $('<div class="prev" style="opacity: 0.3;"><img src="assets/assets/imgs/blankImg.png" alt="1페이지 전"/></div>').appendTo($cont.find('.prevButtons'))
    }
    if (parseInt(page) + 1 <= totalPage) {
        $('<div class="next"><img src="assets/assets/imgs/blankImg.png" alt="1페이지 후" /></div>').appendTo($cont.find('.nextButtons')).click(function () {
            handler(page + 1)
        });
    } else {
        $('<div class="next" style="opacity: 0.3;"><img src="assets/assets/imgs/blankImg.png" alt="1페이지 후" /></div>').appendTo($cont.find('.nextButtons'))
    }
    if (parseInt(basePage) + 10 <= totalPage) {
        $('<div class="doubleNext"><img src="assets/assets/imgs/blankImg.png" alt="10페이지 후" /></div>').appendTo($cont.find('.nextButtons')).click(function () {
            handler(basePage + 10)
        });
    } else {
        $('<div class="doubleNext" style="opacity: 0.3;"><img src="assets/assets/imgs/blankImg.png" alt="10페이지 후" /></div>').appendTo($cont.find('.nextButtons'))
    }

    for (let pageNumber = basePage; pageNumber < basePage + 10; pageNumber ++) {
        if (pageNumber <= totalPage) {
            let $page = $('<li class="pIndex"><span>' + pageNumber + '</span></li>').appendTo($cont.find('.pageNation')).click(function () {
                handler(pageNumber)
            });
            if (page == pageNumber) {
                $page.addClass('focus');
            }
        }
    }

    return $cont;
}

function drawPaging5(page, length, total, handler) {
    let basePage = page - 1;
    let totalPage = Math.ceil(total / length);
    if (basePage > totalPage - 2) {
        basePage = totalPage - 2;
    }
    if (basePage < 1) {
        basePage = 1;
    }
    page = parseInt(page);
    let $cont = $('<div class="pageNationWrap"><div class="prevButtons"></div><ul class="pageNation"></ul><div class="nextButtons"></div></div>');
    if (page > 1) {
        $('<div class="prev"><img src="assets/assets/imgs/blankImg.png" alt="10페이지 전"/></div>').appendTo($cont.find('.prevButtons')).click(function () {
            handler(page - 1)
        });
    } else {
        $('<div class="prev" style="opacity: 0.3;"><img src="assets/assets/imgs/blankImg.png" alt="10페이지 전"/></div>').appendTo($cont.find('.prevButtons'));
    }
    if (page + 1 <= totalPage) {
        $('<div class="next"><img src="assets/assets/imgs/blankImg.png" alt="10페이지 후" /></div>').appendTo($cont.find('.nextButtons')).click(function () {
            handler(page + 1)
        });
    } else {
        $('<div class="next" style="opacity: 0.3;"><img src="assets/assets/imgs/blankImg.png" alt="10페이지 후"/></div>').appendTo($cont.find('.nextButtons'))
    }

    for (let pageNumber = basePage; pageNumber < basePage + 3; pageNumber ++) {
        if (pageNumber <= totalPage) {
            let $page = $('<li class="pIndex"><span>' + pageNumber + '</span></li>').appendTo($cont.find('.pageNation')).click(function () {
                handler(pageNumber)
            });
            if (page == pageNumber) {
                $page.addClass('focus');
            }
        }
    }

    return $cont;
}
// function drawPaging5(page, length, total, handler) {
//     let basePage = Math.floor((page - 1) / 3) * 3 + 1;
//     let totalPage = Math.ceil(total / length);
//
//     let $cont = $('<div class="pageNationWrap"><div class="prevButtons"></div><ul class="pageNation"></ul><div class="nextButtons"></div></div>');
//     if (page > 1) {
//         $('<div class="prev"><img src="assets/assets/imgs/blankImg.png" alt="10페이지 전"/></div>').appendTo($cont.find('.prevButtons')).click(function () {
//             handler(page - 1)
//         });
//     } else {
//         $('<div class="prev" style="opacity: 0.3;"><img src="assets/assets/imgs/blankImg.png" alt="10페이지 전"/></div>').appendTo($cont.find('.prevButtons'));
//     }
//     if (page + 1 <= totalPage) {
//         $('<div class="next"><img src="assets/assets/imgs/blankImg.png" alt="10페이지 후" /></div>').appendTo($cont.find('.nextButtons')).click(function () {
//             handler(page + 1)
//         });
//     } else {
//         $('<div class="next" style="opacity: 0.3;"><img src="assets/assets/imgs/blankImg.png" alt="10페이지 후"/></div>').appendTo($cont.find('.nextButtons'))
//     }
//
//     for (let pageNumber = basePage; pageNumber < basePage + 3; pageNumber ++) {
//         if (pageNumber <= totalPage) {
//             let $page = $('<li class="pIndex"><span>' + pageNumber + '</span></li>').appendTo($cont.find('.pageNation')).click(function () {
//                 handler(pageNumber)
//             });
//             if (page == pageNumber) {
//                 $page.addClass('focus');
//             }
//         }
//     }
//
//     return $cont;
// }


const fileUpload = function ($file, onChange, maxFileCnt) {
    const p = {};
    const allFiles = {};

    maxFileCnt = maxFileCnt || 5;
    p.fileAdd = function (fileObj, fileName) {
        allFiles[fileName.replace(/^.*[\\\/]/, '')] = fileObj;
        if (typeof onChange === 'function') {
            onChange();
        }
    }

    $file.change(function (e) {
        const files = e.target.files;
        let errorExist = false;
        for(let i = 0; i < files.length; i ++) {
            if ((Object.size(allFiles) + files.length) > maxFileCnt) {
                window.alert('첨부파일은 최대 5개 까지 등록이 가능합니다.')
                errorExist = true;
                break;
            }
            if (files[i]?.size > 10485760) {
                window.alert('10M 이하의 파일만 등록 가능합니다.')
                errorExist = true;
                break;
            }
        }
        if (!errorExist) {
            for(let i = 0; i < files.length; i ++) {
                p.fileAdd(files[i], files[i].name);
            }
        }
    });


    return {
        fileNames: () => Object.keys(allFiles),
        deleteFile: (filename) => delete allFiles[filename],
        getAllFiles: () => allFiles
    }
};

function makeFormData (argu, multiPart) {
    var fmData = new FormData();
    var index = 1;
    each(argu || {}, function (key, value) {
        fmData.append(key, value);
    });
    each(multiPart || {}, (filename, blob) => {
        fmData.append('file' + index, blob);
        index ++;
        // if (_value instanceof File) {
        //     fmData.append(key, _value);
        // } else if (_value.blob) {
        //     fmData.append(key, _value.blob, filename)
        // } else {
        //     let value = {..._value};
        //     if (empty(value.name)) {
        //         if (!empty(value.fileName)) {
        //             value.name = value.fileName;
        //         } else {
        //             return false;
        //         }
        //     }
        //     if (empty(value.type)) {
        //         value.type = 'multipart/form-data';
        //     }
        //     value.uri =
        //         (getMobileOperatingSystem() === 'Android')
        //             ? value.uri
        //             : value.uri.replace('file:/', '');
        //     fmData.append(key, value);
        // }
    });

    return fmData;
};

function multiPartRequest(url, params, files, success, failure) {
    success = success || function () {};
    failure = failure || function () {};

    var formArgus = makeFormData(params, files);
    var ajaxConf = {};
    ajaxConf.type = 'POST';
    ajaxConf.url = url;
    ajaxConf.data = formArgus;
    ajaxConf.enctype = 'multipart/form-data';
    ajaxConf.mimeTypes = 'multipart/form-data';
    ajaxConf.processData = false;
    ajaxConf.contentType = false;
    ajaxConf.cache = false;
    ajaxConf.timeout = 600000;

    var req = $.ajax(ajaxConf);
    req.done(function (res) {
        if (res.error == 0) {
            success(res.data || null, res.count, res.error);
        } else {
            failure(res.error);
        }
    });
    req.fail(failure)
    return req;
}

function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {
        type: mime
    });
}

function downloadImg(imgSrc) {
    var image = new Image();
    image.crossOrigin = "anonymous";
    image.src = imgSrc;
    var fileName = image.src.split("/").pop();
    image.onload = function() {
        var canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;
        canvas.getContext('2d').drawImage(this, 0, 0);
        if (typeof window.navigator.msSaveBlob !== 'undefined') {
            window.navigator.msSaveBlob(dataURLtoBlob(canvas.toDataURL()), fileName);
        } else {
            var link = document.createElement('a');
            link.href = canvas.toDataURL();
            link.download = fileName;
            link.click();
        }
    };
}

function downloadFile(url, filename) {
    fetch(url, {
        mode: 'no-cors'
        /*
        * ALTERNATIVE MODE {
        mode: 'cors'
        }
        *
        */
    }).then((transfer) => {
        return transfer.blob();                 // RETURN DATA TRANSFERED AS BLOB
    }).then((bytes) => {
        let elm = document.createElement('a');  // CREATE A LINK ELEMENT IN DOM
        elm.href = URL.createObjectURL(bytes);  // SET LINK ELEMENTS CONTENTS
        elm.setAttribute('download', filename); // SET ELEMENT CREATED 'ATTRIBUTE' TO DOWNLOAD, FILENAME PARAM AUTOMATICALLY
        elm.click()                             // TRIGGER ELEMENT TO DOWNLOAD
    }).catch((error) => {
        console.log(error);                     // OUTPUT ERRORS, SUCH AS CORS WHEN TESTING NON LOCALLY
    })
}

function configBannerResize(swiperKlass, resizeHandler) {
    // Ignore only the removed legacy banner, retaining all active banner behavior.
    if (!$(swiperKlass).length) return;
    let $swiper = $(swiperKlass),
        swiper = $swiper.get(0).swiper;
    if (!swiper) {
        return;
    }

    if(window.innerWidth < 744) {
        $swiper.find('.banner-pc').hide();
        $swiper.find('.banner-mo').show();
    } else {
        $swiper.find('.banner-pc').show();
        $swiper.find('.banner-mo').hide();
    }
    swiper.update();

    $(window).resize(function (e) {
        if(window.innerWidth < 744) {
            $swiper.find('.banner-pc').hide();
            $swiper.find('.banner-mo').show();
        } else {
            $swiper.find('.banner-pc').show();
            $swiper.find('.banner-mo').hide();
        }
        if (typeof resizeHandler === 'function') {
            resizeHandler(swiper);
        }
        swiper.update();
    })
}