 // Theme
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

    // Clock
     function updateClock() {
        const t = new Date().toLocaleTimeString('en-PH', { hour:'2-digit', minute:'2-digit', second:'2-digit' });
        const el = document.getElementById('navClock');
        if (el) el.textContent = t;
    }
    updateClock();
    setInterval(updateClock, 1000);
    
    // Tabs
    function switchTab(n, b) {
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.tab-btn').forEach(x => x.classList.remove('active'));
        document.getElementById(n).classList.add('active');
        const btn = b || document.querySelector(`[data-tab="${n}"]`);
        if (btn) btn.classList.add('active');
    }

    // Dropdown
    function toggleDrop(e) { e.stopPropagation(); document.getElementById('dropMenu').classList.toggle('hidden'); }
    document.addEventListener('click', () => { const d=document.getElementById('dropMenu'); if(d) d.classList.add('hidden'); });

    // Logout
    function logout() {
        if (confirm('Are you sure you want to logout?')) {
            ['tubigtalaUser','tubigtalaRemember'].forEach(k => localStorage.removeItem(k));
            window.location.href = 'landing page.html';
        }
    }

    // Calculator
    const TARIFF = [{max:10,rate:12},{max:20,rate:16},{max:30,rate:20},{max:40,rate:24},{max:Infinity,rate:28}];
    function calcBill() {
        const prev = parseFloat(document.getElementById('prevReading').value)||0;
        const curr = parseFloat(document.getElementById('currReading').value)||0;
        const m3   = Math.max(0, curr-prev);
        const res  = document.getElementById('calcResult');
        if (!m3 || curr<=prev) { res.classList.add('hidden'); return; }
        res.classList.remove('hidden');
        let total=0, rem=m3, pm=0, lines=[];
        for (const b of TARIFF) {
            const sz = Math.min(rem, b.max-pm);
            if (sz<=0) break;
            const cost = sz*b.rate; total+=cost;
            const lbl = b.max===Infinity ? `${pm+1}+ m³` : `${pm+1}–${b.max} m³`;
            lines.push(`<div class="flex justify-between py-1.5 border-b v-divider last:border-0"><span class="v-muted">${lbl} × ₱${b.rate}/m³ × ${sz} m³</span><span class="font-mono v-body font-semibold">₱${cost.toFixed(2)}</span></div>`);
            rem-=sz; pm=b.max; if(rem<=0) break;
        }
        document.getElementById('calcAmount').textContent = '₱'+total.toFixed(2);
        document.getElementById('calcM3').textContent = m3+' m³';
        document.getElementById('calcBreakdown').innerHTML = lines.join('');
    }

    // Session
    function checkLogin() {
        try {
            const u = JSON.parse(localStorage.getItem('tubigtalaUser')||'{}');
            const name = u.name||'John Doe', type = u.accountType||'Residential Customer';
            ['ddName','headerName','acctName'].forEach(id => { const e=document.getElementById(id); if(e) e.textContent=name; });
            const dt = document.getElementById('ddType'); if(dt) dt.textContent=type;
            const av = document.getElementById('avatarLetter'); if(av) av.textContent=name.charAt(0).toUpperCase();
        } catch(e) {}
    }
    document.addEventListener('DOMContentLoaded', checkLogin);

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
       TABS
    ──────────────────────────────────────────────────── */
    function switchTab(tabId, el) {
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.getElementById(tabId).classList.add('active');
        if (el) el.classList.add('active');
    }

    /* ────────────────────────────────────────────────────
       DROPDOWN
    ──────────────────────────────────────────────────── */
    function toggleDrop(e) {
        e.stopPropagation();
        const m = document.getElementById('dropMenu');
        m.classList.toggle('hidden');
    }
    document.addEventListener('click', () => {
        document.getElementById('dropMenu').classList.add('hidden');
    });

    /* ────────────────────────────────────────────────────
       BILL CALCULATOR
    ──────────────────────────────────────────────────── */
    function calcBill() {
        const prev = parseFloat(document.getElementById('prevReading').value);
        const curr = parseFloat(document.getElementById('currReading').value);
        const resultEl = document.getElementById('calcResult');

        if (isNaN(prev) || isNaN(curr) || curr < prev) {
            resultEl.classList.add('hidden');
            return;
        }

        const usage = curr - prev;
        const blocks = [
            { limit: 10, rate: 12 },
            { limit: 10, rate: 16 },
            { limit: 10, rate: 20 },
            { limit: 10, rate: 24 },
            { limit: Infinity, rate: 28 },
        ];

        let total = 0;
        let remaining = usage;
        let breakdown = '';
        const labels = ['1st 10 m³','Next 10 m³','Next 10 m³','Next 10 m³','Above 40 m³'];

        blocks.forEach((block, i) => {
            if (remaining <= 0) return;
            const consumed = Math.min(remaining, block.limit);
            const cost = consumed * block.rate;
            total += cost;
            remaining -= consumed;
            breakdown += `<div class="flex justify-between py-1.5 border-b v-divider last:border-0">
                <span class="v-muted">${labels[i]} (${consumed} m³ × ₱${block.rate})</span>
                <span class="font-mono v-body font-semibold">₱${cost.toFixed(2)}</span>
            </div>`;
        });

        document.getElementById('calcAmount').textContent = `₱${total.toFixed(2)}`;
        document.getElementById('calcM3').textContent = `${usage} m³`;
        document.getElementById('calcBreakdown').innerHTML = breakdown;
        resultEl.classList.remove('hidden');
    }

    /* ────────────────────────────────────────────────────
       CHANGE PASSWORD MODAL
    ──────────────────────────────────────────────────── */
    function openChangePassword() {
        document.getElementById('dropMenu').classList.add('hidden');
        document.getElementById('pwdModal').classList.add('open');
        document.body.style.overflow = 'hidden';
        resetPwdForm();
    }
    function closePwdModal() {
        document.getElementById('pwdModal').classList.remove('open');
        document.body.style.overflow = '';
    }
    function closePwdIfOutside(e) {
        if (e.target === document.getElementById('pwdModal')) closePwdModal();
    }
    function resetPwdForm() {
        ['pwdCurrent','pwdNew','pwdConfirm'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
        document.getElementById('pwdStrengthFill').style.width = '0%';
        document.getElementById('pwdStrengthLabel').textContent = 'Enter a password';
        document.getElementById('pwdMatchErr').classList.add('hidden');
        document.getElementById('pwdMatchOk').classList.add('hidden');
        ['req-len-icon','req-upper-icon','req-num-icon'].forEach(id => {
            const el = document.getElementById(id);
            el.className = 'fa-solid fa-circle text-[8px] text-muted';
        });
    }

    function togglePwdVisibility(fieldId, btn) {
        const input = document.getElementById(fieldId);
        const isHidden = input.type === 'password';
        input.type = isHidden ? 'text' : 'password';
        btn.innerHTML = isHidden ? '<i class="fa-regular fa-eye-slash"></i>' : '<i class="fa-regular fa-eye"></i>';
    }

    function checkPwdStrength(pwd) {
        const len    = pwd.length >= 8;
        const upper  = /[A-Z]/.test(pwd);
        const num    = /[0-9]/.test(pwd);
        const spec   = /[^A-Za-z0-9]/.test(pwd);

        const setReq = (id, pass) => {
            const el = document.getElementById(id);
            el.className = `fa-solid fa-circle text-[8px] ${pass ? 'text-emerald-400' : 'text-muted'}`;
        };
        setReq('req-len-icon', len);
        setReq('req-upper-icon', upper);
        setReq('req-num-icon', num);

        const score = [len, upper, num, spec, pwd.length >= 12].filter(Boolean).length;
        const fills = [0, 20, 40, 65, 85, 100];
        const colors = ['#ef4444','#ef4444','#f59e0b','#f59e0b','#10b981','#10b981'];
        const labels = ['','Very Weak','Weak','Fair','Strong','Very Strong'];

        const fill = document.getElementById('pwdStrengthFill');
        fill.style.width = fills[score] + '%';
        fill.style.background = colors[score];
        document.getElementById('pwdStrengthLabel').textContent = labels[score] || 'Enter a password';
        checkPwdMatch();
    }

    function checkPwdMatch() {
        const newP = document.getElementById('pwdNew').value;
        const conf = document.getElementById('pwdConfirm').value;
        const errEl = document.getElementById('pwdMatchErr');
        const okEl = document.getElementById('pwdMatchOk');
        if (conf.length === 0) { errEl.classList.add('hidden'); okEl.classList.add('hidden'); return; }
        if (newP === conf) { errEl.classList.add('hidden'); okEl.classList.remove('hidden'); }
        else { okEl.classList.add('hidden'); errEl.classList.remove('hidden'); }
    }

    function submitPwdChange() {
        const current = document.getElementById('pwdCurrent').value.trim();
        const newPwd  = document.getElementById('pwdNew').value;
        const confirm = document.getElementById('pwdConfirm').value;

        if (!current) { alert('Please enter your current password or OTP.'); return; }
        if (newPwd.length < 8) { alert('New password must be at least 8 characters.'); return; }
        if (newPwd !== confirm) { alert('Passwords do not match.'); return; }

        const btn = document.querySelector('[onclick="submitPwdChange()"]');
        btn.disabled = true;
        btn.textContent = 'Updating...';
        setTimeout(() => {
            btn.disabled = false;
            btn.textContent = 'Update Password';
            closePwdModal();
            showToast('Password updated successfully!', 'success');
        }, 1000);
    }