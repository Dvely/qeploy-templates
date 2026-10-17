
// 숫자변환
String.prototype.toNumeric = function(defaultNum) {
	let num = parseFloat(this.replace(/,/g, ""));
	if (isNaN(num)) {
		if (defaultNum && typeof(defaultNum) == "number") {
			return defaultNum;
		} else {
			return 0;
		}
	} else {
		return num;
	}
}

/* 날짜 포멧 */
String.prototype.zf = function (len) {
	return "0".repeat(len - this.length) + this;
};
Number.prototype.zf = function (len) {
	return this.toString().zf(len);
};
Date.prototype.format = function() {
	return this.getFullYear() + "-" + (this.getMonth() + 1).zf(2) + "-" + this.getDate().zf(2);
}

/* 이메일 검증 */
function isEmail(email) {
	if (email.search(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/) != -1) {
		return true;
	} else {
		return false;
	}
}

/* 우편번호 찾기 */
function openZipcode(collback) {
	new daum.Postcode({
		oncomplete: function(data) {
			// 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.
			// 각 주소의 노출 규칙에 따라 주소를 조합한다.
			// 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
			let fullAddr = ""; // 최종 주소 변수
			let extraAddr = ""; // 조합형 주소 변수
			let street = ""; // 주소(상세주소)
			let dong = ""; // 주소(행정동)

			// 사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
			if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
				fullAddr = data.roadAddress;
				street = data.roadAddress;
			} else { // 사용자가 지번 주소를 선택했을 경우(J)
				fullAddr = data.jibunAddress;
				street = data.jibunAddress;
			}

			// 사용자가 선택한 주소가 도로명 타입일때 조합한다.
			if(data.userSelectedType === 'R'){
				//법정동명이 있을 경우 추가한다.
				if(data.bname !== ""){
					extraAddr += data.bname;
					dong = data.bname;
				}
				// 건물명이 있을 경우 추가한다.
				if(data.buildingName !== ""){
					extraAddr += (extraAddr !== "" ? ", " + data.buildingName : data.buildingName);
					street += " " + data.buildingName;
				}
				// 조합형주소의 유무에 따라 양쪽에 괄호를 추가하여 최종 주소를 만든다.
				fullAddr += (extraAddr !== "" ? " (" + extraAddr + ")" : "");
			}
			if (typeof(collback) === "function") {
				collback(data.zonecode, fullAddr, data.sido, data.sigungu, street, dong);
			}
		}
	}).open();
}

/* 최대 길이 제한 */
function maxLengthCheck(object){
	if (object.value.length > object.maxLength){
		object.value = object.value.slice(0, object.maxLength);
	}
}

/* html태그 encode */
function encodeHTMLEntities(str) {
	if(str !== undefined && str !== null && str !== '') {
		str = str.replace(/&lt;/g,"<");
		str = str.replace(/&gt;/g,">");
	}
	return str;
}
