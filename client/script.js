
//import(e) from 'express';
import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form')
const chatContainer = document.querySelector('#chat_container')


// Izbacivanje rezultata pretrage 

let ucitavanjeIntervala


function loader(vrednost) {

  vrednost.sadrzajTeksta = ''

  ucitavanjeIntervala = setInterval(() => {
    vrednost.sadrzajTeksta = '.';

    if (vrednost.sadrzajTeksta === '....') {
      vrednost.sadrzajTeksta = '';
    }
  }, 300);
}


//  Funkcija za unosenje teksta

function ukucajTekst(vrednost, tekst) {

  let index = 0;

  let interval = setInterval(() => {

    if (index < tekst.length) {
      vrednost.innerHTML += tekst.charAt(index)

      index++
    } else {
      clearInterval(interval);
    }

  }, 20)

}

// Generisanje ID-a svake pojedinacne poruke

function generisiJedinstveniID() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}

// Cet  odeljak (  kolona )da li smo mi , ili je AI

function chatStripe(isAi, value, uniqueID) {

  return (

    `
     <div class="wrapper ${isAi && 'ai'}">

     <div class="chat">

     <div class="profile">

     <img 
     src=${isAi ? bot : user} 
     alt="${isAi ? 'bot' : 'user'}"
     />

     </div>

     <div class="message" id=${uniqueID}>${value}</div>

     </div>

     </div >

    `

  )
}


// Generisanje Ai odgovora

const handleSubmit = async (e) => {
  e.preventDefault()

  const data = new FormData(form)

  // Korisnikova kolona za unos

  chatContainer.innerHTML += chatStripe(false, data.get('prompt'))

  // funkcija za cuscenje forme posle unosa podataka

  form.reset()

  // kolona za Bota 


  // proveriti ovo jos jednom ili upisati jedinstveniID

  const uniqueID = generisiJedinstveniID()


  // Ovo kuca AI zato je vrednost u zagradi true

  chatContainer.innerHTML += chatStripe(true, " ", uniqueID)

  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueID)

  loader(messageDiv)



  // Povezivanje klienta sa serverom
  // Preuzimanje podataka iz odgovora ai bota

  const response = await fetch('https://clone-chatgpt.onrender.com', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({

      // ovo je prompt odakle podaci dolaze iz Tekst  linije za upis sa prednje strane 
      prompt: data.get('prompt')
    })
  })


  // kada se dobije odgovor zelimo da ocistimo Tekst liniju  

  clearInterval(ucitavanjeIntervala)
  messageDiv.innerHTML = ""


  // dobijamo odgovor od Bekenda

  if (response.ok) {
    const data = await response.json();
    const parsedData = data.bot.trim()

    ukucajTekst(messageDiv, parsedData)
  } else {

    // ovo je funkcija koja ceka "await" neispravan upis teksta , nazvana "tekst" smestena u varijablu err , ako nije upis ispravan izbacuje gresku

    const err = await response.tekst()

    messageDiv.innerHTML = "Nesto je poslo po zlu"

    alert(err)
  }

}






form.addEventListener('submit', handleSubmit)
form.addEventListener('keyup', (e) => {

  if (e.keyCode === 13) {
    handleSubmit(e);
  }

})