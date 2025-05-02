import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';

export default function Motorcycles() {
  const [motorcycles, setMotorcycles] = useState(null);

  const [name, setName] = useState('');
  const [addErrors, setAddErrors] = useState([]);

  const [selectedMotorcycle, setSelectedMotorcycle] = useState(null);
  const [changeName, setChangeName] = useState('');
  const [changeErrors, setChangeErrors] = useState([]);

  const [selectedDeleteMotorcycle, setSelectedDeleteMotorcycle] = useState(null);
  const [deleteErrors, setDeleteErrors] = useState([]);

  useEffect(() => {
    async function getData() {
      try {
        let data = await fetch(`${import.meta.env.VITE_API_URL}/motorcycles`);
        let response = await data.json();
        setMotorcycles(response.data);
        if (response.data.length > 0) {
          setSelectedMotorcycle(response.data[0].name)
          setSelectedDeleteMotorcycle(response.data[0].name)
        }
      } catch (e) {
  
      }
    }

    getData();
  }, [])

  const onAddMotorcycle = async (e) => {
    e.preventDefault();
    try {
      let data = await fetch(`${import.meta.env.VITE_API_URL}/motorcycles`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
          name: name
        })
      });
      if (data.status === 401) {
        localStorage.removeItem('token');
        dataContext.setData({
          ...dataContext.data,
          profile: null,
        });
        navigator('/login')
      } else if (data.status === 422) {
        let response = await data.json();
        setAddErrors(response.errors.name);
      } else {
        let response = await data.json();
        if (selectedMotorcycle === null) {
          setSelectedMotorcycle(name)
        }
        if (selectedDeleteMotorcycle === null) {
          setSelectedDeleteMotorcycle(name)
        }
        setMotorcycles([...motorcycles, response.data]);
        setAddErrors([]);
        setName('');
      }
    } catch (e) {
      console.log(e)
    }
  }

  const onChangeMotorcycle = async (e) => {
    e.preventDefault();
    try {
      let data = await fetch(`${import.meta.env.VITE_API_URL}/motorcycles/${motorcycles.filter((item) => item.name === selectedMotorcycle)[0].id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
          name: changeName
        })
      });
      if (data.status === 401) {
        localStorage.removeItem('token');
        dataContext.setData({
          ...dataContext.data,
          profile: null,
        });
        navigator('/login')
      } else if (data.status === 422) {
        let response = await data.json();
        setChangeErrors(response.errors.name);
      } else {
        setMotorcycles(motorcycles.map((item) => item.name === selectedMotorcycle ? {...item, name: changeName} : item));
        setChangeName('');
        setChangeErrors([]);
        setSelectedMotorcycle(changeName)
        if (selectedMotorcycle === selectedDeleteMotorcycle) {
          setSelectedDeleteMotorcycle(changeName);
        }
        setSelectedMotorcycle(changeName)
      }
    } catch (e) {
      console.log(e)
    }
  }

  const onDeleteMotorcycle = async (e) => {
    e.preventDefault();
    try {
      console.log(motorcycles)
      let data = await fetch(`${import.meta.env.VITE_API_URL}/motorcycles/${motorcycles.filter((item) => item.name === selectedDeleteMotorcycle)[0].id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (data.status === 401) {
        localStorage.removeItem('token');
        dataContext.setData({
          ...dataContext.data,
          profile: null,
        });
        navigator('/login')
      } else if (data.status === 403) {
        let response = await data.json();
        setDeleteErrors(['Ошибка. С этим мотоциклом есть минимум одно объявление.']);
      } else {
        let result = motorcycles.filter((item) => item.name !== selectedDeleteMotorcycle);
        setMotorcycles(result);
        if (result.length !== 0) {
          if (selectedMotorcycle === selectedDeleteMotorcycle) {
            setSelectedMotorcycle(result[0].name)
          }
          setSelectedDeleteMotorcycle(result[0].name);
        }
        setDeleteErrors([]);
      }
    } catch (e) {
      console.log(e)
    }
  }

  return (<>
    {motorcycles !== null &&
      <Container className="mt-4">
        <h2 className='mb-4'>Типы мотоциклов</h2>
        <Row>
          <Col md={3} className="mb-4">
            <h4>Список мотоциклов</h4>
            <Form.Select>
              {motorcycles.map((item) => (
                <option key={item.name} value={item.name}>{item.name}</option>
              ))}
            </Form.Select>
          </Col>
          <Col md={3} className="mb-4">
            <h4>Добавление мотоцикла</h4>
            <Form onSubmit={onAddMotorcycle}>
              <Form.Group controlId="typeName" className="mb-3">
                <Form.Label>Название типа</Form.Label>
                <Form.Control
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  isInvalid={addErrors.length > 0}
                  required
                />
                {addErrors.map((item, index) =>
                  <Form.Control.Feedback type="invalid" key={index}>
                    {item}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
              <Button variant="primary" type='submit' className="w-100">
                Добавить
              </Button>
            </Form>
          </Col>
          {motorcycles.length !== 0 && <>
            <Col md={3}>
              <h4>Редактирование мотоцикла</h4>
              <Form onSubmit={onChangeMotorcycle}>
                <Form.Group controlId='changeTypeSelected' className="mb-3">
                  <Form.Label>Тип для редактирования</Form.Label>
                  <Form.Select
                    value={selectedMotorcycle}
                    onChange={(e) => setSelectedMotorcycle(e.target.value)}
                  >
                    {motorcycles.map((item) => (
                      <option key={item.name} value={item.name}>{item.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group controlId="changeTypeName" className="mb-3">
                  <Form.Label>Название типа</Form.Label>
                  <Form.Control
                    type="text"
                    value={changeName}
                    onChange={(e) => setChangeName(e.target.value)}
                    isInvalid={changeErrors.length > 0}
                    required
                  />
                  {changeErrors.map((item, index) =>
                    <Form.Control.Feedback type="invalid" key={index}>
                      {item}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
                <Button variant="primary" type='submit' className="w-100">
                  Редактировать
                </Button>
              </Form>
            </Col>
            <Col md={3}>
              <h4>Удаление мотоцикла</h4>
              <Form onSubmit={onDeleteMotorcycle}>
                <Form.Group controlId='deleteTypeSelected' className="mb-3">
                  <Form.Label>Тип для удаления</Form.Label>
                  <Form.Select
                    value={selectedDeleteMotorcycle}
                    isInvalid={deleteErrors.length > 0}
                    onChange={(e) => setSelectedDeleteMotorcycle(e.target.value)}
                  >
                    {motorcycles.map((item) => (
                      <option key={item.name} value={item.name}>{item.name}</option>
                    ))}
                  </Form.Select>
                  {deleteErrors.map((item, index) =>
                    <Form.Control.Feedback type="invalid" key={index}>
                      {item}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
                <Button variant="danger" type='submit' className="w-100">
                  Удалить
                </Button>
              </Form>
            </Col>
          </>}
        </Row>
      </Container>
    }
  </>);
}