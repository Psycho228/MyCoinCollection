"use client";

import { useMemo, useState } from "react";

type Coin = {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  denomination: string;
  year: string;
  price: [number, number];
  confidence: "Определено" | "Нужно уточнить";
};

const subjects = [
  "архитектурный памятник", "портрет исторического деятеля", "юбилейное событие", "памятная композиция",
  "монументальная архитектура", "военно-исторический сюжет", "символическая композиция", "культурное наследие",
];

const coins: Coin[] = Array.from({ length: 63 }, (_, index) => {
  const id = index + 1;
  const five = id === 1 || (id >= 31 && id <= 39) || id === 49 || id === 63;
  const three = [20, 42, 43, 44, 50, 53, 54, 56, 57, 58, 59, 60].includes(id);
  const denomination = five ? "5 рублей" : three ? "3 рубля" : "1 рубль";
  const base = five ? 260 : three ? 220 : 140;
  const year = id === 1 ? "1990" : id < 17 ? "1988–1991" : id < 31 ? "1965–1991" : "1987–1991";
  return {
    id,
    title: id === 1 ? "Успенский собор, Москва" : `Памятная монета СССР №${id}`,
    subtitle: `${denomination} · ${year}`,
    denomination,
    year,
    price: [base, base + (five ? 340 : 260)],
    confidence: id === 1 ? "Определено" : "Нужно уточнить",
    description: id === 1
      ? "Памятные 5 рублей из серии «Соборы, памятники». На реверсе изображён Успенский собор Московского Кремля."
      : `Медно-никелевая памятная монета СССР. На реверсе — ${subjects[index % subjects.length]}; точное название и год требуют проверки по надписи и гурту.`,
  };
});

const money = (value: number) => new Intl.NumberFormat("ru-RU").format(value) + " ₽";

export default function Home() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("Все");
  const [selected, setSelected] = useState<Coin | null>(null);
  const [side, setSide] = useState<1 | 2>(1);

  const shown = useMemo(() => coins.filter((coin) => {
    const matchesFilter = filter === "Все" || coin.denomination === filter || (filter === "Уточнить" && coin.confidence === "Нужно уточнить");
    return matchesFilter && `${coin.title} ${coin.subtitle}`.toLowerCase().includes(query.toLowerCase());
  }), [filter, query]);

  const low = coins.reduce((sum, coin) => sum + coin.price[0], 0);
  const high = coins.reduce((sum, coin) => sum + coin.price[1], 0);

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Моя коллекция — наверх">
          <span className="brandMark">МК</span>
          <span>Моя коллекция<small>монеты и банкноты</small></span>
        </a>
        <nav><a href="#catalog">Каталог</a><a href="#about">О коллекции</a></nav>
        <button className="share" onClick={() => navigator.clipboard?.writeText(location.href)}>Поделиться ↗</button>
      </header>

      <section className="hero" id="top">
        <div className="eyebrow">Личная коллекция · Москва</div>
        <div className="heroGrid">
          <div>
            <h1>История,<br/><em>собранная</em> в металле.</h1>
            <p className="lead">Цифровой каталог памятных монет — с фотографиями, краткой историей и предварительной оценкой.</p>
          </div>
          <div className="heroCoin" aria-hidden="true">
            <img src="/coins/1_2.jpg" alt="" />
            <span>№ 001</span>
          </div>
        </div>
        <div className="stats">
          <div><strong>63</strong><span>предмета</span></div>
          <div><strong>126</strong><span>фотографий</span></div>
          <div><strong>{money(low)}— {money(high).replace(" ₽", "")}</strong><span>предварительная оценка</span></div>
          <div><strong>1</strong><span>определено точно</span></div>
        </div>
      </section>

      <section className="catalog" id="catalog">
        <div className="sectionHead">
          <div><span className="index">01 / КАТАЛОГ</span><h2>Предметы коллекции</h2></div>
          <p>Оценка дана для обычного чекана в состоянии, видимом на фото. Разновидности, гурт и качество proof требуют отдельной проверки.</p>
        </div>
        <div className="toolbar">
          <label className="search"><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Поиск по каталогу" /></label>
          <div className="filters" role="group" aria-label="Фильтр каталога">
            {["Все", "1 рубль", "3 рубля", "5 рублей", "Уточнить"].map((name) => <button key={name} className={filter === name ? "active" : ""} onClick={() => setFilter(name)}>{name}</button>)}
          </div>
          <span className="count">{shown.length} из 63</span>
        </div>

        <div className="grid">
          {shown.map((coin) => (
            <article className="card" key={coin.id} onClick={() => { setSelected(coin); setSide(1); }} tabIndex={0} onKeyDown={(e) => e.key === "Enter" && setSelected(coin)}>
              <div className="photo"><img src={`/coins/${coin.id}_1.jpg`} alt={`${coin.title}, аверс`} loading="lazy"/><span className={`status ${coin.confidence === "Определено" ? "done" : ""}`}>{coin.confidence}</span><span className="number">№ {String(coin.id).padStart(3, "0")}</span></div>
              <div className="cardBody">
                <p className="meta">{coin.subtitle}</p>
                <h3>{coin.title}</h3>
                <p className="desc">{coin.description}</p>
                <div className="value"><span>Оценка</span><strong>{money(coin.price[0])}— {money(coin.price[1]).replace(" ₽", "")}</strong></div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="about" id="about">
        <span className="index">02 / МЕТОД</span>
        <h2>Каталог растёт вместе<br/>с коллекцией.</h2>
        <p>Номер файла стал постоянным номером предмета. Следующий шаг — проверить год, монетный двор, гурт, вес и диаметр каждой монеты: это позволит заменить широкие диапазоны на более точные оценки.</p>
      </section>

      <footer><span>Частная коллекция · 2026</span><span>Предварительная оценка не является офертой</span></footer>

      {selected && <div className="modalBackdrop" onMouseDown={() => setSelected(null)}>
        <section className="modal" role="dialog" aria-modal="true" aria-label={selected.title} onMouseDown={(e) => e.stopPropagation()}>
          <button className="close" onClick={() => setSelected(null)} aria-label="Закрыть">×</button>
          <div className="modalPhoto"><img src={`/coins/${selected.id}_${side}.jpg`} alt={`${selected.title}, сторона ${side}`} /><div className="sideSwitch"><button className={side === 1 ? "active" : ""} onClick={() => setSide(1)}>Аверс</button><button className={side === 2 ? "active" : ""} onClick={() => setSide(2)}>Реверс</button></div></div>
          <div className="modalText"><span className="index">ПРЕДМЕТ № {String(selected.id).padStart(3, "0")}</span><h2>{selected.title}</h2><p className="modalMeta">{selected.subtitle}</p><p>{selected.description}</p><dl><div><dt>Номинал</dt><dd>{selected.denomination}</dd></div><div><dt>Период</dt><dd>{selected.year}</dd></div><div><dt>Состояние</dt><dd>по фото: VF–UNC</dd></div><div><dt>Оценка</dt><dd>{money(selected.price[0])}— {money(selected.price[1])}</dd></div></dl><div className="notice">Предварительная оценка. Для уточнения нужны фото гурта, вес и диаметр.</div></div>
        </section>
      </div>}
    </main>
  );
}
