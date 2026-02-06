# Changelog

All notable changes to the NM-ZWDS project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added - February 2026
- **Feature Flags System** - Flexible, non-hierarchical access control
  - JSONB-based feature flags in database
  - Support for unlimited feature combinations
  - Program templates (DYD, Founder, Beta, Admin)
  - Admin UI for managing feature flags
- **Separate Admin Dashboard** - Clean separation of admin and user interfaces
  - New `/admin` route with admin-only features
  - User management link in navbar
  - Stats overview and quick actions
- **Beta/Experimental Tier** - New tier for beta testers
  - Access to all user features
  - Access to experimental features
  - No admin panel access
- **Founder Program Support** - Official Founder program tier
  - Includes DYD features + Founder Report + Destiny Navigator
  - Configurable via feature flags
- **Documentation**
  - Feature flags system documentation
  - Access control architecture documentation
  - AI agent implementation prompts (9 tasks)
  - Complete migration guide

### Changed - February 2026
- **Access Control** - Replaced tier-based hierarchy with feature flags
  - Old: `hasAnalyticsAccess` → New: `hasFullAnalysis`
  - Old: `hasDestinyNavigatorAccess` → New: `hasAIAssistant`
  - Old: `isAdmin` only → New: Specific admin feature flags
- **Dashboard** - Removed admin clutter from user dashboard
  - Admin features moved to separate `/admin` dashboard
  - Cleaner user experience
- **Founder Report** - Now accessible via feature flag instead of admin-only
- **Destiny Navigator** - Now accessible via feature flag instead of admin-only
- **Tier3** - Repurposed as "Beta" tier for experimental features

### Added - January 2026
- Comprehensive documentation in `/docs` folder
- Refactoring plans and architecture documentation
- Quick start guide for new developers
- Security audit documentation
- Production testing strategy
- Automated testing guide
- Deployment guide
- Implementation roadmap

### Changed - January 2026
- Reorganized project documentation
- Updated README with better structure

### Removed
- Moved CHART_ONLY_README.md to docs/api/

## [1.0.0] - 2025-01-XX

### Added
- Initial release
- ZWDS chart calculation engine
- Interactive chart visualization
- User authentication and profiles
- Multi-language support (English, Chinese)
- PDF export functionality
- Timing chart analysis (decade cycles)
- Career aptitude analysis
- Health analysis
- Personality analysis
- Life areas radar chart
- Four transformations analysis

### Features by Tier
- **Free**: Basic chart visualization, up to 3 profiles
- **Tier 2**: Full analysis, PDF export, unlimited profiles
- **Tier 3**: Admin features, user management, analytics

## Version History

### Development Phase (2024)
- Rapid development of core features
- Learning ZWDS concepts while building
- Focus on functionality over code organization
- Accumulated technical debt

### Stabilization Phase (2025)
- Production deployment
- Bug fixes and improvements
- User feedback incorporation
- Performance optimizations

### Refactoring Phase (2025-Present)
- Systematic code cleanup
- Documentation improvements
- Architecture improvements
- Dead code removal

## Future Releases

### [1.1.0] - Planned
- Mobile responsive improvements
- Performance optimizations
- Bug fixes
- UI/UX enhancements

### [2.0.0] - Planned
- Major refactoring complete
- Clean architecture
- Improved data management
- Content management system
- Additional languages (Japanese, Korean)

## Migration Guides

### Upgrading to 2.0.0
- Breaking changes will be documented here
- Migration scripts will be provided
- Backward compatibility notes

## Notes

- Dates use YYYY-MM-DD format
- All times are in UTC
- Version numbers follow SemVer

