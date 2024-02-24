function generateXAuthHeader(password) {
  const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const xAuthValue = `${password}_${timestamp}`;

  const md5Hash = CryptoJS.MD5(xAuthValue).toString();

  return md5Hash;
}

const apiUrl = "http://api.valantis.store:40000/";
const password = "Valantis";
const xAuthHeaderValue = generateXAuthHeader(password);
console.log(xAuthHeaderValue);

// const requestData = {
//   action: "filter",
//   params: { price: 17500.0 },
// };

const requestData = {
  action: "get_items",
  params: { ids: ["1789ecf3-f81c-4f49-ada2-83804dcc74b0"] },
};

fetch(apiUrl, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-Auth": xAuthHeaderValue,
  },
  body: JSON.stringify(requestData),
})
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    console.log("Response:", data);
  })
  .catch((error) => {
    console.error("Error:", error);
  });

// Function to render goods list in HTML
async function renderGoodsList() {
  const goodsListDiv = document.getElementById("goods-list");
  const goodsData = await fetchGoods();

  goodsListDiv.innerHTML = ""; // Clear previous content

  goodsData.forEach((item) => {
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("item");
    itemDiv.textContent = `ID: ${item.id}, Name: ${item.name}, Price: ${item.price}`;
    goodsListDiv.appendChild(itemDiv);
  });
}

// Call the renderGoodsList function when the page loads
window.onload = renderGoodsList;
