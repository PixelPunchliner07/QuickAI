import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import WriteArticle from './pages/WriteArticle'
import BlogTitle from './pages/BlogTitle'
import GenerateImage from './pages/GenerateImage'
import ReviewResume from './pages/ReviewResume'
import RemoveBackground from './pages/RemoveBackground'
import RemoveObject from './pages/RemoveObject'
import Community from './pages/Community'
import {Toaster} from 'react-hot-toast';

import Layout from './pages/Layout'
import { useAuth } from '@clerk/clerk-react'
function App() {

  return (
    <div>
      <Toaster/>
      <Routes>
        <Route path="/" element={<Home />} />
          <Route path="/ai" element={<Layout />} >
              <Route index element={<Dashboard />} />
              <Route path="write-article" element={<WriteArticle />} />
              <Route path="blog-titles" element={<BlogTitle />} />
              <Route path="generate-images" element={<GenerateImage />} />
              <Route path="review-resume" element={<ReviewResume />} />
              <Route path="remove-background" element={<RemoveBackground />} />
              <Route path="remove-object" element={<RemoveObject />} />
              <Route path="community" element={<Community />} />
          </Route>
      </Routes>
    </div>
  )
}

export default App
