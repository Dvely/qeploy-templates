// The reference animation helper is independent of the original server utilities.
function contObserver(selector, threshold, toggle, companion, once) {
 const observer=new IntersectionObserver((entries, obs)=>{
  entries.forEach(entry=>{
   if(entry.isIntersecting){
    entry.target.classList.add('active');
    if(companion)document.querySelectorAll(companion).forEach(e=>e.classList.add('active'));
    if(once)obs.unobserve(entry.target);
   }else if(toggle){
    entry.target.classList.remove('active');
    if(companion)document.querySelectorAll(companion).forEach(e=>e.classList.remove('active'));
   }
  });
 },{threshold:threshold||0});
 document.querySelectorAll(selector).forEach(e=>observer.observe(e));
}
