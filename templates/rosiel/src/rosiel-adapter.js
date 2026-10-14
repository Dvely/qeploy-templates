/* Local content responses only; visual and motion modules retain their original behavior. */
(function ($) {
  if (!$ || $.rosielLocalResponses) return;
  $.rosielLocalResponses = true;
  const ajax = $.ajax;
  $.ajax = function (input, options) {
    const config = typeof input === 'string' ? { ...options, url: input } : (input || {});
    const url = String(config.url || '');
    if (!/rosiel-local-api|wp-admin|wp-json|wc-ajax|wc_ajax|admin-ajax/.test(url)) return ajax.apply(this, arguments);
    const result = $.Deferred();
    const response = { success: true, suggestions: [], data: [], html: '', content: '', fragments: {}, cart_hash: '' };
    setTimeout(() => { config.success?.(response); config.complete?.(response); result.resolve(response); }, 0);
    return result.promise();
  };
})(window.jQuery);
