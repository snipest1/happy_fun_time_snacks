# 🛡 verify-build.sh

A CLI tool for real devs and hackers. This script:

- Prompts for any string to verify (email, label, component name, etc.)
- Builds the `frontend/` folder
- Searches for that string in the compiled output
- Deploys to Netlify if it finds it
- Logs your checks in `.search-history.log`

## 🧪 Usage

```bash
./verify-deploy/verify-build.sh

