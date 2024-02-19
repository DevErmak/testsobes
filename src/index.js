const instance = axios.create({
  baseURL: "http://localhost:3000/",
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
    "Access-Control-Allow-Headers":
      "Accept, X-Requested-With, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization",
  },
});
const CODE_AUTH =
  "def502008b51f04ee80e4d393d35404d1b7e317dd04600ecaabb513d168ac5e09b72b85380ebbeab6e15d270314bb82ec054cc4ca9fc4ec36d98bf1355575ce35312bc5e6657f26f6f1de7dcdb115c3881f9307c62c67482722b7d26f121af84a4e5034f6c3250331be845296e152c967edc2756d8e756b92d841ba24af7ff30c6da7b5cb2a7bf1ce4a17be1c22144df3d44d7b8776e00d82489209b9e9dc89afe6545a175acef2477c57a573d616f6b95b1386a37161551b74a01cb49b10c13a32d0bd428fdaa826c6b7630ea9380499e84a5ff01de245a7f8973e39b6525510a9600dbc6b7bcb32847de6989a754f801548cd238685d7de2cf206cb86de5569c78531ebf7c14cfe4d3f98d3c877abb7d2de538357c6aff3f3b8a824bd6d862d7f12b0cf88a40230269f46ba470715b71b64d23ec0f0a02e86e55c393dd760f55e94c26caf43af72c7fb9eb54c64f6cfd5c8fd81a7d88f15d3447b70e74b67177a0b5e03a52287f836f92c6109338dc662f29e9ed0d2bb69ed6d6e8bd4d3ff40822311b3d40238aaed49c9c2c9eac8d6fdf8bd9c48e0f72bf07311c1ddf561a896a216a9891ddd223677dacab810977cf4728d7c61f8722e77d46a1e87a6043d42c1e2b431184d57027568f4875ee50e04506c0f5355ede78b530aeef8ca2e555f4f12c3cd6a25f201a0f7418120c3c22";

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
  access_token: "",
  refresh_token: "",
  expires_in: null,
  token_type: "",
};

const getToken = async () => {
  let result = {};
  if (dataToken.access_token !== "") {
    console.log("refresh");
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

const getDataDeal = async (dataParams) => {
  isZeroDealsLeft = false;
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
          const currentArray = deals.map((deal) => ({
            name: deal.name,
            price: deal.price,
            created_at: parseDate(deal.created_at),
            updated_at: parseDate(deal.updated_at),
            responsible_user_id: deal.responsible_user_id,
          }));
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
      page++;
      try {
        const data = await getDeals(5, page);
        response = data !== "" ? [...data._embedded.leads] : [];
        if (data !== "" && data._embedded.leads.length > 0) {
          const deals = data._embedded.leads;
          const currentArray = deals.map((deal) => ({
            name: deal.name,
            price: deal.price,
            created_at: parseDate(deal.created_at),
            updated_at: parseDate(deal.updated_at),
            responsible_user_id: deal.responsible_user_id,
          }));
          stateDataDeal = [...stateDataDeal, ...currentArray];
        } else {
          isZeroDealsLeft = true;
        }
      } catch (err) {
        console.log("error get deal", err);
        break;
      }
    } while (response.length === 5);
  }
  if (dataParams.limit <= 5) {
    try {
      const data = await getDeals(dataParams.limit, dataParams.page);
      if (data !== "" && data._embedded.leads.length > 0) {
        const deals = data._embedded.leads;
        const currentArray = deals.map((deal) => ({
          name: deal.name,
          price: deal.price,
          created_at: parseDate(deal.created_at),
          updated_at: parseDate(deal.updated_at),
          responsible_user_id: deal.responsible_user_id,
        }));
        stateDataDeal = [...currentArray];
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

itemPerPage.addEventListener("change", async () => {
  name.innerHTML = `Имя сделки`;
  price.innerHTML = `Бюджет`;
  stateSort.name = "";
  stateSort.order = "desc";
  stateDataDeal = [];
  pageNumber = 1;
  isDataLoading = false;
  drawLoader();
  await getDataDeal({ limit: itemPerPage.value, page: pageNumber });
  updateTable();
  isDataLoading = true;
  drawLoader();
});

const btnPrev = document.getElementById("prev");
const btnNext = document.getElementById("next");

btnPrev.addEventListener("click", async () => {
  if (itemPerPage.value !== "all") {
    stateDataDeal = [];
    if (pageNumber > 1) {
      pageNumber--;
      isDataLoading = false;
      drawLoader();
      await getDataDeal({ limit: itemPerPage.value, page: pageNumber });
      updateTable();
      isDataLoading = true;
      drawLoader();
    } else {
      isDataLoading = false;
      await getDataDeal({ limit: itemPerPage.value, page: pageNumber });
      updateTable();
      isDataLoading = true;
    }
  }
});

btnNext.addEventListener("click", async () => {
  if (itemPerPage.value !== "all") {
    if (stateDataDeal.length < itemPerPage.value) return;
    stateDataDeal = [];
    pageNumber++;
    isDataLoading = false;
    drawLoader();
    await getDataDeal({
      limit: itemPerPage.value,
      page: pageNumber,
    });
    if (isZeroDealsLeft) {
      pageNumber--;
      await getDataDeal({
        limit: itemPerPage.value,
        page: pageNumber,
      });
    }
    updateTable();
    isDataLoading = true;
    drawLoader();
  }
});

const name = document.getElementById("name");
const price = document.getElementById("price");

price.addEventListener("click", () => {
  console.log("clik");
  stateSort.name = "price";
  stateSort.order = stateSort.order === "desc" ? "asc" : "desc";
  name.innerHTML = `Имя сделки`;
  price.innerHTML = `Бюджет ${
    stateSort.order === "desc" ? "&uarr;" : "&darr;"
  }`;
  updateTable();
});
name.addEventListener("click", () => {
  console.log("clik");
  stateSort.name = "name";
  stateSort.order = stateSort.order === "desc" ? "asc" : "desc";
  price.innerHTML = `Бюджет`;
  name.innerHTML = `Имя сделки ${
    stateSort.order === "desc" ? "&uarr;" : "&darr;"
  }`;
  updateTable();
});

const updateTable = () => {
  console.log("update", stateSort);
  if (stateSort.name !== "") {
    console.log("if", stateSort);
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
  console.log("---------------->stateDataDeal", stateDataDeal);
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
  const loader = document.getElementById("loader");
  console.log(isDataLoading);
  if (!isDataLoading) {
    console.log("draw");
    console.log(loader);
    loader.innerHTML =
      '<img src="../src/loading.gif" height="100%"  width="100%"/>';
  } else {
    loader.innerHTML = "";
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
