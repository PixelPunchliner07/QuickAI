import { Hash, HashIcon, Sparkles } from 'lucide-react';
import React, { useState } from 'react'
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;


function BlogTitle() {
  const blogCategory = [
    'General','Technology','Business','Health','Entertainment','Sports','Travel','Food'

  ]
  const [selectedCategory , setSelectedCategory] = useState(blogCategory[0]);
  const [input , setInput] = useState('');
   const [loading , setLoading] = useState(false);
    const [content , setContent] = useState('');
    const [titles , setTitles] = useState([]);
  
    const {getToken} = useAuth();
  const onSubmitHandler =  async (e)=>{
    e.preventDefault();
    setLoading(true);
   
    try {
       const prompt = `Generate 3 creative and unique blog post titles in a numbered list for a blog post about "${input}" in the "${selectedCategory}" category. Provide only the titles.`;

       const {data} = await axios.post('/api/ai/generate-blog-titles',{prompt}, {
        headers:{
          Authorization: `Bearer ${ await getToken()}`
        }
       })
       if(data.success){
         setContent('');
        // setContent(data.content);
        setTitles(data.titles || []);
        toast.success('Blog Title Generated')
       }
       else{
        toast.error(data.message);
       }
    } catch (error) {
      toast.error(error.response.data.message);
    }
    setLoading(false);
  }
  return (
    <div className='h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700'>
      {/* Left column */}
      <form action="" onSubmit={onSubmitHandler} className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200'>
          <div className='flex items-center gap-3'>
            <Sparkles className='w-6 text-[#8E37EB]'/>
            <h1 className='text-xl font-semibold'>AI Title Generator</h1>
          </div>
          <p className='mt-6 text-sm font-medium'>Keyword</p>
          <input  onChange={(e)=>{setInput(e.target.value);setTitles([]);}} value={input} type="text" className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 ' placeholder='The future of artificial intelligence is...' required />
          <p className='mt-4 text-sm font-medium'>Category</p>
          <div className='mt-3 flex gap-3 flex-wrap sm:max-w-9/11'>
            {
              blogCategory.map((item,index)=>(
                <span onClick={()=>setSelectedCategory(item)} className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${selectedCategory === item ? 'bg-purple-50 text-purple-700' : 'text-gray-500 border-gray-300'}`} key={index}>{item}</span>
              ))
            }
          </div>
          <br />
          <button disabled={loading} className='flex gap-2 w-full justify-center items-center bg-gradient-to-r from-[#C341F6] to-[#8E37EB] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer'>
                {loading ? 
                  <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span>
                 : <Hash className='w-5'/>}
                
                Generate Title
          </button>

      </form>
      {/* Right column */}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200 flex flex-col min-h-96 '>
        <div className='flex items-center gap-3 '>
            <Hash className='w-5 h-5 text-[#8E37EB]'/>
            <h1 className='text-xl font-semibold '>
              Generated Titles
            </h1>
        </div>
        {titles.length === 0 ? (
            <div className='flex-1 flex justify-center items-center'>
            <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
              <Hash className='w-9 h-9 '/>
              <p>Enter the topic and click 'Generate Title' to get started</p>
            </div>
        </div>
        ) : (
          <div className='mt-3 h-full overflow-y-scroll  text-slate-600 '>
             <div className=''>
             <ol className="list-decimal mt-6 ml-6">
              {titles.map((title, idx) => (
                <li key={idx} className="mb-2 text-[18px]">{title}</li>
              ))}
            </ol>
            </div>   
          </div>
        )}
        
      </div>
      
    </div>
  )
}

export default BlogTitle
