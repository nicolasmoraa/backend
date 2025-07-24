const socket = io();

const form = document.getElementById("productForm");
const nameInput = document.getElementById("name");
const priceInput = document.getElementById("price");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const product = {
    name: nameInput.value,
    price: parseFloat(priceInput.value)
  };
  socket.emit("new-product", product);
  form.reset();
});

socket.on("products-updated", (products) => {
  const list = document.getElementById("productList");
  list.innerHTML = "";
  products.forEach(p => {
    const li = document.createElement("li");
    li.innerText = `${p.name} - $${p.price}`;
    list.appendChild(li);
  });
});
