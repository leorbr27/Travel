# Travel Intelligence

Aplicação mobile-first para pesquisar viagens, comparar passagens e hospedagens e organizar custos por pessoa e grupo. A interface atual mantém a pesquisa própria e incorpora recursos de planejamento inspirados na auditoria do TripNexus, sem copiar código de um repositório sem licença publicada.

## Stack
- Interface: HTML, CSS e JavaScript, hospedada na Vercel.
- API de pesquisa: Vercel Functions + OpenAI Responses API com web search.
- Persistência: Neon Postgres (travel_intelligence).
- Origem inicial: Vitória (VIX), Brasil.
- Destino em branco: pesquisa aberta na América do Sul.
- Orçamento inicial: R$ 5.000 por pessoa.

## Recursos
- Pesquisa de voos e hospedagens na web para datas informadas.
- Comparação de custo total por pessoa e grupo, priorizando custo-benefício.
- Preferência por VIX, com comparação de aeroportos alternativos quando a economia justificar.
- Histórico persistente das pesquisas concluídas no Neon.
- Estruturas de banco preparadas para alertas e observações de preços.

## Configuração da Vercel
O projeto já está conectado à Vercel. Configure estas variáveis secretas em Project → Settings → Environment Variables e faça um novo deploy:
- OPENAI_API_KEY: chave da API OpenAI, necessária para pesquisar na web.
- DATABASE_URL: connection string do projeto Neon travel-intelligence, banco travel_intelligence, branch production. Use a conexão pooled e marque como Encrypted.

Não coloque chaves no HTML, JavaScript do navegador, commits ou arquivos públicos. A conexão Neon não deve ser exposta no cliente.

## Privacidade
A proteção SSO da Vercel está habilitada no projeto. Mantenha a proteção ativa e não associe um domínio personalizado sem antes configurar um controle de acesso equivalente, pois a proteção SSO atual não cobre domínios personalizados.

## Limites importantes
- A pesquisa web não é inventário transacional das companhias aéreas ou hotéis. Preços e disponibilidade devem ser confirmados no fornecedor.
- O sistema não realiza reservas nem pagamentos.
- O histórico só será persistido depois de configurar DATABASE_URL na Vercel.
- As tabelas de alertas e observações já existem no Neon, mas o monitoramento automático e as notificações ainda precisam de uma fonte de preços autorizada e de um agendador configurado.
- Não se deve apresentar estimativas como cotações em tempo real.

## Banco de dados
O projeto Neon green-dew-79154058 (região AWS us-east-2) já recebeu as tabelas trip_searches, price_alerts e price_observations. O esquema reproduzível está em db/schema.sql.

## Desenvolvimento local
Execute vercel dev e configure OPENAI_API_KEY e DATABASE_URL no ambiente local ou em .env.local (nunca faça commit desse arquivo).
