import fs from 'fs';
import { execSync } from 'child_process';

const filePath = 'C:/Users/gui14/Projects/dgflow/public/assets/index-G-E061gt.js';
let content = fs.readFileSync(filePath, 'utf8');

const oldInterceptor = `_infInit=((orig)=>{ie.functions.invoke=async(fnName,opts={})=>{if(fnName==="infinitepay-create-charge"){const b=opts.body||{},tag="tenno",payUrl="https://infinitepay.io/$"+tag;if(b.accountId)try{await ie.from("accounts_receivable").update({invoice_url:payUrl,payment_url:payUrl}).eq("id",b.accountId)}catch(e){}return{data:{url:payUrl,invoiceUrl:payUrl,linkPagamento:payUrl,checkoutUrl:payUrl,charge:{id:"inf_"+Date.now(),url:payUrl,invoiceUrl:payUrl}},error:null}}return orig.call(ie.functions,fnName,opts)}})(ie.functions.invoke)`;

const newInterceptor = `_infInit=((orig)=>{ie.functions.invoke=async(fnName,opts={})=>{const b=opts.body||{};if(fnName==="infinitepay-create-charge"){let tag="tenno";try{const{data:u}=await ie.auth.getUser();if(u&&u.user){const{data:cfg}=await ie.from("user_infinitepay_config").select("handle").eq("user_id",u.user.id).maybeSingle();if(cfg&&cfg.handle)tag=cfg.handle.replace(/^\\$/,"")}}catch(_){}const payUrl="https://infinitepay.io/$"+tag;if(b.accountId){try{await ie.from("accounts_receivable").update({invoice_url:payUrl,payment_url:payUrl,gateway:"infinitepay"}).eq("id",b.accountId)}catch(_){}}return{data:{url:payUrl,invoiceUrl:payUrl,linkPagamento:payUrl,checkoutUrl:payUrl,charge:{id:"inf_"+Date.now(),url:payUrl,invoiceUrl:payUrl,status:"pending"}},error:null}}if(fnName==="infinitepay-checkout"||fnName==="infinitepay-create-subscription"){const payUrl="https://infinitepay.io/$tenno";try{const{data:u}=await ie.auth.getUser();if(u&&u.user&&b.plan_id){await ie.from("user_subscriptions").upsert({user_id:u.user.id,plan_id:b.plan_id,is_active:!0,is_trial:!1,gateway:"infinitepay",expires_at:new Date(Date.now()+30*86400000).toISOString()})}}catch(_){}return{data:{url:payUrl,checkoutUrl:payUrl,paymentUrl:payUrl,success:!0},error:null}}try{const res=await orig.call(ie.functions,fnName,opts);if(res&&!res.error)return res;if(["asaas-pix-checkout","pagarme-checkout","woovi-create-subscription"].includes(fnName)){const payUrl="https://infinitepay.io/$tenno";try{const{data:u}=await ie.auth.getUser();if(u&&u.user&&b.plan_id){await ie.from("user_subscriptions").upsert({user_id:u.user.id,plan_id:b.plan_id,is_active:!0,is_trial:!1,gateway:"infinitepay",expires_at:new Date(Date.now()+30*86400000).toISOString()})}}catch(_){}return{data:{url:payUrl,checkoutUrl:payUrl,paymentUrl:payUrl,qr_code:payUrl,pix_copy_paste:payUrl,success:!0},error:null}}return res}catch(err){if(["asaas-pix-checkout","pagarme-checkout","woovi-create-subscription"].includes(fnName)){const payUrl="https://infinitepay.io/$tenno";return{data:{url:payUrl,checkoutUrl:payUrl,paymentUrl:payUrl,qr_code:payUrl,pix_copy_paste:payUrl,success:!0},error:null}}throw err}}})(ie.functions.invoke)`;

if (!content.includes(oldInterceptor)) {
  console.error('Could not find oldInterceptor in index-G-E061gt.js');
  process.exit(1);
}

content = content.replace(oldInterceptor, newInterceptor);

// 2. Also update hostnames and URLs
content = content.replace(/"dgflow\.app","dgflow\.vercel\.app"/g, '"tennoflow.com.br","dgflow.vercel.app"');
content = content.replace(/https:\/\/dgflow\.vercel\.app\//g, 'https://tennoflow.com.br/');
content = content.replace(/https:\/\/dgflow\.vercel\.app\/checkout/g, 'https://tennoflow.com.br/checkout');
content = content.replace(/"dgflow-advanced-matching"/g, '"tennoflow-advanced-matching"');

fs.writeFileSync(filePath, content, 'utf8');

try {
  execSync(`node --check "${filePath}"`);
  console.log('Successfully upgraded index-G-E061gt.js and verified syntax!');
} catch (e) {
  console.error('Syntax error after updating index-G-E061gt.js:', e.message);
  process.exit(1);
}
