import Document, { DocumentContext, Html, Head, Main, NextScript } from 'next/document'


class CustomDocument extends Document {
  render() {
    return (
    <Html lang="fi">
      <Head>        
        <meta name="description" content="Kontakti lomake sovellus" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi" crossOrigin="anonymous" />
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