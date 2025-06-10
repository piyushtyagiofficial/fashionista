import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Email transporter verification failed:', error);
  } else {
    console.log('Email transporter is ready to send messages');
  }
});

// Send order confirmation email
export const sendOrderConfirmationEmail = async (orderData) => {
  try {
    const { user, order } = orderData;
    
    // Validate user email
    if (!user || !user.email) {
      console.error('User email is missing:', { user, order: order._id });
      throw new Error('User email is required to send confirmation email');
    }
        
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: user.email,
      subject: `Order Confirmation - ${order._id}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Confirmation</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1FA2FF, #12D8FA, #A6FFCB); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
            .order-details { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #12D8FA; }
            .item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
            .total { font-weight: bold; font-size: 18px; color: #1FA2FF; }
            .footer { text-align: center; margin-top: 20px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Order Confirmed!</h1>
              <p>Thank you for shopping with Fashionista</p>
            </div>
            
            <div class="content">
              <h2>Hi ${user.name || 'Valued Customer'},</h2>
              <p>Your order has been successfully placed and is being processed. Here are your order details:</p>
              
              <div class="order-details">
                <h3>Order Information</h3>
                <p><strong>Order ID:</strong> ${order._id}</p>
                <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
                <p><strong>Status:</strong> ${order.status}</p>
              </div>
              
              <div class="order-details">
                <h3>Shipping Address</h3>
                <p>${order.shippingAddress.address}</p>
                <p>${order.shippingAddress.city}, ${order.shippingAddress.postalCode}</p>
                <p>${order.shippingAddress.country}</p>
              </div>
              
              <div class="order-details">
                <h3>Order Items</h3>
                ${order.orderItems.map(item => `
                  <div class="item">
                    <div>
                      <strong>${item.name}</strong><br>
                      <small>Size: ${item.size} | Color: ${item.color} | Qty: ${item.qty}</small>
                    </div>
                    <div>₹${(item.price * item.qty).toFixed(2)}</div>
                  </div>
                `).join('')}
                
                <div class="item total">
                  <div>Total Amount</div>
                  <div>₹${order.totalPrice.toFixed(2)}</div>
                </div>
              </div>
              
              <div class="order-details">
                <h3>What's Next?</h3>
                <ul>
                  <li>We'll send you tracking information once your order ships</li>
                  <li>You can track your order status in your account dashboard</li>
                  <li>Expected delivery: 3-7 business days</li>
                </ul>
              </div>
              
              <div class="footer">
                <p>Need help? Contact us at support@fashionista.com</p>
                <p>Thank you for choosing Fashionista!</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    throw error;
  }
};

// Send welcome email
export const sendWelcomeEmail = async (userData) => {
  try {
    const { name, email, role } = userData;
    
    // Validate email
    if (!email) {
      console.error('Email is required for welcome email');
      throw new Error('Email is required to send welcome email');
    }
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome to Fashionista!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Fashionista</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1FA2FF, #12D8FA, #A6FFCB); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .welcome-box { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; border-left: 4px solid #12D8FA; }
            .cta-button { display: inline-block; background: linear-gradient(135deg, #1FA2FF, #12D8FA); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>👋 Welcome to Fashionista!</h1>
              <p>Your fashion journey starts here</p>
            </div>
            
            <div class="content">
              <h2>Hi ${name || 'Valued Customer'},</h2>
              <p>Welcome to Fashionista! We're excited to have you join our fashion community.</p>
              
              <div class="welcome-box">
                <h3>🎉 Account Created Successfully</h3>
                <p><strong>Account Type:</strong> ${role === 'seller' ? 'Seller Account' : 'Buyer Account'}</p>
                <p><strong>Email:</strong> ${email}</p>
              </div>
              
              ${role === 'seller' ? `
                <div class="welcome-box">
                  <h3>🏪 Start Selling Today</h3>
                  <p>As a seller, you can:</p>
                  <ul>
                    <li>Add and manage your products</li>
                    <li>Track your orders and sales</li>
                    <li>View detailed analytics</li>
                    <li>Manage your inventory</li>
                  </ul>
                  <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/seller/dashboard" class="cta-button">Go to Seller Dashboard</a>
                </div>
              ` : `
                <div class="welcome-box">
                  <h3>🛍️ Start Shopping</h3>
                  <p>As a buyer, you can:</p>
                  <ul>
                    <li>Browse our latest fashion collections</li>
                    <li>Add items to your wishlist</li>
                    <li>Track your orders</li>
                    <li>Enjoy secure payments</li>
                  </ul>
                  <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/products" class="cta-button">Start Shopping</a>
                </div>
              `}
              
              <div class="footer">
                <p>Need help getting started? Contact us at support@fashionista.com</p>
                <p>Happy shopping!</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    // console.log('Welcome email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
};

export default transporter;