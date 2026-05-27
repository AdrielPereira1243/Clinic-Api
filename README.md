# Clinic API

API REST para gerenciamento de uma clínica odontológica, desenvolvida com Node.js, Express e Prisma.

## Tecnologias

- Node.js
- Express
- Prisma 6
- PostgreSQL (Supabase)

## Funcionalidades

- Cadastro e listagem de pacientes
- Cadastro e listagem de dentistas
- Criação e gerenciamento de agendamentos
- Controle de procedimentos

## Instalação

\```bash
# Clone o repositório
git clone https://github.com/AdrielPereira1243/Clinic-Api.git

# Entre na pasta
cd Clinic-Api

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Preencha as variáveis no arquivo .env

# Crie as tabelas no banco
npx prisma@6 db push

# Inicie o servidor
node index.js
\```

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

\```
DATABASE_URL=""
DIRECT_URL=""
\```

## Rotas

### Pacientes
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /pacientes | Criar paciente |
| GET | /pacientes | Listar pacientes |
| GET | /pacientes/:id | Buscar paciente por ID |

### Dentistas
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /dentistas | Criar dentista |
| GET | /dentistas | Listar dentistas |
| GET | /dentistas/:id | Buscar dentista por ID |

### Agendamentos
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /agendamentos | Criar agendamento |
| GET | /agendamentos | Listar agendamentos |
| GET | /agendamentos/:id | Buscar agendamento por ID |
| PATCH | /agendamentos/:id/cancelar | Cancelar agendamento |

## Autor

Adriel Pereira
