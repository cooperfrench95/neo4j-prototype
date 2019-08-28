# neo4j-prototype
A prototype showing interaction with neo4j using Express


# Usage

Clone repo. Start a neo4j instance locally, using the default movie database.

Create some review relationships. E.g:

```
MATCH (p:Person)
WITH p
MATCH (m:Movie)
WITH p, m
WHERE NOT (p)-[:WROTE|:DIRECTED|:ACTED_IN|:PRODUCED]->(m)
LIMIT 500
CREATE (p)-[:REVIEWED]->(m)
```

Create some follow relationships. Eg:

```
MATCH (p:Person)
WITH p
MATCH (p2:Person)
WHERE NOT p.name = p2.name AND NOT (p)-[]-(p2)
LIMIT 100
CREATE (p)-[:FOLLOWS]->(p2)
```

Submit a POST request to `localhost:3031` with JSON body e.g.:

```
{
  "actor": "Keanu Reeves",
  "born": 1950
}
```

View results.
