// import express from 'express';
// import cors from 'cors';
// import 'dotenv/config';
// import aiRouter from './routes/aiRoutes.js';
// import { clerkMiddleware , requireAuth } from "@clerk/express";

// const app = express();

// // Middleware
// app.use(express.json());
// app.use(cors());
// app.use(clerkMiddleware());

// // Public route


// // Protected routes
// console.log("Mounting AI routes at /api/ai");

// app.use('/api/ai', aiRouter);

// app.use(requireAuth());

// app.get('/', (req, res) => {
//     res.send("Server is Live");
// });

// const PORT = process.env.PORT || 3000;

// app.listen(PORT, function(){
//     console.log(`Server is running on port ${PORT}`);
// });


// Test 1
// import express from 'express';
// import cors from 'cors';
// import 'dotenv/config';
// import aiRouter from './routes/aiRoutes.js';
// import { clerkMiddleware, requireAuth } from '@clerk/express';

// const app = express();

// app.use(express.json());
// app.use(cors());
// app.use(clerkMiddleware());

// // Public routes (no auth)
// app.get('/', (req, res) => {
//   res.send("Server is Live");
// });

// // Apply requireAuth() **before** mounting protected routes
// app.use(requireAuth());

// // Protected routes
// console.log("Mounting AI routes at /api/ai");
// app.use('/api/ai', aiRouter);

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

//Test2

import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import aiRouter from './routes/aiRoutes.js';
import { clerkMiddleware, requireAuth } from '@clerk/express';
import connectCloudinary from './configs/cloudinary.js';
import userRouter from './routes/userRoutes.js';
import clerkBillingWebhookRouter from './hooks/webHook.js' // adjust path




const app = express();
await connectCloudinary();
  

app.use(express.json());


const allowedOrigins = [
  "https://quick-ai-u3x1.vercel.app", // your frontend
  "http://localhost:5173", // for local development (optional)
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);



app.use(clerkMiddleware())  // Attach Clerk middleware first
app.use('/api/webhook', clerkBillingWebhookRouter);


// Public routes, before auth
app.get('/', (req, res) => {
  res.send("Server is Live");
});

// Mount protected routes AFTER requireAuth middleware 
app.use(requireAuth());      // Require authentication before protected routes
console.log("Mounting AI routes at /api/ai");
app.use('/api/ai', aiRouter);  // Mount your AI API routes
app.use('/api/user', userRouter);  // Mount your AI API routes

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

