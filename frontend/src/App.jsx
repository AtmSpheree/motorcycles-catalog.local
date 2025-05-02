import { useContext, useEffect, useState } from 'react'
import './App.css'
import { Route, Routes, useNavigate } from 'react-router'
import Header from './components/Header/Header'
import Login from './components/Login/Login'
import Register from './components/Register/Register'
import Profile from './components/Profile/Profile'
import Catalog from './components/Catalog/Catalog'
import OwnPosts from './components/OwnPosts/OwnPosts'
import { DataContext } from './context/dataContext'
import AddPost from './components/AddPost/AddPost'
import Post from './components/Post/Post'
import Posts from './components/Posts/Posts'
import Motorcycles from './components/Motorcycles/Motorcycles'

function App() {
  const navigator = useNavigate();
  const dataContext = useContext(DataContext);

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', dataContext.data?.theme)
  }, [dataContext.data?.theme])

  async function getProfile() {
    if (localStorage.getItem('token') !== null && localStorage.getItem('token') !== undefined) {
      try {
        let data = await fetch(`${import.meta.env.VITE_API_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (data.status === 401) {
          localStorage.removeItem('token');
          dataContext.setData({
            ...dataContext.data,
            profile: null
          });
        } else {
          let response = await data.json();
          dataContext.setData({
            ...dataContext.data,
            profile: {
              ...response.data,
              patronymic: response.data.patronymic === null ? "" : response.data.patronymic
            }
          })
        }
      } catch (e) {

      }
    } else {
      dataContext.setData({
        ...dataContext.data,
        profile: null
      })
    }
  }

  return (
    <Routes>
      <Route element={<Header getProfile={getProfile}/>}>
        <Route path='/login' element={<Login getProfile={getProfile}/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/' element={<Catalog/>}/>
        <Route path='/ownposts' element={<OwnPosts/>}/>
        <Route path='/addpost' element={<AddPost/>}/>
        <Route path='/posts/:postId' element={<Post/>}/>
        <Route path='/posts/:postId/change' element={<AddPost/>}/>
        <Route path='/posts' element={<Posts/>}/>
        <Route path='/motorcycles' element={<Motorcycles/>}/>
      </Route>
    </Routes>
  )
}

export default App
