# Build, Package, Install

## Build and package

```bash
npm install
npm run build:splunk
npm run package:splunk
```

Output package:

- `build/<appId>.tar.gz` (default: `build/splunk_react_app.tar.gz`)

## Install in Splunk

1. Upload/install tarball in Splunk Apps UI.
2. Restart Splunk.
3. Launch app tile and verify route is `/app/<appId>/home`.
4. Verify React root renders on launcher host (no redirect shim).
5. If controller-native mode is requested, separately validate `/custom/<appId>/app_page` and record feasibility classification.

## Validation commands (server-side)

```bash
splunk cmd btool restmap list --debug | egrep "app_access|<appId>"
splunk cmd btool web list --debug | egrep "app_rest_proxy|apprestproxy|<appId>"
```
