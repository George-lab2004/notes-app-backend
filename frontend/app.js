// ─── CONFIG ──────────────────────────────────────────────────────────────────
const API = 'https://notes-app-backend-six-gamma.vercel.app'

// ─── STATE ───────────────────────────────────────────────────────────────────
let token      = localStorage.getItem('token')    || null
let userName   = localStorage.getItem('userName') || ''
let editingId  = null
let deletingId = null
let allNotes   = []  // kept in memory for live search

// ─── DOM REFS ─────────────────────────────────────────────────────────────────
const authScreen       = document.getElementById('auth-screen')
const dashboard        = document.getElementById('dashboard')
const notesGrid        = document.getElementById('notes-grid')
const emptyState       = document.getElementById('empty-state')
const userGreeting     = document.getElementById('user-greeting')
const userAvatar       = document.getElementById('user-avatar')
const notesCount       = document.getElementById('notes-count')
const modalOverlay     = document.getElementById('modal-overlay')
const confirmOverlay   = document.getElementById('confirm-overlay')
const modalTitle       = document.getElementById('modal-title')
const modalSubmitBtn   = document.getElementById('modal-submit-btn')
const noteForm         = document.getElementById('note-form')
const noteTitleInput   = document.getElementById('note-title')
const noteContentInput = document.getElementById('note-content')
const searchInput      = document.getElementById('search-input')

// ─── TOAST ───────────────────────────────────────────────────────────────────
function toast(message, type = 'info') {
    const container = document.getElementById('toast')
    const el = document.createElement('div')
    el.className = `toast-msg ${type}`
    el.textContent = message
    container.appendChild(el)
    setTimeout(() => el.remove(), 3200)
}

// ─── API HELPER ───────────────────────────────────────────────────────────────
async function api(method, path, body = null) {
    const headers = { 'Content-Type': 'application/json' }
    if (token) headers['token'] = token
    const res = await fetch(API + path, {
        method, headers,
        body: body ? JSON.stringify(body) : null,
    })
    const data = await res.json()
    if (!res.ok) {
        // Joi returns an array of error details — join them into readable text
        if (Array.isArray(data)) throw new Error(data.map(e => e.message).join(' • '))
        throw new Error(data.message || 'Something went wrong')
    }
    return data
}

// ─── LOADING STATE ON BUTTONS ────────────────────────────────────────────────
function setLoading(btn, loading) {
    const label   = btn.querySelector('.btn-label')
    const spinner = btn.querySelector('.btn-spinner')
    btn.disabled = loading
    if (label)   label.classList.toggle('hidden', loading)
    if (spinner) spinner.classList.toggle('hidden', !loading)
}

// ─── SCREEN SWITCH ───────────────────────────────────────────────────────────
function showAuth() {
    authScreen.classList.remove('hidden')
    dashboard.classList.add('hidden')
}
function showDashboard() {
    authScreen.classList.add('hidden')
    dashboard.classList.remove('hidden')
    const initial = userName.charAt(0).toUpperCase() || '?'
    userAvatar.textContent    = initial
    userGreeting.textContent  = userName
    loadNotes()
}

// ─── TAB SWITCHING ───────────────────────────────────────────────────────────
document.querySelectorAll('.auth-tabs .tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.auth-tabs .tab').forEach(t => t.classList.remove('active'))
        document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'))
        tab.classList.add('active')
        document.getElementById(`${tab.dataset.tab}-form`).classList.add('active')
    })
})

// ─── PASSWORD SHOW/HIDE ───────────────────────────────────────────────────────
document.querySelectorAll('.pw-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
        const input = document.getElementById(btn.dataset.target)
        const show  = input.type === 'password'
        input.type  = show ? 'text' : 'password'
        btn.textContent = show ? '🙈' : '👁'
    })
})

// ─── PASSWORD STRENGTH ───────────────────────────────────────────────────────
const strengthFill  = document.getElementById('strength-fill')
const strengthLabel = document.getElementById('strength-label')
const suPassword    = document.getElementById('su-password')
const suRefPassword = document.getElementById('su-refpassword')
const matchHint     = document.getElementById('match-hint')

suPassword.addEventListener('input', () => {
    const val = suPassword.value
    // Backend pattern: starts with letter, alphanumeric, 5-51 chars total
    let score = 0
    if (val.length >= 5)  score++
    if (val.length >= 10) score++
    if (/[A-Z]/.test(val)) score++
    if (/[0-9]/.test(val)) score++
    const levels = [
        { pct: 0,   color: 'transparent', label: '' },
        { pct: 25,  color: '#ef4444',     label: '⚠ Weak' },
        { pct: 50,  color: '#f59e0b',     label: '▲ Fair' },
        { pct: 75,  color: '#3b82f6',     label: '◆ Good' },
        { pct: 100, color: '#22c55e',     label: '✓ Strong' },
    ]
    const lvl = levels[score]
    strengthFill.style.width      = lvl.pct + '%'
    strengthFill.style.background = lvl.color
    strengthLabel.textContent     = lvl.label
    strengthLabel.style.color     = lvl.color
    checkMatch()
})

suRefPassword.addEventListener('input', checkMatch)
function checkMatch() {
    if (!suRefPassword.value) { matchHint.textContent = ''; return }
    const ok = suRefPassword.value === suPassword.value
    matchHint.textContent  = ok ? '✓ Passwords match' : '✗ Passwords do not match'
    matchHint.className    = 'match-hint ' + (ok ? 'ok' : 'bad')
}

// ─── SIGN IN ──────────────────────────────────────────────────────────────────
document.getElementById('signin-form').addEventListener('submit', async e => {
    e.preventDefault()
    const btn      = document.getElementById('signin-btn')
    const email    = document.getElementById('si-email').value.trim()
    const password = document.getElementById('si-password').value
    setLoading(btn, true)
    try {
        const data = await api('POST', '/users/signIn', { email, password })
        token    = data.token
        userName = data.user?.name || email
        localStorage.setItem('token', token)
        localStorage.setItem('userName', userName)
        toast(`Welcome back, ${userName}!`, 'success')
        showDashboard()
    } catch (err) {
        toast(err.message, 'error')
    } finally {
        setLoading(btn, false)
    }
})

// ─── SIGN UP ──────────────────────────────────────────────────────────────────
document.getElementById('signup-form').addEventListener('submit', async e => {
    e.preventDefault()
    const btn         = document.getElementById('signup-btn')
    const name        = document.getElementById('su-name').value.trim()
    const age         = Number(document.getElementById('su-age').value)
    const email       = document.getElementById('su-email').value.trim()
    const password    = suPassword.value
    const refPassword = suRefPassword.value

    // Client-side guard: passwords must match before sending to server
    if (password !== refPassword) {
        toast('Passwords do not match', 'error')
        return
    }
    setLoading(btn, true)
    try {
        // refPassword is sent so Joi validation on the server passes
        await api('POST', '/users/signUp', { name, age, email, password, refPassword })
        toast('Account created! Please sign in.', 'success')
        document.querySelector('[data-tab="signin"]').click()
        document.getElementById('si-email').value = email
        document.getElementById('signup-form').reset()
        strengthFill.style.width = '0'
        strengthLabel.textContent = ''
        matchHint.textContent = ''
    } catch (err) {
        toast(err.message, 'error')
    } finally {
        setLoading(btn, false)
    }
})

// ─── LOGOUT ──────────────────────────────────────────────────────────────────
document.getElementById('logout-btn').addEventListener('click', () => {
    token = null; userName = ''; allNotes = []
    localStorage.removeItem('token')
    localStorage.removeItem('userName')
    notesGrid.innerHTML = ''
    showAuth()
    toast('Logged out', 'info')
})

// ─── LOAD NOTES ──────────────────────────────────────────────────────────────
async function loadNotes() {
    try {
        const data = await api('GET', '/notes')
        allNotes = data.notes || []
        renderNotes(allNotes)
    } catch (err) {
        toast(err.message, 'error')
        if (err.message.toLowerCase().includes('token')) showAuth()
    }
}

// ─── SEARCH ───────────────────────────────────────────────────────────────────
searchInput.addEventListener('input', () => {
    const q = searchInput.value.toLowerCase().trim()
    const filtered = q
        ? allNotes.filter(n =>
            n.title.toLowerCase().includes(q) ||
            n.content.toLowerCase().includes(q))
        : allNotes
    renderNotes(filtered, q)
})

// ─── RENDER NOTES ────────────────────────────────────────────────────────────
function renderNotes(notes, highlight = '') {
    notesGrid.innerHTML = ''
    notesCount.textContent = `${notes.length} note${notes.length !== 1 ? 's' : ''}`

    if (notes.length === 0) { emptyState.classList.remove('hidden'); return }
    emptyState.classList.add('hidden')

    notes.forEach(note => {
        const card = document.createElement('div')
        card.className = 'note-card'
        card.innerHTML = `
            <div class="note-card-top">
                <div class="note-title">${highlightText(escapeHtml(note.title), highlight)}</div>
                <div class="note-content">${highlightText(escapeHtml(note.content), highlight)}</div>
            </div>
            <div class="note-footer">
                <button class="note-btn edit"   data-id="${note._id}">✏ Edit</button>
                <button class="note-btn delete" data-id="${note._id}">🗑 Delete</button>
            </div>
        `
        card.querySelector('.edit').addEventListener('click', () => openEditModal(note))
        card.querySelector('.delete').addEventListener('click', () => openConfirm(note._id))
        notesGrid.appendChild(card)
    })
}

// ─── HIGHLIGHT SEARCH TERM ───────────────────────────────────────────────────
function highlightText(text, query) {
    if (!query) return text
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    return text.replace(new RegExp(`(${escaped})`, 'gi'),
        '<mark style="background:#fef08a;border-radius:2px">$1</mark>')
}

// ─── OPEN ADD MODAL ──────────────────────────────────────────────────────────
document.getElementById('add-note-btn').addEventListener('click', () => {
    editingId = null
    modalTitle.textContent       = 'New Note'
    modalSubmitBtn.textContent   = 'Save Note'
    noteForm.reset()
    updateCharCounts()
    openModal()
})

// ─── OPEN EDIT MODAL ────────────────────────────────────────────────────────
function openEditModal(note) {
    editingId = note._id
    modalTitle.textContent       = 'Edit Note'
    modalSubmitBtn.textContent   = 'Update Note'
    noteTitleInput.value         = note.title
    noteContentInput.value       = note.content
    updateCharCounts()
    openModal()
}

// ─── CHAR COUNTERS ────────────────────────────────────────────────────────────
function updateCharCounts() {
    document.getElementById('title-count').textContent   = `${noteTitleInput.value.length} / 50`
    document.getElementById('content-count').textContent = `${noteContentInput.value.length} / 5000`
}
noteTitleInput.addEventListener('input',   updateCharCounts)
noteContentInput.addEventListener('input', updateCharCounts)

// ─── SAVE NOTE (CREATE / UPDATE) ─────────────────────────────────────────────
noteForm.addEventListener('submit', async e => {
    e.preventDefault()
    const title   = noteTitleInput.value.trim()
    const content = noteContentInput.value.trim()
    modalSubmitBtn.disabled = true
    try {
        if (editingId) {
            await api('PUT', `/notes/${editingId}`, { title, content })
            toast('Note updated', 'success')
        } else {
            await api('POST', '/notes', { title, content })
            toast('Note created', 'success')
        }
        closeModal()
        loadNotes()
    } catch (err) {
        toast(err.message, 'error')
    } finally {
        modalSubmitBtn.disabled = false
    }
})

// ─── DELETE CONFIRM ───────────────────────────────────────────────────────────
function openConfirm(id) {
    deletingId = id
    confirmOverlay.classList.remove('hidden')
}
document.getElementById('confirm-delete-btn').addEventListener('click', async () => {
    try {
        await api('DELETE', `/notes/${deletingId}`)
        toast('Note deleted', 'info')
        confirmOverlay.classList.add('hidden')
        loadNotes()
    } catch (err) { toast(err.message, 'error') }
})
document.getElementById('confirm-cancel-btn').addEventListener('click', () => {
    confirmOverlay.classList.add('hidden'); deletingId = null
})

// ─── MODAL HELPERS ────────────────────────────────────────────────────────────
function openModal() {
    modalOverlay.classList.remove('hidden')
    setTimeout(() => noteTitleInput.focus(), 60)
}
function closeModal() {
    modalOverlay.classList.add('hidden')
    editingId = null; noteForm.reset(); updateCharCounts()
}
document.getElementById('modal-close-btn').addEventListener('click', closeModal)
document.getElementById('modal-cancel-btn').addEventListener('click', closeModal)
modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal() })
confirmOverlay.addEventListener('click', e => { if (e.target === confirmOverlay) confirmOverlay.classList.add('hidden') })

// ─── ESCAPE HTML (XSS PREVENTION) ────────────────────────────────────────────
function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
}

// ─── INIT ─────────────────────────────────────────────────────────────────────
if (token) { showDashboard() } else { showAuth() }

