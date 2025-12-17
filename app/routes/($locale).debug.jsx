import {useLoaderData} from 'react-router';

/**
 * Debug route to test Shopify connection
 */
export async function loader({context, request}) {
  const {storefront, env} = context;
  const url = new URL(request.url);
  const collectionHandle = url.searchParams.get('collection');
  
  // Test basic connection and get collections
  try {
    const [shopResult, collectionsResult] = await Promise.all([
      storefront.query(`#graphql
        query TestConnection {
          shop {
            name
            id
          }
        }
      `),
      storefront.query(`#graphql
        query GetCollections {
          collections(first: 20) {
            nodes {
              id
              title
              handle
              description
            }
          }
        }
      `),
    ]);
    
    let collectionDetails = null;
    
    // If a specific collection is requested, get its full details with products
    if (collectionHandle) {
      try {
        const collectionResult = await storefront.query(`#graphql
          query GetCollectionDetails($handle: String!) {
            collection(handle: $handle) {
              id
              title
              handle
              description
              products(first: 10) {
                nodes {
                  id
                  title
                  handle
                  featuredImage {
                    url
                    altText
                  }
                  priceRange {
                    minVariantPrice {
                      amount
                      currencyCode
                    }
                    maxVariantPrice {
                      amount
                      currencyCode
                    }
                  }
                }
                pageInfo {
                  hasNextPage
                  hasPreviousPage
                }
              }
            }
          }
        `, {
          variables: { handle: collectionHandle }
        });
        
        collectionDetails = collectionResult.collection;
      } catch (err) {
        collectionDetails = { error: err.message };
      }
    }
    
    return {
      success: true,
      shop: shopResult.shop,
      collections: collectionsResult.collections.nodes,
      collectionDetails,
      env: {
        storeDomain: env.PUBLIC_STORE_DOMAIN,
        hasToken: !!env.PUBLIC_STOREFRONT_API_TOKEN,
        tokenLength: env.PUBLIC_STOREFRONT_API_TOKEN?.length || 0,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      stack: error.stack,
      env: {
        storeDomain: env.PUBLIC_STORE_DOMAIN,
        hasToken: !!env.PUBLIC_STOREFRONT_API_TOKEN,
        tokenLength: env.PUBLIC_STOREFRONT_API_TOKEN?.length || 0,
      },
    };
  }
}

export default function Debug() {
  const data = useLoaderData();
  
  return (
    <div style={{padding: '20px', fontFamily: 'monospace'}}>
      <h1>Shopify Connection Debug</h1>
      
      {/* Show collection details if requested */}
      {data.collectionDetails && (
        <div style={{marginBottom: '30px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '5px'}}>
          <h2>Collection Details (JSON):</h2>
          <pre style={{overflow: 'auto', maxHeight: '500px'}}>
            {JSON.stringify(data.collectionDetails, null, 2)}
          </pre>
        </div>
      )}
      
      {/* Full JSON output */}
      <div style={{marginBottom: '30px'}}>
        <h2>Full Debug Data (JSON):</h2>
        <pre style={{overflow: 'auto', maxHeight: '500px', backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '5px'}}>
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
      
      {data.success && data.collections && (
        <div style={{marginTop: '20px'}}>
          <h2>Available Collections:</h2>
          <p style={{color: '#666'}}>
            Click a collection to see its full details with products in JSON format
          </p>
          <ul style={{listStyle: 'none', padding: 0}}>
            {data.collections.map((collection) => (
              <li key={collection.id} style={{marginBottom: '10px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px'}}>
                <strong>{collection.title}</strong> - Handle: <code>{collection.handle}</code>
                <br />
                <a href={`/collections/${collection.handle}`} style={{marginRight: '10px'}}>
                  View Page: /collections/{collection.handle}
                </a>
                <a href={`/debug?collection=${collection.handle}`}>
                  View JSON: /debug?collection={collection.handle}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

