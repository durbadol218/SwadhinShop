const loadAllProducts = () => {
    fetch('https://fakestoreapi.com/products')
            .then(res=>res.json())
            // .then(json=>console.log(json))
            .then((data) => displayProducts(data))
            .catch((err) => console.log(err));
};

const loadAllCategories = () => {
    fetch('https://fakestoreapi.com/products/categories')
        .then(res => res.json())
        .then(data => displayCategories(data))
        .catch(err => console.log(err));
};

loadAllProducts();
loadAllCategories();

const displayProducts = (products) => {
    const parent = document.getElementById("product-container");
    parent.innerHTML = "";
    products.forEach((product) => {
        const div = document.createElement("div");
        div.classList.add('col');
        div.innerHTML = `
                <div class="card border rounded-3 border-black">
                <img src="${product.image}" class="img-fluid rounded-3" alt="${product.title}">
                <div class="card-body">
                    <h5 class="card-title">${product.title}</h5>
                    <p class="card-text">${product.description}</p>
                    <p><strong>Price:</strong> $${product.price}</p>
                    <p><strong>Rating:</strong> ${product.rating.rate} (${product.rating.count} reviews)</p>
                    <p><strong>Category:</strong> <btn class="btn btn-primary mb-2 mb-md-0" disabled>${product.category}</btn></p>
                    <div class="d-flex flex-column flex-md-row justify-content-between mt-2">
                        <button onclick="singleProductDetails('${product.id}')" class="btn btn-outline-warning"  data-bs-toggle="modal" data-bs-target="#exampleModal">Product Details</button>
                        <button onclick="handleCart('${product.title}', '${product.price}')" class="btn btn-outline-primary">Add Item to the Cart </button>
                    </div>
                </div>
        `;
        parent.appendChild(div);
    });
};

const displayCategories = (categories) => {
    const categoryList = document.getElementById('category-list');
    categoryList.innerHTML = "";
    categories.forEach(category => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.textContent = category;
        li.style.cursor = 'pointer';
        li.addEventListener('click', () => filterByCategory(category));
        categoryList.appendChild(li);
    });
};

const filterByCategory = (category) => {
    fetch(`https://fakestoreapi.com/products/category/${category}`)
        .then(res => res.json())
        .then(data => displayProducts(data))
        .catch(err => console.log(err));
};

const singleProductDetails = (id) => {
    fetch(`https://fakestoreapi.com/products/${id}`)
        .then(res => res.json())
        .then(data => {
            viewSingleProduct(data);
        })
}

const viewSingleProduct = (product) => {
    const modalTitle = document.getElementById("singleProductTitle");
    const modalBody = document.getElementById("singleProductbody");

    modalTitle.innerText = `${product.title};`
    modalBody.innerHTML = `
        <div class="card">
        <div class="row g-0">
            <div class="col-md-4 d-flex justify-content-center align-items-center">
                <img src=${product.image} class="img-fluid rounded-2" alt="...">
            </div>

            <div class="col-md-8">
                <div class="card-body">
                    <p class="card-text">${product.description}</p>
                    <p><strong>Price:</strong> $${product.price}</p>
                    <p><strong>Rating:</strong> ${product.rating.rate} (${product.rating.count} reviews)</p>
                    <p class="mb-2 mb-md-0"><strong>Category:</strong> ${product.category}</p>
                </div>
            </div>
        </div>
    </div>`;
};

let cartItemsCount = 0;
document.getElementById("cart-item-count").innerText=cartItemsCount;

const handleCart = (title,price) => {
    const cartContainer = document.getElementById("cart-container");
    const div = document.createElement("div");
    div.innerHTML = `
        <div class="border-bottom mx-0 border-dark d-flex justify-content-between align-items-center row">
            <p class="m-0 px-0 col-8">${title}</p>
            <p class="m-0 px-0 col-4 text-end ">$<span class="cart-item-price">${price}</span></p>
        </div>
    `;
    cartContainer.appendChild(div);
    cartItemsCount++;
    document.getElementById("cart-item-count").innerText = cartItemsCount
    totalPrice();
};

const totalPrice = () => {
    const allCartItemsPrice = document.getElementsByClassName("cart-item-price")
    let total = 0;
    for (const element of allCartItemsPrice) {
        total = total + parseFloat(element.innerText);
    }
    document.getElementById("total-price").innerText = total.toFixed(3);
};
