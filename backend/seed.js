const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/userModel");
const Product = require("./models/productModel");
const Order = require("./models/orderModel");

dotenv.config({ path: "backend/config/config.env" });

const categories = [
  "Electronics", "Clothing", "Books", "Home & Kitchen",
  "Sports", "Beauty", "Toys", "Automotive", "Music", "Food",
];

const productNames = [
  "Wireless Bluetooth Headphones", "Organic Cotton T-Shirt", "JavaScript: The Good Parts",
  "Stainless Steel Water Bottle", "Yoga Mat Premium", "Vitamin C Serum 30ml",
  "Remote Control Car", "Car Phone Holder", "Acoustic Guitar",
  "Dark Chocolate Pack", "Smart Watch Pro", "Denim Jacket",
  "Clean Code Book", "Non-Stick Frying Pan", "Dumbbell Set 10kg",
  "Hyaluronic Acid Moisturizer", "Building Blocks 500pc", "LED Strip Lights",
  "Ukulele Soprano", "Green Tea Organic", "Noise Cancelling Earbuds",
  "Cashmere Sweater", "Atomic Habits Book", "Air Fryer 5L",
  "Resistance Bands Set", "Face Wash Gentle", "Board Game Collection",
  "Tire Inflator Portable", "Bluetooth Speaker", "Almonds Roasted 500g",
  "Mechanical Keyboard", "Summer Dress Floral", "The Alchemist Book",
  "Coffee Maker Drip", "Jump Rope Speed", "Sunscreen SPF 50",
  "Puzzle 1000 Pieces", "Dashboard Camera", "Electric Guitar Starter",
  "Protein Bars 12 Pack", "USB-C Hub 7-in-1", "Woolen Scarf",
  "Deep Work Book", "Blender 1000W", "Kettlebell 8kg",
  "Lip Balm Set", "Drone with Camera", "Car Seat Cover Set",
  "Keyboard Piano 61 Keys", "Trail Mix 1kg",
];

const descriptions = [
  "Premium quality product designed for everyday use. Features latest technology and durable build.",
  "Experience unmatched comfort and style with this carefully crafted product. Perfect for any occasion.",
  "High-performance item built to last. Ergonomic design with user-friendly features included.",
  "Versatile and reliable. Suitable for both beginners and professionals. Satisfaction guaranteed.",
  "Top-rated choice among customers. Excellent value for money with premium finish and materials.",
];

const indianCities = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad",
  "Chennai", "Kolkata", "Pune", "Jaipur", "Lucknow",
  "Nagpur", "Indore", "Bhopal", "Surat", "Patna",
];

const indianStates = [
  "Maharashtra", "Delhi", "Karnataka", "Telangana", "Gujarat",
  "Tamil Nadu", "West Bengal", "Rajasthan", "Uttar Pradesh",
  "Madhya Pradesh",
];

const firstNames = [
  "Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh",
  "Ayaan", "Krishna", "Ishaan", "Ananya", "Diya", "Myra", "Sara",
  "Priya", "Neha", "Riya", "Aisha", "Kavya", "Anika",
  "Rohit", "Amit", "Vikram", "Sneha", "Pooja", "Raj", "Kiran",
  "Nisha", "Deepak", "Sunita",
];

const lastNames = [
  "Sharma", "Patel", "Singh", "Kumar", "Verma", "Gupta", "Reddy",
  "Joshi", "Nair", "Mehta", "Desai", "Agarwal", "Yadav", "Chopra",
  "Thakur",
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function seed() {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Connected to MongoDB");

    // Wipe all existing data
    await Promise.all([
      User.deleteMany({}),
      Product.deleteMany({}),
      Order.deleteMany({}),
    ]);
    console.log("Cleared existing data");

    // ── Users ──
    const users = [];
    const usedEmails = new Set();

    for (let i = 0; i < 55; i++) {
      let email;
      do {
        const fn = pick(firstNames);
        const ln = pick(lastNames);
        email = `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@example.com`;
      } while (usedEmails.has(email));
      usedEmails.add(email);

      users.push({
        name: `${pick(firstNames)} ${pick(lastNames)}`,
        email,
        password: "password123",
        avatar: {
          public_id: `avatar_${i}`,
          url: `https://api.dicebear.com/9.x/initials/svg?seed=${email}`,
        },
        role: i === 0 ? "admin" : "user",
      });
    }
    const createdUsers = await User.create(users);
    console.log(`Created ${createdUsers.length} users`);

    const adminUser = createdUsers[0];

    // ── Products ──
    const products = [];

    for (let i = 0; i < 55; i++) {
      const name = productNames[i % productNames.length];
      const cat = pick(categories);
      const price = randInt(199, 49999);
      const stock = randInt(0, 200);

      products.push({
        name: `${name} ${i < productNames.length ? "" : `(V${Math.floor(i / productNames.length) + 2})`}`.trim(),
        description: pick(descriptions),
        price,
        ratings: Number((Math.random() * 2 + 3).toFixed(1)),
        image: [
          {
            public_id: `product_${i}`,
            url: `https://picsum.photos/seed/product${i}/400/400`,
          },
        ],
        category: cat,
        stock,
        numOfReviews: randInt(0, 80),
        reviews: [],
        user: pick(createdUsers)._id,
        createdAt: new Date(Date.now() - randInt(0, 90) * 24 * 60 * 60 * 1000),
      });
    }
    const createdProducts = await Product.create(products);
    console.log(`Created ${createdProducts.length} products`);

    // ── Reviews ──
    for (const product of createdProducts) {
      const numRev = randInt(1, 8);
      const reviewerIds = [];
      const reviews = [];

      for (let r = 0; r < numRev; r++) {
        const reviewer = pick(createdUsers);
        if (reviewerIds.includes(reviewer._id.toString())) continue;
        reviewerIds.push(reviewer._id.toString());

        reviews.push({
          user: reviewer._id,
          name: reviewer.name,
          rating: randInt(3, 5),
          comment: pick([
            "Great product, highly recommend!",
            "Good quality for the price.",
            "Exactly as described. Love it!",
            "Fast delivery. Product is perfect.",
            "Decent quality. Does the job.",
            "Amazing! Will buy again.",
            "Not bad, but could be better.",
            "Very satisfied with my purchase.",
          ]),
        });
      }

      if (reviews.length > 0) {
        const avgRating = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
        await Product.findByIdAndUpdate(product._id, {
          reviews,
          numOfReviews: reviews.length,
          ratings: Number(avgRating.toFixed(1)),
        });
      }
    }
    console.log("Added reviews to products");

    // ── Orders ──
    const orders = [];
    const statuses = ["Processing", "Shipped", "Delivered"];

    for (let i = 0; i < 55; i++) {
      const user = pick(createdUsers);
      const numItems = randInt(1, 5);
      const orderItems = [];
      let itemsPrice = 0;

      const usedProductIds = new Set();

      for (let j = 0; j < numItems; j++) {
        const product = pick(createdProducts);
        if (usedProductIds.has(product._id.toString())) continue;
        usedProductIds.add(product._id.toString());

        const qty = randInt(1, 3);
        orderItems.push({
          name: product.name,
          price: product.price,
          quantity: qty,
          image: product.image[0]?.url || "",
          product: product._id,
        });
        itemsPrice += product.price * qty;
      }

      if (orderItems.length === 0) continue;

      const taxPrice = Number((itemsPrice * 0.18).toFixed(2));
      const shippingPrice = itemsPrice > 500 ? 0 : 50;
      const totalPrice = Number((itemsPrice + taxPrice + shippingPrice).toFixed(2));
      const status = pick(statuses);
      const daysAgo = randInt(0, 60);

      orders.push({
        shippingInfo: {
          address: `${randInt(1, 999)} ${pick(["Main St", "Park Ave", "Lake Road", "Hill View", "Sector"])}`,
          city: pick(indianCities),
          state: pick(indianStates),
          country: "India",
          pinCode: randInt(100001, 999999),
          phoneNo: randInt(6000000000, 9999999999),
        },
        orderItems,
        user: user._id,
        paymentInfo: {
          id: `pay_${Math.random().toString(36).slice(2, 12)}`,
          status: "succeeded",
        },
        paidAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        orderStatus: status,
        deliveredAt: status === "Delivered"
          ? new Date(Date.now() - (daysAgo - randInt(1, 5)) * 24 * 60 * 60 * 1000)
          : undefined,
        createdAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
      });
    }
    await Order.insertMany(orders);
    console.log(`Created ${orders.length} orders`);

    // Summary
    console.log("\n─────────── Seed Summary ───────────");
    console.log(`  Users:    ${await User.countDocuments()}`);
    console.log(`  Products: ${await Product.countDocuments()}`);
    console.log(`  Orders:   ${await Order.countDocuments()}`);
    console.log(`  Admin:    ${adminUser.email} / password123`);
    console.log("─────────────────────────────────────");

    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  }
}

seed();
