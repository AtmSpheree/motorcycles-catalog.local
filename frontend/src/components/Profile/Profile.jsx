import React, { useContext, useEffect, useState } from 'react';
import { Container, Form, Button, Row, Col, Image } from 'react-bootstrap';
import { data, useNavigate } from 'react-router';
import { DataContext } from '../../context/dataContext';
import sortObject from '../../utils/sortObject'

export default function Profile() {
  const navigator = useNavigate();
  const dataContext = useContext(DataContext);

  const [fields, setFields] = useState({
    firstname: dataContext.data?.profile?.firstname,
    lastname: dataContext.data?.profile?.lastname,
    patronymic: dataContext.data?.profile?.patronymic === null ? "" : dataContext.data?.profile?.patronymic,
    email: dataContext.data?.profile?.email,
    role: dataContext.data?.profile?.role,
    image: dataContext.data?.profile?.image,
    password: '',
    repeatPassword: ''
  });
  const [errors, setErrors] = useState({
    firstname: [],
    lastname: [],
    patronymic: [],
    password: [],
    repeatPassword: [],
    image: []
  });

  useEffect(() => {
    if (dataContext.data?.profile === null) {
      navigator('/login');
    }
  }, [dataContext.data?.profile])

  const updateProfile = async (e) => {
    e.preventDefault();
    if (fields.password !== fields.repeatPassword ||
        (dataContext.data?.profile?.patronymic !== "" && fields.patronymic === "")) {
      setErrors({
        firstname: [],
        lastname: [],
        patronymic: (dataContext.data?.profile?.patronymic !== "" && fields.patronymic === "") ? ['Поле «Отчество» должно быть заполнено.'] : [],
        password: [],
        image: [],
        repeatPassword: fields.password !== fields.repeatPassword ? ["Пароли не совпадают."] : [],
      });
      return;
    }
    try {
      let formData = new FormData();
      formData.append('_method', 'PUT');
      for (let key in fields) {
        if (key === "patronymic") {
          if (fields[key] !== "") {
            formData.append(key, fields[key]);
          }
        } else if (key === "image") {
          if (fields[key] !== dataContext.data?.profile?.image) {
            formData.append(key, fields[key]);
          }
        } else if (key === "password") {
          if (fields[key] !== "") {
            formData.append(key, fields[key]);
          }
        } else if (key === "repeatPassword") {
          continue;
        } else {
          formData.append(key, fields[key]);
        }
      }
      let data = await fetch(`${import.meta.env.VITE_API_URL}/profile`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });
      if (data.status === 422) {
        let response = await data.json();
        setErrors({
          firstname: [],
          lastname: [],
          patronymic: [],
          password: [],
          repeatPassword: [],
          image: [],
          ...response.errors});
      } else {
        let response = await data.json();
        dataContext.setData({
          ...dataContext.data,
          profile: {
            ...response.data,
            patronymic: response.data.patronymic === null ? "" : response.data.patronymic
          }
        })
        setFields({
          ...fields,
          password: "",
          patronymic: response.data.patronymic === null ? "" : response.data.patronymic,
          repeatPassword: "",
          image: response.data.image
        })
        setErrors({
          firstname: [],
          lastname: [],
          patronymic: [],
          password: [],
          repeatPassword: [],
          image: []
        })
        document.getElementById('loadImage').value = "";
      }
    } catch (e) {

    }
  }

  return (<>
    {dataContext.data?.profile !== null &&
      <Container style={{ maxWidth: '600px' }} className="mt-4">
        <h2>Профиль</h2>
        <Form onSubmit={updateProfile}>
          <Row className="mb-3 align-items-center row-gap-1">
            <Col md={3}>
              <Form.Label style={{margin: 0}}>Фамилия</Form.Label>
            </Col>
            <Col md={9} s>
              <Form.Control
                type="text"
                value={fields.lastname}
                onChange={(e) => setFields({...fields, lastname: e.target.value})}
                isInvalid={errors.lastname.length > 0}
                required
              />
              {errors.lastname.map((item, index) =>
                <Form.Control.Feedback type="invalid" key={index}>
                  {item}
                </Form.Control.Feedback>
              )}
            </Col>
          </Row>
          <Row className="mb-3 align-items-center row-gap-1">
            <Col md={3}>
              <Form.Label style={{margin: 0}}>Имя</Form.Label>
            </Col>
            <Col md={9} s>
              <Form.Control
                type="text"
                value={fields.firstname}
                onChange={(e) => setFields({...fields, firstname: e.target.value})}
                isInvalid={errors.firstname.length > 0}
                required
              />
              {errors.firstname.map((item, index) =>
                <Form.Control.Feedback type="invalid" key={index}>
                  {item}
                </Form.Control.Feedback>
              )}
            </Col>
          </Row>
          <Row className="mb-3 align-items-center row-gap-1">
            <Col md={3}>
              <Form.Label style={{margin: 0}}>Отчество</Form.Label>
            </Col>
            <Col md={9} s>
              <Form.Control
                type="text"
                value={fields.patronymic}
                onChange={(e) => setFields({...fields, patronymic: e.target.value})}
                isInvalid={errors.patronymic.length > 0}
              />
              {errors.patronymic.map((item, index) =>
                <Form.Control.Feedback type="invalid" key={index}>
                  {item}
                </Form.Control.Feedback>
              )}
            </Col>
          </Row>
          <Row className="mb-3 align-items-center row-gap-1">
            <Col md={3}>
              <Form.Label style={{margin: 0}}>Электронная почта</Form.Label>
            </Col>
            <Col md={9} s>
              <Form.Control
                type="text"
                value={fields.email}
                readOnly
              />
            </Col>
          </Row>
          <Row className="mb-3 align-items-center row-gap-1">
            <Col md={3}>
              <Form.Label style={{margin: 0}}>Статус</Form.Label>
            </Col>
            <Col md={9} s>
              <Form.Control
                type="text"
                value={fields.role === 'user' ? 'Пользователь' : 'Администратор'}
                readOnly
              />
            </Col>
          </Row>
          <Row className="mb-3 align-items-center row-gap-1">
            <Col md={3}>
              <Form.Label style={{margin: 0}}>Пароль</Form.Label>
            </Col>
            <Col md={9} s>
              <Form.Control
                type="password"
                value={fields.password}
                onChange={(e) => setFields({...fields, password: e.target.value})}
                isInvalid={errors.password.length > 0 || errors.repeatPassword.length > 0}
              />
              {errors.password.map((item, index) =>
                <Form.Control.Feedback type="invalid" key={index}>
                  {item}
                </Form.Control.Feedback>
              )}
            </Col>
          </Row>
          <Row className="mb-3 align-items-center row-gap-1">
            <Col md={3}>
              <Form.Label style={{margin: 0}}>Повтор пароля</Form.Label>
            </Col>
            <Col md={9} s>
              <Form.Control
                type="password"
                value={fields.repeatPassword}
                onChange={(e) => setFields({...fields, repeatPassword: e.target.value})}
                isInvalid={errors.repeatPassword.length > 0}
              />
              {errors.repeatPassword.map((item, index) =>
                <Form.Control.Feedback type="invalid" key={index}>
                  {item}
                </Form.Control.Feedback>
              )}
            </Col>
          </Row>
          <Row className="mb-3 align-items-center row-gap-1">
            <Col md={3}>
              <Form.Label style={{margin: 0}}>Изображение профиля</Form.Label>
            </Col>
            <Col md={9} s>
              <Form.Control
                id="loadImage"
                onChange={(e) => setFields({...fields, image: e.target.files[0]})}
                type="file"
                accept="image/png, image/jpg, image/jpeg"
                placeholder="Выберите изображение..."
                isInvalid={errors.image.length > 0}
              />
              {errors.image.map((item, index) =>
                <Form.Control.Feedback type="invalid" key={index}>
                  {item}
                </Form.Control.Feedback>
              )}
            </Col>
          </Row>
          <Row className="mb-3 align-items-center row-gap-1">
            <Col md={3}>
              <Form.Label style={{margin: 0}}>Текущее изображение</Form.Label>
            </Col>
            <Col md={9} s>
              <Image
                src={
                  dataContext.data?.profile?.image === null ? '/img/image-blank.png' : dataContext.data?.profile?.image
                }
                className="rounded mx-auto d-block"
                style={{maxHeight: '500px', maxWidth: '100%'}}
                alt="Изображение"
              />
            </Col>
          </Row>
          {((JSON.stringify(sortObject(fields)) !==
           JSON.stringify(sortObject({...dataContext.data?.profile, password: "", repeatPassword: ""})))
           || (fields.image !== dataContext.data?.profile?.image)) &&
            <Button
              variant="outline-primary"
              size="sm"
              className='w-100'
              type='submit'
            >
              Изменить
            </Button>
          }
        </Form>
      </Container>
    }
  </>);
}