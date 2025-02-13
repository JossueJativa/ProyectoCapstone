import { ITime, IDate } from '../interface';
import { dbPromise } from '../db';

class OrderHeader {
    desk_id: number;
    order_time: ITime;
    order_date: IDate;
    order_status: string;

    constructor(desk_id: number, order_time: ITime, order_date: IDate, order_status: string) {
        this.desk_id = desk_id;
        this.order_time = order_time;
        this.order_date = order_date;
        this.order_status = order_status;
    }

    static async save(order: OrderHeader) {
        const db = await dbPromise;
        await db.run(
            `INSERT INTO order_headers (desk_id, order_time, order_date, order_status) VALUES (?, ?, ?, ?, ?)`,
            order.desk_id,
            JSON.stringify(order.order_time),
            JSON.stringify(order.order_date),
            order.order_status
        );
    }

    static async update(order: OrderHeader) {
        const db = await dbPromise;
        await db.run(
            `UPDATE order_headers SET desk_id = ?, order_time = ?, order_date = ?, order_status = ? WHERE order_id = ?`,
            order.desk_id,
            JSON.stringify(order.order_time),
            JSON.stringify(order.order_date),
            order.order_status
        );
    }

    static async delete(order_id: number) {
        const db = await dbPromise;
        await db.run(`DELETE FROM order_headers WHERE order_id = ?`, order_id);
    }

    static async get(order_id: number) {
        const db = await dbPromise;
        return await db.get(`SELECT * FROM order_headers WHERE order_id = ?`, order_id);
    }
}

class OrderDetail {
    order_header_id: number;
    product_id: number;
    quantity: number;

    constructor(order_header_id: number, product_id: number, quantity: number) {
        this.order_header_id = order_header_id;
        this.product_id = product_id;
        this.quantity = quantity;
    }

    static async save(order: OrderDetail) {
        const db = await dbPromise;
        await db.run(
            `INSERT INTO order_details (order_id, product_id, quantity) VALUES (?, ?, ?)`,
            order.order_header_id,
            order.product_id,
            order.quantity
        );
    }

    static async update(order: OrderDetail) {
        const db = await dbPromise;
        await db.run(
            `UPDATE order_details SET product_id = ?, quantity = ? WHERE order_id = ?`,
            order.product_id,
            order.quantity,
            order.order_header_id
        );
    }

    static async delete(order_id: number) {
        const db = await dbPromise;
        await db.run(`DELETE FROM order_details WHERE order_id = ?`, order_id);
    }

    static async get(order_id: number) {
        const db = await dbPromise;
        return await db.get(`SELECT * FROM order_details WHERE order_id = ?`, order_id);
    }

    static async getOrdersByOrderHeaderId(order_header_id: number) {
        const db = await dbPromise;
        return await db.all(`SELECT * FROM order_details WHERE order_header_id = ?`, order_header_id);
    }
}

export { OrderHeader, OrderDetail };