import { useState, useMemo, useEffect } from 'react';
import {
  Package, ShoppingCart, AlertTriangle, Plus, Minus, Trash2,
  LayoutDashboard, Clock, UtensilsCrossed, CheckCircle2,
  History, RotateCcw, Edit3, Settings, Calendar, PlusCircle, Globe, Save
} from 'lucide-react';

const T = {
  es: {
    title:'K-Pollo Socorro', subtitle:'Panel Administrativo',
    saving:'Guardando...', saved:'Datos guardados ✓', loading:'Cargando datos...',
    nav:{dashboard:'Inicio',inventory:'Stock',sales:'Ventas',combos:'Combos',history:'Registro',settings:'Ajustes'},
    dashboard:{criticalStock:'Stock Crítico',expiringSoon:'Próx. a Vencer',salesToday:'Ventas Hoy',
      avgDay:'Promedio/día',daysLeft:'Días de Stock',chaosIndex:'Índice de Caos',
      stockAlerts:'Alertas de Stock',expiryAlerts:'Vencimientos Cercanos',
      allGood:'Todo está abastecido.',noExpiry:'Sin productos por caducar.',
      left:'Quedan',expires:'Caduca el',orderNow:'¡Realiza tu pedido ahora!',
      orderMsg:(a,d,l)=>`Con ${a} uds/día de promedio, el stock se agota en ~${d} días — menos que los ${l} días de anticipación.`,
      reorderTitle:'📦 Alerta de Reabastecimiento',
    },
    inventory:{title:'Control de Stock',add:'Agregar Insumo',name:'Nombre Comercial',
      stockInit:'Stock Inicial',minAlert:'Alerta Mínimo',unit:'Unidad',expiry:'Fecha Caducidad',
      noDate:'No definida',save:'Guardar Insumo',close:'Cerrar',itemCard:'Ficha de Insumo',management:'Gestión'},
    combos:{new:'Nuevo Combo',name:'Nombre del Combo',price:'Precio Total',
      ingredients:'Insumos que descontará al vender',save:'Guardar Combo',close:'Cerrar',design:'Diseño de Combo'},
    sales:{confirm:'Confirmar',close:'Cerrar',total:'Total a cobrar',noStock:'¡Falta stock para completar la orden!'},
    history:{empty:'Sin registros de ventas',void:'Anular Venta',voided:'Anulada',
      reason:'Motivo de anulación',reasons:['Error de digitación','Pedido cancelado','Cambio de producto'],
      clearAll:'Borrar Historial',motive:'Motivo'},
    settings:{title:'Preferencias del Sistema',stockAlerts:'Alertas de Stock',
      stockDesc:'Avisar cuando un producto baje del mínimo',expiryAlerts:'Alertas de Caducidad',
      expiryDesc:'Notificar antes de vencer',daysBefore:'Días previos de aviso',
      anticipation:'Días de anticipación pedido',danger:'Zona de Peligro',clearSales:'Borrar base de datos de ventas',lang:'Idioma'},
    notif:{saved:'Producto guardado',comboSaved:'Combo actualizado',sold:'Venta registrada',voided:'Venta anulada',cleared:'Historial borrado'},
  },
  en: {
    title:'K-Pollo Socorro',subtitle:'Admin Panel',
    saving:'Saving...', saved:'Data saved ✓', loading:'Loading data...',
    nav:{dashboard:'Home',inventory:'Stock',sales:'Sales',combos:'Combos',history:'History',settings:'Settings'},
    dashboard:{criticalStock:'Critical Stock',expiringSoon:'Expiring Soon',salesToday:'Sales Today',
      avgDay:'Avg/day',daysLeft:'Days of Stock',chaosIndex:'Chaos Index',
      stockAlerts:'Stock Alerts',expiryAlerts:'Upcoming Expiry',
      allGood:'All items are stocked.',noExpiry:'No products expiring soon.',
      left:'Remaining',expires:'Expires on',orderNow:'Place your order now!',
      orderMsg:(a,d,l)=>`At ${a} units/day, stock runs out in ~${d} days — less than the ${l}-day lead time.`,
      reorderTitle:'📦 Restock Alert',
    },
    inventory:{title:'Stock Control',add:'Add Item',name:'Product Name',
      stockInit:'Initial Stock',minAlert:'Min Alert',unit:'Unit',expiry:'Expiry Date',
      noDate:'Not defined',save:'Save Item',close:'Close',itemCard:'Item Details',management:'Actions'},
    combos:{new:'New Combo',name:'Combo Name',price:'Total Price',
      ingredients:'Items deducted on sale',save:'Save Combo',close:'Close',design:'Combo Design'},
    sales:{confirm:'Confirm',close:'Close',total:'Total to charge',noStock:'Not enough stock!'},
    history:{empty:'No sales records',void:'Void Sale',voided:'Voided',
      reason:'Reason for voiding',reasons:['Typing error','Order cancelled','Product change'],
      clearAll:'Clear History',motive:'Reason'},
    settings:{title:'System Preferences',stockAlerts:'Stock Alerts',
      stockDesc:'Notify when product drops below minimum',expiryAlerts:'Expiry Alerts',
      expiryDesc:'Notify before expiry',daysBefore:'Days in advance',
      anticipation:'Reorder lead time (days)',danger:'Danger Zone',clearSales:'Delete sales database',lang:'Language'},
    notif:{saved:'Item saved',comboSaved:'Combo updated',sold:'Sale recorded',voided:'Sale voided',cleared:'History cleared'},
  },
  ko: {
    title:'K-치킨 소코로',subtitle:'관리자 패널',
    saving:'저장 중...', saved:'저장 완료 ✓', loading:'데이터 로딩 중...',
    nav:{dashboard:'홈',inventory:'재고',sales:'판매',combos:'콤보',history:'기록',settings:'설정'},
    dashboard:{criticalStock:'위험 재고',expiringSoon:'곧 만료',salesToday:'오늘 판매',
      avgDay:'일평균',daysLeft:'재고 일수',chaosIndex:'혼돈 지수',
      stockAlerts:'재고 경고',expiryAlerts:'만료 임박',
      allGood:'재고가 충분합니다.',noExpiry:'만료 임박 제품 없음.',
      left:'남은 수량',expires:'만료일',orderNow:'지금 주문하세요!',
      orderMsg:(a,d,l)=>`일평균 ${a}개 판매 시, ~${d}일 후 재고 소진 — 리드타임 ${l}일 미만.`,
      reorderTitle:'📦 재입고 알림',
    },
    inventory:{title:'재고 관리',add:'품목 추가',name:'제품명',
      stockInit:'초기 재고',minAlert:'최소 경고',unit:'단위',expiry:'유통기한',
      noDate:'미정',save:'저장',close:'닫기',itemCard:'품목 정보',management:'관리'},
    combos:{new:'새 콤보',name:'콤보 이름',price:'총 가격',
      ingredients:'판매 시 차감 항목',save:'콤보 저장',close:'닫기',design:'콤보 디자인'},
    sales:{confirm:'확인',close:'닫기',total:'청구 금액',noStock:'재고가 부족합니다!'},
    history:{empty:'판매 기록 없음',void:'판매 취소',voided:'취소됨',
      reason:'취소 사유',reasons:['입력 오류','주문 취소','제품 변경'],
      clearAll:'기록 삭제',motive:'사유'},
    settings:{title:'시스템 설정',stockAlerts:'재고 알림',
      stockDesc:'재고가 최소치 이하로 떨어지면 알림',expiryAlerts:'유통기한 알림',
      expiryDesc:'만료 전 알림',daysBefore:'사전 알림 일수',
      anticipation:'주문 리드타임 (일)',danger:'위험 구역',clearSales:'판매 데이터 삭제',lang:'언어'},
    notif:{saved:'저장 완료',comboSaved:'콤보 업데이트',sold:'판매 등록',voided:'판매 취소',cleared:'기록 삭제'},
  },
};
const LANG_LABELS={es:'🇨🇴 Español',en:'🇺🇸 English',ko:'🇰🇷 한국어'};

const INIT_INV=[
  {id:'1',name:'Pollo Entero',stock:50,unit:'unid',minStock:10,expiryDate:new Date(Date.now()+8*864e5).toISOString().slice(0,10),category:'Proteína'},
  {id:'2',name:'Salsa Gochujang',stock:2000,unit:'ml',minStock:500,expiryDate:new Date(Date.now()+60*864e5).toISOString().slice(0,10),category:'Salsas'},
  {id:'3',name:'Papas a la Francesa',stock:15,unit:'kg',minStock:5,expiryDate:new Date(Date.now()+3*864e5).toISOString().slice(0,10),category:'Acompañ.'},
  {id:'4',name:'Rábano Encurtido',stock:100,unit:'porc',minStock:25,expiryDate:new Date(Date.now()+20*864e5).toISOString().slice(0,10),category:'Verduras'},
];
const INIT_COMBOS=[
  {id:'c1',name:'Combo Familiar K-Pollo',price:45000,items:[{inventoryId:'1',quantity:1},{inventoryId:'3',quantity:0.5},{inventoryId:'4',quantity:4}]}
];
const INIT_SETTINGS={stockAlerts:true,expiryAlerts:true,daysBeforeExpiry:7,anticipationDays:23,chaosThreshold:25};

function calcChaos(inv){
  const total=inv.reduce((s,i)=>s+i.stock,0);
  if(!total) return 0;
  let r=0;
  inv.forEach(i=>{
    if(!i.expiryDate) return;
    const d=Math.floor((new Date(i.expiryDate)-Date.now())/864e5);
    r+=i.stock*(d<=1?.90:d<=3?.60:d<=7?.30:.05);
  });
  return Math.round(r/total*100);
}
function riskBadge(d){
  if(d<=1) return{bg:'#FED7D7',text:'#822727',label:'🔴'};
  if(d<=3) return{bg:'#FEEBC8',text:'#7B341E',label:'🟠'};
  if(d<=7) return{bg:'#FEFCBF',text:'#744210',label:'🟡'};
  return{bg:'#C6F6D5',text:'#276749',label:'🟢'};
}

// ── STORAGE HELPERS ───────────────────────────────────────────────────────────
const KEYS={inv:'kpollo_inventory',combos:'kpollo_combos',sales:'kpollo_sales',daily:'kpollo_daily',settings:'kpollo_settings',lang:'kpollo_lang'};

async function loadAll(){
  const get=async(key,fallback)=>{
    try{
      const r=await window.storage.get(key);
      return r?JSON.parse(r.value):fallback;
    }catch{return fallback;}
  };
  return{
    inventory: await get(KEYS.inv, INIT_INV),
    combos:    await get(KEYS.combos, INIT_COMBOS),
    sales:     await get(KEYS.sales, []),
    daily:     await get(KEYS.daily, []),
    settings:  await get(KEYS.settings, INIT_SETTINGS),
    lang:      await get(KEYS.lang, 'es'),
  };
}

async function saveKey(key,value){
  try{ await window.storage.set(key, JSON.stringify(value)); }catch(e){console.error('storage error',e);}
}

// ─────────────────────────────────────────────────────────────────────────────
export default function App(){
  const [ready,setReady]=useState(false);
  const [saveStatus,setSaveStatus]=useState('idle'); // idle | saving | saved
  const [lang,setLang]=useState('es');
  const t=T[lang];

  const [view,setView]=useState('dashboard');
  const [inventory,setInventory]=useState(INIT_INV);
  const [combos,setCombos]=useState(INIT_COMBOS);
  const [salesHistory,setSalesHistory]=useState([]);
  const [dailySales,setDailySales]=useState([]);
  const [notifs,setNotifs]=useState([]);
  const [settings,setSettings]=useState(INIT_SETTINGS);

  const [activeSale,setActiveSale]=useState(null);
  const [saleQty,setSaleQty]=useState(1);
  const [showItemEditor,setShowItemEditor]=useState(false);
  const [editingItem,setEditingItem]=useState(null);
  const [showComboEditor,setShowComboEditor]=useState(false);
  const [editingCombo,setEditingCombo]=useState(null);
  const [voidModal,setVoidModal]=useState(null);

  // ── CARGA INICIAL ──
  useEffect(()=>{
    loadAll().then(data=>{
      setInventory(data.inventory);
      setCombos(data.combos);
      setSalesHistory(data.sales);
      setDailySales(data.daily);
      setSettings(data.settings);
      setLang(data.lang);
      setReady(true);
    });
  },[]);

  // ── AUTO-GUARDADO cada vez que cambia estado crítico ──
  const persist=async(key,value)=>{
    setSaveStatus('saving');
    await saveKey(key,value);
    setSaveStatus('saved');
    setTimeout(()=>setSaveStatus('idle'),2000);
  };

  useEffect(()=>{ if(ready) persist(KEYS.inv,inventory); },[inventory,ready]);
  useEffect(()=>{ if(ready) persist(KEYS.combos,combos); },[combos,ready]);
  useEffect(()=>{ if(ready) persist(KEYS.sales,salesHistory); },[salesHistory,ready]);
  useEffect(()=>{ if(ready) persist(KEYS.daily,dailySales); },[dailySales,ready]);
  useEffect(()=>{ if(ready) persist(KEYS.settings,settings); },[settings,ready]);
  useEffect(()=>{ if(ready) saveKey(KEYS.lang,lang); },[lang,ready]);

  const toast=msg=>{
    const id=Date.now();
    setNotifs(p=>[...p,{id,msg}]);
    setTimeout(()=>setNotifs(p=>p.filter(n=>n.id!==id)),3000);
  };

  // ── MÉTRICAS ──
  const lowStock=useMemo(()=>inventory.filter(i=>i.stock<=i.minStock),[inventory]);
  const expiring=useMemo(()=>{
    const lim=new Date(); lim.setDate(lim.getDate()+settings.daysBeforeExpiry);
    return inventory.filter(i=>i.expiryDate&&new Date(i.expiryDate)<=lim);
  },[inventory,settings.daysBeforeExpiry]);
  const chaos=calcChaos(inventory);
  const mainStock=inventory.find(i=>i.id==='1')?.stock??inventory.reduce((s,i)=>s+i.stock,0);
  const avgSales=dailySales.length?Math.round(dailySales.reduce((s,d)=>s+d.qty,0)/dailySales.length):0;
  const daysLeft=avgSales>0?Math.floor(mainStock/avgSales):null;
  const needsReorder=daysLeft!==null&&daysLeft<=settings.anticipationDays;

  // ── ACCIONES ──
  const updateStock=(id,amt)=>setInventory(p=>p.map(i=>i.id===id?{...i,stock:Math.max(0,i.stock+amt)}:i));
  const deleteItem=id=>setInventory(p=>p.filter(i=>i.id!==id));
  const saveItem=d=>{
    const isEdit=d.id&&d.id.length<10;
    setInventory(p=>isEdit?p.map(i=>i.id===d.id?d:i):[...p,{...d,id:Date.now().toString()}]);
    setShowItemEditor(false);setEditingItem(null);toast(t.notif.saved);
  };
  const saveCombo=d=>{
    setCombos(p=>d.id?p.map(c=>c.id===d.id?d:c):[...p,{...d,id:`c-${Date.now()}`}]);
    setShowComboEditor(false);setEditingCombo(null);toast(t.notif.comboSaved);
  };
  const confirmSale=()=>{
    if(!activeSale) return;
    const combo=combos.find(c=>c.id===activeSale.id);
    const short=combo.items.filter(n=>{
      const inv=inventory.find(i=>i.id===n.inventoryId);
      return !inv||inv.stock<n.quantity*saleQty;
    });
    if(short.length){toast(t.sales.noStock);return;}
    setInventory(p=>p.map(inv=>{
      const n=combo.items.find(ni=>ni.inventoryId===inv.id);
      return n?{...inv,stock:inv.stock-n.quantity*saleQty}:inv;
    }));
    const today=new Date().toLocaleDateString();
    setDailySales(p=>{
      const idx=p.findIndex(d=>d.date===today);
      if(idx>=0){const c=[...p];c[idx]={...c[idx],qty:c[idx].qty+saleQty};return c;}
      return[...p,{date:today,qty:saleQty}];
    });
    setSalesHistory(p=>[{id:`V-${Date.now().toString().slice(-4)}`,timestamp:new Date().toLocaleString(),
      comboName:combo.name,quantity:saleQty,total:combo.price*saleQty,items:[...combo.items],status:'ok'},...p]);
    setActiveSale(null);toast(t.notif.sold);
  };
  const voidSale=(id,reason)=>{
    const sale=salesHistory.find(s=>s.id===id);
    if(!sale) return;
    setInventory(p=>p.map(inv=>{
      const n=sale.items.find(ni=>ni.inventoryId===inv.id);
      return n?{...inv,stock:inv.stock+n.quantity*sale.quantity}:inv;
    }));
    setSalesHistory(p=>p.map(s=>s.id===id?{...s,status:'voided',voidReason:reason}:s));
    setVoidModal(null);toast(t.notif.voided);
  };
  const clearHistory=()=>{setSalesHistory([]);setDailySales([]);toast(t.notif.cleared);};

  // ── UI ──
  const Card=({children,className=''})=>(
    <div className={`bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 ${className}`}>{children}</div>
  );
  const Label=({children})=>(
    <span className="text-[10px] font-black uppercase text-slate-400 block mb-2 tracking-widest">{children}</span>
  );
  const InputBase=({className='',...p})=>(
    <input className={`w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none ring-2 ring-transparent focus:ring-red-600 transition-all ${className}`} {...p}/>
  );

  if(!ready) return(
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center text-white font-black text-3xl mx-auto mb-4 animate-pulse">K</div>
        <p className="font-black text-slate-400 uppercase tracking-widest text-sm">{t.loading}</p>
      </div>
    </div>
  );

  const navItems=[
    {id:'dashboard',icon:LayoutDashboard,label:t.nav.dashboard},
    {id:'inventory',icon:Package,label:t.nav.inventory},
    {id:'sales',icon:ShoppingCart,label:t.nav.sales},
    {id:'combos',icon:UtensilsCrossed,label:t.nav.combos},
    {id:'history',icon:History,label:t.nav.history},
    {id:'settings',icon:Settings,label:t.nav.settings},
  ];

  return(
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-24 md:pb-0">
      {/* SIDEBAR */}
      <div className="fixed bottom-0 w-full bg-white border-t md:top-0 md:left-0 md:w-64 md:h-full md:border-r md:border-t-0 z-50 p-4">
        <div className="hidden md:flex items-center gap-3 mb-6 px-2">
          <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white font-black text-xl">K</div>
          <div>
            <h1 className="font-black text-base text-red-600 tracking-tighter uppercase leading-tight">{t.title}</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t.subtitle}</p>
          </div>
        </div>
        {/* Save status indicator */}
        <div className="hidden md:flex items-center gap-2 px-2 mb-4 h-5">
          {saveStatus==='saving'&&<><div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"/><span className="text-[10px] text-slate-400 font-bold">{t.saving}</span></>}
          {saveStatus==='saved'&&<><div className="w-2 h-2 bg-green-500 rounded-full"/><span className="text-[10px] text-green-600 font-bold">{t.saved}</span></>}
        </div>
        {/* Lang switcher desktop */}
        <div className="hidden md:flex gap-1 mb-4 bg-slate-50 rounded-2xl p-1">
          {Object.keys(LANG_LABELS).map(l=>(
            <button key={l} onClick={()=>setLang(l)} className={`flex-1 py-1.5 rounded-xl text-[10px] font-black transition-all ${lang===l?'bg-white shadow text-red-600':'text-slate-400'}`}>
              {LANG_LABELS[l].split(' ')[0]}
            </button>
          ))}
        </div>
        <nav className="flex md:flex-col justify-around gap-1">
          {navItems.map(item=>(
            <button key={item.id} onClick={()=>setView(item.id)}
              className={`flex flex-col md:flex-row items-center gap-3 px-4 py-3 rounded-2xl transition-all ${view===item.id?'bg-red-600 text-white shadow-lg shadow-red-100':'text-slate-500 hover:bg-slate-50'}`}>
              <item.icon size={20}/>
              <span className="text-[10px] md:text-sm font-black uppercase tracking-wider">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* MAIN */}
      <main className="md:pl-72 p-6 max-w-7xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight capitalize">{t.nav[view]||view}</h2>
            <p className="text-slate-400 font-medium">{t.subtitle}</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex md:hidden gap-1 bg-white border border-slate-100 rounded-2xl p-1 shadow-sm">
              {Object.keys(LANG_LABELS).map(l=>(
                <button key={l} onClick={()=>setLang(l)} className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${lang===l?'bg-red-600 text-white':'text-slate-400'}`}>
                  {LANG_LABELS[l].split(' ')[0]}
                </button>
              ))}
            </div>
            {/* Save indicator mobile */}
            <div className="flex md:hidden items-center gap-1">
              {saveStatus==='saving'&&<span className="text-[10px] text-yellow-500 font-black">{t.saving}</span>}
              {saveStatus==='saved'&&<span className="text-[10px] text-green-600 font-black">{t.saved}</span>}
            </div>
            {view==='history'&&salesHistory.length>0&&(
              <button onClick={clearHistory} className="bg-red-50 text-red-600 px-5 py-3 rounded-2xl font-black text-xs uppercase flex items-center gap-2 hover:bg-red-100 transition-all">
                <Trash2 size={14}/> {t.history.clearAll}
              </button>
            )}
          </div>
        </header>

        {/* ── DASHBOARD ── */}
        {view==='dashboard'&&(
          <div className="space-y-8">
            {needsReorder&&(
              <div className="bg-red-600 text-white rounded-[28px] p-6 flex flex-col md:flex-row md:items-center gap-4 shadow-xl shadow-red-100">
                <AlertTriangle size={32} className="shrink-0"/>
                <div>
                  <p className="font-black text-lg">{t.dashboard.reorderTitle} — {t.dashboard.orderNow}</p>
                  <p className="text-sm opacity-80 mt-1">{t.dashboard.orderMsg(avgSales,daysLeft,settings.anticipationDays)}</p>
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                {label:t.dashboard.criticalStock,val:lowStock.length,accent:'bg-red-600 text-white border-none shadow-xl shadow-red-100',icon:<AlertTriangle size={18} className="opacity-50 mb-2"/>},
                {label:t.dashboard.expiringSoon,val:expiring.length,accent:'bg-slate-900 text-white border-none',icon:<Calendar size={18} className="opacity-50 mb-2"/>},
                {label:t.dashboard.salesToday,val:salesHistory.filter(s=>s.status!=='voided').length,accent:'',icon:<History size={18} className="text-red-600 mb-2"/>},
                {label:t.dashboard.avgDay,val:avgSales||'—',accent:'',icon:<ShoppingCart size={18} className="text-red-600 mb-2"/>},
                {label:t.dashboard.daysLeft,val:daysLeft!==null?`~${daysLeft}d`:'—',accent:needsReorder?'bg-red-50 border-red-200':'',icon:<Clock size={18} className={`mb-2 ${needsReorder?'text-red-600':'text-slate-400'}`}/>},
                {label:t.dashboard.chaosIndex,val:`${chaos}%`,accent:chaos>=settings.chaosThreshold?'bg-orange-50 border-orange-200':'',icon:<Package size={18} className={`mb-2 ${chaos>=settings.chaosThreshold?'text-orange-500':'text-slate-400'}`}/>},
              ].map((m,i)=>(
                <Card key={i} className={`text-center ${m.accent}`}>
                  {m.icon}
                  <p className="text-3xl font-black">{m.val}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mt-1">{m.label}</p>
                </Card>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <h3 className="text-xl font-black mb-6 flex items-center gap-2 text-red-600"><AlertTriangle size={20}/> {t.dashboard.stockAlerts}</h3>
                <div className="space-y-3">
                  {lowStock.length===0?<p className="text-slate-400 text-sm italic">{t.dashboard.allGood}</p>:
                  lowStock.map(item=>(
                    <div key={item.id} className="flex items-center justify-between p-4 bg-red-50 rounded-2xl border border-red-100">
                      <div>
                        <p className="font-black text-slate-800">{item.name}</p>
                        <p className="text-xs text-red-600 font-bold uppercase">{t.dashboard.left}: {item.stock} {item.unit}</p>
                      </div>
                      <button onClick={()=>updateStock(item.id,10)} className="bg-white p-2 rounded-xl text-red-600 shadow-sm hover:bg-red-50"><Plus size={18}/></button>
                    </div>
                  ))}
                </div>
              </Card>
              <Card>
                <h3 className="text-xl font-black mb-6 flex items-center gap-2"><Clock size={20}/> {t.dashboard.expiryAlerts}</h3>
                <div className="space-y-3">
                  {expiring.length===0?<p className="text-slate-400 text-sm italic">{t.dashboard.noExpiry}</p>:
                  expiring.map(item=>{
                    const d=Math.floor((new Date(item.expiryDate)-Date.now())/864e5);
                    const r=riskBadge(d);
                    return(
                      <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl border" style={{background:r.bg,borderColor:r.text+'33'}}>
                        <div>
                          <p className="font-black text-slate-800">{item.name}</p>
                          <p className="text-xs font-bold" style={{color:r.text}}>{t.dashboard.expires}: {item.expiryDate} ({d}d)</p>
                        </div>
                        <span className="text-xl">{r.label}</span>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* ── INVENTARIO ── */}
        {view==='inventory'&&(
          <Card className="p-0 overflow-hidden border-none shadow-xl">
            <div className="p-6 flex justify-between items-center bg-white border-b">
              <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest">{t.inventory.title}</h3>
              <button onClick={()=>{setEditingItem({name:'',stock:0,minStock:5,unit:'unid',category:'General',expiryDate:''});setShowItemEditor(true);}}
                className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-black uppercase flex items-center gap-2">
                <Plus size={16}/> {t.inventory.add}
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.inventory.name}</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Stock / Min</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.inventory.expiry}</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">{t.inventory.management}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {inventory.map(item=>{
                    const d=item.expiryDate?Math.floor((new Date(item.expiryDate)-Date.now())/864e5):null;
                    const r=d!==null?riskBadge(d):null;
                    return(
                      <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-5 font-bold text-slate-800">{item.name}</td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <span className={`text-xl font-black ${item.stock<=item.minStock?'text-red-600':'text-green-600'}`}>{item.stock}</span>
                            <span className="text-[10px] text-slate-400 font-bold">/ {item.minStock} {item.unit}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          {item.expiryDate&&r
                            ?<span className="px-3 py-1 rounded-lg text-xs font-black" style={{background:r.bg,color:r.text}}>{item.expiryDate} ({d}d)</span>
                            :<span className="text-sm text-slate-400 italic">{t.inventory.noDate}</span>}
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex justify-center gap-2">
                            <button onClick={()=>updateStock(item.id,-1)} className="p-2 bg-slate-100 rounded-lg hover:bg-red-100"><Minus size={14}/></button>
                            <button onClick={()=>updateStock(item.id,1)} className="p-2 bg-slate-100 rounded-lg hover:bg-green-100"><Plus size={14}/></button>
                            <button onClick={()=>{setEditingItem(item);setShowItemEditor(true);}} className="p-2 bg-slate-100 rounded-lg text-blue-500"><Edit3 size={14}/></button>
                            <button onClick={()=>deleteItem(item.id)} className="p-2 bg-slate-100 rounded-lg text-red-400 hover:bg-red-100"><Trash2 size={14}/></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* ── COMBOS ── */}
        {view==='combos'&&(
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <button onClick={()=>{setEditingCombo({name:'',price:0,items:[]});setShowComboEditor(true);}}
              className="min-h-[250px] border-4 border-dashed border-slate-200 rounded-[40px] flex flex-col items-center justify-center text-slate-400 hover:text-red-600 hover:border-red-200 transition-all group">
              <PlusCircle size={48} className="mb-2 group-hover:scale-110 transition-transform"/>
              <span className="font-black uppercase text-xs tracking-widest">{t.combos.new}</span>
            </button>
            {combos.map(combo=>(
              <Card key={combo.id}>
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center"><UtensilsCrossed size={24}/></div>
                  <div className="flex gap-2">
                    <button onClick={()=>{setEditingCombo(combo);setShowComboEditor(true);}} className="p-2 bg-slate-50 rounded-xl text-blue-500"><Edit3 size={16}/></button>
                    <button onClick={()=>setCombos(p=>p.filter(c=>c.id!==combo.id))} className="p-2 bg-slate-50 rounded-xl text-red-500"><Trash2 size={16}/></button>
                  </div>
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-2">{combo.name}</h3>
                <p className="text-3xl font-black text-red-600">${combo.price.toLocaleString()}</p>
                <div className="mt-6 pt-6 border-t border-slate-100 space-y-2">
                  <Label>Ingredientes</Label>
                  {combo.items.map((it,idx)=>(
                    <div key={idx} className="flex justify-between text-xs font-bold text-slate-600">
                      <span>{inventory.find(i=>i.id===it.inventoryId)?.name||'—'}</span>
                      <span className="text-red-500">{it.quantity} {inventory.find(i=>i.id===it.inventoryId)?.unit||''}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* ── VENTAS ── */}
        {view==='sales'&&(
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {combos.map(combo=>(
              <button key={combo.id} onClick={()=>{setActiveSale(combo);setSaleQty(1);}}
                className="bg-white p-10 rounded-[40px] text-left border-2 border-transparent hover:border-red-600 hover:shadow-2xl hover:-translate-y-2 transition-all shadow-xl shadow-slate-100 group">
                <div className="w-16 h-16 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center mb-6 group-hover:bg-red-600 group-hover:text-white transition-colors">
                  <UtensilsCrossed size={32}/>
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-2">{combo.name}</h3>
                <p className="text-3xl font-black text-red-600">${combo.price.toLocaleString()}</p>
              </button>
            ))}
          </div>
        )}

        {/* ── HISTORIAL ── */}
        {view==='history'&&(
          <div className="space-y-4">
            {salesHistory.length===0
              ?<div className="text-center py-20 bg-white rounded-[40px] border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-black uppercase text-sm tracking-widest">{t.history.empty}</p>
              </div>
              :salesHistory.map(sale=>(
                <Card key={sale.id} className={`flex flex-col md:flex-row md:items-center justify-between gap-4 ${sale.status==='voided'?'opacity-40 grayscale':''}`}>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-lg text-[10px] font-black">{sale.id}</span>
                      {sale.status==='voided'&&<span className="bg-red-100 text-red-600 px-3 py-1 rounded-lg text-[10px] font-black">{t.history.voided}</span>}
                    </div>
                    <h4 className="text-2xl font-black text-slate-800">{sale.quantity}x {sale.comboName}</h4>
                    <p className="text-sm font-bold text-slate-400">{sale.timestamp} • <span className="text-red-600">${sale.total.toLocaleString()}</span></p>
                    {sale.voidReason&&<p className="text-xs text-red-500 font-black uppercase mt-2 italic">{t.history.motive}: {sale.voidReason}</p>}
                  </div>
                  {sale.status!=='voided'&&(
                    <button onClick={()=>setVoidModal(sale)} className="flex items-center gap-2 bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-red-50 px-6 py-4 rounded-2xl font-black transition-all shrink-0">
                      <RotateCcw size={18}/> {t.history.void}
                    </button>
                  )}
                </Card>
              ))}
          </div>
        )}

        {/* ── AJUSTES ── */}
        {view==='settings'&&(
          <div className="max-w-xl mx-auto space-y-6">
            <Card>
              <h3 className="text-xl font-black mb-8 flex items-center gap-2"><Settings className="text-red-600"/> {t.settings.title}</h3>
              <div className="space-y-4">
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <Label><Globe size={12} className="inline mr-1"/>{t.settings.lang}</Label>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {Object.entries(LANG_LABELS).map(([l,label])=>(
                      <button key={l} onClick={()=>setLang(l)} className={`px-4 py-2 rounded-xl text-sm font-black transition-all border-2 ${lang===l?'bg-red-600 text-white border-red-600':'bg-white text-slate-500 border-slate-200 hover:border-red-300'}`}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                {[
                  {key:'stockAlerts',label:t.settings.stockAlerts,desc:t.settings.stockDesc},
                  {key:'expiryAlerts',label:t.settings.expiryAlerts,desc:t.settings.expiryDesc},
                ].map(s=>(
                  <div key={s.key} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100">
                    <div><p className="font-black text-slate-800">{s.label}</p><p className="text-xs text-slate-500">{s.desc}</p></div>
                    <button onClick={()=>setSettings(p=>({...p,[s.key]:!p[s.key]}))}
                      className={`w-14 h-8 rounded-full relative transition-colors ${settings[s.key]?'bg-green-500':'bg-slate-300'}`}>
                      <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow ${settings[s.key]?'left-7':'left-1'}`}/>
                    </button>
                  </div>
                ))}
                {[
                  {key:'daysBeforeExpiry',label:t.settings.daysBefore,min:1,max:30},
                  {key:'anticipationDays',label:t.settings.anticipation,min:1,max:60},
                  {key:'chaosThreshold',label:t.dashboard.chaosIndex+' umbral %',min:1,max:100},
                ].map(s=>(
                  <div key={s.key} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="font-black text-slate-800 text-sm">{s.label}</p>
                    <div className="flex items-center gap-3">
                      <button onClick={()=>setSettings(p=>({...p,[s.key]:Math.max(s.min,p[s.key]-1)}))} className="w-8 h-8 bg-white rounded-lg font-black border border-slate-200 hover:bg-slate-100">-</button>
                      <span className="font-black text-xl w-8 text-center">{settings[s.key]}</span>
                      <button onClick={()=>setSettings(p=>({...p,[s.key]:Math.min(s.max,p[s.key]+1)}))} className="w-8 h-8 bg-white rounded-lg font-black border border-slate-200 hover:bg-slate-100">+</button>
                    </div>
                  </div>
                ))}
                <div className="p-5 border border-dashed border-slate-300 rounded-2xl text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-3">{t.settings.danger}</p>
                  <button onClick={clearHistory} className="text-red-600 font-black text-xs uppercase hover:underline">{t.settings.clearSales}</button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </main>

      {/* ── MODALES ── */}
      {showItemEditor&&editingItem&&(
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[40px] p-10 animate-pop max-h-[90vh] overflow-y-auto">
            <h3 className="text-3xl font-black mb-8">{t.inventory.itemCard}</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2"><Label>{t.inventory.name}</Label><InputBase value={editingItem.name} onChange={e=>setEditingItem({...editingItem,name:e.target.value})}/></div>
              <div><Label>{t.inventory.stockInit}</Label><InputBase type="number" value={editingItem.stock} onChange={e=>setEditingItem({...editingItem,stock:+e.target.value})}/></div>
              <div><Label>{t.inventory.minAlert}</Label><InputBase type="number" value={editingItem.minStock} onChange={e=>setEditingItem({...editingItem,minStock:+e.target.value})}/></div>
              <div><Label>{t.inventory.unit}</Label><InputBase value={editingItem.unit} onChange={e=>setEditingItem({...editingItem,unit:e.target.value})}/></div>
              <div><Label>{t.inventory.expiry}</Label><InputBase type="date" value={editingItem.expiryDate} onChange={e=>setEditingItem({...editingItem,expiryDate:e.target.value})}/></div>
            </div>
            <div className="flex gap-4 mt-10">
              <button onClick={()=>setShowItemEditor(false)} className="flex-1 py-5 font-black uppercase text-slate-400 bg-slate-50 rounded-2xl">{t.inventory.close}</button>
              <button onClick={()=>saveItem(editingItem)} className="flex-1 py-5 font-black uppercase text-white bg-slate-900 rounded-2xl">{t.inventory.save}</button>
            </div>
          </div>
        </div>
      )}

      {showComboEditor&&editingCombo&&(
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-[40px] p-10 overflow-y-auto max-h-[90vh] animate-pop">
            <h3 className="text-3xl font-black mb-8">{t.combos.design}</h3>
            <div className="space-y-6">
              <div><Label>{t.combos.name}</Label><InputBase value={editingCombo.name} onChange={e=>setEditingCombo({...editingCombo,name:e.target.value})}/></div>
              <div><Label>{t.combos.price}</Label><InputBase type="number" value={editingCombo.price} onChange={e=>setEditingCombo({...editingCombo,price:+e.target.value})}/></div>
              <div>
                <Label>{t.combos.ingredients}</Label>
                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {inventory.map(inv=>{
                    const ex=editingCombo.items.find(it=>it.inventoryId===inv.id);
                    return(
                      <div key={inv.id} className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl">
                        <input type="checkbox" checked={!!ex} className="w-5 h-5 accent-red-600"
                          onChange={e=>{
                            if(e.target.checked) setEditingCombo({...editingCombo,items:[...editingCombo.items,{inventoryId:inv.id,quantity:1}]});
                            else setEditingCombo({...editingCombo,items:editingCombo.items.filter(it=>it.inventoryId!==inv.id)});
                          }}/>
                        <span className="flex-1 font-bold text-sm text-slate-700">{inv.name}</span>
                        {ex&&(
                          <div className="flex items-center gap-2">
                            <InputBase type="number" className="w-16 p-2 text-center text-xs" value={ex.quantity}
                              onChange={e=>setEditingCombo({...editingCombo,items:editingCombo.items.map(it=>it.inventoryId===inv.id?{...it,quantity:+e.target.value}:it)})}/>
                            <span className="text-[10px] font-bold text-slate-400">{inv.unit}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button onClick={()=>setShowComboEditor(false)} className="flex-1 py-5 font-black uppercase text-slate-400 bg-slate-50 rounded-2xl">{t.combos.close}</button>
              <button onClick={()=>saveCombo(editingCombo)} className="flex-1 py-5 font-black uppercase text-white bg-red-600 rounded-2xl shadow-xl shadow-red-100">{t.combos.save}</button>
            </div>
          </div>
        </div>
      )}

      {activeSale&&(
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-[50px] overflow-hidden animate-pop shadow-2xl">
            <div className="bg-red-600 p-10 text-white text-center">
              <h3 className="text-2xl font-black mb-6">{activeSale.name}</h3>
              <div className="flex items-center justify-center gap-6">
                <button onClick={()=>setSaleQty(Math.max(1,saleQty-1))} className="w-12 h-12 bg-white/20 rounded-full font-black text-2xl hover:bg-white/30">-</button>
                <span className="text-5xl font-black">{saleQty}</span>
                <button onClick={()=>setSaleQty(saleQty+1)} className="w-12 h-12 bg-white/20 rounded-full font-black text-2xl hover:bg-white/30">+</button>
              </div>
            </div>
            <div className="p-10 text-center">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{t.sales.total}</p>
              <p className="text-4xl font-black text-slate-900 mb-8">${(activeSale.price*saleQty).toLocaleString()}</p>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={()=>setActiveSale(null)} className="py-5 font-black text-slate-400 bg-slate-50 rounded-3xl uppercase text-xs">{t.sales.close}</button>
                <button onClick={confirmSale} className="py-5 font-black text-white bg-red-600 rounded-3xl shadow-xl shadow-red-100 uppercase text-xs">{t.sales.confirm}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {voidModal&&(
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-[40px] p-10 animate-pop text-center">
            <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6"><RotateCcw size={40}/></div>
            <h3 className="text-2xl font-black mb-6">{t.history.reason}</h3>
            <div className="space-y-3">
              {t.history.reasons.map(r=>(
                <button key={r} onClick={()=>voidSale(voidModal.id,r)} className="w-full py-4 rounded-2xl border-2 border-slate-100 font-black text-slate-700 hover:border-red-600 hover:bg-red-50 transition-all text-xs uppercase tracking-widest">{r}</button>
              ))}
              <button onClick={()=>setVoidModal(null)} className="w-full mt-2 text-slate-400 font-bold uppercase text-xs">Cerrar / Close</button>
            </div>
          </div>
        </div>
      )}

      {/* TOASTS */}
      <div className="fixed top-6 right-6 z-[200] flex flex-col gap-3">
        {notifs.map(n=>(
          <div key={n.id} className="bg-slate-900 text-white px-6 py-4 rounded-3xl shadow-2xl flex items-center gap-3 animate-slide-in border-l-4 border-green-500">
            <CheckCircle2 className="text-green-500 shrink-0" size={18}/>
            <span className="font-black text-sm uppercase tracking-wider">{n.msg}</span>
          </div>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{__html:`
        @keyframes pop{0%{transform:scale(0.9) translateY(20px);opacity:0}100%{transform:scale(1) translateY(0);opacity:1}}
        @keyframes slide-in{0%{transform:translateX(100%)}100%{transform:translateX(0)}}
        .animate-pop{animation:pop 0.4s cubic-bezier(0.16,1,0.3,1) forwards}
        .animate-slide-in{animation:slide-in 0.4s cubic-bezier(0.16,1,0.3,1) forwards}
      `}}/>
    </div>
  );
}
