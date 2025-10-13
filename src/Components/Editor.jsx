import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import { axiosPost } from './axiosCall'
import { Skeleton } from '@mui/material'

const SunEditor = dynamic(() => import('suneditor-react'), {
  ssr: false
})

const Editor = ({ initialTemplateName, type, setValue, trigger, refresh }) => {
  const [templateName, setTemplateName] = useState(initialTemplateName)
  const [loading, setLoading] = useState(true)
  const ref = useRef('')
  const refreshEditor = useRef()

  useEffect(() => {
  
    setTemplateName(initialTemplateName)
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 0)
  }, [refresh])

  return loading ? (
    <div className='w-full'>
      <Skeleton variant='rectangular' width='100%' height='400px' sx={{ borderRadius: '10px' }} />
    </div>
  ) : (
    <SunEditor
      ref={refreshEditor}
      onChange={e => {
        setTemplateName(e)
        setValue(type, e)
        trigger(type)
        ref.current = e
      }}
      defaultValue={templateName}
      onImageUploadBefore={(files, _info, uploadHandler) => {
        const formData = new FormData()
        formData.append('image', files[0])
        axiosPost('structure/image/', locale, formData).then(res => {
          if (res.status) {
            const result = {
              result: [
                {
                  url: res.results.image,
                  name: files[0].name
                }
              ]
            }
            uploadHandler(result)
          } else {
            const res = {
              result: []
            }
            uploadHandler(res)
          }
        })
      }}
      setOptions={{
        buttonList: [
          ['font', 'fontSize', 'formatBlock'],
          ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
          ['align', 'horizontalRule', 'list', 'table'],
          ['fontColor', 'hiliteColor'],
          ['outdent', 'indent'],
          ['undo', 'redo'],
          ['removeFormat'],
          ['outdent', 'indent'],
          ['link', 'image'],
          ['preview', 'print'],
          ['fullScreen', 'showBlocks', 'codeView']
        ]
      }}
      height='400px'
      width='100%'
    />
  )
}

export default Editor
