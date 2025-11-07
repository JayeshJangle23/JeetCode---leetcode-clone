// const axios = require("axios");

// const getLanguageById = async (lang) => {
//   const language = {
//     "c++": 54,
//     java: 62,
//     javascript: 63,
//   };
//   return language[lang.toLowerCase()];
// };

// const submitBatch = async (submission) => {
//   const options = {
//     method: "POST",
//     url: "https://judge0-ce.p.rapidapi.com/submissions/batch",
//     params: {
//       base64_encoded: "false",
//     },
//     headers: {
//       "x-rapidapi-key": "6eed502f66msh5f374df41468c4dp13e728jsne34dd93bc977",
//       "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
//       "Content-Type": "application/json",
//     },
//     data: {
//       submissions:submission,
//     },
//     timeout: 10000,
//   };

//   async function fetchData() {
//     try {
//       const response = await axios.request(options);
//       return response.data;
//     } catch (error) {
//       console.error(error);
//     }
//   }

//   return await fetchData();
// };

// const waiting = async(timer) => {
//     return new Promise(resolve => {
//         setTimeout(resolve, timer);
//     });
// }
// const submitToken = async (resultTokens) => {
//   const options = {
//     method: "GET",
//     url: "https://judge0-ce.p.rapidapi.com/submissions/batch",
//     params: {
//       tokens: resultTokens.join(","),
//       base64_encoded: "false",
//       fields: "*",
//     },
//     headers: {
//       "x-rapidapi-key": "6eed502f66msh5f374df41468c4dp13e728jsne34dd93bc977",
//       "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
//     },
//   };

//   async function fetchData() {
//     try {
//       const response = await axios.request(options);
//       return response.data;
//     } catch (error) {
//       console.error(error);
//     }
//   }

//   while (true) {
//     // const result = await fetchData();

//     // const IsResultObtain = result.submissions.every((r) => r.status_id > 2);

//     // if (IsResultObtain) return result.submission;
//     // await waiting(1000);
    
//     const response = await axios.request(options);
//     const result = response.data;

//     const submissions = result.submissions || result;

//     const isReady = submissions.every((r) => r.status_id > 2);

//     if (isReady) return submissions;

//     await waiting(1000);
//   }
// };
// module.exports = { getLanguageById, submitBatch ,submitToken };


const axios = require('axios');
require("dotenv").config();


const getLanguageById = (lang)=>{

    const language = {
        "c++":54,
        "java":62,
        "javascript":63
    }


    return language[lang.toLowerCase()];
}


const submitBatch = async (submissions)=>{


const options = {
  method: 'POST',
  url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
  params: {
    base64_encoded: 'false'
  },
  headers: {
    'x-rapidapi-key': process.env.JUDGE0_KEY,
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
    'Content-Type': 'application/json'
  },
  data: {
    submissions
  }
};

async function fetchData() {
	try {
		const response = await axios.request(options);
		return response.data;
	} catch (error) {
		console.error(error);
	}
}

 return await fetchData();

}


const waiting = async(timer)=>{
  setTimeout(()=>{
    return 1;
  },timer);
}

// ["db54881d-bcf5-4c7b-a2e3-d33fe7e25de7","ecc52a9b-ea80-4a00-ad50-4ab6cc3bb2a1","1b35ec3b-5776-48ef-b646-d5522bdeb2cc"]

const submitToken = async(resultToken)=>{

const options = {
  method: 'GET',
  url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
  params: {
    tokens: resultToken.join(","),
    base64_encoded: 'false',
    fields: '*'
  },
  headers: {
    'x-rapidapi-key': process.env.JUDGE0_KEY,
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
  }
};

async function fetchData() {
	try {
		const response = await axios.request(options);
		return response.data;
	} catch (error) {
		console.error(error);
	}
}


 while(true){

 const result =  await fetchData();

  const IsResultObtained =  result.submissions.every((r)=>r.status_id>2);

  if(IsResultObtained)
    return result.submissions;

  
  await waiting(1000);
}



}


module.exports = {getLanguageById,submitBatch,submitToken};









