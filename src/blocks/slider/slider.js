// //Функции для слайдера без анимации.

// function Slider(d, s, dCls, sCls, n, p) {
//     function nextSlide() {
//         goToSlide(currentSlide + 1);
//     };

//     function nextDot() {
//         goToDot(currentDot + 1);
//     };

//     function prevSlide() {
//         goToSlide(currentSlide - 1);
//     };

//     function prevDot() {
//         goToDot(currentDot - 1);
//     };

//     function goToDot(n) {
//         d[currentDot].className = dCls;
//         currentDot = (n + d.length) % d.length;
//         d[currentDot].className = dCls + " " + "active";
//     }

//     function goToSlide(n) {
//         s[currentSlide].className = sCls
//         currentSlide = (n + s.length) % s.length;
//         s[currentSlide].className = sCls + " " + "slide-show";
//     };

//     function next() {
//         nextSlide();
//         nextDot();
//     }

//     function prev() {
//         prevSlide();
//         prevDot();
//     }

//     n.addEventListener("click", next);
//     p.addEventListener("click", prev);

// };

// // Без Точек

// function SliderNoDot(s) {
//     function nextSlide() {
//         goToSlide(currentSlide + 1);
//         countMin.innerHTML = (currentSlide + 1);
//     };

//     function prevSlide() {
//         goToSlide(currentSlide - 1);
//         countMin.innerHTML = (currentSlide + 1);
//     };

//     function goToSlide(n) {
//         s[currentSlide].className = "slide"
//         currentSlide = (n + s.length) % s.length;
//         s[currentSlide].className = "slide slide-show";
//     };

//     function next() {
//         nextSlide();
//     }

//     function prev() {
//         prevSlide();
//     };

//     btnNext.addEventListener("click", next);
//     btnPrev.addEventListener("click", prev);
// };