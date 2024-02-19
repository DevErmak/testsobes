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
  "def502002252f4710ca2e4db4e1939ab3c23ac3bc1dc95746669e82393d66b23549ed1f6ec347a9c5898b863ffabb6b39929e3e3895ab49abbb3d94ca87cbcbda9bc7a3b64171f0d77faa034858c7387ee1b57850c74d3c38bcaebc0a86dde8027df1d36b41d34ed068b40d04618e8126a231365ab48a0292971092be68d613a470e041d6fbe8d349e16768b70236e866c421f3f44f4a0937ffd6f0ffd2c32d2e1536f298d06e7eb4a45a421470ad3f10536556549f527cf840c63ed47c4c1b6e9f91a77bf1c4cab8226f2cc218b79c70b744d2611296994eac77685f6191404d50a4408f81007cef9690d273ae36fbe67637e6dd2d7b03b4737bfd6096588fbe65b01e6fb04c186463fb3e4b5512c0e7550dcfb2ebad34e7f211e282003cb724df58b9c5b576c731c7969bf68c0798ae45f0e134029514918f51d0dfb43e967970add2825d02995cb5371dd792e8f29dc3afca8d0eb1240e88558690bb3f0e67c69c9238e7a19c78045952da81da1677d97132f55c7f4ff88a183936e6ebc8f55355021f5bd0a903306751f9cf3a46d95c112d562e2a6ef9ec5dc492c5f4b1c43b0a4f64e58d274369b84db5191cc91d2b78b742783b17021cac3aaf03035bc3dd1323957385dd7fe4d733584eae1ffbb2227240ea66d801c6a1acecbe7f0ac6f378f5a8baa81d310c9c3b7ce4eb893dd";

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
  drawLoauder();
  await getDataDeal({ limit: itemPerPage.value, page: pageNumber });
  updateTable();
  isDataLoading = true;
  drawLoauder();
});

const btnPrev = document.getElementById("prev");
const btnNext = document.getElementById("next");

btnPrev.addEventListener("click", async () => {
  if (itemPerPage.value !== "all") {
    stateDataDeal = [];
    if (pageNumber > 1) {
      pageNumber--;
    }
    isDataLoading = false;
    drawLoauder();
    await getDataDeal({ limit: itemPerPage.value, page: pageNumber });
    updateTable();
    isDataLoading = true;
    drawLoauder();
  }
});

btnNext.addEventListener("click", async () => {
  if (itemPerPage.value !== "all") {
    if (stateDataDeal.length < itemPerPage.value) return;
    stateDataDeal = [];
    pageNumber++;
    isDataLoading = false;
    drawLoauder();
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
    drawLoauder();
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
const drawLoauder = () => {
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
  drawLoauder();
  await getDataDeal({ limit: itemPerPage.value, page: pageNumber });
  updateTable();
  isDataLoading = true;
  drawLoauder();
};

main();
