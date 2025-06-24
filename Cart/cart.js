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





// *******************************************************************
// هذا هو الجزء الأهم: تهيئة مصفوفة IDs من localStorage عند تحميل الصفحة
// يجب أن يكون هذا السطر في أعلى ملف JavaScript الخاص بك
// *******************************************************************
let ids = JSON.parse(localStorage.getItem("added")) || [];
console.log("DEBUG: 1. Initial IDs loaded from localStorage:", ids);



// دالة لجلب وعرض المنتجات في سلة التسوق
let fetchedProducts = async function () {
  console.log("2. fetchedProducts function called. Current IDs:", ids);
  let cartContainer = document.querySelector(".cart-page .container .cart-container");

  // مسح المحتوى الحالي لتجنب التكرار عند إعادة الجلب
  cartContainer.innerHTML = '';

    // التحقق مما إذا كانت هناك أي معرفات منتجات لجلبها
  if (ids && ids.length > 0) {
    for (const productID of ids) { // التكرار على كل ID في المصفوفة
      try {
        // هنا، سنستخدم بيانات وهمية للمنتجات لعدم وجود خادم localhost:3000
        // في تطبيقك الحقيقي، ستقوم بـ fetch من خادمك


          // في تطبيقك الحقيقي، سيكون الكود هكذا:
        let product = await fetch(`http://localhost:3000/products/${productID.id}` );
        if (!product.ok) {
          throw new Error(`HTTP error! status: ${product.status}`);
        }
        let productJSON = await product.json();

        let card = document.createElement("div");
        card.classList.add("cart");
        card.setAttribute('data-product-id', productJSON.id); // إضافة معرف المنتج إلى البطاقة

        // الكمية الأولية والمجموع الفرعي الأولي
        const initialQuantity = 1;
        const initialPrice = productJSON.price;
        const initialSubtotal = initialQuantity * initialPrice;

        card.innerHTML = `
          <div class="column product d-flex align-items-center">
            <img src="../${productJSON.image}" alt="" class="">
            <p class="mx-2">${productJSON.title}</p>
          </div>
          <div class="column price d-flex align-items-center">
            <p class="product-price" data-price="${initialPrice}">$${initialPrice}</p>
          </div>
          <div class="column quantity d-flex align-items-center">
            <p class="product-quantity" data-quantity="${initialQuantity}">${initialQuantity}</p>
            <div class="arrows d-flex flex-column mx-3">
              <i class="fa-solid fa-angle-up quantity-up"></i>
              <i class="fa-solid fa-angle-down quantity-down"></i>
            </div>
          </div>
          <div class="column subtotal d-flex align-items-center">
            <p class="product-subtotal">$${initialSubtotal.toFixed(2)}</p>
            <div></div>
          </div>
        `;
        cartContainer.appendChild(card);

        // ******************************************************
        // إضافة مستمعي الأحداث لأزرار الزيادة والنقصان لكل بطاقة منتج
        // ******************************************************
        const quantityUpButton = card.querySelector('.quantity-up');
        const quantityDownButton = card.querySelector('.quantity-down');
        const productQuantityElement = card.querySelector('.product-quantity');

        quantityUpButton.addEventListener('click', () => {
          let currentQuantity = parseInt(productQuantityElement.dataset.quantity);
          currentQuantity++;
          productQuantityElement.dataset.quantity = currentQuantity; // تحديث سمة البيانات
          productQuantityElement.textContent = currentQuantity; // تحديث النص المرئي
          updateSubtotal(card); // استدعاء دالة التحديث للمجموع الفرعي للمنتج الواحد
        });

        quantityDownButton.addEventListener('click', () => {
          let currentQuantity = parseInt(productQuantityElement.dataset.quantity);
          if (currentQuantity > 1) { // منع الكمية من النزول عن 1
            currentQuantity--;
            productQuantityElement.dataset.quantity = currentQuantity; // تحديث سمة البيانات
            productQuantityElement.textContent = currentQuantity; // تحديث النص المرئي
            updateSubtotal(card); // استدعاء دالة التحديث للمجموع الفرعي للمنتج الواحد
          }
        });

      } catch (error) {
        console.error(`Error fetching product with ID ${productID}:`, error);
      }
    }
  } else {
    cartContainer.innerHTML = '<p>Your cart is empty.</p>';
  }

  // ******************************************************
  // استدعاء دالة تحديث الإجماليات الكلية بعد إضافة جميع المنتجات
  // ******************************************************
  updateOverallCartTotals();
}



// ******************************************************
// دالة لحساب وتحديث المجموع الفرعي لمنتج معين في السلة
// ******************************************************

function updateSubtotal(cartItemElement) {
  // البحث عن عناصر السعر والكمية والمجموع الفرعي داخل بطاقة المنتج المحددة
  const priceElement = cartItemElement.querySelector('.product-price');
  const quantityElement = cartItemElement.querySelector('.product-quantity');
  const subtotalElement = cartItemElement.querySelector('.product-subtotal');
  // const productId = parseInt(cartItemElement.dataset.productId);

  const price = parseFloat(priceElement.dataset.price);
  const quantity = parseInt(quantityElement.dataset.quantity);

  const newSubtotal = price * quantity;

  // تحديث النص المرئي للمجموع الفرعي، مع تنسيقه لعدد عشريين
  subtotalElement.textContent = `$${newSubtotal.toFixed(2)}`;


  updateOverallCartTotals();
}


// ******************************************************
// دالة جديدة لحساب وتحديث الإجماليات الكلية لسلة التسوق بأكملها
// ******************************************************
function updateOverallCartTotals() {
  let overallSubtotal = 0;
  const allProductSubtotals = document.querySelectorAll('.cart-page .product-subtotal'); // جمع كل عناصر المجموع الفرعي للمنتجات

  allProductSubtotals.forEach(item => {
    // استخراج القيمة الرقمية من النص (إزالة '$' وتحويلها إلى رقم)
    overallSubtotal += parseFloat(item.textContent.replace('$', ''));
  });

  // تكلفة الشحن (يمكن أن تكون ديناميكية لاحقًا)
  const shippingCost = 0; // حاليًا مجاني

  const overallTotal = overallSubtotal + shippingCost;

  const totalPriceElement = document.querySelector(".cart-page .container .total-price");

  if (totalPriceElement) { // التأكد من وجود العنصر قبل التحديث
    totalPriceElement.innerHTML = `
      <div class="coupon">
        <input type="text" placeholder="Coupon Code">
        <a href="#" class="coupon-code">Apply Coupon</a>
      </div>
      <div class="cart-total">
        <h5>Cart Total</h5>
        <div class="subtotal d-flex justify-content-between align-items-center">
          <p>Subtotal:</p>
          <p>$${overallSubtotal.toFixed(2)}</p>
        </div>
        <div class="shipping d-flex justify-content-between align-items-center">
          <p>Shipping:</p>
          <p>${shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</p>
        </div>
        <div class="total d-flex justify-content-between align-items-center">
          <p>Total:</p>
          <p>$${overallTotal.toFixed(2)}</p>
        </div>
        <div class="checkout">
          <a href="../Checkout/checkout.html" onclick="add()">Process To Checkout</a>
        </div>
      </div>
    `;
  } else {
    console.error("Element with class 'total-price' not found in the DOM.");
  }
}




// استدعاء الدالة لجلب وعرض المنتجات عند تحميل الصفحة
// تأكد من أن هذا يتم بعد تحميل DOM بالكامل
document.addEventListener('DOMContentLoaded', fetchedProducts);







// دالة لمسح سلة التسوق بالكامل (لأغراض الاختبار)
function clearCart() {
  localStorage.removeItem("added");
  ids = []; // إعادة تعيين المصفوفة في الذاكرة أيضًا
  console.log("Cart cleared. IDs array:", ids);
  fetchedProducts(); // تحديث العرض
}




