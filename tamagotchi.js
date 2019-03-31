/*
 * lektorium course: Java Script
 * Homework #4.2: tamagotchi pets
 * made by Vitaliy Dovgan
 *
 * Создать тамагочи, у которого должно быть минимум 6 методов, минимум 6 переменных, от которых зависит его жизнь.
 * Например: создается инстанс тамагочи и дается имя питомцу, он может кушать, гулять, спать, пить, умереть или сбежать и т.д.
 * За эти или иные действия отвечают переменные самого инстанса, например health, happiness и так далее...
 */

const petsHomes = [] // pets live here
const lostPets = []

function help () { // prints howto info
  console.log(
    ':: TAMAGOTCHI HELP ::\n' +
    'You can get this help() at any time\n' +
    '- Get a new pet: var myPet = getPet(\'MyPetName\')\n' +
    '- To find out how your pet feels: myPet.p.howAreYou()\n' +
    '[i] Note: the "%" sign (where indicated) says that you have to provide an amount of percents for which you wish to modify the parameter;\n' +
    '          the "%/2" sign (where indicated) says that the percentage you provide will have only a half effect,\n' +
    '          the "%*2" sign (where indicated) says that the percentage you provide will have a double effect\n' +
    '- You may feed your pet with .p.feed(%)\n' +
    '- You may water your pet with .p.water(%)\n' +
    '- You may let your pet sleep with .p.sleep(%)\n' +
    '- You may give a bath to your pet with .p.bath()\n' +
    '- Miraculous healing is possible with .p.heal()\n' +
    '- You may walk your pet with .p.walk(%)\n' +
    '- You may entertain your pet with .p.play(%)\n' +
    '- You may scare your pet with .p.scare(%) (be careful here!)\n' +
    '- You may also control an overall pace of pet\'s inner processes by setting .p.pulse period property (in milliseconds); the default is 10000 (i. e. 10 seconds)\n' +
    '[!] Warning: The vital signs of tamagotchi pets change over time, so don\'t disregard asking your pet .p.howAreYou()\n' +
    '             Be careful -- your tamagotchi may eventually die ot run away if you will not be solicitous enough!\n\n'
  )
}

function getPet (name) { // gives birth to a new tamagotchi pet
  if ((typeof name !== 'string') || (name.trim().length < 1)) { // checking if the pet's name passed is correct
    console.log('Error: Can\'t understand pet\'s name!')
    return {}
  }

  const id = petsHomes.length
  petsHomes[id] = { // new pet enters it's home
    nameplate: name.trim(),
    p: new Pet(name.trim(), id)
  }
  return petsHomes[id]
}

function checkPercentage (percentage) { // checks if the percentage given is correct
  if (Number.isFinite(percentage) && (percentage >= 0) && (percentage <= 100)) {
    return true
  } else {
    console.log('Error: Your pet can\'t accept this!')
    return false
  }
}

function badLuck (homeId, theCause, isAlive) { // things went wrong
  var whatToSay = 'Something bad happened!'
  const petName = petsHomes[homeId].nameplate

  if (isAlive) {
    whatToSay = `Oops! ${petName} ran away! Your pet was ${theCause}\n` +
      `There\'s no obvious way to bring ${petName} back, but you may try until your pet is dead`
  } else {
    whatToSay = `OMG!!! ${petName} died! Your pet was ${theCause}\n` +
      `Unfortunately, there\'s no method to rise ${petName} from the dead... R.I.P. +-(`
    petsHomes[homeId].nameplate += ' is no longer with us...'
  }

  console.log(whatToSay)
  alert(whatToSay)
}

function Pet (petName, id) { // a tamagotchi pet class; implements pet's very own behaviour only
  var name = petName.trim() // the pet knows its name
  var homeId = id // the pet knows its home
  var beatId // an ID of the timeout timer
  this.pulse = 10000 // defines an overall pace of pet's inner processes

  var state = { // pet's vital signs in percents; less is better
    hunger: 80,
    thirst: 60,
    illness: 0,
    sleepiness: 50,
    dirt: 0,
    stuffiness: 30, // this is essentially a need to have a walk
    boredom: 10,
    fright: 0
  }

  function heartbeat () { // modifies pet's vital signs over time
    state.hunger += 2
    state.thirst += 3
    state.illness += 0.2
    state.sleepiness += 1
    state.dirt += 1
    state.stuffiness += 1
    state.boredom += 1
    state.fright -= 1
    checkThePet(true)
  }

  var runAway = (theCause) => {
    lostPets[lostPets.length] = petsHomes[homeId].p
    petsHomes[homeId].p = {} // the pet disappears from it's home
    state.stuffiness = state.boredom = state.fright = 0
    beatId = setTimeout(heartbeat, this.pulse) // the pet continues to live free
    badLuck(homeId, theCause, true)
  }

  var die = (theCause) => { // we have unhappy end
    for (let prop in this) {
      if (this.hasOwnProperty(prop)) {
        this[prop] = undefined
      }
    }
    runAway = checkThePet = heartbeat = undefined
    badLuck(homeId, theCause, false)
    homeId = undefined
    name = undefined
  }

  var checkThePet = (lubDub) => { // checks pet's state and initiates appropriate actions
    clearTimeout(beatId)

    if (lubDub) { // lubDub indicates that the checkThePet() was called by the heartbeat() ("lub-dub" is the expression of heartbeat sound in English)
      if (state.sleepiness >= 100) { // oversleeping isn't healthy
        state.sleepiness = 100
        state.illness += 1
      }
      if (state.dirt >= 100) { // being dirty isn't healthy as well
        state.dirt = 100
        state.illness += 0.2
      }
    }
    if (state.hunger > 100) {
      die('starved to death!')
      return false
    }
    if (state.thirst > 100) {
      die('dehydrated to death!')
      return false
    }
    if (state.illness > 100) {
      die('facing a critical illness!')
      return false
    }
    if (state.fright >= 100) {
      die('scared to death!')
      return false
    }
    if (state.fright > 90) {
      runAway('scared too much!')
      return false
    }
    if (state.stuffiness > 100) {
      runAway('longing for a walk!')
      return false
    }
    if (state.boredom > 100) {
      runAway('bored unbearably!')
      return false
    }

    // if some vital signs appear to be too good -- reset them to 0
    for (let prop in state) {
      if (state[prop] < 0) {
        state[prop] = 0
      }
    }

    if (!lubDub) { // if the checkThePet() call is initiated by a user action...
      this.howAreYou() // ...show the action's effect
    }
    beatId = setTimeout(heartbeat, this.pulse) // let the heart beat on
    return true
  }

  this.feed = function (percentFeed) {
    if (!checkPercentage(percentFeed)) {
      return false
    }
    state.hunger -= percentFeed
    if (state.hunger < 0) {
      state.illness += state.hunger * -1 // health is in inverse relationship with overeating
      state.hunger = 0
      console.log('Don\'t feed me too much! Overeating harms my health! :o(')
    }
    return checkThePet()
  }

  this.water = function (percentWater) {
    if (!checkPercentage(percentWater)) {
      return false
    }
    state.thirst -= percentWater
    if (state.thirst < 0) {
      state.illness += state.thirst / -10 // there is some inverse relationship between overdrinking and health
      state.thirst = 0
      console.log('Don\'t let me drink too much! It isn\'t healthy for me! :o(')
    }
    return checkThePet()
  }

  this.sleep = function (percentSleep) {
    if (!checkPercentage(percentSleep)) {
      return false
    }
    state.sleepiness -= percentSleep
    if (state.sleepiness < 0) {
      state.illness += state.sleepiness / -5 // there is some inverse relationship between oversleeping and health
      state.sleepiness = 0
      console.log('Don\'t let me sleep too long! Oversleeping isn\'t healthy for me! :o(')
    }
    state.fright -= percentSleep * 2 // sleeping is a great way to get rid of scare
    return checkThePet()
  }

  this.bath = function () {
    state.dirt = 0
    this.howAreYou()
    console.log('I\'m  clean now! :o)')
  }

  this.heal = function () {
    state.illness = 0
    this.howAreYou()
    console.log('I\'m healed now! :o)')
  }

  this.walk = function (percentWalk) {
    if (!checkPercentage(percentWalk)) {
      return false
    }
    state.stuffiness -= percentWalk
    state.boredom -= (percentWalk / 2).toFixed(0) // going for a walk is useful for entertaining...
    state.fright -= (percentWalk / 2).toFixed(0) // ...and for soothing
    return checkThePet()
  }

  this.play = function (percentPlay) {
    if (!checkPercentage(percentPlay)) {
      return false
    }
    state.boredom -= percentPlay
    state.fright -= percentPlay // playing is a good way to get rid of scare
    return checkThePet()
  }

  this.scare = function (percentScare) {
    if (!checkPercentage(percentScare)) {
      return false
    }
    state.fright += percentScare
    return checkThePet()
  }

  this.howAreYou = function () { // tells how the pet feels
    console.log('I\'m ' + name + ', and ::')

    console.log('- i\'m hungry for ' + state.hunger + '%. '
      + (state.hunger > 60 ? 'I feel hungry! Please, .p.feed(%) me now!' : ''))

    console.log('- i\'m thirsty for ' + state.thirst + '%. '
      + (state.thirst > 60 ? 'I feel thirsty! Please, .p.water(%) me now!' : ''))

    console.log('- i\'m sleepy for ' + state.sleepiness + '%. '
      + (state.sleepiness > 60 ? 'I feel sleepy. Please, let me .p.sleep(%) for a while!' : ''))

    console.log('- i\'m dirty for ' + state.dirt + '%. '
      + (state.dirt > 30 ? 'I got dirty. Please, give me a .p.bath()!' : ''))

    console.log('- i\'m ill for ' + Math.trunc(state.illness) + '%. '
      + (Math.trunc(state.illness) > 30 ? 'I feel sick! Please, .p.heal() me now!' : ''))

    console.log('- I feel stuffy for ' + state.stuffiness + '%. '
      + (state.stuffiness > 60 ? 'I need some fresh air. Please, go for a .p.walk(%) with me!' : ''))

    console.log('- i\'m bored for ' + state.boredom + '%. '
      + (state.boredom > 50 ? 'I feel bored. Please, .p.play(%) or go for a .p.walk(%/2) with me!' : ''))

    console.log('- i\'m scared for ' + state.fright + '%. '
      + (state.fright > 50 ? 'I feel scared! .p.sleep(%*2), .p.play(%) or .p.walk(%/2) will help.' : ''))
  }

  console.log(
    `\nHello, I\'m ${name}! :o)` +
    `\nPlease, .feed(%) me now! I\'m hungry right after the birth!\n\n`
  )
  checkThePet()
  return this
}

help()
