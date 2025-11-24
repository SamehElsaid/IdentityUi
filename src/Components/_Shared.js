export const isArabic = (value, locale) => {
  const arabicRegex = /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\s.,،؟]+$/

  return locale !== 'ar' ? arabicRegex.test(value) : !arabicRegex.test(value)
}


export const getDomain = () => {
  return process.env.DEV_MODE ? 'http://localhost:3000/' : process.env.DOMAIN
}