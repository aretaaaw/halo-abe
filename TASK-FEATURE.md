# 📋 Fitur Tugas (Task Management) - Database Integration

## ✅ Status: COMPLETED

Fitur tugas sekarang terintegrasi dengan database dan menyimpan data per user!

---

## 🎯 Fitur yang Ditambahkan

### 1. **Submit Tugas ke Database**
- User bisa submit tugas dengan:
  - ✅ Nama Tugas
  - ✅ Deadline
  - ✅ Mata Pelajaran
  - ✅ Tingkat Kesulitan (★ 1-5)
- Tugas langsung **tersimpan di server**
- Data **tersimpan per user** (sesuai session login)

### 2. **History Tugas Otomatis**
- ✅ Tugas yang di-submit langsung tampil di list "Prioritas Tugas"
- ✅ Sorted by deadline (otomatis)
- ✅ Sorted by difficulty level jika deadline sama
- ✅ History tugas yang sudah selesai tersimpan di "History Tugas"

### 3. **Menandai Tugas Selesai**
- ✅ Checkbox di setiap tugas untuk mark as completed
- ✅ Tugas completed otomatis pindah ke "History Tugas"
- ✅ Timestamp "completedAt" tercatat di server

### 4. **Delete Tugas**
- ✅ Tombol "Hapus" untuk menghapus tugas dari database
- ✅ Konfirmasi sebelum delete

### 5. **Kalender Tugas**
- ✅ Kalender menampilkan tanggal yang ada tugas
- ✅ Click tanggal untuk lihat tugas apa aja di hari itu
- ✅ Highlight "today" (hari ini)
- ✅ Highlight "has-task" (ada tugas)

### 6. **Tampilan Tugas Overdue**
- ✅ Tugas yang deadline-nya lewat tampil dengan background merah
- ✅ Visual indicator: "Tugas di luar deadline"

---

## 🔌 Backend API Endpoints

### 1. **POST /api/tugas** - Create Task
```bash
curl -X POST http://localhost:8080/api/tugas \
  -H "Content-Type: application/json" \
  -b "connect.sid=..." \
  -d '{
    "name": "Laporan Fisika",
    "mapel": "Fisika",
    "deadline": "2025-11-25",
    "rating": 3
  }'
```

**Response:**
```json
{
  "message": "task created",
  "task": {
    "id": "task_1763450303685_tab0zj",
    "name": "Laporan Fisika",
    "mapel": "Fisika",
    "deadline": "2025-11-25",
    "rating": 3,
    "status": "pending",
    "createdAt": "2025-11-18T07:18:23.685Z",
    "completedAt": null
  }
}
```

### 2. **GET /api/tugas** - Get All Tasks
```bash
curl http://localhost:8080/api/tugas \
  -b "connect.sid=..."
```

**Response:**
```json
{
  "pending": [
    {
      "id": "task_1763450303685_tab0zj",
      "name": "Laporan Fisika",
      "mapel": "Fisika",
      "deadline": "2025-11-25",
      "rating": 3,
      "status": "pending",
      "createdAt": "2025-11-18T07:18:23.685Z",
      "completedAt": null
    }
  ],
  "completed": [
    {
      "id": "task_1763450311234_abc123",
      "name": "PR Matematika",
      "mapel": "Matematika",
      "deadline": "2025-11-20",
      "rating": 2,
      "status": "completed",
      "createdAt": "2025-11-18T07:18:10.000Z",
      "completedAt": "2025-11-18T07:18:32.619Z"
    }
  ],
  "total": 2
}
```

### 3. **PUT /api/tugas/:taskId** - Mark as Completed
```bash
curl -X PUT http://localhost:8080/api/tugas/task_1763450303685_tab0zj \
  -H "Content-Type: application/json" \
  -b "connect.sid=..." \
  -d '{ "status": "completed" }'
```

**Response:**
```json
{
  "message": "task completed",
  "task": {
    "id": "task_1763450303685_tab0zj",
    "name": "Laporan Fisika",
    "mapel": "Fisika",
    "deadline": "2025-11-25",
    "rating": 3,
    "status": "completed",
    "createdAt": "2025-11-18T07:18:23.685Z",
    "completedAt": "2025-11-18T07:18:32.619Z"
  }
}
```

### 4. **DELETE /api/tugas/:taskId** - Delete Task
```bash
curl -X DELETE http://localhost:8080/api/tugas/task_1763450303685_tab0zj \
  -b "connect.sid=..."
```

**Response:**
```json
{
  "message": "task deleted"
}
```

---

## 📊 Data Structure

### Task Object
```javascript
{
  id: "task_1763450303685_tab0zj",  // Unique ID
  name: "Laporan Fisika",            // Task name
  mapel: "Fisika",                   // Subject
  deadline: "2025-11-25",            // Date string (YYYY-MM-DD)
  rating: 3,                         // Difficulty 1-5
  status: "pending",                 // 'pending' or 'completed'
  createdAt: "2025-11-18T...",      // Timestamp
  completedAt: null                  // Null if pending, timestamp if completed
}
```

### User Task Storage
```javascript
// Backend structure
const tasks = new Map();
// tasks.get(userId) → Array of task objects
tasks.set(userId, [
  { id, name, mapel, deadline, rating, status, createdAt, completedAt },
  { id, name, mapel, deadline, rating, status, createdAt, completedAt }
]);
```

---

## 🔐 Security & Authentication

- ✅ **Session-based**: Setiap API endpoint memerlukan authentication
- ✅ **Per-user data**: Tugas hanya bisa diakses user yang login
- ✅ **User isolation**: User A tidak bisa lihat tugas User B
- ✅ **Authorization**: Hanya user yang membuat tugas yang bisa edit/delete

---

## 🚀 How It Works

### 1. Submit Tugas
```
User fills form → Click "Tambah Tugas" → 
POST /api/tugas (send form data) → 
Server stores in tasks Map (per userId) → 
Frontend calls loadTasks() → 
UI refresh with new task
```

### 2. Load Tugas pada Page Load
```
Page load → initFunctions.tugas() → 
loadTasks() called → 
GET /api/tugas → 
Server returns pending & completed tasks → 
Frontend renderTasks() & renderHistory()
```

### 3. Mark Tugas Selesai
```
User clicks checkbox → 
completeTask(taskId) called → 
PUT /api/tugas/{taskId} → 
Server updates status to "completed" → 
loadTasks() refresh → 
Task moves to History
```

### 4. Delete Tugas
```
User clicks "Hapus" → Confirm dialog → 
deleteTask(taskId) called → 
DELETE /api/tugas/{taskId} → 
Server removes from tasks Map → 
loadTasks() refresh → 
Task disappears from list
```

---

## 📝 Frontend Implementation

### Key Functions in `pages/halo.html`

```javascript
// Load tasks dari server
async function loadTasks() {
  const res = await fetch('/api/tugas', { credentials: 'include' });
  const data = await res.json();
  renderTasks(data.pending);
  renderHistory(data.completed);
  renderCalendar(data.pending);
}

// Submit task
async function submitTask(name, mapel, deadline, rating) {
  const res = await fetch('/api/tugas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ name, mapel, deadline, rating })
  });
  loadTasks(); // Refresh setelah submit
}

// Mark complete
async function completeTask(taskId) {
  const res = await fetch(`/api/tugas/${taskId}`, {
    method: 'PUT',
    credentials: 'include'
  });
  loadTasks(); // Refresh setelah update
}

// Delete
async function deleteTask(taskId) {
  const res = await fetch(`/api/tugas/${taskId}`, {
    method: 'DELETE',
    credentials: 'include'
  });
  loadTasks(); // Refresh setelah delete
}
```

---

## ✨ Features Highlights

| Fitur | Status | Note |
|-------|--------|------|
| Submit Tugas | ✅ | Real-time server storage |
| History Tugas | ✅ | Auto-sync dengan server |
| Mark Complete | ✅ | Checkbox → completed status |
| Delete Tugas | ✅ | Dengan konfirmasi |
| Kalender | ✅ | Click untuk lihat detail |
| Per-user Storage | ✅ | Isolated by userId |
| Sorting (Deadline) | ✅ | Auto sorted |
| Sorting (Difficulty) | ✅ | Secondary sort |
| Overdue Indicator | ✅ | Red background |
| Responsive | ✅ | Mobile friendly |

---

## 🔄 Data Flow

```
┌─────────────┐
│  User Login │
└──────┬──────┘
       │
       ▼
┌──────────────────────────┐
│ initFunctions.tugas()    │
│ loadTasks() called      │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ GET /api/tugas           │
│ (server returns tasks)  │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ renderTasks()            │
│ renderHistory()          │
│ renderCalendar()         │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ UI shows tugas list      │
└──────────────────────────┘
       │
       ├─ User submit new task ──┐
       │                          │
       ├─ User mark complete ───┐ │
       │                         │ │
       └─ User delete task ────┐ │ │
                                │ │ │
                    ┌───────────┘ │ │
                    │ POST/PUT/DELETE /api/tugas
                    │             │ │
                    └─────────────┘ │
                        │           │
                        │ loadTasks()
                        │           │
                        └───────────┘
```

---

## 🎯 Next Improvements

### Future Enhancements:
1. **Persistent Database** - Replace in-memory Map with MongoDB
2. **Export/Import** - Export tugas ke PDF atau Excel
3. **Notifications** - Alert jika deadline mendekati
4. **Tags** - Kategorisasi tugas dengan tags
5. **Recurring Tasks** - Tugas berulang setiap minggu/bulan
6. **Attachments** - Upload file untuk tugas
7. **Collaboration** - Share tugas dengan teman

---

## 🧪 Testing Checklist

- ✅ Register user → OK
- ✅ Login user → OK
- ✅ Submit tugas baru → OK, tersimpan di server
- ✅ Tugas muncul di "Prioritas Tugas" → OK
- ✅ Mark tugas complete → OK, pindah ke "History Tugas"
- ✅ Delete tugas → OK, hilang dari list
- ✅ Reload halaman → OK, tugas tetap ada (server persist)
- ✅ Login user berbeda → OK, hanya lihat tugas milik sendiri
- ✅ Kalender sync → OK, menampilkan tugas per tanggal
- ✅ Sorting deadline → OK, sorted otomatis

---

## 📌 Important Notes

1. **In-Memory Storage**: Tugas disimpan di RAM server (tidak persist setelah server restart)
2. **Per-User Isolation**: Setiap user hanya bisa akses tugas milik sendiri
3. **Timestamps**: createdAt & completedAt otomatis di-set server
4. **Sorting**: Automatic by deadline, then by difficulty
5. **Status**: Always "pending" saat buat, berubah ke "completed" saat mark done

---

## 🚀 Deployment Notes

Ketika deploy ke Vercel:
1. Backend API tetap berfungsi (serverless)
2. Session storage akan berubah (configurable)
3. Untuk production: ganti in-memory dengan MongoDB Atlas
4. CORS sudah dikonfigurasi: `origin: "http://localhost:8080"`
5. Untuk production: update CORS origin ke domain Vercel

---

**Last Updated:** 2025-11-18  
**Commit:** 6aa50eb

