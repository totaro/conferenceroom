# 🚀 Projektin Kehitys: Prototyypistä Tuotantoon

Tämä dokumentti vertailee kahta rakentamaamme versiota neuvotteluhuoneiden varausjärjestelmästä. Siinä selitetään tekniset erot, kuinka ne toimivat konepellin alla ja miksi päivitimme moderniin teknologiaan.

---

## 1. Versio 1: MVP (Minimum Viable Product)
**Teknologiapino:** `Node.js` (Backend) + `Vanilla JavaScript` (Frontend) + `HTML/CSS`

### Kuinka Se Toimii
Ensimmäinen versio oli "Perinteinen Web-sovellus". Se luotti palvelimen tekevän suurimman osan raskaasta työstä tai yksinkertaisesta suorasta selaimen manipuloinnista.

*   **Tiedostot:** `index.html`, `style.css`, `app.js`.
*   **Logiikka:** JavaScript oli suoraan vuorovaikutuksessa "DOM":in (Document Object Model) kanssa. Varauksen lisäämiseksi koodi etsi manuaalisesti listaelementin ja lisäsi uuden listaitem-merkkijonon.
*   **Data:** Data oli usein väliaikaista (katosi päivitettäessä) tai yksinkertaista tiedostotallennusta.

### Arkkitehtuurikaavio
```text
+----------+          +--------------+          +----------+
| Käyttäjä | -------> | DOM Kuuntelija | -------> | HTML UI  |
+----------+          +--------------+          +----------+
                              |
                              v
                      +--------------+
                      | Node Palvelin|
                      +--------------+
                              |
                              v
                  +-----------------------+
                  | reservations.json     |
                  +-----------------------+
```

### ✅ Edut
*   **Yksinkertainen:** Erittäin helppo ymmärtää aloittelijoille.
*   **Ei Rakennusvaihetta:** Muokkaa vain tiedostoa ja päivitä selain.

### ❌ Haitat
*   **"Spagettikoodi":** Ominaisuuksien kasvaessa käyttöliittymälogiikan sekoittaminen datalogiikkaan tekee tiedostoista valtavia ja vaikeasti hallittavia.
*   **Vaikea Skaalata:** Monimutkaisten ominaisuuksien, kuten raahaa-ja-pudota -kalenterin, lisääminen vaatii tuhansia rivejä alusta asti kirjoitettua koodia.
*   **Hitaat Päivitykset:** Vaatii usein koko sivun uudelleenlataamisen muutosten näkemiseksi.

---

## 2. Versio 2: Moderni Sovellus
**Teknologiapino:** `React` (Frontend Kirjasto) + `Vite` (Rakennustyökalu) + `JSON Server` (REST API)

### Kuinka Se Toimii
Tämä on **Single Page Application (SPA)**. Sen sijaan että selain lataisi sivuja uudelleen, React ottaa ohjat. Se toimii kuin työpöytäsovellus selaimen sisällä.

*   **Komponentit:** Jaoimme käyttöliittymän rakennuspalikoihin: `<Calendar />`, `<Modal />`, `<BookingForm />`.
*   **Virtuaalinen DOM:** React pitää "piirustusta" käyttöliittymästä muistissa. Kun data muuttuu (alkuaika, huoneen nimi), React päivittää tehokkaasti *vain* muuttuneen tekstin, ei koko sivua.
*   **Reaktiivinen Tila:** Käytämme "Hookeja" (`useState`, `useEffect`). Kun `reservations`-data haetaan, Kalenteri-komponentti *reagoi* tiukasti uuteen dataan ja piirtää itsensä uudelleen automaattisesti.

### Arkkitehtuurikaavio
```text
     FRONTEND (Selain)                    BACKEND (Palvelin)
+-------------------------+          +-----------------------+
|        Käyttäjä         |          |                       |
|          |              |          |                       |
|          v              |          |                       |
|  +-------------------+  |          |  +-----------------+  |
|  | Komponentit (UI)  |  |          |  | JSON Server API |  |
|  +-------------------+  |          |  +-----------------+  |
|          ^              |          |           ^           |
|          |              |   Haku   |           |           |
|  +-------------------+  |<-------->|           v           |
|  | React Hooks Logiikka|  |          |  +-----------------+  |
|  +-------------------+  |          |  | db.json (TK)    |  |
|          |              |          |  +-----------------+  |
|          v              |          |                       |
|  +-------------------+  |          |                       |
|  | Virtuaali-DOM Diff|  |          |                       |
|  +-------------------+  |          |                       |
+-------------------------+          +-----------------------+
```

### Keskeiset Päivitykset
1.  **Komponenttiarkkitehtuuri:** Koodi on uudelleenkäytettävää. `Button`-logiikka kirjoitetaan kerran ja käytetään kaikkialla.
2.  **REST API:** Frontend ja backend ovat täysin erillisiä. Voisit vaihtaa backendin Pythoniin tai Gohon huomenna, eikä Frontend välittäisi.
3.  **Ekosysteemi:** Otimme käyttöön `react-big-calendar`:in. MVP:ssä meidän olisi pitänyt rakentaa kalenterin matemaattinen ruudukko tyhjästä. Tässä me vain "kytkimme sen päälle".

---

## Yhteenvetovertailu

| Ominaisuus | Versio 1 (MVP) | Versio 2 (Moderni) |
| :--- | :--- | :--- |
| **Päivitykset** | Manuaalinen DOM-manipulaatio (hidas, virhealtis) | Automaattinen Reaktiivisuus (nopea, luotettava) |
| **Rakenne** | Yksi iso `app.js`-tiedosto | Useita järjestettyjä `component.jsx`-tiedostoja |
| **Datavirta** | Vaikea seurata | Selkeä "Props" ja "State" -virta |
| **Tunne** | Tavallinen Verkkosivusto | Mobiilimainen "Sovellus"-kokemus |
| **Ylläpito** | Vaikeaa kasvaessa | Helppo laajentaa ja testata |

### Johtopäätös
**Versio 1** todisti, että *idea* oli hyvä.
**Versio 2** rakensi *tuotteen*, joka on kestävä, skaalautuva ja valmis todelliseen maailmaan. Ottamalla Reactin käyttöön saimme erityisiä turvatoimia (kuten validointitilat) ja tehokkaita UI-työkaluja (varoitukset, ilmoitukset, modaalit), joiden manuaalinen rakentaminen Versiossa 1 olisi vienyt viikkoja.
