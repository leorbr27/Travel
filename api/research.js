function send(res,status,body){res.status(status).setHeader("Content-Type","application/json; charset=utf-8");res.setHeader("Cache-Control","no-store");return res.end(JSON.stringify(body))}
function validDate(v){return typeof v==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(v)&&!Number.isNaN(Date.parse(v))}
module.exports=async function handler(req,res){
 if(req.method!=="POST"){res.setHeader("Allow","POST");return send(res,405,{error:"Método não permitido."})}
 const b=req.body||{},origin=String(b.origin||"").trim().slice(0,120),destination=String(b.destination||"").trim().slice(0,160),departure=b.departure,returnDate=b.return,travelers=Number(b.travelers),budget=Number(b.budget);
 if(!origin||!validDate(departure)||!validDate(returnDate)||returnDate<=departure||!Number.isInteger(travelers)||travelers<1||travelers>6||!Number.isFinite(budget)||budget<1)return send(res,400,{error:"Confira origem, datas, viajantes e orçamento."});
 const places=destination?[destination]:["Buenos Aires, Argentina","Santiago, Chile","Montevidéu, Uruguai","Lima, Peru","Bogotá, Colômbia","Assunção, Paraguai"];
 const sources=[],lines=["CENTRAL DE PESQUISA DE VIAGENS","","A pesquisa abre resultados atuais diretamente nos fornecedores. Não inventamos tarifas nem disponibilidade.","","Origem: "+origin,"Período: "+departure+" a "+returnDate,"Viajantes: "+travelers,"Orçamento: R$ "+budget.toLocaleString("pt-BR")+" por pessoa (R$ "+(budget*travelers).toLocaleString("pt-BR")+" grupo)","","COMPARE PREÇOS FINAIS: inclua bagagem, taxas, escalas, duração, hospedagem, cancelamento e deslocamento até aeroportos alternativos."];
 for(const place of places){
  const fq="Flights from "+origin+" to "+place+" on "+departure+" return "+returnDate;
  const hq="Hotels in "+place+" "+departure+" to "+returnDate+" "+travelers+" guests";
  const flights="https://www.google.com/travel/flights?q="+encodeURIComponent(fq);
  const hotels="https://www.google.com/travel/hotels?q="+encodeURIComponent(hq)+"&checkin="+departure+"&checkout="+returnDate+"&adults="+travelers;
  const booking=new URL("https://www.booking.com/searchresults.pt-br.html");booking.searchParams.set("ss",place);booking.searchParams.set("checkin",departure);booking.searchParams.set("checkout",returnDate);booking.searchParams.set("group_adults",String(travelers));
  lines.push("",place,"Voos — Google Flights: "+flights,"Hotéis — Google Hotels: "+hotels,"Hotéis — Booking.com: "+booking.toString());
  sources.push({title:"Voos · "+place+" · Google Flights",url:flights},{title:"Hotéis · "+place+" · Google Hotels",url:hotels},{title:"Hotéis · "+place+" · Booking.com",url:booking.toString()});
 }
 lines.push("","Atenção: preços e disponibilidade são confirmados nos sites dos fornecedores. Esta aplicação não faz reservas nem pagamentos.");
 return send(res,200,{mode:"provider_search",summary:"Pesquisas prontas para "+places.length+" destino(s), "+travelers+" viajante(s). Orçamento: R$ "+budget.toLocaleString("pt-BR")+" por pessoa.",report:lines.join("\n"),sources});
};