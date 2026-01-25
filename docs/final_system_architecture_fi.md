# 🏛️ Lopullinen Järjestelmäarkkitehtuuri: Kuinka Se Toimii

Tämä dokumentti on "Sinikopiot" valmistuneelle **Myyttiset Kaupungit -varausjärjestelmällesi**. Se selittää tarkalleen, kuinka lopullinen sovellus on rakennettu, käyttäen yksinkertaisia termejä ja visuaalisia kaavioita.

---

## 1. Iso Kuva
Sovelluksesi ei ole enää vain yksi tiedosto. Se on **Järjestelmä**, joka koostuu kahdesta erillisestä osasta, jotka keskustelevat keskenään.

```text
       KÄYTTÄJÄN TIETOKONE                    PALVELIN
   +----------------------+           +----------------------+
   |                      |           |                      |
   |   [ FRONTEND ]       |           |    [ BACKEND ]       |
   |   React + Vite       |  <----->  |    JSON Server       |
   |   (Portti 5173)      | Näkymättö-|    (Portti 3001)     |
   |                      | mät johdot|                      |
   +----------------------+           +----------------------+
```

*   **Frontend (Kasvot):** Mitä näet ja klikkaat. Se elää selaimessa.
*   **Backend (Aivot):** Mikä tallentaa datan. Se elää palvelimella.

---

## 2. Frontend Komponentit (Legopalikat)
Rakensimme käyttöliittymän käyttäen **React-komponentteja**. Ajattele näitä legopalikoina. Laitamme pieniä palikoita yhteen tehdäksemme koko sovelluksen.

### Visuaalinen Komponenttipuu
Näin ruutusi on rakennettu:

```text
+-------------------------------------------------------+
|  <App />  (Säiliö)                                    |
|                                                       |
|  +-------------------------------------------------+  |
|  |  <Notification />  (Pop-up Ilmoitukset)         |  |
|  +-------------------------------------------------+  |
|                                                       |
|  +-------------------------------------------------+  |
|  |  Huoneenvalinta (Pudotusvalikko)                |  |
|  +-------------------------------------------------+  |
|                                                       |
|  +-------------------------------------------------+  |
|  |  <Calendar />                                   |  |
|  |  (Iso Ruudukko: react-big-calendar)             |  |
|  +-------------------------------------------------+  |
|                                                       |
|       (Kun klikkaat aikaa...)                         |
|       v                                               |
|  +-------------------------------------------------+  |
|  |  <Modal>                                        |  |
|  |     +---------------------------------------+   |  |
|  |     |  <BookingForm />                      |   |  |
|  |     |  (Syötteet, Validointilogiikka)       |   |  |
|  |     +---------------------------------------+   |  |
|  +-------------------------------------------------+  |
|                                                       |
+-------------------------------------------------------+
```

---

## 3. Datan Matka ("Tallennus"-reissu)
Mitä tapahtuu kun klikkaat **"Vahvista Varaus"**? Data lähtee matkalle.

### Askel-askeleelta Virta

1.  **Valmistelu:** `BookingForm` kerää syötteesi (Nimi, Aika, Huone).
2.  **Validointi:** Sovellus tarkistaa: *"Onko huone täysi? Onko aika menneisyydessä?"*
    *   ❌ Jos Huono: Näyttää Punaisen Virheen.
    *   ✅ Jos Hyvä: Pakkaa datan JSON-paketiksi.
3.  **Lähetys:** React käyttää `fetch()`-komentoa lähettääkseen paketin Porttiin 3001.

```text
    SELAIN                                     API (Portti 3001)
   +---------+                                +---------------+
   | React   | --(POST /reservations)------>  |  JSON Server  |
   +---------+        {data}                  +---------------+
        ^                                             |
        |                                             | (Kirjoittaa levylle)
        |                                             v
   (Päivitä UI)                               +---------------+
   (Näytä Onnistui) <--(201 Created)--------  |  db.json      |
                                              +---------------+
```

4.  **Vahvistus:** Palvelin sanoo "OK" (201 Created).
5.  **Reaktio:**
    *   Modaali sulkeutuu.
    *   Vihreä Toast-ilmoitus ponnahtaa esiin (`<Notification />`).
    *   Kalenteri päivittyy automaattisesti näyttämään uuden sinisen palikan.

---

## 4. Käytetyt Avainteknologiat

| Teknologia | Rooli | Miksi käytimme sitä? |
| :--- | :--- | :--- |
| **React** | Kehys | Tekee käyttöliittymästä "Älykkään" ja reaktiivisen. |
| **Vite** | Rakentaja | Tekee kehityksestä supernopeaa (Hot Reload). |
| **Moment.js** | Aika | Käsittelee "Maanantai-aloituksen" ja päivämäärät oikein. |
| **CSS Variables** | Tyylittely | Helpottaa "Teeman" (värit/fontit) muuttamista yhdestä paikasta. |
| **JSON Server** | Tietokanta | Täysi Vale-API ilman monimutkaista SQL-asennusta. |

---

## 5. Tulevaisuuden Mahdollisuudet 🚀
Nyt kun sinulla on tämä vankka arkkitehtuuri, voit helposti lisätä:
*   **Käyttäjäkirjautuminen:** Tunnista kuka varaa ("Matti" vs "Maija").
*   **Oikea Tietokanta:** Vaihda `db.json` MongoDB:hen tai PostgreSQL:ään (Vain Backend muuttuu!).
*   **Sähköposti-ilmoitukset:** Lähetä oikeita sähköposteja kun varaus vahvistetaan.
