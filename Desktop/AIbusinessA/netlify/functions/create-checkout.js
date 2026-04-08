const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  // Use the variable name shown in your Netlify settings
  const priceId = process.env.STRIPE_PRICE_MODEL_MONTHLY || process.env.STRIPE_PRICE_ID;

  if (!process.env.STRIPE_SECRET_KEY || !priceId) {
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: '環境変数が正しく読み込めません。Netlifyの STRIPE_SECRET_KEY と STRIPE_PRICE_MODEL_MONTHLY を確認してください。',
        debug: {
            hasSecret: !!process.env.STRIPE_SECRET_KEY,
            hasPrice: !!priceId
        }
      }),
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const { email, name, shop } = JSON.parse(event.body);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      customer_email: email,
      metadata: {
        customer_name: name,
        shop_name: shop
      },
      success_url: `${process.env.URL || 'http://localhost:8888'}/index.html?status=success`,
      cancel_url: `${process.env.URL || 'http://localhost:8888'}/index.html?status=cancel`,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url }),
    };
  } catch (error) {
    console.error('Stripe Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
