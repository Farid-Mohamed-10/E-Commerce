// Personal Account In Navbar
// استخدم event لمنع انتشار الحدث
function toggleDropdown(event) {
  event.stopPropagation(); // يمنع إغلاق القائمة فور فتحها
  document.getElementById("myDropdown").classList.toggle("show");
}

// إغلاق القائمة عند النقر خارجها
document.addEventListener('click', function (event) {
  var dropdown = document.getElementById("myDropdown");
  var icon = document.querySelector(".profile-icon");

  // إذا كان النقر خارج الأيقونة أو القائمة
  if (!icon.contains(event.target)) {
    dropdown.classList.remove("show");
  }
});