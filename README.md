# Sistema Bancário GitLab Flow

## Pré-requisitos

- [Node.js](https://nodejs.org/) versão 18 ou superior
- npm (incluso com o Node.js)

## Como executar a aplicação localmente

```bash
# 1. Clone o repositório
git clone https://github.com/BlackbirdBlina/Sistema-Bancario-GitLab-Flow.git
cd Sistema-Bancario-GitLab-Flow

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no navegador.

> **Atenção:** os dados são armazenados apenas em memória. Ao recarregar a página, todas as contas e operações são perdidas.

## Como executar utilizando Docker

```bash
# 1. Build a imagem
docker build -t imagemsb:v1 --load .

# 2. Execute a imagem para inicializar o container
docker run -p 8080:8080 imagemsb:v1

```

## Exemplos de chamadas aos endpoints

- Criar uma nova conta
  - POST /api/banco/conta
  - Com essa endpoint é possível criar uma nova conta bancária do tipo base, poupança ou bônus:

  ```bash
  curl -X POST http://localhost:8080/api/banco/conta \
  -H "Content-Type: application/json" \
  -d '{
    "accountNumber": 1001,
    "type": "base",
    "initialBalance": 100
  }'
  ```

- Consultar os dados de uma conta
  - GET /api/banco/conta/{id}
  - Com essa rota é possível consultar as informações de uma conta via ID:

  ```bash
  curl -X GET http://localhost:8080/api/banco/conta/1001 \
  -H "Accept: application/json"
  ```

- Colocar crédito em uma conta
  - PUT /api/banco/conta/{id}/credito
  - Com esse endpoint é possível adicionar um valor ao saldo da conta especificada:

  ```bash
  curl -X PUT http://localhost:8080/api/banco/conta/1001/credito \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 50.0
  }'
  ```

- Debitar um valor de uma conta
  - PUT /api/banco/conta/{id}/debito
  - Essa rota permite que um valor seja debitato do saldo de uma conta especifica:

  ```bash
  curl -X PUT http://localhost:8080/api/banco/conta/1001/debito \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 50.0
  }'
  ```

- Consultar o saldo de uma conta
  - GET /api/banco/conta/{id}/saldo
  - Esse endpoint permite consultar apenas as informações do número da conta e seu saldo:

  ```bash
  curl -X GET http://localhost:8080/api/banco/conta/1001/saldo \
  -H "Accept: application/json"
  ```

- Realizar transferência entre duas contas
  - PUT /api/banco/conta/transferencia
  - Esse endpoint realiza a transferência de uma conta de origem para uma conta de destino:

  ```bash
  curl -X PUT http://localhost:8080/api/banco/conta/transferencia \
  -H "Content-Type: application/json" \
  -d '{
    "from": 1001,
    "to": 1002,
    "amount": 50.0
  }'
  ```

- Aplicar rendimento
  - PUT /api/banco/conta/rendimento
  - Esse endpoint permite aplicar uma taxa de juros percentual a uma conta poupança:

  ```bash
  curl -X PUT http://localhost:8080/api/banco/conta/rendimento \
  -H "Content-Type: application/json" \
  -d '{
    "accountNumber": 1001,
    "interestRate": 1.5
  }'
  ```

## Link para Docker Hub

Sistema Bancário: https://hub.docker.com/r/r9drigo/sistema-bancario

## Integrantes

- Rodrigo Eduardo Dantas Barbalho
  - Perfil no GitHub: [Rodrigo Eduardo](https://github.com/rodrigoeduardo)

- Sabrina da Silva Barbosa Venceslau
  - Perfil no GitHub: [Sabrina Venceslau](https://github.com/BlackbirdBlina)

## Stack de desenvolvimento

- Linguagem: TypeScript,
- Framework: Next.js 16 + React 19,
- Estilização: Tailwind CSS v4.
