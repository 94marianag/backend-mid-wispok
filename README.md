# Ejercicio técnico — Registro de pagos (Node.js + TS + Express + MongoDB)

## Plantilla mínima para iniciar prueba técnica

### Requisitos
- Node 18+ recomendado

### Scripts
- `npm run dev` — desarrollo con tsx (hot-reload)
- `npm run build` — compila a `dist/`
- `npm start` — ejecuta build (producción)


## Objetivo

Diseñar y exponer un endpoint REST para registrar un pago con idempotencia, persistencia en MongoDB y confirmación al cliente.

## Requisitos funcionales

####  1. Endpoint:

- Definir método
- Definir endpoint

#### 2. Body (JSON):

```json
{
  "amount": 123.45,
  "reference": "ORD-2025-0001",
  "method": "card" // ej. "card" | "transfer" | "cash"
}
```


#### 3. Validaciones

* amount > 0 (número).

* reference no vacía (string).

* method dentro de un conjunto permitido.

#### 4. Idempotencia:

* Aceptar el header Idempotency-Key: <uuid|string>.

* Si se repite la misma key con el mismo payload, NO debe crear un pago nuevo: debe devolver la misma respuesta del primer intento (200).

* Si se repite la misma key con payload diferente, devolver 409 Conflict (y no crear nada).

* Si no se envía Idempotency-Key, usar una regla de deduplicación por (reference, method, amount) para evitar dobles cobros, devolviendo 200 con el primer recurso creado si ya existía.

#### 5. Persistencia:

Guardar el pago en MongoDB con estos campos mínimos:
```json
{
  _id: ObjectId,
  amount: number,
  reference: string,
  method: "card" | "transfer" | "cash",
  status: "confirmed",       // fijo para este ejercicio
  idempotencyKey?: string,   // si vino el header
  requestHash: string,       // hash estable del body
  createdAt: Date
}
````

* Crear índices únicos:

* Unico sobre idempotencyKey (si se usa).

* Único compuesto sobre (reference, method, amount) para desduplicación cuando no hay key.

#### 6. Segurida en endpoint
* Agregar seguridad a endpoint para procesar las peticiones (Queda a criterio del desarrollador)

#### 7. Respuesta de éxito:

* 201 Created cuando se crea por primera vez.

* 200 OK si es repetición idempotente o deduplicada.

Body:
```json
{
  "id": "<paymentId>",
  "status": "confirmed",
  "amount": 123.45,
  "reference": "ORD-2025-0001",
  "method": "card",
  "createdAt": "2025-09-15T12:34:56.000Z"
}
```

#### 7. Errores esperados:

* 400: validaciones de schema.

* 409: Idempotency-Key repetida con payload distinto.
* 4XX: error de validación de endpoint
* 500: errores no controlados.

## Requisitos técnicos

* Node.js + Express + Mongo DB

* MongoDB con Mongoose o driver nativo.

## Entregables

Código en repo (estructura sugerida abajo).

README con:

* Cómo correr localmente.

* Variables de entorno.

* Ejemplos de curl.

## Criterios de aceptación

- Crea pagos válidos y responde 201.

- Repite con misma Idempotency-Key + mismo cuerpo → 200 misma respuesta.

- Repite con misma Idempotency-Key + distinto cuerpo → 409.

- Sin Idempotency-Key, reintento exacto por (reference, method, amount) → 200 sin duplicar.

- Índices únicos creados correctamente.

- README claro



