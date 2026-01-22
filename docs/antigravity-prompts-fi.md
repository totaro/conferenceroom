# AntiGravity Promptit Huonevarausjärjestelmän Korjauksiin

## Logiikkavirheiden Korjaukset

### Prompti 1: Lisää Keston Validointi
```
Huonevaraussovelluksessani (server.js) tarvitsen validointia epärealististen varausaikojen estämiseksi. Päivitä validateReservation-funktio siten, että:
- Vaatii vähintään 15 minuutin varausajan
- Asettaa maksimiksi 8 tunnin varausajan
- Lisää validoinnin, joka estää varaukset yli 90 päivää tulevaisuuteen

Säilytä kaikki olemassa oleva validointilogiikka ennallaan.
```

### Prompti 2: Korjaa Kilpailutilanne
```
Server.js-tiedostossani on kilpailutilanteen ongelma, jossa kaksi samanaikaista POST-pyyntöä /reservations-osoitteeseen voivat molemmat läpäistä validoinnin ja luoda päällekkäisiä varauksia. Toteuta yksinkertainen lukitusmekanismi varmistaaksesi, että validointi ja lisäys tapahtuvat atomisesti. Käytä muistinvaraista promise-pohjaista lukitusta, koska käytämme muistinvaraista tallennusta.
```

---

## Koodin Laadun Korjaukset

### Prompti 3: Lisää Ympäristömuuttujien Konfiguraatio
```
Server.js-tiedostossani porttinumero on kovakoodattu. Päivitä se käyttämään ympäristömuuttujia oletusarvolla 3000. Lisää myös kommentti .env-tiedoston luomisesta konfiguraatiota varten.
```

### Prompti 4: Korjaa Tiedostorakenteen Reitti
```
Server.js palvelee staattiset tiedostot 'public'-hakemistosta, mutta index.html on juurihakemistossa. Lisää reitti, joka palvelee index.html-tiedoston juuripolusta ('/'), jotta sovellus toimii oikein.
```

### Prompti 5: Lisää Syötteen Puhdistus
```
Server.js POST /reservations -endpointissa tarvitsen syötteen validointia varmistaakseni, että:
- roomId on kelvollinen merkkijono, ei tyhjä trimmauksen jälkeen
- roomId ei ylitä 50 merkkiä
- Palauta asianmukaiset 400-virhevastaukseet selkeillä viestillä

Säilytä olemassa oleva validointilogiikka.
```

### Prompti 6: Poista Globaalit Funktiot
```
Index.html-tiedostossani deleteReservation-funktio on määritelty globaalisti ja kutsutaan onclick-attribuuttien kautta. Refaktoroi tämä käyttämään tapahtumien delegointia sen sijaan. Lisää tapahtumankuuntelija listDiv-elementtiin, joka käsittelee peruutuspainikkeiden klikkaukset, ja päivitä renderList-funktio käyttämään data-attribuutteja inline onclick:in sijaan.
```

### Prompti 7: Yhdistä Virheiden Näyttö
```
Index.html-tiedostossani virheiden käsittely on epäjohdonmukaista - jotkin virheet käyttävät alert()-funktiota ja toiset errorDisplay-diviä. Päivitä kaikki virheiden käsittely käyttämään yhtä johdonmukaista lähestymistapaa. Käytä errorDisplay-diviä lomakkeen lähetysvirheille ja näytä väliaikainen ilmoitus poiston onnistumisesta/epäonnistumisesta alertien sijaan.
```

---

## Virheiden Käsittelyn Korjaukset

### Prompti 8: Paranna Fetch-virheiden Käsittelyä
```
Index.html-tiedostossani fetchReservations-funktio käsittelee virheet, mutta vain kirjaa ne konsoliin. Päivitä se siten, että:
- Tarkistaa, onko vastaus ok ennen JSON:n jäsentämistä
- Näyttää käyttäjäystävällisen virheviestin listDiv-elementissä, kun haku epäonnistuu
- Sisällyttää virheen console logiin debuggausta varten
```

### Prompti 9: Paremmat Virheviestit Poistossa
```
Index.html-tiedostossani deleteReservation-funktio näyttää yleisiä virheviestejä. Paranna sitä siten, että:
- Erottaa verkkovirheet ja palvelinvirheet
- Näyttää tarkempia virheviestejä käyttäjille
- Säilytä vahvistusikkuna, mutta paranna onnistumis-/virhepalautetta
```

### Prompti 10: Lisää Vastausstatuksen Tarkistukset
```
Index.html-tiedoston lomakkeen lähetyskäsittelijässä lisää asianmukainen vastausstatuksen tarkistus ennen JSON:n jäsentämistä ja tarjoa tarkempia virheviestejä virheen tyypin perusteella (verkkovirhe vs palvelinvirhe vs validointivirhe).
```

---

## Rakenteen Parannukset

### Prompti 11: Lisää Pyyntöjen Lokituksen Middleware
```
Server.js-tiedostooni lisää yksinkertainen lokitus-middleware, joka kirjaa jokaisen saapuvan pyynnön sisältäen:
- Aikaleiman (ISO-muodossa)
- HTTP-metodin
- Pyyntöpolun

Sijoita se ennen reittien määrittelyjä.
```

### Prompti 12: Erota JavaScript HTML:stä
```
Index.html-tiedostossani kaikki JavaScript on <script>-tagissa. Siirrä se erilliseen tiedostoon nimeltä 'app.js' ja päivitä HTML viittaamaan siihen. Varmista, että skripti ladataan defer-attribuutilla.
```

### Prompti 13: Lisää Latauksen Indikaattorit
```
Index.html-tiedostooni lisää lataustilojen indikaattorit:
- Näytä "Ladataan..." varauslistassa haun aikana
- Poista lähetä-painike käytöstä ja näytä "Varataan..." varauksen luonnin aikana
- Palauta painike käyttöön pyynnön valmistuttua
```

### Prompti 14: Paranna Virhevasteen Rakennetta
```
Server.js-tiedostossani standardoi kaikki virhevastaukseet palauttamaan yhdenmukaisia JSON-objekteja 'error'-kentällä. Lisää myös 500-virhekäsittelijä middleware loppuun, joka käsittelee kaikki käsittelemättömät virheet ja palauttaa asianmukaisen JSON-vastauksen.
```

---

## Lisäparannusten Promptit

### Prompti 15: Lisää Onnistumisen Ilmoitukset
```
Index.html-tiedostooni lisää uudelleenkäytettävä ilmoitusjärjestelmä, joka näyttää väliaikaisia onnistumis-/virheviestejä sivun yläosassa alert()-funktion sijaan. Viestien tulee hävitä automaattisesti 3 sekunnin kuluttua ja niiden tulee olla tyylitelty asianmukaisesti (vihreä onnistumiselle, punainen virheelle).
```

### Prompti 16: Lisää Lomakkeen Validointi
```
Index.html-varaslomakkeeseen lisää asiakaspuolen validointi ennen lähetystä:
- Tarkista, että lopetusaika on aloitusajan jälkeen
- Tarkista, että aloitusaika on tulevaisuudessa
- Näytä validointivirheet errorDisplay-divissä
- Estä lomakkeen lähetys, jos validointi epäonnistuu
```

### Prompti 17: Lisää Kommentit ja Dokumentaatio
```
Server.js-tiedostooni lisää JSDoc-tyylisiä kommentteja:
- validateReservation-funktiolle selittäen jokainen validointisääntö
- Jokaiselle API-endpointille selittäen parametrit, vastaukset ja statuskoodit
- Lisää inline-kommentteja monimutkaiselle logiikalle
```

### Prompti 18: Paranna Päivämäärän Näyttöä
```
Index.html-tiedoston renderList-funktiossa paranna päivämäärän muotoilua siten, että:
- Näyttää päivämäärät luettavammassa muodossa (esim. "22. tammikuuta 2026 klo 14:30")
- Lisää viikonpäivän
- Käyttää johdonmukaista locale-tietoista muotoa
```

---

## Käyttöohjeet

1. **Kopioi yksi prompti kerrallaan** ja liitä se AntiGravityyn
2. **Tarkista muutokset**, jotka Claude tekee
3. **Testaa toiminnallisuus** varmistaaksesi, että se toimii oikein
4. **Siirry seuraavaan promptiin**, kun olet tyytyväinen

## Suositeltu Järjestys

Parhaan tuloksen saamiseksi käytä korjaukset tässä järjestyksessä:

**Kriittiset korjaukset ensin:**
1. Prompti 2 (Kilpailutilanne)
2. Prompti 1 (Keston validointi)
3. Prompti 4 (Tiedostorakenne)

**Koodin laadun parannukset:**
4. Prompti 5 (Syötteen puhdistus)
5. Prompti 3 (Ympäristökonfiguraatio)
6. Prompti 11 (Lokitus)

**Virheiden käsittely:**
7. Prompti 8 (Fetch-virheiden käsittely)
8. Prompti 9 (Poiston virheet)
9. Prompti 10 (Lomakkeen virheiden käsittely)

**Rakenne ja käyttökokemus:**
10. Prompti 6 (Poista globaalit)
11. Prompti 7 (Yhdistä virheet)
12. Prompti 13 (Latauksen indikaattorit)
13. Prompti 15 (Onnistumisen ilmoitukset)

**Viimeistely:**
14. Prompti 16 (Lomakkeen validointi)
15. Prompti 18 (Päivämäärän näyttö)
16. Prompti 12 (Erota JS)
17. Prompti 17 (Dokumentaatio)
18. Prompti 14 (Virheen rakenne)

---

## Vinkkejä Näiden Promptien Käyttöön

- **Ole tarkka**: Jos AntiGravityn ratkaisu ei vastaa tarpeitasi, lisää yksityiskohtia
- **Testaa vaiheittain**: Älä käytä kaikkia muutoksia kerralla
- **Pidä varmuuskopiot**: Tallenna toimivat versiot ennen suuria muutoksia
- **Yhdistä promptit**: Jos ne liittyvät toisiinsa, voit yhdistää 2-3 promptia yhteen pyyntöön
- **Pyydä selitystä**: Lisää "Selitä muutokset" ymmärtääksesi, mitä muutettiin