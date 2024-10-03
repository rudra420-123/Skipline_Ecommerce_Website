// IT CONTAINS THE RESPONSIVENESS RELATED WORK 
/* Making the Website Responsiveness (Starting...*/
let menuIcon = document.querySelector('.menu');
let navList = document.querySelector('nav ul');

menuIcon.addEventListener('click', function() {
    navList.classList.toggle('active');
});
/* Toggle the navbar */
let hamburger = document.getElementById('hamburger');
let menuPage = document.querySelector('.menuPage');
menuPage.style.display = 'block';
if (menuPage.style.display === 'block') {
    menuPage.style.display = 'none';
} else {
    menuPage.style.display = 'block';
}
// Optionally, close the menu when clicking outside the menu
document.addEventListener('click', function(event) {
    if (!menuPage.contains(event.target) && event.target !== hamburger) {
        menuPage.style.display = 'none';
    }
});
/* Making the Website Responsiveness (Ending...)*/

// IT CONTAINS THE API RELATED WORK 
const cardContainer = document.getElementById('card-container');
const cartCountElement = document.getElementById('cart-count'); // Moved here for clarity
let category = "all";
let cartItems = [];
let thankYouContainer = document.getElementById("thankYouContainer");
let container = document.querySelector(".container");
let mainContainer = document.getElementById("mainContainer");

if (category === "all") {
    fetchAllData();
}

let select = document.getElementById('select');
select.addEventListener('change', (e) => {
    category = e.target.value;
    if (category) {
        fetchProducts(category);
    } else {
        cardContainer.innerHTML = '';
    }
});

function fetchProducts(category) {
    showLoader();
    let url = `https://fakestoreapi.com/products/category/${category}`;
    fetch(url)
        .then(res => res.json())
        .then(data => {
            displayData(data);
            hideLoader();
        })
        .catch(error => {
            console.log(error);
            hideLoader();
        });
}

function fetchAllData() {
    showLoader();
    const url = `https://fakestoreapi.com/products/`;
    fetch(url)
        .then(res => res.json())
        .then(data => {
            displayData(data);
            hideLoader();
        })
        .catch(error => {
            console.log(error);
            hideLoader();
        });
}

function displayData(data) {
    cardContainer.innerHTML = '';
    data.forEach(prod => {
        const card = document.createElement('div');
        card.className = 'card';

        card.innerHTML = `
            <img src=${prod.image} alt="">
            <p>Title: ${prod.title}</p>
            <h3>Price: $${prod.price}</h3>
            <h3>Rating: ${prod.rating.rate} [${prod.rating.count}]</h3>
            <button class="cartbtn" data-product-id="${prod.id}">
                ${checkCart(prod.id) ? 'Go to Cart' : 'Add to Cart'}
            </button>`;

        cardContainer.appendChild(card);
        card.querySelector('.cartbtn').addEventListener("click", (event) => {
            addToCart(event, prod);
            cartCountElement.innerHTML = `Cart (${cartItems.length})`;
        });
    });
}

function checkCart(itemId) {
    return cartItems.some(item => item.id === itemId);
}

function addToCart(event, item) {
    if (!checkCart(item.id)) {
        cartItems.push(item);
        event.target.innerText = 'Go to Cart';
    } else {
        toggleCart(true);
    }
}

function toggleCart(Cart = false) {
    const container = document.querySelector(".container");
    const mainContainer = document.getElementById("mainContainer");

    if (Cart || mainContainer.style.display === 'none') {
        container.style.display = 'none';
        mainContainer.style.display = 'block';
        showCart();
    } else {
        container.style.display = 'flex';
        mainContainer.style.display = 'none';
    }
}

function showCart() {
    const cartContainer = document.getElementById('mainContainer');
    cartContainer.innerHTML = '';

    let closeButton = document.createElement("button");
    closeButton.className = 'close-button';
    closeButton.innerHTML = `<i class="fa-solid fa-times"></i>`;
    cartContainer.appendChild(closeButton);
    closeButton.addEventListener("click", () => {
        document.querySelector(".container").style.display = 'block';
        cartContainer.style.display = 'none';
    });

    if (cartItems.length === 0) {
        cartContainer.innerHTML = `
            <button class="btn green" id="backBtn">&lt; Back</button>
            <h1 class="emptyText">Your cart is empty.</h1>`;
        
        let backBtn = document.getElementById("backBtn");
        backBtn.addEventListener("click", () => {
            document.querySelector(".container").style.display = 'block';
            cartContainer.style.display = 'none';
        });
    } else {
        let table = document.createElement('table');
        table.innerHTML = `
        <br>
        <br>
            <tr>
                <th>Sno.</th>
                <th>Product</th>
                <th>Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Rating</th>
                <th>Action</th>
            </tr>`;

        cartItems.forEach((item, index) => {
            const quantity = item.quantity || 1;
            const total = item.price * quantity;

            let row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td><img src="${item.image}" alt="product" style="width: 50px; height: 50px;"></td>
                <td>${item.title}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>
                    <i class="fa-solid fa-minus minus" data-index="${index}"></i> 
                    <span class="quantity">${quantity}</span> 
                    <i class="fa-solid fa-plus plus" data-index="${index}"></i>
                </td>
                <td class="total">$${total.toFixed(2)}</td>
                <td>${item.rating.rate}</td>
                <td><i class="fa-solid fa-trash-can trash" data-index="${index}"></i></td>
            `;
            table.appendChild(row);

            let minus = row.querySelector(".minus");
            let plus = row.querySelector(".plus");
            let trash = row.querySelector(".trash");
            
            minus.addEventListener('click', () => updateQuantity(index, -1));
            plus.addEventListener('click', () => updateQuantity(index, 1));
            trash.addEventListener('click', () => removeItem(index));
        });

        cartContainer.appendChild(table);

        let bill = document.createElement('div');
        bill.className = 'bill';

        bill.innerHTML = `
            Your Total Bill is: $ <span>${updateTotalBill()}</span>
            <br>
            <button class="btn green" id="confirmBtn">Confirm Order</button>
        `;
        cartContainer.appendChild(bill);

        let confirmButton = document.getElementById("confirmBtn");
        confirmButton.addEventListener("click", () => {
            mainContainer.style.display = "none";
            thankYouContainer.style.display = "block";
        });
    }
}

function updateQuantity(index, change) {
    const item = cartItems[index];
    item.quantity = (item.quantity || 1) + change;
    if (item.quantity < 1) 
    {
        item.quantity = 1;
    }
    showCart();
}

function removeItem(index) {
    const removedItem = cartItems[index];
    cartItems.splice(index, 1);
    updateCartButton(removedItem.id);
    showCart();
}

function updateCartButton(productId) {
    const allButtons = document.querySelectorAll('.cartbtn');
    allButtons.forEach(button => {
        if (parseInt(button.getAttribute('data-product-id')) === productId) {
            button.innerText = 'Add to Cart';
        }
        cartCountElement.innerHTML = `Cart (${cartItems.length})`;
    });
}

function updateTotalBill() {
    return cartItems.reduce((total, item) => {
        const quantity = item.quantity || 1;
        return total + (item.price * quantity);
    }, 0).toFixed(2);
}

function showLoader() {
    const loader = document.getElementById('loader');
    loader.innerHTML = '';
    for (let i = 0; i < 8; i++) {
        const loaderCard = document.createElement('div');
        loaderCard.className = 'loader-card';
        loader.appendChild(loaderCard);
    }
    loader.style.display = 'flex';
    cardContainer.style.display = 'none';
}

function hideLoader() {
    document.getElementById('loader').style.display = 'none';
    cardContainer.style.display = 'flex';
}

let cart = document.getElementById("cart");
cart.addEventListener("click", () => {
    showCart();
    mainContainer.style.display = "block";
    container.style.display = "none";
});

let confirmButton = document.getElementById("confirmBtn");

let closeContainer = document.getElementById("closeContainer");
closeContainer.addEventListener("click", () => {
    thankYouContainer.style.display = "none";
    mainContainer.style.display = "block";
});

