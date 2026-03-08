// Role tab switcher
    let selectedRole = 'customer';
    function setRole(role, btn) {
        selectedRole = role;
        document.querySelectorAll('.role-btn').forEach(b => {
            b.classList.remove('bg-card','text-heading','border','border-borderHi','shadow');
            b.classList.add('text-muted');
        });
        btn.classList.add('bg-card','text-heading','border','border-borderHi','shadow');
        btn.classList.remove('text-muted');

        // Pre-fill demo credentials
        const demos = {
            customer: { id:'12345',      pass:'demo1234'  },
            reader:   { id:'reader01',   pass:'reader123' },
            admin:    { id:'admin01',    pass:'admin123'  },
        };
        document.getElementById('clientnumber').value = demos[role].id;
        document.getElementById('password').value     = demos[role].pass;
    }

    // Init first role tab
    window.addEventListener('DOMContentLoaded', () => {
        const firstBtn = document.querySelector('.role-btn[data-role="customer"]');
        setRole('customer', firstBtn);
    });

    // Toggle password visibility
    function togglePwd() {
        const inp = document.getElementById('password');
        const ico = document.getElementById('eyeIcon');
        if (inp.type === 'password') {
            inp.type = 'text';
            ico.className = 'fa-solid fa-eye-slash';
        } else {
            inp.type = 'password';
            ico.className = 'fa-solid fa-eye';
        }
    }

    // Login logic
    const ACCOUNTS = {
        '12345':    { pass:'demo1234',  role:'customer', name:'John Doe',       accountType:'Residential Customer', redirect:'homedashboard.html' },
        'reader01': { pass:'reader123', role:'reader',   name:'Maria Santos',   accountType:'Water Meter Reader',   redirect:'reader-home.html'   },
        'admin01':  { pass:'admin123',  role:'admin',    name:'Administrator',  accountType:'System Administrator', redirect:'admin-dashboard.html'},
    };

    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const id   = document.getElementById('clientnumber').value.trim();
        const pass = document.getElementById('password').value;
        const err  = document.getElementById('errorMessage');
        err.classList.add('hidden');

        const acc = ACCOUNTS[id];
        if (acc && acc.pass === pass) {
            const data = { clientNumber:id, name:acc.name, accountType:acc.accountType, role:acc.role, loginTime:new Date().toISOString(), isLoggedIn:true };
            localStorage.setItem('tubigtalaUser', JSON.stringify(data));
            if (document.getElementById('remember').checked) localStorage.setItem('tubigtalaRemember','true');
            window.location.href = acc.redirect;
        } else {
            err.classList.remove('hidden');
            err.textContent = 'Invalid client number or password. Please check your credentials.';
        }
    });

    // Bill estimator
    function estimateBill() {
        const m3 = parseFloat(document.getElementById('estimateInput').value) || 0;
        let bill = 0;
        if (m3 <= 0) { document.getElementById('estimateResult').textContent = '₱ —'; return; }

        const blocks = [
            { max:10, rate:12 },
            { max:20, rate:16 },
            { max:30, rate:20 },
            { max:40, rate:24 },
            { max:Infinity, rate:28 },
        ];

        let remaining = m3;
        let prev = 0;
        for (const block of blocks) {
            const size = Math.min(remaining, block.max - prev);
            if (size <= 0) break;
            bill += size * block.rate;
            remaining -= size;
            prev = block.max;
            if (remaining <= 0) break;
        }

        document.getElementById('estimateResult').textContent = '₱ ' + bill.toFixed(2);
    }

    // Redirect if already logged in
    window.addEventListener('load', () => {
        try {
            const u = JSON.parse(localStorage.getItem('tubigtalaUser') || '{}');
            if (u.isLoggedIn) {
                const map = { customer:'homedashboard.html', reader:'reader-home.html', admin:'admin-dashboard.html' };
                if (map[u.role]) window.location.href = map[u.role];
            }
        } catch(e) {}
    });