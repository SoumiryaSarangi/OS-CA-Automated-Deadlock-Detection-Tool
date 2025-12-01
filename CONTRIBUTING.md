# Contributing to Deadlock Detective

Thank you for your interest in contributing to the Deadlock Detective project! 

## Academic Project Notice

**Important:** This is an academic project developed for CSE 316 (Operating Systems) at Lovely Professional University, Term 25261. 

**Current Status:** This project is primarily for educational and evaluation purposes during the academic term.

## Project Team

- **Soumirya Sarangi** - Team Lead & Algorithm Implementation
- **Arkja** - UI/UX Development & Documentation
- **Karthiksai Kumaraguru** - Visualization & Testing

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:

1. **Clear title** describing the problem
2. **Steps to reproduce** the issue
3. **Expected behavior** vs actual behavior
4. **Screenshots** if applicable
5. **Environment details** (browser, OS, Node version)

### Suggesting Enhancements

We welcome suggestions! Please open an issue with:

1. **Clear description** of the enhancement
2. **Use case** - why would this be useful?
3. **Proposed implementation** (if you have ideas)

### Code Contributions

#### Setup Development Environment

```bash
# Clone the repository
git clone https://github.com/SoumiryaSarangi/OS-CA-Automated-Deadlock-Detection-Tool.git

# Navigate to directory
cd OS-CA-Automated-Deadlock-Detection-Tool

# Install dependencies
npm install

# Start development server
npm run dev
```

#### Making Changes

1. **Fork** the repository
2. **Create a branch** for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** following our coding standards
4. **Test thoroughly** - ensure all sample datasets work
5. **Commit** with clear messages:
   ```bash
   git commit -m "feat: add new feature description"
   ```
6. **Push** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Open a Pull Request** with detailed description

#### Commit Message Guidelines

Use conventional commit format:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

**Examples:**
```
feat: add dark mode toggle animation
fix: correct matrix validation logic
docs: update installation instructions
```

### Coding Standards

#### JavaScript Style

- Use ES6+ features
- Use `const` and `let`, avoid `var`
- Descriptive variable names (camelCase)
- Add comments for complex logic
- Keep functions small and focused

**Example:**
```javascript
// Good
const calculateAvailableResources = (total, allocated) => {
  return total - allocated;
};

// Avoid
var x = function(a,b) {
  return a-b;
};
```

#### React Components

- Use functional components with hooks
- Keep components focused (single responsibility)
- Use meaningful prop names
- Add PropTypes or comments for props

**Example:**
```jsx
// Good component structure
const DetectionButton = ({ onAnalyze, disabled }) => {
  return (
    <button 
      onClick={onAnalyze}
      disabled={disabled}
      className="analyze-button"
    >
      🔍 Analyze for Deadlock
    </button>
  );
};
```

#### CSS/Styling

- Use CSS custom properties for colors
- Mobile-first responsive design
- Consistent spacing (use rem/em)
- Clear class names (BEM methodology)

### Testing

Before submitting:

1. Test with all sample datasets
2. Test matrix editing functionality
3. Test theme switching
4. Test visualization rendering
5. Check responsive design on different screens
6. Verify JSON import/export works

### Documentation

If your change affects usage:

1. Update relevant `.md` files
2. Add examples if introducing new features
3. Update screenshots if UI changed
4. Update API documentation if adding functions

## Pull Request Process

1. **Ensure your PR:**
   - Has a clear title and description
   - References related issues (if any)
   - Includes screenshots for UI changes
   - Passes all tests
   - Follows coding standards

2. **PR will be reviewed by:**
   - Project team members
   - Changes may be requested

3. **Once approved:**
   - PR will be merged by maintainers
   - Your contribution will be acknowledged

## Questions?

- **GitHub Issues:** For bugs and features
- **Discussions:** For general questions

## Recognition

Contributors will be acknowledged in the project documentation and commit history.

---

## Code Review Checklist

Before submitting, ensure:

- [ ] Code follows project style guidelines
- [ ] Comments added for complex logic
- [ ] All tests pass
- [ ] Documentation updated if needed
- [ ] No console errors or warnings
- [ ] Responsive design maintained
- [ ] Accessibility considerations addressed
- [ ] Commit messages follow convention

---

**Thank you for contributing to Deadlock Detective!** 🎓🔍

*This project is developed as part of academic coursework and aims to help students understand operating system concepts.*
