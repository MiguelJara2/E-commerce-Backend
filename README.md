# E-commerce-Backend
Proyecto final

Docker
para usar docker no configure PORT en el archivo .env
docker build -t ecommerce-backend .
docker run -p 8089:8089 --env-file .env ecommerce-backend