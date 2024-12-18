import axios from "axios";

async function fetchIndexData() {
  try {
    const response = await axios('https://pro-api.coinmarketcap.com/v3/index/cmc100-historical?count=7', {
      method: "GET",
      headers: {
        "X-CMC_PRO_API_KEY": process.env.CMC_API ?? ""
      }
    })

    if (response.status != 200) {
      console.log(response)
      throw new Error('Failed to fetch data');
    }

    const data = await response.data;
    console.log(data)
    console.log("=========== data above ==========")
    return data;
  } catch (error) {
    console.log(error)
    return []
  }
}

fetchIndexData();

