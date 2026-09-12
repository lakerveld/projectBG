# Locaties en quizzen beheren

## Inhoud

Bewerk [content/locatiequizzen.md](../content/locatiequizzen.md). Het nummer is het
nummer op de kaart. Elke locatie heeft een naam, vraag, vier antwoorden, één juist
antwoord (A–D) en een bonus. Alleen locatie 1 is al ingevuld. Vul de lege regels in
voor de overige locaties; de beheerpagina laat vrijgeven pas toe als alles compleet is.
Houd iedere waarde op één regel. Publiceer een nieuwe deployment na een wijziging.
Lokaal leest de server wijzigingen meteen. Reeds vrijgegeven quizzen blijven gelijk.

## Lokaal starten

1. Kopieer `.env.example` naar `.env.local`.
2. Stel `JOURNEY_ADMIN_PASSWORD` in op een uniek willekeurig wachtwoord van minimaal
   16 tekens, bijvoorbeeld gegenereerd met `openssl rand -hex 24`.
3. Start `npm run dev`. Open `/beheer` en meld aan met dit wachtwoord.
4. Open `/journey` in een tweede venster. Geef locatie 1 vrij in het beheervenster.
5. Binnen ongeveer vijf seconden verschijnt de ontgrendelmelding. Klik op hexagon 1,
   kies **Activeren**, beantwoord de vraag en bekijk de verdiende kaart.

Zonder Redis gebruikt de ontwikkelserver `.journey-data/state.json`. Dit bestand
staat buiten Git en overleeft het herstarten. Deze fallback is alleen voor één lokale
Next-server; productie weigert verzoeken als de gedeelde opslag ontbreekt.

## Gedeeld gebruik op telefoons

Maak een Redis-database met een Upstash-compatible REST API en stel op de hosting in:

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN` (schrijftoken, uitsluitend op de server)
- `JOURNEY_ADMIN_PASSWORD` (uitsluitend delen met begeleiders)
- `JOURNEY_GAME_ID` (bijvoorbeeld `matthew`; dezelfde waarde op alle serverinstanties)

De implementatie gebruikt de [Upstash REST API](https://upstash.com/docs/redis/features/restapi)
en een atomische compare-and-set via EVAL om gelijktijdige antwoorden en unlocks
zonder verloren updates te verwerken. De inhoud van het Markdown-bestand wordt
via Next output file tracing meegenomen in de serverdeployment.

Gebruik de HTTPS-URL van dezelfde deployment voor `/beheer` en `/journey`.
Er is één gedeelde speler: Matthew. De speler-URL heeft geen persoonlijk account;
iedereen met toegang tot deze app kan namens deze ene speler antwoorden. Deel die
URL dus alleen met de groep. Alleen een geauthenticeerde begeleider kan locaties
vrijgeven. Het beheerwachtwoord blijft in het geheugen van de beheerpagina en wordt
niet in browseropslag of in een URL gezet. Verversen vraagt opnieuw aanmelden.

## Spelgedrag

- Iedere locatie begint **op slot**.
- Een begeleider kiest **Locatie vrijgeven**: de locatie wordt **beschikbaar**.
- Matthew kiest **Activeren**: de quiz wordt **gestart**. Teruggaan of verversen
  bewaart deze status; via dezelfde hexagon kan hij hervatten.
- Het eerste bevestigde antwoord maakt de locatie **afgerond**, ook bij een fout
  antwoord. Alleen bij een goed antwoord verdient hij de bijbehorende kaart.
- Antwoorden en beloningen worden op de server gecontroleerd en opgeslagen.
  Een herhaald verzoek geeft hetzelfde resultaat en kan geen extra kaart verdienen.
- De verzameling ontwikkelingskaarten toont deze serverkaarten plus bestaande lokale
  kaarten; de oude Bierpaleis-kaart wordt niet dubbel getoond.
- Dobbelworpen en de struikrover keren terug naar de kaart. Quizzen starten via locaties.
- De geopende app ververst iedere vijf seconden en bij terugkeer naar het tabblad of
  herstel van de verbinding. Nieuwe unlocks geven een melding en, indien ondersteund,
  een korte trilling. Dit is geen pushmelding als de app gesloten is.
- Bij verbindingsverlies blijven bekende statussen zichtbaar, maar activeren en een
  antwoord bevestigen vereisen een geslaagde serveropslag. Een melding geeft aan dat
  de verbinding weg is; verzoeken kunnen veilig opnieuw worden geprobeerd.

De resources na dobbelworpen blijven zoals voorheen lokaal op Matthews telefoon.
Dit onderdeel synchroniseert locaties, quizresultaten en de bijbehorende kaarten.
Er is bewust geen resetknop die tijdens het spel resultaten kan wissen. Gebruik voor
een nieuwe productiegame een andere `JOURNEY_GAME_ID`; lokaal kan na stoppen van de
server het ontwikkelbestand worden verwijderd.
