const express = require('express')
const app = express()
const neo4j = require('neo4j-driver').v1
const port = 3031

// Database schema:
// NODES: Movie, Person
// RELATIONSHIPS: ACTED_IN, REVIEWED, PRODUCED, WROTE, DIRECTED, FOLLOWS
// All relationships are Person -> Movie except FOLLOWS, which is Person -> Person

const driver = neo4j.driver(
  'bolt://localhost',
  neo4j.auth.basic('neo4j', 'lohneo')
)

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello')
})

app.post('/', async (req, res) => {
  // Get all movies which have been reviewed by people the actor follows, directed by someone born after a certain year, and the actor didn't write, direct, produce or act in
  const session = await driver.session()
  try {
    const actor = req.body.actor
    const born = req.body.born
    if (actor && born) {
      const result = await session.run(`
          MATCH(p: Person) - [: FOLLOWS] - > (Person) - [: REVIEWED] - > (m: Movie) < -[: DIRECTED] - (p2: Person)
          WHERE p.name = $name
          AND p2.born > $year AND NOT(p) - [: WROTE |: DIRECTED |: ACTED_IN |: PRODUCED] - (m)
          RETURN DISTINCT m.title
        `, {
        name: actor,
        year: born
      })
      const records = await Promise.all(result.records.map(record => {
        return record.get('m.title')
      }))
      res.send(records)
    }
  }
  catch (e) {
    console.log(e)
  }
  session.close()
})

app.listen(port, () => console.log('Listening on port 3031'))

driver.close()
