### Jenkins Unit Test

1. Given mock/test repo.
2. Git push triggers build job in jenkins.
3. Wait for jenkins to process payload.
4. Assert state.

### Fuzz with golden solution

1. Given mock/test repo.
2. Fuzz repo + commit trigger.
3. Wait for jenkins to process payload.
4. Compare state with known oracle (fail/pass)