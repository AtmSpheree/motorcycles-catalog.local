import { useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useNavigate } from "react-router";

export default function Login({ getProfile }) {
  const navigator = useNavigate();

  const [fields, setFields] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    email: [],
    password: [],
    total: []
  });

  const onFormSubmit = async (e) => {
    e.preventDefault();
    try {
      let data = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(fields)
      });
      if (data.status === 422) {
        let response = await data.json();
        setErrors({
          email: [],
          password: [],
          total: [],
          ...response.errors});
      } else {
        let response = await data.json();
        localStorage.setItem('token', response.token);
        await getProfile();
        navigator('/')
      }
    } catch (e) {

    }
  }

  return (
    <Container className="mt-4" style={{ maxWidth: '400px' }}>
    <h2 className="mb-4 text-center">Авторизация</h2>
    <Form onSubmit={onFormSubmit}>
      <Form.Group controlId="email" className="mb-3">
        <Form.Label>Электронная почта</Form.Label>
        <Form.Control
          onChange={(e) => setFields({...fields, email: e.target.value})}
          value={fields.email}
          type="email"
          placeholder="Введите email"
          required
          isInvalid={errors.email.length > 0 || errors.total.length > 0}
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
          isInvalid={errors.password.length > 0 || errors.total.length > 0}
        />
        {errors.password.map((item, index) =>
          <Form.Control.Feedback type="invalid" key={index}>
            {item}
          </Form.Control.Feedback>
        )}
        {errors.total.map((item, index) =>
          <Form.Control.Feedback type="invalid" key={index}>
            {item}
          </Form.Control.Feedback>
        )}
      </Form.Group>
      <Button variant="primary" type="submit" className="w-100 mb-3">
        Войти
      </Button>
    </Form>
    <div className="text-center">
      Нет аккаунта? <a href="#" onClick={(e) => navigator('/register')}>Зарегистрироваться</a>
    </div>
  </Container>
  )
}