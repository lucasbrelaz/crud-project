# CrudProject

O CrudProject é um app de gerenciamento simples de usuários utilizando Angular 18 e Angular Material.

---

## 🛠️ Instalação e Execução

Para rodar o projeto localmente, siga os passos abaixo:

### 1. Clonar o repositório

```bash
git clone https://github.com/lucasbrelaz/crud-project.git
cd crud-project
```

### 2. Instalar as dependências

Certifique-se de estar usando o Node.js (v18 ou superior). A versão que utilizei foi a 22.12.0.

```bash
npm install
```

### 3. Iniciar a API (Backend Fake)

O projeto utiliza `json-server` para simular as operações de CRUD. É necessário rodar o backend em um terminal separado:

```bash
npm run backend
```

A API estará disponível em http://localhost:3000.

### 4. Iniciar o Frontend

Em outro terminal, execute:

```bash
npm start
```

A aplicação abrirá automaticamente no seu navegador padrão em http://localhost:4200.

---

## 🧪 Testes e Build

Testes Unitários: Execute `ng test` para rodar os testes via Karma.
Build: Execute ng build para gerar os artefatos de produção na pasta `dist/`.

---

## 🧠 Decisões Técnicas e Arquitetura

1. **Angular Signals**
   Utilizei **Signals** para o gerenciamento de estado por ser o novo padrão de reatividade do Angular. O uso do `toSignal` permitiu tratar fluxos assíncronos (como busca e paginação) de forma eficiente, eliminando a necessidade de subscrições manuais (`.subscribe`) e prevenindo vazamentos de memória.

2. **Programação Reativa com RxJS**
   Implementei os operadores `switchMap` e `debounceTime` no fluxo de busca. Isso otimiza o tráfego de rede, garantindo que a API só seja consultada após o usuário pausar a digitação, evitando requisições desnecessárias e disparos excessivos.

3. **Tipagem Estrita**
   Prezei pelo uso máximo do **TypeScript**, evitando o tipo `any`. Todos os objetos e fluxos de dados estão devidamente tipados para garantir segurança, facilitar o refactoring e aumentar a previsibilidade do código.

4. **Padrões de Nomenclatura**
   Utilizo o prefixo `I` para Interfaces e `E` para Enums. Essa prática melhora a escaneabilidade do código e a eficiência do _autocomplete_ da IDE em projetos que tendem a crescer em complexidade.

5. **UI/UX e Tematização**
   Utilizei um tema baseado na identidade visual (tons de verde) e desenvolvi um serviço de **Dark Mode** para permitir a troca dinâmica de temas, respeitando a preferência do usuário e acessibilidade.

6. **Versão do Angular**
   Optei pela **versão 18** por ser a versão com a qual atuo hoje, garantindo estabilidade e domínio das funcionalidades implementadas.

7. **Persistência Fake com JSON Server**
   Escolhi a versão `^0.17.0` do `json-server` especificamente para evitar bugs conhecidos de filtragem presentes em versões mais recentes, garantindo que a busca e a paginação funcionem conforme o esperado.

8. **Qualidade de Código (Lint e Commits)**
   - **Husky & Lint-staged:** Configurados para rodar o ESLint antes de cada commit, garantindo que nenhum código fora dos padrões suba para o repositório.
   - **Commitzen (cz):** Adicionado via `npm run commit` para padronizar as mensagens de commit seguindo as normas de Conventional Commits.

9. **Formatação Automática**
   Configuração do **Prettier** junto ao plugin `prettier-plugin-organize-imports`. Isso mantém o estilo de código consistente e garante que imports desnecessários sejam removidos automaticamente.

10. **Simulação de Latência**
    Adicionei um **delay proposital** no serviço de usuário para simular o comportamento de uma API real em rede. O objetivo é demonstrar o tratamento visual de estados de _loading_, garantindo que o usuário tenha feedback visual durante o processamento de dados.

11. **Feedback e Tratamento de Estados (Empty States & SnackBar)**
    - Desenvolvi um componente reutilizável de **Empty State** para tratar cenários onde não há dados disponíveis ou quando uma busca não retorna resultados. Isso garante que o usuário nunca fique sem contexto sobre o que está acontecendo na tela.
    - Além disso, utilizei o **MatSnackBar** para fornecer feedbacks instantâneos e claros em operações de sucesso ou erro.
