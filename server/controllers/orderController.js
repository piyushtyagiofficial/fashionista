import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import { sendOrderConfirmationEmail } from "../config/email.js";

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create payment order with Razorpay
// @route   POST /api/orders/create-payment
// @access  Private
export const createPayment = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ message: "Amount is required" });
    }

    const options = {
      amount: Math.round(amount), // amount in paise
      currency: "INR",
      receipt: "order_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    if (!order) {
      throw new Error("Failed to create Razorpay order");
    }

    res.json(order);
  } catch (error) {
    console.error("Razorpay Error:", error);
    res.status(500).json({
      message: "Failed to initiate payment",
      error: error.message,
    });
  }
};

// @desc    Verify Razorpay payment
// @route   PUT /api/orders/:id/pay
// @access  Private
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res
        .status(400)
        .json({ message: "All payment details are required" });
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      const order = await Order.findById(req.params.id).populate("user", "name email");

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Update payment status
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: razorpay_payment_id,
        status: "completed",
        update_time: Date.now(),
        order_id: razorpay_order_id,
      };

      // Update order status to processing after payment
      order.status = "ordered";
      order.orderItems = order.orderItems.map((item) => ({
        ...item.toObject(),
        status: "ordered",
      }));

      const updatedOrder = await order.save();

      // Send order confirmation email
      try {
        if (order.user && order.user.email) {
          await sendOrderConfirmationEmail({
            user: {
              name: order.user.name,
              email: order.user.email,
            },
            order: updatedOrder,
          });

        } else {
          console.error("Cannot send email - user data missing:", {
            hasUser: !!order.user,
            userEmail: order.user?.email,
            userName: order.user?.name,
          });
        }
      } catch (emailError) {
        console.error("Failed to send order confirmation email:", emailError);
        // Don't fail the payment verification if email fails
      }

      res.json(updatedOrder);
    } else {
      res.status(400).json({ message: "Invalid signature" });
    }
  } catch (error) {
    console.error("Payment Verification Error:", error);
    res.status(500).json({ message: "Payment verification failed" });
  }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    // Validate stock availability before creating order
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res
          .status(404)
          .json({ message: `Product ${item.name} not found` });
      }

      const sizeIndex = product.sizes.findIndex((s) => s.size === item.size);
      if (sizeIndex === -1) {
        return res.status(400).json({
          message: `Size ${item.size} not available for ${item.name}`,
        });
      }

      if (product.sizes[sizeIndex].countInStock < item.qty) {
        return res.status(400).json({
          message: `Insufficient stock for ${item.name} (Size: ${item.size}). Only ${product.sizes[sizeIndex].countInStock} available.`,
        });
      }
    }

    // Create order in database (without updating stock yet)
    const order = new Order({
      orderItems: orderItems.map((item) => ({
        ...item,
        status: "pending",
      })),
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      taxPrice,
      shippingPrice,
      totalPrice,
      status: "pending",
    });

    const createdOrder = await order.save();
    // console.log("Order created successfully:", createdOrder._id);

    // NOTE: Stock will be updated after successful payment verification
    // This prevents stock reduction for failed payments

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate({
        path: "orderItems.product",
        select: "name images price salePrice",
      });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check authorization
    if (
      req.user.role === "buyer" &&
      order.user._id.toString() !== req.user._id.toString()
    ) {
      return res
        .status(401)
        .json({ message: "Not authorized to view this order" });
    }

    if (req.user.role === "seller") {
      const sellerOrderItems = order.orderItems.filter(
        (item) => item.seller.toString() === req.user._id.toString()
      );

      if (sellerOrderItems.length === 0) {
        return res
          .status(401)
          .json({ message: "Not authorized to view this order" });
      }

      // Return only the seller's items
      const sellerOrder = {
        ...order.toObject(),
        orderItems: sellerOrderItems,
      };

      return res.json(sellerOrder);
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Seller
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const validStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Verify seller authorization
    const sellerItems = order.orderItems.filter(
      (item) => item.seller.toString() === req.user._id.toString()
    );

    if (sellerItems.length === 0) {
      return res
        .status(401)
        .json({ message: "Not authorized to update this order" });
    }

    // Update status for seller's items
    const updatedOrderItems = order.orderItems.map((item) => {
      if (item.seller.toString() === req.user._id.toString()) {
        return {
          ...item.toObject(),
          status: status,
        };
      }
      return item;
    });

    order.orderItems = updatedOrderItems;

    // Update overall order status
    const allStatuses = updatedOrderItems.map((item) => item.status);

    if (allStatuses.every((s) => s === status)) {
      order.status = status;
    } else if (allStatuses.includes("cancelled")) {
      order.status = "partially_cancelled";
    } else if (allStatuses.includes("delivered")) {
      order.status = "partially_delivered";
    } else {
      order.status = "processing";
    }

    // Update delivery status if applicable
    if (status === "delivered") {
      const allDelivered = updatedOrderItems.every((item) =>
        item.seller.toString() === req.user._id.toString()
          ? item.status === "delivered"
          : item.status === "delivered"
      );

      if (allDelivered) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
      }
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort("-createdAt")
      .populate("orderItems.product", "name images price salePrice")
      .populate("orderItems.seller", "name");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get orders for seller
// @route   GET /api/orders/seller
// @access  Private/Seller
export const getSellerOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      "orderItems.seller": req.user._id,
    })
      .populate("user", "name email")
      .populate("orderItems.product", "name images price salePrice")
      .sort("-createdAt");

    const filteredOrders = orders.map((order) => {
      const sellerItems = order.orderItems.filter(
        (item) => item.seller.toString() === req.user._id.toString()
      );

      return {
        ...order.toObject(),
        orderItems: sellerItems,
      };
    });

    res.json(filteredOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
