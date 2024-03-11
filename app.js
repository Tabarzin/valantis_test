function generateXAuthHeader(password) {
  const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const xAuthValue = `${password}_${timestamp}`;
  const md5Hash = CryptoJS.MD5(xAuthValue).toString();
  return md5Hash;
}

const apiUrl = "http://api.valantis.store:40000/";
const password = "Valantis";
const xAuthHeaderValue = generateXAuthHeader(password);

export const fetchData = async (requestData) => {
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Auth": xAuthHeaderValue,
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    if (
      error instanceof Error &&
      error.message.includes("Network response was not ok")
    ) {
      console.log("Retrying request...");
      return fetchData(requestData);
    } else {
      console.error("Unable to retry request. Error:", error);
    }
  }
};

const fetchIds = async () => {
  const requestData = {
    action: "get_ids",
    params: {},
  };

  return await fetchData(requestData);
};

const fetchItems = async (ids) => {
  const requestData = {
    action: "get_items",
    params: { ids },
  };

  return await fetchData(requestData);
};

export const displayData = (data) => {
  const dataContainer = document.getElementById("dataContainer");
  const results = data.result;

  if (results.length === 0) {
    dataContainer.innerHTML = "<p>Нет данных</p>";
    return;
  }

  const html = results
    .map((item) => {
      const brand = item.brand || "N/A";
      const price = item.price || "N/A";
      const id = item.id || "N/A";
      const product = item.product || "N/A";

      return `
      <div class="data-item">
        <p>Brand: ${brand}</p>
        <p>Price: ${price}</p>
        <p>ID: ${id}</p>
        <p>Product: ${product}</p>
      </div>
    `;
    })
    .join("");

  dataContainer.innerHTML = html;
};

window.onload = async function () {
  const idsResponse = await fetchIds();
  const productIds = idsResponse.result;
  const itemsResponse = await fetchItems(productIds);
  displayData(itemsResponse);
};
