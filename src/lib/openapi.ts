export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Sistema Bancário API",
    version: "1.0.0",
    description:
      "API REST para operações bancárias: criação de conta, consulta, crédito, débito, transferência e rendimento.",
  },
  servers: [{ url: "/", description: "Servidor atual" }],
  tags: [{ name: "Contas", description: "Operações sobre contas bancárias" }],
  paths: {
    "/api/banco/conta": {
      post: {
        tags: ["Contas"],
        summary: "Cria uma nova conta",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["accountNumber"],
                properties: {
                  accountNumber: { type: "integer", example: 1001 },
                  type: {
                    type: "string",
                    enum: ["base", "savings", "bonus"],
                    default: "base",
                  },
                  initialBalance: {
                    type: "number",
                    default: 0,
                    example: 100,
                  },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Conta criada com sucesso.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Account" },
              },
            },
          },
          "400": {
            description: "Dados inválidos ou conta já existe.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/banco/conta/{id}": {
      get: {
        tags: ["Contas"],
        summary: "Consulta os dados de uma conta",
        parameters: [{ $ref: "#/components/parameters/AccountId" }],
        responses: {
          "200": {
            description: "Dados da conta.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Account" },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/api/banco/conta/{id}/credito": {
      put: {
        tags: ["Contas"],
        summary: "Credita um valor na conta",
        parameters: [{ $ref: "#/components/parameters/AccountId" }],
        requestBody: { $ref: "#/components/requestBodies/Amount" },
        responses: {
          "200": {
            description: "Conta atualizada após o crédito.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Account" },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/api/banco/conta/{id}/debito": {
      put: {
        tags: ["Contas"],
        summary: "Debita um valor da conta",
        parameters: [{ $ref: "#/components/parameters/AccountId" }],
        requestBody: { $ref: "#/components/requestBodies/Amount" },
        responses: {
          "200": {
            description: "Conta atualizada após o débito.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Account" },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/api/banco/conta/{id}/saldo": {
      get: {
        tags: ["Contas"],
        summary: "Consulta o saldo da conta",
        parameters: [{ $ref: "#/components/parameters/AccountId" }],
        responses: {
          "200": {
            description: "Saldo atual da conta.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["accountNumber", "balance"],
                  properties: {
                    accountNumber: { type: "integer", example: 1001 },
                    balance: { type: "number", example: 150.5 },
                  },
                },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/api/banco/conta/transferencia": {
      put: {
        tags: ["Contas"],
        summary: "Transfere um valor entre duas contas",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["from", "to", "amount"],
                properties: {
                  from: { type: "integer", example: 1001 },
                  to: { type: "integer", example: 1002 },
                  amount: { type: "number", example: 50 },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Contas de origem e destino após a transferência.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["from", "to"],
                  properties: {
                    from: { $ref: "#/components/schemas/Account" },
                    to: { $ref: "#/components/schemas/Account" },
                  },
                },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/api/banco/conta/rendimento": {
      put: {
        tags: ["Contas"],
        summary: "Aplica rendimento de juros a uma conta poupança",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["accountNumber", "interestRate"],
                properties: {
                  accountNumber: { type: "integer", example: 1001 },
                  interestRate: {
                    type: "number",
                    example: 1.5,
                    description:
                      "Taxa de juros em porcentagem (ex.: 1.5 = 1,5%).",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Conta atualizada após aplicação do rendimento.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Account" },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
    },
  },
  components: {
    parameters: {
      AccountId: {
        name: "id",
        in: "path",
        required: true,
        description: "Número da conta.",
        schema: { type: "integer" },
        example: 1001,
      },
    },
    requestBodies: {
      Amount: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["amount"],
              properties: {
                amount: { type: "number", example: 50 },
              },
            },
          },
        },
      },
    },
    responses: {
      BadRequest: {
        description: "Dados inválidos.",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
          },
        },
      },
      NotFound: {
        description: "Conta não encontrada.",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
          },
        },
      },
    },
    schemas: {
      Account: {
        type: "object",
        required: ["accountNumber", "balance", "type"],
        properties: {
          accountNumber: { type: "integer", example: 1001 },
          balance: { type: "number", example: 100 },
          type: {
            type: "string",
            enum: ["base", "savings", "bonus"],
            example: "base",
          },
          score: {
            type: "integer",
            example: 0,
            description:
              "Pontuação de bônus. Presente apenas quando type é 'bonus'.",
          },
        },
      },
      ErrorResponse: {
        type: "object",
        required: ["error"],
        properties: {
          error: { type: "string", example: "Conta 1001 não encontrada" },
        },
      },
    },
  },
};
