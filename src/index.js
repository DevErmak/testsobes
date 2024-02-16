let pageNumber = 1;
let stateDataDeal = [];

// const renderDataDeal = () => {
//   const s = stateDataDeal
//     .map((deal) => {
//       return `<tr>
//     <td>${deal.name}</td>
//     <td>${deal.price}</td>
//     <td>${deal.created_at}/${deal.updated_at}</td>
//     <td>${deal.responsible_user_id}</td>
//     </tr>`;
//     })
//     .join("");
//   console.log("---------------->s", s);
//   return s;
// };

const markupPagination = () => {
  return `<div class="bottom-field">
        <ul class="pagination">
          <li class="prev"><a href="#" id="prev">&#139;</a></li>
            <!-- page number here -->
          <li class="next"><a href="#" id="next">&#155;</a></li>
        </ul>
    </div>`;
};

let userData = {
  client_id: "756a610b-eb07-4014-8f1d-634f54d38af7",
  client_secret:
    "iQq3kmWaZWQDSyWvf3ByMiAT2BTXTV8EYgP0Zen7mP7VVWjNvHZWgVLFWI0CrJy6",
};
const CODE_AUTH =
  "def50200134bf5df3b6f14fa9d05a061d58750c3ee1fdac7c38b7380fe8da0dfc3f840fd897936fe531bc0d2809edde492fbe1fe2c14289402a4a4240c93a133716b22b0ad55cdb1f91f314cf04cf9235a4e5c8aebdafb0348fd6bb39d4b2434da08aa7b2d1e947277a018af226d08423febd6bfd8ed40e869ebf108e069cd486662e99ca236723b8ab02da17b96ff0effedb066cbf2e1f0fcee0d1a185f5b106f6b9fd6b86ba01855fcbf0cabfbe7b423393ab8bd54e696e8d5be24fd6aa50152e2cfbcdd26416cd48701f829e8b0af4013b65e7f9cec4f9c3ba2c635dbdac1b368d31c913cf998b35c31b2910427a83d4ee113625d5ce2a006ef58e2a37e356c72a455bf45367c8fa106cf604eeca76c5c1dd7258c20a15a3217800a2a7bbf349f4b5400619ccbe77795c06cea5574bea69c7e930dce85343cae39a84da46b8c048e7bf9d4843c94b0cc3cc4c731ebdc868674dc3f08bb832aaf8fc45111f0fb30d42bf7be6dc7c1fa9d8f0fd38f742841d1fed3e36a8ffe256d04cc419479f44ac6bafb988f9a2e407b11e5d9516e2578c65aa35669da7e23a31f853894e248d3bbba9ec2e0a643d19b16db5a57275eb471601aaecba96ec770f022dd8f8f4ae65a912b7899eef6651ee4a0146c4014fde9c5b26f072c314b7f09b9af7b131af8bab4457204716e2589b38d7b2cc598";

let dataToken = {
  access_token: "",
  refresh_token: "",
  expires_in: null,
  token_type: "",
};

const getToken = async () => {
  let result = {};
  console.log(
    "---------------->dataToken.access_token",
    dataToken.access_token
  );
  if (dataToken.access_token !== "") {
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
    try {
      console.log("---------------->getTokem metig");
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
      console.log("---------------->!!!!data", data);

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
  const { data } = await axios.post(
    "http://localhost:3000/api/getDeal",
    {
      params: {
        limit: dataParams.limit,
        page: dataParams.page,
        // `order[${updated_at}]`: dataParams,
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
  console.log("---------------->data111s", data);
  if (data !== "") {
    const deals = data._embedded.leads;
    const currentArray = deals.map((deal) => ({
      name: deal.name,
      price: deal.price,
      created_at: parseDate(deal.created_at),
      updated_at: parseDate(deal.updated_at),
      responsible_user_id: deal.responsible_user_id,
    }));
    stateDataDeal = [...currentArray];
  }
  return data;
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
  console.log("---------------->dataUser111s", data);
  return data;
};

const itemPerPage = document.getElementById("itemperpage");

itemPerPage.addEventListener("change", async () => {
  stateDataDeal = [];
  pageNumber = 1;
  console.log("Vanilla change: ", itemPerPage.value);
  await getDataDeal({ limit: itemPerPage.value, page: pageNumber });
  updateTable();
});

const btnPrev = document.getElementById("prev");
const btnNext = document.getElementById("next");

btnPrev.addEventListener("click", async () => {
  stateDataDeal = [];
  console.log("pageNumber", pageNumber);
  if (pageNumber > 1) pageNumber--;
  await getDataDeal({ limit: itemPerPage.value, page: pageNumber });
  updateTable();
});
btnNext.addEventListener("click", async () => {
  pageNumber++;
  console.log("pageNumbernex", pageNumber);
  // if (pageNumber < maxPage) pageNumber++;
  const data = await getDataDeal({
    limit: itemPerPage.value,
    page: pageNumber,
  });
  if (data === "") {
    pageNumber--;
    await getDataDeal({
      limit: itemPerPage.value,
      page: pageNumber,
    });
  }
  updateTable();
});

function updateTable() {
  const tbody = document.getElementById("tableDataDeal");
  console.log("---------------->tbody", tbody);
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
  console.log("---------------->itemPerPage", itemPerPage.value);
  await getDataDeal({ limit: itemPerPage.value, page: pageNumber });
  updateTable();
};

main();
