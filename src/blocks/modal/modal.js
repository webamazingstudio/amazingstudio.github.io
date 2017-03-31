var btnClose = document.getElementById('close');

function btnClick(btn, elem1, containCls, addCls) {
	btn.addEventListener("click", function () {
		event.preventDefault();
		if (elem1.classList.contains(containCls)) {
			elem1.classList.remove(containCls);
			elem1.classList.add(addCls);
		};
	});
};