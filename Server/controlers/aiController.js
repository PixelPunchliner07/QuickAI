

// // testing 2
// import OpenAI from 'openai';
// import { sql } from '../configs/db.js';
// import { clerkClient } from '@clerk/express';
// import axios from 'axios';
// import { v2 as cloudinary } from 'cloudinary';
// import fs from 'fs';
// import FormData from 'form-data';








// // OpenRouter initialization - replace with your actual API key in env
// const openai = new OpenAI({
//   baseURL: 'https://openrouter.ai/api/v1',
//   apiKey: process.env.OPENAI_API_KEY,
//   defaultHeaders: {
//     'HTTP-Referer': 'http://localhost:3000',
//     'X-Title': 'QuickAI',
//   },
// });




// // Generating article
// export const generateArticle = async (req, res) => {
//   try {
//     // Use Clerk's recommended auth() function since req.auth deprecated
//     const authData = typeof req.auth === 'function' ? await req.auth() : req.auth || {};
//     const userId = authData.userId;

//     if (!userId) {
//       return res.status(401).json({ success: false, message: 'Unauthorized: userId missing' });
//     }

//     const { prompt, length } = req.body;
//     const plan = req.plan || 'free';
//     const free_usage = req.free_usage ?? 0;

//     if (!prompt) {
//       return res.status(400).json({ success: false, message: 'Prompt is required' });
//     }

//     if (plan !== 'premium' && free_usage >= 10) {
//       return res.status(403).json({ success: false, message: 'Free usage limit reached, upgrade to premium' });
//     }

//     // Call the OpenRouter AI API
//     const completion = await openai.chat.completions.create({
//       model: 'openai/gpt-4o',
//       messages: [{ role: 'user', content: prompt }],
//       max_tokens: Number(length) || 512,
//       temperature: 0.7,
//     });

//     const content = completion.choices?.[0]?.message?.content || '';

//     if (!content) {
//       return res.status(500).json({ success: false, message: 'AI failed to generate content' });
//     }

//     console.log('[generateArticle] OpenRouter completion:', content);

//     // Insert creation into DB
//     await sql.query(`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${prompt}, ${content}, 'article')`);

//     // Update Clerk user usage only for real user ID
//     if (plan !== 'premium') {
//       await clerkClient.users.updateUser(userId, {
//         privateMetadata: { free_usage: free_usage + 1 },
//       });
//     }

//     res.status(200).json({ success: true, message: 'Article generated successfully', content });
//   } catch (error) {
//     console.error('[generateArticle] error:', error);
//     res.status(500).json({ success: false, message: error.message || 'Internal server error' });
//   }
// };










// // Generating blog title
// export const generateBlogTitle = async (req, res) => {
//   try {
//     // Use Clerk's recommended auth() function since req.auth deprecated
//     const authData = typeof req.auth === 'function' ? await req.auth() : req.auth || {};
//     const userId = authData.userId;

//     if (!userId) {
//       return res.status(401).json({ success: false, message: 'Unauthorized: userId missing' });
//     }

//     const { prompt } = req.body;
//     const plan = req.plan || 'free';
//     const free_usage = req.free_usage ?? 0;

//     if (!prompt) {
//       return res.status(400).json({ success: false, message: 'Prompt is required' });
//     }

//     if (plan !== 'premium' && free_usage >= 10) {
//       return res.status(403).json({ success: false, message: 'Free usage limit reached, upgrade to premium' });
//     }

//     // Call the OpenRouter AI API
//     const completion = await openai.chat.completions.create({
//       model: 'openai/gpt-4o',
//       messages: [{ role: 'user', content: prompt }],
//       max_tokens: 100,
//       temperature: 0.7,
//     });

//     const content = completion.choices?.[0]?.message?.content || '';

//     if (!content) {
//       return res.status(500).json({ success: false, message: 'AI failed to generate content' });
//     }

//     const titles = content
//       .split('\n')
//       .map(line => line.replace(/^\d+[\).\s]+/, '').trim())
//       .filter(title => title.length > 0);
//     console.log('[generateArticle] OpenRouter completion:', content);

//     // Insert creation into DB
//     await sql.query(`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${prompt}, ${content}, 'blog-title')`);

//     // Update Clerk user usage only for real user ID
//     if (plan !== 'premium') {
//       await clerkClient.users.updateUser(userId, {
//         privateMetadata: { free_usage: free_usage + 1 },
//       });
//     }

//     res.status(200).json({ success: true, message: 'Article generated successfully', titles });
//   } catch (error) {
//     console.error('[generateArticle] error:', error);
//     res.status(500).json({ success: false, message: error.message || 'Internal server error' });
//   }
// };










// // Generating image
// export const generateImage = async (req, res) => {
//   try {
//     // Use Clerk's recommended auth() function since req.auth deprecated
//     const authData = typeof req.auth === 'function' ? await req.auth() : req.auth || {};
//     const userId = authData.userId;

//     if (!userId) {
//       return res.status(401).json({ success: false, message: 'Unauthorized: userId missing' });
//     }

//     const { prompt, publish } = req.body;
//     const plan = req.plan || 'free';

//     if (!prompt) {
//       return res.status(400).json({ success: false, message: 'Prompt is required' });
//     }

//     if (plan !== 'premium') {
//       return res.status(403).json({ success: false, message: 'This feature is only available for premium users' });
//     }


//     // Call the Clipdrop api
    
//     const formData = new FormData()
//     formData.append('prompt', prompt)
//     const {data} = await axios.post('https://clipdrop-api.co/text-to-image/v1',formData,{headers:{
//       'x-api-key': process.env.CLIPDROP_API_KEY,
//     },
//     responseType: 'arraybuffer',

//   })

//   const base64Image = `data:image/png;base64,${Buffer.from(data,'binary').toString('base64')}`;

//   const {secure_url} = await cloudinary.uploader.upload(base64Image)


//     if (!secure_url) {
//       return res.status(500).json({ success: false, message: 'AI failed to generate content' });
//     }

//     console.log('[generateImage] OpenRouter completion:', secure_url);

//     // Insert creation into DB
//     await sql.query(`INSERT INTO creations (user_id, prompt, content, type,publish ) VALUES (${userId}, ${prompt}, ${secure_url}, 'image',${publish ?? false})`);

  

//     res.status(200).json({ success: true, message: 'Image generated successfully', content:secure_url });
//   } catch (error) {
//     console.error('[generateArticle] error:', error);
//     res.status(500).json({ success: false, message: error.message || 'Internal server error' });
//   }
// };







// // Removing background from  image
// export const removeImageBackground = async (req, res) => {
//   try {
//     // Use Clerk's recommended auth() function since req.auth deprecated
//     const authData = typeof req.auth === 'function' ? await req.auth() : req.auth || {};
//     const userId = authData.userId;

//     if (!userId) {
//       return res.status(401).json({ success: false, message: 'Unauthorized: userId missing' });
//     }

//     const image  = req.file;
//     const plan = req.plan || 'free';


//     if (plan !== 'premium') {
//       return res.status(403).json({ success: false, message: 'This feature is only available for premium users' });
//     }

//     // Call the Cloudinary

//     const {secure_url} = await cloudinary.uploader.upload(image.path,{
//       transformation:[
//         {
//           effect:'background_removal',
//           background_removal:'remove_the_background',
//         }
//       ]
//     })
    

//     if (!secure_url) {
//       return res.status(500).json({ success: false, message: 'AI failed to generate content' });
//     }

    

//     // Insert creation into DB
//     await sql.query(`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, 'Removed background from image', ${secure_url}, 'image')`);

//     // Update Clerk user usage only for real user ID

//     res.status(200).json({ success: true, message: 'Image generated successfully', content:secure_url });
//   } catch (error) {
//     console.error('[generateArticle] error:', error);
//     res.status(500).json({ success: false, message: error.message || 'Internal server error' });
//   }
// };












// // Removing Object from  image
// export const removeImageObject = async (req, res) => {
//   try {
//     // Use Clerk's recommended auth() function since req.auth deprecated
//     const authData = typeof req.auth === 'function' ? await req.auth() : req.auth || {};
//     const userId = authData.userId;

//     if (!userId) {
//       return res.status(401).json({ success: false, message: 'Unauthorized: userId missing' });
//     }

//     const image  = req.file;
//     const plan = req.plan || 'free';
//     const {object} = req.body;


//     if (plan !== 'premium') {
//       return res.status(403).json({ success: false, message: 'This feature is only available for premium users' });
//     }

//     // Call the Cloudinary

//     const {public_id} = await cloudinary.uploader.upload(image.path)
    
//     const imgUrl = cloudinary.url(public_id,{
//       transformation:[{effect:`gen_remove:${object}`}],
//       resource_type:'image'
//     })


//     if (!imgUrl) {
//       return res.status(500).json({ success: false, message: 'AI failed to generate content' });
//     }

    

//     // Insert creation into DB
//     await sql.query(`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${`Remove ${object} from image`}, ${imgUrl}, 'image')`);

//     // Update Clerk user usage only for real user ID

//     res.status(200).json({ success: true, message: 'Image generated successfully', content: imgUrl });
//   } catch (error) {
//     console.error('[generateArticle] error:', error);
//     res.status(500).json({ success: false, message: error.message || 'Internal server error' });
//   }
// };









// // // Review resume
// // export const reviewResume = async (req, res) => {
// //   try {
// //     // Use Clerk's recommended auth() function since req.auth deprecated
// //     const authData = typeof req.auth === 'function' ? await req.auth() : req.auth || {};
// //     const userId = authData.userId;
    

// //     if (!userId) {
// //       return res.status(401).json({ success: false, message: 'Unauthorized: userId missing' });
// //     }

// //     const  resume  = req.file;
// //     const plan = req.plan || 'free';
    


// //     if (plan !== 'premium') {
// //       return res.status(403).json({ success: false, message: 'This feature is only available for premium users' });
// //     }

// //     if(resume.size > 1024 * 1024 * 5){
// //       return res.json({success:false,message:'Resume size should be less than 5MB'})
// //     }

// //     const dataBuffer = fs.readFileSync(resume.path);
// //     const pdfData = await pdfParse(dataBuffer);


// //     const prompt = `Review the following resume and provide constructive feedback on its strengths , weaknesses, and areas for improvement. Resume Content:\n\n ${pdfData.text}`
   
// //      // Call the OpenRouter AI API
// //      const completion = await openai.chat.completions.create({
// //       model: 'openai/gpt-4o',
// //       messages: [{ role: 'user', content: prompt }],
// //       max_tokens: 1000,
// //       temperature: 0.7,
// //     });

// //     const content = completion.choices?.[0]?.message?.content || '';

// //     // Insert creation into DB
// //     await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, 'Review the uploaded resume', ${content}, 'resume-review')`;

// //     // Update Clerk user usage only for real user ID

// //     res.status(200).json({ success: true, message: 'Content generated successfully', content });
// //   } catch (error) {
// //     console.error('[generateArticle] error:', error);
// //     res.status(500).json({ success: false, message: error.message || 'Internal server error' });
// //   }
// // };


// // testing for resume review

// export const reviewResume = async (req, res) => {
//   try {
//     const authData = typeof req.auth === 'function' ? await req.auth() : req.auth || {};
//     const userId = authData.userId;
//     if (!userId) {
//       return res.status(401).json({ success: false, message: 'Unauthorized: userId missing' });
//     }

//     const resume = req.file;
//     const plan = req.plan || 'free';

//     if (plan !== 'premium') {
//       return res.status(403).json({ success: false, message: 'This feature is only available for premium users' });
//     }

//     if (resume.size > 1024 * 1024 * 5) {
//       return res.status(400).json({ success: false, message: 'Resume size should be less than 5MB' });
//     }

//     const fileBuffer = fs.readFileSync(resume.path);

//     // Step 1: Upload PDF to PDF.co file/upload endpoint
//     const uploadFormData = new FormData();
//     uploadFormData.append('file', fileBuffer, resume.originalname);

//     const uploadResponse = await axios.post('https://api.pdf.co/v1/file/upload', uploadFormData, {
//       headers: {
//         'x-api-key': process.env.PDFCO_API_KEY,
//         ...uploadFormData.getHeaders(),
//       },
//     });

//     if (!uploadResponse.data || !uploadResponse.data.url) {
//       return res.status(500).json({ success: false, message: 'Failed to upload PDF' });
//     }

//     const fileUrl = uploadResponse.data.url;

//     // Step 2: Request text extraction with the uploaded file URL
//     const extractPayload = {
//       url: fileUrl,
//       inline: true,
//     };

//     const extractResponse = await axios.post(
//       'https://api.pdf.co/v1/pdf/convert/to/text',
//       extractPayload,
//       {
//         headers: {
//           'x-api-key': process.env.PDFCO_API_KEY,
//           'Content-Type': 'application/json',
//         },
//       }
//     );

//     if (!extractResponse.data || !extractResponse.data.body) {
//       return res.status(500).json({ success: false, message: 'Failed to extract text from PDF' });
//     }

//     const extractedText = extractResponse.data.body;

//     const prompt = `Review the following resume and provide constructive feedback on its strengths, weaknesses, and areas for improvement. Resume Content:\n\n${extractedText}`;

//     const completion = await openai.chat.completions.create({
//       model: 'openai/gpt-4o',
//       messages: [{ role: 'user', content: prompt }],
//       max_tokens: 1000,
//       temperature: 0.7,
//     });

//     const content = completion.choices?.[0]?.message?.content || '';

//     await sql.query(`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, 'Review the uploaded resume', ${content}, 'resume-review')`);

//     res.status(200).json({ success: true, message: 'Content generated successfully', content });

//   } catch (error) {
//     console.error('[reviewResume] error:', error);
//     res.status(500).json({ success: false, message: error.message || 'Internal server error' });
//   }
// };










// testing 2
import OpenAI from 'openai';
import { sql } from '../configs/db.js';
import { clerkClient } from '@clerk/express';
import axios from 'axios';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import FormData from 'form-data';

// Polyfill DOMMatrix for Node.js environment
if (!globalThis.DOMMatrix) {
  globalThis.DOMMatrix = class DOMMatrix {
    constructor(init = '') {
      this.a = 1;
      this.b = 0;
      this.c = 0;
      this.d = 1;
      this.e = 0;
      this.f = 0;
    }
  };
}

import * as pdfjsLib from 'pdfjs-dist';

// OpenRouter initialization
const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENAI_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': 'http://localhost:3000',
    'X-Title': 'QuickAI',
  },
});

// ======================
// Generate Article
// ======================
export const generateArticle = async (req, res) => {
  try {
    const authData = typeof req.auth === 'function' ? await req.auth() : req.auth || {};
    const userId = authData.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized: userId missing' });
    }

    const { prompt, length } = req.body;
    const plan = req.plan || 'free';
    const free_usage = req.free_usage ?? 0;
    const requestedTokens = Number(length) || 512;

    const MAX_TOKENS_BY_PLAN = {
      free: 500,
      premium: 1500,
    };

    const maxTokens = Math.min(
      requestedTokens,
      MAX_TOKENS_BY_PLAN[plan] || 500
    );

    if (!prompt) {
      return res.status(400).json({ success: false, message: 'Prompt is required' });
    }

    if (plan !== 'premium' && free_usage >= 10) {
      return res.status(403).json({ success: false, message: 'Free usage limit reached' });
    }

    const completion = await openai.chat.completions.create({
      model: 'openai/gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: maxTokens,
      temperature: 0.7,
    });

    const content = completion.choices?.[0]?.message?.content || '';
    if (!content) {
      return res.status(500).json({ success: false, message: 'AI failed to generate content' });
    }

    await sql.query(
      "INSERT INTO creations (user_id, prompt, content, type) VALUES ($1, $2, $3, $4)",
      [userId, prompt, content, 'article']
    );

    if (plan !== 'premium') {
      await clerkClient.users.updateUser(userId, {
        privateMetadata: { free_usage: free_usage + 1 },
      });
    }

    res.status(200).json({ success: true, message: 'Article generated successfully', content });
  } catch (error) {
     if (error?.response?.status === 402) {
      return res.status(402).json({
        success: false,
        message: 'Free AI limit reached. Try shorter content or upgrade.',
      });
    }
    console.error('[generateArticle] error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ======================
// Generate Blog Title
// ======================
export const generateBlogTitle = async (req, res) => {
  try {
    const authData = typeof req.auth === 'function' ? await req.auth() : req.auth || {};
    const userId = authData.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { prompt } = req.body;
    const plan = req.plan || 'free';
    const free_usage = req.free_usage ?? 0;

    if (!prompt) {
      return res.status(400).json({ success: false, message: 'Prompt is required' });
    }

    if (plan !== 'premium' && free_usage >= 10) {
      return res.status(403).json({ success: false, message: 'Free usage limit reached' });
    }

    const completion = await openai.chat.completions.create({
      model: 'openai/gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 100,
      temperature: 0.7,
    });

    const content = completion.choices?.[0]?.message?.content || '';

    await sql.query(
      "INSERT INTO creations (user_id, prompt, content, type) VALUES ($1, $2, $3, $4)",
      [userId, prompt, content, 'blog-title']
    );

    res.status(200).json({ success: true, titles: content.split('\n') });
  } catch (error) {
    if (error?.response?.status === 402) {
      return res.status(402).json({
        success: false,
        message: 'Free AI limit reached. Try shorter content or upgrade.',
      });
    }
    console.error('[generateBlogTitle] error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ======================
// Generate Image
// ======================
export const generateImage = async (req, res) => {
  try {
    const authData = typeof req.auth === 'function' ? await req.auth() : req.auth || {};
    const userId = authData.userId;

    const { prompt, publish } = req.body;
    const plan = req.plan || 'free';

    if (!prompt || plan !== 'premium') {
      return res.status(403).json({ success: false, message: 'Premium required' });
    }

    const formData = new FormData();
    formData.append('prompt', prompt);

    const { data } = await axios.post(
      'https://clipdrop-api.co/text-to-image/v1',
      formData,
      {
        headers: { 'x-api-key': process.env.CLIPDROP_API_KEY },
        responseType: 'arraybuffer',
      }
    );

    const base64Image = `data:image/png;base64,${Buffer.from(data).toString('base64')}`;
    const { secure_url } = await cloudinary.uploader.upload(base64Image);

    await sql.query(
      "INSERT INTO creations (user_id, prompt, content, type, publish) VALUES ($1, $2, $3, $4, $5)",
      [userId, prompt, secure_url, 'image', publish ?? false]
    );

    res.status(200).json({ success: true, content: secure_url });
  } catch (error) {
    console.error('[generateImage] error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ======================
// Remove Background
// ======================
export const removeImageBackground = async (req, res) => {
  try {
    const authData = typeof req.auth === 'function' ? await req.auth() : req.auth || {};
    const userId = authData.userId;

    const { secure_url } = await cloudinary.uploader.upload(req.file.path, {
      transformation: [{ effect: 'background_removal' }],
    });

    await sql.query(
      "INSERT INTO creations (user_id, prompt, content, type) VALUES ($1, $2, $3, $4)",
      [userId, 'Removed background from image', secure_url, 'image']
    );

    res.json({ success: true, content: secure_url });
  } catch (error) {
    console.error('[removeImageBackground] error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ======================
// Remove Object
// ======================
export const removeImageObject = async (req, res) => {
  try {
    const authData = typeof req.auth === 'function' ? await req.auth() : req.auth || {};
    const userId = authData.userId;
    const { object } = req.body;

    const { public_id } = await cloudinary.uploader.upload(req.file.path);
    const imgUrl = cloudinary.url(public_id, {
      transformation: [{ effect: `gen_remove:${object}` }],
    });

    await sql.query(
      "INSERT INTO creations (user_id, prompt, content, type) VALUES ($1, $2, $3, $4)",
      [userId, `Remove ${object} from image`, imgUrl, 'image']
    );

    res.json({ success: true, content: imgUrl });
  } catch (error) {
    console.error('[removeImageObject] error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ======================
// Review Resume
// ======================
export const reviewResume = async (req, res) => {
  try {
    const authData = typeof req.auth === 'function' ? await req.auth() : req.auth || {};
    const userId = authData.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Resume file is required' });
    }

    // Read and parse the PDF file
    const fileBuffer = fs.readFileSync(req.file.path);
    
    // Extract text from PDF using pdfjs-dist
    const pdfData = await pdfjsLib.getDocument({ data: fileBuffer }).promise;
    let resumeText = '';
    
    for (let i = 1; i <= pdfData.numPages; i++) {
      const page = await pdfData.getPage(i);
      const textContent = await page.getTextContent();
      resumeText += textContent.items.map(item => item.str).join(' ') + '\n';
    }

    if (!resumeText || resumeText.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Could not extract text from PDF' });
    }

    // Create prompt for resume review
    const reviewPrompt = `Please review the following resume and provide detailed feedback on:
1. Strengths and accomplishments highlighted
2. Areas for improvement
3. Formatting and structure suggestions
4. Keywords and skills optimization
5. Overall score (out of 10) with reasoning

Resume Content:
${resumeText}

Please provide constructive, actionable feedback.`;

    // Send to OpenAI for analysis
    const completion = await openai.chat.completions.create({
      model: 'openai/gpt-4o',
      messages: [{ role: 'user', content: reviewPrompt }],
      max_tokens: 1500,
      temperature: 0.7,
    });

    const content = completion.choices?.[0]?.message?.content || '';

    if (!content) {
      return res.status(500).json({ success: false, message: 'AI failed to generate review' });
    }

    // Save to database
    await sql.query(
      "INSERT INTO creations (user_id, prompt, content, type) VALUES ($1, $2, $3, $4)",
      [userId, 'Review the uploaded resume', content, 'resume-review']
    );

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    res.json({ success: true, content });
  } catch (error) {
    console.error('[reviewResume] error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
