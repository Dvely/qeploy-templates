(() => {
  const products = window.SAMWONPAPER_PRODUCTS;
  const uid = new URLSearchParams(location.search).get('uid');
  const product = products[uid] || Object.values(products)[0];
  // This trusted local markup is generated from captured public product pages.
  document.querySelector('#dBody').innerHTML = product.html;
  document.title = `${product.name} | 삼원페이퍼`;
  window.SAMWONPAPER_CURRENT_PRODUCT = product;
})();
