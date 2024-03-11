import { fetchData } from "./app.js";

const filterProducts = async (field, value) => {
  try {
    const requestData = {
      action: "filter",
      params: { [field]: value },
    };

    const response = await fetchData(requestData);
    return response.result;
  } catch (error) {
    console.error("Error filtering products:", error);
    throw error;
  }
};

const displayResults = (productIds) => {
  const resultsContainer = document.getElementById("results");
  resultsContainer.innerHTML = "<h2>Filtered Product IDs:</h2>";
  productIds.forEach((id) => {
    resultsContainer.innerHTML += `<p>${id}</p>`;
  });
};

document
  .getElementById("filterForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const field = document.getElementById("field").value;

    const value = document.getElementById("value").value;

    try {
      const productIds = await filterProducts(field, value);
      displayResults(productIds);
    } catch (error) {
      console.error("Error filtering products:", error);
    }
  });
