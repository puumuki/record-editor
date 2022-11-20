import Document, { DocumentContext, Html, Head, Main, NextScript } from 'next/document'


class CustomDocument extends Document {
  render() {
    return (
    <Html lang="fi">
      <Head>        
        <meta name="description" content="One easy place to keep track of your lap time and track records." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>        
        <Main />
        <NextScript />        
      </body> 
    </Html>      
    );
  }
}

export default CustomDocument;