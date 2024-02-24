const crypto = require("crypto");

function generateXAuthHeader(password) {
  const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, ""); // Get current date in YYYYMMDD format
  const data = `${password}_${timestamp}`;
  const hash = crypto.createHash("md5").update(data).digest("hex");
  return hash;
}

const apiUrl = "http://api.valantis.store:40000/";
const password = "Valantis";
const xAuthHeaderValue = generateXAuthHeader(password);

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
