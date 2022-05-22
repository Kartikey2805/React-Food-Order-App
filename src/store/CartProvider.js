import { useReducer } from "react";
import CartContext from "./cart-context";

const defaultCartState = {
  items: [],
  totalAmount: 0,
};

const cartReducer = (state, action) => {
  if (action.type === "ADD") {
    const updatedTotalAmount = action.item.price * action.item.amount;

    const index = state.items.findIndex((item) => {
      return item.id == action.item.id;
    });
    const items = state.items;
    if (index !== -1) {
      if (action.item.amount + items[index].amount > 5) {
        alert("Items cannot be more than 5 !");
        return state;
      }
      items[index].amount += action.item.amount;
    } else {
      items.push(action.item);
    }
    return {
      items,
      totalAmount: state.totalAmount + updatedTotalAmount,
    };
  } else if (action.type === "REMOVE") {
    const items = state.items;
    const index = items.findIndex((item) => item.id === action.id);
    items[index].amount -= 1;
    const price = items[index].price;
    if (items[index].amount === 0) {
      items.splice(index, 1);
    }
    return {
      items,
      totalAmount: state.totalAmount - price,
    };
  }
  return defaultCartState;
};

const CartProvider = (props) => {
  const [cartState, dispatchCartAction] = useReducer(
    cartReducer,
    defaultCartState
  );

  const addItemToCartHandler = (item) => {
    dispatchCartAction({ type: "ADD", item: item });
  };

  const removeItemFromCartHandler = (id) => {
    dispatchCartAction({ type: "REMOVE", id: id });
  };

  const cartContext = {
    items: cartState.items,
    totalAmount: cartState.totalAmount,
    addItem: addItemToCartHandler,
    removeItem: removeItemFromCartHandler,
  };

  return (
    <CartContext.Provider value={cartContext}>
      {props.children}
    </CartContext.Provider>
  );
};

export default CartProvider;
