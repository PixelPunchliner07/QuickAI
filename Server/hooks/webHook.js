import express from 'express';
import { clerkClient } from '@clerk/express';

const router = express.Router();

router.post('/clerk-billing', express.json(), async (req, res) => {
  const event = req.body;

  // Listen for relevant subscription events in Clerk Billing
  if (['subscription_created', 'subscription_updated', 'subscription_cancelled'].includes(event.type)) {
    const { subscription, user_id } = event.data;

    if (!user_id) {
      return res.status(400).json({ message: 'User ID missing in webhook data' });
    }

    // Determine user plan status based on subscription state
    const newPlan = (subscription.status === 'active' || subscription.status === 'trialing')
      ? 'premium'
      : 'free';

    try {
      // Update the user's privateMetadata.plan accordingly
      await clerkClient.users.updateUser(user_id, {
        privateMetadata: { plan: newPlan },
      });
      return res.status(200).json({ message: 'User plan updated successfully' });
    } catch (err) {
      console.error('Failed to update user plan metadata', err);
      return res.status(500).json({ message: 'Failed to update user plan' });
    }
  }

  res.status(200).json({ message: 'Event ignored' });
});

export default router;
