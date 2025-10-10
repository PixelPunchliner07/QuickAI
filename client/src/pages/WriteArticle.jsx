import { Edit, Sparkles } from 'lucide-react'
import React, { useState } from 'react'
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

function WriteArticle() {

  const articleLength = [
    {length:800 , text: 'Short (500 to 800 words)'},
    {length:1200 , text: 'Medium (800 to 1200 words)'},
    {length:1600 , text: 'Long (1200 to 1600 words)'},

  ]
  const [selectedLength , setSelectedLength] = useState(articleLength[0]);
  const [input , setInput] = useState('');
  const [loading , setLoading] = useState(false);
  const [content , setContent] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!content) return;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 8000); // Reset after 1.5s
  };
  


  const {getToken} = useAuth();
  const onSubmitHandler = async (e)=>{
    e.preventDefault();
    setLoading(true);
   
    try {
       const prompt = `Write an article about ${input} in ${selectedLength.text}`;

       const {data} = await axios.post('/api/ai/generate-article',{prompt,length:selectedLength.length}, {
        headers:{
          Authorization: `Bearer ${ await getToken()}`
        }
       })
       if(data.success){
        setContent(data.content);
        toast.success('Article Generated')
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
            <Sparkles className='w-6 text-[#4A7AFF]'/>
            <h1 className='text-xl font-semibold'>Article Configuration</h1>
          </div>
          <p className='mt-6 text-sm font-medium'>Article Topic</p>
          <input  onChange={(e)=>setInput(e.target.value)} value={input} type="text" className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 ' placeholder='The future of artificial intelligence is...' required />
          <p className='mt-4 text-sm font-medium'>Article Length</p>
          <div className='mt-3 flex gap-3 flex-wrap sm:max-w-9/11'>
            {
              articleLength.map((item,index)=>(
                <span onClick={()=>setSelectedLength(item)} className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${selectedLength.text === item.text ? 'bg-blue-50 text-blue-700' : 'text-gray-500 border-gray-300'}`} key={index}>{item.text}</span>
              ))
            }
          </div>
          <br />
          <button disabled={loading} className='flex gap-2 w-full justify-center items-center bg-gradient-to-r from-[#226BFF] to-[#65ADFF] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer'>
                {loading ? <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span> :  <Edit className='w-5'/>
               }
               
                Generate Article
          </button>

      </form>
      {/* Right column */}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200 flex flex-col min-h-96 max-h-[600px]'>
        <div className='flex items-center gap-3 '>
            <Edit className='w-5 h-5 text-[#4A7AFF]'/>
            <h1 className='text-xl font-semibold '>
              Generated Article
            </h1>
        </div>
        {!content ? (
          <div className='flex-1 flex justify-center items-center'>
              <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
                <Edit className='w-9 h-9 '/>
                <p>Enter the topic and click 'Generate Article' to get started</p>
              </div>
          </div>
        ) : (
          <div className='mt-3 h-full overflow-y-scroll text-sm text-slate-600 '>
            <article className="prose prose-slate max-w-none prose-img:rounded-xl prose-headings:font-semibold prose-headings:text-gray-800 prose-a:text-blue-600 prose-blockquote:border-l-4 prose-blockquote:border-blue-300 prose-blockquote:bg-blue-50 prose-blockquote:py-2 prose-blockquote:px-3 prose-blockquote:rounded-md prose-li:marker:text-blue-600">
            <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
              {content}
            </Markdown>
          </article>
             
          </div>
        )}
         <button
              type="button"
              disabled={!content}
              onClick={handleCopy}
              className="flex gap-2 w-full justify-center items-center bg-gradient-to-r from-[#226BFF] to-[#65ADFF] text-white px-4 py-2 mt-3 text-sm rounded-lg cursor-pointer transition"
            >
              {copied ? "Copied ✅" : "Copy"}
            </button>
        
      </div>
      
    </div>
  )
}

export default WriteArticle
