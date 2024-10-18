import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';
import axios from 'axios';
 
export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
  if (!routing.locales.includes(locale as any)) notFound();
  const res :any= await axios.get(`http://localhost:3000/api/resource/get?code=${locale}`)
  if(!!res.data.data) {
    return{
      messages: res.data.data
    }
  }
  return {
    messages: (await import(`../messages/${locale}.json`)).default
  };
});