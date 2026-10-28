require('dotenv').config();

const express = require('express');
const app = express();

const cors = require('cors');
const { connectDB } = require('./config/db');
connectDB();

const { notFound, errorHandler} = require('./middleware/errorMiddleware')


app.use(cors());
app.use(express.json());

app.use('/api/health', require('./routes/health.routes'));
app.use('/api/products', require('./routes/products.routes'));

app.use('/api/orders', require('./routes/orders.routes'))

app.use('/api/auth', require('./routes/auth.routes'))

app.use('/api/categories', require('./routes/category.routes'));

app.use('/api/collections', require('./routes/collection.routes'));

app.use('/api/settings', require('./routes/storeSettings.routes'));

app.use('/api/cart', require('./routes/cart.routes'));

app.use('/api/wishlist', require('./routes/wishlist.routes'));

app.use('/api/shipping', require('./routes/shippingRate.routes'));

app.use(notFound);
app.use(errorHandler)




const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`api listening on http://localhost:${PORT}`);
});

