# ClassOps

Goal: Configure and build a set of tools which enable instructors to manage advanced classroom infrastructure.
We will initially focus on continuous integration of workshop materials.

## Milestones

1. Enable CI for CSC 519 and CSC 510 workshops.

    * Connect workshops with CI (e.g., TravisCI)
    * Develop tests to check workshop code is working
    * Add Badges to show build and dependency status (DavidDM)
    * Integrate GreenKeeper.io to allow pull request notifications for updating course info.

2. DocBot prototype.

   * Tool that runs workshop instructions in a test vm and verifies correct state.
   * Uses language that can reference doc markdown.

3. Enable pipeline testing

   * Integration tests that run against jenkins servers and produce desired outcome.
   * Integrate commit fuzzer.
   
4. Solution support.

   * The initial focus will be on "sanity/smoke tests" checks and less on completeness.
     Long-term, it would be nice to have more complete "hidden" unit tests for running against student solutions.
