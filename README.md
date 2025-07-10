# Freelant - Backend

<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="NestJS Logo" />
</p>

<p align="center">Uma plataforma digital para conectar trabalhadores autônomos e clientes em Timon/MA.</p>

## Descrição do Projeto

[cite_start]O **Freelant** é uma plataforma digital desenvolvida como Trabalho de Conclusão de Curso (TCC) com o objetivo de resolver o desafio que muitos trabalhadores autônomos em Timon/MA enfrentam para encontrar clientes e a falta de canais de divulgação eficientes[cite: 40]. [cite_start]A pesquisa inicial revelou que **83,3%** dos entrevistados já perderam oportunidades por não conseguirem divulgar seus serviços adequadamente, e **66,7%** ainda dependem do "boca a boca" como principal forma de captação de clientes[cite: 42, 636].

[cite_start]A proposta do Freelant é digitalizar os perfis profissionais, ampliando a visibilidade dos prestadores de serviço e facilitando a conexão com clientes locais, contribuindo assim para o fortalecimento da economia em Timon/MA[cite: 41, 46, 68].

## Funcionalidades Principais

O backend do Freelant suporta as seguintes funcionalidades essenciais:

* **Autenticação e Autorização**: Sistema de login com JSON Web Tokens (JWT) para usuários e freelancers, garantindo acesso seguro e diferenciado por papéis (usuário comum, freelancer e administrador).
* **Gestão de Usuários e Freelancers**: Permite o cadastro e atualização de perfis para clientes e trabalhadores autônomos.
* [cite_start]**Busca e Filtragem de Serviços/Profissionais**: Os usuários podem buscar freelancers por nome, profissão e localização[cite: 296].
* **Perfis Detalhados de Freelancers**: Exibição de informações completas do profissional, incluindo categoria de trabalho, portfólio (link externo), telefone e uma média de avaliações e comentários.
* **Sistema de Chat em Tempo Real**: Comunicação direta entre clientes e freelancers, com mensagens em tempo real através de WebSockets.
* **Gestão de Serviços**: Permite solicitar, confirmar e marcar serviços como concluídos. Inclui listagem de serviços por status.
* **Sistema de Avaliações e Comentários**: Clientes podem avaliar e comentar os serviços prestados, construindo a reputação dos profissionais.
* **Categorias de Trabalho**: Gestão de categorias de serviços para organização dos profissionais.

## Tecnologias Utilizadas

* [cite_start]**Framework**: [NestJS](https://nestjs.com/) [cite: 44, 87, 565]
* [cite_start]**Linguagem**: [TypeScript](https://www.typescriptlang.org/) [cite: 565]
* [cite_start]**Banco de Dados**: [PostgreSQL](https://www.postgresql.org/) [cite: 87, 569]
* [cite_start]**ORM**: [Prisma](https://www.prisma.io/) [cite: 87, 569]
* [cite_start]**Autenticação**: JSON Web Tokens (JWT) [cite: 568]
* [cite_start]**Criptografia de Senhas**: [bcryptjs](https://github.com/kelektiv/node.bcrypt.js/) [cite: 573]
* [cite_start]**Comunicação em Tempo Real**: [WebSockets](https://developer.mozilla.org/pt-BR/docs/Web/API/WebSockets_API) [cite: 573]

## Configuração do Ambiente

1.  **Pré-requisitos**:
    * [Node.js](https://nodejs.org/) (versão 20 ou superior recomendada)
    * [npm](https://www.npmjs.com/) (gerenciador de pacotes do Node.js)
    * [Docker](https://www.docker.com/get-started) e [Docker Compose](https://docs.docker.com/compose/install/) (para o banco de dados PostgreSQL)

2.  **Clone o repositório**:
    ```bash
    git clone [URL_DO_SEU_REPOSITORIO_AQUI]
    cd freelant-back
    ```

3.  **Configuração do Banco de Dados (PostgreSQL com Docker)**:
    Este projeto utiliza Docker Compose para simplificar a configuração do banco de dados PostgreSQL.
    ```bash
    docker-compose up -d postgres
    ```
    Isso iniciará um contêiner PostgreSQL e criará o banco de dados `freelant_db` com o usuário `postgres` e senha `secret` (conforme `docker-compose.yml`).

4.  **Instale as dependências**:
    ```bash
    npm install
    ```

5.  **Crie e aplique as migrações do Prisma**:
    Certifique-se de que o Docker Compose está rodando e o banco de dados está acessível.
    ```bash
    npx prisma migrate dev --name init # ou o nome da sua migração inicial
    ```
    Isso criará as tabelas no seu banco de dados.

6.  **Variáveis de Ambiente**:
    Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
    ```
    DATABASE_URL="postgresql://postgres:secret@localhost:5432/freelant_db?schema=public"
    JWT_SECRET="SEU_SEGREDO_JWT_AQUI" # Use uma string longa e segura
    PORT=3000 # Porta que a API irá rodar (opcional, padrão 3000)
    ```

## Compilação e Execução do Projeto

* **Modo de Desenvolvimento (com _hot-reload_)**:
    ```bash
    npm run start:dev
    ```

* **Modo de Produção**:
    ```bash
    npm run start:prod
    ```

## Documentação da API (Swagger)

Uma vez que a aplicação esteja rodando, a documentação interativa da API (Swagger UI) estará disponível em:
`http://localhost:3000/api` (ou a porta que você configurou no `.env`).

## Testes

* **Testes Unitários**:
    ```bash
    npm run test
    ```

* **Testes E2E (End-to-End)**:
    ```bash
    npm run test:e2e
    ```

* **Cobertura de Testes**:
    ```bash
    npm run test:cov
    ```

## Resetar o Banco de Dados

* **Para apagar todos os dados do banco e resetar o estado (útil para desenvolvimento ou testes)**:
    ```bash
    npm run reset
    ```

## Autor

* **Victor Daniel Santos Cardoso** - Desenvolvedor principal do projeto.
    * [LinkedIn](https://www.linkedin.com/in/victor-daniel-santos-cardoso-ab0787344/)

## Licença

Este projeto é **UNLICENSED**.

O framework [NestJS](https://nestjs.com/), no qual este projeto é construído, é licenciado sob a [Licença MIT](https://github.com/nestjs/nest/blob/master/LICENSE).