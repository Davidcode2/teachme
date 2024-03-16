import { useLoaderData } from "react-router-dom";

export default function Cart() {
  const cartItems = useLoaderData();

  return (
    <div>
      <h1>Cart</h1>
      {cartItems.map((item) => {
        return (
          <div>
            <p>{item.name}</p>
            <p>{item.price}</p>
          </div>
        )
      })}
    </div>
    
  )

}
