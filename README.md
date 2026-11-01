# Travel Intelligence

Aplicação mobile-first para organizar pesquisas de viagens, abrir comparações de voos e hospedagens em fornecedores e controlar o orçamento por pessoa e grupo. A implementação utiliza ideias gerais observadas na auditoria do TripNexus, sem copiar código de um repositório sem licença publicada.

## O que funciona
- Formulário de origem, destino, datas, viajantes, teto por pessoa, flexibilidade de aeroporto e prioridade.
- Origem inicial: Vitória (VIX), Brasil.
- Destino em branco: prepara pesquisas para seis destinos da América do Sul: Buenos Aires, Santiago, Montevidéu, Lima, Bogotá e Assunção.
- Pesquisas diretas em Google Flights, Google Hotels e Booking.com, preenchidas com destino, datas e quantidade de viajantes.
- Resumo do orçamento individual e total do grupo.
- Relatório com links clicáveis e orientações para comparar preço final, bagagem, taxas, escalas, duração, localização e cancelamento.
- Histórico local no navegador, sem exigir conta ou chave de API.
- Histórico remoto opcional no Neon quando DATABASE_URL estiver configurada no servidor.

## Arquitetura
- Interface: HTML, CSS e JavaScript.
- Hospedagem: Vercel, ligada ao repositório GitHub.
- API de pesquisa: Vercel Function que constrói pesquisas de fornecedores sem depender de credenciais pagas.
- Banco opcional: Neon Postgres, database travel_intelligence.
- Node.js: 20 ou superior.

## Uso
1. Abra o site e informe origem, destino (ou deixe em branco para comparar destinos sul-americanos), ida, volta, viajantes e orçamento por pessoa.
2. Toque em “Pesquisar minha viagem”.
3. Abra as pesquisas de voos e hotéis nos fornecedores listados.
4. Compare o custo final para todo o grupo, não apenas o preço anunciado por trecho ou por diária.
5. Confirme as regras e a disponibilidade diretamente no fornecedor antes de comprar.

## Precisão e limitações
- O sistema não coleta nem raspa inventário de companhias aéreas ou hotéis e não finge ter cotações próprias em tempo real. Ele prepara pesquisas com os parâmetros informados e encaminha para os resultados dos fornecedores.
- Os preços, disponibilidade, bagagem, impostos e condições finais são definidos pelos fornecedores e podem mudar.
- O comparador não faz reservas, pagamentos ou emissão de bilhetes.
- A prioridade e o orçamento orientam a comparação do usuário; a aplicação não declara automaticamente que uma tarifa está dentro do orçamento sem conhecer todos os encargos.
- Alertas automáticos de preço e notificações não estão ativos. As tabelas de alertas e observações no Neon são apenas a estrutura futura, não um serviço de monitoramento.
- Sem DATABASE_URL, o histórico fica salvo localmente no navegador usado. Limpar os dados do navegador pode apagar esse histórico.

## Variáveis opcionais
A aplicação funciona sem variáveis de ambiente. Para habilitar histórico sincronizado entre dispositivos, configure DATABASE_URL como variável criptografada no projeto Vercel, usando a connection string pooled do Neon. Nunca coloque essa conexão no frontend ou no GitHub.

## Segurança
A proteção SSO da Vercel permanece habilitada. Não associe domínio personalizado sem antes configurar controle de acesso equivalente, pois a proteção SSO atual não cobre domínios personalizados.

## Banco
Projeto Neon: green-dew-79154058, região AWS us-east-2, database travel_intelligence, branch production. As tabelas trip_searches, price_alerts e price_observations já existem. O esquema está documentado em db/schema.sql.

## Desenvolvimento local
Use Node.js 20+ e execute `vercel dev`. DATABASE_URL é opcional; sem ela, o histórico remoto fica desabilitado e a interface utiliza o histórico local.
