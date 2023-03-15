import Intro from '@/components/Intro'
import NavBar from '@/components/NavBar'
import Head from 'next/head'
import { useDispatch, useSelector } from 'react-redux'
import { setUserToken } from '@/Utils/UserSlice'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { setJobData } from '@/Utils/JobSlice'
import { get_job } from '@/Services/job'


export async function  getServerSideProps(context) {
  const data = await get_job();
  return {
    props: {
      data
    },
  }
}


export default function Home({data}) {
  

  const dispatch = useDispatch();
  const token = Cookies.get('token');


  const [loading, setLoading] = useState(true);
  const JobData = useSelector(state => state.Job.JobData)

  useEffect(() => {
      dispatch(setJobData(data?.data))
  }, [dispatch])

  useEffect(() => {
    if (JobData?.length > 0) {
      setLoading(false)
    }
  }, [JobData])

  useEffect(() => {
    if (token) {
      dispatch(setUserToken(token))
    }
  }, [token, dispatch])

  return (
    <>

      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Search and apply for the latest jobs in your field. Explore opportunities from top companies and make your career dreams come true." />
        <meta name="keywords" content="job portal, job search, career opportunities, employment, job listings, job openings, job vacancies, job postings, hiring, recruitment" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://job-portal-teal.vercel.app/" />
        <meta name="author" content="Abdullah Moiz" />
        <meta property="og:title" content="Find Your Dream Job | Job Portal Name" />
        <meta name="twitter:title" content="Find Your Dream Job | Job Portal Name" />
        <meta name="language" content="en-US" />
      </Head>
      {
        loading ? (
          <div className='w-full h-screen flex bg-indigo-600 items-center justify-center'>
            <div className='w-32 h-32 rounded-full animate-bounce flex items-center justify-center text-xl px-2 py-2 bg-white  text-indigo-600'>Loading...</div>
          </div>
        ) : (
          <>
            <NavBar />
            <div className="w-full h-screen bg-gray-200  text-black">
              <Intro />
            </div>
          </>
        )
      }
      <NavBar />
      <div className="w-full h-screen bg-gray-200  text-black">
        <Intro />
      </div>
    </>
  )
}
