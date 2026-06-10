# Branch rulesets

Wersjonowane zrodlo prawdy dla rulesetow GitHuba (Settings -> Rules -> Rulesets).
GitHub nie czyta tych plikow automatycznie - po zmianie zastosuj przez gh:

```bash
gh api repos/klaps-hq/klaps.space/rulesets/13250046 --method PUT --input .github/rulesets/main.json
gh api repos/klaps-hq/klaps.space/rulesets/13250532 --method PUT --input .github/rulesets/dev.json
```

| Plik        | Ruleset                   | ID       |
| ----------- | ------------------------- | -------- |
| `main.json` | main - PR required checks | 13250046 |
| `dev.json`  | dev - PR required checks  | 13250532 |