# Security Policy

## Supported Versions

Currently supported version of the Deadlock Detective project:

| Version | Supported          |
| ------- | ------------------ |
| 2.0.x   | :white_check_mark: |
| < 2.0   | :x:                |

## Reporting a Vulnerability

### Academic Project Context

This is an academic project developed for CSE 316 (Operating Systems) at Lovely Professional University. While we take security seriously, please note this is primarily an educational tool.

### How to Report

If you discover a security vulnerability, please:

1. **DO NOT** open a public GitHub issue
2. **Report privately** through one of these methods:
   - Open a security advisory on GitHub
   - Contact the project team directly through the repository

### What to Include

Please provide:

1. **Description** of the vulnerability
2. **Steps to reproduce** the issue
3. **Potential impact** assessment
4. **Suggested fix** (if you have one)

### Response Timeline

- **Acknowledgment:** Within 48 hours
- **Initial assessment:** Within 1 week
- **Fix timeline:** Depends on severity

## Security Considerations

### Client-Side Application

This is a **client-side web application** that:

- ✅ Runs entirely in the browser
- ✅ No server-side processing
- ✅ No user authentication required
- ✅ No sensitive data transmission
- ✅ Uses local storage only (optional)

### Data Privacy

- **No data collection:** We don't collect any user data
- **Local storage:** Browser localStorage is used optionally for saving configurations
- **No analytics:** No tracking or analytics are implemented
- **No cookies:** Application doesn't use cookies

### Dependencies

We regularly update dependencies to patch known vulnerabilities:

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

### Best Practices Followed

1. **Input Validation**
   - All user inputs are validated
   - Matrix values checked for valid ranges
   - JSON import validated against schema

2. **No Eval/Dangerous Code**
   - No use of `eval()` or `Function()` constructor
   - No dynamic code execution
   - Sanitized user inputs

3. **Dependency Management**
   - Use only well-maintained packages
   - Regular updates via `npm update`
   - Lock file committed (`package-lock.json`)

4. **XSS Prevention**
   - React's built-in XSS protection
   - No `dangerouslySetInnerHTML` used
   - User inputs sanitized

## Known Limitations

### Educational Scope

As an educational project:

- Not intended for production use
- No warranty or guarantee provided
- Focus is on learning, not enterprise security

### Browser Security

Relies on browser security features:

- Same-origin policy
- Content Security Policy (CSP)
- Secure browser environment

## Security Updates

Security updates will be:

1. Documented in `CHANGELOG.md` (if created)
2. Tagged with version number
3. Announced in repository

## Development Security

### For Contributors

When contributing:

- Don't commit secrets or API keys
- Use `.gitignore` for sensitive files
- Review dependencies before adding
- Follow secure coding practices

### Code Review

All code changes are reviewed for:

- Input validation
- Potential security issues
- Dependency vulnerabilities
- Secure coding practices

## Deployment Security

### Recommended Hosting

For deployment:

- Use HTTPS (SSL/TLS)
- Enable Content Security Policy headers
- Use secure hosting platforms (Vercel, Netlify, GitHub Pages)

### Environment Variables

No environment variables or secrets required for this application.

## Academic Integrity

### Project Context

This project is submitted for academic evaluation:

- Code should not be copied without attribution
- Follow university's academic integrity policies
- Maintain originality in submissions

## Contact

For security concerns:

- **Repository:** [GitHub Issues](https://github.com/SoumiryaSarangi/OS-CA-Automated-Deadlock-Detection-Tool/issues)
- **Team:** Soumirya Sarangi, Arkja, Karthiksai Kumaraguru

---

## Security Checklist

- [x] Input validation implemented
- [x] No dangerous functions (eval, etc.)
- [x] Dependencies regularly updated
- [x] XSS protection via React
- [x] No sensitive data collection
- [x] Local storage only (optional)
- [x] HTTPS recommended for deployment
- [x] Code review process in place

---

**Last Updated:** December 2025

*This security policy is maintained as part of the CSE 316 Operating Systems project at Lovely Professional University.*
