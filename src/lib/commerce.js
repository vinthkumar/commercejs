// import Commerce from '@chec/commerce.js';

// const checAPIKey = process.env.REACT_APP_CHEC_PUBLIC_KEY;
// const devEnvironment = process.env.NODE_ENV === 'development';

// const commerceConfig = {
//   axiosConfig: {
//     headers: {
//       'X-Chec-Agent': 'commerce.js/v2',
//       'Chec-Version': '2021-09-29',
//     },
//   },
// };

// if (devEnvironment && !checAPIKey) {
//   throw Error('Your public API key must be provided as an environment variable named NEXT_PUBLIC_CHEC_PUBLIC_KEY. Obtain your Chec public key by logging into your Chec account and navigate to Setup > Developer, or can be obtained with the Chec CLI via with the command chec whoami');
// }

// export default new Commerce(
//   checAPIKey,
//   devEnvironment,
//   commerceConfig,
// );

// commerce.js
import Commerce from '@chec/commerce.js';

// Replace 'your_public_key' with your actual public key from Commerce.js
export const commerce = new Commerce('pk_test_56105ee8369fe50d2e069b13ec19026b0e796fd55faf7', true);