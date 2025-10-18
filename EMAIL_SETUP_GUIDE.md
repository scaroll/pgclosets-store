# pgclosets.com Email Forwarding Setup

## ✅ DNS Configuration Complete

All DNS records have been successfully added to Vercel DNS on **October 9, 2025**:

### MX Records (Email Routing)
```
@ MX 10 mx1.improvmx.com
@ MX 20 mx2.improvmx.com
```

### SPF Record (Sender Authentication)
```
@ TXT "v=spf1 include:spf.improvmx.com ~all"
```

### DMARC Record (Email Authentication & Reporting)
```
_dmarc TXT "v=DMARC1; p=none; rua=mailto:spencer@peoplesgrp.com"
```

**Vercel DNS Record IDs:**
- MX1: `rec_294bce2737d616bc4e04cb3b`
- MX2: `rec_a2efff1d9f8864e268a698ee`
- SPF: `rec_3c8ad0dda42738019696c60e`
- DMARC: `rec_281bf4c1cd9aff7522faa06b`

---

## ⏳ Required: ImprovMX Account Setup

To complete the email forwarding configuration, you need to:

### Step 1: Create ImprovMX Account
1. Go to https://improvmx.com
2. Click "Sign Up" (free tier is sufficient)
3. Create account with your email address
4. Verify your email address

### Step 2: Add Domain
1. Log into ImprovMX dashboard: https://app.improvmx.com
2. Click "+ Add Domain"
3. Enter: `pgclosets.com`
4. ImprovMX will automatically detect the MX records we configured
5. Click "Add Domain" to confirm

### Step 3: Configure Catch-All Forwarding
1. In the pgclosets.com domain settings
2. Click "Aliases" tab
3. Click "+ Add Alias"
4. Set up catch-all:
   - **Alias**: `*` (asterisk means catch-all)
   - **Forward to**: `spencer@peoplesgrp.com`
5. Click "Add Alias"

### Step 4: Verify Configuration
After adding the catch-all alias, the ImprovMX dashboard should show:
- ✅ Domain: pgclosets.com
- ✅ Status: Active
- ✅ Alias: `*@pgclosets.com` → `spencer@peoplesgrp.com`

---

## 🧪 Testing Instructions

Once ImprovMX is configured, test the forwarding:

### Test 1: Send to info@pgclosets.com
```bash
# From your personal email, send to: info@pgclosets.com
# Check that spencer@peoplesgrp.com receives it
```

### Test 2: Send to sales@pgclosets.com
```bash
# From your personal email, send to: sales@pgclosets.com
# Check that spencer@peoplesgrp.com receives it
```

### Test 3: Send to random@pgclosets.com
```bash
# From your personal email, send to: randomtestaddress@pgclosets.com
# Check that spencer@peoplesgrp.com receives it
```

### Test 4: Check Email Headers
When you receive the forwarded emails at spencer@peoplesgrp.com:
- Open email → View headers
- Verify `X-Forwarded-By: ImprovMX` is present
- Verify `From:` shows original sender
- Verify no other recipients received copies

---

## 📊 DNS Propagation Verification

Run these commands to verify DNS records are live:

```bash
# Check MX records
dig MX pgclosets.com +short

# Expected output:
# 10 mx1.improvmx.com.
# 20 mx2.improvmx.com.

# Check SPF record
dig TXT pgclosets.com +short

# Expected output:
# "v=spf1 include:spf.improvmx.com ~all"

# Check DMARC record
dig TXT _dmarc.pgclosets.com +short

# Expected output:
# "v=DMARC1; p=none; rua=mailto:spencer@peoplesgrp.com"
```

**DNS Propagation Time**: 5-15 minutes typically, up to 48 hours maximum

---

## 📋 Current Configuration Summary

### Before
- ❌ No email configured
- ❌ No MX records
- ❌ No SPF/DMARC records
- ❌ No mailboxes or forwarding

### After DNS Setup (COMPLETED)
- ✅ MX records pointing to ImprovMX
- ✅ SPF record authorizing ImprovMX
- ✅ DMARC record with reporting to spencer@peoplesgrp.com
- ⏳ ImprovMX account setup (requires manual step)

### After ImprovMX Setup (PENDING)
- ✅ Catch-all alias: `*@pgclosets.com` → `spencer@peoplesgrp.com`
- ✅ All email addresses forward to single destination
- ✅ No other mailboxes exist
- ✅ No other recipients configured

---

## 🔐 Security Considerations

### SPF (Sender Policy Framework)
- ✅ Configured to authorize ImprovMX servers
- ✅ Soft fail (~all) to prevent delivery issues during transition

### DMARC (Domain-based Message Authentication)
- ✅ Policy: `p=none` (monitor mode)
- ✅ Reports sent to: spencer@peoplesgrp.com
- 💡 **Recommendation**: After 30 days of monitoring, upgrade to `p=quarantine` or `p=reject`

### Email Forwarding Security
- ✅ ImprovMX uses TLS encryption
- ✅ SPF/DKIM preserved from original sender
- ✅ No email storage (immediate forwarding only)

---

## 📈 Monitoring & Maintenance

### DMARC Reports
- Check spencer@peoplesgrp.com for weekly DMARC reports
- Reports show email authentication success/failure rates
- Use to identify unauthorized use of pgclosets.com domain

### ImprovMX Dashboard
- Monitor forwarding logs: https://app.improvmx.com
- Free tier includes basic logs and statistics
- Check for delivery failures or bounces

### DNS Records
- MX, SPF, DMARC records are permanent
- No regular maintenance required unless changing email provider

---

## 🚨 Troubleshooting

### Emails Not Forwarding
1. Check ImprovMX dashboard for domain status
2. Verify catch-all alias is active: `*@pgclosets.com`
3. Check spam folder at spencer@peoplesgrp.com
4. Review ImprovMX logs for delivery errors

### DNS Not Resolving
```bash
# Flush local DNS cache (macOS)
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder

# Check propagation at multiple locations
dig MX pgclosets.com @8.8.8.8 +short  # Google DNS
dig MX pgclosets.com @1.1.1.1 +short  # Cloudflare DNS
```

### Delivery Failures
1. Check sender's SPF/DKIM alignment
2. Verify spencer@peoplesgrp.com mailbox isn't full
3. Check spencer@peoplesgrp.com spam filters
4. Review DMARC reports for authentication issues

---

## ✅ Deliverables Checklist

- [x] DNS records added to Vercel
  - [x] MX records (mx1.improvmx.com, mx2.improvmx.com)
  - [x] SPF record
  - [x] DMARC record
- [ ] ImprovMX account created
- [ ] Domain added to ImprovMX
- [ ] Catch-all alias configured (`*@pgclosets.com` → `spencer@peoplesgrp.com`)
- [ ] DNS propagation verified
- [ ] Test emails sent and received
- [ ] Email headers verified (no other recipients)
- [ ] Documentation completed

---

## 📞 Next Steps

1. **Create ImprovMX account** at https://improvmx.com (5 minutes)
2. **Add pgclosets.com domain** to ImprovMX dashboard
3. **Configure catch-all alias** as described above
4. **Wait 15 minutes** for DNS propagation
5. **Send test emails** to verify forwarding works
6. **Check email headers** to confirm only spencer@peoplesgrp.com receives mail

---

## 🔗 Useful Links

- ImprovMX Dashboard: https://app.improvmx.com
- ImprovMX Documentation: https://improvmx.com/guides/
- ImprovMX API Docs: https://improvmx.com/api/
- Vercel DNS Console: https://vercel.com/peoples-group/settings/domains/pgclosets.com
- DNS Propagation Checker: https://dnschecker.org

---

**Last Updated**: October 9, 2025
**Configured By**: Claude Code (Systems Engineer)
**Status**: DNS Complete ✅ | ImprovMX Setup Required ⏳
