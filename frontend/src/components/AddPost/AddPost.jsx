import { useContext, useEffect, useState } from "react";
import { Alert, Button, Container, Form, Image, Modal } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router";
import { DataContext } from "../../context/dataContext";
import getImagesErrors from "../../utils/getImagesErrors";

export default function AddPost() {
  const navigator = useNavigate();
  const dataContext = useContext(DataContext);
  const params = useParams();
  const location = useLocation();
  const [motorcycles, setMotorcycles] = useState(null);
  const [imagesUrls, setImagesUrls] = useState([]);
  const [isFormShown, setIsFormShown] = useState(false);
  const [isAlert, setIsAlert] = useState(false);

  const [modalUploadShow, setModalUploadShow] = useState(false);
  const [modalDeleteShow, setModalDeleteShow] = useState(false);

  const [fields, setFields] = useState({
    description: "",
    motorcycle: "",
    brand: "",
    model: "",
    volume: 10,
    power: 10,
    specifications: "",
    images: []
  });
  const [errors, setErrors] = useState({
    description: [],
    motorcycle: [],
    brand: [],
    model: [],
    volume: [],
    power: [],
    specifications: [],
    images: [],
    image: []
  });

  useEffect(() => {
    async function getData() {
      let data = await fetch(`${import.meta.env.VITE_API_URL}/motorcycles`);
      let response = await data.json();
      setMotorcycles(response.data);
      setFields({...fields, motorcycle: response.data.length > 0 ? response.data[0].name : ""})

      if (location.pathname === '/addpost') {
        setFields({
          description: "",
          motorcycle: response.data.length > 0 ? response.data[0].name : "",
          brand: "",
          model: "",
          volume: 10,
          power: 10,
          specifications: "",
          images: []
        })
        setErrors({
          description: [],
          motorcycle: [],
          brand: [],
          model: [],
          volume: [],
          power: [],
          specifications: [],
          images: [],
          image: []
        })
        setImagesUrls([]);
      }

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
  }, [location])

  useEffect(() => {
    async function doActions() {
      if (params.postId) {
        if (dataContext.data?.posts !== null) {
          try {
            let data = await fetch(`${import.meta.env.VITE_API_URL}/posts/${params.postId}`, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            });
            if (data.status === 404) {
              setIsFormShown({error: true, message: 'Такого объявления не существует.'});
            } else if (dataContext.data?.posts.filter((item) => item.id == params.postId).length > 0) {
              setIsFormShown(true);
              let post = dataContext.data?.posts.filter((item) => item.id == params.postId)[0];
              setFields({
                description: post.description,
                motorcycle: post.motorcycle.name,
                brand: post.brand,
                model: post.model,
                volume: post.volume,
                power: post.power,
                specifications: post.specifications
              })
              setImagesUrls(post.images)
            } else {
              setIsFormShown({error: true, message: 'У вас нет доступа к редактированию этого объявления.'});
            }
          } catch (e) {

          }
        }
      }
    }

    doActions();
  }, [dataContext.data?.posts])

  const onImagesChange = (e) => {
    if ((e.target.files.length + fields.images.length) > 5) {
      setErrors({...errors, images: ['Максимальное количество изображений: 5.']})
      return;
    }
    setErrors({...errors, images: []})
    setFields({...fields, images: [...fields.images, ...Array.from(e.target.files)]});
    setImagesUrls([...imagesUrls, ...(Array.from(e.target.files).map((item) => {return {id: null, url: URL.createObjectURL(item)}}))]);
  }

  const onImagesDelete = (index) => {
    setFields({...fields, images: fields.images.filter((item, i) => i !== index)});
    setImagesUrls(imagesUrls.filter((item, i) => i !== index));
  }

  const onFormSubmit = async (e) => {
    e.preventDefault();
    try {
      let formData = new FormData();
      for (let key in fields) {
        if (key === "images") {
          for (let i = 0; i < fields.images.length; i++) {
            formData.append(`images[]`, fields.images[i]);
          }
        } else {
          formData.append(key, fields[key]);
        }
      }
      let data = await fetch(`${import.meta.env.VITE_API_URL}/posts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });
      if (data.status === 401) {
        localStorage.removeItem('token');
        dataContext.setData({
          ...dataContext.data,
          profile: null
        });
        navigator('/login')
      } else if (data.status === 422) {
        let response = await data.json();
        console.log(response.errors, fields)
        setErrors({
          description: [],
          motorcycle: [],
          brand: [],
          model: [],
          volume: [],
          power: [],
          specifications: [],
          images: getImagesErrors(response.errors),
          ...response.errors});
      } else {
        let response = await data.json();
        dataContext.setData({
          ...dataContext.data,
          posts: [response.data, ...dataContext.data?.posts]
        })
        navigator('/ownposts')
      }
    } catch (e) {
      console.log(e)
    }
  };

  const onChangeFormSubmit = async (e) => {
    e.preventDefault();
    try {
      let data = await fetch(`${import.meta.env.VITE_API_URL}/posts/${params.postId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
          description: fields.description,
          motorcycle: fields.motorcycle,
          brand: fields.brand,
          model: fields.model,
          volume: fields.volume,
          power: fields.power,
          specifications: fields.specifications
        })
      });
      if (data.status === 401) {
        localStorage.removeItem('token');
        dataContext.setData({
          ...dataContext.data,
          profile: null
        });
        navigator('/login')
      } else if (data.status === 422) {
        let response = await data.json();
        console.log(response.errors, fields)
        setErrors({
          description: [],
          motorcycle: [],
          brand: [],
          model: [],
          volume: [],
          power: [],
          specifications: [],
          image: [],
          ...response.errors});
      } else {
        let response = await data.json();
        dataContext.setData({
          ...dataContext.data,
          posts: dataContext.data?.posts.map((item) => item.id == params.postId ? response.data : item)
        })
        setIsAlert(true);
        setTimeout(() => setIsAlert(false), 2000)
      }
    } catch (e) {
      console.log(e)
    }
  }

  const onUploadImage = async (e) => {
    e.preventDefault();
    let image = document.getElementById('image_input').files[0];
    try {
      let formData = new FormData();
      formData.append('image', image);
      let data = await fetch(`${import.meta.env.VITE_API_URL}/posts/${params.postId}/images`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });
      if (data.status === 401) {
        localStorage.removeItem('token');
        dataContext.setData({
          ...dataContext.data,
          profile: null
        });
        navigator('/login')
      } else if (data.status === 422) {
        let response = await data.json();
        console.log(response.errors, fields)
        setErrors({
          ...errors,
          ...response.errors
        });
      } else {
        let response = await data.json();
        dataContext.setData({
          ...dataContext.data,
          posts: dataContext.data?.posts.map((item) => item.id == params.postId ? response.data : item)
        })
        setImagesUrls(response.data.images)
        setModalUploadShow(false);
      }
    } catch (e) {
      console.log(e)
    }
  }

  const onDeleteImage = async (id) => {
    try {
      let data = await fetch(`${import.meta.env.VITE_API_URL}/images/${id}`, {
        method: "DELETE",
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
        dataContext.setData({
          ...dataContext.data,
          posts: dataContext.data?.posts.map((item) => 
            item.id == params.postId ?
              {...item, images: item.images.filter((image) => image.id !== id)}
            :
              item
          )
        })
        setImagesUrls(imagesUrls.filter((image) => image.id !== id))
        setModalDeleteShow(false);
      }
    } catch (e) {
      console.log(e)
    }
  }

  const checkSimilarity = () => {
    let post = dataContext.data?.posts.filter((item) => item.id == params.postId)[0];
    if (fields.description === post.description) {
      if (fields.model === post.model) {
        if (fields.brand === post.brand) {
          if (fields.motorcycle === post.motorcycle.name) {
            if (fields.power == post.power) {
              if (fields.volume == post.volume) {
                if (fields.specifications === post.specifications) {
                  return true
                }
              }
            }
          }
        }
      }
    }
    return false;
  }

  return (<>
    {isFormShown.error &&
      <Container
        className="d-flex justify-content-center align-items-center"
      >
        <div className="text-center">
          <h1>{isFormShown.message}</h1>
        </div>
      </Container>
    }
    {(motorcycles !== null && ((params.postId && isFormShown === true) || (!params.postId))) &&
      <Container style={{ maxWidth: '600px' }} className="mt-4">
        <h2>{params.postId ? 'Редактирование объявления' : 'Добавление объявления'}</h2>
        <Form onSubmit={params.postId ? onChangeFormSubmit : onFormSubmit}>
          <Form.Group controlId="motorcycle" className="mb-3">
            <Form.Label>Тип мотоцикла</Form.Label>
            <Form.Select
              value={fields.motorcycle}
              onChange={(e) => setFields({...fields, motorcycle: e.target.options[e.target.selectedIndex].value})}
              isInvalid={errors.motorcycle.length > 0}
              required
            >
              {motorcycles.map((item, index) => <option key={`${item.name}${index}`} value={item.name}>{item.name}</option>)}
            </Form.Select>
            {errors.motorcycle.map((item, index) =>
              <Form.Control.Feedback type="invalid" key={index}>
                {item}
              </Form.Control.Feedback>
            )}
          </Form.Group>

          <Form.Group controlId="brand" className="mb-3">
            <Form.Label>Марка</Form.Label>
            <Form.Control
              type="text"
              placeholder="Yamaha..."
              value={fields.brand}
              onChange={(e) => setFields({...fields, brand: e.target.value})}
              isInvalid={errors.brand.length > 0}
              required
            />
            {errors.brand.map((item, index) =>
              <Form.Control.Feedback type="invalid" key={index}>
                {item}
              </Form.Control.Feedback>
            )}
          </Form.Group>

          <Form.Group controlId="model" className="mb-3">
            <Form.Label>Модель</Form.Label>
            <Form.Control
              type="text"
              placeholder="YZF-R3..."
              value={fields.model}
              onChange={(e) => setFields({...fields, model: e.target.value})}
              isInvalid={errors.model.length > 0}
              required
            />
            {errors.model.map((item, index) =>
              <Form.Control.Feedback type="invalid" key={index}>
                {item}
              </Form.Control.Feedback>
            )}
          </Form.Group>
  
          <Form.Group controlId="volume" className="mb-3">
            <Form.Label>Объем двигателя (л.)</Form.Label>
            <Form.Control
              type="number"
              min={10}
              placeholder="Введите объем"
              value={fields.volume}
              onChange={(e) => setFields({...fields, volume: e.target.value})}
              isInvalid={errors.volume.length > 0}
              required
            />
            {errors.volume.map((item, index) =>
              <Form.Control.Feedback type="invalid" key={index}>
                {item}
              </Form.Control.Feedback>
            )}
          </Form.Group>
  
          <Form.Group controlId="power" className="mb-3">
            <Form.Label>Мощность (л.с.)</Form.Label>
            <Form.Control
              type="number"
              min={10}
              placeholder="Введите мощность"
              value={fields.power}
              onChange={(e) => setFields({...fields, power: e.target.value})}
              isInvalid={errors.power.length > 0}
              required
            />
            {errors.power.map((item, index) =>
              <Form.Control.Feedback type="invalid" key={index}>
                {item}
              </Form.Control.Feedback>
            )}
          </Form.Group>
  
          <Form.Group controlId="description" className="mb-3">
            <Form.Label>Описание объявления</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Введите описание"
              value={fields.description}
              onChange={(e) => setFields({...fields, description: e.target.value})}
              isInvalid={errors.description.length > 0}
              required
            />
            {errors.description.map((item, index) =>
              <Form.Control.Feedback type="invalid" key={index}>
                {item}
              </Form.Control.Feedback>
            )}
          </Form.Group>
  
          <Form.Group controlId="specifications" className="mb-3">
            <Form.Label>Технические характеристики</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Введите технические характеристики"
              value={fields.specifications}
              onChange={(e) => setFields({...fields, specifications: e.target.value})}
              isInvalid={errors.specifications.length > 0}
              required
            />
            {errors.specifications.map((item, index) =>
              <Form.Control.Feedback type="invalid" key={index}>
                {item}
              </Form.Control.Feedback>
            )}
          </Form.Group>

          {(params.postId && !checkSimilarity()) &&
            <Button variant="primary" type="submit" className="w-100" style={{marginBottom: '10px'}}>
              Редактировать объявление
            </Button>
          }

          {isAlert &&
            <Alert variant='success'>
              Объявление успешно отредактировано.
            </Alert>
          }

          {params.postId ?
            <>
              {imagesUrls.length <= 5 &&
                <Button
                  variant="secondary"
                  className="w-100"
                  onClick={(e) => setModalUploadShow(true)}
                >
                  Добавить изображение
                </Button>
              }
            </>
          :
            <Form.Group controlId="images" className="mb-3">
              <Form.Label>Фотографии (необязательно, 1-5)</Form.Label>
              <Form.Control
                type="file"
                multiple
                max={5}
                accept="image/png, image/jpg, image/jpeg"
                placeholder="Загрузите изображение..."
                onChange={onImagesChange}
                isInvalid={errors.images.length > 0}
              />
              {errors.images.map((item, index) =>
                <Form.Control.Feedback type="invalid" key={index}>
                  {item}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          }

          <div className="mt-2 d-flex flex-wrap justify-content-center gap-2">
            {imagesUrls.map((item, index) => (
              <div key={item.url} style={{width: '105px', height: '150px'}} className="d-flex flex-column align-items-center gap-2">
                <Image
                  src={item.url}
                  className="img-thumbnail rounded mx-auto d-block"
                  style={{ width: '100%', maxHeight: '100px', minHeight: '100px', objectFit: 'contain'}}
                  alt="Изображение"
                />
                <Button
                  className="w-100"
                  variant="danger"
                  size="sm"
                  title="Удалить"
                  onClick={params.postId ? (e) => setModalDeleteShow(item.id) : (e) => onImagesDelete(index)}
                >
                  &#10005;
                </Button>
              </div>
            ))}
          </div>

          {!params.postId  &&
            <Button variant="primary" type="submit" className="w-100" style={{marginBottom: '10px'}}>
              Добавить объявление
            </Button>
          }
        </Form>
        {params.postId && <>
          <Modal show={modalUploadShow !== false} onHide={() => setModalUploadShow(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Добавление изображения</Modal.Title>
            </Modal.Header>
            <Form onSubmit={onUploadImage}>
              <Modal.Body>
                <Form.Group controlId="image_input" className="mb-3">
                  <Form.Control
                    type="file"
                    accept="image/png, image/jpg, image/jpeg"
                    placeholder="Загрузите изображение..."
                    required
                    isInvalid={errors.image.length > 0}
                  />
                  {errors.image.map((item, index) =>
                    <Form.Control.Feedback type="invalid" key={index}>
                      {item}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="primary"
                  type="submit"
                >
                  Добавить
                </Button>
                <Button variant="secondary" onClick={() => setModalUploadShow(false)}>
                  Отмена
                </Button>
              </Modal.Footer>
            </Form>
          </Modal>
          <Modal show={modalDeleteShow !== false} onHide={() => setModalDeleteShow(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Удаление изображения</Modal.Title>
            </Modal.Header>
            <Modal.Body>Вы действительно хотите удалить это изображение?</Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={() => onDeleteImage(modalDeleteShow)}>
                Удалить
              </Button>
              <Button variant="secondary" onClick={() => setModalDeleteShow(false)}>
                Отмена
              </Button>
            </Modal.Footer>
          </Modal>
        </>}
        
      </Container>
    }
  </>);
}