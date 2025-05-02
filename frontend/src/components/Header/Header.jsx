import { useContext, useEffect } from "react";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { data, Outlet, useNavigate } from "react-router";
import { DataContext } from "../../context/dataContext";

export default function Header({ getProfile }) {
  const navigator = useNavigate();
  const dataContext = useContext(DataContext);

  useEffect(() => {
    getProfile();
  }, [])

  const changeTheme = () => {
    if (dataContext.data?.theme === 'dark') {
      localStorage.setItem('theme', 'light');
      dataContext.setData({
        ...dataContext.data,
        theme: 'light'
      })
    } else {
      localStorage.setItem('theme', 'dark');
      dataContext.setData({
        ...dataContext.data,
        theme: 'dark'
      })
    }
  }

  const logout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
      });
      localStorage.removeItem('token');
      dataContext.setData({
        ...dataContext.data,
        profile: null,
        posts: null
      })
      navigator('/login')
    } catch (e) {

    }
  }

  return <>
    {dataContext.data?.profile !== undefined &&
      <>
        <Navbar variant={dataContext.data?.theme} expand="lg" className="mb-4">
          <Container>
            <Navbar.Brand onClick={(e) => navigator('/')} style={{cursor: 'pointer'}}>
              <img
                alt=""
                src="/icon.png"
                width="30"
                height="30"
                className="d-inline-block align-top"
              />{' '}
              Каталог мотоциклов
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link onClick={(e) => navigator('/')}>Каталог</Nav.Link>
                {dataContext.data?.profile !== null &&
                  <>
                    <Nav.Link onClick={(e) => navigator('/profile')}>Профиль</Nav.Link>
                    <Nav.Link onClick={(e) => navigator('/ownposts')}>Мои объявления</Nav.Link>
                    <Nav.Link onClick={(e) => navigator('/addpost', {state: null})}>Добавить объявление</Nav.Link>
                    {dataContext.data?.profile.role === 'admin' &&
                      <>
                        <Nav.Link onClick={(e) => navigator('/posts', {state: null})}>Модерация</Nav.Link>
                        <Nav.Link onClick={(e) => navigator('/motorcycles', {state: null})}>Мотоциклы</Nav.Link>
                      </>
                    }
                  </>
                }
              </Nav>
              <Nav className="ms-auto">
                <Button
                    variant={dataContext.data?.theme === 'dark' ? 'outline-warning' : 'outline-dark'}
                    onClick={changeTheme}
                    className="mb-3"
                >
                  {dataContext.data?.theme === 'dark' ? '☀' : '🌑'}
                </Button>
                {dataContext.data?.profile === null ?
                  <>
                    <Nav.Link onClick={(e) => navigator('/login')}>Вход</Nav.Link>
                    <Nav.Link onClick={(e) => navigator('/register')}>Регистрация</Nav.Link>
                  </>
                :
                  <Nav.Link onClick={logout}>Выход</Nav.Link>
                }
                
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <Outlet/>
      </>
    }
  </>
}