# Delivery Tracker App 📦

Aplicativo híbrido desenvolvido com **Ionic + Angular**, focado no **acompanhamento de entregas em tempo real**. Utiliza `HttpClient` para requisições HTTP, integração com APIs de rastreamento como **Correios**, e exibe o progresso visual da entrega com base nas etapas do pedido.

## 🚀 Funcionalidades

- 🔐 **Autenticação de usuários** com fluxo de login completo.
- 📦 **Listagem de pedidos** associados ao usuário logado.
- 📍 **Gráfico de status de entrega**:
  - Separação
  - A caminho
  - Em rota de entrega
  - Entregue
- 📡 **Integração com API dos Correios** para rastreamento de código de objeto.
- 🔄 Atualizações automáticas com base no status retornado pela API.
- 🧪 Arquitetura preparada para testes e escalabilidade.

## 🧩 Tecnologias Utilizadas

- [Ionic Framework](https://ionicframework.com/)
- [Angular](https://angular.io/)
- [RxJS](https://rxjs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [API Correios](https://www.correios.com.br/)

## 📲 Instalação

```bash
npm install
ionic serve
