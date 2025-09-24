# Ejercicio técnico — Registro de pagos (Node.js + TS + Express + MongoDB)

## Mariana García

### Requisitos
- Node 18+ recomendado

### Scripts
- `npm run dev` — desarrollo con tsx (hot-reload)
- `npm run build` — compila a `dist/`
- `npm start` — ejecuta build (producción)
- `npm run format` - ejecuta formato sobre código


## 🚀 Primeros pasos

####  1. Instalación de dependencias:

`npm install`


#### 2. Configuración de variables de entorno:

Copia el archivo `.env.example` como `.env`:

```bash
cp .env.example .env
```

## 📋 Ejemplos de curl 

📌 Creación de pago sin `Idempotency-Key`
```bash
curl --location 'http://localhost:8080/payments' \
--header 'x-api-key: <API_KEY>' \
--header 'Content-Type: application/json' \
--data '{
    "amount": 0.1,
    "reference": "primer pago",
    "method": "card"
}'
```

Respuesta esperada

- creación de un payment correctamente
- HTTP Status 201 Created
```bash
{
    "_id": "68d3f281156b28ac74e53e19",
    "amount": 0.1,
    "reference": "primer pago",
    "method": "card",
    "status": "confirmed",
    "requestHash": "d40651447fc21a08f76e078c6dff74a319cd756432ddbc25503fbb56e416e059",
    "createdAt": "2025-09-24T13:30:26.855Z"
}

```
📌 Creación de pago sin `Idempotency-Key` pero BODY repetido
```bash
curl --location 'http://localhost:8080/payments' \
--header 'x-api-key: <API_KEY>' \
--header 'idempotency-key: <IDEMPOTENCY_KEY>' \
--header 'Content-Type: application/json' \
--data '{
    "amount": 0.1,
    "reference": "primer pago",
    "method": "card"
}'
```
Respuesta esperada

- HTTP Status 200 OK
```bash
{
    "_id": "68d3f281156b28ac74e53e19",
    "amount": 0.1,
    "reference": "primer pago",
    "method": "card",
    "status": "confirmed",
    "requestHash": "d40651447fc21a08f76e078c6dff74a319cd756432ddbc25503fbb56e416e059",
    "createdAt": "2025-09-24T13:30:26.855Z"
}
```

📌 Creación de pago CON `Idempotency-Key` sin BODY repetido
```bash
curl --location 'http://localhost:8080/payments' \
--header 'x-api-key: <API_KEY>' \
--header 'idempotency-key: <IDEMPOTENCY_KEY>' \
--header 'Content-Type: application/json' \
--data '{
    "amount": 0.1,
    "reference": "segundo pago",
    "method": "cash"
}'
```

Respuesta esperada

- creación de un payment correctamente
- HTTP Status 201 Created
```bash
{
    "amount": 0.1,
    "reference": "segundo pago",
    "method": "cash",
    "status": "confirmed",
    "idempotencyKey": "uagdsuvzckaj673asv",
    "requestHash": "7bccf4c671d3f659f79de0b1367b5dcc9b451ed9bfcf44bab7b91e26757d0cb2",
    "createdAt": "2025-09-24T13:36:17.863Z",
    "_id": "68d3f78890b677d831737ef2"
}
```

📌 Creación de pago CON `Idempotency-Key` repetida pero diferente BODY
```bash
curl --location 'http://localhost:8080/payments' \
--header 'x-api-key: <API_KEY>' \
--header 'idempotency-key: <IDEMPOTENCY_KEY>' \
--header 'Content-Type: application/json' \
--data '{
    "amount": 10,
    "reference": "tercer pago",
    "method": "cash"
}'
```

Respuesta esperada

- HTTP Status 409 Conflict
```bash
{
    "message": "Idempotency-Key conflict: payload mismatch"
}
```

## ❗ Validaciones

- HTTP Status 400 Bad Request
Si alguno de los parámetros esperados no es enviado

```bash
{
    "errors": [
        {
            "isNumber": "amount must be a number conforming to the specified constraints",
            "isPositive": "amount must be greater than 0"
        },
        {
            "isNotEmpty": "reference should not be empty",
            "isString": "reference must be a string"
        },
        {
            "isEnum": "method invalid cash | card | transfer"
        }
    ]
}
```

- HTTP Satus 500 Internal Server Error
Error no controlado
```bash
{ "error": "Internal server error" }
```