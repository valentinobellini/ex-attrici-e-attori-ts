// 📌 Milestone 1
// Crea un type alias Person per rappresentare una persona generica.

// Il tipo deve includere le seguenti proprietà:

// id: numero identificativo, non modificabile
// name: nome completo, stringa non modificabile
// birth_year: anno di nascita, numero
// death_year: anno di morte, numero opzionale
// biography: breve biografia, stringa
// image: URL dell'immagine, stringa

type Person = {
  readonly id: number,
  readonly name: string,
  birth_year: number,
  death_year?: number,
  biography: string,
  image: string
}



// 📌 Milestone 2
// Crea un type alias Actress che oltre a tutte le proprietà di Person, aggiunge le seguenti proprietà:

// most_famous_movies: una tuple di 3 stringhe
// awards: una stringa
// nationality: una stringa tra un insieme definito di valori.
// Le nazionalità accettate sono: American, British, Australian, Israeli-American, South African, French, Indian, Israeli, Spanish, South Korean, Chinese.

type nationality =
  | 'American'
  | 'British'
  | 'Australian'
  | 'Israeli-American'
  | 'South African'
  | 'French'
  | 'Indian'
  | 'Israeli'
  | 'Spanish'
  | 'South Korean'
  | 'Chinese'

type Actress = Person & {
  most_famous_movies: [string, string, string],
  awards: string,
  nationality: nationality
}


// 📌 Milestone 3
// Crea una funzione getActress che, dato un id, effettua una chiamata a:

// GET /actresses/:id
// La funzione deve restituire l’oggetto Actress, se esiste, oppure null se non trovato.

// Utilizza un type guard chiamato isActress per assicurarti che la struttura del dato ricevuto sia corretta.


function isActress(dati: unknown): dati is Actress {
  return (
    typeof dati === 'object' && dati !== null &&
    'id' in dati && typeof dati.id === 'number' &&
    'name' in dati && typeof dati.name === 'string' &&
    'birth_year' in dati && typeof dati.birth_year === 'number' &&
    'death_year' in dati && typeof dati.death_year === 'number' &&
    'biography' in dati && typeof dati.biography === 'string' &&
    'image' in dati && typeof dati.image === 'string' &&
    'most_famous_movies' in dati &&
    dati.most_famous_movies instanceof Array &&
    dati.most_famous_movies.length === 3 &&
    dati.most_famous_movies.every(m => typeof m === 'string') &&
    'awards' in dati && typeof dati.awards === 'string' &&
    'nationality' in dati && typeof dati.nationality === 'string'
  )
}

async function getActress(id: number): Promise<Actress | null> {
  try {
    const response = await fetch(`http://localhost:3333/actresses/${id}`);
    const dati: unknown = await response.json();

    console.log('📦 Dati ricevuti:', dati);

    if (!isActress(dati)) {
      throw new Error("Formato dati no nvalido");
    }
    return dati;
  } catch (err) {
    if (err instanceof Error) {
      console.error('Errore durante il recupero dei dati attrice', err);
    } else {
      console.error('Errore sconosciuto', err);

    }
    return null
  }
}


getActress(1).then(actress => {
  console.log('✅ Risultato:', actress);
});





// 📌 Milestone 4
// Crea una funzione getAllActresses che chiama:

// GET /actresses
// La funzione deve restituire un array di oggetti Actress.

// Può essere anche un array vuoto.


async function getAllActresses(): Promise<Actress[]> {
  try {
    const response = await fetch(`http://localhost:3333/actresses`);
    if (!response.ok) {
      throw new Error(`Errore HTTP ${response.status}: ${response.statusText}`);
    }
    const dati: unknown = await response.json();
    if (!(dati instanceof Array)) {
      throw new Error("Formato dati non valido");
    }
    const validActress: Actress[] = dati.filter(a => isActress(a));
    return validActress;
  } catch (err) {
    if (err instanceof Error) {
      console.error('Errore durante il recupero dei dati attrice', err);
    } else {
      console.error('Errore sconosciuto', err);

    }
    return [];
  }
}





// 📌 Milestone 5
// Crea una funzione getActresses che riceve un array di numeri (gli id delle attrici).

// Per ogni id nell’array, usa la funzione getActress che hai creato nella Milestone 3 per recuperare l’attrice corrispondente.

// L'obiettivo è ottenere una lista di risultati in parallelo, quindi dovrai usare Promise.all.

// La funzione deve restituire un array contenente elementi di tipo Actress oppure null (se l’attrice non è stata trovata).


async function getActresses(ids: number[]): Promise<(Actress | null)[]> {


  try {
    const promises = ids.map(id => getActress(id));
    const actresses = await Promise.all(promises);
    return actresses
  } catch (err) {
    if (err instanceof Error) {
      console.error('Errore durante il recupero dei dati attrice', err);
    } else {
      console.error('Errore sconosciuto', err);

    }
    return [];
  }
}