  // Clock
     function updateClock() {
        const t = new Date().toLocaleTimeString('en-PH', { hour:'2-digit', minute:'2-digit', second:'2-digit' });
        const el = document.getElementById('navClock');
        if (el) el.textContent = t;
    }
    updateClock();
    setInterval(updateClock, 1000);
    

    // Tabs
    function switchTab(name, btn) {
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.getElementById(name).classList.add('active');
        const b = btn || document.querySelector(`[data-tab="${name}"]`);
        if (b) b.classList.add('active');
    }

    // Dropdown
    function toggleDropdown(e) { e.stopPropagation(); document.getElementById('navDropdown').classList.toggle('hidden'); }
    document.addEventListener('click', () => document.getElementById('navDropdown').classList.add('hidden'));

    // Logout
    function logout() {
    if (confirm('Are you sure you want to logout?')) {

        localStorage.clear(); 

        window.location.replace('landing page.html');
    }
}

    // Search / filter
    document.addEventListener('DOMContentLoaded', () => {
        const s = document.getElementById('searchConsumer');
        const f = document.getElementById('filterStatus');
        if (s) s.addEventListener('keyup', filterTable);
        if (f) f.addEventListener('change', filterTable);

        // Login check
        try {
            const u = JSON.parse(localStorage.getItem('tubigtalaUser') || '{}');
            if (u.name) {
                document.getElementById('dropdownName').textContent = u.name;
                document.getElementById('headerName').textContent = u.name;
            }
        } catch(e) {}
    });

    function filterTable() {
        const q = document.getElementById('searchConsumer').value.toLowerCase();
        const f = document.getElementById('filterStatus').value.toLowerCase();
        const rows = document.querySelectorAll('#consumersTableBody tr');
        let count = 0;
        rows.forEach(row => {
            const t = row.textContent.toLowerCase();
            const show = (q === '' || t.includes(q)) && (f === '' || t.includes(f));
            row.style.display = show ? '' : 'none';
            if (show) count++;
        });
        document.getElementById('recordCount').textContent = `Showing ${count} of 25 consumers`;
    }

    // ── READING MODAL ──
    let currentStream = null;

    function openReadingModal(acc, name, addr, lastReading) {
        document.getElementById('mAccNum').textContent = acc;
        document.getElementById('mConsumerName').textContent = name;
        document.getElementById('mAddress').textContent = addr;
        document.getElementById('mLastReading').textContent = lastReading + ' m³';
        document.getElementById('modalSubtitle').textContent = acc + ' · ' + name;
        document.getElementById('meterReading').value = '';
        document.getElementById('readingNotes').value = '';
        resetCameraUI();
        document.getElementById('readingModal').classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function closeReadingModal() {
        closeCamera();
        document.getElementById('readingModal').classList.add('hidden');
        document.body.style.overflow = '';
    }

    function submitReading() {
        const val = document.getElementById('meterReading').value;
        const acc = document.getElementById('mAccNum').textContent;
        if (!val) { alert('Please enter or scan a meter reading.'); return; }
        alert(`✅ Reading submitted!\n\nAccount: ${acc}\nReading: ${val} m³`);
        closeReadingModal();
    }

    // ── CAMERA ──
    function resetCameraUI() {
        document.getElementById('cameraPlaceholder').style.display = 'flex';
        document.getElementById('cameraView').style.display = 'none';
        document.getElementById('processingView').style.display = 'none';
        document.getElementById('processingSpinner').style.display = 'flex';
        document.getElementById('ocrResult').style.display = 'none';
    }

    async function openCamera() {
        document.getElementById('cameraPlaceholder').style.display = 'none';
        document.getElementById('cameraView').style.display = 'flex';
        document.getElementById('cameraView').style.flexDirection = 'column';

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } }
            });
            currentStream = stream;
            document.getElementById('cameraFeed').srcObject = stream;
        } catch (err) {
            // Camera not available in this environment — show prototype UI
            console.warn('Camera not available:', err);
            document.getElementById('cameraFeed').style.background = 'linear-gradient(135deg,#060d1a 0%,#0a1628 100%)';
            document.getElementById('scanStatus').querySelector('span:last-child').textContent = 'Demo Mode — No Camera';
        }
    }

    function closeCamera() {
        if (currentStream) {
            currentStream.getTracks().forEach(t => t.stop());
            currentStream = null;
        }
        document.getElementById('cameraFeed').srcObject = null;
        resetCameraUI();
    }

    function captureFrame() {
        // In production: capture frame → send to OCR API
        // For prototype: simulate OCR result after delay
        document.getElementById('cameraView').style.display = 'none';
        document.getElementById('processingView').style.display = 'flex';
        document.getElementById('processingView').style.flexDirection = 'column';
        closeCamera();

        setTimeout(() => {
            // Simulated OCR output
            const fakeReading = (Math.floor(Math.random() * 900) + 1200).toString() + '.' + Math.floor(Math.random()*99).toString().padStart(2,'0');
            document.getElementById('ocrValueDisplay').textContent = fakeReading;
            document.getElementById('processingSpinner').style.display = 'none';
            document.getElementById('ocrResult').style.display = 'block';
        }, 2200);
    }

    function acceptOCR() {
        const val = document.getElementById('ocrValueDisplay').textContent;
        document.getElementById('meterReading').value = val;
        resetCameraUI();
    }

    function retryCamera() {
        resetCameraUI();
        openCamera();
    }

    // ── VIEW MODAL ──
    function viewReading(acc, name, reading) {
        document.getElementById('viewAccNum').textContent = acc;
        document.getElementById('viewName').textContent = name;
        document.getElementById('viewReading').textContent = reading;
        document.getElementById('viewModal').classList.remove('hidden');
    }

    function closeViewModal() {
        document.getElementById('viewModal').classList.add('hidden');
    }

    // Close modals on overlay click
    document.getElementById('readingModal').addEventListener('click', function(e) { if(e.target===this) closeReadingModal(); });
    document.getElementById('viewModal').addEventListener('click', function(e) { if(e.target===this) closeViewModal(); });

    function applyTheme(m) {
        const h = document.getElementById('htmlRoot');
        h.classList.remove('dark','light');
        h.classList.add(m);
        localStorage.setItem('tubigtalaTheme', m);
        const l = document.getElementById('themeLabel');
        if (l) l.textContent = m === 'dark' ? 'Dark' : 'Light';
    }
    function toggleTheme() {
        applyTheme(document.getElementById('htmlRoot').classList.contains('dark') ? 'light' : 'dark');
    }
    (function(){ applyTheme(localStorage.getItem('tubigtalaTheme') || 'dark'); })();

    function updateClock() {
        const t = new Date().toLocaleTimeString('en-PH', { hour:'2-digit', minute:'2-digit', second:'2-digit' });
        const el = document.getElementById('navClock');
        if (el) el.textContent = t;
    }
    updateClock();
    setInterval(updateClock, 1000);

    function switchTab(tabId, el) {
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.getElementById(tabId).classList.add('active');
        if (el) el.classList.add('active');
    }

    function toggleDrop(e) {
        e.stopPropagation();
        document.getElementById('dropMenu').classList.toggle('hidden');
    }
    document.addEventListener('click', () => {
        const d = document.getElementById('dropMenu');
        if (d) d.classList.add('hidden');
    });

    function logout() {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.clear();
            window.location.replace('landing page.html');
        }
    }

    function showToast(message, type = 'success', duration = 3500) {
        const icons = { success:'fa-circle-check', error:'fa-circle-xmark', info:'fa-circle-info' };
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <i class="fa-solid ${icons[type] || icons.success} toast-icon"></i>
            <span>${message}</span>
            <button class="toast-close" onclick="removeToast(this.parentElement)"><i class="fa-solid fa-times" style="font-size:11px"></i></button>
        `;
        container.appendChild(toast);
        setTimeout(() => removeToast(toast), duration);
    }
    function removeToast(el) {
        if (!el || el.classList.contains('removing')) return;
        el.classList.add('removing');
        setTimeout(() => el.remove(), 200);
    }

    
    document.getElementById('readingModal').addEventListener('click', function(e) {
        if (e.target === this) closeReadingModal();
    });

    function showCameraPlaceholder() {
        document.getElementById('cameraPlaceholder').classList.remove('hidden');
        document.getElementById('cameraView').classList.add('hidden');
        document.getElementById('processingView').classList.add('hidden');
    }

    async function openCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            currentStream = stream;
            const feed = document.getElementById('cameraFeed');
            feed.srcObject = stream;
            document.getElementById('cameraPlaceholder').classList.add('hidden');
            document.getElementById('cameraView').classList.remove('hidden');
            document.getElementById('cameraView').style.display = 'flex';
            document.getElementById('processingView').classList.add('hidden');
        } catch (err) {
            showToast('Camera access denied. Please enter reading manually.', 'error');
        }
    }

    function closeCamera() {
        if (currentStream) {
            currentStream.getTracks().forEach(t => t.stop());
            currentStream = null;
        }
        showCameraPlaceholder();
    }

    function captureFrame() {
        closeCamera();
        document.getElementById('processingView').classList.remove('hidden');
        document.getElementById('processingView').style.display = 'flex';
        document.getElementById('processingSpinner').classList.remove('hidden');
        document.getElementById('ocrResult').classList.add('hidden');

        setTimeout(() => {
            const fakeReading = (Math.floor(Math.random() * 900) + 1100).toString();
            document.getElementById('ocrValueDisplay').textContent = fakeReading;
            document.getElementById('processingSpinner').classList.add('hidden');
            document.getElementById('ocrResult').classList.remove('hidden');
        }, 1800);
    }

    function acceptOCR() {
        const val = document.getElementById('ocrValueDisplay').textContent;
        document.getElementById('meterReading').value = val;
        showCameraPlaceholder();
        showToast(`OCR reading ${val} m³ applied!`, 'success');
    }

    function retryCamera() {
        showCameraPlaceholder();
        setTimeout(() => openCamera(), 100);
    }

    function submitReading() {
        const reading = document.getElementById('meterReading').value.trim();
        if (!reading) {
            showToast('Please enter or scan the meter reading first.', 'error');
            return;
        }
        const btn = document.querySelector('[onclick="submitReading()"]');
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin text-xs"></i> Submitting…';
        setTimeout(() => {
            btn.disabled = false;
            btn.innerHTML = '<i class="fa-solid fa-check text-xs"></i> Submit Reading';
            closeReadingModal();
            showToast(`Reading ${reading} m³ submitted successfully!`, 'success');
        }, 1000);
    }

    function viewReading(acc, name, reading) {
        document.getElementById('viewAccNum').textContent    = acc;
        document.getElementById('viewName').textContent      = name;
        document.getElementById('viewReadingVal').textContent = reading;
        document.getElementById('viewModal').classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
    function closeViewModal() {
        document.getElementById('viewModal').classList.add('hidden');
        document.body.style.overflow = '';
    }
    document.getElementById('viewModal').addEventListener('click', function(e) {
        if (e.target === this) closeViewModal();
    });