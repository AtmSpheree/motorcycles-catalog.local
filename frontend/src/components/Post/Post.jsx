import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Button, Card, Carousel, Image, Modal } from 'react-bootstrap';
import { DataContext } from '../../context/dataContext';
import { useLocation, useNavigate, useParams } from 'react-router';

function Post() {
  const dataContext = useContext(DataContext);
  const navigator = useNavigate();
  const params = useParams();
  const { state: stateParams } = useLocation();
  const [post, setPost] = useState(undefined);
  const [modalShow, setModalShow] = useState(false);

  useEffect(() => {
    async function getData() {
      if (dataContext.data?.posts === null) {
        try {
          let data = await fetch(`${import.meta.env.VITE_API_URL}/ownposts`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });
          if (data.status === 401) {
            localStorage.removeItem('token');
            dataContext.setData({
              ...dataContext.data,
              profile: null
            });
          } else {
            let response = await data.json();
            dataContext.setData({
              ...dataContext.data,
              posts: response.data
            })
          }
        } catch (e) {

        }
      }
      try {
        let data = await fetch(`${import.meta.env.VITE_API_URL}/posts/${params.postId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (data.status === 401) {
          let response = await data.json();
          if (response.message === "Unauthorized.") {
            localStorage.removeItem('token');
            dataContext.setData({
              ...dataContext.data,
              profile: null
            });
            navigator('/login')
          } else {
            setPost({error: true, message: "Это объявление скрыто."})
          }
        } else if (data.status === 403) {
          setPost({error: true, message: "Это объявление скрыто."})
        } else if (data.status === 404) {
          setPost({error: true, message: "Объявление не найдено."})
        } else {
          let response = await data.json();
          setPost(response.data);
        }
      } catch (e) {

      }
    }

    getData();
  }, [])
  
  const changeStatus = async (status) => {
    try {
      let data = await fetch(`${import.meta.env.VITE_API_URL}/posts/${params.postId}/change`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
          status: status
        })
      });
      if (data.status === 401) {
        localStorage.removeItem('token');
        dataContext.setData({
          ...dataContext.data,
          profile: null
        });
        navigator('/login')
      } else {
        setPost({
          ...post,
          status: status
        })
        if (dataContext.data?.posts !== null && dataContext.data?.posts.filter((item) => item.id === post.id).length > 0) {
          dataContext.setData({
            ...dataContext.data,
            posts: dataContext.data?.posts.map((item) => item.id === post.id ? {...item, status: status} : item)
          })
        }
      }
    } catch (e) {

    }
  }

  const deletePost = async (e) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/posts/${params.postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (dataContext.data?.posts !== null && dataContext.data?.posts.filter((item) => item.id == params.postId).length > 0) {
        dataContext.setData({
          ...dataContext.data,
          posts: dataContext.data?.posts.filter((item) => item.id != params.postId)
        })
      }
      if (stateParams !== null) {
        navigator(stateParams.prev)
      } else {
        navigator('/')
      }
    } catch (e) {
      console.log(e)
    }
  }

  return (<>
    {post === undefined ?
      <></>
    :
      (post.error === true ?
        <Container
          className="d-flex justify-content-center align-items-center"
        >
          <div className="text-center">
            <h2>{post.message}</h2>
          </div>
        </Container>
      :
        <Container className="mt-4">
          <Row style={{height: '500px'}} className='justify-content-center'>
            {post.images.length > 0 &&
              <Col md={6}>
                <Carousel
                  interval={null}
                  className='bg-secondary rounded'
                >
                  {post.images.map((img, index) =>
                    <Carousel.Item key={img.url} style={{height: '500px'}}>
                      <div
                        className="d-flex justify-content-center align-items-center"
                        style={{width: '100%', height: '100%'}}
                      >
                        <Image
                          src={img.url}
                          className="rounded mx-auto d-block"
                          style={{maxWidth: '75%', maxHeight: '100%', objectFit: 'contain'}}
                          alt="Изображение"
                        />
                      </div>
                    </Carousel.Item>
                  )}
                </Carousel>
              </Col>
            }
            <Col md={4}>
              <h3>{post.motorcycle.name} {post.brand} {post.model}</h3>
              <p><b>Объем двигателя:</b> {post.volume} л.</p>
              <p><b>Мощность:</b> {post.power} л.с.</p>
              <p><b>Описание:</b> {post.description}</p>
              <p><b>Технические характеристики:</b> {post.specifications}</p>
              <p><b>Дата объявления:</b> {post.date}</p>
              {((dataContext.data?.posts !== null && dataContext.data?.posts.filter((item) => item.id === post.id).length > 0) ||
                (dataContext.data?.profile !== null &&dataContext.data?.profile.role === 'admin')) && <>
                <p className='d-flex align-items-center gap-2'>
                  <b>Статус:</b>
                  <span
                    class={post.status === 0 ?
                      "badge text-bg-secondary"
                    :
                      (post.status === 1 ?
                        "badge text-bg-warning text-light"
                      :
                        (post.status === 2 ?
                          "badge text-bg-danger"
                        :
                          "badge text-bg-primary"
                        )
                      )
                    }
                  >
                    {post.status === 0 ?
                      'Добавлено'
                    :
                      (post.status === 1 ?
                        'Опубликовано'
                      :
                        (post.status === 2 ?
                          'Отклонено'
                        :
                          'В каталоге'
                        )
                      )
                    }
                  </span>
                </p>
                <div className='d-flex flex-wrap gap-2 align-items-center'>
                  {dataContext.data?.profile.role === 'admin' ?
                    <>
                      {post.status !== 0 &&
                        <>
                          {post.status !== 2 &&
                            <Button
                              variant="danger"
                              size="sm"
                              title="Отклонить"
                              onClick={(e) => changeStatus(2)}
                            >
                              Отклонить
                            </Button>
                          }
                          {(post.status !== 3) &&
                            <Button
                              variant="primary"
                              size="sm"
                              title="Опубликовать"
                              onClick={(e) => changeStatus(3)}
                            >
                              Опубликовать в каталоге
                            </Button>
                          }
                        </>
                        
                      }
                    </>
                  :
                    <>
                      {post.status !== 1 &&
                        <Button
                          variant="primary"
                          size="sm"
                          title="Опубликовать"
                          onClick={(e) => changeStatus(1)}
                        >
                          Опубликовать
                        </Button>
                      }
                      {post.status !== 0 &&
                        <Button
                          variant="secondary"
                          size="sm"
                          title="В добавленные"
                          onClick={(e) => changeStatus(0)}
                        >
                          В добавленные
                        </Button>
                      }
                    </>
                  }
                </div>
                {(dataContext.data?.posts !== null && dataContext.data?.posts.filter((item) => item.id === post.id).length > 0) &&
                  <div className='d-flex flex-wrap gap-2 align-items-center' style={{marginTop: '10px'}}>
                    <Button 
                      variant="danger"
                      className="me-2"
                      onClick={(e) => setModalShow(true)}
                    >
                      Удалить объявление
                    </Button>
                    <Button
                      variant="primary"
                      className='me-2'
                      onClick={(e) => navigator(`/posts/${params.postId}/change`, {state: {prev: '/ownposts'}})}
                    >
                      Редактировать объявление
                    </Button>
                  </div>
                }
              </>}

              {'user' in post ?
                <div
                  className='d-flex align-items-center gap-2 flex-wrap img-thumbnail'
                  style={{width: '400px', height: '100px', marginTop: '10px'}}
                >
                  <Image
                    className='rounded img-thumbnail'
                    src={post.user.image === null ? '/img/image-blank.png' : post.user.image}
                    style={{maxWidth: '100px', maxHeight: '100%', objectFit: 'contain'}}
                  />
                  <p>
                    {post.user.lastname} {post.user.firstname} {post.user.patronymic === null ? "" : post.user.patronymic}
                  </p>
                </div>
              :
                <h4>Для просмотра информации о пользователе войдите в аккаунт.</h4>
              }
            </Col>
          </Row>
          <Modal show={modalShow !== false} onHide={() => setModalShow(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Удаление объявления</Modal.Title>
            </Modal.Header>
            <Modal.Body>Вы действительно хотите удалить это объявление?</Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={() => deletePost()}>
                Удалить
              </Button>
              <Button variant="secondary" onClick={() => setModalShow(false)}>
                Отмена
              </Button>
            </Modal.Footer>
          </Modal>
        </Container>
      )
    }
  </>);
}

export default Post;