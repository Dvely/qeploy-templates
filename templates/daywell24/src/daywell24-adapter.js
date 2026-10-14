/* Supplies fictional local content. Original layout, slider and scroll modules are unchanged. */
(function ($) {
  if (!$) return;
  const realAjax = $.ajax;
  $.ajax = function (input, options) {
    const config = typeof input === 'string' ? { ...options, url: input } : input;
    const endpoint = config.url || '';
    if (!/^\/?api\d?\//.test(endpoint) && !/\/api\d?\//.test(endpoint)) return realAjax.apply($, arguments);
    const deferred = $.Deferred();
    const data = config.data || {};
    const goods = window.DAYWELL24.products.filter(p => !data.CATEGORY_SEQ || p.CATEGORY_SEQ === Number(data.CATEGORY_SEQ));
    const faq = [
      {SEQ:1, QUESTION:'데이웰24는 어떤 브랜드인가요?', ANSWER:'데이웰24는 가상의 편의점 브랜드입니다. 매일 가까운 곳에서 만나는 작은 행복을 소개하는 디자인 템플릿입니다.'},
      {SEQ:2, QUESTION:'행사 상품은 어디에서 확인하나요?', ANSWER:'상품 메뉴의 행사 상품과 홈의 1+1·2+1 탭에서 가상의 상품 구성을 확인할 수 있습니다.'},
      {SEQ:3, QUESTION:'매장은 어떻게 찾나요?', ANSWER:'매장찾기에서 성수·연남·마곡·서초 지역으로 가상 매장을 살펴볼 수 있습니다.'},
      {SEQ:4, QUESTION:'상담 내용을 입력하면 실제로 접수되나요?', ANSWER:'입력과 화면 안내만 제공하며 실제 신청이나 개인정보 전송·저장은 이루어지지 않습니다.'}
    ];
    const stories = ['가까운 동네에서 시작한 새로운 하루', '함께 만드는 든든한 데일리 마켓', '작은 선택이 만드는 반가운 변화'].map((TITLE,i)=>({SEQ:i+1,TITLE,EXPLAIN:'데이웰24와 함께하는 가상의 매장 이야기입니다.',movie:'daywell24-media.html',PC:{url:'images/daywell24-store.png'},PC_IMAGE:{url:'images/daywell24-store.png'},CNTE_CATE_NM:'데이웰 스토리',OWR_NM:'데이웰 파트너',STR_NM:'데이웰24 동네점',CNTE_M_CTNTS:'매일의 작은 행복을 가까운 곳에서 나눕니다.',URL:'daywell24-franchise-contact.html',LNK_TYPE_CD:'NOW'}));
    let entries = goods;
    if(endpoint.includes('/faq')) entries=faq.filter(item=>!data.search||(item.QUESTION+item.ANSWER).includes(data.search));
    else if(endpoint.includes('/board/story')) entries=endpoint.endsWith('/top')?stories.slice(0,1):stories;
    else if(endpoint.includes('/recommend/')) entries=['성수','연남','마곡','서초'].map((area,i)=>({number:i+1,SEQ:i+1,PAREAS:'서울',AREAS:area,SPECIAL:'가상 추천 공간',INVESTMENT:0,DEPOSIT:0,PREMIUM:0,AREASIZE:66+i*10,ADDRESS:area+' 데이웰 라운지',STF_TEL_NO:''}));
    else if(endpoint.includes('/area/')) entries=['성수','연남','마곡','서초'].map((TITLE,i)=>({SEQ:i+1,PARENT_SEQ:1,TITLE}));
    else if(endpoint.includes('/policy/')||endpoint.includes('/videoOperate/')) entries=[{TITLE:'데이웰24 안내',BODY:'<h2>데이웰24 디자인 템플릿 안내</h2><p>가상의 브랜드를 소개하는 정적 웹사이트입니다. 실제 주문·상담·개인정보 처리는 이루어지지 않습니다.</p>'}];
    else if(endpoint.includes('/request/')||endpoint.includes('/ckps')) entries=[];
    const response = { error: 0, code: 200, status: 'OK', success: true, data: entries, count: entries.length, total: entries.length, totalCount: entries.length, result: entries, list: entries };
    setTimeout(() => {
      config.success?.(response);
      config.complete?.(response);
      deferred.resolve(response);
    }, 0);
    return deferred.promise();
  };
})(window.jQuery);
