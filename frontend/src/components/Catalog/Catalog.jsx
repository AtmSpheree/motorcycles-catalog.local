import React, { useContext, useEffect, useState } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Dropdown,
  Carousel,
  Image,
} from 'react-bootstrap';
import { DataContext } from '../../context/dataContext';
import { useNavigate } from 'react-router';
import parseDate from '../../utils/parseDate';

export default function Catalog() {
  const dataContext = useContext(DataContext);
  const navigator = useNavigate();
  const [posts, setPosts] = useState(null);
  const [showingPosts, setShowingPosts] = useState(null);
  const [motorcycles, setMotorcycles] = useState(null);

  const [sortDate, setSortDate] = useState('Сначала новые');
  const [sortType, setSortType] = useState('Все');
  const [sortPower, setSortPower] = useState('По возрастанию');
  const [sortVolume, setSortVolume] = useState('По возрастанию');

  useEffect(() => {
    async function getData() {
      try {
        let data = await fetch(`${import.meta.env.VITE_API_URL}/motorcycles`);
        let response = await data.json();
        setMotorcycles(response.data);
      } catch (e) {
  
      }

      try {
        let data = await fetch(`${import.meta.env.VITE_API_URL}/catalog`, {
          method: "GET"
        });
        let response = await data.json();
        setPosts(response.data);
        response.data = response.data.sort((a, b) => {
          let [date_a, date_b] = [new Date(parseDate(a.date)), new Date(parseDate(b.date))];
          return date_b - date_a
        })
        response.data = response.data.sort((a, b) => {
          return a.power - b.power
        })
        response.data = response.data.sort((a, b) => {
          return a.volume - b.volume
        })
        setShowingPosts(response.data)
      } catch (e) {

      }
    }

    getData();
  }, [])

  const onSortDateChange = (type) => {
    setShowingPosts(
      showingPosts.sort((a, b) => {
        let [date_a, date_b] = [new Date(parseDate(a.date)), new Date(parseDate(b.date))];
        if (type === 'Сначала новые') {
          return date_b - date_a
        } else {
          return date_a - date_b
        }
      })
    )
  }

  const onSortTypeChange = (type) => {
    let result = posts.filter((item) => type === 'Все' ? true : item.motorcycle.name === type);
    result = result.sort((a, b) => {
      let [date_a, date_b] = [new Date(parseDate(a.date)), new Date(parseDate(b.date))];
      if (sortDate === 'Сначала новые') {
        return date_b - date_a
      } else {
        return date_a - date_b
      }
    })
    result = result.sort((a, b) => {
      if (sortPower === 'По возрастанию') {
        return a.power - b.power
      } else {
        return b.power - a.power
      }
    })
    result = result.sort((a, b) => {
      if (sortVolume === 'По возрастанию') {
        return a.volume - b.volume
      } else {
        return b.volume - a.volume
      }
    })
    setShowingPosts(result);
  }

  const onSortPowerChange = (type) => {
    setShowingPosts(
      showingPosts.sort((a, b) => {
        if (type === 'По возрастанию') {
          return a.power - b.power
        } else {
          return b.power - a.power
        }
      })
    )
  }

  const onSortVolumeChange = (type) => {
    setShowingPosts(
      showingPosts.sort((a, b) => {
        if (type === 'По возрастанию') {
          return a.volume - b.volume
        } else {
          return b.volume - a.volume
        }
      })
    )
  }

  return (<>
    {(posts !== null && showingPosts !== null) &&
      <Container>
        <h2 className="mb-4">Каталог</h2>
        <Form className="mb-4">
          <Row className="align-items-end">
            <Col md={2}>
              <Form.Label>Сортировка по дате</Form.Label>
              <Form.Select
                value={sortDate}
                onChange={(e) => {onSortDateChange(e.target.value); setSortDate(e.target.value)}}
              >
                <option value='Сначала новые'>Сначала новые</option>
                <option value='Сначала старые'>Сначала старые</option>
              </Form.Select>
            </Col>
            <Col md={2}>
              <Form.Label>Показывать</Form.Label>
              <Form.Select
                value={sortType}
                onChange={(e) => {onSortTypeChange(e.target.value); setSortType(e.target.value)}}
              >
                <option value="Все">Все</option>
                {motorcycles.map((item) => (
                  <option key={item.name} value={item.name}>{item.name}</option>
                ))}
              </Form.Select>
            </Col>
            <Col md={2}>
              <Form.Label>Сортировка по мощности</Form.Label>
              <Form.Select
                value={sortPower}
                onChange={(e) => {onSortPowerChange(e.target.value); setSortPower(e.target.value)}}
              >
                <option value='По возрастанию'>По возрастанию</option>
                <option value='По убыванию'>По убыванию</option>
              </Form.Select>
            </Col>
            <Col md={3}>
              <Form.Label>Сортировка по объёму двигателя</Form.Label>
              <Form.Select
                value={sortVolume}
                onChange={(e) => {onSortVolumeChange(e.target.value); setSortVolume(e.target.value)}}
              >
                <option value='По возрастанию'>По возрастанию</option>
                <option value='По убыванию'>По убыванию</option>
              </Form.Select>
            </Col>
          </Row>
        </Form>
  
        <Row>
          {showingPosts.map((item) => (
            <Col md={4} className="mb-4" key={item.id}>
              <Card style={{position: 'relative'}}>
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
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    }
  </>);
}