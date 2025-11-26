# Known Issues

This document tracks known bugs, limitations, and technical debt in the NM-ZWDS project.

## Critical Issues

None currently.

## High Priority

### Code Organization
- **Issue**: Hardcoded strings scattered throughout codebase
- **Impact**: Difficult to translate, maintain, and update content
- **Status**: Refactoring planned
- **Workaround**: Manual search and replace
- **Related**: [Refactoring Overview](./refactoring/OVERVIEW.md)

### Dead Code
- **Issue**: Unused files still in codebase (analysis v1, old calculator)
- **Impact**: Confusion, larger bundle size, slower builds
- **Status**: Deletion planned
- **Workaround**: None needed (doesn't affect functionality)
- **Related**: [Dead Code List](./refactoring/DEAD_CODE.md)

## Medium Priority

### Confusing File Names
- **Issue**: Files like `destinyCompassAnalysis`, `fourKeyPalaceAnalysis` are unclear
- **Impact**: Hard to understand what code does
- **Status**: Renaming planned
- **Workaround**: Check documentation
- **Related**: [ZWDS Cleanup](./refactoring/ZWDS_CLEANUP.md)

### PDF Export Performance
- **Issue**: Large PDFs can take 10-15 seconds to generate
- **Impact**: User experience
- **Status**: Investigating optimization options
- **Workaround**: Show progress modal to user

### Mobile Responsiveness
- **Issue**: Some components not fully optimized for mobile
- **Impact**: User experience on small screens
- **Status**: Ongoing improvements
- **Workaround**: Use desktop for best experience

## Low Priority

### TypeScript Strictness
- **Issue**: Some files use `any` type
- **Impact**: Reduced type safety
- **Status**: Gradual improvement
- **Workaround**: None needed

### Test Coverage
- **Issue**: Limited test coverage (~30%)
- **Impact**: Risk of regressions
- **Status**: Gradually adding tests
- **Workaround**: Manual testing

### Bundle Size
- **Issue**: Bundle size is ~2MB (uncompressed)
- **Impact**: Slower initial load
- **Status**: Optimization planned
- **Workaround**: Good caching, CDN

## Technical Debt

### Architecture
- [ ] ZWDS module needs reorganization
- [ ] Components need better organization
- [ ] Pages need grouping by feature
- [ ] Dead code needs removal

### Data Management
- [ ] Hardcoded strings need extraction
- [ ] Translation system needs improvement
- [ ] Content management system needed

### Code Quality
- [ ] Some files are too large (>500 lines)
- [ ] Some functions are too complex
- [ ] Inconsistent naming conventions
- [ ] Missing JSDoc comments

### Testing
- [ ] Unit test coverage low
- [ ] Integration tests needed
- [ ] E2E tests needed
- [ ] Performance tests needed

## Browser Compatibility

### Supported Browsers
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Known Issues by Browser
- **Safari**: PDF export may be slower
- **Firefox**: Some animations may be less smooth
- **IE11**: Not supported (and never will be)

## Performance Issues

### Chart Calculation
- **Issue**: Complex charts can take 1-2 seconds to calculate
- **Impact**: User experience
- **Status**: Acceptable for now
- **Optimization**: Memoization, web workers (future)

### Large Profile Lists
- **Issue**: Rendering 100+ profiles can be slow
- **Impact**: Admin users only
- **Status**: Acceptable for now
- **Optimization**: Virtualization (future)

## Security Considerations

### Authentication
- ✅ Using Supabase Auth (secure)
- ✅ Row Level Security enabled
- ✅ API keys in environment variables

### Data Privacy
- ✅ User data encrypted at rest
- ✅ HTTPS enforced
- ✅ No sensitive data in logs

## Limitations

### ZWDS Calculation
- **Limitation**: Based on specific ZWDS school/interpretation
- **Impact**: Results may differ from other ZWDS systems
- **Status**: By design
- **Note**: This is expected and documented

### Birth Time Accuracy
- **Limitation**: Requires accurate birth time for correct results
- **Impact**: Inaccurate input = inaccurate output
- **Status**: User education needed
- **Note**: Common limitation of all ZWDS systems

### Language Support
- **Current**: English, Chinese (Traditional)
- **Requested**: Japanese, Korean, Chinese (Simplified)
- **Status**: Planned for future releases

## Reporting Issues

### How to Report
1. Check this document first
2. Search [GitHub Issues](https://github.com/your-username/nm-zwds/issues)
3. If not found, create a new issue with:
   - Clear description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Browser and OS version

### Issue Template
```markdown
**Description**
A clear description of the issue.

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What you expected to happen.

**Actual Behavior**
What actually happened.

**Screenshots**
If applicable, add screenshots.

**Environment**
- Browser: [e.g. Chrome 90]
- OS: [e.g. Windows 11]
- Version: [e.g. 1.0.0]
```

## Fixed Issues

Issues that have been resolved will be moved here with version number.

### [1.0.0]
- None yet (initial release)

## Related Documentation

- [Changelog](./CHANGELOG.md) - Version history
- [Refactoring Overview](./refactoring/OVERVIEW.md) - Planned improvements
- [Contributing Guide](./guides/CONTRIBUTING.md) - How to help fix issues

