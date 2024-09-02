import { starredVar } from "./ApolloWrapper";
import { useAuth0 } from '@auth0/auth0-react'

export interface BusinessInterface {
  businessId: String;
  name: String;
  address: String;
  category: String;
  categories: Categories[];
  isStarred: boolean;
  averageStars: number
}

interface Categories {
  name: String[];
}

function BusinessResults(props: { businesses: BusinessInterface[] }) {
  const starredItems = starredVar();
  const { isAuthenticated } = useAuth0()

  return (
    <div>
      <h2>Results</h2>
      <table>
        <thead>
          <tr>
            <th>Star</th>
            <th>Name</th>
            <th>Address</th>
            <th>Category</th>
            {isAuthenticated ? <th>Average Stars</th> : null}
          </tr>
        </thead>
        <tbody>
          {props.businesses.map((b, i) => (
            <tr key={i}>
              <td>
                <button
                  onClick={() => {
                    if (b.isStarred)
                      starredVar([
                        ...starredItems.filter((word) => word !== b.businessId),
                      ]);
                    else starredVar([...starredItems, b.businessId] as never);
                  }}
                >
                  Star
                </button>
              </td>
              <td style={b.isStarred ? { fontWeight: "bold" } : {}}>
                {b.name}
              </td>
              <td>{b.address}</td>
              <td>
                {b.categories.reduce(
                  (acc, c, i) => acc + (i === 0 ? " " : ", ") + c.name,
                  ""
                )}
              </td>
              {isAuthenticated ? <td>{b.averageStars}</td> : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default BusinessResults;
