
// min included and max excluded
function getRandomInt(min, max) {
  const randomNumber = (Math.random() * (max - min)) + min
  const randomNumberInt = parseInt(randomNumber, 10)
  return randomNumberInt
}
function getMathImages(numImages, directory, maxNumber) {
  const images = []

  for (let i = 0; images.length != numImages; i++) {
    const randomNumber = getRandomInt(1, maxNumber + 1)
    const urlImage = `./images/math/arithmetic/${directory}/question_${randomNumber}.jpg`
    if (images.includes(urlImage)) {
      continue
    }
    images.push(urlImage)
  }
  return images
}
function getText(textNumber) {
  return `./images/reading-comprehension/text_${textNumber}.jpg`
}
function getReadingQuestion(textNumber, questionNumber) {
  return `./images/reading-comprehension/text_${textNumber}-question_${questionNumber}.jpg`
}
function getReadingImages(numTexts, numImages) {
  const reading = {
    texts: {},
    questions: {}
  }

  let countText = 0;
  for (let p = 0; Object.keys(reading.texts).length != numTexts; p++) {
    const textRandomNumber = getRandomInt(1, numTexts + 1)
    const text = getText(textRandomNumber)
    let repeatAgain = false
    let countQuestion = 0

    for (let h = 0; h != Object.keys(reading.texts).length; h++) {
      if (reading.texts[h] === text) {
        repeatAgain = true
        break
      }
    }
    if (repeatAgain) continue
    reading.texts[countText] = text

    reading.questions[countText] = {}
    for (let i = 0; Object.keys(reading.questions[countText]).length != numImages; i++) {
      const questionRandomNumber = getRandomInt(1, numImages + 1)
      const question = getReadingQuestion(textRandomNumber, questionRandomNumber)
      let repeatAgain = false

      for (let c = 0; c != Object.keys(reading.questions[countText]).length; c++) {
        if (reading.questions[countText][c] === question) {
          repeatAgain = true
          console.log('repitió')
          break
        }
      }
      if (repeatAgain) continue
      reading.questions[countText][countQuestion] = question

      countQuestion++
    }

    countText++
  }
  return reading
}
function questionItemTemplate(url) {
  return `
    <img src="${url}" />
  `
}
function renderImages(numImages, images, whereRender) {
  if (typeof (images) === "object") {
    for (let i = 0; i < numImages; i++) {
      const html = document.implementation.createHTMLDocument()
      html.body.innerHTML = questionItemTemplate(images[i])
      const imageItem = html.body.children[0]
      whereRender.append(imageItem)
    }
  } else {
    const html = document.implementation.createHTMLDocument()
    html.body.innerHTML = questionItemTemplate(images)
    const imageItem = html.body.children[0]
    whereRender.append(imageItem)
  }
}


let numberImages
do {
  numberImages = parseInt(prompt("¿Cuántas preguntas vas a querer?, el número a ingresar debe ser múltiplo de 5", 0))
} while (!(numberImages % 5 === 0 && numberImages % 2 === 0 && numberImages != 0));
const questionsPerFolder = parseInt(prompt("¿Cuántas preguntas por folder hay?", 0))

const mathSubjects = [
  'set-theory',
  'successions',
  'ratios-proportions',
  // 'proportional-magnitudes',
  // 'so-much-for-how-much',
  // 'introduction-financial-mathematics',
  // 'averages',
  // 'mixing-rule',
  // 'introduction-statistics'
]
const mathSubjectsQuantity = mathSubjects.length
const mathQuestions = numberImages / 2
let questionBySubject = Math.ceil(mathQuestions / mathSubjectsQuantity)
let mathImages
let questionBySubjectLastSection = mathQuestions

for (let i = 0; i < mathSubjectsQuantity; i++) {
  // if the loop isn't in the last item
  if (i != mathSubjectsQuantity - 1) {
    // console.log('no last item')
    questionBySubjectLastSection -= questionBySubject
  } else {
    // console.log('last item')
    questionBySubject = questionBySubjectLastSection
  }

  mathImages = getMathImages(questionBySubject, mathSubjects[i], questionsPerFolder)
  const $mathImagesContainer = document.querySelector(`.${mathSubjects[i]}__content`)
  renderImages(questionBySubject, mathImages, $mathImagesContainer)
}

const readingQuestions = numberImages / 2
const questionsByText = 5
const textsNumber = readingQuestions / questionsByText
// const questionsByTextTotal = textsNumber * questionsByText
const readingData = getReadingImages(textsNumber, questionsByText)
// debugger

const $readingContent = document.querySelector('.reading__content')
// const $readingTextsContainer = document.querySelector('.reading__content__text__content')
// const $readingQuestionsContainer = document.querySelector('.reading__content__questions__content')

for (let i = 0; i < textsNumber; i++) {
  // create container
  const html = document.implementation.createHTMLDocument()
  html.body.innerHTML = `
  <div class="reading__content__container">
    <div class="reading__content__text">
      <h3>Text</h3>
      <div class="reading__content__text__content"></div>
    </div>
    <div class="reading__content__questions">
      <h3>Questions</h3>
      <div class="reading__content__questions__content"></div>
    </div>
  </div>
  `

  const $readingTextsContainer = html.querySelector('.reading__content__text__content')
  const $readingQuestionsContainer = html.querySelector('.reading__content__questions__content')

  // renderTexts
  renderImages(1, readingData.texts[i], $readingTextsContainer)
  // renderQuestions
  renderImages(questionsByText, readingData.questions[i], $readingQuestionsContainer)

  const readingContentContainer = html.body.children[0]
  $readingContent.append(readingContentContainer)
}

