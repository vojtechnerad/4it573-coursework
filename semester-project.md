# 📘 Návrh zadání semestrální práce

## 📌 Popis projektu

Téma vychází z navrženého zadání: _Aplikace na hodnocení „věcí“ (skupina uživatelů hlasuje, co preferuje více a co méně)_.

Cílem projektu je vytvořit webovou aplikaci, která řeší reálný každodenní problém našeho kolektivu v pracovním prostředí: „Kam půjdeme na oběd?“. Aplikace si klade za cíl zefektivnit rozhodovací proces ve skupině a omezit nutnost neformálních a často zdlouhavých domluv.

Navržený systém umožní uživatelům vytvářet uzavřené skupiny, v jejichž rámci mohou spravovat seznam preferovaných restaurací a účastnit se hlasování. Každý uživatel bude mít možnost vyjádřit svou preferenci vůči jednotlivým možnostem, přičemž výsledky hlasování budou dostupné v reálném čase.

## ⚙️ Funkční požadavky

- **Správa identit**
- **Organizační struktura**
  - Vytváření skupin uživatelů – zakladatel skupiny je jejím vlastníkem a má právo spravovat členy
  - Hlasování probíhá vždy izolovaně v rámci dané skupiny
- **Katalog restaurací**
  - Administrace restaurací v okolí (název, logo, odkaz na denní menu)
  - Seznam restaurací je jeden globální
  - (Otevřená otázka) Vazba restaurací na skupiny – např. výběr z omezeného seznamu, oblíbené restaurace na úrovni skupiny či uživatele apod.
- **Hlasovací systém**
  - Každý den automaticky vzniká nové hlasovací kolo
  - Tříúrovňové hodnocení restaurace: `Preferuji`, `Klidně`, `Nechci`
  - Real-time aktualizace – průběžné výsledky hlasování se zobrazují všem členům skupiny okamžitě bez nutnosti obnovy stránky (pomocí WebSockets)

## 🧱 Tech Stack

- **Forma**: `REST API` + `SPA` webový klient
- **Backend**: `Node.js` + `Hono`
- **Real-time komunikace**: pravděpodobně pomocí `Socket.io`
- **Databáze**: Nějaká relační DBMS
- **Frontend**: jednoduché frontendové rozhraní (není hlavní důraz práce)

## 🗂️ Přehled předpokládaných entit

- **User**: id, email, password (hash), name
- **Group**: id, name, owner_id (vazba na User)
- **GroupMember**: group_id, user_id
- **Restaurant**: id, name, logo_path / logo_blob, menu_url
- **Vote**: id, user_id, restaurant_id, date, status (enum: prefer, neutral, avoid)

## 🎯 Důvody proč tohle téma

- Chtěl bych si plně osvojit komunikaci skrze WebSockety; určitě využiju do budoucna v práci
- Reálný projekt – po úspěšné implementaci chceme zkusit používat v práci
- Vhodný přírůstek do portfolia pro státní závěrečnou zkoušku
- Možnost vyzkoušet si nové technologie, API a knihovny (zejména na frontendu)

## 🚀 Možná rozšíření do budoucna

- Historie hlasování
- Přihlášení přes externí službu (firemní SSO)
