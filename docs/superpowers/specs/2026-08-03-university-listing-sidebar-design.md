# University Listing Sidebar Design

## Goal

Upgrade the university listing to the same useful browsing pattern as the
reference page: a filter rail on the left, a dense result area on the right,
and a mobile filter drawer. The implementation keeps StudyHub's branding,
content, routes, and data sources instead of copying the reference site's
assets or identity.

## User Experience

- Desktop uses a two-column layout with a 260px filter rail and a flexible
  results column.
- The filter rail contains search, city, university type, degree, language,
  and maximum tuition controls.
- Filter state remains in the URL so results are shareable and browser back
  and forward work naturally.
- The results header shows the count and a sort selector for relevance, name,
  tuition, and ranking.
- University cards remain linked to their existing detail pages.
- Mobile collapses the rail into a filter button and an accessible drawer.
- A clear-all action removes all listing query parameters without affecting
  the locale route.

## Data Flow

The existing server page continues to parse `searchParams` and call the data
repository. `maxTuitionUSD` is already supported by both seed and PostgreSQL
repositories. Sorting is applied to the returned list in the page layer for
now, avoiding a repository contract change. Pagination is intentionally
deferred until the listing has a stable total-count contract.

## Components

- `UniversityFilters` becomes a responsive sidebar/drawer with grouped
  controls and URL updates.
- `universities/page.tsx` supplies the new labels, parses tuition and sort
  parameters, and renders the two-column result layout.
- Existing `UniversityCard` remains the content source and receives only the
  layout polish needed for the denser result grid.
- The loading state gets a sidebar-shaped skeleton so navigation does not
  shift the layout.

## Accessibility and States

- The mobile drawer uses the existing dialog primitives and supports escape,
  focus handling, and a visible close action.
- Every control has an accessible label and visible keyboard focus.
- Empty results keep the existing recovery message and clear-all action.
- Invalid tuition and sort query values fall back to the default state.

## Verification

- Unit tests cover query parsing and sort behavior where practical.
- Typecheck and the existing test suite must run.
- Browser verification checks desktop layout, a filtered URL, and mobile
  drawer open/close behavior.
