const { neon } = require("@neondatabase/serverless");
function send(res,status,body){res.status(status).setHeader("Content-Type","application/json; charset=utf-8");res.setHeader("Cache-Control","no-store");return res.end(JSON.stringify(body));}
function validDate(v){return typeof v==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(v)&&!Number.isNaN(Date.parse(v));}
module.exports=async function handler(req,res){
  if(!["GET","POST"].includes(req.method)){res.setHeader("Allow","GET, POST");return send(res,405,{error:"Método não permitido."});}
  if(!process.env.DATABASE_URL)return send(res,503,{error:"Banco Neon ainda não conectado. Configure DATABASE_URL como variável criptografada na Vercel."});
  const sql=neon(process.env.DATABASE_URL);
  try{
    if(req.method==="GET"){
      const rows=await sql.query("SELECT id,created_at,origin,destination,departure_date,return_date,travelers,budget_per_person,summary,report,sources FROM public.trip_searches ORDER BY created_at DESC LIMIT 30",[]);
      return send(res,200,{items:rows});
    }
    const body=typeof req.body==="string"?JSON.parse(req.body):req.body||{};
    const request=body.request||{},result=body.result||{};
    const origin=String(request.origin||"").trim().slice(0,120);
    const destination=String(request.destination||"Qualquer destino na América do Sul").trim().slice(0,160);
    const departure=String(request.departure||""),returnDate=String(request.return||"");
    const travelers=Number(request.travelers),budget=Number(request.budget);
    const report=String(result.report||"").slice(0,60000),summary=String(result.summary||"").slice(0,1200);
    const sources=Array.isArray(result.sources)?result.sources.slice(0,50):[];
    if(!origin||!validDate(departure)||!validDate(returnDate)||returnDate<=departure||!Number.isInteger(travelers)||travelers<1||travelers>6||!Number.isFinite(budget)||budget<1||!report)return send(res,400,{error:"Dados da pesquisa incompletos ou inválidos."});
    const saved=await sql.query("INSERT INTO public.trip_searches (origin,destination,departure_date,return_date,travelers,budget_per_person,request,summary,report,sources) VALUES ($1,$2,$3,$4,$5,$6,$7::jsonb,$8,$9,$10::jsonb) RETURNING id,created_at",[origin,destination,departure,returnDate,travelers,budget,JSON.stringify(request),summary,report,JSON.stringify(sources)]);
    return send(res,201,{saved:true,id:saved[0].id,created_at:saved[0].created_at});
  }catch(error){console.error("Travel history error:",error.message);return send(res,500,{error:"Não foi possível acessar o histórico de viagens."});}
};