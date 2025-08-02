import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Odoo from 'odoo-await';

dotenv.config();

const app = express();

const allowedOrigins = ['http://localhost:4173', 'http://localhost:4174'];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(cors(corsOptions));
app.use(express.json());

const { ODOO_URL, ODOO_DB, ODOO_USER, ODOO_PASSWORD } = process.env;

// --- Odoo Connection ---
let odoo;
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const connectToOdoo = async (retries = 5, delay = 5000) => {
    for (let i = 1; i <= retries; i++) {
        try {
            odoo = new Odoo({
                baseUrl: ODOO_URL,
                db: ODOO_DB,
                username: ODOO_USER,
                password: ODOO_PASSWORD,
            });
            await odoo.connect();
            console.log('Successfully connected to Odoo.');
            return; // Success, exit the function
        } catch (err) {
            console.error(`Failed to connect to Odoo on attempt ${i}/${retries}:`, err.message);
            if (i < retries) {
                console.log(`Retrying in ${delay / 1000} seconds...`);
                await sleep(delay);
            } else {
                console.error('All attempts to connect to Odoo failed.');
                throw new Error('Could not connect to Odoo after multiple retries.');
            }
        }
    }
};

// --- API Endpoints ---

// Example: Get all battery rental orders
app.get('/api/rentals', async (req, res) => {
    if (!odoo) {
        return res.status(503).json({ error: 'Odoo connection not available.' });
    }
    try {
        const rentals = await odoo.searchRead(
            'sale.order',
            [['is_battery_rental', '=', true]],
            ['name', 'partner_id', 'date_order', 'amount_total', 'battery_device_id', 'subscription_end_date']
        );
        res.json(rentals);
    } catch (err) {
        console.error('Error fetching rentals from Odoo:', err);
        res.status(500).json({ error: 'Failed to fetch data from Odoo.' });
    }
});

// Example: Create a new rental order
app.post('/api/rentals', async (req, res) => {
    if (!odoo) {
        return res.status(503).json({ error: 'Odoo connection not available.' });
    }
    const { customer_id, battery_device_id, subscription_end_date } = req.body;

    if (!customer_id || !battery_device_id || !subscription_end_date) {
        return res.status(400).json({ error: 'Missing required fields: customer_id, battery_device_id, subscription_end_date' });
    }

    try {
        // In a real app, you would also create order lines with products.
        // For this example, we'll keep it simple.
        const orderId = await odoo.create('sale.order', {
            partner_id: customer_id, // Assuming customer_id is a valid partner ID in Odoo
            is_battery_rental: true,
            battery_device_id: battery_device_id,
            subscription_end_date: subscription_end_date,
            // You might want to set a default rental product in the order line
            // order_line: [[0, 0, { product_id: YOUR_RENTAL_PRODUCT_ID, ... }]]
        });
        res.status(201).json({ id: orderId });
    } catch (err) {
        console.error('Error creating rental in Odoo:', err);
        res.status(500).json({ error: 'Failed to create record in Odoo.' });
    }
});


// --- Server Startup ---
const PORT = process.env.PORT || 4001;

const startServer = async () => {
    try {
        await connectToOdoo();
        app.listen(PORT, () => {
            console.log(`Middleware server running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Failed to start middleware server:', err.message);
        process.exit(1); // Exit if we cannot connect to Odoo
    }
};

startServer();
