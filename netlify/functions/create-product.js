require('dotenv').config();
const Commerce = require('@chec/commerce.js');

const commerce = new Commerce(process.env.COMMERCEJS_SECRET_KEY, true);

exports.handler = async (event, context) => {
  const { name, price, description } = JSON.parse(event.body);

  try {
    const newProduct = await commerce.products.create({
      name,
      price: parseFloat(price),
      description,
    });
    return {
      statusCode: 200,
      body: JSON.stringify(newProduct),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
