/**
 * Cliente GraphQL con soporte para queries, mutations y subscriptions
 */

const GRAPHQL_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'https://water-dispenser-production.up.railway.app/graphql';
const GRAPHQL_WS_URL = process.env.NEXT_PUBLIC_GRAPHQL_WS_URL || 'wss://water-dispenser-production.up.railway.app/graphql';

/**
 * Ejecuta una query o mutation GraphQL
 */
export async function graphqlRequest(query, variables = {}) {
  const response = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const result = await response.json();

  if (result.errors) {
    throw new Error(result.errors[0]?.message || 'GraphQL Error');
  }

  return result.data;
}

/**
 * Crea una conexión WebSocket para subscriptions
 */
export function createSubscription(query, variables, onData, onError) {
  if (typeof window === 'undefined') {
    return () => {};
  }

  let ws = null;
  let reconnectAttempts = 0;
  const maxReconnectAttempts = 5;

  const connect = () => {
    ws = new WebSocket(GRAPHQL_WS_URL, 'graphql-transport-ws');

    ws.onopen = () => {
      reconnectAttempts = 0;
      // Enviar mensaje de conexión
      ws.send(JSON.stringify({ type: 'connection_init' }));
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);

      switch (message.type) {
        case 'connection_ack':
          // Conexión aceptada, enviar subscription
          ws.send(JSON.stringify({
            id: '1',
            type: 'subscribe',
            payload: { query, variables },
          }));
          break;

        case 'next':
          if (message.payload?.data) {
            onData(message.payload.data);
          }
          break;

        case 'error':
          if (onError) {
            onError(message.payload);
          }
          break;

        case 'complete':
          // Subscription completada
          break;
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      if (onError) {
        onError(error);
      }
    };

    ws.onclose = () => {
      if (reconnectAttempts < maxReconnectAttempts) {
        reconnectAttempts++;
        setTimeout(connect, 1000 * reconnectAttempts);
      }
    };
  };

  connect();

  // Retornar función de cleanup
  return () => {
    if (ws) {
      ws.send(JSON.stringify({ id: '1', type: 'complete' }));
      ws.close();
    }
  };
}

export default graphqlRequest;
