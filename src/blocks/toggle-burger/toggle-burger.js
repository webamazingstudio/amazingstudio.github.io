navMain.classList.remove("main-nav--no-js");//Удаляет класс --no-js если js в браузере включен.

var trigger = document.querySelector('.toggle-burger');

trigger.addEventListener('click', function() {
  if (trigger.classList.contains('trigger--show')) {
    trigger.classList.remove('trigger--show');
  } else {
    trigger.classList.add('trigger--show')
  };
});