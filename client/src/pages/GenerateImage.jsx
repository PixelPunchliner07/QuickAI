
import React, { useState } from 'react';
import { Hash, Sparkles } from 'lucide-react';
import { Image } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

function GenerateImage() {
  const ImageStyle = [
    'Realistic', 'Ghibli style', 'Anime style', 'Cartoon style',
    'Fantasy style', '3D style', 'Potrait style'
  ];
  const [selectedStyle, setSelectedStyle] = useState(ImageStyle[0]);
  const [input, setInput] = useState('');
  const [publish, setPublish] = useState(false);
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

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const prompt = `Generate an image of ${input} in ${selectedStyle} style`;

      const { data } = await axios.post('/api/ai/generate-image', { prompt, publish }, {
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
  };

  return (
    <div className='h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700'>
      {/* Left column */}
      <form onSubmit={onSubmitHandler} className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200'>
        <div className='flex items-center gap-3'>
          <Sparkles className='w-6 text-[#00AD25]' />
          <h1 className='text-xl font-semibold'>AI Image Generator</h1>
        </div>
        <p className='mt-6 text-sm font-medium'>Describe Your Image</p>
        <textarea
          onChange={(e) => setInput(e.target.value)}
          value={input}
          rows={4}
          className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300'
          placeholder='Describe what you want to see in the image...'
          required
        />
        <p className='mt-4 text-sm font-medium'>Style</p>
        <div className='mt-3 flex gap-3 flex-wrap sm:max-w-9/11'>
          {ImageStyle.map((item, index) => (
            <span
              key={index}
              onClick={() => setSelectedStyle(item)}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${
                selectedStyle === item ? 'bg-green-50 text-green-700' : 'text-gray-500 border-gray-300'
              }`}
            >
              {item}
            </span>
          ))}
        </div>
        <div className='my-6 flex items-center gap-2'>
          <label className='relative cursor-pointer'>
            <input
              type='checkbox'
              className='sr-only peer'
              onChange={(e) => setPublish(e.target.checked)}
              checked={publish}
            />
            <div className='w-9 h-6 bg-slate-300 rounded-full peer-checked:bg-green-500 transition'></div>
            <span className='absolute left-1 top-1.5 w-3 h-3 bg-white rounded-full transition peer-checked:translate-x-4'></span>
          </label>
          <p className='text-sm'>Make this image Public</p>
        </div>
        <br />
        <button
          disabled={loading}
          className='flex gap-2 w-full justify-center items-center bg-gradient-to-r from-[#00AD25] to-[#04FF50] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer'
        >
          {loading ? (
            <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span>
          ) : (
            <Image className='w-5' />
          )}
          Generate Image
        </button>
      </form>

      {/* Right column */}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200 flex flex-col min-h-96'>
        <div className='flex items-center gap-3'>
          <Image className='w-5 h-5 text-[#00AD25]' />
          <h1 className='text-xl font-semibold'>Generated Image</h1>
        </div>

        {!content ? (
          <div className='flex-1 flex justify-center items-center'>
            <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
              <Image className='w-9 h-9 ' />
              <p>Enter the topic and click 'Generate Title' to get started</p>
            </div>
          </div>
        ) : (
          <div className='mt-3 h-full flex flex-col'>
            <img src={content} alt='image' className='w-full h-full mb-6' />
            <button
              onClick={() => downloadImage(content)}
              className='mt-auto w-[180px] bg-gradient-to-r from-[#00AD25] to-[#04FF50] text-white px-4 py-2 rounded cursor-pointer self-end'
            >
              Download Image
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default GenerateImage;

