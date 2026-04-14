import { openDB } from 'idb'

/**
 * =========================
 * LIST DATABASES
 * =========================
 */
export async function listDatabases() {
  if (!indexedDB.databases) {
    console.warn("Browser không hỗ trợ indexedDB.databases()")
    return []
  }
  return await indexedDB.databases()
}

/**
 * =========================
 * OPEN DB SAFE
 * =========================
 */
export async function openDatabase(dbName) {
  return await openDB(dbName)
}

/**
 * =========================
 * GET ALL STORES
 * =========================
 */
export async function getStores(dbName) {
  const db = await openDB(dbName)
  const stores = Array.from(db.objectStoreNames)
  db.close()
  return stores
}

/**
 * =========================
 * GET STORE INFO
 * =========================
 */
export async function getStoreInfo(dbName, storeName) {
  const db = await openDB(dbName)

  const tx = db.transaction(storeName, 'readonly')
  const store = tx.objectStore(storeName)

  const info = {
    name: store.name,
    keyPath: store.keyPath,
    autoIncrement: store.autoIncrement,
    indexes: []
  }

  for (let i = 0; i < store.indexNames.length; i++) {
    const indexName = store.indexNames[i]
    const idx = store.index(indexName)

    info.indexes.push({
      name: idx.name,
      keyPath: idx.keyPath,
      unique: idx.unique,
      multiEntry: idx.multiEntry
    })
  }

  db.close()
  return info
}

/**
 * =========================
 * GET ALL DATA
 * =========================
 */
export async function getAllData(dbName, storeName) {
  const db = await openDB(dbName)

  const tx = db.transaction(storeName, 'readonly')
  const store = tx.objectStore(storeName)

  const data = await store.getAll()

  db.close()
  return data
}

/**
 * =========================
 * GET BY KEY
 * =========================
 */
export async function getByKey(dbName, storeName, key) {
  const db = await openDB(dbName)

  const tx = db.transaction(storeName, 'readonly')
  const store = tx.objectStore(storeName)

  const data = await store.get(key)

  db.close()
  return data
}

/**
 * =========================
 * COUNT
 * =========================
 */
export async function count(dbName, storeName) {
  const db = await openDB(dbName)

  const tx = db.transaction(storeName, 'readonly')
  const store = tx.objectStore(storeName)

  const total = await store.count()

  db.close()
  return total
}

/**
 * =========================
 * DELETE RECORD
 * =========================
 */
export async function deleteRecord(dbName, storeName, key) {
  const db = await openDB(dbName)

  const tx = db.transaction(storeName, 'readwrite')
  const store = tx.objectStore(storeName)

  await store.delete(key)
  await tx.done

  db.close()
}

/**
 * =========================
 * UPSERT (ADD + UPDATE)
 * =========================
 */
export async function upsert(dbName, storeName, data) {
  const db = await openDB(dbName)

  const tx = db.transaction(storeName, 'readwrite')
  const store = tx.objectStore(storeName)

  const key = await store.put(data)

  await tx.done
  db.close()

  return key
}

/**
 * =========================
 * CLEAR STORE
 * =========================
 */
export async function clearStore(dbName, storeName) {
  const db = await openDB(dbName)

  const tx = db.transaction(storeName, 'readwrite')
  const store = tx.objectStore(storeName)

  await store.clear()
  await tx.done

  db.close()
}

/**
 * =========================
 * DELETE DATABASE
 * =========================
 */
export async function deleteDatabase(dbName) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(dbName)

    request.onsuccess = () => {
      console.log("✅ Deleted DB:", dbName)
      resolve(true)
    }

    request.onerror = () => {
      console.error("❌ Delete DB error:", dbName)
      reject(false)
    }

    request.onblocked = () => {
      console.warn("⚠️ DB đang bị mở ở tab khác")
      reject(false)
    }
  })
}