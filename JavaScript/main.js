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



// Start Home Page

// Get Slider Items | Array.from [ES6 Feature]
var sliderImages = Array.from(document.querySelectorAll(".slider-container img"));

// Get Number Of Sildes
var slidesCount = sliderImages.length;

// Set Current Slide
var currentSlide = 1;

// Slide Number Element
var slideNumberElement = document.getElementById("slide-number");

// Previous And Next Buttons
var nextButton = document.getElementById("next");
var prevButton = document.getElementById("prev");


// Handle Click On Previous And Next Buttons
nextButton.onclick = nextSlide;
prevButton.onclick = prevSlide;

// Create The Main UL Element
let paginationElement = document.createElement("ul");

// Set ID On Created UL Element
paginationElement.setAttribute('id', 'pagination-ul');

// Create List Items Based On Slides Count
for (let i = 1; i <= slidesCount; i++) {
  // Create The List Item 
  let paginationItem = document.createElement("li");

  // Set Custom Attribute
  paginationItem.setAttribute('data-index', i);

  // Set Item Content
  paginationItem.appendChild(document.createTextNode(i));

  // Append Items To The Main UL List
  paginationElement.appendChild(paginationItem);
}

// Add The Created UL Element To The Page 
document.getElementById('indicators').appendChild(paginationElement);

// Get The New Created Ul 
var paginationCreatedUl = document.getElementById('pagination-ul');

// Get Pagination Items | Array.from [ES6 Feature]
var paginationBullents = Array.from(document.querySelectorAll("#pagination-ul li"));

// Loop Through All Bullets Items
for (let i = 0; i < paginationBullents.length; i++) {
  paginationBullents[i].onclick = function () {
    currentSlide = parseInt(this.getAttribute('data-index'));
    theChecker();
  }
}
// Trigger The Checker Function
theChecker();

// Next Slide Function
function nextSlide() {
  if (nextButton.classList.contains('disabled')) {
    // Do Nothing
    return false
  } else {
    currentSlide++;
    theChecker();
  }
}

// Previous Slide Function
function prevSlide() {
  if (prevButton.classList.contains('disabled')) {
    // Do Nothing
    return false
  } else {
    currentSlide--;
    theChecker();
  }
}

// Create The Checker Function
function theChecker() {
  // Set The Slide Number

  // Remove All Active Classes
  removeAllActives();

  // Set Active Class To The Current SLide
  sliderImages[currentSlide - 1].classList.add('active');

  // Set Active Class On Current Pagination Item
  paginationCreatedUl.children[currentSlide - 1].classList.add('active');

  // Check If The Current Slide Is The First
  if (currentSlide === 1) {
    // Add Disabled CLass On The Previous Button 
    prevButton.classList.add('disabled');
  }
  else {
    // Remove Disabled CLass From The Previous Button  
    prevButton.classList.remove('disabled');
  }

  // Check If The Current Slide Is The Last
  if (currentSlide === slidesCount) {
    // Add Disabled CLass On The Next Button  
    nextButton.classList.add('disabled');
  }
  else {
    // Remove Disabled CLass From The Next Button  
    nextButton.classList.remove('disabled');
  }
}

// Remove All Active Classes From Images and Pagination Bullets
function removeAllActives() {
  // Loop Through Images
  sliderImages.forEach(function (img) {
    img.classList.remove('active');
  });

  // Loop Through Pagination Bullets
  paginationBullents.forEach(function (bl) {
    bl.classList.remove('active');
  });
}
// End Home Page





// Add Products To The Home Page

let todayCardContainer = document.querySelector(".today .container .row");
async function todatCard() {
  let fetchedData = await fetch("http://localhost:3000/products"); 
  fetchedData = await fetchedData.json();
  for (let i = 0; i < 4; i++) {
    todayCardContainer.innerHTML += `
    <div class="card col-md-3" style="width: 16rem;" id="${fetchedData[i].id}">
      <img src="${fetchedData[i].image}" class="card-img-top" alt="Keyboard">
      <div class="card-body">
        <h5 class="card-title">${fetchedData[i].title}</h5>
        <p class="card-text">$${fetchedData[i].price}</p>
        <div class="rate">
          <i class="fa-solid fa-star text-warning"></i>
          <i class="fa-solid fa-star text-warning"></i>
          <i class="fa-solid fa-star text-warning"></i>
          <i class="fa-solid fa-star text-warning"></i>
          <i class="fa-solid fa-star text-warning"></i>
          <span class="mx-2">(88)</span>
        </div>
        <div class="add-cart d-flex justify-content-center align-items-center my-3">
          <a href="Cart/cart.html" 
          onclick="add(${fetchedData[i].id})" class="">Add To Cart</a>
        </div>
      </div>
    </div>
    `
  }


}
todatCard();


let bestSellingCardContainer = document.querySelector(".best-selling .container .row");
async function bestSellingCard() {
  let fetchedData = await fetch("http://localhost:3000/products"); 
  fetchedData = await fetchedData.json();
  for (let i = 4; i < 8; i++) {
    bestSellingCardContainer.innerHTML += `
    <div class="card col-md-3" style="width: 16rem;" id="${fetchedData[i].id}">
      <img src="${fetchedData[i].image}" class="card-img-top" alt="Keyboard">
      <div class="card-body">
        <h5 class="card-title">${fetchedData[i].title}</h5>
        <p class="card-text">$${fetchedData[i].price}</p>
        <div class="rate">
          <i class="fa-solid fa-star text-warning"></i>
          <i class="fa-solid fa-star text-warning"></i>
          <i class="fa-solid fa-star text-warning"></i>
          <i class="fa-solid fa-star text-warning"></i>
          <i class="fa-solid fa-star text-warning"></i>
          <span class="mx-2">(88)</span>
        </div>
        <div class="add-cart d-flex justify-content-center align-items-center my-3">
          <a href="Cart/cart.html" 
          onclick="add(${fetchedData[i].id})" class="">Add To Cart</a>
        </div>
      </div>
    </div>
    `
  }
}
bestSellingCard();


let ourProductCardContainer = document.querySelector(".our-products .container .row");
async function ourProductCard() {
  let fetchedData = await fetch("http://localhost:3000/products"); 
  fetchedData = await fetchedData.json();
  for (let i = 8; i < 16; i++) {
    ourProductCardContainer.innerHTML += `
    <div class="card col-md-3" style="width: 16rem;" id="${fetchedData[i].id}">
      <img src="${fetchedData[i].image}" class="card-img-top" alt="Keyboard">
      <div class="card-body">
        <h5 class="card-title">${fetchedData[i].title}</h5>
        <p class="card-text">$${fetchedData[i].price}</p>
        <div class="rate">
          <i class="fa-solid fa-star text-warning"></i>
          <i class="fa-solid fa-star text-warning"></i>
          <i class="fa-solid fa-star text-warning"></i>
          <i class="fa-solid fa-star text-warning"></i>
          <i class="fa-solid fa-star text-warning"></i>
          <span class="mx-2">(88)</span>
        </div>
        <div class="add-cart d-flex justify-content-center align-items-center my-3">
          <a href="Cart/cart.html" 
          onclick="add(${fetchedData[i].id})" class="">Add To Cart</a>
        </div>
      </div>
    </div>
    `
  }
}
ourProductCard();




// تأكد أن `ids` معرفة عالميًا في أعلى الملف كالتالي:
let ids = JSON.parse(localStorage.getItem("added")) || [];

// دالة لإضافة منتج جديد إلى localStorage أو زيادة كميته إذا كان موجودًا
function add(id) {
  // البحث عن المنتج في مصفوفة `ids`
  let existingProduct = ids.find(item => item.id === id);

  if (existingProduct) {
    // إذا كان المنتج موجودًا بالفعل، قم بزيادة الكمية
    existingProduct.quantity++;
    console.log(`Product ID ${id} quantity incremented to ${existingProduct.quantity}`);
  } else {
    // إذا لم يكن المنتج موجودًا، أضفه بكمية 1 ككائن {id, quantity}
    ids.push({ id: id, quantity: 1 });
    console.log(`Product ID ${id} added to cart with quantity 1.`);
  }
  // حفظ المصفوفة المحدثة بالكامل في localStorage
  localStorage.setItem("added", JSON.stringify(ids));
  console.log("Current IDs in 'ids' array:", ids);
  console.log("localStorage 'added' item after adding:", localStorage.getItem("added"));

  // إذا كنت على صفحة سلة التسوق، قم بتحديث العرض
  // (يمكنك وضع هذا الشرط إذا كان هذا الكود مشتركًا بين صفحات متعددة)
  if (document.querySelector(".cart-page")) {
    fetchedProducts();
  }
}