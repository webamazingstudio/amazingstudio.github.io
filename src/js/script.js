//=require vendor/jquery.js 
//=require vendor/**/*.js 
//=include relative/path/to/file.js 
// Пример подключения готового JS файла.
// require - означает что файл будет подключен одним из первых прежде чем подключаться другие скрипты
// include - просто вставить фрагмент нужного кода
// P/s Перед инклудом удалить все комментарии отсюда подключение обязательно проводить в закомментированной строке.
window.addEventListener('load', function() {

    html.classList.remove('no-js');
    // require ../blocks/jquery/jquery-3.1.1.min.js
})