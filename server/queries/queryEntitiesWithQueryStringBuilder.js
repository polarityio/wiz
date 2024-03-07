const { flow, chunk, map, join, mergeAll, get } = require('lodash/fp');
const reduce = require('lodash/fp/reduce').convert({ cap: false });
const { requestsInParallel } = require('../request');


const queryEntitiesWithQueryStringBuilder = async (
  entitiesWithIds,
  options,
  buildQueryStringWithOneEntity,
  numberOfQueriesToRunInOneRequest = 5
) => {
  const queries = buildAggregateQueries(
    entitiesWithIds,
    buildQueryStringWithOneEntity,
    numberOfQueriesToRunInOneRequest
  );

  const queryResults = await runQueries(queries, options);

  const formattedQueryResults = formatQueryResults(queryResults);

  const entityAssociatedQueryResults = associateEntitiesWithQueryResults(
    entitiesWithIds,
    formattedQueryResults
  );

  return entityAssociatedQueryResults;
};

const buildAggregateQueries = (
  entitiesWithIds,
  buildQueryStringWithOneEntity,
  numberOfQueriesToRunInOneRequest
) =>
  flow(
    chunk(numberOfQueriesToRunInOneRequest),
    map((entities) =>
      flow(
        map(buildQueryStringWithOneEntity),
        join(''),
        (queriesWithIds) => `query {${queriesWithIds}
}`
      )(entities)
    )
  )(entitiesWithIds);

const runQueries = async (queries, options) =>
  flow(
    map((query) => ({ query, options })),
    async (queryRequests) => await requestsInParallel(queryRequests, 'body.data')
  )(queries);

const formatQueryResults = flow(
  mergeAll,
  reduce((agg, result, entityId) => ({ ...agg, [entityId]: get('nodes', result) }), {})
);

const associateEntitiesWithQueryResults = (entitiesWithIds, queryResults) =>
  map(
    (entity) => ({ resultId: entity.value, result: get(entity.id, queryResults) }),
    entitiesWithIds
  );

module.exports = queryEntitiesWithQueryStringBuilder;
