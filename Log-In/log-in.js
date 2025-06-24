document.addEventListener('DOMContentLoaded', function () {

  const loginForm = document.getElementById('logInForm');

  // الوصول إلى حقول الإدخال وعنصر الرسالة
  const emailPhoneField = loginForm ? loginForm.querySelector("[name='email']") : null;
  const passwordField = loginForm ? loginForm.querySelector("[name='password']") : null;
  const loginMessage = document.getElementById('loginMessage');


  if (loginForm && emailPhoneField && passwordField && loginMessage) {
    loginForm.onsubmit = function (e) {
      e.preventDefault(); // منع الإرسال الافتراضي للنموذج

      const identifier = emailPhoneField.value.trim(); // البريد الإلكتروني أو رقم الهاتف المدخل
      const password = passwordField.value; // كلمة المرور المدخلة

      loginMessage.textContent = ''; // مسح أي رسائل سابقة
      loginMessage.style.color = 'red'; // إعادة تعيين اللون إلى الأحمر للخطأ

      if (identifier === "" || password === "") {
        loginMessage.textContent = "Please enter both email/username and password.";
        return;
      }

      // 1. قراءة المستخدمين المسجلين من localStorage
      const storedUsersJSON = localStorage.getItem("registeredUsers");
      let registeredUsers = [];

      if (storedUsersJSON) {
        try {
          registeredUsers = JSON.parse(storedUsersJSON);
        } catch (error) {
          console.error("Error parsing registeredUsers from localStorage:", error);
          loginMessage.textContent = "An internal error occurred. Please try again.";
          return;
        }
      } else {
        loginMessage.textContent = "No registered users found. Please sign up first.";
        return;
      }

      // 2. البحث عن مستخدم مطابق
      // نبحث عن مستخدم يطابق المدخل (سواء كان بريد إلكتروني أو اسم مستخدم) وكلمة المرور
      const foundUser = registeredUsers.find(user =>
        (user.email === identifier || user.username === identifier) && user.password === password
      );

      // 3. التحقق من النتيجة
      if (foundUser) {
        loginMessage.textContent = "Login successful! Welcome, " + (foundUser.username || foundUser.email) + ".";
        loginMessage.style.color = "green";
        console.log("Login successful for user:", foundUser.username || foundUser.email);


        localStorage.setItem("currentUser", JSON.stringify({
          username: foundUser.username,
          email: foundUser.email
          // لا تخزن كلمة المرور هنا!
        }));
        console.log("Current user data stored in localStorage.");


        setTimeout(function () {
          window.open("../index.html", "_self");
        }, 1000);

        
      } else {
        loginMessage.textContent = "Invalid email/username or password.";
        console.warn("Login failed for identifier:", identifier);
      }
  };
  } else {
    console.error("Error: Login form or its elements not found in the DOM.");
  }
});



