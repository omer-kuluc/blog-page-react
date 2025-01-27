import { useEffect, useRef, useState } from "react"

export default function Blog() {
  const [page, setPage] = useState(<Editor changePage={changePage} />);

  function changePage(id) {
    if(id === null) {
      setPage(<Home changePage={changePage} />);
      return;
    }

    setPage(<Detail id={id} changePage={changePage} />)
  }

  return (
    <>
      <p style={{ textAlign: 'right' }}><button>Editör</button></p>
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
    <>
      <h1>Blog Anasayfa</h1>
      {posts.map(x => <BlogListItem key={x.id} {...x} changePage={changePage} />)}
    </>
  )
}

function BlogListItem({ id, title, summary, created, changePage }) {
  return (
    <div className="blogItem" onClick={() => changePage(id)}>
      <h3>{title}</h3>
      <p>{summary}</p>
      <p><em>{created}</em></p>
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

  useEffect(() => {
    async function getData() {
      const data = await fetch('https://omar96.pythonanywhere.com/posts').then(r => r.json());
      setPosts(data);
    }

    getData();
  }, []);

  const dialogRef = useRef(null);

  async function handleSubmit(e) {
    const formData = new FormData(e.target);
    const formObj = Object.fromEntries(formData);
    const newPost = await fetch(
      'https://omar96.pythonanywhere.com/posts', 
      {
        headers: {'Content-Type' : 'application/json'},
        method: 'POST',
        body: JSON.stringify(formObj)
      }
    ).then(r => r.json());

    setPosts([...posts, newPost]);
    
    e.target.reset();
  }

  async function removePost(id) {
    if(!confirm('Emin misin?')) {
      return;
    }

    await fetch(`https://omar96.pythonanywhere.com/posts/${id}`, { method: 'DELETE',
      header : {
        Autharization : `Basic ${btoa('admin:omar')}`
      }
     });

    setPosts(posts.filter(x => x.id !== id));
  }


  return (
    <>
      <p><button onClick={() => dialogRef.current.showModal()}>Yeni</button></p>
      <ul>
        {posts.map(x => <li key={x.id}>{x.title} - <a href="#">düzenle</a> - <a href="#" onClick={() => removePost(x.id)}>sil</a></li>)}
      </ul>
      <dialog ref={dialogRef}>
        <form onSubmit={handleSubmit} method="dialog" autoComplete="off">
          <p><input required type="text" name="title" placeholder="Başlık" /></p>
          <p><input required type="text" name="summary" placeholder="Özet" /></p>
          <p><textarea required name="body" placeholder="İçerik" rows={4} cols={40}></textarea></p>
          <p><button>Ekle</button></p>
        </form>
      </dialog>
    </>
  )
}