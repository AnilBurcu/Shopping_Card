/* Variables */
const cartBtn = document.querySelector(".cart-btn");
const clearCartBtn = document.querySelector(".btn-clear");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".total-value");
const cartContent = document.querySelector(".cart-list");
const productsDOM = document.querySelector("#products-dom");

let cart = []
let buttonsDom = []


class Products {
    async getProducts() {
        try {
            let result = await fetch("https://65c9e2053b05d29307df2baf.mockapi.io/products")
            let data = await result.json()
            let products = data
            return products
        } catch (error) {
            console.log(error)
        }
    }
}

class UI {
    displayProtucts(products) {
        let result = "";
        products.forEach(element => {
            result += `
            <div class="col-lg-4 col-md-6">
            <div class="product">
              <div class="product-image">
                <img
                  class="img-fluid"
                  src="${element.image}"
                  alt="product"
                />
              </div>
              <div class="product-hover">
                <span class="${element.title}">Table</span>
                <span class="${element.price}">$300</span>
                <button class="btn-add-to-cart" data-id="${element.id}">
                  <i class="fas fa-cart-shopping"></i>
                </button>
              </div>
            </div>
          </div>
            `;

        });
        productsDOM.innerHTML = result
    }

    getBagButtons() {
        const buttons = [...document.querySelectorAll(".btn-add-to-cart")];
        buttonsDom = buttons
        buttons.forEach(button => {
            let id = button.dataset.id;
            let inCart = cart.find(item => item.id === id)
            if (inCart) {
                button.setAttribute("disabled", "disabled")
                button.style.opacity = ".3"
            } else {
                button.addEventListener("click", event => {
                    event.target.disabled = true
                    button.style.opacity = ".3"
                    //* get product from products
                    let cartItem = { ...Storage.getProducts(id), amount: 1 }
                    //* add product to the cart
                    cart = [...cart, cartItem] //cart'ın içerisinde ne varsa al, birde cartItem'ı ekle
                    //* save cart in local storage
                    Storage.saveCart(cart)
                    //* save cart values
                    this.setCartValues(cart)
                })
            }
        })

    }

    setCartValues(cart) {
        let tempTotal = 0
        let itemsTotal = 0

        cart.map(item => {
            tempTotal += item.price * item.amount
            itemsTotal += item.amount
        })
        cartTotal.innerText = parseFloat(tempTotal.toFixed(2))
        cartItems.innerText = itemsTotal
    }
}

class Storage {
    static saveProducts(products) {
        localStorage.setItem("products", JSON.stringify(products))
    }

    static getProducts(id) {
        let products = JSON.parse(localStorage.getItem("products"))
        products.find(product => product.id === id)
    }
    static saveCart(cart) {
        localStorage.setItem("cart", JSON.stringify(cart))
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const ui = new UI();
    const products = new Products()

    products.getProducts().then(products => {
        ui.displayProtucts(products)
        Storage.saveProducts(products)
    }).then(() => {
        ui.getBagButtons();

    })

})