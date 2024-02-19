const instance = axios.create({
  baseURL: "http://localhost:3000/", //был поднят свой proxy-сервер на localhost:3000
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
    "Access-Control-Allow-Headers":
      "Accept, X-Requested-With, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization",
  },
});

const CODE_AUTH =
  "def50200abe0ada33f91b323d6169a9c01e8db4b3251c29cbcbb7a043f059ae5a058974cb5836500e1b39263bd3a346820373410805a7802e78af39522d65b36dc80ea1ba41b9d8c5fcd77f372befc389fa24f61b446e1d450e8d136cbe89c2cfd5b61d70f30fa858cc4e9b8bcc9e9d9a72c376c2258cbe9ad286b0d647394ce564e7a656e894dfc737c3ab8342a371123bfebfbc1bad138827e66c1eb5c801298424b315c79713a29073da0ead578037dfd5c1fd7077f8db71dd1ef0227ad8d97e45581e934f6874cbc0bd31b8c46ac1dab9f17226432b845018c5f391708fb6223e24d13ce52b222f7573d5fdd11d6a56c80742005e1912892f69c76f1ce82062cc3823aaf0212b713ecda64b579281d74b2c6168a3c97761adc28a4fe62ed65bae544009fd496d471b80c3a8d3a5482a121b96437390cce536fe532f6317c99917a04b6da8d5fac8fee6870ad79672ae250056b2b1d9482866f0309fec300fb719c1ab77e1fe4b0d940a04f4f02772e7f9145e88b3ea2261b5f632fbfefb9e739e4348600c66d34bb06fb4fd6acc46937c08041a646a00a574ea79dfeb6aae037dff35db3ade6853589d7df7cc060120cdb928af103c588d641668e42b7d7ff8d37c722e252870bb3377c4449a01efcff19d8460b063e7a386b1e05ed61761df79434c3949e2b04f14569ecc82ff564";

let pageNumber = 1;
let stateDataDeal = [];
let isDataLoading = false;
let isZeroDealsLeft = false;
let stateSort = { name: "", order: "desc" };

let userData = {
  client_id: "756a610b-eb07-4014-8f1d-634f54d38af7",
  client_secret:
    "iQq3kmWaZWQDSyWvf3ByMiAT2BTXTV8EYgP0Zen7mP7VVWjNvHZWgVLFWI0CrJy6",
};

let dataToken = {
  access_token:
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjUxMmFiZDcxOTA4YWVkYjA1YmYyODJlMjU0MGEyMWE4ZThlNTM1YmJmZTQwYzZhMmUxY2Y1MDJiMjU2OWQ2NTFlMTE2YTgzNzAzMDA2MTEwIn0.eyJhdWQiOiI3NTZhNjEwYi1lYjA3LTQwMTQtOGYxZC02MzRmNTRkMzhhZjciLCJqdGkiOiI1MTJhYmQ3MTkwOGFlZGIwNWJmMjgyZTI1NDBhMjFhOGU4ZTUzNWJiZmU0MGM2YTJlMWNmNTAyYjI1NjlkNjUxZTExNmE4MzcwMzAwNjExMCIsImlhdCI6MTcwODM0OTIwOSwibmJmIjoxNzA4MzQ5MjA5LCJleHAiOjE3MDg0MzU2MDksInN1YiI6IjEwNjc4NDkwIiwiZ3JhbnRfdHlwZSI6IiIsImFjY291bnRfaWQiOjMxNTcxNDA2LCJiYXNlX2RvbWFpbiI6ImFtb2NybS5ydSIsInZlcnNpb24iOjIsInNjb3BlcyI6WyJwdXNoX25vdGlmaWNhdGlvbnMiLCJmaWxlcyIsImNybSIsImZpbGVzX2RlbGV0ZSIsIm5vdGlmaWNhdGlvbnMiXSwiaGFzaF91dWlkIjoiZWIwYTE0ZWQtZDFhYy00ZDEyLWJiMGUtMjk1MGUzMDAwMjUwIn0.jtBNCQKMIMnKe_2E-qTPkmbD5APIm1mR0vd5BE_quygQ-Sf520vlNQ2pwiE1uYv2_sg0wZYxeQNVVHaKrXe2qhraIWzm02tv3MUrbQ3fZMQsShPnazUEc-AaJYUp8om7vgnaFBB4poLZ0PYcpEgTeNP7aFc4fp-ywHjihEB74QdQsU4zEm7s_bRbgAy-2H4ws6cbjDSK6fiqneCNxsnkjsKEXpTO9dJbwOyqwl6zISfKE9lDrbq8v5yJ7v96OqbrU4pf1TOhDMWBDogEoJi2H1y3M5EFts7YVrmpgoGbqKEdJN3UtIT4U2b4mZDj_0RtDPndYlWNytlSp_yUADVVuA",
  refresh_token:
    "def5020039ac3161cc53c73f3a033b723090662733722612efce250896594f9bba44e5f5078b6ec3c98bcdf99c900f5c1c8db743427ab58c79664ebc594d17f2b2562a4ae9aa9500a9421893859e085387a4966e8f9c573cdd5ff9cbbe46eed8ad66231535cdf8ebae5e8fb603c380472c4e771eeff2d085d6c45dbaf1921cc84d8e877d22e9941e0bbe2aeecfbf7c7ce94d4e897a3674a2889010c2819e870fafbe2a4f2c2379e62d8e1c3d7e51729bee9e4a87f01da801ac51d9e910de6958cdf158f397e07a3f1605c1a82dedf1765f1835f124572d8aa219d5f6df64e8465a38be8bca206b6257fef9190e19f3454e98f86a9a2f184c39bed1fccb6fb8af1e4f2358669707ad98c8bf8f204f5eee6b638a505549d94994c3ed6780f59d2fb6ba7c34ba21a750900cb105294548dcd13e065df7720935babcd0ad4649326dc45f1ed872684950c6426782017a4b874f254d67d4c81560012bf906eb5769bbe4c972806dcff7dd66987806262d777e2d5a45f67b7f9c4803663b5cd88d651b9cde791ba10dc7a41ead5b94f2dfb66843a07a7780bfdef2494143f1631f69b1cbff5d5f3d4dab3b5b114c54ad340dd74d43d242114ee570f4f18d5493b07d0b776b3a3d714b5b9edf40c86c4ff0464c259f93248cc11d9c03442b34b6e299cd303088217f8f8b3ad64811c06f6d",
  expires_in: 86400,
  token_type: "Bearer",
};

const parseDeal = (deal) => ({
  name: deal.name,
  price: deal.price,
  created_at: parseDate(deal.created_at),
  updated_at: parseDate(deal.updated_at),
  responsible_user_id: deal.responsible_user_id,
});

const getToken = async () => {
  let result = {};
  if (dataToken.access_token !== "") {
    if (Date.now() >= dataToken.expires_in * 1000) {
      try {
        const { data } = await instance.post("api/refreshToken", {
          ...userData,
          refresh_token: dataToken.refresh_token,
        });
        result = data;
        const { access_token, refresh_token, expires_in, token_type } = data;
        dataToken = {
          ...dataToken,
          access_token,
          refresh_token,
          expires_in,
          token_type,
        };
      } catch (err) {
        console.log("---------------->not have token", err);
      }
    }
  } else {
    try {
      const { data } = await instance.post("api/getToken", {
        ...userData,
        code: CODE_AUTH,
      });
      result = data;
      const { access_token, refresh_token, expires_in, token_type } = data;
      dataToken = {
        ...dataToken,
        access_token,
        refresh_token,
        expires_in,
        token_type,
      };
    } catch (err) {
      console.log("---------------->not have token", err);
    }
  }
  return result;
};

const getDeals = async (limit, page) => {
  try {
    const { data } = await instance.post("api/getDeal", {
      params: {
        limit,
        page,
      },
      token: dataToken.access_token,
    });
    return data;
  } catch (err) {
    console.log("no get data deal", err);
  }
};

let timer = 0;
let counter = 0;

const getDataDeal = async (dataParams) => {
  if (isZeroDealsLeft) {
    pageNumber--;
    dataParams.page =
      dataParams.page > 1 ? dataParams.page - 1 : dataParams.page;
    isZeroDealsLeft = false;
    stateDataDeal = [];
  }

  if (dataParams.limit > 5) {
    const pages = Math.trunc(dataParams.limit / 5);
    const float = dataParams.limit % 5 > 0 ? 1 : 0;
    const amoCrmPages = pages + float;
    const startPageIndex = (dataParams.page - 1) * amoCrmPages + 1;
    const endPageIndex = dataParams.page * amoCrmPages;

    for (let i = startPageIndex; i <= endPageIndex; i++) {
      try {
        const data = await getDeals(5, i);

        if (data !== "" && data._embedded.leads.length > 0) {
          const deals = data._embedded.leads;
          const currentArray = deals.map(parseDeal);
          stateDataDeal = [...stateDataDeal, ...currentArray];
        } else {
          isZeroDealsLeft = true;
          break;
        }
      } catch (err) {
        console.log("error get deal", err);
      }
    }
  }

  if (dataParams.limit === "all") {
    let response = [];
    let page = 0;

    do {
      page += 2;
      try {
        const timeDiff = Date.now() - timer;

        if (timeDiff < 1000 && counter == 2) {
          await new Promise((resolve) =>
            setTimeout(() => {
              resolve();
            }, timeDiff)
          );
        }

        timer = Date.now();
        counter = 1;
        const data = await getDeals(5, page);
        counter = 2;
        const data1 = await getDeals(5, page + 1);

        response = data !== "" ? [...data._embedded.leads] : [];
        response =
          data1 !== ""
            ? [...response, ...data1._embedded.leads]
            : [...response];

        if (data !== "" && data._embedded.leads.length > 0) {
          const deals = data._embedded.leads;
          const currentArray = deals.map(parseDeal);
          if (data1 !== "" && data._embedded.leads.length > 0) {
            const deals = data1._embedded.leads;
            const currentArray1 = deals.map(parseDeal);
            stateDataDeal = [
              ...stateDataDeal,
              ...currentArray,
              ...currentArray1,
            ];
          } else {
            isZeroDealsLeft = true;
            break;
          }
          stateDataDeal = [...stateDataDeal, ...currentArray];
        } else {
          isZeroDealsLeft = true;
          break;
        }
      } catch (err) {
        console.log("error get deal", err);
        break;
      }
    } while (response.length <= 10);
  }

  if (dataParams.limit <= 5) {
    try {
      const data = await getDeals(dataParams.limit, dataParams.page);
      if (data !== "" && data._embedded.leads.length > 0) {
        const deals = data._embedded.leads;
        const currentArray = deals.map(parseDeal);
        stateDataDeal = [...currentArray];

        if (data._embedded.leads.length < dataParams.limit) {
          isZeroDealsLeft = true;
        }
      } else {
        isZeroDealsLeft = true;
      }
    } catch (err) {
      console.log("error get deal", err);
    }
  }
};

const parseDate = (data) => {
  return `${new Date(data * 1000).toLocaleTimeString()} ${new Date(
    data * 1000
  ).toLocaleDateString()}`;
};

const getDataUser = async (dataParams) => {
  const { data } = await instance.post("api/getDeal", {
    params: {
      user_id: dataParams.user_id,
    },
    token: dataToken.access_token,
  });
  return data;
};

const itemPerPage = document.getElementById("itemperpage");

itemPerPage.addEventListener("change", async (event) => {
  const selectItemsPerPageValue = event.currentTarget.value;

  name.innerHTML = `Имя сделки`;
  price.innerHTML = `Бюджет`;
  stateSort.name = "";
  stateSort.order = "desc";
  stateDataDeal = [];

  pageNumber = 1;
  isZeroDealsLeft = false;

  isDataLoading = false;
  drawLoader();

  await getDataDeal({ limit: itemPerPage.value, page: pageNumber });
  updateTable();

  isDataLoading = true;
  drawLoader();

  if (selectItemsPerPageValue === "all") {
    btnPrev.disabled = true;
    btnNext.disabled = true;
  } else {
    btnPrev.disabled = true;
    btnNext.disabled = false;
  }
});

const btnPrev = document.getElementById("prev");
const btnNext = document.getElementById("next");

btnPrev.addEventListener("click", async () => {
  if (pageNumber <= 1) return;

  isZeroDealsLeft = false;
  stateDataDeal = [];
  pageNumber--;

  isDataLoading = false;
  drawLoader();

  await getDataDeal({ limit: itemPerPage.value, page: pageNumber });
  updateTable();

  isDataLoading = true;
  drawLoader();

  if (pageNumber <= 1) {
    btnPrev.disabled = true;
  }
  if (!isZeroDealsLeft) {
    btnNext.disabled = false;
  }
});

btnNext.addEventListener("click", async () => {
  if (stateDataDeal.length < itemPerPage.value) return;

  btnPrev.disabled = false;
  stateDataDeal = [];
  pageNumber++;

  isDataLoading = false;
  drawLoader();

  await getDataDeal({
    limit: itemPerPage.value,
    page: pageNumber,
  });
  updateTable();

  isDataLoading = true;
  drawLoader();

  if (isZeroDealsLeft) {
    btnNext.disabled = true;
  }
});

const name = document.getElementById("name");
const price = document.getElementById("price");

price.addEventListener("click", () => {
  stateSort.name = "price";
  stateSort.order = stateSort.order === "desc" ? "asc" : "desc";
  name.innerHTML = `Имя сделки`;
  price.innerHTML = `Бюджет ${
    stateSort.order === "desc" ? "&uarr;" : "&darr;"
  }`;
  updateTable();
});

name.addEventListener("click", () => {
  stateSort.name = "name";
  stateSort.order = stateSort.order === "desc" ? "asc" : "desc";
  price.innerHTML = `Бюджет`;
  name.innerHTML = `Имя сделки ${
    stateSort.order === "desc" ? "&uarr;" : "&darr;"
  }`;
  updateTable();
});

const updateTable = () => {
  if (stateSort.name !== "") {
    stateDataDeal.sort((a, b) => {
      if (a[stateSort.name] < b[stateSort.name]) {
        return stateSort.order === "desc" ? 1 : -1;
      } else if (a[stateSort.name] > b[stateSort.name]) {
        return stateSort.order === "desc" ? -1 : 1;
      }
      return 0;
    });
  }

  const tbody = document.getElementById("tableDataDeal");
  tbody.innerHTML = "";

  stateDataDeal.forEach((deal) => {
    const row = document.createElement("tr");
    for (const key in deal) {
      const cell = document.createElement("td");
      cell.textContent = deal[key];
      row.appendChild(cell);
    }
    tbody.appendChild(row);
  });
};

const drawLoader = () => {
  const loaderContainer = document.getElementById("loader-container");
  if (!isDataLoading) {
    loaderContainer.className = "loader-container active-loader";
  } else {
    loaderContainer.className = "loader-container none-active-loader";
  }
};

const main = async () => {
  await getToken();

  console.log("access_token", dataToken.access_token);
  console.log("refresh_token", dataToken.refresh_token);

  isDataLoading = false;
  drawLoader();

  await getDataDeal({ limit: itemPerPage.value, page: pageNumber });
  updateTable();

  isDataLoading = true;
  drawLoader();
};

main();
