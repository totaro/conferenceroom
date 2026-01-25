# ANALYYSI

 1. Tehtävänanto
 2. Työnkulku
 3. Työkalut ja toteutus
 4. Katselmointi
 - 4.1. 1: Mitä tekoäly teki hyvin
 - 4.2. 2: Mitä tekoäly teki hyvin
 - 4.3. 3: Mitkä olivat tärkeimmät parannukset, jotka teit tekoälyn tuottamaan koodiin ja miksi?
 5. Kuvakaappaukset MVP-versiosta
 6. MVP:stä moderniin sovellukseen (React + Vite + JSON Server)
 7. Kuvakaappaukset modernista versiosta
 8. Yhteenveto
 9. Sovelluksen ajaminen




# 1. Tehtävänanto 

Tehtävänä oli toteuttaa yksinkertainen kokoushuoneiden varausrajapinta (API).

## Palvelun tulee tarjota käyttäjille seuraavat toiminnot: 
- Varauksen luonti: Varaa huone tietylle aikavälille. 
- Varauksen peruutus: Poista varaus. 
- Varausten katselu: Listaa kaikki tietyn huoneen varaukset. 

## Toimintalogiikka (business rules): 
- Varaukset eivät saa mennä päällekkäin (kaksi henkilöä ei voi varata samaa huonetta 
samaan aikaan). 
- Varaukset eivät voi sijoittua menneisyyteen. 
- Aloitusajan täytyy olla ennen lopetusaikaa. 

## Tekniset reunaehdot: 
- Voit käyttää mitä tahansa yleistä ohjelmointikieltä, joka on sinulle tuttu (Python, 
JavaScript/TypeScript, Java, C# tai vastaava). 
- Voit käyttää muistinvaraista tietokantaa (in-memory database), jotta ympäristön 
pystytys pysyy yksinkertaisena (esim. PostgreSQL tai MySQL-asennusta ei vaadita). 
Muuta huomioitavaa: 
- Kuten oikeissakin työtehtävissä, tehtävänanto ei välttämättä sisällä kaikkea tarvittavaa 
informaatiota. Koska käytettävissä ei ole “asiakasta” jolta kysyä lisätietoja, niin tehtävän 
läpiviemiseksi saat tehdä itse oletuksia, kunhan dokumentoit tekemäsi oletukset. 


# 2. Työnkulku 

## Vaihe 1: Tekoäly parikoodaajana 
Käytä valitsemaasi tekoälytyökalua API:n toteutuksen luomiseen. Voit iteroida tekoälyn kanssa 
vapaasti: pyydä sitä korjaamaan virheitä, selittämään logiikkaa tai muokkaamaan projektin 
rakennetta. 
Vaatimus: Dokumentoi keskustelusi. Kopioi käyttämäsi kehotteet (promptit) ja tekoälyn 
vastaukset tiedostoon nimeltä PROMPTIT.md repositoryn juureen. 
Tarkistuspiste: Kun tekoäly on tuottanut toimivan ratkaisun (koodin ajaminen onnistuu ja se 
täyttää perusvaatimukset), alusta Git-repository. 
- Commit #1: Tee commit tästä raa'asta, tekoälyn generoimasta koodista. 
- Commit-viesti: Alkuperäinen AI-generoitu commit 

## Vaihe 2: Ihmisen vuoro 
Ota projekti nyt omaan hallintaasi. Vastuu teknisestä toteutuksesta on nyt sinulla. Korjaa asiat, 
jotka tekoälyltä jäi huomaamatta tai jotka se toteutti huonosti. Voit edelleen hyödyntää 
tekoälyä, mutta muista jatkaa kehotteiden dokumentointia PROMPTIT.md-tiedostoon. 

Katselmoi vaiheessa 1 generoitu koodi. Kiinnitä huomiota esimerkiksi seuraaviin: 
- Logiikkavirheet 
- Koodin laatu ja luettavuus 
- Virheenkäsittely 
- Rakenne 

Toimenpide: Refaktoroi ja korjaa koodi. Tee jokaisesta korjauksesta oma commit. Voit tehdä niin 
monta committia kuin on tarpeen. 
Commit-viestit: Käytä selkeitä viestejä, jotka kuvaavat tehdyn korjauksen (esim. ”refaktorointi: 
Toiminnallisuus X eriytetty omaan moduuliinsa” tai ”korjaus: Lisätty validointi XYZZY-arvoille”). 
Commit-viestit tulee kirjoittaa suomeksi. 

## Vaihe 3: Analyysi 

Luo tiedosto nimeltä ANALYYSI.md. Vastaa siinä seuraaviin kysymyksiin suomeksi: 

1. Mitä tekoäly teki hyvin? 
2. Mitä tekoäly teki huonosti? 
3. Mitkä olivat tärkeimmät parannukset, jotka teit tekoälyn tuottamaan koodiin ja miksi? 

# 3. Työkalut ja toteutus

Alkuräisen sovelluksen tavoitteena oli toteuttaa yksinkertainen kokoushuoneiden varausrajapinta (API). Tämän tein MVP (minimum viable product) -periaatteella, eli pyrin saamaan toimivan perusversion mahdollisimman nopeasti. 

Tavoitteet MVP:n luomiseen olivat:

Luo minimaalinen MVP, joka mahdollistaa käyttäjille seuraavat toiminnot:

-  Varauksen luominen
-  Olemassa olevien varausten tarkastelu huoneelle
-  Varauksen peruuttaminen

Laajuus ja rajoitteet

- Oleta yksi neuvotteluhuone, jonka kiinteä roomId = "room-1"
- Ei tunnistautumista tai käyttäjätilejä
- Ei tyylittelyä perusulkoasua enempää
- Keskity oikeellisuuteen, ei designiin

Backend

- Käytä JavaScriptiä (Node.js)
- Käytä muistissa olevaa tietokantaa REST API:n kanssa (tietojen ei tarvitse säilyä palvelimen uudelleenkäynnistyksen jälkeen)

Tarjoa seuraavat rajapinnat:

- POST /reservations – luo varaus
- GET /reservations?roomId=room-1 – listaa varaukset
- DELETE /reservations/:id – peruuta varaus

Varaustiedot

- id (merkkijono)
- roomId (merkkijono)
- startTime (ISO-8601-aikaleima)
- endTime (ISO-8601-aikaleima)

Liiketoimintasäännöt (pakollisia palvelinpuolella)

- Aloitusajan täytyy olla ennen lopetusaikaa
- Varauksia ei voi tehdä menneisyyteen
- Varaukset eivät saa mennä päällekkäin saman huoneen osalta

Frontend

- Hyvin yksinkertainen käyttöliittymä
- Näytä lista olemassa olevista varauksista (aloitusaika, lopetusaika, poistonappi)
- Yksinkertainen lomake, jossa on:

    - Aloitusajan syöte
    - Lopetusajan syöte
    - Lähetyspainike

Toiminta

- Sivun latautuessa hae ja näytä varaukset
- Lomakkeen lähetyksessä luo varaus ja päivitä lista
- Poistettaessa varaus, poista se ja päivitä lista
- Näytä validointivirheet pelkkänä tekstinä

Tuotos

- Toimiva MVP, joka demonstroi vain ydintoiminnallisuuden
- Ei ylimääräisiä ominaisuuksia tai optimointeja

Sovelluksen toteuttamisessa (MVP ja jatkokehitys) käytin seuraavia työkaluja:

-   ChatGPT (GPT-5.2): Co-pilot promptien luomiseen
-   Claude.ai (Sonnet 4.5): Koodianalyysi, sovelluksen kehitys sekä Co-pilot promptien luomiseen
-   Antigravity: Sovelluksen luominen ja refaktorointi (Gemini 3 Pro High sekä Claude Sonnet 4.5)

# 4. Katselmointi

Katselmoinnin apuna koodianalyysissä käytin Claude AI:ta (Sonnet 4.5).

# 4.1. Mitä tekoäly teki hyvin? 

## Yleiskatsaus
Tämä osio analysoi AI:n generoimaa koodia huonevaraussovellukselle. Tässä käydään läpi, missä AI onnistui hyvin ja mitä tämä kertoo nykyisistä AI-koodigeneroinnin kyvyistä.

---

## Missä AI Onnistui

### 1. Toimiva peruslogiikka
AI loi toimivan sovelluksen heti alkuun. Perus-CRUD-operaatiot (Create, Read, Delete eli luo, lue, poista) toimivat oikein, mikä on minkä tahansa varausjärjestelmän perusta. Tämä ei ole itsestäänselvyys - monissa käsin koodatuissa sovelluksissa on bugeja perustoiminnallisuuksissa.

**Miksi tämä on tärkeää:** Perusteiden kuntoon saaminen on tärkein osa. Buginen ydin on vaikeampi korjata kuin puuttuvat ominaisuudet.

---

### 2. Fiksu päällekkäisyyden tarkistuslogiikka
Päällekkäisyyden validointi on itse asiassa todella hyvä:
```javascript
return (start < resEnd && end > resStart);
```

Tämä on matemaattisesti oikea tapa tarkistaa päällekkäiset aikavälit. Monet kehittäjät tekevät tämän väärin ensimmäisellä yrityksellä. AI sai sen heti oikein.

**Miksi tämä on tärkeää:** Aikavälien päällekkäisyys on klassinen algoritmihaaste, jossa on helppo epäonnistua. AI valitsi elegantimman ratkaisun.

---

### 3. Kunnollinen RESTful API-suunnittelu
- `GET /reservations` - Listaa varaukset
- `POST /reservations` - Luo varaus
- `DELETE /reservations/:id` - Poista varaus

API seuraa REST-konventioita oikein sopivilla HTTP-metodeilla ja statuskodeilla:
- 201 luomiselle
- 204 poistolle
- 400 validointivirheille
- 404 kun ei löydy

**Miksi tämä on tärkeää:** RESTful-suunnittelu tekee API:sta ennustettavan ja helposti integroitavan muihin järjestelmiin.

---

### 4. UUID ID:lle
`crypto.randomUUID()`:n käyttö peräkkäisten ID:iden tai aikaleiman sijaan on hyvä turvallisuuskäytäntö.

**Miksi tämä on tärkeää:** Estää enumerointihyökkäykset ja ID:iden ennustamisen. Osoittaa turvallisuustietoisuutta jopa yksinkertaisessa prototyypissä.

---

### 5. Validointi ennen muutoksia
AI erotti validointilogiikan omaksi funktiokseen (`validateReservation`) ja tarkistaa kaikki ehdot ennen tietojen muokkaamista.

**Miksi tämä on tärkeää:** Tämä on hyvää vastuiden erottelua ja tekee koodista testattavan. Se noudattaa periaatetta "validoi, sitten muuta".

---

### 6. Käyttäjän vahvistus tuhoisille toiminnoille
```javascript
const userConfirmed = confirm('Are you sure you want to cancel this reservation?');
```

Vahvistusdialogin sisällyttäminen ennen poistamista osoittaa hyvää UX-ajattelua.

**Miksi tämä on tärkeää:** Estää vahingossa tapahtuvat poistot ja noudattaa vakiintuneita UI-malleja, joita käyttäjät odottavat.

---

### 7. ISO-päivämääräformaatti
ISO 8601 -formaatin käyttö päivämäärille (`toISOString()`) on oikea valinta API-kommunikaatioon.

**Miksi tämä on tärkeää:** ISO-formaatti on aikavyöhyketietoinen, yksiselitteinen ja universaalisti jäsennettävissä. Välttää päivämääräformaattien epäjohdonmukaisuuden painajaisen.

---

### 8. Järjestetty näyttö
```javascript
reservations.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
```

Varausten automaattinen järjestäminen kronologisesti tekee käyttöliittymästä hyödyllisemmän.

**Miksi tämä on tärkeää:** Tätä ei erikseen pyydetty, mutta se osoittaa hyvää tuoteajattelua. AI ennakoi käyttäjän tarpeet.

---

### 9. Cache-Busting
```javascript
const response = await fetch(`/reservations?roomId=${roomId}&_=${Date.now()}`);
```

Aikaleiman lisääminen selaimen välimuistiin tallentamisen estämiseksi on hienovarainen mutta tärkeä yksityiskohta.

**Miksi tämä on tärkeää:** Osoittaa huomion todellisiin käyttöönotto-ongelmiin. Monet kehittäjät unohtavat selaimen välimuistiin tallentamisen, kunnes se aiheuttaa bugeja tuotannossa.

---

### 10. Kattavat validointisäännöt
Validointi tarkistaa useita ehtoja:
- Kelvollinen päivämääräformaatti
- Aloitus ennen lopetusta
- Ei menneisyyden varauksia
- Ei päällekkäisyyksiä

**Miksi tämä on tärkeää:** Kattaa tärkeimmät liiketoimintasäännöt, joita odottaisi varausjärjestelmältä. AI ajatteli läpi domain-logiikan.

---

### 11. Siisti, minimalistinen käyttöliittymä
HTML/CSS on yksinkertainen mutta toimiva. Ei ylitekniikkaa monimutkaisilla frameworkeilla, kun vanilla JavaScript riittää tähän käyttötapaukseen.

**Miksi tämä on tärkeää:** Osoittaa sopivat teknologiavalinnat. Kaikki sovellukset eivät tarvitse Reactia tai Vueta.

---

### 12. Puolustava ohjelmointi
Useita esimerkkejä puolustavasta koodauksesta:
- `response.ok`:n tarkistus joissain paikoissa
- Try-catch-lohkot asynkronisille operaatioille
- Taulukon pituuden tarkistus ennen operaatioita
- Päivämäärien tyyppitarkistus `isNaN()`:lla

**Miksi tämä on tärkeää:** Osoittaa tietoisuutta siitä, että asiat voivat mennä pieleen. Koodi ei oleta happy path -skenaarioita.

---

### 13. Hyvä muuttujien nimeäminen
Muuttujat kuten `startTime`, `endTime`, `roomId`, `reservations` ovat selkeitä ja itsedokumentoivia. Ei kryptisiä lyhenteitä.

**Miksi tämä on tärkeää:** Koodin luettavuus on ratkaisevan tärkeää ylläpidon kannalta. Hyvä nimeäminen tekee koodista itsestään selittyvän.

---

### 14. Datan ja esityksen erottelu
`renderList`-funktio erottaa datan hakemisen näyttölogiikasta.

**Miksi tämä on tärkeää:** Tekee käyttöliittymän päivittämisen helpommaksi riippumatta data-operaatioista. Hyvää vastuiden erottelua.

---

## Mitä Tämä Kertoo AI-koodigeneroinnista

### AI:n Vahvuudet

#### 1. Vakiintuneet mallit
AI on erinomainen toteuttamaan vakiintuneita malleja:
- REST API:t
- CRUD-operaatiot
- Yleiset web-sovellusrakenteet

Nämä mallit esiintyvät usein harjoitusdatassa, joten AI toistaa ne luotettavasti.

#### 2. Matemaattinen/Looginen oikeellisuus
Päällekkäisyyden tarkistusalgoritmi osoittaa, että AI pystyy käsittelemään:
- Logiikkaongelmia
- Matemaattista oikeellisuutta
- Reunatapauksia (tunnetuissa skenaarioissa)

#### 3. Parhaat käytännöt
AI noudattaa alan parhaita käytäntöjä, joita se on kohdannut monta kertaa:
- UUID:t turvallisuutta varten
- ISO-päivämäärät johdonmukaisuutta varten
- RESTful-suunnittelu API:lle
- Vastuiden erottelu

#### 4. Nopea prototyyppien luonti
AI luo toimivia prototyyppejä nopeasti:
- Kaikki ydinominaisuudet toiminnallisia
- Ei syntaksivirheitä
- Järkevät oletusarvot
- Heti käyttöönotettavissa testaukseen

#### 5. Yleiset reunatapaukset
Käsittelee usein esiintyviä reunatapauksia:
- Tyhjät listat
- Käyttäjävahvistukset
- Päivämäärän validointi
- Virhevastaukseet

## Keskeiset havainnot

### 1. AI loistaa yleisessä
Mallit, jotka esiintyvät usein harjoitusdatassa, toistetaan tarkasti ja luotettavasti.

### 2. AI noudattaa konventioita
Koodi noudattaa vakiintuneita konventioita ja parhaita käytäntöjä, jotka on hyvin dokumentoitu.

### 3. AI luo toimivaa koodia
Tämä ei ole vain syntaktisesti oikein - se on toiminnallisesti järkevää ja todella toimii.

### 4. Kokemus vs. tieto -aukko
Kuilu AI-generoidun koodin ja tuotantovalmiuden välillä edustaa eroa **tietämisen** ja **kokemisen** välillä.

### 5. Erinomainen lähtökohta
AI-generoitu koodi on erinomainen pohja, jota kokeneet kehittäjät voivat rakentaa ja vahvistaa.

---

## Johtopäätös

Tämä AI-generoitu koodi on aidosti vaikuttava. Se osoittaa, että nykyinen AI pystyy:

✅ Luomaan toimivia sovelluksia tyhjästä  
✅ Toteuttamaan oikeat algoritmit  
✅ Noudattamaan alan parhaita käytäntöjä  
✅ Kirjoittamaan siistiä, luettavaa koodia  
✅ Käsittelemään yleisiä reunatapauksia  

Löytämämme rajoitukset eivät ole epäonnistumisia - ne ovat luonnollinen raja **oppikirjatiedon** ja **taistelussa testatun kokemuksen** välillä. AI loi tarkalleen sen, mitä odottaisi vahvasta teoreettisesta pohjasta ilman todellista tuotantokokemusta.

Kehittäjille tämä tarkoittaa:
- **AI on tehokas prototyyppityökalu** - Saa toimivan koodin nopeasti
- **Ihmisasiantuntemus on edelleen ratkaisevan tärkeää** - Tuotannon vahvistamiseen
- **Parasta yhteistyössä** - AI generoi, ihmiset hioivat
- **Erinomainen oppimisresurssi** - Näe parhaat käytännöt toteutettuna

Se, että analyysissä pystyimme tunnistamaan tiettyjä, korjattavissa olevia ongelmia (eikä perustavanlaatuisia puutteita), osoittaa kuinka pitkälle AI-koodigenerointi on tullut. Tämä koodi ei ole vain demo - se on legitiimi lähtökohta oikealle sovellukselle.





# 4.2. Mitä tekoäly teki huonosti? 


## Yleiskatsaus
Tämä osio analysoi huonevaraussovellusta ja käy läpi ongelmat logiikassa, koodin laadussa, virheiden käsittelyssä ja rakenteessa.

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

 1. Lisää validointi varauskestolle
 2. Korjaa tiedostorakenteen ongelma
 3. Paranna virheiden käsittelyä frontendissä
 4. Käytä tapahtumien delegointia inline onclick:in sijaan
 5. Lisää perussyötteen validointi
 6. Lisää pyyntöjen lokituksen middleware
 7. Lisää ympäristökonfiguraatio
 




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

# 4.3. Mitkä olivat tärkeimmät parannukset, jotka teit tekoälyn tuottamaan koodiin ja miksi?

### Mitä AI Jätti Huomiotta

#### 1. Tuotanto-ongelmat
- Datan pysyvyys (tietokanta-integraatio)
- Kilpailutilanteet samanaikaisessa käytössä
- Skaalautuvuusnäkökulmat
- Suorituskyvyn optimointi

#### 2. Turvallisuuden vahvistaminen
- Rate limiting
- Syvällinen syötteen puhdistus
- CSRF-suojaus
- Turvallisuusotsikot

#### 3. Edistynyt UX
- Lataustilojen indikaattorit
- Progressiivinen parantelu
- Optimistiset UI-päivitykset
- Kattava virheiden palautuminen

#### 4. Virheiden palautumisstrategiat
- Uudelleenyrityslogiikka ohimenevillä virheillä
- Sulava rappeutuminen
- Offline-tuki
- Tilan palautuminen virheiden jälkeen

Koodianalyysin antaman johtopäätöksen perusteella keskityin ensiksi kriittisiin ongelmiin. Ensimmäisenä paransin kilpailutilanteen varauksen luonnissa. Seuraavana paransin puuttuvaa validointia kestolle ja aikaväleille. Kolmantena muutin epäjohdonmukaisen virheiden käsittelyä. Kun nämä kriittiset parannukset oli tehty, tein myös analyysin perusteella muut suositellut parannukset. Pysyvyyden puute oli myös kriittinen ongelma, joten tein seuraavassa vaiheessa kevyen json-serveri ratkaisun jolla tämä ongelma oli ratkaistu.Tästä lisää Kappaleessa 6 (6. MVP:stä moderniin sovellukseen), jossa muutin sovellusta moderniksi, mainittavasti käyttäjäystävällisemmäksi ja laajemmaksi kuin pelkkä MVP.



# 5. Kuvakaappaukset MVP-versiosta

![image](/assets/conferenceroom_screenshot1.png)
![image](/assets/conferenceroom_screenshot2.png)
![image](/assets/conferenceroom_screenshot3.png)
![image](/assets/conferenceroom_screenshot5.png)
![image](/assets/conferenceroom_screenshot6.png)
![image](/assets/conferenceroom_screenshot7.png)
![image](/assets/conferenceroom_screenshot8.png)



# 6. MVP:stä moderniin sovellukseen (`React` + `Vite`  + `JSON Server`)

Modernin sovelluksen kehittämisessä apuna käytin Claudea. Tässä on tekninen arkkitehtuuri- ja yleiskatsaus tästä modernista sovelluksesta.

Tämä osio tarjoaa yhteenvedon huonevaraussovelluksen järjestelmäsuunnitteluun, komponenttilogiikkaan ja datavirtaan.

---

## 📦 Korkean tason arkkitehtuuri

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

## 📂 Projektin rakenne

*   **/frontend**: Reactin lähdekoodi.
    *   `src/App.jsx`: Sovelluksen "Aivot". Hallinnoi globaalia tilaa (`rooms`, `reservations`) ja ohjaa näkymiä.
    *   `src/components/`: (Looginen erottelu) Modaalit, Lomakkeet ja Listat on toteutettu App:in sisällä tai alikomponentteina.
    *   `src/App.css`: Keskitetty Suunnittelujärjestelmä (Muuttujat) ja komponenttikohtainen tyylittely.
*   **/backend**: API ja Pysyvyys.
    *   `db.json`: JSON-tiedosto (Tietokanta). Tallentaa `rooms`- ja `reservations`-taulukot.
    *   `package.json`: Konfiguroi json-serverin käynnistysskriptit.

---

## 🛠️ Ominaisuudet

### 1. Tilanhallinta & datavirta
`App.jsx` käsittelee keskitettyä **Totuuden Lähdettä**.

*   **Alkullataus:** `useEffect` käynnistää samanaikaiset haut osoitteisiin `http://localhost:3001/rooms` ja `reservations`.
*   **Reaktiivisuus:** Kun varaus luodaan (POST) tai poistetaan (DELETE), frontend odottaa palvelimen vastausta (200 OK) ennen datan uudelleenhakua, jotta Kalenterin käyttöliittymä pysyy synkroonissa.

### 2. Kalenterijärjestelmä
Hyödynnetään `react-big-calendar`:ia, joka on kääritty `moment.js`-lokalisoijalla.

*   **Vuorovaikutus:** Aikavälin klikkaaminen laukaisee `handleSelectSlot`-toiminnon, joka nappaa `alku`- ja `loppu`-ajat ja avaa Varaus-modaalin.
*   **Tapahtumat:** Raaka JSON-data mäpätään kalenteriobjekteiksi: `{ title, start: new Date(), end: new Date() }`.

### 3. Älykäs validointilogiikka
Validointi tapahtuu asiakaspuolella (Client Side) ennen kuin yhtään pyyntöä lähetetään.

*   **Päällekkäisyyden tunnistus:** Algoritmi tarkistaa onko `(UusiAlku < OlemassaOlevaLoppu) && (UusiLoppu > OlemassaOlevaAlku)` samassa huoneessa.
*   **Liiketoimintasäännöt:** Estää varauksen menneisyydessä, varauksen ilman huonetta, tai varauksen päättymisajan ennen alkuaikaa.
*   **Palaute:** Asettaa `formErrors`-tilan, joka ehdollisesti renderöi virheviestit syötekenttien alle.

### 4. Visuaalinen palautejärjestelmä
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
*   **CSS muuttujat:** Käytetään `:root`-muuttujia (esim. `--primary-blue`, `--glass-bg`) ylläpitääksemme johdonmukaista "Glassmorphism"-teemaa.
*   **Responsiivinen:** Layout joustaa (CSS Flexbox) mukautuakseen eri näyttökokoihin, varmistaen kalenterin käytettävyyden.
*   **Pysyvyys:** `json-server` kirjoittaa levylle välittömästi, joten data selviää palvelimen uudelleenkäynnistyksistä.


Promptit.md tiedoston `Osio 6: MVP:stä moderniin sovellukseen (kehitysvaihe)` -osiossa nähdään uuden modernin version kehittämisessä käyty keskustelu.


# 7. Kuvakaappaukset modernista versiosta

![image](/assets/conferenceroomv2_screenshot1.png)
![image](/assets/conferenceroomv2_screenshot2.png)
![image](/assets/conferenceroomv2_screenshot3.png)
![image](/assets/conferenceroomv2_screenshot4.png)
![image](/assets/conferenceroomv2_screenshot5.png)
![image](/assets/conferenceroomv2_screenshot6.png)
![image](/assets/conferenceroomv2_screenshot7.png)
![image](/assets/conferenceroomv2_screenshot8.png)  
![image](/assets/conferenceroomv2_screenshot10.png)  
![image](/assets/conferenceroomv2_screenshot11.png)


# 8. Yhteenveto - 🚀 Projektin kehitys: Prototyypistä tuotantoon


Tämä osio vertailee kahta rakentamaani versiota neuvotteluhuoneiden varausjärjestelmästä. Siinä selitetään tekniset erot, kuinka ne toimivat konepellin alla ja miksi päivitimme moderniin teknologiaan.

---

## 1. Versio 1: MVP (Minimum Viable Product)
**Teknologiapino:** `Node.js` (Backend) + `Vanilla JavaScript` (Frontend) + `HTML/CSS`

### Toiminta
Ensimmäinen versio oli "Perinteinen Web-sovellus". Se luotti palvelimen tekevän suurimman osan raskaasta työstä tai yksinkertaisesta suorasta selaimen manipuloinnista.

*   **Tiedostot:** `index.html`, `style.css`, `app.js`.
*   **Logiikka:** JavaScript oli suoraan vuorovaikutuksessa "DOM":in (Document Object Model) kanssa. Varauksen lisäämiseksi koodi etsi manuaalisesti listaelementin ja lisäsi uuden listItem-merkkijonon.
*   **Data:** Data oli usein väliaikaista (katosi päivitettäessä).

### Arkkitehtuurikaavio
```text
+----------+          +--------------+          +----------+
|   User   | -------> | DOM Listener | -------> | HTML UI  |
+----------+          +--------------+          +----------+
                              |
                              v
                      +--------------+
                      | Node Server  |
                      +--------------+
                              |
                              v
                  +-----------------------+
                  | reservations.json     |
                  +-----------------------+
```

### ✅ Edut
*   **Yksinkertainen:** Erittäin helppo ymmärtää aloittelijoille.
*   **Ei rakennusvaihetta:** Muokkaa vain tiedostoa ja päivitä selain.

### ❌ Haitat
*   **"Spagettikoodi":** Ominaisuuksien kasvaessa käyttöliittymälogiikan sekoittaminen datalogiikkaan tekee tiedostoista valtavia ja vaikeasti hallittavia.
*   **Vaikea skaalata:** Monimutkaisten ominaisuuksien, kuten drag-and-drop -kalenterin, lisääminen vaatii tuhansia rivejä alusta asti kirjoitettua koodia.
*   **Hitaat päivitykset:** Vaatii usein koko sivun uudelleenlataamisen muutosten näkemiseksi.

---

## 2. Versio 2: Moderni Sovellus
**Teknologiapino:** `React` (Frontend Kirjasto) + `Vite` (Rakennustyökalu) + `JSON Server` (REST API)

### Toiminta
Tämä on **Single Page Application (SPA)**. Sen sijaan että selain lataisi sivuja uudelleen, React ottaa ohjat. Se toimii kuin työpöytäsovellus selaimen sisällä.

*   **Komponentit:** Käyttöliittymä on rakennettu seuraavista rakennuspalikoista: `<Calendar />`, `<Modal />`, `<BookingForm />`.
*   **Virtuaalinen DOM:** React pitää "piirustusta" käyttöliittymästä muistissa. Kun data muuttuu (alkuaika, huoneen nimi), React päivittää tehokkaasti *vain* muuttuneen tekstin, ei koko sivua.
*   **Reaktiivinen:** Käytämme "Hookeja" (`useState`, `useEffect`). Kun `reservations`-data haetaan, Kalenteri-komponentti *reagoi* uuteen dataan ja piirtää itsensä uudelleen automaattisesti.

### Arkkitehtuurikaavio
```text
     FRONTEND (Browser)                   BACKEND (Server)
+-------------------------+          +-----------------------+
|        User             |          |                       |
|          |              |          |                       |
|          v              |          |                       |
|  +-------------------+  |          |  +-----------------+  |
|  | Components (UI)   |  |          |  | JSON Server API |  |
|  +-------------------+  |          |  +-----------------+  |
|          ^              |          |           ^           |
|          |              |  Fetch   |           |           |
|  +-------------------+  |<-------->|           v           |
|  | React Hooks Logic |  |          |  +-----------------+  |
|  +-------------------+  |          |  | db.json (DB)    |  |
|          |              |          |  +-----------------+  |
|          v              |          |                       |
|  +-------------------+  |          |                       |
|  | Virtual DOM Diff  |  |          |                       |
|  +-------------------+  |          |                       |
+-------------------------+          +-----------------------+
```

### Keskeiset päivitykset
1.  **Komponenttiarkkitehtuuri:** Koodi on uudelleenkäytettävää. `Button`-logiikka kirjoitetaan kerran ja käytetään kaikkialla.
2.  **REST API:** Frontend ja backend ovat täysin erillisiä. Voit vaihtaa backendin Pythoniin tai Gohon huomenna, eikä Frontend välittäisi.
3.  **Ekosysteemi:** Käytettiin `react-big-calendar`:ia. MVP:ssä olisi pitänyt rakentaa kalenterin matemaattinen ruudukko tyhjästä. Tässä vain "kytkimme sen päälle".

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
**Versio 2** rakennettiin *tuote*, joka on kestävä, skaalautuva ja valmis todelliseen maailmaan. Ottamalla Reactin käyttöön saatiin erityisiä turvatoimia (kuten validointitilat) ja tehokkaita UI-työkaluja (varoitukset, ilmoitukset, modaalit), joiden manuaalinen rakentaminen Versiossa 1 olisi vienyt viikkoja.



# 9. Sovelluksen ajaminen

## Run Legacy MVP (Port 3000)
```bash
node server.js
```
→ http://localhost:3000

---

## Run New React + Vite Version

### Terminal 1 - Backend (Port 3001)
```bash
cd backend
npm start
```

### Terminal 2 - Frontend (Port 5173)
```bash
cd frontend
npm run dev
```
→ http://localhost:5173

---

## Run Both Versions Simultaneously
Open 3 terminals and run:
1. `node server.js` (Legacy - port 3000)
2. `cd backend && npm start` (New backend - port 3001)
3. `cd frontend && npm run dev` (New frontend - port 5173)
