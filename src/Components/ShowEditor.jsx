import { isArabic } from './_Shared'


const wrapLinksInAnchorTags = html => {
  const regex = /(<a\b[^>]*>.*?<\/a>)|(https?:\/\/[^\s"<>]+)/gi

  return (
    html?.replace(regex, (match, anchorTag, url) => {
      if (anchorTag) {
        let modifiedAnchor = anchorTag

        // تحديث أو إضافة خاصية target
        if (modifiedAnchor.includes('target=')) {
          modifiedAnchor = modifiedAnchor.replace(/target\s*=\s*(['"])(.*?)\1/, 'target="_blank"')
        } else {
          modifiedAnchor = modifiedAnchor.replace(/<a\b/, '<a target="_blank"')
        }

        // تحديث أو إضافة خاصية rel
        if (modifiedAnchor.includes('rel=')) {
          modifiedAnchor = modifiedAnchor.replace(/rel\s*=\s*(['"])(.*?)\1/, 'rel="noopener noreferrer"')
        } else {
          modifiedAnchor = modifiedAnchor.replace(/<a\b/, '<a rel="noopener noreferrer"')
        }

        return modifiedAnchor
      }
      if (url) {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`
      }
      
      return match
    }) ?? ''
  )
}

const ShowEditor = ({ initialTemplateName }) => {
  const processedText = wrapLinksInAnchorTags(initialTemplateName)
  const defaultText = processedText.replace(/<[^>]*>?/gm, '').replace(/(https?:\/\/\S+|www\.\S+)/g, '')

  return (
    <div className=''>
      <div
        style={{ direction: isArabic(processedText) ? 'rtl' : 'ltr' }}
        dangerouslySetInnerHTML={{ __html: defaultText }}
        className='py-2 w-full h-full reset'
      />
    </div>
  )
}

export default ShowEditor
