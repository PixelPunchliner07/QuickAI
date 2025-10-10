// import { clerkClient } from "@clerk/express";

// export const auth = async (req, res, next) => {
//     try {
//         // Support both deprecated req.auth object and the new req.auth() function
//         const authData = typeof req.auth === 'function' ? await req.auth() : (req.auth || {});
//         const { userId } = authData;
//         if (!userId) {
//             return res.status(401).json({ success: false, message: "Unauthorized" });
//         }

//         // Fetch user to read plan and usage from metadata
//         const user = await clerkClient.users.getUser(userId);
//         const plan = (user?.privateMetadata?.plan === 'premium') ? 'premium' : 'free';
//         const currentFreeUsage = Number(user?.privateMetadata?.free_usage ?? 0);

//         // Attach to request for downstream handlers
//         req.plan = plan;
//         req.free_usage = currentFreeUsage;
//         return next();
//     } catch (error) {
//         return res.status(401).json({ success: false, message: error.message });
//     }
// };



import { clerkClient } from "@clerk/express";

export const auth = async (req, res, next) => {
  try {
    // Support req.auth as function or object (new and old formats)
    const authData = typeof req.auth === 'function' ? await req.auth() : (req.auth || {});
    const userId = authData.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Fetch user details
    const user = await clerkClient.users.getUser(userId);

    // Determine plan from user private metadata
    const plan = user.privateMetadata?.plan === 'premium' ? 'premium' : 'free';

    // Get free usage count if any
    const free_usage = Number(user.privateMetadata?.free_usage ?? 0);

    // Attach to request for downstream usage
    req.plan = plan;
    req.free_usage = free_usage;
    req.clerkUser = user; // attach for debug routes

    // TEMP DEBUG LOG
    console.log('[auth]', {
      userId,
      plan,
      free_usage,
      privateMetadata: user.privateMetadata,
    });

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: error.message });
  }
};
