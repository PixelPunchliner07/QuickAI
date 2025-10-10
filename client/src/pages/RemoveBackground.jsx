import { Eraser, Sparkles } from 'lucide-react';
import React from 'react'
import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

function RemoveBackground() {
  const [input , setInput] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { getToken } = useAuth();

  const downloadImage = async (url) => {
    if (!url) return;
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);

      // Extract file extension or default to png
      const extensionMatch = url.match(/\.(jpe?g|png|gif|bmp|webp)$/i);
      const extension = extensionMatch ? extensionMatch[1] : 'png';

      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = `generated-image.${extension}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(objectUrl);
    } catch (err) {
      console.error('Failed to download image', err);
      toast.error('Failed to download image');
    }
  };


  const onSubmitHandler = async (e)=>{
    e.preventDefault();
    setLoading(true);
    try {
      const formdata = new FormData();
      formdata.append('image',input);

      const { data } = await axios.post('/api/ai/remove-image-background', formdata, {
        headers: {
          Authorization: `Bearer ${await getToken()}`
        }
      });
      if (data.success) {
        setContent(data.content);
        toast.success('Image Generated');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
    setLoading(false);
  }
  return (
    <div className='h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700'>
      {/* Left column */}
      <form action="" onSubmit={onSubmitHandler} className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200'>
          <div className='flex items-center gap-3'>
            <Sparkles className='w-6 text-[#FF4938]'/>
            <h1 className='text-xl font-semibold'>Background Remover</h1>
          </div>
          <p className='mt-6 text-sm font-medium'>Upload Image</p>
          <input  onChange={(e)=>setInput(e.target.files[0])}  type="file" accept='image/*' className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600 '  required />
          
          <p className='text-xs text-gray-500 font-light mt-1'>
            Supports JPG, PNG, and other image formats.
          </p>
          <button disabled={loading} className='flex gap-2 w-full justify-center items-center bg-gradient-to-r from-[#F6AB41] to-[#FF4938] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer'>
            {
              loading ? <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span>
              :
              <Eraser className='w-5'/>
            }
                Remove Background
          </button>

      </form>
      {/* Right column */}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200 flex flex-col min-h-96 '>
        <div className='flex items-center gap-3 '>
            <Eraser className='w-5 h-5 text-[#FF4938]'/>
            <h1 className='text-xl font-semibold '>
              Processed Image
            </h1>
        </div>
        {!content ? (
           <div className='flex-1 flex justify-center items-center'>
                <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
                  <Eraser className='w-9 h-9 '/>
                  <p>Upload an image and click 'Remove Background' to get started</p>
                </div>
           </div>
        ) : (
          <div className='mt-3 h-full flex flex-col'>
            <img src={content} alt="image" className='w-full h-full mt-6 ' />
            <button
              onClick={() => downloadImage(content)}
              className='mt-auto w-[180px] bg-gradient-to-r from-[#F6AB41] to-[#FF4938] text-white  px-4 py-2 rounded cursor-pointer self-end'
            >
              Download Image
            </button>
          </div>
          
        )}
        
      </div>
      
    </div>
  )
}

export default RemoveBackground
