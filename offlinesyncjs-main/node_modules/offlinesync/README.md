# OfflineSync

**OfflineSync** is a lightweight, easy-to-use library for managing offline data synchronization in web and mobile applications. It allows actions to be queued while offline and automatically syncs them once the device is online. This ensures uninterrupted workflows for users even in the absence of network connectivity.

## Features

- **Automatic Queuing**: Queue actions when offline, ensuring no data is lost.
- **Online Sync**: Automatically sync queued actions with the server once the device goes online.
- **Conflict Resolution**: Choose a strategy for resolving conflicts (e.g., latest timestamp or custom resolution).
- **Offline Persistence**: Persist queued actions even if the app is closed or restarted.
- **Queue Management**: Easily retrieve, add, remove, and clear actions from the queue.
- **Customizable Sync Behavior**: Define custom behaviors for syncing different action types.

## Installation

To install OfflineSync, use npm or yarn:

```bash
# Using npm
npm install offlinesync

# Using yarn
yarn add offlinesync
```

## Usage
- **Initialize OfflineSync**: Start by initializing the OfflineSync instance with desired configuration options.

```tsx
import OfflineSync from 'offlinesync';

const offlineSync = new OfflineSync({
  maxQueueSize: 10, // Optional: Max number of actions in the queue
  conflictStrategy: 'latest', // Optional: Conflict resolution strategy
  persist: true, // Optional: Persist queue across sessions
});
```

## Configuration Options
- **maxQueueSize:** (Optional) Set a maximum queue size. If exceeded, older actions will be removed.
- **conflictStrategy:** (Optional) Defines how conflicts are handled. Options: 'latest', 'merge', or a custom function.
- **persist:** (Optional) If set to true, queued actions will be stored persistently (e.g., using localStorage).

## Adding Actions to the Queue
Queue actions using the addAction method. Each action requires a type, data, id, and timestamp.

```tsx
offlineSync.addAction({
  type: 'ADD_TASK', // Action type
  data: { id: 1, description: 'Complete the task' }, // Action data
  id: 'task-1', // Unique action ID
  timestamp: Date.now(), // Timestamp of when the action was queued
});
```

## Syncing Queued Actions
To sync queued actions, simply use the sync() method:

```tsx
offlineSync.startSync();
```
This will sync the queued actions once the device is online, and successfully synced actions will be removed from the queue.

## Retrieving the Queue
You can retrieve the current actions in the queue:

```tsx
const queue = offlineSync.getQueuedActions()
console.log(queue); // Output: Array of actions in the queue
```

## Removing Actions from the Queue
You can remove an individual action from the queue by its ID:

```tsx
offlineSync.removeActionFromQueue('id'); // Remove specific action
```

To clear all actions from the queue:
```tsx
offlineSync.clearQueuedAction() // Clear entire queue
```

## Sync Strategies
OfflineSync offers several strategies to resolve conflicts when the same action is queued multiple times.

## Available Conflict Strategies
- **'latest':** Keeps the most recent action (based on timestamp).
- **'merge':** Merges conflicting actions (requires custom logic).
- **Custom:** You can define your own conflict resolution strategy.

Example of a custom conflict strategy:

```tsx
const offlineSync = new OfflineSync({
  conflictStrategy: (action1, action2) => {
    return action1.timestamp > action2.timestamp ? action1 : action2;
  },
});
```

## Real-World Example: Shopping Cart
**Goal:**
Enable users to add items to their shopping cart offline, queue the actions, and synchronize them with a server when back online.

## Shopping Cart Code Walkthrough
**1. Initialization**
OfflineSync is initialized with optional configurations, including queue size and conflict resolution strategies.

```tsx
const syncInstance = new OfflineSync({
  maxQueueSize: 10,
  conflictStrategy: 'latest',
});
```

**2. Adding Items to Cart**
When a user adds an item to the cart:

# If online, the item is immediately sent to the server.
# If offline, the item is added to the queue for syncing later.

```tsx
const addItemToCart = async (name: string, price: number) => {
  const cartItem = {
    id: Date.now(),
    name,
    quantity: 1,
    price,
    status: 'pending',
  };

  setCartItems((prev) => [...prev, cartItem]);

  if (offlineSync?.onlineStatus) {
    await processItem(cartItem);
  } else {
    queueItem(cartItem);
  }
};
```

**3. Queuing Offline Action**s
Queued actions are added to OfflineSync’s action queue. When the app detects network connectivity, these actions are automatically synced.

```tsx
const queueItem = (cartItem: CartItemType) => {
  offlineSync?.addAction({
    type: 'ADD_ITEM',
    data: cartItem,
    id: String(cartItem.id),
    timestamp: Date.now(),
  });
  updateQueue();
};
```

**4. Syncing with the Server**
When the app comes online, queued items are sent to the server, and the queue is cleared for synced actions.

```tsx
  const sendQueuedItems = async () => {
    if (!offlineSync) return;

    const queuedActions = offlineSync.getQueuedActions()
    for (const action of queuedActions) {
      if (isCartItem(action.data)) {
        await processItem(action.data);
        offlineSync.removeActionFromQueue(action.id);
      }
    }
    updateQueue();
  };
```

**5. Conflict Resolution**
OfflineSync resolves conflicts using predefined or custom strategies. For instance, keeping the latest version of conflicting actions:

```tsx
const syncInstance = new OfflineSync({
  conflictStrategy: 'latest',
});
```

## Complete Example
**ShoppingCart.tsx**

```tsx
// shoppingCart.tsx
'use client';
import React, { useState, useEffect } from 'react';
import CartItem from './component/shopping/CartItems';
import QueueList from './component/shopping/QueueList';
import AddToCartButton from './component/shopping/AddToCartButton';
import OfflineSync from 'offlinesync';


type CartItemType = {
  id: number;
  name: string;
  quantity: number;
  price: number;
  status: 'pending' | 'sent';
};

const ShoppingCart = () => {
  const [offlineSync, setOfflineSync] = useState<OfflineSync | null>(null);
  const [status, setStatus] = useState<string>('Offline');
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [queuedItems, setQueuedItems] = useState<CartItemType[]>([]);

  useEffect(() => {
    const syncInstance = new OfflineSync({ maxQueueSize: 10, conflictStrategy: 'latest' });
    setOfflineSync(syncInstance);

    const interval = setInterval(() => {
      if (syncInstance) {
        setStatus(syncInstance.onlineStatus ? 'Online' : 'Offline');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const updateQueue = () => {
    if (offlineSync) {
      const queuedActions = offlineSync.getQueuedActions()
      const queuedCartItems = queuedActions
        .map((action) => action?.data)
        .filter((data) => isCartItem(data)); 
      setQueuedItems(queuedCartItems); 
    }
  };

  const isCartItem = (data: any): data is CartItemType => {
    return data && typeof data.id === 'number' && typeof data.name === 'string';
  };

  const addItemToCart = async (name: string, price: number) => {
    const cartItem: CartItemType = { id: Date.now(), name, quantity: 1, price, status: 'pending' };
    setCartItems((prev) => [...prev, cartItem]);

    if (offlineSync?.onlineStatus) {
      await processItem(cartItem);
    } else {
      queueItem(cartItem);
    }
  };

  const queueItem = (cartItem: CartItemType) => {
    if (!offlineSync) return;
    offlineSync?.addAction({
      type: 'ADD_ITEM',
      data: cartItem,
      id: String(cartItem.id),
      timestamp: Date.now(),
    });
    updateQueue();
  };

  const processItem = async (cartItem: CartItemType) => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cartItem),
      });
      const data = await response.json();
      console.log('Item processed:', data);
    } catch (error) {
      console.error('Error processing item:', error);
    }
  };

  const sendQueuedItems = async () => {
    if (!offlineSync) return;

    const queuedActions = offlineSync.getQueuedActions()
    for (const action of queuedActions) {
      if (isCartItem(action.data)) {
        await processItem(action.data);
        offlineSync.removeActionFromQueue(action.id);
      }
    }
    updateQueue();
  };

  const clearQueue = () => {
    if (offlineSync) {
      offlineSync.clearQueuedAction()
      setQueuedItems([]); 
    }
  };

  useEffect(() => {
    if (status === 'Online') {
      sendQueuedItems();
    }
  }, [status, offlineSync]);

  useEffect(() => {
    updateQueue();
  }, [offlineSync]);

  return (
    <div>
      <h1>Shopping Cart</h1>
      <p>Status: {status}</p>

      <AddToCartButton addItemToCart={addItemToCart} />

      <div>
        <h2>Your Cart</h2>
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <CartItem key={item.id} item={item} />
          ))
        ) : (
          <p>Your cart is empty</p>
        )}
      </div>

        
      <QueueList queuedItems={queuedItems} />

      <div>
        <button onClick={clearQueue}>Clear Queue</button>
      </div>
    </div>
  );
};

export default ShoppingCart;

```

### Additional Components
**AddToCartButton.tsx:** Button for adding items to the cart.
**CartItem.tsx:** Displays individual cart items.
**QueueList.tsx:** Displays queued items waiting to be synced

**AddToCartButton.tsx**
```tsx
// AddToCartButton.tsx
import React, { useState } from 'react';

type AddToCartButtonProps = {
  addItemToCart: (name: string, price: number) => void;
};

const AddToCartButton = ({ addItemToCart }: AddToCartButtonProps) => {
  const [itemName, setItemName] = useState<string>('');
  const [itemPrice, setItemPrice] = useState<number>(0);

  const handleAddItem = () => {
    if (itemName.trim() && itemPrice > 0) {
      addItemToCart(itemName, itemPrice);
      setItemName('');
      setItemPrice(0);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
        placeholder="Enter item name"
      />
      <input
        type="number"
        value={itemPrice}
        onChange={(e) => setItemPrice(Number(e.target.value))}
        placeholder="Enter item price"
      />
      <button onClick={handleAddItem}>Add Item to Cart</button>
    </div>
  );
};

export default AddToCartButton;
```

**CartItems.tsx**
```tsx
// CartItem.tsx
import React from 'react';

type CartItemProps = {
  item: {
    id: number;
    name: string;
    quantity: number;
    price: number;
    status: 'pending' | 'sent';
  };
};

const CartItem = ({ item }: CartItemProps) => {
  return (
    <div>
      <h3>{item.name}</h3>
      <p>Quantity: {item.quantity}</p>
      <p>Price: ${item.price}</p>
      <p>Status: {item.status}</p>
    </div>
  );
};

export default CartItem;
```


**QueueList.tsx**
```tsx
// QueueList.tsx
import React from 'react';

type QueueListProps = {
  queuedItems: {
    id: number;
    name: string;
    quantity: number;
    price: number;
    status: 'pending' | 'sent';
  }[];
};

const QueueList = ({ queuedItems }: QueueListProps) => {
  return (
    <div>
      <h2 className="my-20 text-2xl">Queued Items</h2>
      {queuedItems.length > 0 ? (
        <ul>
          {queuedItems.map((item) => (
            <li key={item.id}>
              {item.name} - {item.quantity} - ${item.price} - {item.status}
            </li>
          ))}
        </ul>
      ) : (
        <p>No items in queue</p>
      )}
    </div>
  );
};

export default QueueList;
```

## Advanced Features
**1. Queue Management**
# Retrieve actions: offlineSync.queue.get()
# Remove action: offlineSync.queue.remove(id)
# Clear queue: offlineSync.queue.clear()

## 2. Conflict Strategies
Use 'latest' or custom strategies for resolving conflicts.

With OfflineSync, managing offline shopping cart operations becomes seamless, enhancing user experience even with intermittent network connectivity.


### Key Sections of the README:

- **Overview**: Describes what the library does.
- **Features**: Highlights the key capabilities of the library.
- **Installation**: Instructions for installing the library.
- **Usage**: Shows how to initialize, add actions, sync, retrieve the queue, and manage actions.
- **Sync Strategies**: Details conflict resolution strategies.
- **Example Usage**: Provides an example of a real-world use case.
- **Queue Management**: Covers advanced operations on the queue.
- **Troubleshooting**: Offers solutions to common problems.

Feel free to copy and paste this markdown directly into your project's `README.md` file!


