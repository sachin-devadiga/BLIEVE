/* ============================================
   BLIEVE — auth.js
   Demo-grade client authentication.
   Official team accounts are built in; community
   members can register (stored in localStorage).
   NOT production security — wire to a backend
   before handling real credentials.
   ============================================ */
(function() {
  'use strict';

  var USERS_KEY = 'blieve-users';   // registered community accounts
  var SESSION_KEY = 'blieve-session';

  // --- Official team accounts ---
  // Site supports two login types only: Admin and Member.
  var OFFICIAL_USERS = {
    'admin@blieve.in': {
      password: 'admin2026',
      name: 'Sachin',
      role: 'admin',
      title: 'Administrator',
      avatar: 'S'
    },
    'harshitha@blieve.in': {
      password: 'member2026',
      name: 'Harshitha A',
      role: 'member',
      title: 'Member',
      avatar: 'HA'
    }
  };

  // --- Registered community accounts ---
  function getStore() {
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
    } catch (e) {
      return {};
    }
  }

  function setStore(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function initials(name) {
    var parts = String(name).trim().split(/\s+/);
    var a = (parts[0] || '').charAt(0);
    var b = parts.length > 1 ? parts[parts.length - 1].charAt(0) : '';
    return (a + b).toUpperCase() || 'M';
  }

  function findUser(email) {
    var key = String(email || '').toLowerCase().trim();
    if (OFFICIAL_USERS[key]) {
      var o = OFFICIAL_USERS[key];
      return { key: key, password: o.password, name: o.name, role: o.role, title: o.title, avatar: o.avatar };
    }
    var store = getStore();
    if (store[key]) {
      var r = store[key];
      return { key: key, password: r.password, name: r.name, role: r.role, title: r.title, avatar: r.avatar };
    }
    return null;
  }

  // --- Public API ---
  window.BLIEVE_AUTH = {
    login: function(email, password) {
      var key = String(email || '').toLowerCase().trim();
      var user = findUser(key);
      if (!user) return { success: false, error: 'No account found with this email.' };
      if (user.password !== password) return { success: false, error: 'Incorrect password. Please try again.' };

      var session = {
        email: key,
        name: user.name,
        role: user.role,
        title: user.title,
        avatar: user.avatar,
        loginTime: Date.now()
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      return { success: true, user: session };
    },

    register: function(name, email, password) {
      var key = String(email || '').toLowerCase().trim();
      var cleanName = String(name || '').trim();

      if (cleanName.length < 2) return { success: false, error: 'Please enter your full name.' };
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(key)) return { success: false, error: 'Please enter a valid email address.' };
      if (String(password || '').length < 6) return { success: false, error: 'Password must be at least 6 characters.' };
      if (findUser(key)) return { success: false, error: 'An account with this email already exists. Try signing in.' };

      var store = getStore();
      store[key] = {
        name: cleanName,
        password: password,
        role: 'member',
        title: 'Community Member',
        avatar: initials(cleanName),
        joined: Date.now()
      };
      setStore(store);

      // Auto sign-in after registration
      var session = {
        email: key,
        name: cleanName,
        role: 'member',
        title: 'Community Member',
        avatar: initials(cleanName),
        loginTime: Date.now()
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      return { success: true, user: session };
    },

    logout: function() {
      localStorage.removeItem(SESSION_KEY);
      window.location.href = 'index.html';
    },

    getSession: function() {
      try {
        var data = localStorage.getItem(SESSION_KEY);
        if (!data) return null;
        return JSON.parse(data);
      } catch (e) {
        return null;
      }
    },

    isLoggedIn: function() {
      return this.getSession() !== null;
    },

    isAdmin: function() {
      var s = this.getSession();
      return !!s && s.role === 'admin';
    },

    getRole: function() {
      var s = this.getSession();
      return s ? s.role : null;
    },

    getName: function() {
      var s = this.getSession();
      return s ? s.name : null;
    },

    requireAuth: function() {
      if (!this.isLoggedIn()) {
        window.location.href = 'login.html';
        return false;
      }
      return true;
    },

    requireAdmin: function() {
      if (!this.isAdmin()) {
        window.location.href = 'login.html';
        return false;
      }
      return true;
    }
  };

  // --- Nav auth area on every page ---
  document.addEventListener('DOMContentLoaded', function() {
    var session = BLIEVE_AUTH.getSession();

    document.querySelectorAll('.nav-auth').forEach(function(el) {
      if (session) {
        el.innerHTML =
          '<a href="members.html" class="nav-link" style="display:inline-flex;align-items:center;gap:8px">' +
            '<span style="width:26px;height:26px;border-radius:50%;background:var(--accent-ember);color:#fff;display:inline-flex;align-items:center;justify-content:center;font-size:0.625rem;font-weight:700">' + session.avatar + '</span>' +
            '<span>' + session.name.split(' ')[0] + '</span>' +
          '</a>' +
          '<button onclick="BLIEVE_AUTH.logout()" class="btn btn-ghost btn-sm" style="font-size:0.75rem;padding:0.375rem 0.875rem">Logout</button>';
      } else {
        el.innerHTML =
          '<a href="login.html" class="btn btn-ghost btn-sm">Sign In</a>';
      }
    });

    document.querySelectorAll('.mobile-auth').forEach(function(el) {
      if (session) {
        el.innerHTML =
          '<a href="members.html" class="nav-link">My Dashboard</a>' +
          '<button onclick="BLIEVE_AUTH.logout()" class="btn btn-ghost" style="width:100%">Logout</button>';
      } else {
        el.innerHTML =
          '<a href="login.html" class="nav-link">Sign In</a>';
      }
    });

    // Active nav highlighting
    var path = window.location.pathname.replace(/\/$/, '');
    var filename = path.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(function(link) {
      var href = link.getAttribute('href');
      if (href === filename || (filename === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  });

})();
