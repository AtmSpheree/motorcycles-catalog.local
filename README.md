
# motorcycles-catalog.local

A web application for placing ads for the sale of motorcycles

## Demo
![Preview of the application](/screen.png)

## Tech Stack

**Client:** react, react-bootstrap, react-router, vite

**Server:** Php, Laravel, MySQL, OpenServer 6.0 (optional)


## Installation

Install with GIT, composer (php) and node (js)

```bash
  git clone https://github.com/AtmSpheree/motorcycles-catalog.local.git
  cd motorcycles-catalog.local
  composer install
  cd frontend
  npm install
```

### Next create Database in your MySQL
in my case, I am using MySQL-8.2, MotorcyclesCatalog database, root user without password.

### Next configure the environment files

[`.env`](/.env.example) of Laravel project:

```python
# Your app name
APP_NAME=motorcycles-catalog.local
# ...
# Your timezone
APP_TIMEZONE=Europe/Moscow
# ...
# Your app URL
APP_URL=https://motorcycles-catalog.local
# ...
# Database:
# ...
# Database configuration (defaults)
DB_CONNECTION=mysql
DB_HOST=MySQL-8.2
DB_PORT=3306
# Your database name
DB_DATABASE=DiplomMotorcycle
# Your database username
DB_USERNAME=root
# Your password (my root has no password)
DB_PASSWORD=
```

[`.env`](/frontend/.env.example) of React project:

```python
# The URL leading to the API route on your server.
# All requests from the client side will be sent to it.
VITE_API_URL = https://motorcycles-catalog.local/api
```

### Next configure Laravel project (generate new app key and migrate database)

```bash
  cd motorcycles-catalog.local
  php artisan key:generate
  php artisan migrate
```

### Enjoy
## Run Locally

### The entire project is already configured to run using OpenServer 6.0 (thanks to the settings in .osp). However, you can run it locally using the built-in Laravel server.

```bash
  cd motorcycles-catalog.local
  php artisan serve
```

### If you, like me, use OpenServer 6.0, then simply transfer the project to the OpenServer project directory. (`C:\OSPanel\home\{ laravel-project }`)

### After that, start the local React development server.

```bash
  cd motorcycles-catalog.local
  cd frontend
  npm run dev
```

### Next, simply access the client side using the URL of the running server. (by default: http://localhost:5173)

### When you finish development, you will need to create a build of the React project and upload it to the [`public`](/public) folder of the Laravel project so that the user receives your build when requesting default `/` address of the web server.

```bash
  cd motorcycles-catalog.local
  cd frontend
  npm run build
```

### Next, move the entire contents of the [`dist`](/frontend/dist) folder with the replacement to the [`public`](/public) folder.

### Enjoy
## API Reference

### The API Reference is presented as a PostMan collection ([`motorcycles-catalog.local.postman_collection.json`](/motorcycles-catalog.local.postman_collection.json)). Upload it to your PostMan using the Import function. Also, in the Variables section of the collection itself, specify:

```python
# Your API url
host = https://motorcycles-catalog.local/api
# The token of the user who is being authorized
token = 
```

### The collection is also divided into several groups. For those groups where authorization is required, the token is automatically imported from the `token` variable from the settings, so you need to specify it there.
## Appendix

### To create a user with administrator rights, you need to register the user (using the API or through the client side) and manually change the value of `role` from 0 to 1 in the database in the `users` table.
### Also, the entire project has already been configured in the Russian locale. Therefore, validation errors are already being returned in Russian.
