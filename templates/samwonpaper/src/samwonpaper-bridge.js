window.baseline = {
  alert(target,text){window.dispatchEvent(new CustomEvent('samwonpaper:message',{detail:{text:String(text)}}));return Promise.resolve();},
  confirm(target,text){window.dispatchEvent(new CustomEvent('samwonpaper:message',{detail:{text:String(text)}}));return Promise.resolve(false);},
  fnSetCookie(key,value){try{localStorage.setItem('samwonpaper:'+key,String(value));}catch{}},
  fnGetCookie(key){try{return localStorage.getItem('samwonpaper:'+key)||'';}catch{return '';}}
};
window.fnViewCntModify = function(){};
window.fnGoLnbUrl = function(key){const menu=window.SAMWONPAPER.menus[key];if(menu)location.href=menu.file;};
