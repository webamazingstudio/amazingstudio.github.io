var navMain = document.querySelector('.main-nav')

navMain.classList.remove("main-nav--no-js");//Удаляет класс --no-js если js в браузере включен.

var trigger = document.querySelector('.toggle-burger');

trigger.addEventListener('click', function() {
  if (trigger.classList.contains('toggle-burger--show')) {
    trigger.classList.remove('toggle-burger--show');
    navMain.classList.add('main-nav--close');
  } else {
    trigger.classList.add('toggle-burger--show');
    navMain.classList.remove('main-nav--close');
  };
});