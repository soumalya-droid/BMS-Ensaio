import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Odoo from 'odoo-await';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const { ODOO_URL, ODOO_DB, ODOO_USER, ODOO_PASSWORD } = process.env;

// --- Odoo Connection ---
let odoo;
const connectToOdoo = async () => {
    try {
        odoo = new Odoo({
            baseUrl: ODOO_URL,
            db: ODOO_DB,
            username: ODOO_USER,
            password: ODOO_PASSWORD,
        });
        await odoo.connect();
        console.log('Successfully connected to Odoo.');
    } catch (err) {
        console.error('Failed to connect to Odoo:', err);
        // We might want to exit the process if the connection fails at startup
        process.exit(1);
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

// Connect to Odoo first, then start the server
connectToOdoo().then(() => {
    app.listen(PORT, () => {
        console.log(`Middleware server running on port ${PORT}`);
    });
});
