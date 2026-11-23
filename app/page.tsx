"use client";

import { useMemo, useState } from "react";
import { coins, type Coin } from "./coins";
import "./fallback.css";

const money = (value: number) => `${new Intl.NumberFormat("ru-RU").format(value)} ₽`;

export default function Home() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("Все");
  const [selected, setSelected] = useState<Coin | null>(null);
  const [side, setSide] = useState<1 | 2>(2);
  const shown = useMemo(() => coins.filter((coin) => {
    const ok = filter === "Все" || coin.denomination === filter || (filter === "Требует проверки" && coin.check);
    return ok && `${coin.title} ${coin.year} ${coin.description}`.toLowerCase().includes(query.toLowerCase());
  }), [filter, query]);
  const low = coins.reduce((s, c) => s + c.price[0], 0);
  const high = coins.reduce((s, c) => s + c.price[1], 0);

  return <main>
    <header className="topbar"><a className="brand" href="#top"><span className="brandMark">МК</span><span>Моя коллекция<small>монеты и банкноты</small></span></a><nav><a href="#catalog">Каталог</a><a href="#about">О коллекции</a></nav><button className="share" onClick={() => navigator.clipboard?.writeText(location.href)}>Поделиться ↗</button></header>
    <section className="hero" id="top"><div className="eyebrow">Личная коллекция · Москва</div><div className="heroGrid"><div><h1>История,<br/><em>собранная</em> в металле.</h1><p className="lead">Цифровой каталог памятных монет СССР — с двумя сторонами каждой монеты, краткой историей и предварительной оценкой.</p></div><div className="heroCoin"><img src="/coins/1_2.jpg" alt="Успенский собор"/><span>№ 001</span></div></div><div className="stats"><div><strong>{coins.length}</strong><span>экземпляра</span></div><div><strong>{coins.length * 2}</strong><span>фотографий</span></div><div><strong>{money(low)}—{money(high).replace(" ₽", "")}</strong><span>оценка коллекции</span></div><div><strong>{coins.filter(c => c.check).length}</strong><span>проверить по гурту</span></div></div></section>
    <section className="catalog" id="catalog"><div className="sectionHead"><div><span className="index">01 / КАТАЛОГ</span><h2>Предметы коллекции</h2></div><p>Все экземпляры определены по фотографиям. Цена — ориентир для обычного чекана в видимом состоянии; разновидность, гурт и точная сохранность могут заметно изменить стоимость.</p></div>
      <div className="toolbar"><label className="search"><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Название, год или сюжет"/></label><div className="filters">{["Все","1 рубль","3 рубля","5 рублей","Требует проверки"].map(x=><button key={x} className={filter===x?"active":""} onClick={()=>setFilter(x)}>{x}</button>)}</div><span className="count">{shown.length} из {coins.length}</span></div>
      <div className="grid">{shown.map(coin=><a className="card" href={`#coin-${coin.id}`} key={coin.id} onClick={()=>{setSelected(coin);setSide(2)}}><div className="photo"><img src={`/coins/${coin.id}_2.jpg`} alt={`${coin.title}, реверс`} loading="lazy"/><span className={`status ${coin.check?"":"done"}`}>{coin.check?"Проверить гурт":"Определено"}</span>{coin.duplicate&&<span className="duplicateBadge">Дубликат</span>}<span className="number">№ {String(coin.id).padStart(3,"0")}</span></div><div className="cardBody"><p className="meta">{coin.denomination} · {coin.year} · СССР</p><h3>{coin.title}</h3><p className="desc">{coin.description}</p><div className="value"><span>Оценка</span><strong>{money(coin.price[0])}—{money(coin.price[1]).replace(" ₽","")}</strong></div></div></a>)}</div>
    </section>
    <section className="about" id="about"><span className="index">02 / МЕТОД</span><h2>Каждый экземпляр получил паспорт.</h2><p>Номер совпадает с номером исходных файлов. Повторные монеты сохранены как отдельные предметы. Состояние предварительно оценено по фото как VF–XF; для точной атрибуции нужны масса, диаметр, монетный двор и фотография гурта.</p></section>
    <footer><span>Частная коллекция · 2026</span><span>Предварительная оценка не является офертой</span></footer>
    {selected&&<div className="modalBackdrop" onMouseDown={()=>setSelected(null)}><section className="modal" role="dialog" aria-modal="true" onMouseDown={e=>e.stopPropagation()}><button className="close" onClick={()=>setSelected(null)}>×</button><div className="modalPhoto"><img src={`/coins/${selected.id}_${side}.jpg`} alt={`${selected.title}, сторона ${side}`}/><div className="sideSwitch"><button className={side===1?"active":""} onClick={()=>setSide(1)}>Аверс</button><button className={side===2?"active":""} onClick={()=>setSide(2)}>Реверс</button></div></div><div className="modalText"><span className="index">ПРЕДМЕТ № {String(selected.id).padStart(3,"0")}</span><h2>{selected.title}</h2><p className="modalMeta">{selected.denomination} · {selected.year} · СССР</p><p>{selected.description}</p><dl><div><dt>Номинал</dt><dd>{selected.denomination}</dd></div><div><dt>Год</dt><dd>{selected.year}</dd></div><div><dt>Материал</dt><dd>{selected.material}</dd></div><div><dt>Состояние по фото</dt><dd>VF–XF</dd></div><div><dt>Чекан</dt><dd>обычный</dd></div><div><dt>Оценка</dt><dd>{money(selected.price[0])}—{money(selected.price[1])}</dd></div></dl><div className="notice">{selected.check || "Атрибуция уверенная. Для точной рыночной оценки всё равно полезны фото гурта, масса и диаметр."}</div></div></section></div>}
    {coins.map(coin=><div className="modalBackdrop fallbackModal" id={`coin-${coin.id}`} key={`fallback-${coin.id}`}><section className="modal" role="dialog" aria-modal="true" aria-labelledby={`coin-title-${coin.id}`}><a className="close" href="#catalog" aria-label="Закрыть">×</a><div className="modalPhoto"><img src={`/coins/${coin.id}_2.jpg`} alt={`${coin.title}, реверс`} loading="lazy"/></div><div className="modalText"><span className="index">ПРЕДМЕТ № {String(coin.id).padStart(3,"0")}</span><h2 id={`coin-title-${coin.id}`}>{coin.title}</h2><p className="modalMeta">{coin.denomination} · {coin.year} · СССР</p><p>{coin.description}</p><dl><div><dt>Номинал</dt><dd>{coin.denomination}</dd></div><div><dt>Год</dt><dd>{coin.year}</dd></div><div><dt>Материал</dt><dd>{coin.material}</dd></div><div><dt>Состояние по фото</dt><dd>VF–XF</dd></div><div><dt>Оценка</dt><dd>{money(coin.price[0])}—{money(coin.price[1])}</dd></div></dl><div className="notice">{coin.check || "Атрибуция уверенная. Для точной рыночной оценки полезны фото гурта, масса и диаметр."}</div></div></section></div>)}
  </main>;
}
