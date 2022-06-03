/* _app.js */

import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css'
import '../styles/blogPost.css'
import '../styles/postList.css'
import NextNProgress from "nextjs-progressbar";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <NextNProgress height={10} color="#2c85ba" />
      <Component {...pageProps} />
    </>
  )
}

export default MyApp