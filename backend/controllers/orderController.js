import asyncHandler from "../middleware/asyncHandler.js";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";

const addOrderItems = asyncHandler(async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error("No order items");
    }

    try {
        // Iterate through orderItems and update countInStock for each product
        for (const orderItem of orderItems) {
            const product = await Product.findById(orderItem.product);

            if (product) {
                product.countInStock -= orderItem.qty;
                await product.save();
            } else {
                throw new Error(
                    `Product not found for order item: ${orderItem.product}`
                );
            }
        }

        // Create order instance
        const order = new Order({
            orderItems: orderItems.map((x) => ({
                ...x,
                product: x.product._id,
                _id: undefined,
            })),
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            shippingPrice,
            totalPrice,
        });

        const createdOrder = await order.save();

        res.status(201).json(createdOrder);
    } catch (error) {
        res
            .status(500)
            .json({ message: "Order failed", error: `Error found: ${error.message}` });
    }
});

const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });

    res.status(200).json(orders);
});

const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
        "user",
        "name email"
    );

    if (order) {
        res.status(200).json(order);
    } else {
        res.status(404);
        throw new Error("Order not found");
    }
});

const updateOrderToPaid = asyncHandler(async (req, res) => {
    const orderId = req.params.id;
    const paymentDetails = req.body;

    try {
        const order = await Order.findById(orderId);

        if (!order) {
            res.status(404);
            throw new Error("Order not found");
        }

        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: paymentDetails.id,
            status: paymentDetails.status,
            update_time: paymentDetails.update_time,
            email: paymentDetails.email,
        };

        const updatedOrder = await order.save();
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const updateOrderToDelivered = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();

        const updatedOrder = await order.save();

        res.status(200).json(updatedOrder);
    } else {
        res.status(404);
        throw new Error("Order not found");
    }
});

const updateOnDeliveryOrderToPaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();

        const updatedOrder = await order.save();

        res.status(200).json(updatedOrder);
    } else {
        res.status(404);
        throw new Error("Order not found");
    }
});

const getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).sort({ createdAt: -1 }).populate("user", "id name");
    res.status(200).json(orders);
});

export {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    updateOnDeliveryOrderToPaid,
    updateOrderToDelivered,
    getOrders,
    getMyOrders,
};
