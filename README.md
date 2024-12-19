
# Hedera Sphere

Hedera Sphere is the next-generation index fund designed to make investing in the whole crypto ecosystem effortless and rewarding.

the app is deploy at the url: http://137.184.99.27:3000/

## Tokens
| Token Key   | Name         | Symbol     | Token ID     | Max Supply           | Supply Type |
|-------------|--------------|------------|--------------|----------------------|-------------|
| `hsphere`   | hsphere      | HSPHERE    | 0.0.5276815  | 100,000,000  | Finite      |
| `hsphere100`| hsphere100   | HSPHERE100 | 0.0.5276818  | Unlimited            | Infinite    |
| `usdt`      | Test USDT    | USDT       | 0.0.5276820  | Unlimited            | Infinite    |

## Arquitecture
Hedera sphere is a nextjs aplication that uses the package @hashgraph/sdk to interact with the hedera blockchain

In the other hand Hedera Sphere store data related to the index fund in a supabase database, data such as the portfolio constituents, price , percentageChange7d, historical index price

this supabase database has the next defined tables: 
#### `appdata`

| Column              | Type     | Constraints                                         | Description                                           |
|---------------------|----------|-----------------------------------------------------|-------------------------------------------------------|
| `id`               | numeric  | Primary Key, must be 1                              | Unique identifier, stores the single record of data. |
| `lastUpdateTime`    | timestamp| Nullable                                            | Timestamp of the last update.                        |
| `percentageChange7d`| numeric  | Nullable                                            | Percentage change over 7 days.                       |
| `tokenPrice`        | numeric  | Nullable                                            | Current token price.                                  |
| `hsphereamount`     | numeric  | Nullable                                            | Amount of hsphere invested.                         |

---

#### `historicprice`

| Column  | Type      | Constraints  | Description                           |
|---------|-----------|--------------|---------------------------------------|
| `date` | timestamp | Primary Key  | Date associated with the price.       |
| `price`| numeric   | Nullable     | Price of the asset on the given date. |

---

#### `cryptodata`

| Column      | Type      | Constraints     | Description                          |
|-------------|-----------|-----------------|--------------------------------------|
| `symbol`    | text      | Primary Key     | Symbol of the cryptocurrency.        |
| `created_at`| timestamp | Nullable        | Timestamp when the entry was created.|
| `name`      | text      | Nullable        | Name of the cryptocurrency.          |
| `weight`    | numeric   | Nullable        | Weight or importance in the index of the crypto.  |

the data of the index is updated running the script:

`node node ./scripts/run-node-refresh-index-data.js`

the only data not updated by this script is the hsphereamount wich is updated each time a user buy or sells tokens, we have not integrated mirror node due to lack of time, we developed this app in 3 days so we aim to implement it in the future

the run-node-refresh-index-data.js script fetchs data from the coinmarketcap 100 index, in the future we aim to define our custom index assets managment logic that can be customized by excluding some tokens defined by the hsphere holders and also with the hability to create new custom tokens composition for the indexed funds


