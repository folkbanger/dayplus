// Runs before the page paints. Marks that JavaScript works and decides whether the
// home loader shows (once per visit, never with Reduce Motion).
(function () {
  var d = document.documentElement;
  d.classList.add('js');
  if (!d.hasAttribute('data-loader')) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  try {
    if (sessionStorage.getItem('dp-loader')) return;
    sessionStorage.setItem('dp-loader', '1');
  } catch (e) { return; }
  d.classList.add('ld');
})();
