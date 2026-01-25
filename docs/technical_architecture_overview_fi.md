# Tekninen Arkkitehtuurikatsaus: Neuvotteluhuonesovellus

Tämä dokumentti tarjoaa syväluotauksen Neuvotteluhuoneiden Varaussovelluksen järjestelmäsuunnitteluun, komponenttilogiikkaan ja datavirtaan.

---

## 📦 Korkean Tason Arkkitehtuuri

Sovellus noudattaa standardia **Client-Server** (Asiakas-Palvelin) -arkkitehtuuria:

```text
      FRONTEND (React + Vite)                    BACKEND (Node.js)
+---------------------------------+          +-----------------------+
|  [App.jsx] ---> [BookingForm]   |          |                       |
|       |                         |          |                       |
|       v                         |  HTTP    |  [server.js] (Asennus)|
|  [Calendar]     [Modal]         | <------> |          |            |
|                                 |  JSON    |          v            |
|  (Tila: varaukset, huoneet)     |          |      [db.json]        |
|                                 |          |                       |
+---------------------------------+          +-----------------------+
```

*   **Frontend:** Single Page Application (SPA), joka on rakennettu **Reactilla**, hyödyntäen hookeja tilanhallintaan ja `react-big-calendar`-kirjastoa.
*   **Backend:** `json-server`:in tarjoama RESTful API, joka toimii kevyenä tietokantakerroksena `db.json`-tiedoston päällä.
*   **Kommunikaatio:** Asynkroniset HTTP-pyynnöt (`GET`, `POST`, `DELETE`) käyttäen natiivia `fetch`-rajapintaa.

---

## 📂 Projektin Rakenne

*   **/frontend**: Reactin lähdekoodi.
    *   `src/App.jsx`: Sovelluksen "Aivot". Hallinnoi globaalia tilaa (`rooms`, `reservations`) ja ohjaa näkymiä.
    *   `src/components/`: (Looginen erottelu) Modaalit, Lomakkeet ja Listat on toteutettu App:in sisällä tai alikomponentteina.
    *   `src/App.css`: Keskitetty Suunnittelujärjestelmä (Muuttujat) ja komponenttikohtainen tyylittely.
*   **/backend**: API ja Pysyvyys.
    *   `db.json`: Totuuden lähde (Tietokanta). Tallentaa `rooms`- ja `reservations`-taulukot.
    *   `package.json`: Konfiguroi json-serverin käynnistysskriptit.

---

## 🛠️ Ominaisuuksien Syväluotaukset

### 1. Tilanhallinta & Datavirta
`App.jsx` käsittelee keskitettyä **Totuuden Lähdettä**.

*   **Alkullataus:** `useEffect` käynnistää samanaikaiset haut osoitteisiin `http://localhost:3001/rooms` ja `reservations`.
*   **Reaktiivisuus:** Kun varaus luodaan (POST) tai poistetaan (DELETE), frontend odottaa palvelimen vastausta (200 OK) ennen datan uudelleenhakua, jotta Kalenterin käyttöliittymä pysyy synkroonissa.

### 2. Kalenterijärjestelmä
Hyödynnämme `react-big-calendar`:ia, joka on kääritty `moment.js`-lokalisoijalla.

*   **Lokalisointi:** Konfiguroitu **Maanantain aloitukselle** ja **24h ajalle** käyttäen `moment.locale('en-gb')`.
*   **Vuorovaikutus:** Aikavälin klikkaaminen laukaisee `handleSelectSlot`-toiminnon, joka nappaa `alku`- ja `loppu`-ajat ja avaa Varaus-modaalin.
*   **Tapahtumat:** Raaka JSON-data mäpätään kalenteriobjekteiksi: `{ title, start: new Date(), end: new Date() }`.

### 3. Älykäs Validointilogiikka
Validointi tapahtuu Asiakaspuolella (Client Side) ennen kuin yhtään pyyntöä lähetetään.

*   **Päällekkäisyyden Tunnistus:** Algoritmi tarkistaa onko `(UusiAlku < OlemassaOlevaLoppu) && (UusiLoppu > OlemassaOlevaAlku)` samassa huoneessa.
*   **Liiketoimintasäännöt:** Estää varauksen menneisyydessä, varauksen ilman huonetta, tai varauksen päättymisajan ennen alkuaikaa.
*   **Palaute:** Asettaa `formErrors`-tilan, joka ehdollisesti renderöi virheviestit syötekenttien alle.

### 4. Visuaalinen Palautejärjestelmä
Käyttäjiä ei koskaan jätetä arvailemaan tilamuutoksia.

*   **Lataus:** Ehdollinen renderöinti näyttää geneerisen latausruudun huoneille, ja spesifin "Päällysspinnerin" kalenteridatalle.
*   **Toastit:** Kustomoitu `Notification`-järjestelmä väläyttää onnistumisen (vihreä) tai virheen (punainen) viestit näkymän yläosassa.
*   **Vahvistukset:** Tuhoisat toiminnot (Poista) laukaisevat toissijaisen "Oletko varma?" -modaalikerroksen.

---

## ⚡ Keskeiset Toiminnot Viite

| Funktio | Konteksti | Tarkoitus |
| :--- | :--- | :--- |
| `handleSelectSlot` | Kalenteri | Nappaa raahauksen/klikkauksen ajat ja avaa Luontimodaalin. |
| `handleSelectEvent` | Kalenteri | Avaa "Yksityiskohdat"-modaalin olemassa olevalle varaukselle. |
| `handleConfirmDelete` | Modaali | Suorittaa `DELETE`-pyynnön ja siivoaa UI-tilan. |
| `checkOverlap` | Validointi | Boolean-logiikka varmistamaan ettei tuplavarauksia tapahdu. |
| `showNotification` | UI Apuohjelma | Laukaisee lyhytkestoisen toast-viestin aikakatkaisulla. |

---

## 🚀 Suorituskyky & UI UX

*   **Optimistinen UI:** Odottaessamme palvelimen vahvistusta, estämme vuorovaikutuksen (`disabled`-tilat) estääksemme kilpailutilanteet (race conditions).
*   **CSS Muuttujat:** Käytämme `:root`-muuttujia (esim. `--primary-blue`, `--glass-bg`) ylläpitääksemme johdonmukaista "Lasimorfismi"-teemaa.
*   **Responsiivinen:** Asettelu joustaa (CSS Flexbox) mukautuakseen eri näyttökokoihin, varmistaen kalenterin käytettävyyden.
*   **Pysyvyys:** `json-server` kirjoittaa levylle välittömästi, joten data selviää palvelimen uudelleenkäynnistyksistä.
