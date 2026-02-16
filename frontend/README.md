# Frontend (React + Vite)

Frontend do projeto Catalojogo em React com TypeScript, construindo os assets com Vite e servindo com Nginx.

## Desenvolvimento local

1. Instale dependencias:

```bash
npm install
```

2. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

A aplicacao sobe em `http://localhost:4200`.

## API

- Em desenvolvimento, o Vite faz proxy de `/api` para `http://localhost:8080`.
- Em Docker, o Nginx faz proxy de `/api` para o servico `app:8080`.

## Build

```bash
npm run build
```

Os arquivos finais ficam em `dist/`.
