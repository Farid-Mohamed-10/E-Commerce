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


// Checkout Page

let ids = JSON.parse(localStorage.getItem("added")) || [];
console.log("DEBUG: 1. Initial IDs loaded from localStorage:", ids);




let paidProducts = async function () {
    console.log("DEBUG CHECKOUT: paidProducts function started.");
    let productsContainer = document.querySelector(".checkout .container .billing-details .pay-details .products");
    let priceDetailsContainer = document.querySelector(".checkout .container .billing-details .pay-details .price-details");

    // التحقق من وجود العناصر الأساسية في DOM
    if (!productsContainer || !priceDetailsContainer) {
        console.error("DEBUG CHECKOUT: Required elements (productsContainer or priceDetailsContainer) not found in the DOM!");
        // إذا لم يتم العثور على العناصر، توقف عن التنفيذ
        return;
    }

    productsContainer.innerHTML = ''; // مسح المحتوى الحالي لعرض المنتجات
    console.log("DEBUG CHECKOUT: productsContainer cleared.");

    let currentOverallSubtotal = 0; // المجموع الفرعي الكلي لجميع المنتجات

    // عرض محتوى مصفوفة 'ids' التي تم تحميلها من localStorage
    console.log("DEBUG CHECKOUT: IDs from localStorage:", ids);

    if (ids && ids.length > 0) {
        console.log("DEBUG CHECKOUT: IDs array is not empty. Iterating through products...");
        for (const item of ids) { // التكرار على كل كائن {id, quantity} في المصفوفة
            const productID = item.id; // هذا هو معرف المنتج (رقم)
            const productQuantity = item.quantity; // هذه هي الكمية التي اختارها المستخدم

            console.log(`DEBUG CHECKOUT: --- Processing item: ${JSON.stringify(item)} ---`);
            console.log(`DEBUG CHECKOUT: Extracted productID: ${productID}, productQuantity: ${productQuantity}`);

            try {
                // **هنا هو التصحيح الرئيسي: استخدام productID في الـ URL**
                let productResponse = await fetch(`http://localhost:3000/products/${productID}` );
                console.log(`DEBUG CHECKOUT: Fetch request sent for ID ${productID}.`);
                console.log(`DEBUG CHECKOUT: Fetch response status for ID ${productID}: ${productResponse.status}`);

                if (!productResponse.ok) {
                    // إذا فشل الـ fetch (مثلاً 404 Not Found, 500 Internal Server Error)
                    const errorText = await productResponse.text(); // حاول قراءة نص الاستجابة لمزيد من التفاصيل
                    throw new Error(`HTTP error! status: ${productResponse.status}, body: ${errorText}`);
                }

                let productJSON = await productResponse.json();
                console.log(`DEBUG CHECKOUT: Received productJSON for ID ${productID}:`, productJSON);

                // **تحقق من أن البيانات المسترجعة تحتوي على السعر والاسم**
                if (!productJSON || typeof productJSON.price === 'undefined' ||  typeof productJSON.title === 'undefined') {
                    console.warn(`DEBUG CHECKOUT: Product JSON for ID ${productID} is incomplete or malformed. Skipping this product.`, productJSON);
                    continue; // تخطي هذا المنتج إذا كانت بياناته غير كاملة
                }

                const productPrice = productJSON.price;
                const productSubtotal = productPrice * productQuantity;
                currentOverallSubtotal += productSubtotal; // إضافة المجموع الفرعي لهذا المنتج إلى الإجمالي الكلي

                console.log(`DEBUG CHECKOUT: Calculated price: ${productPrice}, quantity: ${productQuantity}, subtotal: ${productSubtotal}`);

                let paidProductDiv = document.createElement("div");
                paidProductDiv.classList.add("product");
                paidProductDiv.setAttribute('data-product-id', productJSON.id);

                // **استخدام productJSON.name أو productJSON.title لمرونة اسم المنتج**
                // **واستخدام productSubtotal.toFixed(2) لعرض المجموع الفرعي للمنتج**
                paidProductDiv.innerHTML = `
                    <div class="name d-flex align-items-center">
                        <img src="../${productJSON.image}" alt="">
                        <p>${productJSON.name || productJSON.title} x ${productQuantity}</p>
                    </div>
                    <div class="price">
                        <p>$${productSubtotal.toFixed(2)}</p>
                    </div>
                `;
                productsContainer.appendChild(paidProductDiv);
                console.log(`DEBUG CHECKOUT: Product ID ${productID} (${productJSON.name || productJSON.title}) appended to productsContainer.`);

            } catch (error) {
                console.error(`DEBUG CHECKOUT: ERROR fetching or processing product ID ${productID}:`, error);
            }
        }
    } else {
        console.log("DEBUG CHECKOUT: IDs array is empty. Displaying 'no items' message.");
        productsContainer.innerHTML = '<p>No items in your cart to checkout.</p>';
    }

    // تحديث محتوى priceDetailsContainer بعد معالجة جميع المنتجات
    const shippingCost = 0; // تكلفة الشحن (يمكنك جعلها ديناميكية لاحقًا)
    const overallTotal = currentOverallSubtotal + shippingCost;

    priceDetailsContainer.innerHTML = `
        <div class="subtotal d-flex justify-content-between align-items-center">
            <p>Subtotal: </p>
            <p>$${currentOverallSubtotal.toFixed(2)}</p>
        </div>
        <div class="shipping d-flex justify-content-between align-items-center">
            <p>Shipping: </p>
            <p>${shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</p>
        </div>
        <div class="total d-flex justify-content-between align-items-center">
            <p>Total: </p>
            <p>$${overallTotal.toFixed(2)}</p>
        </div>
    `;
    console.log("DEBUG CHECKOUT: Price details updated.");
};





document.addEventListener('DOMContentLoaded', paidProducts);

