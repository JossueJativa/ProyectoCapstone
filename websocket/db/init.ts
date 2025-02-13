import { dbPromise } from './database';

(async () => {
    const db = await dbPromise;
    await db.exec(`
        CREATE TABLE IF NOT EXISTS order_headers (
            order_id INTEGER PRIMARY KEY AUTOINCREMENT,
            desk_id INTEGER,
            order_time TEXT,
            order_date TEXT,
            order_status TEXT
        );

        CREATE TABLE IF NOT EXISTS order_details (
            order_id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_header_id INTEGER,
            product_id INTEGER,
            quantity INTEGER,
            FOREIGN KEY (order_header_id) REFERENCES order_headers(order_id)
        );
    `);
    console.log('Database initialized');
})