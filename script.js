// ---------- reveal-on-scroll ----------
(function(){
    var targets = document.querySelectorAll('.reveal, .reveal-stagger');
    if(!('IntersectionObserver' in window) || targets.length === 0){
      targets.forEach(function(el){ el.classList.add('in-view'); });
      return;
    }
    var observer = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    targets.forEach(function(el){ observer.observe(el); });
  })();
  
  // ---------- sticky header shrink/shadow ----------
  (function(){
    var header = document.querySelector('header.topbar');
    if(!header) return;
    var onScroll = function(){
      if(window.scrollY > 12){
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  })();
  
  // ---------- scrollspy: highlight active nav link while scrolling ----------
  (function(){
    var navLinks = document.querySelectorAll('.topbar nav a');
    var sections = Array.prototype.map.call(navLinks, function(link){
      var id = link.getAttribute('href').replace('#', '');
      return document.getElementById(id);
    }).filter(Boolean);
  
    if(!('IntersectionObserver' in window) || sections.length === 0) return;
  
    var setActive = function(id){
      navLinks.forEach(function(link){
        link.classList.toggle('active', link.getAttribute('href') === '#' + id);
      });
    };
  
    var spy = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          setActive(entry.target.id);
        }
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
  
    sections.forEach(function(sec){ spy.observe(sec); });
  })();
  
  // ---------- button click ripple ----------
  (function(){
    var buttons = document.querySelectorAll('.btn');
    buttons.forEach(function(btn){
      btn.addEventListener('click', function(e){
        var rect = btn.getBoundingClientRect();
        var size = Math.max(rect.width, rect.height);
        var ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
        btn.appendChild(ripple);
        ripple.addEventListener('animationend', function(){
          ripple.remove();
        });
      });
    });
  })();
  
  // ---------- metric count-up on scroll into view ----------
  (function(){
    var nums = document.querySelectorAll('.metric .num');
    if(!('IntersectionObserver' in window) || nums.length === 0) return;
  
    var animateNum = function(el){
      var raw = el.textContent.trim();
      var match = raw.match(/-?[\d.]+/);
      if(!match){ return; }
      var target = parseFloat(match[0]);
      var prefix = raw.slice(0, match.index);
      var suffix = raw.slice(match.index + match[0].length);
      var decimals = (match[0].split('.')[1] || '').length;
      var duration = 1100;
      var start = null;
  
      var step = function(ts){
        if(start === null) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = (target * eased).toFixed(decimals);
        el.textContent = prefix + current + suffix;
        if(progress < 1){
          requestAnimationFrame(step);
        } else {
          el.textContent = raw;
        }
      };
      requestAnimationFrame(step);
    };
  
    var observer = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          animateNum(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
  
    nums.forEach(function(el){ observer.observe(el); });
  })();