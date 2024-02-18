let pageNumber = 1;
let stateDataDeal = [];
let isDataLoading = false;
let isZeroDealsLeft = false;

let userData = {
  client_id: "756a610b-eb07-4014-8f1d-634f54d38af7",
  client_secret:
    "iQq3kmWaZWQDSyWvf3ByMiAT2BTXTV8EYgP0Zen7mP7VVWjNvHZWgVLFWI0CrJy6",
};

const CODE_AUTH =
  "def50200de2f7e247fd63b8d87eb4223249ed118f6a71c4ced2529b9a02aef46c3923e267fa67118507d07f8185854c876204317c5d6da7b65f69624ac9db63586ff80423073d8646ea4cdd2ac64b3a4c11ba947b6d775a05e3e0c40fb7f3725b78b77f6839c879f1d4d9ca74f47e6d5b692c9c743a0904b9cbb0970d30a1277753e0a9cb05859e337a02c137cd774cef408a23495f68b6e8221a495cded114cde5c7650fb2f2e3bceef90a5b1f275e8aa19513767e319d576d6b4f8ae7ff7b69387b70a626c4ae1e4190f68ce1f5dcf7e7c6145008a8b8913afa0913a13cc644168535a54999b6c25cd9af3cbb8e0a633bcecef97b2fb8f16044bf408da230226e37d55e42bbf084c7cafd770809276f38d1f9d1b2c8453308cb3922a572386fb5a95b8242f4d80596345e9e1ba3e65d71b2fd7c8bf412f44c3ea567a48a06e569f9e26be7657e0cdae213ec090f2a6b524644103e669b3fc8e63db7683d323f08988049849a6c7d96e1cce737912cc644bfd6f4445e1801ea87ac48b81c6632188acd434bdff25fe3385c1d2d48558b04c6ab69854bd5ed630a8f977289c60382361e12849c77ac2adb9653977cdcedcdeca00e7f5212ba7bdab7217af28d94c49e7c426fa2f014f39f7bb216e8a90f72f89a10d156718f8696031e9da649ca207b52a25b0dfda46c811d55006a559a6";

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
        const { data } = await axios.post(
          "http://localhost:3000/api/refreshToken",
          {
            ...userData,
            refresh_token: dataToken.refresh_token,
          },
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
              "Access-Control-Allow-Headers":
                "Accept, X-Requested-With, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization",
            },
          }
        );
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
    console.log("get new ");
    try {
      const { data } = await axios.post(
        "http://localhost:3000/api/getToken",
        {
          ...userData,
          code: CODE_AUTH,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
            "Access-Control-Allow-Headers":
              "Accept, X-Requested-With, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization",
          },
        }
      );
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
        const { data } = await axios.post(
          "http://localhost:3000/api/getDeal",
          {
            params: {
              limit: 5,
              page: i,
            },
            token: dataToken.access_token,
          },
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
              "Access-Control-Allow-Headers":
                "Accept, X-Requested-With, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization",
            },
          }
        );
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
        const { data } = await axios.post(
          "http://localhost:3000/api/getDeal",
          {
            params: {
              limit: 5,
              page: page,
            },
            token: dataToken.access_token,
          },
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
              "Access-Control-Allow-Headers":
                "Accept, X-Requested-With, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization",
            },
          }
        );
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
      const { data } = await axios.post(
        "http://localhost:3000/api/getDeal",
        {
          params: {
            limit: dataParams.limit,
            page: dataParams.page,
          },
          token: dataToken.access_token,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
            "Access-Control-Allow-Headers":
              "Accept, X-Requested-With, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization",
          },
        }
      );
      console.log("data in <5", data);
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
  const { data } = await axios.post(
    "http://localhost:3000/api/getDeal",
    {
      params: {
        user_id: dataParams.user_id,
      },
      token: dataToken.access_token,
    },
    {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
        "Access-Control-Allow-Headers":
          "Accept, X-Requested-With, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization",
      },
    }
  );
  return data;
};

const stateSort = document.getElementById("select-sort");

const itemPerPage = document.getElementById("itemperpage");

itemPerPage.addEventListener("change", async () => {
  stateSort.value = "none";
  // if (itemPerPage.value === "all") {
  // let data;
  // const replay = setInterval(async () => {
  //   try {
  //     data = await getDataDeal({
  //       limit: 5,
  //       page: pageNumber,
  //     });
  //     const tbody = document.getElementById("tableDataDeal");
  //     console.log("in timer", data);
  //     if (data !== "") {
  //       data._embedded.leads.forEach((deal) => {
  //         const row = document.createElement("tr");
  //         for (const key in deal) {
  //           const cell = document.createElement("td");
  //           cell.textContent = deal[key];
  //           row.appendChild(cell);
  //         }
  //         tbody.appendChild(row);
  //       });
  //       pageNumber++;
  //     } else {
  //       pageNumber--;
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }, 500);
  // console.log("pupu", data);
  // if (data === "") {
  //   console.log("clearInterval");
  //   clearInterval(replay);
  // }
  // } else {
  stateDataDeal = [];
  pageNumber = 1;
  isDataLoading = false;
  await getDataDeal({ limit: itemPerPage.value, page: pageNumber });
  updateTable();
  isDataLoading = true;
  // }
});

const btnPrev = document.getElementById("prev");
const btnNext = document.getElementById("next");

btnPrev.addEventListener("click", async () => {
  stateDataDeal = [];
  console.log("pageNumber", pageNumber);
  if (pageNumber > 1) {
    pageNumber--;
  }
  isDataLoading = false;
  await getDataDeal({ limit: itemPerPage.value, page: pageNumber });
  updateTable();
  isDataLoading = true;
});

btnNext.addEventListener("click", async () => {
  console.log("stateDataDeal.length", stateDataDeal.length);
  console.log("itemPerPage.value", itemPerPage.value);
  console.log("isZeroDealsLeft", isZeroDealsLeft);
  if (stateDataDeal.length < itemPerPage.value) return;
  stateDataDeal = [];
  pageNumber++;
  console.log("pageNumbernex", pageNumber);
  // if (pageNumber < maxPage) pageNumber++;
  isDataLoading = false;
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
});

function updateTable() {
  switch (stateSort.value) {
    case "name":
      stateDataDeal.sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        } else if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
      break;
    case "price":
      stateDataDeal.sort((a, b) => {
        if (a.price < b.price) {
          return -1;
        } else if (a.price > b.price) {
          return 1;
        }
        return 0;
      });
      break;
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
}

const main = async () => {
  await getToken();
  console.log("access_token", dataToken.access_token);
  console.log("refresh_token", dataToken.refresh_token);
  isDataLoading = false;
  await getDataDeal({ limit: itemPerPage.value, page: pageNumber });
  updateTable();
  isDataLoading = true;
};

main();
