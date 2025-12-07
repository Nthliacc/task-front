# Gerenciador de Tarefas – Frontend

Frontend desenvolvido em **Angular**, consumindo a API do backend Spring Boot.  
Interface responsiva com Bootstrap.

---

## 🚀 Tecnologias Utilizadas

- Angular 17+
- TypeScript
- Bootstrap
- RxJS
- Angular CLI

---

## 📁 Estrutura do Projeto

````

src/
├── app/
│     ├── components/
│     ├── services/
│     ├── models/
│     └── pages/
└── assets/

```

---

## ⚙️ Configuração da API

No arquivo:

```

src/environments/environment.ts

````

defina o backend:

```ts
export const environment = {
  apiUrl: 'http://localhost:8080'
};
````

Ao publicar no Vercel por exemplo, use:

```
apiUrl: 'https://seu-backend.cloud.com'
```

---

## ▶️ Como Rodar Localmente

### 1. Instalar dependências

```bash
npm install
```

### 2. Rodar o servidor Angular

```bash
ng serve --open
```

A interface abrirá em:
👉 **[http://localhost:4200](http://localhost:4200)**

---

## 📦 Build para Produção

```bash
ng build
```

Os arquivos ficam em:

```
dist/nome-projeto/
```

---

## 🌐 Deploy em Cloud

### Recomendado:

* **Vercel**
* Netlify
* GitHub Pages
* Firebase Hosting

### Deploy na Vercel (mais simples)

1. Faça login em [https://vercel.com](https://vercel.com)
2. Importe o repositório do frontend
3. Confirme o build command:

   ```
   ng build
   ```
4. Deploy automático a cada push

---

## 📄 Licença

Projeto aberto para estudos e melhorias.
