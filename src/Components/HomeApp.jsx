/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { usePathname } from 'next/navigation'
import { useTheme } from '@mui/material/styles'
import axios from 'axios'
import { toast } from 'react-toastify'
import { REMOVE_USER } from 'src/store/apps/authSlice/authSlice'
import { axiosPost } from './axiosCall'
import { useSettings } from 'src/@core/hooks/useSettings'
import LoadingMain from './LoadingMain'
import Cookies from 'js-cookie'
import { decryptData } from './encryption'

function HomeApp({ children }) {
  const [login, setLogin] = useState(true)
  const dispatch = useDispatch()
  const router = useRouter()
  const { locale } = useRouter()
  const patch = usePathname()
  const theme = useTheme()
  const { settings, saveSettings } = useSettings()
  const [cookies, _, removeCookie] = useCookies(['sub'])
  const loadingSelector = useSelector(rx => rx.LoadingHome.data)
  useEffect(() => {
    const handleThemeChange = () => {
      document.body.classList.toggle('dark-mode', theme.palette.mode === 'dark')
    }

    handleThemeChange()

    return () => {
      handleThemeChange()
    }
  }, [theme.palette.mode])
  useEffect(() => {
    if (cookies.mode) {
      const time = setTimeout(() => {
        saveSettings({
          ...settings,
          mode: cookies.mode,
          themeColor: 'error',
          skin: 'bordered',
          direction: locale === 'ar' ? 'rtl' : 'ltr'
        })
      }, 500)

      return () => clearTimeout(time)
    }
  }, [cookies.mode, locale])

  useEffect(() => {
    axios.interceptors.response.use(
      function (response) {
        handleErrorResponse(response.data, response.status)

        return response
      },
      function (error) {
        handleErrorResponse(error.response?.data, error.response.status)

        return Promise.reject(error)
      }
    )
  }, [])

  useEffect(() => {
    removeCookie('sub', { path: '/' })
    dispatch(REMOVE_USER())
    setLogin(false)
  }, [])
  useEffect(() => {
    document.body.classList.toggle('rtl', locale === 'ar')
  }, [locale])

  const handleErrorResponse = (data, status) => {
    const messagesData = data.errorMessage ?? data.message
    if (!data?.success) {
      if (typeof messagesData === 'string') {
        if (status === 401) {
          removeCookie('sub', { path: '/' })
          dispatch(REMOVE_USER())
        } else {
          toast.error(messagesData)
        }

        return
      }

      for (const key in messagesData) {
        const messages = messagesData[key]
        if (Array.isArray(messages)) {
          messages.forEach(message => toast.error(message))
        } else {
          toast.error(messages)
        }
      }
    }
  }

  useEffect(() => {
    // localStorage.clear()
  }, [])

  const [loading, setLoading] = useState(false)

  const handleLogout = () => {
    setLoading(true)
    const authToken = Cookies.get('sub')
    axiosPost('auth/logout/', locale, { token: decryptData(authToken).token })
      .then(res => {
        if (res.status) {
          removeCookie('sub', { path: '/' })
          dispatch(REMOVE_USER())
        }
      })
      .finally(_ => {
        setLoading(false)
      })
  }
  const user = useSelector(rx => rx.auth.loading)

  useEffect(() => {
    if (patch && '/' + patch.split('/')[1] === '/setting' && user !== 'loading' && user === 'no') {
      router.push(`/${locale}/login`)
    }
  }, [locale, router, user, patch])
  if (patch && '/' + patch.split('/')[1] === '/setting' && user !== 'loading' && user === 'no') {
    return <LoadingMain login={true} />
  }

  console.log(loadingSelector)

  return (
    <>
      <LoadingMain login={login || !loadingSelector} />
      {!login && children}
    </>
  )
}

export default HomeApp
