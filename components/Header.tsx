import { useSession, signIn, signOut } from "next-auth/react"
import Link from "next/link"
import React, { MouseEvent } from "react"
import Image from 'next/image'

export default function Header() {  
    
    const handleSignin = (event: MouseEvent) => {        
      signIn()
    }

    const handleSignout = (event: MouseEvent) => {        
      signOut()
    }

    const { data: session } = useSession();

    return (
      <header className="navigation">
        <div className="container d-flex flex-wrap">
          <Link href="/" className="logo"><Image src="/logo-v1.svg" alt="logo" height="40" width="150"></Image></Link>
          
          <div className="pages">
            <Link href="/">Ajat</Link>
            <Link href="/drivers">Kuskit</Link>            
          </div>

          <div className="signinout-buttons">
            {session && <button className="btn btn-primary" type="button" onClick={handleSignout}>Kirjaudu ulos</button>  } 
            {!session && <button className="btn btn-primary"  type="button"onClick={handleSignin} >Kirjaudu sisään</button>  } 
          </div>
        </div>
      </header>
    )
  }