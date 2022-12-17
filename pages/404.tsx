import Link from 'next/link'

// pages/404.js
export default function Custom404(): React.ReactElement {
  return (
    <section className="container">
      <div className="row">
        <div className="col">
          <h1>404 - Sivua ei löytynyt</h1>

          <p>
            <Link href="/">Takaisin etusivulle</Link>
          </p>
        </div>
      </div>
    </section>
  )
}
