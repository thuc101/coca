import { openDB } from 'idb'

const DB_NAME = 'erp-db'
const DB_VERSION = 1

let dbPromise = null

export function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // ===== TABLE Ban =====
        if (!db.objectStoreNames.contains('Ban')) {
          const store = db.createObjectStore('Ban', {
            keyPath: 'Id',
            autoIncrement: true
          })
          store.createIndex('Ten', 'Ten')

          // ✅ thêm data mẫu
          store.add({"Ten":"Bàn số 3","Id":2,"Tien":"333"})
          store.add({"Ten":"Bàn số 2","Id":3,"Tien":"222"})
          store.add({"Ten":"Bàn số 1","Act":false,"Tien":"111","Id":4})
          
        }

        // ===== TABLE HoaDon =====
        if (!db.objectStoreNames.contains('HoaDon')) {
          const store = db.createObjectStore('HoaDon', {
            keyPath: 'Id',
            autoIncrement: true
          })

          store.add({"Ngay": "2026-04-04T03:45:09.346Z", "TenKhach": "Vina milk", "Tien": 10000})

        }

        // ===== TABLE HoaDonCT =====
        if (!db.objectStoreNames.contains('HoaDonCT')) {
          const store = db.createObjectStore('HoaDonCT', {
            keyPath: 'Id',
            autoIncrement: true
          })
          store.createIndex('HoaDonId', 'HoaDonId')

          store.add({"MonId":1,"SoLg":1,"DonGia":1,"Tien":1,"HoaDonId":1,"Id":1})
          store.add({"MonId":1,"SoLg":1,"DonGia":1,"Tien":1,"HoaDonId":1,"Id":2})
          store.add({"MonId":1,"SoLg":1,"DonGia":1,"Tien":1,"HoaDonId":1,"Id":3})

        }

        // ===== TABLE MonAn =====
        if (!db.objectStoreNames.contains('MonAn')) {
          const store = db.createObjectStore('MonAn', {
            keyPath: 'Id',
            autoIncrement: true
          })

          store.add({"Ten":"Sườn","DonGia":30000,"TonKho":1,"Id":1})
          store.add({"Ten":"Bì","DonGia":30000,"TonKho":1,"Id":2})
          store.add({"Ten":"Chả","DonGia":30000,"TonKho":1,"Id":3})

        }

        // ===== TABLE TaBiLu =====
        if (!db.objectStoreNames.contains('TaBiLu')) {
          const store = db.createObjectStore('TaBiLu', {
            keyPath: 'Id',
            autoIncrement: true
          })
            store.add({"Ngay":"2026-04-10T07:45:21.589Z","TenKhach":"thuc 101","Tien":30000,"Done":true,"MonId":1,"Id":1})
            store.add({"Ngay":"2026-04-10T07:45:21.589Z","TenKhach":"thuc 101","Tien":30000,"Done":true,"MonId":1,"Id":2})
            store.add({"Ngay":"2026-04-10T07:45:21.589Z","TenKhach":"thuc 101","Tien":30000,"Done":true,"MonId":1,"Id":3})
        }

        // ===== TABLE Thu =====
        if (!db.objectStoreNames.contains('Thu')) {
          const store = db.createObjectStore('Thu', {
            keyPath: 'Id',
            autoIncrement: true
          })
          store.add({"Ngay":"2026-04-13T02:05:45.733Z","TienThu":"100000","GhiChu":"Giao 10 chai quán cơm","Id":2})
        }
        // ===== TABLE Thu =====
        if (!db.objectStoreNames.contains('Chi')) {
          const store = db.createObjectStore('Chi', {
            keyPath: 'Id',
            autoIncrement: true
          })
        }


      }

    })
  }

  return dbPromise
}