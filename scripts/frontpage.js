(function () {
  var clientId = "it8sbnpe0k3wnjlbivgjdhijy7y5p8n";
  var token = "skfqb3o08u5iur0zicngc9xn1x3kh9l";
  var storeHash = "4n3dh09e13";
  var categoryId = "416";
  var container = document.getElementById("category-products");

  fetch(
    "https://api.bigcommerce.com/stores/" +
      storeHash +
      "/v3/catalog/products?categories:in=" +
      categoryId,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Auth-Token": token,
        "X-Auth-Client": clientId,
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      var products = data.data;
      products.forEach(function (product) {
        var productDiv = document.createElement("div");
        productDiv.className = "Product";

        var productTitle = document.createElement("h2");
        productTitle.className = "Product-title";
        productTitle.textContent = product.name;
        productDiv.appendChild(productTitle);

        var productImage = document.createElement("div");
        productImage.className = "Product-image";
        var img = document.createElement("img");
        img.src = product.primary_image.url_standard;
        img.alt = product.name;
        productImage.appendChild(img);
        productDiv.appendChild(productImage);

        var productPrice = document.createElement("div");
        productPrice.className = "Product-price";
        productPrice.textContent = product.price.price;
        productDiv.appendChild(productPrice);

        var productLink = document.createElement("a");
        productLink.href = "/products/" + product.custom_url.url;
        productLink.className = "Product-link";
        productLink.textContent = "Подробнее";
        productDiv.appendChild(productLink);

        container.appendChild(productDiv);
      });
    })
    .catch((error) => {
      console.error("Error fetching products:", error);
    });
})();
