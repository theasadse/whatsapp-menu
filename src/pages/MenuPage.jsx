import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function MenuPage() {
  const { branchId, menuFlowId } = useParams();
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    table: "",
    address: "",
  });

  useEffect(() => {
    // Fetch menu from backend
    fetch(`https://backend-i0c7.onrender.com/api/menu?branch=${branchId}&flow=${menuFlowId}`)
      .then((res) => res.json())
      .then((data) => setMenu(data.items || []))
      .catch(() => setMenu([]));
  }, [branchId, menuFlowId]);

  const addToCart = (item) => {
    setCart((prev) => [...prev, item]);
  };

  const removeFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const submitOrder = () => {
    const order = { branchId, menuFlowId, cart, customer };

    fetch("https://your-backend.com/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    })
      .then((res) => res.json())
      .then(() => {
        alert("Order placed successfully!");
        setCart([]);
      })
      .catch(() => alert("Failed to place order"));
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h1>Menu - Branch {branchId}</h1>
      <h2>Choose Items</h2>
      {menu.length === 0 && <p>Loading menu...</p>}
      <ul>
        {menu.map((item, idx) => (
          <li key={idx} style={{ marginBottom: "10px" }}>
            {item.name} - ${item.price}
            <button style={{ marginLeft: "10px" }} onClick={() => addToCart(item)}>
              Add
            </button>
          </li>
        ))}
      </ul>

      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <p>No items in cart</p>
      ) : (
        <ul>
          {cart.map((item, idx) => (
            <li key={idx}>
              {item.name} - ${item.price}
              <button style={{ marginLeft: "10px" }} onClick={() => removeFromCart(idx)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      <h2>Customer Details</h2>
      <input
        type="text"
        name="name"
        placeholder="Your Name"
        value={customer.name}
        onChange={handleChange}
      />
      <br />
      <input
        type="text"
        name="phone"
        placeholder="Phone Number"
        value={customer.phone}
        onChange={handleChange}
      />
      <br />
      <input
        type="text"
        name="table"
        placeholder="Table No (if dining)"
        value={customer.table}
        onChange={handleChange}
      />
      <br />
      <input
        type="text"
        name="address"
        placeholder="Delivery Address (if delivery)"
        value={customer.address}
        onChange={handleChange}
      />
      <br />
      <button onClick={submitOrder} disabled={cart.length === 0}>
        Submit Order
      </button>
    </div>
  );
}
