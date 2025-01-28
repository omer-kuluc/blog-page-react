import { useEffect, useRef, useState } from "react"
import './App.css'

export default function Blog() {
  const [page, setPage] = useState(<Home changePage={changePage} />);

  function changePage(id) {
    if(id === null) {
      setPage(<Home changePage={changePage} />);
      return;
    }

    setPage(<Detail id={id} changePage={changePage} />)
  }

  function handleClick(e) {
    if(e.target.checked) {
      setPage(<Editor changePage={changePage} />);
    } else {
      setPage(<Home changePage={changePage} />);
    }
  }

  return (
    <>
      <p style={{ textAlign: 'right' }}><label><input type="checkbox" onChange={handleClick} /> Editör</label></p>
      {page}
    </>
  )
}

function Home({ changePage }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function getData() {
      const data = await fetch('https://omar96.pythonanywhere.com/posts').then(r => r.json());
      setPosts(data);
    }

    getData();
  }, []);

  return (
    <div className="container">
      <h1>Kişiler ve Anahtar Sözcükler</h1>
      {posts.map(x => <BlogListItem key={x.id} {...x} changePage={changePage} />)}
    </div>
  )
}

function BlogListItem({ id, title, summary, created, changePage , imageUrl }) {
  return (
    <div className="blogItem-card" onClick={() => changePage(id)}>
      <h3>{title}</h3>
      <p>{summary}</p>
      <p><em>{created}</em></p>
      <img src= {imageUrl} alt="" />
      <hr />
    </div>
  )
}

function Detail({ id, changePage }) {
  const [content, setContent] = useState();

  useEffect(() => {
    async function getData() {
      const data = await fetch(`https://omar96.pythonanywhere.com/posts/${id}`).then(r => r.json());
      setContent(data);
    }

    getData();
  }, []);

  return (
    <>
      <p><small onClick={() => changePage(null)}>geri</small></p>
      <h1>{content?.title}</h1>
      <p>{content?.summary}</p>
      <p>{content?.body}</p>
      <hr />
      <p>Bu yazı {content?.created} tarihinde yazıldı.</p>
    </>
  )
}

function Editor() {
  const [posts, setPosts] = useState([]);
  const [username, setUsername] = useState(localStorage.username ?? '');
  const [password, setPassword] = useState(localStorage.password ?? '');

  function promptLogin() {
    const inputUsername = prompt('username');
    const inputPass = prompt('password');
    localStorage.username = inputUsername;
    localStorage.password = inputPass;
    setUsername(inputUsername);
    setPassword(inputPass);
  }

  useEffect(() => {
    async function getData() {
      const data = await fetch('https://omar96.pythonanywhere.com/posts').then(r => r.json());
      setPosts(data);
    }

    getData();

    if(username === '') {
      promptLogin();
    }
  }, []);

  const dialogRef = useRef(null);

  async function handleSubmit(e) {
    const formData = new FormData(e.target);
    const formObj = Object.fromEntries(formData);
    const request = await fetch(
      'https://omar96.pythonanywhere.com/posts', 
      {
        headers: {
          'Content-Type' : 'application/json',
          Authorization: `Basic ${btoa(`${username}:${password}`)}`
        },
        method: 'POST',
        body: JSON.stringify(formObj)
      }
    )
    
    // kontrol yapıp akışı kestim
    if(!request.ok) {
      alert('ekleme yapılamadı.');
      return;
    }

    const newPost = await request.json();

    console.log(newPost);

    setPosts([...posts, newPost]);
    
    e.target.reset();
  }

  async function removePost(id) {
    if(!confirm('Emin misin?')) {
      return;
    }

    await fetch(`https://omar96.pythonanywhere.com/posts/${id}`, { 
      method: 'DELETE',
      headers: {
        Authorization: `Basic ${btoa(`${username}:${password}`)}`
      }
     });

    setPosts(posts.filter(x => x.id !== id));
  }

  return (
    <>
      <p><button onClick={() => dialogRef.current.showModal()}>Yeni</button></p>
      <p style={{ textAlign: 'right' }}><button onClick={() => promptLogin()}>yeniden giriş</button></p>
      <ul>
        {posts.map(x => <li key={x.id}>{x.title} - <a href="#">düzenle</a> - <a href="#" onClick={() => removePost(x.id)}>sil</a></li>)}
      </ul>
      <dialog ref={dialogRef}>
        <form onSubmit={handleSubmit} method="dialog" autoComplete="off">
          <p><input required type="text" name="title" placeholder="Başlık" /></p>
          <p><input required type="text" name="imageUrl" placeholder="Görsel" /></p>
          <p><input required type="text" name="summary" placeholder="Özet" /></p>
          <p><textarea required name="body" placeholder="İçerik" rows={4} cols={40}></textarea></p>
          <p><button>Ekle</button></p>
        </form>
      </dialog>
    </>
  )
}