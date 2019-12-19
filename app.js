let finalString = ''
let counter = 1

d3.select('form')
  .on('submit', handleSubmit)

d3.select('#reset')
  .on('click', handleReset)

function getData(input) {
  // let result= []
  let stringArr = input.split('').sort()

  return stringArr.reduce((acc, currentChar) => {
    let lastObj = acc[acc.length - 1]

    if (lastObj && lastObj.character === currentChar) {
      lastObj.count++
    } else {
      acc.push({ character: currentChar, count: 1 })
    }

    return acc
  }, [])

  // for (let i = 0; i < stringArr.length; i++) {
  //   if (result.length > 0 && result[result.length - 1].character === stringArr[i]) {
  //     result[result.length - 1].count += 1
  //   } else {
  //     result.push({ character: stringArr[i], count: 1 })
  //   }
  // }

  // return result
}

function printPhrase(input) {
  d3.select('#phrase')
    .text(`Analysis of: ${input}`)
}

function printCount(letters) {
  let count = letters
                .enter()
                .nodes()
                .length

  d3.select('#count')
    .text(`(New characters: ${count})`)
}

function handleSubmit() {
  d3.event.preventDefault()
  let input = d3.select('input').property('value').toLowerCase()

  if (isInputEmpty(input)) {
    return
  }
  
  if (counter === 3) {
    counter = 1
    handleReset()
  }

  finalString = finalString.concat(input)
  let data = getData(finalString)
  printPhrase(input)

  let letters = d3.select('#letters')
                  .selectAll('.letter')
                  .data(data, d => d.character)

  letters
      .classed('new', false)
    .exit()
    .remove()

  printCount(letters)
  displayGraph(letters)
  clearInput()
  counter++
}

function displayGraph(letters) {
  letters
    .enter()
    .append('div')
      .classed('letter', true)
      .classed('new', true)
    .merge(letters)
      .text(d => d.character)
      .style('width', `20px`)
      .style('height', d => `${20 * d.count}px`)
      .style('line-height', '20px')
      .style('margin-right', '5px')
}

function clearInput() {
  d3.select('input')
    .property('value', '')
}

function handleReset() {
  d3.selectAll('.letter')
    .remove()

  d3.select('#count')
    .text('')

  d3.select('#phrase')
    .text('')

  finalString = ''
}

function isInputEmpty(input) {
  return input.length === 0 || input.match(/^(\s+)$/g)
}
