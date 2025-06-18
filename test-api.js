const fetch = require('node-fetch')

async function testAPI() {
  try {
    console.log('Probando API de disponibilidad...')

    const response = await fetch('http://localhost:3000/api/availability/days')
    const data = await response.json()

    console.log('Respuesta:', data)
    console.log('Status:', response.status)
  } catch (error) {
    console.error('Error:', error.message)
  }
}

testAPI()
