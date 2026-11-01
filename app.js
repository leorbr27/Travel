const form=document.querySelector("#trip-form");
const results=document.querySelector("#results");
const statusEl=document.querySelector("#result-status");
const summaryEl=document.querySelector("#result-summary");
const contentEl=document.querySelector("#result-content");
const sourcesWrap=document.querySelector("#sources");
const sourceList=document.querySelector("#source-list");
const submitButton=form.querySelector('button[type="submit"]');
const historySection=document.querySelector("#history");
const historyList=document.querySelector("#history-list");
const refreshHistoryButton=document.querySelector("#refresh-history");

const today=new Date();
const minDate=new Date(today.getTime()-today.getTimezoneOffset()*60000).toISOString().slice(0,10);
form.elements.departure.min=minDate;
form.elements.return.min=minDate;

form.elements.departure.addEventListener("change",()=>{
  form.elements.return.min=form.elements.departure.value||minDate;
  if(form.elements.return.value&&form.elements.return.value<form.elements.departure.value)form.elements.return.value="";
});

function addTextWithLinks(container,text){
  const re=/(https?:\/\/[^\s)\]]+)/g;
  let last=0;
  for(const match of text.matchAll(re)){
    container.append(document.createTextNode(text.slice(last,match.index)));
    const anchor=document.createElement("a");
    anchor.href=match[0].replace(/[.,;]+$/,"");
    anchor.textContent=anchor.href;
    anchor.target="_blank";
    anchor.rel="noopener noreferrer";
    container.append(anchor);
    last=match.index+match[0].length;
  }
  container.append(document.createTextNode(text.slice(last)));
}

function formatDate(value){
  if(!value)return "";
  const date=new Date(value+"T12:00:00");
  return Number.isNaN(date.getTime())?value:date.toLocaleDateString("pt-BR");
}

async function loadHistory(){
  try{
    const response=await fetch("/api/history",{headers:{"Accept":"application/json"},cache:"no-store"});
    const payload=await response.json();
    if(!response.ok)throw new Error(payload.error||"Histórico indisponível.");
    historyList.replaceChildren();
    if(!payload.items?.length){
      historyList.innerHTML='<p class="history-empty">Suas pesquisas concluídas aparecerão aqui.</p>';
    }else{
      for(const item of payload.items){
        const details=document.createElement("details");
        details.className="history-item";
        const summary=document.createElement("summary");
        const route=document.createElement("strong");
        route.textContent=(item.origin||"Origem")+" → "+(item.destination||"Destino");
        const meta=document.createElement("span");
        meta.textContent=formatDate(item.departure_date)+" a "+formatDate(item.return_date)+" · "+item.travelers+" viajante(s) · "+new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL",maximumFractionDigits:0}).format(Number(item.budget_per_person||0))+"/pessoa";
        summary.append(route,meta);
        const report=document.createElement("pre");
        report.className="history-report";
        report.textContent=item.report||"Relatório não disponível.";
        details.append(summary,report);
        historyList.append(details);
      }
    }
    historySection.hidden=false;
  }catch(error){
    historySection.hidden=false;
    historyList.innerHTML='<p class="history-empty">O histórico persistente será ativado quando DATABASE_URL estiver configurada na Vercel.</p>';
  }
}

async function saveHistory(request,result){
  try{
    const response=await fetch("/api/history",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({request,result})
    });
    if(response.ok)await loadHistory();
  }catch(error){
    console.warn("Não foi possível salvar o histórico:",error.message);
  }
}

refreshHistoryButton?.addEventListener("click",loadHistory);

form.addEventListener("submit",async event=>{
  event.preventDefault();
  if(!form.reportValidity())return;
  const data=Object.fromEntries(new FormData(form).entries());
  if(data.return<data.departure){
    form.elements.return.setCustomValidity("A volta deve ser posterior à ida.");
    form.elements.return.reportValidity();
    form.elements.return.setCustomValidity("");
    return;
  }
  results.hidden=false;
  results.scrollIntoView({behavior:"smooth",block:"start"});
  statusEl.textContent="Pesquisando na web…";
  summaryEl.textContent="O agente está pesquisando voos e hospedagens. Isso pode levar alguns instantes.";
  contentEl.textContent="";
  sourcesWrap.hidden=true;
  sourceList.replaceChildren();
  submitButton.disabled=true;
  submitButton.querySelector("span:first-child").textContent="Pesquisando…";
  try{
    const response=await fetch("/api/research",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(data)
    });
    const payload=await response.json();
    if(!response.ok)throw new Error(payload.error||"Não foi possível concluir a pesquisa.");
    statusEl.textContent="Pesquisa concluída";
    summaryEl.textContent=payload.summary||"Pesquisa realizada na web.";
    addTextWithLinks(contentEl,payload.report||"A pesquisa não retornou relatório legível.");
    for(const source of payload.sources||[]){
      if(!source.url)continue;
      const anchor=document.createElement("a");
      anchor.href=source.url;
      anchor.target="_blank";
      anchor.rel="noopener noreferrer";
      anchor.textContent=source.title||source.url;
      sourceList.append(anchor);
    }
    sourcesWrap.hidden=!sourceList.childElementCount;
    await saveHistory(data,payload);
  }catch(error){
    statusEl.textContent="Pesquisa não concluída";
    summaryEl.textContent="Não foi possível concluir a pesquisa.";
    contentEl.textContent=error.message;
  }finally{
    submitButton.disabled=false;
    submitButton.querySelector("span:first-child").textContent="Pesquisar minha viagem";
  }
});

loadHistory();
