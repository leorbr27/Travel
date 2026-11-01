# Travel Intelligence

Aplicação mobile-first para pesquisar viagens, comparar passagens e hospedagens e organizar custos por pessoa e grupo.

## Estrutura
- `index.html`, `styles.css`, `app.js`: interface.
- `api/research.js`: endpoint serverless usando OpenAI Responses API e ferramenta `web_search`.
- `vercel.json`: configuração da função.

## Ativação
1. Importe este repositório na Vercel.
2. Em **Settings → Environment Variables**, adicione `OPENAI_API_KEY` como variável secreta para Production (e Preview, se desejar).
3. Opcionalmente, configure `OPENAI_MODEL`. O padrão inicial é `gpt-6-astra`; escolha um modelo habilitado no seu projeto OpenAI que aceite `web_search`.
4. Faça um novo deploy.

A chave é lida apenas no servidor e nunca enviada ao navegador. A OpenAI API tem cobrança separada da assinatura ChatGPT.

## Limites da primeira versão
- Pesquisa web localiza e compara ofertas publicadas, mas não é conexão transacional com inventários privados de companhias aéreas e hotéis.
- Preços e disponibilidade devem ser confirmados com o fornecedor.
- Nenhuma reserva ou pagamento é realizado.
- Monitoramento automático, histórico de preços, login e alertas ainda não estão ativados.
- Integrações diretas com APIs de fornecedores serão adicionadas após acesso e credenciais.

## Desenvolvimento local
Instale a Vercel CLI e execute `vercel dev`. Configure `OPENAI_API_KEY` no ambiente ou em `.env.local` (nunca faça commit desse arquivo).
