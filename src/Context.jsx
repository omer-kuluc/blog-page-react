import { createContext, useContext, useState } from "react"

const InfoContext = createContext(null);
const CounterContext = createContext(null);

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <CounterContext.Provider value={{ count, setCount }}>
      <InfoContext.Provider value={'Acunmedya Akademi'}>
        <Header />
        <Main />
        <Footer />
      </InfoContext.Provider>
    </CounterContext.Provider>
  )
}

function Header() {
  return (
    <header style={{ display: 'flex', justifyContent: 'space-between' }}>
      <Logo />
      <ul>
        <li><a href="#">Anasayfa</a></li>
        <li><a href="#">Hakkımızda</a></li>
        <li><a href="#">İletişim</a></li>
      </ul>
    </header>
  )
}

function Logo() {
  const info = useContext(InfoContext);
  return (
    <h1>{info}</h1>
  )
}

function Main() {
  return (
    <main>
      <h3>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fugiat, dignissimos.</h3>
      <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Totam nemo minima tempora alias earum, omnis error ea magni animi sint esse, officiis quia, impedit provident. Illo illum ipsam deserunt officiis?</p>
      <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Totam nemo minima tempora alias earum, omnis error ea magni animi sint esse, officiis quia, impedit provident. Illo illum ipsam deserunt officiis?</p>
      <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Totam nemo minima tempora alias earum, omnis error ea magni animi sint esse, officiis quia, impedit provident. Illo illum ipsam deserunt officiis?</p>
    </main>
  )
}

function Footer() {
  const {count, setCount} = useContext(CounterContext);
  
  function handleClick() {
    setCount(count + 1);
  }

  return (
    <>
      <hr />
      <footer>&copy; akademi 2025</footer>
      <button onClick={handleClick}>Beğen: {count}</button>
    </>
  )
}