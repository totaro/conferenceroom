# Huonevaraussovellus - Koodianalyysi

## Yleiskatsaus
Tämä dokumentti tarjoaa kattavan analyysin huonevaraussovelluksesta ja tunnistaa ongelmat logiikassa, koodin laadussa, virheiden käsittelyssä ja rakenteessa.

---

## Logiikkavirheet

### 1. Puuttuva validointi keston rajoille
**Ongelma:** Ei ole tarkistusta minimi- tai maksimivaurasajoille. Käyttäjät voisivat varata huoneen 5 minuutiksi tai 5 vuodeksi.

**Vaikutus:** Voisi johtaa epäkäytännöllisiin tai väärinkäytettyihin varauksiin.

### 2. Ei validointia järkevälle aikavälle
**Ongelma:** Käyttäjät voisivat potentiaalisesti varata huoneita vuosikymmeniä tulevaisuuteen.

**Vaikutus:** Epärealistiset varaukset tukkivat järjestelmän.

### 3. Kilpailutilanteen haavoittuvuus
**Ongelma:** Validoinnin ja luonnin välillä `POST /reservations` -pyynnössä toinen pyyntö voisi luoda päällekkäisen varauksen. Tarkistus ja lisäys eivät ole atomisia.

**Vaikutus:** Kaksi samanaikaista pyyntöä voisi molemmat läpäistä validoinnin ja luoda päällekkäisiä varauksia.

---

## Koodin Laatu ja Luettavuus

### 1. Muistinvarainen tallennus on hauras
**Ongelma:** Kaikki varaukset menetetään palvelimen uudelleenkäynnistyksessä. Tuotantosovellukselle tarvittaisiin tietokanta.

**Vaikutus:** Datan menetys palvelimen uudelleenkäynnistyksessä, ei sovellu tuotantoon.

### 2. Magic values
**Ongelma:** `roomId` on kovakoodattu `'room-1'`:ksi frontendissa, mutta backend hyväksyy minkä tahansa room ID:n.

**Vaikutus:** Epäjohdonmukaisuus frontendin ja backendin välillä, mahdollista hämmennystä.

### 3. Epäjohdonmukainen virheiden käsittely
**Ongelma:** Jotkut virheet näyttävät alertit, toiset näkyvät error divissä.

**Vaikutus:** Huono käyttökokemus epäjohdonmukaisen palautteen kanssa.

### 4. Globaali funktio
**Ongelma:** `deleteReservation()` on määritelty globaalina funktiona käyttäen `onclick`-attribuutteja, mikä on vanhentunut käytäntö.

**Vaikutus:** Saastuttaa globaalin nimiavaruuden, vaikeampi ylläpitää.

### 5. Ei syötteen puhdistusta
**Ongelma:** Room ID:t ja muut syötteet eivät ole validoituja olemassaolon tarkistusten lisäksi.

**Vaikutus:** Potentiaali injektiohyökkäyksiin tai väärin muotoiltuun dataan.

---

## Virheiden Käsittely

### 1. Hiljaiset epäonnistumiset
**Ongelma:** `fetchReservations()` käsittelee virheet mutta vain kirjaa ne konsoliin, ei anna käyttäjäpalautetta.

**Vaikutus:** Käyttäjät eivät tiedä milloin jokin menee pieleen.

### 2. Yleiset virheviestit
**Ongelma:** Verkkovirheet eivät erota eri virhetyyppejä.

**Vaikutus:** Vaikea käyttäjien ymmärtää, mikä meni pieleen.

### 3. Ei uudelleenyrityslogiikkaa
**Ongelma:** Ohimenevät verkkovirheet vaativat manuaalisen sivun päivityksen.

**Vaikutus:** Huono käyttökokemus väliaikaisten verkko-ongelmien aikana.

---

## Rakenne

### 1. Ei vastuiden erottelua
**Ongelma:** Kaikki frontend JavaScript on inline HTML:ssä.

**Vaikutus:** Vaikeampi ylläpitää ja testata.

### 2. Puuttuva middleware
**Ongelma:** Ei pyyntöjen lokitusta, CORS-käsittelyä tai turvallisuusotsikoita.

**Vaikutus:** Vaikeampi debugata, mahdollisia turvallisuushaavoittuvuuksia.

### 3. Ei ympäristökonfiguraatiota
**Ongelma:** Portti ja muut asetukset ovat kovakoodattuja.

**Vaikutus:** Vaikea ottaa käyttöön eri ympäristöissä.

### 4. Puuttuva staattisten tiedostojen reitti
**Ongelma:** Palvelin palvelee `/public`-hakemistosta, mutta `index.html` ei ole siinä hakemistossa tiedostorakenteen perusteella.

**Vaikutus:** Sovellus ei toimi ilman tiedostosijainnin korjaamista.

---

## Suositellut Korjaukset

### 1. Lisää validointi varauskestolle

```javascript
// validateReservation-funktiossa
const durationMs = end - start;
const minDuration = 15 * 60 * 1000; // 15 minuuttia
const maxDuration = 8 * 60 * 60 * 1000; // 8 tuntia

if (durationMs < minDuration) {
    return "Varauksen tulee olla vähintään 15 minuuttia pitkä.";
}

if (durationMs > maxDuration) {
    return "Varaus ei voi ylittää 8 tuntia.";
}

// Lisää myös järkevä tulevaisuuden raja
const maxFutureDays = 90;
const maxFutureDate = new Date(now.getTime() + maxFutureDays * 24 * 60 * 60 * 1000);
if (start > maxFutureDate) {
    return `Varauksia voi tehdä vain ${maxFutureDays} päivää etukäteen.`;
}
```

### 2. Korjaa tiedostorakenteen ongelma

```javascript
// server.js:ssä, lisää tämä reitti palvelemaan index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
```

### 3. Paranna virheiden käsittelyä frontendissä

```javascript
async function fetchReservations() {
    try {
        const response = await fetch(`/reservations?roomId=${roomId}&_=${Date.now()}`);
        if (!response.ok) {
            throw new Error(`HTTP-virhe! status: ${response.status}`);
        }
        const data = await response.json();
        renderList(data);
    } catch (err) {
        console.error('Haku epäonnistui:', err);
        listDiv.innerHTML = '<p style="color: red;">Varausten lataus epäonnistui. Ole hyvä ja päivitä sivu.</p>';
    }
}
```

### 4. Käytä tapahtumien delegointia inline onclick:in sijaan

```javascript
// Lisää tämä fetchReservations()-määrittelyn jälkeen
listDiv.addEventListener('click', async (e) => {
    if (e.target.tagName === 'BUTTON' && e.target.dataset.id) {
        await deleteReservation(e.target.dataset.id);
    }
});

// Päivitä renderList käyttämään data-attribuutteja
div.innerHTML = `
    <span>
        <strong>Alkaa:</strong> ${new Date(res.startTime).toLocaleString()} <br>
        <strong>Päättyy:</strong> ${new Date(res.endTime).toLocaleString()}
    </span>
    <button data-id="${res.id}">Peruuta</button>
`;
```

### 5. Lisää perussyötteen validointi

```javascript
// server.js POST-reitissä
if (typeof roomId !== 'string' || roomId.trim().length === 0) {
    return res.status(400).json({ error: "Virheellinen huone-ID." });
}

if (roomId.length > 50) {
    return res.status(400).json({ error: "Huone-ID liian pitkä." });
}
```

### 6. Lisää pyyntöjen lokituksen middleware

```javascript
// server.js:ssä, ennen reittejä
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});
```

### 7. Lisää ympäristökonfiguraatio

```javascript
// server.js:n alussa
require('dotenv').config(); // Jos käytät dotenv-pakettia
const port = process.env.PORT || 3000;
```

### 8. Käsittele kilpailutilanne mutexilla tai transaktiolla

```javascript
// Yksinkertainen muistinvarainen ratkaisu (tuotantoon käytä tietokantratransaktioita)
let reservationLock = Promise.resolve();

app.post('/reservations', async (req, res) => {
    const { roomId, startTime, endTime } = req.body;

    if (!roomId || !startTime || !endTime) {
        return res.status(400).json({ error: "Pakolliset kentät puuttuvat." });
    }

    // Odota, että kaikki odottavat varausoperaatiot valmistuvat
    reservationLock = reservationLock.then(async () => {
        const error = validateReservation({ roomId, startTime, endTime });
        if (error) {
            return res.status(400).json({ error });
        }

        const newReservation = {
            id: crypto.randomUUID(),
            roomId,
            startTime,
            endTime
        };

        reservations.push(newReservation);
        res.status(201).json(newReservation);
    }).catch(err => {
        res.status(500).json({ error: "Sisäinen palvelinvirhe" });
    });
});
```

---

## Lisäsuositukset

### Turvallisuusparannukset
- Lisää rate limiting väärinkäytön estämiseksi
- Toteuta autentikointi ja auktorisaatio
- Lisää CSRF-suojaus
- Puhdista kaikki käyttäjäsyötteet
- Lisää turvallisuusotsikot (helmet.js)

### Suorituskykyparannukset
- Lisää tietokannan indeksointi kyselyille
- Toteuta välimuistiin tallennus usein käytetylle datalle
- Lisää sivutus suurille varauslistoille

### Käyttökokemuksen Parannukset
- Lisää latauksen indikaattorit
- Toteuta optimistiset UI-päivitykset
- Lisää vahvistus onnistuneille operaatioille
- Näytä selkeämpiä virheviestejä palautusehdotuksilla
- Lisää lomakkeen validointi ennen lähetystä

### Testaus
- Lisää yksikkötestit validointilogiikalle
- Lisää integraatiotestit API-endpointeille
- Lisää end-to-end-testit käyttäjätyönkuluille

---

## Johtopäätös

Vaikka sovellus tarjoaa perushuonevarausten toiminnallisuuden, siinä on useita ongelmia, jotka tulisi käsitellä ennen tuotantokäyttöä. Kriittisimmät ongelmat ovat:

1. Kilpailutilanne varauksen luonnissa
2. Pysyvyyden puute (muistinvarainen tallennus)
3. Puuttuva validointi kestolle ja aikaväleille
4. Epäjohdonmukainen virheiden käsittely

Näiden ongelmien käsittely tekee sovelluksesta robustimman, ylläpidettävämmän ja tuotantovalmiimman.