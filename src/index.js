const link = "";
const authorization_code = "";
const access_token = "";
const refresh_token = "";
console.log("---------------->123");

let bodyGetTokens = {
  client_id: "26fe2bf5-6a9f-4807-b226-66b03f5dad97",
  client_secret:
    "Xt5FETKcgktn4vHgZK8DuSsTefk8Q5l5SnaM3t3AjQ7y2uFSbCZy6Jl254PU8jTz",
  grant_type: "authorization_code",
  code: "def5020081163654fd9b94aeea7cb6cda1cadf7577e13765909ce6157a5ee73f8e48a4740b272eeb78fa74644ebd8159b5db80725e4db9c64eb5862a8f0095a4a718e309136321438d59db877c0c865a0dedc45fe5197b79db8164b5f53f8a5aafb30e13cf8725fbfc0dbd4b4c91bf6468e92a2721768b2f46dac20c46632ade7c893df2b79a14e0514cb390ebf05374e84cc6717f9e00e3d2145db43166960a7f068c7f8392f2285abb2017ea21c69a32fd439bfad5adcda39a410db586bdfe4ac90585fbf82afb8fd8ddd37439137cad850ba7ad8729c28ff716f0cc4bc9ccd24115802d9946908844d328c331b8db17d148e82741bb35dc86978f92e0f99d10ab52c03cdc246b6aa571d18890d02dd3b6fb2911ed9c250c1f85fb3dffe8bf9fd3d41cc5a63f86f57eaf63dd22134c37681cc643860b2cc6add25a79e052ca21fb8b8daba922f17e01b78267d509072e134eea9312669c9c51c24a02f3958cb72224a66f73080c1604a841853c468d34c244ef71ec13d5d686399611807c4f940265c3e02d2ed20831c6f6d3de5b6e9fa94f7017783d44e2b3461afeb68923a693670e27c89fde9d03ddd4853d0dff84da2491647de61e0d72576b7a5cf3a5d354ae8207cbc70f0e9a6618422df0c4096fa582a32d2ec710e3569cda1adebe667bb09986aa",
  redirect_uri: "http://localhost:3000",
};

const getToken = async () => {
  const { data } = await axios.post(
    "http://localhost:3000/api/getToken",
    {
      bodyGetTokens,
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
  console.log("---------------->data", data);
};
getToken();
