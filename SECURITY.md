# Security Policy

## Supported Versions

At **Kevix (Arbuda Accessories)**, we take the security of our customers' data and our business operations extremely seriously. We actively support and provide security updates for the current major release of the platform.

| Component | Version | Supported          |
| :-------- | :------ | :----------------- |
| Storefront| 1.x.x   | :white_check_mark: |
| Admin     | 1.x.x   | :white_check_mark: |
| Backend   | 1.x.x   | :white_check_mark: |

*Note: Since Kevix is a privately operated, bespoke e-commerce platform, only the live production branch is actively maintained and patched for security.*

---

## 🛡️ Built-in Security Measures

Kevix employs multiple layers of defense to protect user data and maintain high availability:

1. **Authentication:** 
   - No passwords are stored; access is granted exclusively via secure, short-lived **Native Mobile OTPs** (powered by MSG91).
   - Sessions are managed using cryptographically signed **JSON Web Tokens (JWT)**.
2. **Database Protection:** 
   - Mongoose ODM enforces strict schema validation, entirely mitigating NoSQL Injection vectors.
3. **Network Security:** 
   - `helmet.js` is employed on the backend to enforce strict HTTP headers and mitigate Cross-Site Scripting (XSS) attacks.
   - `express-rate-limit` actively monitors IP requests to prevent brute-force attacks and DDoS attempts.
   - Strict `CORS` (Cross-Origin Resource Sharing) policies ensure the API only responds to authorized Kevix frontend clients.

---

## 🚨 Reporting a Vulnerability

If you are a security researcher or a user who has discovered a potential security vulnerability within the Kevix platform, please report it to us immediately. 

**Do NOT create a public GitHub issue.**

### How to Report
Please email the details of the vulnerability directly to the administrative team.

**Email:** `security@kevix.in` *(Replace with actual administrative email)*

### What to Include
When reporting, please include as much information as possible:
* A detailed description of the vulnerability.
* Step-by-step instructions to reproduce the issue.
* Any proof-of-concept (PoC) code or screenshots.
* The specific component affected (Storefront, Admin panel, or Backend API).

### Our Response Process
1. We will acknowledge receipt of your vulnerability report within **48 hours**.
2. Our technical team will investigate and verify the vulnerability.
3. If verified, we will develop and deploy a patch immediately.
4. We will notify you once the issue has been resolved.

We appreciate your efforts to responsibly disclose vulnerabilities and help keep the Kevix platform safe!
