# 🎯 QUICK REFERENCE GUIDE

**Vercel Deployment Issues - Next.js 15**

## 🚨 EMERGENCY CHECKLIST

### ENOENT Client-Reference-Manifest Fehler

```bash
# SOFORT-LÖSUNG:
# 1. Route Groups mit Root-Pages entfernen
rm src/app/(PROBLEMATIC_GROUP)/page.tsx

# 2. Route Group komplett auflösen
mv src/app/(main)/* src/app/(dashboard)/
rm -r src/app/(main)

# 3. Build testen
npm run build
```

### Server-Side Exception

```bash
# SOFORT-LÖSUNG:
# 1. NextAuth temporär deaktivieren
# In src/app/layout.tsx:
# const session = await getSession(); → const session = null;

# 2. Suspense Boundaries hinzufügen
# Für alle useSearchParams(), usePathname() etc.

# 3. Build testen
npm run build
```

## ⚡ DEPLOYMENT COMMAND

```bash
git add -A
git commit -m "fix(vercel): route group + auth fixes"
git push

# Status überwachen:
npx vercel ls
```

## 🎯 SUCCESS INDICATORS

- ✅ `npm run build` erfolgreich
- ✅ `npx vercel ls` zeigt "● Ready"
- ✅ App lädt unter https://weg-community.vercel.app

---

**Reminder**: Ausführliche Dokumentation in `VERCEL-DEPLOYMENT-TROUBLESHOOTING.md`
