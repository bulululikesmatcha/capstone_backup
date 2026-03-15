
    // Page titles
    const pageTitles = {
        overview: 'Overview',
        rates: 'Rates Management',
        consumers: 'Consumer Accounts',
        billing: 'Billing',
        notices: 'Notices'
    };

    // Tabs
    function switchTab(name, el) {
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
        document.getElementById(name).classList.add('active');
        // Find the correct nav item
        const navItem = el && el.classList && el.classList.contains('nav-item')
            ? el
            : document.querySelector(`.nav-item[data-tab="${name}"]`);
        if (navItem) navItem.classList.add('active');
        // Update page title
        document.getElementById('pageTitle').textContent = pageTitles[name] || name;
        // Close sidebar on mobile
        closeSidebar();
    }

    // Mobile sidebar
    function toggleSidebar() {
        document.getElementById('sidebar').classList.toggle('open');
        document.getElementById('sidebarOverlay').classList.toggle('active');
    }
    function closeSidebar() {
        document.getElementById('sidebar').classList.remove('open');
        document.getElementById('sidebarOverlay').classList.remove('active');
    }

    // Logout
    function logout() {
        if (confirm('Are you sure you want to logout?')) {
            ['tubigtalaUser','tubigtalaRemember'].forEach(k => localStorage.removeItem(k));
            window.location.href = 'landing page.html';
        }
    }

    // Rate update
    function updateRate(e) {
        e.preventDefault();
        const r = document.getElementById('newRate').value;
        const d = document.getElementById('effectiveDate').value;
        alert(`✅ Rate updated to ₱${r}/m³\nEffective: ${d}`);
        e.target.reset();
    }

    // Consumer modal
    function viewConsumer(acc, name) {
        document.getElementById('modalAccountNum').textContent = acc;
        document.getElementById('modalConsumerName').textContent = name;
        document.getElementById('consumerModal').classList.remove('hidden');
    }
    function closeModal() {
        document.getElementById('consumerModal').classList.add('hidden');
    }
    document.getElementById('consumerModal').addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });

    // Notices
    function sendNotice(acc) {
        alert(`📨 Notice sent to account ${acc}`);
    }
    function submitNotice(e) {
        e.preventDefault();
        const r = document.getElementById('noticeRecipient').value;
        const s = document.getElementById('noticeSubject').value;
        alert(`✅ Notice sent!\nTo: ${r}\nSubject: ${s}`);
        e.target.reset();
    }
    function loadTemplate(t) {
        const tpl = {
            overdue: { subject: 'Payment Reminder — Account Overdue', message: 'Dear Valued Customer,\n\nThis is a reminder that your water bill is now overdue. Please settle your account at the earliest to avoid service disconnection.\n\nThank you,\nTUBIGTALA Administration' },
            maintenance: { subject: 'Scheduled System Maintenance', message: 'Dear Valued Customer,\n\nWe will be performing scheduled maintenance to improve our services. Our portal may be temporarily unavailable.\n\nWe apologize for any inconvenience.\n\nTUBIGTALA Administration' },
            ratechange: { subject: 'Water Rate Update', message: 'Dear Valued Customer,\n\nPlease be informed that the water rate has been adjusted to ₱198 per cubic meter effective immediately.\n\nThank you for your continued patronage.\n\nTUBIGTALA Administration' }
        };
        if (tpl[t]) {
            document.getElementById('noticeSubject').value = tpl[t].subject;
            document.getElementById('noticeMessage').value = tpl[t].message;
            switchTab('notices', document.querySelector('[data-tab="notices"]'));
        }
    }
    function generateBillingReport() {
        alert('📊 Generating billing report...');
    }

    // Init admin name
    window.addEventListener('DOMContentLoaded', () => {
        try {
            const a = JSON.parse(localStorage.getItem('tubigtalaAdmin') || '{}');
            if (a.name) {
                document.getElementById('sidebarAdminName').textContent = a.name;
            }
        } catch(e) {}
    });

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

    /* ────────────────────────────────────────────────────
       SIDEBAR & TAB NAVIGATION
    ──────────────────────────────────────────────────── */
    function switchTab(tabId, el) {
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        document.getElementById(tabId).classList.add('active');
        if (el) el.classList.add('active');
        const titles = { overview:'Overview', rates:'Rates', consumers:'Consumers', billing:'Billing', notices:'Notices' };
        document.getElementById('pageTitle').textContent = titles[tabId] || tabId;
    }
    function toggleSidebar() {
        document.getElementById('sidebar').classList.toggle('open');
        document.getElementById('sidebarOverlay').classList.toggle('active');
    }
    function closeSidebar() {
        document.getElementById('sidebar').classList.remove('open');
        document.getElementById('sidebarOverlay').classList.remove('active');
    }

    /* ────────────────────────────────────────────────────
       CLOCK & DATE
    ──────────────────────────────────────────────────── */
    function updateClock() {
        const now = new Date();
        const t = now.toLocaleTimeString('en-PH', { hour:'2-digit', minute:'2-digit', second:'2-digit' });
        const d = now.toLocaleDateString('en-PH', { month:'short', day:'2-digit', year:'numeric' });
        const el = document.getElementById('sidebarClock');
        const dt = document.getElementById('topbarDate');
        if (el) el.textContent = t;
        if (dt) dt.textContent = d;
    }
    updateClock();
    setInterval(updateClock, 1000);

    /* ────────────────────────────────────────────────────
       VIEW CONSUMER MODAL
    ──────────────────────────────────────────────────── */
    function viewConsumer(accountNum, name) {
        document.getElementById('modalAccountNum').textContent = accountNum;
        document.getElementById('modalConsumerName').textContent = name;
        document.getElementById('consumerModal').classList.remove('hidden');
    }
    function closeConsumerModal() {
        document.getElementById('consumerModal').classList.add('hidden');
    }
    document.getElementById('consumerModal').addEventListener('click', function(e) {
        if (e.target === this) closeConsumerModal();
    });

    /* ────────────────────────────────────────────────────
       RATES
    ──────────────────────────────────────────────────── */
    function updateRate(e) {
        e.preventDefault();
        const rate = document.getElementById('newRate').value;
        const date = document.getElementById('effectiveDate').value;
        if (!rate || !date) return;
        showToast(`Rate updated to ₱${parseFloat(rate).toFixed(2)}/m³ · Effective ${date}`, 'success');
        e.target.reset();
    }

    /* ────────────────────────────────────────────────────
       NOTICES
    ──────────────────────────────────────────────────── */
    function submitNotice(e) {
        e.preventDefault();
        showToast('Notice sent successfully to selected recipients!', 'success');
        e.target.reset();
    }
    function loadTemplate(type) {
        const templates = {
            overdue: {
                type: 'overdue_warning',
                subject: 'URGENT: Payment Reminder — Your Account is Overdue',
                message: 'Dear Valued Consumer,\n\nThis is a friendly reminder that your water bill account is currently overdue. Please settle your balance as soon as possible to avoid service interruption.\n\nFor payments and inquiries, please visit the POWASA office.\n\nThank you for your prompt attention.\n\nPOWASA — TUBIGTALA'
            },
            maintenance: {
                type: 'maintenance',
                subject: 'Scheduled System Maintenance Notice',
                message: 'Dear Valued Consumer,\n\nWe would like to inform you that POWASA will be conducting scheduled system maintenance. Water service may be temporarily interrupted during this period.\n\nWe apologize for any inconvenience and thank you for your understanding.\n\nPOWASA — TUBIGTALA'
            },
            ratechange: {
                type: 'rate_change',
                subject: 'Important: Water Rate Update',
                message: 'Dear Valued Consumer,\n\nPlease be informed that POWASA water rates have been updated effective the next billing cycle. The new rates will be reflected in your upcoming bill.\n\nFor questions, please contact the POWASA office.\n\nThank you.\n\nPOWASA — TUBIGTALA'
            }
        };
        const t = templates[type];
        if (!t) return;
        document.getElementById('noticeType').value = t.type;
        document.getElementById('noticeSubject').value = t.subject;
        document.getElementById('noticeMessage').value = t.message;
    }
    function sendNotice(accountId) {
        switchTab('notices', document.querySelector('[data-tab="notices"]'));
        document.getElementById('noticeRecipient').value = 'custom';
        document.getElementById('noticeSubject').value = `Payment Reminder — ${accountId}`;
        loadTemplate('overdue');
    }
    function generateBillingReport() {
        showToast('Billing report is being generated...', 'info');
    }

    /* ════════════════════════════════════════════════════
       CREATE CONSUMER ACCOUNT MODAL
    ════════════════════════════════════════════════════ */
    let caCurrentStep = 1;
    let caGeneratedOTP = '';

    function openCreateAccountModal() {
        caResetModal();
        document.getElementById('createAccountModal').classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        caGenerateOTP();
    }
    function openCreateAccountModalPrefilled(serial, firstName, lastName, zone) {
        openCreateAccountModal();
        const serialInput = document.getElementById('ca_meterSerial');
        serialInput.value = serial.replace('WM-', '');
        caUpdateClientIdPreview(serial.replace('WM-', ''));
        const zoneSelect = document.getElementById('ca_serviceZone');
        for (let opt of zoneSelect.options) {
            if (opt.value === zone) { zoneSelect.value = zone; break; }
        }
        document.getElementById('ca_firstName').value = firstName || '';
        document.getElementById('ca_lastName').value = lastName || '';
    }
    function closeCreateAccountModal() {
        document.getElementById('createAccountModal').classList.add('hidden');
        document.body.style.overflow = '';
    }
    document.getElementById('createAccountModal').addEventListener('click', function(e) {
        if (e.target === this) closeCreateAccountModal();
    });

    function caGoToStep(n) {
        if (n === 2 && !caValidateStep1()) return;
        if (n === 3 && !caValidateStep2()) return;
        if (n === 3) caPopulateStep3();

        document.querySelectorAll('.ca-step-panel').forEach(p => p.classList.remove('active'));
        const panelId = n === 'success' ? 'caStepSuccess' : `caStep${n}`;
        document.getElementById(panelId).classList.add('active');
        caCurrentStep = n;
        document.getElementById('caStepDisplay').textContent = n;
        caUpdateStepIndicators(n);
    }

    function caUpdateStepIndicators(n) {
        for (let i = 1; i <= 3; i++) {
            const sc = document.getElementById(`casc${i}`);
            const sl = document.getElementById(`casl${i}`);
            sc.className = 'step-circle ' + (i < n ? 's-done' : i === n ? 's-active' : 's-pending');
            sc.innerHTML = i < n ? '<i class="fa-solid fa-check" style="font-size:10px"></i>' : i;
            sl.className = `text-[9px] font-semibold uppercase tracking-wide ${i <= n ? 'text-brand-400' : 'text-muted'}`;
        }
        document.getElementById('caline1').className = `step-line ${n > 1 ? 'sl-done' : ''}`;
        document.getElementById('caline2').className = `step-line ${n > 2 ? 'sl-done' : ''}`;
    }

    function caValidateStep1() {
        const s = document.getElementById('ca_meterSerial').value.trim();
        const t = document.getElementById('ca_meterType').value;
        const z = document.getElementById('ca_serviceZone').value;
        const r = document.getElementById('ca_initialReading').value;
        if (!s || !t || !z || r === '') { alert('Please fill in all required meter details.'); return false; }
        return true;
    }
    function caValidateStep2() {
        const fn = document.getElementById('ca_firstName').value.trim();
        const ln = document.getElementById('ca_lastName').value.trim();
        const addr = document.getElementById('ca_address').value.trim();
        const ph = document.getElementById('ca_contactNum').value.trim();
        if (!fn || !ln || !addr || !ph) { alert('Please fill in all required consumer details.'); return false; }
        return true;
    }

    function caUpdateClientIdPreview(v) {
        const preview = document.getElementById('caClientIdPreview');
        const display = document.getElementById('caClientIdValue');
        if (v.trim().length > 0) {
            preview.classList.remove('hidden');
            display.textContent = `WM-${v.trim().toUpperCase()}`;
        } else {
            preview.classList.add('hidden');
        }
    }

    function caPopulateStep3() {
        const serial = document.getElementById('ca_meterSerial').value.trim().toUpperCase();
        const clientId = `WM-${serial}`;
        const zone = document.getElementById('ca_serviceZone').value;
        const type = document.getElementById('ca_meterType').value;
        const fn = document.getElementById('ca_firstName').value.trim();
        const ln = document.getElementById('ca_lastName').value.trim();
        const reading = document.getElementById('ca_initialReading').value;

        // Step 2 summary
        document.getElementById('ca_s2meter').textContent = clientId;
        document.getElementById('ca_s2zone').textContent = zone;
        document.getElementById('ca_s2type').textContent = type;

        // Step 3 fields
        document.getElementById('ca_s3clientId').textContent = clientId;
        document.getElementById('ca_s3name').textContent = `${fn} ${ln}`;
        document.getElementById('ca_s3id').textContent = clientId;
        document.getElementById('ca_s3zone').textContent = `${zone} · ${type}`;
        document.getElementById('ca_s3reading').textContent = `${reading} m³`;
    }

    function caGenerateOTP() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let otp = '';
        for (let i = 0; i < 8; i++) {
            if (i === 4) otp += '-';
            otp += chars[Math.floor(Math.random() * chars.length)];
        }
        caGeneratedOTP = otp;
        const el = document.getElementById('ca_otpDisplay');
        if (el) el.textContent = otp;
    }
    function caRegenerateOTP() {
        caGenerateOTP();
        const btn = document.querySelector('[onclick="caRegenerateOTP()"]');
        if (!btn) return;
        btn.innerHTML = '<i class="fa-solid fa-check text-emerald-400 text-[10px]"></i> Regenerated!';
        setTimeout(() => btn.innerHTML = '<i class="fa-solid fa-rotate text-[10px]"></i> Regenerate', 1500);
    }
    function caCopyOTP() {
        navigator.clipboard.writeText(caGeneratedOTP).catch(() => {});
        const btn = document.getElementById('ca_copyBtn');
        btn.innerHTML = '<i class="fa-solid fa-check text-emerald-400 text-[10px]"></i> Copied!';
        setTimeout(() => btn.innerHTML = '<i class="fa-regular fa-copy text-[10px]"></i> Copy', 1800);
    }

    function caCreateAccount() {
        const chk1 = document.getElementById('ca_chkOtpGiven').checked;
        const chk2 = document.getElementById('ca_chkFormSigned').checked;
        if (!chk1 || !chk2) { alert('Please confirm both checklist items before creating the account.'); return; }

        const btn = document.getElementById('ca_createBtn');
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin text-xs"></i> Creating...';

        setTimeout(() => {
            const serial = document.getElementById('ca_meterSerial').value.trim().toUpperCase();
            const fn = document.getElementById('ca_firstName').value.trim();
            const ln = document.getElementById('ca_lastName').value.trim();
            const zone = document.getElementById('ca_serviceZone').value;
            const type = document.getElementById('ca_meterType').value;
            const reading = document.getElementById('ca_initialReading').value;
            const clientId = `WM-${serial}`;
            const now = new Date().toLocaleString('en-PH', { month:'short', day:'numeric', year:'numeric', hour:'2-digit', minute:'2-digit' });

            document.getElementById('ca_rcName').textContent = `${fn} ${ln}`;
            document.getElementById('ca_rcId').textContent = clientId;
            document.getElementById('ca_rcOtp').textContent = caGeneratedOTP;
            document.getElementById('ca_rcZone').textContent = zone;
            document.getElementById('ca_rcType').textContent = type;
            document.getElementById('ca_rcReading').textContent = `${reading} m³`;
            document.getElementById('ca_rcDate').textContent = now;

            document.querySelectorAll('.ca-step-panel').forEach(p => p.classList.remove('active'));
            document.getElementById('caStepSuccess').classList.add('active');
            document.getElementById('caStepDisplay').textContent = '✓';
            btn.disabled = false;
            btn.innerHTML = '<i class="fa-solid fa-user-plus text-xs"></i> Create Account';
        }, 1200);
    }

    function caResetModal() {
        caCurrentStep = 1;
        document.querySelectorAll('.ca-step-panel').forEach(p => p.classList.remove('active'));
        document.getElementById('caStep1').classList.add('active');
        document.getElementById('caStepDisplay').textContent = '1';
        caUpdateStepIndicators(1);
        ['ca_meterSerial','ca_meterType','ca_serviceZone','ca_initialReading','ca_firstName','ca_lastName','ca_address','ca_contactNum','ca_emailAddr'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
        document.getElementById('ca_chkOtpGiven').checked = false;
        document.getElementById('ca_chkFormSigned').checked = false;
        document.getElementById('caClientIdPreview').classList.add('hidden');
        caGenerateOTP();
    }
    

    /* ════════════════════════════════════════════════════
       try
    ════════════════════════════════════════════════════ */
     /* ════════════════════════════════════════════════════
       READERS — CREATE ACCOUNT MODAL
    ════════════════════════════════════════════════════ */
    let readerOTP = '';
    let currentAssignReaderId = '';
    let currentAssignReaderName = '';

    function openCreateReaderModal() {
        document.getElementById('createReaderModal').classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        generateReaderOTP();
        ['rdr_firstName','rdr_lastName','rdr_contact','rdr_zone'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
    }
    function closeCreateReaderModal() {
        document.getElementById('createReaderModal').classList.add('hidden');
        document.body.style.overflow = '';
    }
    document.getElementById('createReaderModal').addEventListener('click', function(e) {
        if (e.target === this) closeCreateReaderModal();
    });

    function generateReaderOTP() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let otp = '';
        for (let i = 0; i < 8; i++) {
            if (i === 4) otp += '-';
            otp += chars[Math.floor(Math.random() * chars.length)];
        }
        readerOTP = otp;
        const el = document.getElementById('rdr_otpPreview');
        if (el) el.textContent = otp;
    }

    function submitCreateReader() {
        const fn   = document.getElementById('rdr_firstName').value.trim();
        const ln   = document.getElementById('rdr_lastName').value.trim();
        const ph   = document.getElementById('rdr_contact').value.trim();
        if (!fn || !ln || !ph) { showToast('Please fill in all required fields.', 'error'); return; }
        const btn = document.querySelector('[onclick="submitCreateReader()"]');
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin text-xs"></i> Creating…';
        setTimeout(() => {
            btn.disabled = false;
            btn.innerHTML = '<i class="fa-solid fa-user-plus text-xs"></i> Create Reader';
            closeCreateReaderModal();
            showToast(`Reader account for ${fn} ${ln} created successfully!`, 'success');
        }, 1000);
    }

    /* ── MONITOR MODAL ── */
    let currentMonitorId = '';
    const activitySamples = {
        'RDR-001': [
            { time:'09:30 AM', note:'Submitted reading for WM-9031-B · 2,310 m³' },
            { time:'08:15 AM', note:'Submitted reading for WM-5512-E · 2,101 m³' },
            { time:'Yesterday', note:'Submitted reading for WM-8842-A · 1,245 m³' },
        ],
        'RDR-002': [
            { time:'10:05 AM', note:'Submitted reading for WM-4401-F · 1,890 m³' },
            { time:'09:00 AM', note:'Submitted reading for WM-3312-G · 3,110 m³' },
        ],
        'RDR-003': []
    };

    function viewReader(id, name, zone, period, done, total, status, contact) {
        currentMonitorId = id;
        document.getElementById('rm_avatar').textContent  = name.charAt(0).toUpperCase();
        document.getElementById('rm_name').textContent    = name;
        document.getElementById('rm_id').textContent      = id;
        document.getElementById('rm_zone').textContent    = zone;
        document.getElementById('rm_period').textContent  = period;
        document.getElementById('rm_contact').textContent = contact;
        const pct = total > 0 ? Math.round((done / total) * 100) : 0;
        document.getElementById('rm_progress').textContent = `${done} / ${total}`;
        document.getElementById('rm_pct').textContent      = `${pct}%`;
        document.getElementById('rm_bar').style.width      = `${pct}%`;

        const badge = document.getElementById('rm_statusBadge');
        if (status === 'Active') {
            badge.textContent  = '';
            badge.className    = 'inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-0.5 rounded-full';
            badge.innerHTML    = '<span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>Active';
        } else {
            badge.className    = 'inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-0.5 rounded-full';
            badge.innerHTML    = '<span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>Inactive';
        }

        const log = document.getElementById('rm_activityLog');
        const acts = activitySamples[id] || [];
        if (acts.length === 0) {
            log.innerHTML = '<div class="p-3 bg-canvas border border-border rounded-lg text-xs text-muted">No activity recorded yet.</div>';
        } else {
            log.innerHTML = acts.map(a => `
                <div class="flex items-center justify-between p-3 bg-canvas border border-border rounded-lg text-xs">
                    <span class="text-body">${a.note}</span>
                    <span class="font-mono text-muted ml-3 whitespace-nowrap">${a.time}</span>
                </div>`).join('');
        }

        document.getElementById('readerMonitorModal').classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
    function closeReaderMonitorModal() {
        document.getElementById('readerMonitorModal').classList.add('hidden');
        document.body.style.overflow = '';
    }
    document.getElementById('readerMonitorModal').addEventListener('click', function(e) {
        if (e.target === this) closeReaderMonitorModal();
    });
    function openAssignFromMonitor() {
        closeReaderMonitorModal();
        const name = document.getElementById('rm_name').textContent;
        openAssignModal(currentMonitorId, name);
    }

    /* ── ASSIGN MODAL ── */
    function openAssignModal(id, name) {
        currentAssignReaderId   = id;
        currentAssignReaderName = name;
        document.getElementById('assignSubtitle').textContent = `${id} · ${name}`;
        document.getElementById('assign_zone').value      = '';
        document.getElementById('assign_startDate').value = '';
        document.getElementById('assign_endDate').value   = '';
        document.getElementById('assign_notes').value     = '';
        document.getElementById('assignModal').classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
    function closeAssignModal() {
        document.getElementById('assignModal').classList.add('hidden');
        document.body.style.overflow = '';
    }
    document.getElementById('assignModal').addEventListener('click', function(e) {
        if (e.target === this) closeAssignModal();
    });
    function submitAssignment() {
        const zone  = document.getElementById('assign_zone').value;
        const start = document.getElementById('assign_startDate').value;
        const end   = document.getElementById('assign_endDate').value;
        if (!zone || !start || !end) { showToast('Please fill in zone and both dates.', 'error'); return; }
        const btn = document.querySelector('[onclick="submitAssignment()"]');
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin text-xs"></i> Saving…';
        setTimeout(() => {
            btn.disabled = false;
            btn.innerHTML = '<i class="fa-solid fa-check text-xs"></i> Save Assignment';
            closeAssignModal();
            showToast(`Assignment saved for ${currentAssignReaderName} — ${zone}`, 'success');
        }, 900);
    }