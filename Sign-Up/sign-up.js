console.log("signup.js loaded and running.");

document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM Content Loaded. Attaching form validation.");
  const signUpForm = document.getElementById('signUpForm');

  if (signUpForm) { // Check If We Find The Form
    let nameField = signUpForm.querySelector("[name='username']");
    let emailField = signUpForm.querySelector("[name='email']");
    let passwordField = signUpForm.querySelector("[name='password']");

    // Event For When Submit Form 
    signUpForm.onsubmit = function (e) {
      console.log("Form submission attempted.");

      let isValid = true; 
      let errorMessages = []; 

      // Check Name Field
      if (nameField.value.trim() === "") { // trim() => To Remove The Additional White Spaces
        errorMessages.push("Name Field Cannot Be Empty.");
        isValid = false;
      } else if (nameField.value.length > 10) {
        errorMessages.push("Name must be 10 characters or less.");
        isValid = false;
      }

      // Check Email Or Phone Number Field
      if (emailField.value.trim() === "") {
        errorMessages.push("Email or Phone Number Field Cannot Be Empty.");
        isValid = false;
      }
      else if (!/^\S+@\S+\.\S+$/.test(emailField.value)) {
        errorMessages.push("Please enter a valid email address.");
        isValid = false;
      }

      // Check Password Field
      if (passwordField.value.trim() === "") {
        errorMessages.push("Password Field Cannot Be Empty.");
        isValid = false;
      } else if (passwordField.value.length < 8) {
        errorMessages.push("Password must be at least 8 characters long.");
        isValid = false;
      } else if (passwordField.value.length > 16) {
        errorMessages.push("Password must be 16 characters or less.");
        isValid = false;
      }

      // Prevent The Form From Sending If There Is Any Errors
      if (!isValid) {
        e.preventDefault(); // منع إرسال النموذج
        window.alert(errorMessages.join("\n"));
        console.log("Form validation failed. Errors:", errorMessages); 
      } 


      let registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];

      // إنشاء كائن المستخدم الجديد
      const newUser = {
        username: nameField.value.trim(),
        email: emailField.value.trim(),
        password: passwordField.value // تحذير: تخزين كلمة المرور نصًا عاديًا غير آمن!
      };

      // التحقق مما إذا كان المستخدم موجودًا بالفعل (عن طريق البريد الإلكتروني أو اسم المستخدم)
      const userExists = registeredUsers.some(user =>
        user.email === newUser.email || user.username === newUser.username
      );

      let signUpMessage = document.getElementById("signUpMessage");
      signUpMessage.style.color = 'red';

      
      if (userExists) {
        signUpMessage.innerHTML = "User with this email or username already exists";
        // window.alert("User with this email or username already exists. Please log in or use a different email/username.");
        // console.warn("Registration failed: User already exists.");
      } else {
        // إضافة المستخدم الجديد إلى المصفوفة
        registeredUsers.push(newUser);
        // حفظ المصفوفة المحدثة في localStorage
        localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));

        window.alert("Account created successfully! You can now log in.");
        console.log("New user registered:", newUser);

        // اختياري: إعادة توجيه المستخدم إلى صفحة تسجيل الدخول بعد التسجيل الناجح
        // window.location.href = "../Log In/log-in.html";
      }
    };
  } else {
    console.error("Error: Form with ID 'signUpForm' not found in the DOM.");
  }
});