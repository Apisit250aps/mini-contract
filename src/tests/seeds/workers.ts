import axios from 'axios'
import { faker } from '@faker-js/faker'

const generateWorker = () => {
  
  return {
    name: faker.person.fullName(),
    // position: faker.word.,
  }
}

async function main() {
  const workers = Array.from({ length: 10 }, generateWorker)

  workers.forEach(async (worker) => {
    try {
      const response = await axios.post(
        'http://localhost:3000/api/worker',
        worker,
      )
      console.log('Created worker:', response.data)
    } catch (error) {
      console.error('Error creating worker:', error)
    }
  })
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
