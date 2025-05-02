import { useContext, useEffect, useState } from "react";
import { Button, Card, Carousel, Col, Container, Row, Image, Modal } from "react-bootstrap";
import { data, useNavigate } from "react-router";
import { DataContext } from "../../context/dataContext";

export default function OwnPosts() {
  const dataContext = useContext(DataContext);
  const navigator = useNavigate();
  const [modalShow, setModalShow] = useState(false);

  useEffect(() => {
    if (dataContext.data?.profile === null) {
      navigator('/login');
    }
  }, [dataContext.data?.profile])

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
            navigator('/login')
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
    }

    getData();
  }, [])

  const deletePost = async (e) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/posts/${modalShow}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      dataContext.setData({
        ...dataContext.data,
        posts: dataContext.data?.posts.filter((item) => item.id !== modalShow)
      })
      setModalShow(false);
    } catch (e) {
      console.log(e)
    }
  }

  const deletePostModal = (id) => {
    setModalShow(id);
  }

  return (<>
    {dataContext.data?.posts !== null &&
      <Container className="mt-4">
        <h2>Мои объявления</h2>
        <Button
          variant="primary"
          size="sl"
          style={{marginBottom: '15px'}}
          onClick={(e) => navigator('/addpost')}
        >
          Добавить
        </Button>
        <Row>
          {dataContext.data?.posts.map((item) => (
            <Col md={4} className="mb-4" key={item.id}>
              <Card style={{position: 'relative'}}>
                <h5 style={{position: 'absolute', top: '10px', right: '10px', zIndex: 100}}>
                  <span
                    className={item.status === 0 ?
                      "badge text-bg-secondary"
                    :
                      (item.status === 1 ?
                        "badge text-bg-warning text-light"
                      :
                        (item.status === 2 ?
                          "badge text-bg-danger"
                        :
                          "badge text-bg-primary"
                        )
                      )
                    }
                  >
                    {item.status === 0 ?
                      'Добавлено'
                    :
                      (item.status === 1 ?
                        'Опубликовано'
                      :
                        (item.status === 2 ?
                          'Отклонено'
                        :
                          'В каталоге'
                        )
                      )
                    }
                  </span>
                </h5>
                <Carousel 
                  interval={null}
                  style={{height: '200px',
                          backgroundColor: 'var(--bs-card-border-color)',
                          borderRadius: 'var(--bs-card-border-radius) var(--bs-card-border-radius) 0 0'
                  }}
                >
                  {item.images.map((img, index) =>
                    <Carousel.Item key={img.url}>
                      <div
                        className="d-flex justify-content-center align-items-center"
                        style={{width: '100%', height: '200px'}}
                      >
                        <Image
                          src={img.url}
                          className="rounded mx-auto d-block"
                          style={{maxWidth: '75%', maxHeight: '200px', objectFit: 'contain'}}
                          alt="Изображение"
                        />
                      </div>
                    </Carousel.Item>
                  )}
                </Carousel>
                <Card.Body>
                  <Card.Title>
                    {item.motorcycle.name} {item.brand} {item.model}
                  </Card.Title>
                  <Card.Text>
                    Объем двигателя: {item.volume} л.<br />
                    Мощность: {item.power} л.с.<br />
                  </Card.Text>
                  <div className="d-flex justify-content-between align-items-end gap-2">
                    <Card.Text style={{marginBottom: 0, color: 'gray'}}>{item.date}</Card.Text>
                    <div className="d-flex gap-2 flex-wrap">
                      <Button
                        variant="primary"
                        size="sm"
                        title="Перейти"
                        onClick={(e) => navigator(`/posts/${item.id}`, {state: {prev: '/ownposts'}})}
                      >
                        Перейти
                      </Button>
                      <Button
                        style={{width: '38px'}}
                        variant="outline-secondary"
                        size="sm"
                        title="Редактировать"
                        onClick={(e) => navigator(`/posts/${item.id}/change`, {state: {prev: '/ownposts'}})}
                      >
                        &#9998;
                      </Button>
                      <Button
                        style={{width: '38px'}}
                        variant="outline-danger"
                        size="sm"
                        title="Удалить"
                        onClick={(e) => deletePostModal(item.id)}
                      >
                        &#10005;
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
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
    }
  </>);
}