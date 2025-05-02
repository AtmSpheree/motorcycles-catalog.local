import { useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useNavigate } from "react-router";

export default function Register() {
  const navigator = useNavigate();

  const [fields, setFields] = useState({
    firstname: '',
    lastname: '',
    patronymic: '',
    email: '',
    password: '',
    repeatPassword: '',
    image: ''
  });
  const [errors, setErrors] = useState({
    firstname: [],
    lastname: [],
    patronymic: [],
    email: [],
    password: [],
    repeatPassword: [],
    image: []
  });

  const onFormSubmit = async (e) => {
    e.preventDefault();
    if (fields.password !== fields.repeatPassword) {
      setErrors({firstname: [],
        lastname: [],
        patronymic: [],
        email: [],
        password: [],
        image: [],
        repeatPassword: ["Пароли не совпадают."]});
      return;
    }
    try {
      let formData = new FormData();
      for (let key in fields) {
        if (key === "patronymic" || key === "image") {
          if (fields[key] !== "") {
            formData.append(key, fields[key]);
          }
        } else {
          formData.append(key, fields[key]);
        }
      }
      let data = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
        method: "POST",
        body: formData
      });
      if (data.status === 422) {
        let response = await data.json();
        setErrors({
          firstname: [],
          lastname: [],
          patronymic: [],
          email: [],
          password: [],
          repeatPassword: [],
          image: [],
          ...response.errors});
      } else {
        navigator('/login')
      }
    } catch (e) {

    }
  }

  return (
    <Container className="mt-4" style={{ maxWidth: '500px' }}>
      <h2 className="mb-4 text-center">Регистрация</h2>
      <Form onSubmit={onFormSubmit}>
        <Form.Group controlId="lastName" className="mb-3">
          <Form.Label>Фамилия</Form.Label>
          <Form.Control
            onChange={(e) => setFields({...fields, lastname: e.target.value})}
            value={fields.lastname}
            type="text"
            placeholder="Введите фамилию"
            required
            isInvalid={errors.lastname.length > 0}
          />
          {errors.lastname.map((item, index) =>
            <Form.Control.Feedback type="invalid" key={index}>
              {item}
            </Form.Control.Feedback>
          )}
        </Form.Group>
        <Form.Group controlId="firstName" className="mb-3">
          <Form.Label>Имя</Form.Label>
          <Form.Control
            onChange={(e) => setFields({...fields, firstname: e.target.value})}
            value={fields.firstname}
            type="text"
            placeholder="Введите имя"
            required
            isInvalid={errors.firstname.length > 0}
          />
          {errors.firstname.map((item, index) =>
            <Form.Control.Feedback type="invalid" key={index}>
              {item}
            </Form.Control.Feedback>
          )}
        </Form.Group>
        <Form.Group controlId="patronymic" className="mb-3">
          <Form.Label>Отчество (необязательно)</Form.Label>
          <Form.Control
            onChange={(e) => setFields({...fields, patronymic: e.target.value})}
            value={fields.patronymic}
            type="text"
            placeholder="Введите отчество"
            isInvalid={errors.patronymic.length > 0}
          />
          {errors.patronymic.map((item, index) =>
            <Form.Control.Feedback type="invalid" key={index}>
              {item}
            </Form.Control.Feedback>
          )}
        </Form.Group>
        <Form.Group controlId="email" className="mb-3">
          <Form.Label>Электронная почта</Form.Label>
          <Form.Control
            onChange={(e) => setFields({...fields, email: e.target.value})}
            value={fields.email}
            type="email"
            placeholder="Введите email"
            required
            isInvalid={errors.email.length > 0}
          />
          {errors.email.map((item, index) =>
            <Form.Control.Feedback type="invalid" key={index}>
              {item}
            </Form.Control.Feedback>
          )}
        </Form.Group>
        <Form.Group controlId="password" className="mb-3">
          <Form.Label>Пароль</Form.Label>
          <Form.Control
            onChange={(e) => setFields({...fields, password: e.target.value})}
            value={fields.password}
            type="password"
            placeholder="Введите пароль"
            required
            isInvalid={errors.password.length > 0 || errors.repeatPassword.length > 0}
          />
          {errors.password.map((item, index) =>
            <Form.Control.Feedback type="invalid" key={index}>
              {item}
            </Form.Control.Feedback>
          )}
        </Form.Group>
        <Form.Group controlId="repeatPassword" className="mb-3">
          <Form.Label>Повтор пароля</Form.Label>
          <Form.Control
            onChange={(e) => setFields({...fields, repeatPassword: e.target.value})}
            value={fields.repeatPassword}
            type="password"
            placeholder="Введите пароль"
            required
            isInvalid={errors.repeatPassword.length > 0}
          />
          {errors.repeatPassword.map((item, index) =>
            <Form.Control.Feedback type="invalid" key={index}>
              {item}
            </Form.Control.Feedback>
          )}
        </Form.Group>
        <Form.Group controlId="image" className="mb-3">
          <Form.Label>Изображение профиля (необязательно)</Form.Label>
          <Form.Control
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
        </Form.Group>
        <Button variant="primary" type="submit" className="w-100 mb-3">
          Зарегистрироваться
        </Button>
      </Form>
      <div className="text-center">
        Уже есть аккаунт? <a href="#" onClick={(e) => navigator('/login')}>Войти</a>
      </div>
    </Container>
  )
}