  import express from "express";
  import { auth } from "../middlewares/auth.js";
  import { generateArticle, generateBlogTitle, generateImage, removeImageBackground, removeImageObject, reviewResume } from "../controlers/aiController.js";
  import { upload } from "../configs/multer.js";

  const aiRouter = express.Router();
  aiRouter.use((req,res, next) => {
      console.log('AI Router:', req.method, req.originalUrl);
      next();
    });

  // requireAuth runs first, then your custom auth middleware
  aiRouter.get('/ping', (req, res) => res.json({ ok: true }));

    

  console.log("AI routes file loaded");

  // TEMP: Debug endpoint to view plan and metadata on server
  aiRouter.get('/debug/plan', auth, (req, res) => {
    const user = req.clerkUser || {};
    return res.json({
      ok: true,
      plan: req.plan,
      free_usage: req.free_usage,
      userId: user.id,
      privateMetadata: user.privateMetadata,
    });
  });

  aiRouter.post('/generate-article', auth,generateArticle);
  aiRouter.post('/generate-blog-titles',auth, generateBlogTitle);
  aiRouter.post('/generate-image',auth,generateImage);
  aiRouter.post('/remove-image-background',upload.single('image'),auth, removeImageBackground);
  aiRouter.post('/remove-image-object',upload.single('image'),auth, removeImageObject);
  aiRouter.post('/resume-review',upload.single('resume'),auth, reviewResume);



  export default aiRouter;
